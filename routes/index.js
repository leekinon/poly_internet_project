var express = require('express');
var router = express.Router();

//----------------
//import the product,order and cart schema
//----------------
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
//get data from mongodb in the main page to show how many product in the server
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        //render a view template for main page with the following value:
        //1. products:array of the products saved in mongoDB
        //2. success message of finish payment or add to shopping cart
        //3. noMessages: when user did not do any action in the main page or there are some error in process,
        //it will become TRUE in this value
        res.render('shop/index', {title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
    });
});

router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

// This method is find the product from mongodb after user click the Add to shopping cart button
    Product.findById(productId, function(err, product) {
       if (err) {
           return res.redirect('/');
       }
       // After success to find the product, the product will add into chart array.
       // The cart array list will show into shopping cart page
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        //Show the message what product success to add into shopping cart
        req.flash('success', 'Successfully add ' + product.title + ' to shopping cart');
        //redirect the page to main page
        res.redirect('/');
    });
});

//render shopping cart page and create new cart array
router.get('/shopping-cart', function(req, res, next) {
   if (!req.session.cart) {
       return res.render('shop/shopping-cart', {products: null});
   }
    var cart = new Cart(req.session.cart);
    //render a view template for shopping cart with the following value:
    //1. products:create cart array
    //2. totalPrice:total price by sum of all item in cart array
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

//reduce a product from item in shopping cart page
router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

//remove whole item in shopping cart page
router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

//render contact page
router.get('/contact', function(req, res, next) {
     res.render('other/contact', { title: 'Contact', message: 'Contact page'});
});

//render payment page
router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    //get the cart array for payment information
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    //render a view template for payment page with the following value:
    //1. total:total price by sum of all item in cart array
    //2. errMsg: message of process error or user input no vaild information
    //3. noError: If the value is true, it means no error message return from server
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

//secret key for stripe
    var stripe = require("stripe")(
        "sk_test_ZFV6vSbNg2e7SHMLU8UrJF1y"
    );

    // We want to let user see the payment record on our web site.
    // Therefore, we need to get the payment record from Stripe by POST method
    // to receives the payment token ID and creates the charge to create order list data to mongoDB.
    // It will also show the success message if user successfully bought product and no error return from server.

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});

module.exports = router;

// turn the page to sign in page if user not logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
