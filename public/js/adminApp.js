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

adminApp.controller('adminCtrl', ['$http', '$scope', 'NgMap', function($http, $scope, NgMap) {
// Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};

    $scope.location = {};

    
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
            location: [$scope.location.lat, $scope.location.lng],
            telefono: $scope.formData.telefono,
            artesanal: $scope.formData.artesanal,
            delivery: $scope.formData.delivery,
            precio: $scope.formData.precio,
            gustos: $scope.formData.gustos ? $scope.formData.gustos.split(",") : ""//separa los string en un arreglo de strings
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

    var vm = this;

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

                        $scope.$apply();

                    }
                };

                

                vm = map;
            });
    }
    
    getHeladeriasGoogle();

    $scope.cargarInfoGoogle = function(e, id) {

        console.log(id);
        console.log($scope.heladeriasGoogle[id]);
        $scope.formData.nombre = $scope.heladeriasGoogle[id].name;
        $scope.formData.direccion = $scope.heladeriasGoogle[id].formatted_address;
        $scope.location.lat = $scope.heladeriasGoogle[id].geometry.location.lat();
        $scope.location.lng = $scope.heladeriasGoogle[id].geometry.location.lng();

        centrarMapa(e);
    }

    function centrarMapa(e) {

        vm.setCenter(e.latLng);
        vm.setZoom(16);
    }

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