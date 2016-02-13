/**
 * Created by robbynewman on 2/8/16.
 */


var app = angular.module('routeApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/address', {
            templateUrl: 'views/address.html',
            controller: 'addressController'
        })
        .when('/order',{
            templateUrl:'views/order.html',
            controller:'orderController'
        });
}]);



app.controller('addressController', ['$scope', '$http', function($scope, $http){
    $http.get('/users').then(function(response) {
        $scope.users = response.data;
        $scope.data = {
            repeatSelect: null,
            options: [],
        };
        for (var i = 0; i<$scope.users.length; i++){
            $scope.data.options.push($scope.users[i]);
        }
        console.log($scope.users);
    });


    //$scope.addresses=[];
    $scope.getUserAddresses = function(id) {
        $http.get('/addresses/' + id).then(function (response) {
            $scope.addresses = response.data;
            console.log($scope.addresses);
        });
    }
}]);

app.controller('orderController', ['$scope','$http', function($scope, $http){
    $http.get('/users').then(function(response) {
        $scope.users = response.data;
        $scope.data = {
            repeatSelect: null,
            options: [],
        };
        for (var i = 0; i<$scope.users.length; i++){
            $scope.data.options.push($scope.users[i]);
        }
        console.log($scope.users);
    });

    $scope.orders=[];


    $scope.getUserOrders = function(id, start, end) {

        //$scope.start=String(start);
        console.log('start', start)
        //$scope.end=String(end);
        console.log('end: ', end);

        $http.get('/orders/' + id +'/'+ start  +'/' + end).then(function (response) {
            $scope.orders = response.data;
            //$scope.start = startTime;
            //$scope.end = endTime;
            console.log('orders: ', $scope.orders);
            //console.log(start);
            //console.log(end);

            $scope.orderTotal = 0;
            for (var i = 0; i < $scope.orders.length; i++){
                $scope.orderTotal += parseFloat($scope.orders[i].amount);
                $scope.orders[i].order_date =  $scope.orders[i].order_date.slice(0,10);
                console.log('current total: ', $scope.orderTotal);
                console.log('order_date', $scope.orders[i].order_date);
            }

            console.log('total amount', $scope.orderTotal);


        });

    }

}]);

