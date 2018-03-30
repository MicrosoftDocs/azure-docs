---
title: How to show directions from A to B with Azure Location Based Services' map | Microsoft Docs
description: Show directions
services: location-based-services
keywords: 

author: dsk-2015
ms.author: shubhaj
ms.date: 03/01/2018
ms.topic: tutorial
ms.service: location-based-services

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Show directions from A to B 

## Overview
This tutorial shows you how to make a route request and show the route on the map. 

## Understand the code

<iframe height='578' scrolling='no' title='Show directions from A to B on a map' src='//codepen.io/azuremaps/embed/zRyNmP/?height=578&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/zRyNmP/'>Show directions from A to B on a map</a> by Azure LBS (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object. You can see [create a map](./map-create.md) for instructions.

The second block of code creates and adds pins on the map to represent the start and end point of the route. You can see [add a pin on the map](map-add-pin.md) for instructions.

The third block of code uses [setCameraBounds](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#setCameraBounds) function of the map class to set the bounding box of the map based on the start and end point of the route.

The fourth block of code sends an [XMLHttpRequest](https://xhr.spec.whatwg.org/) to [Azure Maps Route API](https://docs.microsoft.com/en-us/rest/api/location-based-services/route/getroutedirections).

The last block of code parses the incoming response. For a successful response, it collects the latitude and longitude information for each waypoint. It creates an array of lines by connecting each waypoint to its subsequent waypoint. It adds all those lines onto the map to render the route. You can see [add a line on the map](./map-add-shape.md#addALine) for instructions.

## Related reference

* [Map](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest)
    * [setCameraBounds](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_setCameraBounds)
    * [addLinestrings](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_addLinestrings)
    * [addPins](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_addPins)
