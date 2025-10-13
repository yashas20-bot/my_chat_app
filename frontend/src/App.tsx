// src/App.tsx
import React from "react";
import {
  Chat,
  Channel,
  MessageList,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { useCreateChatClient } from "./hooks/useCreateChatClient"; 
import CustomMessageInput from "./CustomMessageInput"; 
import CustomChannelHeader from "./components/CustomChannelHeader";
import AIStateIndicator from "./components/AIStateIndicator"; 

const App: React.FC = () => {
  const { chatClient, channel, loading } = useCreateChatClient();

  if (loading) return <div>Loading chat...</div>;
  if (!chatClient || !channel) return <div>Failed to connect</div>;

  return (
    <Chat client={chatClient} theme="messaging light">
      <Channel channel={channel}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh',
          width: '100%'
        }}>
          <CustomChannelHeader /> 
          <AIStateIndicator />
          <div style={{ flex: 1, overflow: 'auto' }}>
            <MessageList />
          </div>
          <CustomMessageInput />
        </div>
      </Channel>
    </Chat>
  );
};

export default App;