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

# Configure an Azure notification hub with platform notification system settings in the Azure portal 
Azure Notification Hubs provide an easy-to-use and scaled-out push engine that allows you to send notifications to any platform (iOS, Android, Windows, Kindle, Baidu, etc.) from any backend (cloud or on-premises). For more information about the service, see [What is Azure Notification Hubs?](notification-hubs-push-notification-overview.md).

[Create an Azure notification hub by using Azure portal](create-notification-hub-portal.md) if you haven't done so already. In this quickstart, you learn how to configure a notification hub in the Azure portal with platform notification system (PNS) settings.

## Apple Push Notification Service (APNS)
1. On the **Notification Hub** page in the Azure portal, select **Apple (APNS)** under **Settings** on the left menu.
2. If you select **Certificate**, and do the following actions:
    1. Select the **file icon**, and select the **.p12** file to upload. 
    2. Specify the **password**.
    3. Select **Sandbox** mode. Only use the **Production** if you want to send push notifications to users who purchased your app from the store.

        ![Configure APNS certification in Azure portal](./media/notification-hubs-ios-get-started/notification-hubs-apple-config-cert.png)
3. If you select **Token**, and follow these steps: 
    1. Enter the values for **key ID**, **bundle ID**, **team ID**, and **token**.
    2. Select **Sandbox** mode. Only use the **Production** if you want to send push notifications to users who purchased your app from the store.

        ![Configure APNS token in Azure portal](./media/notification-hubs-ios-get-started/notification-hubs-apple-config-token.png)

For a complete tutorial on pushing notifications to iOS devices by using Azure Notification Hubs and Apple Push Notification Service (APNS), see [this tutorial](notification-hubs-ios-apple-push-notification-apns-get-started.md).

## Google Firebase Cloud Messaging (FCM)
1. On the **Notification Hub** page in the Azure portal, select **Google (GCM/FCM)** under **Settings** on the left menu. 
2. Paste the **server key** for the FCM project that you saved earlier. 
3. Select **Save** on the toolbar. 

    ![Azure Notification Hubs - Google (FCM)](./media/notification-hubs-android-push-notification-google-fcm-get-started/fcm-server-key.png)
4. You see a message in alerts that the notification hubs has been successfully updated. The **Save** button is disabled. 

For a complete tutorial on pushing notifications to Android devices by using Azure Notification Hubs and Google Firebase Cloud Messaging, see [this tutorial](notification-hubs-android-push-notification-google-fcm-get-started.md).

## Windows Push Notification Service (WNS)
1. On the **Notification Hub** page in the Azure portal, select **Windows (WNS)** under **Settings** on the left menu.
2. Enter values for **Package SID** and **Security Key**.
3. Select **Save** on the toolbar.

    ![The Package SID and Security Key boxes](./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-configure-wns.png)


For a complete tutorial on pushing notifications to a Universal Windows Platform (UWP) app running on a Windows device, see [this tutorial](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md).

## Windows Phone - Microsoft Push Notification Service
1. On the **Notification Hub** page in the Azure portal, select **Windows Phone (MPNS)** under **Settings**.
2. If you want to enable unauthenticated push, select **Enable unauthenticated push**, and select **Save** on the toolbar.

    ![Azure portal - Enable unauthenticated push notifications](./media/notification-hubs-windows-phone-get-started/azure-portal-unauth.png)
3. If you want to use the **authenticated** push, follow these steps:
    1. Select **Upload Certificate** on the toolbar.
    2. Select the **file icon** and select the certificate file.
    3. Enter the **password** for the certificate. 
    4. Select **OK** to close the **Upload Certificate** page. 
    5. On the **Windows Phone(MPNS)** page, select **Save** on the toolbar.

For a complete tutorial on pushing notifications to a Windows Phone 8 app by using the Microsoft Push Notification Service (MPNS), see [this tutorial](notification-hubs-windows-mobile-push-notifications-mpns.md).
      
## Amazon Device Messaging (ADM)
1. On the **Notification Hub** page in the Azure portal, select **Amazon (ADM)** under **Settings** on the left menu.
2. Enter values for **Client ID** and **Client secret**.
3. Select **Save** on the toolbar.
    
    ![Azure Notification Hubs - ADM settings](./media/notification-hubs-kindle-get-started/notification-hub-adm-settings.png)

For a complete tutorial on using Azure Notification Hubs push notifications to a Kindle application, see [this tutorial](notification-hubs-kindle-amazon-adm-push-notification.md).

## Baidu (Android China)
1. On the **Notification Hub** page in the Azure portal, select **Baidu (Android China)** under **Settings** on the left menu. 
2. Enter the **API key** that you obtain from the Baidu console, in the Baidu cloud push project. 
3. Enter the **secret key** that you obtained from the Baidu console, in the Baidu cloud push project. 
4. Select **Save** on the toolbar. 

    ![Azure Notification Hubs - Baidu (Android China)](./media/notification-hubs-baidu-get-started/AzureNotificationServicesBaidu.png)
4. You see a message in alerts that the notification hubs has been successfully updated. The **Save** button is disabled. 

For a complete tutorial on pushing notifications by using Azure Notification Hubs and Baidu cloud push, see [this tutorial](notification-hubs-baidu-china-android-notifications-get-started.md).

## Next steps
In this quickstart, you learned how to configure different platform notification systems for a notification hub in the Azure portal. 

For complete step-by-step instructions for pushing notifications to these different platforms, see the tutorials in the **Tutorials** section.

- [Push notifications to iOS devices by using Azure Notification Hubs and Apple Push Notification Service (APNS)](notification-hubs-ios-apple-push-notification-apns-get-started.md).
- [Push notifications to Android devices by using Azure Notification Hubs and Google Firebase Cloud Messaging](notification-hubs-android-push-notification-google-fcm-get-started.md).
- [Push notifications to a Universal Windows Platform (UWP) app running on a Windows device](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md).
- [Push notifications to a Windows Phone 8 app by using the Microsoft Push Notification Service (MPNS)](notification-hubs-windows-mobile-push-notifications-mpns.md).
- [Push notifications to a Kindle application](notification-hubs-kindle-amazon-adm-push-notification.md).
- [Push notifications by using Azure Notification Hubs and Baidu cloud push](notification-hubs-baidu-china-android-notifications-get-started.md).
