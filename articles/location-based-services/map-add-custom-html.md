---
title: How to add custom html to Azure Location Based Services' map | Microsoft Docs
description: Add custom html
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

# Add custom HTML on the map

## Overview
This tutorial shows you how to add a custom HTML such as an image file on the map. 

## Understand the code

<iframe height='377' scrolling='no' title='Add custom html to a map - png' src='//codepen.io/azuremaps/embed/MVoeVw/?height=377&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/MVoeVw/'>Add custom html to a map - png</a> by Azure LBS (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object. You can see [create a map](./map-create.md) for instructions.

Second block of code creates a HTML element from an image.

The last block of code uses [addHtml()](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_addHtml) function of the map class to add the image to the specified position of the map.

## Related reference

To add a custom HTML to the map, you need to use the following class and method:
* [Map](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest)
    * [addHtml](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_addHtml)
