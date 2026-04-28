process.env.NODE_ENV = 'test';

const request = require('supertest');
const { sequelize, Usuario, Livro, Emprestimo } = require('../src/models');

const app = require('../src/versions/v2/app');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await Emprestimo.destroy({ where: {} });
  await Usuario.destroy({ where: {} });
  await Livro.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Versão v2 - Empréstimos', () => {
  let usuarioId, livroId;

  beforeEach(async () => {
    const usuario = await Usuario.create({
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      senha: 'hash123',
      tipo: 'leitor',
    });
    usuarioId = usuario.id;

    const livro = await Livro.create({
      titulo: 'Clean Code',
      autor: 'Robert C. Martin',
    });
    livroId = livro.id;
  });

  test('cria um emprestimo e retorna os dados esperados', async () => {
    const res = await request(app)
      .post('/emprestimos')
      .send({
        usuario_id: usuarioId,
        livro_id: livroId,
        data_devolucao_prevista: '2026-05-28',
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      usuario_id: usuarioId,
      livro_id: livroId,
    });
  });

  test('retorna 400 quando faltar campo obrigatório', async () => {
    const res = await request(app)
      .post('/emprestimos')
      .send({
        usuario_id: usuarioId,
        livro_id: livroId,
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Todos os campos são obrigatórios' });
  });

  test('retorna 400 quando livro já tem emprestimo ativo', async () => {
    await request(app)
      .post('/emprestimos')
      .send({
        usuario_id: usuarioId,
        livro_id: livroId,
        data_devolucao_prevista: '2026-05-28',
      });

    const res = await request(app)
      .post('/emprestimos')
      .send({
        usuario_id: usuarioId,
        livro_id: livroId,
        data_devolucao_prevista: '2026-05-28',
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Esse livro não foi devolvido!' });
  });

  test('lista emprestimos cadastrados', async () => {
    await request(app)
      .post('/emprestimos')
      .send({
        usuario_id: usuarioId,
        livro_id: livroId,
        data_devolucao_prevista: '2026-05-28',
      });

    const res = await request(app).get('/emprestimos');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      usuario_id: usuarioId,
      livro_id: livroId,
    });
  });

  test('busca emprestimo por id', async () => {
    const created = await request(app)
      .post('/emprestimos')
      .send({
        usuario_id: usuarioId,
        livro_id: livroId,
        data_devolucao_prevista: '2026-05-28',
      });

    const res = await request(app).get(`/emprestimos/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: created.body.id,
      usuario_id: usuarioId,
      livro_id: livroId,
    });
  });

  test('retorna 404 quando emprestimo não existe', async () => {
    const res = await request(app).get('/emprestimos/99999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Esse emprestimo não existe!' });
  });

  test('busca emprestimos por usuario_id', async () => {
    await request(app)
      .post('/emprestimos')
      .send({
        usuario_id: usuarioId,
        livro_id: livroId,
        data_devolucao_prevista: '2026-05-28',
      });

    const res = await request(app).get(`/emprestimos/getByUser/${usuarioId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      usuario_id: usuarioId,
      livro_id: livroId,
    });
  });

  test('atualiza um emprestimo existente com data de devolução', async () => {
    const created = await request(app)
      .post('/emprestimos')
      .send({
        usuario_id: usuarioId,
        livro_id: livroId,
        data_devolucao_prevista: '2026-05-28',
      });

    const res = await request(app)
      .put(`/emprestimos/${created.body.id}`)
      .send({
        data_devolucao: '2026-05-20',
      });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: created.body.id,
      usuario_id: usuarioId,
      livro_id: livroId,
    });
    expect(res.body.data_devolucao).toBeDefined();
  });

  test('remove um emprestimo existente', async () => {
    const created = await request(app)
      .post('/emprestimos')
      .send({
        usuario_id: usuarioId,
        livro_id: livroId,
        data_devolucao_prevista: '2026-05-28',
      });

    const res = await request(app).delete(`/emprestimos/${created.body.id}`);

    expect(res.status).toBe(204);
  });
});
