<properties 
	pageTitle="Azure Mobile Engagement iOS SDK Upgrade Procedure" 
	description="Latest updates and procedures for iOS SDK for Azure Mobile Engagement"
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="kpiteira" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-ios" 
	ms.devlang="objective-c" 
	ms.topic="article" 
	ms.date="02/12/2015" 
	ms.author="kapiteir" />

#Upgrade procedures

If you already have integrated an older version of Engagement into your application, you have to consider the following points when upgrading the SDK.

For each new version of the SDK you must first replace (remove and re-import in xcode) the EngagementSDK and EngagementReach folders.

##From 1.16.0 to 2.0.0

### Agent

The method `registerApp:` has been replaced by the new method `init:`. Your application delegate must be updated accordingly and use connection string:

			- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
			{
			  [...]
			  [EngagementAgent init:@"YOUR_CONNECTION_STRING"];
			  [...]
			}

SmartAd tracking has been removed from SDK you just have to remove all instances of `AETrackModule` class

### Class Name Changes

As part of the rebranding, there are couple of class/file names that need to be changed.

All classes prefixed with "CP" are renamed with "AE" prefix.

Example:

-   `CPModule.h` is renamed to `AEModule.h`.

All classes prefixed with "Capptain" are renamed with "Engagement" prefix.

Examples:

-   The class `CapptainAgent` is renamed to `EngagementAgent`.
-   The class `CapptainTableViewController` is renamed to `EngagementTableViewController`.
-   The class `CapptainUtils` is renamed to `EngagementUtils`.
-   The class `CapptainViewController` is renamed to `EngagementViewController`.

##From 1.15.0 to 1.16.0

The 1.16.0 release makes it compatible with iOS 8. There are some important changes to take into account regarding location and push capabilities.

**Push migration**

The method `registerForRemoteNotificationTypes:` is now deprecated. This must be replaced by the new method `registerUserNotificationSettings`. Your application delegate must be updated accordingly:

			 if ([application respondsToSelector:@selector(registerUserNotificationSettings:)]) {
			   [application registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert) categories:nil]];
			   [application registerForRemoteNotifications];
			 }
			 else {
			
			   [application registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound | UIRemoteNotificationTypeAlert)];
			 }

**Location migration**

Since iOS 8, more permissions are required from the user to enable location services. Now, there are two levels of permissions to access the location: when the app is in use, or when the app is in use and in the background. If you use location reporting with Capptain, you must provide a new key in your app's Info.plist.

The key describes the reason why the app accesses the user’s location.

If you use background location reporting via [setBackgroundRealtimeLocationReport:withLaunchOptions:], add the key [NSLocationAlwaysUsageDescription] in your app's Info.plist.

Otherwise, add the key [NSLocationWhenInUseUsageDescription].

##From 1.14.0 to 1.15.0

The `CapptainSDK` library folder now contains a new class provided as a source code. Header and implementation files must be added to your XCode project. The purpose of this class is described below.

By default, Capptain will continue to use the advertising identifier (IDFA) to identify the user. But this can be disabled to ensure that your application will not be rejected because of improper usage of this ID. To disable IDFA collection, just add the following preprocessor macro in your pch file:

			 #define CAPPTAIN_DISABLE_IDFA
			 #include ...
			 ...

You can verify that the IDFA collection is properly disabled in your application by checking the Capptain test logs. See the Integration Test\<ios-sdk-engagement-test-idfa\> documentation for further information.

> [AZURE.IMPORTANT] The tracking module cannot work without the IDFA. If you still need to track the origins of the installations of your application, you will have to enable the IDFA collection. Otherwise, just remove the tracking module from the init line of the Capptain agent.
Also, the iOS test devices configured on your Capptain's profile will not work anymore if you disable IDFA collection. You must register them again in order to use them as a test device in Reach (Just follow the new instructions on the registration page).

##From 1.13.0 to 1.14.0

### Reach

#### Module

-   You can now limit the number of in-app campaigns. If the SDK receives more campaigns than required, then the Reach module simply drop the oldest campaigns. This new feature is enabled by adding the following line after Reach module initialization:

			    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
			    {
			      [...]
			      AEReachModule* reach = [AEReachModule moduleWithNotificationIcon:[UIImage imageNamed:@"icon.png"]];
			      [reach setMaxInAppCampaigns:3];
			      [...]
			    }

-   The Reach module has been updated. The method `pushMessageReceived:` has been replaced by `pushMessagesReceived:` to handle messages in batch. See below for further details.

#### Data Push

It is now possible to specify a category for each data push. Thus, you need to change your methods's signature in your application delegate to handle it.

Suppose your code looks like:

			-(BOOL)onDataPushStringReceived:(NSString*)body
			{
			   NSLog(@"String data push message received: %@", body);
			   return YES;
			}
			
			-(BOOL)onDataPushBase64ReceivedWithDecodedBody:(NSData*)decodedBody andEncodedBody:(NSString*)encodedBody
			{
			   NSLog(@"Base64 data push message received: %@", encodedBody);
			   // Do something useful with decodedBody like updating an image view
			   return YES;
			}

Update it like this:

			-(BOOL)didReceiveStringDataPushWithCategory:(NSString*)category body:(NSString*)body
			{
			   NSLog(@"String data push message with category <%@> received: %@", category, body);
			   return YES;
			}
			
			-(BOOL)didReceiveBase64DataPushWithCategory:(NSString*)category decodedBody:(NSData *)decodedBody encodedBody:(NSString *)encodedBody
			{
			   NSLog(@"Base64 data push message with category <%@> received: %@", category, encodedBody);
			   // Do something useful with decodedBody like updating an image view
			   return YES;
			}

