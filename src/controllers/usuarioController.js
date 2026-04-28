const crypto = require('crypto');
const {
  criarUsuario,
  listarUsuarios,
  pegarPorId,
  atualizarUsuario,
  deletarUsuario,
} = require('../services/usuarioService');
const { idParamSchema } = require('../validators/usuarioSchemas');

const hashSenha = (senha) => crypto.createHash('sha256').update(senha).digest('hex');

const criar = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ erro: 'todos os campos são obrigatórios' });
    }

    const senhaHash = hashSenha(senha);
    const usuario = await criarUsuario(nome, email, senhaHash, tipo);

    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

const listar = async (req, res) => {
  const usuarios = await listarUsuarios();
  return res.status(200).json(usuarios);
};

const buscarPorId = async (req, res, next) => {
  try {
    const parseResult = idParamSchema.safeParse(req.params);

    if (!parseResult.success) {
      return res.status(400).json({ erro: 'Parâmetro id inválido' });
    }

    const usuario = await pegarPorId(parseResult.data.id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    return next(error);
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, tipo } = req.body;

    if (!id) {
      return res.status(400).json({ erro: 'id é obrigatório' });
    }

    const parseResult = idParamSchema.safeParse({ id });

    if (!parseResult.success) {
      return res.status(400).json({ erro: 'Parâmetro id inválido' });
    }

    const senhaHash = senha ? hashSenha(senha) : undefined;
    const usuario = await atualizarUsuario(nome, email, senhaHash, tipo, parseResult.data.id);

    return res.status(200).json(usuario);
  } catch (error) {
    const status = error.message === 'Usuário não encontrado' ? 404 : 400;
    return res.status(status).json({ erro: error.message });
  }
};

const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ erro: 'id é obrigatório' });
    }

    const parseResult = idParamSchema.safeParse({ id });

    if (!parseResult.success) {
      return res.status(400).json({ erro: 'Parâmetro id inválido' });
    }

    await deletarUsuario(parseResult.data.id);
    return res.status(204).send();
  } catch (error) {
    const status = error.message === 'Usuário não encontrado' ? 404 : 400;
    return res.status(status).json({ erro: error.message });
  }
};

module.exports = { criar, listar, buscarPorId, atualizar, deletar };