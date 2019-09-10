const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  // take information from req.body
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // if not fully filled
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  // password validation
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // password length validation
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  // if there are an errors
  if (errors.length > 0) {
    res.render('register', { // re-render, if there is an error
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // check in User collection, if this user already exist
    User.findOne({ email: email }).then(user => {
      if (user) { // user found
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else { // create new user
        const newUser = new User({
          name,
          email,
          password
        });
        // password hashing
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            // save user
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
