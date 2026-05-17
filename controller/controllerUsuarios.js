var bcrypt = require('bcrypt');
var passport = require('passport');
var { Usuario } = require('../model/modelos');

var controllerUsuarios = {

  formCadastrar: function (req, res) {
    res.set('Cache-Control', 'private, max-age=31536000, immutable');
    res.render('usuario/cadastrar');
  },

  cadastrar: async function (req, res) {
    try {
      var { nome, email, senha, confirmar_senha } = req.body;
      var erros = [];

      if (!nome || nome.trim() === '') {
        erros.push('O campo nome é obrigatório.');
      }
      if (!email || email.trim() === '') {
        erros.push('O campo email é obrigatório.');
      }
      if (!senha || senha.trim() === '') {
        erros.push('O campo senha é obrigatório.');
      }
      if (!confirmar_senha || confirmar_senha.trim() === '') {
        erros.push('O campo confirmar senha é obrigatório.');
      }
      if (senha && confirmar_senha && senha !== confirmar_senha) {
        erros.push('As senhas não coincidem.');
      }

      if (erros.length > 0) {
        return res.render('usuario/cadastrar', { erros: erros, valores: req.body });
      }

      var emailExistente = await Usuario.findOne({ where: { email: email.trim() } });
      if (emailExistente) {
        erros.push('Este email já está cadastrado. Tente outro.');
        return res.render('usuario/cadastrar', { erros: erros, valores: req.body });
      }

      var senha_hash = await bcrypt.hash(senha, 10);

      await Usuario.create({
        nome: nome.trim(),
        email: email.trim(),
        senha_hash: senha_hash,
        perfil: 'usuario'
      });

      res.redirect('/usuarios/login');
    } catch (err) {
      res.status(500).send('Erro ao cadastrar usuário: ' + err.message);
    }
  },

  formLogin: function (req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    var erro = req.session.mensagemErroLogin || null;
    req.session.mensagemErroLogin = null;
    res.render('usuario/login', { erro: erro });
  },

  login: function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        req.session.mensagemErroLogin = info ? info.message : 'Credenciais inválidas.';
        return res.redirect('/usuarios/login');
      }
      req.logIn(user, function (err) {
        if (err) { return next(err); }
        return res.redirect('/');
      });
    })(req, res, next);
  },

  logout: function (req, res, next) {
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  }

};

module.exports = controllerUsuarios;
