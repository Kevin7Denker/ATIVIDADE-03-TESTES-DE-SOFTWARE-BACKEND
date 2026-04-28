const { Multa, Emprestimo } = require('../models');

const criarMulta = async (emprestimo_id, valor, data_multa) => {
  const emprestimo = await Emprestimo.findByPk(emprestimo_id);

  if (!emprestimo) {
    throw new Error('Emprestimo não encontrado');
  }

  const multa = await Multa.create({
    emprestimo_id,
    valor,
    data_multa,
  });

  return multa.toJSON();
};

const listarMultas = async () => {
  const multas = await Multa.findAll();
  return multas;
};

const pegarPorId = async (id) => {
  const multa = await Multa.findByPk(id);
  return multa;
};

const pegarPorIdEmprestimo = async (emprestimo_id) => {
  const multas = await Multa.findAll({
    where: { emprestimo_id },
  });
  return multas;
};

const atualizarMulta = async (valor, data_multa, data_pagamento, id) => {
  const multa = await Multa.findByPk(id);

  if (!multa) {
    throw new Error('Multa não encontrada');
  }

  if (valor !== undefined) multa.valor = valor;
  if (data_multa) multa.data_multa = data_multa;
  if (data_pagamento) multa.data_pagamento = data_pagamento;

  await multa.save();
  return multa;
};

const deletarMulta = async (id) => {
  const deletedRows = await Multa.destroy({ where: { id } });

  if (!deletedRows) {
    throw new Error('Multa não encontrada');
  }

  return deletedRows;
};

module.exports = {
  criarMulta,
  listarMultas,
  pegarPorId,
  pegarPorIdEmprestimo,
  atualizarMulta,
  deletarMulta,
};
