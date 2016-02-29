//CartoDB Basemap
var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

var eastRiver = [40.706913,-73.987513];

var myZoom = 5;
//now the fun stuff:  leaflet!
var map = L.map('myMap').setView(eastRiver, myZoom);
map.addLayer(layer)

$.getJSON('data/cities.geojson', function(data) {
  console.log(data);
  var lived_style = {
    radius: 10,
    fillColor: '#3366ff',
    color: '#FFF',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  };

  var not_lived_style = {
    radius: 10,
    fillColor: '#ff3300',
    color: '#FFF',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  };

  var burgerIcon = L.icon({
    iconUrl: 'img/burger.png',
    iconSize: [37, 37],
    iconAnchor: [16, 37]
  });

  var geojson;

  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      console.log(feature);

      if(feature.properties.chris_lived_here == "true") {
        return L.circleMarker(latlng, lived_style);
      } else {
        return L.circleMarker(latlng, not_lived_style);
      }
    }
  }
  ).addTo(map);

  function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
  }

  function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  }

  function mouseoverFunction(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    console.log(layer.feature.properties.name);
    $('#infoWindow').text(layer.feature.properties.name);

  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: mouseoverFunction,
        mouseout: resetHighlight,
        //click: zoomToFeature
    });
  }

  $.getJSON('data/states.geojson', function(states_data) {
    geojson = L.geoJson(states_data, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
  });
});