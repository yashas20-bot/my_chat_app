import { Router } from "express";
import { generateToken } from "../controllers/authController.js";

const router = Router();

// GET /token?user_id=...
router.get("/token", generateToken);

export default router;
