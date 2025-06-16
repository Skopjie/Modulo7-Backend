const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productController');
const { validateProduct } = require('../middlewares/validationMiddleware');
const { authMiddleware } = require('../middlewares/authentificationMiddleware');


router.get('/', productosController.getProducts);
router.get('/:id', productosController.getProductById);

router.post('/', authMiddleware, validateProduct, productosController.postProduct);
router.put('/:id', authMiddleware, validateProduct, productosController.putProduct);
router.delete('/:id', authMiddleware, productosController.deleteProduct);

module.exports = router;
