import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", required: true },
  title: { type: String, required: true },
  module: { type: String },
  estimatedMinutes: { type: Number },
  actualMinutes: { type: Number, default: 0 },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Task", taskSchema);