// src/components/CustomChannelHeader.tsx
import React, { useEffect, useState } from "react";
import { useChannelStateContext } from "stream-chat-react";
import { Sparkles, Bot, Users } from "lucide-react";

const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

const CustomChannelHeader: React.FC = () => {
  const { channel } = useChannelStateContext();
  const [aiActive, setAiActive] = useState<boolean>(false);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  useEffect(() => {
    if (channel?.state?.members) {
      const isMember = Boolean(channel.state.members["ai-bot"]);
      setAiActive(isMember);
    }
  }, [channel?.state?.members]);

  const toggleAI = async () => {
    if (!channel?.id || isToggling) return;

    try {
      setIsToggling(true);
      const endpoint = aiActive ? "stop-ai-agent" : "start-ai-agent";

      const res = await fetch(`${backendUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: channel.id }),
      });

      if (res.ok) {
        setAiActive(!aiActive);
      } else {
        const data = await res.json().catch(() => ({}));
        console.error("Failed to toggle AI:", data.error || res.statusText);
      }
    } catch (err) {
      console.error("Error toggling AI agent:", err);
    } finally {
      setIsToggling(false);
    }
  };

  const memberCount = Object.keys(channel.state.members || {}).length;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        background: "linear-gradient(135deg, #ffffff 0%, #fdf2f8 50%, #f5f3ff 100%)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: "0 4px 20px -5px rgba(99, 102, 241, 0.08)",
      }}
    >
      {/* Channel Title & Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: "0 8px 16px -4px rgba(99, 102, 241, 0.4)",
          }}
        >
          <Sparkles size={24} />
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2
              style={{
                fontWeight: "800",
                fontSize: "19px",
                letterSpacing: "-0.02em",
                background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
              }}
            >
              {(channel.data as any)?.name || "General Chat"}
            </h2>

            {aiActive && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "2px 8px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(236, 72, 153, 0.4)",
                  animation: "floatBadge 3s ease-in-out infinite",
                }}
              >
                <Bot size={12} /> AI LIVE
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "3px",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Users size={13} color="#6366f1" />
              <strong>{memberCount}</strong> {memberCount === 1 ? "member" : "members"}
            </span>

            <span>•</span>

            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  boxShadow: "0 0 6px #10b981",
                  display: "inline-block",
                }}
              />
              <span style={{ color: "#059669", fontWeight: 600 }}>Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* AI Bot Toggle Action */}
      <button
        onClick={toggleAI}
        disabled={isToggling}
        style={{
          padding: "10px 20px",
          borderRadius: "12px",
          border: "none",
          background: aiActive
            ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
            : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
          color: "white",
          cursor: isToggling ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: "700",
          letterSpacing: "-0.01em",
          boxShadow: aiActive
            ? "0 6px 18px rgba(239, 68, 68, 0.35)"
            : "0 6px 20px rgba(99, 102, 241, 0.4)",
          opacity: isToggling ? 0.7 : 1,
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => {
          if (!isToggling) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = aiActive
              ? "0 8px 24px rgba(239, 68, 68, 0.5)"
              : "0 8px 26px rgba(168, 85, 247, 0.55)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = aiActive
            ? "0 6px 18px rgba(239, 68, 68, 0.35)"
            : "0 6px 20px rgba(99, 102, 241, 0.4)";
        }}
      >
        <Bot size={17} />
        <span>{aiActive ? "Remove AI Bot" : "✨ Summon AI Assistant"}</span>
      </button>
    </div>
  );
};

export default CustomChannelHeader;