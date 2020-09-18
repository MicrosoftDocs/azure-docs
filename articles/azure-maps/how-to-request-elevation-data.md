---
title: Request elevation data
description: Learn how to request elevation data using the Azure Maps Elevation service.
author: anastasia-ms
ms.author: v-stharr
ms.date: 09/18/2020
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Request elevation data using the Azure Maps Elevation service

The Azure Maps  [Elevation service service](https://docs.microsoft.com/rest/api/maps/elevation) provides APIs to query elevation data for locations on earth. You can request sampled elevation data along paths, within a defined bounding box, or at specific coordinates. Also, you can use the [Render V2 - Get Map Tile API](https://docs.microsoft.com/rest/api/maps/renderv2) to retrieve elevation data from tiles in GeoTIFF raster format. This article shows you how to use Azure Maps Elevation service and the Get Map Tile API to request elevation data in both GeoJSON and raster tile formats.

## Prerequisites

1. [Make an Azure Maps account in the S1 pricing tier](quick-demo-map-app.md#create-an-azure-maps-account)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.

For more information on authentication in Azure Maps, see manage authentication in Azure Maps.

This article uses the [Postman](https://www.postman.com/) application, but you may choose a different API development environment.

## Request elevation data in raster tiled format

To request elevation data in raster tile format, use the [Render V2 - Get Map Tile API](https://docs.microsoft.com/rest/api/maps/renderv2). The API will return the tile as a GeoTIFF.

1. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**.  Name the collection and select the **Create** button.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **Save**.

3. Select the **GET** HTTP method in the builder tab and enter the following URL to request the raster tile. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.

    ```http
    https://atlas.microsoft.com/map/tile?subscription-key={Azure-Maps-Primary-Subscription-key}&api-version=2.0&tilesetId=microsoft.dem&zoom=6&x=10&y=22
    ```

4. Click the **Send** button. Results....

## Request elevation data in GeoJSON format

Use the Elevation service APIs to request elevation data in GeoJSON format. This section will show you each one of the three APIs:

* [Get Data for Lat Long Coordinates](https://docs.microsoft.com/rest/api/maps/elevation/getdataforlatlongcoordinates) 
* [Get Data for Bounding Box](https://docs.microsoft.com/rest/api/maps/elevation/getdataforboundingbox)
* [Get Data for Polyline](https://docs.microsoft.com/rest/api/maps/elevation/getdataforpolyline)

### Request elevation data by Lat/Long coordinate pairs

You can request elevation data by specifying a single coordinate pair, or an array of coordinate pairs. In this example, we'll send an array of coordinate pairs.

1. Select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL:

    ```http
    https://atlas.microsoft.com/elevation/point??subscription-key={Azure-Maps-Primary-Subscription-key}api-version=1.0&points=40.714728,-73.998672|-34.397,150.644
    ```

3. Click the **Send** button.  You'll receive the following JSON response:

    ```json
    { 
       "data" : [
          {
             "elevation" : 1608.637939453125,
             "location" : {
                "lat" : 39.73915360,
                "lng" : -104.98470340
             }
          },
          {
             "elevation" : -50.78903579711914,
             "location" : {
                "lat" : 36.4555560,
                "lng" : -116.8666670
             }
          }
       ]  
    }
    ```

### Request elevation data by Polyline

### Request elevation data by Bounding Box

## Next steps

To further explore the Azure Maps Elevation APIs, see:

> [!div class="nextstepaction"]
> [Elevation - Get Data for Lat Long Coordinates](https://docs.microsoft.com/rest/api/maps/elevation/getdataforlatlongcoordinates)

> [!div class="nextstepaction"]
> [Elevation - Get Data for Bounding Box](https://docs.microsoft.com/rest/api/maps/elevation/getdataforboundingbox)

> [!div class="nextstepaction"]
> [Elevation - Get Data for Polyline](https://docs.microsoft.com/rest/api/maps/elevation/getdataforpolyline)

> [!div class="nextstepaction"]
> [Render V2 – Get Map Tile](https://docs.microsoft.com/rest/api/maps/renderv2)

For a complete list of Azure Maps REST APIs, see:

> [!div class="nextstepaction"]
> [Azure Maps REST APIs](https://docs.microsoft.com/en-us/rest/api/maps/)
