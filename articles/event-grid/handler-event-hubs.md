---
title: Event hub as an event handler for Azure Event Grid events
description: Describes how you can use event hubs as event handlers for Azure Event Grid events.
ms.topic: conceptual
ms.date: 09/19/2023
---

# Event hub as an event handler for Azure Event Grid events
An event handler is the place where the event is sent. The handler takes an action to process the event. Several Azure services are automatically configured to handle events and **Azure Event Hubs** is one of them. 

Use **Event Hubs** when your solution gets events from Event Grid faster than it can process the events. Once the events are in an event hub, your application can process events from the event hub at its own schedule. You can scale your event processing to handle the incoming events.

## Tutorials
See the following examples: 

|Title  |Description  |
|---------|---------|
| [Quickstart: Route custom events to Azure Event Hubs with Azure CLI](custom-event-to-eventhub.md) | Sends a custom event to an event hub for processing by an application. |
| [Resource Manager template: Create an Event Grid custom topic and send events to an event hub](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventgrid/event-grid-event-hubs-handler)| A Resource Manager template that creates a subscription for a custom topic. It sends events to an Azure Event Hubs. |

[!INCLUDE [message-headers](./includes/message-headers.md)]


## REST examples (for PUT)


### Event hub

```json
{
  "properties": 
  {
    "destination": 
    {
      "endpointType": "EventHub",
      "properties": 
      {
        "resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.EventHub/namespaces/<EVENT HUBS NAMESPACE NAME>/eventhubs/<EVENT HUB NAME>"
      }
    },
    "eventDeliverySchema": "EventGridSchema"
  }
}
```

### Event hub - delivery with managed identity

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
        "endpointType": "EventHub",
        "properties": 
        {
          "resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.EventHub/namespaces/<EVENT HUBS NAMESPACE NAME>/eventhubs/<EVENT HUB NAME>"
        }
      }
    },
    "eventDeliverySchema": "EventGridSchema"
  }
}
```

## Delivery properties
Event subscriptions allow you to set up HTTP headers that are included in delivered events. This capability allows you to set custom headers that the destination requires. You can set custom headers on the events that are delivered to Azure Event Hubs.

If you need to publish events to a specific partition within an event hub, set the `PartitionKey` property on your event subscription to specify the partition key that identifies the target event hub partition.

| Header name | Header type |
| :-- | :-- |
|`PartitionKey` | Static or dynamic |

For more information, see [Custom delivery properties](delivery-properties.md). 

## Next steps
See the [Event handlers](event-handlers.md) article for a list of supported event handlers. 
