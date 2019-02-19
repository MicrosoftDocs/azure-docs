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
Azure Notification Hubs provide a push engine that's easy to use and scaled out. Use Notification Hubs to send notifications to any platform (iOS, Android, Windows, Kindle, Baidu, and so on) from any back end (cloud or on-premises). For more information about the service, see [What is Azure Notification Hubs](notification-hubs-push-notification-overview.md).

In this quickstart, you'll configure a notification hub in the Azure portal with platform notification system (PNS) settings.

If you haven't already created a notification hub, create one now. For more information, see [Create an Azure notification hub by using Azure portal](create-notification-hub-portal.md). 

## Apple Push Notification Service

Open the Azure portal to configure Apple Push Notification Service (APNS). On the **Notification Hub** page, under **Settings** on the left menu, select **Apple (APNS)**.

If you select the **Certificate** authentication mode, follow these steps:
    
1. Select the file icon, and then select the **.p12** file you want to upload. 

1. Enter the password.
    
1. Select **Sandbox** mode. Or, to send push notifications to users who purchased your app from the store, select **Production** mode.

    ![Screenshot of APNS certificate configuration in Azure portal](./media/notification-hubs-ios-get-started/notification-hubs-apple-config-cert.png)

If you select the **Token** authentication mode, follow these steps:

1. Enter the values for **Key Id**, **Bundle Id**, **Team Id**, and **Token**.

1. Select **Sandbox** mode. Or, to send push notifications to users who purchased your app from the store, select **Production** mode.

    ![Screenshot of APNS token configuration in Azure portal](./media/notification-hubs-ios-get-started/notification-hubs-apple-config-token.png)

For for more information about how to push notifications to iOS devices by using Notification Hubs and APNS, see [Push notifications to iOS by using Azure Notification Hubs](notification-hubs-ios-apple-push-notification-apns-get-started.md).

## Google Firebase Cloud Messaging

To configure Google Firebase Cloud Messaging (FCM) from the Azure portal, follow these steps:

1. On the **Notification Hub** page, select **Google (GCM/FCM)** under **Settings** on the left menu. 
2. Paste the **API Key** for the FCM project that you saved earlier. 
3. Select **Save** on the toolbar. 

    ![Screenshot showing how to configure Notification Hubs for Google FCM](./media/notification-hubs-android-push-notification-google-fcm-get-started/fcm-server-key.png)

When you finish these steps, you see an alert indicating that the notification hub has been successfully updated. The **Save** button is disabled. 

For more information, see [Push notifications to Android devices by using Azure Notification Hubs and Google Firebase Cloud Messaging](notification-hubs-android-push-notification-google-fcm-get-started.md).

## Windows Push Notification Service

To configure Windows Push Notification Service (WNS) from the Azure portal, follow these steps:

1. On the **Notification Hub** page, select **Windows (WNS)** under **Settings** on the left menu.
2. Enter values for **Package SID** and **Security Key**.
3. Select **Save** on the toolbar.

    ![Screenshot showing the Package SID and Security Key boxes](./media/notification-hubs-windows-store-dotnet-get-started/notification-hub-configure-wns.png)

For information about how to push notifications to a Universal Windows Platform (UWP) app that's running on a Windows device, see [Send notifications to Universal Windows Platform (UWP) apps by using Azure Notification Hubs](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md).

## Microsoft Push Notification Service for Windows Phone

From the Azure portal, configure Microsoft Push Notification Service (MPNS) for Windows Phone. To begin, on the **Notification Hub** page, select **Windows Phone (MPNS)** on the left menu under **Settings**.

To enable unauthenticated push notifications:

1. Select **Enable unauthenticated push**. 
1. Select **Save** on the toolbar.

    ![Screenshot of the Azure portal, showing how to enable unauthenticated push notifications](./media/notification-hubs-windows-phone-get-started/azure-portal-unauth.png)

To enable authenticated push notifications, follow these steps:

1. Select **Upload Certificate** on the toolbar.
1. Select the file icon, and then select the certificate file.
1. Enter the password for the certificate.
1. Select **OK** to close the **Upload Certificate** page.
1. On the **Windows Phone (MPNS)** page, select **Save** on the toolbar.

For information about how to push notifications to a Windows Phone 8 app by using MPNS, see [Push notifications to Windows Phone apps by using Azure Notification Hubs](notification-hubs-windows-mobile-push-notifications-mpns.md).
      
## Amazon Device Messaging

To configure Amazon Device Messaging (ADM) push notifications from the Azure portal, follow these steps:

1. On the **Notification Hub** page, select **Amazon (ADM)** under **Settings** on the left menu.
2. Enter values for **Client ID** and **Client Secret**.
3. Select **Save** on the toolbar.
    
    ![Screenshot of ADM settings in the Azure portal](./media/notification-hubs-kindle-get-started/notification-hub-adm-settings.png)

For information about how to configure Notification Hubs push notifications for a Kindle application, see [Get started with Notification Hubs for Kindle apps](notification-hubs-kindle-amazon-adm-push-notification.md).

## Baidu (Android China)

To configure Baidu push notifications from the Azure portal, follow these steps:

1. On the **Notification Hub** page, select **Baidu (Android China)** under **Settings** on the left menu. 
2. Enter the **Api Key** that you obtained from the Baidu console, in the Baidu cloud push project. 
3. Enter the **Secret Key** that you obtained from the Baidu console, in the Baidu cloud push project. 
4. Select **Save** on the toolbar. 

    ![Screenshot of Azure Notification Hubs, showing Baidu (Android China) configuration for push notifications](./media/notification-hubs-baidu-get-started/AzureNotificationServicesBaidu.png)

When you finish these steps, you see an alert that indicates that the notification hub has been successfully updated. The **Save** button is disabled. 

For more information about how to push notifications by using Notification Hubs and Baidu cloud push, see [Get started with Notification Hubs using Baidu](notification-hubs-baidu-china-android-notifications-get-started.md).

## Next steps
In this quickstart, you learned how to configure platform notification system settings for a notification hub in the Azure portal. 

For more instructions on how to push notifications to various platforms, see these tutorials:

- [Push notifications to iOS devices by using Azure Notification Hubs and Apple Push Notification Service (APNS)](notification-hubs-ios-apple-push-notification-apns-get-started.md)
- [Push notifications to Android devices by using Azure Notification Hubs and Google Firebase Cloud Messaging](notification-hubs-android-push-notification-google-fcm-get-started.md)
- [Push notifications to a Universal Windows Platform (UWP) app running on a Windows device](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md)
- [Push notifications to a Windows Phone 8 app by using the Microsoft Push Notification Service (MPNS)](notification-hubs-windows-mobile-push-notifications-mpns.md)
- [Push notifications to a Kindle application](notification-hubs-kindle-amazon-adm-push-notification.md)
- [Push notifications by using Azure Notification Hubs and Baidu cloud push](notification-hubs-baidu-china-android-notifications-get-started.md)
