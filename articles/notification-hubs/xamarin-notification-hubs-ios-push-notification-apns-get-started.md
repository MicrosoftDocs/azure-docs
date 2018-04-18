---
title: Get started with Azure Notification Hubs for Xamarin.iOS apps| Microsoft Docs
description: In this tutorial, you learn how to use Azure Notification Hubs to send push notifications to a Xamarin iOS application.
services: notification-hubs
keywords: ios push notifications,push messages,push notifications,push message
documentationcenter: xamarin
author: jwhiteDev
manager: kpiteira
editor: ''

ms.assetid: 4d4dfd42-c5a5-4360-9d70-7812f96924d2
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin-ios
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 12/22/2017
ms.author: jawh

---
# Get started with Azure Notification Hubs for Xamarin.iOS apps
[!INCLUDE [notification-hubs-selector-get-started](../../includes/notification-hubs-selector-get-started.md)]

## Overview
> [!NOTE]
> To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A643EE910&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fpartner-xamarin-notification-hubs-ios-get-started).
> 
> 

This tutorial shows you how to use Azure Notification Hubs to send push notifications to an iOS application. You'll create a blank Xamarin.iOS app that receives push notifications by using the [Apple Push Notification Service (APNs)](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html). 

When you're finished, you'll be able to use your notification hub to broadcast push notifications to all the devices running your app. The finished code is available in the [NotificationHubs app][GitHub] sample.

This tutorial demonstrates the simple push message broadcast scenario with Notification Hubs.

## Prerequisites
This tutorial requires the following:

