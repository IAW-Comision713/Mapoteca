$( document ).ready(function() {

var slider = document.getElementById('rangoprecio');


if(slider)
noUiSlider.create(slider, {
   start: [80, 150],
   connect: true,
   step: 10,
   range: {
     'min': 0,
     'max': 300
   },
   format: wNumb({
     decimals: 0
   })
  });

   $('.slider').slider();

});