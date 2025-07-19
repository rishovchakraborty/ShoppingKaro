import { useState } from "react";
import { Link } from "react-router-dom";
import { FaGift, FaUsers, FaListAlt, FaChartBar, FaChevronDown } from "react-icons/fa";

const HERO_3D_IMAGE = "/hero.png";

export default function Home() {
  // State for image rotation
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  // Mouse move handler for 3D effect
  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate rotation: max 18deg in each direction
    const rotateY = ((x - centerX) / centerX) * 18;
    const rotateX = -((y - centerY) / centerY) * 18;
    setRotation({ x: rotateX, y: rotateY });
  };
  const handleMouseLeave = () => setRotation({ x: 0, y: 0 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center animate-fadeIn">
      {/* SaaS Hero Section */}
      <section className="relative w-full h-[80vh] flex flex-col md:flex-row items-center justify-center overflow-hidden px-4 md:px-0">
        {/* 3D Illustration with interactive rotation */}
        <div
          className="flex-1 flex items-center justify-center h-full z-10"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1200 }}
        >
          <img
            src={HERO_3D_IMAGE}
            alt="Shopping Hero"
            className="h-[340px] md:h-[420px] w-auto object-contain drop-shadow-2xl rounded-xl animate-heroZoom transition-transform duration-200"
            draggable="false"
            style={{
              maxWidth: '100%',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
            }}
          />
        </div>
        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left z-20 animate-slideDown">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 drop-shadow-lg mb-4 tracking-tight">
            ShoppingKaro
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 max-w-2xl mb-8 font-medium">
            The ultimate collaborative wishlist platform for group shopping, events, and shared gift lists. Plan, share, and celebrate together!
          </p>
          <div className="flex gap-6 mb-8 flex-wrap justify-center md:justify-start">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-10 py-4 rounded-xl hover:bg-blue-700 font-bold text-xl shadow-lg transition"
            >
              Get Started
            </Link>
            <Link
              to="/register"
              className="bg-white border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-xl hover:bg-blue-50 font-bold text-xl shadow-lg transition"
            >
              Create Account
            </Link>
          </div>
        </div>
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
          <FaChevronDown className="text-4xl text-blue-400 drop-shadow" />
        </div>
      </section>

      {/* Features Section */}
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

      {/* Charts & Analytics Section (Placeholder) */}
      <section className="w-full max-w-4xl my-10 px-4 animate-fadeIn delay-300">
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="text-2xl text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-700">Your Wishlist Stats</h2>
          </div>
          {/* Chart Placeholder */}
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
        .animate-heroZoom { animation: heroZoom 2.5s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bounceIn { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes heroZoom { from { transform: scale(1.1); opacity: 0.7; } to { transform: scale(1); opacity: 0.8; } }
      `}</style>
    </div>
  );
}