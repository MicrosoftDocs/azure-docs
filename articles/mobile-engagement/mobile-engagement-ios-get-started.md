<properties
	pageTitle="Get Started with Azure Mobile Engagement for iOS in Objective C"
	description="Learn how to use Azure Mobile Engagement with analytics and push notifications for iOS apps."
	services="mobile-engagement"
	documentationCenter="ios"
	authors="piyushjo"
	manager="dwrede"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="hero-article"
	ms.date="05/03/2016"
	ms.author="piyushjo" />

# Get Started with Azure Mobile Engagement for iOS apps in Objective C

[AZURE.INCLUDE [Hero tutorial switcher](../../includes/mobile-engagement-hero-tutorial-switcher.md)]

This topic shows you how to use Azure Mobile Engagement to understand your app usage and send push notifications to segmented users to an iOS application.
In this tutorial, you create a blank iOS app that collects basic data and receives push notifications using Apple Push Notification System (APNS).

This tutorial requires the following:

+ XCode 6 or XCode 7, which you can install from your MAC App Store
+ the [Mobile Engagement iOS SDK]

Completing this tutorial is a prerequisite for all other Mobile Engagement tutorials for iOS apps.

> [AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-engagement-ios-get-started).

##<a id="setup-azme"></a>Setup Mobile Engagement for your iOS app

[AZURE.INCLUDE [Create Mobile Engagement App in Portal](../../includes/mobile-engagement-create-app-in-portal.md)]

##<a id="connecting-app"></a>Connect your app to the Mobile Engagement backend

This tutorial presents a "basic integration", which is the minimal set required to collect data and send a push notification. The complete integration documentation can be found in the [Mobile Engagement iOS SDK integration](mobile-engagement-ios-sdk-overview.md)

We will create a basic app with XCode to demonstrate the integration.

###Create a new iOS project

[AZURE.INCLUDE [Create a new iOS Project](../../includes/mobile-engagement-create-new-ios-app.md)]

###Connect your app to the Mobile Engagement backend

1. Download the [Mobile Engagement iOS SDK].
2. Extract the .tar.gz file to a folder in your computer.
3. Right-click the project, and then select **Add files to**.

	![][1]

4. Navigate to the folder where you extracted the SDK, select the `EngagementSDK` folder, and then press **OK**.

	![][2]

5. Open the **Build Phases** tab, and in the **Link Binary With Libraries** menu, add the frameworks as shown below:

	![][3]

6. For **XCode 7** - add `libxml2.tbd` instead of `libxml2.dylib`.

7. Go back to the Azure portal in your app's **Connection Info** page and copy the connection string.

	![][4]

8. Add the following line of code in your **AppDelegate.m** file.

		#import "EngagementAgent.h"

9. Now paste the connection string in the `didFinishLaunchingWithOptions` delegate.

		- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
		{
  			[...]
			//[EngagementAgent setTestLogEnabled:YES];
   
  			[EngagementAgent init:@"Endpoint={YOUR_APP_COLLECTION.DOMAIN};SdkKey={YOUR_SDK_KEY};AppId={YOUR_APPID}"];
  			[...]
		}

10. `setTestLogEnabled` is an optional statement which enables SDK logs for you to identify issues. 

##<a id="monitor"></a>Enable real-time monitoring

In order to start sending data and ensuring that the users are active, you must send at least one screen (Activity) to the Mobile Engagement backend.

1. Open the **ViewController.h** file and import **EngagementViewController.h**:

    `# import "EngagementViewController.h"`

2. Now replace the super class of the **ViewController** interface by `EngagementViewController`:

	`@interface ViewController : EngagementViewController`

##<a id="monitor"></a>Connect app with real-time monitoring

[AZURE.INCLUDE [Connect app with real-time monitoring](../../includes/mobile-engagement-connect-app-with-monitor.md)]

##<a id="integrate-push"></a>Enable push notifications and in-app messaging

Mobile Engagement allows you to interact with your users and REACH with push notifications and in-app messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections set up your app to receive them.

### Enable your app to receive Silent Push Notifications

[AZURE.INCLUDE [mobile-engagement-ios-silent-push](../../includes/mobile-engagement-ios-silent-push.md)]  

### Add the Reach library to your project

1. Right-click your project.
2. Select **Add file to**.
3. Navigate to the folder where you extracted the SDK.
4. Select the `EngagementReach` folder.
5. Click **Add**.

### Modify your Application Delegate

1. Back in **AppDeletegate.m** file, import the Engagement Reach module.

		#import "AEReachModule.h"

2. Inside the `application:didFinishLaunchingWithOptions` method, create a Reach module and pass it to your existing Engagement initialization line:

		- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
			AEReachModule * reach = [AEReachModule moduleWithNotificationIcon:[UIImage imageNamed:@"icon.png"]];
			[EngagementAgent init:@"Endpoint={YOUR_APP_COLLECTION.DOMAIN};SdkKey={YOUR_SDK_KEY};AppId={YOUR_APPID}" modules:reach, nil];
			[...]
			return YES;
		}

###Enable your app to receive APNS Push Notifications

1. Add the following line to the `application:didFinishLaunchingWithOptions` method:

		if ([application respondsToSelector:@selector(registerUserNotificationSettings:)]) {
			[application registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert) categories:nil]];
			[application registerForRemoteNotifications];
		}
		else {

			[application registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound | UIRemoteNotificationTypeAlert)];
		}

2. Add the `application:didRegisterForRemoteNotificationsWithDeviceToken` method as follows:

		- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
		{
 			[[EngagementAgent shared] registerDeviceToken:deviceToken];
			NSLog(@"Registered Token: %@", deviceToken);
		}

3. Add the `didFailToRegisterForRemoteNotificationsWithError` method as follows:

		- (void)application:(UIApplication*)application didFailToRegisterForRemoteNotificationsWithError:(NSError*)error
		{
		   
		   NSLog(@"Failed to get token, error: %@", error);
		}

4. Add the `didReceiveRemoteNotification:fetchCompletionHandler` method as follows:

		- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))handler
		{
			[[EngagementAgent shared] applicationDidReceiveRemoteNotification:userInfo fetchCompletionHandler:handler];
		}

[AZURE.INCLUDE [mobile-engagement-ios-send-push-push](../../includes/mobile-engagement-ios-send-push.md)]

<!-- URLs. -->
[Mobile Engagement iOS SDK]: http://aka.ms/qk2rnj

<!-- Images. -->
[1]: ./media/mobile-engagement-ios-get-started/xcode-add-files.png
[2]: ./media/mobile-engagement-ios-get-started/xcode-select-engagement-sdk.png
[3]: ./media/mobile-engagement-ios-get-started/xcode-build-phases.png
[4]: ./media/mobile-engagement-ios-get-started/app-connection-info-page.png

