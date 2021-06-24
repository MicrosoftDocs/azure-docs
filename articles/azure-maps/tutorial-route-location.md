---
title: 'Tutorial: Find route to a location | Microsoft Azure Maps'
description: Tutorial on how to find a route to a point of interest. See how to set address coordinates and query the Azure Maps Route service for directions to the point.
author: anastasia-ms
ms.author: v-stharr
ms.date: 04/26/2021
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc, devx-track-js
---

# Tutorial: How to display route directions using Azure Maps Route service and Map control

This tutorial shows you how to use the Azure Maps [Route service API](/rest/api/maps/route) and [Map control](./how-to-use-map-control.md) to display route directions from start to end point. In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create and display the Map control on a web page. 
> * Define the display rendering of the route by defining [Symbol layers](map-add-pin.md) and [Line layers](map-add-line-layer.md).
> * Create and add GeoJSON objects to the Map to represent start and end points.
> * Get route directions from start and end points using the [Get Route directions API](/rest/api/maps/route/getroutedirections).

You can obtain the full source code for the sample [here](https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/master/AzureMapsCodeSamples/Tutorials/route.html). A live sample can be found [here](https://azuremapscodesamples.azurewebsites.net/?sample=Route%20to%20a%20destination).

## Prerequisites

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.

<a id="getcoordinates"></a>

## Create and display the Map control

The following steps show you how to create and display the Map control in a web page.

1. On your local machine, create a new file and name it **MapRoute.html**.
2. Copy/paste the following HTML markup into the file.

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

    The HTML header includes the CSS and JavaScript resource files hosted by the Azure Map Control library. The body's `onload` event calls the `GetMap` function. In the next step, we'll add the Map control initialization code.

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

4. Save the file and open it in your browser. A simple is displayed.

     :::image type="content" source="./media/tutorial-route-location/basic-map.png" alt-text="Basic map rendering of Map control":::

## Define route display rendering

In this tutorial, we'll render the route using a line layer. The start and end points will be rendered using a symbol layer. For more information on adding line layers, see [Add a line layer to a map](map-add-line-layer.md). To learn more about symbol layers, see [Add a symbol layer to a map](map-add-pin.md).

1. Append the following JavaScript code in the `GetMap` function. This code implements the Map control's `ready` event handler. The rest of the code in this tutorial will be placed inside the `ready` event handler.

    ```JavaScript
    //Wait until the map resources are ready.
    map.events.add('ready', function() {

        //Create a data source and add it to the map.
        datasource = new atlas.source.DataSource();
        map.sources.add(datasource);

        //Add a layer for rendering the route lines and have it render under the map labels.
        map.layers.add(new atlas.layer.LineLayer(datasource, null, {
            strokeColor: '#2272B9',
            strokeWidth: 5,
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

    In the map control's `ready` event handler, a data source is created to store the route from start to end point. To define how the route line will be rendered, a line layer is created and attached to the data source.  To ensure that the route line doesn't cover up the road labels, we've passed a second parameter with the value of `'labels'`.

    Next, a symbol layer is created and attached to the data source. This layer specifies how the start and end points are rendered.Expressions have been added to retrieve the icon image and text label information from properties on each point object. To learn more about expressions, see [Data-driven style expressions](data-driven-style-expressions-web-sdk.md).

2. Set the start point as Microsoft, and the end point as a gas station in Seattle.  In the Map control's `ready` event handler, append the following code.

    ```JavaScript
    //Create the GeoJSON objects which represent the start and end points of the route.
    var startPoint = new atlas.data.Feature(new atlas.data.Point([-122.130137, 47.644702]), {
        title: "Redmond",
        icon: "pin-blue"
    });

    var endPoint = new atlas.data.Feature(new atlas.data.Point([-122.3352, 47.61397]), {
        title: "Seattle",
        icon: "pin-round-blue"
    });

    //Add the data to the data source.
    datasource.add([startPoint, endPoint]);

    map.setCamera({
        bounds: atlas.data.BoundingBox.fromData([startPoint, endPoint]),
        padding: 80
    });
    ```

    This code creates two [GeoJSON Point objects](https://en.wikipedia.org/wiki/GeoJSON) to represent start and end points, which are then added to the data source. 

    The last block of code sets the camera view using the latitude and longitude of the start and end points. The start and end points are added to the data source. The bounding box for the start and end points is calculated using the `atlas.data.BoundingBox.fromData` function. This bounding box is used to set the map cameras view over the entire route using the `map.setCamera` function. Padding is added to compensate for the pixel dimensions of the symbol icons. For more information about the Map control's setCamera property, see [setCamera(CameraOptions | CameraBoundsOptions & AnimationOptions)](/javascript/api/azure-maps-control/atlas.map#setcamera-cameraoptions---cameraboundsoptions---animationoptions-) property.

3. Save **MapRoute.html** and refresh your browser. The map is now centered over Seattle. The teardrop blue pin marks the start point. The round blue pin marks the end point.

    :::image type="content" source="./media/tutorial-route-location/map-pins.png" alt-text="View routes start and end point on the map":::

<a id="getroute"></a>

## Get route directions

This section shows you how to use the Azure Maps Route Directions API to get route directions and the estimated time of arrival from one point to another.

>[!TIP]
>The Azure Maps Route services offer APIs to plan routes based on different route types such as *fastest*, *shortest*, *eco*, or *thrilling* routes based on distance, traffic conditions, and mode of transport used. The service also lets users plan future routes based on historical traffic conditions. Users can see the prediction of route durations for any given time. For more information, see [Get Route directions API](/rest/api/maps/route/getroutedirections).

1. In the `GetMap` function, inside the control's `ready` event handler, add the following to the JavaScript code.

    ```JavaScript
    // Use SubscriptionKeyCredential with a subscription key
    var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey());

    // Use subscriptionKeyCredential to create a pipeline
    var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential);

    // Construct the RouteURL object
    var routeURL = new atlas.service.RouteURL(pipeline);
    ```

   The `SubscriptionKeyCredential` creates a `SubscriptionKeyCredentialPolicy` to authenticate HTTP requests to Azure Maps with the subscription key. The `atlas.service.MapsURL.newPipeline()` takes in the `SubscriptionKeyCredential` policy and creates a [Pipeline](/javascript/api/azure-maps-rest/atlas.service.pipeline) instance. The `routeURL` represents a URL to Azure Maps [Route](/rest/api/maps/route) operations.

2. After setting up credentials and the URL, append the following code in the control's `ready` event handler. This code constructs the route from start point to end point. The `routeURL` requests the Azure Maps Route service API to calculate route directions. A GeoJSON feature collection from the response is then extracted using the `geojson.getFeatures()` method and added to the data source.

    ```JavaScript
    //Start and end point input to the routeURL
    var coordinates= [[startPoint.geometry.coordinates[0], startPoint.geometry.coordinates[1]], [endPoint.geometry.coordinates[0], endPoint.geometry.coordinates[1]]];

    //Make a search route request
    routeURL.calculateRouteDirections(atlas.service.Aborter.timeout(10000), coordinates).then((directions) => {
        //Get data features from response
        var data = directions.geojson.getFeatures();
        datasource.add(data);
    });
    ```

3. Save the **MapRoute.html** file and refresh your web browser. The map should now display the route from start to end point.

     :::image type="content" source="./media/tutorial-route-location/map-route.png" alt-text="Azure Map control and Route service":::

You can obtain the full source code for the sample [here](https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/master/AzureMapsCodeSamples/Tutorials/route.html). A live sample can be found [here](https://azuremapscodesamples.azurewebsites.net/?sample=Route%20to%20a%20destination).

## Clean up resources

There are no resources that require cleanup.

## Next steps

The next tutorial shows you how to create a route query with restrictions, like mode of travel or type of cargo. You can then display multiple routes on the same map.

> [!div class="nextstepaction"]
> [Find routes for different modes of travel](./tutorial-prioritized-routes.md)