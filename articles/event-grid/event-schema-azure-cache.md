---
title: Azure Cache for Redis as Event Grid source
description: Describes the properties that are provided for Azure Cache for Redis events with Azure Event Grid
ms.topic: conceptual
ms.date: 07/07/2020
---

# Azure Cache for Redis as an Event Grid source

This article provides the properties and schema for Azure Cache for Redis events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). 

## Event Grid event schema

### List of events for Azure Cache for Redis REST APIs

These events are triggered when a client exports, imports, or scales by calling Azure Cache for Redis REST APIs. Patching event is triggered by Redis update.

 |Event name |Description|
 |----------|-----------|
 |**Microsoft.Cache.ExportRDBCompleted** |Triggered when cache data is exported. |
 |**Microsoft.Cache.ImportRDBCompleted** |Triggered when cache data is imported. |
 |**Microsoft.Cache.PatchingCompleted** |Triggered when patching is completed. |
 |**Microsoft.Cache.ScalingCompleted** |Triggered when scaling is completed. |

<a name="example-event"></a>
### The contents of an event response

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoint.

This section contains an example of what that data would look like for each Azure Cache for Redis event.

### Microsoft.Cache.ScalingCompleted event

```json
[{
"id":"9b87886d-21a5-4af5-8e3e-10c4b8dac73b",
"eventType":"Microsoft.Cache.ScalingCompleted",
"topic":"/subscriptions/{subscription-id}/resourceGroups/RedisStressTests/providers/Microsoft.Cache/Redis/test-mcr",
"data":{
    "name":"ScalingCompleted",
    "timestamp":"2020-12-09T21:50:19.9995668+00:00",
    "status":"Succeeded"},
"subject":"ScalingCompleted",
"dataversion":"1.0",
"metadataVersion":"1",
"eventTime":"2020-12-09T21:50:19.9995668+00:00"}]
```

### Microsoft.Cache.ImportRDBCompleted event

```json
[{
"id":"9b87886d-21a5-4af5-8e3e-10c4b8dac73b",
"eventType":"Microsoft.Cache.ImportRDBCompleted",
"topic":"/subscriptions/{subscription-id}/resourceGroups/RedisStressTests/providers/Microsoft.Cache/Redis/test-mcr",
"data":{
    "name":"ImportRDBCompleted",
    "timestamp":"2020-12-09T21:50:19.9995668+00:00",
    "status":"Succeeded"},
"subject":"ImportRDBCompleted",
"dataversion":"1.0",
"metadataVersion":"1",
"eventTime":"2020-12-09T21:50:19.9995668+00:00"}]
```

### Microsoft.Cache.ExportRDBCompleted event

```json
[{
"id":"9b87886d-21a5-4af5-8e3e-10c4b8dac73b",
"eventType":"Microsoft.Cache.ExportRDBCompleted",
"topic":"/subscriptions/{subscription-id}/resourceGroups/RedisStressTests/providers/Microsoft.Cache/Redis/test-mcr",
"data":{
    "name":"ExportRDBCompleted",
    "timestamp":"2020-12-09T21:50:19.9995668+00:00",
    "status":"Succeeded"},
"subject":"ExportRDBCompleted",
"dataversion":"1.0",
"metadataVersion":"1",
"eventTime":"2020-12-09T21:50:19.9995668+00:00"}]
```

### Microsoft.Cache.ScalingCompleted

```json
[{
"id":"9b87886d-21a5-4af5-8e3e-10c4b8dac73b",
"eventType":"Microsoft.Cache.ScalingCompleted",
"topic":"/subscriptions/{subscription-id}/resourceGroups/RedisStressTests/providers/Microsoft.Cache/Redis/test-mcr",
"data":{
    "name":"ScalingCompleted",
    "timestamp":"2020-12-09T21:50:19.9995668+00:00",
    "status":"Succeeded"},
"subject":"ScalingCompleted",
"dataversion":"1.0",
"metadataVersion":"1",
"eventTime":"2020-12-09T21:50:19.9995668+00:00"}]
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
| data | object | Azure Cache for Redis event data. |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| timestamp | string | The time at which the event occurred. |
| name | string | The name of the event. |
| status | string | The status of the event. Failed or succeeded. |


## Tutorials and how-tos

|Title  |Description  |
|---------|---------|
| [Quickstart: route Azure Cache for Redis events to a custom web endpoint with Azure CLI]() | Shows how to use Azure CLI to send Azure Cache for Redis events to a WebHook. |
| [Azure Cache for Redis Event Grid Overview](../../azure-cache-for-redis/cache-event-grid.md) | Overview of integrating Azure Cache for Redis with Event Grid. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).

