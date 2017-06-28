(function() {

var adminApp = angular.module('adminApp', ['ngRoute', 'ngMap']);

var token;
var autenticado = true;

var direccion = "";
var location = [];

adminApp.config( ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/admin', {
        templateUrl: 'partials/panelabm.html'        
      })     
      .when('/admin/comentarios', {
        templateUrl: 'partials/comentarios.html'
        //controller: 'HeladeriaDetallesCtrl',
        //controllerAs: 'detalles'
      })
      .when('/admin/detalles', {
        templateUrl: 'partials/detalles.html',
        //controller: 'HeladeriaDetallesCtrl',
        //controllerAs: 'detalles'
      })
      .when('/admin/listado', {
        templateUrl: 'partials/listado.html',
        //controller: 'ListadoHeladeriasCtrl',
        //controllerAs: 'listado'
      })
      .otherwise({
        redirectTo: '/admin'
      });
}]);

adminApp.controller('adminCtrl', ['$scope', '$http', function($scope, $http) {
// Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};

    $scope.formData.direccion = direccion;

    
    // Functions
    // ----------------------------------------------------------------------------
    $scope.logout = function(){
        localStorage.setItem("token","");
        window.location="/";
    };


    // Creates a new heladeria based on the form fields
    $scope.createHeladeria = function() {

        // Grabs all of the text box fields
        var heladeriaData = {
            nombre: $scope.formData.nombre,
            direccion: $scope.formData.direccion,
            location: location,
            telefono: $scope.formData.telefono,
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
                $scope.formData.direccion = "";
                $scope.formData.telefono = "";
                $scope.formData.artesanal = "false";
                $scope.formData.delivery = "false";
                $scope.formData.precio = "";
                $scope.formData.gustos=""

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.getAutenticado = function() {
        if(localStorage.getItem("token")!= "")
            return true;
        else return false;
    }
}]);

adminApp.controller('mapCtrl', ['$http', '$scope', '$location', 'NgMap', function($http, $scope, $location, NgMap) {

    var vm = this;
    var map;
    var infowindow;
    var markers = {};

    //$scope.fbhref=$location.absUrl();

    initMap = function() {

        var pyrmont = {lat: -38.7167, lng: -62.2833};

        map = new google.maps.Map(document.getElementById('map'), {
          center: pyrmont,
          zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.textSearch({
          location: pyrmont,
          radius: 500,
          query: 'heladeria'
        }, callback);
    };

    callback = function(results, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
    };

    createMarker = function(place) {

        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
          location = [marker.position.lat, marker.position.long];
        });
    };

    initMap();

}]);

})();