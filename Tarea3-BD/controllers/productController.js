const Product = require('../models/Product');
const redisClient = require('../config/redisClient');
const { clearCache } = require('../middleware/cacheMiddleware');


const ALL_PRODUCTS_CACHE_KEY = 'all_products';
const PRODUCT_BY_ID_CACHE = id => `product_${id}`;
const CACHE_TTL_SECONDS = 1800; // 30 minutos


async function getAllProducts(req, res) {
  try {
    const products = await Product.findAll();

    await redisClient.setEx(
      ALL_PRODUCTS_CACHE_KEY,
      CACHE_TTL_SECONDS,
      JSON.stringify(products)
    );

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getProductById(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await redisClient.setEx(
      PRODUCT_BY_ID_CACHE(id),
      CACHE_TTL_SECONDS,
      JSON.stringify(product)
    );

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function createProduct(req, res) {
  const { id, nombre, descripcion, precio, fechaCreacion } = req.body;
  try {
    const newProduct = await Product.create({
      id,
      nombre,
      descripcion,
      precio,
      fechaCreacion
    });

    await clearCache(ALL_PRODUCTS_CACHE_KEY);

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { nombre, descripcion, precio, fechaCreacion } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.nombre = nombre || product.nombre;
    product.descripcion = descripcion || product.descripcion;
    product.precio = precio || product.precio;
    product.fechaCreacion = fechaCreacion || product.fechaCreacion;

    await product.save();

    await clearCache([ALL_PRODUCTS_CACHE_KEY, PRODUCT_BY_ID_CACHE(id)]);

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const deletedCount = await Product.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await clearCache([ALL_PRODUCTS_CACHE_KEY, PRODUCT_BY_ID_CACHE(id)]);

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
