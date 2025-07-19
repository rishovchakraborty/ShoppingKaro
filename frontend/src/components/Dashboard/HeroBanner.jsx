import React from 'react';
import heroImg from '/hero.png';

export default function HeroBanner() {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-500 via-violet-500 to-pink-400 rounded-3xl shadow-2xl p-10 mb-12 animate-fadeIn border-2 border-violet-100 relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3 tracking-tight drop-shadow-xl">
          <span className="inline-block align-middle mr-2">🛍️</span>Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-yellow-200">ShoppingKaro!</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-xl font-medium drop-shadow">
          Discover the best deals on electronics, fashion, and more.
        </p>
        <div className="flex gap-4 flex-wrap justify-center md:justify-start">
          <button className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:from-blue-700 hover:to-violet-700 transition-all duration-200">🔍 Browse Deals</button>
          <button className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-blue-50 transition-all duration-200">🛒 Start Shopping</button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center mt-8 md:mt-0 z-10">
        <img src={heroImg} alt="Shopping Hero" className="h-72 md:h-96 w-auto object-contain drop-shadow-2xl rounded-3xl animate-heroZoom" draggable="false" />
      </div>
      {/* Animated gradient overlay for extra SaaS feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-pink-100/10 to-blue-100/10 pointer-events-none rounded-3xl animate-gradientMove" />
      <style>{`
        .animate-fadeIn { animation: fadeIn 1s; }
        .animate-heroZoom { animation: heroZoom 2.5s cubic-bezier(0.4,0,0.2,1) forwards; }
        .animate-gradientMove { animation: gradientMove 8s ease-in-out infinite alternate; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes heroZoom { from { transform: scale(1.1); opacity: 0.7; } to { transform: scale(1); opacity: 0.8; } }
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
      `}</style>
    </section>
  );
} 