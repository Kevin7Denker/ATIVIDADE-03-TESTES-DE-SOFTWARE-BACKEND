const {
  criarEmprestimo,
  listarEmprestimos,
  pegarPorId,
  pegarPorIdUsuario,
  atualizarEmprestimo,
  deletarEmprestimo,
} = require('../services/emprestimoService');
const { idParamSchema } = require('../validators/emprestimoSchemas');

const criar = async (req, res) => {
  try {
    const { usuario_id, livro_id, data_devolucao_prevista } = req.body;

    if (!usuario_id || !livro_id || !data_devolucao_prevista) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const emprestimo = await criarEmprestimo(usuario_id, livro_id, data_devolucao_prevista);
    return res.status(201).json(emprestimo);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const listar = async (req, res) => {
  const emprestimos = await listarEmprestimos();
  return res.status(200).json(emprestimos);
};

const buscarPorId = async (req, res, next) => {
  try {
    const parseResult = idParamSchema.safeParse(req.params);

    if (!parseResult.success) {
      return res.status(400).json({ message: 'Parâmetro id inválido' });
    }

    const emprestimo = await pegarPorId(parseResult.data.id);

    if (!emprestimo) {
      return res.status(404).json({ message: 'Esse emprestimo não existe!' });
    }

    return res.status(200).json(emprestimo);
  } catch (error) {
    return next(error);
  }
};

const buscarPorUsuario = async (req, res, next) => {
  try {
    const parseResult = idParamSchema.safeParse({ id: req.params.usuario_id });

    if (!parseResult.success) {
      return res.status(400).json({ message: 'Parâmetro usuario_id inválido' });
    }

    const emprestimos = await pegarPorIdUsuario(parseResult.data.id);

    if (!emprestimos || emprestimos.length === 0) {
      return res.status(404).json({ message: 'Esse emprestimo não existe para este usuario!' });
    }

    return res.status(200).json(emprestimos);
  } catch (error) {
    return next(error);
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id, livro_id, data_devolucao_prevista, data_devolucao } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'id é obrigatório' });
    }

    const parseResult = idParamSchema.safeParse({ id });

    if (!parseResult.success) {
      return res.status(400).json({ message: 'Parâmetro id inválido' });
    }

    const emprestimo = await atualizarEmprestimo(
      usuario_id,
      livro_id,
      data_devolucao_prevista,
      data_devolucao,
      parseResult.data.id
    );

    return res.status(200).json(emprestimo);
  } catch (error) {
    const status = error.message === 'Emprestimo não encontrado' ? 404 : 400;
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

    await deletarEmprestimo(parseResult.data.id);
    return res.status(204).send();
  } catch (error) {
    const status = error.message === 'Emprestimo não encontrado' ? 404 : 400;
    return res.status(status).json({ message: error.message });
  }
};

module.exports = { criar, listar, deletar, buscarPorId, buscarPorUsuario, atualizar };
