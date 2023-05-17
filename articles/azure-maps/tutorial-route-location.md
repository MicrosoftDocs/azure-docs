---
title: 'Tutorial: How to display route directions using Azure Maps Route service and Map control'
titleSuffix: Microsoft Azure Maps
description: Tutorial on how to find a route to a point of interest. See how to set address coordinates and query the Azure Maps Route service for directions to the point.
author: sinnypan
ms.author: sipa
ms.date: 12/28/2021
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
ms.custom: mvc, devx-track-js
---

# Tutorial: How to display route directions using Azure Maps Route service and Map control

This tutorial shows you how to use the Azure Maps [Route service API] and [Map control] to display route directions from start to end point. In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create and display the Map control on a web page. 
> * Define the display rendering of the route by defining [Symbol layers] and [Line layers].
> * Create and add GeoJSON objects to the Map to represent start and end points.
> * Get route directions from start and end points using the [Get Route directions API].

See the [route tutorial] in GitHub for the source code. See [Route to a destination] for a live sample.

## Prerequisites

* An [Azure Maps account]
* A [subscription key]

<a id="getcoordinates"></a>

## Create and display the Map control

The following steps show you how to create and display the Map control in a web page.

1. On your local machine, create a new file and name it **MapRoute.html**.
2. Add the following HTML to the file:

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

   Some things to know about the above HTML:

   * The HTML header includes CSS and JavaScript resource files hosted by the Azure Map Control library.
   * The `onload` event in the body of the page calls the `GetMap` function when the body of the page has loaded.
   * The `GetMap` function contains the inline JavaScript code used to access the Azure Maps APIs. It's added in the next step.

3. Next, add the following JavaScript code to the `GetMap` function, just beneath the code added in the last step. This code creates a map control and initializes it using your Azure Maps subscription keys that you provide. Make sure and replace the string `<Your Azure Maps Key>` with the Azure Maps primary key that you copied from your Maps account.

    ```javascript
    //Instantiate a map object
    var map = new atlas.Map('myMap', {
        // Replace <Your Azure Maps Key> with your Azure Maps subscription key. https://aka.ms/am-primaryKey
        authOptions: {
           authType: 'subscriptionKey',
           subscriptionKey: '<Your Azure Maps Key>'
        }
    });
    ```

   Some things to know about the above JavaScript:

   * This is the core of the `GetMap` function, which initializes the Map Control API for your Azure Maps account key.
   * [atlas] is the namespace that contains the Azure Maps API and related visual components.
   * [atlas.Map] provides the control for a visual and interactive web map.

4. Save your changes to the file and open the HTML page in a browser. The map shown is the most basic map that you can make by calling `atlas.Map` using your Azure Maps account subscription key.

    :::image type="content" source="./media/tutorial-route-location/basic-map.png" alt-text="A screenshot showing the most basic map that you can make by calling atlas.Map using your Azure Maps account key.":::

## Define route display rendering

In this tutorial, you'll render the route using a line layer. The start and end points are rendered using a symbol layer. For more information on adding line layers, see [Add a line layer to a map](map-add-line-layer.md). To learn more about symbol layers, see [Add a symbol layer to a map].

1. In the `GetMap` function, after initializing the map, add the following JavaScript code.

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

   Some things to know about the above JavaScript:

   * This code implements the Map control's `ready` event handler. The rest of the code in this tutorial are placed inside the `ready` event handler.
   * In the map control's `ready` event handler, a data source is created to store the route from start to end point.
   * To define how the route line is rendered, a line layer is created and attached to the data source. To ensure that the route line doesn't cover up the road labels, we've passed a second parameter with the value of `'labels'`.

    Next, a symbol layer is created and attached to the data source. This layer specifies how the start and end points are rendered.Expressions have been added to retrieve the icon image and text label information from properties on each point object. To learn more about expressions, see [Data-driven style expressions].

