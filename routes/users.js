const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// const router = require('express').Router();
const passport = require('passport');
const { index, logged } = require('../controllers/userControllers');

// Check for authentication used in app.js as well for base paths
const checkAuthentication = require('../middlewares/isAuthenticated')


// Validate user input for login
const { check, validationResult } = require('express-validator');

const loginCheck = [
    check('userName').not().isEmpty(),
    check('password').isLength({ min: 3})
];

const loginValidate = (req, res, next) => {
    const info = validationResult(req);
    if(!info.isEmpty()) {
        req.flash('errors', 'Invalid user Name or Password');
        return res.redirect('/users');
    }
    next();
}

const registerValidate = (req, res, next) => {
  const info = validationResult(req);
  if(!info.isEmpty()) {
    req.flash('errors', 'All Fields Must be Filled')
  }
  next();
}

// Validate user input for register
const { validateInput } = require('../middlewares/validateInputForRegister')

/* GET home page. */
router.get('/', index);

router.post('/login', loginCheck, loginValidate , passport.authenticate('local-login', {
  successRedirect: '/users/logged',
  failureRedirect: '/users',
  failureFlash: true
  }));
router.get('/logged', logged)

/// have to use register function staight here since it doens't redirect to / route inside controller it will redirect to users/
router.post('/register', (req, res) => {
  const { userName, name, email, password, street, city, state } = req.body
  if(!userName || !name || !email) {
      req.flash('errors', 'All inputs Must Be Filled')
      res.redirect('/users')
  } else {
      User.findOne( { userName: req.body.userName }).then((user) => {
          if((user.userName === req.body.userName) && (user.email === req.body.email)) {
                  req.flash('errors', 'account already exists');
                  res.redirect('/users');
          } else {
              const newUser = new User();
              const salt = bcrypt.genSaltSync(10);
              const hash = bcrypt.hashSync(req.body.password, salt);
  
              newUser.userName = req.body.userName;
              newUser.name = req.body.name;
              newUser.email = req.body.email;
              newUser.address.street = req.body.street;
              newUser.address.city = req.body.city;
              newUser.address.state = req.body.state;
              newUser.password = hash;
  
              newUser.save().then((user) => {
                  req.flash('success', 'your account has been created please check your email for temporary password')
                  res.redirect('/users')

              })
              .catch((error) => console.log(error));
          }
      });

  }
})
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  req.flash('success', 'You are now logged out');
  res.redirect('/');
})


module.exports = router;


