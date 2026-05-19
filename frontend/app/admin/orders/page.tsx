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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  AlertColor,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { orderAPI } from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import EditIcon from '@mui/icons-material/Edit';

const OrderManagementContent = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as AlertColor });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
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
    setEditStatus(order.status);
    setOpenDetail(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    setSubmitting(true);
    try {
      await orderAPI.updateStatus(selectedOrder._id, { status: editStatus });
      setSnackbar({
        open: true,
        message: 'Order status updated successfully',
        severity: 'success' as AlertColor,
      });
      setOpenDetail(false);
      fetchOrders();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update order',
        severity: 'error' as AlertColor,
      });
    } finally {
      setSubmitting(false);
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

  if (!isAdmin) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="error">Access Denied: Admin only</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ fontWeight: 600, mb: 4 }}>
        Order Management
      </Typography>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="textSecondary">
            No orders yet
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell sx={{ fontFamily: 'monospace' }}>
                    {order._id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.userId?.name || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {order.userId?.email}
                    </Typography>
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
                      startIcon={<EditIcon />}
                      onClick={() => handleViewDetails(order)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Order Details & Manage Status</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Order ID:</strong> {selectedOrder._id}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Customer:</strong> {selectedOrder.userId?.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Email:</strong> {selectedOrder.userId?.email}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
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

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '2px solid #eee', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#d4a574' }}>
                  ${selectedOrder.totalPrice.toFixed(2)}
                </Typography>
              </Box>

              {/* Status Update */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Update Order Status
                </Typography>
                <Select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="sent">Sent for Delivery</MenuItem>
                  <MenuItem value="delivered">Delivered / Completed</MenuItem>
                </Select>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Close</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            sx={{
              backgroundColor: '#d4a574',
              color: '#2c2416',
            }}
            disabled={submitting || editStatus === selectedOrder?.status}
          >
            {submitting ? 'Updating...' : 'Update Status'}
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

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute adminOnly>
      <OrderManagementContent />
    </ProtectedRoute>
  );
}
