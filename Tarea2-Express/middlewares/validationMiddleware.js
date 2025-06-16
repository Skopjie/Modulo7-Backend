const Joi = require('joi');

const schemeProduct = Joi.object({
  nombre: Joi.string().min(3).required(),
  descripcion: Joi.string().allow('').optional(),
  precio: Joi.number().positive().required(),
  fechaCreacion: Joi.date().iso().required()
});

async function validateProduct(req, res, next) {
  try {
    await schemeProduct.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Error de validación en los datos del producto',
      detalles: error.details.map(det => det.message)
    });
  }
}

module.exports = { validateProduct };
