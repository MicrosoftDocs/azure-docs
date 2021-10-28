---
title: Create an Event Grid subscription in your storage account - Azure Data Explorer
description: This article describes how to create an Event Grid subscription in your storage account in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: kedamari
ms.service: data-explorer
ms.topic: reference
ms.date: 10/05/2020
---
# Manually create resources for Event Grid ingestion

> [!div class="op_single_selector"]
> * [Portal](ingest-data-event-grid.md)
> * [Portal - create resources manually](ingest-data-event-grid-manual.md)
> * [C#](data-connection-event-grid-csharp.md)
> * [Python](data-connection-event-grid-python.md)
> * [Azure Resource Manager template](data-connection-event-grid-resource-manager.md)

Azure Data Explorer offers continuous ingestion from Azure Storage (Azure Blob storage and Azure Data Lake Storage Gen2) using an [Event Grid Ingestion pipeline](ingest-data-event-grid-overview.md). In the Event Grid ingestion pipeline, an Azure Event Grid service routes blob created or blob renamed events from a storage account to Azure Data Explorer via an Azure Event Hub.

In this article, you learn how to create manually the resources needed for Event Grid Ingestion: Event Grid subscription, Event Hub namespace, and Event Hub. Event Hub namespace and Event Hub creation are described in the [Prerequisites](#prerequisites). To use automatic creation of these resources while defining the Event Grid ingestion, see [Create an Event Grid data connection in Azure Data Explorer](ingest-data-event-grid.md#create-an-event-grid-data-connection-in-azure-data-explorer).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create [a cluster and database](create-cluster-database-portal.md).
* [A storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).
* Event Grid notification subscription can be set on Azure Storage accounts for `BlobStorage`, `StorageV2`, or [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction).
* [An Event Hub namespace and Event Hub](/azure/event-hubs/event-hubs-create).

> [!NOTE]
> For best performance, create all resources in the same region as the Azure Data Explorer cluster.

## Create an Event Grid subscription
 
1. In the Azure portal, go to your storage account.
1. In the left menu, select **Events** > **Event Subscription**.

     :::image type="content" source="media/eventgrid/create-event-grid-subscription-1.png" alt-text="Create event grid subscription.":::

1. In the **Create Event Subscription** window within the **Basic** tab, provide the following values:

    :::image type="content" source="media/eventgrid/create-event-grid-subscription-2.png" alt-text="Create event subscription values to enter.":::

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | Name | *test-grid-connection* | The name of the event grid subscription that you want to create.|
    | Event Schema | *Event Grid Schema* | The schema that should be used for the Event Grid. |
    | Topic Type | *Storage account* | The type of event grid topic. Automatically populated.|
    | Source Resource | *gridteststorage1* | The name of your storage account. Automatically populated.|
    | System Topic Name | *gridteststorage1...* | The system topic where Azure Storage publishes events. This system topic then forwards the event to a subscriber that receives and processes events. Automatically populated.|
    | Filter to Event Types | *Blob Created* | Which specific events to get notified for. When creating the subscription, select one of the supported types: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed. Blob renaming is supported only for ADLSv2 storage. |

1. In **ENDPOINT DETAILS**, select **Event Hubs**.

    :::image type="content" source="media/eventgrid/endpoint-details.png" alt-text="Pick an event handler to receive your events - Event Hub - Azure Data Explorer.":::

1. Click **Select an endpoint** and fill in the Event Hub you created, for example *test-hub*.
    
1. Select the **Filters** tab if you want to track specific subjects. Set the filters for the notifications as follows:
   
    :::image type="content" source="media/eventgrid/filters-tab.png" alt-text="Filters tab event grid.":::

   1. Select **Enable subject filtering**
   1. **Subject Begins With** field is the *literal* prefix of the subject. Since the pattern applied is *startswith*, it can span multiple containers, folders, or blobs. No wildcards are allowed.
       * To define a filter on the blob container, set the field as follows: *`/blobServices/default/containers/[container prefix]`*.
       * To define a filter on a blob prefix (or a folder in Azure Data Lake Gen2), set the field as follows: *`/blobServices/default/containers/[container name]/blobs/[folder/blob prefix]`*.
   1. **Subject Ends With** field is the *literal* suffix of the blob. No wildcards are allowed.
   1. **Case-sensitive subject matching** field indicates whether the prefix and suffix filters are case-sensitive.

    For more information about filtering events, see [blob storage events](/azure/storage/blobs/storage-blob-event-overview#filtering-events).

1. Select **Create**

## Next steps

* Continue the setup and create a data ingestion connection to Azure Data Explorer via Azure portal: [Create an Event Grid data connection in Azure Data Explorer](ingest-data-event-grid.md#create-an-event-grid-data-connection-in-azure-data-explorer).

* If you don't plan to continue Event Grid ingestion using the resources you created and don't want to use the resources anymore, [clean up resources](ingest-data-event-grid.md#clean-up-resources) to avoid incurring costs.
