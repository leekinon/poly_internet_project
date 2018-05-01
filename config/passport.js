var passport = require('passport');

//----------------
//import the user schema
//----------------
var User = require('../models/user');

//----------------
// We will need to add a extra plugin passport-local into passport.
// This plugin can make passport to authenticate using a username and password in our web application.
// It can also make our application to support Connect-style middleware which is including Express.
//----------------

var LocalStrategy = require('passport-local').Strategy;

//----------------
//We need to set session to allow application fitting the mongoDB database in correct  authentication layer.
//Therefore, we add serializeUser and deserializeUser method instances to and from the session.
//----------------

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//----------------
//We can call the passport API with enter all the field in signup and accept request callback by passing user data.
//----------------

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    surnameField:'surname',
    lastnameField: 'lastname',
    nicknameField: 'nickname',
    passReqToCallback: true
}, function (req, email, password, surname, lastname, nickname, done) {

//----------------
//After import express-validator, we can identity the validator on each field such as the password character should be more than six.
//If it cannot pass the requirement of the condition, it will show error message on our web site.
//----------------

  req.checkBody('email', 'Invalid email format').notEmpty().isEmail();
  req.checkBody('password', 'Please enter password charater larger than 4').notEmpty().isLength({min:4});
  req.checkBody('surname', 'Please enter your surname').notEmpty();
  req.checkBody('lastname', 'Please enter your lastname').notEmpty();
  req.checkBody('nickname', 'Please enter your nickname').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
           messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: 'Email is already in use.'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.surname = surname;
        newUser.lastname = lastname;
        newUser.nickname = nickname;
        newUser.save(function(err, result) {
           if (err) {
               return done(err);
           }
           return done(null, newUser);
        });
    });
}));

//----------------
//For Sign in page, we only need to input email and password field.
//Then. we will add some basic authentication accepts username and password arguments.
//----------------

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, surname, lastname, nickname, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    });
}));
