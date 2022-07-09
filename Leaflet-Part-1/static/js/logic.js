
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
      radius:feature.geometry.coordinates[2], 
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      color:chooseColor(feature.geometry.coordinates[2]),
      weight:1,
      opacity:1,
      fillOpacity: 0.8
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

// Set color based on magnitude depth
function chooseColor(depth) {
  switch(true) {
    case (depth > 90):
      return "#FD0719";
    case (depth > 70):
      return "#E25416";
    case (depth > 50):
      return "#F59648";
    case (depth > 30):
      return "#FBFD7C";
    case (depth > 10):
      return "#8FFD7C";
    default:
      return "#8FFD7C";
  }
}
  // Add Legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create('div', 'info legend'),
    depth = [-10, 10, 30, 50, 70, 90];
    div.innerHTML += "<h2 style='text-align: center'>Depth</h2>"
    for (var i =0; i < depth.length; i++) {
      div.innerHTML += 
      '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
          depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

      return div;
  };
  
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

  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  legend.addTo(myMap);


};