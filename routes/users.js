const router = require('express').Router();
const { updateUserProfile, getUserById } = require('../controllers/users');
const { validateUserBodyUpdate } = require('../middlewares/validation');

router.get('/users/me', validateUserBodyUpdate, getUserById);
router.patch('/users/me', validateUserBodyUpdate, updateUserProfile);

module.exports = router;
