---
title: Event Grid Event Handler with Azure Functions
description: Learn how to use functions created and hosted in Azure Functions as event handlers that process, transform, or validate Azure Event Grid events.
ms.topic: concept-article
ms.date: 08/27/2026
ai-usage: ai-assisted
# Customer intent: I want to know details about using an Azure function as an event handler for Azure Event Grid events.
---

# Use a function as an event handler for Event Grid events

An event handler is the destination where Azure Event Grid sends an event for processing. Azure automatically configures several services to handle events, and Azure Functions is one of them.

When you use a function as an event handler, you run custom code in response to each event without provisioning or managing servers. For example, Event Grid can use a function as an [anti-corruption layer](/azure/architecture/patterns/anti-corruption-layer) that transforms or validates events before forwarding them to downstream systems.

This article describes the two ways to use a function as an event handler and explains which approach to use.

To use a function in Azure as a handler for events, follow one of these approaches:

- Use an [Event Grid trigger](../azure-functions/functions-bindings-event-grid-trigger.md). Specify **Azure Function** as the **endpoint type**. Then specify the function app and the function that handles events.
- Use an [HTTP trigger](../azure-functions/functions-bindings-http-webhook.md). Specify **Web Hook** as the **endpoint type**. Then specify the URL for the function that handles events.

Use the first approach (Event Grid trigger). It has the following advantages over the second approach:

- Event Grid automatically validates Event Grid triggers. With generic HTTP triggers, you must implement the [validation response](end-point-validation-event-grid-events-schema.md) yourself.
- Event Grid automatically adjusts the rate at which it delivers events to a function that an Event Grid event triggers, based on the perceived rate at which the function can process events. This rate-match feature averts delivery errors that stem from the inability of a function to process events, because the function's event processing rate can vary over time. To improve efficiency at high throughput, enable batching on the event subscription. For more information, see [Enable batching](#enable-batching).

> [!NOTE]
> - When you use an Event Grid trigger to add an event subscription by using an Azure function, Event Grid fetches the access key for the target function by using the Event Grid service principal's credentials. Event Grid receives the permissions when you register the Event Grid resource provider in your Azure subscription.
> - If you protect your Azure function with a **Microsoft Entra ID** application, you must take the generic webhook approach by using the HTTP trigger. Use the Azure function endpoint as a webhook URL when adding the subscription.

## Tutorials

| Title | Description |
| --- | --- |
| [Quickstart: Handle events with function](custom-event-to-function.md) | Sends a custom event to a function for processing. |
| [Tutorial: stream big data into a data warehouse](event-hubs-integration.md) | When an event hub creates a Capture file, Event Grid sends an event to a function app. The app retrieves the Capture file and migrates data to a data warehouse. |
| [Tutorial: Azure Service Bus to Azure Event Grid integration examples](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Event Grid sends messages from a Service Bus topic to a function app and a logic app. |

## REST API example

The following example shows the request body for a PUT operation that creates an event subscription with an Azure function as the event handler. It sets the target function's resource ID and enables batching.

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

For higher throughput, enable batching on the subscription. If you use the Azure portal, you can set maximum events per batch and the preferred batch size in kilobytes when you create a subscription or afterward.

Configure batch settings by using the Azure portal, PowerShell, CLI, or a Resource Manager template.

### Azure portal

When you create a subscription in the portal, on the **Create Event Subscription** page, switch to the **Advanced Features** tab, and set values for **Max events per batch** and **Preferred batch size in kilobytes**.

:::image type="content" source="./media/custom-event-to-function/enable-batching.png" alt-text="Screenshot of the Advanced Features tab on the Create Event Subscription page showing the batch settings.":::

Update these values for an existing subscription on the **Features** tab of the **Event Grid Topic** page.

:::image type="content" source="./media/custom-event-to-function/features-batch-settings.png" alt-text="Screenshot of the Features tab on the Event Grid Topic page showing batch settings for an existing subscription.":::

### Azure Resource Manager template

Set `maxEventsPerBatch` and `preferredBatchSizeInKilobytes` in an Azure Resource Manager template. For more information, see [Microsoft.EventGrid eventSubscriptions template reference](/azure/templates/microsoft.eventgrid/eventsubscriptions).

### Azure CLI

Use the [`az eventgrid event-subscription create`](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-create) command to configure batch-related settings by using the following parameters: `--max-events-per-batch` or `--preferred-batch-size-in-kilobytes`.

### Azure PowerShell

Use the [New-AzEventGridSubscription](/powershell/module/az.eventgrid/new-azeventgridsubscription) or [Update-AzEventGridSubscription](/powershell/module/az.eventgrid/update-azeventgridsubscription) cmdlet to configure batch-related settings. Use the `-MaxEventsPerBatch` or `-PreferredBatchSizeInKiloBytes` parameter to set your preferences.

## Related content

For a list of supported event handlers, see the [Event handlers](event-handlers.md) article.
