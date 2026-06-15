'use strict';

const crypto = require('crypto');

const now = new Date();
const hashSenha = (senha) => crypto.createHash('sha256').update(senha).digest('hex');

const usuarios = [
  {
    id: 9001,
    nome: 'Bruce Wayne',
    email: 'bruce.wayne@biblioteca.com',
    senha: hashSenha('123456'),
    tipo: 'admin',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 9002,
    nome: 'Barbara Gordon',
    email: 'barbara.gordon@biblioteca.com',
    senha: hashSenha('123456'),
    tipo: 'admin',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 9003,
    nome: 'Dick Grayson',
    email: 'dick.grayson@biblioteca.com',
    senha: hashSenha('123456'),
    tipo: 'aluno',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 9004,
    nome: 'Selina Kyle',
    email: 'selina.kyle@biblioteca.com',
    senha: hashSenha('123456'),
    tipo: 'aluno',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 9005,
    nome: 'Tim Drake',
    email: 'tim.drake@biblioteca.com',
    senha: hashSenha('123456'),
    tipo: 'aluno',
    createdAt: now,
    updatedAt: now,
  },
];

const livros = [
  { id: 9101, titulo: 'Batman: Ano Um', autor: 'Frank Miller e David Mazzucchelli', createdAt: now, updatedAt: now },
  { id: 9102, titulo: 'Batman: O Cavaleiro das Trevas', autor: 'Frank Miller', createdAt: now, updatedAt: now },
  { id: 9103, titulo: 'Batman: A Piada Mortal', autor: 'Alan Moore e Brian Bolland', createdAt: now, updatedAt: now },
  { id: 9104, titulo: 'Batman: O Longo Dia das Bruxas', autor: 'Jeph Loeb e Tim Sale', createdAt: now, updatedAt: now },
  { id: 9105, titulo: 'Batman: Vitoria Sombria', autor: 'Jeph Loeb e Tim Sale', createdAt: now, updatedAt: now },
  { id: 9106, titulo: 'Batman: Silencio', autor: 'Jeph Loeb e Jim Lee', createdAt: now, updatedAt: now },
  { id: 9107, titulo: 'Batman: Terra Um', autor: 'Geoff Johns e Gary Frank', createdAt: now, updatedAt: now },
  { id: 9108, titulo: 'Batman: Corte das Corujas', autor: 'Scott Snyder e Greg Capullo', createdAt: now, updatedAt: now },
  { id: 9109, titulo: 'Batman: Morte da Familia', autor: 'Scott Snyder e Greg Capullo', createdAt: now, updatedAt: now },
  { id: 9110, titulo: 'Batman: Asilo Arkham', autor: 'Grant Morrison e Dave McKean', createdAt: now, updatedAt: now },
  { id: 9111, titulo: 'Batman: Ego', autor: 'Darwyn Cooke', createdAt: now, updatedAt: now },
  { id: 9112, titulo: 'Batman: Cidade Castigada', autor: 'Brian Azzarello e Eduardo Risso', createdAt: now, updatedAt: now },
];

const emprestimos = [
  {
    id: 9201,
    livro_id: 9101,
    usuario_id: 9003,
    data_devolucao_prevista: new Date('2026-06-25T12:00:00.000Z'),
    data_devolucao: null,
  },
  {
    id: 9202,
    livro_id: 9102,
    usuario_id: 9004,
    data_devolucao_prevista: new Date('2026-06-12T12:00:00.000Z'),
    data_devolucao: null,
  },
  {
    id: 9203,
    livro_id: 9103,
    usuario_id: 9005,
    data_devolucao_prevista: new Date('2026-06-05T12:00:00.000Z'),
    data_devolucao: new Date('2026-06-10T12:00:00.000Z'),
  },
  {
    id: 9204,
    livro_id: 9104,
    usuario_id: 9003,
    data_devolucao_prevista: new Date('2026-06-20T12:00:00.000Z'),
    data_devolucao: null,
  },
  {
    id: 9205,
    livro_id: 9108,
    usuario_id: 9004,
    data_devolucao_prevista: new Date('2026-05-28T12:00:00.000Z'),
    data_devolucao: new Date('2026-06-03T12:00:00.000Z'),
  },
];

const multas = [
  {
    id: 9301,
    emprestimo_id: 9202,
    valor: 12.5,
    data_multa: new Date('2026-06-13T12:00:00.000Z'),
    data_pagamento: null,
  },
  {
    id: 9302,
    emprestimo_id: 9203,
    valor: 18,
    data_multa: new Date('2026-06-10T12:00:00.000Z'),
    data_pagamento: new Date('2026-06-11T12:00:00.000Z'),
  },
  {
    id: 9303,
    emprestimo_id: 9205,
    valor: 25,
    data_multa: new Date('2026-06-03T12:00:00.000Z'),
    data_pagamento: null,
  },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkDelete('multas', { id: multas.map((multa) => multa.id) });
    await queryInterface.bulkDelete('emprestimos', { id: emprestimos.map((emprestimo) => emprestimo.id) });
    await queryInterface.bulkDelete('livros', { id: livros.map((livro) => livro.id) });
    await queryInterface.bulkDelete('usuarios', { id: usuarios.map((usuario) => usuario.id) });

    await queryInterface.bulkInsert('usuarios', usuarios);
    await queryInterface.bulkInsert('livros', livros);
    await queryInterface.bulkInsert('emprestimos', emprestimos);
    await queryInterface.bulkInsert('multas', multas);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('multas', { id: multas.map((multa) => multa.id) });
    await queryInterface.bulkDelete('emprestimos', { id: emprestimos.map((emprestimo) => emprestimo.id) });
    await queryInterface.bulkDelete('livros', { id: livros.map((livro) => livro.id) });
    await queryInterface.bulkDelete('usuarios', { id: usuarios.map((usuario) => usuario.id) });
  },
};
