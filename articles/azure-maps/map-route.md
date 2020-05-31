---
title: Show route directions on a map | Microsoft Azure Maps
description: In this article, you'll learn how to display directions between two locations on a map using the Microsoft Azure Maps Web SDK.
author: Philmea
ms.author: philmea
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: codepen
---

# Show directions from A to B

This article shows you how to make a route request and show the route on the map.

There are two ways to do so. The first way is to query the [Azure Maps Route API](https://docs.microsoft.com/rest/api/maps/route/getroutedirections) through a service module. The second way is to use the [Fetch API](https://fetch.spec.whatwg.org/) to make a search request to the [Azure Maps Route API](https://docs.microsoft.com/rest/api/maps/route/getroutedirections). Both ways are discussed below.

## Query the route via service module

<iframe height='500' scrolling='no' title='Show directions from A to B on a map (Service Module)' src='//codepen.io/azuremaps/embed/RBZbep/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/RBZbep/'>Show directions from A to B on a map (Service Module)</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the above code, the first block constructs a map object and sets the authentication mechanism to use the access token. You can see [create a map](./map-create.md) for instructions.

The second block of code creates a `TokenCredential` to authenticate HTTP requests to Azure Maps with the access token. It then passes the `TokenCredential` to `atlas.service.MapsURL.newPipeline()` and creates a [Pipeline](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.pipeline?view=azure-maps-typescript-latest) instance. The `routeURL` represents a URL to Azure Maps [Route](https://docs.microsoft.com/rest/api/maps/route) operations.

The third block of code creates and adds a [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) object to the map.

The fourth block of code creates start and end [points](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.point?view=azure-iot-typescript-latest) objects and adds them to the dataSource object.

A line is a [Feature](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.feature?view=azure-iot-typescript-latest) for LineString. A [LineLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.linelayer?view=azure-iot-typescript-latest) renders line objects wrapped in the  [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) as lines on the map. The fourth block of code creates and adds a line layer to the map. See properties of a line layer at [LinestringLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.linelayeroptions?view=azure-iot-typescript-latest).

A [symbol layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.symbollayer?view=azure-iot-typescript-latest) uses texts or icons to render point-based data wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest). The texts or the icons render as symbols on the map. The fifth block of code creates and adds a symbol layer to the map.

The sixth block of code queries the Azure Maps routing service, which is part of the [service module](how-to-use-services-module.md). The [calculateRouteDirections](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.routeurl?view=azure-iot-typescript-latest#methods) method of the RouteURL is used to get a route between the start and end points. A GeoJSON feature collection from the response is then extracted using the `geojson.getFeatures()` method and is added to the datasource. It then renders the response as a route on the map. For more information about adding a line to the map, see [add a line on the map](map-add-line-layer.md).

The last block of code sets the bounds of the map using the Map's [setCamera](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setcamera-cameraoptions---cameraboundsoptions---animationoptions-) property.

The route query, data source, symbol, line layers, and camera bounds are created inside the [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events). This code structure ensures the results are displayed only after the map fully loads.

## Query the route via Fetch API

<iframe height='500' scrolling='no' title='Show directions from A to B on a map' src='//codepen.io/azuremaps/embed/zRyNmP/?height=469&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/zRyNmP/'>Show directions from A to B on a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object and sets the authentication mechanism to use the access token. You can see [create a map](./map-create.md) for instructions.

The second block of code creates and adds a [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) object to the map.

The third code block creates the start and destination points for the route. Then, it adds them to the data source. You can see [add a pin on the map](map-add-pin.md) for instructions about using [addPins](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest).

A [LineLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.linelayer?view=azure-iot-typescript-latest) renders line objects wrapped in the  [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) as lines on the map. The fourth block of code creates and adds a line layer to the map. See properties of a line layer at [LineLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.linelayeroptions?view=azure-iot-typescript-latest).

A [symbol layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.symbollayer?view=azure-iot-typescript-latest) uses text or icons to render point-based data wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) as symbols on the map. The fifth block of code creates and adds a symbol layer to the map. See properties of a symbol layer at [SymbolLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.symbollayeroptions?view=azure-iot-typescript-latest).

The next code block creates `SouthWest` and `NorthEast` points from the start and destination points and sets the bounds of the map using the Map's [setCamera](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setcamera-cameraoptions---cameraboundsoptions---animationoptions-) property.

The last block of code uses the [Fetch API](https://fetch.spec.whatwg.org/) to make a search request to the [Azure Maps Route API](https://docs.microsoft.com/rest/api/maps/route/getroutedirections). The response is then parsed. If the response was successful, the latitude and longitude information is used to create an array a line by connecting those points. The line data is then added to data source to render the route on the map. You can see [add a line on the map](map-add-line-layer.md) for instructions.

The route query, data source, symbol, line layers, and camera bounds are created inside the [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events). Again, we want to ensure that results are displayed after the map loads fully.

## Next steps

> [!div class="nextstepaction"]
> [Best practices for using the routing service](how-to-use-best-practices-for-search.md)

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Show traffic on the map](./map-show-traffic.md)

> [!div class="nextstepaction"]
> [Interacting with the map - mouse events](./map-events.md)
