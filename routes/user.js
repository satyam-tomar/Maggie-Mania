const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(apiLimiter);
router.use(ensureAuth);

module.exports = router;