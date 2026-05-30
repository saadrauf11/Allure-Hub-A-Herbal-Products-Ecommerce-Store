require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const connectDB = require('./src/config/db');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');
    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Database cleared');

    // Define and create categories
    const categories = [
      { name: 'Skincare', description: 'Face and body skincare products' },
      { name: 'Makeup', description: 'Cosmetics and beauty enhancements' },
      { name: 'Haircare', description: 'Shampoos, conditioners, and treatments' },
      { name: 'Body', description: 'Lotions, scrubs, and bath products' },
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded');

    // Helper to get category ID
    const getCatId = (name) => createdCategories.find(c => c.name === name)._id;

    // Define products with valid category ObjectIds
    const products = [
      { name: 'Hydrating Rose Serum', description: 'Deep hydration', price: 25, category: getCatId('Skincare'), stock: 50, image: 'sample.jpg' },
      { name: 'Matte Liquid Lipstick', description: 'Long-lasting', price: 15, category: getCatId('Makeup'), stock: 100, image: 'sample.jpg' },
      { name: 'Argan Oil Shampoo', description: 'Nourishing care', price: 22, category: getCatId('Haircare'), stock: 35, image: 'sample.jpg' },
      { name: 'Lavender Bath Bomb', description: 'Relaxing spa', price: 10, category: getCatId('Body'), stock: 150, image: 'sample.jpg' },
    ];
    await Product.insertMany(products);
    console.log('Products seeded');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

