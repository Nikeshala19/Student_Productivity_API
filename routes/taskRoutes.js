import express from "express";
import {
    createTask,
    getAllTasks,
    getTasksByGoal,
    updateTask,
    markTaskComplete,
    deleteTask
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/goal/:goalId", getTasksByGoal);
router.put("/:id", updateTask);
router.patch("/:id/complete", markTaskComplete);
router.delete("/:id", deleteTask);

export default router;