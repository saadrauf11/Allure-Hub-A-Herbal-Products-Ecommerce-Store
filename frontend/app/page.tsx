'use client';

import { Container, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #d4a574 0%, #a1714c 100%)',
          borderRadius: 2,
          color: 'white',
          mb: 6,
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Welcome to AlureHub
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 300 }}>
          Discover Premium Natural Beauty Products
        </Typography>
        <Button
          component={Link}
          href="/products"
          variant="contained"
          sx={{
            backgroundColor: 'white',
            color: '#d4a574',
            fontWeight: 600,
            padding: '12px 30px',
            fontSize: '1.1rem',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          Shop Now
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#d4a574', mb: 1 }}>
            100% Natural
          </Typography>
          <Typography variant="body2" color="textSecondary">
            All ingredients are organic and naturally sourced
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#d4a574', mb: 1 }}>
            Fast Delivery
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Quick and reliable shipping to your doorstep
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#d4a574', mb: 1 }}>
            Secure Payment
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Safe Cash on Delivery payment method
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#d4a574', mb: 1 }}>
            Customer Support
          </Typography>
          <Typography variant="body2" color="textSecondary">
            24/7 support for all your questions
          </Typography>
        </Box>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
          Ready to Glow Naturally?
        </Typography>
        {!isAuthenticated ? (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/auth/signin"
              variant="contained"
              sx={{
                backgroundColor: '#d4a574',
                color: '#2c2416',
                fontWeight: 600,
                padding: '12px 30px',
              }}
            >
              Sign In
            </Button>
            <Button
              component={Link}
              href="/auth/signup"
              variant="outlined"
              sx={{
                borderColor: '#d4a574',
                color: '#d4a574',
                fontWeight: 600,
                padding: '12px 30px',
              }}
            >
              Create Account
            </Button>
          </Box>
        ) : (
          <Button
            component={Link}
            href="/products"
            variant="contained"
            sx={{
              backgroundColor: '#d4a574',
              color: '#2c2416',
              fontWeight: 600,
              padding: '12px 30px',
            }}
          >
            Browse Products
          </Button>
        )}
      </Box>
    </Container>
  );
}
