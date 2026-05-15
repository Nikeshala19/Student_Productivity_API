import { useEffect, useState } from "react";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../services/api";

const emptyForm = {
  title: "",
  type: "exam",
  description: "",
  deadline: "",
  priority: "medium",
  status: "active",
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchGoals = () => {
    getGoals()
      .then((res) => setGoals(res.data))
      .catch(() => setGoals([]));
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.deadline) {
      alert("Title and Deadline are required!");
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await updateGoal(editId, form);
      } else {
        await createGoal(form);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchGoals();
    } catch {
      alert("Something went wrong!");
    }
    setLoading(false);
  };

  const handleEdit = (goal) => {
    setForm({
      title: goal.title,
      type: goal.type,
      description: goal.description || "",
      deadline: goal.deadline?.slice(0, 10),
      priority: goal.priority,
      status: goal.status,
    });
    setEditId(goal._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    await deleteGoal(id);
    fetchGoals();
  };

  const typeColor = (type) => {
    if (type === "exam") return "bg-red-900 text-red-300";
    if (type === "project") return "bg-blue-900 text-blue-300";
    if (type === "habit") return "bg-purple-900 text-purple-300";
    if (type === "daily") return "bg-green-900 text-green-300";
    if (type === "weekly") return "bg-yellow-900 text-yellow-300";
    return "bg-pink-900 text-pink-300";
  };

  const priorityColor = (p) => {
    if (p === "high") return "bg-red-900 text-red-300";
    if (p === "medium") return "bg-yellow-900 text-yellow-300";
    return "bg-gray-700 text-gray-300";
  };

  const statusColor = (s) => {
    if (s === "active") return "text-green-400";
    if (s === "completed") return "text-blue-400";
    return "text-yellow-400";
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">🎯 Goals</h1>
          <p className="text-gray-400 mt-1">Manage your goals and targets</p>
        </div>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditId(null);
            setShowForm(!showForm);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          {showForm ? "✕ Cancel" : "+ New Goal"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editId ? "✏️ Edit Goal" : "➕ Create New Goal"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Title *</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Final Exam Preparation"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Type *</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="exam">Exam</option>
                <option value="project">Project</option>
                <option value="habit">Habit</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Deadline *</label>
              <input
                type="date"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Priority</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Status</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Description</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                placeholder="Optional description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "Saving..." : editId ? "Update Goal" : "Create Goal"}
          </button>
        </div>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-gray-400">No goals yet. Create your first goal!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <div
              key={goal._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-700 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColor(goal.type)}`}>
                  {goal.type}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${priorityColor(goal.priority)}`}>
                  {goal.priority}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg">{goal.title}</h3>
              {goal.description && (
                <p className="text-gray-500 text-sm mt-1">{goal.description}</p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <p className="text-gray-500 text-xs">
                  📅 {new Date(goal.deadline).toLocaleDateString()}
                </p>
                <span className={`text-xs font-medium ${statusColor(goal.status)}`}>
                  ● {goal.status}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(goal)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm py-1.5 rounded-lg transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(goal._id)}
                  className="flex-1 bg-red-900 hover:bg-red-800 text-red-300 text-sm py-1.5 rounded-lg transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}