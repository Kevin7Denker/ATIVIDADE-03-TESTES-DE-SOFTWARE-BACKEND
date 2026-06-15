import { expect } from '@playwright/test';

export const API_URL = 'http://localhost:3100';

export function unique(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export async function apiPost(request, path, payload) {
  const response = await request.post(`${API_URL}${path}`, { data: payload });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

export async function apiPut(request, path, payload = {}) {
  const response = await request.put(`${API_URL}${path}`, { data: payload });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

export async function createUser(request, overrides = {}) {
  const label = unique('Usuario E2E');
  return apiPost(request, '/usuarios', {
    nome: label,
    email: `${label.toLowerCase().replaceAll(' ', '.')}@teste.com`,
    senha: '123456',
    tipo: 'admin',
    ...overrides,
  });
}

export async function createBook(request, overrides = {}) {
  const label = unique('Livro E2E');
  return apiPost(request, '/livros', {
    titulo: label,
    autor: 'Autor Playwright',
    ...overrides,
  });
}

export async function createLoan(request, overrides = {}) {
  const usuario = overrides.usuario_id ? null : await createUser(request, { tipo: 'aluno' });
  const livro = overrides.livro_id ? null : await createBook(request);

  return apiPost(request, '/emprestimos', {
    usuario_id: overrides.usuario_id ?? usuario.id,
    livro_id: overrides.livro_id ?? livro.id,
    data_devolucao_prevista: '2026-12-20',
    ...overrides,
  });
}

export async function createFine(request, overrides = {}) {
  const emprestimo = overrides.emprestimo_id ? null : await createLoan(request);

  return apiPost(request, '/multas', {
    emprestimo_id: overrides.emprestimo_id ?? emprestimo.id,
    valor: 25.5,
    data_multa: '2026-12-21',
    ...overrides,
  });
}

export async function loginAs(page, request, overrides = {}) {
  const usuario = await createUser(request, {
    tipo: 'admin',
    senha: '123456',
    ...overrides,
  });

  await page.goto('/login');
  await page.fill('input[type="email"]', usuario.email);
  await page.fill('input[type="password"]', '123456');
  await page.click('button[type="submit"]');
  await expect(page).not.toHaveURL(/\/login$/);
  await page.waitForFunction(() => {
    return Boolean(localStorage.getItem('token') && localStorage.getItem('usuario'));
  });

  return usuario;
}

export async function findTextAcrossPages(page, text, maxPages = 20) {
  await page.locator('.list-cards, .empty-hint, .card').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

  for (let i = 0; i < maxPages; i += 1) {
    const target = page.getByText(text, { exact: false });
    if (await target.first().isVisible().catch(() => false)) {
      return true;
    }

    const nextButton = page.locator('.pagination button').last();
    if (!(await nextButton.isVisible().catch(() => false)) || (await nextButton.isDisabled())) {
      return false;
    }

    await nextButton.click();
  }

  return false;
}

export function cardContaining(page, text) {
  return page.locator('.list-card').filter({ hasText: text }).first();
}
