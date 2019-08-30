---
title: Use an Android emulator with your MSAL project
description: Learn how to use an Android emulator to test a MSAL project
services: active-directory
author: tylermsft
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: multiple
ms.topic: conceptual
ms.workload: identity
ms.tgt_pltfrm: Android
ms.technology: vs-azure
ms.custom: aaddev
ms.workload: azure-vs
ms.date: 07/30/2019
ms.author: twhitney
ms.reviewer: 
#Customer intent: As an Android application developer, I want to learn how to use an Android emulator to test my MSAL project.
ms.collection: M365-identity-device-management
---

# Use an Android emulator with your MSAL project

To test your MSAL code, you'll need an emulator that supports Chrome or Chrome custom tabs:

- In Visual Studio, use an emulator with Android 25+.
- In Android Studio, use a Pixel or Nexus emulator with Android 21+.

See [Hardware acceleration for emulator performance (Hyper-V and HAXM)](https://docs.microsoft.com/xamarin/android/get-started/installation/android-emulator/hardware-acceleration?pivots=windows) for instructions about configuring Hyper-V and HAXM.

Install the Chrome APK that matches your Android version and emulator architecture. Download from [Chrome Browser](https://www.apkmirror.com/apk/google-inc/chrome/) on [APK Mirror](http://www.apkmirror.com/apk/google-inc/chrome/).

In Android Studio, drag the APK file to your emulator. This will automatically install the app. Go to the app list and verify Chrome was installed.

On some older versions of Android (4.x), install Google Play Services and install Chrome through the app store. See this [stackoverflow](http://stackoverflow.com/questions/31550628/visual-studio-emulator-for-android-install-gapps-google-play-services?answertab=oldest#tab-top) post for steps.