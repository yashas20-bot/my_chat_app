// src/hooks/useCreateChatClient.ts
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

const apiKey = "m88xkkqbj5dg"; // Stream App Key
const userId = "yashas";
const userName = "Yashas";
const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

export const useCreateChatClient = () => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let client: StreamChat | null = null;

    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch token from backend
        const res = await fetch(`${backendUrl}/token?user_id=${userId}&user_name=${encodeURIComponent(userName)}`);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Backend server responded with status: ${res.status}`);
        }

        const data = await res.json();

        // 2. Initialize Stream client
        client = StreamChat.getInstance(apiKey);

        // 3. Connect user with token
        await client.connectUser(
          {
            id: userId,
            name: userName,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
          },
          data.token
        );

        // 4. Create and watch channel
        const chan = client.channel("messaging", "general", {
          name: "General Chat",
        } as any);

        await chan.watch();

        setChatClient(client);
        setChannel(chan);
      } catch (err: any) {
        console.error("Error connecting to Stream:", err);
        setError(err.message || "Failed to connect to chat service.");
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, []);

  return { chatClient, channel, loading, error };
};