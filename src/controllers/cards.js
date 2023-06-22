const Card = require('../models/card');
const {
  OK, CREATED,
} = require('../utils/responseStatus');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

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
        next(new BadRequest(`Ошибка валидации: ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      if (card.owner.toString() === req.user._id) {
        res.status(OK).send({ data: card });
      } else {
        throw new Forbidden('Удаление чужой карточки невозможно');
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
        throw new NotFound('Карточка не найдена');
      }
      res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest(`Ошибка валидации: ${err.message}`));
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
        throw new NotFound('Карточка не найдена');
      }
      res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(`Ошибка валидации: ${err.message}`));
      } else {
        next(err);
      }
    });
};
