const usersRouter = require('express').Router();

const {
  getUsers, getSpecificUser, updateInfo, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getSpecificUser);
usersRouter.patch('/me', updateInfo);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
