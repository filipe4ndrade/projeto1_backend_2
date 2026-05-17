var express = require('express');
var router = express.Router();
var controllerProdutos = require('../controller/controllerProdutos');
var { ehAdmin, ehLojista } = require('../middlewares/controleUsuario');

// Cadastro de produto — restrito a admins
router.get('/cadastrar', ehAdmin, controllerProdutos.formCadastrar);
router.post('/cadastrar', ehAdmin, controllerProdutos.cadastrar);

// Consulta — pública
router.get('/consultar/:id', controllerProdutos.consultar);

// Venda e Compra — restrito a lojistas
router.post('/vender/:id', ehLojista, controllerProdutos.vender);
router.post('/comprar/:id', ehLojista, controllerProdutos.comprar);

module.exports = router;
