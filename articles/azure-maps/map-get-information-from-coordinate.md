---
title: Show information about a coordinate on a map | Microsoft Azure Maps
description: Learn how to display information about an address on the map when a user selects a coordinate.
author: eriklindeman
ms.author: eriklind
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
ms.custom: codepen, devx-track-js
---

# Get information from a coordinate

This article shows how to make a reverse address search that shows the address of a clicked popup location.

There are two ways to make a reverse address search. One way is to query the [Reverse Address Search API] through a service module. The other way is to use the [Fetch API] to make a request to the [Reverse Address Search API] to find an address. Both ways are surveyed below.

## Make a reverse search request via service module

<iframe height='500' scrolling='no' title='Get information from a coordinate (Service Module)' src='//codepen.io/azuremaps/embed/ejEYMZ/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' loading="lazy" allowtransparency='true' allowfullscreen='true'>See the Pen <a href='https://codepen.io/azuremaps/pen/ejEYMZ/'>Get information from a coordinate (Service Module)</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block constructs a map object and sets the authentication mechanism to use the access token. For more information, see [create a map].

The second code block creates a `TokenCredential` to authenticate HTTP requests to Azure Maps with the access token. It then passes the `TokenCredential` to `atlas.service.MapsURL.newPipeline()` and creates a [Pipeline] instance. The `searchURL` represents a URL to the [Search service].

The third code block updates the style of mouse cursor to a pointer and creates a [popup] object. For more information, see [add a popup on the map].

The fourth block of code adds a mouse click [event listener]. When triggered, it creates a search query with the coordinates of the clicked point. It then uses the [getSearchAddressReverse] method to query the [Get Search Address Reverse API] for the address of the coordinates. A GeoJSON feature collection is then extracted using the `geojson.getFeatures()` method from the response.

The fifth block of code sets up the HTML popup content to display the response address for the clicked coordinate position.

The change of cursor, the popup object, and the click event are all created in the map's [load event listener]. This code structure ensures map fully loads before retrieving the coordinates information.

## Make a reverse search request via Fetch API

Click on the map to make a reverse geocode request for that location using fetch.

<iframe height='500' scrolling='no' title='Get information from a coordinate' src='//codepen.io/azuremaps/embed/ddXzoB/?height=516&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' loading="lazy" allowtransparency='true' allowfullscreen='true'>See the Pen <a href='https://codepen.io/azuremaps/pen/ddXzoB/'>Get information from a coordinate</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object and sets the authentication mechanism to use the access token. You can see [create a map] for instructions.

The second block of code updates the style of the mouse cursor to a pointer. It instantiates a [popup](/javascript/api/azure-maps-control/atlas.popup#open) object. You can see [add a popup on the map] for instructions.

The third block of code adds an event listener for mouse clicks. Upon a mouse click, it uses the [Fetch API] to query the Azure Maps [Reverse Address Search API] for the clicked coordinates address. For a successful response, it collects the address for the clicked location. It defines the popup content and position using the [setOptions] function of the popup class.

The change of cursor, the popup object, and the click event are all created in the map's [load event listener]. This code structure ensures the map fully loads before retrieving the coordinates information.

## Next steps

> [!div class="nextstepaction"]
> [Best practices for using the search service](how-to-use-best-practices-for-search.md)

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](/javascript/api/azure-maps-control/atlas.map)

> [!div class="nextstepaction"]
> [Popup](/javascript/api/azure-maps-control/atlas.popup)

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Show directions from A to B](./map-route.md)

> [!div class="nextstepaction"]
> [Show traffic](./map-show-traffic.md)

[Reverse Address Search API]: /rest/api/maps/search/getsearchaddressreverse
[Fetch API]: https://fetch.spec.whatwg.org/
[create a map]: map-create.md
[Search service]: /rest/api/maps/search
[Pipeline]: /javascript/api/azure-maps-rest/atlas.service.pipeline
[popup]: /javascript/api/azure-maps-control/atlas.popup#open
[add a popup on the map]: map-add-popup.md
[event listener]: /javascript/api/azure-maps-control/atlas.map#events
[getSearchAddressReverse]: /javascript/api/azure-maps-rest/atlas.service.searchurl#searchaddressreverse-aborter--geojson-position--searchaddressreverseoptions-
[Get Search Address Reverse API]: /rest/api/maps/search/getsearchaddressreverse
[load event listener]: /javascript/api/azure-maps-control/atlas.map#events
[setOptions]: /javascript/api/azure-maps-control/atlas.popup#setoptions-popupoptions-
