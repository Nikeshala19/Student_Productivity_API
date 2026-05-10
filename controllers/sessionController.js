import Session from "../models/session.js";

// Create a new session
export const createSession = async (req, res) => {
    try {
        const sessionData = new Session(req.body);
        const savedSession = await sessionData.save();
        res.status(200).json(savedSession);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Get all sessions
export const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find();
        if (sessions.length === 0) {
            return res.status(404).json({ message: "No sessions found." });
        }
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Get sessions by Goal ID
export const getSessionsByGoal = async (req, res) => {
    try {
        const goalId = req.params.goalId;
        const sessions = await Session.find({ goalId });
        if (sessions.length === 0) {
            return res.status(404).json({ message: "No sessions found for this goal." });
        }
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Update a session
export const updateSession = async (req, res) => {
    try {
        const id = req.params.id;
        const sessionExist = await Session.findById(id);
        if (!sessionExist) {
            return res.status(404).json({ message: "Session not found." });
        }
        const updatedSession = await Session.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedSession);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Delete a session
export const deleteSession = async (req, res) => {
    try {
        const id = req.params.id;
        const sessionExist = await Session.findById(id);
        if (!sessionExist) {
            return res.status(404).json({ message: "Session not found." });
        }
        await Session.findByIdAndDelete(id);
        res.status(200).json({ message: "Session deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};