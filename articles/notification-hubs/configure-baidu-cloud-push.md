---
title: Configure Baidu Cloud Push in Azure Notification Hubs | Microsoft Docs
description: Learn how to configure Baidu settings for an Azure notification hub. 
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

# Configure Baidu Cloud Push settings for a notification hub in the Azure portal
This article shows you how to configure Baidu Cloud Push settings for an Azure notification hub by using the Azure portal. 

## Prerequisites
If you haven't already created a notification hub, create one now. For more information, see [Create an Azure notification hub in the Azure portal](create-notification-hub-portal.md). 

## Configure Baidu Cloud Push
The following procedure gives you steps to configure Baidu Cloud Push settings for a notification hub:

1. In the Azure portal, on the **Notification Hub** page, select **Baidu (Android China)** on the left menu. 
2. Enter the **Api Key** that you obtained from the Baidu console in the Baidu cloud push project. 
3. Enter the **Secret Key** that you obtained from the Baidu console in the Baidu cloud push project. 
4. Select **Save**. 

    ![Screenshot of Notification Hubs that shows the Baidu (Android China) configuration for push notifications](./media/notification-hubs-baidu-get-started/AzureNotificationServicesBaidu.png)

## Next steps
For a tutorial with step-by-step instructions for pushing notifications to Baidu by using Azure Notification Hubs and Baidu Cloud Push, see [Get started with Notification Hubs by using Baidu](notification-hubs-baidu-china-android-notifications-get-started.md).
