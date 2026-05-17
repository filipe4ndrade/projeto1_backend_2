var { Model, DataTypes } = require('sequelize');
var sequelize = require('./server');

class Categoria extends Model {}

Categoria.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Categoria',
  tableName: 'categorias'
});

class Usuario extends Model {}

Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  perfil: {
    type: DataTypes.ENUM('usuario', 'admin', 'lojista'),
    allowNull: false,
    defaultValue: 'usuario'
  }
}, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'usuarios'
});

class Produto extends Model {}

Produto.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ativo', 'inativo'),
    allowNull: false,
    defaultValue: 'ativo'
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Produto',
  tableName: 'produtos'
});

Categoria.hasMany(Produto, { foreignKey: 'categoria_id' });
Produto.belongsTo(Categoria, { foreignKey: 'categoria_id' });

Usuario.hasMany(Produto, { foreignKey: 'usuario_id' });
Produto.belongsTo(Usuario, { foreignKey: 'usuario_id' });

sequelize.sync({ alter: true })
  .then(function () {
    console.log('Banco de dados sincronizado com sucesso.');
  })
  .catch(function (err) {
    console.error('Erro ao sincronizar banco de dados:', err.message);
  });

module.exports = { Categoria, Usuario, Produto };
