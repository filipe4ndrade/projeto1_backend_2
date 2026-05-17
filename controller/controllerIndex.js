var { Produto, Categoria } = require('../model/modelos');

var controllerIndex = {

  index: async function (req, res) {
    try {
      res.set('Cache-Control', 'no-store');

      var produtos = await Produto.findAll();
      var categorias = await Categoria.findAll();

      var mapaCategorias = {};
      categorias.forEach(function (c) {
        mapaCategorias[c.id] = c.nome;
      });

      var isLojista = req.user ? req.user.perfil === 'lojista' : false;

      var produtosJson = produtos.map(function (p) {
        var dados = p.toJSON();
        dados.categoria_nome = mapaCategorias[dados.categoria_id] || '—';
        return dados;
      });

      res.render('index', {
        produtos: produtosJson,
        isLojista: isLojista
      });
    } catch (err) {
      res.status(500).send('Erro ao carregar a página principal: ' + err.message);
    }
  },

  historia: function (req, res) {
    res.set('Cache-Control', 'public, max-age=25920000, must-revalidate');
    res.render('historia');
  }

};

module.exports = controllerIndex;
