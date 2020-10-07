const Card = require('../models/card');
const NotFoundError = require('../middlewares/errors/not-found-err.js');

// 1. Возврат всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send(cards))
    .catch(next);
};
// 2. Создание новой карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send(card))
    .catch(next);
};
// 3. Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndDelete({ _id: req.params.cardId, owner: req.user._id })
    .orFail(new NotFoundError('Нет карточки с таким id или вы не являетесь автором'))
    .then((card) => res.send(card))
    .catch(next);
};
// 4. Поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findOneAndUpdate({ _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((card) => res.send(card))
    .catch(next);
};
// 5. Убрать лайк карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findOneAndUpdate({ _id: req.params.cardId },
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true })
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((card) => res.send(card))
    .catch(next);
};
