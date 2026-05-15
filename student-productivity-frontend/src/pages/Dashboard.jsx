import { useEffect, useState } from "react";
import { getGoals } from "../services/api";
import { getTasks } from "../services/api";
import { getSessions } from "../services/api";
import { Link } from "react-router-dom";

const moodEmoji = {
  focused: "🎯",
  energized: "⚡",
  distracted: "😵",
  tired: "😴",
};

export default function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getGoals().then((res) => setGoals(res.data)).catch(() => {});
    getTasks().then((res) => setTasks(res.data)).catch(() => {});
    getSessions().then((res) => setSessions(res.data)).catch(() => {});
  }, []);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
    .slice(0, 3);

  const taskTitle = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    return task ? task.title : "—";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">👋 Welcome Back!</h1>
        <p className="text-gray-400 mt-1">Here's your productivity overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Goals</p>
          <p className="text-4xl font-bold text-indigo-400 mt-1">{goals.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Completed Tasks</p>
          <p className="text-4xl font-bold text-green-400 mt-1">{completedTasks}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Pending Tasks</p>
          <p className="text-4xl font-bold text-yellow-400 mt-1">{pendingTasks}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Study Time</p>
          <p className="text-4xl font-bold text-pink-400 mt-1">
            {totalMinutes}
            <span className="text-lg">m</span>
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {tasks.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-semibold text-sm">Overall Task Completion</p>
            <span className="text-indigo-400 font-bold text-sm">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div
              className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {completedTasks} of {tasks.length} tasks completed
          </p>
        </div>
      )}

      {/* Active Goals */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">🎯 Active Goals</h2>
          <Link to="/goals" className="text-indigo-400 text-sm hover:underline">
            View all →
          </Link>
        </div>
        {goals.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-500">No goals yet.</p>
            <Link
              to="/goals"
              className="text-indigo-400 text-sm hover:underline mt-2 inline-block"
            >
              Create your first goal →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goals.slice(0, 3).map((goal) => {
              const goalTasks = tasks.filter((t) => t.goalId === goal._id);
              const goalDone = goalTasks.filter((t) => t.completed).length;
              const goalPct =
                goalTasks.length > 0 ? Math.round((goalDone / goalTasks.length) * 100) : 0;
              return (
                <div
                  key={goal._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        goal.type === "exam"
                          ? "bg-red-900 text-red-300"
                          : goal.type === "project"
                          ? "bg-blue-900 text-blue-300"
                          : "bg-green-900 text-green-300"
                      }`}
                    >
                      {goal.type}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        goal.priority === "high"
                          ? "bg-red-900 text-red-300"
                          : goal.priority === "medium"
                          ? "bg-yellow-900 text-yellow-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {goal.priority}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mt-2">{goal.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">
                    📅 {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                  {goalTasks.length > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{goalPct}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${goalPct}%` }}
                        />
                      </div>
                      <p className="text-gray-600 text-xs mt-1">
                        {goalDone}/{goalTasks.length} tasks
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom: Recent Tasks + Recent Sessions side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">✅ Recent Tasks</h2>
            <Link to="/tasks" className="text-indigo-400 text-sm hover:underline">
              View all →
            </Link>
          </div>
          {tasks.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-500">No tasks yet.</p>
              <Link
                to="/tasks"
                className="text-indigo-400 text-sm hover:underline mt-2 inline-block"
              >
                Create your first task →
              </Link>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span>{task.completed ? "✅" : "⏳"}</span>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.module && (
                        <p className="text-xs text-gray-500">{task.module}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                      task.priority === "high"
                        ? "bg-red-900 text-red-300"
                        : task.priority === "medium"
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">⏱️ Recent Sessions</h2>
            <Link to="/sessions" className="text-indigo-400 text-sm hover:underline">
              View all →
            </Link>
          </div>
          {recentSessions.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-500">No sessions yet.</p>
              <Link
                to="/sessions"
                className="text-indigo-400 text-sm hover:underline mt-2 inline-block"
              >
                Log your first session →
              </Link>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
              {recentSessions.map((session) => (
                <div key={session._id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg flex-shrink-0">
                      {moodEmoji[session.mood] || "📝"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {taskTitle(session.taskId)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.startTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-indigo-400 font-semibold text-sm flex-shrink-0 ml-2">
                    {session.durationMinutes ? `${session.durationMinutes}m` : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}