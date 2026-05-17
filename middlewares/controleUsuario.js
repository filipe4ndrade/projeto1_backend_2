function estaAutenticado(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/usuarios/login');
}

function ehAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/usuarios/login');
  }
  if (req.user.perfil === 'admin') {
    return next();
  }
  return res.status(403).send('Acesso negado. Apenas administradores podem acessar esta funcionalidade.');
}

function ehLojista(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/usuarios/login');
  }
  if (req.user.perfil === 'lojista') {
    return next();
  }
  return res.status(403).send('Acesso negado. Apenas lojistas podem acessar esta funcionalidade.');
}

module.exports = { estaAutenticado, ehAdmin, ehLojista };
