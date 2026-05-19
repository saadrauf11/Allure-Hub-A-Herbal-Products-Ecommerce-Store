'use client';

import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function SignIn() {
  const router = useRouter();
  const { signin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signin(formData.email, formData.password, role);

    if (result.success) {
      router.push(role === 'admin' ? '/admin/products' : '/products');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Sign In
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Sign in as:
          </Typography>
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={(e, newRole) => setRole(newRole)}
            fullWidth
          >
            <ToggleButton value="buyer">Buyer</ToggleButton>
            <ToggleButton value="admin">Admin</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: '#d4a574',
              color: '#2c2416',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#c49564',
              },
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link href="/auth/signup" style={{ color: '#d4a574', fontWeight: 600 }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
