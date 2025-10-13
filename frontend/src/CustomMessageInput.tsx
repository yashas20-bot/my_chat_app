// src/CustomMessageInput.tsx
import React, { useState, useRef } from "react";
import { useChannelStateContext } from "stream-chat-react";
import { Mic } from "lucide-react";

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
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; // Fixed typo

    if (!SpeechRecognitionImpl) {
      alert("Speech recognition not supported in this browser.");
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
      
      if (hasAI) {
        await fetch("http://localhost:3000/ai-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            channelId: channel.id, 
            text: messageText 
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

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px',
      borderTop: '1px solid #e5e7eb',
      backgroundColor: 'white'
    }}>
      <textarea
        id="message-input"
        name="message"
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Type a message or use the mic..."
        rows={1}
        style={{
          flex: 1,
          resize: 'none',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          padding: '8px',
          fontSize: '14px',
          outline: 'none'
        }}
      />
      <button
        onClick={handleMicClick}
        title={isRecording ? "Stop recording" : "Start voice input"}
        style={{
          padding: '8px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isRecording ? '#ef4444' : '#e5e7eb',
          color: isRecording ? 'white' : '#374151',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s'
        }}
      >
        <Mic size={20} />
      </button>
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: text.trim() ? '#3b82f6' : '#d1d5db',
          color: 'white',
          cursor: text.trim() ? 'pointer' : 'not-allowed',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        }}
      >
        Send
      </button>
    </div>
  );
};

export default CustomMessageInput;