const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Emprestimo = require('./Emprestimo');

const Multa = sequelize.define('Multa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  emprestimo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  data_multa: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  data_pagamento: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'multas',
  timestamps: false,
  underscored: false,
});

Multa.belongsTo(Emprestimo, { foreignKey: 'emprestimo_id' });

module.exports = Multa;
