---
title: Android SDK Integration for Azure Mobile Engagement
description: Describes how to integrate Azure Mobile Engagement SDK in Android apps
services: mobile-engagement
documentationcenter: mobile
author: piyushjo
manager: erikre
editor: ''

ms.assetid: a91ed04f-f3ce-4692-a6dd-b56a28d7dee8
ms.service: mobile-engagement
ms.workload: mobile
ms.tgt_pltfrm: mobile-android
ms.devlang: Java
ms.topic: article
ms.date: 06/27/2017
ms.author: piyushjo;ricksal

---
# Android SDK Integration for Azure Mobile Engagement
> [!div class="op_single_selector"]
> * [Universal Windows](mobile-engagement-windows-store-sdk-overview.md)
> * [Windows Phone Silverlight](mobile-engagement-windows-phone-sdk-overview.md)
> * [iOS](mobile-engagement-ios-sdk-overview.md)
> * [Android](mobile-engagement-android-sdk-overview.md)
> 
> 

This document describes all the integration and configuration options available for Azure Mobile Engagement Android SDK.

## Prerequisites
[!INCLUDE [Prereqs](../../includes/mobile-engagement-android-prereqs.md)]

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
### 4.3.0 (06/27/2017)
* Android 8 support (previous versions of the SDK will not work on Android 8).
* No more dependency on support library.
* Remove `EngagementFragmentActivity` class.

For all versions, see the [complete release notes](mobile-engagement-android-release-notes.md).

## Upgrade procedures
If you already have integrated an older version of our SDK into your application, consult [Upgrade Procedures](mobile-engagement-android-upgrade-procedure.md).

