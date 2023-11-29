---
title: 'MQTT Clients Life Cycle Events'
description: 'An overview of the MQTT Client Life Cycle Events and how to configure them.'
ms.topic: conceptual
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 11/15/2023
author: george-guirguis
ms.author: geguirgu
---
# MQTT Clients Life Cycle Events 

Client Life Cycle events allow applications to react to events about the client connection status or the client resource operations. It allows you to:
- Monitor your clients' connection status. For example, you can build an application that analyzes clients' connections to optimize behavior.
- React with a mitigation action for client disconnections. For example, you can build an application that initiates an auto-mitigation flow or creates a support ticket every time a client is disconnected.
- Track the namespace that your clients are attached to. For example, confirm that your clients are connected to the right namespace after you initiate a failover.  



## Event types

The Event Grid namespace publishes the following event types:

| **Event type** | **Description** |
|------------------------------------------------------|---------------------------------------------------------------------|
| **Microsoft.EventGrid.MQTTClientSessionConnected** | Published when an MQTT client’s session is connected to Event Grid. |
| **Microsoft.EventGrid.MQTTClientSessionDisconnected** | Published when an MQTT client’s session is disconnected from Event Grid. |
| **Microsoft.EventGrid.MQTTClientCreatedOrUpdated** | Published when an MQTT client is created or updated in the Event Grid Namespace. |
| **Microsoft.EventGrid.MQTTClientDeleted** | Published when an MQTT client is deleted from the Event Grid Namespace. |



## Event schema

The client life cycle events provide you with all the information about the client and session that got connected or disconnected. It also provides a disconnectionReason that you can use for diagnostics scenarios as it enables you to have automated mitigating actions.

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

---

### Disconnection Reasons:

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

For a detailed description of each property, see [event schema for Event Grid Namespace](event-schema-event-grid-namespace.md#event-properties).

> [!TIP]
> Handling high rate of fluctuations in connection states: When a client disconnect event is received, wait for a period (for example, 30 seconds) and verify that the client is still offline before taking a mitigating action. This optimization improves efficiency in handling rapidly changing states.


## Configuration

### Azure portal configuration

Use the following steps to emit the client life cycle events:

1. In the namespace, go to the Events tab.
2. Select +Event Subscription.
    - Provide a name for your Event Grid subscription.
    - Select the Event Schema that you prefer for event consumption.
    - Filter the events under Event Types.
    - Fill your endpoint details.
1. Select Create.

### Azure CLI configuration

Use the following steps to emit the client life cycle events:

1. Create a system topic

```azurecli-interactive
az eventgrid system-topic create --resource-group <Resource Group > --name <System Topic Name> --location \<Region> --topic-type Microsoft.EventGrid.Namespaces --source /subscriptions//resourceGroups/<Resource Group >/providers/Microsoft.EventGrid/namespaces/<Namespace Name>
```
2. Create an Event Grid Subscription

```azurecli-interactive
  az eventgrid system-topic event-subscription create --name <Specify Event Subscription Name> -g <Resource Group> --system-topic-name <System Topic Name> --endpoint <Endpoint>
```

## Behavior:
- There's no latency guarantee for the client lifecycle events. The client connection status events indicate the last reported state of the client session's connection, not the real-time connection status. 
- Duplicate client life cycle events may be published.
- The client life cycle events' timestamp indicates when the service detected the events, which may differ from the actual time of the event.
- The order of client life cycle events isn't guaranteed, events may arrive out of order. However, the sequence number on the connection status events can be used to determine the original order of the events.
- For the Client Created or Updated event and the Client Deleted event:
    - If there are multiple state changes to the client resource within a short amount of time, there will be one event emitted for the final state of the client.
    - Example 1: if a client gets created, then updated twice within 3 seconds, EG will emit only one MQTTClientCreatedOrUpdated event with the final values for the metadata of the client.
    - Example 2: if a client gets created, then deleted within 5 seconds, EG will emit only MQTTClientDeleted event. 

### Order connection status events:
The sequence number on the MQTTClientSessionConnected and MQTTClientSessionDisconnected events can be used to determine the last reported state of the client session's connection as the sequence number is incremented with every new event. The sequence number for the MQTTClientSessionDisconnected always matches the sequence number of the MQTTClientSessionConnected event for the same connection. For example, the list of events and sequence numbers below is a sample of events in the right order for the same client:
- MQTTClientSessionConnected > "sequenceNumber": 1
- MQTTClientSessionDisconnected > "sequenceNumber": 1
- MQTTClientSessionConnected > "sequenceNumber": 2
- MQTTClientSessionDisconnected > "sequenceNumber": 2

Here is a sample logic to order the events:
For each client:
- Store the sequence number and the connection status from the first event.
- For every new MQTTClientSessionConnected event:
    - if the new sequence number is greater than the previous one, update the sequence number and the connection status to match the new event.
- For every new MQTTClientSessionDisconnected event:
    - if the new sequence number is equal than or greater than the previous one, update the sequence number and the connection status to match the new event.

## Next steps
- To learn more about system topics, go to [System topics in Azure Event Grid](system-topics.md)
- To learn more about the client life cycle event properties, go to [Event Grid as an Event Grid source](event-schema-event-grid-namespace.md)
