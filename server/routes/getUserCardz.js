/**
 * Created by robbynewman on 2/6/16.
 */
var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/flash_cardz_1';

//
//router.get('/', function(req, res) {
//
//    var results = [];
//
//    // Get a Postgres client from the connection pool
//    pg.connect(connectionString, function(err, client, done) {
//        // Handle connection errors
//        if(err) {
//            done();
//            console.log(err);
//            return res.status(500).json({ success: false, data: err});
//        }
//
//        // SQL Query > Select Data
//        var query = client.query("SELECT * FROM cardz ORDER BY id ASC;");
//
//        // Stream results back one row at a time
//        query.on('row', function(row) {
//            results.push(row);
//        });
//
//        // After all data is returned, close connection and return results
//        query.on('end', function() {
//            done();
//            return res.json(results);
//        });
//
//    });
//
//});



router.get('/:userEmail', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var email = req.params.userEmail;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle Errors
        if(err) {
            console.log(err);
        }

        // SQL Query > Delete Data
        var query = client.query('SELECT * FROM cardz WHERE email=($1)', [email]);


        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });
    });

});


router.get('/:userEmail/:deck/:one/:two/:three/:four/:five', function(req, res) {
console.log('req.body', req.body);
    var results = [];

    // Grab data from the URL parameters
    //var checkOne = req.body.one;
    //console.log('checkOne', checkOne);
    var email = req.params.userEmail;
    var deck = req.params.deck;
    var one = req.params.one;
    var two = req.params.two;
    var three = req.params.three;
    var four = req.params.four;
    var five = req.params.five;

    numbers = [one, two, three, four, five];

console.log('1,2,3,4,5', one, two, three, four, five);

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle Errors
        if(err) {
            console.log(err);
        }

        //var query = client.query('SELECT * FROM orders WHERE orders.user_ID=$1' +
        //    'AND order_date > $2 AND order_date < $3 ' +
        //    'ORDER BY order_date', [id, dateStart, dateEnd]);


        // SQL Query > Delete Data
        var query = client.query('SELECT * FROM cardz WHERE email=($1) AND deck = ($2) AND ' +
            '(known = ($3) OR ' +
            'known = ($4) OR ' +
            'known = ($5) OR ' +
            'known = ($6) OR ' +
            'known = ($7))', [email, deck, one, two, three, four, five]);


        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });
    });

});


module.exports = router;