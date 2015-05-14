<properties 
	pageTitle="Get Started with Azure Notification Hubs" 
	description="Learn how to use Azure Notification Hubs to push notifications." 
	services="notification-hubs" 
	documentationCenter="ios" 
	authors="wesmc7777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="notification-hubs" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-ios" 
	ms.devlang="objective-c" 
	ms.topic="hero-article" 
	ms.date="03/16/2015" 
	ms.author="wesmc"/>

# Get started with Notification Hubs

[AZURE.INCLUDE [notification-hubs-selector-get-started](../includes/notification-hubs-selector-get-started.md)]

##Overview

This topic shows you how to use Azure Notification Hubs to send push notifications to an iOS application.
In this tutorial you create a blank iOS app that receives push notifications using the Apple Push Notification service (APNs). When complete, you will be able to broadcast push notifications to all the devices running your app using your notification hub.

This tutorial demonstrates the simple broadcast scenario using notification hubs. 

##Prerequisites

This tutorial requires the following prerequisites:

+ [Mobile Services iOS SDK]
+ [XCode 4.5][Install Xcode]
+ An iOS 5.0 (or later version) capable device
+ iOS Developer Program membership

   > [AZURE.NOTE] Because of push notification configuration requirements, you must deploy and test push notifications on an iOS capable device (iPhone or iPad) instead of in the emulator.

Completing this tutorial is a prerequisite for all other notification hub tutorials for iOS apps.

> [AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fnotification-hubs-ios-get-started).

[AZURE.INCLUDE [Enable Apple Push Notifications](../includes/enable-apple-push-notifications.md)]

##Configure your notification hub

1. In Keychain Access, right-click the quickstart app's new certificate **My Certificates**. Click **Export**, name the file, select the **.p12** format, then click **Save**.

    ![][26]

  Make a note of the file name and location of the exported certificate.

>[AZURE.NOTE] This tutorial creates a QuickStart.p12 file. Your file name and location might be different.

2. Log on to the [Azure Management Portal], and click **+NEW** at the bottom of the screen.

3. Click on **App Services**, then **Service Bus**, then **Notification Hub**, then **Quick Create**.

   	![][27]

4. Type a name for your notification hub, select your desired region, and then click **Create a new Notification Hub**.

   	![][28]

5. Click the namespace you just created (usually ***notification hub name*-ns**), and then click the **Configure** tab at the top.

   	![][29]

6. Click the **Notification Hubs** tab at the top, and then click on the notification hub you just created.

   	![][210]

7. Select the **Configure** tab at the top, and then click **Upload** for the Apple notification settings. Then select the **.p12** certificate you exported earlier, and the password for the certificate. Make sure to select whether you want to use the **Production** (if you want to send push notifications to users that purchased your app from the store) or the **Sandbox** (during development) push service.

   	![][211]

8. Click the **Dashboard** tab at the top, and then click **Connection Information**. Take note of the two connection strings.

   	![][212]

Your notification hub is now configured to work with APNs, and you have the connection strings to register your app and send notifications.

##Connecting your app to the notification hub

1. In XCode, create a new iOS project and select the **Single View Application** template.

   	![][31]

2. Under **Targets**, click your project name, then  expand **Code Signing Identity**, then under **Debug** select the code-signing identity profile. Additionally, if using a newer version of XCode, toggle **Levels** from **Basic** to **All** and set the **Provisioning Profile** line item to the provisioning profile.

   	![][32]

3. Download the Azure Mobile SDK for iOS. Open the .zip file and drag the folder WindowsAzureMessaging.framework into the Framework folder in your XCode project. Select **Copy items in destination group's folder**, then click **OK**.

   	![][33]

4. In your AppDelegate.h file add the following import directive:

         #import <WindowsAzureMessaging/WindowsAzureMessaging.h>

