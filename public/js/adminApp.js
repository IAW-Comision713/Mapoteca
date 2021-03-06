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

    $scope.agregar = true;

    $scope.pin = {};

    vaciarFormulario();
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
            telefono: $scope.formData.telefono ? $scope.formData.telefono : false,
            artesanal: $scope.formData.artesanal ? $scope.formData.artesanal : false,
            delivery: $scope.formData.delivery ? $scope.formData.delivery : false,
            precio: $scope.formData.precio,
            gustos: $scope.formData.gustos ? $scope.formData.gustos.split(",") : []//separa los string en un arreglo de strings
        };

            console.log($scope.formData.artesanal);
            console.log($scope.formData.telefono);
            console.log($scope.formData.delivery);

        // Saves data to the db

        $http.post('/auth/heladerias', {token:localStorage.getItem("token"), heladeria: heladeriaData})
            .success(function (data) {

                vaciarFormulario();
                actualizarHeladerias();

                Materialize.toast("Heladería agregada correctamente!!", 4000);

            })
            .error(function (data) {
                console.log('Error: ' + data);

                Materialize.toast("No fue posible agregar la heladería :(", 4000);
            });
        $http.get('/heladerias').success(function(data){
            console.log("Success:"+data);
        })
        .error(function(data){
            console.log("Error:"+data);
        })
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

    var geocoder = new google.maps.Geocoder;

    $scope.moverPin = function(e) {

        console.log(e);

        $scope.pin.lat = e.latLng.lat();
        $scope.pin.lng = e.latLng.lng();

        $scope.location.lat = e.latLng.lat();
        $scope.location.lng = e.latLng.lng();

        vaciarFormulario();

        $scope.agregar = true;

        geocoder.geocode({location: e.latLng}, function(results, status) {
            
            if (status === 'OK') {
                  if (results[0]) {
                    
                    centrarMapa(e);
                    
                    $scope.formData.direccion = results[0].formatted_address;
                    $scope.$apply();

                  } else {
                    Materialize.toast("No fue posible cargar la dirección :(", 4000);
                  }
                } else {
                  Materialize.toast("Error en el geocoder", 4000);
                }

        });
    }

    $scope.obtenerCoordenadas = function() {

        geocoder.geocode({address: $scope.formData.direccion}, function(results, status) {
            
            if (status == 'OK') {
                    
                    console.log(results[0]);
                    //centrarMapa(results[0].geometry.location);
                    
                    $scope.pin.lat = results[0].geometry.location.lat();
                    $scope.pin.lng = results[0].geometry.location.lng();

                    $scope.location.lat = results[0].geometry.location.lat();
                    $scope.location.lng = results[0].geometry.location.lng();
            } else {
                    
                    //si no encuentra la direccion no pasa nada
            }
        });
    }

    $scope.getAutenticado = function() {
        if(localStorage.getItem("token")!= "")
            return true;
        else return false;
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