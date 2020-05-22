---
title: Event hub as an event handler for Azure Event Grid events
description: Describes how you can use event hubs as event handlers for Azure Event Grid events.
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: spelluru
---

# Event hub as an event handler for Azure Event Grid events
An event handler is the place where the event is sent. The handler takes an action to process the event. Several Azure services are automatically configured to handle events and **Azure Event Hubs** is one of them. 

Use **Event Hubs** when your solution gets events from Event Grid faster than it can process the events. Once the events are in an event hub, your application can process events from the event hub at its own schedule. You can scale your event processing to handle the incoming events.

## Tutorials
See the following examples: 

|Title  |Description  |
|---------|---------|
| [Quickstart: Route custom events to Azure Event Hubs with Azure CLI](custom-event-to-eventhub.md) | Sends a custom event to an event hub for processing by an application. |
| [Resource Manager template: Create an Event Grid custom topic and send events to an event hub](https://github.com/Azure/azure-quickstart-templates/tree/master/101-event-grid-event-hubs-handler)| A Resource Manager template that creates a subscription for a custom topic. It sends events to an Azure Event Hubs. |

## Message properties
If you use an **event hub** as an event handler for events from Event Grid, set the following message headers: 

| Property name | Description |
| ------------- | ----------- | 
| aeg-subscription-name | Name of event subscription. |
| aeg-delivery-count | <p>Number of attempts made for the event.</p> <p>Example: "1"</p> |
| aeg-event-type | <p>Type of the event.</p><p> Example: "Microsoft.Storage.blobCreated"</p> | 
| aeg-metadata-version | <p>Metadata version of the event.</p> <p>Example: "1".</p><p> For **Event Grid event schema**, this property represents the metadata version and for **cloud event schema**, it represents the **spec version**. </p>|
| aeg-data-version | <p>Data version of the event.</p><p>Example: "1".</p><p>For **Event Grid event schema**, this property represents the data version and for **cloud event schema**, it doesn't apply.</p> |
| aeg-output-event-id | ID of the Event Grid event. |

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

## Next steps
See the [Event handlers](event-handlers.md) article for a list of supported event handlers. 
