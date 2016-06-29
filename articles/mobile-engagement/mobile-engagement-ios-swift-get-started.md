<properties
	pageTitle="Get Started with Azure Mobile Engagement for iOS in Swift"
	description="Learn how to use Azure Mobile Engagement with Analytics and Push Notifications for iOS Apps."
	services="mobile-engagement"
	documentationCenter="ios"
	authors="piyushjo"
	manager="dwrede"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="swift"
	ms.topic="hero-article"
	ms.date="05/03/2016"
	ms.author="piyushjo" />

# Get Started with Azure Mobile Engagement for iOS Apps in Swift

[AZURE.INCLUDE [Hero tutorial switcher](../../includes/mobile-engagement-hero-tutorial-switcher.md)]

This topic shows you how to use Azure Mobile Engagement to understand your app usage and send push notifications to segmented users to an iOS application.
In this tutorial, you create a blank iOS app that collects basic data and receives push notifications using Apple Push Notification System (APNS).

This tutorial requires the following:

+ XCode 6 or XCode 7, which you can install from your MAC App Store
+ the [Mobile Engagement iOS SDK]
+ Push notification certificate (.p12) that you can obtain on your Apple Dev Center

> [AZURE.NOTE] This tutorial uses Swift version 2.0. 

Completing this tutorial is a prerequisite for all other Mobile Engagement tutorials for iOS apps.

> [AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-engagement-ios-swift-get-started).

##<a id="setup-azme"></a>Setup Mobile Engagement for your iOS app

[AZURE.INCLUDE [Create Mobile Engagement App in Portal](../../includes/mobile-engagement-create-app-in-portal.md)]

##<a id="connecting-app"></a>Connect your app to the Mobile Engagement backend

This tutorial presents a "basic integration", which is the minimal set required to collect data and send a push notification. The complete integration documentation can be found in the [Mobile Engagement iOS SDK integration](mobile-engagement-ios-sdk-overview.md)

We will create a basic app with XCode to demonstrate the integration:

###Create a new iOS project

[AZURE.INCLUDE [Create a new iOS Project](../../includes/mobile-engagement-create-new-ios-app.md)]

###Connect your app to Mobile Engagement backend

1. Download the [Mobile Engagement iOS SDK]
2. Extract the .tar.gz file to a folder in your computer
3. Right click the project and select "Add files to ..."

	![][1]

4. Navigate to the folder where you extracted the SDK and select the `EngagementSDK` folder then press OK.

	![][2]

5. Open the `Build Phases` tab and in the `Link Binary With Libraries` menu add the frameworks as shown below. **NOTE** You must include `CoreLocation, CFNetwork, CoreTelephony, and SystemConfiguration` :

	![][3]

6. For **XCode 7** - add `libxml2.tbd` instead of `libxml2.dylib`.

7. Create a Bridging header to be able to use the SDK's Objective C APIs by choosing File > New > File > iOS > Source > Header File.

	![][4]

8. Edit the bridging header file to expose Mobile Engagement Objective-C code to your Swift code, add the following imports :

		/* Mobile Engagement Agent */
		#import "AEModule.h"
		#import "AEPushMessage.h"
		#import "AEStorage.h"
		#import "EngagementAgent.h"
		#import "EngagementTableViewController.h"
		#import "EngagementViewController.h"
		#import "AEIdfaProvider.h"

9. Under Build Settings, make sure the Objective-C Bridging Header build setting under Swift Compiler - Code Generation has a path to this header. Here is a path example: **$(SRCROOT)/MySuperApp/MySuperApp-Bridging-Header.h (depending on the path)**

	![][6]

10. Go back to the Azure portal in your app's *Connection Info* page and copy the Connection String

	![][5]

11. Now paste the connection string in the `didFinishLaunchingWithOptions` delegate

		func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool
		{
  			[...]
				EngagementAgent.init("Endpoint={YOUR_APP_COLLECTION.DOMAIN};SdkKey={YOUR_SDK_KEY};AppId={YOUR_APPID}")
  			[...]
		}

##<a id="monitor"></a>Enabling real-time monitoring

In order to start sending data and ensuring that the users are active, you must send at least one screen (Activity) to the Mobile Engagement backend.

1. Open the **ViewController.swift** file and replace the base class of **ViewController** to be **EngagementViewController**:

	`class ViewController : EngagementViewController {`

##<a id="monitor"></a>Connect app with real-time monitoring

