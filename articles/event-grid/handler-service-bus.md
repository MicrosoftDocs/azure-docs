---
title: Service Bus queues and topics as event handlers for Azure Event Grid events
description: Describes how you can use Service Bus queues and topics as event handlers for Azure Event Grid events.
ms.topic: conceptual
ms.date: 09/30/2021
---

# Service Bus queues and topics as event handlers for Azure Event Grid events
An event handler is the place where the event is sent. The handler takes some further action to process the event. Several Azure services are automatically configured to handle events and **Azure Service Bus** is one of them. 

You can use a Service queue or topic as a handler for events from Event Grid. 

## Service Bus queues

> [!NOTE]
> Session enabled queues are not supported as event handlers for Azure Event Grid events
 
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

For Azure CLI, the following example subscribes and connects an event grid topic to a Service Bus topic:

```azurecli-interactive
az eventgrid event-subscription create \
    --name <my-event-subscription> \
    --source-resource-id /subscriptions/{SubID}/resourceGroups/{RG}/providers/Microsoft.EventGrid/topics/topic1 \
    --endpoint-type servicebustopic \
    --endpoint /subscriptions/{SubID}/resourceGroups/TestRG/providers/Microsoft.ServiceBus/namespaces/ns1/topics/topic1
```

[!INCLUDE [event-grid-message-headers](./includes/event-grid-message-headers.md)]

When sending an event to a Service Bus queue or topic as a brokered message, the `messageid` of the brokered message is an internal system ID.

The internal system ID for the message will be maintained across redelivery of the event so that you can avoid duplicate deliveries by turning on **duplicate detection** on the service bus entity. We recommend that you enable duration of the duplicate detection on the Service Bus entity to be either the time-to-live (TTL) of the event or max retry duration, whichever is longer.

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

## Delivery properties
Event subscriptions allow you to set up HTTP headers that are included in delivered events. This capability allows you to set custom headers that are required by a destination. You can set custom headers on the events that are delivered to Azure Service Bus queues and topics.

Azure Service Bus supports the use of following message properties when sending single messages. 

| Header name | Header type |
| :-- | :-- |
| `MessageId` | Dynamic |  
| `PartitionKey` | Static or dynamic |
| `SessionId` | Static or dynamic |
| `CorrelationId` | Static or dynamic |
| `Label` | Static or dynamic |
| `ReplyTo` | Static or dynamic | 
| `ReplyToSessionId` | Static or dynamic |
| `To` |Static or dynamic |
| `ViaPartitionKey` | Static or dynamic |

> [!NOTE]
> - The default value of `MessageId` is the internal ID of the Event Grid event. You can override it. For example, `data.field`.
> - You can only set either `SessionId` or `MessageId`. 

For more information, see [Custom delivery properties](delivery-properties.md). 

## Next steps
See the [Event handlers](event-handlers.md) article for a list of supported event handlers. 
