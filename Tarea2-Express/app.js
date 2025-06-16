require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const productoRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authenticationRoutes');
const { errorHandlerMiddleware } = require('./middlewares/errorHandlerMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
