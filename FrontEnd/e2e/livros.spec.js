import { test, expect } from '@playwright/test';
import { cardContaining, createBook, findTextAcrossPages, loginAs, unique } from './helpers';

test.describe('Gerenciamento de Livros (E2E)', () => {
  test('redireciona visitante para login ao acessar livros', async ({ page }) => {
    await page.goto('/livros');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('navega ate a tela de livros e exibe o acervo', async ({ page, request }) => {
    await loginAs(page, request);
    await createBook(request, { titulo: unique('Acervo Visivel') });

    await page.goto('/livros');

    await expect(page.locator('h2')).toContainText('Acervo de Livros');
    await expect(page.locator('.list-cards')).toBeVisible();
  });

  test('permite adicionar um novo livro e encontra-lo na lista', async ({ page, request }) => {
    await loginAs(page, request);
    const titulo = unique('Livro Criado UI');

    await page.goto('/livros');
    await page.locator('.fab').click();
    await page.fill('input[name="titulo"]', titulo);
    await page.fill('input[name="autor"]', 'Automacao Playwright');
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible();
    await expect.poll(() => findTextAcrossPages(page, titulo)).toBeTruthy();
  });

  test('mantem modal aberto quando campos obrigatorios estao vazios', async ({ page, request }) => {
    await loginAs(page, request);

    await page.goto('/livros');
    await page.locator('.fab').click();
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).toBeVisible();
  });

  test('busca livro por ID', async ({ page, request }) => {
    await loginAs(page, request);
    const livro = await createBook(request, { titulo: unique('Busca ID Livro') });

    await page.goto('/livros');
    await page.fill('input[placeholder="Buscar por ID..."]', String(livro.id));
    await page.locator('.search-bar button').click();

    await expect(page.getByText(livro.titulo)).toBeVisible();
  });

  test('edita um livro existente', async ({ page, request }) => {
    await loginAs(page, request);
    const livro = await createBook(request, { titulo: unique('Livro Antes Edicao') });
    const novoTitulo = unique('Livro Depois Edicao');

    await page.goto('/livros');
    await page.fill('input[placeholder="Buscar por ID..."]', String(livro.id));
    await page.locator('.search-bar button').click();
    await cardContaining(page, livro.titulo).getByRole('button', { name: /Editar/i }).click();
    await page.fill('input[name="titulo"]', novoTitulo);
    await page.fill('input[name="autor"]', 'Autor Editado');
    await page.click('button[type="submit"]');

    await expect.poll(() => findTextAcrossPages(page, novoTitulo)).toBeTruthy();
  });

  test('remove um livro existente', async ({ page, request }) => {
    await loginAs(page, request);
    const livro = await createBook(request, { titulo: unique('Livro Removivel') });

    await page.goto('/livros');
    await page.fill('input[placeholder="Buscar por ID..."]', String(livro.id));
    await page.locator('.search-bar button').click();
    await cardContaining(page, livro.titulo).getByRole('button', { name: /Excluir/i }).click();
    await page.locator('.modal-footer').getByRole('button', { name: /^Excluir$/ }).click();

    const response = await request.get(`http://localhost:3100/livros/${livro.id}`);
    expect(response.status()).toBe(404);
  });

  test('fecha o modal ao clicar em cancelar', async ({ page, request }) => {
    await loginAs(page, request);

    await page.goto('/livros');
    await page.locator('.fab').click();
    await expect(page.locator('.modal')).toBeVisible();
    await page.getByRole('button', { name: 'Cancelar' }).click();

    await expect(page.locator('.modal')).not.toBeVisible();
  });
});
