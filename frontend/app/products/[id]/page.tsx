'use client';

import { Container, Typography, Box, CircularProgress, Button, Paper, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productAPI, cartAPI } from '@/services/api';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getById(id);
      setProduct(response.data);

      // Fetch all to find similar ones
      const all = await productAPI.getAll();
      const similar = all.data.filter(p =>
        p.category?._id === response.data.category?._id && p._id !== id
      ).slice(0, 4);
      setSimilarProducts(similar);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (!product) return <Typography>Product not found.</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, display: 'flex', gap: 4, mb: 6 }}>
        <Box component="img" src={`http://localhost:5000/images/${product.image}`} sx={{ width: '40%', height: 'auto', borderRadius: 2 }} />
        <Box>
          <Typography variant="h3">{product.name}</Typography>
          <Typography
            component={Link}
            href={`/categories/${product.category?.name.toLowerCase().replace(' ', '-')}`}
            variant="subtitle1"
            sx={{ color: '#d4a574', textDecoration: 'none', display: 'block', mb: 2 }}
          >
            Category: {product.category?.name}
          </Typography>
          <Typography variant="h5" color="textSecondary" sx={{ mb: 2 }}>${product.price}</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>{product.description}</Typography>
          <Button variant="contained" sx={{ backgroundColor: '#d4a574' }} onClick={() => cartAPI.add({ productId: product._id, quantity: 1 })}>Add to Cart</Button>
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h4" sx={{ mb: 3 }}>Similar Products</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
        {similarProducts.map(p => (
            <Box key={p._id} component={Link} href={`/products/${p._id}`} sx={{ textDecoration: 'none' }}>
               <ProductCard product={p} onAddToCart={() => {}} />
            </Box>
        ))}
      </Box>
    </Container>
  );
}

