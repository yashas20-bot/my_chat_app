// src/CustomMessageInput.tsx
import React, { useState, useRef } from "react";
import { useChannelStateContext } from "stream-chat-react";
import { Mic, MicOff, Send } from "lucide-react";

type SpeechRecognition = any;
type SpeechRecognitionEvent = any;

const CustomMessageInput: React.FC = () => {
  const { channel } = useChannelStateContext();

  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const startRecording = () => {
    const SpeechRecognitionImpl =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionImpl) {
      alert("Speech recognition is not supported in this browser. Please try Chrome/Edge.");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognitionImpl();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setText(transcript);
    };

    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const handleMicClick = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleSend = async () => {
    const messageText = text.trim();

    if (!messageText || !channel) return;

    try {
      await channel.sendMessage({ text: messageText });
      setText("");

      const members = Object.keys(channel.state.members);
      const hasAI = members.includes("ai-bot");

      const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";
      if (hasAI) {
        await fetch(`${backendUrl}/ai-reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channelId: channel.id,
            text: messageText,
          }),
        });
      }

      textareaRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const hasText = Boolean(text.trim());

  return (
    <div
      style={{
        padding: "16px 24px 20px 24px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, #ffffff 100%)",
        borderTop: "1px solid rgba(226, 232, 240, 0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "#f8fafc",
          border: "1.5px solid #e2e8f0",
          borderRadius: "18px",
          padding: "8px 12px 8px 16px",
          boxShadow: "0 4px 16px -2px rgba(99, 102, 241, 0.08)",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <textarea
          id="message-input"
          name="message"
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Type a message or use voice input..."
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            border: "none",
            backgroundColor: "transparent",
            padding: "8px 0",
            fontSize: "14.5px",
            fontFamily: "inherit",
            color: "#1e293b",
            outline: "none",
            maxHeight: "120px",
            lineHeight: "1.4",
          }}
        />

        {/* Voice Input Button */}
        <button
          onClick={handleMicClick}
          type="button"
          title={isRecording ? "Listening... Click to stop" : "Start voice input"}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            border: "none",
            background: isRecording
              ? "linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)"
              : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
            color: isRecording ? "#ffffff" : "#64748b",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isRecording
              ? "0 0 16px rgba(239, 68, 68, 0.6)"
              : "none",
            animation: isRecording ? "recordingWave 1.4s infinite" : "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!isRecording) {
              e.currentTarget.style.color = "#6366f1";
              e.currentTarget.style.backgroundColor = "#e0e7ff";
            }
          }}
          onMouseLeave={(e) => {
            if (!isRecording) {
              e.currentTarget.style.color = "#64748b";
            }
          }}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Send Message Button */}
        <button
          onClick={handleSend}
          disabled={!hasText}
          type="button"
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "none",
            background: hasText
              ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)"
              : "#e2e8f0",
            color: hasText ? "#ffffff" : "#94a3b8",
            cursor: hasText ? "pointer" : "not-allowed",
            fontSize: "14px",
            fontWeight: "700",
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            boxShadow: hasText
              ? "0 4px 16px rgba(99, 102, 241, 0.4)"
              : "none",
            transform: hasText ? "scale(1)" : "scale(0.98)",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            if (hasText) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(168, 85, 247, 0.55)";
            }
          }}
          onMouseLeave={(e) => {
            if (hasText) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(99, 102, 241, 0.4)";
            }
          }}
        >
          <span>Send</span>
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};

export default CustomMessageInput;