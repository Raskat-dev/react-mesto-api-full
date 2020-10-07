const jwt = require('jsonwebtoken');
const AuthorizationError = require('./errors/auth-err');

const JWT_SECRET = 'super-secret-key';

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  // const token = req.cookies.jwt;

  // let payload;
  // try {
  //   payload = jwt.verify(token, JWT_SECRET);
  // } catch (err) {
  //   throw new AuthorizationError('Необходима авторизация');
  // }

  // req.user = payload;
  // next();
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new AuthorizationError('Необходима авторизация');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return new AuthorizationError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
