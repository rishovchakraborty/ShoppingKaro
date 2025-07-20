import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications } from '../../services/api';
import { FaBell } from 'react-icons/fa';

export default function Navbar({ onLogout }) {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [username, setUsername] = useState(typeof window !== 'undefined' ? localStorage.getItem('username') : null);
  const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  useEffect(() => {
    const updateAuth = () => {
      setUsername(localStorage.getItem('username'));
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('focus', updateAuth);
    updateAuth();
    return () => window.removeEventListener('focus', updateAuth);
  }, []);

  useEffect(() => {
    if (showNotif) {
      getNotifications().then(res => {
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.read).length);
      });
    } else {
      getNotifications().then(res => {
        setUnreadCount(res.data.filter(n => !n.read).length);
      });
    }
  }, [showNotif]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    if (onLogout) onLogout();
  };

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-extrabold text-purple-700 tracking-tight">ShoppingKaro</span>
      </div>
      <div className="flex items-center gap-8">
        <Link to="/" className="text-purple-600 hover:text-purple-800 font-bold transition-all duration-200 hover:underline underline-offset-4">Home</Link>
        <Link to="/dashboard" className="text-purple-600 hover:text-purple-800 font-bold transition-all duration-200 hover:underline underline-offset-4">Dashboard</Link>
        <Link to="/contact" className="text-purple-600 hover:text-purple-800 font-bold transition-all duration-200 hover:underline underline-offset-4">Contact</Link>
        <Link to="/about" className="text-purple-600 hover:text-purple-800 font-bold transition-all duration-200 hover:underline underline-offset-4">About</Link>
      </div>
      <div className="flex items-center gap-5 relative">
        {/* Notification Bell */}
        <button className="relative focus:outline-none" onClick={() => setShowNotif(v => !v)}>
          <FaBell className="text-purple-600 text-2xl hover:text-purple-800 transition" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{unreadCount}</span>
          )}
        </button>
        {showNotif && (
          <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-purple-100 z-50 animate-fadeIn">
            <div className="p-4 border-b font-bold text-purple-700 flex items-center gap-2">
              <FaBell /> Notifications
            </div>
            <ul className="max-h-80 overflow-y-auto divide-y">
              {notifications.length === 0 && (
                <li className="p-4 text-gray-400 text-sm text-center">No notifications</li>
              )}
              {notifications.map((n, i) => (
                <li key={i} className={`p-4 text-sm ${!n.read ? 'bg-purple-50' : ''}`}>
                  {n.type === 'invite' ? (
                    <>
                      <span className="font-semibold text-purple-700">Invite:</span> You were invited to <span className="font-bold">{n.wishlistName}</span>
                      {n.invitedBy && n.invitedBy.username && (
                        <> by <span className="text-purple-600">{n.invitedBy.username}</span></>
                      )}
                      <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                    </>
                  ) : (
                    <span>{n.type}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button className="bg-purple-600 text-white px-5 py-2 rounded-full font-bold shadow hover:bg-purple-800 transition-all duration-200">Get in touch</button>
        <button
          onClick={handleLogout}
          className="bg-purple-600 text-white px-5 py-2 rounded-full font-bold shadow hover:bg-purple-800 transition-all duration-200"
        >
          Logout
        </button>
        {token && username && (
          <span className="ml-4 text-purple-700 font-bold text-lg">Hello, {username}</span>
        )}
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-purple-200" />
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn 0.3s; }
      `}</style>
    </nav>
  );
} 