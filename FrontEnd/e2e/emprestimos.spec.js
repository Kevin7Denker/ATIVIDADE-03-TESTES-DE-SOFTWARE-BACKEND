import { test, expect } from '@playwright/test';
import { apiPut, cardContaining, createBook, createLoan, createUser, findTextAcrossPages, loginAs, unique } from './helpers';

test.describe('Gerenciamento de Emprestimos (E2E)', () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAs(page, request);
  });

  test('exibe a tela de emprestimos', async ({ page }) => {
    await page.goto('/emprestimos');

    await expect(page.locator('h2')).toContainText('Empr');
    await expect(page.locator('.fab')).toBeVisible();
  });

  test('lista emprestimo criado pela API', async ({ page, request }) => {
    const livro = await createBook(request, { titulo: unique('Livro Emprestimo Listado') });
    await createLoan(request, { livro_id: livro.id });

    await page.goto('/emprestimos');

    await expect.poll(() => findTextAcrossPages(page, livro.titulo)).toBeTruthy();
  });

  test('cria emprestimo pela interface', async ({ page, request }) => {
    const livro = await createBook(request, { titulo: unique('Livro Emprestado UI') });
    const usuario = await createUser(request, { nome: unique('Aluno Emprestimo UI'), tipo: 'aluno' });

    await page.goto('/emprestimos');
    await page.locator('.fab').click();
    await page.selectOption('select[name="livro_id"]', { label: livro.titulo });
    await page.selectOption('select[name="usuario_id"]', { label: usuario.nome });
    await page.fill('input[name="data_devolucao_prevista"]', '2026-12-20');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Emprestimo registrado').or(page.getByText('Empréstimo registrado'))).toBeVisible();
  });

  test('impede salvar emprestimo sem campos obrigatorios', async ({ page }) => {
    await page.goto('/emprestimos');
    await page.locator('.fab').click();
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).toBeVisible();
  });

  test('registra devolucao de emprestimo ativo', async ({ page, request }) => {
    const livro = await createBook(request, { titulo: unique('Livro Devolucao') });
    await createLoan(request, { livro_id: livro.id });

    await page.goto('/emprestimos');
    await expect.poll(() => findTextAcrossPages(page, livro.titulo)).toBeTruthy();
    await cardContaining(page, livro.titulo).getByRole('button', { name: /Devolver/i }).click();
    await page.getByRole('button', { name: 'Confirmar' }).click();

    await expect(page.getByText('Devolucao concluida').or(page.getByText('Devolução concluída'))).toBeVisible();
  });

  test('edita data prevista do emprestimo', async ({ page, request }) => {
    const livro = await createBook(request, { titulo: unique('Livro Edita Emprestimo') });
    await createLoan(request, { livro_id: livro.id });

    await page.goto('/emprestimos');
    await expect.poll(() => findTextAcrossPages(page, livro.titulo)).toBeTruthy();
    await cardContaining(page, livro.titulo).locator('.btn--secondary').click();
    await page.fill('input[name="data_devolucao_prevista"]', '2026-12-28');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Emprestimo atualizado').or(page.getByText('Empréstimo atualizado'))).toBeVisible();
  });

  test('remove emprestimo concluido', async ({ page, request }) => {
    const livro = await createBook(request, { titulo: unique('Livro Historico Removivel') });
    const emprestimo = await createLoan(request, { livro_id: livro.id });
    await apiPut(request, `/emprestimos/${emprestimo.id}`, { data_devolucao: '2026-12-22' });

    await page.goto('/emprestimos');
    await expect.poll(() => findTextAcrossPages(page, livro.titulo)).toBeTruthy();
    await cardContaining(page, livro.titulo).getByRole('button', { name: /Excluir/i }).click();
    await page.getByRole('button', { name: 'Confirmar' }).click();

    await expect(page.getByText('Emprestimo excluido').or(page.getByText('Empréstimo excluído'))).toBeVisible();
  });

  test('fecha modal de emprestimo ao voltar', async ({ page }) => {
    await page.goto('/emprestimos');
    await page.locator('.fab').click();
    await page.getByRole('button', { name: 'Cancelar' }).click();

    await expect(page.locator('.modal')).not.toBeVisible();
  });
});
