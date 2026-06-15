import { api } from './api';

export async function login(email, senha) {
  const { data } = await api.post('/usuarios/login', { email: email.trim(), senha });
  return data;
}

export async function register(nome, email, senha, tipo) {
  const { data } = await api.post('/usuarios/', {
    nome: nome.trim(),
    email: email.trim(),
    senha,
    tipo,
  });
  return data;
}
