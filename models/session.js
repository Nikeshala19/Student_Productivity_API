import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  durationMinutes: { type: Number },
  notes: { type: String },
  mood: {
    type: String,
    enum: ["focused", "distracted", "tired", "energized"]
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Session", sessionSchema);