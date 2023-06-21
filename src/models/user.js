const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const UNAUTHORIZED = require('../utils/responseStatus');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: 'Юрий Гагарин',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
      default: 'Первый космонавт',
    },
    avatar: {
      type: String,
      default: 'https://drikus.club/uploads/posts/2022-09/1663937794_46-drikus-club-p-kosmicheskii-korabl-yuriya-gagarina-krasiv-71.jpg',
      validate: {
        validator: (v) => isURL(v),
        message: 'Некорректный URL',
      },
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: 'Почта указана неверно',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlenght: [8, 'Минимальная длина пароля - 8 символов'],
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
        return;
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
            return;
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
