---
title: Show search results with Azure Maps | Microsoft Docs
description: How to perform a search request with Azure Maps then display the results on a Javascrip map
services: azure-maps
keywords: 

author: kgremban
ms.author: kgremban
ms.date: 05/07/2018
ms.topic: article
ms.service: azure-maps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: codepen
---

# Show search results on the map

This article shows you how to make a search request and show the search results on the map. 

## Understand the code

<iframe height='500' scrolling='no' title='Show search results on a map' src='//codepen.io/azuremaps/embed/KQbaeM/?height=519&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/KQbaeM/'>Show search results on a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object. You can see [create a map](./map-create.md) for instructions.

The second block of code creates and adds a layer of search pins on the map. You can see [add a pin on the map](./map-add-pin.md) for instructions.

The third block of code sends an [XMLHttpRequest](https://xhr.spec.whatwg.org/) to [Azure Maps Fuzzy Search API](https://docs.microsoft.com/rest/api/azure-maps/search/getsearchfuzzy).

The last block of code parses the incoming response. For a successful response, it collects the latitude and longitude information for each location returned. It adds all the location points to the map as pins and adjusts the bounds of the map to render all the pins.


## Next steps

Learn more about the classes and methods used in this article: 

* [Azure Maps Fuzzy Search API](https://docs.microsoft.com/rest/api/azure-maps/search/getsearchfuzzy)
* [Map](https://docs.microsoft.com/javascript/api/azure-maps-javascript/map?view=azure-iot-typescript-latest)
    * [addPins](https://docs.microsoft.com/javascript/api/azure-maps-javascript/map?view=azure-iot-typescript-latest#addpins)
