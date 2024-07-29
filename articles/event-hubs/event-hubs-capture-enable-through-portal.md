---
title: Event Hubs - Capture streaming events using Azure portal
description: This article describes how to enable capturing of events streaming through Azure Event Hubs by using the Azure portal.
ms.topic: quickstart
ms.date: 07/07/2023
ms.custom: mode-ui
---

# Enable capturing of events streaming through Azure Event Hubs

Azure [Event Hubs Capture][capture-overview] enables you to automatically deliver the streaming data in Event Hubs to an [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) or [Azure Data Lake Storage Gen 2](https://azure.microsoft.com/services/data-lake-store/) account of your choice. You can configure capture settings using the [Azure portal](https://portal.azure.com) when creating an event hub or for an existing event hub. For conceptual information on this feature, see [Event Hubs Capture overview][capture-overview].

> [!IMPORTANT]
> Event Hubs doesn't support capturing events in a **premium** storage account. 


## Enable Capture when you create an event hub

If you don't have an Event Hubs namespace to work with, create a **standard** tier namespace by following steps from the article: [Create an Event Hubs namespace](event-hubs-create.md#create-an-event-hubs-namespace). Make sure that you select **Standard** for the **pricing tier**. The basic tier doesn't support the Capture feature. 

To create an event hub within the namespace, follow these steps:

1. On the **Overview** page for your namespace, select **+ Event hub** on the command bar. 
   
      :::image type="content" source="./media/event-hubs-quickstart-portal/create-event-hub4.png" lightbox="./media/event-hubs-quickstart-portal/create-event-hub4.png" alt-text="Screenshot of the selection of Add event hub button on the command bar.":::
2. On the **Create event hub** page, type a name for your event hub, then select **Next: Capture** at the bottom of the page.
   
      :::image type="content" source="./media/event-hubs-capture-enable-through-portal/create-event-hub-basics-page.png" alt-text="Screenshot of the Create event hub page.":::
1. On the **Capture** tab, select **On** for **Capture**. 
1. Drag the slider to set the **Time window** in minutes. The default time window is 5 minutes. The minimum value is 1 and the maximum is 15. 
1. Drag the slider to set the **Size window (MB)**. The default value is 300 MB. The minimum value is 10 MB and the maximum value is 500 MB. 
1. Specify whether you want Event Hubs to **emit empty files when no events occur during the Capture time window**.

See one of the following sections based on the type of storage you want to use to store captured files. 


> [!IMPORTANT]
> Azure Data Lake Storage Gen1 is retired, so don't use it for capturing event data. For more information, see the [official announcement](https://azure.microsoft.com/updates/action-required-switch-to-azure-data-lake-storage-gen2-by-29-february-2024/). If you are using Azure Data Lake Storage Gen1, migrate to Azure Data Lake Storage Gen2. For more information, see [Azure Data Lake Storage migration guidelines and patterns](../storage/blobs/data-lake-storage-migrate-gen1-to-gen2.md).

## Capture data to Azure Storage

1. For **Capture Provider**, select **Azure Storage Account** (default).
1. For **Azure Storage Container**, click the **Select the container** link.

    :::image type="content" source="./media/event-hubs-capture-enable-through-portal/select-container-link.png" alt-text="Screenshot that shows the Create event hub page with the Select container link.":::
1. On the **Storage accounts** page, select the storage account that you want to use to capture data. 
1. On the **Containers** page, select the container where you want to store captured files, and then click **Select**. 

    Because Event Hubs Capture uses service-to-service authentication with storage, you don't need to specify a storage connection string. The resource picker selects the resource URI for your storage account automatically. If you use Azure Resource Manager, you must supply this URI explicitly as a string.
1. Now, on the **Create event hub** page, confirm that the selected container shows up. 
1. For **Capture file name format**, specify format for the captured file names.
1. Select **Review + create** at the bottom of the page. 
1. On the **Review + create** page, review settings, and select **Create** to create the event hub. 

    > [!NOTE]
    > If public access is disabled on the storage account, allow **trusted services**, which include Azure Event Hubs, to access the storage account. For details and step-by-step instructions, see [this article](../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services).
 
## Capture data to Azure Data Lake Storage Gen 2 

Follow [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-portal#create-a-storage-account) article to create an Azure Storage account. Set **Hierarchical namespace** to **Enabled** on the **Advanced** tab to make it an Azure Data Lake Storage Gen 2 account. The Azure Storage account must be in the same subscription as the event hub.

1. Select **Azure Storage** as the capture provider. To use Azure Data Lake Storage Gen2, you select **Azure Storage**.
2. For **Azure Storage Container**, click the **Select the container** link.

    :::image type="content" source="./media/event-hubs-capture-enable-through-portal/select-container-link.png" alt-text="Screenshot that shows the Create event hub page with the Select container link.":::
3. Select the **Azure Data Lake Storage Gen 2** account from the list. 

    :::image type="content" source="./media/event-hubs-capture-enable-through-portal/select-data-lake-storage-gen2.png" alt-text="Screenshot showing the selection of Data Lake Storage Gen 2 account.":::
4. Select the **container** (file system in Data Lake Storage Gen 2), and then click **Select** at the bottom of the page. 

    :::image type="content" source="./media/event-hubs-capture-enable-through-portal/select-file-system-data-lake-storage.png" alt-text="Screenshot that shows the Containers page.":::
1. For **Capture file name format**, specify format for the captured file names.
1. Select **Review + create** at the bottom of the page. 

    :::image type="content" source="./media/event-hubs-capture-enable-through-portal/create-event-hub-data-lake-storage.png" alt-text="Screenshot that shows the Create event hub page with all the fields specified.":::
1. On the **Review + create** page, review settings, and select **Create** to create the event hub. 

    > [!NOTE]
    > The container you create in an Azure Data Lake Storage Gen 2 using this user interface (UI) is shown under **File systems** in **Storage Explorer**. Similarly, the file system you create in a Data Lake Storage Gen 2 account shows up as a container in this UI. 


## Configure Capture for an existing event hub

You can configure Capture on existing event hubs that are in Event Hubs namespaces. To enable Capture on an existing event hub, or to change your Capture settings, follow these steps:

1. On the home page for your namespace, select **Event Hubs** under **Entities** on the left menu.
1. Select the event hub for which you want to configure the Capture feature.

    :::image type="content" source="./media/event-hubs-capture-enable-through-portal/select-event-hub.png" alt-text="Screenshot showing the selection of an event hub in the list of event hubs.":::    
1. On the **Event Hubs Instance** page, select **Capture** on the left menu. 

    :::image type="content" source="./media/event-hubs-capture-enable-through-portal/view-capture-page.png" alt-text="Screenshot showing the Capture page for your event hub.":::       
1. On the **Capture** page, select **Avro** for **Output event serialization format**. The **Parquet** format is supported only via Azure Stream Analytics integration. For more information, see [Capture Event Hubs data in parquet format and analyze with Azure Synapse Analytics](../stream-analytics/event-hubs-parquet-capture-tutorial.md).
1. Select **On** for **Capture**.

    :::image type="content" source="./media/event-hubs-capture-enable-through-portal/enable-capture.png" alt-text="Screenshot showing the Capture page for your event hub with the Capture feature enabled.":::    
1. To configure other settings, see the sections: 
    - [Capture data to Azure Storage](#capture-data-to-azure-storage)
    - [Capture data to Azure Data Lake Storage Gen 2](#capture-data-to-azure-data-lake-storage-gen-2)    
    
## Next steps

- Learn more about Event Hubs capture by reading the [Event Hubs Capture overview][capture-overview].
- You can also configure Event Hubs Capture using Azure Resource Manager templates. For more information, see [Enable Capture using an Azure Resource Manager template](event-hubs-resource-manager-namespace-event-hub-enable-capture.md).
- [Learn how to create an Azure Event Grid subscription with an Event Hubs namespace as its source](store-captured-data-data-warehouse.md)
- [Get started with Azure Data Lake Store using the Azure portal](../data-lake-store/data-lake-store-get-started-portal.md)

[capture-overview]: event-hubs-capture-overview.md
