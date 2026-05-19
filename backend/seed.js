require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const connectDB = require('./src/config/db');

const beautyProducts = [
  {
    name: 'Organic Rose Face Oil',
    description: 'Pure organic rose oil for radiant and glowing skin. Rich in antioxidants.',
    price: 25.99,
    image: 'sample.jpg',
    category: 'Face Oils',
    stock: 50,
  },
  {
    name: 'Lavender Essential Oil',
    description: 'Premium lavender oil for relaxation and skincare. 100% pure.',
    price: 18.50,
    image: 'sample.jpg',
    category: 'Essential Oils',
    stock: 60,
  },
  {
    name: 'Organic Coconut Oil',
    description: 'Cold-pressed virgin coconut oil for hair and body care.',
    price: 15.99,
    image: 'sample.jpg',
    category: 'Body Care',
    stock: 80,
  },
  {
    name: 'Shea Butter Cream',
    description: 'Rich shea butter cream for dry and sensitive skin.',
    price: 22.50,
    image: 'sample.jpg',
    category: 'Moisturizers',
    stock: 45,
  },
  {
    name: 'Green Tea Face Mask',
    description: 'Detoxifying face mask with green tea extract.',
    price: 28.99,
    image: 'sample.jpg',
    category: 'Face Masks',
    stock: 35,
  },
  {
    name: 'Aloe Vera Gel',
    description: 'Pure aloe vera gel for soothing and hydration.',
    price: 16.50,
    image: 'sample.jpg',
    category: 'Serums',
    stock: 70,
  },
  {
    name: 'Jojoba Oil Serum',
    description: 'Lightweight jojoba oil serum for all skin types.',
    price: 24.99,
    image: 'sample.jpg',
    category: 'Face Serums',
    stock: 55,
  },
  {
    name: 'Turmeric Face Scrub',
    description: 'Gentle exfoliating scrub with turmeric and honey.',
    price: 19.99,
    image: 'sample.jpg',
    category: 'Exfoliants',
    stock: 40,
  },
  {
    name: 'Organic Charcoal Mask',
    description: 'Activated charcoal mask for deep pore cleansing.',
    price: 26.50,
    image: 'sample.jpg',
    category: 'Face Masks',
    stock: 50,
  },
  {
    name: 'Tea Tree Oil',
    description: 'Pure tea tree oil for acne-prone skin.',
    price: 17.99,
    image: 'sample.jpg',
    category: 'Essential Oils',
    stock: 65,
  },
  {
    name: 'Argan Oil Hair Treatment',
    description: 'Premium argan oil for hair nourishment and shine.',
    price: 29.99,
    image: 'sample.jpg',
    category: 'Hair Care',
    stock: 42,
  },
  {
    name: 'Vitamin C Brightening Serum',
    description: 'Powerful vitamin C serum for brightening skin.',
    price: 35.99,
    image: 'sample.jpg',
    category: 'Face Serums',
    stock: 38,
  },
  {
    name: 'Honey & Oat Face Wash',
    description: 'Gentle face wash with honey and oatmeal.',
    price: 14.99,
    image: 'sample.jpg',
    category: 'Cleansers',
    stock: 75,
  },
  {
    name: 'Rose Hip Oil',
    description: 'Anti-aging rose hip oil rich in vitamin A.',
    price: 32.50,
    image: 'sample.jpg',
    category: 'Face Oils',
    stock: 48,
  },
  {
    name: 'Calendula Healing Cream',
    description: 'Soothing cream with calendula for sensitive skin.',
    price: 23.99,
    image: 'sample.jpg',
    category: 'Moisturizers',
    stock: 52,
  },
  {
    name: 'Neem Oil Skin Treatment',
    description: 'Natural neem oil for acne and skin problems.',
    price: 20.50,
    image: 'sample.jpg',
    category: 'Treatments',
    stock: 58,
  },
  {
    name: 'Hyaluronic Acid Serum',
    description: 'Hydrating hyaluronic acid serum for plump skin.',
    price: 38.99,
    image: 'sample.jpg',
    category: 'Face Serums',
    stock: 44,
  },
  {
    name: 'Organic Lip Balm',
    description: 'Natural lip balm with beeswax and essential oils.',
    price: 8.99,
    image: 'sample.jpg',
    category: 'Lip Care',
    stock: 100,
  },
  {
    name: 'Body Butter Lotion',
    description: 'Rich body butter with shea and cacao.',
    price: 21.99,
    image: 'sample.jpg',
    category: 'Body Care',
    stock: 60,
  },
  {
    name: 'Retinol Night Cream',
    description: 'Anti-aging retinol night cream for mature skin.',
    price: 42.99,
    image: 'sample.jpg',
    category: 'Night Creams',
    stock: 36,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});

    // Insert products
    await Product.insertMany(beautyProducts);

    console.log('Database seeded successfully with 20 beauty products');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
