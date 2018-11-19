---
title: Add push notifications to your Android app with Mobile Apps | Microsoft Docs
description: Learn how to use Mobile Apps to send push notifications to your Android app.
services: app-service\mobile
documentationcenter: android
manager: crdun
editor: ''
author: conceptdev

ms.assetid: 9058ed6d-e871-4179-86af-0092d0ca09d3
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-android
ms.devlang: java
ms.topic: article
ms.date: 11/17/2017
ms.author: crdun
---
# Add push notifications to your Android app

[!INCLUDE [app-service-mobile-selector-get-started-push](../../includes/app-service-mobile-selector-get-started-push.md)]

## Overview

In this tutorial, you add push notifications to the [Android quick start] project so that a push notification is sent to the device every time a record is inserted.

If you do not use the downloaded quick start server project, you need the push notification extension package. For more information, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

## Prerequisites

You need the following:

* An IDE, depending on your project's back end:

  * [Android Studio](https://developer.android.com/sdk/index.html) if this app has a Node.js back end.
  * [Visual Studio Community 2013](https://go.microsoft.com/fwLink/p/?LinkID=391934) or later if this app has a Microsoft .NET back end.
* Android 2.3 or later, Google Repository revision 27 or later, and Google Play Services 9.0.2 or later for Firebase Cloud Messaging.
* Complete the [Android quick start].

## Create a project that supports Firebase Cloud Messaging

[!INCLUDE [notification-hubs-enable-firebase-cloud-messaging](../../includes/notification-hubs-enable-firebase-cloud-messaging.md)]

## Configure a notification hub

[!INCLUDE [app-service-mobile-configure-notification-hub](../../includes/app-service-mobile-configure-notification-hub.md)]

## Configure Azure to send push notifications

[!INCLUDE [app-service-mobile-android-configure-push](../../includes/app-service-mobile-android-configure-push-for-firebase.md)]

## Enable push notifications for the server project

[!INCLUDE [app-service-mobile-dotnet-backend-configure-push-google](../../includes/app-service-mobile-dotnet-backend-configure-push-google.md)]

## Add push notifications to your app

In this section, you update your client Android app to handle push notifications.

### Verify Android SDK version

[!INCLUDE [app-service-mobile-verify-android-sdk-version](../../includes/app-service-mobile-verify-android-sdk-version.md)]

Your next step is to install Google Play services. Firebase Cloud Messaging has some minimum API level requirements for development and testing, which the **minSdkVersion** property in the manifest must conform to.

If you are testing with an older device, consult [Add Firebase to Your Android Project] to determine how low you can set this value, and set it appropriately.

### Add Firebase Cloud Messaging to the project

[!INCLUDE [Add Firebase Cloud Messaging](../../includes/app-service-mobile-add-firebase-cloud-messaging.md)]

### Add code

[!INCLUDE [app-service-mobile-android-getting-started-with-push](../../includes/app-service-mobile-android-getting-started-with-push.md)]

## Test the app against the published mobile service

You can test the app by directly attaching an Android phone with a USB cable, or by using a virtual device in the emulator.

## Next steps

Now that you completed this tutorial, consider continuing on to one of the following tutorials:

* [Add authentication to your Android app](app-service-mobile-android-get-started-users.md).
  Learn how to add authentication to the todolist quickstart project on Android using a supported identity provider.
* [Enable offline sync for your Android app](app-service-mobile-android-get-started-offline-data.md).
  Learn how to add offline support to your app by using a Mobile Apps back end. With offline sync, users can interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection.

<!-- URLs -->
[Android quick start]: app-service-mobile-android-get-started.md
[Add Firebase to Your Android Project]:https://firebase.google.com/docs/android/setup
