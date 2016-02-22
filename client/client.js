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
        .when('/addCardz', {
            templateUrl: 'views/addCardz.html',
            controller: 'CardController'
        })
        .when('/logout', {
            templateUrl: 'views/index.html',
            controller: 'LogoutController'
        });
    $locationProvider.html5Mode(true);
}]);


app.controller('MainController', ['$scope', '$http', function($scope, $http){
    $scope.names = ["one", "two", "three", "four", "five"];

    $http.get('getUser').then(function(response){
        $scope.user = response;

        console.log('user.data is', $scope.user.data);
        console.log('user stuff', $scope.user);
        $scope.user.data.username = response.data.username;

        //$scope.user.data.id = response.data.id;
    });
}]);


app.controller('CardController', ['$scope', '$http', function($scope, $http){


$scope.names = ["one", "two", "three", "four", "five"];
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

        }
        console.log('indexOf test', $scope.data.options.indexOf('two'));
        console.log("options", $scope.data.options);

        //console.log($scope.users);
        //console.log('orders: ', $scope.orders);
    });

    $scope.index=0;
    $scope.deck;

    $scope.getDeck = function(email, deck, one, two, three, four, five){
        console.log('1,2,3,4,5', one, two, three, four, five);

        $http.get('/getUserCardz/' + email +'/'+ deck + "/" + one + "/" + two + "/" + three + "/" + four + "/" + five).then(function (response) {
            $scope.deck = response.data;

            console.log('deck: ', $scope.deck);

        });
    }
    // "/" + checkbox.one + "/" + checkbox.two + "/" + checkbox.three + "/" + checkbox.four + "/" + checkbox.five

//$scope.updateCardz = function(id, known){
//    $http.post('/updateCardz/' + id +'/' + known){
//
//    }
//}
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

    $scope.updateKnown = function(id, known){
        console.log('id and known', id, known);
        $http.post('/updateKnown');
    }



    $scope.checkbox = {
        one : "one",
        two: "two",
        three: "three",
        four: "four",
        five: "five"
    };

}]);



