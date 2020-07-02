---
title: Show search results on a map | Microsoft Azure Maps
description: In this article, you'll learn how to perform a search request using Microsoft Azure Maps Web SDK and display the results on the map.
author: Philmea
ms.author: philmea
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Show search results on the map

This article shows you how to search for location of interest and show the search results on the map.

There are two ways to search for a location of interest. One way is to use a service module to make a search request. The other way is to make a search request to [Azure Maps Fuzzy search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) through the [Fetch API](https://fetch.spec.whatwg.org/). Both ways are discussed below.

## Make a search request via service module

<iframe height='500' scrolling='no' title='Show search results on a map (Service Module)' src='//codepen.io/azuremaps/embed/zLdYEB/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/zLdYEB/'>Show search results on a map (Service Module)</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block constructs a map object and sets the authentication mechanism to use the access token. You can see [create a map](./map-create.md) for instructions.

The second block of code creates a `TokenCredential` to authenticate HTTP requests to Azure Maps with the access token. It then passes the `TokenCredential` to `atlas.service.MapsURL.newPipeline()` and creates a [Pipeline](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.pipeline?view=azure-maps-typescript-latest) instance. The `searchURL` represents a URL to Azure Maps [Search](https://docs.microsoft.com/rest/api/maps/search) operations.

The third block of code creates a data source object using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class and add search results to it. A [symbol layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.symbollayer?view=azure-iot-typescript-latest) uses text or icons to render point-based data wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) as symbols on the map.  A symbol layer is then created. The data source is added to the symbol layer, which is then added to the map.

The fourth code block uses the [SearchFuzzy](/javascript/api/azure-maps-rest/atlas.service.models.searchgetsearchfuzzyoptionalparams) method in the [service module](how-to-use-services-module.md). It allows you to perform a free form text search via the [Get Search Fuzzy rest API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) to search for point of interest. Get requests to the Search Fuzzy API can handle any combination of fuzzy inputs. A GeoJSON feature collection from the response is then extracted using the `geojson.getFeatures()` method and added to the data source, which automatically results in the data being rendered on the map via the symbol layer.

The last block of code adjusts the camera bounds for the map using the Map's [setCamera](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setcamera-cameraoptions---cameraboundsoptions---animationoptions-) property.

The search request, data source, symbol layer, and camera bounds are inside the [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) of the map. We want to ensure that the results are displayed after the map fully loads.


## Make a search request via Fetch API

<iframe height='500' scrolling='no' title='Show search results on a map' src='//codepen.io/azuremaps/embed/KQbaeM/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/KQbaeM/'>Show search results on a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object. It sets the authentication mechanism to use the access token. You can see [create a map](./map-create.md) for instructions.

The second block of code creates a URL to make a search request to. It also creates two arrays to store bounds and pins for search results.

The third block of code uses the [Fetch API](https://fetch.spec.whatwg.org/). The [Fetch API](https://fetch.spec.whatwg.org/) is used to make a request to [Azure Maps Fuzzy search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) to search for the points of interest. The Fuzzy search API can handle any combination of fuzzy inputs. It then handles and parses the search response and adds the result pins to the searchPins array.

The fourth block of code creates a data source object using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class. In the code, we add search results to the source object. A [symbol layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.symbollayer?view=azure-iot-typescript-latest) uses text or icons to render point-based data wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) as symbols on the map. A symbol layer is then created. The data source is added to the symbol layer, which is then added to the map.

The last block of code creates a [BoundingBox](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.boundingbox?view=azure-iot-typescript-latest) object. It uses the array of results, and then it adjusts the camera bounds for the map using the Map's [setCamera](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setcamera-cameraoptions---cameraboundsoptions---animationoptions-). It then renders the result pins.

The search request, the data source, symbol layer, and the camera bounds are set within the map's [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) to ensure that the results are displayed after the map loads fully.

## Next steps

> [!div class="nextstepaction"]
> [Best practices for using the search service](how-to-use-best-practices-for-search.md)

Learn more about **Fuzzy Search**:

> [!div class="nextstepaction"]
> [Azure Maps Fuzzy Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy)

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Get information from a coordinate](map-get-information-from-coordinate.md)
<!-- Comment added to suppress false positive warning -->
> [!div class="nextstepaction"]
> [Show directions from A to B](map-route.md)
