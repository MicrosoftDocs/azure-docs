<properties
	pageTitle="Azure Mobile Engagement Android SDK Integration"
	description="Latest updates and procedures for Android SDK for Azure Mobile Engagement"
	services="mobile-engagement"
	documentationCenter="mobile"
	authors="piyushjo"
	manager="erikre"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="Java"
	ms.topic="article"
	ms.date="04/28/2016"
	ms.author="piyushjo;ricksal" />


# Using advanced Azure Mobile Engagement features for Android apps

> [AZURE.SELECTOR]
- [Universal Windows](mobile-engagement-windows-store-sdk-overview.md)
- [Windows Phone Silverlight](mobile-engagement-windows-phone-sdk-overview.md)
- [iOS](mobile-engagement-ios-sdk-overview.md)
- [Android](mobile-engagement-android-sdk-overview.md)

Learn about all the advanced features of Azure Mobile Engagement you can integrate into your Android App.

AZURE.INCLUDE [Prereqs](../../includes/mobile-engagement-android-prereqs.md)]

## Advanced Features

### Reporting Features

You can add these features:
1. [Advanced reporting options](mobile-engagement-android-basic-reporting.md)
2. [Location Reporting](mobile-engagement-android-location-reporting.md)
3. [Advanced Configuration](mobile-engagement-android-advanced-configuration.md)

### Notifications:
[How to integrate Reach (Notifications) in your Android app](mobile-engagement-android-integrate-engagement-reach.md)
	1. Google Cloud Messaging (GCM): [How to Integrate GCM with Mobile Engagement](mobile-engagement-android-gcm-integrate.md)
	2. Amazon Device Messaging (ADM): [How to Integrate ADM with Mobile Engagement](mobile-engagement-android-adm-integrate.md)

### Tag plan implementation:
[How to use the advanced Mobile Engagement tagging API in your Android app](mobile-engagement-android-use-engagement-api.md)

## SDK Content
Click to see the [SDK Content](mobile-engagement-android-sdk-content.md).

## Release notes

### 4.2.0 (03/11/2016)

- The SDK is now licensed under MIT.
- Allow specifying a custom device identifier at SDK initialization time.

### 4.1.0 (08/25/2015)

- Handle new permission model for Android M.
- Can now configure location features at runtime instead of using  `AndroidManifest.xml`.
- Fix a permission bug: if you use `ACCESS_FINE_LOCATION`, then `ACCESS_COARSE_LOCATION` is not needed anymore.
- Stability improvements.

For all versions, please see the [complete release notes](mobile-engagement-android-release-notes.md).

## Upgrade procedures

If you already have integrated an older version of our SDK into your application please consult [Upgrade Procedures](mobile-engagement-android-upgrade-procedure.md).
