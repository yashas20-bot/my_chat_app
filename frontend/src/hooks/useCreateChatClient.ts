// src/hooks/useCreateChatClient.ts
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

const apiKey = "prwvgyhbsutz";      // Your Stream API key
const userId = "yashas";            // Your unique user ID
const userName = "Yashas";
const backendUrl = "http://localhost:3000"; // Backend server URL

export const useCreateChatClient = () => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let client: StreamChat | null = null;

    const init = async () => {
      try {
        // 1. Get token from backend
        const res = await fetch(`${backendUrl}/token?user_id=${userId}`);
        
        if (!res.ok) {
            throw new Error(`Backend token request failed with status: ${res.status}`);
        }
        
        const data = await res.json();

        // 2. Init Stream client
        client = StreamChat.getInstance(apiKey);

        // 3. Connect user
        await client.connectUser(
          { id: userId, name: userName },
          data.token
        );

        // 4. Create / watch channel
        const chan = client.channel("messaging", "general", {
          name: "General Chat",
        } as any); 
        
        await chan.watch();

        setChatClient(client);
        setChannel(chan);
      } catch (err) {
        console.error("Error connecting to Stream:", err);
      } finally {
        setLoading(false);
      }
    };

    // 🚀 FIX: Call the async function immediately to start the connection
    init();

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, []); // Run only once on component mount

  return { chatClient, channel, loading };
};