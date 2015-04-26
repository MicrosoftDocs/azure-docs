<properties 
	pageTitle="Get Started with Azure Mobile Engagement for iOS" 
	description="Learn how to use Azure Mobile Engagement with Analytics and Push Notifications for iOS Apps."
	services="mobile-engagement" 
	documentationCenter="Mobile" 
	authors="kpiteira" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-ios" 
	ms.devlang="objective-c" 
	ms.topic="article" 
	ms.date="02/11/2015" 
	ms.author="kapiteir" />

# Get Started with Azure Mobile Engagement for iOS Apps

> [AZURE.SELECTOR]
- [Windows Universal](mobile-engagement-windows-store-dotnet-get-started.md)
- [Windows Phone Silverlight](mobile-engagement-windows-phone-get-started.md)
- [iOS](mobile-engagement-ios-get-started.md)
- [Android](mobile-engagement-android-get-started.md)

This topic shows you how to use Azure Mobile Engagement to understand your app usage and send push notifications to segmented users to an iOS application. 
In this tutorial, you create a blank iOS app that collects basic data and receives push notifications using Apple Push Notification System (APNS). When complete, you will be able to broadcast push notifications to all the devices or target specific users based on their devices properties.

This tutorial demonstrates the simple broadcast scenario using Mobile Engagement. Be sure to follow along with the next tutorial to see how to use Mobile Engagement to address specific users and groups of devices. 

This tutorial requires the following:

+ XCode, which you can install from your MAC App Store
+ the [Mobile Engagement iOS SDK]
+ Push notification certificate (.p12) that you can obtain on your Apple Dev Center

Completing this tutorial is a prerequisite for all other Mobile Engagement tutorials for iOS apps. 

> [AZURE.IMPORTANT] Completing this tutorial is a prerequisite for all other Mobile Engagement tutorials for iOS apps, and to complete it, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

<!--
##<a id="register"></a>Enable Apple Push Notification Service

[WACOM.INCLUDE [Enable Apple Push Notifications](../includes/enable-apple-push-notifications.md)]
-->

##<a id="setup-azme"></a>Setup Mobile Engagement for your app

1. Log on to the [Azure Management Portal], and then click **+NEW** at the bottom of the screen.

2. Click on **App Services**, then **Mobile Engagement**, then **Create**.

   	![][7]

3. In the popup that appears you have a few fields to fill:
 
   	![][8]

	1. *Application Name*: you can type the name of your application. Feel free to use any character
	2. *Platform*: Select the target platform for that app (if your app targets multiple platform, repeat this tutorial for each platform)
	3. *Application Resource Name*: This is the name by which this application will be accessible via APIs and URLs. We advise that you use only conventional URL characters: the auto generated name should provade you a strong basis. We also advise appending the platform name to avoid any name clash as this name must be unique
	4. *Location*: Select the data center where this app (and more importantly its Collection - see below) will be hosted
	5. *Collection*: If you have already created an application, select a previously created Collection, otherwise select New Collection


	When you're done, click the check button to finish the creation of your app

4. Now click/select the app you just created in the Application tab:
 
   	![][9]

5. Then click on "Connection Info" in order to display the connection settings to put into your SDK integration:
 
   	![][10]

6. Finally write down the "Connection String" which is what you will need to identify this app from your Application code:

   	![][11]

	>[AZURE.TIP] You may use the "copy" icon on the right of the Connection String to copy it to the clipboard as a convenience.

##<a id="connecting-app"></a>Connecting your app to the Mobile Engagement backend

This tutorial presents a "basic integration" which is the minimal set required to collect data and send a push notification. The complete integration documentation can be found in the [Mobile Engagement iOS SDK documentation]

We will create a basic app with Android Studio to demonstrate the integration

###Create a new iOS project

You may skip this step if you already have an app and are familiar with iOS development

1. Launch Xcode and in the popup, select "Create a new Xcode project"

   	![][12]

2. Fill in the app name and Company name and identifier. Write down these as you will need them later, then click Next

   	![][13]

3. Now select Single View Application and click Next

   	![][14]


Xcode will create the demo app to which we will integrate Mobile Engagement

###Include the SDK library in your project

Download and integrate the SDK library

1. Download the [Mobile Engagement iOS SDK]
2. Extract the .tar.gz file to a folder in your computer
3. Right click the project and select "Add files to ..."

	![][17]

4. Navigate to the folder where you extracted the SDK and select the `EngagementSDK` folder then press OK

	![][18]

5. Open the `Build Phases` tab and in the `Link Binary With Libraries` menu add the frameworks as shown below:

	![][19]


###Connect your app to Mobile Engagement backend with the Connection String

1. Copy the following line of code at the top of your Application Delegate implementation file

		#import "EngagementAgent.h"

2. Go back to the Azure portal in your app's *Connection Info* page and copy the Connection String

	![][11]

3. Paste it in the `didFinishLaunchingWithOptions` delegate		

		- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
		{
  			[...]
  			[EngagementAgent init:@"Endpoint={YOUR_APP_COLLECTION.DOMAIN};SdkKey={YOUR_SDK_KEY};AppId={YOUR_APPID}"];
  			[...]
		}

##Send a Screen to Mobile Engagement

