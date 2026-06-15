const { Livro } = require('../models');

const criarLivro = async (titulo, autor) => {
  const livro = await Livro.create({ titulo, autor });
  return {
    id: livro.id,
    titulo: livro.titulo,
    autor: livro.autor,
  };
};

const listarLivros = async () => {
  const livros = await Livro.findAll({ order: [['id', 'DESC']] });
  return livros;
};

const buscarLivroPorId = async (id) => {
  const livro = await Livro.findByPk(id);

  if (!livro) {
    return null;
  }

  return {
    id: livro.id,
    titulo: livro.titulo,
  };
};

const atualizarLivro = async (titulo, autor, id) => {
  const livro = await Livro.findByPk(id);

  if (!livro) {
    throw new Error('Livro não encontrado');
  }

  if (titulo) livro.titulo = titulo;
  if (autor) livro.autor = autor;

  await livro.save();

  return {
    id: livro.id,
    titulo: livro.titulo,
    autor: livro.autor,
  };
};

const deletarLivro = async (id) => {
  await Livro.destroy({ where: { id } });
};

module.exports = { criarLivro, listarLivros, buscarLivroPorId, atualizarLivro, deletarLivro };
