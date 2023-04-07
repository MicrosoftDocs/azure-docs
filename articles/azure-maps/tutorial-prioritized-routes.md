---
title: 'Tutorial: Find multiple routes by mode of travel'
titleSuffix: Microsoft Azure Maps
description: Tutorial on how to use Azure Maps to find routes for specific travel modes to points of interest. See how to display multiple routes on maps.
author: sinnypan
ms.author: sipa
ms.date: 12/29/2021
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
ms.custom: mvc, devx-track-js
---

# Tutorial: Find and display routes for different modes of travel using Azure Maps

This tutorial demonstrates how to use the Azure Maps [Route service] and [Map control] to display route directions for both private vehicles and commercial vehicles (trucks) with `USHazmatClass2` cargo type.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create and display the Map control on a web page
> * Render real-time traffic data on a map
> * Request and display private and commercial vehicle routes on a map

## Prerequisites

* An [Azure Maps account]
* A [subscription key]

> [!NOTE]
> For more information on authentication in Azure Maps, see [manage authentication in Azure Maps].

## Create a new web page using the map control API

The following steps show you how to create and display the Map control in a web page.

1. On your local machine, create a new file and name it **MapTruckRoute.html**.
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
   * The `GetMap` function contains the inline JavaScript code used to access the Azure Maps API.

3. Next, add the following JavaScript code to the `GetMap` function, just beneath the code added in the last step. This code creates a map control and initializes it using your Azure Maps subscription keys that you provide. Make sure and replace the string `<Your Azure Maps Subscription Key>` with the Azure Maps subscription key that you copied from your Maps account.

    ```JavaScript
    //Instantiate a map object
    var map = new atlas.Map("myMap", {
        // Replace <Your Azure Maps Subscription Key> with your Azure Maps subscription key. https://aka.ms/am-primaryKey
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: '<Your Azure Maps Subscription Key>'
        }
    });
    ```

   Some things to know about the above JavaScript:

   * This code is the core of the `GetMap` function, which initializes the Map Control API for your Azure Maps account.
   * [atlas] is the namespace that contains the Azure Maps API and related visual components.
   * [atlas.Map] provides the control for a visual and interactive web map.

4. Save the file and open it in your browser. The browser displays a basic map by calling `atlas.Map` using your Azure Maps subscription key.

    :::image type="content" source="./media/tutorial-prioritized-routes/basic-map.png" alt-text="A screenshot that shows the most basic map you can make by calling the atlas Map API, using your Azure Maps subscription key.":::

## Render real-time traffic data on a map

1. In the `GetMap` function, after initializing the map, add the following JavaScript code. This code implements the Map control's `ready` event handler.

    ```javascript
    map.events.add("ready", function() {
        // Add Traffic Flow to the Map
        map.setTraffic({
            flow: "relative"
        });
    });
    ```

   Some things to know about the above JavaScript:

   * This code implements the Map control's `ready` event handler. The rest of the code in this tutorial is placed inside the `ready` event handler.
   * In the map `ready` event handler, the traffic flow setting on the map is set to `relative`, which is the speed of the road relative to free-flow.
   * For more traffic options, see [TrafficOptions interface].

2. Save the **MapTruckRoute.html** file and refresh the page in your browser. If you zoom into any city, like Los Angeles, the streets display with current traffic flow data.

    :::image type="content" source="./media/tutorial-prioritized-routes/traffic-map.png" alt-text="A screenshot that shows a map of Los Angeles, with the streets displaying traffic flow data.":::

<a id="queryroutes"></a>

## Define route display rendering

In this tutorial, two routes are calculated on the map. The first route is calculated for a private vehicle (car). The second route is calculated for a commercial vehicle (truck) to show the difference between the results. When rendered, the map displays a symbol icon for the start and end points of the route, and route line geometries with different colors for each route path. For more information on adding line layers, see [Add a line layer to a map]. To learn more about symbol layers, see [Add a symbol layer to a map].

