require('dotenv').config();
const path = require('path');

const localSqlite = {
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || path.resolve(__dirname, '../../database.sqlite'),
  logging: false,
};

const mysqlConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
};

const databaseConfig = process.env.DB_NAME ? mysqlConfig : localSqlite;

module.exports = {
  development: databaseConfig,
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: databaseConfig,
};
