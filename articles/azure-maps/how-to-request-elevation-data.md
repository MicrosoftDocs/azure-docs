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
* [Get Data for Polyline](https://docs.microsoft.com/rest/api/maps/elevation/getdataforpolyline)
* [Get Data for Bounding Box](https://docs.microsoft.com/rest/api/maps/elevation/getdataforboundingbox)

### Request elevation data at Lat/Long coordinates

In this example, we'll use the [Get Data for Lat Long Coordinates API](https://docs.microsoft.com/rest/api/maps/elevation/getdataforlatlongcoordinates) to request elevation data at Mt. Everest and Chamlang mountains. Both coordinate points must be defined in Lat/Long format.

1. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**.  Name the collection and select the **Create** button.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **Save**.

3. Select the **GET** HTTP method in the builder tab and enter the following URL:

    ```http
    https://atlas.microsoft.com/elevation/point?subscription-key={Azure-Maps-Primary-Subscription-key}&api-version=1.0&points=-73.998672, 40.714728|150.644,-34.397
    ```

4. Click the **Send** button.  You'll receive the following JSON response:

    ```json
    {
    "data": [
        {
            "coordinate": {
                "latitude": 40.714728,
                "longitude": -73.998672
            },
            "elevationInMeter": 12.142355447638208
        },
        {
            "coordinate": {
                "latitude": -34.397,
                "longitude": 150.644
            },
            "elevationInMeter": 384.47041445517846
        }
    ]
    }
    ```

### Request elevation data samples along a line

In the first part of this example, we'll use the [Get Data for Polyline](https://docs.microsoft.com/rest/api/maps/elevation/getdataforpolyline) to request five equally-spaced samples of elevation data along a straight line between coordinates at Mt. Everest and Chamlang mountains. Both coordinates must be defined in Long/Lat format.

Then, we'll use the Get Data for Polyline to request three equally-spaced samples of elevation data along a path. We'll define the precise location for the samples by passing in three Long/Lat coordinate pairs.

>[!NOTE]
>If you do not specify a value for the `samples` parameter, the number of samples defaults to 10. The maximum number of samples is 2,000.

1. Select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL:

    ```http
    https://atlas.microsoft.com/elevation/line?api-version=1.0&subscription-key={Azure-Maps-Primary-Subscription-key}&lines=40.714728,-73.998672|-34.397,150.644&samples=5
    ```

3. Click the **Send** button.  You'll receive the following JSON response:

    ```JSON
    {
        "data": [
            {
                "coordinate": {
                    "latitude": 27.775,
                    "longitude": 86.9797222
                },
                "elevationInMeter": 7116.0348851572589
            },
            {
                "coordinate": {
                    "latitude": 27.8282639,
                    "longitude": 86.9661111
                },
                "elevationInMeter": 5670.2714332412661
            },
            {
                "coordinate": {
                    "latitude": 27.8815278,
                    "longitude": 86.9525
                },
                "elevationInMeter": 5416.7860142381014
            },
            {
                "coordinate": {
                    "latitude": 27.9347917,
                    "longitude": 86.9388889
                },
                "elevationInMeter": 5776.66349687595
            },
            {
                "coordinate": {
                    "latitude": 27.9880556,
                    "longitude": 86.9252778
                },
                "elevationInMeter": 8683.5778891244227
            }
        ]
    }
    ```

4. Now, we'll request three samples of elevation data along a path between coordinates at Mount Everest, Chamlang, and Jannu mountains. In the **Params** section, append '' to the `lines` query key. Change the 'samples' query key to '3'.

     :::image type="content" source="./media/how-to-request-elevation-data/get-elevation-samples.png" alt-text="Retrieve three elevation data samples.":::

5. Click the blue **Send** button. You'll receive the following JSON response:

    ```json
    {
        "data": [
            {
                "coordinate": {
                    "latitude": 27.775,
                    "longitude": 86.9797222
                },
                "elevationInMeter": 7116.0348851572589
            },
            {
                "coordinate": {
                    "latitude": 27.737403546316028,
                    "longitude": 87.411180791156454
                },
                "elevationInMeter": 1798.6945512521534
            },
            {
                "coordinate": {
                    "latitude": 27.682222199999998,
                    "longitude": 88.0444444
                },
                "elevationInMeter": 7016.9372013588072
            }
        ]
    }
    ```


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
