---
title: Show directions with Azure Maps | Microsoft Docs
description: How to display directions between two locations on a Javascript map
author: jingjing-z
ms.author: jinzh
ms.date: 09/07/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: codepen
---

# Show directions from A to B

This article shows you how to make a route request and show the route on the map.

There are two ways to do so. The first way is to query the [Azure Maps Route API](https://docs.microsoft.com/rest/api/maps/route/getroutedirections) through a service module. The second way is to make a [XMLHttpRequest](https://xhr.spec.whatwg.org/) to the API. Both ways are discussed below.

## Query the route via service module

<iframe height='500' scrolling='no' title='Show directions from A to B on a map (Service Module)' src='//codepen.io/azuremaps/embed/RBZbep/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/RBZbep/'>Show directions from A to B on a map (Service Module)</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first block of code constructs a Map object. You can see [create a map](./map-create.md) for instructions.

The line in the second block of code instantiates a service client.

The third code block initializes the [line String Layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addlinestrings) on the map.

The fourth block of code creates and adds pins on the map to represent the start and end point of the route. You can see [add a pin on the map](map-add-pin.md) for instructions about using [addPins](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addpins).

The next block of code uses [setCameraBounds](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setcamerabounds) function of the map class to set the bounding box of the map based on the start and end point of the route.

The sixth code block constructs a route query.

The last block of code queries the Azure Maps routing service through the [getRouteDirections](https://docs.microsoft.com/javascript/api/azure-maps-rest/services.route?view=azure-iot-typescript-latest#getroutedirections) method to get a route between the start and destination point. The response is then parsed into GeoJSON format using the [getGeoJsonRoutes](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.geojson.geojsonroutedirectionsresponse?view=azure-iot-typescript-latest#getgeojsonroutes) method. It adds all those lines onto the map to render the route. You can see [add a line on the map](./map-add-shape.md#addALine) for more information.

## Query the route via XMLHttpRequest

<iframe height='500' scrolling='no' title='Show directions from A to B on a map' src='//codepen.io/azuremaps/embed/zRyNmP/?height=469&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/zRyNmP/'>Show directions from A to B on a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first block of code constructs a Map object. You can see [create a map](./map-create.md) for instructions.

The second block of code creates and adds pins on the map to represent the start and end point of the route. You can see [add a pin on the map](map-add-pin.md) for instructions about using [addPins](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addpins).

The third block of code uses [setCameraBounds](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setcamerabounds) function of the Map class to set the bounding box of the map based on the start and end point of the route.

The fourth block of code sends an [XMLHttpRequest](https://xhr.spec.whatwg.org/) to [Azure Maps Route API](https://docs.microsoft.com/rest/api/maps/route/getroutedirections).

The last block of code parses the incoming response. For a successful response, it collects the latitude and longitude information for each waypoint. It creates an array of lines by connecting each waypoint to its subsequent waypoint. It adds all those lines onto the map to render the route. You can see [add a line on the map](./map-add-shape.md#addALine) for instructions.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Show traffic on the map](./map-show-traffic.md)

> [!div class="nextstepaction"]
> [Interacting with the map - mouse events](./map-events.md)
