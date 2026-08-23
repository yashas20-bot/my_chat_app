import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY || "prwvgyhbsutz";
const apiSecret = process.env.STREAM_API_SECRET;

let serverClient = null;

if (apiSecret) {
  serverClient = StreamChat.getInstance(apiKey, apiSecret);
  console.log("✅ Stream Server Client initialized with API Secret.");
} else {
  console.warn(
    "⚠️ STREAM_API_SECRET is not set in backend/.env. Please add it to enable token generation and AI bot participation."
  );
}

export { serverClient, apiKey, apiSecret };