1. In the Map control's `ready` event handler, append the following code.

    ```JavaScript

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

    ```

   Some things to know about the above JavaScript:

   * In the Map control's `ready` event handler, a data source is created to store the route from start to finish.
   * [Expressions] are used to retrieve the line width and color from properties on the route line feature.
   * To ensure that the route line doesn't cover up the road labels, we've passed a second parameter with the value of `'labels'`.

    Next, a symbol layer is created and attached to the data source. This layer specifies how the start and end points are rendered. Expressions have been added to retrieve the icon image and text label information from properties on each point object. To learn more about expressions, see [Data-driven style expressions].

2. Next, set the start point as a fictitious company in Seattle called *Fabrikam*, and the end point as a Microsoft office.  In the Map control's `ready` event handler, append the following code.

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

    //Add the data to the data source.
    datasource.add([startPoint, endPoint]);

    //Fit the map window to the bounding box defined by the start and end positions.
    map.setCamera({
        bounds: atlas.data.BoundingBox.fromData([startPoint, endPoint]),
        padding: 100
    });

    ```

   About the above JavaScript:

   * This code creates two [GeoJSON Point objects] to represent start and end points, which are then added to the data source.
   * The last block of code sets the camera view using the latitude and longitude of the start and end points.
   * The start and end points are added to the data source.
   * The bounding box for the start and end points is calculated using the `atlas.data.BoundingBox.fromData` function. This bounding box is used to set the map cameras view over the entire route using the `map.setCamera` function.
   * Padding is added to compensate for the pixel dimensions of the symbol icons.
   * For more information, see the [setCamera] function in the Microsoft technical documentation.

3. Save **TruckRoute.html** and refresh your browser. The map is now centered over Seattle. The blue teardrop pin marks the start point. The round blue pin marks the end point.

   :::image type="content" source="./media/tutorial-prioritized-routes/pins-map.png" alt-text="A screenshot that shows a map with a route containing a blue teardrop pin marking the start point and a blue round pin marking the end point.":::

<a id="multipleroutes"></a>

## Request and display private and commercial vehicle routes on a map

This section shows you how to use the Azure Maps Route service to get directions from one point to another, based on your mode of transport. Two modes of transport are used: truck and car.

>[!TIP]
>The Route service provides APIs to plan *fastest*, *shortest*, *eco*, or *thrilling* routes based on distance, traffic conditions, and mode of transport used. The service also lets users plan future routes based on historical traffic conditions. Users can see the prediction of route durations for any given time. For more information, see [Get Route directions API].

1. In the `GetMap` function, inside the control's `ready` event handler, add the following to the JavaScript code.

    ```JavaScript
   //Use MapControlCredential to share authentication between a map control and the service module.
    var pipeline = atlas.service.MapsURL.newPipeline(new atlas.service.MapControlCredential(map));
    
    //Construct the RouteURL object
    var routeURL = new atlas.service.RouteURL(pipeline);
    ```

    * Use [MapControlCredential] to share authentication between a map control and the service module when creating a new [pipeline] object.

    * The [routeURL] represents a URL to Azure Maps [Route service].

2. After setting up credentials and the URL, add the following JavaScript code to construct a truck route from the start to end points. This route is created and displayed for a truck carrying `USHazmatClass2` classed cargo.

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

        //Add the route line to the data source. This should render below the car route which will likely be added to the data source faster, so insert it at index 0.
        datasource.add(routeLine, 0);
    });
    ```

   About the above JavaScript:

   * This code queries the Azure Maps Route service through the [Azure Maps Route Directions API].
   * The route line is then extracted from the GeoJSON feature collection from the response that is extracted using the `geojson.getFeatures()` method.
   * The route line is then added to the data source.
   * Two properties are added to the truck route line: a blue stroke color `#2272B9`, and a stroke width of nine pixels.
   * The route line is given an index of 0 to ensure that the truck route is rendered before any other lines in the data source. The reason is the truck route calculation are often slower than a car route calculation. If the truck route line is added to the data source after the car route, it will render above it.

    >[!TIP]
    > To see all possible options and values for the Azure Maps Route Directions API, see [URI Parameters for Post Route Directions].

