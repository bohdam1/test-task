import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

const UserProfileForm: React.FC = () => {
  const [user, setUser] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/users/1')
      .then((response) => {
        const data = response.data;
        setUser({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address?.street || '',
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch user data.');
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!user.name.trim()) return 'Name is required';
    if (!user.email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) return 'Email is invalid';
    if (user.phone && !/^[\d\s+\-()]*$/.test(user.phone)) return 'Phone is invalid';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSuccess(false);
      return;
    }
    setError(null);
    try {
      await axios.put('https://jsonplaceholder.typicode.com/users/1', user);
      setSuccess(true);
    } catch {
      setError('Failed to update user data.');
      setSuccess(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      maxWidth={isMobile ? '90%' : '600px'}
      mx="auto"
      mt={6}
      p={isMobile ? 2 : 4}
      bgcolor="background.paper"
      borderRadius={2}
      boxShadow={4}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" align="center">
              User Profile
            </Typography>
          </Grid>

          {error && (
            <Grid size={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          {success && (
            <Grid size={12}>
              <Alert severity="success">Profile updated successfully!</Alert>
            </Grid>
          )}

          <Grid size={12}>
            <TextField
              label="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Phone Number"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Address"
              name="address"
              value={user.address}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid size={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default UserProfileForm;
