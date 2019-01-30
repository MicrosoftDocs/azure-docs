---
title: Show search results with Azure Maps | Microsoft Docs
description: How to perform a search request with Azure Maps then display the results on a Javascript map
author: jingjing-z
ms.author: jinzh
ms.date: 11/15/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Show search results on the map

This article shows you how to search for location of interest and show the search results on the map.

There are two ways to search for a location of interest. One way is to use a service module to make a search request. The other way is to make a search request through a [XMLHttpRequest](https://xhr.spec.whatwg.org/) to [Azure Maps Fuzzy search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy). Both ways are discussed below.

## Make a search request via service module

<iframe height='500' scrolling='no' title='Show search results on a map (Service Module)' src='//codepen.io/azuremaps/embed/zLdYEB/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/zLdYEB/'>Show search results on a map (Service Module)</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object and initializes the client service. You can see [create a map](./map-create.md) for instructions.

The second block of code uses the [getSearchFuzzy](https://docs.microsoft.com/javascript/api/azure-maps-rest/services.search?view=azure-iot-typescript-latest#getsearchfuzzy-string--searchgetsearchfuzzyoptionalparams-) method in the [service module](https://atlas.microsoft.com/sdk/js/atlas-service.js?api-version=1). It allows you to perform a free form text search via the [Fuzzy Search rest API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) to search for point of interest. Fuzzy search API can handle any combination of fuzzy inputs. The response from the fuzzy search service is then parsed into GeoJSON format using the [getGeoJsonSearchResponse](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.geojson.geojsonsearchresponse?view=azure-iot-typescript-latest#geojsonsearchresponse) method. 

The third block of code creates a data source object using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class and add search results to it. A [symbol layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.symbollayer?view=azure-iot-typescript-latest) uses text or icons to render point-based data wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) as symbols on the map.  A symbol layer is then created and the data source is added to the symbol layer, which is then added to the map.

The last block of code adjusts the camera bounds for the map by using the Map's [setCamera](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setcamera-cameraoptions---cameraboundsoptions---animationoptions-) property.

The search request, the data source, and symbol layer and the camera bounds are created and set within the map's [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) to ensure that the results are displayed after the map loads fully.


## Make a search request via XMLHttpRequest

<iframe height='500' scrolling='no' title='Show search results on a map' src='//codepen.io/azuremaps/embed/KQbaeM/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/KQbaeM/'>Show search results on a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a Map object. You can see [create a map](./map-create.md) for instructions.

The second block of code sends an [XMLHttpRequest](https://xhr.spec.whatwg.org/) to [Azure Maps Fuzzy search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) to search for the point of interest. The Fuzzy search API can handle any combination of fuzzy inputs. 

The third block of code parses the search response and stores the results in an array to calculate the bounds. It then returns the search results.

The fourth block of code creates a data source object using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class and add search results to it. A [symbol layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.symbollayer?view=azure-iot-typescript-latest) uses text or icons to render point-based data wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) as symbols on the map. A symbol layer is then created and the data source is added to the symbol layer, which is then added to the map.

The last block of code creates a [BoundingBox](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.boundingbox?view=azure-iot-typescript-latest) object using the array of results and then adjusts the camera bounds for the map by using the Map's [setCamera](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setcamera-cameraoptions---cameraboundsoptions---animationoptions-). It then render the result pins.

The search request, the data source, and symbol layer and the camera bounds are set within the map's [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) to ensure that the results are displayed after the map loads fully.

## Next steps

Learn more about **Fuzzy Search**:

> [!div class="nextstepaction"]
> [Azure Maps Fuzzy Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy)

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Get information from a coordinate](./map-get-information-from-coordinate.md)
<!-- Comment added to suppress false positive warning -->
> [!div class="nextstepaction"]
> [Show directions from A to B](./map-route.md)
