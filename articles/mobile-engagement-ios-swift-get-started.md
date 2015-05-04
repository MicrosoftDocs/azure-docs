<properties 
	pageTitle="Get Started with Azure Mobile Engagement for iOS in Swift" 
	description="Learn how to use Azure Mobile Engagement with Analytics and Push Notifications for iOS Apps."
	services="mobile-engagement" 
	documentationCenter="Mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-ios" 
	ms.devlang="swift" 
	ms.topic="article" 
	ms.date="04/30/2015" 
	ms.author="piyushjo" />

# Get Started with Azure Mobile Engagement for iOS Apps in Swift

> [AZURE.SELECTOR]
- [Windows Universal](mobile-engagement-windows-store-dotnet-get-started.md) 
- [Windows Phone Silverlight](mobile-engagement-windows-phone-get-started.md) 
- [iOS - Obj C](mobile-engagement-ios-get-started.md) 
- [iOS - Swift](mobile-engagement-ios-swift-get-started.md)
- [Android](mobile-engagement-android-get-started.md) 

This topic shows you how to use Azure Mobile Engagement to understand your app usage and send push notifications to segmented users to an iOS application. 
In this tutorial, you create a blank iOS app that collects basic data and receives push notifications using Apple Push Notification System (APNS). When complete, you will be able to broadcast push notifications to all the devices or target specific users based on their devices properties.

This tutorial demonstrates the simple broadcast scenario using Mobile Engagement. Be sure to follow along with the next tutorial to see how to use Mobile Engagement to address specific users and groups of devices. 

This tutorial requires the following:

+ XCode, which you can install from your MAC App Store
+ the [Mobile Engagement iOS SDK]
+ Push notification certificate (.p12) that you can obtain on your Apple Dev Center

Completing this tutorial is a prerequisite for all other Mobile Engagement tutorials for iOS apps. 

> [AZURE.IMPORTANT] Completing this tutorial is a prerequisite for all other Mobile Engagement tutorials for iOS apps, and to complete it, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

<!--
##<a id="register"></a>Enable Apple Push Notification Service

[WACOM.INCLUDE [Enable Apple Push Notifications](../includes/enable-apple-push-notifications.md)]
-->

##<a id="setup-azme"></a>Setup Mobile Engagement for your app

1. Log on to the Azure Management Portal, and then click **+NEW** at the bottom of the screen.

2. Click on **App Services**, then **Mobile Engagement**, and then **Create**.

   	![][7]

3. In the popup that appears, enter the following information:
 
   	![][8]

	- **Application Name**: type the name of your application. Feel free to use any character.
	- **Platform**: Select the target platform (**iOS**) for the app (if your app targets multiple platforms, repeat this tutorial for each platform). 
	- **Application Resource Name**: This is the name by which this application will be accessible via APIs and URLs. You must only use conventional URL characters. The auto generated name should provide you a strong basis. You should also append the platform name to avoid any name clash as this name must be unique.
	- **Location**: Select the data center where this app (and more importantly its Collection) will be hosted.
	- **Collection**: If you have already created an application, select a previously created Collection, otherwise select New Collection.
	- **Collection Name**: This represents your group of applications. It will also ensure all your apps are in a group that will allow aggregated calculations of metrics. You should use your company name or department here if applicable.

4. Select the app you just created in the **Applications** tab.

5. Click on **Connection Info** in order to display the connection settings to put into your SDK integration in your mobile app.
 
   	![][10]

6. Copy the **Connection String** - this is what you will need to identify this app in your Application code and connect with Mobile Engagement from your Phone App.

   	![][11]

##<a id="connecting-app"></a>Connecting your app to the Mobile Engagement backend

This tutorial presents a "basic integration" which is the minimal set required to collect data and send a push notification. The complete integration documentation can be found in the [Mobile Engagement iOS SDK documentation]

We will create a basic app with XCode to demonstrate the integration:

###Create a new iOS project

You may skip this step if you already have an app and are familiar with iOS development

1. Launch Xcode and in the popup, select **Create a new Xcode project**

   	![][12]

2. Select **Single View Application** and click Next

   	![][14]

3. Fill in the **Product Name**, **Organization Name** and **Organization Identifier**. Make sure that you have selected **Swift** in the language. 

   	![][40]

Xcode will create the demo app to which we will integrate Mobile Engagement

###Connect your app to Mobile Engagement backend 

