import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  markComplete,
  deleteTask,
} from "../services/api";
import { getGoals } from "../services/api";

const emptyForm = {
  goalId: "",
  title: "",
  module: "",
  estimatedMinutes: "",
  dueDate: "",
  priority: "medium",
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterGoal, setFilterGoal] = useState("all");

  const fetchTasks = () => {
    getTasks()
      .then((res) => setTasks(res.data))
      .catch(() => setTasks([]));
  };

  useEffect(() => {
    fetchTasks();
    getGoals()
      .then((res) => setGoals(res.data))
      .catch(() => setGoals([]));
  }, []);

  const handleSubmit = async () => {
    if (!form.goalId || !form.title) {
      alert("Goal and Title are required!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        estimatedMinutes: form.estimatedMinutes ? Number(form.estimatedMinutes) : undefined,
        dueDate: form.dueDate || undefined,
      };
      if (editId) {
        await updateTask(editId, payload);
      } else {
        await createTask(payload);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchTasks();
    } catch {
      alert("Something went wrong!");
    }
    setLoading(false);
  };

  const handleEdit = (task) => {
    setForm({
      goalId: task.goalId || "",
      title: task.title,
      module: task.module || "",
      estimatedMinutes: task.estimatedMinutes || "",
      dueDate: task.dueDate?.slice(0, 10) || "",
      priority: task.priority,
    });
    setEditId(task._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMarkComplete = async (id) => {
    await markComplete(id);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await deleteTask(id);
    fetchTasks();
  };

  const priorityColor = (p) => {
    if (p === "high") return "bg-red-900 text-red-300";
    if (p === "medium") return "bg-yellow-900 text-yellow-300";
    return "bg-gray-700 text-gray-300";
  };

  const goalTitle = (goalId) => {
    const goal = goals.find((g) => g._id === goalId);
    return goal ? goal.title : "Unknown Goal";
  };

  const filteredTasks =
    filterGoal === "all"
      ? tasks
      : tasks.filter((t) => t.goalId === filterGoal);

  const completedCount = filteredTasks.filter((t) => t.completed).length;
  const pendingCount = filteredTasks.filter((t) => !t.completed).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">✅ Tasks</h1>
          <p className="text-gray-400 mt-1">Track and manage your tasks</p>
        </div>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditId(null);
            setShowForm(!showForm);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          {showForm ? "✕ Cancel" : "+ New Task"}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Tasks</p>
          <p className="text-4xl font-bold text-indigo-400 mt-1">{filteredTasks.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Completed</p>
          <p className="text-4xl font-bold text-green-400 mt-1">{completedCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-4xl font-bold text-yellow-400 mt-1">{pendingCount}</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editId ? "✏️ Edit Task" : "➕ Create New Task"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Goal *</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                value={form.goalId}
                onChange={(e) => setForm({ ...form, goalId: e.target.value })}
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
              <label className="text-gray-400 text-sm">Title *</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Study Chapter 5"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Module / Subject</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Mathematics"
                value={form.module}
                onChange={(e) => setForm({ ...form, module: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Estimated Minutes</label>
              <input
                type="number"
                min="1"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. 60"
                value={form.estimatedMinutes}
                onChange={(e) => setForm({ ...form, estimatedMinutes: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Due Date</label>
              <input
                type="date"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-indigo-500"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
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
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "Saving..." : editId ? "Update Task" : "Create Task"}
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

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-gray-400">No tasks yet. Create your first task!</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`flex items-center justify-between px-5 py-4 transition ${
                task.completed ? "opacity-60" : "hover:bg-gray-800/40"
              }`}
            >
              {/* Left side */}
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-xl flex-shrink-0">
                  {task.completed ? "✅" : "⏳"}
                </span>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      task.completed ? "line-through text-gray-500" : "text-white"
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {task.module && (
                      <span className="text-xs text-indigo-400 bg-indigo-900/30 px-2 py-0.5 rounded">
                        {task.module}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      🎯 {goalTitle(task.goalId)}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500">
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.estimatedMinutes && (
                      <span className="text-xs text-gray-500">
                        ⏱ {task.estimatedMinutes}m est.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${priorityColor(task.priority)}`}
                >
                  {task.priority}
                </span>
                {!task.completed && (
                  <button
                    onClick={() => handleMarkComplete(task._id)}
                    className="text-xs bg-green-900 hover:bg-green-800 text-green-300 px-3 py-1.5 rounded-lg transition"
                  >
                    ✓ Done
                  </button>
                )}
                <button
                  onClick={() => handleEdit(task)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-xs bg-red-900 hover:bg-red-800 text-red-300 px-3 py-1.5 rounded-lg transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}