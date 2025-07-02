const express = require('express');
const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
