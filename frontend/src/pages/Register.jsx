import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerApi } from "../services/api";
import { FaUserAlt, FaEnvelope, FaLock } from "react-icons/fa";

export default function Register({ onAuth }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerApi({ username, email, password });
      setSuccess(true);
      if (onAuth) onAuth();
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 p-10 rounded-2xl shadow-2xl border border-blue-100 w-full max-w-md flex flex-col gap-2 animate-slideUp"
        aria-label="Register form"
      >
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2 shadow">
            <FaUserAlt className="text-purple-600 text-3xl" />
          </div>
          <h2 className="text-3xl font-extrabold mb-1 text-purple-700 tracking-tight">Register</h2>
          <span className="text-gray-400 text-sm">Create your account</span>
        </div>
        {success && <div className="text-green-600 mb-2 text-center">Registration successful! Redirecting to home...</div>}
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
            <FaUserAlt />
          </span>
          <input
            className="w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-700 bg-purple-50 placeholder-gray-400"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            aria-label="Username"
          />
        </div>
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
            <FaEnvelope />
          </span>
          <input
            className="w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-700 bg-purple-50 placeholder-gray-400"
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
            <FaLock />
          </span>
          <input
            className="w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-700 bg-purple-50 placeholder-gray-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-label="Password"
          />
        </div>
        <button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg font-semibold shadow hover:from-purple-700 hover:to-pink-600 transition flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={success || loading}
          aria-busy={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : null}
          Register
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline font-medium">
            Login
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