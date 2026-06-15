process.env.VITE_API_URL = process.env.VITE_API_URL || 'http://localhost:3100';

import('vite')
  .then(({ createServer }) =>
    createServer({
      server: {
        host: '127.0.0.1',
        port: 5174,
        strictPort: true,
      },
    }),
  )
  .then(async (server) => {
    await server.listen();
    server.printUrls();

    const shutdown = async () => {
      const forceExit = setTimeout(() => process.exit(0), 500);
      forceExit.unref();
      await server.close();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
