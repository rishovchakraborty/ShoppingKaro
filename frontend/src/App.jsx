import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import WishlistDetail from './pages/WishlistDetail';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const onStorage = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Helper to update auth state after login/register/logout
  const handleAuth = () => setIsAuthenticated(!!localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login onAuth={handleAuth} /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register onAuth={handleAuth} /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Dashboard onLogout={handleAuth} /> : <Navigate to="/login" />} />
        <Route path="/wishlist/:id" element={isAuthenticated ? <WishlistDetail /> : <Navigate to="/login" />} />
        {/* Catch-all: redirect unknown routes to dashboard or login */}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
      </Routes>
    </Router>
  );
}