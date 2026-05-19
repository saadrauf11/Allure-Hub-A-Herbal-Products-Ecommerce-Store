const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, getCart);
router.post('/', verifyToken, addToCart);
router.delete('/:itemId', verifyToken, removeFromCart);
router.put('/:itemId', verifyToken, updateCartItem);
router.delete('/', verifyToken, clearCart);

module.exports = router;
