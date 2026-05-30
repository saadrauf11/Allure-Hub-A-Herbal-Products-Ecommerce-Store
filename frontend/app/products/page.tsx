'use client';

import {
  Container,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  AlertColor,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { productAPI, cartAPI } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/hooks/useAuth';

export default function Products() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as AlertColor });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [search, category, products]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);

      // Extract unique categories from populated objects
      const uniqueCategories = [...new Set(response.data.map((p) => p.category?.name).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load products',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      // Check against the category name
      filtered = filtered.filter((p) => p.category?.name === category);
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (productId, quantity) => {
    if (!isAuthenticated) {
      window.location.href = '/auth/signin';
      return;
    }

    try {
      await cartAPI.add({ productId, quantity });
      setSnackbar({
        open: true,
        message: 'Added to cart!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to add to cart',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ fontWeight: 600, mb: 4 }}>
        Our Products
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 4 }}>
        <TextField
          label="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          SelectProps={{
            native: true,
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </TextField>
      </Box>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="textSecondary">
            No products found
          </Typography>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity as AlertColor}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

