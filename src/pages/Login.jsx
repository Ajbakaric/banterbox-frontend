import React, { useState } from 'react';
import axios from 'axios';  // Use the default axios import
import { useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL;
const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(`${API}/login`, 
        { user: { email, password } }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
  
      const token = res.data.token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(res.data.user);
      navigate('/chatrooms');
    } catch (err) {
      console.error('Login failed', err.response?.data || err);
      alert(`Login failed: ${err.response?.data?.error || 'Unknown error'}`);
    }
  };
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#eafce3] to-[#74e291]">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-[#004b23] text-center mb-4">BanterBox</h1>
        <h2 className="text-xl font-semibold text-[#38b000] text-center mb-6">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-[#004b23] mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded border border-[#38b000] bg-[#f6fff4] text-[#004b23] placeholder-[#50a33c]"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#004b23] mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded border border-[#38b000] bg-[#f6fff4] text-[#004b23] placeholder-[#50a33c]"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#38b000] hover:bg-[#50a33c] text-white py-2 rounded font-semibold transition-all"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-[#004b23] text-sm">
          Don’t have an account?{' '}
          <a href="/signup" className="text-[#ff6f61] font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
