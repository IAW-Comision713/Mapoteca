// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
//var app = angular.module('meanMapApp', [ 'addCtrl' , 'ngRoute' , require('angular-route') ]);

var app = angular.module('meanMapApp', [ 'adminCtrl' , 'ngRoute' ]);

app.controller('loginCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
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

      
        $http.post('/api/authenticate', userData)
            .success(function (data) {

               window.location = '/edit';

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
}]);