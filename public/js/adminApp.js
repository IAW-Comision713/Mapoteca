(function() {

var adminApp = angular.module('adminApp', ['ngRoute', 'ngMap']);

var token;
var autenticado;

var direccion = "";
var location = [];

/*adminApp.config( ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    
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
      .when('/readme', {
        templateUrl: 'partials/readme.html'
      })
      .otherwise({
        redirectTo: '/admin'
      });
}]);*/

adminApp.controller('adminCtrl', ['$http', '$scope', 'NgMap', '$location', function($http, $scope, NgMap, $location) {

    $scope.formData = {};

    $scope.location = {};

    $scope.agregar = true;

    $scope.pin = {};

    $scope.urlfacebook = $location.protocol()+ "://"+ $location.host() + ":"+ $location.port() + "/comentarios";

    vaciarFormulario();

    function chequearLogin() {

        $http.get('/auth', {"headers": {"x-access-token": localStorage.getItem("token")}}).then(function(response) {
                $scope.autenticado = response.data.success;          
        }, function errorCallback(response) {
                $scope.autenticado = false;
        });
    }

    chequearLogin();

    $scope.login = function() {

        var userData = {
            usuario: $scope.formData.usuario,
            password: $scope.formData.password,
        };
        
        $http.post("/authenticate", userData).then(function successCallback(response) {

            $scope.autenticado = response.data.success;
            localStorage.setItem("token", response.data.token);
            console.log($scope.autenticado);
            console.log(localStorage.getItem("token"));

            $scope.formData = {};
                        
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Error: ' + response.data);
        });
    }

    $scope.logout = function(){
        
        autenticado = false;
        localStorage.setItem("token", "");

    };

    // Creates a new heladeria based on the form fields
    $scope.createHeladeria = function() {

        // Grabs all of the text box fields
        var heladeriaData = {
            nombre: $scope.formData.nombre,
            direccion: $scope.formData.direccion,
            location: [$scope.location.lat, $scope.location.lng],
            telefono: $scope.formData.telefono ? $scope.formData.telefono : "",
            artesanal: $scope.formData.artesanal ? $scope.formData.artesanal : false,
            delivery: $scope.formData.delivery ? $scope.formData.delivery : false,
            precio: $scope.formData.precio,
            gustos: $scope.formData.gustos ? $scope.formData.gustos.split(",") : []//separa los string en un arreglo de strings
        };

        // Saves data to the db
        $http.post('/auth/heladerias', {'token': localStorage.getItem("token"), 'heladeria': heladeriaData})
            .success(function (data) {
                
                Materialize.toast("Heladería agregada correctamente!!", 4000);
                vaciarFormulario();
                actualizarHeladerias();

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

        $http.put('/auth/heladerias/'+$scope.detalles._id, {'token': localStorage.getItem("token"), 'heladeria': heladeriaData})
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
        
        var data = {

            "headers": {"x-access-token": localStorage.getItem("token")}
        };

        $http.delete('/auth/heladerias/'+$scope.detalles._id, data)
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

        actualizarComentarios(_id);

        $http.get('/heladerias/'+_id).then(function(response) {

            console.log(response.data);
                
            $scope.detalles = response.data;

            vm.setCenter(new google.maps.LatLng($scope.detalles.location[0], $scope.detalles.location[1]));
            vm.setZoom(16);

            $scope.formData.nombre = $scope.detalles.nombre;
            $scope.formData.direccion = $scope.detalles.direccion;
            $scope.formData.telefono = $scope.detalles.telefono ? $scope.detalles.telefono : "",
            $scope.formData.artesanal = $scope.detalles.artesanal;
            $scope.formData.delivery = $scope.detalles.delivery;
            $scope.formData.precio = $scope.detalles.precio;
            $scope.formData.gustos= $scope.detalles.gustos.toString();
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
        actualizarComentarios();

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

        actualizarComentarios();

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
        
        return $scope.autenticado;
    }

    //crear marcadores para las heladerias guardadas
    function actualizarHeladerias() {

        $http.get('/heladerias').then(function(response) {
            $scope.heladerias = [];            
            $scope.heladerias = response.data;            
        });
    }

    //Variable que siempre tiene el mapa
    var vm = this;

    //crear marcadores para las heladerias de google
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

        //console.log(id);
        //console.log($scope.heladeriasGoogle[id]);
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

        actualizarComentarios();
    }

    $scope.cargarInfoHeladeria = function(e, id) {

        $scope.selectHeladeria(id);

        centrarMapa(e);

        //$scope.agregar = false;
    }

    function centrarMapa(e) {

        vm.setCenter(e.latLng);
        
        vm.setZoom(16);
    }

    function actualizarComentarios(id) {


        if(id)
            $scope.urlfacebook = $location.protocol()+ "://"+ $location.host() + ":"+ $location.port() + "/comentarios/" + id;
        else
            $scope.urlfacebook = $location.protocol()+ "://"+ $location.host() + ":"+ $location.port() + "/comentarios";
        
        //console.log(id);
        //console.log($scope.urlfacebook);

        $scope.$apply();

        FB.XFBML.parse();
    }

}]);

})();