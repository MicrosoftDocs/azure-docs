---
title: Send push notifications to Xamarin using Azure Notification Hubs | Microsoft Docs
description: In this tutorial, you learn how to use Azure Notification Hubs to send push notifications to a Xamarin.iOS application.
services: notification-hubs
keywords: ios push notifications,push messages,push notifications,push message
documentationcenter: xamarin
author: sethmanheim
manager: femila

ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin-ios
ms.devlang: csharp
ms.topic: tutorial
ms.custom: "mvc, devx-track-csharp"
ms.date: 01/12/2021
ms.author: sethm
ms.reviewer: thsomasu
ms.lastreviewed: 05/23/2019
---

# Tutorial: Send push notifications to Xamarin.iOS apps using Azure Notification Hubs

[!INCLUDE [notification-hubs-selector-get-started](../../includes/notification-hubs-selector-get-started.md)]

## Overview

This tutorial shows you how to use Azure Notification Hubs to send push notifications to an iOS application. You create a blank Xamarin.iOS app that receives push notifications by using the [Apple Push Notification service (APNs)](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html).

When you're finished, you are able to use your notification hub to broadcast push notifications to all the devices running your app. The finished code is available in the [NotificationHubs app][GitHub] sample.

In this tutorial, you create/update code to do the following tasks:

> [!div class="checklist"]
> * Generate the certificate signing request file
> * Register your app for push notifications
> * Create a provisioning profile for the app
> * Configure your notification hub for iOS push notifications
> * Send test push notifications

## Prerequisites

* **Azure subscription**. If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Latest version of [Xcode][Install Xcode]
* An iOS 10 (or later version) compatible device
* [Apple Developer Program](https://developer.apple.com/programs/) membership.
* [Visual Studio for Mac]
  
  > [!NOTE]
  > Because of configuration requirements for iOS push notifications, you must deploy and test the sample application on a physical iOS device (iPhone or iPad) instead of in the simulator.

Completing this tutorial is a prerequisite for all other Notification Hubs tutorials for Xamarin.iOS apps.

[!INCLUDE [Notification Hubs Enable Apple Push Notifications](../../includes/notification-hubs-enable-apple-push-notifications.md)]

## Connect your app to the notification hub

### Create a new project

1. In Visual Studio, create a new iOS project and select the **Single View App** template, and click **Next**

     ![Visual Studio - Select Application Type][31]

2. Enter your App Name and Organization identifier, then click **Next**, then **Create**

3. From the Solution view, double-click *Info.plist* and under **Identity** make sure your Bundle Identifier matches the one used when creating your provisioning profile. Under **Signing** ensure that your Developer account is selected under **Team**, "Automatically manage signing" is selected and your Signing Certificate and Provisioning Profile are automatically selected.

    ![Visual Studio- iOS App Config][32]

4. From the Solution view, double-click the `Entitlements.plist` and ensure that **Enable Push Notifications** is checked.

    ![Visual Studio- iOS Entitlements Config][33]

5. Add the Azure Messaging package. In the Solution view, right-click the project and select **Add** > **Add NuGet Packages**. Search for **Xamarin.Azure.NotificationHubs.iOS** and add the package to your project.

6. Add a new file to your class, name it `Constants.cs` and add the following variables and replace the string literal placeholders with the `hubname` and the `DefaultListenSharedAccessSignature` noted earlier.

    ```csharp
    // Azure app-specific connection string and hub path
    public const string ListenConnectionString = "<Azure DefaultListenSharedAccess Connection String>";
    public const string NotificationHubName = "<Azure Notification Hub Name>";
    ```

7. In `AppDelegate.cs`, add the following using statement:

    ```csharp
    using WindowsAzure.Messaging.NotificationHubs;
    using UserNotifications
    ```

8. Create an implementation of the `MSNotificationHubDelegate` in the `AppDelegate.cs`:

    ```csharp
    public class AzureNotificationHubListener : MSNotificationHubDelegate
    {
        public override void DidReceivePushNotification(MSNotificationHub notificationHub, MSNotificationHubMessage message)
        {

        }
    }
    ```

9. In `AppDelegate.cs`, update `FinishedLaunching()` to match the following code:

    ```csharp
    public override bool FinishedLaunching(UIApplication application, NSDictionary launchOptions)
    {
        // Set the Message listener
        MSNotificationHub.SetDelegate(new AzureNotificationHubListener());
        
        // Start the SDK
        MSNotificationHub.Start(ListenConnectionString, NotificationHubName);

        return true;
    }
    ```

10. In `AppDelegate.cs`, implement the `DidReceivePushNotification` method for the `AzureNotificationHubListener` class:

    ```csharp
    public override void DidReceivePushNotification(MSNotificationHub notificationHub, MSNotificationHubMessage message)
    {
        // This sample assumes { aps: { alert: { title: "Hello", body: "World" } } }
        var alertTitle = message.Title ?? "Notification";
        var alertBody = message.Body;

        var myAlert = UIAlertController.Create(alertTitle, alertBody, UIAlertControllerStyle.Alert);
        myAlert.AddAction(UIAlertAction.Create("OK", UIAlertActionStyle.Default, null));
        UIApplication.SharedApplication.KeyWindow.RootViewController.PresentViewController(myAlert, true, null);
    }
    ```

11. Run the app on your device.

## Send test push notifications

You can test receiving notifications in your app with the *Test Send* option in the [Azure portal]. It sends a test push notification to your device.

![Azure portal - Test Send][30]

Push notifications are normally sent in a back-end service like Mobile Apps or ASP.NET using a compatible library. If a library is not available for your back-end, you can also use the REST API directly to send notification messages.

## Next steps

In this tutorial, you sent broadcast notifications to all your iOS devices registered with the backend. To learn how to push notifications to specific iOS devices, advance to the following tutorial:

> [!div class="nextstepaction"]
>[Push notifications to specific devices](notification-hubs-ios-xplat-segmented-apns-push-notification.md)

<!-- Images. -->
[6]: ./media/notification-hubs-ios-get-started/notification-hubs-apple-config.png
[7]: ./media/notification-hubs-ios-get-started/notification-hubs-apple-config-cert.png
[213]: ./media/partner-xamarin-notification-hubs-ios-get-started/notification-hub-create-console-app.png
[215]: ./media/partner-xamarin-notification-hubs-ios-get-started/notification-hub-scheduler1.png
[216]: ./media/partner-xamarin-notification-hubs-ios-get-started/notification-hub-scheduler2.png
[30]: ./media/notification-hubs-ios-get-started/notification-hubs-test-send.png
[31]: ./media/partner-xamarin-notification-hubs-ios-get-started/notification-hub-create-ios-app.png
[32]: ./media/partner-xamarin-notification-hubs-ios-get-started/notification-hub-app-settings.png
[33]: ./media/partner-xamarin-notification-hubs-ios-get-started/notification-hub-entitlements-settings.png

<!-- URLs. -->
[Install Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[iOS Provisioning Portal]: https://go.microsoft.com/fwlink/p/?LinkId=272456
[Visual Studio for Mac]: https://visualstudio.microsoft.com/vs/mac/
[Local and Push Notification Programming Guide]: https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/HandlingRemoteNotifications.html#//apple_ref/doc/uid/TP40008194-CH6-SW1
[Apple Push Notification Service]: https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html
[Apple Push Notification Service fwlink]: https://go.microsoft.com/fwlink/p/?LinkId=272584
[GitHub]: https://github.com/xamarin/mobile-samples/tree/master/Azure/NotificationHubs
[Azure portal]: https://portal.azure.com
