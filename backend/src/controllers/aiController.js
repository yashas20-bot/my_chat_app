import { serverClient } from "../config/stream.js";
import { genAI, geminiApiKey } from "../config/gemini.js";

/**
 * Adds the 'ai-bot' member to the specified channel.
 * POST /start-ai-agent
 */
export const startAiAgent = async (req, res) => {
  const { channelId, channelType = "messaging" } = req.body;

  if (!channelId) {
    return res.status(400).json({ error: "Missing required field: channelId" });
  }

  if (!serverClient) {
    return res.status(500).json({
      error: "Stream server is not configured. Please set STREAM_API_SECRET in backend/.env",
    });
  }

  try {
    // Upsert AI Bot user
    await serverClient.upsertUser({
      id: "ai-bot",
      name: "AI Assistant",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=ai-bot",
      role: "admin",
    });

    const channel = serverClient.channel(channelType, channelId);
    await channel.addMembers(["ai-bot"], {
      text: "🤖 AI Assistant joined the conversation.",
      user_id: "ai-bot",
    });

    console.log(`🤖 Added ai-bot to channel: ${channelId}`);
    return res.json({ success: true, message: "AI bot added to channel" });
  } catch (error) {
    console.error("Error adding AI agent to channel:", error);
    return res.status(500).json({ error: error.message || "Failed to add AI agent" });
  }
};

/**
 * Removes the 'ai-bot' member from the specified channel.
 * POST /stop-ai-agent
 */
export const stopAiAgent = async (req, res) => {
  const { channelId, channelType = "messaging" } = req.body;

  if (!channelId) {
    return res.status(400).json({ error: "Missing required field: channelId" });
  }

  if (!serverClient) {
    return res.status(500).json({
      error: "Stream server is not configured. Please set STREAM_API_SECRET in backend/.env",
    });
  }

  try {
    const channel = serverClient.channel(channelType, channelId);
    await channel.removeMembers(["ai-bot"], {
      text: "🤖 AI Assistant has left the conversation.",
      user_id: "ai-bot",
    });

    console.log(`👋 Removed ai-bot from channel: ${channelId}`);
    return res.json({ success: true, message: "AI bot removed from channel" });
  } catch (error) {
    console.error("Error removing AI agent from channel:", error);
    return res.status(500).json({ error: error.message || "Failed to remove AI agent" });
  }
};

/**
 * Generates an AI response and posts it to the channel as 'ai-bot'.
 * POST /ai-reply
 */
export const handleAiReply = async (req, res) => {
  const { channelId, text, channelType = "messaging" } = req.body;

  if (!channelId || !text) {
    return res.status(400).json({ error: "Missing required fields: channelId and text" });
  }

  if (!serverClient) {
    return res.status(500).json({
      error: "Stream server is not configured. Please set STREAM_API_SECRET in backend/.env",
    });
  }

  const channel = serverClient.channel(channelType, channelId);

  try {
    // 1. Emit 'thinking' status event
    await channel.sendEvent({
      type: "ai_status",
      status: "thinking",
      user_id: "ai-bot",
    });

    // 2. Generate response via LLM
    let replyText = "";
    if (geminiApiKey && genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
        const result = await model.generateContent(
          `You are a helpful, conversational AI assistant inside a chat channel. Respond clearly and concisely to the following message:\n\nUser: "${text}"`
        );
        replyText = result.response.text() || "I processed your request, but received an empty response.";
      } catch (aiErr) {
        console.error("Gemini Generation Error:", aiErr);
        replyText = `⚠️ AI Error: ${aiErr.message || "Unable to reach LLM service."}`;
      }
    } else {
      replyText = `🤖 [AI Assistant]: I received: "${text}". (To enable live LLM responses, set GEMINI_API_KEY in backend/.env!)`;
    }

    // 3. Emit 'responding' status event
    await channel.sendEvent({
      type: "ai_status",
      status: "responding",
      user_id: "ai-bot",
    });

    // 4. Send the message as 'ai-bot'
    await channel.sendMessage({
      text: replyText,
      user_id: "ai-bot",
    });

    // 5. Clear the status event
    await channel.sendEvent({
      type: "ai_status",
      status: null,
      user_id: "ai-bot",
    });

    return res.json({ success: true, reply: replyText });
  } catch (error) {
    console.error("Error processing AI reply:", error);

    // Clear event on failure
    try {
      await channel.sendEvent({
        type: "ai_status",
        status: null,
        user_id: "ai-bot",
      });
    } catch (_) {}

    return res.status(500).json({ error: error.message || "Failed to process AI reply" });
  }
};
