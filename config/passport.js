var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var { Usuario } = require('../model/modelos');

module.exports = function (passport) {
  passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async function (email, password, done) {
      try {
        var usuario = await Usuario.findOne({ where: { email: email } });
        if (!usuario) {
          return done(null, false, { message: 'Email não encontrado.' });
        }
        var isMatch = await bcrypt.compare(password, usuario.senha_hash);
        if (!isMatch) {
          return done(null, false, { message: 'Senha incorreta.' });
        }
        return done(null, usuario);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      var usuario = await Usuario.findByPk(id);
      done(null, usuario);
    } catch (err) {
      done(err);
    }
  });
};
