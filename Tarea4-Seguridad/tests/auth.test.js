const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const User = require('../models/user');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth Endpoints', () => {
  it('should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'testpass',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Usuario registrado correctamente');
  });

  it('should login a user and return a token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'testpass',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });
});
