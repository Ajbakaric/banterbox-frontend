import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const ChatRooms = ({ user }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios
      .get(`${API}/api/v1/chat_rooms`)
      .then((res) => setChatRooms(res.data))
      .catch((err) => console.error('Failed to fetch chat rooms:', err));
  }, []);

  const createRoom = async () => {
    if (!roomName.trim()) return;

    try {
      const res = await axios.post(
        `${API}/api/v1/chat_rooms`,
        { chat_room: { name: roomName } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChatRooms([...chatRooms, res.data]);
      setRoomName('');
    } catch (err) {
      console.error('Create chat room failed:', err);
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      await axios.delete(`${API}/api/v1/chat_rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatRooms(chatRooms.filter((room) => room.id !== id));
    } catch (err) {
      console.error('Delete chat room failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eafce3] to-[#bdf2ce] flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-[#004b23] mb-6 text-center">
          Chat Rooms
        </h1>

        <div className="flex mb-6">
          <input
            type="text"
            placeholder="New room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="flex-1 px-4 py-2 border border-[#38b000] rounded-l-md focus:outline-none bg-[#f6fff4] text-[#004b23]"
          />
          <button
            onClick={createRoom}
            className="bg-[#38b000] text-white px-4 rounded-r-md hover:bg-[#50a33c] font-semibold"
          >
            Create
          </button>
        </div>

        {chatRooms.length === 0 ? (
          <p className="text-gray-500 text-center">
            No rooms yet. Be the first to create one!
          </p>
        ) : (
          <ul className="space-y-3">
            {chatRooms.map((room) => (
              <li
                key={room.id}
                className="flex justify-between items-center bg-[#f6fff4] px-4 py-3 rounded-lg shadow-sm hover:bg-[#e2f6e5]"
              >
                <button
                  onClick={() => navigate(`/chat/${room.id}`)}
                  className="text-[#004b23] font-medium hover:text-[#50a33c]"
                >
                  {room.name}
                </button>
                <button
                  onClick={() => deleteRoom(room.id)}
                  className="text-sm text-[#ff6f61] hover:text-[#ffa8a8] font-medium"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatRooms;
