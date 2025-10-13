// src/components/CustomChannelHeader.tsx
import React, { useState } from "react";
import { useChannelStateContext } from "stream-chat-react";

const backendUrl = "http://localhost:3000";

const CustomChannelHeader: React.FC = () => {
  const { channel } = useChannelStateContext();
  const [aiActive, setAiActive] = useState(false);

  const toggleAI = async () => {
    try {
      if (!channel?.id) {
        console.error("Channel ID not available.");
        return;
      }

      const endpoint = aiActive ? "stop-ai-agent" : "start-ai-agent";

      await fetch(`${backendUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: channel.id }),
      });

      setAiActive(!aiActive);
    } catch (err) {
      console.error("Error toggling AI agent:", err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: 'white'
    }}>
      <h2 style={{ 
        fontWeight: 'bold', 
        fontSize: '18px',
        margin: 0 
      }}>
        {(channel.data as any)?.name || "General Chat"}
      </h2>
      <button
        onClick={toggleAI}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: aiActive ? '#ef4444' : '#22c55e',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = aiActive ? '#dc2626' : '#16a34a';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = aiActive ? '#ef4444' : '#22c55e';
        }}
      >
        {aiActive ? "Stop AI" : "Add AI"}
      </button>
    </div>
  );
};

export default CustomChannelHeader;