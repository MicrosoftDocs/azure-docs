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
ms.subservice: blobs
---

# Trigger an event when an archived blob is rehydrated 

TBD

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

## Select an event handler

Azure Event Grid directs an event that is raised by a source such as Blob Storage to an event handler. Your application can integrate with the event handler to process and respond to the event. To handle the event raised on blob rehydration, you must first decide which event handler you want to use. To learn about supported event handlers, see **Event handlers** in [What is Azure Event Grid?](../../event-grid/overview.md#event-handlers)

The Azure Event Grid documentation provides guidance for setting up an event handler for Blob Storage events. Use the following links to learn how to configure event handling in the Azure portal, PowerShell, Azure CLI, or with an Azure Resource Manager template.

# [Azure portal](#tab/portal)

- [Web hook](../../event-grid/handler-webhooks.md): A web endpoint can serve as an event handler. To learn about using a web endpoint to handle Blob storage events, see [Use Azure Event Grid to route Blob storage events to web endpoint (Azure portal)](../../event-grid/blob-event-quickstart-portal.md).
- [Azure Function](../../event-grid/handler-functions.md): Azure Functions are automatically configured to handle events. To learn about using the Azure portal to configure an Azure Function to handle an event, see [Send custom events to Azure Function](../../event-grid/custom-event-to-function.md).

# [PowerShell](#tab/powershell)

- [Send Azure Blob storage events to web endpoint \- PowerShell \| Microsoft Docs](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-event-quickstart-powershell?toc=/azure/event-grid/toc.json)

# [Azure CLI](#tab/azure-cli)

- [Send Azure Blob storage events to web endpoint \- Azure CLI \| Microsoft Docs](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-event-quickstart?toc=/azure/event-grid/toc.json)
- [Azure Queue Storage](../../event-grid/handler-storage-queues.md): Azure Storage queues are automatically configured to handle events. To learn about using Queue Storage with Azure CLI to handle an event, see [Send custom events to storage queue](../../event-grid/custom-event-to-queue-storage.md).
- [Azure Event Hubs](../../event-grid/handler-event-hubs.md): Azure Event Hubs are  are automatically configured to handle events. To learn about using Event Hubs with Azure CLI to handle an event, see [Send custom events to Event Hubs](../../event-grid/custom-event-to-eventhub.md)

# [Template](#tab/template)

[Send Blob storage events to web endpoint \- template \- Azure Event Grid \| Microsoft Docs](https://docs.microsoft.com/en-us/azure/event-grid/blob-event-quickstart-template)

---




To handle an event raised by 

## See also

TBD
