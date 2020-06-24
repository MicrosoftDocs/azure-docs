---
title: Request real-time public transit data | Microsoft Azure Maps
description: Request real-time public transit data using the Microsoft Azure Maps Mobility Service.
author: anastasia-ms
ms.author: v-stharr
ms.date: 09/06/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Request real-time public transit data using the Azure Maps Mobility Service

This article shows you how to use Azure Maps [Mobility Service](https://aka.ms/AzureMapsMobilityService) to request real-time public transit data.

In this article, you will learn how to request next real-time arrivals for all lines arriving at a given stop

## Prerequisites

You first need to have an Azure Maps account and a subscription key to make any calls to the Azure Maps public transit APIs. For information, follow instructions in [Create an account](quick-demo-map-app.md#create-an-account-with-azure-maps) to create an Azure Maps account. Follow the steps in [get primary key](quick-demo-map-app.md#get-the-primary-key-for-your-account) to obtain the primary key for your account. For more information on authentication in Azure Maps, see [manage authentication in Azure Maps](./how-to-manage-authentication.md).

This article uses the [Postman app](https://www.getpostman.com/apps) to build REST calls. You can use any API development environment that you prefer.

## Request real-time arrivals for a stop

In order to request real-time arrivals data of a particular public transit stop, you'll need to make request to the [Real-time Arrivals API](https://aka.ms/AzureMapsMobilityRealTimeArrivals) of the Azure Maps [Mobility Service](https://aka.ms/AzureMapsMobilityService). You'll need the **metroID** and **stopID** to complete the request. To learn more about how to request these parameters, see our guide on how to [request public transit routes](https://aka.ms/AMapsHowToGuidePublicTransitRouting).

Let's use "522" as our metro ID, which is the metro ID for the  "Seattle–Tacoma–Bellevue, WA" area. Use "522---2060603" as the stop ID, this bus stop is at "Ne 24th St & 162nd Ave Ne, Bellevue WA". To request the next five real-time arrivals data, for all next live arrivals at this stop, complete the following steps:

1. Open the Postman app, and let's create a collection to store the requests. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**.  Name the collection and select the **Create** button.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, as the location in which to save the request. Then, select **Save**.

    ![Create a request in Postman](./media/how-to-request-transit-data/postman-new.png)

3. Select the **GET** HTTP method on the builder tab and enter the following URL to create a GET request. Replace `{subscription-key}`, with your Azure Maps primary key.

    ```HTTP
    https://atlas.microsoft.com/mobility/realtime/arrivals/json?subscription-key={subscription-key}&api-version=1.0&metroId=522&query=522---2060603&transitType=bus
    ```

4. After a successful request, you'll receive the following response.  Notice that parameter 'scheduleType' defines whether the estimated arrival time is based on real-time or static data.

    ```JSON
    {
        "results": [
            {
                "arrivalMinutes": 8,
                "scheduleType": "realTime",
                "patternId": "522---4143196",
                "line": {
                    "lineId": "522---3760143",
                    "lineGroupId": "522---666077",
                    "direction": "backward",
                    "agencyId": "522---5872",
                    "agencyName": "Metro Transit",
                    "lineNumber": "249",
                    "lineDestination": "South Bellevue S Kirkland P&R",
                    "transitType": "Bus"
                },
                "stop": {
                    "stopId": "522---2060603",
                    "stopKey": "71300",
                    "stopName": "NE 24th St & 162nd Ave NE",
                    "stopCode": "71300",
                    "position": {
                        "latitude": 47.631504,
                        "longitude": -122.125275
                    },
                    "mainTransitType": "Bus",
                    "mainAgencyId": "522---5872",
                    "mainAgencyName": "Metro Transit"
                }
            },
            {
                "arrivalMinutes": 25,
                "scheduleType": "realTime",
                "patternId": "522---3510227",
                "line": {
                    "lineId": "522---2756599",
                    "lineGroupId": "522---666063",
                    "direction": "forward",
                    "agencyId": "522---5872",
                    "agencyName": "Metro Transit",
                    "lineNumber": "226",
                    "lineDestination": "Bellevue Transit Center Crossroads",
                    "transitType": "Bus"
                },
                "stop": {
                    "stopId": "522---2060603",
                    "stopKey": "71300",
                    "stopName": "NE 24th St & 162nd Ave NE",
                    "stopCode": "71300",
                    "position": {
                        "latitude": 47.631504,
                        "longitude": -122.125275
                    },
                    "mainTransitType": "Bus",
                    "mainAgencyId": "522---5872",
                    "mainAgencyName": "Metro Transit"
                }
            }
        ]
    }
    ```

## Next steps

Learn how to request transit data using Mobility Service:

> [!div class="nextstepaction"]
> [How to request transit data](how-to-request-transit-data.md)

Explore the Azure Maps Mobility Service API documentation:

> [!div class="nextstepaction"]
> [Mobility Service API documentation](https://aka.ms/AzureMapsMobilityService)
