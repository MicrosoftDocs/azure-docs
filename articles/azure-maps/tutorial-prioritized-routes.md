---
title: Multiple routes with Azure Maps | Microsoft Docs
description: Find routes for different modes of travel using Azure Maps
author: walsehgal
ms.author: v-musehg
ms.date: 11/14/2018
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
---

# Find routes for different modes of travel using Azure Maps

This tutorial shows how to use your Azure Maps account and the route service to find the route to your point of interest, prioritized by your mode of travel. You display two different routes on your map, one for cars and one for trucks that may have route restrictions because of height, weight, or hazardous cargo. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a new web page using the map control API
> * Visualize traffic flow on your map
> * Create route queries that declare mode of travel
> * Display multiple routes on your map

## Prerequisites

Before you proceed, follow the steps in the first tutorial to [create your Azure Maps account](./tutorial-search-location.md#createaccount), and [get the subscription key for your account](./tutorial-search-location.md#getkey).

## Create a new map

The following steps show you how to create a static HTML page embedded with the Map Control API.

1. On your local machine, create a new file and name it **MapTruckRoute.html**.
2. Add the following HTML components to the file:

    ```HTML
    <!DOCTYPE html>
    <html>
    <head>
        <title>Multiple routes by mode of travel</title>
        
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <!-- Add references to the Azure Maps Map control JavaScript and CSS files. -->
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/css/atlas.min.css?api-version=1" type="text/css" />
        <script src="https://atlas.microsoft.com/sdk/js/atlas.min.js?api-version=1"></script>

        <!-- Add a reference to the Azure Maps Services Module JavaScript file. -->
        <script src="https://atlas.microsoft.com/sdk/js/atlas-service.js?api-version=1"></script>

        <script>
            var map, datasource, client;

            function GetMap() {
                //Add Map Control JavaScript code here.
            }
        </script>
        <style>
            html,
            body {
                width: 100%;
                height: 100%;
                padding: 0;
                margin: 0;
            }

            #myMap {
                position: relative;
                width: 100%;
                height: 100%;
            }
        </style>
    </head>
    <body onload="GetMap()">
        <div id="myMap"></div>
    </body>
    </html>
    ```
    
    Notice that the HTML header includes the CSS and JavaScript resource files hosted by the Azure Map Control library. Note the `onload` event on the body of the page, which will call the `GetMap` function when the body of the page has loaded. This function will contain the inline JavaScript code to access the Azure Maps APIs.

3. Add the following JavaScript code to the `GetMap` function. Replace the string **\<Your Azure Maps Key\>** with the primary key that you copied from your Maps account.

    ```JavaScript
    //Add your Azure Maps subscription key to the map SDK. 
    atlas.setSubscriptionKey('<Your Azure Maps Key>');

    //Initialize a map instance.
    map = new atlas.Map('myMap');
    ```

    The **atlas.Map** provides the control for a visual and interactive web map, and is a component of the Azure Map Control API.

4. Save the file and open it in your browser. At this point, you have a basic map that you can develop further.

   ![View basic map](./media/tutorial-prioritized-routes/basic-map.png)

## Visualize traffic flow

1. Add the traffic flow display to the map. The `map.events.add` ensures that all maps functions added to the map are loaded after the map is loaded fully.

    ```JavaScript
    map.events.add("load", function() {
        // Add Traffic Flow to the Map
        map.setTraffic({
            flow: "relative"
        });
    });
    ```
    
     A load event is added to the map, which will fire when the map resources have been fully loaded. In the map load event handler,  the traffic flow setting on the map is set to `relative`, which is the speed of the road relative to free-flow. You could also set it to `absolute` speed of the road or `relative-delay`, which displays the relative speed where it differs from free-flow.

2. Save the **MapTruckRoute.html** file and refresh the page in your browser. You should see the streets of Los Angeles with their current traffic data.

   ![View traffic map](./media/tutorial-prioritized-routes/traffic-map.png)

<a id="queryroutes"></a>

## Define how the route will be rendered

In this tutorial, two routes will be calculated and rendered on the map. One route using roads accessible to cars and the other accessible to trucks. When rendered we will display a symbol icon for the start and end of the route, and different colored lines for each route path.

1. In the GetMap function, after initializing the map, add the following JavaScript code.

    ```JavaScript
    //Wait until the map resources have fully loaded.
    map.events.add('load', function () {

        //Create a data source and add it to the map.
        datasource = new atlas.source.DataSource();
        map.sources.add(datasource);

        //Add a layer for rendering the route lines and have it render under the map labels.
        map.layers.add(new atlas.layer.LineLayer(datasource, null, {
            strokeColor: ['get', 'strokeColor'],
            strokeWidth: ['get', 'strokeWidth'],
            lineJoin: 'round',
            lineCap: 'round',
            filter: ['==', '$type', 'LineString']
        }), 'labels');

        //Add a layer for rendering point data.
        map.layers.add(new atlas.layer.SymbolLayer(datasource, null, {
            iconOptions: {
                image: ['get', 'icon'],
                allowOverlap: true
            },
            textOptions: {
                textField: ['get', 'title'],
                offset: [0, 1.2]
            },
            filter: ['==', '$type', 'Point']
        }));
    });
    ```
    
    A load event is added to the map, which will fire when the map resources have been fully loaded. In the map load event handler, a data source is created to store the route lines as well as the start and end points. A line layer is created and attached to the data source to defined how the route line will be rendered. Expressions are used to retrieve the line width and color from properties on the route line feature. A filter is added ensure this layer only renders GeoJSON LineString data. When adding the layer to the map a second parameter with the value of `'labels'` is passed in which specifies to render this layer below the map labels. This will ensure that the route line doesn't cover up the road labels. A symbol layer is created and attached to the data source. This layer specifies how the start and end points will be rendered, in this case expressions have been added to retrieve the icon image and text label information from properties on each point object. 
    
2. For this tutorial, set the start point as a fictitious company in Seattle called Fabrikam, and the destination point as a Microsoft office. In the map load event handler, add the following code.

    ```JavaScript
    //Create the GeoJSON objects which represent the start and end point of the route.
    var startPoint = new atlas.data.Feature(new atlas.data.Point([-122.356099, 47.580045]), {
        title: 'Fabrikam, Inc.',
        icon: 'pin-round-blue'
    });

    var endPoint = new atlas.data.Feature(new atlas.data.Point([-122.201164, 47.616940]), {
        title: 'Microsoft - Lincoln Square',
        icon: 'pin-blue'
    });
    ```
    
    This code creates two [GeoJSON objects](https://en.wikipedia.org/wiki/GeoJSON) to represent the start and end points of the route. A `title` and `icon` property is added to each point.

3. Next, add the following JavaScript code to add the pins for the start and end points to the map:

    ```JavaScript
    //Add the data to the data source.
    datasource.add([startPoint, endPoint]);

    //Fit the map window to the bounding box defined by the start and end positions.
    map.setCamera({
        bounds: atlas.data.BoundingBox.fromData([startPoint, endPoint]),
        padding: 100
    });
    ```
    
    The start and end points are added to the data source. The bounding box for the start and end points is calculated using the `atlas.data.BoundingBox.fromData` function. This bounding box is used to set the map cameras view over the start and end point using the `map.setCamera` function. A padding is added to compensate for the pixel dimensions of the symbol icons.

4. Save the file and refresh your browser to see the pins displayed on your map. Now the map is centered over Seattle, and you can see the round blue pin marking the start point and the blue pin marking the finish point.

   ![View map with start and finish points](./media/tutorial-prioritized-routes/pins-map.png)

<a id="multipleroutes"></a>

## Render routes prioritized by mode of travel

This section shows how to use the Maps route service API to find multiple routes from a given start point to a destination based on your mode of transport. The route service provides APIs to plan *fastest*, *shortest*, *eco*, or *thrilling* routes between two locations, considering the current traffic conditions. It also allows users to plan routes in the future by using Azure's extensive historic traffic database and predicting route durations for any day and time. For more information, see [GetRoute Directions](https://docs.microsoft.com/rest/api/maps/route/getroutedirections). All of the following code blocks should be added **within the map load eventListener** to ensure that they load after the map loads fully.

1. Instantiate the service client, by adding the following Javascript code in the map load event handler.

    ```JavaScript
    //If the service client hasn't been created, create an instance of it.
    if (!client) {
        client = new atlas.service.Client(atlas.getSubscriptionKey());
    }
    ```
    
2. Add the following block of code to construct a route query string.

    ```JavaScript
    //Create the route request with the query being the start and end point in the format 'startLongitude,startLatitude:endLongitude,endLatitude'.
    var routeQuery = startPoint.geometry.coordinates[1] +
        ',' +
        startPoint.geometry.coordinates[0] +
        ':' +
        endPoint.geometry.coordinates[1] +
        ',' +
        endPoint.geometry.coordinates[0];
    ```

3. Add the following JavaScript code to request the route for a truck carrying USHazmatClass2 classed cargo and display the results:

    ```JavaScript
    //Execute the truck route query then add the route to the map.
    client.route.getRouteDirections(routeQuery, {
        travelMode: 'truck',
        vehicleWidth: 2,
        vehicleHeight: 2,
        vehicleLength: 5,
        vehicleLoadType: 'USHazmatClass2'
    }).then(function (response) {
        // Parse the response into GeoJSON
        var geoJsonResponse = new atlas.service.geojson.GeoJsonRouteDirectionsResponse(response);

        //Get the route line and add some style properties to it.
        var routeLine = geoJsonResponse.getGeoJsonRoutes().features[0];
        routeLine.properties.strokeColor = '#2272B9';
        routeLine.properties.strokeWidth = 9;

        //Add the route line to the data source. We want this to render below the car route which will likely be added to the data source faster, so insert it at index 0.
        datasource.add(routeLine, 0);
    });
    ```
    This code snippet above queries the Azure Maps routing service through the [getRouteDirections](https://docs.microsoft.com/javascript/api/azure-maps-rest/services.route?view=azure-iot-typescript-latest#getroutedirections) method and then parses the response into GeoJSON format using the [getGeoJsonRouteDirectionsResponse](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.geojson.geojsonroutedirectionsresponse?view=azure-iot-typescript-latest). And then creates an array of coordinates for the route returned, and adds it to the data source, but also adds an index of 0 to ensure that it is rendered before any other lines in the data source. This is done as the truck route calculation will often be slower than a car route calculation and if the truck route line is added to the data source after the car route, it will render above it. Two properties are added to the truck route line, a stroke color that is a nice shade of blue, and a stroke width of 9 pixels. 

4. Add the following JavaScript code to request the route for a car and display the results:

    ```JavaScript
    //Execute the car route query then add the route to the map.
    client.route.getRouteDirections(routeQuery).then(function (response) {
        // Parse the response into GeoJSON
        var geoJsonResponse = new atlas.service.geojson.GeoJsonRouteDirectionsResponse(response);

        //Get the route line and add some style properties to it.
        var routeLine = geoJsonResponse.getGeoJsonRoutes().features[0];
        routeLine.properties.strokeColor = '#B76DAB';
        routeLine.properties.strokeWidth = 5;

        //Add the route line to the data source.
        datasource.add(routeLine);
    });
    ```
    This code snippet uses the same truck route query for a car. It queries the Azure Maps routing service through the [getRouteDirections](https://docs.microsoft.com/javascript/api/azure-maps-rest/services.route?view=azure-iot-typescript-latest#getroutedirections) method and then parses the response into GeoJSON format using the [getGeoJsonRouteDirectionsResponse](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.geojson.geojsonroutedirectionsresponse?view=azure-iot-typescript-latest). And then creates an array of coordinates for the route returned, and adds it to the data source. Two properties are added to the car route line, a stroke color that is a shade of purple, and a stroke width of 5 pixels. 

5. Save the **MapTruckRoute.html** file and refresh your browser to observe the result. For a successful connection with the Maps' APIs, you should see a map similar to the following.

    ![Prioritized routes with Azure Route Service](./media/tutorial-prioritized-routes/prioritized-routes.png)

    The truck route is blue and thicker, while the car route is purple and thinner. The car route goes across Lake Washington via I-90, which goes through tunnels under residential areas and so restricts hazardous waste cargo. The truck route, which specifies a USHazmatClass2 cargo type, is correctly directed to use a different highway.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a new web page using the map control API
> * Visualize traffic flow on your map
> * Create route queries that declare mode of travel
> * Display multiple routes on your map

You can access the code sample for this tutorial here:

> [Multiple routes with Azure Maps](https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/master/AzureMapsCodeSamples/Tutorials/truckRoute.html)

[See the sample live here](https://azuremapscodesamples.azurewebsites.net/?sample=Multiple%20routes%20by%20mode%20of%20travel)

The next tutorial demonstrates the process of creating a simple store locator by using Azure Maps.

> [!div class="nextstepaction"]
> [Create a store locator using Azure Maps](./tutorial-create-store-locator.md)