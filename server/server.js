//set up our application

var express  = require('express');
var app      = express();
var passport = require('passport');
const flash    = require('connect-flash');


var bodyParser   = require('body-parser');
var session      = require('express-session');
var LocalStrategy   = require('passport-local').Strategy;
var pg           = require('pg');
var index = require('./routes/index');

//
var read = require('./routes/getUserCardz');
//
//var create = require('./routes/createCardz');
//
var remove = require('./routes/deleteCardz');
//
//var update = require('./routes/updateCardz');
//
//var getAll = require('./routes/getAllCardz');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var connectionString = 'postgres://localhost:5432/flash_cardz_1';


var client = new pg.Client(connectionString);

// load up the user model
var User = require('./models/user');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//app.use(flash());

app.use(express.static('server/public'));

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 600000, secure: false}
}));


app.use(passport.initialize());
app.use(passport.session());


// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    console.log(user.id +" was seralized");
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    console.log(id + "is deserialized");
    User.findById(id, function(err, user) {

        done(err, user);
    });
});

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'



passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function(callback) {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne(email, function(err, isNotAvailable, user) {
                console.log('userfound: ' + isNotAvailable);
                // if there are any errors, return the error
                if (err)
                    return done(err);
                //if (){
                //}

                // check to see if theres already a user with that email
                if (isNotAvailable == true) {
                    //console.log(user.email +' is not available');
                    return done(null, false, {message: 'Email not found.'});
                } else {
                    console.log('new local user');



                    // if there is no user with that email
                    // create the user
                    user            = new User();

                    // set the user's local credentials

                    user.email    = req.body.email;
                    user.password = req.body.password;
                    user.username = req.body.username;
                    //user.color = req.body.color;
                    //newUser.photo = 'http://www.flippersmack.com/wp-content/uploads/2011/08/Scuba-diving.jpg';

                    user.save(function(newUser) {
                        console.log("the object user is: ", newUser);
                        passport.authenticate();
                        return done(null, newUser);
                        //newUser.password = newUser.generateHash(password);
                    });
                }

            });

        });

    }));

// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'


passport.use('local-login', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'
}, function(req, email, password, done){

    pg.connect(connectionString, function(err,client){
        var user = {};


        var query = client.query('SELECT * FROM users WHERE email = $1', [email]);


        query.on('row', function(row){
            user=row;
            console.log('user in pg.connect', user);
        });

        query.on('end', function(){
            if (user && user.password ===password){
                done(null, user);
            } else {
                //res.json({ message: 'This message is known by all' });
                return done(null, false, {message: 'wrong password.'}); //fail res.json({ message: 'This message is known by all' });
            }
            client.end();
        });
    })
}));


// routes ======================================================================
//var index = require('./routes/index.js'); // load our routes and pass in our client and fully configured passport

app.use('/', index);

//app.use('/getAllCardz', getAll);
app.use('/getUserCardz', read);
//app.use('/createCardz', create);
//app.use('/updateCardz', update);
//app.use('/deleteCardz', remove);


// launch ======================================================================

var server = app.listen(3000, function(){
    var port = server.address().port;
    console.log('Address', server.address());
    console.log('Listening on port', port);
});
