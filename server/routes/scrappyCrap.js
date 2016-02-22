/**
 * Created by robbynewman on 2/15/16.
 */

router.post('/payment', function(req,res){
    console.log("req.user is this: ", req.user);
    console.log("req.body is this: ", req.body);
    console.log("req is this giant thing: ", req);
    var id = req.user.id;

    var carDebt = req.user.car_loan - req.body.carPayment;
    var houseDebt = req.user.home_loan - req.body.housePayment;
    var balance = req.user.account_balance - req.body.carPayment - req.body.housePayment;
    var results = {};

    pg.connect(connectionString, function(err, client) {
        if (err) {
            console.log(err);
        }
        var query = client.query("UPDATE user_data SET account_balance=$1, car_loan=$2, home_loan=$3 WHERE id = $4",
            [balance, carDebt, houseDebt,id]);

        query.on('row', function (row) {
            results = row;
        });

        query.on('end', function () {
            client.end();
        });
    });
    res.redirect('/success');

});
