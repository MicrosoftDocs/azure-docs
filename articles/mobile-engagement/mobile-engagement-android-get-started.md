<properties
	pageTitle="Get started with Azure Mobile Engagement"
	description="Learn how to use Azure Mobile Engagement with analytics and push notifications for Android apps."
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
	ms.topic="hero-article"
	ms.date="05/01/2015"
	ms.author="piyushjo" />

# Get started with Azure Mobile Engagement for Android apps

> [AZURE.SELECTOR]
- [Windows Universal](mobile-engagement-windows-store-dotnet-get-started.md)
- [Windows Phone Silverlight](mobile-engagement-windows-phone-get-started.md)
- [iOS - Obj C](mobile-engagement-ios-get-started.md)
- [iOS - Swift](mobile-engagement-ios-swift-get-started.md)
- [Android](mobile-engagement-android-get-started.md)
- [Cordova](mobile-engagement-cordova-get-started.md)

This topic shows you how to use Azure Mobile Engagement to understand your app usage and how to send push notifications to segmented users of an Android application.
This tutorial demonstrates the simple broadcast scenario using Mobile Engagement. In it, you create a blank Android app that collects basic data and receives push notifications using Google Cloud Messaging (GCM). When you have completed this tutorial, you will be able to broadcast push notifications to all the devices or target-specific users based on their devices' properties. Be sure to follow along with the next tutorial to see how to use Mobile Engagement to address specific users and groups of devices.


This tutorial requires the following:

