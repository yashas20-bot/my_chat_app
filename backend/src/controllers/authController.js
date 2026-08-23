import { serverClient } from "../config/stream.js";

/**
 * Generates a Stream user token and upserts the user profile.
 * GET /token?user_id=...&user_name=...
 */
export const generateToken = async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: "Missing required query parameter: user_id" });
  }

  if (!serverClient) {
    return res.status(500).json({
      error: "Stream server is not configured. Please set STREAM_API_SECRET in backend/.env",
    });
  }

  try {
    const token = serverClient.createToken(userId);
    const userName = req.query.user_name || userId;

    await serverClient.upsertUser({
      id: userId,
      name: userName,
      role: "user",
    });

    return res.json({ token, userId });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ error: error.message || "Failed to generate token" });
  }
};
