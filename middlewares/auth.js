const jwt = require('jsonwebtoken');
const AuthorizationError = require('./errors/auth-err');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  let payload;
  try {
    payload = jwt.verify(token, 'super-secret-key');
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
