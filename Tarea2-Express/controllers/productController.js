const { getAll, getById, create, update, remove } = require('../models/productModel');

// GET /api/productos
async function getProducts(req, res, next) {
  try {
    const productos = await getAll();
    res.json(productos);
  } catch (err) {
    next(err);
  }
}

// GET /api/productos/:id
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const producto = await getById(id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (err) {
    next(err);
  }
}

// POST /api/productos
async function postProduct(req, res, next) {
  try {
    const newProducto = {
      id: Date.now().toString(), 
      nombre: req.body.nombre,
      descripcion: req.body.descripcion || '',
      precio: req.body.precio,
      fechaCreacion: req.body.fechaCreacion
    };
    const creado = await create(newProducto);
    res.status(201).json(creado);
  } catch (err) {
    next(err);
  }
}

// PUT /api/productos/:id
async function putProduct(req, res, next) {
  try {
    const { id } = req.params;
    const datosActualizados = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion || '',
      precio: req.body.precio,
      fechaCreacion: req.body.fechaCreacion
    };
    const productoActualizado = await update(id, datosActualizados);
    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado para update' });
    }
    res.json(productoActualizado);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/productos/:id
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const exito = await remove(id);
    if (!exito) {
      return res.status(404).json({ mensaje: 'Producto no encontrado para eliminar' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProducts,
  getProductById,
  postProduct,
  putProduct,
  deleteProduct
};
