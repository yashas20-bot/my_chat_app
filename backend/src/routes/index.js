import { Router } from "express";
import authRoutes from "./authRoutes.js";
import aiRoutes from "./aiRoutes.js";
import healthRoutes from "./healthRoutes.js";

const router = Router();

router.use("/", authRoutes);
router.use("/", aiRoutes);
router.use("/", healthRoutes);

export default router;
