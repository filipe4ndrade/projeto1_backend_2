var { Produto, Categoria, Usuario } = require('../model/modelos');

var controllerProdutos = {

  formCadastrar: async function (req, res) {
    try {
      res.set('Cache-Control', 'private, max-age=5184000, must-revalidate');

      var categorias = await Categoria.findAll();
      var usuarios = await Usuario.findAll();
      res.render('produto/cadastrar', {
        categorias: categorias.map(function (c) { return c.toJSON(); }),
        usuarios: usuarios.map(function (u) { return u.toJSON(); })
      });
    } catch (err) {
      res.status(500).send('Erro ao carregar formulário de cadastro: ' + err.message);
    }
  },

  cadastrar: async function (req, res) {
    try {
      var { nome, preco, descricao, quantidade, status, categoria_id, usuario_id } = req.body;
      var erros = [];

      if (!nome || nome.trim() === '') {
        erros.push('O campo nome é obrigatório.');
      }
      if (!preco || preco.toString().trim() === '') {
        erros.push('O campo preço é obrigatório.');
      } else if (isNaN(parseFloat(preco)) || parseFloat(preco) < 0) {
        erros.push('O preço deve ser um número não negativo.');
      }
      if (!descricao || descricao.trim() === '') {
        erros.push('O campo descrição é obrigatório.');
      }
      if (quantidade === undefined || quantidade === '') {
        erros.push('O campo quantidade é obrigatório.');
      } else if (!Number.isInteger(parseFloat(quantidade)) || parseInt(quantidade) < 0) {
        erros.push('A quantidade deve ser um número inteiro não negativo.');
      }
      if (!status) {
        erros.push('O campo status é obrigatório.');
      }
      if (!categoria_id || isNaN(parseInt(categoria_id)) || parseInt(categoria_id) <= 0) {
        erros.push('O campo categoria é obrigatório.');
      }
      if (!usuario_id || isNaN(parseInt(usuario_id)) || parseInt(usuario_id) <= 0) {
        erros.push('O campo usuário é obrigatório.');
      }

      if (erros.length > 0) {
        var categorias = await Categoria.findAll();
        var usuarios = await Usuario.findAll();
        return res.render('produto/cadastrar', {
          erros: erros,
          categorias: categorias.map(function (c) { return c.toJSON(); }),
          usuarios: usuarios.map(function (u) { return u.toJSON(); }),
          valores: req.body
        });
      }

      await Produto.create({
        nome: nome.trim(),
        preco: parseFloat(preco),
        descricao: descricao.trim(),
        quantidade: parseInt(quantidade),
        status: status,
        categoria_id: parseInt(categoria_id),
        usuario_id: parseInt(usuario_id)
      });

      res.redirect('/');
    } catch (err) {
      res.status(500).send('Erro ao cadastrar produto: ' + err.message);
    }
  },

  consultar: async function (req, res) {
    try {
      res.set('Cache-Control', 'no-store');

      var id = parseInt(req.params.id);
      if (isNaN(id) || id <= 0) {
        return res.status(400).send('Parâmetro inválido: o ID deve ser um número inteiro positivo.');
      }

      var produto = await Produto.findByPk(id);

      if (!produto) {
        return res.status(404).send('Produto não encontrado.');
      }

      var categoria = await Categoria.findByPk(produto.categoria_id);
      var dados = produto.toJSON();
      dados.categoria_nome = categoria ? categoria.nome : '—';

      res.render('produto/consultar', { produto: dados });
    } catch (err) {
      res.status(500).send('Erro ao consultar produto: ' + err.message);
    }
  },

  vender: async function (req, res) {
    try {
      var id = parseInt(req.params.id);
      if (isNaN(id) || id <= 0) {
        return res.status(400).send('Parâmetro inválido: o ID deve ser um número inteiro positivo.');
      }

      var produto = await Produto.findByPk(id);
      if (!produto) {
        return res.status(404).send('Produto não encontrado.');
      }
      if (produto.quantidade <= 0) {
        return res.status(400).send('Produto sem estoque disponível para venda.');
      }

      produto.quantidade -= 1;
      await produto.save();

      res.redirect('/');
    } catch (err) {
      res.status(500).send('Erro ao registrar venda: ' + err.message);
    }
  },

  comprar: async function (req, res) {
    try {
      var id = parseInt(req.params.id);
      if (isNaN(id) || id <= 0) {
        return res.status(400).send('Parâmetro inválido: o ID deve ser um número inteiro positivo.');
      }

      var produto = await Produto.findByPk(id);
      if (!produto) {
        return res.status(404).send('Produto não encontrado.');
      }

      produto.quantidade += 1;
      await produto.save();

      res.redirect('/');
    } catch (err) {
      res.status(500).send('Erro ao registrar compra: ' + err.message);
    }
  }

};

module.exports = controllerProdutos;
