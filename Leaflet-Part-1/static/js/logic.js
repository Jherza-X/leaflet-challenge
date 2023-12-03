// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
    center: [
                37.09, -95.71
            ],
    zoom: 5
  });

let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);


d3.json(queryUrl).then(function (data) {
  // Access the features part of the response
  let earthquakes = data.features;

  // Loop through each feature in the array
  earthquakes.forEach(function (earthquake) {
    // Get the coordinates of the earthquake
    let coordinates = earthquake.geometry.coordinates;
    // Get the magnitude and depth of the earthquake
    let magnitude = earthquake.properties.mag;
    let depth = coordinates[2];
    L.circle([coordinates[1], coordinates[0]],{
        radius: magnitude * 20000,  // Adjust the multiplier for appropriate size scaling
        color: 'black',
        fillColor: getColor(depth),
        fillOpacity: 0.8, 
        weight: 0.5  // Adjust the weight for the thickness of the line
        }).bindPopup(`<h3>${earthquake.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth}</p>`)
        .addTo(myMap); //End Circle adding it to the map

    // // Create a marker and bind a popup with earthquake information
    // L.marker([coordinates[1], coordinates[0]])
    //   .bindPopup(`<h3>${earthquake.properties.place}</h3><hr><p>Magnitude: ${earthquake.properties.mag}</p>`)
    //   .addTo(myMap);
  }); //End forEach! 

// Add a legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    depths = [0, 30, 50, 70, 100],
    labels = [];

  // loop through depth intervals and generate a label with a colored square for each interval
  for (var i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(myMap);

});

// Function to determine marker color based on depth
function getColor(depth) {
    // Customize the color scale

    return depth > 100 ? '#d73027' :  // Red for depths greater than 100
         depth > 70  ? '#fdae61' :  // Orange for depths between 70 and 100
         depth > 50  ? '#fee08b' :  // Yellow for depths between 50 and 70
         depth > 30  ? '#4daf4a' :  // Lime green for depths between 30 and 50
                       '#78c679'   ;    // Dark green for depths less than or equal to 30


    //Warm Color gamma
    // return depth > 100 ? '#8c510a' :  // Dark ocher for depths greater than 100
    //        depth > 70  ? '#d8b365' :  // Ocher for depths between 70 and 100
    //        depth > 50  ? '#f6e8c3' :  // Light ocher for depths between 50 and 70
    //        depth > 30  ? '#fdae61' :  // Warm orange for depths between 30 and 50
    //                    '#fee08b';    // Yellow for depths less than or equal to 30
//Cold color gamma
//    return depth > 100 ? '#313695' :  // Dark blue for depths greater than 100
//           depth > 70  ? '#4575b4' :  // Blue for depths between 70 and 100
//           depth > 50  ? '#91bfdb' :  // Light blue for depths between 50 and 70
//           depth > 30  ? '#a6bddb' :  // Cool blue for depths between 30 and 50
//            '#d0d1e6';    // Pale blue for depths less than or equal to 30
} //End Fuction getColor






// // Define arrays to hold the created city and state markers.
// let magMarkers = [];
// let depthMarkers = [];

// d3.json(queryUrl).then(function (data) {
//     console.log(data);
//     features = data.features;


//     // Loop through features, and create the Magnitude and depth markers.
//     for (let i = 0; i < features.length; i++) {
//     // Setting the marker radius for the location
//       magMarkers.push(
//        L.circle(features[i].geometry.coordinates, {
//         stroke: false,
//         fillOpacity: 0.75,
//         color: "white",
//         fillColor: "white",
//         radius: features[i].properties.mag
//       })
//     );
  
//     // Set the marker radius for the city by passing the population to the markerSize() function.
//     depthMarkers.push(
//       L.circle(features[i].geometry.coordinates, {
//         stroke: false,
//         fillOpacity: 0.75,
//         color: "purple",
//         fillColor: "purple",
//         radius: features[i].geometry.coordinates[2]
//       })
//     );
//   } //end for

// // Create two separate layer groups
//   let mag_in = L.layerGroup(magMarkers);
//   let depth_in = L.layerGroup(depthMarkers);

// // Create a baseMaps object.
//     let baseMaps = {
//        "Street Map": street,
//       };
  
//   // Create an overlay object.
//     let overlayMaps = {
//         "Magnitude": mag_in,
//         "Depth": depth_in
//     };    

//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);

// });// end d3.json function


///////////////using heat map
// // Perform a GET request to the query URL/
// d3.json(queryUrl).then(function (data) {
//     // Once we get a response, send the data.features object to the createFeatures function.
//     //createFeatures(data.features);
//     //createFeatures(data.features);
//     console.log(data);
//     features = data.features;

//     let heatArray = [];

//   for (let i = 0; i < features.length; i++) {
//     let location = features[i].geometry;
//     if (location) {
//       //console.log(location);
//       heatArray.push([location.coordinates[1], location.coordinates[0]]);
//     }

//   }

//   let heat = L.heatLayer(heatArray, {
//     radius: 20,
//     blur: 2
//   }).addTo(myMap);

//   });

//////////////
//Functions to create a map with earhquakes

//   function createMap(earthquakes) {

//    // Create the base layers.
//     let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     })
  
//     let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//       attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//     });
  
//     // Create a baseMaps object.
//     let baseMaps = {
//       "Street Map": street,
//       "Topographic Map": topo
//     };
  
//     // Create an overlay object to hold our overlay.
//     let overlayMaps = {
//       Earthquakes: earthquakes
//     };
  
//     // Create our map, giving it the streetmap and earthquakes layers to display on load.
//     let myMap = L.map("map", {
//       center: [
//         37.09, -95.71
//       ],
//       zoom: 5,
//       layers: [street, earthquakes]
//     });
  
//     // Create a layer control.
//     // Pass it our baseMaps and overlayMaps.
//     // Add the layer control to the map.
//     L.control.layers(baseMaps, overlayMaps, {
//       collapsed: false
//     }).addTo(myMap);
  
//   }

//   function createFeatures(earthquakeData) {

//     // Define a function that we want to run once for each feature in the features array.
//     // Give each feature a popup that describes the place and time of the earthquake.
//     function onEachFeature(feature, layer) {
//       layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
//     }
  
//     // Create a GeoJSON layer that contains the features array on the earthquakeData object.
//     // Run the onEachFeature function once for each piece of data in the array.
//     let earthquakes = L.geoJSON(earthquakeData, {
//       onEachFeature: onEachFeature
//     });
  
//     // Send our earthquakes layer to the createMap function/
//     createMap(earthquakes);
//   }