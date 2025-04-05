import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../pages/Profile';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// ✅ Mock axios and alert
jest.mock('axios');
window.alert = jest.fn();

describe('Profile Page', () => {
  const mockUser = {
    id: 1,
    email: 'test@test.com',
    username: 'testuser',
    avatar_url: null
  };

  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // 💡 reset between tests
    axios.put.mockResolvedValue({
      data: {
        user: {
          ...mockUser,
          username: 'updateduser',
        },
      },
    });
  });

  it('renders user info', () => {
    render(
      <MemoryRouter>
        <Profile user={mockUser} setUser={mockSetUser} />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it('updates user profile on form submit', async () => {
    render(
      <MemoryRouter>
        <Profile user={mockUser} setUser={mockSetUser} />
      </MemoryRouter>
    );

    // Update username field
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'updateduser' },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/update profile/i));

    await waitFor(() =>
      expect(mockSetUser).toHaveBeenCalledWith({
        ...mockUser,
        username: 'updateduser',
      })
    );
  });
});
