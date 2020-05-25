---
title: Azure function as an event handler for Azure Event Grid events
description: Describes how you can use Azure functions as event handlers for Event Grid events. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: spelluru
---

# Azure function as an event handler for Event Grid events

An event handler is the place where the event is sent. The handler takes an action to process the event. Several Azure services are automatically configured to handle events and **Azure Functions** is one of them. 

Use **Azure Functions** in a serverless architecture to respond to events from Event Grid. When using an Azure function as the handler, use the Event Grid trigger instead of the generic HTTP trigger. Event Grid automatically validates Event Grid triggers. With generic HTTP triggers, you must implement the [validation response](webhook-event-delivery.md) yourself.

For more information, see [Event Grid trigger for Azure Functions](../azure-functions/functions-bindings-event-grid.md) for an overview of using the Event Grid trigger in functions.

## Tutorials

|Title  |Description  |
|---------|---------|
| [Quickstart: Handle events with function](custom-event-to-function.md) | Sends a custom event to a function for processing. |
| [Tutorial: automate resizing uploaded images using Event Grid](resize-images-on-storage-blob-upload-event.md) | Users upload images through web app to storage account. When a storage blob is created, Event Grid sends an event to the function app, which resizes the uploaded image. |
| [Tutorial: stream big data into a data warehouse](event-grid-event-hubs-integration.md) | When Event Hubs creates a Capture file, Event Grid sends an event to a function app. The app retrieves the Capture file and migrates data to a data warehouse. |
| [Tutorial: Azure Service Bus to Azure Event Grid integration examples](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Event Grid sends messages from Service Bus topic to a function app and a logic app. |

## REST example (for PUT)

```json
{
	"properties": 
	{
		"destination": 
		{
			"endpointType": "AzureFunction",
			"properties": 
			{
				"resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.Web/sites/<FUNCTION APP NAME>/functions/<FUNCTION NAME>",
				"maxEventsPerBatch": 1,
				"preferredBatchSizeInKilobytes": 64
			}
		},
		"eventDeliverySchema": "EventGridSchema"
	}
}
```

## Next steps
See the [Event handlers](event-handlers.md) article for a list of supported event handlers. 
