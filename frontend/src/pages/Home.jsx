import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <h1 className="text-5xl font-bold mb-6 text-blue-700">Welcome to ShoppingKaro!</h1>
      <p className="mb-8 text-lg text-gray-700 text-center max-w-xl">
        Create collaborative wishlists, invite friends, and manage your dream products with ease.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 font-semibold"
        >
          Register
        </Link>
      </div>
    </div>
  );
}