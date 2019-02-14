---
title: Configure Azure notification hub with PNS settings | Microsoft Docs
description: In this quickstart, you learn how to configure a notification hub in the Azure portal with platform notification system (PNS) settings.
services: notification-hubs
author: jwargo
manager: patniko
editor: spelluru

ms.service: notification-hubs
ms.workload: mobile
ms.topic: quickstart
ms.date: 02/14/2019
ms.author: jowargo
---

# Configure an Azure notification hub with platform notification system (PNS) settings by using the Azure portal 
Azure Notification Hubs provide an easy-to-use and scaled-out push engine that allows you to send notifications to any platform (iOS, Android, Windows, Kindle, Baidu, etc.) from any backend (cloud or on-premises). For more information about the service, see [What is Azure Notification Hubs?](notification-hubs-push-notification-overview.md).

[Create an Azure notification hub by using Azure portal](create-notification-hub-portal.md) if you haven't done so already. In this quickstart, you learn how to configure a notification hub in the Azure portal with platform notification system (PNS) settings.

### Configure Firebase Cloud Messaging (FCM) settings for the hub
1. Select **Google (GCM/FCM)** under **Settings** on the left menu. 
2. Paste the **server key** for the FCM project that you saved earlier. 
3. Selct **Save** on the toolbar. 

    ![Azure Notification Hubs - Google (FCM)](./media/notification-hubs-android-push-notification-google-fcm-get-started/fcm-server-key.png)
4. You see a message in alerts that the notification hubs has been successfully updated. The **Save** button is disabled. 

For a complete tutorial on pushing notifications to Android devices by using Azure Notification Hubs and Google Firebase Cloud Messaging, see [this tutorial](notification-hubs-android-push-notification-google-fcm-get-started.md).

### Configure Baidu settings for the hub
1. Select **Baidu (Android China)** under **Settings** on the left menu. 
2. Enter the **API key** that you obtain from the Baidu console, in the Baidu cloud push project. 
3. Enter the **secret key** that you obtained from the Baidu console, in the Baidu cloud push project. 
4. Selct **Save** on the toolbar. 

    ![Azure Notification Hubs - Baidu (Android China)](./media/notification-hubs-android-push-notification-google-fcm-get-started/fcm-server-key.png)
4. You see a message in alerts that the notification hubs has been successfully updated. The **Save** button is disabled. 

For a complete tutorial on pushing notifications by using Azure Notification Hubs and Baidu cloud push, see [this tutorial](notification-hubs-baidu-china-android-notifications-get-started.md).




## Next steps
In this tutorial, you used Firebase Cloud Messaging to push notifications to Android devices. To learn how to push notifications by using Google Cloud Messaging, advance to the following tutorial:

> [!div class="nextstepaction"]
>[Push notifications to Android devices using Google Cloud Messaging](notification-hubs-android-push-notification-google-gcm-get-started.md)
