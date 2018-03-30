---
title: How to show search results on the Azure Location Based Services' map | Microsoft Docs
description: Show search results
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

# Show search results on the map

## Overview
This tutorial shows you how to make a search request and show the search results on the map. 

## Understand the code

<iframe height='500' scrolling='no' title='Show search results on a map' src='//codepen.io/azuremaps/embed/KQbaeM/?height=519&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/KQbaeM/'>Show search results on a map</a> by Azure LBS (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object. You can see [create a map](./map-create.md) for instructions.

The second block of code creates and adds a layer of search pins on the map. You can see [add a pin on the map](./map-add-pin.md) for instructions.

The third block of code sends an [XMLHttpRequest](https://xhr.spec.whatwg.org/) to [Azure Maps Fuzzy Search API](https://docs.microsoft.com/en-us/rest/api/location-based-services/search/getsearchfuzzy).

The last block of code parses the incoming response. For a successful response, it collects the latitude and longitude information for each location returned. It adds all the location points to the map as pins and adjusts the bounds of the map to render all the pins.


## Related reference

* [Azure Maps Fuzzy Search API](https://docs.microsoft.com/en-us/rest/api/location-based-services/search/getsearchfuzzy)
* [Map](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest)
    * [addPins](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_addPins)
