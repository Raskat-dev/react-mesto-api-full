const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  const { token } = req.cookies;

  // if (!authorization && !authorization.startsWith('Bearer ')) {
  //   return res
  //     .status(401)
  //     .send({ message: 'Необходима авторизация' });
  // }

  // const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  //! проверка req.user для защиты раутов постановки лайка\удаления карточки\редактирования
  next();
};
