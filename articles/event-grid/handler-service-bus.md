---
title: Configure Service Bus as an Event Grid Handler
description: Learn to configure Service Bus queues and topics as event handlers for Azure Event Grid to process events in enterprise applications.
#customer intent: As a developer, I want to configure Service Bus queues or topics as event handlers so that I can process Azure Event Grid events in enterprise applications.  
ms.topic: how-to
ms.date: 07/23/2026
ai-usage: ai-assisted
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:07/29/2025
---

# Configure Service Bus queues and topics as event handlers for Azure Event Grid events

Azure Event Grid supports event-driven architectures by routing events from sources to handlers. This article shows you how to configure Azure Service Bus queues and topics as event handlers for Event Grid events. You configure the queue or topic to process events in enterprise applications by using the Azure portal, Azure CLI, Azure PowerShell, or REST API.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- An Event Grid topic, system topic, custom topic, or partner topic to subscribe to. For more information, see [Create an Event Grid topic or a domain](create-custom-topic.md).
- A Service Bus namespace with a queue or topic to receive the events. For more information, see [Create a Service Bus namespace and a queue by using the Azure portal](../service-bus-messaging/service-bus-quickstart-portal.md).
- Permission to create an event subscription on the source topic and to send messages to the target Service Bus queue or topic.

## Service Bus queues

Route events in Event Grid directly to Service Bus queues for buffering or command and control scenarios in enterprise applications.

### Configure a Service Bus queue by using the Azure portal

In the Azure portal, while creating an event subscription, select **Service Bus Queue** as the endpoint type, and then select **Select an endpoint** to choose a Service Bus queue.

:::image type="content" source="./media/handler-service-bus/queue.png" lightbox="./media/handler-service-bus/queue.png" alt-text="Screenshot of configuring a Service Bus queue as an event handler in Azure Event Grid.":::

> [!NOTE]
> If you use a session-enabled queue or topic subscription as the destination, set the session property on the event by using a delivery property with the header name `SessionId`.
 
### Configure a Service Bus queue by using the Azure CLI

Use the [`az eventgrid event-subscription create`](/cli/azure/eventgrid/event-subscription) command with `--endpoint-type` set to `servicebusqueue` and `--endpoint` set to `/subscriptions/{AZURE SUBSCRIPTION}/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.ServiceBus/namespaces/<NAMESPACE NAME>/queues/<QUEUE NAME>`. Here's an example:

```azurecli-interactive
az eventgrid event-subscription create \
    --name <my-event-subscription> \
    --source-resource-id /subscriptions/{SubID}/resourceGroups/{RG}/providers/Microsoft.EventGrid/topics/topic1 \
    --endpoint-type servicebusqueue \
    --endpoint /subscriptions/{SubID}/resourceGroups/TestRG/providers/Microsoft.ServiceBus/namespaces/ns1/queues/queue1
```

You can also use the [`az eventgrid topic event-subscription`](/cli/azure/eventgrid/topic/event-subscription) command for custom topics, the [`az eventgrid system-topic event-subscription`](/cli/azure/eventgrid/system-topic/event-subscription) command for system topics, and the [`az eventgrid partner topic event-subscription create`](/cli/azure/eventgrid/partner/topic/event-subscription#az-eventgrid-partner-topic-event-subscription-create) command for partner topics.

### Configure a Service Bus queue by using Azure PowerShell

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

Route events in Event Grid directly to Service Bus topics for command and control messaging scenarios.

### Configure a Service Bus topic by using the Azure portal

In the Azure portal, while creating an event subscription, select **Service Bus Topic** as the endpoint type, and then select **Select an endpoint** to choose a Service Bus topic.

:::image type="content" source="./media/handler-service-bus/topic.png" lightbox="./media/handler-service-bus/topic.png" alt-text="Screenshot of configuring a Service Bus topic as an event handler in Azure Event Grid.":::

### Configure a Service Bus topic by using the Azure CLI

Use the [`az eventgrid event-subscription create`](/cli/azure/eventgrid/event-subscription) command with `--endpoint-type` set to `servicebustopic` and `--endpoint` set to `/subscriptions/{AZURE SUBSCRIPTION}/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.ServiceBus/namespaces/<NAMESPACE NAME>/topics/<TOPIC NAME>`. Here's an example:

```azurecli-interactive
az eventgrid event-subscription create \
    --name <my-event-subscription> \
    --source-resource-id /subscriptions/{SubID}/resourceGroups/{RG}/providers/Microsoft.EventGrid/topics/topic1 \
    --endpoint-type servicebustopic \
    --endpoint /subscriptions/{SubID}/resourceGroups/TestRG/providers/Microsoft.ServiceBus/namespaces/ns1/topics/topic1
```

You can also use the [`az eventgrid topic event-subscription`](/cli/azure/eventgrid/topic/event-subscription) command for custom topics, the [`az eventgrid system-topic event-subscription`](/cli/azure/eventgrid/system-topic/event-subscription) command for system topics, and the [`az eventgrid partner topic event-subscription create`](/cli/azure/eventgrid/partner/topic/event-subscription#az-eventgrid-partner-topic-event-subscription-create) command for partner topics.

### Configure a Service Bus topic by using Azure PowerShell

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

The internal system ID for the message persists across redelivery of the event so that you can avoid duplicate deliveries by turning on **duplicate detection** on the Service Bus entity. Set the duplicate detection duration on the Service Bus entity to either the time-to-live (TTL) of the event or the maximum retry duration, whichever is longer.

## Delivery properties

When you use event subscriptions, you can set up HTTP headers to include in delivered events. This capability supports setting custom headers that the destination requires. You can set custom headers on the events delivered to Azure Service Bus queues and topics.

Azure Service Bus supports the following message properties when you send single messages.

| Header name | Header type |
| :-- | :-- |
| `MessageId` | Dynamic |  
| `PartitionKey` | Static or dynamic |
| `SessionId` | Static or dynamic |
| `CorrelationId` | Static or dynamic |
| `Label` | Static or dynamic |
| `ReplyTo` | Static or dynamic | 
| `ReplyToSessionId` | Static or dynamic |
| `To` | Static or dynamic |
| `ViaPartitionKey` | Static or dynamic |

> [!NOTE]
> - The default value of `MessageId` is the internal ID of the Event Grid event. You can override it. For example, use `data.field`.
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

> [!NOTE]
> When a failover occurs for a Service Bus namespace that's [Geo-Disaster Recovery](../service-bus-messaging/service-bus-geo-dr.md) enabled, the secondary namespace doesn't emit events to Event Grid. You must manually add the Event Grid subscription for the secondary namespace.

## Related content
For a list of supported event handlers, see the [Event handlers](event-handlers.md) article.
