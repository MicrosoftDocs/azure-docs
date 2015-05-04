<properties 
	pageTitle="Windows Universal SDK Overview" 
	description="Overview of the Windows Universal SDK for Azure Mobile Engagement" 									
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/02/2015" 
	ms.author="piyushjo" />

#Windows Universal SDK Overview for Azure Mobile Engagement

Start here to get the details on how to integrate Azure Mobile Engagement in a Windows Universal App. If you'd like to give it a try first, make sure you complete our [15 minutes tutorial](mobile-engagement-windows-store-dotnet-get-started.md).

Click to see the [SDK Content](mobile-engagement-windows-store-sdk-content.md)

##Integration procedures

1. Start here: [How to integrate Mobile Engagement in your Windows Universal app](mobile-engagement-windows-store-integrate-engagement.md)

2. For Notifications: [How to integrate Reach (Notifications) in your Windows Universal app](mobile-engagement-windows-store-integrate-engagement-reach.md)

3. Tag plan implementation: [How to use the advanced Mobile Engagement tagging API in your Windows Universal app](mobile-engagement-windows-store-use-engagement-api.md)

##Release notes

###3.0.1 (04/29/2015)

-   Fixed a bug affecting the SDK initialization on some Windows Phone WinRT apps.

For earlier version please see the [complete release notes](mobile-engagement-windows-store-release-notes.md)

##Upgrade procedures

If you already have integrated an older version of Engagement into your application, you have to consider the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDK see the complete [Upgrade Procedures](mobile-engagement-windows-store-upgrade-procedure.md). For example if you migrate from 0.10.1 to 0.11.0 you have to first follow the "from 0.9.0 to 0.10.1" procedure then the "from 0.10.1 to 0.11.0" procedure.

###From 2.0.0 to 3.0.0

#### Resources
This step concerns customized resources only. If you have customized the resources provided by the SDK (html, images, overlay) then you have to backup them before upgrading and reapply your customization on upgraded resources.

### Upgrade from older versions

See [Upgrade Procedures](mobile-engagement-windows-store-upgrade-procedure/)