const { Usuario } = require('../models');

const criarUsuario = async (nome, email, senha, tipo) => {
  const isEmailExist = await Usuario.findOne({ where: { email } });

  if (isEmailExist) {
    throw new Error('usuario com email ja criado!');
  }

  const usuario = await Usuario.create({ nome, email, senha, tipo });
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    senha: usuario.senha,
    tipo: usuario.tipo,
  };
};

const listarUsuarios = async () => {
  const usuarios = await Usuario.findAll();
  return usuarios;
};

const pegarPorId = async (id) => {
  const usuario = await Usuario.findByPk(id);
  return usuario;
};

const atualizarUsuario = async (nome, email, senha, tipo, id) => {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  if (nome) usuario.nome = nome;
  if (email) usuario.email = email;
  if (senha) usuario.senha = senha;
  if (tipo) usuario.tipo = tipo;

  await usuario.save();
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    senha: usuario.senha,
    tipo: usuario.tipo,
  };
};

const deletarUsuario = async (id) => {
  const deletedRows = await Usuario.destroy({ where: { id } });

  if (!deletedRows) {
    throw new Error('Usuário não encontrado');
  }
};

module.exports = {
  criarUsuario,
  listarUsuarios,
  pegarPorId,
  atualizarUsuario,
  deletarUsuario,
};