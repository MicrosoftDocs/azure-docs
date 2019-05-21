---
title: How to request real-time arrivals data for transit services in Azure Maps | Microsoft Docs
description: Request real-time arrivals data for transit services using the Azure Maps Mobility service.
author: walsehgal
ms.author: v-musehg
ms.date: 05/21/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Request real-time arrivals transit data using the Azure Maps Real-time arrivals API

This article shows you how to use Azure Maps [Mobility service](https://aka.ms/AzureMapsMobilityService), [Real time arrivals API](https://docs.microsoft.com/en-us/rest/api/mobility/getrealtimearrivalspreview) to request real-time arrivals transit data, including number of line arrivals at a particular stop or arrivals of a particular line at stops near a user's location. You will also learn how to request real-time arrival data for one or multiple types of public transit such as bus, tram, and subway.


## Prerequisites

To make any calls to the Azure Maps public transit APIs, you need a Maps account and key. For information on creating an account and retrieving a key, see [How to manage your Azure Maps account and keys](how-to-manage-account-keys.md).

This article uses the [Postman app](https://www.getpostman.com/apps) to build REST calls. You can use any API development environment that you prefer.


## Request real-time arrivals for a stop

In order to request real-time arrivals data for a particular stop, you will need the **MetroID** and **stopID** for the stop. To learn more about how to get the metro ID, see [Get metro area ID](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-request-transit-data#get-metro-area-id). And for information on how to request nearby transit stops, you can take a look at [Request nearby transit stops](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-request-transit-data#request-nearby-transit-stops). 

Let's use "522" as our metro ID, which is the metro ID for "Seattle–Tacoma–Bellevue, WA" area and also use the stop ID "2060603", which is a transit stop at "Ne 24th St & 162nd Ave Ne" in Bellevue, WA. To request real-time arrivals data for all busses at a stop, complete the following steps:

1. Create a collection in which to store the requests. In the Postman app, select **New**. In the **Create New** window, select **Collection**. Name the collection and select the **Create** button.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the pushpins, select the collection you created in the previous step as the location in which to save the request, and then select **Save**.

    ![Create a request in Postman](./media/how-to-request-transit-data/postman-new.png)

3. Select the GET HTTP method on the builder tab and enter the following URL to create a GET request.

    ```HTTP
    https://atlas.microsoft.com/mobility/realtime/arrivals/json?api-version=1.0&metroId=522&query=2060603&transitType=bus
    ```

4. After a successful request, you will receive the following response:

    ```JSON
    {
        "results": [
            {
                "arrivalMinutes": 4,
                "scheduleType": "realTime",
                "patternId": 3860436,
                "line": {
                    "lineId": 2756599,
                    "lineGroupId": 666063,
                    "direction": "forward",
                    "agencyId": 5872,
                    "agencyName": "Metro Transit",
                    "lineNumber": "226",
                    "lineDestination": "Bellevue Transit Center Crossroads",
                    "transitType": "Bus"
                },
                "stop": {
                    "stopId": 2060603,
                    "stopKey": "71300",
                    "stopName": "NE 24th St & 162nd Ave NE",
                    "position": {
                        "latitude": 47.631504,
                        "longitude": -122.125275
                    },
                    "mainTransitType": "Bus",
                    "mainAgencyId": 5872,
                    "mainAgencyName": "Metro Transit"
                }
            },
            {
                "arrivalMinutes": 30,
                "scheduleType": "scheduledTime",
                "patternId": 3860436,
                "line": {
                    "lineId": 2756599,
                    "lineGroupId": 666063,
                    "direction": "forward",
                    "agencyId": 5872,
                    "agencyName": "Metro Transit",
                    "lineNumber": "226",
                    "lineDestination": "Bellevue Transit Center Crossroads",
                    "transitType": "Bus"
                },
                "stop": {
                    "stopId": 2060603,
                    "stopKey": "71300",
                    "stopName": "NE 24th St & 162nd Ave NE",
                    "position": {
                        "latitude": 47.631504,
                        "longitude": -122.125275
                    },
                    "mainTransitType": "Bus",
                    "mainAgencyId": 5872,
                    "mainAgencyName": "Metro Transit"
                }
            }
        ]
    }