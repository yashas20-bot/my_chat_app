// src/components/AIStateIndicator.tsx
import React, { useEffect, useState } from "react";
import { useChannelStateContext } from "stream-chat-react";
import { Sparkles } from "lucide-react";

const AIStateIndicator: React.FC = () => {
  const { channel } = useChannelStateContext();
  const [aiStatus, setAiStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!channel) return;

    const handleEvent = (event: any) => {
      if (event.type === "ai_status" || (event.type === "custom" && event.custom_type === "ai_status")) {
        setAiStatus(event.status || null);
      }
    };

    channel.on(handleEvent);

    return () => {
      channel.off(handleEvent);
    };
  }, [channel]);

  if (!aiStatus) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "9px 16px",
        fontSize: "13.5px",
        fontWeight: "600",
        color: "#ffffff",
        background: "linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
        backgroundSize: "200% auto",
        animation: "shimmer 3s linear infinite",
        boxShadow: "0 4px 15px rgba(168, 85, 247, 0.35)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        transition: "all 0.3s ease",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
        }}
      >
        <Sparkles size={14} color="#ffffff" />
      </span>

      <span>
        AI Assistant is <span style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>{aiStatus}</span>
      </span>

      <span style={{ display: "inline-flex", gap: "3px", marginLeft: "4px" }}>
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "white",
            animation: "recordingWave 1s infinite",
          }}
        />
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "white",
            animation: "recordingWave 1s infinite 0.2s",
          }}
        />
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "white",
            animation: "recordingWave 1s infinite 0.4s",
          }}
        />
      </span>
    </div>
  );
};

export default AIStateIndicator;