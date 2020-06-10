---
title: Azure App Configuration as Event Grid source
description: This article describes how to use Azure App Configuration as an Event Grid event source. It provides the schema and links to tutorial and how-to articles. 
services: event-grid
author: femila

ms.service: event-grid
ms.topic: conceptual
ms.date: 04/09/2020
ms.author: femila
---

# Azure App Configuration as an Event Grid source
This article provides the properties and schema for Azure App Configuration events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). It also gives you a list of quick starts and tutorials to use Azure App Configuration as an event source.

## Event Grid event schema

### Available event types

Azure App Configuration emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.AppConfiguration.KeyValueModified | Raised when a key-value is created or replaced. |
| Microsoft.AppConfiguration.KeyValueDeleted | Raised when a key-value is deleted. |

### Example event

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
 
### Event properties

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| topic | string | Full resource path to the event source. This field is not writeable. Event Grid provides this value. |
| subject | string | Publisher-defined path to the event subject. |
| eventType | string | One of the registered event types for this event source. |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| ID | string | Unique identifier for the event. |
| data | object | App Configuration event data. |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| key | string | The key of the key-value that was modified or deleted. |
| label | string | The label, if any, of the key-value that was modified or deleted. |
| etag | string | For `KeyValueModified` the etag of the new key-value. For `KeyValueDeleted` the etag of the key-value that was deleted. |

## Tutorials and how-tos

|Title | Description |
|---------|---------|
| [React to Azure App Configuration events by using Event Grid](../azure-app-configuration/concept-app-configuration-event.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Overview of integrating Azure App Configuration with Event Grid. |
| [Quickstart: route Azure App Configuration events to a custom web endpoint with Azure CLI](../azure-app-configuration/howto-app-configuration-event.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Shows how to use Azure CLI to send Azure App Configuration events to a WebHook. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
* For an introduction to working with Azure App Configuration events, see [Route Azure App Configuration events - Azure CLI](../azure-app-configuration/howto-app-configuration-event.md?toc=%2fazure%2fevent-grid%2ftoc.json). 