const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureGuest } = require('../middleware/auth');
const { validateSignup, validateLogin } = require('../middleware/validators');
const { authLimiter } = require('../middleware/rateLimiter');

router.use(authLimiter);

router.get('/signup', ensureGuest, authController.showSignup);
router.post('/signup', ensureGuest, validateSignup, authController.signup);

router.get('/login', ensureGuest, authController.showLogin);
router.post('/login', ensureGuest, validateLogin, authController.login);

router.get('/logout', authController.logout);

module.exports = router;