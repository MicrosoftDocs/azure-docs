<properties
	pageTitle="Get started with Android Apps Azure Mobile Engagement"
	description="Learn how to use Azure Mobile Engagement with analytics and push notifications for Android apps."
	services="mobile-engagement"
	documentationCenter="android"
	authors="piyushjo"
	manager="erikre"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="Java"
	ms.topic="hero-article"
	ms.date="08/01/2016"
	ms.author="piyushjo;ricksal" />

# Get started with Azure Mobile Engagement for Android apps

[AZURE.INCLUDE [Hero tutorial switcher](../../includes/mobile-engagement-hero-tutorial-switcher.md)]

This topic shows you how to use Azure Mobile Engagement to understand your app usage and how to send push notifications to segmented users of an Android application.
This tutorial demonstrates the simple broadcast scenario using Mobile Engagement. In it, you create a blank Android app that collects basic data and receives push notifications using Google Cloud Messaging (GCM).

## Prerequisites

Completing this tutorial requires the [Android Developer Tools](https://developer.android.com/sdk/index.html), which includes the Android Studio integrated development environment, and the latest Android platform.

It also requires the [Mobile Engagement Android SDK](https://aka.ms/vq9mfn).

> [AZURE.IMPORTANT] To complete this tutorial, you need an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-engagement-android-get-started).

## Setup Mobile Engagement for your Android app

[AZURE.INCLUDE [Create Mobile Engagement App in Portal](../../includes/mobile-engagement-create-app-in-portal.md)]

## Connect your app to the Mobile Engagement backend

This tutorial presents a "basic integration", which is the minimal set required to collect data and send a push notification. The complete integration documentation can be found in the [Mobile Engagement Android SDK integration](mobile-engagement-android-sdk-overview.md)

We will create a basic app with Android Studio to demonstrate the integration.

### Create a new Android project

1. Start **Android Studio**, and in the pop-up, select **Start a new Android Studio project**.

    ![][1]

2. Provide an app name and company domain. Make a note of what you are filling as you will use it later. Click **Next**.

    ![][2]

3. Select the target form factor and API level, and click **Next**.

	>[AZURE.NOTE] Mobile Engagement requires API level 10 minimum (Android 2.3.3).

    ![][3]

4. Select **Blank Activity** here which will be the only screen for this app and click **Next**.

    ![][4]

5. Finally, leave the defaults as is and click **Finish**.

    ![][5]

Android Studio now creates the demo app into which we will integrate Mobile Engagement.

### Include the SDK library in your project

1. Download the [Mobile Engagement Android SDK](https://aka.ms/vq9mfn).
2. Extract the archive file to a folder in your computer.
3. Identify the .jar library for the current version of this SDK and copy it to the Clipboard.

	  ![][6]

4. Navigate to the **Project** section (1) and paste the .jar in the libs folder (2).

	  ![][7]

5. Sync your project to load the library.

	  ![][8]

### Connect your app to Mobile Engagement backend with the Connection String

1. Copy the following lines of code into the activity creation (must be done only in one place of your application, usually the main activity). For this sample app, open up the MainActivity under src -> main -> java folder and add the following:

		EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
		engagementConfiguration.setConnectionString("Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}");
		EngagementAgent.getInstance(this).init(engagementConfiguration);

2. Resolve the references by pressing Alt + Enter or adding the following import statements:

		import com.microsoft.azure.engagement.EngagementAgent;
		import com.microsoft.azure.engagement.EngagementConfiguration;

3. Go back to the Azure Classic Portal in your app's **Connection Info** page and copy the **Connection String**.

	  ![][9]

4. Paste it in the `setConnectionString` parameter to replace the example provided as shown below:

		engagementConfiguration.setConnectionString("Endpoint=my-company-name.device.mobileengagement.windows.net;SdkKey=********************;AppId=*********");

### Add permissions and a service declaration

1. Add these permissions to the Manifest.xml of your project immediately before or after the `<application>` tag:

		<uses-permission android:name="android.permission.INTERNET"/>
		<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
		<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
		<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
		<uses-permission android:name="android.permission.VIBRATE" />
		<uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION"/>

2. Add the following between the `<application>` and `</application>` tags to declare the agent service:

		<service
 			android:name="com.microsoft.azure.engagement.service.EngagementService"
 			android:exported="false"
 			android:label="<Your application name>"
 			android:process=":Engagement"/>

3. In the code you just pasted, replace `"<Your application name>"` in the label. This is displayed in the **Settings** menu where users can see services running on the device. You can add the word "Service" in that label for example.

### Send a screen to Mobile Engagement

In order to start sending data and ensuring that the users are active, you must send at least one screen (Activity) to the Mobile Engagement backend.

Go to **MainActivity.java** and add the following to replace the base class of **MainActivity** to **EngagementActivity**:

	public class MainActivity extends EngagementActivity {

> [AZURE.NOTE] If your base class is not *Activity*, consult
[Advanced Android Reporting](mobile-engagement-android-advanced-reporting.md#modifying-your-codeactivitycode-classes) for how to inherit from different classes.


You should comment out (exclude) the following line for this simple sample scenario:

    // setSupportActionBar(toolbar);

If you want to keep this around then you should check out [Advanced Android Reporting](mobile-engagement-android-advanced-reporting.md#modifying-your-codeactivitycode-classes).

## Connect app with real-time monitoring

[AZURE.INCLUDE [Connect app with real-time monitoring](../../includes/mobile-engagement-connect-app-with-monitor.md)]

## Enable push notifications and in-app messaging

Mobile Engagement allows you to interact with and REACH your users with push notifications and in-app messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections sets up your app to receive them.

### Copy SDK resources in your project

1. Navigate back to your SDK download content and copy the **res** folder.

	![][10]

2. Go back to Android Studio, select the **main** directory of your project files, and then paste it to add the resources to your project.

	![][11]

[AZURE.INCLUDE [Enable Google Cloud Messaging](../../includes/mobile-engagement-enable-google-cloud-messaging.md)]

[AZURE.INCLUDE [Enable in-app messaging](../../includes/mobile-engagement-android-send-push.md)]

[AZURE.INCLUDE [Send notification from portal](../../includes/mobile-engagement-android-send-push-from-portal.md)]

## Next steps

Go to [Android SDK](mobile-engagement-android-sdk-overview.md) to get detailed knowlege about the SDK integration.

<!-- Images. -->
[1]: ./media/mobile-engagement-android-get-started/android-studio-new-project.png
[2]: ./media/mobile-engagement-android-get-started/android-studio-project-props.png
[3]: ./media/mobile-engagement-android-get-started/android-studio-project-props2.png
[4]: ./media/mobile-engagement-android-get-started/android-studio-add-activity.png
[5]: ./media/mobile-engagement-android-get-started/android-studio-activity-name.png
[6]: ./media/mobile-engagement-android-get-started/sdk-content.png
[7]: ./media/mobile-engagement-android-get-started/paste-jar.png
[8]: ./media/mobile-engagement-android-get-started/sync-project.png
[9]: ./media/mobile-engagement-android-get-started/app-connection-info-page.png
[10]: ./media/mobile-engagement-android-get-started/copy-resources.png
[11]: ./media/mobile-engagement-android-get-started/paste-resources.png