In order to start sending data and ensuring the users are active, you must send at least 1 screen (Activity) to the Mobile Engagement backend. We will achieve this by overloading the `UIViewController` class with the `EngagementViewController` our SDK provides.
In order to to that, open the `ViewController.h` file, import `EngagementViewController.h` and replace the super class of the `ViewController` interface by `EngagementViewController`, as shown below:

![][22]

##<a id="monitor"></a>How to check that your app is connected with realtime monitoring

This section shows you how to make sure your app connects to the Mobile Engagement backend by using Mobile Engagement's realtime monitoring feature.

1. Navigate to your Mobile Engagement portal

	From your Azure portal, ensure you're in the app we're using for this project and then click on the "Engage" button at the bottom:

	![][26]

2. You will land in the settings page in your Engagement Portal for your app. From there click on the "Monitor" tab:

	![][30]

3. The monitor is ready to show you any device, in realtime, that will launch your app:

	![][31]

4. Back in Xcode, launch your app either in the simulator or in a connected device

5. If it worked, you should now see 1 session in the monitor! 

**Congratulations!** You succeeded the first step of this tutorial and have an app that connects to the Mobile Engagement backend, and that is already sending data

6. Clicking the Home button of the simulator will bring back the number of sessions in the monitor back to 0 as shown above

	![][33]



##<a id="integrate-push"></a>Enabling Push Notifications and In-app Messaging

Mobile Engagement allows you to interact and REACH with your users with Push Notifications and In-app Messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections will setup your app to receive them.

### Add the Reach library to your project

1. Right click your project
2. Select `Add file to ...`
3. Navigate to the folder where you extracted the SDK
4. Select the `EngagementReach` folder
5. Click Add

### Modify your Application Delegate

1. At the top of your implementation file, import the Engagement Reach module

		#import "AEReachModule.h"
	
2. Inside the `application:didFinishLaunchingWithOptions` create a reach module and pass it to your existing Engagement initialization line:

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
		}

3. Add the `didReceiveRemoteNotification` method as follows:
4. 
		- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
		{
		    [[EngagementAgent shared] applicationDidReceiveRemoteNotification:userInfo];
		}

###Grant access to your Push Certificate to Mobile Engagement

To allow Mobile Engagement to send Push Notifications on your behalf, you need to grant it access to your certificate. This is done by configuring and entering your certificate into the Mobile Engagement portal. Make sure you obtain your .p12 certificate as explained in Apple's documentation.

1. Navigate to your Mobile Engagement portal

	From your Azure portal, ensure you're in the app we're using for this project and then click on the "Engage" button at the bottom:

	![][26]

2. You will land in the settings page in your Engagement Portal. From there click on the "Native Push" section to upload your p12 certificate:

	![][27]

3. Select your p12, upload it and type your password:

	![][28]

4. Now add your provisioning profile and build your app for a target device

You're all set, now we will verify that you have correctly done this basic integration

##<a id="send"></a>How to send a notification to your app

We will now create a simple Push Notification campaign that will send a push to our app:

1. Navigate to the Reach tab in your Mobile Engagement portal

2. click "New Announcement" to create your push campaign
	
	![][35]

3. Setup the first field of your campaign:

	![][36]

	1. Name your campaign with any name you'd like
	2. Select the Delivery time as "Out of app only": this is the simple Apple push notification type that features some text
	3. In the notification text, type first the Title which will be the first line in the push
	4. Then type your message which will be the second line

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
[9]: ./media/mobile-engagement-ios-get-started/select-app.png
[10]: ./media/mobile-engagement-common/app-main-page-select-connection-info.png
[11]: ./media/mobile-engagement-common/app-connection-info-page.png
[12]: ./media/mobile-engagement-ios-get-started/xcode-new-project.png
[13]: ./media/mobile-engagement-ios-get-started/xcode-project-props.png
[14]: ./media/mobile-engagement-ios-get-started/xcode-simple-view.png
[17]: ./media/mobile-engagement-ios-get-started/xcode-add-files.png
[18]: ./media/mobile-engagement-ios-get-started/xcode-select-engagement-sdk.png
[19]: ./media/mobile-engagement-ios-get-started/xcode-build-phases.png
[22]: ./media/mobile-engagement-ios-get-started/xcode-view-controller.png
[23]: ./media/mobile-engagement-common/copy-resources.png
[24]: ./media/mobile-engagement-common/paste-resources.png
[25]: ./media/mobile-engagement-common/paste-resources.png
[26]: ./media/mobile-engagement-common/engage-button.png
[27]: ./media/mobile-engagement-common/engagement-portal.png
[28]: ./media/mobile-engagement-ios-get-started/native-push-settings.png
[29]: ./media/mobile-engagement-common/api-key.png
[30]: ./media/mobile-engagement-common/clic-monitor-tab.png
[31]: ./media/mobile-engagement-common/monitor.png
[32]: ./media/mobile-engagement-common/launch.png
[33]: ./media/mobile-engagement-ios-get-started/monitor-0.png
[35]: ./media/mobile-engagement-common/new-announcement.png
[36]: ./media/mobile-engagement-ios-get-started/campaign-first-params.png
[37]: ./media/mobile-engagement-common/campaign-content.png
[38]: ./media/mobile-engagement-common/campaign-create.png
[39]: ./media/mobile-engagement-common/campaign-activate.png
