const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const sequelize = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const redisClient = require('./config/redisClient'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/products', productRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL');
    await sequelize.sync({ alter: true });

    console.log('Sequelize models synced');
    console.log('Redis status:', redisClient.isOpen ? 'Ready' : 'Not ready');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
