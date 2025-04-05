import React, { useState } from 'react';
import axios from 'axios';  // Use default axios directly
 // adjust path if needed

import { useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL;
const Signup = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('user[email]', email);
    formData.append('user[password]', password);
    formData.append('user[username]', username);
    if (avatar) formData.append('user[avatar]', avatar);
  
    try {
      const res = await axios.post(`${API}/signup`, formData, {
        headers: {
          'Accept': 'application/json'
        }
      });
  
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      navigate('/chatrooms');
    } catch (err) {
      console.error('Signup failed', err.response?.data || err);
      alert(`Signup failed: ${err.response?.data?.errors?.join(', ') || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eafce3] to-[#74e291] flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#004b23] mb-6 text-center">Create an Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#38b000] rounded bg-[#f6fff4] text-[#004b23]"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#38b000] rounded bg-[#f6fff4] text-[#004b23]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#38b000] rounded bg-[#f6fff4] text-[#004b23]"
          />

          <input
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="text-[#004b23] text-sm"
          />

          <button
            type="submit"
            className="w-full bg-[#ff6f61] hover:bg-[#ffa8a8] text-white font-bold py-2 rounded transition-all"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-[#004b23]">
          Already have an account?{' '}
          <a href="/login" className="text-[#ff6f61] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
