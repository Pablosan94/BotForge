const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// /auth/register => POST
router.post('/register', authController.register);

// /auth/login => POST
router.post('/login', authController.login);

module.exports = router;
