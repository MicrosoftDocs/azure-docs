---
title: How to request real-time data in Azure Maps | Microsoft Docs
description: Request real-time data using the Azure Maps Mobility service.
author: walsehgal
ms.author: v-musehg
ms.date: 05/22/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Request real-time data using the Azure Maps Mobility Service

This article shows you how to use Azure Maps [Mobility service](https://aka.ms/AzureMapsMobilityService) to request real-time transit data such as real-time arrivals at a transit stop, including number of line arrivals or arrivals for a particular line and requesting real-time information for a given bike or scooter docking station.


## Prerequisites

To make any calls to the Azure Maps public transit APIs, you need a Maps account and key. For information on creating an account and retrieving a key, see [How to manage your Azure Maps account and keys](how-to-manage-account-keys.md).

This article uses the [Postman app](https://www.getpostman.com/apps) to build REST calls. You can use any API development environment that you prefer.


## Request real-time arrivals for a stop

In order to request real-time arrivals data for a particular stop, you will need to make a request to the [real time arrivals API](https://docs.microsoft.com/en-us/rest/api/mobility/getrealtimearrivalspreview) of the Azure Maps [mobility service](https://aka.ms/AzureMapsMobilityService). You will also need the **MetroID** and **stopID** for the stop to complete the request. To learn more about how to get the metro ID, see [Get metro area ID](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-request-transit-data#get-metro-area-id). And for information on how to request nearby transit stops, you can take a look at [Request nearby transit stops](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-request-transit-data#request-nearby-transit-stops).

Let's use "522" as our metro ID, which is the metro ID for "Seattle–Tacoma–Bellevue, WA" area and also use the stop ID "2060603", which is a transit stop at "Ne 24th St & 162nd Ave Ne" in Bellevue, WA. To request real-time arrivals data for all busses at a stop, complete the following steps:

1. Create a collection in which to store the requests. In the Postman app, select **New**. In the **Create New** window, select **Collection**. Name the collection and select the **Create** button.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request, select the collection you created in the previous step as the location in which to save the request, and then select **Save**.

    ![Create a request in Postman](./media/how-to-request-transit-data/postman-new.png)

3. Select the GET HTTP method on the builder tab and enter the following URL to create a GET request.

    ```HTTP
    https://atlas.microsoft.com/mobility/realtime/arrivals/json?subscription-key={subscription-key}&api-version=1.0&metroId=522&query=2060603&transitType=bus
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


## Request real-time dock data

The [Get Transit Dock Info API](https://aka.ms/AzureMapsMobilityTransitDock) of the Azure Maps Mobility Service, allows to request static and real-time information for a given bike or scooter docking station. We will make a request to get real-time data for a docking station for bikes. 

In order to make a request to the Get Transit Dock Info API, you will need the **dockId** for that station. You can get the dock ID by making a search request to the [Get Nearby Transit API](https://aka.ms/AzureMapsMobilityNearbyTransit) and setting the **objectType** parameter to "bikeDock". Follow the steps below to get real-time data of a docking station for bikes.


### Get dock ID

To get **dockID**, follow the steps below to make a request to the Get Nearby Transit API:

1. In Postman, click **New Request** | **GET request** and name it **Get dock ID**.

2.  On the Builder tab, select the **GET** HTTP method, enter the following request URL, and click **Send**.
 
    ```HTTP
    ttps://atlas.microsoft.com/mobility/transit/nearby/json?subscription-key={subscription-key}&api-version=1.0&metroId=121&query=40.7663753,-73.9627498&radius=100&objectType=bikeDock
    ```

3. After a successful request, you will receive the following response. Notice that we now have the **id** in the response, which can be used later as a query parameter in the request to the Get Transit Dock Info API.

    ```JSON
    {
        "results": [
            {
                "id": "121---4640799",
                "type": "bikeDock",
                "objectDetails": {
                    "availableVehicles": 0,
                    "vacantLocations": 30,
                    "lastUpdated": "2019-05-21T20:06:59-04:00",
                    "operatorInfo": {
                        "id": "80",
                        "name": "Citi Bike"
                    }
                },
                "position": {
                    "latitude": 40.767128,
                    "longitude": -73.962243
                },
                "viewport": {
                    "topLeftPoint": {
                        "latitude": 40.768039,
                        "longitude": -73.963413
                    },
                    "btmRightPoint": {
                        "latitude": 40.766216,
                        "longitude": -73.961072
                    }
                }
            }
        ]
    }
    ```


### Get real-time dock data

Follow the steps below to make a request to the Get Transit Dock Info API to get real-time data for the selected dock.

1. In Postman, click **New Request** | **GET request** and name it **Get real-time dock data**.

2.  On the Builder tab, select the **GET** HTTP method, enter the following request URL, and click **Send**.
 
    ```HTTP
    https://atlas.microsoft.com/mobility/transit/dock/json?subscription-key={subscription-key}&api-version=1.0&query=121---4640799
    ```

3. After a successful request, you will receive the response of the following structure:

    ```JSON
    {
        "availableVehicles": 1,
        "vacantLocations": 29,
        "position": {
            "latitude": 40.767128,
            "longitude": -73.962246
        },
        "lastUpdated": "2019-05-21T20:26:47-04:00",
        "operatorInfo": {
            "id": "80",
            "name": "Citi Bike"
        }
    }
    ```