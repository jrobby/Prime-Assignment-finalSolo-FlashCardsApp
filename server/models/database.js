/**
 * Created by robbynewman on 2/6/16.
 */


var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/flash_cardz_1';

var client = new pg.Client(connectionString);
client.connect();

//var query = client.query('CREATE TABLE items(SOMETHING SOMETHING)');
//query.on('end', function() { client.end(); });
