import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';

import ChatRooms from './pages/ChatRooms';
import ChatRoom from './pages/ChatRoom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      window.axios = axios; // ✅ Makes axios available in DevTools

      axios.get('http://localhost:3000/profile')
      .then((res) => {
        console.log('[🐛DEBUG] Profile response:', res.data);
        setUser(res.data.user);
      })
    
        .catch(() => {
          console.error('Auth token invalid or expired.');
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen text-lg text-green-200">
          Loading...
        </div>
      );
    }

    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className="bg-[#041b1b] text-white min-h-screen">
      <nav className="bg-[#093923] p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="text-xl font-bold text-[#6cb54b]">💬 ChatApp</div>
        <div className="space-x-4 text-sm">
          {!user ? (
            <>
              <a href="/login" className="text-[#4fa55d] hover:underline">Login</a>
              <a href="/signup" className="text-[#4fa55d] hover:underline">Sign Up</a>
            </>
          ) : (
            <>
              <a href="/chatrooms" className="text-[#4fa55d] hover:underline">Rooms</a>
              <a href="/profile" className="text-[#4fa55d] hover:underline">Profile</a>
              <span className="text-[#6cb54b]">({user.username || 'User'})</span>
              <button onClick={handleLogout} className="text-red-400 hover:underline">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-4xl">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/" element={<ProtectedRoute><ChatRooms user={user} /></ProtectedRoute>} />
            <Route path="/chatrooms" element={<ProtectedRoute><ChatRooms user={user} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile user={user} setUser={setUser} /></ProtectedRoute>} />
            <Route path="/chat/:id" element={<ProtectedRoute><ChatRoom user={user} /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
