---
title: Configure Windows Push Notification Service in Azure Notification Hubs | Microsoft Docs
description: Learn how to configure Windows Push Notification Service settings for an Azure notification hub. 
services: notification-hubs
author: jwargo
manager: patniko
editor: spelluru

ms.service: notification-hubs
ms.workload: mobile
ms.topic: article
ms.date: 03/25/2019
ms.author: jowargo
---

# Configure Windows Push Notification Service (WNS) settings for a notification hub in the Azure portal
This article shows you how to configure Windows Notification Service (WNS) settings for an Azure notification hub by using the Azure portal.  

## Prerequisites
If you haven't already created a notification hub, create one now. For more information, see [Create an Azure notification hub in the Azure portal](create-notification-hub-portal.md). 

## Configure Windows Push Notification Service (WNS)

The following procedure gives you steps to configure Windows Push Notification Service (WNS) settings for a notification hub: 

1. In the Azure portal, on the **Notification Hub** page, select **Windows (WNS)** on the left menu.
2. Enter values for **Package SID** and **Security Key**.
3. Select **Save**.

   ![Screenshot that shows the Package SID and Security Key boxes](./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-configure-wns.png)

## Next steps
For a tutorial with step-by-step instructions for pushing notifications to Universal Windows Platform applications by using Azure Notification Hubs and Windows Push Notification Service (WNS), see [Send notifications to UWP apps by using Azure Notification Hubs](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md).


