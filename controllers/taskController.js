import Task from "../models/task.js";

// Create a new task
export const createTask = async (req, res) => {
    try {
        const taskData = new Task(req.body);
        const savedTask = await taskData.save();
        res.status(200).json(savedTask);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found." });
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Get tasks by Goal ID
export const getTasksByGoal = async (req, res) => {
    try {
        const goalId = req.params.goalId;
        const tasks = await Task.find({ goalId });
        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this goal." });
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const taskExist = await Task.findById(id);
        if (!taskExist) {
            return res.status(404).json({ message: "Task not found." });
        }
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Mark task as complete
export const markTaskComplete = async (req, res) => {
    try {
        const id = req.params.id;
        const taskExist = await Task.findById(id);
        if (!taskExist) {
            return res.status(404).json({ message: "Task not found." });
        }
        const completedTask = await Task.findByIdAndUpdate(
            id,
            { completed: true, completedAt: new Date() },
            { new: true }
        );
        res.status(200).json({ message: "Task marked as complete.", task: completedTask });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        const taskExist = await Task.findById(id);
        if (!taskExist) {
            return res.status(404).json({ message: "Task not found." });
        }
        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};