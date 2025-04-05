import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '../pages/NavBar'; // Adjust the path if needed
import { MemoryRouter } from 'react-router-dom';

describe('NavBar', () => {
  const mockSetUser = jest.fn();

  it('renders login and signup links when user is not logged in', () => {
    render(
      <MemoryRouter>
        <NavBar user={null} setUser={mockSetUser} />
      </MemoryRouter>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('renders user info and logout button when user is logged in', () => {
    const fakeUser = { email: 'test@test.com' };

    render(
      <MemoryRouter>
        <NavBar user={fakeUser} setUser={mockSetUser} />
      </MemoryRouter>
    );

    expect(screen.getByText(/test@test.com/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.getByText(/rooms/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });

  it('logs out user when logout button is clicked', () => {
    const fakeUser = { email: 'test@test.com' };

    render(
      <MemoryRouter>
        <NavBar user={fakeUser} setUser={mockSetUser} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/logout/i));
    expect(mockSetUser).toHaveBeenCalledWith(null);
  });
});