1. Download the [Mobile Engagement iOS SDK]
2. Extract the .tar.gz file to a folder in your computer
3. Right click the project and select "Add files to ..."

	![][17]

4. Navigate to the folder where you extracted the SDK and select the `EngagementSDK` folder then press OK.

	![][18]

5. Open the `Build Phases` tab and in the `Link Binary With Libraries` menu add the frameworks as shown below:

	![][19]

6. Create a Bridging header to be able to use the SDK's Objective C APIs by choosing File > New > File > iOS > Source > Header File.

	![][41]

7. Edit the bridging header file to expose AzME Objective-C code to your Swift code, add the following imports :

		/* Mobile Engagement Agent */
		#import "AEModule.h"
		#import "AEPushDelegate.h"
		#import "AEPushMessage.h"
		#import "AEStorage.h"
		#import "EngagementAgent.h"
		#import "EngagementTableViewController.h"
		#import "EngagementViewController.h"
		#import "AEIdfaProvider.h"

8. Under Build Settings, make sure the Objective-C Bridging Header build setting under Swift Compiler - Code Generation has a path to this header. Here is a path example: **$(SRCROOT)/MySuperApp/MySuperApp-Bridging-Header.h (depending on the path)**

9. Go back to the Azure portal in your app's *Connection Info* page and copy the Connection String

	![][11]

10. Now paste the connection string in the `didFinishLaunchingWithOptions` delegate		

		func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool
		{
  			[...]
				EngagementAgent.init("Endpoint={YOUR_APP_COLLECTION.DOMAIN};SdkKey={YOUR_SDK_KEY};AppId={YOUR_APPID}")
  			[...]
		}

##<a id="monitor"></a>Enabling real-time monitoring

In order to start sending data and ensuring the users are active, you must send at least one screen (Activity) to the Mobile Engagement backend. 

- Open the `ViewController.h` file, import `EngagementViewController.h` and replace the super class of the `ViewController` interface by `EngagementViewController`.

###Ensure your app is connected with realtime monitoring

This section shows you how to make sure your app connects to the Mobile Engagement backend by using Mobile Engagement's realtime monitoring feature.

1. Navigate to your Mobile Engagement portal

	From your Azure portal, ensure you're in the app we're using for this project and then click on the "Engage" button at the bottom:

	![][26]

2. You will land in the settings page in your Engagement Portal for your app. From there click on the "Monitor" tab:

	![][30]

3. The monitor is ready to show you any device, in realtime, that will launch your app:

	![][31]

4. Back in Xcode, launch your app either in the simulator or in a connected device

5. If it worked, you should now see one session in the monitor! 

**Congratulations!** You suceeded the first step of this tutorial and have an app that connects to the Mobile Engagement backend, and that is already sending data

6. Clicking the Home button of the simulator will bring back the number of sessions in the monitor back to 0 as shown above

	![][33]

##<a id="integrate-push"></a>Enabling Push Notifications and in-app messaging

Mobile Engagement allows you to interact and REACH with your users with Push Notifications and In-app Messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections will setup your app to receive them.

### Add the Reach library to your project

1. Right click your project
2. Select `Add file to ...`
3. Navigate to the folder where you extracted the SDK
4. Select the `EngagementReach` folder
5. Click Add
6. Edit the bridging header file to expose AzME Objective-C Reach headers, add the following imports :

		/* Mobile Engagement Reach */
		#import "AE_TBXML.h"
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
		#import "AEViewControllerUtil.h"
		#import "AEWebAnnouncementJsBridge.h"

### Modify your Application Delegate

1. Inside  the `didFinishLaunchingWithOptions`  create a reach module and pass it to your existing Engagement initialization line:

		func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
			let reach = AEReachModule.moduleWithNotificationIcon(UIImage(named:"icon.png")) as! AEReachModule
			EngagementAgent.init("Endpoint={YOUR_APP_COLLECTION.DOMAIN};SdkKey={YOUR_SDK_KEY};AppId={YOUR_APPID}", modulesArray:[reach])
			[...]
			return true
		}	

###Enable your app to receive APNS Push Notifications
1. Add the following line to the `didFinishLaunchingWithOptions` method:

		if application.respondsToSelector("registerUserNotificationSettings:")
		{
			application.registerUserNotificationSettings(UIUserNotificationSettings(
			forTypes: (UIUserNotificationType.Alert | UIUserNotificationType.Badge | UIUserNotificationType.Sound),
			categories: nil))
			application.registerForRemoteNotifications()
		}
		else
		{
			application.registerForRemoteNotificationTypes(UIRemoteNotificationType.Alert | UIRemoteNotificationType.Badge | UIRemoteNotificationType.Sound)
		}

