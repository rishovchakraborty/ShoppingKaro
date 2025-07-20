import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGift, FaUsers, FaListAlt, FaChartBar, FaChevronDown } from "react-icons/fa";
import Watch3DModel from "../components/Common/Watch3DModel";

export default function Home() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 30;
    const rotateX = -((y - centerY) / centerY) * 30;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setRotation({ x: 0, y: 0 });

  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center animate-fadeIn">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex flex-col md:flex-row items-center justify-center overflow-hidden px-4 md:px-0">
        <div className="flex flex-1 flex-col md:flex-row items-center justify-center gap-12 z-20 animate-slideDown w-full max-w-5xl">
          {/* 3D Watch Container */}
          <div
            className="flex items-end justify-center h-[260px] w-[260px] md:h-[360px] md:w-[360px] cursor-grab active:cursor-grabbing relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
              borderRadius: '1.5rem',
              background: 'white',
              paddingBottom: '36px', // pushed down more
              marginTop: '20px', // slightly lower from top
            }}
          >
            {/* Colorful Bubbles */}
            <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bubble1 opacity-60 z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full animate-bubble2 opacity-50 z-10"></div>
            <div className="absolute top-1/4 -left-6 w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bubble3 opacity-40 z-10"></div>
            <div className="absolute bottom-1/3 -right-6 w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-bubble4 opacity-30 z-10"></div>
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-r from-blue-300 to-pink-300 rounded-full animate-bubble5 opacity-50 z-10"></div>
            <Watch3DModel rotation={rotation} setRotation={setRotation} />
          </div>

          {/* Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 drop-shadow-lg mb-4 tracking-tight">
              ShoppingKaro
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 max-w-2xl mb-8 font-medium">
              The ultimate collaborative wishlist platform for group shopping, events, and shared gift lists. Plan, share, and celebrate together!
            </p>
            <div className="flex gap-6 mb-8 flex-wrap justify-center md:justify-start">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-10 py-4 rounded-xl hover:bg-blue-700 font-bold text-xl shadow-lg transition"
              >
                Get Started
              </button>
              <Link
                to="/register"
                className="bg-white border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-xl hover:bg-blue-50 font-bold text-xl shadow-lg transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
        {/* Scroll Icon */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
          <FaChevronDown className="text-4xl text-blue-400 drop-shadow" />
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 my-10 px-4 animate-fadeIn delay-200">
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-bounceIn">
          <FaGift className="text-4xl text-pink-500 mb-3" />
          <h3 className="text-xl font-bold mb-2 text-gray-800">Create Wishlists</h3>
          <p className="text-gray-500 text-center">Easily create and manage wishlists for any occasion. Add products, set priorities, and keep everything organized.</p>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-bounceIn delay-100">
          <FaUsers className="text-4xl text-blue-500 mb-3" />
          <h3 className="text-xl font-bold mb-2 text-gray-800">Collaborate & Invite</h3>
          <p className="text-gray-500 text-center">Invite friends and family to your wishlists. Collaborate in real-time and make group shopping fun and easy.</p>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-bounceIn delay-200">
          <FaListAlt className="text-4xl text-purple-500 mb-3" />
          <h3 className="text-xl font-bold mb-2 text-gray-800">Track & React</h3>
          <p className="text-gray-500 text-center">Track who added what, leave comments, and react with emojis. Stay engaged and up-to-date with every change.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full max-w-4xl my-10 px-4 animate-fadeIn delay-300">
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="text-2xl text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-700">Your Wishlist Stats</h2>
          </div>
          <div className="w-full h-64 flex items-center justify-center">
            <span className="text-gray-400 text-lg">[Charts coming soon: See your wishlist growth, top products, and more!]</span>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 1s; }
        .animate-slideDown { animation: slideDown 1s; }
        .animate-bounceIn { animation: bounceIn 0.8s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bounceIn { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes bubble1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes bubble2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        @keyframes bubble3 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-8px); } }
        @keyframes bubble4 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes bubble5 { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .animate-bubble1 { animation: bubble1 3.2s ease-in-out infinite; }
        .animate-bubble2 { animation: bubble2 2.8s ease-in-out infinite; }
        .animate-bubble3 { animation: bubble3 3.6s ease-in-out infinite; }
        .animate-bubble4 { animation: bubble4 2.9s ease-in-out infinite; }
        .animate-bubble5 { animation: bubble5 3.1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
