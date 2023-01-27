---
title: Azure Cache for Redis as Event Grid source
description: Describes the properties that are provided for Azure Cache for Redis events with Azure Event Grid
ms.topic: conceptual
ms.date: 12/02/2022
author: curib
ms.author: cauribeg
---

# Azure Cache for Redis as an Event Grid source

This article provides the properties and schema for Azure Cache for Redis events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). 

## Available event types
These events are triggered when a client exports, imports, or scales by calling Azure Cache for Redis REST APIs. Patching event is triggered by Redis update.

 |Event name |Description|
 |----------|-----------|
 |**Microsoft.Cache.ExportRDBCompleted** |Triggered when cache data is exported. |
 |**Microsoft.Cache.ImportRDBCompleted** |Triggered when cache data is imported. |
 |**Microsoft.Cache.PatchingCompleted** |Triggered when patching is completed. |
 |**Microsoft.Cache.ScalingCompleted** |Triggered when scaling is completed. |

## Example event
When an event is triggered, the Event Grid service sends data about that event to subscribing endpoint. This section contains an example of what that data would look like for each Azure Cache for Redis event.

# [Event Grid event schema](#tab/event-grid-event-schema)

### Microsoft.Cache.PatchingCompleted event

```json
[{
"id":"9b87886d-21a5-4af5-8e3e-10c4b8dac73b",
"eventType":"Microsoft.Cache.PatchingCompleted",
"topic":"/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Cache/Redis/{cache_name}",
"data":{
    "name":"PatchingCompleted",
    "timestamp":"2020-12-09T21:50:19.9995668+00:00",
    "status":"Succeeded"},
"subject":"PatchingCompleted",
"dataversion":"1.0",
"metadataVersion":"1",
"eventTime":"2020-12-09T21:50:19.9995668+00:00"}]
```

### Microsoft.Cache.ImportRDBCompleted event

```json
[{
"id":"9b87886d-21a5-4af5-8e3e-10c4b8dac73b",
"eventType":"Microsoft.Cache.ImportRDBCompleted",
"topic":"/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Cache/Redis/{cache_name}",
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
"topic":"/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Cache/Redis/{cache_name}",
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
"topic":"/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Cache/Redis/{cache_name}",
"data":{
    "name":"ScalingCompleted",
    "timestamp":"2020-12-09T21:50:19.9995668+00:00",
    "status":"Succeeded"},
"subject":"ScalingCompleted",
"dataversion":"1.0",
"metadataVersion":"1",
"eventTime":"2020-12-09T21:50:19.9995668+00:00"}]
```

# [Cloud event schema](#tab/cloud-event-schema)


### Microsoft.Cache.PatchingCompleted event

```json
[{
	"id": "9b87886d-21a5-4af5-8e3e-10c4b8dac73b",
	"type": "Microsoft.Cache.PatchingCompleted",
	"source": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Cache/Redis/{cache_name}",
	"data": {
		"name": "PatchingCompleted",
		"timestamp": "2020-12-09T21:50:19.9995668+00:00",
		"status": "Succeeded"
	},
	"subject": "PatchingCompleted",
	"time": "2020-12-09T21:50:19.9995668+00:00",
    "specversion": "1.0"
}]
```

### Microsoft.Cache.ImportRDBCompleted event

```json
[{
	"id": "9b87886d-21a5-4af5-8e3e-10c4b8dac73b",
	"type": "Microsoft.Cache.ImportRDBCompleted",
	"source": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Cache/Redis/{cache_name}",
	"data": {
		"name": "ImportRDBCompleted",
		"timestamp": "2020-12-09T21:50:19.9995668+00:00",
		"status": "Succeeded"
	},
	"subject": "ImportRDBCompleted",
	"eventTime": "2020-12-09T21:50:19.9995668+00:00",
	"specversion": "1.0"
}]
```

### Microsoft.Cache.ExportRDBCompleted event

```json
[{
	"id": "9b87886d-21a5-4af5-8e3e-10c4b8dac73b",
	"type": "Microsoft.Cache.ExportRDBCompleted",
	"source": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Cache/Redis/{cache_name}",
	"data": {
		"name": "ExportRDBCompleted",
		"timestamp": "2020-12-09T21:50:19.9995668+00:00",
		"status": "Succeeded"
	},
	"subject": "ExportRDBCompleted",
	"time": "2020-12-09T21:50:19.9995668+00:00",
	"specversion": "1.0"
}]
```

### Microsoft.Cache.ScalingCompleted

```json
[{
	"id": "9b87886d-21a5-4af5-8e3e-10c4b8dac73b",
	"type": "Microsoft.Cache.ScalingCompleted",
	"source": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Cache/Redis/{cache_name}",
	"data": {
		"name": "ScalingCompleted",
		"timestamp": "2020-12-09T21:50:19.9995668+00:00",
		"status": "Succeeded"
	},
	"subject": "ScalingCompleted",
	"time": "2020-12-09T21:50:19.9995668+00:00",
	"specversion": "1.0"
}]
```

---

## Event properties

# [Event Grid event schema](#tab/event-grid-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `eventType` | string | One of the registered event types for this event source. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | Azure Cache for Redis event data. |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |


# [Cloud event schema](#tab/cloud-event-schema)


An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `source` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `type` | string | One of the registered event types for this event source. |
| `time` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | Azure Cache for Redis event data. |
| `specversion` | string | CloudEvents schema specification version. |

---


The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `timestamp` | string | The time at which the event occurred. |
| `name` | string | The name of the event. |
| `status` | string | The status of the event. Failed or succeeded. |

## Quickstarts

If you want to try Azure Cache for Redis events, see any of these quickstart articles:

|If you want to use this tool:    |See this article: |
|--|-|
|Azure portal    |[Quickstart: Route Azure Cache for Redis events to web endpoint with the Azure portal](../azure-cache-for-redis/cache-event-grid-quickstart-portal.md)|
|PowerShell    |[Quickstart: Route Azure Cache for Redis events to web endpoint with PowerShell](../azure-cache-for-redis/cache-event-grid-quickstart-powershell.md)|
|Azure CLI    |[Quickstart: Route Azure Cache for Redis events to web endpoint with Azure CLI](../azure-cache-for-redis/cache-event-grid-quickstart-cli.md)|

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).

