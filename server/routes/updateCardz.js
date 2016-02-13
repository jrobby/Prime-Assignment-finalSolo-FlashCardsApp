/**
 * Created by robbynewman on 2/6/16.
 */

var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/flash_cardz_1';


router.put('/:card_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.card_id;

    // Grab data from http request
    var data = {question: req.body.question, answer: req.body.answer};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE cardz SET question=($1), answer=($2) WHERE id=($3)", [data.question, data.answer, id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM cardz ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});

module.exports = router;