---
title: Service Bus queues and topics as event handlers for Azure Event Grid events
description: Describes how you can use Service Bus queues and topics as event handlers for Azure Event Grid events.
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: spelluru
---

# Service Bus queues and topics as event handlers for Azure Event Grid events
An event handler is the place where the event is sent. The handler takes some further action to process the event. Several Azure services are automatically configured to handle events and **Azure Service Bus** is one of them. 


## Service Bus queues
You can route events in Event Grid directly to Service Bus queues for use in buffering or command & control scenarios in enterprise applications.

In the Azure portal, while creating an event subscription, select "Service Bus Queue" as endpoint type and then click "select an endpoint" in order to choose a Service Bus queue.

### Using CLI to add a Service Bus queue handler

For Azure CLI, the following example subscribes and connects an event grid topic to a Service Bus queue:

```azurecli-interactive
# If you haven't already installed the extension, do it now.
# This extension is required for preview features.
az extension add --name eventgrid

az eventgrid event-subscription create \
    --name <my-event-subscription> \
    --source-resource-id /subscriptions/{SubID}/resourceGroups/{RG}/providers/Microsoft.EventGrid/topics/topic1 \
    --endpoint-type servicebusqueue \
    --endpoint /subscriptions/{SubID}/resourceGroups/TestRG/providers/Microsoft.ServiceBus/namespaces/ns1/queues/queue1
```

## Service Bus topics

You can route events in Event Grid directly to Service Bus topics in order to handle Azure system events with Service Bus topics, or for command & control messaging scenarios.

In the Azure portal, while creating an event subscription, select "Service Bus Topic" as endpoint type and then click "select and endpoint" in order to choose a Service Bus topic.

### Using CLI to add a Service Bus topic handler

For Azure CLI, the following example subscribes and connects an event grid topic to a Service Bus queue:

```azurecli-interactive
# If you haven't already installed the extension, do it now.
# This extension is required for preview features.
az extension add --name eventgrid

az eventgrid event-subscription create \
    --name <my-event-subscription> \
    --source-resource-id /subscriptions/{SubID}/resourceGroups/{RG}/providers/Microsoft.EventGrid/topics/topic1 \
    --endpoint-type servicebustopic \
    --endpoint /subscriptions/{SubID}/resourceGroups/TestRG/providers/Microsoft.ServiceBus/namespaces/ns1/topics/topic1
```

## Message properties
Set the following message properties when sending events as messages to a Service Bus endpoint.

| Property name | Description |
| ------------- | ----------- | 
| aeg-subscription-name | Name of event subscription. |
| aeg-delivery-count | Number of attempts made for the event. Example: "1" |
| aeg-event-type | Event type. Example: "Microsoft.Storage.blobCreated" | 
| aeg-metadata-version | Metadata version of the event. Example: "1". For **Event Grid event schema**, this property represents the metadata version and for **cloud event schema**, it represents the **spec version**. |
| aeg-data-version | Data version of the event. Example: "1". Default value: "". For **Event Grid event schema**, this property represents the data version and for **cloud event schema**, it doesn't apply. |
| aeg-output-event-id | ID of the Event Grid event. |

## Message headers
When sending events to a Service Bus endpoint (queue or topic) as brokered messages, the `messageid` of the brokered message is the **event ID**.

The event ID will be maintained across redelivery of the event so that you can avoid duplicate deliveries by turning on **duplicate detection** on the service bus entity. We recommend that you enable duration of the duplicate detection on the Service Bus entity to be either the time-to-live (TTL) of the event or max retry duration, whichever is longer.

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
