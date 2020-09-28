const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthorizationError = require('../middlewares/errors/auth-err');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /^((http|https):\/\/)(www\.)?([\w\W]){1,}(#?)$/.test(v);
        },
        message: (props) => `${props.value} является недопустимой ссылкой`,
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        message: 'Введён не допустимый email',
      },
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .orFail(new AuthorizationError('Неправильные почта или пароль'))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new AuthorizationError('Неправильные почта или пароль');
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
