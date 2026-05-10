import Goal from "../models/goal.js";

// Create a new goal
export const createGoal = async (req, res) => {
    try {
        const goalData = new Goal(req.body);
        const { title, deadline } = goalData;

        const goalExist = await Goal.findOne({ title, deadline });
        if (goalExist) {
            return res.status(400).json({ message: "Goal already exists." });
        }

        const savedGoal = await goalData.save();
        res.status(200).json(savedGoal);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Get all goals
export const getAllGoals = async (req, res) => {
    try {
        const goals = await Goal.find();
        if (goals.length === 0) {
            return res.status(404).json({ message: "No goals found." });
        }
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Get a single goal by ID
export const getGoalById = async (req, res) => {
    try {
        const id = req.params.id;
        const goal = await Goal.findById(id);
        if (!goal) {
            return res.status(404).json({ message: "Goal not found." });
        }
        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Update a goal
export const updateGoal = async (req, res) => {
    try {
        const id = req.params.id;
        const goalExist = await Goal.findById(id);
        if (!goalExist) {
            return res.status(404).json({ message: "Goal not found." });
        }
        const updatedGoal = await Goal.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
    try {
        const id = req.params.id;
        const goalExist = await Goal.findById(id);
        if (!goalExist) {
            return res.status(404).json({ message: "Goal not found." });
        }
        await Goal.findByIdAndDelete(id);
        res.status(200).json({ message: "Goal deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};