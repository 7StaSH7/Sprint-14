const usersRouter = require('express').Router();

const {
  getUsers, createUser, getSpecificUser, updateInfo, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.post('/', createUser);
usersRouter.get('/:id', getSpecificUser);
usersRouter.patch('/me', updateInfo);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
