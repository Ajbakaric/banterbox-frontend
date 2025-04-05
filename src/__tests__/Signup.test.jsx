import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../pages/Signup';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('axios');

describe('Signup Page', () => {
  it('renders form inputs and sign up button', () => {
    render(
      <MemoryRouter>
        <Signup setUser={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it('submits the form and calls axios.post with correct data', async () => {
    axios.post.mockResolvedValue({
      data: {
        token: 'mockToken',
        user: {
          email: 'test9@test.com',
          username: 'testuser',
        },
      },
    });

    const setUser = jest.fn();

    render(
      <MemoryRouter>
        <Signup setUser={setUser} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test9@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/Sign Up/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(setUser).toHaveBeenCalledWith({
        email: 'test9@test.com',
        username: 'testuser',
      });
    });
  });
});
