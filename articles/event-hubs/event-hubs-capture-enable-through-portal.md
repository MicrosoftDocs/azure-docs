---
title: Capture streaming events using Azure portal - Azure Event Hubs | Microsoft Docs
description: This article describes how to enable capturing of events streaming through Azure Event Hubs by using the Azure portal.
services: event-hubs
documentationcenter: ''
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: 
ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.custom: seodec18
ms.devlang: na
ms.topic: conceptual
ms.date: 02/06/2019
ms.author: shvija

---

# Enable capturing of events streaming through Azure Event Hubs

Azure [Event Hubs Capture][capture-overview] enables you to automatically deliver the streaming data in Event Hubs to an [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) or [Azure Data Lake Store](https://azure.microsoft.com/services/data-lake-store/) account of your choice.

You can configure Capture at the event hub creation time using the [Azure portal](https://portal.azure.com). You can either capture the data to an Azure [Blob storage](https://azure.microsoft.com/services/storage/blobs/) container, or to an [Azure Data Lake Store](https://azure.microsoft.com/services/data-lake-store/) account.

For more information, see the [Event Hubs Capture overview][capture-overview].

## Capture data to an Azure Storage account  

When you create an event hub, you can enable Capture by clicking the **On** button in the **Create Event Hub** portal screen. You then specify a Storage Account and container by clicking **Azure Storage** in the **Capture Provider** box. Because Event Hubs Capture uses service-to-service authentication with storage, you do not need to specify a storage connection string. The resource picker selects the resource URI for your storage account automatically. If you use Azure Resource Manager, you must supply this URI explicitly as a string.

The default time window is 5 minutes. The minimum value is 1, the maximum 15. The **Size** window has a range of 10-500 MB.

![Time window for capture][1]

> [!NOTE]
> You can enable or disable emitting empty files when no events occur during the Capture window. 

## Capture data to an Azure Data Lake Store account

To capture data to Azure Data Lake Store, you create a Data Lake Store account, and an event hub:

### Create an Azure Data Lake Store account and folders

> [!NOTE]
> Currently, the Event Hubs Capture feature supports only Gen 1 of Azure Data Lake Store, not Gen 2. 

1. Create a Data Lake Store Gen 1 account, following the instructions in [Get started with Azure Data Lake Store using the Azure portal](../data-lake-store/data-lake-store-get-started-portal.md).
2. Follow the instructions in the [Assign permissions to Event Hubs](../data-lake-store/data-lake-store-archive-eventhub-capture.md#assign-permissions-to-event-hubs) section to create a folder within the Data Lake Store account in which you want to capture the data from Event Hubs, and assign permissions to Event Hubs so that it can write data into your Data Lake Store account.  


### Create an event hub

1. Note that the event hub must be in the same Azure subscription as the Azure Data Lake Store you just created. Create the event hub, clicking the **On** button under **Capture** in the **Create Event Hub** portal page. 
2. In the **Create Event Hub** portal page, select **Azure Data Lake Store** from the **Capture Provider** box.
3. In **Select Data Lake Store**, specify the Data Lake Store account you created previously, and in the **Data Lake Path** field, enter the path to the data folder you created.

    ![Select Data Lake Storage account][3]

## Add or configure Capture on an existing event hub

You can configure Capture on existing event hubs that are in Event Hubs namespaces. To enable Capture on an existing event hub, or to change your Capture settings, click the namespace to load the overview screen, then click the event hub for which you want to enable or change the Capture setting. Finally, click the **Capture** option on the left side of the open page and then edit the settings, as shown in the following figures:

### Azure Blob Storage

![Configure Azure Blob Storage][2]

### Azure Data Lake Store

![Configure Azure Data Lake Storage][4]

[1]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture1.png
[2]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture2.png
[3]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture3.png
[4]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture4.png

## Next steps

- Learn more about Event Hubs capture by reading the [Event Hubs Capture overview][capture-overview].
- You can also configure Event Hubs Capture using Azure Resource Manager templates. For more information, see [Enable Capture using an Azure Resource Manager template](event-hubs-resource-manager-namespace-event-hub-enable-capture.md).
- [Learn how to create an Azure Event Grid subscription with an Event Hubs namespace as its source](store-captured-data-data-warehouse.md)
- [Get started with Azure Data Lake Store using the Azure portal](../data-lake-store/data-lake-store-get-started-portal.md)

[capture-overview]: event-hubs-capture-overview.md
