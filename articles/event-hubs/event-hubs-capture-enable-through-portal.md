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
ms.date: 08/08/2017
ms.author: sethm

---

# Enable Event Hubs Capture using the Azure portal

You can configure Capture at the event hub creation time using the [Azure portal](https://portal.azure.com). You can either capture the data to an Azure [Blob storage](https://azure.microsoft.com/services/storage/blobs/) container, or to a [Data Lake Store](https://azure.microsoft.com/services/data-lake-store/) account.

## Capture data to an Azure Storage account  

When you create an event hub, you can enable Capture by clicking the **On** button in the **Create Event Hub** portal blade. You then specify a Storage Account and container by clicking **Azure Storage** in the **Archive Provider** box. Because Event Hubs Capture uses service-to-service authentication with storage, you do not need to specify a storage connection string. The resource picker selects the resource URI for your storage account automatically. If you use Azure Resource Manager, you must supply this URI explicitly as a string.

The default time window is 5 minutes. The minimum value is 1, the maximum 15. The **Size** window has a range of 10-500 MB.

![][1]

## Capture data to an Azure Data Lake Store account

To capture data to Azure Data Lake Store, click the **On** button in the **Create Event Hub** portal blade. Then select **Azure Data Lake Store** from the **Archive Provider** box. In **Select Data Lake Store**, specify a Data Lake Store account, and enter the path to the data file in the **Data Lake Path** field.   

![][3]

## Add Capture to an existing event hub

You can configure Capture on existing event hubs that are in Event Hubs namespaces. The feature is not available to older **Messaging** or **Mixed** type namespaces. To enable Capture on an existing event hub, or to change your Capture settings, click the namespace to load the **Essentials** blade, then click the event hub for which you want to enable or change the Capture setting. Finally, click the **Properties** section of the open blade, as shown in the following figures:

### Configure Capture to Blob Storage

![][2]

### Configure Capture to Data Lake Store

![][4]

[1]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture1.png
[2]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture2.png
[3]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture3.png
[4]: ./media/event-hubs-capture-enable-through-portal/event-hubs-capture4.png

## Next steps

You can also configure Event Hubs Capture using Azure Resource Manager templates. For more information, see [Enable Capture using an Azure Resource Manager template](event-hubs-resource-manager-namespace-event-hub-enable-capture.md).
