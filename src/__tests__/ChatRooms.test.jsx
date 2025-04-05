import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatRooms from '../pages/ChatRooms';
import { MemoryRouter } from 'react-router-dom';

describe('ChatRooms Page', () => {
  const mockUser = { id: 1, email: 'test@test.com' };

  it('renders ChatRooms header and input field', () => {
    render(
      <MemoryRouter>
        <ChatRooms user={mockUser} />
      </MemoryRouter>
    );

    expect(screen.getByText(/chat rooms/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/new room name/i)).toBeInTheDocument();
  });

  it('shows message when no rooms are found', async () => {
    render(
      <MemoryRouter>
        <ChatRooms user={mockUser} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/no rooms yet.*create one/i)
      ).toBeInTheDocument();
    });
  });
});

