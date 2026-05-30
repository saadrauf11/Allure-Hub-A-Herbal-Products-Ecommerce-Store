'use client';

import { Container, Box, Typography, Button, Paper } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { productAPI } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data.slice(0, 4));
    } catch (err) { console.error(err); }
  };

  return (
    <Container maxWidth="lg">
      {/* Slider Hero Section */}
      <Box sx={{ py: 8, textAlign: 'center', backgroundColor: '#2c2416', color: 'white', mb: 6, borderRadius: 2 }}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#d4a574' }}>
          Pure Natural Beauty
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Elevate your daily skincare routine with AlureHub's finest.
        </Typography>
        <Button component={Link} href="/products" variant="contained" sx={{ backgroundColor: '#d4a574' }}>
          Explore Collection
        </Button>
      </Box>

      {/* Category List */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>Browse by Category</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 8 }}>
        {['Skincare', 'Makeup', 'Haircare', 'Body Care'].map((catName) => (
          <Paper
              component={Link}
            href={`/categories/${catName.toLowerCase().replace(' ', '-')}`}
            key={catName}
            sx={{ p: 4, textAlign: 'center', textDecoration: 'none', color: 'inherit', '&:hover': { backgroundColor: '#f5f5f5' } }}
            >
            <Typography variant="h6">{catName}</Typography>
          </Paper>
        ))}
          </Box>

      {/* Featured Products */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>Featured Products</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 8 }}>
        {products.map((p) => (
          <Link href={`/products/${p._id}`} key={p._id} style={{ textDecoration: 'none' }}>
            <ProductCard product={p} onAddToCart={() => {}} />
          </Link>
        ))}
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

