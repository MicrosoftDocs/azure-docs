---
title: 'MQTT Clients Life Cycle Events'
description: 'An overview of the MQTT Client Life Cycle Events and how to configure them.'
ms.topic: conceptual
ms.custom: build-2023
ms.date: 05/23/2023
author: george-guirguis
ms.author: geguirgu
---
# MQTT Clients Life Cycle Events 

Client Life Cycle events allow applications to react to client connection or disconnection events. For example, you can build an application that updates a database, creates a ticket, and delivers an email notification every time a client is disconnected for mitigating action.

## Event types

The Event Grid namespace publishes the following event types:

| **Event type** | **Description** |
|------------------------------------------------------|---------------------------------------------------------------------|
| **Microsoft.EventGrid.MQTTClientSessionConnected** | Published when an MQTT client’s session is connected to Event Grid. |
| **Microsoft.EventGrid.MQTTClientSessionDisconnected** | Published when an MQTT client’s session is disconnected from Event Grid. |



## Event schema

The client life cycle events provide you with all the information about the client and session that got connected or disconnected. It also provides a disconnectionReason that you can use for diagnostics scenarios as it enables you to have automated mitigating actions.

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
  az eventgrid system-topic event-subscription create --name <Specify Event Subscription Name> -g <Resource Group> --system-topic-name <System Topic Name> --endpoint <Endpoint URL>
```
## Limitations:

- There's no latency guarantee for the client connection status events.
- The client life cycle events' timestamp indicates when the service detected the events, which may differ from the actual time of connection status change.
- The order of client connection status events isn't guaranteed, events may arrive out of order. However, the sequence number can be used to determine the original order of the events.
- Duplicate client connection status events may be published.

## Next steps
Learn more about [System topics in Azure Event Grid](system-topics.md)
