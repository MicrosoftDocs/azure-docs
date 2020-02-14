---
title: Azure Event Grid Azure App Configuration event schema
description: Describes the properties that are provided for Azure App Configuration events with Azure Event Grid
services: event-grid
author: jimmyca

ms.service: event-grid
ms.topic: reference
ms.date: 05/30/2019
ms.author: jimmyca
---

# Azure Event Grid event schema for Azure App Configuration

This article provides the properties and schema for Azure App Configuration events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

For a list of sample scripts and tutorials, see [Azure App Configuration event source](event-sources.md#app-configuration).

## Available event types

Azure App Configuration emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.AppConfiguration.KeyValueModified | Raised when a key-value is created or replaced. |
| Microsoft.AppConfiguration.KeyValueDeleted | Raised when a key-value is deleted. |

## Example event

The following example shows the schema of a key-value modified event: 

```json
[{
  "id": "84e17ea4-66db-4b54-8050-df8f7763f87b",
  "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/microsoft.appconfiguration/configurationstores/contoso",
  "subject": "https://contoso.azconfig.io/kv/Foo?label=FizzBuzz",
  "data": {
    "key": "Foo",
    "label": "FizzBuzz",
    "etag": "FnUExLaj2moIi4tJX9AXn9sakm0"
  },
  "eventType": "Microsoft.AppConfiguration.KeyValueModified",
  "eventTime": "2019-05-31T20:05:03Z",
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

The schema for a key-value deleted event is similar: 

```json
[{
  "id": "84e17ea4-66db-4b54-8050-df8f7763f87b",
  "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/microsoft.appconfiguration/configurationstores/contoso",
  "subject": "https://contoso.azconfig.io/kv/Foo?label=FizzBuzz",
  "data": {
    "key": "Foo",
    "label": "FizzBuzz",
    "etag": "FnUExLaj2moIi4tJX9AXn9sakm0"
  },
  "eventType": "Microsoft.AppConfiguration.KeyValueDeleted",
  "eventTime": "2019-05-31T20:05:03Z",
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```
 
## Event properties

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| topic | string | Full resource path to the event source. This field is not writeable. Event Grid provides this value. |
| subject | string | Publisher-defined path to the event subject. |
| eventType | string | One of the registered event types for this event source. |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| id | string | Unique identifier for the event. |
| data | object | App Configuration event data. |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| key | string | The key of the key-value that was modified or deleted. |
| label | string | The label, if any, of the key-value that was modified or deleted. |
| etag | string | For `KeyValueModified` the etag of the new key-value. For `KeyValueDeleted` the etag of the key-value that was deleted. |
 
## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
* For an introduction to working with Azure App Configuration events, see [Route Azure App Configuration events - Azure CLI](../azure-app-configuration/howto-app-configuration-event.md?toc=%2fazure%2fevent-grid%2ftoc.json). 