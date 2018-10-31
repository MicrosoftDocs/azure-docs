---
title: Geographic search | Microsoft Docs
description: How to specify geographic boundaries for Local Business Search API endpoint.
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.component: bing-local-business
ms.topic: article
ms.date: 08/02/2018
ms.author: rosh, v-gedod
---

# Geographic boundaries for Bing Local Business Search
Search near a location with geographic boundaries.  Add coordinates specified by either a circular area or square bounding box. Because the parameters are mutually exclusive, specify only one of them. 

The `localCircularView` parameter sets a geographic coordinate by latitude and longitude and a radius. The coordinates define the center of the circle and the radius defines the size of circle to search. The response includes only places within the circle. The response give priority to results near the user, but it may include relevant places that are outside the area.

The `localMapView` specifies the southeast and northwest coordinates of a box to search. The response includes relevant places within and it may include results outside the specified area. 

If you do not specify a geographic location and the user is searching for a local business, Bing uses the user's current location to determine the area to search. Bing determines the user's location from the `X-Search-ClientIP` header or the `X-Search-Location` header. If neither is specified, Bing determines the location from reverse IP of the request or GPS for mobile devices.

Bing ignores the boundaries if the query includes a geographic location. For example, if the query is "sailing in San Diego," Bing uses San Diego as the location and ignores the location specified by the `localCircularView` or `localMapView` query parameter or the `X-Search-ClientIP` or `X-Search-Location` header.

Search boundaries:
1.	If the query string contains an explicit location, that takes precedence over location parameters.
2.	If there is no explicit location in query string, but `localcircularview` is used, then the latter will be used.
3.	If there is no explicit location in query string and there are no entities in the `localcircularview`, closest matched local entities are returned.

## localCircularView

To specify a circular geographic search, get the longitude and longitude coordinates of the center from a map or application. Define the radius of the search in meters.  Then, assign the coordinates and radius, for example: `localCircularView=47.6421,-122.13715,5000`.  

Complete query:
````
https://api.cognitive.microsoft.com/bing/localbusinesses/search?q=restaurant&localCircularView=47.6421,-122.13715,5000&appid=0123456789ABCDEF&mkt=en-us&form=monitr
````

## localMapView
To specify a bounding box for geographic search, get the longitude/latitude coordinates of the southeast and northwest corners of the bounding box, then assign the coordinates to the `localMapView` parameter, southeast coordinates first, as in the following example: `localMapView=47.619987,-122.181671,47.6421,-122.13715`.  This box defines a rectangle bounded by the Microsoft visitor center in Redmond, WA and Lake Bellevue, WA.

Complete query:
````
https://api.cognitive.microsoft.com/bing/localbusinesses/search?q=restaurant&localMapView=47.619987,-122.181671,47.6421,-122.13715&appid=0123456789ABCDEF&mkt=en-us&form=monitr
````
## Next steps
- [Local Business Search Java Quickstart](quickstarts/local-search-java-quickstart.md)
- [Local Business Search C# Quickstart](quickstarts/local-quickstart.md)
- [Local Business Search Node Quickstart](quickstarts/local-search-node-quickstart.md)
- [Local Business Search Python quickstart](quickstarts/local-search-python-quickstart.md)
