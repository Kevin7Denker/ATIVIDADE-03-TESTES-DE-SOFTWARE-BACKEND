const { spawn } = require('child_process');

const root = process.cwd();
const children = [];
const playwrightArgs = process.argv.slice(2);

function start(command, args) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  });
  children.push(child);
  return child;
}

async function waitFor(url, timeoutMs = 120000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.status < 500) return;
    } catch {
      // Server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function stopChildren() {
  for (const child of children.reverse()) {
    if (!child.killed) child.kill('SIGTERM');
  }
}

(async () => {
  start('node', ['e2e/backend-server.cjs']);
  await waitFor('http://localhost:3100/usuarios');

  start('node', ['e2e/frontend-server.cjs']);
  await waitFor('http://localhost:5174');

  const test = spawn(
    process.execPath,
    ['./node_modules/@playwright/test/cli.js', 'test', ...playwrightArgs, '--reporter=line'],
    {
      cwd: root,
      stdio: 'inherit',
      env: {
        ...process.env,
        PW_NO_WEBSERVER: '1',
      },
      shell: false,
    },
  );

  const code = await new Promise((resolve) => {
    test.on('exit', resolve);
  });

  stopChildren();
  setTimeout(() => process.exit(code ?? 1), 750);
})().catch((error) => {
  console.error(error);
  stopChildren();
  process.exit(1);
});
