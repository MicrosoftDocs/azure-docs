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

You can use a Service queue or topic as a handler for events from Event Grid. 

## Service Bus queues
You can route events in Event Grid directly to Service Bus queues for use in buffering or command & control scenarios in enterprise applications.

In the Azure portal, while creating an event subscription, select **Service Bus Queue** as endpoint type and then click **select an endpoint** to choose a Service Bus queue.

### Using CLI to add a Service Bus queue handler

For Azure CLI, the following example subscribes and connects an event grid topic to a Service Bus queue:

```azurecli-interactive
az eventgrid event-subscription create \
    --name <my-event-subscription> \
    --source-resource-id /subscriptions/{SubID}/resourceGroups/{RG}/providers/Microsoft.EventGrid/topics/topic1 \
    --endpoint-type servicebusqueue \
    --endpoint /subscriptions/{SubID}/resourceGroups/TestRG/providers/Microsoft.ServiceBus/namespaces/ns1/queues/queue1
```

## Service Bus topics

You can route events in Event Grid directly to Service Bus topics to handle Azure system events with Service Bus topics, or for command & control messaging scenarios.

In the Azure portal, while creating an event subscription, select **Service Bus Topic** as endpoint type and then click **select and endpoint** to choose a Service Bus topic.

### Using CLI to add a Service Bus topic handler

For Azure CLI, the following example subscribes and connects an event grid topic to a Service Bus queue:

```azurecli-interactive
az eventgrid event-subscription create \
    --name <my-event-subscription> \
    --source-resource-id /subscriptions/{SubID}/resourceGroups/{RG}/providers/Microsoft.EventGrid/topics/topic1 \
    --endpoint-type servicebustopic \
    --endpoint /subscriptions/{SubID}/resourceGroups/TestRG/providers/Microsoft.ServiceBus/namespaces/ns1/topics/topic1
```

## Message properties
If you use a **Service Bus topic or queue** as an event handler for events from Event Grid, set the following message headers: 

| Property name | Description |
| ------------- | ----------- | 
| aeg-subscription-name | Name of event subscription. |
| aeg-delivery-count | <p>Number of attempts made for the event.</p> <p>Example: "1"</p> |
| aeg-event-type | <p>Type of the event.</p><p> Example: "Microsoft.Storage.blobCreated"</p> | 
| aeg-metadata-version | <p>Metadata version of the event.</p> <p>Example: "1".</p><p> For **Event Grid event schema**, this property represents the metadata version and for **cloud event schema**, it represents the **spec version**. </p>|
| aeg-data-version | <p>Data version of the event.</p><p>Example: "1".</p><p>For **Event Grid event schema**, this property represents the data version and for **cloud event schema**, it doesn't apply.</p> |

## Message headers
When sending an event to a Service Bus queue or topic as a brokered message, the `messageid` of the brokered message is the **event ID**.

The event ID will be maintained across redelivery of the event so that you can avoid duplicate deliveries by turning on **duplicate detection** on the service bus entity. We recommend that you enable duration of the duplicate detection on the Service Bus entity to be either the time-to-live (TTL) of the event or max retry duration, whichever is longer.

## REST examples (for PUT)

### Service Bus queue

```json
{
    "properties": 
    {
        "destination": 
        {
			"endpointType": "ServiceBusQueue",
            "properties": 
            {
				"resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.ServiceBus/namespaces/<SERVICE BUS NAMESPACE NAME>/queues/<SERVICE BUS QUEUE NAME>"
			}
		},
		"eventDeliverySchema": "EventGridSchema"
	}
}
```

### Service Bus queue - delivery with managed identity

```json
{
	"properties": {
        "deliveryWithResourceIdentity": 
        {
            "identity": 
            {
				"type": "SystemAssigned"
			},
            "destination": 
            {
				"endpointType": "ServiceBusQueue",
                "properties": 
                {
					"resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.ServiceBus/namespaces/<SERVICE BUS NAMESPACE NAME>/queues/<SERVICE BUS QUEUE NAME>"
				}
			}
		},
		"eventDeliverySchema": "EventGridSchema"
	}
}
```

### Service Bus topic

```json
{
    "properties": 
    {
        "destination": 
        {
			"endpointType": "ServiceBusTopic",
            "properties": 
            {
				"resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.ServiceBus/namespaces/<SERVICE BUS NAMESPACE NAME>/topics/<SERVICE BUS TOPIC NAME>"
			}
		},
		"eventDeliverySchema": "EventGridSchema"
	}
}
```

### Service Bus topic - delivery with managed identity

```json
{
    "properties": 
    {
        "deliveryWithResourceIdentity": 
        {
            "identity": 
            {
				"type": "SystemAssigned"
			},
            "destination": 
            {
				"endpointType": "ServiceBusTopic",
                "properties": 
                {
					"resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.ServiceBus/namespaces/<SERVICE BUS NAMESPACE NAME>/topics/<SERVICE BUS TOPIC NAME>"
				}
			}
		},
		"eventDeliverySchema": "EventGridSchema"
	}
}
```

## Next steps
See the [Event handlers](event-handlers.md) article for a list of supported event handlers. 
