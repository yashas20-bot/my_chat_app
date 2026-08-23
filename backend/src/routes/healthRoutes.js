import { Router } from "express";
import { getHealth } from "../controllers/healthController.js";

const router = Router();

// GET /health
router.get("/health", getHealth);

export default router;
