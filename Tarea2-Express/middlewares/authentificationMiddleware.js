const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Falta el header Authorization' });
  }

  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ mensaje: 'Formato de token inválido. Debe ser: Bearer <token>' });
  }

  const token = partes[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { username: payload.username };
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

module.exports = { authMiddleware };
