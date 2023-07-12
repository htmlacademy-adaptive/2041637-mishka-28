ymaps.ready(init);

function init(){

  var myMap = new ymaps.Map("map", {
      center: [59.93884010988801, 30.323079586505862],
      zoom: 17
  });

  var myPlacemark = new ymaps.Placemark([59.93884010988801, 30.323079586505862], {}, {
    iconLayout: 'default#image',
    iconImageHref: '../img/map-pin.png',
    iconImageSize: [67, 100],
    iconImageOffset: [-33, -100]
  });

  myMap.geoObjects.add(myPlacemark);
}