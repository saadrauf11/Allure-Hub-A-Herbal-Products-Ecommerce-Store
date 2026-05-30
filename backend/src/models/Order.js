const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        productName: String,
        quantity: Number,
        price: Number,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered'],
      default: 'pending',
    },
    totalPrice: Number,
    shippingAddress: String,
    contactNumber: String,
    paymentMethod: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

