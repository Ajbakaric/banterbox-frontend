import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import ChatRoom from '../pages/ChatRoom';

jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe('ChatRoom Page', () => {
  it('sends a message and renders it', async () => {
    // 1️⃣ Initial GET - existing messages
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          content: 'Hello World',
          timestamp: '4:30 PM',
        },
      ],
    });

    // 2️⃣ POST - user sends a new message
    axios.post.mockResolvedValueOnce({
      data: {
        id: 2,
        content: 'New message',
        timestamp: '4:35 PM',
      },
    });

    render(
      <MemoryRouter>
        <ChatRoom />
      </MemoryRouter>
    );

    // Type a message
    fireEvent.change(screen.getByPlaceholderText(/type your message/i), {
      target: { value: 'New message' },
    });

    // Click the Send button
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // 3️⃣ Give DOM time to update and log it for debugging
    screen.logTestingPlaygroundURL(); // 🔍 Opens DOM view for debugging

    await waitFor(() => {
      const newMessage = screen.getByText('New message');
      expect(newMessage).toBeInTheDocument();
    });
  });
});
