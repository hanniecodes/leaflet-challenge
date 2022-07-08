// Create url for gejson data 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// // check that data is there
// // d3.json(url).then(function (data){ 
// //     console.log(data);
// //     return data;
// //   });

// Get earthquake data 
d3.json(url).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3><b>Location:</b> ${feature.properties.place}</h3><hr><p><b>Date and Time:</b> ${new Date(feature.properties.time)}<hr><b>Magnitude:</b> ${feature.properties.mag}`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  function createCircleMarkers(feature,latlng){
    let magStyle={
      radius:feature.properties.mag * 5, 
      fillColor: chooseColor(feature.properties.mag),
      color:chooseColor(feature.properties.mag),
      weight:1,
      opacity:1,
      fillOpacity: 0.5
    } 
    return L.circleMarker(latlng,magStyle);
  }
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer:createCircleMarkers
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}
// Set color based on magniture
function chooseColor(mag){
  switch(true){
      case(0 <= mag && mag <= 1):
          return "#2FA8E2";
      case (1 <= mag && mag <=2):
          return "#2FE2D1";
      case (2 <= mag && mag <=3):
          return "#36E22F";
      case (3 <= mag && mag <= 5):
          return "#D3E22F";
      case (5 <= mag && mag <=20.0):
          return "#E2412F";
      default:
          return "#2F4FE2";
  }
}
function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}