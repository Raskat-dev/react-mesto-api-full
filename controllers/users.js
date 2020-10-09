const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../middlewares/errors/not-found-err.js');

const JWT_SECRET = 'super-secret-key';

// 1. Создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь океана',
    avatar = 'https://kaskad.tv/images/2020/foto_zhak_iv_kusto__-_interesnie_fakti_20190810_2078596433.jpg',
    email,
    password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch(next);
};
// 2. Вход пользователя на свой аккаунт
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      // res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true });
      res.send({ token });
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
    })
    .catch(next);
};
// 3. Список пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};
// 4. Возврат данных пользователя с заданным id
module.exports.getUser = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params._id)) {
    User.findOne({ _id: req.params._id })
      .orFail(new NotFoundError('Нет пользователя с таким id'))
      .then((user) => res.send(user))
      .catch(next);
  } else {
    res.status(404).send({ message: 'Нет пользователя с таким id' });
  }
};
// 5. Возврат данных текущего пользователя
module.exports.getUserMe = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send(user))
    .catch(next);
};
// 6. Обновление имени и статуса пользователя
module.exports.editUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send(user))
    .catch(next);
};
// 7. Обновление аватара пользователя
module.exports.editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send(user))
    .catch(next);
};
