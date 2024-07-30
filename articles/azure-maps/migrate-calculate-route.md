---
title: Migrate Bing Maps Calculate a Route API to Azure Maps Route Directions API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Bing Maps Calculate a Route API to the Azure Maps Route Directions API.
author: FarazGIS
ms.author: fsiddiqui 
ms.date: 05/16/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Migrate Bing Maps Calculate a Route API

This article explains how to migrate the Bing Maps [Calculate a Route] API to the Azure Maps [Route Directions] API. Azure Maps Route Directions is an API that returns the ideal route between an origin and destination for automobile (driving), commercial trucks, and walking routes. The route considers factors such as current traffic and the typical road speeds on the requested day of the week and time of day.

## Prerequisites

- An [Azure Account]
- An [Azure Maps account]
- A [subscription key] or other form of [Authentication with Azure Maps]

## Notable differences

- Bing Maps Calculate a Route API supports a GET request. Azure Maps Route Directions API supports a POST request.
- Bing Maps Calculate a Route API supports XML and JSON response format. Azure Maps Route Directions API supports [GeoJSON] format.
- Bing Maps Calculate a Route API requires waypoints and viaWaypoints to be in latitude/longitude format, whereas, Azure Maps requires them to be in longitude/latitude format, as defined in the GeoJSON format.  
- Bing Maps Calculate a Route API supports waypoints and viaWaypoints as points, landmarks, or addresses. Azure Maps Route Directions API supports points only. To convert a landmark or address to a point, you can use the Azure Maps [Get Geocoding] API.
- Bing Maps Calculate a Route API supports transit routing. Azure Maps Route Directions API doesn't.
- Unlike Bing Maps for Enterprise, Azure Maps is a global service that supports specifying a geographic scope, allowing limits to data residency to the European (EU) or United States (US) geographic areas (geos). All requests (including input data) are processed exclusively in the specified geographic area. For more information, see [geographic scope].

## Security and authentication

