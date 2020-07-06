---
title: Azure Maps as Event Grid source
description: Describes the properties and schema provided for Azure Maps events with Azure Event Grid
services: event-grid
author: femila
ms.service: event-grid
ms.topic: conceptual
ms.date: 04/09/2020
ms.author: femila
---

# Azure Maps as an Event Grid source

This article provides the properties and schema for Azure Maps events. For an introduction to event schemas, see [Azure Event Grid event schema](https://docs.microsoft.com/azure/event-grid/event-schema). It also gives you a list of quick starts and tutorials to use Azure Maps as an event source.

## Event Grid event schema

### Available event types

An Azure Maps account emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Maps.GeofenceEntered | Raised when coordinates received have moved from outside of a given geofence to within |
| Microsoft.Maps.GeofenceExited | Raised when coordinates received have moved from within a given geofence to outside |
| Microsoft.Maps.GeofenceResult | Raised every time a geofencing query returns a result, regardless of the state |

### Event examples

The following example shows the schema of a **GeofenceEntered** event

```JSON
{   
   "id":"7f8446e2-1ac7-4234-8425-303726ea3981", 
   "topic":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Maps/accounts/{accountName}", 
   "subject":"/spatial/geofence/udid/{udid}/id/{eventId}", 
   "data":{   
      "geometries":[   
         {   
            "deviceId":"device_1", 
            "udId":"1a13b444-4acf-32ab-ce4e-9ca4af20b169", 
            "geometryId":"2", 
            "distance":-999.0, 
            "nearestLat":47.618786, 
            "nearestLon":-122.132151 
         } 
      ], 
      "expiredGeofenceGeometryId":[   
      ], 
      "invalidPeriodGeofenceGeometryId":[   
      ] 
   }, 
   "eventType":"Microsoft.Maps.GeofenceEntered", 
   "eventTime":"2018-11-08T00:54:17.6408601Z", 
   "metadataVersion":"1", 
   "dataVersion":"1.0" 
}
```

The following example show schema for **GeofenceResult** 

```JSON
{   
   "id":"451675de-a67d-4929-876c-5c2bf0b2c000", 
   "topic":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Maps/accounts/{accountName}", 
   "subject":"/spatial/geofence/udid/{udid}/id/{eventId}", 
   "data":{   
      "geometries":[   
         {   
            "deviceId":"device_1", 
            "udId":"1a13b444-4acf-32ab-ce4e-9ca4af20b169", 
            "geometryId":"1", 
            "distance":999.0, 
            "nearestLat":47.609833, 
            "nearestLon":-122.148274 
         }, 
         {   
            "deviceId":"device_1", 
            "udId":"1a13b444-4acf-32ab-ce4e-9ca4af20b169", 
            "geometryId":"2", 
            "distance":999.0, 
            "nearestLat":47.621954, 
            "nearestLon":-122.131841 
         } 
      ], 
      "expiredGeofenceGeometryId":[   
      ], 
      "invalidPeriodGeofenceGeometryId":[   
      ] 
   }, 
   "eventType":"Microsoft.Maps.GeofenceResult", 
   "eventTime":"2018-11-08T00:52:08.0954283Z", 
   "metadataVersion":"1", 
   "dataVersion":"1.0" 
}
```

### Event properties

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| topic | string | Full resource path to the event source. This field is not writeable. Event Grid provides this value. |
| subject | string | Publisher-defined path to the event subject. |
| eventType | string | One of the registered event types for this event source. |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| id | string | Unique identifier for the event. |
| data | object | Geofencing event data. |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| apiCategory | string | API category of the event. |
| apiName | string | API name of the event. |
| issues | object | Lists issues encountered during processing. If any issues are returned, then there will be no geometries returned with the response. |
| responseCode | number | HTTP response code |
| geometries | object | Lists the fence geometries that contain the coordinate position or overlap the searchBuffer around the position. |

The error object is returned when an error occurs in the Maps API. The error object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| error | ErrorDetails |This object is returned when an error occurs in the Maps API  |

The ErrorDetails object is returned when an error occurs in the Maps API. The ErrorDetails or object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| code | string | The HTTP status code. |
| message | string | If available, a human readable description of the error. |
| innererror | InnerError | If available, an object containing service-specific information about the error. |

The InnerError is an object containing service-specific information about the error. The InnerError object has the following properties: 

| Property | Type | Description |
| -------- | ---- | ----------- |
| code | string | The error message. |

The geometries object, lists geometry IDs of the geofences that have expired relative to the user time in the request. The geometries object has geometry items with the following properties: 

| Property | Type | Description |
|:-------- |:---- |:----------- |
| deviceid | string | ID of device. |
| distance | string | <p>Distance from the coordinate to the closest border of the geofence. Positive means the coordinate is outside of the geofence. If the coordinate is outside of the geofence, but more than the value of searchBuffer away from the closest geofence border, then the value is 999. Negative means the coordinate is inside of the geofence. If the coordinate is inside the polygon, but more than the value of searchBuffer away from the closest geofencing border, then the value is -999. A value of 999 means that there is great confidence the coordinate is well outside the geofence. A value of -999 means that there is great confidence the coordinate is well within the geofence.<p> |
| geometryid |string | The unique id identifies the geofence geometry. |
| nearestlat | number | Latitude of the nearest point of the geometry. |
| nearestlon | number | Longitude of the nearest point of the geometry. |
| udId | string | The unique id returned from user upload service when uploading a geofence. Will not be included in geofencing post API. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| expiredGeofenceGeometryId | string[] | Lists of the geometry ID of the geofence that is expired relative to the user time in the request. |
| geometries | geometries[] |Lists the fence geometries that contain the coordinate position or overlap the searchBuffer around the position. |
| invalidPeriodGeofenceGeometryId | string[]  | Lists of the geometry ID of the geofence that is in invalid period relative to the user time in the request. |
| isEventPublished | boolean | True if at least one event is published to the Azure Maps event subscriber, false if no event is published to the Azure Maps event subscriber. |

## Tutorials and how-tos
|Title  |Description  |
|---------|---------|
| [React to Azure Maps events by using Event Grid](../azure-maps/azure-maps-event-grid-integration.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Overview of integrating Azure Maps with Event Grid. |
| [Tutorial: Set up a geofence](../azure-maps/tutorial-geofence.md?toc=%2fazure%2fevent-grid%2ftoc.json) | This tutorial walks you through the basics steps to set up geofence by using Azure Maps. You use Azure Event Grid to stream the geofence results and set up a notification based on the geofence results. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).