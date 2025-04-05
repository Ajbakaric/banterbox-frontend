import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { createConsumer } from '@rails/actioncable';

// Environment-safe URLs
const API = import.meta.env.VITE_API_URL;
const cableURL = import.meta.env.VITE_CABLE_URL;
const consumer = createConsumer(cableURL);

const ChatRoom = ({ user }) => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const messagesEndRef = useRef();

  const token = localStorage.getItem('token');

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/chat_rooms/${id}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();

    const subscription = consumer.subscriptions.create(
      { channel: 'ChatRoomChannel', chat_room_id: id },
      {
        received: (incomingMessage) => {
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages, incomingMessage];
            const uniqueMessages = Array.from(
              new Map(newMessages.map(msg => [`${msg.id}-${msg.created_at}`, msg])).values()
            );
            return uniqueMessages;
          });
        },
      }
    );

    return () => subscription.unsubscribe();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!content.trim() && !image) return;

    const formData = new FormData();
    formData.append('message[content]', content || '');
    formData.append('message[chat_room_id]', id);
    if (image) formData.append('message[image]', image);

    try {
      const res = await axios.post(
        `${API}/api/v1/chat_rooms/${id}/messages`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessages((prev) => {
        const newMessages = [...prev, res.data];
        const uniqueMessages = Array.from(
          new Map(newMessages.map(msg => [`${msg.id}-${msg.created_at}`, msg])).values()
        );
        return uniqueMessages;
      });

      setContent('');
      setImage(null);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  const startEdit = (msg) => {
    setEditingId(msg.id);
    setEditingContent(msg.content);
  };

  const handleEdit = async (messageId) => {
    try {
      const res = await axios.patch(
        `${API}/api/v1/chat_rooms/${id}/messages/${messageId}`,
        { message: { content: editingContent } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, ...res.data } : m
        )
      );

      setEditingId(null);
      setEditingContent('');
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(
        `${API}/api/v1/chat_rooms/${id}/messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eafce3] to-[#bdf2ce] flex flex-col">
      <header className="p-4 border-b border-[#74c99a] bg-white">
        <h2 className="text-2xl font-bold text-[#004b23]">Chat Room</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={`${msg.id}-${msg.created_at}-${index}`}
            className="flex items-start gap-3 bg-white shadow-md p-4 rounded-xl relative"
          >
            {msg.sender_avatar_url && (
              <img
                src={msg.sender_avatar_url}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border border-green-300"
              />
            )}

            <div className="flex-1">
              <p className="text-sm text-[#50a33c] font-semibold mb-1">
                {msg.sender_email || msg.user?.email}
              </p>

              {editingId === msg.id ? (
                <>
                  <input
                    className="w-full p-2 rounded text-black border mb-2"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <div className="space-x-2 text-sm">
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() => handleEdit(msg.id)}
                    >
                      Save
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {msg.image_url && (
                    <img
                      src={msg.image_url}
                      alt="attachment"
                      className="rounded-lg max-w-xs mt-2"
                    />
                  )}
                  {msg.content && (
                    <p className="text-[#004b23] mb-1">{msg.content}</p>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </div>
                </>
              )}

              {(msg.sender_email === user?.email || msg.user?.email === user?.email) && (
                <div className="absolute top-2 right-3 text-xs space-x-2">
                  {editingId === msg.id ? (
                    <>
                      <button
                        className="text-green-600 hover:underline"
                        onClick={() => handleEdit(msg.id)}
                      >
                        Save
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => startEdit(msg)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => deleteMessage(msg.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[#74c99a] bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 px-4 py-2 rounded border border-[#b5e3b4] text-[#004b23] bg-[#f6fff4]"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-sm text-[#004b23]"
        />
        <button
          onClick={sendMessage}
          className="bg-[#50a33c] hover:bg-[#74c99a] text-white px-4 py-2 rounded font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
