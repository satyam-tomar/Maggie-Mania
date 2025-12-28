const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { ensureAuth } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validators');
const { orderLimiter, apiLimiter } = require('../middleware/rateLimiter');

router.use(apiLimiter);
router.use(ensureAuth);

router.post('/create', orderLimiter, validateOrder, orderController.createOrder);
router.get('/success/:orderId', orderController.orderSuccess);
router.get('/my-orders', orderController.getMyOrders);

module.exports = router;