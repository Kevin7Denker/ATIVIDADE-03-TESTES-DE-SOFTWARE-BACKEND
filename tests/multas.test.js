process.env.NODE_ENV = 'test';

const request = require('supertest');
const { sequelize, Usuario, Livro, Emprestimo, Multa } = require('../src/models');

const app = require('../src/versions/v3/app');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await Multa.destroy({ where: {} });
  await Emprestimo.destroy({ where: {} });
  await Usuario.destroy({ where: {} });
  await Livro.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Versão v3 - Multas', () => {
  let usuarioId, livroId, emprestimoId;

  beforeEach(async () => {
    const usuario = await Usuario.create({
      nome: 'Maria Santos',
      email: 'maria@exemplo.com',
      senha: 'hash123',
      tipo: 'leitor',
    });
    usuarioId = usuario.id;

    const livro = await Livro.create({
      titulo: 'Design Patterns',
      autor: 'Gang of Four',
    });
    livroId = livro.id;

    const emprestimo = await Emprestimo.create({
      usuario_id: usuarioId,
      livro_id: livroId,
      data_devolucao_prevista: '2026-04-25',
    });
    emprestimoId = emprestimo.id;
  });

  test('cria uma multa e retorna os dados esperados', async () => {
    const res = await request(app)
      .post('/multas')
      .send({
        emprestimo_id: emprestimoId,
        valor: 50.00,
        data_multa: '2026-04-26',
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      emprestimo_id: emprestimoId,
      valor: 50,
    });
  });

  test('retorna 400 quando faltar campo obrigatório', async () => {
    const res = await request(app)
      .post('/multas')
      .send({
        emprestimo_id: emprestimoId,
        valor: 50.00,
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Todos os campos são obrigatórios' });
  });

  test('retorna 400 quando emprestimo não existe', async () => {
    const res = await request(app)
      .post('/multas')
      .send({
        emprestimo_id: 99999,
        valor: 50.00,
        data_multa: '2026-04-26',
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Emprestimo não encontrado' });
  });

  test('lista multas cadastradas', async () => {
    await request(app)
      .post('/multas')
      .send({
        emprestimo_id: emprestimoId,
        valor: 50.00,
        data_multa: '2026-04-26',
      });

    const res = await request(app).get('/multas');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      emprestimo_id: emprestimoId,
      valor: 50,
    });
  });

  test('busca multa por id', async () => {
    const created = await request(app)
      .post('/multas')
      .send({
        emprestimo_id: emprestimoId,
        valor: 50.00,
        data_multa: '2026-04-26',
      });

    const res = await request(app).get(`/multas/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: created.body.id,
      emprestimo_id: emprestimoId,
      valor: 50,
    });
  });

  test('retorna 404 quando multa não existe', async () => {
    const res = await request(app).get('/multas/99999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Multa não encontrada' });
  });

  test('busca multas por emprestimo_id', async () => {
    await request(app)
      .post('/multas')
      .send({
        emprestimo_id: emprestimoId,
        valor: 50.00,
        data_multa: '2026-04-26',
      });

    const res = await request(app).get(`/multas/getByEmprestimo/${emprestimoId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      emprestimo_id: emprestimoId,
      valor: 50,
    });
  });

  test('atualiza multa com data de pagamento', async () => {
    const created = await request(app)
      .post('/multas')
      .send({
        emprestimo_id: emprestimoId,
        valor: 50.00,
        data_multa: '2026-04-26',
      });

    const res = await request(app)
      .put(`/multas/${created.body.id}`)
      .send({
        data_pagamento: '2026-04-27',
      });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: created.body.id,
      emprestimo_id: emprestimoId,
      valor: 50,
    });
    expect(res.body.data_pagamento).toBeDefined();
  });

  test('remove uma multa existente', async () => {
    const created = await request(app)
      .post('/multas')
      .send({
        emprestimo_id: emprestimoId,
        valor: 50.00,
        data_multa: '2026-04-26',
      });

    const res = await request(app).delete(`/multas/${created.body.id}`);

    expect(res.status).toBe(204);
  });
});
