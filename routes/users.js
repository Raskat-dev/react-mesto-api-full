const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cors = require('cors');
const {
  getUsers, getUser, editUser, editUserAvatar,
} = require('../controllers/users');

const corsOptions = {
  origin: ['http://raskat.students.nomoreparties.co/', 'https://raskat.students.nomoreparties.co/'],
};

userRouter.options('/', cors(corsOptions));
userRouter.get('/', getUsers);

userRouter.options('/:_id', cors(corsOptions));
userRouter.get('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex(),
  }),
}), getUser);

userRouter.options('/me', cors(corsOptions));
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), editUser);

userRouter.options('/me/avatar', cors(corsOptions));
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(new RegExp('^((http|https):\/\/)(www\.)?([\w\W]){1,}(#?)$')),
  }).unknown(true),
}), editUserAvatar);

module.exports = userRouter;
