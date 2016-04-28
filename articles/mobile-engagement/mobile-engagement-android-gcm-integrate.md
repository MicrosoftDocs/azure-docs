<properties
	pageTitle="Azure Mobile Engagement Android SDK Integration"
	description="Latest updates and procedures for Android SDK for Azure Mobile Engagement"
	services="mobile-engagement"
	documentationCenter="mobile"
	authors="piyushjo"
	manager="dwrede"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="Java"
	ms.topic="article"
	ms.date="03/10/2016"
	ms.author="piyushjo" />

#How to Integrate GCM with Mobile Engagement

> [AZURE.IMPORTANT] You must follow the integration procedure described in the How to Integrate Engagement on Android document before following this guide.
>
> This document is useful only if you already integrated the Reach module and plan to push Google Play devices. To integrate Reach campaigns in your application, please read first How to Integrate Engagement Reach on Android.

##Introduction

Integrating GCM allows your application to be pushed.

GCM payloads pushed to the SDK always contain the `azme` key in the data object. Thus if you use GCM for another purpose in your application, you can filter pushes based on that key.

> [AZURE.IMPORTANT] Only devices running Android 2.2 or above, having Google Play installed and having Google background connection enabled can be pushed using GCM; however, you can integrate this code safely on unsupported devices (it just uses intents).

##Create a Google Cloud Messaging project with API key

[AZURE.INCLUDE [mobile-engagement-enable-Google-cloud-messaging](../../includes/mobile-engagement-enable-google-cloud-messaging.md)]

> [AZURE.IMPORTANT] **Project Number** is not to be confused with **Project ID**.

##SDK integration

### Managing device registrations

Each device must send a registration command to the Google servers, otherwise they can't be reached.

A device can also unregister from GCM notifications (the device is automatically unregistered if the application is uninstalled).

If you don't use [Google Play SDK] or you don't already send the registration intent yourself, you can make Engagement register the device automatically for you.

To enable this, add the following to your `AndroidManifest.xml` file, inside the `<application/>` tag:

			<!-- If only 1 sender, don't forget the \n, otherwise it will be parsed as a negative number... -->
			<meta-data android:name="engagement:gcm:sender" android:value="<Your Google Project Number>\n" />

### Communicate registration id to the Engagement Push service and receive notifications

In order to communicate the registration id of the device to the Engagement Push service and receive its notifications, add the following to your `AndroidManifest.xml` file, inside the `<application/>` tag (even if you manage device registrations yourself):

			<receiver android:name="com.microsoft.azure.engagement.gcm.EngagementGCMEnabler"
			  android:exported="false">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.intent.action.APPID_GOT" />
			  </intent-filter>
			</receiver>

			<receiver android:name="com.microsoft.azure.engagement.gcm.EngagementGCMReceiver" android:permission="com.google.android.c2dm.permission.SEND">
			  <intent-filter>
			    <action android:name="com.google.android.c2dm.intent.REGISTRATION" />
			    <action android:name="com.google.android.c2dm.intent.RECEIVE" />
			    <category android:name="<your_package_name>" />
			  </intent-filter>
			</receiver>

Ensure you have the following permissions in your `AndroidManifest.xml` (after the `</application>` tag).

			<uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
			<uses-permission android:name="<your_package_name>.permission.C2D_MESSAGE" />
			<permission android:name="<your_package_name>.permission.C2D_MESSAGE" android:protectionLevel="signature" />

##Grant Mobile Engagement access to your GCM API Key

Follow [this guide](mobile-engagement-android-get-started.md#grant-mobile-engagement-access-to-your-gcm-api-key) to grant Mobile Engagement access to your GCM API Key.

[Google Play SDK]:https://developers.google.com/cloud-messaging/android/start
