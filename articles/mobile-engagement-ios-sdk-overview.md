<properties 
	pageTitle="Azure Mobile Engagement iOS SDK Overview" 
	description="Latest updates and procedures for iOS SDK for Azure Mobile Engagement"
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-ios" 
	ms.devlang="objective-c" 
	ms.topic="article" 
	ms.date="05/04/2015" 
	ms.author="piyushjo" />

#iOS SDK for Azure Mobile Engagement

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

###From 2.0.0 to 2.1.0
None. 
