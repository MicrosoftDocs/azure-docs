<properties
	pageTitle="Android SDK Integration for Azure Mobile Engagement"
	description="Describes how to integrate Azure Mobile Engagement SDK in Android apps"
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
	ms.date="08/02/2016"
	ms.author="piyushjo;ricksal" />

# Android SDK Integration for Azure Mobile Engagement

> [AZURE.SELECTOR]
- [Universal Windows](mobile-engagement-windows-store-sdk-overview.md)
- [Windows Phone Silverlight](mobile-engagement-windows-phone-sdk-overview.md)
- [iOS](mobile-engagement-ios-sdk-overview.md)
- [Android](mobile-engagement-android-sdk-overview.md)

This document describes all the integration and configuration options available for Azure Mobile Engagement Android SDK. 

## Prerequisites

[AZURE.INCLUDE [Prereqs](../../includes/mobile-engagement-android-prereqs.md)]

## Advanced Features

### Reporting Features

You can add these features:

1. [Advanced reporting options](mobile-engagement-android-advanced-reporting.md)
2. [Location Reporting options](mobile-engagement-android-location-reporting.md)
3. [Advanced Configuration options](mobile-engagement-android-advanced-configuration.md)

### Notifications:
[How to integrate Reach (Notifications) in your Android app](mobile-engagement-android-integrate-engagement-reach.md)

1. Google Cloud Messaging (GCM): [How to Integrate GCM with Mobile Engagement](mobile-engagement-android-gcm-integrate.md)

2. Amazon Device Messaging (ADM): [How to Integrate ADM with Mobile Engagement](mobile-engagement-android-adm-integrate.md)

### Tag plan implementation:
[How to use the advanced Mobile Engagement tagging API in your Android app](mobile-engagement-android-use-engagement-api.md)

## Release notes

### 4.2.2 (05/17/2016)

- Stability improvements.

### 4.2.1 (05/10/2016)

- Security: disable web view local file access.
- Security: remove `EngagementPreferenceActivity` class that extends obsolete and unsecure `PreferenceActivity` class.
- Security: reach activities are now documented to use `exported="false"`, this flag can also be used in previous SDK versions.

### 4.2.0 (03/11/2016)

- The SDK is now licensed under MIT.
- Allow specifying a custom device identifier at SDK initialization time.

For all versions, please see the [complete release notes](mobile-engagement-android-release-notes.md).

## Upgrade procedures

If you already have integrated an older version of our SDK into your application please consult [Upgrade Procedures](mobile-engagement-android-upgrade-procedure.md).
