const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

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
