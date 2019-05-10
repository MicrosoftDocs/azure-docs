---
title: Azure Event Grid Service Bus event schema
description: Describes the properties that are provided for Service Bus events with Azure Event Grid
services: event-grid
author: banisadr
manager: darosa

ms.service: event-grid
ms.topic: reference
ms.date: 01/17/2019
ms.author: babanisa
---

# Azure Event Grid event schema for Service Bus

This article provides the properties and schema for Service Bus events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

For a list of sample scripts and tutorials, see [Service Bus event source](event-sources.md#service-bus).

## Available event types

Service Bus emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.ServiceBus.ActiveMessagesAvailableWithNoListeners | Raised when there are active messages in a Queue or Subscription and no receivers listening. |
| Microsoft.ServiceBus.DeadletterMessagesAvailableWithNoListener | Raised when there are active messages in a Dead Letter Queue and no active listeners. |

## Example event

The following example shows the schema of active messages with no listeners event:

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{your-rg}/providers/Microsoft.ServiceBus/namespaces/{your-service-bus-namespace}",
  "subject": "topics/{your-service-bus-topic}/subscriptions/{your-service-bus-subscription}",
  "eventType": "Microsoft.ServiceBus.ActiveMessagesAvailableWithNoListeners",
  "eventTime": "2018-02-14T05:12:53.4133526Z",
  "id": "dede87b0-3656-419c-acaf-70c95ddc60f5",
  "data": {
    "namespaceName": "YOUR SERVICE BUS NAMESPACE WILL SHOW HERE",
    "requestUri": "https://{your-service-bus-namespace}.servicebus.windows.net/{your-topic}/subscriptions/{your-service-bus-subscription}/messages/head",
    "entityType": "subscriber",
    "queueName": "QUEUE NAME IF QUEUE",
    "topicName": "TOPIC NAME IF TOPIC",
    "subscriptionName": "SUBSCRIPTION NAME"
  },
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

The schema for a dead letter queue event is similar:

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{your-rg}/providers/Microsoft.ServiceBus/namespaces/{your-service-bus-namespace}",
  "subject": "topics/{your-service-bus-topic}/subscriptions/{your-service-bus-subscription}",
  "eventType": "Microsoft.ServiceBus.DeadletterMessagesAvailableWithNoListener",
  "eventTime": "2018-02-14T05:12:53.4133526Z",
  "id": "dede87b0-3656-419c-acaf-70c95ddc60f5",
  "data": {
    "namespaceName": "YOUR SERVICE BUS NAMESPACE WILL SHOW HERE",
    "requestUri": "https://{your-service-bus-namespace}.servicebus.windows.net/{your-topic}/subscriptions/{your-service-bus-subscription}/$deadletterqueue/messages/head",
    "entityType": "subscriber",
    "queueName": "QUEUE NAME IF QUEUE",
    "topicName": "TOPIC NAME IF TOPIC",
    "subscriptionName": "SUBSCRIPTION NAME"
  },
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
| data | object | Blob storage event data. |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| namespaceName | string | The Service Bus namespace the resource exists in. |
| requestUri | string | The URI to the specific queue or subscription emitting the event. |
| entityType | string | The type of Service Bus entity emitting events (queue or subscription). |
| queueName | string | The queue with active messages if subscribing to a queue. Value null if using topics / subscriptions. |
| topicName | string | The topic the Service Bus subscription with active messages belongs to. Value null if using a queue. |
| subscriptionName | string | The Service Bus subscription with active messages. Value null if using a queue. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
* For details on using Azure Event Grid with Service Bus, see the [Service Bus to Event Grid integration overview](../service-bus-messaging/service-bus-to-event-grid-integration-concept.md).
* Try [receiving Service Bus events with Functions or Logic Apps](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json).
