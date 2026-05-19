const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { verifyToken, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images allowed.'));
    }
  },
});

// Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, adminOnly, upload.single('image'), createProduct);
router.put('/:id', verifyToken, adminOnly, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, adminOnly, deleteProduct);

module.exports = router;
