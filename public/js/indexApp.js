(function() {

var indexApp = angular.module('indexApp', ['ngMap', 'ngRoute', 'geolocation']);

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
      .when('/detalles', {
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

indexApp.controller('mapCtrl', ['$http', '$scope', '$location', 'NgMap', function($http, $scope, $location, NgMap, geolocation) {

		$scope.heladerias;
		$scope.urlfacebook
		$scope.detalles = {};
		$scope.agregar = false;
		var actual;
		
		var vm = this;

		function obtenerMapa() {

			NgMap.getMap().then(function(map) {

		    	vm = map;
			});
		}

		obtenerMapa();

	  function actualizarHeladerias() {

	        $http.get('/heladerias').then(function successCallback(response) {
	                
	                $scope.heladerias = response.data;
	                actual = $scope.heladerias[0];
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                      var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                      };
                      //infoWindow.setPosition(pos);
                      //infoWindow.setContent('Location found.');
                      vm.center=pos;
                    }, function() {
                      console.log("Geolocation ok")
                    });
                  } else {
                    // Browser doesn't support Geolocation
                    alert("Error geolocation");
                  }

	                /*geolocation.getLocation().then(function(data){
	            	
	            		coords = {lat:data.coords.latitude, long:data.coords.longitude};
	          		});*/	          
	          		$scope.markers=response.data;            
	        }, function errorCallback(response) {
	                  // called asynchronously if an error occurs
	                  // or server returns response with an error status.
	                  alert('Error al cargar heladerias, recargue la pagina');
	           });
	    }

	    actualizarHeladerias();
	    actualizarComentarios();
	   
	    $scope.selectHeladeria = function(_id) {

	        $http.get('/heladerias/'+_id).then(function(response) {
	            
	            $scope.detalles = response.data;
	            actual = response.data;  

	            vm.setCenter(new google.maps.LatLng($scope.detalles.location[0], $scope.detalles.location[1]));
	            vm.setZoom(16);      
	        });

	        actualizarComentarios(_id);

	        $scope.agregar = false;
	    }

	    $scope.cargarInfoHeladeria = function(e, id) {

	        $scope.selectHeladeria(id);

	        centrarMapa(e);

	        $scope.showDetail(e, id);

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
	            $scope.urlfacebook = $location.protocol()+ "://"+ $location.host() + ":"+ $location.port();

	        console.log($scope.urlfacebook);
	    }

  $scope.mycallback=function(map){
    
    	NgMap.getMap().then(function(map) {
    	
    	$scope.map = map;
    });    
  };

  $scope.showDetail = function(e, pin) {
    NgMap.getMap().then(function(map) {
      $scope.pin=pin;      
      vm.showInfoWindow('h-iw', pin.id);
      console.log(pin.nombre);
    });
  };

  $scope.ctrlChanged = function() {

    var out=[];

    var num=$scope.heladerias.length; 
    console.log("precio "+$scope.formData.distancia);   
    
    if($scope.formData.distancia != undefined){
      
      var distances=[];
    if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                      var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                      };
                      
                      vm.center=pos;
            queryBody = {
            longitude: longitude,
            latitude: latitude,
            distance: $scope.formData.distance            
          };
          $http.post('/query', queryBody)
          // Store the filtered results in queryResults
            .success(function(queryResults){
              distances=queryResults.data;
              console.log("QueryResults:");
              console.log(queryResults);

            // Count the number of records retrieved for the panel-footer
              $scope.queryCount = queryResults.length;
            })
            .error(function(queryResults){
              console.log('Error ' + queryResults);
            });
          
                    }, function() {
                      console.log("Geolocation ok")
                    });
                  } else {
                    // Browser doesn't support Geolocation
                    alert("Error geolocation");
                  }
    
      //control de otros filtros a partir de los resultados de distancia

      for(var i=0; i<distances.length; i++){
        if(($scope.formData.nombre == undefined) || ($scope.formData.nombre != undefined && distances[i].nombre.substring(0,$scope.formData.nombre.length)==$scope.formData.nombre))        
          if(($scope.formData.delivery==true && distances[i].delivery==true) || $scope.formData.delivery==undefined)
            if(( $scope.formData.tipohelado=='artesanal' && distances[i].artesanal==true) || ($scope.formData.tipohelado=='artesanal' && distances[i].artesanal==false) || $scope.formData.tipohelado==undefined)
              if(($scope.formData.precio == undefined) || (distances[i].precio <= $scope.formData.precio))              
                out.push(distances[i]);
      }
    }
    else{
      for(var i=0; i<num; i++){
      if(($scope.formData.nombre == undefined) || ($scope.formData.nombre != undefined && $scope.heladerias[i].nombre.substring(0,$scope.formData.nombre.length)==$scope.formData.nombre))        
        if(($scope.formData.delivery==true && $scope.heladerias[i].delivery==true) || $scope.formData.delivery==undefined)
          if(( $scope.formData.tipohelado=='artesanal' && $scope.heladerias[i].artesanal==true) || ($scope.formData.tipohelado=='artesanal' && $scope.heladerias[i].artesanal==false) || $scope.formData.tipohelado==undefined)
            if(($scope.formData.precio == undefined) || ($scope.heladerias[i].precio <= $scope.formData.precio))              
              out.push($scope.heladerias[i]);              
      }
    }    

    $scope.markers=out;
    console.log($scope.markers);
  }

}]);

})();