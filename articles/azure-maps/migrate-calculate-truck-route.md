---
title: Migrate Bing Maps Calculate a Truck Route API to Azure Maps Route Directions API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Bing Maps Calculate a Truck Route API to the Azure Maps Route Directions API.
author: FarazGIS
ms.author: fsiddiqui 
ms.date: 05/16/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Migrate Bing Maps Calculate a Truck Route API

This article explains how to migrate the Bing Maps [Calculate a Truck Route] API to the Azure Maps [Route Directions] API. The Azure Maps Route Directions API returns the ideal route between an origin and destination for automobile (driving), commercial trucks and walking routes, while considering local laws, vehicle dimensions, cargo type, max speed, bridge, and tunnel heights to calculate the truck specific routes and avoid complex maneuvers and difficult roads. To get trucking routing in Azure Maps Route Directions API, specify _truck_ for the `travelMode` input parameter in the request.

## Prerequisites

- An [Azure Account]
- An [Azure Maps account]
- A [subscription key] or other form of [Authentication with Azure Maps]

## Notable differences

- Bing Maps Calculate a Truck Route is a standalone API dedicated to truck routing. Azure Maps Route Directions API provides truck routing support when `travelMode=truck` is specified in the request.
- Bing Maps Calculate a Truck Route API supports GET or POST requests. Azure Maps Route Directions API supports POST requests.
- Bing Maps Calculate a Truck Route API supports XML and JSON response formats. Azure Maps Route Directions API supports the GeoJSON response format.
- Bing Maps Calculate a Truck Route API supports a maximum of 25 waypoints or viaWaypoints per request. Azure Maps Route Directions API supports up to 150 waypoints per request, but doesn’t support viaWaypoints.
- Unlike Bing Maps for Enterprise, Azure Maps is a global service that supports specifying a geographic scope, allowing limits to data residency to the European (EU) or United States (US) geographic areas (geos). All requests (including input data) are processed exclusively in the specified geographic area. For more information, see [geographic scope].

## Security and authentication

