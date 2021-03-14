---
title: Configure Windows Push Notification Service in Azure Notification Hubs | Microsoft Docs
description: Learn how to configure Windows Push Notification Service settings for an Azure notification hub. 
services: notification-hubs
author: sethmanheim
manager: femila

ms.service: notification-hubs
ms.workload: mobile
ms.topic: article
ms.date: 08/04/2020
ms.author: sethm
ms.reviewer: thsomasu
ms.lastreviewed: 03/25/2019
---

# Configure Windows Push Notification Service settings in the Azure portal

This article shows how to configure Windows Notification Service (WNS) settings for an Azure notification hub by using the Azure portal.  

## Prerequisites

If you haven't already created a notification hub, create one now. For more information, see [Create an Azure notification hub in the Azure portal](create-notification-hub-portal.md).

## Configure Windows Push Notification Service (WNS)

The following procedure describes the steps to configure Windows Push Notification Service (WNS) settings for a notification hub:

1. In the Azure portal, on the **Notification Hub** page, select **Windows (WNS)** on the left menu.
2. Enter values for **Package SID** and **Security Key**.
3. Select **Save**.

   ![Screenshot that shows the Package SID and Security Key boxes](./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-configure-wns.png)

## Next steps

For a tutorial with step-by-step instructions for sending push notifications to Universal Windows Platform applications by using Azure Notification Hubs and Windows Push Notification Service (WNS), see [Send notifications to UWP apps by using Azure Notification Hubs](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md).
