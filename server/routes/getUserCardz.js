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


router.get('/:userEmail/:deck', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var email = req.params.userEmail;
    var deck = req.params.deck;


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
        var query = client.query('SELECT * FROM cardz WHERE email=($1) AND deck = ($2)', [email, deck]);


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