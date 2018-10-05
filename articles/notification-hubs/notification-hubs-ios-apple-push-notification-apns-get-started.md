---
title: Push notifications to iOS apps using Azure Notification Hubs | Microsoft Docs
description: In this tutorial, you learn how to use Azure Notification Hubs to send push notifications to an iOS application.
services: notification-hubs
documentationcenter: ios
keywords: push notification,push notifications,ios push notifications
author: dimazaid
manager: kpiteira
editor: spelluru

ms.assetid: b7fcd916-8db8-41a6-ae88-fc02d57cb914
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-ios
ms.devlang: objective-c
ms.topic: tutorial
ms.custom: mvc
ms.date: 04/14/2018
ms.author: dimazaid
---
# Tutorial: Push notifications to iOS apps using Azure Notification Hubs

[!INCLUDE [notification-hubs-selector-get-started](../../includes/notification-hubs-selector-get-started.md)]

In this tutorial, you use Azure Notification Hubs to push notifications to an iOS application. You create a blank iOS app that receives push notifications by using the [Apple Push Notification service (APNs)](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html#//apple_ref/doc/uid/TP40008194-CH8-SW1). 

In this tutorial, you take the following steps:

> [!div class="checklist"]
> * Generate the certificate signing request file
> * Request your app for push notifications
> * Create a provisioning profile for the app
> * Configure your notification hub for iOS push notifications
> * Connect your iOS app to notification hubs
> * Send test push notifications
> * Verify that your app receives notifications

The completed code for this tutorial can be found [on GitHub](https://github.com/Azure/azure-notificationhubs-samples/tree/master/iOS/GetStartedNH/GetStarted). 

## Prerequisites

- An active Azure account. If you don't have an account, you can create a [free trial account](https://azure.microsoft.com/free) in just a couple of minutes. 
- [Windows Azure Messaging Framework]
- Latest version of [Xcode]
- An iOS 10 (or later version)-capable device
- [Apple Developer Program](https://developer.apple.com/programs/) membership.
  
  > [!NOTE]
  > Because of configuration requirements for push notifications, you must deploy and test push notifications on a physical iOS device (iPhone or iPad) instead of the iOS Simulator.
  
Completing this tutorial is a prerequisite for all other Notification Hubs tutorials for iOS apps.

[!INCLUDE [Notification Hubs Enable Apple Push Notifications](../../includes/notification-hubs-enable-apple-push-notifications.md)]

## Configure your Notification Hub for iOS push notifications
In this section, you create a notification hub and configure authentication with APNS using the **.p12** push certificate that you previously created. If you want to use a notification hub that you have already created, you can skip to step 5.

[!INCLUDE [notification-hubs-portal-create-new-hub](../../includes/notification-hubs-portal-create-new-hub.md)]

### Configure your notification hub with APNS information

1. Under **Notification Services**, select **Apple (APNS)**. 
2. Select **Certificate**.
3. Select the **file icon**.
4. Select the **.p12** file that you exported earlier.
5. Specify the correct **password**.
6. Select **Sandbox** mode. Only use the **Production** if you want to send push notifications to users who purchased your app from the store.

    ![Configure APNS certification in Azure portal][7]

You have now configured your notification hub with APNS, and you have the connection strings to register your app and send push notifications.

## Connect your iOS app to Notification Hubs

1. In Xcode, create a new iOS project and select the **Single View Application** template.

    ![Xcode - Single View Application][8]

2. When setting the options for your new project, make sure to use the same **Product Name** and **Organization Identifier** that you used when you set the bundle identifier in the Apple Developer portal.

    ![Xcode - project options][11]

3. Under Project Navigator, click your project name, click the **General** tab, and find **Signing**. Make sure you select the appropriate Team for your Apple Developer account. XCode should automatically pull down the Provisioning Profile you created previously based on your bundle identifier.

    If you don't see the new provisioning profile that you created in Xcode, try refreshing the profiles for your signing identity. Click **Xcode** on the menu bar, click **Preferences**, click the **Account** tab, click the **View Details** button, click your signing identity, and then click the refresh button in the bottom-right corner.

    ![Xcode - provisioning profile][9]

4. Select the **Capabilities** tab and make sure to enable Push Notifications

    ![Xcode - push capabilities][12]

5. Download the [Windows Azure Messaging Framework] and unzip the file. In Xcode, right-click your project and click the **Add Files to** option to add the **WindowsAzureMessaging.framework** folder to your Xcode project. Select **Options** and make sure **Copy items if needed** is selected, and then click **Add**.

    ![Unzip Azure SDK][10]

6. Add a new header file to your project named **HubInfo.h**. This file holds the constants for your notification hub. Add the following definitions and replace the string literal placeholders with your *hub name* and the *DefaultListenSharedAccessSignature* noted earlier.

    ```objc
    #ifndef HubInfo_h
    #define HubInfo_h

        #define HUBNAME @"<Enter the name of your hub>"
        #define HUBLISTENACCESS @"<Enter your DefaultListenSharedAccess connection string"

    #endif /* HubInfo_h */
    ```

7. Open your **AppDelegate.h** file add the following import directives:

    ```objc
    #import <WindowsAzureMessaging/WindowsAzureMessaging.h>
    #import <UserNotifications/UserNotifications.h> 
    #import "HubInfo.h"
    ```
8. In your **AppDelegate.m file**, add the following code in the **didFinishLaunchingWithOptions** method based on your version of iOS. This code registers your device handle with APNs:

    ```objc
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeSound |
        UIUserNotificationTypeAlert | UIUserNotificationTypeBadge categories:nil];

    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
    ```

9. In the same file, add the following methods:

    ```objc
        - (void) application:(UIApplication *) application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *) deviceToken {
        SBNotificationHub* hub = [[SBNotificationHub alloc] initWithConnectionString:HUBLISTENACCESS
                                    notificationHubPath:HUBNAME];

        [hub registerNativeWithDeviceToken:deviceToken tags:nil completion:^(NSError* error) {
            if (error != nil) {
                NSLog(@"Error registering for notifications: %@", error);
            }
            else {
                [self MessageBox:@"Registration Status" message:@"Registered"];
            }
        }];
        }

    -(void)MessageBox:(NSString *) title message:(NSString *)messageText
    {
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:title message:messageText preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil];
        [alert addAction:okAction];
        [[[[UIApplication sharedApplication] keyWindow] rootViewController] presentViewController:alert animated:YES completion:nil];
    }
    ```

    This code connects to the notification hub using the connection information you specified in HubInfo.h. It then gives the device token to the notification hub so that the notification hub can send notifications.

10. In the same file, add the following method to display a **UIAlert** if the notification is received while the app is active:

    ```objc
    - (void)application:(UIApplication *)application didReceiveRemoteNotification: (NSDictionary *)userInfo {
        NSLog(@"%@", userInfo);
        [self MessageBox:@"Notification" message:[[userInfo objectForKey:@"aps"] valueForKey:@"alert"]];
    }
    ```

11. To verify there are no failures, build and run the app on your device.

## Send test push notifications

You can test receiving notifications in your app with the *Test Send* option in the [Azure portal]. It sends a test push notification to your device.

![Azure portal - Test Send][30]

[!INCLUDE [notification-hubs-sending-notifications-from-the-portal](../../includes/notification-hubs-sending-notifications-from-the-portal.md)]

## Verify that your app receives push notifications

To test push notifications on iOS, you must deploy the app to a physical iOS device. You cannot send Apple push notifications by using the iOS Simulator.

1. Run the app and verify that registration succeeds, and then press **OK**.

    ![iOS App Push Notification Registration Test][33]

2. Next you send a test push notification from the [Azure portal], as described in the previous section.

3. The push notification is sent to all devices that are registered to receive the notifications from the particular Notification Hub.

    ![iOS App Push Notification Receive Test][35]

## Next steps

In this simple example, you broadcasted push notifications to all your registered iOS devices. To learn how to push notifications to specific iOS devices, advance to the following tutorial: 

> [!div class="nextstepaction"]
>[Push notifications to specific devices](notification-hubs-ios-xplat-segmented-apns-push-notification.md)


<!-- Images. -->

[6]: ./media/notification-hubs-ios-get-started/notification-hubs-apple-config.png
[7]: ./media/notification-hubs-ios-get-started/notification-hubs-apple-config-cert.png
[8]: ./media/notification-hubs-ios-get-started/notification-hubs-create-ios-app.png
[9]: ./media/notification-hubs-ios-get-started/notification-hubs-create-ios-app2.png
[10]: ./media/notification-hubs-ios-get-started/notification-hubs-create-ios-app3.png
[11]: ./media/notification-hubs-ios-get-started/notification-hubs-xcode-product-name.png
[12]: ./media/notification-hubs-ios-get-started/notification-hubs-enable-push.png

[30]: ./media/notification-hubs-ios-get-started/notification-hubs-test-send.png

[31]: ./media/notification-hubs-ios-get-started/notification-hubs-ios-ui.png
[32]: ./media/notification-hubs-ios-get-started/notification-hubs-storyboard-view.png
[33]: ./media/notification-hubs-ios-get-started/notification-hubs-test1.png
[35]: ./media/notification-hubs-ios-get-started/notification-hubs-test3.png



<!-- URLs. -->
[Windows Azure Messaging Framework]: http://go.microsoft.com/fwlink/?LinkID=799698&clcid=0x409
[Mobile Services iOS SDK]: http://go.microsoft.com/fwLink/?LinkID=266533
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253

[Get started with Mobile Services]: /develop/mobile/tutorials/get-started-ios
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/jj927170.aspx
[Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[iOS Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456

[Get started with push notifications in Mobile Services]: ../mobile-services-javascript-backend-ios-get-started-push.md
[Azure Notification Hubs Notify Users for iOS with .NET backend]: notification-hubs-aspnet-backend-ios-apple-apns-notification.md
[Use Notification Hubs to send breaking news]: notification-hubs-ios-xplat-segmented-apns-push-notification.md

[Local and Push Notification Programming Guide]: http://developer.apple.com/library/mac/#documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1
[Azure portal]: https://portal.azure.com