Bing Maps for Enterprise only supports API key authentication. Azure Maps supports multiple ways to authenticate your API calls, such as a [subscription key](azure-maps-authentication.md#shared-key-authentication), [Microsoft Entra ID], and [Shared Access Signature (SAS) Token]. For more information on security and authentication in Azure Maps, See [Authentication with Azure Maps] and the [Security section] in the Azure Maps Route Directions documentation.

## Request parameters

The following table lists the Bing Maps _Calculate a Route_ request parameters and the Azure Maps equivalent:

| Bing Maps request parameter | Bing Maps request parameter alias  | Azure Maps request parameter | Required in Azure Maps  | Azure Maps data type  | Description|
|-----------------------------------|------------------------------------|------------------------------------|-------------------------|-----------------------|------------|
| avoid       |       | avoid  | False | string   | Here are the Bing Maps Calculate a Route API to Azure Maps Route Directions API avoid equivalents, where supported: <br><br>tolls: tollRoads<br>ferry: ferries<br>borderCrossings: borderCrossings<br>minimizeDrivingSideTurn: Not supported<br><br>minimizeAgainstDrivingSideTurn: Not supported<br>minimizeUTurn: Not supported<br>minimizeTolls: Not supported<br>highways: limitedAccessHighways<br>minimizeHighways: Not supported<br> |
| dateTime    | dt    | departAt  | False | string   | Azure Maps Route Directions API also supports arriveAt parameter that is used to specify the desired date and time of arrival. It can't be used with departAt.|
| distanceBeforeFirstTurn  | dbft  | Not supported | Not supported  | Not supported  |   |
| distanceUnit  | du    | Not required       | Not required  | Not required  | In Azure Maps Route Directions API, the distance unit is meters.   |
| heading     | hd    | heading  | False | integer  |   |
| itineraryGroups  | ig    | Not supported | Not supported  |  |   |
| maxSolutions  | maxSolns | maxRouteCount | False | Integer  |   |
| optimize    | optmz  | optimizeRoute | False | String   | Here are the Bing Maps Calculate a Route API to Azure Maps Route Directions API optimizeRoute equivalents:<br><br>time: fastestWithoutTraffic<br>timeWithTraffic: fastestWithTraffic<br>Azure Maps Route Directions API also supports optimizing routes by distance to return the shortest route by specifying shortest as the ‘optimizeRoute’ input value.   |
| optimizeWaypoints        | optWp  | optimizeWaypointOrder | False | boolean  |   |
| routeAttributes  | ra    | routeOutputOptions  | False | string   | Here are the Bing Maps Calculate a Route API to Azure Maps Route Directions API routeOutputOptions equivalents:<br><br>routePath: routePath<br>regionTravelSummary: regionTravelSummary<br>Azure Maps Route Directions API supports more values like itinerary and routeSummary. See the RouteOutputOption for details.        |
| routePathOutput  | rpo   | routeOutputOptions  | False | string   | Azure Maps Route Directions API supports returning the coordinates for the route path geometry by passing routeOutputOptions=routePath in the request.  |
| timeType    | tt    | Not supported | Not supported  | Not supported  | Azure Maps Route Directions API doesn't support Transit Routing.  |
| tolerances  | tl    | Not supported | Not supported  | Not supported  |   |
| travelMode  |       | travelMode  | False | String   | Here are the Bing Maps Calculate a Route API to Azure Maps Route Directions API travelMode equivalents:<br><br>Driving: driving<br>Walking: walking<br>Transit: Not supported<br>Azure Maps support extra travelMode ‘truck’ for truck routing. |
| viaWaypoint.n  | vwp.n  | features<br>InputWaypointFeaturesItem[] | True       | GeoJSON Point  | waypoint and viaWaypoint are specified as features, which is a required parameter. However, only waypoint is a required pointType and the request can be made without viaWaypoint.<br><br>In Bing Maps Calculate a Route API, viaWaypoint can be a point, landmark, or address, whereas, in Azure Maps Route Directions API, it must be a point. To convert a landmark or address to a point, you can use the Azure Maps Get Geocoding API.<br><br>Bing Maps Calculate a Truck Route API requires viaWaypoints to be in latitude/longitude format, whereas, Azure Maps requires them to be in longitude/latitude format, as defined in the GeoJSON format. |
| waypoint.n  | wp.n  | features  InputWaypointFeaturesItem[]   | True       | GeoJSON Point  | In Bing Maps Calculate a Route API, waypoint can be a point, landmark, or address, whereas, in Azure Maps Route Directions API, it must be a point. To convert a landmark or address to a point, you can use the Azure Maps Get Geocoding API.<br><br>Bing Maps Calculate a Route API requires waypoints to be in latitude/longitude format, whereas, Azure Maps requires them to be in longitude/latitude format, as defined in the GeoJSON format.       |

For more information about the Azure Maps Route Directions API request parameters, see [URI Parameters].

## Request examples

Bing Maps _Calculate a Route_ API request:

``` http
http://dev.virtualearth.net/REST/V1/Routes/driving?wp.0=47.610173,-122.204171&wp.1=47.612440,-122.204171key={Your-Bing-Maps-Key}     
```

Azure Maps _Route Directions_ API POST request:

``` http
https://atlas.microsoft.com/route/directions?api-version=2023-10-01-preview&subscription-key={Your-Azure-Maps-Subscription-key} 
```

Included in the body of the request:

```json
{ 
  "type": "FeatureCollection",` 
  "features": [ 
    { 
      "type": "Feature", 
      "geometry": { 
        "coordinates": [ 
         -122.204171,47.610173 
        ], 
        "type": "Point" 
      }, 
      "properties": { 
        "pointIndex": 0, 
        "pointType": "waypoint" 
      } 
    }, 
    { 
      "type": "Feature", 
      "geometry": { 
        "coordinates": [ 
          -122.204171,47.612440 
        ], 
        "type": "Point" 
      }, 
      "properties": { 
        "pointIndex": 1, 
        "pointType": "waypoint" 
      } 
    } 
  ] 
}
```

## Response fields

The following table lists the fields that can appear in the HTTP response when running the Bing Maps _Calculate a Route_ request and the Azure Maps equivalent:

| Bing Maps Field        | Azure Maps Field          | Description                                                                                        |
|------------------------|---------------------------|----------------------------------------------------------------------------------------------------|
| actualStart            | Point feature object      | Point feature object with type=”waypoint” and inputIndex = 0 defines the routable start location.  |
| actualEnd              | Point feature object      | Point feature object with type=”waypoint” and inputIndex = last defines the routable end location. |
| alternateVias          | alternativeRoutes         | Bing Maps alternateVias identifies the separate routes. In Azure maps, alternate routes are returned as a new feature collection under alternativeRoutes. |
| compassDegrees         | compassDegrees            ||
| compassDirection       | compassDirection          ||
| description            | Not supported             ||
| details                | properties                | The properties of the feature object contain the information of the maneuver. |
| distanceUnit           | Not applicable            | Azure Maps Route Directions API returns the distance in meters. |
| durationUnit           | Not  applicable           | Azure Maps Route Directions API returns the duration in seconds. |
| endPathIndices         | range                     | Azure Maps returns the start and end index covered by a specific leg of a route as a range. |
| endWaypoint            | Not supported             | In Azure Maps Route Directions API response, the endWaypoint can be derived from type=”waypoint” and inputIndex = last index |
| formattedText          | formattedText             ||
| hints                  | Not supported             ||
| hintType               | Not supported             ||
| iconType               | Not supported             | Bing Maps Calculate Route API specifies the icon type to represent the mode of travel in user applications. For example, if a driving route has a partial ferry route, the icon could be used to visually identify the different modes of travel in a route. <br><br>Azure Maps Calculate Route API doesn't support iconType, however the mode of travel can be derived from travelMode property in the response.  |
| instruction            | Instruction               ||
| isRealTimeTransit      | Not supported             ||
| isVia                  | viaWaypoint               | In Azure Maps Route Directions API response, the via waypoint is returned as "type": "ViaWaypoint" |
| locationCodes          | Not supported             ||
| locationIdentifier     | Not supported             ||
| maneuverPoint          | maneuverPoint             | In Azure Maps, type=maneuverPoint for point objects where a maneuver is required.<br><br>In Bing Maps Calculate a Route API maneuverPoint is in latitude/longitude format, whereas, in Azure Maps it is in longitude/latitude format, as defined in the GeoJSON format.                                                                                                                                         |
| maneuverType           | maneuverType              ||
| mode                   | Not supported             ||
| names                  | names                     ||
| realTimeTransitDelay   | Not supported             ||
| roadType               | roadType                  ||
| routePathIndex         | routePathPoint            ||
| routeSubLegs           | subLegs                   ||
| sideOfStreet           | sideOfStreet              ||
| startPathIndices       | range                     | Azure Maps returns the start and end index covered by a specific leg of a route as a range.  |
| startWaypoint          | Not supported             | In Azure Maps Route Directions API response, the startWaypoint can be derived from type=”waypoint” and inputIndex = first index |
| towardsRoadName        | towardsRoadName           ||
| trafficCongestion      | trafficCongestion         ||
| trafficDataUsed        | trafficDataUsed           ||
| travelDistance         | distanceInMeters          ||
| travelDuration         | durationInSeconds         ||
| travelDurationTraffic  | durationTrafficInSeconds  ||
| travelMode             | travelMode                ||

For more information about the Azure Maps Route Directions API response fields, see [Definitions].

### Response examples

The following JSON sample shows what is returned in the body of the HTTP response when executing the Bing Maps _Calculate a Route_ request:

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
                        47.610173, 
                        -122.204193, 
                        47.611674, 
                        -122.203012 
                    ], 
                    "id": "v70,h570425388,i0,a0,cen-US,dAAAAAAAAAAA1,y0,s1,m1,o1,t4,wfPMbJhrOR0Cq8j0jEY1ewA2~AF2UnBAtW6QAAADgAQAAAAAA0~MTAybmQgQXZlIE5F0~~~~~~~~v12,wkWEVb2TOR0Cq8j0jEY1ewA2~AF2UnBAdU6QAAADgAQAAgD8A0~MTAzcmQgQXZlIE5F0~~~~~~~~v12,k1,pZ3NpLXBvaQ2-VHJ1ZQ2,pWC1GRC1GTElHSFQ1-Z3NpLXBvaQ2,p-,p-,p-", 
                    "distanceUnit": "Kilometer", 
                    "durationUnit": "Second", 
                    "routeLegs": [ 
                        { 
                            "actualEnd": { 
                                "type": "Point", 
                                "coordinates": [ 
                                    47.611674, 
                                    -122.203084 
                                ] 
                            }, 
                            "actualStart": { 
                                "type": "Point", 
                                "coordinates": [ 
                                    47.610173, 
                                    -122.20414 
                                ] 
                            }, 
                            "alternateVias": [], 
                            "description": "102nd Ave NE, NE 1st St", 
                            "endTime": "/Date(1713305954789-0700)/", 
                            "itineraryItems": [ 
                                { 
                                    "compassDirection": "north", 
                                    "details": [ 
                                        { 
                                            "compassDegrees": 356, 
                                            "endPathIndices": [ 
                                                1 
                                            ], 
                                            "maneuverType": "DepartStart", 
                                            "mode": "Driving", 
                                            "names": [ 
                                                "102nd Ave NE" 
                                            ], 
                                            "roadType": "Street", 
                                            "startPathIndices": [ 
                                                0 
                                            ] 
                                        } 
                                    ], 
                                    "exit": "", 
                                    "iconType": "Auto", 
                                    "instruction": { 
                                        "formattedText": null, 
                                        "maneuverType": "DepartStart", 
                                        "text": "Head north on 102nd Ave NE toward NE 1st Pl" 
                                    }, 
                                    "isRealTimeTransit": false, 
                                    "maneuverPoint": {
                                        "type": "Point", 
                                        "coordinates": [ 
                                            47.610173, 
                                            -122.20414 
                                        ] 
                                    }, 
                                    "realTimeTransitDelay": 0,
                                    "sideOfStreet": "Unknown", 
                                    "tollZone": "", 
                                    "towardsRoadName": "NE 1st Pl", 
                                    "transitTerminus": "", 
                                    "travelDistance": 0.114, 
                                    "travelDuration": 36, 
                                    "travelMode": "Driving" 
                                }, 
                                { 
                                    "compassDirection": "east", 
                                    "details": [ 
                                        { 
                                            "compassDegrees": 89, 
                                            "endPathIndices": [ 
                                                4 
                                            ], 
                                            "maneuverType": "TurnRight", 
                                            "mode": "Driving", 
                                            "names": [ 
                                                "NE 1st St" 
                                            ], 
                                            "roadType": "Street", 
                                            "startPathIndices": [ 
                                                1 
                                            ] 
                                        } 
                                    ], 
                                    "exit": "", 
                                    "iconType": "Auto", 
                                    "instruction": { 
                                        "formattedText": null, 
                                        "maneuverType": "TurnRight", 
                                        "text": "Turn right onto NE 1st St" 
                                    }, 
                                    "isRealTimeTransit": false, 
                                    "maneuverPoint": {
                                        "type": "Point", 
                                        "coordinates": [ 
                                            47.611206, 
                                            -122.204193 
                                        ] 
                                    }, 
                                    "realTimeTransitDelay": 0, 
                                    "sideOfStreet": "Unknown", 
                                    "tollZone": "", 
                                    "transitTerminus": "", 
                                    "travelDistance": 0.106, 
                                    "travelDuration": 22, 
                                    "travelMode": "Driving"
                                }, 
                                { 
                                    "compassDirection": "northwest", 
                                    "details": [ 
                                        { 
                                            "compassDegrees": 302, 
                                            "endPathIndices": [ 
                                                5 
                                            ], 
                                            "maneuverType": "TurnLeft", 
                                            "mode": "Driving", 
                                            "names": [ 
                                                "103rd Ave NE" 
                                            ], 
                                            "roadType": "Street", 
                                            "startPathIndices": [ 
                                                4 
                                            ] 
                                        } 
                                    ], 
                                    "exit": "", 
                                    "iconType": "Auto", 
                                    "instruction": { 
                                        "formattedText": null, 
                                        "maneuverType": "TurnLeft", 
                                        "text": "Turn left onto 103rd Ave NE" 
                                    }, 
                                    "isRealTimeTransit": false, 
                                    "maneuverPoint": { 
                                        "type": "Point", 
                                        "coordinates": [ 
                                            47.611629, 
                                            -122.203012 
                                        ] 
                                    }, 
                                    "realTimeTransitDelay": 0, 
                                    "sideOfStreet": "Unknown", 
                                    "tollZone": "", 
                                    "transitTerminus": "", 
                                    "travelDistance": 0.007, 
                                    "travelDuration": 21, 
                                    "travelMode": "Driving" 
                                }, 
                                { 
                                    "compassDirection": "northwest", 
                                    "details": [ 
                                        { 
                                            "compassDegrees": 302, 
                                            "endPathIndices": [ 
                                                5 
                                            ], 
                                            "maneuverType": "ArriveFinish", 
                                            "mode": "Driving", 
                                            "names": [ 
                                                "103rd Ave NE" 
                                            ], 
                                            "roadType": "Street", 
                                            "startPathIndices": [ 
                                                5 
                                            ] 
                                        } 
                                    ], 
                                    "exit": "", 
                                    "hints": [ 
                                        { 
                                            "hintType": "PreviousIntersection", 
                                            "text": "The last intersection before your destination is NE 2nd St" 
                                        } 
                                    ], 
                                    "iconType": "Auto", 
                                    "instruction": { 
                                        "formattedText": null, 
                                        "maneuverType": "ArriveFinish", 
                                        "text": "Arrive at 103rd Ave NE" 
                                    }, 
                                    "isRealTimeTransit": false, 
                                    "maneuverPoint": { 
                                        "type": "Point", 
                                        "coordinates": [ 
                                            47.611674, 
                                            -122.203084 
                                        ] 
                                    }, 
                                    "realTimeTransitDelay": 0, 
                                    "sideOfStreet": "Unknown", 
                                    "tollZone": "", 
                                    "transitTerminus": "", 
                                    "travelDistance": 0, 
                                    "travelDuration": 0, 
                                    "travelMode": "Driving" 
                                } 
                            ], 
                            "routeRegion": "WWMX", 
                            "routeSubLegs": [ 
                                { 
                                    "endWaypoint": { 
                                        "type": "Point", 
                                        "coordinates": [ 
                                            47.611674, 
                                            -122.203084 
                                        ], 
                                        "description": "103rd Ave NE", 
                                        "isVia": false, 
                                        "locationIdentifier": "0|93|148|156|16|29|83|164|0|0|0|224|1|0|0|128|63|0|47.611674,-122.203084", 
                                        "routePathIndex": 5 
                                    }, 
                                    "startWaypoint": { 
                                        "type": "Point", 
                                        "coordinates": [ 
                                            47.610173, 
                                            -122.20414 
                                        ], 
                                        "description": "102nd Ave NE", 
                                        "isVia": false, 
                                        "locationIdentifier": "0|93|148|156|16|45|91|164|0|0|0|224|1|0|0|0|0|0|47.610173,-122.20414", 
                                        "routePathIndex": 0 
                                    }, 
                                    "travelDistance": 0.227, 
                                    "travelDuration": 80 
                                } 
                            ], 
                            "startTime": "/Date(1713305874789-0700)/", 
                            "travelDistance": 0.227, 
                            "travelDuration": 80, 
                            "travelMode": "Driving" 
                        } 
                    ], 
                    "trafficCongestion": "None", 
                    "trafficDataUsed": "None", 
                    "travelDistance": 0.227, 
                    "travelDuration": 80, 
                    "travelDurationTraffic": 71, 
                    "travelMode": "Driving" 
                } 
            ] 
        } 
    ], 
    "statusCode": 200, 
    "statusDescription": "OK", 
    "traceId": "47969a89fd7bc08f1a922bf92f4a7541|MWH0032B15|0.0.0.0|MWH0031C9B, Leg0-MWH0031C8C" 
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
                    -122.20414, 
                    47.610173 
                ] 
            }, 
            "properties": { 
                "durationInSeconds": 36, 
                "distanceInMeters": 114.00, 
                "exitIdentifier": "", 
                "signs": [], 
                "instruction": { 
                    "formattedText": "<Action>Head</Action> <CmpsDir>north</CmpsDir> on <RoadName>102nd Ave NE</RoadName> toward <Toward>NE 1st Pl</Toward>", 
                    "maneuverType": "DepartStart", 
                    "text": "Head north on 102nd Ave NE toward NE 1st Pl" 
                }, 
                "towardsRoadName": "NE 1st Pl", 
                "routePathPoint": { 
                    "legIndex": 0, 
                    "pointIndex": 0 
                }, 
                "compassDirection": "north", 
                "travelMode": "driving", 
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
                            "102nd Ave NE" 
                        ], 
                        "compassDegrees": 356.00, 
                        "roadType": "Street" 
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
                    -122.204193, 
                    47.611206 
                ] 
            }, 
            "properties": { 
                "durationInSeconds": 22, 
                "distanceInMeters": 106.00, 
                "exitIdentifier": "", 
                "signs": [], 
                "instruction": { 
                    "formattedText": "<Action>Turn</Action> <TurnDir>right</TurnDir> onto <RoadName>NE 1st St</RoadName>", 
                    "maneuverType": "TurnRight", 
                    "text": "Turn right onto NE 1st St" 
                }, 
                "routePathPoint": { 
                    "legIndex": 0, 
                    "pointIndex": 1 
                }, 
                "compassDirection": "east", 
                "travelMode": "driving", 
                "steps": [ 
                    { 
                        "maneuverType": "TurnRight", 
                        "routePathRange": { 
                            "legIndex": 0, 
                            "range": [ 
                                1, 
                                4 
                            ] 
                        }, 
                        "names": [ 
                            "NE 1st St" 
                        ], 
                        "compassDegrees": 89.00, 
                        "roadType": "Street" 
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
                    -122.203012, 
                    47.611629 
                ] 
            }, 
            "properties": { 
                "durationInSeconds": 21, 
                "distanceInMeters": 7.00, 
                "exitIdentifier": "", 
                "signs": [], 
                "instruction": { 
                    "formattedText": "<Action>Turn</Action> <TurnDir>left</TurnDir> onto <RoadName>103rd Ave NE</RoadName>", 
                    "maneuverType": "TurnLeft", 
                    "text": "Turn left onto 103rd Ave NE" 
                }, 
                "routePathPoint": { 
                    "legIndex": 0, 
                    "pointIndex": 4 
                }, 
                "compassDirection": "northwest", 
                "travelMode": "driving", 
                "steps": [ 
                    { 
                        "maneuverType": "TurnLeft", 
                        "routePathRange": { 
                            "legIndex": 0, 
                            "range": [ 
                                4, 
                                5 
                            ] 
                        }, 
                        "names": [ 
                            "103rd Ave NE" 
                        ], 
                        "compassDegrees": 302.00, 
                        "roadType": "Street" 
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
                    -122.203084, 
                    47.611674 
                ] 
            }, 
            "properties": { 
                "durationInSeconds": 0, 
                "distanceInMeters": 0.00, 
                "exitIdentifier": "", 
                "signs": [], 
                "instruction": { 
                    "formattedText": "<Action>Arrive</Action> at <WaypointName>103rd Ave NE</WaypointName>", 
                    "maneuverType": "ArriveFinish", 
                    "text": "Arrive at 103rd Ave NE" 
                }, 
                "routePathPoint": { 
                    "legIndex": 0, 
                    "pointIndex": 5 
                }, 
                "compassDirection": "northwest", 
                "travelMode": "driving", 
                "steps": [ 
                    { 
                        "maneuverType": "ArriveFinish", 
                        "routePathRange": { 
                            "legIndex": 0, 
                            "range": [ 
                                5, 
                                5 
                            ] 
                        }, 
                        "names": [ 
                            "103rd Ave NE" 
                        ], 
                        "compassDegrees": 302.00, 
                        "roadType": "Street" 
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
                "resourceId": "v70,h570425388,i0,a0,cen-US,dAAAAAAAAAAA1,y0,s1,m1,o1,t0,wfPMbJhrOR0Cq8j0jEY1ewA2~~~~~~~~~~v12,wkWEVb2TOR0Cq8j0jEY1ewA2~~~~~~~~~~v12,k1,qatt:1", 
                "trafficCongestion": "Mild", 
                "trafficDataUsed": "None", 
                "distanceInMeters": 227.00, 
                "durationInSeconds": 80, 
                "departureTime": "2024-04-16T22:22:27+00:00", 
                "arrivalTime": "2024-04-16T22:23:47+00:00", 
                "type": "RoutePath", 
                "legs": [] 
            } 
        } 
    ] 
} 
```

## Transactions usage

Similar to Bing Maps Calculate Route API, Azure Maps Route Direction API logs one billable transaction per API request. For more information on Azure Maps transactions, see [Understanding Azure Maps Transactions].  

## Additional information

- [Post Directions Batch]: Use to send a batch of queries to the Route Directions API in a single synchronous request.

Support

- [Microsoft Q&A Forum]

[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Account]: https://azure.microsoft.com/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Calculate a Route]: /bingmaps/rest-services/routes/calculate-a-route
[Definitions]: /rest/api/maps/route/post-directions#definitions
[geographic scope]: geographic-scope.md
[GeoJSON]: https://geojson.org
[Get Geocoding]: /rest/api/maps/search
[Microsoft Entra ID]: azure-maps-authentication.md#microsoft-entra-authentication
[Microsoft Q&A Forum]: /answers/tags/209/azure-maps
[Post Directions Batch]: /rest/api/maps/route/post-directions-batch
[Route Directions]: /rest/api/maps/route/post-directions
[Security section]: /rest/api/maps/route/get-route-range?#security
[Shared Access Signature (SAS) Token]: azure-maps-authentication.md#shared-access-signature-token-authentication
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md
[URI Parameters]: /rest/api/maps/route/post-directions#uri-parameters
