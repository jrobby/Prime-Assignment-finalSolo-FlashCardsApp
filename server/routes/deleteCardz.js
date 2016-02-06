/**
 * Created by robbynewman on 2/6/16.
 */

var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/flash_cardz_1';


router.delete('/:card_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.card_id;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Delete Data
        client.query("DELETE FROM cardz WHERE id=($1)", [id]);

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