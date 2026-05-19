const express = require('express');
const {
  checkout,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { verifyToken, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/checkout', verifyToken, checkout);
router.get('/', verifyToken, getOrdersByUser);
router.get('/admin/all', verifyToken, adminOnly, getAllOrders);
router.put('/:id', verifyToken, adminOnly, updateOrderStatus);
router.delete('/:id', verifyToken, cancelOrder);

module.exports = router;