2. Next, set the start point at Microsoft, and the end point at a gas station in Seattle. Do this by appending the following code in the Map control's `ready` event handler:

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

   Some things to know about the above JavaScript:

   * This code creates two [GeoJSON Point objects] to represent start and end points, which are then added to the data source.
   * The last block of code sets the camera view using the latitude and longitude of the start and end points.
   * The start and end points are added to the data source.
   * The bounding box for the start and end points is calculated using the `atlas.data.BoundingBox.fromData` function. This bounding box is used to set the map cameras view over the entire route using the `map.setCamera` function.
   * Padding is added to compensate for the pixel dimensions of the symbol icons.

   For more information about the Map control's setCamera property, see the [setCamera(CameraOptions | CameraBoundsOptions & AnimationOptions)] property.

3. Save **MapRoute.html** and refresh your browser. The map is now centered over Seattle. The blue teardrop pin marks the start point. The blue round pin marks the end point.

    :::image type="content" source="./media/tutorial-route-location/map-pins.png" alt-text="A screenshot showing a map with a route containing a blue teardrop pin marking the start point at Microsoft in Redmond Washington and a blue round pin marking the end point at a gas station in Seattle.":::

<a id="getroute"></a>

## Get route directions

This section shows you how to use the Azure Maps Route Directions API to get route directions and the estimated time of arrival from one point to another.

> [!TIP]
> The Azure Maps Route services offer APIs to plan routes based on different route types such as *fastest*, *shortest*, *eco*, or *thrilling* routes based on distance, traffic conditions, and mode of transport used. The service also lets users plan future routes based on historical traffic conditions. Users can see the prediction of route durations for any given time. For more information, see [Get Route directions API].

1. In the `GetMap` function, inside the control's `ready` event handler, add the following to the JavaScript code.

    ```JavaScript
    //Use MapControlCredential to share authentication between a map control and the service module.
    var pipeline = atlas.service.MapsURL.newPipeline(new atlas.service.MapControlCredential(map));
    
    //Construct the RouteURL object
    var routeURL = new atlas.service.RouteURL(pipeline);
    ```

    * Use [MapControlCredential] to share authentication between a map control and the service module when creating a new [pipeline] object.

    * The [routeURL] represents a URL to Azure Maps [Route service API].

2. After setting up credentials and the URL, append the following code at the end of the control's `ready` event handler.

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

   Some things to know about the above JavaScript:

   * This code constructs the route from the start to end point.
   * The `routeURL` requests the Azure Maps Route service API to calculate route directions.
   * A GeoJSON feature collection from the response is then extracted using the `geojson.getFeatures()` method and added to the data source.

3. Save the **MapRoute.html** file and refresh your web browser. The map should now display the route from the start to end points.

     :::image type="content" source="./media/tutorial-route-location/map-route.png" alt-text="A screenshot showing a map that demonstrates the Azure Map control and Route service.":::

* For the completed code used in this tutorial, see the [route tutorial] on GitHub.
* To view this sample live, see [Route to a destination] on the **Azure Maps Code Samples** site.

## Next steps

The next tutorial shows you how to create a route query with restrictions, like mode of travel or type of cargo. You can then display multiple routes on the same map.

> [!div class="nextstepaction"]
> [Find routes for different modes of travel](./tutorial-prioritized-routes.md)

[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Route service API]: /rest/api/maps/route
[Map control]: ./how-to-use-map-control.md
[Symbol layers]: map-add-pin.md
[Line layers]: map-add-line-layer.md
[Get Route directions API]: /rest/api/maps/route/getroutedirections
[route tutorial]: https://github.com/Azure-Samples/AzureMapsCodeSamples/tree/master/Samples/Tutorials/Route
[Route to a destination]: https://samples.azuremaps.com/?sample=route-to-a-destination
[atlas]: /javascript/api/azure-maps-control/atlas
[atlas.Map]: /javascript/api/azure-maps-control/atlas.map
[Add a symbol layer to a map]: map-add-pin.md
[Data-driven style expressions]: data-driven-style-expressions-web-sdk.md
[GeoJSON Point objects]: https://en.wikipedia.org/wiki/GeoJSON
[setCamera(CameraOptions | CameraBoundsOptions & AnimationOptions)]: /javascript/api/azure-maps-control/atlas.map#setcamera-cameraoptions---cameraboundsoptions---animationoptions-
[MapControlCredential]: /javascript/api/azure-maps-rest/atlas.service.mapcontrolcredential
[pipeline]: /javascript/api/azure-maps-rest/atlas.service.pipeline
[routeURL]: /javascript/api/azure-maps-rest/atlas.service.routeurl