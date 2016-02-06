/**
 * Created by robbynewman on 2/4/16.
 */


var app = angular.module('myApp', []);

console.log('angular page connected');
app.controller('MainController', ['$scope', '$http', function($scope, $http){

    $http.get('getUser').then(function(response){
        $scope.user = response;
        console.log('user stuff', $scope.user);
        $scope.user.data.username = response.data.username;
        //$scope.user.data.id = response.data.id;

    });


}]);



