---
title: Use geographic boundaries to filter results from the Bing Local Business Search API | Microsoft Docs
titleSuffix: Azure Cognitive Services
description: Use this article to learn how to filter search results from the Bing Local Business Search API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: article
ms.date: 11/01/2018
ms.author: rosh
---

# Use geographic boundaries to filter results from the Bing Local Business Search API

The Bing Local Business Search API enables you to set boundaries on the specific geographic area you'd like to search by using the `localCircularView` or `localMapView` query parameters. Be sure to use only one parameter in your queries. 

If a search term contains an explicit geographic location, The Bing Local Business API will automatically use it to set boundaries for the search results. For example, if the search term is `sailing in San Diego`, then `San Diego` will be used as the location and any other specified locations in the query parameters or user headers will be ignored. 

If a geographic location isn't detected in the search term, and no geographic location is specified using the query parameters, The Bing Local Business Search API will attempt to determine location from the request's `X-Search-ClientIP` or `X-Search-Location` headers. If neither header is specified, The API will determine location from either the client IP of the request, or GPS coordinates for mobile devices.

## localCircularView

The `localCircularView` parameter creates a circular geographic area around a set of latitude/longitude coordinates, defined by a radius. When using this parameter, responses from the Bing Local Business Search API will only include locations within this circle, unlike the `localMapView` parameter which may include locations slightly outside the search area.

To specify a circular geographic search area, pick a latitude and longitude to serve as the center of the circle, and a radius in meters. This parameter can then be appended to a query string, for example: `q=Restaurants&localCircularView=47.6421,-122.13715,5000`.

Complete query:

```
https://api.cognitive.microsoft.com/bing/v7.0/localbusinesses/search?q=restaurant&localCircularView=47.6421,-122.13715,5000&appid=0123456789ABCDEF&mkt=en-us&form=monitr
```

## localMapView

The `localMapView` parameter specifies a rectangular geographic area to search, using two sets of coordinates to specify its southeast and northwest corners. When using this parameter, responses from the Bing Local Business Search API may include locations within and just outside the specified area, unlike the `localCircularView` parameter, which only includes locations within the search area.

To specify a rectangular search area, pick two sets of latitude/longitude coordinates to serve as the southeast and northwest corners of the boundary. Be sure to define the southeast coordinates first, as in the following example: `localMapView=47.619987,-122.181671,47.6421,-122.13715`.

Complete query:

```
https://api.cognitive.microsoft.com/bing/v7.0/localbusinesses/search?q=restaurant&localMapView=47.619987,-122.181671,47.6421,-122.13715&appid=0123456789ABCDEF&mkt=en-us&form=monitr
```

## Next steps
- [Local Business Search Java Quickstart](quickstarts/local-search-java-quickstart.md)
- [Local Business Search C# Quickstart](quickstarts/local-quickstart.md)
- [Local Business Search Node Quickstart](quickstarts/local-search-node-quickstart.md)
- [Local Business Search Python quickstart](quickstarts/local-search-python-quickstart.md)
