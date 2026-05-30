const express = require('express');
const { getAllCategories, createCategory } = require('../controllers/categoryController');
const { verifyToken, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', verifyToken, adminOnly, createCategory);

module.exports = router;
