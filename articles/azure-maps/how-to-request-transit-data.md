---
title: How to request transit data in Azure Maps | Microsoft Docs
description: Request transit data in Azure Maps.
author: walsehgal
ms.author: v-musehg
ms.date: 04/04/2019
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

In order to request transit information for a particular metro area you will need the `metroId` for the city you want to request the transit data for. The mobility service's [Get Metro Area API](https://docs.microsoft.com/api/maps/mobility/getmetroareapreview), lets you request the metro area details and respond with details such as `metroId`, `metroName` and a representation of the metro area geometry in GeoJSON format.

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
                            ...,
                            ...,
                            ...,
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

The Azure Maps [Get Nearby Transit](https://docs.microsoft.com/api/maps/mobility/getnearbytransitpreview) service allows you to search for transit objects near a given location. We will make a request to the service to search for nearby transit stops within a certain radius. 

To make a request to the [Get Nearby Transit](https://docs.microsoft.com/en-us/api/maps/mobility/getnearbytransitpreview), follow the steps below:

1. In Postman, click **New Request** | **GET request** and name it **Get Nearby stops**.

2. On the Builder tab, select the **GET** HTTP method, enter the following request URL for your API endpoint and click **Send**.

    ```HTTP
    https://atlas.microsoft.com/mobility/transit/nearby/json?subscription-key={subscription-key}&api-version=1.0&metroId=522&query=47.63096,-122.126&radius=300
    ```

3. After a successful request, the response structure should look like the one below:

    ```JSON
    {
        "results": [
            {
                "id": "STOP:2060603",
                "type": "Stop",
                "objectDetails": {
                    "stopKey": "71300",
                    "stopName": "Ne 24th St & 162nd Ave Ne",
                    "mainTransitType": "BUS",
                    "mainAgencyId": 5872,
                    "mainAgencyName": "Metro Transit"
                },
                "position": {
                    "latitude": 47.631504,
                    "longitude": -122.125275
                },
                "viewport": {
                    "topLeftPoint": {
                        "latitude": 47.63241381296315,
                        "longitude": -122.12659096560266
                    },
                    "btmRightPoint": {
                        "latitude": 47.630594172088166,
                        "longitude": -122.12395908007201
                    }
                }
            },
            {
                "id": "STOP:2061020",
                "type": "Stop",
                "objectDetails": {
                    "stopKey": "68372",
                    "stopName": "Ne 24th St & 160th Ave Ne",
                    "mainTransitType": "BUS",
                    "mainAgencyId": 5872,
                    "mainAgencyName": "Metro Transit"
                },
                "position": {
                    "latitude": 47.631409,
                    "longitude": -122.127136
                },
                "viewport": {
                    "topLeftPoint": {
                        "latitude": 47.632318791818726,
                        "longitude": -122.12845199584025
                    },
                    "btmRightPoint": {
                        "latitude": 47.63049919323126,
                        "longitude": -122.12582004983427
                    }
                }
            },
            {
                "id": "STOP:2060604",
                "type": "Stop",
                "objectDetails": {
                    "stopKey": "71310",
                    "stopName": "Ne 24th St & 160th Ave Ne",
                    "mainTransitType": "BUS",
                    "mainAgencyId": 5872,
                    "mainAgencyName": "Metro Transit"
                },
                "position": {
                    "latitude": 47.631565,
                    "longitude": -122.127808
                },
                "viewport": {
                    "topLeftPoint": {
                        "latitude": 47.632474784183636,
                        "longitude": -122.12912401149087
                    },
                    "btmRightPoint": {
                        "latitude": 47.630655200865796,
                        "longitude": -122.12649203418405
                    }
                }
            }
        ]
    }    
    ```

If you observe the response structure carefully, you can see that it contains parameters each transit object, such as `id`, `type`, `stopName`, `mainTransitType`, `mainAgencyName` and the position (coordinates) of the object.

For the purpose of understanding we will use the coordinates from one of the transit objects with `mainTransitType` as **BUS** as origin for our route in the next section.  


## Request a transit route

The Azure Maps [Get Transit Routes API](https://docs.microsoft.com/en-us/api/maps/mobility/gettransitroutepreview) allows you to request route options between an origin and destination. 

Lets search for a route from our current location to Space Needle in Seattle. For the purpose of getting location coordinates for Space Needle, lets use the Azure Maps [Fuzzy Search Service](https://docs.microsoft.com/en-us/rest/api/maps/search/getsearchfuzzy).

To make a request to the Fuzzy search service, follow the steps below:

1. In Postman, click **New Request** | **GET request** and name it **Get location coordinates**.

2.  On the Builder tab, select the **GET** HTTP method, enter the following request URL and click **Send**.
 
    ```HTTP
    https://atlas.microsoft.com/search/fuzzy/json?subscription-key={subscription-key}&api-version=1.0&query=space needle
    ```
    
3. If you look at the response carefully, it contains multiple locations in the results for Space Needle and also contains the location coordinates information for each of them under **position**. Copy the `lat` and `lon` from position for the first result.
    
   ```JSON
   {
        "summary": {
            "query": "space needle",
            "queryType": "NON_NEAR",
            "queryTime": 61,
            "numResults": 8,
            "offset": 0,
            "totalResults": 24,
            "fuzzyLevel": 1
        },
        "results": [
            {
                "type": "POI",
                "id": "US/POI/p0/8309323",
                "score": 4.674,
                "info": "search:ta:840539000511573-US",
                "poi": {
                    "name": "Space Needle",
                    "phone": "+(1)-(206)-9052100",
                    "url": "www.spaceneedle.com",
                    "categories": [
                        "important tourist attraction",
                        "monument"
                    ],
                    "classifications": [
                        {
                            "code": "IMPORTANT_TOURIST_ATTRACTION",
                            "names": [
                                {
                                    "nameLocale": "en-US",
                                    "name": "important tourist attraction"
                                },
                                {
                                    "nameLocale": "en-US",
                                    "name": "monument"
                                }
                            ]
                        }
                    ]
                },
                "address": {
                    "streetNumber": "400",
                    "streetName": "Broad St",
                    "municipalitySubdivision": "South Lake Union, Seattle, Lower Queen Anne",
                    "municipality": "Seattle",
                    "countrySecondarySubdivision": "King",
                    "countryTertiarySubdivision": "Seattle",
                    "countrySubdivision": "WA",
                    "postalCode": "98109",
                    "countryCode": "US",
                    "country": "United States Of America",
                    "countryCodeISO3": "USA",
                    "freeformAddress": "400 Broad St, Seattle, WA 98109",
                    "countrySubdivisionName": "Washington"
                },
                "position": {
                    "lat": 47.62039,
                    "lon": -122.34928
                },
                "viewport": {
                    "topLeftPoint": {
                        "lat": 47.62129,
                        "lon": -122.35061
                    },
                    "btmRightPoint": {
                        "lat": 47.61949,
                        "lon": -122.34795
                    }
                },
                "entryPoints": [
                    {
                        "type": "main",
                        "position": {
                            "lat": 47.61982,
                            "lon": -122.34886
                        }
                    }
                ]
            },
            {
                "type": "POI",
                "id": "US/POI/p0/2818448",
                "score": 4.409,
                "info": "search:ta:840539000293076-US",
                "poi": {
                    "name": "Space Needle",
                    "phone": "+(1)-(206)-9052200",
                    "url": "www.spaceneedle.com",
                    "categories": [
                        "banquet rooms",
                        "restaurant"
                    ],
                    "classifications": [
                        {
                            "code": "RESTAURANT",
                            "names": [
                                {
                                    "nameLocale": "en-US",
                                    "name": "banquet rooms"
                                },
                                {
                                    "nameLocale": "en-US",
                                    "name": "restaurant"
                                }
                            ]
                        }
                    ]
                },
                "address": {
                    "streetNumber": "203",
                    "streetName": "6th Ave N",
                    "municipalitySubdivision": "South Lake Union, Seattle",
                    "municipality": "Seattle",
                    "countrySecondarySubdivision": "King",
                    "countryTertiarySubdivision": "Seattle",
                    "countrySubdivision": "WA",
                    "postalCode": "98109",
                    "extendedPostalCode": "981095004",
                    "countryCode": "US",
                    "country": "United States Of America",
                    "countryCodeISO3": "USA",
                    "freeformAddress": "203 6th Ave N, Seattle, WA 98109",
                    "countrySubdivisionName": "Washington"
                },
                "position": {
                    "lat": 47.61999,
                    "lon": -122.34505
                },
                "viewport": {
                    "topLeftPoint": {
                        "lat": 47.62089,
                        "lon": -122.34638
                    },
                    "btmRightPoint": {
                        "lat": 47.61909,
                        "lon": -122.34372
                    }
                },
                "entryPoints": [
                    {
                        "type": "main",
                        "position": {
                            "lat": 47.61999,
                            "lon": -122.34499
                        }
                    }
                ]
            },
            ...,
            ...,
            ...
            
        ]
    }
    ``` 
    
 
To make a route request, complete the steps below:

1. In Postman, click **New Request** | **GET request** and name it **Get Route info**.

2. On the Builder tab, select the **GET** HTTP method, enter the following request URL for your API endpoint and click **Send**.

    We will request a public transit route for bus by specifying the `modeTypes` and `transitTypes` parameters. See the [list of URI parameters](https://docs.microsoft.com/rest-staging/api/maps/mobility/gettransitroutepreview#uri-parameters) you can use in your request to the [Get Transit Routes API](https://docs.microsoft.com/api/maps/mobility/gettransitroutepreview). The request URL contains the location used in the previous sections as origin and coordinates for Space Needle as destination.
  
    ```HTTP
    https://atlas.microsoft.com/mobility/transit/route/json?subscription-key={subscription-key}&api-version=1.0&metroId=522&origin=47.63096,-122.126&destination=47.62039,-122.34928&originType=coordinates&destinationType=coordinates&modeTypes=publicTransit&transitTypes=bus
    ```

3. Upon a successful request, the response structure should look like the one below:

    ```JSON
    {
        "results": [
            {
                "itineraryId": "302c38dd-6585-4fa1-bf78-44ebbc183e0c---2019040384C30774B4B94F178E7748644A476596:0---522",
                "departureTime": "2019-04-03T14:21:34-07:00",
                "arrivalTime": "2019-04-03T15:15:53-07:00",
                "travelTimeInSeconds": 3259,
                "legs": 10,
                "itinerarySummary": [
                    {
                        "legType": "Walk",
                        "legStartTime": "2019-04-03T14:21:34-07:00",
                        "legEndTime": "2019-04-03T14:28:19-07:00",
                        "caption": "156th Avenue Northeast",
                        "lengthInMeters": 497
                    },
                    {
                        "legType": "Wait",
                        "legStartTime": "2019-04-03T14:28:19-07:00",
                        "legEndTime": "2019-04-03T14:29:20-07:00",
                        "caption": "245"
                    },
                    {
                        "legType": "Bus",
                        "legStartTime": "2019-04-03T14:29:20-07:00",
                        "legEndTime": "2019-04-03T14:32:00-07:00",
                        "caption": "245",
                        "lengthInMeters": 1350
                    },
                    {
                        "legType": "Walk",
                        "legStartTime": "2019-04-03T14:32:01-07:00",
                        "legEndTime": "2019-04-03T14:33:07-07:00",
                        "caption": "156th Avenue Northeast",
                        "lengthInMeters": 63
                    },
                    {
                        "legType": "Wait",
                        "legStartTime": "2019-04-03T14:33:07-07:00",
                        "legEndTime": "2019-04-03T14:38:00-07:00",
                        "caption": "545"
                    },
                    {
                        "legType": "Bus",
                        "legStartTime": "2019-04-03T14:38:00-07:00",
                        "legEndTime": "2019-04-03T14:59:47-07:00",
                        "caption": "545",
                        "lengthInMeters": 16441
                    },
                    {
                        "legType": "Walk",
                        "legStartTime": "2019-04-03T14:59:48-07:00",
                        "legEndTime": "2019-04-03T15:03:53-07:00",
                        "caption": "Denny Way",
                        "lengthInMeters": 308
                    },
                    {
                        "legType": "Wait",
                        "legStartTime": "2019-04-03T15:03:53-07:00",
                        "legEndTime": "2019-04-03T15:07:26-07:00",
                        "caption": "8"
                    },
                    {
                        "legType": "Bus",
                        "legStartTime": "2019-04-03T15:07:26-07:00",
                        "legEndTime": "2019-04-03T15:12:12-07:00",
                        "caption": "8",
                        "lengthInMeters": 1057
                    },
                    {
                        "legType": "Walk",
                        "legStartTime": "2019-04-03T15:12:13-07:00",
                        "legEndTime": "2019-04-03T15:15:53-07:00",
                        "caption": "47.6205,-122.3493",
                        "lengthInMeters": 268
                    }
                ]
            },
            ...,
            {
                "itineraryId": "302c38dd-6585-4fa1-bf78-44ebbc183e0c---2019040384C30774B4B94F178E7748644A476596:2---522",
                "departureTime": "2019-04-03T14:21:34-07:00",
                "arrivalTime": "2019-04-03T15:19:18-07:00",
                "travelTimeInSeconds": 3464,
                "legs": 10,
                "itinerarySummary": [
                    {
                        "legType": "Walk",
                        "legStartTime": "2019-04-03T14:21:34-07:00",
                        "legEndTime": "2019-04-03T14:28:19-07:00",
                        "caption": "156th Avenue Northeast",
                        "lengthInMeters": 497
                    },
                    {
                        "legType": "Wait",
                        "legStartTime": "2019-04-03T14:28:19-07:00",
                        "legEndTime": "2019-04-03T14:29:20-07:00",
                        "caption": "245"
                    },
                    {
                        "legType": "Bus",
                        "legStartTime": "2019-04-03T14:29:20-07:00",
                        "legEndTime": "2019-04-03T14:32:00-07:00",
                        "caption": "245",
                        "lengthInMeters": 1350
                    },
                    {
                        "legType": "Walk",
                        "legStartTime": "2019-04-03T14:32:01-07:00",
                        "legEndTime": "2019-04-03T14:33:07-07:00",
                        "caption": "156th Avenue Northeast",
                        "lengthInMeters": 63
                    },
                    {
                        "legType": "Wait",
                        "legStartTime": "2019-04-03T14:33:07-07:00",
                        "legEndTime": "2019-04-03T14:38:00-07:00",
                        "caption": "545"
                    },
                    {
                        "legType": "Bus",
                        "legStartTime": "2019-04-03T14:38:00-07:00",
                        "legEndTime": "2019-04-03T15:01:00-07:00",
                        "caption": "545",
                        "lengthInMeters": 17400
                    },
                    {
                        "legType": "Walk",
                        "legStartTime": "2019-04-03T15:01:01-07:00",
                        "legEndTime": "2019-04-03T15:04:59-07:00",
                        "caption": "3rd Avenue",
                        "lengthInMeters": 269
                    },
                    {
                        "legType": "Wait",
                        "legStartTime": "2019-04-03T15:04:59-07:00",
                        "legEndTime": "2019-04-03T15:09:14-07:00",
                        "caption": "33"
                    },
                    {
                        "legType": "Bus",
                        "legStartTime": "2019-04-03T15:09:14-07:00",
                        "legEndTime": "2019-04-03T15:12:52-07:00",
                        "caption": "33,24",
                        "lengthInMeters": 947
                    },
                    {
                        "legType": "Walk",
                        "legStartTime": "2019-04-03T15:12:53-07:00",
                        "legEndTime": "2019-04-03T15:19:18-07:00",
                        "caption": "47.6205,-122.3493",
                        "lengthInMeters": 474
                    }
                ]
            }
        ]
    }
    ```

    If you observe carefully, there are multiple **bus** routes in the response.