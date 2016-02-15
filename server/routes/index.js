
var express = require('express');
var app = express();
var path = require('path');
var router = express.Router();
var passport = require('passport');
var pg = require('pg');
var flash = require('connect-flash');

var connectionString = 'postgres://localhost:5432/flash_cardz_1';

// =====================================
// HOME PAGE (with login links) ========
// =====================================

router.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

//
//router.get('/*', function(request, response){
//    response.redirect('/');
//});


// =====================================
// LOGIN ===============================
// =====================================



// process the login form
// client.post('/login', do all our passport stuff here);
// process the login form

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/fail' // redirect back to the signup page if there is an error
    //failureFlash : true // allow flash messages
}));

router.post('/makeDeck', function(req,res){
    console.log('req.user:', req.user);

    //var color = req.body.color;
    var results = {};

    // Grab data from http request
    var deck = req.body.deck;
    //var name = req.user.username;
    var email = req.user.email;
    var question = req.body.question;
    var answer = req.body.answer;
    var known = req.body.known;




    pg.connect(connectionString, function(err, client) {
        if (err) {
            console.log(err);
        }


        var query2 = client.query('INSERT INTO cardz' +
            '(deck, question, answer, known, email) values($1, $2, $3, $4, $5)',[deck, question, answer, known, email]);


        query2.on('row', function (row) {
            results = row;
            console.log('results', results);
        });

        query2.on('end', function () {
            client.end();
        });
    });
    res.redirect('/profile');

});

//router.get('/addCardz', function(req,res){
//
//})

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
router.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.sendFile(path.join(__dirname, '../public/views/signup.html'));

});

// process the signup form
// client.post('/signup', do all our passport stuff here);
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/fail' // redirect back to the signup page if there is an error
    //failureFlash : true // allow flash messages

}));

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
//
//router.get('/profile', isLoggedIn, function(req, res) {
//    res.sendFile(path.join(__dirname, '../public/views/profile.html'), {
//        user: req.user
//
//        // do something to get the user out of session and pass to template
//    });
//    console.log('req.user is', req.user);
//});


router.get('/profile', function(request, response) {
    if(request.isAuthenticated()) {
        response.sendFile(path.join(__dirname, '../public/views/profile.html'));

    } else {
        response.redirect('/');
    }
});

//router.get('/thankyou', function(req, res){
//    response.sendFile(path.join(__dirname, '../public/views/addCardz.html'));
//});


router.get('/fail', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/fail.html'));
});


router.get('/profile', function(request, response){
    console.log('Request user on success route', request.user);
    response.sendFile(path.join(__dirname, '../public/views/profile.html'));

});

router.get('/getUser', function(request, response){
    //console.log('Huzzah, a user!', request.user);
    //console.log('Authorized:', request.isAuthenticated());
    response.send(request.user);
});

//router.get('/getName', function(req, res){
//    res.send(request.user.data.username);
//
//});


// =====================================
// LOGOUT ==============================
// =====================================
//router.get('/logout', function(req, res) {
//    req.logout();
//    res.redirect('/');
//});

router.get('/logout', function(req, res) {
    console.log('logging out now')
    req.logout();
    console.log('you got logged out')
    res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('isLoggedin');
        return next();
    }
    console.log('is not logged in');

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;