Bing Maps for Enterprise only supports API key authentication. Azure Maps supports multiple ways to authenticate your API calls, such as a [subscription key](azure-maps-authentication.md#shared-key-authentication), [Microsoft Entra ID], and [Shared Access Signature (SAS) Token]. For more information on security and authentication in Azure Maps, See [Authentication with Azure Maps] and the [Security section] in the Azure Maps Route Directions documentation.

## Request parameters

The following table lists the Bing Maps _Calculate a Truck Route_ request parameters and the Azure Maps equivalent:

| Bing Maps request parameter | Bing Maps request parameter alias  | Azure Maps request parameter | Required in Azure Maps  | Azure Maps data type  | Description|
|-----------------------------------|------------------------------------|------------------------------------|-------------------------|-----------------------|------------|
| avoid  | | avoid  | False  | string  | Here are the Bing Maps to Azure Maps Route Directions API _avoid_ equivalents, where supported:<br><br>- tolls: tollRoads<br>- ferry: ferries<br>- borderCrossings: borderCrossings<br>- highways: limitedAccessHighways<br>- minimizeDrivingSideTurn: Not supported<br>- minimizeAgainstDrivingSideTurn: Not supported<br>- minimizeUTurn: Not supported <br>- minimizeTolls: Not supported<br>- minimizeHighways: Not supported  |
| borderRestriction  | | Not supported  | Not supported  | Not supported  | In Azure Maps Route Directions API, _avoid=borderCrossings_ can be used to restrict routes from crossing country borders however specifying a region list for border restriction isn't supported.  |
| dateTime | dt  | departAt  | False | string | Azure Maps Route Directions API also supports `arriveAt` parameter that is used to specify the desired date and time of arrival. It can't be used with `departAt`.  |
| dimensionUnit | dims | Not supported  | Not supported  | Not supported  | In Azure Maps Route Directions API, the unit for truck height, width, and length dimensions is meters.  |
| distanceUnit | du  | Not supported  | Not supported  | Not supported  | In Azure Maps Route Directions API, the distance unit is meters.   |
| distanceBeforeFirstTurn | dbft | Not supported  | Not supported  | Not supported  | |
| heading  | hd  | heading  | False | integer | |
| optimize | optmz   | optimizeRoute  | False | string | Here are the Bing Maps Calculate a Truck Route API to Azure Maps Route Directions API `optimizeRoute` equivalents:<br><br>- time: fastestWithoutTraffic <br>- timeWithTraffic: fastestWithTraffic<br><br>Azure Maps Route Directions API also supports optimizing routes by distance to return the shortest route by specifying shortest as the `optimizeRoute` input value.  |
| optimizeWaypoints | optWp   | optimizeWaypointOrder | False | boolean | |
| routeAttributes | ra  | routeOutputOptions   | False | string | Here are the Bing Maps to Azure Maps Route Directions API `routeOutputOptions` equivalents:<br><br>- routePath: routePath<br>- regionTravelSummary: regionTravelSummary<br><br>Azure Maps Route Directions API supports extra values like `itinerary` and `routeSummary`. For more information, see [RouteOutputOption].   |
| tolerances | tl  | Not supported  | Not supported  | Not supported  | |
| viawaypoint.n | vwp.n   | Not supported  | Not supported  | Not supported  | |
| vehicleHeight | height  | height  | False | number | |
| vehicleWidth | width   | width  | False | number | |
| vehicleLength | vl  | length  | False | number | |
| vehicleWeight | weight  | weight  | False | integer | |
| vehicleAxles | axles   | Not supported  | Not supported  | Not supported  | Azure Maps Route Directions API supports weight restrictions per axle that can be specified using the parameter `axleWeight`.  |
| vehicleTrailers | vt  | Not supported  | Not supported  | Not supported  | The trailer length could be added to the length of the vehicle to be considered for restrictions.  |
| vehicleSemi | semi | Not supported  | Not supported  | Not supported  | Semi-trucks generally fall under commercial vehicle category. Azure Maps Route Directions API supports `isVehicleCommercial` property that could be used for Semi-trucks.   |
| vehicleMaxGradient | vmg | Not supported  | Not supported  | Not supported  | |
| vehicleMinTurnRadius | vmtr | Not supported  | Not supported  | Not supported  | |
| vehicleHazardousMaterials  | vhm | loadType  | False | string | Refer to Azure Maps Route Directions API Vehicle Load Types for corresponding US Hazmat classes 1-9, and the generic classification of cargo types to hazardous material in Bing Maps Calculate a Truck Route API.  |
| vehicleHazardousPermits | Vhp | Not supported  | Not supported  | Not supported  | |
| waypoint.n | wp.n | features  InputWaypointFeaturesItem[]  | True | GeoJSON Point  | |
| weightUnit | wu  | Not supported  | Not supported  | Not supported  | In Azure Maps Route Directions API, the weight unit is kilograms (kg). |

For more information about the Azure Maps Route Directions API request parameters, see [URI Parameters].

## Request examples

Bing Maps _Calculate a Truck Route_ API POST request:

``` http
https://dev.virtualearth.net/REST/v1/Routes/Truck?key={Your-Bing-Maps-Key}
```

Included in the body of the request:

```json
{
    "waypoints": [{ 
        "latitude": 47.610133,
        "longitude": -122.201478
    },{ 
        "latitude": 47.610096,
        "longitude": -122.192463
    }],
    "vehicleSpec": {
        "vehicleHazardousMaterials": "Flammable"
    }
}
```

Azure Maps _Route Directions_ API POST request:

``` http
https://atlas.microsoft.com/route/directions?api-version=2023-10-01-preview&subscription-key={Your-Azure-Maps-Subscription-key} 
```

Included in the body of the request:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "coordinates": [
            -122.201478, 47.610133 
        ],
        "type": "Point"
      },
      "properties": {
        "pointIndex": "0",
        "pointType": "waypoint"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "coordinates": [
            -122.192463, 47.610096
        ],
        "type": "Point"
      },
      "properties": {
        "pointIndex": "1",
        "pointType": "waypoint"
      }
    }
  ],
  "RouteOutputOptions": [
      "itinerary"
  ],
  "travelMode": "truck",
  "vehicleSpec": {
    "loadType": [
        "USHazmatClass3",
        "USHazmatClass4"
        ]
    }
}
```

## Response fields

The following table lists the fields that can appear in the HTTP response when running the Bing Maps _Calculate a Truck Route_ request and the Azure Maps equivalent:

| Bing Maps Field        | Azure Maps Field          | Description                                                                                                                         |
|------------------------|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| actualEnd              | Point feature object      | Point feature object with _type=”waypoint”_ and _inputIndex = last_ defines the routable end location.                              |
| actualStart            | Point feature object      | Point feature object with _type=”waypoint”_ and _inputIndex = 0_ defines the routable start location.                               |
| alternateVias          | alternativeRoutes         | Bing Maps `alternateVias` identifies the separate routes. In Azure maps Route Directions API, alternate routes are returned as a new feature collection under `alternativeRoutes`.  |
| compassDegrees         | Not supported             |                                                                                                                                     |
| compassDirection       | Not supported             |                                                                                                                                     |
| description            | Not supported             |                                                                                                                                     |
| details                | properties                | The properties of the feature object contain the information of the maneuver.                                                       |
| distanceUnit           | Not applicable            | Azure Maps Route Directions API returns the distance in meters by default.                                                          |
| durationUnit           | Not  applicable           | Azure Maps Route Directions API returns the duration in seconds.                                                                    |
| endPathIndices         | range                     | Azure Maps Route Directions API returns the start and end index covered by a specific leg of a route as a range.                    |
| endWaypoint            | Not supported             | In Azure Maps Route Directions API response, the end waypoint can be derived from _type=”waypoint”_ and _inputIndex = last_ index   |
| formattedText          | formattedText             |                                                                                                                                     |
| hints                  | Not supported             |                                                                                                                                     |
| hintType               | Not supported             |                                                                                                                                     |
| iconType               | Not supported             |                                                                                                                                     |
| instruction            | instruction               |                                                                                                                                     |
| isRealTimeTransit      | Not supported             |                                                                                                                                     |
| isVia                  | Not supported             | Azure Maps Route Directions API doesn't support viaWaypoint for truck routes.                                                      |
| locationCodes          | Not supported             |                                                                                                                                     |
| locationIdentifier     | Not supported             |                                                                                                                                     |
| maneuverPoint          | maneuverPoint             | In Azure Maps, _type=maneuverPoin_t is for point objects where a maneuver is required.                                              |
| maneuverType           | maneuverType              |                                                                                                                                     |
| mode                   | Not supported             |                                                                                                                                     |
| names                  | names                     |                                                                                                                                     |
| realTimeTransitDelay   | Not supported             |                                                                                                                                     |
| roadType               | Not supported             |                                                                                                                                     |
| routePathIndex         | routePathPoint            |                                                                                                                                     |
| routeSubLegs           | subLegs                   |                                                                                                                                     |
| sideOfStreet           | sideOfStreet              |                                                                                                                                     |
| startPathIndices       | range                     | Azure Maps Route Directions API returns the start and end index covered by a specific leg of a route as a range.                    |
| startWaypoint          | Not supported             | In Azure Maps Route Directions API response, the start waypoint can be derived from _type=”waypoint”_ and _inputIndex = first_ index|
| towardsRoadName        | towardsRoadName           |                                                                                                                                     |
| trafficCongestion      | Not supported             |                                                                                                                                     |
| trafficDataUsed        | trafficDataUsed           |                                                                                                                                     |
| travelDistance         | distanceInMeters          |                                                                                                                                     |
| travelDuration         | durationInSeconds         |                                                                                                                                     |
| travelDurationTraffic  | durationTrafficInSeconds  |                                                                                                                                     |
| travelMode             | travelMode                |

For more information about the Azure Maps Route Directions API response fields, see [Definitions].

### Response examples

The following JSON sample shows what is returned in the body of the HTTP response when executing the Bing Maps _Calculate a Truck Route_ request:

```JSON
{
    "authenticationResultCode": "ValidCredentials",
    "brandLogoUri": "https://dev.virtualearth.net/Branding/logo_powered_by.png",
    "copyright": "Copyright © 2024 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.",
    "resourceSets": [
        {
            "estimatedTotal": 1,
            "resources": [
                {
                    "__type": "Route:http://schemas.microsoft.com/search/local/ws/rest/v1",
                    "bbox": [
                        47.610017,
                        -122.201495,
                        47.610133,
                        -122.192518
                    ],
                    "distanceUnit": "Mile",
                    "durationUnit": "Second",
                    "routeLegs": [
                        {
                            "actualEnd": {
                                "type": "Point",
                                "coordinates": [
                                    47.610052,
                                    -122.192518
                                ]
                            },
                            "actualStart": {
                                "type": "Point",
                                "coordinates": [
                                    47.610109,
                                    -122.201495
                                ]
                            },
                            "alternateVias": [],
                            "description": "Main St",
                            "itineraryItems": [
                                {
                                    "compassDirection": "east",
                                    "details": [
                                        {
                                            "compassDegrees": 91,
                                            "endPathIndices": [
                                                1
                                            ],
                                            "locationCodes": [
                                                "114+10725"
                                            ],
                                            "maneuverType": "DepartStart",
                                            "mode": "Driving",
                                            "names": [
                                                "Main St"
                                            ],
                                            "roadType": "Arterial",
                                            "startPathIndices": [
                                                0
                                            ]
                                        }
                                    ],
                                    "iconType": "Auto",
                                    "instruction": {
                                        "formattedText": "<Action>Head</Action> <CmpsDir>east</CmpsDir> on <RoadName>Main St</RoadName> toward <Toward>105th Ave NE</Toward>",
                                        "maneuverType": "DepartStart",
                                        "text": "Head east on Main St toward 105th Ave NE"
                                    },
                                    "isRealTimeTransit": false,
                                    "maneuverPoint": {
                                        "type": "Point",
                                        "coordinates": [
                                            47.610109,
                                            -122.201495
                                        ]
                                    },
                                    "realTimeTransitDelay": 0,
                                    "sideOfStreet": "Unknown",
                                    "towardsRoadName": "105th Ave NE",
                                    "travelDistance": 0.418804,
                                    "travelDuration": 68,
                                    "travelMode": "Driving"
                                },
                                {
                                    "compassDirection": "east", 
                                    "details": [
                                        {
                                            "compassDegrees": 90,
                                            "endPathIndices": [
                                                1
                                            ],
                                            "locationCodes": [
                                                "114+10725"
                                            ],
                                            "maneuverType": "ArriveFinish",
                                            "mode": "Driving",
                                            "names": [
                                                "Main St"
                                            ],
                                            "roadType": "Arterial",
                                            "startPathIndices": [
                                                1
                                            ]
                                        }
                                    ],
                                    "hints": [
                                        {
                                            "hintType": "PreviousIntersection",
                                            "text": "The last intersection before your destination is 110th Pl SE"
                                        }
                                    ],
                                    "iconType": "Auto",
                                    "instruction": {
                                        "formattedText": "<Action>Arrive</Action> at <WaypointName>Stop: Y, X = 47.610096, -122.192463</WaypointName>",
                                        "maneuverType": "ArriveFinish",
                                        "text": "Arrive at Stop: Y, X = 47.610096, -122.192463"
                                    },
                                    "isRealTimeTransit": false,
                                    "maneuverPoint": {
                                        "type": "Point",
                                        "coordinates": [
                                            47.610052,
                                            -122.192518
                                        ]
                                    },
                                    "realTimeTransitDelay": 0,
                                    "sideOfStreet": "Unknown",
                                    "travelDistance": 0,
                                    "travelDuration": 0,
                                    "travelMode": "Driving"
                                }
                            ],
                            "routeSubLegs": [
                                {
                                    "endWaypoint": {
                                        "type": "Point",
                                        "coordinates": [
                                            47.610052,
                                            -122.192518
                                        ],
                                        "description": "Stop: Y, X = 47.610096, -122.192463",
                                        "isVia": false,
                                        "locationIdentifier": "",
                                        "routePathIndex": 1
                                    },
                                    "startWaypoint": {
                                        "type": "Point",
                                        "coordinates": [
                                            47.610109,
                                            -122.201495
                                        ],
                                        "description": "Stop: Y, X = 47.610133, -122.201478",
                                        "isVia": false,
                                        "locationIdentifier": "",
                                        "routePathIndex": 0
                                    },
                                    "travelDistance": 0.418805,
                                    "travelDuration": 68
                                }
                            ],
                            "travelDistance": 0.418805,
                            "travelDuration": 68,
                            "travelMode": "Truck"
                        }
                    ],
                    "trafficCongestion": "Medium",
                    "trafficDataUsed": "None",
                    "travelDistance": 0.418805,
                    "travelDuration": 68,
                    "travelDurationTraffic": 93,
                    "travelMode": "Truck"
                }
            ]
        }
    ],
    "statusCode": 200,
    "statusDescription": "OK",
    "traceId": "bb78d3da62a71f62683cea8e6653806f|MWH0032BED|0.0.0.0|MWH0031C93,Leg0-MWH0031C91"
}
```

The following JSON sample shows what is returned in the body of the HTTP response when executing an Azure Maps _Get Map Tile_ request:

```JSON
{
    "type": "FeatureCollection",
    "features": [ 
        { 
            "type": "Feature", 
            "geometry": { 
                "type": "Point", 
                "coordinates": [ 
                    -122.2015, 
                    47.61013 
                ] 
            }, 
            "properties": { 
                "durationInSeconds": 0, 
                "distanceInMeters": 3.00, 
                "routePathPoint": { 
                    "legIndex": 0, 
                    "pointIndex": 0
                },
                "travelMode": "truck",
                "instruction": {
                    "formattedText": "Leave from <street>Bellevue Way SE</street>",
                    "maneuverType": "DepartStart",
                    "text": "Leave from Bellevue Way SE"
                },
                "towardsRoadName": "Bellevue Way SE",
                "steps": [
                    {
                        "maneuverType": "DepartStart",
                        "routePathRange": {
                            "legIndex": 0,
                            "range": [
                                0,
                                1
                            ]
                        },
                        "names": [
                            "Bellevue Way SE"
                        ]
                    }
                ],
                "type": "ManeuverPoint"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -122.2015,
                    47.61011
                ]
            },
            "properties": {
                "durationInSeconds": 111,
                "distanceInMeters": 724.00,
                "routePathPoint": {
                    "legIndex": 0,
                    "pointIndex": 1
                },
                "travelMode": "other",
                "instruction": {
                    "formattedText": "Turn left onto <street>Main St</street>",
                    "maneuverType": "TurnLeft",
                    "text": "Turn left onto Main St"
                },
                "towardsRoadName": "Main St",
                "steps": [
                    {
                        "maneuverType": "TurnLeft",
                        "routePathRange": {
                            "legIndex": 0,
                            "range": [
                                1,
                                32
                            ]
                        },
                        "names": [
                            "Main St"
                        ]
                    } 
                ],
                "type": "ManeuverPoint"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -122.19195,
                    47.61005
                ]
            },
            "properties": {
                "durationInSeconds": 14,
                "distanceInMeters": 7.00,
                "routePathPoint": {
                    "legIndex": 0,
                    "pointIndex": 32
                },
                "travelMode": "truck",
                "instruction": {
                    "formattedText": "Turn left",
                    "maneuverType": "TurnLeft",
                    "text": "Turn left"
                },
                "steps": [
                    {
                        "maneuverType": "TurnLeft",
                        "routePathRange": {
                            "legIndex": 0,
                            "range": [
                                32,
                                33
                            ]
                        }
                    }
                ],
                "type": "ManeuverPoint"
            }
        }, 
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -122.19195,
                    47.61011
                ]
            },
            "properties": {
                "durationInSeconds": 0,
                "distanceInMeters": 0.00,
                "routePathPoint": {
                    "legIndex": 0,
                    "pointIndex": 33
                },
                "travelMode": "truck",
                "instruction": {
                    "formattedText": "You have arrived. Your destination is on the left",
                    "maneuverType": "ArriveFinish",
                    "text": "You have arrived. Your destination is on the left"
                },
                "sideOfStreet": "Left",
                "steps": [
                    {
                        "maneuverType": "ArriveFinish",
                        "routePathRange": {
                            "legIndex": 0,
                            "range": [
                                33,
                                33
                            ]
                        }
                    }
                ],
                "type": "ManeuverPoint"
            }
        },
        {
            "type": "Feature", 
            "geometry": {
                "type": "MultiLineString",
                "coordinates": []
            },
            "properties": {
                "resourceId": "/ZlIBcVsx0+/BcpEi208gQ==",
                "trafficDataUsed": "FlowAndClosure",
                "distanceInMeters": 734.00,
                "durationInSeconds": 100,
                "departureTime": "2024-04-08T20:20:25+00:00",
                "arrivalTime": "2024-04-08T20:22:30+00:00",
                "type": "RoutePath",
                "legs": []
            }
        }
    ]
}
```

## Transactions usage

Bing Maps Calculate a Truck Route API logs three billable transactions per API request. Azure Maps Route Directions API logs one billable transaction per API request. For more information on Azure Maps transactions, see [Understanding Azure Maps Transactions].

## Additional information

- [Post Directions Batch]: Use to send a batch of queries to the Route Directions API in a single synchronous request.

Support

- [Microsoft Q&A Forum]

[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Account]: https://azure.microsoft.com/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Calculate a Truck Route]: /bingmaps/rest-services/routes/calculate-a-truck-route
[Definitions]: /rest/api/maps/route/post-directions#definitions
[geographic scope]: geographic-scope.md
[Microsoft Entra ID]: azure-maps-authentication.md#microsoft-entra-authentication
[Microsoft Q&A Forum]: /answers/tags/209/azure-maps
[Post Directions Batch]: /rest/api/maps/route/post-directions-batch
[Route Directions]: /rest/api/maps/route/post-directions
[RouteOutputOption]: /rest/api/maps/route/post-directions#routeoutputoption
[Security section]: /rest/api/maps/route/get-route-range?#security
[Shared Access Signature (SAS) Token]: azure-maps-authentication.md#shared-access-signature-token-authentication
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md
[URI Parameters]: /rest/api/maps/route/post-directions#uri-parameters
