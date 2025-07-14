import React from 'react';
import axios from 'axios';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserProfileForm from '../../components/UserProfileForm/UserProfileForm';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserProfileForm Integration Tests', () => {
  const mockUserData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Main St',
  };

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: {
      name: mockUserData.name,
      email: mockUserData.email,
      phone: mockUserData.phone,
      address: { street: mockUserData.address },
    } });
  });

  test('fetches and displays user data', async () => {
    render(<UserProfileForm />);
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockUserData.name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockUserData.email)).toBeInTheDocument();
    });
  });

  test('submits updated data successfully', async () => {
    mockedAxios.put.mockResolvedValue({ status: 200 });

    render(<UserProfileForm />);
    await waitFor(() => screen.getByDisplayValue(mockUserData.name));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/users/1',
        expect.objectContaining({ name: 'Jane Doe' }),
      );
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });

  test('shows error message on submit failure', async () => {
    mockedAxios.put.mockRejectedValue(new Error('Network error'));

    render(<UserProfileForm />);
    await waitFor(() => screen.getByDisplayValue(mockUserData.name));

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to update user data/i)).toBeInTheDocument();
    });
  });
});
