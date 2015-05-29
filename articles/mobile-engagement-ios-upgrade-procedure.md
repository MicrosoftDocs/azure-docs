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
The following describes how to migrate an SDK integration from the Capptain service offered by Capptain SAS into an app powered by Azure Mobile Engagement.
If you are migrating from an earlier version, please consult the Capptain web site to migrate to 1.16 first then apply the following procedure. 

>[Azure.IMPORTANT] Capptain and Mobile Engagement are not the same services and the procedure given below only highlights how to migrate the client app. Migrating the SDK in the app will NOT migrate your data from the Capptain servers to the Mobile Engagement servers

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
