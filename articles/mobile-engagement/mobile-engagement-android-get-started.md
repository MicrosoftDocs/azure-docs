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
	ms.date="09/22/2015"
	ms.author="piyushjo" />

# Get started with Azure Mobile Engagement for Android apps

> [AZURE.SELECTOR]
- [Windows Universal](mobile-engagement-windows-store-dotnet-get-started.md)
- [Windows Phone Silverlight](mobile-engagement-windows-phone-get-started.md)
- [iOS | Obj C](mobile-engagement-ios-get-started.md)
- [iOS | Swift](mobile-engagement-ios-swift-get-started.md)
- [Android](mobile-engagement-android-get-started.md)
- [Cordova](mobile-engagement-cordova-get-started.md)

This topic shows you how to use Azure Mobile Engagement to understand your app usage and how to send push notifications to segmented users of an Android application.
This tutorial demonstrates the simple broadcast scenario using Mobile Engagement. In it, you create a blank Android app that collects basic data and receives push notifications using Google Cloud Messaging (GCM). 

This tutorial requires the following:

+ The Android SDK (it is assumed you will be using Android Studio), which you can download [here](http://go.microsoft.com/fwlink/?LinkId=389797)
+ The [Mobile Engagement Android SDK]

> [AZURE.IMPORTANT] Completing this tutorial is a prerequisite for all other Mobile Engagement tutorials for Android apps, and to complete it, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

##<a id="setup-azme"></a>Setup Mobile Engagement for your Android app

[AZURE.INCLUDE [Create Mobile Engagement App in Portal](../../includes/mobile-engagement-create-app-in-portal.md)]

##<a id="connecting-app"></a>Connect your app to the Mobile Engagement backend

This tutorial presents a "basic integration", which is the minimal set required to collect data and send a push notification. The complete integration documentation can be found in the [Mobile Engagement Android SDK integration](../mobile-engagement-android-sdk-overview/)

We will create a basic app with Android Studio to demonstrate the integration.

###Create a new Android project

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

###Include the SDK library in your project

Download and integrate the SDK library

1. Download the [Mobile Engagement Android SDK].
2. Extract the archive file to a folder in your computer.
3. Identify the .jar library for the current version of this SDK and copy it to the Clipboard.

	  ![][6]

4. Navigate to the **Project** section (1) and paste the .jar in the libs folder (2).

	  ![][7]

5. Sync your project to load the library.

	  ![][8]

###Connect your app to Mobile Engagement backend with the Connection String

1. Copy the following lines of code into the activity creation (must be done only in one place of your application, usually the main activity). For this sample app, open up the MainActivity under src -> main -> java folder and add the following:

		EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
		engagementConfiguration.setConnectionString("Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}");
		EngagementAgent.getInstance(this).init(engagementConfiguration);

2. Resolve the references by pressing Alt + Enter or adding the following import statements:

		import com.microsoft.azure.engagement.EngagementAgent;
		import com.microsoft.azure.engagement.EngagementConfiguration;

3. Go back to the Azure portal in your app's **Connection Info** page and copy the **Connection String**.

	  ![][9]

4. Paste it in the `setConnectionString` parameter to replace the example provided as shown below:

		engagementConfiguration.setConnectionString("Endpoint=my-company-name.device.mobileengagement.windows.net;SdkKey=********************;AppId=*********");

###Add permissions and a service declaration

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

###Send a screen to Mobile Engagement

In order to start sending data and ensuring that the users are active, you must send at least one screen (Activity) to the Mobile Engagement backend. 

Go to **MainActivity.java** and add the following to replace the base class of **MainActivity** to **EngagementActivity**:

	public class MainActivity extends EngagementActivity {

You should comment out (exclude) the following line for this simple sample scenario:

    // setSupportActionBar(toolbar);

If you want to keep this around then you should check out the "Basic Reporting" scenario in our [Advanced Android Integration]

##<a id="monitor"></a>Connect app with real-time monitoring

[AZURE.INCLUDE [Connect app with real-time monitoring](../../includes/mobile-engagement-connect-app-with-monitor.md)]

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

		 ![][13]

	2. Go back to Android Studio, select the 'main' directory of your project files, and then paste it to add the resources to your project.

		 ![][14]

###Specify an icon for notifications

Paste the following XML snippet in your Manifest.xml between the `<application>` and `</application>` tags.

		<meta-data android:name="engagement:reach:notification:icon" android:value="engagement_close"/>

This defines the icon that is displayed both in system and in-app notifications. It is optional for in-app notifications however mandatory for system notifications. Android will rejects system notifications with invalid icons.

Make sure you are using an icon that exists in one of the **drawable** folders (like ``engagement_close.png``). **mipmap** folder isn't supported.

>[AZURE.NOTE] You should not use the **launcher** icon. It has a different resolution and is usually in the mipmap folders, which we don't support.

For real apps, you can use an icon that is suitable for notifications per [Android design guidelines](http://developer.android.com/design/patterns/notifications.html).

>[AZURE.TIP] To be sure to use correct icon resolutions, you can look at [these examples](https://www.google.com/design/icons).
Scroll down to the **Notification** section, click an icon, and then click `PNGS` to download the icon drawable set. You can see what drawable folders with which resolution to use for each version of the icon.

##Create a Google Cloud Messaging project with API key 

[AZURE.INCLUDE [mobile-engagement-enable-Google-cloud-messaging](../../includes/mobile-engagement-enable-google-cloud-messaging.md)]

###Enable your app to receive GCM push notifications

1. Paste the following into your Manifest.xml between the `<application>` and `</application>` tags after replacing the `project number` obtained from your Google Play console. The \n is intentional so make sure that you end the project number with it.

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

	![][15]

2. Then click the **Settings** -> **Native Push** section to enter your GCM Key:
	  
	![][16]

3. Click the **Edit** icon in front of **API Key** in the **GCM Settings** section as shown below:
	  
	![][17]

4. In the pop-up, paste the GCM Server Key you obtained before and then click **Ok**.

	![][18]

##<a id="send"></a>Send a notification to your app

We will now create a simple push notification campaign that sends a push notification to our app.

1. Navigate to the **REACH** tab in your Mobile Engagement portal.
	 
2. Click **New announcement** to create your push notification campaign.
	 
	![][20]

3. Set up the first field of your campaign through the following steps:
	 
	![][21]

	a. Name your campaign.

	b. Select the **Delivery type** as *System notification -> Simple*: This is the simple Android push notification type that features a title and a small line of text.

	c. Select **Delivery time** as *Any time* to allow the app to receive a notification whether the app is started or not.

	d. In the notification text type the **Title** which will be in bold in the push.

	e. Then type your **Message**

4. Scroll down, and in the **Content** section, select **Notification only**.

	![][22]

5. You're done setting the most basic campaign possible. Now scroll down again and click the **Create** button to save your campaign.

6. Last step: click **Activate** to activate your campaign to send push notifications.
    
	![][24]

<!-- URLs. -->
[Mobile Engagement Android SDK]: http://go.microsoft.com/?linkid=9863935
[Mobile Engagement Android SDK documentation]: http://go.microsoft.com/?linkid=9874682
[Advanced Android Integration]: https://azure.microsoft.com/en-us/documentation/articles/mobile-engagement-android-integrate-engagement/#basic-reporting

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
[13]: ./media/mobile-engagement-android-get-started/copy-resources.png
[14]: ./media/mobile-engagement-android-get-started/paste-resources.png
[15]: ./media/mobile-engagement-android-get-started/engage-button.png
[16]: ./media/mobile-engagement-android-get-started/engagement-portal.png
[17]: ./media/mobile-engagement-android-get-started/native-push-settings.png
[18]: ./media/mobile-engagement-android-get-started/api-key.png
[20]: ./media/mobile-engagement-android-get-started/new-announcement.png
[21]: ./media/mobile-engagement-android-get-started/campaign-first-params.png
[22]: ./media/mobile-engagement-android-get-started/campaign-content.png
[24]: ./media/mobile-engagement-android-get-started/campaign-activate.png
