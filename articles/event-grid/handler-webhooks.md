---
title: Webhook Event Handlers for Azure Event Grid
description: Learn how to use webhooks as event handlers for Azure Event Grid events. Azure Automation runbooks and logic apps are supported as event handlers via webhooks.
#customer intent: As a developer, I want to configure a webhook as an event handler for Azure Event Grid so that I can process events at my own HTTP endpoint.
ms.topic: concept-article
ms.date: 03/27/2026
author: spelluru
ms.author: spelluru
ms.reviewer: spelluru
# Customer intent: As a developer or architect, I want to learn how to use Webhooks, Logic Apps, and Azure Automation runbooks as events handlers for Azure Event Grid events.
---

# Webhooks, Automation runbooks, and Logic Apps as event handlers for Azure Event Grid events
An event handler receives events from an event source through Event Grid and processes those events. You can use any webhook as an event handler for events that Event Grid forwards. The webhook doesn't need to be hosted in Azure to handle events. Event Grid supports only HTTPS webhook endpoints. You can also use an Azure Automation runbook or an Azure Logic App as an event handler through webhooks. This article provides links to conceptual, quickstart, and tutorial articles that give you more information. 

> [!NOTE]
> Even though you can use **Webhook** as an **endpoint type** to configure an Azure function as an event handler, use **Azure Function** as an endpoint type. For more information, see [Azure function as an event handler](handler-functions.md).

## Webhooks
For an overview and examples of using webhooks as event handlers, see the following articles. 

|Title  |Description  |
|---------|---------|
| Quickstart: create and route custom events with - [Azure CLI](custom-event-quickstart.md), [PowerShell](custom-event-quickstart-powershell.md), and [portal](custom-event-quickstart-portal.md). | Shows how to send custom events to a webhook. |
| Quickstart: route Blob storage events to a custom web endpoint with - [Azure CLI](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json), [PowerShell](../storage/blobs/storage-blob-event-quickstart-powershell.md?toc=%2fazure%2fevent-grid%2ftoc.json), and [portal](blob-event-quickstart-portal.md). | Shows how to send blob storage events to a webhook. |
| [Quickstart: send container registry events](/azure/container-registry/container-registry-event-grid-quickstart?toc=%2fazure%2fevent-grid%2ftoc.json) | Shows how to use Azure CLI to send Container Registry events. |
| [Overview: receive events to an HTTP endpoint](receive-events.md) | Describes how to validate an HTTP endpoint to receive events from an event subscription, and receive and deserialize events. |


## Azure Automation
You can process events by using Azure Automation runbooks. Event Grid supports processing of events by using automated runbooks through webhooks. You create a webhook for the runbook and then use the webhook handler. For an example, see the following tutorial: 

|Title  |Description  |
|---------|---------|
|[Tutorial: Azure Automation with Event Grid and Microsoft Teams](ensure-tags-exists-on-new-virtual-machines.md) |Create a virtual machine, which sends an event. The event triggers an Automation runbook that tags the virtual machine, and triggers a message that is sent to a Microsoft Teams channel. |


## Logic Apps
Use **Logic Apps** to implement business processes that process Event Grid events. You don't create a webhook explicitly in this scenario. When you configure the logic app to handle events from Event Grid, the webhook is created automatically. For examples, see the following tutorials: 

|Title  |Description  |
|---------|---------|
| [Tutorial: Monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-logic-app.md) | A logic app monitors changes to a virtual machine and sends emails about those changes. |
| [Tutorial: Send email notifications about Azure IoT Hub events using Logic Apps](publish-iot-hub-events-to-logic-apps.md) | A logic app sends a notification email every time a device is added to your IoT hub. |
| [Tutorial: Respond to Azure Service Bus events received via Azure Event Grid by using Azure Functions and Azure Logic Apps](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Event Grid sends messages from Service Bus topic to function app and logic app. |

## REST example (for PUT)

```json
{
	"properties": 
	{
		"destination": 
		{
			"endpointType": "WebHook",
			"properties": 
			{
				"endpointUrl": "<WEB HOOK URL>",
				"maxEventsPerBatch": 1,
				"preferredBatchSizeInKilobytes": 64
			}
		},
		"eventDeliverySchema": "EventGridSchema"
	}
}
```

## Related content
See the [Event handlers](event-handlers.md) article for a list of supported event handlers. 