* Latest version of [XCode][Install Xcode]
* An iOS 10 (or later version) compatible device
* [Apple Developer Program](https://developer.apple.com/programs/) membership.
* [Visual Studio for Mac]
  
  > [!NOTE]
  > Because of configuration requirements for iOS push notifications, you must deploy and test the sample application on a physical iOS device (iPhone or iPad) instead of in the simulator.
  > 
  > 

Completing this tutorial is a prerequisite for all other Notification Hubs tutorials for Xamarin.iOS apps.

[!INCLUDE [Notification Hubs Enable Apple Push Notifications](../../includes/notification-hubs-enable-apple-push-notifications.md)]

## Configure your Notification Hub for iOS push notifications
This section walks you through the steps to create a new notification hub and configure authentication with APNS using the **.p12** push certificate that you previously created. If you want to use a notification hub that you have already created, you can skip to step 5.

[!INCLUDE [notification-hubs-portal-create-new-hub](../../includes/notification-hubs-portal-create-new-hub.md)]

<ol start="6">

<li>

<p>Click the <b>Notification Services</b> button, then select <b>Apple (APNS)</b>. Make sure to select <b>Certificate</b>, click the file icon, and select the <b>.p12</b> file that you exported earlier. Make sure you also specify the correct password.</p>

<p>Make sure to select <b>Sandbox</b> mode since this is for development. Only use the <b>Production</b> if you want to send push notifications to users who purchased your app from the store.</p>
</li>
</ol>

&emsp;&emsp;&emsp;&emsp;![Configure APNS in Azure portal][6]

&emsp;&emsp;&emsp;&emsp;![Configure APNS certification in Azure portal][7]

Your notification hub is now configured to work with APNS, and you have the connection strings to register your app and send push notifications.

## Connect your app to the notification hub
#### Create a new project
1. In Visual Studio, create a new iOS project and select the **Single View App** template, and click **Next**
   
     ![Visual Studio - Select Application Type][31]

2. Enter your App Name and Organization identifier, then hit **Next**, then **Create**

3. From the Solution view, double click *Info.plist* and under **Identity** make sure your Bundle Identifier matches the one used when creating your provisioning profile. Under **Signing** ensure that your Developer account is selected under **Team**, "Automatically manage signing" is selected and your Signing Certificate and Provisioning Profile are automatically selected.

    ![Visual Studio- iOS App Config][32]

4. Add the Azure Messaging package. In the Solution view, right-click the project and select **Add** > **Add NuGet Packages**. Search for **Xamarin.Azure.NotificationHubs.iOS** and add the package to your project.

5. Add a new file to your class, name it **Constants.cs** and add the following variables and replace the string literal placeholders with your *hub name* and the *DefaultListenSharedAccessSignature* noted earlier.
   
    ```csharp
        // Azure app-specific connection string and hub path
        public const string ConnectionString = "<Azure connection string>";
        public const string NotificationHubPath = "<Azure hub path>";
    ```

6. In **AppDelegate.cs**, add the following using statement:
   
    ```csharp
        using WindowsAzure.Messaging;
    ```

7. Declare an instance of **SBNotificationHub**:
   
    ```csharp
        private SBNotificationHub Hub { get; set; }
    ```

8. In **AppDelegate.cs**, update **FinishedLaunching()** to match the following:
   
    ```csharp
        public override bool FinishedLaunching(UIApplication application, NSDictionary launchOptions)
        {
            if (UIDevice.CurrentDevice.CheckSystemVersion (8, 0)) {
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

9. Override the **RegisteredForRemoteNotifications()** method in **AppDelegate.cs**:
   
    ```csharp
        public override void RegisteredForRemoteNotifications(UIApplication application, NSData deviceToken)
        {
            Hub = new SBNotificationHub(Constants.ConnectionString, Constants.NotificationHubPath);
   
            Hub.UnregisterAllAsync (deviceToken, (error) => {
                if (error != null)
                {
                    Console.WriteLine("Error calling Unregister: {0}", error.ToString());
                    return;
                }
   
                NSSet tags = null; // create tags if you want
                Hub.RegisterNativeAsync(deviceToken, tags, (errorCallback) => {
                    if (errorCallback != null)
                        Console.WriteLine("RegisterNativeAsync error: " + errorCallback.ToString());
                });
            });
        }
    ```

10. Override the **ReceivedRemoteNotification()** method in **AppDelegate.cs**:
   
    ```csharp
        public override void ReceivedRemoteNotification(UIApplication application, NSDictionary userInfo)
        {
            ProcessNotification(userInfo, false);
        }
    ```

11. Create the following **ProcessNotification()** method in **AppDelegate.cs**:
   
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
  

12. Run the app on your device.

## Sending Test Push Notifications
You can test receiving notifications in your app with the *Test Send* option in the [Azure portal]. This sends a test push notification to your device.

![Azure portal - Test Send][30]

Push notifications are normally sent in a back-end service like Mobile Apps or ASP.NET using a compatible library. If a library is not available for your back-end you can also use the REST API directly to send notification messages.

As a next step it is recommended to view the [Use Notification Hubs to push notifications to users](notification-hubs-aspnet-backend-ios-apple-apns-notification.md) tutorial as the next step for sending notifications from an ASP.NET back-end. However, the following approaches can be used for sending notifications:

Here is a list of some other tutorials you may want to review for sending notifications:
* REST Interface:  You can support push notification on any back-end platform using  the [REST interface](http://msdn.microsoft.com/library/windowsazure/dn223264.aspx).
* **Microsoft Azure Notification Hubs .NET SDK**: In the Nuget Package Manager for Visual Studio, run [Install-Package Microsoft.Azure.NotificationHubs](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/).
* Node.js: [How to use Notification Hubs from Node.js](notification-hubs-nodejs-push-notification-tutorial.md).
* Java / PHP**: For an example of how to send push notifications by using the REST APIs, see "How to use Notification Hubs from Java/PHP" ([Java](notification-hubs-java-push-notification-tutorial.md) | [PHP](notification-hubs-php-push-notification-tutorial.md)).

## Next steps
In this simple example, you broadcasted push notifications to all your iOS devices. In order to target specific users, refer to the tutorial [Use Notification Hubs to push notifications to users]. If you want to segment your users by interest groups, you can read [Use Notification Hubs to send breaking news]. Learn more about how to use Notification Hubs in [Notification Hubs Guidance] and in the [Notification Hubs How-To for iOS].

<!-- Images. -->
[6]: ./media/notification-hubs-ios-get-started/notification-hubs-apple-config.png
[7]: ./media/notification-hubs-ios-get-started/notification-hubs-apple-config-cert.png
[213]: ./media/partner-xamarin-notification-hubs-ios-get-started/notification-hub-create-console-app.png

[215]: ./media/partner-xamarin-notification-hubs-ios-get-started/notification-hub-scheduler1.png
[216]: ./media/partner-xamarin-notification-hubs-ios-get-started/notification-hub-scheduler2.png

[30]: ./media/notification-hubs-ios-get-started/notification-hubs-test-send.png
[31]: ./media/partner-xamarin-notification-hubs-ios-get-started/notification-hub-create-ios-app.png
[32]: ./media/partner-xamarin-notification-hubs-ios-get-started/notification-hub-app-settings.png



<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Windows Azure Messaging Framework]: http://go.microsoft.com/fwlink/?LinkID=799698&clcid=0x409
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started-xamarin-ios
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/jj927170.aspx
[Notification Hubs How-To for iOS]: http://msdn.microsoft.com/library/jj927168.aspx
[Install Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[iOS Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456
[Visual Studio for Mac]: https://www.visualstudio.com/vs/visual-studio-mac/
[Use Notification Hubs to push notifications to users]: /manage/services/notification-hubs/notify-users-aspnet
[Use Notification Hubs to send breaking news]: /manage/services/notification-hubs/breaking-news-dotnet

[Local and Push Notification Programming Guide]:https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/HandlingRemoteNotifications.html#//apple_ref/doc/uid/TP40008194-CH6-SW1
[Apple Push Notification Service]: http://go.microsoft.com/fwlink/p/?LinkId=272584

[Azure Mobile Services Component]: http://components.xamarin.com/view/azure-mobile-services/
[GitHub]: https://github.com/xamarin/mobile-samples/tree/master/Azure/NotificationHubs
[Azure Portal]: https://portal.azure.com
