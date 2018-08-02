---
title: Geographic search | Microsoft Docs
description: How to specify geographic boundaries for Local search API endpoint.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-local-search
ms.topic: article
ms.date: 08/02/2018
ms.author: rosh, v-gedod
---

# Geographic boundaries for Bing Local Search

To specify the boundaries of geographic search, use the `localCircularView` or `localMapView` query parameters. Because the parameters are mutually exclusive, specify only one of them. 

The `localCircularView` parameter sets a geographic coordinate by latitude and longitude and a radius. The coordinates define the center of the circle and the radius defines the size of circle to search. The response includes only places within the circle; the response does not include relevant places that are just outside the area.

The `localMapView` specifies the southeast and northwest coordinates of a box to search. The response includes relevant places within and just outside the specified area. Because the map view may include relevant places outside of the specified area, it may be advantageous to use it instead of the circular view.

If you do not specify a geographic location and the user is searching for a local business, Bing uses the user's current location to determine the area to search. Bing determines the user's location from the `X-Search-ClientIP` header or the `X-Search-Location` header. If neither is specified, Bing determines the client IP from the request.

Bing ignores the specified location if the query includes a geographic location. For example, if the query is "sailing in San Diego," Bing uses San Diego as the location and ignores the location specified in the `localCircularView` or `localMapView` query parameter or the `X-Search-ClientIP` or `X-Search-Location` header.


## localCircularView

To specify a circular geographic search, get the longitude and longitude coordinates of the center from a map or application. Define the radius of the search in meters.  Then, assign the coordinates and radius, for example: `localCircularView=47.6421,-122.13715,5000`.  

Complete query:
````
https://www.bingapis.com/api/v7/localbusinesses/search?q=restaurant&localCircularView=47.6421,-122.13715,5000&appid=0123456789ABCDEF&mkt=en-us&form=monitr
````


## localMapView
To specify a bounding box for geographic search, get the longitude/latitude coordinates of the southeast and northwest corners of the bounding box, then assign the coordinates to the localMapView parameter, southeast coordinates first, as in the following example: `localMapView=47.619987,-122.181671,47.6421,-122.13715`.  This box defines a rectangle bounded by the Microsoft visitor center in Redmond, WA and Lake Bellevue, WA.

Complete query:
````
https://www.bingapis.com/api/v7/localbusinesses/search?q=restaurant&localMapView=47.619987,-122.181671,47.6421,-122.13715&appid=0123456789ABCDEF&mkt=en-us&form=monitr
````
## Next steps
- [Local Search Java Quickstart](local-search-java-quickstart.md)
- [Local Search C# Quickstart](local-quickstart.md)
- [Local Search Node Quickstart](local-search-node-quickstart.md)
- [Local Search Python quickstart](local-search-python-quickstart.md)
