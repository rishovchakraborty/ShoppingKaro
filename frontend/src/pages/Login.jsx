import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { FaUserAlt, FaLock } from "react-icons/fa";

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.data.token);
      if (onAuth) onAuth();
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 p-10 rounded-2xl shadow-2xl border border-blue-100 w-full max-w-md flex flex-col gap-2 animate-slideUp"
        aria-label="Login form"
      >
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 shadow">
            <FaUserAlt className="text-blue-600 text-3xl" />
          </div>
          <h2 className="text-3xl font-extrabold mb-1 text-blue-700 tracking-tight">Login</h2>
          <span className="text-gray-400 text-sm">Welcome back! Please sign in.</span>
        </div>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
            <FaUserAlt />
          </span>
          <input
            className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-700 bg-blue-50 placeholder-gray-400"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-label="Email"
          />
        </div>
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
            <FaLock />
          </span>
          <input
            className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-700 bg-blue-50 placeholder-gray-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            aria-label="Password"
          />
        </div>
        <button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : null}
          Login
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          No account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </form>
      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.7s; }
        .animate-slideUp { animation: slideUp 0.7s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}