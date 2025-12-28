const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.showSignup = (req, res) => {
  res.render('signup', { errors: [] });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, block, hostel, roomNumber } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        errors: [{ msg: 'Email already registered' }]
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      block,
      hostel,
      roomNumber
    });
    
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      block: user.block,
      hostel: user.hostel,
      roomNumber: user.roomNumber
    };
    
    res.json({ success: true, redirect: '/' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      errors: [{ msg: 'Server error. Please try again.' }]
    });
  }
};

exports.showLogin = (req, res) => {
  res.render('login', { errors: [] });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        errors: [{ msg: 'Invalid email or password' }]
      });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        errors: [{ msg: 'Invalid email or password' }]
      });
    }
    
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      block: user.block,
      hostel: user.hostel,
      roomNumber: user.roomNumber
    };
    
    res.json({ success: true, redirect: '/' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      errors: [{ msg: 'Server error. Please try again.' }]
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
};

module.exports = exports;