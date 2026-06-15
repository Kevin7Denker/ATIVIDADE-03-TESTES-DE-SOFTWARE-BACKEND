process.env.NODE_ENV = 'test';

const request = require('supertest');
const crypto = require('crypto');
const { sequelize, Usuario } = require('../src/models');

const app = require('../src/versions/v1/app');

const hashSenha = (senha) => crypto.createHash('sha256').update(senha).digest('hex');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await Usuario.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Versão v1 - Usuários', () => {
  test('cria um usuário e retorna os dados esperados', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Ana Silva',
        email: 'ana@exemplo.com',
        senha: '123456',
        tipo: 'leitor',
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      nome: 'Ana Silva',
      email: 'ana@exemplo.com',
      tipo: 'leitor',
    });
    expect(res.body.senha).toBe(hashSenha('123456'));
  });

  test('retorna 400 quando faltar campo obrigatório', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Ana Silva',
        email: 'ana@exemplo.com',
        senha: '123456',
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ erro: 'todos os campos são obrigatórios' });
  });

  test('lista usuários cadastrados', async () => {
    await request(app)
      .post('/usuarios')
      .send({
        nome: 'Ana Silva',
        email: 'ana@exemplo.com',
        senha: '123456',
        tipo: 'leitor',
      });

    const res = await request(app).get('/usuarios');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      nome: 'Ana Silva',
      email: 'ana@exemplo.com',
      tipo: 'leitor',
    });
  });

  test('busca usuário por id', async () => {
    const created = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Ana Silva',
        email: 'ana@exemplo.com',
        senha: '123456',
        tipo: 'leitor',
      });

    const res = await request(app).get(`/usuarios/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: created.body.id,
      nome: 'Ana Silva',
      email: 'ana@exemplo.com',
      tipo: 'leitor',
    });
  });

  test('retorna 404 quando usuário não existe', async () => {
    const res = await request(app).get('/usuarios/99999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ erro: 'Usuário não encontrado' });
  });

  test('atualiza um usuário existente', async () => {
    const created = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Ana Silva',
        email: 'ana@exemplo.com',
        senha: '123456',
        tipo: 'leitor',
      });

    const res = await request(app)
      .put(`/usuarios/${created.body.id}`)
      .send({
        nome: 'Ana Souza',
        email: 'ana@exemplo.com',
        senha: '654321',
        tipo: 'admin',
      });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: created.body.id,
      nome: 'Ana Souza',
      email: 'ana@exemplo.com',
      tipo: 'admin',
    });
    expect(res.body.senha).toBe(hashSenha('654321'));
  });

  test('remove um usuário existente', async () => {
    const created = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Ana Silva',
        email: 'ana@exemplo.com',
        senha: '123456',
        tipo: 'leitor',
      });

    const res = await request(app).delete(`/usuarios/${created.body.id}`);

    expect(res.status).toBe(204);
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
