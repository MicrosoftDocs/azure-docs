---
title: Show search results with Azure Maps | Microsoft Docs
description: How to perform a search request with Azure Maps then display the results on a Javascript map
author: jingjing-z
ms.author: jinzh
ms.date: 08/26/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Show search results on the map

This article shows you how to search for location of interest and show the search results on the map. 

## Understand the code

<iframe height='500' scrolling='no' title='Show search results on a map (Service Module)' src='//codepen.io/azuremaps/embed/zLdYEB/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/zLdYEB/'>Show search results on a map (Service Module)</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object and instantiates a client service. You can see [create a map](./map-create.md) for instructions.

The second block of code uses Fuzzy search [Azure Maps Fuzzy Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) to search for point of interest. Fuzzy search API can handle any combination of fuzzy inputs. The response from the fuzzy search service is then parsed into GeoJSON format and pins are added to the map to show the points of interest on the map. 

The last block of code adds camera bounds for the map by using the Map's [setCameraBounds](https://docs.microsoft.com/javascript/api/azure-maps-control/models.cameraboundsoptions?view=azure-iot-typescript-latest) property.

## Next steps

Learn more about the classes and methods used in this article: 

* [Azure Maps Fuzzy Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy)
* [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)
    * [addPins](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addpins)
    
For more code examples to add to your maps, see the following articles: 
* [Get information from a coordinate](./map-get-information-from-coordinate.md)
* [Show directions from A to B](./map-route.md)
