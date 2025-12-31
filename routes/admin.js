// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');

router.get('/dashboard/adarsh/pranshu/lathish/satyam', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(15);

    const orders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(20)
      .populate('userId');

    res.render('admin-dashboard', { users, orders });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
