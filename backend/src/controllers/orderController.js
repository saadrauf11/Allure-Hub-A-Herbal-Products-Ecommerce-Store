const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Checkout - Create order from cart
exports.checkout = async (req, res) => {
  try {
    const { shipping } = req.body;
    const cart = await Cart.findOne({ userId: req.userId }).populate(
      'items.productId'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total and prepare order items
    let totalPrice = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = cartItem.productId;

      // Check stock
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const itemTotal = product.price * cartItem.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: cartItem.quantity,
        price: product.price,
      });

      // Reduce product stock
      product.stock -= cartItem.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      userId: req.userId,
      items: orderItems,
      totalPrice,
      shippingAddress: shipping?.address,
      contactNumber: shipping?.phone,
      paymentMethod: 'COD',
      status: 'pending',
    });

    await order.save();

    // Clear cart
    await Cart.findOneAndUpdate({ userId: req.userId }, { items: [] });

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's orders
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'sent', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order (buyer)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only owner can cancel
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Can only cancel pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        message: 'Can only cancel pending orders',
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

