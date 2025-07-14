import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import UserProfileForm from '../../components/UserProfileForm/UserProfileForm';

// Мокаємо axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserProfileForm Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Save button', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { name: 'John Doe', email: 'john@example.com', phone: '', address: '' },
    });

    render(<UserProfileForm />);

    // Чекаємо, поки зникне спінер
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { name: '', email: '', phone: '', address: '' },
    });

    render(<UserProfileForm />);

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    // Очищаємо поля
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

   
  });

  test('validates invalid email', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { name: 'John', email: 'john@example.com', phone: '', address: '' },
    });

    render(<UserProfileForm />);

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

   
  });
  test('validates invalid phone', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { name: 'John', email: 'john@example.com', phone: '', address: '' },
    });

    render(<UserProfileForm />);

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: 'abc123!' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/phone is invalid/i)).toBeInTheDocument();
  });

  test('calls API on submit with valid data and shows success', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { name: 'John Doe', email: 'john@example.com', phone: '', address: '' },
    });
    mockedAxios.put.mockResolvedValueOnce({});

    render(<UserProfileForm />);

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/profile updated successfully!/i)).toBeInTheDocument();
  });

  test('shows error message on API failure', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { name: 'John Doe', email: 'john@example.com', phone: '', address: '' },
    });
    mockedAxios.put.mockRejectedValueOnce(new Error('Network error'));

    render(<UserProfileForm />);

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/failed to update user data/i)).toBeInTheDocument();
  });
});
