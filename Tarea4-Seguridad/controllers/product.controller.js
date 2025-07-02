const Product = require('../models/product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, fechaCreacion } = req.body;
    const newProduct = await Product.create({ nombre, descripcion, precio, fechaCreacion });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto', error });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, fechaCreacion } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    await product.update({ nombre, descripcion, precio, fechaCreacion });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto', error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    await product.destroy();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el producto', error });
  }
};
