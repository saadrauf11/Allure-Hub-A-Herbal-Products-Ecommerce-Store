require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const seedDatabase = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/alurehub');
    console.log('MongoDB connected for seeding to:', mongoose.connection.db.databaseName);

    // Clear existing data
    const resProd = await Product.deleteMany({});
    const resCat = await Category.deleteMany({});
    const resUser = await User.deleteMany({});
    console.log('Database cleared:', resProd.deletedCount, resCat.deletedCount, resUser.deletedCount);

    // Create Admin User
    const admin = new User({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'saadrauf',
        role: 'admin'
    });
    await admin.save();
    console.log('Admin user seeded');

    // Define and create categories
    const categories = [
      { name: 'Skincare', description: 'Face and body skincare products' },
      { name: 'Makeup', description: 'Cosmetics and beauty enhancements' },
      { name: 'Haircare', description: 'Shampoos, conditioners, and treatments' },
      { name: 'Body Care', description: 'Lotions, scrubs, and bath products' },
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded:', createdCategories.length);

    // Helper to get category ID
    const getCatId = (name) => createdCategories.find(c => c.name === name)._id;

    // Define 20 products
    const products = [
      { name: 'Rose Serum', description: 'Hydrating', price: 25, category: getCatId('Skincare'), stock: 50, image: 'sample.jpg' },
      { name: 'Vitamin C Cream', description: 'Brightening', price: 30, category: getCatId('Skincare'), stock: 40, image: 'sample.jpg' },
      { name: 'Retinol Night Cream', description: 'Anti-aging', price: 35, category: getCatId('Skincare'), stock: 30, image: 'sample.jpg' },
      { name: 'Aloe Gel', description: 'Soothing', price: 12, category: getCatId('Skincare'), stock: 80, image: 'sample.jpg' },
      { name: 'Clay Mask', description: 'Deep clean', price: 21, category: getCatId('Skincare'), stock: 35, image: 'sample.jpg' },

      { name: 'Matte Lipstick', description: 'Long-lasting', price: 15, category: getCatId('Makeup'), stock: 100, image: 'sample.jpg' },
      { name: 'Volumizing Mascara', description: 'Bold lashes', price: 18, category: getCatId('Makeup'), stock: 60, image: 'sample.jpg' },
      { name: 'Eyeshadow Palette', description: '12 shades', price: 40, category: getCatId('Makeup'), stock: 20, image: 'sample.jpg' },
      { name: 'Foundation Primer', description: 'Smooth base', price: 24, category: getCatId('Makeup'), stock: 45, image: 'sample.jpg' },
      { name: 'Setting Spray', description: 'Lock makeup', price: 17, category: getCatId('Makeup'), stock: 65, image: 'sample.jpg' },

      { name: 'Argan Shampoo', description: 'Nourishing', price: 22, category: getCatId('Haircare'), stock: 35, image: 'sample.jpg' },
      { name: 'Silk Hair Mask', description: 'Softness', price: 28, category: getCatId('Haircare'), stock: 25, image: 'sample.jpg' },
      { name: 'Hair Serum', description: 'Tames frizz', price: 26, category: getCatId('Haircare'), stock: 40, image: 'sample.jpg' },
      { name: 'Detangling Spray', description: 'Easy comb', price: 16, category: getCatId('Haircare'), stock: 70, image: 'sample.jpg' },
      { name: 'Sulfate-Free Conditioner', description: 'Gentle', price: 23, category: getCatId('Haircare'), stock: 45, image: 'sample.jpg' },

      { name: 'Lavender Bath Bomb', description: 'Relaxing', price: 10, category: getCatId('Body Care'), stock: 150, image: 'sample.jpg' },
      { name: 'Shea Butter Lotion', description: 'Moisturizing', price: 20, category: getCatId('Body Care'), stock: 55, image: 'sample.jpg' },
      { name: 'Coconut Scrub', description: 'Exfoliating', price: 19, category: getCatId('Body Care'), stock: 50, image: 'sample.jpg' },
      { name: 'Vanilla Mist', description: 'Refreshing', price: 14, category: getCatId('Body Care'), stock: 90, image: 'sample.jpg' },
      { name: 'Exfoliating Soap', description: 'Gentle scrub', price: 8, category: getCatId('Body Care'), stock: 120, image: 'sample.jpg' },
    ];
    const insertedProducts = await Product.insertMany(products);
    console.log('Products seeded:', insertedProducts.length);

    // Explicitly flush to DB
    await mongoose.connection.syncIndexes();
    console.log('Finished seeding');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

