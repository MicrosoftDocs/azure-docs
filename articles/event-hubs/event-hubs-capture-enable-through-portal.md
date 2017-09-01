---
title: Azure Event Hubs Capture enable through portal | Microsoft Docs
description: Enable the Event Hubs Capture feature using the Azure portal.
services: event-hubs
documentationcenter: ''
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 
ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 08/28/2017
ms.author: sethm

---

# Enable Event Hubs Capture using the Azure portal

Azure [Event Hubs Capture][capture-overview] enables you to automatically deliver the streaming data in Event Hubs to an [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) or [Azure Data Lake Store](https://azure.microsoft.com/services/data-lake-store/) account of your choice.

You can configure Capture at the event hub creation time using the [Azure portal](https://portal.azure.com). You can either capture the data to an Azure [Blob storage](https://azure.microsoft.com/services/storage/blobs/) container, or to an [Azure Data Lake Store](https://azure.microsoft.com/services/data-lake-store/) account.

For more information, see the [Event Hubs Capture overview][capture-overview].

## Capture data to an Azure Storage account  

When you create an event hub, you can enable Capture by clicking the **On** button in the **Create Event Hub** portal screen. You then specify a Storage Account and container by clicking **Azure Storage** in the **Capture Provider** box. Because Event Hubs Capture uses service-to-service authentication with storage, you do not need to specify a storage connection string. The resource picker selects the resource URI for your storage account automatically. If you use Azure Resource Manager, you must supply this URI explicitly as a string.

The default time window is 5 minutes. The minimum value is 1, the maximum 15. The **Size** window has a range of 10-500 MB.

![][1]

## Capture data to an Azure Data Lake Store account

To capture data to Azure Data Lake Store, you create a Data Lake Store account, and an event hub:

### Create an Azure Data Lake Store account and folders

1. Create a Data Lake Store account, following the instructions in [Get started with Azure Data Lake Store using the Azure portal](../data-lake-store/data-lake-store-get-started-portal.md). 
2. Create a folder under this account, following the instructions in the [Create folders in Azure Data Lake Store account](../data-lake-store/data-lake-store-get-started-portal.md#createfolder) section.
3. In the Data Lake Store account page, click **Data Explorer**.
4. Click **Access**.
5. Click **Add**.
6. In the **Search by name or email** box type **Microsoft.EventHubs** and then select this option. 
7. The **Permissions** tab appears. Set the permissions as shown in the following figure:

    ![][6]

8. Click **OK**.
9. Now, create a folder in the root folder by browsing to the target folder and clicking on the folder name.
10. Click **Access**.
11. Click **Add**.
12. In the **Search by name or email** box type **Microsoft.EventHubs** and then select this option.
13. The **Permissions** tab appears again. Set the permissions as shown in the following figure:

    ![][5]

### Create an event hub

1. Note that the event hub must be in the same Azure subscription as the Azure Data Lake Store you just created. Create the event hub, clicking the **On** button under **Capture** in the **Create Event Hub** portal page. 
2. In the **Create Event Hub** portal page, select **Azure Data Lake Store** from the **Capture Provider** box.
3. In **Select Data Lake Store**, specify the Data Lake Store account you created previously, and in the **Data Lake Path** field, enter the path to the data folder you created.

    ![][3]

## Add or configure Capture on an existing event hub

You can configure Capture on existing event hubs that are in Event Hubs namespaces. To enable Capture on an existing event hub, or to change your Capture settings, click the namespace to load the **Essentials** screen, then click the event hub for which you want to enable or change the Capture setting. Finally, click the **Properties** section of the open page and then edit the Capture settings, as shown in the following figures:

### Azure Blob Storage

![][2]

### Azure Data Lake Store

![][4]

[1]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture1.png
[2]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture2.png
[3]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture3.png
[4]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture4.png
[5]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture5.png
[6]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture6.png

## Next steps

- Learn more about Event Hubs capture by reading the [Event Hubs Capture overview][capture-overview].
- You can also configure Event Hubs Capture using Azure Resource Manager templates. For more information, see [Enable Capture using an Azure Resource Manager template](event-hubs-resource-manager-namespace-event-hub-enable-capture.md).

[capture-overview]: event-hubs-capture-overview.md