import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  webServer: process.env.PW_NO_WEBSERVER ? undefined : [
    {
      command: 'node e2e/backend-server.cjs',
      url: 'http://localhost:3100/usuarios',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command: 'node e2e/frontend-server.cjs',
      url: 'http://localhost:5174',
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
  use: {
    baseURL: 'http://localhost:5174',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
    trace: 'on-first-retry',
    viewport: { width: 390, height: 844 }, 
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
