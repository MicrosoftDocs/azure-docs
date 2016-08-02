<properties
	pageTitle="Get Started with Azure Mobile Engagement for Xamarin.iOS"
	description="Learn how to use Azure Mobile Engagement with Analytics and Push Notifications for Xamarin.iOS Apps."
	services="mobile-engagement"
	documentationCenter="xamarin"
	authors="piyushjo"
	manager=""
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-xamarin-ios"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.date="03/25/2016"
	ms.author="piyushjo" />

# Get Started with Azure Mobile Engagement for Xamarin.iOS Apps

[AZURE.INCLUDE [Hero tutorial switcher](../../includes/mobile-engagement-hero-tutorial-switcher.md)]

This topic shows you how to use Azure Mobile Engagement to understand your app usage and send push notifications to segmented users in a Xamarin.iOS application.
In this tutorial, you create a blank Xamarin.iOS app that collects basic data and receives push notifications using Apple Push Notification System (APNS).

This tutorial requires the following:

+ [Xamarin Studio](http://xamarin.com/studio). You can also use Visual Studio with Xamarin but this tutorial uses Xamarin Studio. For installation instructions, see [Setup and Install for Visual Studio and Xamarin](https://msdn.microsoft.com/library/mt613162.aspx). 
+ [Mobile Engagement Xamarin SDK](https://www.nuget.org/packages/Microsoft.Azure.Engagement.Xamarin/)

> [AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-engagement-xamarin-ios-get-started).

##<a id="setup-azme"></a>Setup Mobile Engagement for your iOS app

[AZURE.INCLUDE [Create Mobile Engagement App in Portal](../../includes/mobile-engagement-create-app-in-portal.md)]

##<a id="connecting-app"></a>Connect your app to the Mobile Engagement backend

This tutorial presents a "basic integration" which is the minimal set required to collect data and send a push notification.

We will create a basic app with Xamarin to demonstrate the integration:

###Create a new Xamarin.iOS project

1. Launch Xamarin Studio. Go to **File** -> **New** -> **Solution** 

    ![][1]

2. Select **Single View App**, make sure the selected language is **C#** and then click **Next**.

    ![][2]

3. Fill in the **App Name** and the **Organization Identifier** and then click **Next**. 

    ![][3]

	> [AZURE.IMPORTANT] Make sure that the publishing profile you eventually use to deploy your iOS app is using an App ID which matches exactly with the Bundle Identifier you have here. 

4. Update the **Project Name**, **Solution Name** and **Location** if required and click **Create**.

    ![][4]
 
Xamarin Studio will create the demo app in which we will integrate Mobile Engagement. 

###Connect your app to Mobile Engagement backend

1. Right click the **Packages** folder in the Solution windows and select **Add Packages...**

    ![][5]

2. Search for the **Microsoft Azure Mobile Engagement Xamarin SDK** and add it to your solution.  

    ![][6]
   
3. Open **AppDelegate.cs** and add the following using statement:

		using Microsoft.Azure.Engagement.Xamarin;

4. In the **FinishedLaunching** method, add the following to initialize the connection with Mobile Engagement backend. Make sure to add your **ConnectionString**. This code also uses a dummy **NotificationIcon** which is added by the Mobile Engagement SDK which you may want to replace. 

		EngagementConfiguration config = new EngagementConfiguration {
		                ConnectionString = "YourConnectionStringFromAzurePortal",
		                NotificationIcon = UIImage.FromBundle("close")
		            };
	    EngagementAgent.Init (config);

##<a id="monitor"></a>Enabling real-time monitoring

In order to start sending data and ensuring the users are active, you must send at least one screen to the Mobile Engagement backend.

1. Open **ViewController.cs** and add the following using statement:

		using Microsoft.Azure.Engagement.Xamarin;

2. Replace the class from which `ViewController` inherits from `UIViewController` to `EngagementViewController`. 

##<a id="monitor"></a>Connect app with real-time monitoring

[AZURE.INCLUDE [Connect app with real-time monitoring](../../includes/mobile-engagement-connect-app-with-monitor.md)]

##<a id="integrate-push"></a>Enable push notifications and in-app messaging

Mobile Engagement allows you to interact with your users and REACH with push notifications and in-app messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections set up your app to receive them.

### Modify your Application Delegate

1. Open the **AppDelegate.cs** and add the following using statement:

		using System; 

2. Now inside the `FinishedLaunching` method, add the following to register for push messages after `EngagementAgent.init(...)`

		if (UIDevice.CurrentDevice.CheckSystemVersion(8,0))
        {
            var pushSettings = UIUserNotificationSettings.GetSettingsForTypes (
                (UIUserNotificationType.Badge |
                    UIUserNotificationType.Sound |
                    UIUserNotificationType.Alert),
                null);
            UIApplication.SharedApplication.RegisterUserNotificationSettings (pushSettings);
            UIApplication.SharedApplication.RegisterForRemoteNotifications ();
        }
        else
        {
            UIApplication.SharedApplication.RegisterForRemoteNotificationTypes (
                UIRemoteNotificationType.Badge |
                UIRemoteNotificationType.Sound |
                UIRemoteNotificationType.Alert);
        }

3. Finally - update or add the following methods:

		public override void DidReceiveRemoteNotification (UIApplication application, NSDictionary userInfo, 
            Action<UIBackgroundFetchResult> completionHandler)
        {
            EngagementAgent.ApplicationDidReceiveRemoteNotification(userInfo, completionHandler);
        }

        public override void RegisteredForRemoteNotifications (UIApplication application, NSData deviceToken)
        {
            // Register device token on Engagement
            EngagementAgent.RegisterDeviceToken(deviceToken);
        }

        public override void FailedToRegisterForRemoteNotifications(UIApplication application, NSError error)
        {
            Console.WriteLine("Failed to register for remote notifications: Error '{0}'", error);
        }

4. In your **Info.plist** file in the solution, confirm that the **Bundle Identifier** matches with the **App ID** you have in your provisioning profile in the Apple Dev Center. 

	![][7]

5. In the same **Info.plist** file, make sure that you have checked the **Enable Background Modes** and **Remote Notifications**. 

 	![][8]

6. Run the app on the device you have associated with this publishing profile. 

[AZURE.INCLUDE [mobile-engagement-ios-send-push-push](../../includes/mobile-engagement-ios-send-push.md)]

<!-- Images. -->
[1]: ./media/mobile-engagement-xamarin-ios-get-started/new-solution.png
[2]: ./media/mobile-engagement-xamarin-ios-get-started/app-type.png
[3]: ./media/mobile-engagement-xamarin-ios-get-started/configure-project-name.png
[4]: ./media/mobile-engagement-xamarin-ios-get-started/configure-project-confirm.png
[5]: ./media/mobile-engagement-xamarin-ios-get-started/add-nuget.png
[6]: ./media/mobile-engagement-xamarin-ios-get-started/add-nuget-azme.png
[7]: ./media/mobile-engagement-xamarin-ios-get-started/info-plist-confirm-bundle.png
[8]: ./media/mobile-engagement-xamarin-ios-get-started/info-plist-configure-push.png
