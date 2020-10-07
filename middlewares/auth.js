const jwt = require('jsonwebtoken');
const AuthorizationError = require('./errors/auth-err');

const JWT_SECRET = 'super-secret-key';

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }

  req.user = payload;
  next();
};

module.exports = {
  auth,
};
