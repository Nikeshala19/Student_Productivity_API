import { useEffect, useState } from "react";
import {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
} from "../services/api";
import { getGoals } from "../services/api";
import { getTasks } from "../services/api";

const emptyForm = {
  goalId: "",
  taskId: "",
  startTime: "",
  endTime: "",
  durationMinutes: "",
  mood: "focused",
  notes: "",
};

const moodEmoji = {
  focused: "🎯",
  energized: "⚡",
  distracted: "😵",
  tired: "😴",
};

const moodColor = {
  focused: "bg-blue-900 text-blue-300",
  energized: "bg-green-900 text-green-300",
  distracted: "bg-orange-900 text-orange-300",
  tired: "bg-purple-900 text-purple-300",
};

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterGoal, setFilterGoal] = useState("all");

  const fetchSessions = () => {
    getSessions()
      .then((res) => setSessions(res.data))
      .catch(() => setSessions([]));
  };

  useEffect(() => {
    fetchSessions();
    getGoals()
      .then((res) => setGoals(res.data))
      .catch(() => setGoals([]));
    getTasks()
      .then((res) => setTasks(res.data))
      .catch(() => setTasks([]));
  }, []);

  // Auto-calculate duration when start/end time change
  const handleTimeChange = (field, value) => {
    const updated = { ...form, [field]: value };
    if (updated.startTime && updated.endTime) {
      const start = new Date(updated.startTime);
      const end = new Date(updated.endTime);
      const diff = Math.round((end - start) / 60000);
      if (diff > 0) updated.durationMinutes = diff;
    }
    setForm(updated);
  };

  const handleSubmit = async () => {
    if (!form.goalId || !form.taskId || !form.startTime) {
      alert("Goal, Task, and Start Time are required!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
        endTime: form.endTime || undefined,
      };
      if (editId) {
        await updateSession(editId, payload);
      } else {
        await createSession(payload);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchSessions();
    } catch {
      alert("Something went wrong!");
    }
    setLoading(false);
  };

  const handleEdit = (session) => {
    setForm({
      goalId: session.goalId || "",
      taskId: session.taskId || "",
      startTime: session.startTime?.slice(0, 16) || "",
      endTime: session.endTime?.slice(0, 16) || "",
      durationMinutes: session.durationMinutes || "",
      mood: session.mood || "focused",
      notes: session.notes || "",
    });
    setEditId(session._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this session?")) return;
    await deleteSession(id);
    fetchSessions();
  };

  const goalTitle = (goalId) => {
    const goal = goals.find((g) => g._id === goalId);
    return goal ? goal.title : "Unknown Goal";
  };

  const taskTitle = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    return task ? task.title : "Unknown Task";
  };

  const filteredSessions =
    filterGoal === "all"
      ? sessions
      : sessions.filter((s) => s.goalId === filterGoal);

  const totalMinutes = filteredSessions.reduce(
    (sum, s) => sum + (s.durationMinutes || 0),
    0
  );
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  // Tasks filtered by selected goalId in form
  const formTasks = form.goalId
    ? tasks.filter((t) => t.goalId === form.goalId)
    : tasks;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">⏱️ Study Sessions</h1>
          <p className="text-gray-400 mt-1">Log and review your study sessions</p>
        </div>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditId(null);
            setShowForm(!showForm);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          {showForm ? "✕ Cancel" : "+ New Session"}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Sessions</p>
          <p className="text-4xl font-bold text-indigo-400 mt-1">{filteredSessions.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Study Time</p>
          <p className="text-4xl font-bold text-pink-400 mt-1">
            {hours > 0 ? `${hours}h ` : ""}
            <span className={hours > 0 ? "text-2xl" : ""}>{mins}m</span>
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Avg. Session</p>
          <p className="text-4xl font-bold text-teal-400 mt-1">
            {filteredSessions.length > 0
              ? Math.round(totalMinutes / filteredSessions.length)
              : 0}
            <span className="text-lg">m</span>
          </p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editId ? "✏️ Edit Session" : "➕ Log New Session"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Goal *</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                value={form.goalId}
                onChange={(e) =>
                  setForm({ ...form, goalId: e.target.value, taskId: "" })
                }
              >
                <option value="">— Select a Goal —</option>
                {goals.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Task *</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                value={form.taskId}
                onChange={(e) => setForm({ ...form, taskId: e.target.value })}
              >
                <option value="">— Select a Task —</option>
                {formTasks.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Start Time *</label>
              <input
                type="datetime-local"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                value={form.startTime}
                onChange={(e) => handleTimeChange("startTime", e.target.value)}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">End Time</label>
              <input
                type="datetime-local"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                value={form.endTime}
                onChange={(e) => handleTimeChange("endTime", e.target.value)}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                placeholder="Auto-calculated or enter manually"
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm({ ...form, durationMinutes: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Mood</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                value={form.mood}
                onChange={(e) => setForm({ ...form, mood: e.target.value })}
              >
                <option value="focused">🎯 Focused</option>
                <option value="energized">⚡ Energized</option>
                <option value="distracted">😵 Distracted</option>
                <option value="tired">😴 Tired</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm">Notes</label>
              <textarea
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Optional notes about this session..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "Saving..." : editId ? "Update Session" : "Log Session"}
          </button>
        </div>
      )}

      {/* Goal Filter */}
      {goals.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterGoal("all")}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
              filterGoal === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            All Goals
          </button>
          {goals.map((g) => (
            <button
              key={g._id}
              onClick={() => setFilterGoal(g._id)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                filterGoal === g._id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {g.title}
            </button>
          ))}
        </div>
      )}

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-4xl mb-3">⏱️</p>
          <p className="text-gray-400">No sessions yet. Log your first study session!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => (
            <div
              key={session._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-700 transition"
            >
              {/* Top row: mood badge + duration */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    moodColor[session.mood] || "bg-gray-700 text-gray-300"
                  }`}
                >
                  {moodEmoji[session.mood] || "📝"} {session.mood || "—"}
                </span>
                <span className="text-indigo-400 font-bold text-sm">
                  {session.durationMinutes ? `${session.durationMinutes} min` : "—"}
                </span>
              </div>

              {/* Goal & Task */}
              <p className="text-white font-semibold truncate">
                {taskTitle(session.taskId)}
              </p>
              <p className="text-indigo-400 text-xs mt-0.5 truncate">
                🎯 {goalTitle(session.goalId)}
              </p>

              {/* Time info */}
              <div className="mt-3 space-y-1">
                <p className="text-gray-500 text-xs">
                  🕐 {new Date(session.startTime).toLocaleString()}
                </p>
                {session.endTime && (
                  <p className="text-gray-500 text-xs">
                    🏁 {new Date(session.endTime).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Notes */}
              {session.notes && (
                <p className="text-gray-400 text-xs mt-3 italic border-t border-gray-800 pt-3 line-clamp-2">
                  "{session.notes}"
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(session)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm py-1.5 rounded-lg transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(session._id)}
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