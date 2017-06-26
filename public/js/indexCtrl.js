(function() {

var indexCtrl = angular.module('indexCtrl', ['ngMap', 'ngRoute']);

var actual = {id: 1, nombre: "Nombre de la heladeria", precio: 120}

indexCtrl.controller('HeladeriaDetallesCtrl', function(){

	//aca va el pedido a la base de datos sobre el detalle de una heladeria en particular

	this.heladeria = {id: 1, nombre: "Nombre de la heladeria", precio: 120};

});

indexCtrl.controller('ListadoHeladeriasCtrl', function(){

	//aca va el pedido a la base de datos de todas las heladerias

	this.actual = actual;
	this.heladerias = [{id: 1, nombre: "Heladeria uno"}, {id: 2, nombre: "Heladeria dos"}];

	this.select = function(id) {

		//aca va el pedido a la base de datos sobre el detalle de una heladeria en particular

		actual.id = id;
	};
});

indexCtrl.controller('PanelCtrl', function(){

	this.tab = 1;

	this.selectTab = function(tabid) {

		this.tab = tabid;
	};

	this.isSelected = function(tabid) {

		return this.tab === tabid;
	}
});

/*indexCtrl.controller('mapCtrl', ['$http', '$scope', '$location', 'NgMap', function($http, $scope, $location, NgMap) {

	var vm = this;
	var map;
    var infowindow;
    var markers = {};

    $scope.fbhref=$location.absUrl();

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
        });
    };

    initMap();

}]);*/

})();