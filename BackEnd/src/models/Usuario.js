const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'usuarios',
  timestamps: true,
  underscored: false,
});

module.exports = Usuario;