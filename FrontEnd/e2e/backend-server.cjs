process.env.NODE_ENV = 'test';
process.env.APP_VERSION = 'all';
process.env.PORT = process.env.PORT || '3100';

const app = require('../../BackEnd/src/app');
const { sequelize } = require('../../BackEnd/src/models');

const port = Number(process.env.PORT);

(async () => {
  await sequelize.sync({ force: true });
  const server = app.listen(port, () => {
    console.log(`E2E backend running on http://localhost:${port}`);
  });

  const shutdown = () => {
    const forceExit = setTimeout(() => process.exit(0), 500);
    forceExit.unref();
    server.close(() => {
      sequelize.close().finally(() => process.exit(0));
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
