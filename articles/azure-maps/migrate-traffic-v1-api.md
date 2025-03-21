---
title: Migrate Azure Maps Traffic API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Azure Maps Traffic API version 1.0.
author: farazgis
ms.author: fsiddiqui
ms.date: 03/31/2025
ms.topic: how-to
ms.service: azure-maps
ms.subservice: rest-api
---

# Migrate Azure Maps Traffic API

This article explains how to migrate the Azure Maps [Traffic service] to other Azure Maps services.

he table below lists all the Traffic services and the migration options.

| Azure Maps Traffic v1.0 | Azure Maps migration option  |
|-------------------------|------------------------------|
| [Get Traffic Flow Segment] | No direct replacement.<br/>Map tiles can be used to visualize traffic flow, but speed and travel time is not available. |
| [Get Traffic Flow Tile]<br/>- Absolute <br/>- Reduced sensitivity <br/>- Relative <br/>- Relative delay  | [Get Map Tile]<br/>[TilesetID] <br/>- microsoft.traffic.absolute (vector) <br/>- microsoft.traffic.absolute.main (raster) <br/>- microsoft.traffic.relative (vector) <br/>- microsoft.traffic.relative.dark (raster) <br/>- microsoft.traffic.relative.main (raster) <br/>- microsoft.traffic.delay (vector) <br/>- microsoft.traffic.delay.main (raster) <br/>- microsoft.traffic.reduced.main (raster)  |
| [Get Traffic Incident Detail] | Get Traffic Incident (unified API)  |
| [Get Traffic Incident Tile]| [Get Map Tile] <br/>[TilesetID] <br/>- microsoft.traffic.incident (vector)  |
| [Get Traffic Incident Viewport] | No replacement.<br/>Returns traffic model id which is consumed by Traffic v1 services and not required for unified traffic incident or the render service. |

## Notable differences

- The latest Azure Maps [Traffic Incident] API and the Render services' [Get Map Tile] API do not require the traffic model ID unlike the Traffic v1.0 services.

- The [Traffic Incident] v2025-01-01 input bounding box and response are in the GeoJSON format.

- [Traffic Flow Segment][Get Traffic Flow Segment] v1.0 provides information about vehicle speeds and travel times of the road segment. This information is not available in the latest version, but the traffic data can be visualized using the Render [Get Map Tile] API.

- To assign an icon category for the points returned by Traffic Incident v2025-01-01, use the `incidentType` enum in the response.

- Traffic map tiles are available in vector and raster format in the Render service using the [Get Map tile] API.

## Transactions usage

For information on how transactions are calculated for the Traffic Incident and Render services, see [Understanding Azure Maps Transactions].


## Traffic service examples

This section provides example requests and responses for version 2025-01-01 of the Traffic Incident API and version 2024-04-01 the Render Map Tile API.

### Traffic Incident version 2025-01-01 example

Version 2025-01-01 of the Traffic Incident API is and HTTP `GET` request that returns all traffic incidents within the specified bounding box.

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
[Get Traffic Flow Segment]: /rest/api/maps/traffic/get-traffic-flow-segment
[Get Traffic Flow Tile]: /rest/api/maps/traffic/get-traffic-flow-tile#trafficflowtilestyle
[Get Traffic Incident Tile]: /rest/api/maps/traffic/get-traffic-incident-tile
[Get Traffic Incident Viewport]: /rest/api/maps/traffic/get-traffic-incident-viewport
[TilesetID]: /rest/api/maps/render/get-map-tile#tilesetid
[Understanding Azure Maps Transactions]: /azure/azure-maps/understanding-azure-maps-transactions
