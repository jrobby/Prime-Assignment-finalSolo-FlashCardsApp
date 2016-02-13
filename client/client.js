/**
 * Created by robbynewman on 2/4/16.
 */


var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
        .when('/cardDisplay', {
            templateUrl: 'views/cardDisplay.html',
            controller: 'CardController'
        })
        .when('/userCardz', {
            templateUrl: 'views/userCardz.html',
            controller: 'CardController'
        });
    $locationProvider.html5Mode(true);
}]);


app.controller('MainController', ['$scope', '$http', function($scope, $http){

    $http.get('getUser').then(function(response){
        $scope.user = response;

        console.log('user.data is', $scope.user.data);
        console.log('user stuff', $scope.user);
        $scope.user.data.username = response.data.username;

        //$scope.user.data.id = response.data.id;

    });



}]);


app.controller('CardController', ['$scope', '$http', function($scope, $http){


    //$http.get('/getUserCardz/' + email).then(function (response) {
    //    $scope.cardz = response.data;
    //    $scope.data = {
    //        repeatSelect: null,
    //        options: [],
    //    };
    //    for (var i = 0; i<$scope.cardz.length; i++){
    //        if ($scope.data.options.indexOf($scope.cardz[i].deck) == -1) {
    //            $scope.data.options.push($scope.cardz[i].deck);
    //        }
    //
    //
    //        //$scope.data.options.push($scope.cardz[i].deck);
    //
    //    }
    //    console.log('indexOf test', $scope.data.options.indexOf('two'));
    //    console.log("options", $scope.data.options);
    //    //console.log($scope.users);
    //
    //    //console.log('orders: ', $scope.orders);
    //
    //});
var email = $scope.user.data.email;
console.log('email',email);

    $http.get('/getUserCardz/' + email).then(function (response) {
        $scope.cardz = response.data;
        $scope.data = {
            repeatSelect: null,
            options: [],
        };
        for (var i = 0; i<$scope.cardz.length; i++){
            if ($scope.data.options.indexOf($scope.cardz[i].deck) == -1) {
                $scope.data.options.push($scope.cardz[i].deck);
            }


            //$scope.data.options.push($scope.cardz[i].deck);

        }
        console.log('indexOf test', $scope.data.options.indexOf('two'));
        console.log("options", $scope.data.options);
        //console.log($scope.users);

        //console.log('orders: ', $scope.orders);

    });

    $scope.getUserCardz = function(email){

        $http.get('/getUserCardz/' + email).then(function (response) {
            $scope.cardz = response.data;
            $scope.data = {
                repeatSelect: null,
                options: [],
            };
            for (var i = 0; i<$scope.cardz.length; i++){
                if ($scope.data.options.indexOf($scope.cardz[i].deck) == -1) {
                    $scope.data.options.push($scope.cardz[i].deck);
                }


                //$scope.data.options.push($scope.cardz[i].deck);

            }
            console.log('indexOf test', $scope.data.options.indexOf('two'));
            console.log("options", $scope.data.options);
            //console.log($scope.users);

            //console.log('orders: ', $scope.orders);

        });
    }

    $scope.index=0;
    $scope.deck;

    $scope.getDeck = function(email, deck){
        $http.get('/getUserCardz/' + email +'/'+ deck).then(function (response) {
            $scope.deck = response.data;

            console.log('deck: ', $scope.deck);

        });

        //$scope.index = 1;

        //for (var i = 0; i < deck.length; i++) {
        //    $('#cardContainer').append('<div class="index-point" id=' + i + '>' +
        //        '<br>' +
        //        '<p>' + $scope.deck[i].question + '</p>'+
        //        '<br>' +
        //        '<p>' + $scope.deck[i].answer + '</p>' +
        //        '<br>' +
        //        '<p>' + $scope.deck[i].howwellknown + '</p>' +
        //        '<br>' +
        //            //'<img src="' + things[i].img + '" alt="'+things[i].animal+'"/>');
        //        '</div>');
        //    $('#'+i).hide();
        //}
    }

    $scope.next = function(){
        $scope.isAnswerShown = false;
        console.log('index', $scope.index);
        if ($scope.index != $scope.deck.length - 1){
            $scope.index = $scope.index + 1;
        }else{
            $scope.index = 0;
        }
        console.log('after next, index', $scope.index);

    }

    $scope.prev = function(){
        $scope.isAnswerShown = false;
        if ($scope.index != 0){
            $scope.index = $scope.index - 1;
        }else {
            $scope.index = $scope.deck.length - 1;
        }

    }

    $scope.deleteQuestion = function(id){
        $http.delete('/deleteCardz/'+ id).then(function (res){
            var index = -1;
            for (var i = 0; i<$scope.cardz.length; i++) {
                if ( $scope.cardz[i].id === id) {
                    index = i;
                    break;
                }
            }
            if (index > -1){
                // remove the element from the array
                $scope.cardz.splice(index, 1);
            }
        });
    };


    //get('/getUserCardz').then(function(response) {
    //    $scope.users = response.data;
    //    $scope.data = {
    //        repeatSelect: null,
    //        options: [],
    //    };
    //    for (var i = 0; i<$scope.users.length; i++){
    //        $scope.data.options.push($scope.users[i]);
    //    }
    //    console.log($scope.users);
    //});


    }]);
