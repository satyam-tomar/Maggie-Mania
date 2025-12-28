// middleware/auth.js

const ensureAuth = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect('/auth/login');
};

const ensureGuest = (req, res, next) => {
  if (req.session.user) return res.redirect('/');
  next();
};

const ensureProfileComplete = (req, res, next) => {
  if (req.session.user && req.session.user.profileComplete) {
    return next();
  }
  res.redirect('/user/complete-profile');
};

module.exports = {
  ensureAuth,
  ensureGuest,
  ensureProfileComplete
};
