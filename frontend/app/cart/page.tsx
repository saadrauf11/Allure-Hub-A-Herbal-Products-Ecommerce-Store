'use client';

import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Typography,
  TextField,
  Card,
  CircularProgress,
  Snackbar,
  Alert,
  AlertColor,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cartAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DeleteIcon from '@mui/icons-material/Delete';

const CartContent = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as AlertColor });

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load cart',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(true);
    try {
      const response = await cartAPI.update(itemId, { quantity: newQuantity });
      setCart(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update quantity',
        severity: 'error',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await cartAPI.remove(itemId);
      setCart(response.data);
      setSnackbar({
        open: true,
        message: 'Item removed from cart',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to remove item',
        severity: 'error',
      });
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0);
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

  const total = calculateTotal();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ fontWeight: 600, mb: 4 }}>
        Shopping Cart
      </Typography>

      {!cart || cart.items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="textSecondary" sx={{ mb: 3 }}>
            Your cart is empty
          </Typography>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            sx={{
              backgroundColor: '#d4a574',
              color: '#2c2416',
              fontWeight: 600,
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
          {/* Cart Items */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.productId?.name}</TableCell>
                    <TableCell align="right">${item.productId?.price}</TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        slotProps={{
                          htmlInput: { min: 1 },
                        }}
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(item._id, parseInt(e.target.value))
                        }
                        disabled={updating}
                        size="small"
                        sx={{ width: 70 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      ${(item.productId?.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveItem(item._id)}
                        startIcon={<DeleteIcon />}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Order Summary */}
          <Card sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Order Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Shipping:</Typography>
                <Typography>Free</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid #eee',
                pt: 2,
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Total:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#d4a574' }}>
                ${total.toFixed(2)}
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              href="/checkout"
              sx={{
                backgroundColor: '#d4a574',
                color: '#2c2416',
                fontWeight: 600,
                mb: 2,
              }}
            >
              Proceed to Checkout
            </Button>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href="/products"
            >
              Continue Shopping
            </Button>
          </Card>
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
};

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}