[AZURE.INCLUDE [Connect app with real-time monitoring](../../includes/mobile-engagement-connect-app-with-monitor.md)]

##<a id="integrate-push"></a>Enabling Push Notifications and in-app messaging

Mobile Engagement allows you to interact and REACH with your users with Push Notifications and In-app Messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections will setup your app to receive them.

### Enable your app to receive Silent Push Notifications

[AZURE.INCLUDE [mobile-engagement-ios-silent-push](../../includes/mobile-engagement-ios-silent-push.md)]

### Add the Reach library to your project

1. Right click your project
2. Select `Add file to ...`
3. Navigate to the folder where you extracted the SDK
4. Select the `EngagementReach` folder
5. Click Add
6. Edit the bridging header file to expose Mobile Engagement Objective-C Reach headers and add the following imports :

		/* Mobile Engagement Reach */
		#import "AEAnnouncementViewController.h"
		#import "AEAutorotateView.h"
		#import "AEContentViewController.h"
		#import "AEDefaultAnnouncementViewController.h"
		#import "AEDefaultNotifier.h"
		#import "AEDefaultPollViewController.h"
		#import "AEInteractiveContent.h"
		#import "AENotificationView.h"
		#import "AENotifier.h"
		#import "AEPollViewController.h"
		#import "AEReachAbstractAnnouncement.h"
		#import "AEReachAnnouncement.h"
		#import "AEReachContent.h"
		#import "AEReachDataPush.h"
		#import "AEReachDataPushDelegate.h"
		#import "AEReachModule.h"
		#import "AEReachNotifAnnouncement.h"
		#import "AEReachPoll.h"
		#import "AEReachPollQuestion.h"
		#import "AEViewControllerUtil.h"
		#import "AEWebAnnouncementJsBridge.h"

### Modify your Application Delegate

1. Inside  the `didFinishLaunchingWithOptions` -  create a reach module and pass it to your existing Engagement initialization line:

		func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
			let reach = AEReachModule.moduleWithNotificationIcon(UIImage(named:"icon.png")) as! AEReachModule
			EngagementAgent.init("Endpoint={YOUR_APP_COLLECTION.DOMAIN};SdkKey={YOUR_SDK_KEY};AppId={YOUR_APPID}", modulesArray:[reach])
			[...]
			return true
		}

###Enable your app to receive APNS Push Notifications
1. Add the following line to the `didFinishLaunchingWithOptions` method:

		/* Ask user to receive push notifications */
		if #available(iOS 8.0, *)
		{
		   let settings = UIUserNotificationSettings(forTypes: [UIUserNotificationType.Alert, UIUserNotificationType.Badge, UIUserNotificationType.Sound], categories: nil)
		   application.registerUserNotificationSettings(settings)
		   application.registerForRemoteNotifications()
		}
		else
		{
		   application.registerForRemoteNotificationTypes([UIRemoteNotificationType.Alert, UIRemoteNotificationType.Badge, UIRemoteNotificationType.Sound])
		}

2. Add the `didRegisterForRemoteNotificationsWithDeviceToken` method as follows:

		func application(application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: NSData)
		{
			EngagementAgent.shared().registerDeviceToken(deviceToken)
		}

3. Add the `didReceiveRemoteNotification:fetchCompletionHandler:` method as follows:

		func application(application: UIApplication, didReceiveRemoteNotification userInfo: [NSObject : AnyObject], fetchCompletionHandler completionHandler: (UIBackgroundFetchResult) -> Void)
		{
			EngagementAgent.shared().applicationDidReceiveRemoteNotification(userInfo, fetchCompletionHandler:completionHandler)
		}

[AZURE.INCLUDE [mobile-engagement-ios-send-push-push](../../includes/mobile-engagement-ios-send-push.md)]

<!-- URLs. -->
[Mobile Engagement iOS SDK]: http://aka.ms/qk2rnj

<!-- Images. -->
[1]: ./media/mobile-engagement-ios-get-started/xcode-add-files.png
[2]: ./media/mobile-engagement-ios-get-started/xcode-select-engagement-sdk.png
[3]: ./media/mobile-engagement-ios-get-started/xcode-build-phases.png
[4]: ./media/mobile-engagement-ios-swift-get-started/add-header-file.png
[5]: ./media/mobile-engagement-ios-get-started/app-connection-info-page.png
[6]: ./media/mobile-engagement-ios-swift-get-started/add-bridging-header.png
