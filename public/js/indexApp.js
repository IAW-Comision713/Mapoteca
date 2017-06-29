(function() {

var indexApp = angular.module('indexApp', ['ngMap', 'ngRoute']);

var heladerias;

var actual;

var filtros = []


indexApp.config( ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'partials/panelfiltros.html',
        controller: 'mapCtrl'
      })      
      .when('/comentarios', {
        templateUrl: 'partials/comentarios.html'
        //controller: 'HeladeriaDetallesCtrl',
        //controllerAs: 'detalles'
      })
      .when('/detalles:id', {
        templateUrl: 'partials/detalles.html',
      })
      .when('/listado', {
        templateUrl: 'partials/listado.html',
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'loginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      })
}]);

indexApp.controller('HeladeriaDetallesCtrl', ['$routeParams','$scope',function($routeParams,$scope){

	//aca va el pedido a la base de datos sobre el detalle de una heladeria en particular
	//en routeParams viene el id
  $scope.message='vista detalles';
	this.heladeria = {id: 1, nombre: "Nombre de la heladeria", precio: 120};

}]);

indexApp.controller('loginCtrl', ['$scope', '$http', '$location',function($scope, $http, $location, $window) {
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
            console.log(autenticado);
            console.log(localStorage.getItem("token"));
            window.location = 'http://localhost:3000/auth/admin?token='+token;            
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Error: ' + response.data);
        });
    };
}]);

indexApp.controller('mapCtrl', ['$http', '$scope', '$location', 'NgMap', function($http, $scope, $location, NgMap) {

	$scope.heladerias;
	var actual;

  function actualizarHeladerias() {

        $http.get('/heladerias').then(function successCallback(response) {
                
                $scope.heladerias = response.data;
                actual = heladerias[0];
                $scope.markers=response.data;            
              }, function errorCallback(response) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                  alert('Error al cargar heladerias, recargue la pagina');
              });
    }

    actualizarHeladerias();
   
    $scope.selectHeladeria = function(_id) {

        $http.get('/heladerias/'+_id).then(function(response) {
            
            $scope.detalles = response.data;
            actual = response.data;        
        });

        actualizarComentarios(_id); 
    }




  $scope.showDetail = function(e, pin) {
    NgMap.getMap().then(function(map) {
      $scope.pin=pin;      
      $scope.map.showInfoWindow('h-iw', pin.id);
      console.log(pin.nombre);
    });
  };

  $scope.ctrlChanged = function(){     
    var out=[];
    var num = $scope.heladerias.length;
    console.log($scope.heladerias.length);

    for(var i=0; i<num; i++){

      if($scope.heladerias[i].nombre.substring(0,$scope.formData.nombre.length)==$scope.formData.nombre &&
        $scope.heladerias[i].artesanal == $scope.formData.artesanal &&
        $scope.heladerias[i].delivery == $scope.formData.delivery)
        
        out.push($scope.heladerias[i]);
    }

    console.log(out);

    $scope.markers = out;
    console.log($scope.heladerias[2].nombre.substring(0,$scope.formData.nombre.length))
    console.log($scope.markers);
  };
  


}]);

})();