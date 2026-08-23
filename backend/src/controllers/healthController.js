import { apiSecret, apiKey } from "../config/stream.js";
import { geminiApiKey } from "../config/gemini.js";

/**
 * Health check & diagnostic status endpoint.
 * GET /health
 */
export const getHealth = (req, res) => {
  res.json({
    status: "ok",
    streamConfigured: Boolean(apiSecret),
    geminiConfigured: Boolean(geminiApiKey),
    streamApiKey: apiKey,
  });
};
