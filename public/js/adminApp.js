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



adminApp.controller('adminCtrl', ['$http', '$scope', 'NgMap', function($http, $scope, NgMap) {
// Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};

    $scope.location = {};

    $scope.agregar = true;
    // Functions
    // ----------------------------------------------------------------------------
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
            gustos: $scope.formData.gustos ? $scope.formData.gustos.split(",") : []//separa los string en un arreglo de strings
        };

        // Saves data to the db
        $http.post('/heladerias', {token:"123", heladeria: heladeriaData})
            .success(function (data) {

                vaciarFormulario();
                actualizarHeladerias();

                Materialize.toast("Heladería agregada correctamente!!", 4000);

            })
            .error(function (data) {
                console.log('Error: ' + data);

                Materialize.toast("No fue posible agregar la heladería :(", 4000);
            });
    };

    $scope.id = 0;

    $scope.updateHeladeria = function() {

        var heladeriaData = {
            nombre: $scope.formData.nombre,
            direccion: $scope.formData.direccion,
            location: $scope.detalles.location,
            telefono: $scope.formData.telefono,
            artesanal: $scope.formData.artesanal,
            delivery: $scope.formData.delivery,
            precio: $scope.formData.precio,
            gustos: $scope.formData.gustos ? $scope.formData.gustos.split(",") : []//separa los string en un arreglo de strings
        };

        $http.put('/heladerias/'+$scope.detalles._id, {token:"123", heladeria: heladeriaData})
        .success(function (data) {

            vaciarFormulario();
            actualizarHeladerias();
            
            Materialize.toast("Heladería editada correctamente!!", 4000);

        })
        .error(function (data) {
            console.log('Error: ' + data);

            Materialize.toast("No fue posible editar la heladería :(", 4000);
        });
 
    }

    $scope.removeHeladeria = function() {

        $http.delete('/heladerias/'+$scope.detalles._id, {token: "123"})
        .success(function (data) {

            vaciarFormulario();
            actualizarHeladerias();

            Materialize.toast("Heladería eliminada correctamente!!", 4000);

        })
        .error(function (data) {
            console.log('Error: ' + data);

            Materialize.toast("No fue posible eliminar la heladería :(", 4000);
        });
    }

    function vaciarFormulario() {

        $scope.formData.nombre = "";
        $scope.formData.direccion = "";
        $scope.formData.telefono = "";
        $scope.formData.artesanal = "false";
        $scope.formData.delivery = "false";
        $scope.formData.precio = "";
        $scope.formData.gustos="";

        $scope.detalles = {};
    }

    $scope.selectHeladeria = function(_id) {

        $http.get('/heladerias/'+_id).then(function(response) {
            
            $scope.detalles = response.data;

            vm.setCenter(new google.maps.LatLng($scope.detalles.location[0], $scope.detalles.location[1]));
            vm.setZoom(16);

            $scope.formData.nombre = $scope.detalles.nombre;
            $scope.formData.direccion = $scope.detalles.direccion;
            $scope.formData.telefono = $scope.detalles.telefono;
            $scope.formData.artesanal = $scope.detalles.artesanal;
            $scope.formData.delivery = $scope.detalles.delivery;
            $scope.formData.precio = $scope.detalles.precio;
            $scope.formData.gustos= $scope.detalles.gustos;
            $scope.location.lat = $scope.detalles.location[0];
            $scope.location.lng = $scope.detalles.location[1];

            $scope.agregar = false;           
        });

        
    }

    $scope.getAutenticado = function() {

        return autenticado;
    }

    function actualizarHeladerias() {

        $http.get('/heladerias').then(function(response) {
            
            $scope.heladerias = response.data;            
        });
    }

    //actualizarHeladerias();

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

                        actualizarHeladerias();

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
        $scope.formData.telefono = "";
        $scope.formData.artesanal = false;
        $scope.formData.delivery = false;
        $scope.formData.precio = "";
        $scope.formData.gustos= "";
        $scope.location.lat = $scope.heladeriasGoogle[id].geometry.location.lat();
        $scope.location.lng = $scope.heladeriasGoogle[id].geometry.location.lng();

        $scope.detalles = {};

        centrarMapa(e);

        $scope.agregar = true;
    }

    $scope.cargarInfoHeladeria = function(e, id) {

        $scope.selectHeladeria(id);

        console.log(id);
        console.log(e);

        centrarMapa(e);

        //$scope.agregar = false;
    }

    function centrarMapa(e) {

        vm.setCenter(e.latLng);
        
        vm.setZoom(16);
    }

}]);

})();