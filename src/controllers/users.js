const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR,
} = require('../utils/responseStatus');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      res.status(SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email } = req.body;

 bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `Ошибка валидации: ${err.message}` });
      } else {
        res.status(SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
      }
    });
};
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: `Ошибка валидации: ${err.message}` });
      } else {
        res.status(SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
      }
    });
};
module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `Ошибка валидации: ${err.message}` });
      } else {
        res.status(SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
      }
    });
};
module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `Ошибка валидации: ${err.message}` });
      } else {
        res.status(SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(OK).send({ user });
    })
    .catch(next);
};
