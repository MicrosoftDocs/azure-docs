---
title: Find route with Azure Maps | Microsoft Docs
description: Route to a point of interest using Azure Maps
author: dsk-2015
ms.author: dkshir
ms.date: 05/07/2018
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
---

# Route to a point of interest using Azure Maps

This tutorial shows how to use your Azure Maps account and the Route Service SDK to find the route to your point of interest. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a new web page using the map control API
> * Set address coordinates
> * Query Route Service for directions to point of interest

## Prerequisites

Before you proceed, follow the steps in the previous tutorial to [create your Azure Maps account](./tutorial-search-location.md#createaccount), and [get the subscription key for your account](./tutorial-search-location.md#getkey). 

<a id="getcoordinates"></a>

## Create a new map 
The following steps show you how to create a static HTML page embedded with the Map Control API. 

1. On your local machine, create a new file and name it **MapRoute.html**. 
2. Add the following HTML components to the file:

    ```HTML
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <title>Map Route</title>
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/css/atlas.min.css?api-version=1.0" type="text/css" />
        <script src="https://atlas.microsoft.com/sdk/js/atlas.min.js?api-version=1.0"></script>
        <style>
            html,
            body {
                width: 100%;
                height: 100%;
                padding: 0;
                margin: 0;
            }

            #map {
                width: 100%;
                height: 100%;
            }
        </style>
    </head>

    <body>
        <div id="map"></div>
        <script>
            // Embed Map Control JavaScript code here
        </script>
    </body>

    </html>
    ```
    The HTML header embeds the resource locations for CSS and JavaScript files for the Azure Maps library. The *script* segment in the body of the HTML file will contain the inline JavaScript code to access the Azure Maps APIs.

3. Add the following JavaScript code to the *script* block of the HTML file. Replace the string **\<your account key\>** with the primary key that you copied from your Maps account.

    ```JavaScript
    // Instantiate map to the div with id "map"
    var MapsAccountKey = "<your account key>";
    var map = new atlas.Map("map", {
        "subscription-key": MapsAccountKey
    });
    ```
    The **atlas.Map** provides the control for a visual and interactive web map, and is a component of the Azure Map Control API.

4. Save the file and open it in your browser. At this point, you have a basic map that you can develop further. 

   ![View basic map](./media/tutorial-route-location/basic-map.png)

## Set start and end points

For this tutorial, set the start point as Microsoft, and the destination point as a gas station in Seattle. 

1. In the same *script* block of the **MapRoute.html** file, add the following JavaScript code to create start and end points for the route:

    ```JavaScript
    // Create the GeoJSON objects which represent the start and end point of the route
    var startPoint = new atlas.data.Point([-122.130137, 47.644702]);
    var startPin = new atlas.data.Feature(startPoint, {
        title: "Microsoft",
        icon: "pin-round-blue"
    });

    var destinationPoint = new atlas.data.Point([-122.3352, 47.61397]);
    var destinationPin = new atlas.data.Feature(destinationPoint, {
        title: "Contoso Oil & Gas",
        icon: "pin-blue"
    });
    ```
    This code creates two [GeoJSON objects](https://en.wikipedia.org/wiki/GeoJSON) to represent the start and end points of the route. 

2. Add the following JavaScript code to add the pins for the start and end points to the map:

    ```JavaScript
    // Fit the map window to the bounding box defined by the start and destination points
    var swLon = Math.min(startPoint.coordinates[0], destinationPoint.coordinates[0]);
    var swLat = Math.min(startPoint.coordinates[1], destinationPoint.coordinates[1]);
    var neLon = Math.max(startPoint.coordinates[0], destinationPoint.coordinates[0]);
    var neLat = Math.max(startPoint.coordinates[1], destinationPoint.coordinates[1]);
    map.setCameraBounds({
        bounds: [swLon, swLat, neLon, neLat],
        padding: 50
    });

    // Add pins to the map for the start and end point of the route
    map.addPins([startPin, destinationPin], {
        name: "route-pins",
        textFont: "SegoeUi-Regular",
        textOffset: [0, -20]
    });
    ``` 
    The **map.setCameraBounds** adjusts the map window according to the coordinates of the start and end points. The API **map.addPins** adds the points to the Map control as visual components.

7. Save the **MapRoute.html** file and refresh your browser. Now the map is centered over Seattle, and you can see the round blue pin marking the start point and the blue pin marking the finish point.

   ![View map with start and end points marked](./media/tutorial-route-location/map-pins.png)

<a id="getroute"></a>

## Get directions

This section shows how to use the Maps route service API to find the route from a given start point to a destination. The route service provides APIs to plan *fastest*, *shortest*, *eco*, or *thrilling* routes between two locations. It also allows users to plan routes in the future by using Azure's extensive historic traffic database and predicting route durations for any day and time. For more information, see [Get route directions](https://docs.microsoft.com/rest/api/maps/route/getroutedirections).


1. First, add a new layer on the map to display the route path, or *linestring*. Add the following JavaScript code to the *script* block:

    ```JavaScript
    // Initialize the linestring layer for routes on the map
    var routeLinesLayerName = "routes";
    map.addLinestrings([], {
        name: routeLinesLayerName,
        color: "#2272B9",
        width: 5,
        cap: "round",
        join: "round",
        before: "labels"
    });
    ```

2. Create an [XMLHttpRequest](https://xhr.spec.whatwg.org/) and add an event handler to parse the JSON response sent by the Maps route service. This code constructs an array of coordinates for the line segments of the route, then adds the set of coordinates to the linestrings layer of the map. 

    ```JavaScript
    // Perform a request to the route service and draw the resulting route on the map
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp.responseText);

            var route = response.routes[0];
            var routeCoordinates = [];
            for (var leg of route.legs) {
                var legCoordinates = leg.points.map((point) => [point.longitude, point.latitude]);
                routeCoordinates = routeCoordinates.concat(legCoordinates);
            }

            var routeLinestring = new atlas.data.LineString(routeCoordinates);
            map.addLinestrings([new atlas.data.Feature(routeLinestring)], { name: routeLinesLayerName });
        }
    };
    ```

3. Add the following code to build the query and send the XMLHttpRequest to the Maps route service:

    ```JavaScript
    var url = "https://atlas.microsoft.com/route/directions/json?";
    url += "api-version=1.0";
    url += "&subscription-key=" + MapsAccountKey;
    url += "&query=" + startPoint.coordinates[1] + "," + startPoint.coordinates[0] + ":" +
        destinationPoint.coordinates[1] + "," + destinationPoint.coordinates[0];

    xhttp.open("GET", url, true);
    xhttp.send();
    ```

3. Save the **MapRoute.html** file and refresh your web browser. For a successful connection with the Maps APIs, you should see a map similar to the following. 

    ![Azure Map Control and Route Service](./media/tutorial-route-location/map-route.png)


## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a new web page using the map control API
> * Set address coordinates
> * Query the route service for directions to point of interest

The next tutorial demonstrates how to create a route query with restrictions like mode of travel or type of cargo, then display multiple routes on the same map. 

> [!div class="nextstepaction"]
> [Find routes for different modes of travel](./tutorial-prioritized-routes.md)
