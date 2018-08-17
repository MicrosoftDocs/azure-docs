---
title: Show directions with Azure Maps | Microsoft Docs
description: How to display directions between two locations on a Javascript map
author: jingjing-z
ms.author: jinzh
ms.date: 05/07/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: codepen
---

# Show directions from A to B 

This article shows you how to make a route request and show the route on the map. 

## Understand the code

<iframe height='500' scrolling='no' title='Show directions from A to B on a map' src='//codepen.io/azuremaps/embed/zRyNmP/?height=469&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/zRyNmP/'>Show directions from A to B on a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object. You can see [create a map](./map-create.md) for instructions.

The second block of code creates and adds pins on the map to represent the start and end point of the route. You can see [add a pin on the map](map-add-pin.md) for instructions.

The third block of code uses [setCameraBounds](https://docs.microsoft.com/javascript/api/azure-maps-javascript/map?view=azure-iot-typescript-latest#setcamerabounds) function of the map class to set the bounding box of the map based on the start and end point of the route.

The fourth block of code sends an [XMLHttpRequest](https://xhr.spec.whatwg.org/) to [Azure Maps Route API](https://docs.microsoft.com/rest/api/maps/route/getroutedirections).

The last block of code parses the incoming response. For a successful response, it collects the latitude and longitude information for each waypoint. It creates an array of lines by connecting each waypoint to its subsequent waypoint. It adds all those lines onto the map to render the route. You can see [add a line on the map](./map-add-shape.md#addALine) for instructions.

## Next steps

Learn more about the classes and methods used in this article: 

* [Map](https://docs.microsoft.com/javascript/api/azure-maps-javascript/map?view=azure-iot-typescript-latest)
    * [setCameraBounds](https://docs.microsoft.com/javascript/api/azure-maps-javascript/map?view=azure-iot-typescript-latest#setcamerabounds)
    * [addLinestrings](https://docs.microsoft.com/javascript/api/azure-maps-javascript/map?view=azure-iot-typescript-latest#addlinestrings)
    * [addPins](https://docs.microsoft.com/javascript/api/azure-maps-javascript/map?view=azure-iot-typescript-latest#addpins)

For more code examples to add to your maps, see the following articles: 
* [Show traffic on the map](./map-show-traffic.md)
* [Interacting with the map - mouse events](./map-events.md)
