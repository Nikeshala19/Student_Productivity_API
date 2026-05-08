import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["exam", "project", "habit", "daily", "weekly", "monthly"],
    required: true
  },
  description: { type: String },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ["active", "completed", "paused"],
    default: "active"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Goal", goalSchema);