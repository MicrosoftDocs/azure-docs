---
title: 'Tutorial: Find multiple routes by mode of travel | Microsoft Azure Maps'
description: In this tutorial, you'll learn how to find routes for different modes of travel using Microsoft Azure Maps.
author: philmea
ms.author: philmea
ms.date: 01/14/2020
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
---

# Tutorial: Find routes for different modes of travel using Azure Maps

This tutorial shows how to use your Azure Maps account and the route service. The route service can find the route to your point of interest, prioritized by your mode of travel. You can display two different routes on your map, one for cars and one for trucks. The routing service takes into consideration limitations because of the height and weight of the vehicle, or if the vehicle is carrying hazardous cargo. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a new web page using the map control API
> * Visualize traffic flow on your map
> * Create route queries that declare mode of travel
> * Display multiple routes on your map

## Prerequisites
Before you continue, follow instructions in [Create an account](quick-demo-map-app.md#create-an-account-with-azure-maps) and select the S1 pricing tier. Follow the steps in [get primary key](quick-demo-map-app.md#get-the-primary-key-for-your-account) to get the primary key for your account. For more information on authentication in Azure Maps, see [manage authentication in Azure Maps](how-to-manage-authentication.md).

## Create a new map

The following steps show you how to create a static HTML page embedded with the Map Control API.

1. On your local machine, create a new file and name it **MapTruckRoute.html**.
2. Add the following HTML components to the file:

    ```HTML
    <!DOCTYPE html>
    <html>
    <head>
        <title>Map Route</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Add references to the Azure Maps Map control JavaScript and CSS files. -->
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css">
        <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js"></script>

        <!-- Add a reference to the Azure Maps Services Module JavaScript file. -->
        <script src="https://atlas.microsoft.com/sdk/javascript/service/2/atlas-service.min.js"></script>

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

3. Add the following JavaScript code to the `GetMap` function. Replace the string `<Your Azure Maps Key>` with the primary key that you copied from your Maps account.

    ```JavaScript
    //Instantiate a map object
    var map = new atlas.Map("myMap", {
        //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: '<Your Azure Maps Key>'
        }
    });
    ```

    The `atlas.Map` class provides the control for a visual and interactive web map, and is a component of the Azure Map Control API.

4. Save the file and open it in your browser. At this point, you have a basic map that you can develop further.

   ![View basic map](./media/tutorial-prioritized-routes/basic-map.png)

## Visualize traffic flow

1. Add the traffic flow display to the map. The maps `ready` event waits until the maps resources are loaded and ready to safely interact with it.

    ```javascript
    map.events.add("ready", function() {
        // Add Traffic Flow to the Map
        map.setTraffic({
            flow: "relative"
        });
    });
    ```

    In the map `ready` event handler,  the traffic flow setting on the map is set to `relative`, which is the speed of the road relative to free-flow. You could also set it to `absolute` speed of the road or `relative-delay`, which displays the relative speed where it differs from free-flow.

2. Save the **MapTruckRoute.html** file and refresh the page in your browser. If you interact with the map and zoom in to Los Angeles, you should see the streets with the current traffic data.

   ![View traffic on a map](./media/tutorial-prioritized-routes/traffic-map.png)

<a id="queryroutes"></a>

## Define how the route will be rendered

In this tutorial, two routes will be calculated and rendered on the map. One route using roads accessible to cars and the other accessible to trucks. When rendered we'll display a symbol icon for the start and end of the route, and different colored lines for each route path.

1. After initializing the map, add the following JavaScript code in the maps `ready` event handler.

    ```JavaScript
    //Wait until the map resources have fully loaded.
    map.events.add('ready', function () {

        //Create a data source and add it to the map.
        datasource = new atlas.source.DataSource();
        map.sources.add(datasource);

        //Add a layer for rendering the route lines and have it render under the map labels.
        map.layers.add(new atlas.layer.LineLayer(datasource, null, {
            strokeColor: ['get', 'strokeColor'],
            strokeWidth: ['get', 'strokeWidth'],
            lineJoin: 'round',
            lineCap: 'round'
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
            filter: ['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']] //Only render Point or MultiPoints in this layer.
        }));
    });
    ```
    
    In the maps `ready` event handler, a data source is created to store the route lines and the start and end points. A line layer is created and attached to the data source to defined how the route line will be rendered. Expressions are used to retrieve the line width and color from properties on the route line feature. When adding the layer to the map a second parameter with the value of `'labels'` is passed in which specifies to render this layer below the map labels. This ensures that the route line doesn't cover the road labels. A symbol layer is created and attached to the data source. This layer specifies how the start and end points will be rendered. In this case, expressions have been added to retrieve the icon image and text label information from properties on each point object. 
    
2. For this tutorial, set the start point as a fictitious company in Seattle called Fabrikam, and the destination point as a Microsoft office. In the maps `ready` event handler, add the following code.

    ```JavaScript
    //Create the GeoJSON objects which represent the start and end point of the route.
    var startPoint = new atlas.data.Feature(new atlas.data.Point([-122.356099, 47.580045]), {
        title: 'Fabrikam, Inc.',
        icon: 'pin-blue'
    });

    var endPoint = new atlas.data.Feature(new atlas.data.Point([-122.201164, 47.616940]), {
        title: 'Microsoft - Lincoln Square',
        icon: 'pin-round-blue'
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

    The start and end points are added to the data source. The bounding box for the start and end points is calculated using the `atlas.data.BoundingBox.fromData` function. This bounding box is used to set the map cameras view over the entire route using the `map.setCamera` function. A padding is added to compensate for the pixel dimensions of the symbol icons.

4. Save the file and refresh your browser to see the pins displayed on your map. Now the map is centered over Seattle. You can see the round blue pin marking the start point and the blue pin marking the finish point.

   ![View map with start and finish points](./media/tutorial-prioritized-routes/pins-map.png)

<a id="multipleroutes"></a>

## Render routes prioritized by mode of travel

This section shows you how to use the Maps route service API. The route API is used to find multiple routes from a given start point to the end point, based on your mode of transport. The route service provides APIs to plan *fastest*, *shortest*, *eco*, or *thrilling* routes. Not only do the APIs plan routes between two locations, but they also consider the current traffic conditions. 

The route API allows users to plan routes in the future using Azure's extensive historic traffic database. The API can predict route durations for a given day and time. For more information, see [GetRoute Directions](https://docs.microsoft.com/rest/api/maps/route/getroutedirections). 

All of the following code blocks should be added **within the map load eventListener** to ensure they load after the map completely loads.

1. In the GetMap function, add the following to Javascript code.

    ```JavaScript
    // Use SubscriptionKeyCredential with a subscription key
    var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey());

    // Use subscriptionKeyCredential to create a pipeline
    var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential);

    // Construct the RouteURL object
    var routeURL = new atlas.service.RouteURL(pipeline);
    ```

   The `SubscriptionKeyCredential` creates a `SubscriptionKeyCredentialPolicy` to authenticate HTTP requests to Azure Maps with the subscription key. The `atlas.service.MapsURL.newPipeline()` takes in the `SubscriptionKeyCredential` policy and creates a [Pipeline](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.pipeline?view=azure-maps-typescript-latest) instance. The `routeURL` represents a URL to Azure Maps [Route](https://docs.microsoft.com/rest/api/maps/route) operations.

2. After setting up credentials and the URL, add the following JavaScript code to construct a route from start to end point for a truck carrying USHazmatClass2 classed cargo and display the results.

    ```JavaScript
    //Start and end point input to the routeURL
    var coordinates= [[startPoint.geometry.coordinates[0], startPoint.geometry.coordinates[1]], [endPoint.geometry.coordinates[0], endPoint.geometry.coordinates[1]]];

    //Make a search route request for a truck vehicle type
    routeURL.calculateRouteDirections(atlas.service.Aborter.timeout(10000), coordinates,{
        travelMode: 'truck',
        vehicleWidth: 2,
        vehicleHeight: 2,
        vehicleLength: 5,
        vehicleLoadType: 'USHazmatClass2'
    }).then((directions) => {
        //Get data features from response
        var data = directions.geojson.getFeatures();

        //Get the route line and add some style properties to it.  
        var routeLine = data.features[0];
        routeLine.properties.strokeColor = '#2272B9';
        routeLine.properties.strokeWidth = 9;

        //Add the route line to the data source. We want this to render below the car route which will likely be added to the data source faster, so insert it at index 0.
        datasource.add(routeLine, 0);
    });
    ```

    This code snippet above queries the Azure Maps routing service through the [getRouteDirections](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.models.routedirectionsrequestbody?view=azure-maps-typescript-latest) method. The route line is then extracted from the GeoJSON feature collection from the response that is extracted using the `geojson.getFeatures()` method. The route line is then added to the data source. An index of 0 ensures that it's rendered before any other lines in the data source. This is done as the truck route calculation will often be slower than a car route calculation. If the truck route line is added to the data source after the car route, it will render above it. Two properties are added to the truck route line, a stroke color that is a nice shade of blue, and a stroke width of nine pixels.

3. Add the following JavaScript code to construct a route for a car and display the results.

    ```JavaScript
    routeURL.calculateRouteDirections(atlas.service.Aborter.timeout(10000), coordinates).then((directions) => {

        //Get data features from response
        var data = directions.geojson.getFeatures();

        //Get the route line and add some style properties to it.  
        var routeLine = data.features[0];
        routeLine.properties.strokeColor = '#B76DAB';
        routeLine.properties.strokeWidth = 5;

        //Add the route line to the data source. We want this to render below the car route which will likely be added to the data source faster, so insert it at index 0.  
        datasource.add(routeLine);
    });
    ```

    This code snippet above queries the Azure Maps routing service through the [getRouteDirections](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.models.routedirectionsrequestbody?view=azure-maps-typescript-latest) method. The route line is then extracted from the GeoJSON feature collection from the response that is extracted using the `geojson.getFeatures()` method. The route line is then added to the data source. Two properties are added to the car route line, a stroke color that is a shade of purple, and a stroke width of  five pixels.  

4. Save the **MapTruckRoute.html** file and refresh your browser to observe the result. For a successful connection with the Maps' APIs, you should see a map similar to the following.

    ![Prioritized routes with Azure Route Service](./media/tutorial-prioritized-routes/prioritized-routes.png)

    The truck route is thick blue, and the car route is thin purple. The car route goes across Lake Washington via I-90, which goes through tunnels under residential areas. Because the tunnels are close to residential areas, hazardous waste cargo is restricted. The truck route, which specifies a USHazmatClass2 cargo type, is directed to use a different highway.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a new web page using the map control API
> * Visualize traffic flow on your map
> * Create route queries that declare mode of travel
> * Display multiple routes on your map

> [!div class="nextstepaction"]
> [View full source code](https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/master/AzureMapsCodeSamples/Tutorials/truckRoute.html)

> [!div class="nextstepaction"]
> [View live sample](https://azuremapscodesamples.azurewebsites.net/?sample=Multiple%20routes%20by%20mode%20of%20travel)

The next tutorial demonstrates the process of creating a simple store locator by using Azure Maps.

> [!div class="nextstepaction"]
> [Create a store locator using Azure Maps](./tutorial-create-store-locator.md)

> [!div class="nextstepaction"]
> [Use data-driven style expressions](data-driven-style-expressions-web-sdk.md)