5. In your AppDelegate.m file add the following code in the `didFinishLaunchingWithOptions` method:

         [[UIApplication sharedApplication] registerForRemoteNotificationTypes: UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];

	For iOS 8
   
	 	UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeSound |
                                            UIUserNotificationTypeAlert |
                                            UIUserNotificationTypeBadge
					    					categories:nil];
 
    	[[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    	[[UIApplication sharedApplication] registerForRemoteNotifications];

6. In the same file, add the following method:

	    - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *) deviceToken {
		    SBNotificationHub* hub = [[SBNotificationHub alloc] initWithConnectionString:
		                              @"<connection string>" notificationHubPath:@"mynh"];

		    [hub registerNativeWithDeviceToken:deviceToken tags:nil completion:^(NSError* error) {
		        if (error != nil) {
		            NSLog(@"Error registering for notifications: %@", error);
		        }
	    	}];
		}

7. *(optional)* Again, in the same file, add the following method to display an **UIAlert** if the notification is received while the app is active:


        - (void)application:(UIApplication *)application didReceiveRemoteNotification: (NSDictionary *)userInfo {
		    NSLog(@"%@", userInfo);
		    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
		    [[userInfo objectForKey:@"aps"] valueForKey:@"alert"] delegate:nil cancelButtonTitle:
		    @"OK" otherButtonTitles:nil, nil];
		    [alert show];
		}

8. Run the app on your device.

##Send notification from your backend

