// Create url for gejson data 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// check that data is there
d3.json(url).then(function (data){ 
    console.log(data);
    features(data.features);
    return data;
    
  });

// define createMap as a function
function createMap(earthquake) {
    // Create the tile layer that will be the background of our map.
    var base= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map); 
    // creating Basemap object   
    var baseMaps={
        "Street Map":base,
    }
  // Create center .
    var map = L.map("map-id", {
        center: [38.5816,-121.4944],
        zoom: 12,
        layers:[baseMaps]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);
    
    
    // create GeoJSONlayer

}