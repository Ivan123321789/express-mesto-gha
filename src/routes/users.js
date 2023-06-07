const router = require('express').Router();

const {
  getUsers, getUserById, createUser, patchUser, patchAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.post('/users', createUser);

router.patch('/users/me', patchUser);

router.patch('/users/me/avatar', patchAvatar);

module.exports = router;
