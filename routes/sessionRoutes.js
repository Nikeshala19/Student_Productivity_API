import express from "express";
import {
    createSession,
    getAllSessions,
    getSessionsByGoal,
    updateSession,
    deleteSession
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", createSession);
router.get("/", getAllSessions);
router.get("/goal/:goalId", getSessionsByGoal);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

export default router;