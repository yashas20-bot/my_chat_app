import { Router } from "express";
import {
  startAiAgent,
  stopAiAgent,
  handleAiReply,
} from "../controllers/aiController.js";

const router = Router();

// POST /start-ai-agent
router.post("/start-ai-agent", startAiAgent);

// POST /stop-ai-agent
router.post("/stop-ai-agent", stopAiAgent);

// POST /ai-reply
router.post("/ai-reply", handleAiReply);

export default router;
