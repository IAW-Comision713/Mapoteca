$( document ).ready(function() {

var slider = document.getElementById('precio');

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
  });

});