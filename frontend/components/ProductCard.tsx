'use client';

import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export const ProductCard = ({ product, onAddToCart }) => {
  const { isAuthenticated } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddClick = () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/signin';
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirmAdd = async () => {
    await onAddToCart(product._id, quantity);
    setOpenDialog(false);
    setQuantity(1);
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <CardMedia
          component="img"
          height="250"
          image={`http://localhost:5000/images/${product.image}`}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/250x250?text=Product+Image';
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#d4a574', fontWeight: 600 }}>
              ${product.price}
            </Typography>
            <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error'}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#d4a574',
              color: '#2c2416',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#c49564',
              },
              '&:disabled': {
                backgroundColor: '#ccc',
              },
            }}
            onClick={handleAddClick}
            disabled={product.stock === 0}
          >
            Add to Cart
          </Button>
        </CardActions>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add to Cart</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, mt: 1 }}>
            {product.name}
          </Typography>
          <TextField
            label="Quantity"
            type="number"
            inputProps={{ min: 1, max: product.stock }}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmAdd}
            variant="contained"
            sx={{
              backgroundColor: '#d4a574',
              color: '#2c2416',
            }}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

