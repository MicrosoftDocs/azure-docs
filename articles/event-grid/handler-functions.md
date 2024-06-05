---
title: Use a function in Azure as an event handler for Azure Event Grid events
description: Describes how you can use functions created in and hosted by Azure Functions as event handlers for Event Grid events. 
ms.topic: conceptual
ms.date: 08/31/2023
---

# Use a function as an event handler for Event Grid events

An event handler is the place where the event is sent. The handler takes an action to process the event. Several Azure services are automatically configured to handle events and **Azure Functions** is one of them. 


To use a function in Azure as a handler for events, follow one of these approaches: 

-	Use [Event Grid trigger](../azure-functions/functions-bindings-event-grid-trigger.md).  Specify **Azure Function** as the **endpoint type**. Then, specify the function app and the function that will handle events. 
-	Use [HTTP trigger](../azure-functions/functions-bindings-http-webhook.md).  Specify **Web Hook** as the **endpoint type**. Then, specify the URL for the function that will handle events. 

We recommend that you use the first approach (Event Grid trigger) as it has the following advantages over the second approach:
-	Event Grid automatically validates Event Grid triggers. With generic HTTP triggers, you must implement the [validation response](webhook-event-delivery.md) yourself.
-	Event Grid automatically adjusts the rate at which events are delivered to a function triggered by an Event Grid event based on the perceived rate at which the function can process events. This rate match feature averts delivery errors that stem from the inability of a function to process events as the function’s event processing rate can vary over time. To improve efficiency at high throughput, enable batching on the event subscription. For more information, see [Enable batching](#enable-batching).

> [!NOTE]
> - When you an Event Grid trigger to add an event subscription using an Azure function, Event Grid fetches the access key for the target function using Event Grid service principal's credentials. The permissions are granted to Event Grid when you register the Event Grid resource provider in their Azure subscription. 
> - If you protect your Azure function with an **Microsoft Entra ID** application, you'll have to take the generic webhook approach using the HTTP trigger. Use the Azure function endpoint as a webhook URL when adding the subscription.

## Tutorials

|Title  |Description  |
|---------|---------|
| [Quickstart: Handle events with function](custom-event-to-function.md) | Sends a custom event to a function for processing. |
| [Tutorial: automate resizing uploaded images using Event Grid](resize-images-on-storage-blob-upload-event.md) | Users upload images through web app to storage account. When a storage blob is created, Event Grid sends an event to the function app, which resizes the uploaded image. |
| [Tutorial: stream big data into a data warehouse](event-hubs-integration.md) | When Event Hubs creates a Capture file, Event Grid sends an event to a function app. The app retrieves the Capture file and migrates data to a data warehouse. |
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
				"maxEventsPerBatch": 10,
				"preferredBatchSizeInKilobytes": 64
			}
		},
		"eventDeliverySchema": "EventGridSchema"
	}
}
```

## Enable batching
For a higher throughput, enable batching on the subscription. If you're using the Azure portal, you can set maximum events per batch and the preferred batch size in kilo bytes at the time of creating a subscription or after the creation. 

You can configure batch settings using the Azure portal, PowerShell, CLI, or Resource Manager template. 

### Azure portal
At the time creating a subscription in the UI, on the **Create Event Subscription** page, switch to the **Advanced Features** tab, and set values for **Max events per batch** and **Preferred batch size in kilobytes**. 
    
:::image type="content" source="./media/custom-event-to-function/enable-batching.png" alt-text="Enable batching at the time of creating a subscription":::

You can update these values for an existing subscription on the **Features** tab of the **Event Grid Topic** page. 

:::image type="content" source="./media/custom-event-to-function/features-batch-settings.png" alt-text="Enable batching after creation":::

### Azure Resource Manager template
You can set **maxEventsPerBatch** and **preferredBatchSizeInKilobytes** in an Azure Resource Manager template. For more information, see [Microsoft.EventGrid eventSubscriptions template reference](/azure/templates/microsoft.eventgrid/eventsubscriptions).

### Azure CLI
You can use the [`az eventgrid event-subscription create`](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-create&preserve-view=true) command to configure batch-related settings using the following parameters: `--max-events-per-batch` or `--preferred-batch-size-in-kilobytes`.

### Azure PowerShell
You can use the [New-AzEventGridSubscription](/powershell/module/az.eventgrid/new-azeventgridsubscription) or [Update-AzEventGridSubscription](/powershell/module/az.eventgrid/update-azeventgridsubscription) cmdlet to configure batch-related settings using the following parameters: `-MaxEventsPerBatch` or `-PreferredBatchSizeInKiloBytes`.

> [!NOTE]
> When you use Event Grid Trigger, the Event Grid service fetches the client secret for the target Azure function, and uses it to deliver events to the Azure function. If you protect your azure function with a Microsoft Entra application, you have to take the generic web hook approach and use the HTTP Trigger.

## Next steps
See the [Event handlers](event-handlers.md) article for a list of supported event handlers.
