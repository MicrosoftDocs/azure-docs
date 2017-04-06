---
title: Azure Mobile Engagement iOS SDK Upgrade Procedure | Microsoft Docs
description: Latest updates and procedures for iOS SDK for Azure Mobile Engagement
services: mobile-engagement
documentationcenter: mobile
author: piyushjo
manager: erikre
editor: ''

ms.assetid: 72a9e493-3f14-4e52-b6e2-0490fd04b184
ms.service: mobile-engagement
ms.workload: mobile
ms.tgt_pltfrm: mobile-ios
ms.devlang: objective-c
ms.topic: article
ms.date: 12/13/2016
ms.author: piyushjo

---
# Upgrade procedures
If you already have integrated an older version of Engagement into your application, you have to consider the following points when upgrading the SDK.

For each new version of the SDK you must first replace (remove and re-import in xcode) the EngagementSDK and EngagementReach folders.

## From 3.0.0 to 4.0.0
### XCode 8
XCode 8 is mandatory starting from version 4.0.0 of the SDK.

> [!NOTE]
> If you really depend on XCode 7 then you may use the [iOS Engagement SDK v3.2.4](https://aka.ms/r6oouh). There is a known bug on the reach module of this previous version while running on iOS 10 devices:  system notifications are not actioned. To fix this you will have to implement the deprecated API `application:didReceiveRemoteNotification:` in your app delegate as follows:
> 
> 

    - (void)application:(UIApplication*)application
    didReceiveRemoteNotification:(NSDictionary*)userInfo
    {
        [[EngagementAgent shared] applicationDidReceiveRemoteNotification:userInfo fetchCompletionHandler:nil];
    }

> [!IMPORTANT]
> **We do not recommend this workaround** as this behavior can change in any upcoming (even minor) iOS version upgrade because this iOS API is deprecated. You should switch to XCode 8 as soon as possible.
> 
> 

### UserNotifications framework
You need to add the `UserNotifications` framework in your Build Phases.

in the project explorer, open your project pane and select the correct target. Then, open the **"Build phases"** tab and in the **"Link Binary With Libraries"** menu, add framework `UserNotifications.framework` - set the link as `Optional`

### Application push capability
XCode 8 may reset your app push capability, please double check it in the `capability` tab of your selected target.

### Add the new iOS 10 notification registration code
The older code snippet to register the app to notifications still works but is using deprecated APIs while running on iOS 10.

Import the `User Notification` framework:

        #import <UserNotifications/UserNotifications.h> 

In your application delegate `application:didFinishLaunchingWithOptions` method replace:

    if ([application respondsToSelector:@selector(registerUserNotificationSettings:)]) {
        [application registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert) categories:nil]];
        [application registerForRemoteNotifications];
    }
    else {

        [application registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound | UIRemoteNotificationTypeAlert)];
    }

by :

        if (NSFoundationVersionNumber >= NSFoundationVersionNumber_iOS_8_0)
        {
            if (NSFoundationVersionNumber > NSFoundationVersionNumber_iOS_9_x_Max)
            {
                [UNUserNotificationCenter.currentNotificationCenter requestAuthorizationWithOptions:(UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert) completionHandler:^(BOOL granted, NSError * _Nullable error) {}];
            }else
            {
                [application registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert)   categories:nil]];
            }
            [application registerForRemoteNotifications];
        }
        else
        {
            [application registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound | UIRemoteNotificationTypeAlert)];
        }

### Resolve UNUserNotificationCenter delegate conflicts

*If neither your application or one of your third party libraries implements a `UNUserNotificationCenterDelegate` then you can skip this part.*

A `UNUserNotificationCenter` delegate is used by the SDK to monitor the life cycle of Engagement notifications on devices running on iOS 10 or greater. The SDK has its own implementation of the `UNUserNotificationCenterDelegate` protocol but there can be only one `UNUserNotificationCenter` delegate per application. Any other delegate added to the `UNUserNotificationCenter` object will conflict with the Engagement one. If the SDK detects your or any other third party's delegate then it will not use its own implementation to give you a chance to resolve the conflicts. You will have to add the Engagement logic to your own delegate in order to resolve the conflicts.

There are two ways to achieve this.

Proposal 1, simply by forwarding your delegate calls to the SDK:

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

Or proposal 2, by inheriting from the `AEUserNotificationHandler` class

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

> [!NOTE]
> You can determine whether a notification comes from Engagement or not by passing its `userInfo` dictionary to the Agent `isEngagementPushPayload:` class method.

Make sure that the `UNUserNotificationCenter` object's delegate is set to your delegate within either the `application:willFinishLaunchingWithOptions:` or the `application:didFinishLaunchingWithOptions:` method of your application delegate.
For instance, if you implemented the above proposal 1:

      - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
		// Any other code
  
		[UNUserNotificationCenter currentNotificationCenter].delegate = self;
        return YES;
      }

## From 2.0.0 to 3.0.0
Dropped support for iOS 4.X. Starting from this version the deployment target of your application must be at least iOS 6.

If you are using Reach in your application, you must add `remote-notification` value to the `UIBackgroundModes` array in your Info.plist file in order to receive remote notifications.

The method `application:didReceiveRemoteNotification:` needs to be replaced by `application:didReceiveRemoteNotification:fetchCompletionHandler:` in your application delegate.

"AEPushDelegate.h" is deprecated interface and you need to remove all references. This includes removing `[[EngagementAgent shared] setPushDelegate:self]` and the delegate methods from your application delegate:

    -(void)willRetrieveLaunchMessage;
    -(void)didFailToRetrieveLaunchMessage;
    -(void)didReceiveLaunchMessage:(AEPushMessage*)launchMessage;

## From 1.16.0 to 2.0.0
The following describes how to migrate an SDK integration from the Capptain service offered by Capptain SAS into an app powered by Azure Mobile Engagement.
If you are migrating from an earlier version, please consult the Capptain web site to migrate to 1.16 first then apply the following procedure.

> [!IMPORTANT]
> Capptain and Mobile Engagement are not the same services and the procedure given below only highlights how to migrate the client app. Migrating the SDK in the app will NOT migrate your data from the Capptain servers to the Mobile Engagement servers
> 
> 

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

* `CPModule.h` is renamed to `AEModule.h`.

All classes prefixed with "Capptain" are renamed with "Engagement" prefix.

Examples:

* The class `CapptainAgent` is renamed to `EngagementAgent`.
* The class `CapptainTableViewController` is renamed to `EngagementTableViewController`.
* The class `CapptainUtils` is renamed to `EngagementUtils`.
* The class `CapptainViewController` is renamed to `EngagementViewController`.

