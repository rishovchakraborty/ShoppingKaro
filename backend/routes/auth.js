const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/find-user', authController.findUser);
router.get('/all-users', auth, authController.getAllUsers);
router.get('/notifications', auth, authController.getNotifications);

module.exports = router; 