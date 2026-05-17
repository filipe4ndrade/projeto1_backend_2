var { Sequelize } = require('sequelize');

var sequelize = new Sequelize('produtos', 'avaliacao_fullstack', 'avaliacao_fullstack', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