+ The Android SDK (it is assumed you will be using Android Studio), which you can download [here](http://go.microsoft.com/fwlink/?LinkId=389797)
+ The [Mobile Engagement Android SDK]

> [AZURE.IMPORTANT] Completing this tutorial is a prerequisite for all other Mobile Engagement tutorials for Android apps, and to complete it, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

<!--
##<a id="register"></a>Enable Google Cloud Messaging

[WACOM.INCLUDE [Enable GCM](../../includes/mobile-services-enable-google-cloud-messaging.md)]

You will use your GCM API key later when setting up your app for Mobile Engagement.
-->

##<a id="setup-azme"></a>Set up Mobile Engagement for your app

1. Sign in to the [Azure portal](https://manage.windowsazure.com), and then click **+NEW** at the bottom of the screen.

2. Click **App Services**, click **Mobile Engagement**, and then click **Create**.

    ![][7]

3. In the pop-up that appears, enter the following information:

    ![][8]

    - **Application Name**: You can type the name of your application. Feel free to use any character.
    - **Platform**: Select the target platform for that app (if your app targets multiple platforms, repeat this tutorial for each platform).
    - **Application Resource Name**: This is the name by which this application will be accessible via APIs and URLs. We advise that you use only conventional URL characters: The auto-generated name should provide you a strong basis. We also advise appending the platform name to avoid any name clash because this name must be unique.
    - **Location**: Select the datacenter where this app (and more importantly its Collection - see below) will be hosted.
    - **Collection**: If you have already created an application, select a previously created Collection; otherwise select **New Collection**.
    - **Collection Name**: This represents your group of applications. It will also ensure all your apps are in a group that allows aggregated calculations. We strongly advise that you use your company name or department.

	When you're done, click the check mark button to finish the creation of your app.

4. Now click or select the app you just created in the **Application** tab.

    ![][9]

5. Then click **Connection Info** in order to display the **Connection** settings to put into your SDK integration.

    ![][10]

6. Finally, write down the **Connection String**, which is what you will need to identify this app from your application code.

    ![][11]

	>[AZURE.TIP] You can use the **Copy** icon on the right of the **Connection String** to copy it to the Clipboard as a convenience.

##<a id="connecting-app"></a>Connect your app to the Mobile Engagement backend

This tutorial presents a "basic integration", which is the minimal set required to collect data and send a push notification. The complete integration documentation can be found in the [Mobile Engagement Android SDK documentation].

We will create a basic app with Android Studio to demonstrate the integration.

###Create a new Android project

You can skip this step if you already have an app and are familiar with Android development.

1. Start **Android Studio**, and in the pop-up, select **Start a new Android Studio project**.

    ![][12]

2. Fill in the app name and company domain. Write them down because you will need them later, and then click **Next**.

    ![][13]

3. Now select the target form factor and API level, and then click **Next**.
	>[AZURE.NOTE] Mobile Engagement requires API level 10 minimum (Android 2.3.3).

    ![][14]

4. We'll now add an activity to our simple app, which will be its main and only screen. Make sure **Blank Activity** is selected, and then lick **Next**.

    ![][15]

5. In the final screen of the wizard, you can leave everything as is for the purposes of this tutorial, and then click **Finish**.

    ![][16]

Android Studio now creates the demo app into which we will integrate Mobile Engagement.

###Include the SDK library in your project

Download and integrate the SDK library

1. Download the [Mobile Engagement Android SDK].
2. Extract the archive file to a folder in your computer.
3. Identify the .jar library for the current version of this SDK and copy it to the Clipboard.

	  ![][17]

4. Navigate to the **Project** section (1) and paste the .jar in the libs folder (2).

	  ![][18]

5. Sync your project to load the library.

	  ![][19]


###Connect your app to Mobile Engagement backend with the Connection String

1. Copy the following lines of code into the activity creation (must be done only in one place of your application, usually the main activity).

		EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
		engagementConfiguration.setConnectionString("Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}");
		EngagementAgent.getInstance(this).init(engagementConfiguration);

2. Go back to the Azure portal in your app's **Connection Info** page and copy the **Connection String**.

	  ![][11]

3. Paste it in the `setConnectionString` parameter to replace the example provided as shown below (The AppId and Sdkkey were hidden below).

		engagementConfiguration.setConnectionString("Endpoint=my-company-name.device.mobileengagement.windows.net;SdkKey=********************;AppId=*********");

4. **EngagementConfiguration** and **EngagementAgent** will probably show as unresolved (in red in the code). Click each of the unresolved classes, and then press Alt+Enter to automatically resolve them.

	  ![][20]

###Add permissions and a service declaration

1. Add these permissions to the Manifest.xml of your project immediately before or after the `<application>` tag:

		<uses-permission android:name="android.permission.INTERNET"/>
		<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
		<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
		<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
		<uses-permission android:name="android.permission.VIBRATE" />
		<uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION"/>

	The result should be as shown below:

	 ![][21]

2. Add the following between the `<application>` and `</application>` tags to declare the agent service:

		<service
 			android:name="com.microsoft.azure.engagement.service.EngagementService"
 			android:exported="false"
 			android:label="<Your application name>"
 			android:process=":Engagement"/>

3. In the code you just pasted, replace `"<Your application name>"` in the label. This is displayed in the **Settings** menu where users can see services running on the device. You can add the word "Service" in that label for example.

###Send a screen to Mobile Engagement

In order to start sending data and ensuring that the users are active, you must send at least one screen (Activity) to the Mobile Engagement backend. We will achieve this by subclassing our Activity with **EngagementActivity** our SDK provides.
In order to to that, replace the super class of **MainActivity**, which is before **ActionBarActivity**, with **EngagementActivity**, as shown below:

 ![][22]

>[AZURE.NOTE] Do not forget to resolve the class if it appears in red by clicking it and pressing Alt+Enter.

##<a id="monitor"></a>Check that your app is connected with real-time monitoring

This section shows you how to make sure that your app connects to the Mobile Engagement backend by using the Mobile Engagement's real-time monitoring feature.

1. Navigate to your Mobile Engagement portal.

	From your Azure portal, ensure you're in the app we're using for this project, and then click the **Engage** button at the bottom.

	 ![][26]

2. You will land in the **Settings** page of your Engagement portal for your app. From there, click the **Monitor** tab as shown below.
	 ![][30]

3. The monitor is ready to show you any device in real time, which will start your app.
	 ![][31]

4. Back in Android Studio, start your app either in the monitor or in a connected device by clicking the green triangle and then selecting your device.
	 ![][32]

5. If it worked, you should now see one session in the monitor!
	 ![][33]

**Congratulations!** You succeeded in completing the first step of this tutorial with an app that connects to the Mobile Engagement backend, which is already sending data.


##<a id="integrate-push"></a>Enable push notifications and in-app messaging

Mobile Engagement allows you to interact with and REACH your users with push notifications and in-app messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections sets up your app to receive them.

### Enable in-app messaging

1. Copy the in-app messaging resources below into your Manifest.xml between the `<application>` and `</application>` tags.

		<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementTextAnnouncementActivity" android:theme="@android:style/Theme.Light">
  			<intent-filter>
    			<action android:name="com.microsoft.azure.engagement.reach.intent.action.ANNOUNCEMENT"/>
    			<category android:name="android.intent.category.DEFAULT" />
    			<data android:mimeType="text/plain" />
  			</intent-filter>
		</activity>
		<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementWebAnnouncementActivity" android:theme="@android:style/Theme.Light">
			<intent-filter>
				<action android:name="com.microsoft.azure.engagement.reach.intent.action.ANNOUNCEMENT"/>
				<category android:name="android.intent.category.DEFAULT" />
				<data android:mimeType="text/html" />
			</intent-filter>
		</activity>
		<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementPollActivity" android:theme="@android:style/Theme.Light">
			<intent-filter>
				<action android:name="com.microsoft.azure.engagement.reach.intent.action.POLL"/>
				<category android:name="android.intent.category.DEFAULT" />
			</intent-filter>
		</activity>
		<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementLoadingActivity" android:theme="@android:style/Theme.Dialog">
			<intent-filter>
				<action android:name="com.microsoft.azure.engagement.reach.intent.action.LOADING"/>
				<category android:name="android.intent.category.DEFAULT"/>
			</intent-filter>
		</activity>
		<receiver android:name="com.microsoft.azure.engagement.reach.EngagementReachReceiver" android:exported="false">
			<intent-filter>
				<action android:name="android.intent.action.BOOT_COMPLETED"/>
				<action android:name="com.microsoft.azure.engagement.intent.action.AGENT_CREATED"/>
				<action android:name="com.microsoft.azure.engagement.intent.action.MESSAGE"/>
				<action android:name="com.microsoft.azure.engagement.reach.intent.action.ACTION_NOTIFICATION"/>
				<action android:name="com.microsoft.azure.engagement.reach.intent.action.EXIT_NOTIFICATION"/>
				<action android:name="com.microsoft.azure.engagement.reach.intent.action.DOWNLOAD_TIMEOUT"/>
			</intent-filter>
		</receiver>
		<receiver android:name="com.microsoft.azure.engagement.reach.EngagementReachDownloadReceiver">
			<intent-filter>
				<action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>
			</intent-filter>
		</receiver>

2. Copy the resources to your project through the following steps:
	1. Navigate back to your SDK download content and copy the 'res' folder.

		 ![][23]

	2. Go back to Android Studio, select the 'main' directory of your project files, and then paste it to add the resources to your project.

		 ![][24]

###Specify an icon for notifications

The following code defines the icon that is used to be displayed both in app and system notifications.

Although this is optional for in-app notifications, it is mandatory for system notifications. Android rejects system notifications with invalid icons.

This XML snippet is to be pasted into your Manifest.xml between the `<application>` and `</application>` tags.

Make sure you are using an icon that exists in one of the **drawable** folders (like ``engagement_close.png``). We don't support **mipmap** folders.

		<meta-data android:name="engagement:reach:notification:icon" android:value="engagement_close"/>

It's just an example to show the syntax. You should of course use an icon that is suitable for notifications per [Android design guidelines](http://developer.android.com/design/patterns/notifications.html).

You should not use the **launcher** icon. It has a different resolution and is usually in the mipmap folders, which we don't support.

>[AZURE.TIP] To be sure to use correct icon resolutions, you can look at [those examples](https://www.google.com/design/icons).
Scroll down to the **Notification** section, click an icon, and then click `PNGS` to download the icon drawable set. You can see what drawable folders with which resolution to use for each version of the icon.

###Enable your app to receive GCM push notifications

1. Enter your gcm:sender metadata and copy and paste the following into your Manifest.xml between the `<application>` and `</application>` tags. The hidden value below (with stars) is the `project number` obtained from your Google Play console. The \n is intentional so make sure that you end the project number with it.

		<meta-data android:name="engagement:gcm:sender" android:value="************\n" />

2. Paste the code below into your Manifest.xml between the `<application>` and `</application>` tags. Replace the package name <Your package name>.

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
				<category android:name="<Your package name>" />
			</intent-filter>
		</receiver>

3. Add the last set of permissions that are highlighted before the `<application>` tag. Replace `<Your package name>` by the actual package name of your application.

		<uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
		<uses-permission android:name="<Your package name>.permission.C2D_MESSAGE" />
		<permission android:name="<Your package name>.permission.C2D_MESSAGE" android:protectionLevel="signature" />

###Grant Mobile Engagement access to your GCM API Key

To allow Mobile Engagement to send push notifications on your behalf, you need to grant it access to your API Key. This is done by configuring and entering your key into the Mobile Engagement portal.

1. Navigate to your Mobile Engagement portal

	From your Azure portal, ensure you're in the app we're using for this project, and then click the **Engage** button at the bottom:

	 ![][26]

2. You are now in the **Settings** page in your Engagement portal. From there, click the **Native Push** section to enter your GCM Key:
	  ![][27]

3. Click the **Edit** icon in front of **API Key** in the **GCM Settings** section as shown below:
	  ![][28]

4. In the pop-up, paste the GCM Server Key you obtained in the section [Enable Google Cloud Messaging](#register), and then click **Ok**.

	 ![][29]

You're all set. Now we will verify that you have correctly carried out this basic integration.

> [AZURE.IMPORTANT] Make sure you build, start with this new code, exit the app, and wait about 1 minute before doing the following steps.

##<a id="send"></a>Send a notification to your app

We will now create a simple push notification campaign that sends a push notification to our app.

1. Navigate to the **REACH** tab in your Mobile Engagement portal.
	 ![][34]

2. Click **New announcement** to create your push notification campaign.
	 ![][35]

3. Set up the first field of your campaign through the following steps:
	 ![][36]

	1. Name your campaign with any name you like.
	2. Select the **Delivery type** as *System notification / Simple*: This is the simple Android push notification type that features a title and a small line of text.
	3. Select **Delivery time** as *Any time* to allow the app to receive a notification whether the app is started or not.
	4. In the notification text, type the title, which will be in bold in the push.
	5. Then type your message.

4. Scroll down, and in the **Content** section, select **Notification only**.
	  ![][37]

5. You're done setting the most basic campaign possible, now scroll down again and create your campaign to save it!
    ![][38]

6. Last step: Activate your campaign.
    ![][39]


<!-- URLs. -->
[Mobile Engagement Android SDK]: http://go.microsoft.com/?linkid=9863935
[Mobile Engagement Android SDK documentation]: http://go.microsoft.com/?linkid=9874682
<!-- Images. -->
[7]: ./media/mobile-engagement-android-get-started/create-mobile-engagement-app.png
[8]: ./media/mobile-engagement-android-get-started/create-azme-popup.png
[9]: ./media/mobile-engagement-android-get-started/select-app.png
[10]: ./media/mobile-engagement-android-get-started/app-main-page-select-connection-info.png
[11]: ./media/mobile-engagement-android-get-started/app-connection-info-page.png
[12]: ./media/mobile-engagement-android-get-started/android-studio-new-project.png
[13]: ./media/mobile-engagement-android-get-started/android-studio-project-props.png
[14]: ./media/mobile-engagement-android-get-started/android-studio-project-props2.png
[15]: ./media/mobile-engagement-android-get-started/android-studio-add-activity.png
[16]: ./media/mobile-engagement-android-get-started/android-studio-activity-name.png
[17]: ./media/mobile-engagement-android-get-started/sdk-content.png
[18]: ./media/mobile-engagement-android-get-started/paste-jar.png
[19]: ./media/mobile-engagement-android-get-started/sync-project.png
[20]: ./media/mobile-engagement-android-get-started/resolve-classes.png
[21]: ./media/mobile-engagement-android-get-started/permissions.png
[22]: ./media/mobile-engagement-android-get-started/subclass-activity.png
[23]: ./media/mobile-engagement-android-get-started/copy-resources.png
[24]: ./media/mobile-engagement-android-get-started/paste-resources.png
[26]: ./media/mobile-engagement-android-get-started/engage-button.png
[27]: ./media/mobile-engagement-android-get-started/engagement-portal.png
[28]: ./media/mobile-engagement-android-get-started/native-push-settings.png
[29]: ./media/mobile-engagement-android-get-started/api-key.png
[30]: ./media/mobile-engagement-android-get-started/clic-monitor-tab.png
[31]: ./media/mobile-engagement-android-get-started/monitor.png
[32]: ./media/mobile-engagement-android-get-started/launch.png
[33]: ./media/mobile-engagement-android-get-started/monitor-trafic.png
[34]: ./media/mobile-engagement-android-get-started/reach-tab.png
[35]: ./media/mobile-engagement-android-get-started/new-announcement.png
[36]: ./media/mobile-engagement-android-get-started/campaign-first-params.png
[37]: ./media/mobile-engagement-android-get-started/campaign-content.png
[38]: ./media/mobile-engagement-android-get-started/campaign-create.png
[39]: ./media/mobile-engagement-android-get-started/campaign-activate.png
