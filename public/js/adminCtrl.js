var adminCtrl = angular.module('adminCtrl', []);

adminCtrl.controller('addCtrl', ['$scope', '$http', function($scope, $http) {
// Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
   
    // Functions
    // ----------------------------------------------------------------------------
    // Creates a new heladeria based on the form fields
    $scope.createHeladeria = function() {

        // Grabs all of the text box fields
        var heladeriaData = {
            name: $scope.formData.nombre,
            artesanal: $scope.formData.artesanal,
            delivery: $scope.formData.delivery,
            precio: $scope.formData.precio,
            gustos: $scope.formData.gustos.split(",") //separa los string en un arreglo de strings
        };

        // Saves data to the db
        $http.post('/heladerias', heladeriaData)
            .success(function (data) {

                // Once complete, clear the form (except location)
                $scope.formData.nombre = "";
                $scope.formData.artesanal = "false";
                $scope.formData.delivery = "false";
                $scope.formData.precio = "";
                $scope.formData.gustos=""

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
}]);