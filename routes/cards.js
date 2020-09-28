const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }).unknown(true),
}), deleteCard);
cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }).unknown(true),
}), likeCard);
cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }).unknown(true),
}), dislikeCard);

module.exports = cardRouter;
