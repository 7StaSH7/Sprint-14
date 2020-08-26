const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка при получении пользователей - ${err.message}` }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => res.status(400).send({ message: `Произошла ошибка при создании пользователя - ${err.message}` }));
    });
};

module.exports.getSpecificUser = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => (user === null ? res.status(404).send({ message: `Пользователь с таким id: ${req.params.id} не найден!` }) : res.send({ data: user })))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка при удалении карточки - ${err.message}` }));
};

module.exports.updateInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => (user === null ? res.status(404).send({ message: `Пользователь с таким id: ${req.params.id} не найден!` }) : res.send({ data: user })))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка при обновлении информации - ${err.message}` }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => (user === null ? res.status(404).send({ message: `Пользователь с таким id: ${req.params.id} не найден!` }) : res.send({ data: user })))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка при обновлении информации - ${err.message}` }));
};

module.exports.login = (req, res) => {
  const {
    email, password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secretphrase', { expiresIn: '7d' });
      res.status(201).cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token }).send({ message: 'Залогинен' });
    })
    .catch((err) => {
      res.status(401).send({ message: `Произошла ошибка - ${err}` });
    });
};
