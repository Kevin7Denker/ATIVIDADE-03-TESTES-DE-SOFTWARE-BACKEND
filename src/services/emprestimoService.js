const { Emprestimo } = require('../models');

const criarEmprestimo = async (usuario_id, livro_id, data_devolucao_prevista) => {
  const emprestimoAtivo = await Emprestimo.findOne({
    where: { livro_id, data_devolucao: null },
  });

  if (emprestimoAtivo) {
    throw new Error('Esse livro não foi devolvido!');
  }

  const emprestimo = await Emprestimo.create({
    usuario_id,
    livro_id,
    data_devolucao_prevista,
  });

  return emprestimo.toJSON();
};

const listarEmprestimos = async () => {
  const emprestimos = await Emprestimo.findAll();
  return emprestimos;
};

const pegarPorId = async (id) => {
  const emprestimo = await Emprestimo.findByPk(id);
  return emprestimo;
};

const pegarPorIdUsuario = async (usuario_id) => {
  const emprestimos = await Emprestimo.findAll({
    where: { usuario_id },
  });
  return emprestimos;
};

const atualizarEmprestimo = async (usuario_id, livro_id, data_devolucao_prevista, data_devolucao, id) => {
  const emprestimo = await Emprestimo.findByPk(id);

  if (!emprestimo) {
    throw new Error('Emprestimo não encontrado');
  }

  if (usuario_id) emprestimo.usuario_id = usuario_id;
  if (livro_id) emprestimo.livro_id = livro_id;
  if (data_devolucao_prevista) emprestimo.data_devolucao_prevista = data_devolucao_prevista;
  if (data_devolucao) emprestimo.data_devolucao = data_devolucao;

  await emprestimo.save();
  return emprestimo;
};

const deletarEmprestimo = async (id) => {
  const deletedRows = await Emprestimo.destroy({ where: { id } });

  if (!deletedRows) {
    throw new Error('Emprestimo não encontrado');
  }

  return deletedRows;
};

module.exports = {
  criarEmprestimo,
  listarEmprestimos,
  pegarPorId,
  pegarPorIdUsuario,
  atualizarEmprestimo,
  deletarEmprestimo,
};
