import React from 'react';

export default function Navbar({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    if (onLogout) onLogout();
  };

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-purple-700 tracking-tight">ShoppingKaro</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="#" className="text-gray-700 hover:text-purple-700 font-medium">Home</a>
        <a href="#" className="text-gray-700 hover:text-purple-700 font-medium">Categories</a>
        <a href="#" className="text-gray-700 hover:text-purple-700 font-medium">Contact</a>
        <a href="#" className="text-gray-700 hover:text-purple-700 font-medium">About</a>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-purple-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-800 transition">Get in touch</button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-purple-200" />
      </div>
    </nav>
  );
} 