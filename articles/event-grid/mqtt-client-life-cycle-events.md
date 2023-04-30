---
title: 'MQTT Clients Life Cycle Events'
description: 'An overview of the MQTT Client Life Cycle Events and how to configure them.'
ms.topic: conceptual
ms.date: 04/30/2023
author: geguirgu
ms.author: geguirgu
---
# MQTT Clients Life Cycle Events 
Client Life Cycle events allow applications to react to client connection or disconnection events. For example, you can build an application that updates a database, creates a ticket, and delivers an email notification every time a client is disconnected for mitigating action.

## Event types

The Event Grid namespace publishes the following event types:

| **Event type** | **Description** |
|---|---|
| **Microsoft.EventGrid.MQTTClientSessionConnected** | Published when an MQTT client’s session is  connected to Event Grid. |
| **Microsoft.EventGrid.MQTTClientSessionDisconnected** | Published when an MQTT client’s session is disconnected from Event Grid. |



## Event schema

The client life cycle events provide you with all the information about the client and session that got connected or disconnected. It also provides a disconnectionReason that you can use for diagnostics scenarios as it enables you to have automated mitigating actions. For more information about how to use Event Grid event properties, see the [Event Grid event schema](https://learn.microsoft.com/en-us/azure/event-grid/event-schema).

### MQTT Client Session Connected Schema

The following example shows the CloudEvent schema of the event:

```json
{
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
}
```
The following example shows the Event Grid schema of the event:

```json
{
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
}
```

### MQTT Client Session Disconnected Schema

The following example shows the CloudEvent schema of the event:

```json
{
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
}
```

The following example shows the Event Grid schema of the event:

```json
{
  "id": "641fd543-a788-48aa-b22a-f54be3f7e1e2",
  "eventTime": "2023-04-28T02:54:56.9162492Z",
  "eventType": "Microsoft.EventGrid.MQTTClientSessionDisconnected",
  "topic": "/subscriptions/ 00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.EventGrid/namespaces/myns",
  "subject": "/clients/device1/sessions/session1",
  "dataVersion": "1",
  "metadataVersion": "1",
  "data": {
	  "namespaceName": "myns",
	  "clientAuthenticationName": "device1",
	 "clientSessionName": "session1",
	  "sequenceNumber": 1,
    "disconnectionReason": "ClientError"
  },
}
```

### Recommendation for handling events:

Handling high rate of fluctuations in connection states: When a client disconnect event is received, wait for a period (for example, 30 seconds) and verify that the client is still offline before taking a mitigating action. This optimization improves efficiency in handling rapidly changing states.

## Configuration

### Azure portal configuration

Use the following steps to emit the client life cycle events:

1. In the namespace, go to the Events tab.
2. Select +Event Subscription.
   c. Provide a name for your Event Grid subscription.
   a. Select the Event Schema that you prefer for event consumption.
   a. Filter the events under Event Types.
   a. Fill your endpoint details.
3. Select Create.

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

Learn more about [System topics in Azure Event Grid](https://learn.microsoft.com/en-us/azure/event-grid/system-topics).
