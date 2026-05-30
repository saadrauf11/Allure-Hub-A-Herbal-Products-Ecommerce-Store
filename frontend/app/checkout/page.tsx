'use client';

import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  AlertColor,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cartAPI, orderAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CheckoutContent = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({ address: '', phone: '' });
  const [orderConfirm, setOrderConfirm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
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

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      setSnackbar({
        open: true,
        message: 'Your cart is empty',
        severity: 'error',
      });
      return;
    }
    if (!shippingDetails.address || !shippingDetails.phone) {
      setSnackbar({ open: true, message: 'Please provide address and contact number', severity: 'error' });
      return;
    }

    setProcessing(true);
    try {
      await orderAPI.checkout({ shipping: shippingDetails });
      setOrderSuccess(true);
      setOrderConfirm(false);
      
      setTimeout(() => {
        router.push('/account/orders');
      }, 3000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to place order',
        severity: 'error',
      });
    } finally {
      setProcessing(false);
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

  const total = calculateTotal();

  if (orderSuccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleIcon
            sx={{ fontSize: 80, color: '#4caf50', mb: 2 }}
          />
          <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Thank you for your order. You will receive a confirmation email shortly.
            Redirecting to your orders...
          </Typography>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" color="textSecondary" sx={{ mb: 3 }}>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#d4a574',
              color: '#2c2416',
              fontWeight: 600,
            }}
            onClick={() => router.push('/products')}
          >
            Back to Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ fontWeight: 600, mb: 4 }}>
        Checkout
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        {/* Order Items */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Order Summary
          </Typography>
          <List>
            {cart.items.map((item) => (
              <ListItem key={item._id} disablePadding sx={{ mb: 2 }}>
                <ListItemText
                  primary={item.productId?.name}
                  secondary={`Quantity: ${item.quantity} × $${item.productId?.price} = $${(item.productId?.price * item.quantity).toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Payment Method */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Payment Method
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                💳 Cash on Delivery (COD)
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Pay when you receive your order. No prepayment required.
              </Typography>
            </Paper>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Delivery Address */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Delivery Information
            </Typography>
            <TextField
            fullWidth
              label="Shipping Address"
              margin="normal"
              value={shippingDetails.address}
              onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
              required
            />
            <TextField
            fullWidth
              label="Contact Number"
              margin="normal"
              value={shippingDetails.phone}
              onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
              required
            />
          </Box>
        </Paper>

        {/* Order Total */}
        <Paper sx={{ p: 3, height: 'fit-content' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Order Total
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>${total.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography>Free</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Tax:</Typography>
              <Typography>$0</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
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
            size="large"
            sx={{
              backgroundColor: '#d4a574',
              color: '#2c2416',
              fontWeight: 600,
              mb: 2,
            }}
            onClick={() => setOrderConfirm(true)}
            disabled={processing}
      >
            Place Order
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => router.back()}
            disabled={processing}
          >
            Back to Cart
          </Button>
        </Paper>
      </Box>

      {/* Confirm Dialog */}
      <Dialog open={orderConfirm} onClose={() => setOrderConfirm(false)}>
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to place this order?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Payment method: Cash on Delivery
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 2, color: '#d4a574' }}>
            Total: ${total.toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderConfirm(false)}>Cancel</Button>
          <Button
            onClick={handlePlaceOrder}
            variant="contained"
            sx={{
              backgroundColor: '#d4a574',
              color: '#2c2416',
            }}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Confirm Order'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}