You can send notifications using Notification Hubs from any back-end using the [REST interface](http://msdn.microsoft.com/library/windowsazure/dn223264.aspx). In this tutorial you send notifications with a .NET console application. For an example of how to send notifications from an Azure Mobile Services backend integrated with Notification Hubs, see **Get started with push notifications in Mobile Services** ([.NET backend](mobile-services-javascript-backend-ios-get-started-push.md) | [JavaScript backend](mobile-services-javascript-backend-ios-get-started-push.md)).  For an example of how to send notifications using the REST APIs, see **How to use Notification Hubs from Java/PHP** ([Java](notification-hubs-java-backend-how-to.md) | [PHP](notification-hubs-php-backend-how-to.md)).

1. In Visual Studio, from the **File** menu select **New** and then **Project...**, then under **Visual C#** click **Windows** and **Console Application** and click **OK**.  

   	![][20]

	This creates a new console application project.

2. From the **Tools** menu, click **Library Package Manager** and then **Package Manager Console**.

	This displays the Package Manager Console.

6. In the console window, execute the following command:

        Install-Package WindowsAzure.ServiceBus

	This adds a reference to the Azure Service Bus SDK with the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>.

5. Open the file Program.cs and add the following `using` statement:

        using Microsoft.ServiceBus.Notifications;

6. In the **Program** class, add the following method:

        private static async void SendNotificationAsync()
        {
            NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString("<connection string with full access>", "<hub name>");
            var alert = "{\"aps\":{\"alert\":\"Hello from .NET!\"}}";
            await hub.SendAppleNativeNotificationAsync(alert);
        }

	Make sure to replace the "hub name" placeholder with the name of the notification hub that appears in the portal on the **Notification Hubs** tab. Also, replace the connection string placeholder with the connection string called **DefaultFullSharedAccessSignature** that you obtained in the section "Configure your Notification Hub."

	>[AZURE.NOTE]Make sure that you use the connection string with **Full** access, not **Listen** access. The listen access string does not have permissions to send notifications.

5. Then add the following lines in the **Main** method:

         SendNotificationAsync();
		 Console.ReadLine();

5. Press the F5 key to run the console application.

	You should receive an alert on your device. If you are using Wi-fi, make sure your connection is working.

You can find all the possible payloads in the Apple [Local and Push Notification Programming Guide].

##Next steps

In this simple example you broadcast notifications to all your iOS devices. In order to target specific users refer to the tutorial [Use Notification Hubs to push notifications to users], while if you want to segment your users by interest groups you can read [Use Notification Hubs to send breaking news]. Learn more about how to use Notification Hubs in [Notification Hubs Guidance].



<!-- Images. -->
[5]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-step5.png
[6]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-step6.png
[7]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-step7.png

[9]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-step9.png
[10]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-step10.png


[18]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-step18.png
[26]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-27.png


[105]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-05.png
[106]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-06.png
[107]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-07.png
[108]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-08.png
[109]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-09.png
[110]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-10.png
[111]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-11.png
[112]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-12.png
[113]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-13.png
[114]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-14.png
[115]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-15.png
[116]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-16.png

[118]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-18.png
[119]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-19.png

[120]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-20.png
[121]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-21.png
[122]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-22.png
[123]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-23.png
[124]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-24.png
[125]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-25.png
[126]: ./media/notification-hubs-ios-get-started/mobile-services-ios-push-26.png

[27]: ./media/notification-hubs-ios-get-started/notification-hub-create-from-portal.png
[28]: ./media/notification-hubs-ios-get-started/notification-hub-create-from-portal2.png
[29]: ./media/notification-hubs-ios-get-started/notification-hub-select-from-portal.png
[210]: ./media/notification-hubs-ios-get-started/notification-hub-select-from-portal2.png
[211]: ./media/notification-hubs-ios-get-started/notification-hub-configure-ios.png
[212]: ./media/notification-hubs-ios-get-started/notification-hub-connection-strings.png


[213]: ./media/notification-hubs-ios-get-started/notification-hub-create-console-app.png



[215]: ./media/notification-hubs-ios-get-started/notification-hub-scheduler1.png
[216]: ./media/notification-hubs-ios-get-started/notification-hub-scheduler2.png


[31]: ./media/notification-hubs-ios-get-started/notification-hub-create-ios-app.png
[32]: ./media/notification-hubs-ios-get-started/notification-hub-create-ios-app2.png
[33]: ./media/notification-hubs-ios-get-started/notification-hub-create-ios-app3.png


[B102]: ./media/notification-hubs-ios-get-started/notification-hub-clone-mobile-services-ios-push-02.png
[B103]: ./media/notification-hubs-ios-get-started/notification-hub-clone-mobile-services-ios-push-03.png
[B104]: ./media/notification-hubs-ios-get-started/notification-hub-clone-mobile-services-ios-push-04.png
[B105]: ./media/notification-hubs-ios-get-started/notification-hub-clone-mobile-services-ios-push-05.png
[B106]: ./media/notification-hubs-ios-get-started/notification-hub-clone-mobile-services-ios-push-06.png
[B107]: ./media/notification-hubs-ios-get-started/notification-hub-clone-mobile-services-ios-push-07.png
[B108]: ./media/notification-hubs-ios-get-started/notification-hub-clone-mobile-services-ios-push-08.png
[B110]: ./media/notification-hubs-ios-get-started/notification-hub-clone-mobile-services-ios-push-10.png
[B111]: ./media/notification-hubs-ios-get-started/notification-hub-clone-mobile-services-ios-push-11.png
[B9]: ./media/notification-hubs-ios-get-started/notification-hub-clone-mobile-services-ios-push-step9.png
[B10]: ./media/notification-hubs-ios-get-started/notification-hub-clone-mobile-services-ios-push-step10.png


<!-- URLs. -->
[Mobile Services iOS SDK]: http://go.microsoft.com/fwLink/?LinkID=266533
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253

[Get started with Mobile Services]: /develop/mobile/tutorials/get-started-ios
[Azure Management Portal]: https://manage.windowsazure.com/
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/jj927170.aspx
[Install Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[iOS Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456

[Use Notification Hubs to push notifications to users]: notification-hubs-ios-mobile-services-register-user-push-notifications.md
[Use Notification Hubs to send breaking news]: notification-hubs-ios-send-breaking-news.md

[Local and Push Notification Programming Guide]: http://developer.apple.com/library/mac/#documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1

