# How To Connect To Azure Location Based REST Services From The Azure Map Control

Azure Location Based Services offers a rich set of functionality from the REST APIs. Natively, The Azure Map Control can connect to Azure Location Based Services for vector tiles, making it super easy to render Azure's Maps into various applications. The connectivity to Azure's Location Based Services for other services such as Search or Route may prove to be a bit more challenging for new developers. The following provides code samples and a walkthrough for what it takes to query Azure LBS's Search Service from the Atlas Map Control. 

var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(xhttp.responseText);

                routes = [];
                for (var route of response.routes) {
                    var routeMultiLinestringCoordinates = [];
                    for (var leg of route.legs) {
                        var legCoordinates = leg.points.map((point) => [point.longitude, point.latitude]);
                        routeMultiLinestringCoordinates.push(legCoordinates);
                    }

                    var routeMultiLinestring = new atlas.data.MultiLineString(routeMultiLinestringCoordinates);
                    var routeColor = routeColors[response.routes.indexOf(route) % routeColors.length];
                    routes.push(new atlas.data.Feature(routeMultiLinestring, { width: 2, color: routeColor }));
                }

                map.addLinestrings(routes, { name: routeLinesLayerName, overwrite: true });
            }
        };

        var url = "https://atlas.azure-api.net/route/directions/json?";
        url += "&api-version=1.0";
        url += "&subscription-key=" + subscriptionKey;
        url += "&query=" + startPoint.coordinates[1] + "," + startPoint.coordinates[0] + ":" +
            waypointPoint.coordinates[1] + "," + waypointPoint.coordinates[0] + ":" +
            destinationPoint.coordinates[1] + "," + destinationPoint.coordinates[0];
        url += "&maxAlternatives=3";

        xhttp.open("GET", url, true);
        xhttp.send();

