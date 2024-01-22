---
title: Azure SignalR as Event Grid source
description: Describes the properties that are provided for Azure SignalR events with Azure Event Grid
ms.topic: conceptual
ms.date: 12/02/2022
---

# Azure Event Grid event schema for SignalR Service

This article provides the properties and schema for SignalR Service events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). It also gives you a list of quick starts and tutorials to use Azure SignalR as an event source.


## Available event types

SignalR Service emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.SignalRService.ClientConnectionConnected | Raised when a client connection connected. |
| Microsoft.SignalRService.ClientConnectionDisconnected | Raised when a client connection disconnected. |

## Example event

# [Event Grid event schema](#tab/event-grid-event-schema)
The following example shows the schema of a client connection connected event: 

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/signalr-rg/providers/Microsoft.SignalRService/SignalR/signalr-resource",
  "subject": "/hub/chat",
  "eventType": "Microsoft.SignalRService.ClientConnectionConnected",
  "eventTime": "2019-06-10T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "timestamp": "2019-06-10T18:41:00.9584103Z",
    "hubName": "chat",
    "connectionId": "crH0uxVSvP61p5wkFY1x1A",
    "userId": "user-eymwyo23"
  },
  "dataVersion": "1.0",
  "metadataVersion": "1"
}]
```

The schema for a client connection disconnected event is similar: 

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/signalr-rg/providers/Microsoft.SignalRService/SignalR/signalr-resource",
  "subject": "/hub/chat",
  "eventType": "Microsoft.SignalRService.ClientConnectionDisconnected",
  "eventTime": "2019-06-10T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "timestamp": "2019-06-10T18:41:00.9584103Z",
    "hubName": "chat",
    "connectionId": "crH0uxVSvP61p5wkFY1x1A",
    "userId": "user-eymwyo23",
    "errorMessage": "Internal server error."
  },
  "dataVersion": "1.0",
  "metadataVersion": "1"
}]
```

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of a client connection connected event: 

```json
[{
  "source": "/subscriptions/{subscription-id}/resourceGroups/signalr-rg/providers/Microsoft.SignalRService/SignalR/signalr-resource",
  "subject": "/hub/chat",
  "type": "Microsoft.SignalRService.ClientConnectionConnected",
  "time": "2019-06-10T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "timestamp": "2019-06-10T18:41:00.9584103Z",
    "hubName": "chat",
    "connectionId": "crH0uxVSvP61p5wkFY1x1A",
    "userId": "user-eymwyo23"
  },
  "specversion": "1.0"
}]
```

The schema for a client connection disconnected event is similar: 

```json
[{
  "source": "/subscriptions/{subscription-id}/resourceGroups/signalr-rg/providers/Microsoft.SignalRService/SignalR/signalr-resource",
  "subject": "/hub/chat",
  "type": "Microsoft.SignalRService.ClientConnectionDisconnected",
  "time": "2019-06-10T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "timestamp": "2019-06-10T18:41:00.9584103Z",
    "hubName": "chat",
    "connectionId": "crH0uxVSvP61p5wkFY1x1A",
    "userId": "user-eymwyo23",
    "errorMessage": "Internal server error."
  },
  "specversion": "1.0"
}]
```

---


### Event properties


# [Event Grid event schema](#tab/event-grid-event-schema)
An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `eventType` | string | One of the registered event types for this event source. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | SignalR Service event data. |
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
| `data` | object | SignalR Service event data. |
| `specversion` | string | CloudEvents schema specification version. |

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `timestamp` | string | The time the event is generated based on the provider's UTC time. |
| `hubName` | string | The hub that the client connection belongs to. |
| `connectionId` | string | The unique identifier for the client connection. |
| `userId` | string | The user identifier defined in claim. |
| `errorMessage` | string | The error that causes the connection disconnected. |

## Tutorials and how-tos
|Title | Description |
|---------|---------|
| [React to Azure SignalR Service events by using Event Grid](../azure-signalr/signalr-concept-event-grid-integration.md) | Overview of integrating Azure SignalR Service with Event Grid. |
| [How to send Azure SignalR Service events to Event Grid](../azure-signalr/signalr-howto-event-grid-integration.md) | Shows how to send  Azure SignalR Service events to an application through Event Grid. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
