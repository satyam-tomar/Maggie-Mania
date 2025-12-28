const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').trim().matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  body('block').trim().notEmpty().withMessage('Block is required'),
  body('hostel').trim().notEmpty().withMessage('Hostel is required'),
  body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

const validateProfileUpdate = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').trim().matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  body('block').trim().isLength({ min: 1, max: 20 }).withMessage('Block is required'),
  body('hostel').trim().isLength({ min: 1, max: 50 }).withMessage('Hostel is required'),
  body('roomNumber').trim().isLength({ min: 1, max: 20 }).withMessage('Room number is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.name').trim().notEmpty().withMessage('Item name is required'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Invalid price'),
  body('items.*.quantity').isInt({ min: 1, max: 50 }).withMessage('Quantity must be between 1 and 50'),
  body('deliveryDetails.name').trim().isLength({ min: 2, max: 50 }).withMessage('Name is required'),
  body('deliveryDetails.phone').trim().matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  body('deliveryDetails.email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('deliveryDetails.block').trim().notEmpty().withMessage('Block is required'),
  body('deliveryDetails.hostel').trim().notEmpty().withMessage('Hostel is required'),
  body('deliveryDetails.roomNumber').trim().notEmpty().withMessage('Room number is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateSignup,
  validateLogin,
  validateProfileUpdate,
  validateOrder
};
