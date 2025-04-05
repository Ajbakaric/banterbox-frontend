import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const Profile = ({ user, setUser }) => {
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(null);

  const setAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  useEffect(() => {
    setAuthHeader();
    axios.get(`${API}/profile`)
      .then(res => {
        setUser(res.data.user);
        setUsername(res.data.user.username);
        setEmail(res.data.user.email);
      })
      .catch(err => {
        console.error('Failed to load profile:', err.response?.data || err);
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      });
  }, []);

  const refreshUser = async () => {
    setAuthHeader();
    try {
      const res = await axios.get(`${API}/profile`);
      setUser(res.data.user);
      setUsername(res.data.user.username);
      setEmail(res.data.user.email);
    } catch (err) {
      console.error('Failed to refresh user:', err.response?.data || err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthHeader();

    try {
      await axios.put(`${API}/profile`, {
        user: { username, email },
      });

      await refreshUser();
      alert('Profile updated!');
    } catch (err) {
      alert('Update failed.');
      console.error(err.response?.data || err);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) return alert('Select an image first.');
    setAuthHeader();

    const formData = new FormData();
    formData.append('user[avatar]', avatar);

    try {
      await axios.put(`${API}/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await refreshUser();
      alert('Avatar uploaded!');
    } catch (err) {
      alert('Avatar upload failed.');
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffddab] to-[#5f8b4c] flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#945034] mb-6 text-center">Your Profile</h2>

        {user?.avatar_url ? (
          <div className="mb-6 flex justify-center">
            <img
              src={user.avatar_url}
              alt="Profile avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-green-600 shadow-lg"
            />
          </div>
        ) : (
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-300 rounded-full flex items-center justify-center text-3xl text-white font-bold">
            {username?.[0]?.toUpperCase() || '👤'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 bg-[#fef8f5] text-[#945034] placeholder-[#caa08d] border border-[#ff9a9a] rounded w-full mb-3"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 bg-[#fef8f5] text-[#945034] placeholder-[#caa08d] border border-[#ff9a9a] rounded w-full mb-3"
            required
          />

          <input
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="mb-4 text-[#945034]"
          />

          <button
            type="submit"
            className="bg-[#5f8b4c] hover:bg-[#4e753d] text-white px-4 py-2 rounded w-full transition-all font-semibold"
          >
            Update Profile
          </button>
        </form>

        <button
          onClick={handleAvatarUpload}
          className="mt-3 bg-[#ff6f61] hover:bg-[#ff9a9a] text-white px-4 py-2 rounded w-full transition-all font-semibold"
        >
          Upload Avatar
        </button>
      </div>
    </div>
  );
};

export default Profile;
