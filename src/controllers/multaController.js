const {
  criarMulta,
  listarMultas,
  pegarPorId,
  pegarPorIdEmprestimo,
  atualizarMulta,
  deletarMulta,
} = require('../services/multaService');
const { idParamSchema } = require('../validators/multaSchemas');

const criar = async (req, res) => {
  try {
    const { emprestimo_id, valor, data_multa } = req.body;

    if (!emprestimo_id || !valor || !data_multa) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const multa = await criarMulta(emprestimo_id, valor, data_multa);
    return res.status(201).json(multa);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const listar = async (req, res) => {
  const multas = await listarMultas();
  return res.status(200).json(multas);
};

const buscarPorId = async (req, res, next) => {
  try {
    const parseResult = idParamSchema.safeParse(req.params);

    if (!parseResult.success) {
      return res.status(400).json({ message: 'Parâmetro id inválido' });
    }

    const multa = await pegarPorId(parseResult.data.id);

    if (!multa) {
      return res.status(404).json({ message: 'Multa não encontrada' });
    }

    return res.status(200).json(multa);
  } catch (error) {
    return next(error);
  }
};

const buscarPorEmprestimo = async (req, res, next) => {
  try {
    const parseResult = idParamSchema.safeParse({ id: req.params.emprestimo_id });

    if (!parseResult.success) {
      return res.status(400).json({ message: 'Parâmetro emprestimo_id inválido' });
    }

    const multas = await pegarPorIdEmprestimo(parseResult.data.id);

    if (!multas || multas.length === 0) {
      return res.status(404).json({ message: 'Nenhuma multa encontrada para este emprestimo' });
    }

    return res.status(200).json(multas);
  } catch (error) {
    return next(error);
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, data_multa, data_pagamento } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'id é obrigatório' });
    }

    const parseResult = idParamSchema.safeParse({ id });

    if (!parseResult.success) {
      return res.status(400).json({ message: 'Parâmetro id inválido' });
    }

    const multa = await atualizarMulta(valor, data_multa, data_pagamento, parseResult.data.id);

    return res.status(200).json(multa);
  } catch (error) {
    const status = error.message === 'Multa não encontrada' ? 404 : 400;
    return res.status(status).json({ message: error.message });
  }
};

const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'id é obrigatório' });
    }

    const parseResult = idParamSchema.safeParse({ id });

    if (!parseResult.success) {
      return res.status(400).json({ message: 'Parâmetro id inválido' });
    }

    await deletarMulta(parseResult.data.id);
    return res.status(204).send();
  } catch (error) {
    const status = error.message === 'Multa não encontrada' ? 404 : 400;
    return res.status(status).json({ message: error.message });
  }
};

module.exports = { criar, listar, deletar, buscarPorId, buscarPorEmprestimo, atualizar };
