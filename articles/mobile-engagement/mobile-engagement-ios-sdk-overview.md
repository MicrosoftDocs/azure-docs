<properties
	pageTitle="Azure Mobile Engagement iOS SDK Overview | Microsoft Azure"
	description="Latest updates and procedures for iOS SDK for Azure Mobile Engagement"
	services="mobile-engagement"
	documentationCenter="mobile"
	authors="piyushjo"
	manager="erikre"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="09/14/2016"
	ms.author="piyushjo" />

#iOS SDK for Azure Mobile Engagement

Start here to get all the details on how to integrate Azure Mobile Engagement in an iOS App. If you'd like to give it a try first, make sure you do our [15 minutes tutorial](mobile-engagement-ios-get-started.md).

Click to see the [SDK Content](mobile-engagement-ios-sdk-content.md)

##Integration procedures
1. Start here: [How to integrate Mobile Engagement in your iOS app](mobile-engagement-ios-integrate-engagement.md)

2. For Notifications: [How to integrate Reach (Notifications) in your iOS app](mobile-engagement-ios-integrate-engagement-reach.md)

3. Tag plan implementation: [How to use the advanced Mobile Engagement tagging API in your iOS app](mobile-engagement-ios-use-engagement-api.md)


##Release notes

### 4.0.0 (09/12/2016)

-   Fixed notification not actioned on iOS 10 devices.
-   Deprecate XCode 7.

For earlier version please see the [complete release notes](mobile-engagement-ios-release-notes.md)

##Upgrade procedures

If you already have integrated an older version of Engagement into your application, you have to consider the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDK see the complete [Upgrade Procedures](mobile-engagement-ios-upgrade-procedure.md).

For each new version of the SDK you must first replace (remove and re-import in xcode) the EngagementSDK and EngagementReach folders.

###From 3.0.0 to 4.0.0

### XCode 8
XCode 8 is mandatory starting from version 4.0.0 of the SDK.

> [AZURE.NOTE] If you really depends on XCode 7 then you may use the [iOS Engagement SDK v3.2.4](https://aka.ms/r6oouh). There is a known bug on the reach module of this previous version while running on iOS 10 devices:  system notifications are not actioned. To fix this you will have to implement the deprecated API `application:didReceiveRemoteNotification:` in your app delegate as follow:

	- (void)application:(UIApplication*)application
	didReceiveRemoteNotification:(NSDictionary*)userInfo
	{
	    [[EngagementAgent shared] applicationDidReceiveRemoteNotification:userInfo fetchCompletionHandler:nil];
	}

> [AZURE.IMPORTANT] **We do not recommend this workaround** as this behavior can change in any upcoming (even minor) iOS version upgrade because this iOS API is deprecated. You should switch to XCode 8 as soon as possible.

#### UserNotifications framework
You need to add the `UserNotifications` framework in your Build Phases.

in the project explorer, open your project pane and select the correct target. Then, open the **"Build phases"** tab and in the **"Link Binary With Libraries"** menu, add framework `UserNotifications.framework` - set the link as `Optional`

#### Application push capability
XCode 8 may reset your app push capability, please double check it in the `capability` tab of your selected target.

#### If you already have your own UNUserNotificationCenterDelegate implementation

The SDK have its own implementation of the UNUserNotificationCenterDelegate protocol. It is used by the SDK to monitor the life cycle of Engagement notifications on devices running on iOS 10 or greater. If the SDK detects your delegate it will not use its own implementation because there can be only one UNUserNotificationCenter delegate per application. This means that you will have to add the Engagement logic to your own delegate.

There are two ways to achieve this.

Simply by forwarding your delegate calls to the SDK:

	#import <UIKit/UIKit.h>
	#import "EngagementAgent.h"
	#import <UserNotifications/UserNotifications.h>


	@interface MyAppDelegate : NSObject <UIApplicationDelegate, UNUserNotificationCenterDelegate>
	@end

	@implementation MyAppDelegate

	- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
	{
	  // Your own logic.

	  [[EngagementAgent shared] userNotificationCenterWillPresentNotification:notification withCompletionHandler:completionHandler]
	}

	- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler
	{
	  // Your own logic.

	  [[EngagementAgent shared] userNotificationCenterDidReceiveNotificationResponse:response withCompletionHandler:completionHandler]
	}
	@end

Or by inheriting from the `AEUserNotificationHandler` class

	#import "AEUserNotificationHandler.h"
	#import "EngagementAgent.h"

	@interface CustomUserNotificationHandler :AEUserNotificationHandler
	@end

	@implementation CustomUserNotificationHandler

	- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
	{
	  // Your own logic.

	  [super userNotificationCenter:center willPresentNotification:notification withCompletionHandler:completionHandler];
	}

	- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse: UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler
	{
	  // Your own logic.

	  [super userNotificationCenter:center didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
	}

	@end

> [AZURE.NOTE] You can determine whether a notification comes from Engagement or not by passing it's `userInfo` dictionary to the Agent `isEngagementPushPayload:` class method.