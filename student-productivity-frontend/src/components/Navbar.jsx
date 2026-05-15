import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { path: "/", label: "🏠 Dashboard" },
  { path: "/goals", label: "🎯 Goals" },
  { path: "/tasks", label: "✅ Tasks" },
  { path: "/sessions", label: "⏱️ Sessions" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-400 tracking-wide">
          📚 StudentPro
        </h1>
        <div className="flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.path
                  ? "text-indigo-400 border-b-2 border-indigo-400 pb-1"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}