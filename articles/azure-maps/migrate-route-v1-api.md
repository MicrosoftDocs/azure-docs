---
title: Migrate Azure Maps Route service version 1.0 to Azure Maps Routing service version 2025-01-01.
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Azure Maps Route service version 1.0 to Azure Maps Route service version 2025-01-01.
author: farazgis
ms.author: fsiddiqui
ms.date: 03/18/2025
ms.topic: how-to
ms.service: azure-maps
ms.subservice: rest-api
---

# Migrate Azure Maps Route 1.0 APIs

This article explains how to migrate the [Azure Maps Route v1.0] APIs to [Azure Maps Route v2025-01-01] APIs. The following table shows the Route v1.0 APIs and the migration options.

| Azure Maps Route v1.0    | Azure Maps Route v2025-01-01 migration options  |
|--------------------------|-------------------------------------------------|
| [Get Route Directions]   | [Post Route Directions][Post Route Directions 2025-01-01]: Get Route Directions is no longer supported.|
| [Get Route Directions Batch] | Route Directions async batch is currently unavailable. Instead use [Post Route Directions Batch][Post Route Directions Batch 2025-01-01].|
| [Post Route Directions]  | [Post Route Directions][Post Route Directions 2025-01-01]   |
| [Post Route Directions Batch] | [Post Route Directions Batch][Post Route Directions Batch 2025-01-01]: Route Directions async batch is currently unavailable, instead use sync batch. |
| [Post Route Directions Batch Sync]  | [Post Route Directions Batch][Post Route Directions Batch 2025-01-01]  |
| [Get Route Matrix]       | [Get Route Operation Result]: Use to get result of Route Matrix async calls.<BR>[Get Route Operations Status]: Use to get status of Route Matrix async calls. |
| [Post Route Matrix]      | [Post Route Matrix Async]  |
| [Post Route Matrix Sync] | [Post Route Matrix][Post Route Matrix 2025-01-01]  |
| [Get Route Range]        | [Post Route Range]: The `GET` request is no longer supported. |

## Notable differences

### Route Directions notable differences

| Feature                    | v1.0           | v2025-01-01                                       |
|----------------------------|----------------|---------------------------------------------------|
| Batch operations           | Sync and async requests | Sync requests                            |
| Coordinate format          | Latitude/longitude | Longitude/latitude, as defined by [GeoJSON].  |
| Electric consumption model | Supported      | Not supported                                     |
| Localization               | Use the "language" parameter to localize the language of the route instructions. | Use the “Accept-Language” request header to input a localization code to localize the language of the route instructions. |
| Request type               | GET, POST      | POST                                              |
| Response format            | XML, JSON      | GeoJSON                                           |
| Travel mode                | Car, truck, pedestrian.<BR>Beta profiles: Bus, bicycle, motorcycle, taxi, van. | Car, truck, pedestrian. |
| Waypoint Optimization      | Supported      | Currently only supported for truck routing.       |
| Waypoints                  | Supported      | Supported. Also supports `viaWaypoints` for driving and walking modes. |

### Route Matrix notable differences

| Feature                      | v1.0                 | v2025-01-01                                  |
|------------------------------|----------------------|----------------------------------------------|
| Coordinate format            | Longitude/latitude   | Longitude/latitude                           |
| Electric consumption model   | Supported            | Not supported                                |
| Input coordinates            | Uses GeoJSON MultiPoint features for input coordinates, but the request is in JSON. | A valid [GeoJSON MultiPoint geometry type].|
| Matrix: Asynchronous requests| Up to 700 cells      | Up to 50,000 cells                           |
| Matrix: Synchronous requests | Up to 100 cells      | Up to 2,500 cells                            |
| Response format              | JSON                 | GeoJSON (input and response)                 |
| Travel mode                  | Car, truck, pedestrian.<BR>Beta profiles: Bus, bicycle, motorcycle, taxi, van. | Car, truck, pedestrian. |

