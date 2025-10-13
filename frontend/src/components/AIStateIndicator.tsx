// src/components/AIStateIndicator.tsx
import React, { useEffect, useState } from "react";
import { useChannelStateContext } from "stream-chat-react";

const AIStateIndicator: React.FC = () => {
  const { channel } = useChannelStateContext();
  const [aiStatus, setAiStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!channel) return;

    const handleEvent = (event: any) => {
      if (event.type === "ai_status") {  // Changed from "ai.status" to "ai_status"
        setAiStatus(event.status); // e.g. "thinking" | "responding"
      }
    };

    channel.on(handleEvent);

    return () => {
      channel.off(handleEvent);
    };
  }, [channel]);

  if (!aiStatus) return null;

  return (
    <div className="p-1 text-sm text-gray-600 text-center">
      🤖 AI is {aiStatus}...
    </div>
  );
};

export default AIStateIndicator;