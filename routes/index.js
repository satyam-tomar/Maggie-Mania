const express = require('express');
const router = express.Router();
const { generalLimiter } = require('../middleware/rateLimiter');

router.use(generalLimiter);

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;