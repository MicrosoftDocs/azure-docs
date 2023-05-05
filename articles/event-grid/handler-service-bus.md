---
title: Service Bus queues and topics as event handlers for Azure Event Grid events
description: Describes how you can use Service Bus queues and topics as event handlers for Azure Event Grid events.
ms.topic: conceptual
ms.date: 11/17/2022
---

# Service Bus queues and topics as event handlers for Azure Event Grid events
An event handler receives events from an event source via Event Grid, and processes those events. You can use instances of a few Azure services to handle events and **Azure Service Bus** is one of them. This article shows you how to use a Service Bus queue or topic as a handler for events from Event Grid. 

## Service Bus queues

You can route events in Event Grid directly to Service Bus queues for use in buffering or command and control scenarios in enterprise applications. 

### Use Azure portal
In the Azure portal, while creating an event subscription, select **Service Bus Queue** as the endpoint type and then click **select an endpoint** to choose a Service Bus queue.

:::image type="content" source="./media/handler-service-bus/queue.png" lightbox="./media/handler-service-bus/queue.png" alt-text="Screenshot showing the configuration of a Service Bus queue handler.":::

> [!NOTE]
> Session enabled queues are not supported as event handlers for Azure Event Grid events
 
### Use Azure CLI
Use the [`az eventgrid event-subscription create`](/cli/azure/eventgrid/event-subscription) command with `--endpoint-type` set to `servicebusqueue` and `--endpoint` set to `/subscriptions/{AZURE SUBSCRIPTION}/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.ServiceBus/namespaces/<NAMESPACE NAME>/queues/<QUEUE NAME>`. Here's an example:

```azurecli-interactive
az eventgrid event-subscription create \
    --name <my-event-subscription> \
    --source-resource-id /subscriptions/{SubID}/resourceGroups/{RG}/providers/Microsoft.EventGrid/topics/topic1 \
    --endpoint-type servicebusqueue \
    --endpoint /subscriptions/{SubID}/resourceGroups/TestRG/providers/Microsoft.ServiceBus/namespaces/ns1/queues/queue1
```

You can also use the [`az eventgrid topic event-subscription`](/cli/azure/eventgrid/topic/event-subscription) command for custom topics, the [`az eventgrid system-topic event-subscription`](/cli/azure/eventgrid/system-topic/event-subscription) command for system topics, and the [`az eventgrid partner topic event-subscription create`](/cli/azure/eventgrid/partner/topic/event-subscription#az-eventgrid-partner-topic-event-subscription-create) command for partner topics.

### Use Azure PowerShell
Use the [New-AzEventGridSubscription](/powershell/module/az.eventgrid/new-azeventgridsubscription) command with `-EndpointType` set to `servicebusqueue` and `-Endpoint` set to `/subscriptions/{AZURE SUBSCRIPTION}/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.ServiceBus/namespaces/<NAMESPACE NAME>/queues/<QUEUE NAME>`. Here's an example:


```azurepowershell-interactive
New-AzEventGridSubscription -ResourceGroup MyResourceGroup `
            -TopicName Topic1 `
            -EndpointType servicebusqueue `
            -Endpoint /subscriptions/{SubID}/resourceGroups/TestRG/providers/Microsoft.ServiceBus/namespaces/ns1/queues/queue1 `
            -EventSubscriptionName EventSubscription1
```

You can also use the [`New-AzEventGridSystemTopicEventSubscription`](/powershell/module/az.eventgrid/new-azeventgridsystemtopiceventsubscription) command for system topics, and the [`New-AzEventGridPartnerTopicEventSubscription`](/powershell/module/az.eventgrid/new-azeventgridpartnertopiceventsubscription) command for partner topics.

## Service Bus topics

You can route events in Event Grid directly to Service Bus topics for command and control messaging scenarios. 

### Use Azure portal
In the Azure portal, while creating an event subscription, select **Service Bus Topic** as the endpoint type and then click **select an endpoint** to choose a Service Bus topic.

:::image type="content" source="./media/handler-service-bus/topic.png" lightbox="./media/handler-service-bus/topic.png" alt-text="Screenshot showing the configuration of a Service Bus topic handler.":::

### Use Azure CLI
Use the [`az eventgrid event-subscription create`](/cli/azure/eventgrid/event-subscription) command with `--endpoint-type` set to `servicebustopic` and `--endpoint` set to `/subscriptions/{AZURE SUBSCRIPTION}/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.ServiceBus/namespaces/<NAMESPACE NAME>/topics/<TOPIC NAME>`. Here's an example:

```azurecli-interactive
az eventgrid event-subscription create \
    --name <my-event-subscription> \
    --source-resource-id /subscriptions/{SubID}/resourceGroups/{RG}/providers/Microsoft.EventGrid/topics/topic1 \
    --endpoint-type servicebustopic \
    --endpoint /subscriptions/{SubID}/resourceGroups/TestRG/providers/Microsoft.ServiceBus/namespaces/ns1/topics/topic1
```

You can also use the [`az eventgrid topic event-subscription`](/cli/azure/eventgrid/topic/event-subscription) command for custom topics, the [`az eventgrid system-topic event-subscription`](/cli/azure/eventgrid/system-topic/event-subscription) command for system topics, and the [`az eventgrid partner topic event-subscription create`](/cli/azure/eventgrid/partner/topic/event-subscription#az-eventgrid-partner-topic-event-subscription-create) command for partner topics.

### Use Azure PowerShell
Use the [New-AzEventGridSubscription](/powershell/module/az.eventgrid/new-azeventgridsubscription) command with `-EndpointType` set to `servicebustopic` and `-Endpoint` set to `/subscriptions/{AZURE SUBSCRIPTION}/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.ServiceBus/namespaces/<NAMESPACE NAME>/topics/<TOPIC NAME>`. Here's an example:


```azurepowershell-interactive
New-AzEventGridSubscription -ResourceGroup MyResourceGroup `
            -TopicName Topic1 `
            -EndpointType servicebustopic `
            -Endpoint /subscriptions/{SubID}/resourceGroups/TestRG/providers/Microsoft.ServiceBus/namespaces/ns1/topics/topic1 `
            -EventSubscriptionName EventSubscription1
```

You can also use the [`New-AzEventGridSystemTopicEventSubscription`](/powershell/module/az.eventgrid/new-azeventgridsystemtopiceventsubscription) command for system topics, and the [`New-AzEventGridPartnerTopicEventSubscription`](/powershell/module/az.eventgrid/new-azeventgridpartnertopiceventsubscription) command for partner topics.


[!INCLUDE [message-headers](./includes/message-headers.md)]

When you send an event to a Service Bus queue or topic as a brokered message, the `messageid` of the brokered message is an internal system ID.

The internal system ID for the message will be maintained across redelivery of the event so that you can avoid duplicate deliveries by turning on **duplicate detection** on the service bus entity. We recommend that you enable duration of the duplicate detection on the Service Bus entity to be either the time-to-live (TTL) of the event or max retry duration, whichever is longer.

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
