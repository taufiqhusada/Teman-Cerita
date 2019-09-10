const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page, if logged in then forwarded to dashboard
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard, if not logged in then forwarded to login page
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;
