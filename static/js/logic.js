function createMap(earthquakeLayer) {
    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let baseMaps = {
        "Street Map": streetMap
    };

    let overlayMaps = {
        "Earthquakes": earthquakeLayer
    };

    let map = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 5,
        layers: [streetMap, earthquakeLayer]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let depth = [0, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";

        for (let i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(map);
}

function createMarkers(response) {
    let earthquakes = response.features;
    let quakeMarkers = [];

    for (let i = 0; i < earthquakes.length; i++) {
        let earthquake = earthquakes[i];
        let magnitude = earthquake.properties.mag;
        let depth = earthquake.geometry.coordinates[2];
        let lat = earthquake.geometry.coordinates[1];
        let lon = earthquake.geometry.coordinates[0];
        let quakeMarker = L.circle([lat, lon], {
            fillOpacity: 0.75,
            color: getColor(depth),
            fillColor: getColor(depth),
            radius: magnitude * 20000
        }).bindPopup("<h3>Magnitude: " + magnitude + "<h3><h3>Depth: " + depth + "</h3>");

        quakeMarkers.push(quakeMarker);
    }

    createMap(L.layerGroup(quakeMarkers));
}

// Function to determine marker color 
function getColor(depth) {
    if (depth > 90) {
        return "red";
    } else if (depth > 70) {
        return "darkorange";
    } else if (depth > 50) {
        return "orange";
    } else if (depth > 30) {
        return "gold";
    } else if (depth > 10) {
        return "yellow";
    } else {
        return "lightgreen";
    }
}

// Perform an API call 
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(createMarkers);
