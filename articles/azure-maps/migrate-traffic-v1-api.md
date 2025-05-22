---
title: Migrate Azure Maps Traffic API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Azure Maps Traffic API version 1.0.
author: farazgis
ms.author: fsiddiqui
ms.date: 03/28/2025
ms.topic: how-to
ms.service: azure-maps
ms.subservice: rest-api
---

# Migrate Azure Maps Traffic 1.0 APIs

This article provides guidance on migrating the Azure Maps [Traffic v1 service] to other Azure Maps services.

The following table outlines all Traffic service along with their respective migration options.

| Azure Maps Traffic v1.0 | Azure Maps migration option  |
|-------------------------|------------------------------|
| [Get Traffic Flow Segment] | No direct replacement.<br/>Map tiles can be used to visualize traffic flow, but speed and travel time isn't available. |
| [Get Traffic Flow Tile]<br/>- Absolute <br/>- Reduced sensitivity <br/>- Relative <br/>- Relative delay  | [Get Map Tile]<br/>[TilesetID] <br/>- microsoft.traffic.absolute (vector) <br/>- microsoft.traffic.absolute.main (raster) <br/>- microsoft.traffic.relative (vector) <br/>- microsoft.traffic.relative.dark (raster) <br/>- microsoft.traffic.relative.main (raster) <br/>- microsoft.traffic.delay (vector) <br/>- microsoft.traffic.delay.main (raster) <br/>- microsoft.traffic.reduced.main (raster)  |
| [Get Traffic Incident Detail] | [Get Traffic Incident]  |
| [Get Traffic Incident Tile]| [Get Map Tile] <br/>[TilesetID] <br/>- microsoft.traffic.incident (vector)  |
| [Get Traffic Incident Viewport] | No replacement.<br/>Returns the traffic model ID used by Traffic v1 service, but isn't required for the latest traffic or render services. |

## Notable differences

- Unlike the Traffic v1.0 service, the latest Azure Maps [Get Traffic Incident] API and the Render service [Get Map Tile] API don't require a traffic model ID.

- The [Get Traffic Incident] v2025-01-01 input bounding box and response are in the GeoJSON format.

- [Traffic Flow Segment][Get Traffic Flow Segment] v1.0 provides information about vehicle speeds and travel times of the road segment. This information isn't available in the latest version, but the traffic data can be visualized using the Render [Get Map Tile] API.

- To assign an icon category to the points returned by [Get Traffic Incident] v2025-01-01, use the `incidentType` enum provided in the response.

- Traffic map tiles are available in vector and raster format in the Render service using the [Get Map Tile] API.

## Transactions usage

For information on how transactions are calculated for the Traffic and Render services, see [Understanding Azure Maps Transactions].

## Traffic service examples

This section provides example requests and responses for version 1.0 and 2025-01-01 of the Traffic Incident API and version 2024-04-01 the Render Map Tile API.

### Traffic Incident version 1.0 example

Version 1.0 of the Traffic Incident API is an HTTP `GET` request that returns all traffic incidents within the specified bounding box.

```http
https://atlas.microsoft.com/traffic/incident/detail/json?api-version=1.0&style=s3&boundingbox=37,-105,45,-94&boundingZoom=11&trafficmodelid=1335294634919&projection=EPSG4326&subscription-key={Your-Azure-Maps-Subscription-key}
```

The response contains all traffic incidents within the specified bounding box in JSON format. The results are truncated for brevity.

```json
{
  "tm": {
    "@id": "1742459680",
    "poi": [
      {
        "id": "CLUSTER_80251",
        "p": {
          "x": -105.0012712,
          "y": 39.7117135
        },
        "ic": 8,
        "ty": 0,
        "cbl": {
          "x": -105.0038575,
          "y": 39.7096459
        },
        "ctr": {
          "x": -104.99992,
          "y": 39.7148278
        },
        "cs": 4,
        "l": 1132
      },
      {
        "id": "CLUSTER_80249",
        "p": {
          "x": -105.0070862,
          "y": 39.7491353
        },
        "ic": 13,
        "ty": 0,
        "cbl": {
          "x": -105.0214434,
          "y": 39.7391984
        },
        "ctr": {
          "x": -104.9985481,
          "y": 39.7597951
        },
        "cs": 12,
        "l": 2276
      }
    ]
  }
}
```

### Traffic Incident version 2025-01-01 example

Version 2025-01-01 of the Traffic Incident API is an HTTP `GET` request that returns all traffic incidents within the specified bounding box.

```http
https://atlas.microsoft.com/traffic/incident?api-version=2025-01-01&bbox=-105,37,-94,45&subscription-key={Your-Azure-Maps-Subscription-key}
```

The response contains all traffic incidents within the specified bounding box in GeoJSON format. The following example shows a single traffic incident of type "Accident":

```json
{ 
  "type": "FeatureCollection", 
  "features": [ 
    { 
      "type": "Feature", 
      "id": 18558549332008001, 
      "geometry": { 
        "type": "Point", 
        "coordinates": [ 
          -104.939053, 
          39.682642 
        ] 
      }, 
      "properties": { 
        "startTime": "2025-09-12T09:31:37Z", 
        "endTime": "2025-09-12T10:21:47Z", 
        "description": "At CO 2/Colorado Boulevard (Denver) at Mile Point 204. Two right lanes are closed due to a crash.", 
        "title": "I-25 N / US-87 N", 
        "incidentType": "Accident", 
        "severity": 4, 
        "delay": null, 
        "lastModified": "2025-09-12T10:21:47Z", 
        "endPoint": { 
          "type": "Point", 
          "coordinates": [ 
            -104.940412, 
            39.68307 
          ] 
        }, 
        "isTrafficJam": false, 
        "isRoadClosed": false 
      } 
    } 
] 
} 
```

### Azure Maps Render Get Map Tile v2024-04-01

The Azure Maps Render Get Map Tile API is an HTTP `GET` request that returns relative traffic vector tiles.

#### Example Request

```http
https://atlas.microsoft.com/map/tile?api-version=2024-04-01&tilesetId=microsoft.traffic.relative&zoom=6&x=10&y=22&subscription-key={Your-Azure-Maps-Subscription-key}
```

#### Example Response

Content-Type: application/vnd.mapbox-vector-tile

"binary image string"

[Get Map Tile]: /rest/api/maps/render/get-map-tile
[Get Traffic Flow Segment]: /rest/api/maps/traffic/get-traffic-flow-segment?view=rest-maps-1.0
[Get Traffic Flow Tile]: /rest/api/maps/traffic/get-traffic-flow-tile#trafficflowtilestyle?view=rest-maps-1.0
[Get Traffic Incident Detail]: /rest/api/maps/traffic/get-traffic-incident-detail?view=rest-maps-1.0
[Get Traffic Incident]: /rest/api/maps/traffic/get-traffic-incident
[Get Traffic Incident Tile]: /rest/api/maps/traffic/get-traffic-incident-tile?view=rest-maps-1.0
[Get Traffic Incident Viewport]: /rest/api/maps/traffic/get-traffic-incident-viewport?view=rest-maps-1.0
[TilesetID]: /rest/api/maps/render/get-map-tile#tilesetid
[Traffic v1 service]: /rest/api/maps/traffic?view=rest-maps-1.0
[Understanding Azure Maps Transactions]: /azure/azure-maps/understanding-azure-maps-transactions