3. Next, append the following JavaScript code to create a route for a car.

    ```JavaScript
    routeURL.calculateRouteDirections(atlas.service.Aborter.timeout(10000), coordinates).then((directions) => {

        //Get data features from response
        var data = directions.geojson.getFeatures();

        //Get the route line and add some style properties to it.  
        var routeLine = data.features[0];
        routeLine.properties.strokeColor = '#B76DAB';
        routeLine.properties.strokeWidth = 5;

        //Add the route line to the data source. This will add the car route after the truck route.  
        datasource.add(routeLine);
    });
    ```

   About the above JavaScript:

   * This code queries the Azure Maps routing service through the [Azure Maps Route Directions API] method.
   * The route line is then extracted from the GeoJSON feature collection from the response that is extracted using the `geojson.getFeatures()` method then is added to the data source.
   * Two properties are added to the truck route line: a purple stroke color `#B76DAB`, and a stroke width of five pixels.

4. Save the **TruckRoute.html** file and refresh your web browser. The map should now display both the truck and car routes.

    :::image type="content" source="./media/tutorial-prioritized-routes/prioritized-routes.png" alt-text="A screenshot that displays both a private as well as a commercial vehicle route on a map using the Azure Route Service.":::

    * The truck route is displayed using a thick blue line and the car route is displayed using a thin purple line.
    * The car route goes across Lake Washington via I-90, passing through tunnels beneath residential areas. Because the tunnels are in residential areas, hazardous waste cargo is restricted. The truck route, which specifies a `USHazmatClass2` cargo type, is directed to use a different route that doesn't have this restriction.

* For the completed code used in this tutorial, see the [Truck Route] tutorial on GitHub.
* To view this sample live, see [Multiple routes by mode of travel] on the **Azure Maps Code Samples** site.
* You can also use [Data-driven style expressions].

## Next steps

The next tutorial demonstrates the process of creating a simple store locator using Azure Maps.

> [!div class="nextstepaction"]
> [Create a store locator using Azure Maps](./tutorial-create-store-locator.md)

[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[manage authentication in Azure Maps]: how-to-manage-authentication.md
[Route service]: /rest/api/maps/route
[Map control]: how-to-use-map-control.md
[Get Route directions API]: /rest/api/maps/route/getroutedirections
[routeURL]: /javascript/api/azure-maps-rest/atlas.service.routeurl
[pipeline]: /javascript/api/azure-maps-rest/atlas.service.pipeline
[TrafficOptions interface]: /javascript/api/azure-maps-control/atlas.trafficoptions
[atlas]: /javascript/api/azure-maps-control/atlas
[atlas.Map]: /javascript/api/azure-maps-control/atlas.map
[Add a symbol layer to a map]: map-add-pin.md
[Add a line layer to a map]: map-add-line-layer.md
[Expressions]: data-driven-style-expressions-web-sdk.md
[Data-driven style expressions]: data-driven-style-expressions-web-sdk.md
[GeoJSON Point objects]: https://en.wikipedia.org/wiki/GeoJSON
[setCamera]: /javascript/api/azure-maps-control/atlas.map#setCamera_CameraOptions___CameraBoundsOptions___AnimationOptions_
[MapControlCredential]: /javascript/api/azure-maps-rest/atlas.service.mapcontrolcredential
[Azure Maps Route Directions API]: /javascript/api/azure-maps-rest/atlas.service.routeurl#calculateroutedirections-aborter--geojson-position----calculateroutedirectionsoptions-
[Truck Route]: https://samples.azuremaps.com/?sample=car-vs-truck-route
[Multiple routes by mode of travel]: https://samples.azuremaps.com/?sample=multiple-routes-by-mode-of-travel
[Data-driven style expressions]: data-driven-style-expressions-web-sdk.md
[URI Parameters for Post Route Directions]: /rest/api/maps/route/postroutedirections#uri-parameters
