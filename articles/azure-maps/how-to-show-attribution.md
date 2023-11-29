---
title: Show the correct map copyright attribution information
titleSuffix: Microsoft Azure Maps
description: The map copyright attribution information must be displayed in all applications that use the Render API, including web and mobile applications. This article discusses how to display the correct attribution every time you display or update a tile. 
author: eriklindeman
ms.author: eriklind
ms.date: 3/16/2022
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Show the correct copyright attribution

When using the Azure Maps [Render service], either as a basemap or layer, you're required to display the appropriate data provider copyright attribution on the map. This information should be displayed in the lower right-hand corner of the map.

:::image type="content" source="./media/how-to-show-attribution/attribution-road.png" border="false" alt-text="The above image is an example of a map from the Render service showing the copyright attribution when using the road style":::

The above image is an example of a map from the Render service, displaying the road style. It shows the copyright attribution in the lower right-hand corner of the map.

:::image type="content" source="./media/how-to-show-attribution/attribution-satellite.png" border="false" alt-text="The above image is an example of a map from the Render service showing the copyright attribution when using the satellite style":::

The above image is an example of a map from the Render service, displaying the satellite style. note that there's another data provider listed.

## The Get Map Attribution API

The [Get Map Attribution API] enables you to request map copyright attribution information so that you can display in on the map within your applications.

### When to use the Get Map Attribution API

The map copyright attribution information must be displayed on the map in any applications that use the Render API, including web and mobile applications.

The attribution is automatically displayed and updated on the map When using any of the Azure Maps SDKs, including the [Web], [Android] and [iOS] SDKs.

When using map tiles from the Render service in a third-party map, you must display and update the copyright attribution information on the map.

Map content changes whenever an end user selects a different style, zooms in or out, or pans the map. Each of these user actions causes an event to fire. When any of these events fire, you need to call the Get Map Attribution API. Once you have the updated copyright attribution information, you then need to display it in the lower right-hand corner of the map.

Since the data providers can differ depending on the *region* and *zoom* level, the Get Map Attribution API takes these parameters as input and returns the corresponding attribution text.

### How to use the Get Map Attribution API

You need the following information to run the `attribution` command:

| Parameter   | Type   | Description                       |
| ----------- | ------ | --------------------------------- |
| api-version | string | Version number of Azure Maps API. |
| bounds      | array  | A string that represents the rectangular area of a bounding box. The bounds parameter is defined by the four bounding box coordinates. The first 2 are the WGS84 longitude and latitude defining the southwest corner and the last 2 are the WGS84 longitude and latitude defining the northeast corner. The string is presented in the following format: [SouthwestCorner_Longitude, SouthwestCorner_Latitude, NortheastCorner_Longitude, NortheastCorner_Latitude]. |
| tilesetId | TilesetID | A tileset is a collection of raster or vector data broken up into a uniform grid of square tiles at preset zoom levels. Every tileset has a tilesetId to use when making requests. The tilesetId for tilesets created using Azure Maps Creator are generated through the [Tileset Create API]. There are ready-to-use tilesets supplied by Azure Maps, such as `microsoft.base.road`, `microsoft.base.hybrid` and `microsoft.weather.radar.main`, a complete list can be found the [Get Map Attribution] REST API documentation. |
| zoom | integer | Zoom level for the selected tile. The valid range depends on the tile, see the [TilesetID] table for valid values for a specific tileset. For more information, see the [Zoom levels and tile grid] article. |
| subscription-key | string | One of the Azure Maps keys provided from an Azure Map Account. For more information, see the [Authentication with Azure Maps] article. |

Run the following GET request to get the corresponding copyright attribution to display on the map:

```http
https://atlas.microsoft.com/map/attribution?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=2.1&tilesetId=microsoft.base&zoom=6&bounds=-122.414162,47.579490,-122.247157,47.668372
```

## Additional information

* For more information, see the [Render service] documentation.

[Android]: how-to-use-android-map-control-library.md
[Authentication with Azure Maps]: azure-maps-authentication.md
[Get Map Attribution API]: /rest/api/maps/render-v2/get-map-attribution
[Get Map Attribution]: /rest/api/maps/render-v2/get-map-attribution#tilesetid
[iOS]: how-to-use-ios-map-control-library.md
[Render service]: /rest/api/maps/render-v2
[Tileset Create API]: /rest/api/maps/v2/tileset/create
[TilesetID]: /rest/api/maps/render-v2/get-map-attribution#tilesetid
[Web]: how-to-use-map-control.md
[Zoom levels and tile grid]: zoom-levels-and-tile-grid.md