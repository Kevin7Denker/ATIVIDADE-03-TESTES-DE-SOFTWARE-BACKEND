import { test, expect } from '@playwright/test';
import { cardContaining, createUser, findTextAcrossPages, loginAs, unique } from './helpers';

test.describe('Gerenciamento de Usuarios (E2E)', () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAs(page, request);
  });

  test('exibe a tela de usuarios', async ({ page }) => {
    await page.goto('/usuarios');

    await expect(page.locator('h2')).toContainText('Gest');
    await expect(page.locator('.fab')).toBeVisible();
  });

  test('lista usuario criado pela API', async ({ page, request }) => {
    const usuario = await createUser(request, { nome: unique('Usuario Listado'), tipo: 'aluno' });

    await page.goto('/usuarios');

    await expect.poll(() => findTextAcrossPages(page, usuario.nome)).toBeTruthy();
  });

  test('cria usuario pela interface', async ({ page }) => {
    const nome = unique('Usuario UI');
    const email = `${nome.toLowerCase().replaceAll(' ', '.')}@teste.com`;

    await page.goto('/usuarios');
    await page.locator('.fab').click();
    await page.fill('input[name="nome"]', nome);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="senha"]', '123456');
    await page.selectOption('select[name="tipo"]', 'aluno');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Usuario cadastrado').or(page.getByText('Usuário cadastrado'))).toBeVisible();
  });

  test('exige senha ao criar usuario', async ({ page }) => {
    const nome = unique('Usuario Sem Senha');

    await page.goto('/usuarios');
    await page.locator('.fab').click();
    await page.fill('input[name="nome"]', nome);
    await page.fill('input[name="email"]', `${nome.toLowerCase().replaceAll(' ', '.')}@teste.com`);
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).toBeVisible();
  });

  test('edita usuario existente', async ({ page, request }) => {
    const usuario = await createUser(request, { nome: unique('Usuario Antes'), tipo: 'aluno' });
    const novoNome = unique('Usuario Depois');

    await page.goto('/usuarios');
    await expect(page.locator('.list-cards')).toBeVisible();
    await expect.poll(() => findTextAcrossPages(page, usuario.nome)).toBeTruthy();
    await cardContaining(page, usuario.nome).getByRole('button', { name: /Editar/i }).click();
    await page.fill('input[name="nome"]', novoNome);
    await page.click('button[type="submit"]');

    await expect(page.getByText(novoNome)).toBeVisible();
  });

  test('remove usuario existente', async ({ page, request }) => {
    const usuario = await createUser(request, { nome: unique('Usuario Removivel'), tipo: 'aluno' });

    await page.goto('/usuarios');
    await expect.poll(() => findTextAcrossPages(page, usuario.nome)).toBeTruthy();
    await cardContaining(page, usuario.nome).locator('.btn--danger').click();
    await page.getByRole('button', { name: 'Confirmar' }).click();

    await expect(page.getByText('Usuario removido').or(page.getByText('Usuário removido'))).toBeVisible();
  });

  test('fecha modal de usuario ao cancelar', async ({ page }) => {
    await page.goto('/usuarios');
    await page.locator('.fab').click();
    await page.getByRole('button', { name: 'Cancelar' }).click();

    await expect(page.locator('.modal')).not.toBeVisible();
  });
});
