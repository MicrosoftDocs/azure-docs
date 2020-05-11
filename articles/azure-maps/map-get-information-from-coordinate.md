---
title: Show information about a coordinate on a map | Microsoft Azure Maps
description: Learn how to display information about an address on the map when a user selects a coordinate.
author: Philmea
ms.author: philmea
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Get information from a coordinate

This article shows how to make a reverse address search that shows the address of a clicked popup location.

There are two ways to make a reverse address search. One way is to query the [Azure Maps Reverse Address Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) through a service module. The other way is to use the [Fetch API](https://fetch.spec.whatwg.org/) to make a request to the [Azure Maps Reverse Address Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) to find an address. Both ways are surveyed below.

## Make a reverse search request via service module

<iframe height='500' scrolling='no' title='Get information from a coordinate (Service Module)' src='//codepen.io/azuremaps/embed/ejEYMZ/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ejEYMZ/'>Get information from a coordinate (Service Module)</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block constructs a map object and sets the authentication mechanism to use the access token. You can see [create a map](./map-create.md) for instructions.

The second code block creates a `TokenCredential` to authenticate HTTP requests to Azure Maps with the access token. It then passes the `TokenCredential` to `atlas.service.MapsURL.newPipeline()` and creates a [Pipeline](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.pipeline?view=azure-maps-typescript-latest) instance. The `searchURL` represents a URL to Azure Maps [Search](https://docs.microsoft.com/rest/api/maps/search) operations.

The third code block updates the style of mouse cursor to a pointer and creates a [popup](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest#open) object. You can see [add a popup on the map](./map-add-popup.md) for instructions.

The fourth block of code adds a mouse click [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events). When triggered, it creates a search query with the coordinates of the clicked point. It then uses the [getSearchAddressReverse](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.searchurl?view=azure-iot-typescript-latest#searchaddressreverse-aborter--geojson-position--searchaddressreverseoptions-)method to query the [Get Search Address Reverse API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) for the address of the coordinates. A GeoJSON feature collection is then extracted using the `geojson.getFeatures()` method from the response.

The fifth block of code sets up the HTML popup content to display the response address for the clicked coordinate position.

The change of cursor, the popup object, and the click event are all created in the map's [load event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events). This code structure ensures map fully loads before retrieving the coordinates information.

## Make a reverse search request via Fetch API

Click on the map to make a reverse geocode request for that location using fetch.

<iframe height='500' scrolling='no' title='Get information from a coordinate' src='//codepen.io/azuremaps/embed/ddXzoB/?height=516&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ddXzoB/'>Get information from a coordinate</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object and sets the authentication mechanism to use the access token. You can see [create a map](./map-create.md) for instructions.

The second block of code updates the style of the mouse cursor to a pointer. It instantiates a [popup](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest#open) object. You can see [add a popup on the map](./map-add-popup.md) for instructions.

The third block of code adds an event listener for mouse clicks. Upon a mouse click, it uses the [Fetch API](https://fetch.spec.whatwg.org/) to query the [Azure Maps Reverse Address Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) for the clicked coordinates address. For a successful response, it collects the address for the clicked location. It defines the popup content and position using the [setOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest#setoptions-popupoptions-) function of the popup class.

The change of cursor, the popup object, and the click event are all created in the map's [load event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events). This code structure ensures the map fully loads before retrieving the coordinates information.

## Next steps

> [!div class="nextstepaction"]
> [Best practices for using the search service](how-to-use-best-practices-for-search.md)

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [Popup](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest)

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Show directions from A to B](./map-route.md)

> [!div class="nextstepaction"]
> [Show traffic](./map-show-traffic.md)
