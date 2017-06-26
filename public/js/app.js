// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
//var app = angular.module('meanMapApp', [ 'addCtrl' , 'ngRoute' , require('angular-route') ]);

var app = angular.module('meanMapApp', [ 'adminCtrl' , 'ngRoute' ]);

app.controller('loginCtrl', ['$scope', '$http', '$location', function($scope, $http, $location, $window) {
// Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
   
    // Functions
    // ----------------------------------------------------------------------------
    // Creates a new heladeria based on the form fields
    $scope.login = function() {

        
        var userData = {
            usuario: $scope.formData.usuario,
            password: $scope.formData.password,
        };

        $http({
            method: 'POST',
            url: '/authenticate'
        }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
            $window.localStorage['token']=response.data.token;
            $location.url('api/edit');
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Error: ' + response.data);
        });   
        
    };
}]);