const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.getLoginPage);
router.get('/register', authController.getRegisterPage);

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router; 