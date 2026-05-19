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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Snackbar,
  Alert,
  AlertColor,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { orderAPI } from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import CancelIcon from '@mui/icons-material/Cancel';

const OrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as AlertColor });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getByUser();
      setOrders(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load orders',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setOpenCancel(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrder) return;

    setCanceling(true);
    try {
      await orderAPI.cancel(selectedOrder._id);
      setSnackbar({
        open: true,
        message: 'Order cancelled successfully',
        severity: 'success' as AlertColor,
      });
      setOpenCancel(false);
      fetchOrders();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to cancel order',
        severity: 'error' as AlertColor,
      });
    } finally {
      setCanceling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'sent':
        return 'info';
      case 'delivered':
        return 'success';
      default:
        return 'default';
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
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="textSecondary">
            You haven't placed any orders yet
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell sx={{ fontFamily: 'monospace' }}>
                    {order._id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#d4a574' }}>
                    ${order.totalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell>{order.items.length} item(s)</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      onClick={() => handleViewDetails(order)}
                      variant="text"
                    >
                      View
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleCancelClick(order)}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Details Dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Order ID:</strong> {selectedOrder._id}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Status:</strong> <Chip label={selectedOrder.status} color={getStatusColor(selectedOrder.status)} size="small" />
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
                Items
              </Typography>
              {selectedOrder.items.map((item, index) => (
                <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2">
                    <strong>{item.productName}</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Quantity: {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '2px solid #eee' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#d4a574' }}>
                  ${selectedOrder.totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to cancel this order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancel(false)}>Keep Order</Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
            disabled={canceling}
          >
            {canceling ? 'Canceling...' : 'Cancel Order'}
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

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
