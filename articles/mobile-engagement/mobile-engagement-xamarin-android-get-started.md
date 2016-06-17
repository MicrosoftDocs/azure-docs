<properties
	pageTitle="Get Started with Azure Mobile Engagement for Xamarin.Android"
	description="Learn how to use Azure Mobile Engagement with Analytics and Push Notifications for Xamarin.Android Apps."
	services="mobile-engagement"
	documentationCenter="xamarin"
	authors="piyushjo"
	manager=""
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-xamarin-android"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.date="06/16/2016"
	ms.author="piyushjo" />

# Get Started with Azure Mobile Engagement for Xamarin.Android Apps

[AZURE.INCLUDE [Hero tutorial switcher](../../includes/mobile-engagement-hero-tutorial-switcher.md)]

This topic shows you how to use Azure Mobile Engagement to understand your app usage and how to send push notifications to segmented users of a Xamarin.Android application.
This tutorial demonstrates the simple broadcast scenario using Mobile Engagement. In it, you create a blank Xamarin.Android app that collects basic data and receives push notifications using Google Cloud Messaging (GCM).

This tutorial requires the following:

+ [Xamarin Studio](http://xamarin.com/studio). You can also use Visual Studio with Xamarin but this tutorial uses Xamarin Studio. For installation instructions, see [Setup and Install for Visual Studio and Xamarin](https://msdn.microsoft.com/library/mt613162.aspx).
+ [Mobile Engagement Xamarin SDK](https://www.nuget.org/packages/Microsoft.Azure.Engagement.Xamarin/)

> [AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-engagement-xamarin-android-get-started).

##<a id="setup-azme"></a>Setup Mobile Engagement for your Android app

[AZURE.INCLUDE [Create Mobile Engagement App in Portal](../../includes/mobile-engagement-create-app-in-portal.md)]

##<a id="connecting-app"></a>Connect your app to the Mobile Engagement backend

This tutorial presents a "basic integration", which is the minimal set required to collect data and send a push notification. 

We will create a basic app with Xamarin Studio to demonstrate the integration.

###Create a new Xamarin.Android project

1. Launch **Xamarin Studio** Go to **File** -> **New** -> **Solution** 

    ![][1]

2. Select **Android App** then make sure the selected language is **C#** and click **Next**.

    ![][2]

3. Fill in the **App Name** and the **Organization Identifier**. Make sure to checkmark **Google Play Services** and then click **Next**. 

    ![][3]
	
4. Update the **Project Name**, **Solution Name** and **Location** if required and click **Create**.

    ![][4]
 
Xamarin Studio will create the app in which we will integrate Mobile Engagement. 

###Connect your app to Mobile Engagement backend

1. Right click the **Packages** folder in the Solution windows and select **Add Packages...**

    ![][5]

2. Search for the **Microsoft Azure Mobile Engagement Xamarin SDK** and add it to your solution.  

    ![][6]
   
3. Open **MainActivity.cs** and add the following using statements:

		using Microsoft.Azure.Engagement;
		using Microsoft.Azure.Engagement.Activity;

4. In the `OnCreate` method, add the following to initialize the connection with Mobile Engagement backend. Make sure to add your **ConnectionString**. 

		EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
		engagementConfiguration.ConnectionString = "YourConnectionStringFromAzurePortal";
		EngagementAgent.Init(engagementConfiguration);

###Add permissions and a service declaration

1. Open up the **Manifest.xml** file under the Properties folder. Select Source tab so that you directly update the XML source.
 
2. Add these permissions to the Manifest.xml (which can be found under the **Properties** folder) of your project immediately before or after the `<application>` tag:

		<uses-permission android:name="android.permission.INTERNET"/>
		<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
		<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
		<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
		<uses-permission android:name="android.permission.VIBRATE" />
		<uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION"/>

3. Add the following between the `<application>` and `</application>` tags to declare the agent service:

		<service
 			android:name="com.microsoft.azure.engagement.service.EngagementService"
 			android:exported="false"
 			android:label="<Your application name>"
 			android:process=":Engagement"/>

4. In the code you just pasted, replace `"<Your application name>"` in the label. This is displayed in the **Settings** menu where users can see services running on the device. You can add the word "Service" in that label for example.

###Send a screen to Mobile Engagement

In order to start sending data and ensuring the users are active, you must send at least one screen to the Mobile Engagement backend. For doing this - ensure that the `MainActivity` inherits from `EngagementActivity` instead of `Activity`.

	public class MainActivity : EngagementActivity
	
Alternatively, if you cannot inherit from `EngagementActivity` then you must add `.StartActivity` and `.EndActivity` methods in `OnResume` and `OnPause` respectively.  

		protected override void OnResume()
	        {
	            EngagementAgent.StartActivity(EngagementAgentUtils.BuildEngagementActivityName(Java.Lang.Class.FromType(this.GetType())), null);
	            base.OnResume();             
	        }
	
	        protected override void OnPause()
	        {
	            EngagementAgent.EndActivity();
	            base.OnPause();            
	        }

##<a id="monitor"></a>Connect app with real-time monitoring

[AZURE.INCLUDE [Connect app with real-time monitoring](../../includes/mobile-engagement-connect-app-with-monitor.md)]

##<a id="integrate-push"></a>Enable push notifications and in-app messaging

Mobile Engagement allows you to interact with and REACH your users with push notifications and in-app messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections sets up your app to receive them.

[AZURE.INCLUDE [Enable Google Cloud Messaging](../../includes/mobile-engagement-enable-google-cloud-messaging.md)]

[AZURE.INCLUDE [Enable in-app messaging](../../includes/mobile-engagement-android-send-push.md)]

[AZURE.INCLUDE [Send notification from portal](../../includes/mobile-engagement-android-send-push-from-portal.md)]

<!-- Images -->
[1]: ./media/mobile-engagement-xamarin-android-get-started/1.png
[2]: ./media/mobile-engagement-xamarin-android-get-started/2.png
[3]: ./media/mobile-engagement-xamarin-android-get-started/3.png
[4]: ./media/mobile-engagement-xamarin-android-get-started/4.png
[5]: ./media/mobile-engagement-xamarin-android-get-started/5.png
[6]: ./media/mobile-engagement-xamarin-android-get-started/6.png
