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
	ms.date="08/10/2015"
	ms.author="piyushjo" />

#How to Integrate GCM with Mobile Engagement

> [AZURE.IMPORTANT] You must follow the integration procedure described in the How to Integrate Engagement on Android document before following this guide.
>
> This document is useful only if you integrated either the Reach module for any time campaign support. To integrate Reach campaigns in your application, please read first How to Integrate Engagement Reach on Android.

##Introduction

Integrating GCM allows your application to be pushed.

GCM payloads pushed to the SDK always contain the `azme` key in the data object. Thus if you use GCM for another purpose in your application, you can filter pushes based on that key.

> [AZURE.IMPORTANT] Only devices running Android 2.2 or above, having Google Play installed and having Google background connection enabled can be pushed using GCM; however, you can integrate this code safely on unsupported devices (it just uses intents).

##Sign up to GCM and enable GCM Service

If not already done, you must enable the GCM Service on your Google account.

At the time of writing this document (February 5th, 2014), you can follow the procedure at: [<http://developer.android.com/guide/google/gcm/gs.html>].

Follow that procedure just to enable GCM on your account. When you reach the **Obtaining an API Key** section, don't read it and go back to this page instead of following the Google procedure any further.

The procedure explains that the **Project Number** is used as the **GCM sender ID**, you need it later in this procedure.

> [AZURE.IMPORTANT] **Project Number** is not to be confused with **Project ID**. Project ID can now be different (it's a name on new projects). What you need to integrate in the Engagement SDK is the **Project Number** and is displayed in the **Overview** menu in the [Google Developers Console].

##SDK integration

### Managing device registrations

Each device must send a registration command to the Google servers, otherwise they can't be reached.

A device can also unregister from GCM notifications (the device is automatically unregistered if the application is uninstalled).

If you use the [GCM client library], you can directly read android-sdk-gcm-receive.

If you don't already send the registration intent yourself, you can make Engagement register the device automatically for you.

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

##Grant Engagement access to a Server API Key

If not already done, create a **Server API Key** on [Google Developers Console].

The Server Key **MUST NOT have IP restriction**.

At the time of writing this document (February 5th, 2014), the procedure is the following:

-   To do so, open [Google Developers Console].
-   Select the same project as earlier in the procedure (the one with the **Project Number** you integrated in `AndroidManifest.xml`).
-   Go to APIs & auth -\> Credentials, click on "CREATE NEW KEY" in the "Public API access" section.
-   Select "Server key".
-   On next screen, leave it blank **(no IP restriction)**, then click on Create.
-   Copy the generated **API key**.
-   Go to $/\#application/YOUR\_ENGAGEMENT\_APPID/native-push.
-   In GCM section edit the API Key with the one you just generated and copied.

You are now able to select "Any Time" when creating Reach announcements and polls.

> [AZURE.IMPORTANT] Engagement actually needs a **Server Key**, an Android Key cannot be used by Engagement servers.

##Test

Now please verify your integration by reading How to Test Engagement Integration on Android.


[<http://developer.android.com/guide/google/gcm/gs.html>]:http://developer.android.com/guide/google/gcm/gs.html
[Google Developers Console]:https://cloud.google.com/console
[GCM client library]:http://developer.android.com/guide/google/gcm/gs.html#libs
[Google Developers Console]:https://cloud.google.com/console
