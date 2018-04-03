---
title: How to show traffic on the Azure Location Based Services' map | Microsoft Docs
description: Show traffic
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

# Show traffic on the map

## Overview
This tutorial shows you how to show traffic and incidents information on the map. 

## Understand the code

<iframe height='456' scrolling='no' title='Show traffic on a map' src='//codepen.io/azuremaps/embed/WMLRPw/?height=456&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WMLRPw/'>Show traffic on a map</a> by Azure LBS (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object. You can see [create a map](map-create.md) for instructions.

The second block of code uses [setTraffic](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#settraffic) function of the map class to render the traffic flows and incidents on the map.

## Related reference

To show traffic on the map, you need to use the following classes:
* [Map](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest)
    * [setTraffic](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#settraffic)
