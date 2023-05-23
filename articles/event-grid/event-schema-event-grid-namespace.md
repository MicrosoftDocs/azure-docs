---
title: Event Grid as an Event Grid source
description: This article provides the properties and schema for Azure Event Grid events. It lists the available event types, an example event, and event properties.  
ms.topic: conceptual
ms.custom: build-2023
ms.date: 12/02/2022
---

# Azure Event Grid Namespace as an Event Grid source
This article provides the properties and schema for Azure Event Grid namespace events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). 

## Available event types

Azure Event Grid namespace emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.EventGrid.MQTTClientSessionConnected | Published when an MQTT client’s session is connected to Event Grid. |
| Microsoft.EventGrid.MQTTClientSessionDisconnected | Published when an MQTT client’s session is disconnected from Event Grid. | 


## Example event

# [Event Grid event schema](#tab/event-grid-event-schema)

This sample event shows the schema of an event raised when an MQTT client’s session is connected to Event Grid:

```json
[{
  "id": "6f1b70b8-557a-4865-9a1c-94cc3def93db",
  "eventTime": "2023-04-28T00:49:04.0211141Z",
  "eventType": "Microsoft.EventGrid.MQTTClientSessionConnected",
  "topic": "/subscriptions/ 00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "/clients/device1/sessions/session1",
  "dataVersion": "1",
  "metadataVersion": "1",
  "data": {
    "namespaceName": "myns",
    "clientAuthenticationName": "device1",
    "clientSessionName": "session1",
    "sequenceNumber": 1
  }
}]
```
This sample event shows the schema of an event raised when an MQTT client’s session is disconnected to Event Grid:

```json
[{
  "id": "6f1b70b8-557a-4865-9a1c-94cc3def93db",
  "eventTime": "2023-04-28T00:49:04.0211141Z",
  "eventType": "Microsoft.EventGrid.MQTTClientSessionConnected",
  "topic": "/subscriptions/ 00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "/clients/device1/sessions/session1",
  "dataVersion": "1",
  "metadataVersion": "1",
  "data": {
    "namespaceName": "myns",
    "clientAuthenticationName": "device1",
    "clientSessionName": "session1",
    "sequenceNumber": 1
  }
}]
```

# [Cloud event schema](#tab/cloud-event-schema)

This sample event shows the schema of an event raised when an MQTT client's session is connected to an Event Grid:

```json
[{
  "id": "6f1b70b8-557a-4865-9a1c-94cc3def93db",
  "time": "2023-04-28T00:49:04.0211141Z",
  "type": "Microsoft.EventGrid.MQTTClientSessionConnected",
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "/clients/device1/sessions/session1",
  "specversion": "1.0",
  "data": {
    "namespaceName": "myns",
    "clientAuthenticationName": "device1",
    "clientSessionName": "session1",
    "sequenceNumber": 1
  }
}]
```
This sample event shows the schema of an event raised when an MQTT client’s session is disconnected to Event Grid:

```json
[{
  "id": "3b93123d-5427-4dec-88d5-3b6da87b0f64",
  "time": "2023-04-28T00:51:28.6037385Z",
  "type": "Microsoft.EventGrid.MQTTClientSessionDisconnected",
  "source": "/subscriptions/ 00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "/clients/device1/sessions/session1",
  "specversion": "1.0",
  "data": {
    "namespaceName": "myns",
    "clientAuthenticationName": "device1",
    "clientSessionName": "session1",
    "sequenceNumber": 1,
    "disconnectionReason": "ClientError"
  }
}]
```

---


### Event properties

# [Event Grid event schema](#tab/event-grid-event-schema)

All events contain the same top-level data: 

| Property | Type | Description |
| -------- | ---- | ----------- |
| `id` | string | Unique identifier for the event. |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `eventType` | string | One of the registered event types for this event source. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `data` | object | Event Grid namespace event data.  |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

# [Cloud event schema](#tab/cloud-event-schema)

All events contain the same top-level data: 


| Property | Type | Description |
| -------- | ---- | ----------- |
| `id` | string | Unique identifier for the event. |
| `source` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `type` | string | One of the registered event types for this event source. |
| `time` | string | The time the event is generated based on the provider's UTC time. |
| `data` | object | Event Grid namespace event data.  |
| `specversion` | string | CloudEvents schema specification version. |

---

For all Event Grid namespace events, the data object contains the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `namespaceName` | string | Name of the Event Grid namespace where the MQTT client was connected or disconnected. |
| `clientAuthenticationName` | string | Unique identifier for the MQTT client that the client presents to the service for authentication. This case-sensitive string can be up to 128 characters long, and supports UTF-8 characters.|
| `clientSessionName` | string | Unique identifier for the MQTT client's session. This case-sensitive string can be up to 128 characters long, and supports UTF-8 characters.|
| `sequenceNumber` | string | A number that helps indicate order of MQTT client session connected or disconnected events. Latest event will have a sequence number that is higher than the previous event. |

For the **MQTT Client Session Disconnected** event, the data object also contains the following property:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `disconnectionReason` | string | Reason for the disconnection of the MQTT client's session. The value could be one of the values in the disconnection reasons table. |

### Disconnection reasons:

The following list details the different values for the disconnectionReason and their description:


| Disconnection Reason                              | Description                                                                                                                                                          |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ClientAuthenticationError           | the client got disconnected for any authentication reasons (for example, certificate expired, client got disabled, or client configuration changed)                                            |
| ClientAuthorizationError            | the client got disconnected for any authorization reasons (for example, because of a change in the configuration of topic spaces, permission bindings, or client groups)                                                                  |
| ClientError                         | the client sent a bad request or used one of the unsupported features that resulted in a connection termination by the service.                                          |
| ClientInitiatedDisconnect           | the client initiates a graceful disconnect through a DISCONNECT packet for MQTT or a close frame for MQTT over WebSocket.                                                                                                                |
| ConnectionLost                      | the client-server connection is lost.                           |
| IpForbidden                         | the client's IP address is blocked by IP filter or Private links configuration. |
| QuotaExceeded                       | the client exceeded one or more of the throttling limits that resulted in a connection termination by the service.                                                                                                                      |
| ServerError                         | the connection got terminated due to an unexpected server error                                                                             |
| ServerInitiatedDisconnect           | the server initiates a graceful disconnect for any operational reason|
| SessionOverflow                     | the client's queue for unacknowledged QoS1 messages reached its limit, which resulted in a connection termination by the server                                                                          |
| SessionTakenOver                    | the client reconnected with the same authentication name, which resulted in the termination of the previous connection.                                                                                                                |



## Next steps

* To learn more about Event Grid system topics, see [System topics](system-topics.md)
* To learn about the events emitted by the Event Grid namespace and how to use them, see [MQTT Client Life Cycle Events](mqtt-client-life-cycle-events.md).
