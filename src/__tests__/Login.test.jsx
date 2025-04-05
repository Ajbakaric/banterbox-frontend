import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import axios from 'axios';

// ✅ Mock axios module
jest.mock('axios');

describe('Login Page', () => {
  // ✅ Prevent "window.alert not implemented" error
  beforeEach(() => {
    window.alert = jest.fn();
  });

  it('renders login form inputs and button', () => {
    const mockSetUser = jest.fn();

    render(
      <MemoryRouter>
        <Login setUser={mockSetUser} />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('calls login function on form submit', async () => {
    const mockSetUser = jest.fn();

    // ✅ Mock successful login response
    axios.post.mockResolvedValueOnce({
      data: {
        user: { email: 'test@test.com' },
      },
    });

    render(
      <MemoryRouter>
        <Login setUser={mockSetUser} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: 'test@test.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // ✅ Wait for setUser to be called
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({ email: 'test@test.com' });
    });
  });
});
