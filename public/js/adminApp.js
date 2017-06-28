(function() {

var adminApp = angular.module('adminApp', ['ngRoute', 'ngMap']);

var token;
var autenticado = true;

var heladeriasGoogle = [];

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

adminApp.controller('loginCtrl', ['$scope', '$http', '$location', function($scope, $http, $location, $window) {
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

        $http.post("/authenticate", userData).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
            token = response.data.token;
            autenticado = response.data.success;

            localStorage.setItem("token", response.data.token);

            if(localStorage.getItem("token")!==null){
                  
                 
               }
               else {
                   
                   
                         
               }

            console.log(autenticado);

            $location.url('/admin');
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Error: ' + response.data);
        });   
        
    };
}]);



adminApp.controller('adminCtrl', ['$http', '$scope', '$location', 'NgMap', function($http, $scope, $location, NgMap) {
// Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};

    $scope.formData.direccion = direccion;

    
    // Functions
    // ----------------------------------------------------------------------------
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

        return autenticado;
    }

    var vm;

    //crear marcadores para las heladerias guardadas

    //crear marcadores para las heladerias de google
    //$scope.heladeriasGoogle = [];

    function getHeladeriasGoogle(){
            
            //Bahia Blanca

            var pyrmont = {lat: -38.7167, lng: -62.2833};

            NgMap.getMap().then(function(map) {


                var service = new google.maps.places.PlacesService(map);
                    service.textSearch({
                      location: pyrmont,
                      radius: 5000,
                      query: 'heladeria'
                    }, callback);

                function callback(results, status) {

                    if (status === google.maps.places.PlacesServiceStatus.OK) {

                        console.log(results);

                        $scope.heladeriasGoogle = results;

                        console.log($scope.heladeriasGoogle);

                        console.log($scope.heladeriasGoogle[0].geometry.location.lat());
                    }
                }

                vm = map;
            });
    }

    getHeladeriasGoogle();

}]);

adminApp.controller('mapCtrl', ['$http', '$scope', '$location', 'NgMap', function($http, $scope, $location, NgMap) {

    var vm = this;
    var map;
    var infowindow;
    var markers = {};

    //$scope.fbhref=$location.absUrl();

    //crear marcadores para las heladerias guardadas
    this.listado = {};

    //crear marcadores para las heladerias de google
    heladeriasGoogle = [{position:{lat: -38.7167, lng: -62.2833}}];

    /*getHeladeriasGoogle = function() {
        
        //Bahia Blanca

        var pyrmont = {lat: -38.7167, lng: -62.2833};

        NgMap.getMap().then(function(map) {


            var service = new google.maps.places.PlacesService(map);
                service.textSearch({
                  location: pyrmont,
                  radius: 5000,
                  query: 'heladeria'
                }, callback);
            });

            function callback(results, status) {

                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                  }
                }
            };

            function createMarker(place) {

                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                  map: map,
                  position: place.geometry.location
                });

                var marcador = {}

                heladeriasGoogle.push(marker);

                console.log(marker.position.lat());

                google.maps.event.addListener(marker, 'click', function() {
                  infowindow.setContent(place.name);
                  infowindow.open(map, this);
                  location = [marker.position.lat(), marker.position.lng()];
                });
            };

            //vm = map;
            
            console.log(heladeriasGoogle);
        }

    getHeladeriasGoogle();*/

}]);

})();