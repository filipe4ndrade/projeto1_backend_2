var bcrypt = require('bcrypt');
var { Categoria, Usuario, Produto } = require('./model/modelos');

async function seed() {
  try {
    // Aguarda o sync do Sequelize terminar
    await new Promise(function (resolve) { setTimeout(resolve, 2000); });

    // ─── Categorias ───────────────────────────────────────────
    var [catNotebook] = await Categoria.findOrCreate({ where: { nome: 'Notebook' } });
    var [catCelular]  = await Categoria.findOrCreate({ where: { nome: 'Celular'  } });
    var [catTeclado]  = await Categoria.findOrCreate({ where: { nome: 'Teclado'  } });

    console.log('Categorias OK');

    // ─── Usuários (senha padrão: 123456) ─────────────────────
    var senhaHash = await bcrypt.hash('123456', 10);

    var [admin] = await Usuario.findOrCreate({
      where: { email: 'admin@electrostore.com' },
      defaults: { nome: 'Administrador', senha_hash: senhaHash, perfil: 'admin' }
    });

    await Usuario.findOrCreate({
      where: { email: 'lojista@electrostore.com' },
      defaults: { nome: 'Lojista', senha_hash: senhaHash, perfil: 'lojista' }
    });

    await Usuario.findOrCreate({
      where: { email: 'usuario@electrostore.com' },
      defaults: { nome: 'Usuário Comum', senha_hash: senhaHash, perfil: 'usuario' }
    });

    console.log('Usuários OK');

    // ─── Produtos ─────────────────────────────────────────────
    await Produto.findOrCreate({
      where: { nome: 'Notebook Gamer Dell' },
      defaults: {
        preco: 8500.00,
        descricao: 'Processador: Intel Core, 16 núcleos. Sistema Operacional Windows. Placa de Videio N-Vidia. Armazenamento SSD. Tela de 16 polegadas.',
        quantidade: 5,
        status: 'ativo',
        categoria_id: catNotebook.id,
        usuario_id: admin.id
      }
    });

    await Produto.findOrCreate({
      where: { nome: 'Celular Samsung' },
      defaults: {
        preco: 5000.00,
        descricao: 'Smartphone Samsung com câmera avançada e alto desempenho.',
        quantidade: 2,
        status: 'ativo',
        categoria_id: catCelular.id,
        usuario_id: admin.id
      }
    });

    await Produto.findOrCreate({
      where: { nome: 'Teclado Mecânico Gamer' },
      defaults: {
        preco: 300.00,
        descricao: 'Teclado mecânico gamer com switches de alta durabilidade e iluminação RGB.',
        quantidade: 3,
        status: 'ativo',
        categoria_id: catTeclado.id,
        usuario_id: admin.id
      }
    });

    console.log('Produtos OK');
    console.log('');
    console.log('Seed concluído com sucesso!');
    console.log('Usuários criados (senha: 123456):');
    console.log('  admin@electrostore.com    → perfil: admin');
    console.log('  lojista@electrostore.com  → perfil: lojista');
    console.log('  usuario@electrostore.com  → perfil: usuario');
    process.exit(0);
  } catch (err) {
    console.error('Erro no seed:', err.message);
    process.exit(1);
  }
}

seed();
