---
title: How to add a pin to Azure Location Based Services' map | Microsoft Docs
description: Add a pin
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

# Add pins on the map

## Overview
This tutorial shows you how to add a pin on a map.  

## Understand the code

<iframe height='474' scrolling='no' title='Add a pin to a map' src='//codepen.io/azuremaps/embed/ZrVpEa/?height=474&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ZrVpEa/'>Add a pin to a map</a> by Azure LBS (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object. You can see [create a map](./map-create.md) for instructions.

In the second block of code, a pin is created and added to the map. A pin is a [Feature](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/feature?view=azure-iot-typescript-latest) of [Point](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/point?view=azure-iot-typescript-latest) with [PinProperties](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/pinproperties?view=azure-iot-typescript-latest) as its Feature property. Use new atlas.data.Feature(new atlas.data.Point()) to create a pin and define its properties. A pin layer is an array of pins. Use [addPins()](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_addPins) function of the map class to add a pin layer to the map and define the properties of the pin layer. See properties of a pin layer at [PinLayerOptions](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/pinlayeroptions?view=azure-iot-typescript-latest). 

## Related reference

To add a pin on the map, you need to use the following class and method:
* [Map](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest)
    * [addPins](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_addPins)
