---
title: Configure Google Firebase Cloud Messaging in Azure Notification Hubs | Microsoft Docs
description: Learn how to configure an Azure notification hub with Google Firebase Cloud Messaging settings. 
services: notification-hubs
author: sethmanheim
manager: femila

ms.service: notification-hubs
ms.workload: mobile
ms.topic: article
ms.date: 06/30/2023
ms.author: sethm
ms.reviewer: thsomasu
ms.lastreviewed: 03/25/2019
---

# Configure Google Firebase settings for a notification hub in the Azure portal

This article shows you how to configure Google Firebase Cloud Messaging (FCM) settings for an Azure notification hub using the Azure portal.

> [!NOTE]
> For information about Firebase Cloud Messaging deprecation and migration steps, see [Google Firebase Cloud Messaging migration](notification-hubs-gcm-to-fcm.md).

## Prerequisites

If you haven't already created a notification hub, create one now. For more information, see [Create an Azure notification hub in the Azure portal](create-notification-hub-portal.md).

## Configure Google Firebase Cloud Messaging (FCM)

The following procedure describes the steps to configure Google Firebase Cloud Messaging (FCM) settings for a notification hub:

1. In the Azure portal, on the **Notification Hub** page, select **Google (GCM/FCM)** on the left menu.
2. Paste the **API Key** for the FCM project that you saved earlier.
3. Select **Save**.

   ![Screenshot that shows how to configure Notification Hubs for Google FCM](./media/notification-hubs-android-push-notification-google-fcm-get-started/fcm-server-key.png)

## Next steps

For a tutorial with step-by-step instructions for sending notifications to Android devices by using Azure Notification Hubs and Google Firebase Cloud Messaging, see [Send push notifications to Android devices by using Notification Hubs and Google FCM](notification-hubs-android-push-notification-google-fcm-get-started.md).

