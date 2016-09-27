<properties
	pageTitle="Add Push Notifications to Android App with Azure  Mobile Apps"
	description="Learn how to use Azure Mobile Apps to send push notifications to your Android app."
	services="app-service\mobile"
	documentationCenter="android"
	manager="erikre"
	editor=""
	authors="RickSaling"/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="java"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="ricksal"/>

# Add Push Notifications to your Android App

[AZURE.INCLUDE [app-service-mobile-selector-get-started-push](../../includes/app-service-mobile-selector-get-started-push.md)]

## Overview
In this tutorial, you add push notifications to the [Android quick start] project so that every time a record is inserted, a push notification is sent. This tutorial is based on the [Android quick start] tutorial, which you must complete first. If you do not use the downloaded quick start server project, you must add the push notification extension package to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

##Prerequisites

To complete this tutorial, you need the following:

* [Google account](http://go.microsoft.com/fwlink/p/?LinkId=268302) with a verified email address.
* [Visual Studio Community 2013](https://go.microsoft.com/fwLink/p/?LinkID=391934)&mdash;not needed for a Node.js backend project.
* Complete the [quickstart tutorial](app-service-mobile-android-get-started.md).

##<a name="create-hub"></a>Create a Notification Hub

[AZURE.INCLUDE [app-service-mobile-create-notification-hub](../../includes/app-service-mobile-create-notification-hub.md)]

## Enable Google Cloud Messaging

[AZURE.INCLUDE [mobile-services-enable-google-cloud-messaging](../../includes/mobile-engagement-enable-google-cloud-messaging.md)]

##Configure the Mobile App backend to send push requests

[AZURE.INCLUDE [app-service-mobile-android-configure-push](../../includes/app-service-mobile-android-configure-push.md)]

##<a id="update-service"></a>Update the server project to send push notifications

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-configure-push-google](../../includes/app-service-mobile-dotnet-backend-configure-push-google.md)]

## Add push notifications to your app

You must make sure that your Android app project is ready to handle push notifications.

###Verify Android SDK Version

[AZURE.INCLUDE [app-service-mobile-verify-android-sdk-version](../../includes/app-service-mobile-verify-android-sdk-version.md)]

Your next step is to install Google Play services. Google Cloud Messaging has some minimum API level requirements for development and testing, which the **minSdkVersion** property in the Manifest must conform to.

If you will be testing with an older device, then consult [Set Up Google Play Services SDK] to determine how low you can set this value, and set it appropriately.

###Add Google Play Services to the project

[AZURE.INCLUDE [Add Play Services](../../includes/app-service-mobile-add-google-play-services.md)]

###Add code

[AZURE.INCLUDE [app-service-mobile-android-getting-started-with-push](../../includes/app-service-mobile-android-getting-started-with-push.md)]

## Test the app against the published mobile service

You can test the app by directly attaching an Android phone with a USB cable, or by using a virtual device in the emulator.

##<a id="more"></a>More

* Tags allow you to target segmented customers with pushes. [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md) shows you how to add tags to a device installation.

<!-- URLs -->
[Android quick start]: app-service-mobile-android-get-started.md

[Set Up Google Play Services SDK]:https://developers.google.com/android/guides/setup
