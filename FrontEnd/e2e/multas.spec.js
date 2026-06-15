import { test, expect } from '@playwright/test';
import { cardContaining, createFine, createLoan, findTextAcrossPages, loginAs, unique } from './helpers';

test.describe('Gerenciamento de Multas (E2E)', () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAs(page, request);
  });

  test('exibe a tela de multas', async ({ page }) => {
    await page.goto('/multas');

    await expect(page.locator('h2')).toContainText('Gest');
    await expect(page.locator('.fab')).toBeVisible();
  });

  test('lista multa criada pela API', async ({ page, request }) => {
    await createFine(request, { valor: 31.75 });

    await page.goto('/multas');

    await expect(page.getByText('R$ 31.75')).toBeVisible();
  });

  test('cria multa pela interface', async ({ page, request }) => {
    const emprestimo = await createLoan(request);

    await page.goto('/multas');
    await page.locator('.fab').click();
    await page.selectOption('select[name="emprestimo_id"]', String(emprestimo.id));
    await page.fill('input[name="data_multa"]', '2026-12-21');
    await page.fill('input[name="valor"]', '44.25');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Nova multa aplicada')).toBeVisible();
    await expect(page.getByText('R$ 44.25')).toBeVisible();
  });

  test('impede salvar multa sem campos obrigatorios', async ({ page }) => {
    await page.goto('/multas');
    await page.locator('.fab').click();
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).toBeVisible();
  });

  test('quita multa pendente', async ({ page, request }) => {
    const multa = await createFine(request, { valor: 52.1 });

    await page.goto('/multas');
    await expect(page.getByText('R$ 52.10')).toBeVisible();
    await cardContaining(page, 'R$ 52.10').getByRole('button', { name: /Quitar/i }).click();
    await page.getByRole('button', { name: /confirmar/i }).click();

    await expect(page.getByText('Multa quitada')).toBeVisible();
    await expect(cardContaining(page, 'R$ 52.10').getByText('Pago', { exact: true })).toBeVisible();
    expect(multa.id).toBeTruthy();
  });

  test('edita valor da multa', async ({ page, request }) => {
    await createFine(request, { valor: 63.2 });

    await page.goto('/multas');
    await expect(page.getByText('R$ 63.20')).toBeVisible();
    await cardContaining(page, 'R$ 63.20').getByRole('button', { name: /Editar/i }).click();
    await page.fill('input[name="valor"]', '64.30');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Multa atualizada')).toBeVisible();
    await expect(page.getByText('R$ 64.30')).toBeVisible();
  });

  test('remove multa existente', async ({ page, request }) => {
    await createFine(request, { valor: 75.4 });

    await page.goto('/multas');
    await expect(page.getByText('R$ 75.40')).toBeVisible();
    await cardContaining(page, 'R$ 75.40').locator('.btn--danger').click();
    await page.getByRole('button', { name: /Sim, confirmar/i }).click();

    await expect(page.getByText('Multa removida')).toBeVisible();
  });

  test('fecha modal de multa ao cancelar', async ({ page }) => {
    await page.goto('/multas');
    await page.locator('.fab').click();
    await page.getByRole('button', { name: 'Cancelar' }).click();

    await expect(page.locator('.modal')).not.toBeVisible();
  });
});