2. Add the `didRegisterForRemoteNotificationsWithDeviceToken` method as follows:

		func application(application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: NSData)
		{
			EngagementAgent.shared().registerDeviceToken(deviceToken)
		}

3. Add the `didReceiveRemoteNotification` method as follows:

		func application(application: UIApplication, didReceiveRemoteNotification userInfo: [NSObject : AnyObject])
		{
			EngagementAgent.shared().applicationDidReceiveRemoteNotification(userInfo)
		}

###Grant access to your Push Certificate to Mobile Engagement

To allow Mobile Engagement to send Push Notifications on your behalf, you need to grant it access to your certificate. This is done by configuring and entering your certificate into the Mobile Engagement portal. Make sure you obtain your .p12 certificate as explained in Apple's documentation.

1. Navigate to your Mobile Engagement portal. Ensure you're in the app we're using for this project and then click on the "Engage" button at the bottom:

	![][26]

2. You will land in the settings page in your Engagement Portal. From there click on the "Native Push" section to upload your p12 certificate:

	![][27]

3. Select your p12, upload it and type your password:

	![][28]

4. Now add your provisioning profile and build your app for a target device

You're all set, now we will verify that you have correctly done this basic integration

##<a id="send"></a>Send a notification to your app

We will now create a simple Push Notification campaign that will send a push to our app:

1. Navigate to the Reach tab in your Mobile Engagement portal

2. click **New Announcement** to create your push campaign
	
	![][35]

3. Setup the first field of your campaign:

	![][36]

	- 	Name your campaign with any name you wish
	- 	Select the Delivery time as "Out of app only": this is the simple Apple push notification type that features some text.
	- 	In the notification text, type first the Title which will be the first line in the push
	- 	Then type your message which will be the second line


4. Scroll down, and in the content section select "Notification only"

	![][37]

5. You're done setting the most basic campaign possible, now scroll down again and create your campaign to save it!
![][38]

6. Last step, Activate your campaign
![][39]

7. You should see a push notification in your device!

<!-- URLs. -->
[Mobile Engagement iOS SDK]: http://go.microsoft.com/?linkid=9864553
[Mobile Engagement Android SDK documentation]: http://go.microsoft.com/?linkid=9874682

<!-- Images. -->
[7]: ./media/mobile-engagement-common/create-mobile-engagement-app.png
[8]: ./media/mobile-engagement-common/create-azme-popup.png
[10]: ./media/mobile-engagement-common/app-main-page-select-connection-info.png
[11]: ./media/mobile-engagement-common/app-connection-info-page.png
[12]: ./media/mobile-engagement-ios-get-started/xcode-new-project.png
[13]: ./media/mobile-engagement-ios-get-started/xcode-project-props.png
[14]: ./media/mobile-engagement-ios-get-started/xcode-simple-view.png
[17]: ./media/mobile-engagement-ios-get-started/xcode-add-files.png
[18]: ./media/mobile-engagement-ios-get-started/xcode-select-engagement-sdk.png
[19]: ./media/mobile-engagement-ios-get-started/xcode-build-phases.png
[22]: ./media/mobile-engagement-ios-get-started/xcode-view-controller.png
[26]: ./media/mobile-engagement-common/engage-button.png
[27]: ./media/mobile-engagement-common/engagement-portal.png
[28]: ./media/mobile-engagement-ios-get-started/native-push-settings.png
[30]: ./media/mobile-engagement-common/clic-monitor-tab.png
[31]: ./media/mobile-engagement-common/monitor.png
[33]: ./media/mobile-engagement-ios-get-started/monitor-0.png
[35]: ./media/mobile-engagement-common/new-announcement.png
[36]: ./media/mobile-engagement-ios-get-started/campaign-first-params.png
[37]: ./media/mobile-engagement-common/campaign-content.png
[38]: ./media/mobile-engagement-common/campaign-create.png
[39]: ./media/mobile-engagement-common/campaign-activate.png
[40]: ./media/mobile-engagement-ios-get-started/SwiftSelection.png
[41]: ./media/mobile-engagement-ios-get-started/AddHeaderFile.png
