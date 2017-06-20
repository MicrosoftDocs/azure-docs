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
ms.date: 06/28/2017
ms.author: sethm

---

# Enable Event Hubs Capture using the Azure portal

You can configure Capture at the event hub creation time using the [Azure portal](https://portal.azure.com). You enable Capture by clicking the **On** button in the **Create Event Hub** portal blade. You then configure a Storage Account and container by clicking the **Container** section of the blade. Because Event Hubs Capture uses service-to-service authentication with storage, you do not need to specify a storage connection string. The resource picker selects the resource URI for your storage account automatically. If you use Azure Resource Manager, you must supply this URI explicitly as a string.

The default time window is 5 minutes. The minimum value is 1, the maximum 15. The **Size** window has a range of 10-500 MB.

![][1]

## Adding Capture to an existing event hub

Capture can be configured on existing event hubs that are in Event Hubs namespaces. The feature is not available to older **Messaging** or **Mixed** type namespaces. To enable Capture on an existing event hub, or to change your Capture settings, click the namespace to load the **Essentials** blade, then click the event hub for which you want to enable or change the Capture setting. Finally, click the **Properties** section of the open blade, as shown in the following figure:

![][2]

[1]: ./media/event-hubs-capture-enable-thorugh-portal/event-hubs-capture1.png
[2]: ./media/event-hubs-capture-enable-thorugh-portal/event-hubs-capture2.png

## Next steps

You can also configure Event Hubs Capture using Azure Resource Manager templates. For more information, see [Enable Capture using an Azure Resource Manager template](event-hubs-resource-manager-namespace-event-hub-enable-capture.md).
