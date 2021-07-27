---
title: Trigger an event when an archived blob is rehydrated 
titleSuffix: Azure Storage
description: Trigger an event when an archived blob is rehydrated.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 07/23/2021
ms.author: tamram
ms.reviewer: fryu
ms.subservice: blobs
---

# Trigger an event when an archived blob is rehydrated 

TBD

recommend reading through this article

## About rehydration

To read data in archive storage, you must first change the tier of the blob to hot or cool. This process is known as rehydration and can take hours to complete.

## Configure Azure Event Grid to raise an event on blob rehydration

You can change the tier of a blob by calling one of the following operations:

- [Set Blob Tier](/rest/api/storageservices/set-blob-tier) changes the blob tier.
- [Copy Blob](/rest/api/storageservices/copy-blob)/[Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) can create a destination blob in a new tier.

The following table describes the events that are raised when you change the tier of a blob with one of these operations:

| Operation status | Set Blob Tier | Copy Blob or Copy Blob from URL |
|--|--|--|
| When operation initiates | Microsoft.Storage.AsyncOperationInitiated | Microsoft.Storage.AsyncOperationInitiated |
| When operation completes | Microsoft.Storage.BlobTierChanged | Microsoft.Storage.BlobCreated |

a blob is rehydrated

## Configure an event handler

Azure Event Grid directs an event that is raised by a source such as Blob Storage to an event handler. Your application can integrate with the event handler to process and respond to the event. To handle the event raised on blob rehydration, you must first decide which event handler you want to use. Some Azure services that can serve as event handlers include:

- [Web hooks](../../event-grid/handler-webhooks.md#webhooks)
- [Azure Functions](../../event-grid/handler-functions.md)
- [Event Hubs](../../event-grid/handler-event-hubs.md)
- [Service Bus](../../event-grid/handler-service-bus.md)
- [Relay hybrid connections](../../event-grid/handler-relay-hybrid-connections.md)
- [Queue Storage](../../event-grid/handler-storage-queues.md)
- [Azure Automation](../../event-grid/handler-webhooks.md#azure-automation)
- [Logic Apps](../../event-grid/handler-webhooks.md#logic-apps)

To learn about supported event handlers in Azure, see **Event handlers** in [What is Azure Event Grid?](../../event-grid/overview.md#event-handlers)

The Azure Event Grid documentation provides how-to guidance for setting up some event handlers for Blob Storage events. Use the following links to learn how to configure event handling in the Azure portal, PowerShell, Azure CLI, or with an Azure Resource Manager template. Keep in mind that these links represent only a subset of the possible configuration options.

# [Azure portal](#tab/portal)

- [Web hook](../../event-grid/handler-webhooks.md): A web endpoint can serve as an event handler. To learn about using a web endpoint to handle Blob storage events, see [Use Azure Event Grid to route Blob storage events to web endpoint (Azure portal)](../../event-grid/blob-event-quickstart-portal.md).
- [Azure Functions](../../event-grid/handler-functions.md): Azure Functions are automatically configured to handle events. To learn about using the Azure portal to configure an Azure Function to handle an event, see [Send custom events to Azure Function](../../event-grid/custom-event-to-function.md).

# [PowerShell](#tab/powershell)

- [Web hook](../../event-grid/handler-webhooks.md): A web endpoint can serve as an event handler. To learn about using a web endpoint to handle Blob storage events, see [Quickstart: Route storage events to web endpoint with PowerShell](../../storage/blobs/storage-blob-event-quickstart-powershell.md?toc=/azure/event-grid/toc.json)

# [Azure CLI](#tab/azure-cli)

- [Web hook](../../event-grid/handler-webhooks.md): A web endpoint can serve as an event handler. To learn about using a web endpoint to handle Blob storage events, see [Quickstart: Route storage events to web endpoint with Azure CLI](../../storage/blobs/storage-blob-event-quickstart.md?toc=/azure/event-grid/toc.json)
- [Azure Queue Storage](../../event-grid/handler-storage-queues.md): Azure Storage queues are automatically configured to handle events. To learn about using Queue Storage with Azure CLI to handle an event, see [Quickstart: Route custom events to Azure Queue storage with Azure CLI and Event Grid](../../event-grid/custom-event-to-queue-storage.md).
- [Azure Event Hubs](../../event-grid/handler-event-hubs.md): Azure Event Hubs are  are automatically configured to handle events. To learn about using Event Hubs with Azure CLI to handle an event, see [Quickstart: Route custom events to Azure Event Hubs with Azure CLI and Event Grid](../../event-grid/custom-event-to-eventhub.md)

# [Template](#tab/template)

- [Web hook](../../event-grid/handler-webhooks.md): A web endpoint can serve as an event handler. To learn about using a web endpoint to handle Blob storage events, see [Quickstart: Route Blob storage events to web endpoint by using an ARM template](../../event-grid/blob-event-quickstart-template.md?toc=/azure/event-grid/toc.json)

---

## Specify which events are published to the event handler

After you configure an event handler, you need create an event subscription from your Azure Storage account. The event subscription indicates which types of events will be published to the event handler.

Blob Storage raises two events that you can handle in order to be notified that a blob has finished rehydrating. Which event you decide to handle depends on your application logic:

- **Microsoft.Storage.BlobTierChanged**: This event is raised when a [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation completes. In the context of blob rehydration, the **Microsoft.Storage.BlobTierChanged** event indicates that the blob has been rehydrated to an online tier.
- **Microsoft.Storage.BlobCreated**: This event is raised when a blob is created. In the context of blob rehydration, the **Microsoft.Storage.BlobCreated** event indicates that a [Copy Blob](/rest/api/storageservices/copy-blob) or [Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) operation has copied a blob from the archive tier to an online tier.

The following examples show how to configure an event subscription with Azure Event Grid to handle these events:

# [Azure portal](#tab/portal)

To create an event subscription in the Azure portal, follow these steps:

1. Make sure that you have set up an event handler, as described in [Configure an event handler](#configure-an-event-handler).
1. Navigate to your storage account and select **Events**.
1. On the **Events** page, select the **More Options** tab, then select **Web Hook**.
1. Provide a name for the event subscription.
1. In the **Event Schema** dropdown, select **Event Grid Schema**.
1. Provide a name for the system topic. For more information about Event Grid topics, see [System topics in Azure Event Grid](../../event-grid/system-topics.md).
1. Select the types of events to handle. To be notified when Azure Storage has rehydrated a blob, choose either **Blob Tier Changed** or **Blob Created**, depending on how you will be rehydrating the blob.
1. Select the type of endpoint that is serving as the event handler.

    :::image type="content" source="media/archive-rehydration-event-notification/create-event-subscription-portal.png" alt-text="Screenshot showing how to configure event subscription in Azure portal":::

# [PowerShell](#tab/powershell)

TBD

# [Azure CLI](#tab/azure-cli)

TBD

# [Template](#tab/template)

TBD

---

Several other types of events are available for Blob Storage. For more information about available events, see [Azure Blob Storage as Event Grid source](../../event-grid/event-schema-blob-storage.md).

## See also

TBD
