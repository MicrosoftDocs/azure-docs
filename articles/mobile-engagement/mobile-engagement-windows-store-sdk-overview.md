<properties
	pageTitle="Windows Universal SDK Integration"
	description="Windows Universal Integration for SDK for Azure Mobile Engagement" 									
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
	ms.date="08/03/2016"
	ms.author="piyushjo;ricksal" />

#Windows Universal SDK Integration for Azure Mobile Engagement

This document describes all the integration and configuration options available for the Azure Mobile Engagement Windows Universal SDK.

## Prerequisites

Before starting this tutorial, you must first complete our [15 minutes tutorial](mobile-engagement-windows-store-dotnet-get-started.md).

## Advanced features

### Reporting features
You can add these features:
1. [Advanced reporting options](mobile-engagement-windows-advanced-reporting.md)

2. [Advanced configuration options](mobile-engagement-windows-advanced-configuration.md)

### Notifications

[How to integrate Reach (Notifications) in your Windows Universal app](mobile-engagement-windows-store-integrate-engagement-reach.md)

### Tag plan implementation:

[How to use the advanced Mobile Engagement tagging API in your Windows Universal app](mobile-engagement-windows-store-use-engagement-api.md)

##Release notes

###3.4.0 (04/19/2016)

-   Reach overlay improvements.
-   Added "TestLogLevel" API to enable/disable/filter console logs emitted by the SDK.
-   Fixed in-activity notifications targeting the first activity not displayed on App start.

For earlier version please see the [complete release notes](mobile-engagement-windows-store-release-notes.md)

##Upgrade procedures

If you already have integrated an older version of Engagement into your application, you have to consider the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDK see the complete [Upgrade Procedures](mobile-engagement-windows-store-upgrade-procedure.md). For example if you migrate from 0.10.1 to 0.11.0 you have to first follow the "from 0.9.0 to 0.10.1" procedure then the "from 0.10.1 to 0.11.0" procedure.

###From 3.3.0 to 3.4.0

####Test logs

Console logs produced by the SDK can now be enabled/disabled/filtered. To customize this, update the property `EngagementAgent.Instance.TestLogEnabled` to one of the value available from the `EngagementTestLogLevel` enumeration, for instance:

			EngagementAgent.Instance.TestLogLevel = EngagementTestLogLevel.Verbose;
			EngagementAgent.Instance.Init();

####Resources

The Reach overlay has been improved. It is part of the SDK NuGet package resources.

While upgrading to the new version of the SDK you can choose whether you want to keep your existing files from the overlay folder of your resources or not:

* If the previous overlay is working for you or you are integrating the `WebView` elements manually then you can decide to keep your exiting files, it will still work.
* If you want to update to the new overlay, just replace the whole `overlay` folder from your resources with the new one from the SDK package
(UWP apps: after the upgrade, you can get the new overlay folder from %USERPROFILE%\\.nuget\packages\MicrosoftAzure.MobileEngagement\3.4.0\content\win81\Resources).

> [AZURE.WARNING] Using the new overlay will overwrite any customizations made on the previous version.

### Upgrade from older versions

See [Upgrade Procedures](mobile-engagement-windows-store-upgrade-procedure.md)
