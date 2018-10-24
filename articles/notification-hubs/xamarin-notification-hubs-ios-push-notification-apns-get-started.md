---
title: Push notifications to Xamarin.iOS apps using Azure Notification Hubs | Microsoft Docs
description: In this tutorial, you learn how to use Azure Notification Hubs to send push notifications to a Xamarin.iOS application.
services: notification-hubs
keywords: ios push notifications,push messages,push notifications,push message
documentationcenter: xamarin
author: dimazaid
manager: kpiteira
editor: spelluru

ms.assetid: 4d4dfd42-c5a5-4360-9d70-7812f96924d2
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin-ios
ms.devlang: dotnet
ms.topic: tutorial
ms.custom: mvc
ms.date: 08/23/2018
ms.author: dimazaid
---
# Tutorial: Push notifications to Xamarin.iOS apps using Azure Notification Hubs

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

- **Azure subscription**. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Latest version of [Xcode][Install Xcode]
- An iOS 10 (or later version) compatible device
- [Apple Developer Program](https://developer.apple.com/programs/) membership.
- [Visual Studio for Mac]
  
  > [!NOTE]
  > Because of configuration requirements for iOS push notifications, you must deploy and test the sample application on a physical iOS device (iPhone or iPad) instead of in the simulator.

Completing this tutorial is a prerequisite for all other Notification Hubs tutorials for Xamarin.iOS apps.

[!INCLUDE [Notification Hubs Enable Apple Push Notifications](../../includes/notification-hubs-enable-apple-push-notifications.md)]

## Configure your notification hub for iOS push notifications

This section walks you through the steps to create a new notification hub and configure authentication with APNs using the **.p12** push certificate that you previously created. If you want to use a notification hub that you have already created, you can skip to step 5.

[!INCLUDE [notification-hubs-portal-create-new-hub](../../includes/notification-hubs-portal-create-new-hub.md)]

### Configure iOS settings for the notification hub

1. Select **Apple (APNS)** in the **NOTIFICATION SETTINGS** group.
2. Select **Certificate**, click the **file** icon, and select the **.p12** file that you exported earlier.
3. Specify the **password** for the certificate.
4. Select **Sandbox** mode. Use the **Production** mode only if you want to send push notifications to users who purchased your app from the store.

    ![Configure APNs in Azure portal][6]

    ![Configure APNs certification in Azure portal][7]

Your notification hub is now configured to work with APNs, and you have the connection strings to register your app and send push notifications.

## Connect your app to the notification hub

### Create a new project

1. In Visual Studio, create a new iOS project and select the **Single View App** template, and click **Next**

     ![Visual Studio - Select Application Type][31]

2. Enter your App Name and Organization identifier, then hit **Next**, then **Create**

3. From the Solution view, double-click *Info.plist* and under **Identity** make sure your Bundle Identifier matches the one used when creating your provisioning profile. Under **Signing** ensure that your Developer account is selected under **Team**, "Automatically manage signing" is selected and your Signing Certificate and Provisioning Profile are automatically selected.

    ![Visual Studio- iOS App Config][32]

4. From the Solution view, double-click *Entitlements.plist* and ensure that **Enable Push Notifications**"** is checked.

    ![Visual Studio- iOS Entitlements Config][33]

5. Add the Azure Messaging package. In the Solution view, right-click the project and select **Add** > **Add NuGet Packages**. Search for **Xamarin.Azure.NotificationHubs.iOS** and add the package to your project.

6. Add a new file to your class, name it **Constants.cs** and add the following variables and replace the string literal placeholders with your *hub name* and the *DefaultListenSharedAccessSignature* noted earlier.

    ```csharp
    // Azure app-specific connection string and hub path
    public const string ListenConnectionString = "<Azure DefaultListenSharedAccess Connection String>";
    public const string NotificationHubName = "<Azure Notification Hub Name>";
    ```

7. In **AppDelegate.cs**, add the following using statement:

    ```csharp
    using WindowsAzure.Messaging;
    ```

8. Declare an instance of **SBNotificationHub**:

    ```csharp
    private SBNotificationHub Hub { get; set; }
    ```

9. In **AppDelegate.cs**, update **FinishedLaunching()** to match the following code:

    ```csharp
    public override bool FinishedLaunching(UIApplication application, NSDictionary launchOptions)
    {
        if (UIDevice.CurrentDevice.CheckSystemVersion(10, 0))
        {
            UNUserNotificationCenter.Current.RequestAuthorization(UNAuthorizationOptions.Alert | UNAuthorizationOptions.Sound | UNAuthorizationOptions.Sound,
                                                                    (granted, error) =>
            {
                if (granted)
                    InvokeOnMainThread(UIApplication.SharedApplication.RegisterForRemoteNotifications);
            });
        } else if (UIDevice.CurrentDevice.CheckSystemVersion (8, 0)) {
            var pushSettings = UIUserNotificationSettings.GetSettingsForTypes (
                    UIUserNotificationType.Alert | UIUserNotificationType.Badge | UIUserNotificationType.Sound,
                    new NSSet ());

            UIApplication.SharedApplication.RegisterUserNotificationSettings (pushSettings);
            UIApplication.SharedApplication.RegisterForRemoteNotifications ();
        } else {
            UIRemoteNotificationType notificationTypes = UIRemoteNotificationType.Alert | UIRemoteNotificationType.Badge | UIRemoteNotificationType.Sound;
            UIApplication.SharedApplication.RegisterForRemoteNotificationTypes (notificationTypes);
        }

        return true;
    }
    ```

10. Override the **RegisteredForRemoteNotifications()** method in **AppDelegate.cs**:

    ```csharp
    public override void RegisteredForRemoteNotifications(UIApplication application, NSData deviceToken)
    {
        Hub = new SBNotificationHub(Constants.ListenConnectionString, Constants.NotificationHubName);

        Hub.UnregisterAllAsync (deviceToken, (error) => {
            if (error != null)
            {
                System.Diagnostics.Debug.WriteLine("Error calling Unregister: {0}", error.ToString());
                return;
            }

            NSSet tags = null; // create tags if you want
            Hub.RegisterNativeAsync(deviceToken, tags, (errorCallback) => {
                if (errorCallback != null)
                    System.Diagnostics.Debug.WriteLine("RegisterNativeAsync error: " + errorCallback.ToString());
            });
        });
    }
    ```

11. Override the **ReceivedRemoteNotification()** method in **AppDelegate.cs**:

    ```csharp
    public override void ReceivedRemoteNotification(UIApplication application, NSDictionary userInfo)
    {
        ProcessNotification(userInfo, false);
    }
    ```

12. Create the following **ProcessNotification()** method in **AppDelegate.cs**:

    ```csharp
    void ProcessNotification(NSDictionary options, bool fromFinishedLaunching)
    {
        // Check to see if the dictionary has the aps key.  This is the notification payload you would have sent
        if (null != options && options.ContainsKey(new NSString("aps")))
        {
            //Get the aps dictionary
            NSDictionary aps = options.ObjectForKey(new NSString("aps")) as NSDictionary;

            string alert = string.Empty;

            //Extract the alert text
            // NOTE: If you're using the simple alert by just specifying
            // "  aps:{alert:"alert msg here"}  ", this will work fine.
            // But if you're using a complex alert with Localization keys, etc.,
            // your "alert" object from the aps dictionary will be another NSDictionary.
            // Basically the JSON gets dumped right into a NSDictionary,
            // so keep that in mind.
            if (aps.ContainsKey(new NSString("alert")))
                alert = (aps [new NSString("alert")] as NSString).ToString();

            //If this came from the ReceivedRemoteNotification while the app was running,
            // we of course need to manually process things like the sound, badge, and alert.
            if (!fromFinishedLaunching)
            {
                //Manually show an alert
                if (!string.IsNullOrEmpty(alert))
                {
                    UIAlertView avAlert = new UIAlertView("Notification", alert, null, "OK", null);
                    avAlert.Show();
                }
            }
        }
    }
    ```

    > [!NOTE]
    > You can choose to override **FailedToRegisterForRemoteNotifications()** to handle situations such as no network connection. This is especially important where the user might start your application in offline mode (for example, Airplane) and you want to handle push messaging scenarios specific to your app.

13. Run the app on your device.

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
[iOS Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456
[Visual Studio for Mac]: https://visualstudio.microsoft.com/vs/mac/

[Local and Push Notification Programming Guide]: https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/HandlingRemoteNotifications.html#//apple_ref/doc/uid/TP40008194-CH6-SW1
[Apple Push Notification Service]: https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html
[Apple Push Notification Service fwlink]: http://go.microsoft.com/fwlink/p/?LinkId=272584

[GitHub]: https://github.com/xamarin/mobile-samples/tree/master/Azure/NotificationHubs
[Azure portal]: https://portal.azure.com