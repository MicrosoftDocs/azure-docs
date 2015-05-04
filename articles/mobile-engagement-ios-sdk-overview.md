<properties 
	pageTitle="Azure Mobile Engagement iOS SDK Overview" 
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

#iOS SDK for Azure Mobile Engagement v2.1.0

Start here to get all the details on how to integrate Azure Mobile Engagement in an iOS App. If you'd like to give it a try first, make sure you do our [15 minutes tutorial](mobile-engagement-ios-get-started.md).

Click to see the [SDK Content](mobile-engagement-ios-sdk-content.md)

##Integration procedures
1. Start here: [How to integrate Mobile Engagement in your iOS app](mobile-engagement-ios-integrate-engagement.md)

2. For Notifications: [How to integrate Reach (Notifications) in your iOS app](mobile-engagement-ios-integrate-engagement-reach.md)

3. Tag plan implementation: [How to use the advanced Mobile Engagement tagging API in your iOS app](mobile-engagement-ios-use-engagement-api.md)


##Release notes

###2.1.0 (04/24/2015)

-   Add Swift compatibility.
-   When clicking on a notification, the action URL is now executed right after the application is opened.
-   Added missing header file in SDK package.
-   Fixed an issue when the Mobile Engagement crash reporter was disabled.

For earlier version please see the [complete release notes](mobile-engagement-ios-release-notes.md)

##Upgrade procedures

If you already have integrated an older version of Engagement into your application, you have to consider the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDK see the complete [Upgrade Procedures](mobile-engagement-ios-upgrade-procedure.md).

For each new version of the SDK you must first replace (remove and re-import in xcode) the EngagementSDK and EngagementReach folders.

###From 1.16.0 to 2.0.0
The following describes how to migrate an SDK integration from the Capptain service offered by Capptain SAS into an app powered by Azure Mobile Engagement. 

>[Azure.IMPORTANT] Capptain and Mobile Engagement are not the same services and the procedure given below only highlights how to migrate the client app. Migrating the SDK in the app will NOT migrate your data from the Capptain servers to the Mobile Engagement servers

If you are migrating from an earlier version, please consult the Capptain web site to migrate to 1.16 first then apply the following procedure

#### Agent

The method `registerApp:` has been replaced by the new method `init:`. Your application delegate must be updated accordingly and use connection string:

			- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
			{
			  [...]
			  [EngagementAgent init:@"YOUR_CONNECTION_STRING"];
			  [...]
			}

SmartAd tracking has been removed from SDK you just have to remove all instances of `AETrackModule` class

#### Class Name Changes

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
