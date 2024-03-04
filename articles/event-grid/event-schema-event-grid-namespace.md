---
title: Event Grid as an Event Grid source
description: This article provides the properties and schema for Azure Event Grid events. It lists the available event types, an example event, and event properties.  
ms.topic: conceptual
ms.custom: build-2023
ms.date: 12/02/2022
---

# Azure Event Grid Namespace (Preview) as an Event Grid source
This article provides the properties and schema for Azure Event Grid namespace events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). 

## Available event types

Azure Event Grid namespace (Preview) emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.EventGrid.MQTTClientSessionConnected | Published when an MQTT client’s session is connected to Event Grid. |
| Microsoft.EventGrid.MQTTClientSessionDisconnected | Published when an MQTT client’s session is disconnected from Event Grid. | 
| Microsoft.EventGrid.MQTTClientCreatedOrUpdated | Published when an MQTT client is created or updated in the Event Grid Namespace. |
| Microsoft.EventGrid.MQTTClientDeleted | Published when an MQTT client is deleted from the Event Grid Namespace. |

## Example event

# [Event Grid event schema](#tab/event-grid-event-schema)

This sample event shows the schema of an event raised when an MQTT client’s session is connected to Event Grid:

```json
[{
  "id": "5249c38a-a048-46dd-8f60-df34fcdab06c",
  "eventTime": "2023-07-29T01:23:49.6454046Z",
  "eventType": "Microsoft.EventGrid.MQTTClientSessionConnected",
  "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "clients/client1/sessions/session1",
  "dataVersion": "1",
  "metadataVersion": "1",
  "data": {
    "namespaceName": "myns",
    "clientAuthenticationName": "client1",
    "clientSessionName": "session1",
    "sequenceNumber": 1
  }
}]
```
This sample event shows the schema of an event raised when an MQTT client’s session is disconnected to Event Grid:

```json
[{
  "id": "e30e5174-787d-4e19-8812-580148bfcf7b",
  "eventTime": "2023-07-29T01:27:40.2446871Z",
  "eventType": "Microsoft.EventGrid.MQTTClientSessionDisconnected",
  "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "clients/client1/sessions/session1",
  "dataVersion": "1",
  "metadataVersion": "1",
  "data": {
    "namespaceName": "myns",
    "clientAuthenticationName": "client1",
    "clientSessionName": "session1",
    "sequenceNumber": 1,
    "disconnectionReason": "ClientInitiatedDisconnect"
  }
}]
```
This sample event shows the schema of an event raised when an MQTT client is created or updated in the Event Grid Namespace:

```json
[{
  "id": "383d1562-c95f-4095-936c-688e72c6b2bb",
  "eventTime": "2023-07-29T01:14:35.8928724Z",
  "eventType": "Microsoft.EventGrid.MQTTClientCreatedOrUpdated",
  "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "clients/client1",
  "dataVersion": "1",
  "metadataVersion": "1",
  "data": {
    "createdOn": "2023-07-29T01:14:34.2048108Z",
    "updatedOn": "2023-07-29T01:14:34.2048108Z",
    "namespaceName": "myns",
    "clientName": "client1",
    "clientAuthenticationName": "client1",
    "state": "Enabled",
    "attributes": {
      "attribute1": "value1"
    }
  }
}]
```
This sample event shows the schema of an event raised when an MQTT client is deleted from the Event Grid Namespace:

```json
[{
  "id": "2a93aaf9-66c2-4f8e-9ba3-8d899c10bf17",
  "eventTime": "2023-07-29T01:30:52.5620566Z",
  "eventType": "Microsoft.EventGrid.MQTTClientDeleted",
  "topic": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "clients/client1",
  "dataVersion": "1",
  "metadataVersion": "1",
  "data": {
    "clientName": "client1",
    "clientAuthenticationName": "client1",
    "namespaceName": "myns"
  }
}]
```

# [Cloud event schema](#tab/cloud-event-schema)

This sample event shows the schema of an event raised when an MQTT client's session is connected to an Event Grid:

```json
[{
  "specversion": "1.0",
  "id": "5249c38a-a048-46dd-8f60-df34fcdab06c",
  "time": "2023-07-29T01:23:49.6454046Z",
  "type": "Microsoft.EventGrid.MQTTClientSessionConnected",
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "clients/client1/sessions/session1",
  "data": {
    "namespaceName": "myns",
    "clientAuthenticationName": "client1",
    "clientSessionName": "session1",
    "sequenceNumber": 1
  }
}]
```
This sample event shows the schema of an event raised when an MQTT client’s session is disconnected to Event Grid:

```json
[{
  "specversion": "1.0",
  "id": "e30e5174-787d-4e19-8812-580148bfcf7b",
  "time": "2023-07-29T01:27:40.2446871Z",
  "type": "Microsoft.EventGrid.MQTTClientSessionDisconnected",
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "clients/client1/sessions/session1",
  "data": {
    "namespaceName": "myns",
    "clientAuthenticationName": "client1",
    "clientSessionName": "session1",
    "sequenceNumber": 1,
    "disconnectionReason": "ClientInitiatedDisconnect"
  }
}]
```
This sample event shows the schema of an event raised when an MQTT client is created or updated in the Event Grid Namespace:

```json
[{
  "specversion": "1.0",
  "id": "383d1562-c95f-4095-936c-688e72c6b2bb",
  "time": "2023-07-29T01:14:35.8928724Z",
  "type": "Microsoft.EventGrid.MQTTClientCreatedOrUpdated",
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "clients/client1",
  "data": {
    "createdOn": "2023-07-29T01:14:34.2048108Z",
    "updatedOn": "2023-07-29T01:14:34.2048108Z",
    "namespaceName": "myns",
    "clientName": "client1",
    "clientAuthenticationName": "client1",
    "state": "Enabled",
    "attributes": {
      "attribute1": "value1"
    }
  }
}]
```
This sample event shows the schema of an event raised when an MQTT client is deleted from the Event Grid Namespace:

```json
[{
  "specversion": "1.0",
  "id": "2a93aaf9-66c2-4f8e-9ba3-8d899c10bf17",
  "time": "2023-07-29T01:30:52.5620566Z",
  "type": "Microsoft.EventGrid.MQTTClientDeleted",
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "clients/client1",
  "data": {
    "namespaceName": "myns",
    "clientName": "client1",
    "clientAuthenticationName": "client1"
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

The data object contains the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `namespaceName` | string | Name of the Event Grid namespace where the MQTT client was connected or disconnected. |
| `clientAuthenticationName` | string | Unique identifier for the MQTT client that the client presents to the service for authentication. This case-sensitive string can be up to 128 characters long, and supports UTF-8 characters.|
| `clientSessionName` | string | Unique identifier for the MQTT client's session. This case-sensitive string can be up to 128 characters long, and supports UTF-8 characters.|
| `sequenceNumber` | string | A number that helps indicate order of MQTT client session connected or disconnected events. Latest event will have a sequence number that is higher than the previous event. |
| `disconnectionReason` | string | Reason for the disconnection of the MQTT client's session. The value could be one of the values in the disconnection reasons table. |
| `createdOn` | string | The time the client resource is created based on the provider's UTC time. |
| `updatedOn` | string | The time the client resource is last updated based on the provider's UTC time. If the client resource was never updated, this value is identical to the value of the 'createdOn' property |
| `clientName` | string | The time the client resource is last updated based on the provider's UTC time. If the client resource was never updated, this value is identical to the value of the 'createdOn' property. |
| `state` | string | The configured state of the client. The value could be Enabled or Disabled.|
| `attributes` | string | The array of key-value pair attributes that are assigned to the client resource.|

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
