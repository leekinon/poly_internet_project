var express = require('express');
var router = express.Router();

//csrf for user library
var csrf = require('csurf');

var passport = require('passport');

//----------------
//import the user,order and cart schema
//----------------
var Order = require('../models/order');
var Cart = require('../models/cart');
var User = require('../models/user')

var csrfProtection = csrf();
router.use(csrfProtection);

//get user information from mongoDB
router.get('/profile', isLoggedIn, function (req, res, next) {
    User.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
          //render a view template for profile page with the following value:
          //user: login infromation of the user
        res.render('user/profile', {  user: req.user });
    });
});

//get order information from mongoDB
router.get('/order', isLoggedIn, function (req, res, next) {
  Order.find({user: req.user}, function(err, orders) {
      if (err) {
          return res.write('Error!');
      }
      var cart;
      //create order array after success to get the infromation
      orders.forEach(function(order) {
          cart = new Cart(order.cart);
          order.items = cart.generateArray();
      });
      //render a view template for my order page with the following value:
      //orders: order array which shows which product already bought by user
      res.render('user/order', { orders: orders });
  });
});

//function for logout user isLoggedIn boolean value will become false
router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    req.flash('success', 'Successfully logout!');
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    //render a view template for sign up page with the following value:
    //csrfToken: This token is validated against the visitor's session or csrf cookie
    //messages: If user input no vaild information, it will show the hint messages and cannot sumbit the form
    //hasErrors: If the message legth larger than 0, this value will become true
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

// If user input no vaild information, it cannot sumbit the form and redirect to sign up page.
// Otherwise, it will auto login and go to profile page when the sign up success
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
      //render a view template for sign in page with the similar value of sign up
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

// if user success to login, we have to change the UI and a change the isLoggedIn boolean value to true.
// we will redirect the user to the profile page after success login
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

module.exports = router;

//value for checking if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
