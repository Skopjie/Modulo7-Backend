const request = require('supertest');
const app = require('../app');
const Product = require('../models/product');
const sequelize = require('../config/database');

let token;
let productId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await request(app).post('/api/auth/register').send({
    username: 'admin',
    password: 'admin123',
  });

  const loginRes = await request(app).post('/api/auth/login').send({
    username: 'admin',
    password: 'admin123',
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Product Endpoints', () => {
  it('should create a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Zapatos',
        descripcion: 'Zapatos deportivos',
        precio: 49.99,
        fechaCreacion: '2024-06-10'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.nombre).toBe('Zapatos');
    productId = res.body.id;
  });

  it('should get all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete a product', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Producto eliminado correctamente');
  });
});
