const Card = require('../models/card');
const {
  OK, CREATED, BAD_REQUEST, FORBIDDEN, NOT_FOUND, SERVER_ERROR,
} = require('../utils/responseStatus');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `Ошибка валидации: ${err.message}` });
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Такой карточки не существует' });
        return;
      }
      if (card.owner.toString() === req.user._id) {
        res.status(OK).send({ data: card });
      } else {
        res.status(FORBIDDEN).send({ message: 'Удаление чужой карточки невозможно' });
        return;
      }
    })
    .catch(next);
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Такой карточки не существует' });
        return;
      }
      res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
      } else {
        next(err);
      }
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Такой карточки не существует' });
        return;
      }
      res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
      } else {
        next(err);
      }
    });
};
