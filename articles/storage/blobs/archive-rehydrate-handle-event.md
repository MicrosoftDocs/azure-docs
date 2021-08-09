---
title: Handle an event on blob rehydration 
titleSuffix: Azure Storage
description: Handle an event on blob rehydration.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 08/04/2021
ms.author: tamram
ms.reviewer: fryu
ms.custom: devx-track-azurepowershell
ms.subservice: blobs
---

# Handle an event on blob rehydration 

To read a blob that is in the archive tier, you must first rehydrate the blob to the hot or cool tier. The rehydration process can take several hours to complete. When the blob is rehydrated, an [Azure Event Grid](../../event-grid/overview.md) event fires. Your application can handle this event to be notified when the rehydration process is complete.

When an event occurs, Azure Event Grid sends the event to an event handler via an endpoint. A number of Azure services can serve as event handlers, including [Azure Functions](../../azure-functions/functions-overview.md). An Azure Function is a block of code that can execute in response to an event. This how-to walks you through the process of creating an Azure Function and configuring Azure Event Grid to capture an event that occurs when a blob is rehydrated. Azure Event grid sends the event to the Azure Function, which executes code in response.

During the blob rehydration operation, you can call the [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation to check its status. However, rehydration of an archived blob may take up to 15 hours, and repeatedly polling **Get Blob Properties** to determine whether rehydration is complete is inefficient. Using Azure Event Grid to capture the event that fires when rehydration is complete offers better performance and cost optimization.

This article shows how to create and test an Azure Function in the Azure portal, but you can build Azure Functions from a variety of local development environments. For more information, see [Code and test Azure Functions locally](../../azure-functions/functions-develop-local.md).

For more information about rehydrating blobs from the archive tier, see [Rehydrate blob data from the archive tier](archive-rehydrate-overview.md).

## Create an Azure Function app

A function app is an Azure resource that serves as a container for your functions. You can use a new or existing function app to complete the steps in this article.

This article shows how to create a .NET function. You can choose to use a different language for your function. For more information about supported languages for Azure Functions, see [Supported languages in Azure Functions](../../azure-functions/supported-languages.md).

To create a new function app in the Azure portal, follow these steps:

1. In the Azure portal, search for *Function App*. Select **Function App** icon to navigate to the list of function apps in your subscription.
1. Select the **Create** button to create a new function app.
1. On the **Basics** tab, specify a resource group, and provide a unique name for the new function app.
1. Make sure that the **Publish** option is set to *Code*.
1. From the **Runtime stack** dropdown, select *.NET*. The **Version** field is automatically populated to use the latest version of .NET core.
1. Select the region for the new function app.

    :::image type="content" source="media/archive-rehydrate-handle-event/create-function-app-basics-tab.png" alt-text="Screenshot showing how to create a new function app in Azure - Basics tab":::

1. After you have completed the **Basics** tab, navigate to the **Hosting** tab.
1. On the **Hosting** tab, select the storage account where your Azure Functions will be stored. You can choose an existing storage account or create a new one.
1. Make sure that the **Operating system** field is set to *Windows*.
1. In the **Plan type** field, select *Consumption (Serverless)*. For more information about this plan, see [Azure Functions Consumption plan hosting](../../azure-functions/consumption-plan.md).

    :::image type="content" source="media/archive-rehydrate-handle-event/create-function-app-hosting-tab.png" alt-text="Screenshot showing how to create a new function app in Azure - Hosting tab":::

1. Select **Review + Create** to create the new function app.

To learn more about configuring your function app, see [Manage your function app](../../azure-functions/functions-how-to-use-azure-function-app-settings.md) in the Azure Functions documentation.

## Create an Azure Function as an Event Grid trigger

Next, create an Azure Function that will run when a blob is rehydrated. Follow these steps to create an Azure Function in the Azure portal with C# and .NET Core:

1. In the Azure portal, navigate to your new function app.
1. Select the Functions setting in the left navigation pane.
1. Select **Create** to create a new function.
1. In the **Create function** dialog, make sure that the **Development environment** dropdown is set to *Develop in Portal*.
1. in the **Select a template** section, choose *Azure Event Grid trigger* from the list of templates. For more information on why an Event Grid trigger is the recommended type of trigger for handling a Blob Storage event with an Azure Function, see [Use a function as an event handler for Event Grid events](../../event-grid/handler-functions.md).
1. Provide a name for your new function.
1. Select the **Create** button to create the new function.

    :::image type="content" source="media/archive-rehydrate-handle-event/create-function-event-grid-trigger-portal.png" alt-text="Screenshot showing how to configure an Azure Function to handle an Event Grid event":::

## Add code to the function to process the event

After you have created the function, you can add code to respond to the blob rehydration event. Navigate to the **Code + Test** page for the new function. The function code consists of a **Run** method. This function is an Event Grid trigger, which means that it runs when the appropriate Event Grid event fires. The **Run** method includes a single line that outputs information about the event to the Azure portal log streaming service.

```csharp
#r "Microsoft.Azure.EventGrid"
using Microsoft.Azure.EventGrid.Models;

public static void Run(EventGridEvent eventGridEvent, ILogger log)
{
    log.LogInformation(eventGridEvent.Data.ToString());
}
```

The log streaming service provides helpful compilation information while you are developing your Azure Function. To view the log, expand the **Logs** section at the bottom of the screen.

:::image type="content" source="media/archive-rehydrate-handle-event/view-log-streaming-service-portal.png" alt-text="Screenshot showing how to expand the log streaming service in the Azure portal":::

Next, replace the function code with the following sample code. This code parses the event data that is passed in to the Run method to extract some values, including the type of event that occurred.

```csharp
#r "Microsoft.Azure.EventGrid"
using Microsoft.Azure.EventGrid.Models;

public static void Run(EventGridEvent eventGridEvent, ILogger log)
{
    dynamic data = eventGridEvent.Data;
    dynamic api = data.api;
    dynamic url = data.url;

    // Write information about the event to the log.
    if (eventGridEvent.EventType == "Microsoft.Storage.BlobCreated" && (string)api == "CopyBlob")
    { 
        log.LogInformation("CopyBlob operation occurred. Destination blob is {0}.", (string)url);
    }
    else if (eventGridEvent.EventType == "Microsoft.Storage.BlobTierChanged" && (string)api == "SetBlobTier")
    {   
        log.LogInformation("SetBlobTier operation occurred on blob {0}.", (string)url);
    }
    else
    {
        log.LogInformation("{0} operation occurred. Blob URL: {1}", (string)api, (string)url);
    }

    // Log additional information about the event.
    log.LogInformation($@"Event details:
                        Id=[{eventGridEvent.Id}] 
                        EventType=[{eventGridEvent.EventType}] 
                        EventTime=[{eventGridEvent.EventTime}] 
                        Subject=[{eventGridEvent.Subject}] 
                        Topic=[{eventGridEvent.Topic}]");
}
```

When you save the function, the log indicates that the function was changed and whether or not it compiled successfully after the change.

:::image type="content" source="media/archive-rehydrate-handle-event/view-compilation-status-log.png" alt-text="Screenshot showing compilation status in the Azure portal log streaming service":::

For more information on developing Azure Functions, see [Guidance for developing Azure Functions](../../azure-functions/functions-reference.md).

To learn more about the information that is included when a Blob Storage event is published to an event handler, see [Azure Blob Storage as Event Grid source](../../event-grid/event-schema-blob-storage.md).

## Subscribe to blob rehydration events from a storage account

You now have a function app that contains an Azure Function that will run in response to a blob rehydration event. The next step is to create an event subscription from your storage account. The event subscription configures the storage account to publish an event through Azure Event Grid in response to an operation on a blob in your storage account. Event Grid then sends the event to the event handler endpoint that you've specified. In this case, the event handler is the Azure Function that you created in the previous section.

When you create the event subscription, you can filter which events are sent to the event handler. The events to capture when rehydrating a blob from the archive tier are **Microsoft.Storage.BlobTierChanged**, corresponding to a [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation, and **Microsoft.Storage.BlobCreated** events, corresponding to a [Copy Blob](/rest/api/storageservices/copy-blob) or [Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) operation. Depending on your scenario, you may want to handle only one of these events.

To create the event subscription, follow these steps:

1. In the Azure portal, navigate to the storage account that contains blobs to rehydrate from the archive tier.
1. Select the **Events** setting in the left navigation pane.
1. On the **Events** page, select **More options**.
1. Select **Create Event Subscription**.
1. On the **Create Event Subscription** page, in the **Event subscription details** section, provide a name for the event subscription.
1. In the **Topic details** section, provide a name for the system topic. The system topic represents one or more events that are published by Azure Storage. For more information about system topics, see [System topics in Azure Event Grid](../../event-grid/system-topics.md).
1. In the **Event Types** section, select the **Blob Created** and **Blob Tier Changed** events. Depending on how you choose to rehydrate a blob from the archive tier, one of these two events will fire.

    :::image type="content" source="media/archive-rehydrate-handle-event/select-event-types-portal.png" alt-text="Screenshot showing how to select event types for blob rehydration events in the Azure portal":::

1. In the **Endpoint details** section, select *Azure Function* from the dropdown menu.
1. Choose **Select an endpoint** to specify the function that you created in the previous section. In the **Select Azure Function** dialog, choose the subscription, resource group, and function app for your Azure Function. Finally, select the function name from the dropdown and choose **Confirm selection**.

    :::image type="content" source="media/archive-rehydrate-handle-event/select-azure-function-endpoint-portal.png" alt-text="Screenshot showing how to select an Azure Function as the endpoint for an Event Grid subscription":::

1. Select the **Create** button to create the event subscription and begin sending events to the Azure Function event handler.

To learn more about event subscriptions, see [Azure Event Grid concepts](../../event-grid/concepts.md#event-subscriptions).

## Test the Azure Function event handler

To test the Azure Function, you can trigger an event in the storage account that contains the event subscription. The event subscription is filtering on two events, **Microsoft.Storage.BlobCreated** and **Microsoft.Storage.BlobTierChanged**. For more information on how to filter events by type, see [How to filter events for Azure Event Grid](../../event-grid/how-to-filter-events.md).

> [!TIP]
> Although the goal of this how-to is to handle these events in the context of blob rehydration, for testing purposes it may helpful to observe these events in response to uploading a blob or changing its tier, because the event fires immediately.

This section describes different options for testing the Azure Function by triggering an event. To perform the tests, set up your environment as follows:

1. Open one browser window to a container in the storage account where you created the event subscription.
1. Open a second browser window to the **Code + Test** page for your Azure Function.
1. Expand the **Logs** window on the **Code + Test** page, and make sure that the logging service is started. You may need to stop and restart the logging service.

### Rehydrate a blob

Rehydrating a blob can take up to 15 hours, depending on the rehydration priority setting. If you set the rehydration priority to **High**, rehydration may complete in under one hour for blobs that are less than 10 GB in size. However, a high-priority rehydration incurs a greater cost. For more information, see [Rehydrate blob data from the archive tier](archive-rehydrate-overview.md#rehydrate-an-archived-blob-to-an-online-tier).

> [!NOTE]
> If you rehydrate a blob with standard priority using the Azure Function provided above, the logging service may time out before the event is triggered. The default logging service timeout period is two hours. You can change the timeout by changing the App Service setting SCM_LOGSTREAM_TIMEOUT (???I can't find any info about how to do this???), or you can use Application Insights to view live metrics. For more information about using the Application Insights live metrics stream with your Azure Function, see [Enable streaming execution logs in Azure Functions](../../azure-functions/streaming-logs.md) ???this doc is out of date???.

#### Rehydrate a blob with Set Blob Tier

To rehydrate a blob by changing its tier from archive to hot or cool with a **Set Blob Tier** operation, follow these steps:

1. Locate the blob to rehydrate in the Azure portal.
1. Select the More button on the right side of the page.
1. Select **Change tier**.
1. Select the target access tier from the **Access tier** dropdown.
1. From the **Rehydrate priority** dropdown, select the desired rehydration priority. Keep in mind that setting the rehydration priority to *High* results in a faster rehydration, but incurs a greater cost.

    :::image type="content" source="media/archive-rehydrate-handle-event/rehydrate-change-tier-portal.png" alt-text="Screenshot showing how to rehydrate a blob from the archive tier in the Azure portal ":::

1. Select the **Save** button.

While the blob is rehydrating, you can check its status in the Azure portal by displaying the **Change tier** dialog again:

:::image type="content" source="media/archive-rehydrate-handle-event/rehydration-status-portal.png" alt-text="Screenshot showing the rehydration status for a blob in the Azure portal":::

When the rehydration is complete, the **Microsoft.Storage.BlobTierChanged** event fires. The Azure Function log displays output similar to the following example:

```
2021-08-03T16:21:02.950 [Information] Executing 'Functions.RehydrationEventHandler' (Reason='EventGrid trigger fired at 2021-08-03T16:21:02.9496370+00:00', Id=17dfc2f8-86a4-4b2d-a36c-4814813b20da)
2021-08-03T16:21:02.950 [Information] SetBlobTier operation occurred on blob https://blobrehydrationsamples.blob.core.windows.net/sample-container/blob6.txt.
2021-08-03T16:21:02.951 [Information] Event details:Id=[857426b8-5010-0002-009a-87586806deda]EventType=[Microsoft.Storage.BlobTierChanged]EventTime=[8/3/2021 4:21:02 PM]Subject=[/blobServices/default/containers/sample-container/blobs/blob6.txt]Topic=[/subscriptions/32580eb9-bf6f-47b2-9f91-6f52f4c03736/resourceGroups/rehydration-samples/providers/Microsoft.Storage/storageAccounts/blobrehydrationsamples]
2021-08-03T16:21:02.951 [Information] Executed 'Functions.RehydrationEventHandler' (Succeeded, Id=17dfc2f8-86a4-4b2d-a36c-4814813b20da, Duration=1ms)
```

### Rehydrate a blob with Copy Blob

To rehydrate a blob by changing its tier from archive to hot or cool with a **Copy Blob** operation, use PowerShell, Azure CLI, or one of the Azure Storage client libraries to copy the archived blob to a new destination blob in an online tier. The following examples show how to copy an archived blob with PowerShell or Azure CLI:

Keep in mind that when you copy an archived blob to an online tier, the source and destination blobs must have different names.

# [PowerShell](#tab/powershell)

To copy an archived blob to an online tier with PowerShell, call the [Start-AzStorageBlobCopy](/powershell/module/az.storage/start-azstorageblobcopy) command and specify the target tier and the rehydration priority. Remember to replace placeholders in angle brackets with your own values:

```powershell
# Initialize these variables with your values.
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$srcContainerName = "<source-container>"
$destContainerName = "<dest-container>"
$srcBlobName = "<source-blob>"
$destBlobName = "<dest-blob>"

# Get the storage account context
$ctx = (Get-AzStorageAccount `
        -ResourceGroupName $rgName `
        -Name $accountName).Context

# Copy the source blob to a new destination blob in hot tier with standard priority.
Start-AzStorageBlobCopy -SrcContainer $srcContainerName `
    -SrcBlob $srcBlobName `
    -DestContainer $destContainerName `
    -DestBlob $destBlobName `
    -StandardBlobTier Hot `
    -RehydratePriority Standard `
    -Context $ctx
```

# [Azure CLI](#tab/azure-cli)

To copy an archived blob to an online tier with Azure CLI, call the [az storage blob copy start](/cli/azure/storage/blob/copy#az_storage_blob_copy_start) command and specify the target tier and the rehydration priority. Remember to replace placeholders in angle brackets with your own values:

```azurecli
az storage blob copy start /
    --source-container <source-container> /
    --source-blob <source-blob> /
    --destination-container <dest-container> /
    --destination-blob <dest-blob> /
    --account-name <storage-account> /
    --tier hot /
    --rehydrate-priority standard /
    --auth-mode login
```

---

When the rehydration is complete, the **Microsoft.Storage.BlobCreated** event fires to indicate that the destination blob has been rehydrated. The Azure Function log displays output similar to the following example:

```
2021-08-03T16:38:02.968 [Information] Executing 'Functions.RehydrationEventHandler' (Reason='EventGrid trigger fired at 2021-08-03T16:38:02.9679048+00:00', Id=17fd3a9d-3852-468d-8ffc-0f888a9028b1)
2021-08-03T16:38:02.968 [Information] CopyBlob operation occurred. Destination blob is https://blobrehydrationsamples.blob.core.windows.net/sample-container/blob7-copy.txt.
2021-08-03T16:38:02.968 [Information] Event details:Id=[857426b8-5010-0002-009a-875868064700]EventType=[Microsoft.Storage.BlobCreated]EventTime=[8/3/2021 4:38:02 PM]Subject=[/blobServices/default/containers/sample-container/blobs/blob7-copy.txt]Topic=[/subscriptions/32580eb9-bf6f-47b2-9f91-6f52f4c03736/resourceGroups/rehydration-samples/providers/Microsoft.Storage/storageAccounts/blobrehydrationsamples]
2021-08-03T16:38:02.968 [Information] Executed 'Functions.RehydrationEventHandler' (Succeeded, Id=17fd3a9d-3852-468d-8ffc-0f888a9028b1, Duration=0ms)
```

## See also

- [Access tiers for Azure Blob Storage - hot, cool, and archive](storage-blob-storage-tiers.md)
- [Rehydrate blob data from the archive tier](archive-rehydrate-overview.md)
- [Reacting to Blob storage events](storage-blob-event-overview.md)
