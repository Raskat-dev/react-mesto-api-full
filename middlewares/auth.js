const jwt = require('jsonwebtoken');
const AuthorizationError = require('./errors/auth-err');

const { JWT_SECRET = 'super-secret-key' } = process.env;

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