### Push delegate

The behavior of the Capptain Push delegate named `AEPushDelegate` has changed. The method called `didReceiveMessage:` is now called every time, even if message was processed by another module like the Reach module. The method called `didReceiveLaunchMessage:` is always called with a non null message.

### Agent module

The Capptain module protocol named `AEModule` has changed. The method `pushMessageReceived:` has been replaced by `pushMessagesReceived:`. The new method now receives a list of messages instead of a single message.

##From 1.12.0 to 1.13.0

Capptain doesn't use the MAC address anymore. As a consequence, the Capptain identifier of your device will change. This new version requires a new additional framework. Add the `AdSupport.framework` (link as **`Optional`** ) in your target configuration.

> [AZURE.IMPORTANT] The iOS test devices configured on your Capptain's profile will not work anymore with this new version of the SDK. You must register them again in order to use them as a test device in Reach (Just follow the new instructions on the registration page).

##From 1.11.0 to 1.12.0

The tracking module based on cookies has been removed. It is replaced with a new tracking system based on third party Ad Servers that we support (check the tracking documentation for more information).

##From 1.10.0 to 1.11.0

The following upgrade information only applies if you have created your own Capptain module or if you have customized the Reach module.

### Agent module

The Capptain module protocol named `AEModule` has changed. The method `pushMessageReceived:fromLaunch:` has been replaced by `pushMessageReceived:` and a new method named `displayPushMessageNotification:` has been added. The first method is still called when a regular push message is received, but is not called anymore if the message is associated to a click on the Apple notification. It is the `displayPushMessageNotification:` method that will be called in that case. Besides, this method will be called every time the user clicks on a recognized Capptain notification from the notification center.

### Reach

The Reach module has been updated. The method `pushMessageReceived:fromLaunch:` has been replaced by `pushMessageReceived:` and the new method `displayPushMessageNotification:` has been implemented.

##From 1.7.0 to 1.8.0

Limits on keys and size are now in place, please read Latest/How to Use the Engagement API on iOS.

##From 1.6.0 to 1.7.0
### Reach

You can now automatically update the badge icon of your application with announcements and polls. If you plan to use this new feature (formerly named *Update badge icon*), you must tell the Reach module to automatically manage the badge icon. This is done by adding the following line after Reach module initialization:

			- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
			{
			  [...]
			  AEReachModule* reach = [AEReachModule moduleWithNotificationIcon:[UIImage imageNamed:@"icon.png"]];
			  [reach setAutoBadgeEnabled:YES];
			  [...]
			}

##From 1.3.0 to 1.6.0

Capptain doesn't use the UDID anymore. As a consequence, the Capptain identifier of your device will change.

> [AZURE.IMPORTANT] The iOS test devices configured on your Capptain's profile will not work anymore with this new version of the SDK. You must register them again in order to use them as a test device in Reach (Just follow the new instructions on the registration page).

##From 1.2.0 to 1.3.0

### Reach

#### Code

The protocol methods defined inside `AEReachDataPushDelegate` have changed. You must now return a boolean value inside the callbacks `onDataPushStringReceived:` and `onDataPushBase64ReceivedWithDecodedBody:andEncodedBody:`. The returned value can be used as a response to a data push.

The method named `submitButtonClicked:` inside `AEDefaultPollViewController` has been removed. If you were using it to customize the default behavior of the poll view, you should now use the method `actionButtonClicked:` defined in `AEContentViewController`.

#### New feedbacks

The life cycle of a campaign is now more detailed. If you implemented your own category from scratch, you should add new calls such as when a content is displayed. Please read the updated Reach documentation to integrate the new life cycle calls.

##From 1.1.0 to 1.2.0

In this release of the SDK, the `CapptainSDK` and the `CapptainSDKWithLocation` librairies have been merged into one library.

These two frameworks need to be added to your project:

-   `CoreLocation.framework`
-   `MapKit.framework` (required to deploy to 4.x OS devices)

If you were using the Capptain library with location tracking, you must add the following line after initializing the Capptain agent:

			- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
			{
			  [...]
			  [CapptainAgent registerApp:@"YOUR_APPID" identifiedBy:@"YOUR_SDK_KEY"];
			  [[CapptainAgent shared] setLazyAreaLocationReport:YES];
			  [...]
			}

##From 0.9.x to 1.0.0

In this major release of the SDK, the main Capptain class has been renamed from `CapptainAPI` to `CapptainAgent`. Rename any references to the `CapptainAPI` in your code. A search and replace in XCode should do it.

The old class method named `sharedAPI` has also been renamed to `shared`.

### Reach

A lot of modifications have been done on the Reach SDK, we strongly recommend you to read the new integration guide.

#### Layouts

-   The layout nib file `DefaultAnnouncementView.xib` has been renamed to `AEDefaultAnnouncementView.xib`
-   The layout nib file `PollView.xib` has been renamed to `AEDefaultPollView.xib`

If you customized these files, please re-apply your customization on the new files.

#### Categories

The old method `registerAnnouncementCategory:toControllerClass:` has been renamed to `registerAnnouncementController:forCategory:`.

[setBackgroundRealtimeLocationReport:withLaunchOptions:]:Latest/documentation/Classes/CapptainAgent.html#//api/name/setBackgroundRealtimeLocationReport:withLaunchOptions:
[NSLocationAlwaysUsageDescription]:https://developer.apple.com/library/prerelease/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW18
[NSLocationWhenInUseUsageDescription]:https://developer.apple.com/library/prerelease/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW26
