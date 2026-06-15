import { expect, test } from '@playwright/test';
import { unique } from './helpers';

test.describe('Autenticacao (E2E)', () => {
  test('cadastra uma conta e permite login com as mesmas credenciais', async ({ page }) => {
    const email = `${unique('cadastro')}@exemplo.com`;
    const senha = '123456';

    await page.goto('/cadastro');
    await page.fill('#reg-nome', 'Usuario Cadastro');
    await page.fill('#reg-email', email);
    await page.selectOption('#reg-tipo', 'aluno');
    await page.fill('#reg-senha', senha);
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.getByRole('status')).toContainText('Conta criada');
    await expect(page).toHaveURL(/\/login$/);

    await page.fill('#login-email', email);
    await page.fill('#login-senha', senha);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('token'))).toBeTruthy();
  });
});
