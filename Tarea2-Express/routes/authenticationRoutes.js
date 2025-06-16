const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const userDemo = {
  username: 'admin',
  password: 'password123'
};

router.post(
  '/login',
  [
    body('username').isString().notEmpty().withMessage('username es obligatorio'),
    body('password').isString().notEmpty().withMessage('password es obligatorio')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    const { username, password } = req.body;
    if (username !== userDemo.username || password !== userDemo.password) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const payload = { username: userDemo.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  }
);

module.exports = router;
