const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { checkCache } = require('../middleware/cacheMiddleware');

router.get(
  '/',
  (req, res, next) => {
    req.cacheKey = 'all_products';
    next();
  },
  checkCache,
  getAllProducts
);

router.get(
  '/:id',
  (req, res, next) => {
    req.cacheKey = `product_${req.params.id}`;
    next();
  },
  checkCache,
  getProductById
);

router.post('/', createProduct);

router.put('/:id', updateProduct);

router.delete('/:id', deleteProduct);

module.exports = router;
