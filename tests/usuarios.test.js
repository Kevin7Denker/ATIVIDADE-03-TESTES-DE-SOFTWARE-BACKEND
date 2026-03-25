process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');

describe('Usuários', () => {
  test('retorna 404 para rota ainda não implementada', async () => {
    const res = await request(app).get('/usuarios');

    expect(res.status).toBe(404);
  });

  test('responde com cabeçalho CORS para origem permitida', async () => {
    const res = await request(app)
      .options('/livros')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET');

    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });
});
