'use client';

import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productAPI } from '@/services/api';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      // Assume 'id' matches the category name in lowercase for demo purposes
      // or you should fetch category by ID from an API if available.
      const filtered = response.data.filter(p =>
        p.category?.name.toLowerCase().replace(' ', '-') === id
      );
      setProducts(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>Category: {products[0]?.category?.name || 'Unknown'}</Typography>
      {products.length === 0 ? <Alert severity="info">No products in this category.</Alert> : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
          {products.map(p => (
            <Box key={p._id} component={Link} href={`/products/${p._id}`}>
               <ProductCard product={p} onAddToCart={() => {}} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}

