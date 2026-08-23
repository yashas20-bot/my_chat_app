// src/App.tsx
import React from "react";
import { Chat, Channel, MessageList } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import "./App.css";

import { useCreateChatClient } from "./hooks/useCreateChatClient";
import CustomMessageInput from "./CustomMessageInput";
import CustomChannelHeader from "./components/CustomChannelHeader";
import AIStateIndicator from "./components/AIStateIndicator";
import { MessageCircle, AlertCircle, RefreshCw } from "lucide-react";

const App: React.FC = () => {
  const { chatClient, channel, loading, error } = useCreateChatClient();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)",
          color: "#ffffff",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #6366f1 0%, #d946ef 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 35px rgba(168, 85, 247, 0.6)",
            animation: "pulseGlow 2s infinite ease-in-out",
          }}
        >
          <MessageCircle size={32} color="white" />
        </div>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: "22px", letterSpacing: "-0.02em" }}>
          Connecting to Stream AI Chat...
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#a5b4fc", opacity: 0.9 }}>
          Establishing real-time connection with AI agent...
        </p>
      </div>
    );
  }

  if (error || !chatClient || !channel) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            background: "rgba(255, 255, 255, 0.98)",
            padding: "36px 32px",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
              color: "#ef4444",
            }}
          >
            <AlertCircle size={30} />
          </div>

          <h2 style={{ margin: "0 0 8px 0", color: "#0f172a", fontSize: "22px", fontWeight: 800 }}>
            Connection Failed
          </h2>
          <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>
            {error || "Could not establish connection to the chat service."}
          </p>

          <button
            onClick={() => window.location.reload()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "14px",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
            }}
          >
            <RefreshCw size={16} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-app-wrapper">
      <Chat client={chatClient} theme="messaging light">
        <Channel channel={channel}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
            }}
          >
            <CustomChannelHeader />
            <AIStateIndicator />
            <div style={{ flex: 1, overflow: "auto" }}>
              <MessageList />
            </div>
            <CustomMessageInput />
          </div>
        </Channel>
      </Chat>
    </div>
  );
};

export default App;