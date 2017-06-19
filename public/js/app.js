// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
//var app = angular.module('meanMapApp', [ 'addCtrl' , 'ngRoute' , require('angular-route') ]);

var app = angular.module('meanMapApp', [ 'addCtrl' , 'ngRoute' ]);

/*var slider = document.getElementById('precio');
  noUiSlider.create(slider, {
   start: [80, 150],
   connect: true,
   step: 1,
   range: {
     'min': 0,
     'max': 400
   },
   format: wNumb({
     decimals: 0
   })
  });*/