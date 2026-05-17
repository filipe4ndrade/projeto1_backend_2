var express = require('express');
var router = express.Router();
var controllerUsuarios = require('../controller/controllerUsuarios');
var { estaAutenticado } = require('../middlewares/controleUsuario');

// Cadastro de usuário — público
router.get('/cadastrar', controllerUsuarios.formCadastrar);
router.post('/cadastrar', controllerUsuarios.cadastrar);

// Login — público
router.get('/login', controllerUsuarios.formLogin);
router.post('/login', controllerUsuarios.login);

// Logout — restrito a usuários autenticados
router.post('/logout', estaAutenticado, controllerUsuarios.logout);

module.exports = router;