### Route Range notable differences

| Feature           | v1.0      | v2025-01-01                                               |
|-------------------|-----------|-----------------------------------------------------------|
| Coordinate format | Latitude/Longitude | Longitude/latitude, as defined by [GeoJSON].     |
| Electric consumption model | Supported | Not Supported                                    |
| Request type      | GET, POST | POST                                                      |
| Response format   | XML, JSON | GeoJSON (input and response)                              |
| Travel modes      | Car, Truck.<BR>Beta profiles: bus, motorcycle, taxi, van | Car, Truck |

## Transactions usage

For information on how transactions are calculated, see [Understanding Azure Maps Transactions].

## Route service examples

This section provides example requests and responses for both version 1.0 and 2025-01-01 for the [Route Direction](#route-directions-examples), [Route Matrix](#route-matrix-examples) and [Route Range](#route-range-examples) API.

### Route Directions examples

#### Route Directions version 1.0 example request

The [Route Directions][Get Route Directions] API in version 1.0 is an HTTP `GET` request. All parameters are passed as query string parameters.

```http
https://atlas.microsoft.com/route/directions/json?api-version=1.0&query=52.50931,13.42936:52.50895,13.42904&subscription-key={Your-Azure-Maps-Subscription-key}
```

#### Route Directions version 2025-01-01 example request

The [Route Directions][Post Route Directions 2025-01-01] API in version 2025-01-01 is an HTTP `POST` request. Parameters can be included in the API call as query string parameters, with more parameters provided in the request body using GeoJSON format.

```http
https://atlas.microsoft.com/route/directions/json?api-version=2025-01-01&subscription-key={Your-Azure-Maps-Subscription-key}
```

Parameters included in the body of the HTTP `POST` request are provided as GeoJSON.

```json
{ 
  "type": "FeatureCollection", 
  "features": [ 
    { 
      "type": "Feature", 
      "geometry": { 
        "coordinates": [ 
        13.42936,52.50931 
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
         13.42904,52.50895 
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

#### Route Directions version 1.0 response example

<!--  What are the differences in the responses between v1/v2025-01-01?   -->

```json
{ 
  "formatVersion": "0.0.12", 
  "routes": [ 
    { 
      "summary": { 
        "lengthInMeters": 46, 
        "travelTimeInSeconds": 4, 
        "trafficDelayInSeconds": 0, 
        "trafficLengthInMeters": 0, 
        "departureTime": "2025-02-19T05:40:44+01:00", 
        "arrivalTime": "2025-02-19T05:40:47+01:00" 
      }, 
      "legs": [ 
        { 
          "summary": { 
            "lengthInMeters": 46, 
            "travelTimeInSeconds": 4, 
            "trafficDelayInSeconds": 0, 
            "trafficLengthInMeters": 0, 
            "departureTime": "2025-02-19T05:40:44+01:00", 
            "arrivalTime": "2025-02-19T05:40:47+01:00" 
          }, 
          "points": [ 
            { 
              "latitude": 52.50931, 
              "longitude": 13.42937 
            }, 
            { 
              "latitude": 52.50904, 
              "longitude": 13.42913 
            }, 
            { 
              "latitude": 52.50895, 
              "longitude": 13.42904 
            } 
          ]
        } 
      ], 
      "sections": [ 
        { 
          "startPointIndex": 0, 
          "endPointIndex": 2, 
          "sectionType": "TRAVEL_MODE", 
          "travelMode": "car" 
        } 
      ] 
    } 
  ] 
} 
```

#### Route Directions version 2025-01-01 response example

<!--  What are the differences in the responses between v1/v2025-01-01?   -->

```json
{ 
  "type": "FeatureCollection", 
  "features": [ 
    { 
      "type": "Feature", 
      "geometry": { 
        "type": "Point", 
        "coordinates": [ 
          13.429368, 
          52.509303 
        ] 
      }, 
      "properties": { 
        "routePathPoint": { 
          "legIndex": 0, 
          "pointIndex": 0 
        }, 
        "order": { 
          "inputIndex": 0 
        }, 
        "type": "Waypoint" 
      } 
    }, 
    { 
      "type": "Feature", 
      "geometry": { 
        "type": "Point", 
        "coordinates": [ 
          13.429045, 
          52.50895 
        ] 
      }, 
      "properties": { 
        "routePathPoint": { 
          "legIndex": 0, 
          "pointIndex": 3 
        }, 
        "order": { 
          "inputIndex": 1 
        }, 
        "type": "Waypoint" 
      } 
    }, 
    { 
      "type": "Feature", 
      "geometry": { 
        "type": "MultiLineString", 
        "coordinates": [ 
          [ 
            [ 
              13.429368, 
              52.509302 
            ], 
            [ 
              13.429225, 
              52.509145 
            ], 
            [ 
              13.429128, 
              52.509038 
            ], 
            [ 
              13.429044, 
              52.50895 
            ] 
          ] 
        ], 
        "bbox": [ 
          13.429044, 
          52.50895, 
          13.429368, 
          52.509302 
        ] 
      }, 
      "properties": { 
        "resourceId": "v70,h822083589,i0,a0,cen-US,dAAAAAAAAAAA1,y0,s1,m1,o1,t0,wTMPwETFBSkDPa-wS1dsqQA2~~~~~~~~~~v12,wTKYKRiVBSkAIWoEhq9sqQA2~~~~~~~~~~v12,k1,qatt:1", 
        "trafficCongestion": "Heavy", 
        "trafficDataUsed": "None", 
        "distanceInMeters": 44, 
        "durationInSeconds": 3, 
        "departureAt": "2025-02-19T05:41:07+00:00", 
        "arrivalAt": "2025-02-19T05:41:10+00:00", 
        "type": "RoutePath", 
        "legs": [ 
          { 
            "distanceInMeters": 44, 
            "durationInSeconds": 3, 
            "departureAt": "2025-02-19T05:41:07+00:00", 
            "arrivalAt": "2025-02-19T05:41:10+00:00", 
            "routePathRange": { 
              "legIndex": 0, 
              "range": [ 
                0, 
                3 
              ] 
            }, 
            "description": "An der Schillingbrücke" 
          } 
        ] 
      } 
    } 
  ] 
} 
```

<!----------------------------------------------------------------------------------------------->
### Route Matrix examples

#### Route Matrix version 1.0 example request

The [Post Route Matrix Sync] API in version 1.0 is an HTTP `POST` request. Parameters can be passed as query string parameters and in the body of the request using the GeoJSON format.

```http
https://atlas.microsoft.com/route/matrix/sync/json?api-version=1.0&travelMode=car&subscription-key={Your-Azure-Maps-Subscription-key}
```

Parameters included in the body of the HTTP `POST` request are provided as JSON.

```json
{ 
  "origins": { 
    "type": "MultiPoint", 
    "coordinates": [ 
      [ 
        4.85106,
        52.36006 
      ], 
      [ 
        4.85056, 
        52.36187 
      ] 
    ] 
  }, 
  "destinations": { 
    "type": "MultiPoint", 
    "coordinates": [ 
      [ 
        4.85003, 
        52.36241 
      ] 
    ] 
  } 
} 
```

#### Route Matrix version 2025-01-01 example request

The [Route Matrix][Post Route Matrix 2025-01-01] API in version 2025-01-01 is an HTTP `POST` request. Parameters are passed as query string parameters and in the body of the request using the GeoJSON format.

```http
https://atlas.microsoft.com/route/matrix/json?api-version=2025-01-01&subscription-key={Your-Azure-Maps-Subscription-key}
```

Parameters included in the body of the HTTP `POST` request are provided as GeoJSON.

```json
{ 
  "type": "FeatureCollection", 
  "features": [ 
    { 
      "type": "Feature", 
      "geometry": { 
        "type": "MultiPoint", 
        "coordinates": [ 
          [ 
            4.85106, 
            52.36006 
          ], 
          [ 
            4.85056, 
            52.36187 
          ] 
        ] 
      }, 
      "properties": { 
        "pointType": "origins" 
      } 
    }, 
    { 
      "type": "Feature", 
      "geometry": { 
        "type": "MultiPoint", 
        "coordinates": [ 
          [ 
            4.85003, 
            52.36241 
          ] 
        ] 
      }, 
      "properties": { 
        "pointType": "destinations" 
      } 
    } 
  ], 
  "travelmode":"driving" 
} 
```

#### Route Matrix version 1.0 response example

<!--  What are the differences in the responses between v1/v2025-01-01?   -->

```json
{ 
  "formatVersion": "0.0.1", 
  "matrix": [ 
    [ 
      { 
        "statusCode": 200, 
        "response": { 
          "routeSummary": { 
            "lengthInMeters": 494, 
            "travelTimeInSeconds": 124, 
            "trafficDelayInSeconds": 0, 
            "trafficLengthInMeters": 0, 
            "departureTime": "2025-02-19T06:30:23+01:00", 
            "arrivalTime": "2025-02-19T06:32:27+01:00" 
          } 
        } 
      } 
    ], 
    [ 
      { 
        "statusCode": 200, 
        "response": { 
          "routeSummary": { 
            "lengthInMeters": 337, 
            "travelTimeInSeconds": 106, 
            "trafficDelayInSeconds": 0, 
            "trafficLengthInMeters": 0, 
            "departureTime": "2025-02-19T06:30:23+01:00", 
            "arrivalTime": "2025-02-19T06:32:08+01:00" 
          } 
        } 
      } 
    ] 
  ], 
  "summary": { 
    "successfulRoutes": 2, 
    "totalRoutes": 2 
  } 
} 
```

#### Route Matrix version 2025-01-01 response example

<!--  What are the differences in the responses between v1/v2025-01-01?   -->

```json
{ 
  "type": "Feature", 
  "geometry": null, 
  "properties": { 
    "summary": { 
      "totalCount": 2, 
      "successfulCount": 2 
    }, 
    "matrix": [ 
      { 
        "statusCode": 200, 
        "originIndex": 0, 
        "destinationIndex": 0, 
        "durationTrafficInSeconds": 129, 
        "durationInSeconds": 129, 
        "distanceInMeters": 494 
      }, 
      { 
        "statusCode": 200, 
        "originIndex": 1, 
        "destinationIndex": 0, 
        "durationTrafficInSeconds": 110, 
        "durationInSeconds": 110, 
        "distanceInMeters": 338 
      } 
    ] 
  } 
} 
```

<!----------------------------------------------------------------------------------------------->

### Route Range examples

#### Route Range version 1.0 example request

The [Route Range][Get Route Range] API in version 1.0 is an HTTP `GET` request. All parameters are passed as query string parameters.

```http
https://atlas.microsoft.com/route/range/json?api-version=1.0&query=50.97452,5.86605&travelmode=car&distanceBudgetInMeters=15&subscription-key={Your-Azure-Maps-Subscription-key}
```

#### Route Range version 2025-01-01 example request

The [Route Range][Post Route Range] API in version 2025-01-01 is an HTTP `POST` request. Parameters can be included in the API call as query string parameters, with more parameters provided in the request body using GeoJSON format.

```http
https://atlas.microsoft.com/route/range?api-version=2025-01-01&subscription-key={Your-Azure-Maps-Subscription-key}
```

Parameters included in the body of the HTTP `POST` request are provided as GeoJSON.

```json
{ 
    "type": "Feature", 
    "geometry": { 
        "type": "Point", 
        "coordinates": [ 
            5.86605,50.97452 
        ] 
    }, 
    "properties": { 
        "distanceBudgetInMeters": 15, 
        "travelMode": "driving" 
    } 
} 
```

#### Route Range version 1.0 response example

Response results are truncated for brevity.

```json
{ 
  "formatVersion": "0.0.1", 
  "reachableRange": { 
    "center": { 
      "latitude": 50.97452, 
      "longitude": 5.86605 
    }, 
    "boundary": [ 
      { 
        "latitude": 50.97452, 
        "longitude": 5.86605
      }, 
      { 
        "latitude": 50.97452, 
        "longitude": 5.86605 
      }, 
      { 
        "latitude": 50.97452, 
        "longitude": 5.86605 
      }, 
      { 
        "latitude": 50.97452, 
        "longitude": 5.86605 
      } 
    ] 
  } 
} 
```

#### Route Range version 2025-01-01 response example

Response results are truncated for brevity.

```json
{ 
  "type": "FeatureCollection", 
  "features": [ 
    { 
      "type": "Feature", 
      "geometry": { 
        "type": "Point", 
        "coordinates": [ 
          5.86605, 
          50.97452 
        ] 
      }, 
      "properties": { 
        "type": "center" 
      } 
    }, 
    { 
      "type": "Feature", 
      "geometry": { 
        "type": "Polygon", 
        "coordinates": [ 
          [ 
            [ 
              5.86605,50.97452 
            ], 
            [ 
              5.8659, 50.97454 
            ], 
            [ 
              5.86584, 50.9745 
            ], 
            [ 
              5.86588, 50.97448 
            ] 
          ] 
        ], 
        "bbox": [ 
          5.86584, 
          50.97447, 
          5.86626, 
          50.97454 
        ] 
      }, 
      "properties": { 
        "type": "boundary" 
      } 
    } 
  ] 
} 
```

<!------------------- Links to Route v1 API  ----------------------------------------------------->
[Azure Maps Route v1.0]: /rest/api/maps/route?view=rest-maps-1.0
[Get Route Directions Batch]: /rest/api/maps/route/get-route-directions-batch?view=rest-maps-1.0
[Get Route Directions]: /rest/api/maps/route/get-route-directions?view=rest-maps-1.0
[Get Route Matrix]: /rest/api/maps/route/get-route-matrix?view=rest-maps-1.0
[Get Route Range]: /rest/api/maps/route/get-route-range?view=rest-maps-1.0
[Post Route Directions Batch Sync]: /rest/api/maps/route/post-route-directions-batch-sync?view=rest-maps-1.0
[Post Route Directions Batch]: /rest/api/maps/route/post-route-directions-batch?view=rest-maps-1.0
[Post Route Directions]: /rest/api/maps/route/post-route-directions?view=rest-maps-1.0
[Post Route Matrix Sync]: /rest/api/maps/route/post-route-matrix-sync?view=rest-maps-1.0
[Post Route Matrix]: /rest/api/maps/route/post-route-matrix?view=rest-maps-1.0

<!------------------- Links to Route v2025-01-01 API  ----------------------------------------------------->
[Azure Maps Route v2025-01-01]: /rest/api/maps/route
[Get Route Operation Result]: /rest/api/maps/route/get-route-operations-result
[Get Route Operations Status]: /rest/api/maps/route/get-route-operations-status
[Post Route Directions Batch 2025-01-01]: /rest/api/maps/route/post-route-directions-batch
[Post Route Directions 2025-01-01]: /rest/api/maps/route/post-route-directions
[Post Route Matrix Async]: /rest/api/maps/route/post-route-matrix-async
[Post Route Matrix 2025-01-01]: /rest/api/maps/route/post-route-matrix
[Post Route Range]: /rest/api/maps/route/post-route-range

<!-------------------------------------------------------->

<!--[electric consumption model]: /azure/azure-maps/consumption-model#electric-consumption-model-->
[GeoJSON]: https://geojson.org
[GeoJSON MultiPoint geometry type]: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.3
[Understanding Azure Maps Transactions]: /azure/azure-maps/understanding-azure-maps-transactions
