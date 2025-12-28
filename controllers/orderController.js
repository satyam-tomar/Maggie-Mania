const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryDetails, totalAmount } = req.body;
    
    const order = await Order.create({
      userId: req.session.user._id,
      items,
      totalAmount,
      deliveryDetails,
      paymentMethod: 'Cash on Delivery'
    });
    
    res.status(201).json({
      success: true,
      orderId: order._id,
      message: 'Order placed successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: err.message
    });
  }
};

exports.orderSuccess = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('userId');
    
    if (!order || order.userId._id.toString() !== req.session.user._id.toString()) {
      return res.status(404).render('error', {
        message: 'Order not found',
        error: { status: 404 }
      });
    }
    
    res.render('order-success', { order });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      message: 'Error loading order',
      error: err
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.session.user._id })
      .sort({ orderDate: -1 })
      .limit(20);
    
    res.render('my-orders', { orders });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      message: 'Error loading orders',
      error: err
    });
  }
};

module.exports = exports;