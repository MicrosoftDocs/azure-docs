<properties 
	pageTitle="Windows Phone Silverlight SDK Overview" 
	description="Overview of the Windows Phone Silverlight SDK for Azure Mobile Engagement" 					
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede"
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-phone" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/03/2016" 
	ms.author="piyushjo" />

#Windows Phone Silverlight SDK Overview for Azure Mobile Engagement

Start here to get the details on how to integrate Azure Mobile Engagement in a Windows Phone Silverlight App. If you'd like to give it a try first, make sure you complete our [15 minutes tutorial](mobile-engagement-windows-phone-get-started.md).

Click to see the [SDK Content](mobile-engagement-windows-phone-sdk-content.md)

##Integration procedures

1. Start here: [How to integrate Mobile Engagement in your Windows Phone Silverlight app](mobile-engagement-windows-phone-integrate-engagement.md)

2. For Notifications: [How to integrate Reach (Notifications) in your Windows Phone Silverlight app](mobile-engagement-windows-phone-integrate-engagement-reach.md)

3. Tag plan implementation: [How to use the advanced Mobile Engagement tagging API in your Windows Phone Silverlight app](mobile-engagement-windows-phone-use-engagement-api.md)

##Release notes

###3.3.0 (04/19/2016)
Part of the *MicrosoftAzure.MobileEngagement* nuget package **v3.4.0**

-   Added "TestLogLevel" API to enable/disable/filter console logs emitted by the SDK.

For earlier version please see the [complete release notes](mobile-engagement-windows-phone-release-notes.md)

##Upgrade procedures

If you already have integrated an older version of our SDK into your application, you have to consider the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDK. See the complete [Upgrade Procedures](mobile-engagement-windows-phone-upgrade-procedure.md). For example if you migrate from 0.10.1 to 0.11.0 you have to first follow the "from 0.9.0 to 0.10.1" procedure then the "from 0.10.1 to 0.11.0" procedure.

###From 2.0.0 to 3.3.0

####Test logs

Console logs produced by the SDK can now be enabled/disabled/filtered. To customize this, update the property `EngagementAgent.Instance.TestLogEnabled` to one of the value available from the `EngagementTestLogLevel` enumeration, for instance:

			EngagementAgent.Instance.TestLogLevel = EngagementTestLogLevel.Verbose;
			EngagementAgent.Instance.Init();

### Upgrade from older versions

See [Upgrade Procedures](mobile-engagement-windows-phone-upgrade-procedure/)
 
