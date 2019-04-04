---
title: How to request transit data in Azure Maps | Microsoft Docs
description: Request transit data in Azure Maps.
author: walsehgal
ms.author: v-musehg
ms.date: 04/03/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Request transit data in Azure Maps 

This articles shows you ways to request public transit data using the Azure Maps Public transit APIs. 

## Prerequisites

To make any calls to the Azure Maps public transit APIs, you need a Maps account and key. For information on creating an account and retrieving a key, see [How to manage your Azure Maps account and keys](how-to-manage-account-keys.md).

This article uses the [Postman app](https://www.getpostman.com/apps) to build REST calls. You can use any API development environment that you prefer.


## Get Metro area code

In order to request transit information for a particular metro area you will need the `metroId` for the city you want to request the transit data for. The mobility service's [Get Metro Area API](https://docs.microsoft.com/en-us/api/maps/mobility/getmetroareapreview), lets you request the metro area details and respond with details such as `metroId`, `metroName` and a representation of the metro area geometry in GeoJSON format.

To request details for a metro area, complete the following steps:

1. Create a collection in which to store the requests. In the Postman app, select **New**. In the **Create New** window, select **Collection**. Name the collection and select the **Create** button.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the pushpins, select the collection you created in the previous step as the location in which to save the request, and then select **Save**.
    
    ![Create a request in Postman](./media/how-to-request-transit-data/postman-new.png)

3. Select the GET HTTP method on the builder tab and enter the following URL to create a GET request.

    ```HTTP
    https://atlas.microsoft.com/mobility/metroArea/id/json?subscription-key={subscription-key}&api-version=1.0&filterQuery=47.63096,-122.126&filterType=position
    ```

4. After a successful request, you will receive the following response:

    ```JSON
    {
        "results": [
            {
                "metroId": "522",
                "metroName": "Seattle–Tacoma–Bellevue, WA",
                "boundingPolygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                -121.99604,
                                47.16147
                            ],
                            [
                                -121.97051,
                                47.17222
                            ],
                            [
                                -121.96308,
                                47.17671
                            ],
                            [
                                -121.95725,
                                47.18314
                            ],
                            [
                                -121.76122,
                                47.47491
                            ],
                            [
                                -121.75761,
                                47.48229
                            ],
                            [
                                -121.75614,
                                47.49037
                            ],
                            [
                                -121.75586,
                                47.49707
                            ],
                            ...
                            ...
                            ...,
                            [
                                -122.18711,
                                47.15571
                            ],
                            [
                                -122.01525,
                                47.16008
                            ],
                            [
                                -122.00553,
                                47.15919
                            ],
                            [
                                -121.99604,
                                47.16147
                            ]
                        ]
                    ]
                },
                "viewport": {
                    "topLeftPoint": {
                        "latitude": 48.5853,
                        "longitude": -124.80934
                    },
                    "btmRightPoint": {
                        "latitude": 46.90534,
                        "longitude": -121.55032
                    }
                }
            }
        ]
    }
    ```

Copy the `metroId`, to use it later.

## Request nearby transit stops

