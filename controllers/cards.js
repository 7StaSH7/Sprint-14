const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => (cards === null ? res.status(404).send({ message: 'В базе данных пока нет карточек' }) : res.send({ data: cards })))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка при получении карточек - ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка при загрузки карточки - ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) return Promise.reject(new Error('Карты нет'));
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) return Promise.reject(new Error('Не ваша карта, удалить нельзя!'));
    })
    .then((card) => (card === null ? res.status(404).send({ message: `Карточка с таким id: ${id} не найдена` }) : res.send({ data: card })))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка при удалении карточки - ${err.message}` }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => (card === null ? res.status(404).send({ message: `Карточка с таким id: ${req.params.id} не найдена` }) : res.send({ data: card })))
    .catch((err) => res.status(400).send({ message: `Не удалось поставить лайк - ${err}` }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => (card === null ? res.status(404).send({ message: `Карточка с таким id: ${req.params.id} не найдена` }) : res.send({ data: card })))
    .catch((err) => res.status(400).send({ message: `Не удалось убрать лайк - ${err}` }));
};
