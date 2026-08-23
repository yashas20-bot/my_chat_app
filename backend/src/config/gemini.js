import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (geminiApiKey) {
  genAI = new GoogleGenerativeAI(geminiApiKey);
  console.log("✅ Gemini AI Client initialized.");
} else {
  console.warn(
    "ℹ️ GEMINI_API_KEY is not set in backend/.env. Using mock fallback responses for AI bot."
  );
}

export { genAI, geminiApiKey };
