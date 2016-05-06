<properties
	pageTitle="Get Started with Azure Mobile Engagement for Unity Android deployment"
	description="Learn how to use Azure Mobile Engagement with Analytics and Push Notifications for Unity apps deploying to iOS devices."
	services="mobile-engagement"
	documentationCenter="unity"
	authors="piyushjo"
	manager=""
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-unity-android"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.date="03/25/2016"
	ms.author="piyushjo" />

# Get Started with Azure Mobile Engagement for Unity Android deployment

[AZURE.INCLUDE [Hero tutorial switcher](../../includes/mobile-engagement-hero-tutorial-switcher.md)]

This topic shows you how to use Azure Mobile Engagement to understand your app usage and how to send push notifications to segmented users of a Unity application when deploying to an Android device.
This tutorial uses the classic Unity Roll a Ball tutorial as the starting point. You should follow the steps in this [tutorial](mobile-engagement-unity-roll-a-ball.md) before proceeding with the Mobile Engagement integration we showcase in the tutorial below. 

This tutorial requires the following:

+ [Unity Editor](http://unity3d.com/get-unity)
+ [Mobile Engagement Unity SDK](https://aka.ms/azmeunitysdk)
+ Google Android SDK

> [AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-engagement-unity-android-get-started).

##<a id="setup-azme"></a>Setup Mobile Engagement for your Android app

[AZURE.INCLUDE [Create Mobile Engagement App in Portal](../../includes/mobile-engagement-create-app-in-portal.md)]

##<a id="connecting-app"></a>Connect your app to the Mobile Engagement backend

###Import the Unity package

1. Download the [Mobile Engagement Unity package](https://aka.ms/azmeunitysdk) and save it to your local machine. 

2. Go to **Assets -> Import Package -> Custom Package** and select the package you downloaded in the above step. 

	![][70] 

3. Make sure all files are selected and click **Import** button. 

	![][71] 

4. Once Import is successful, you will see the imported SDK files in your project.  

	![][72] 

###Update the EngagementConfiguration

1. Open up the **EngagementConfiguration** script file from the SDK folder and update the **ANDROID\_CONNECTION\_STRING** with the connection string you obtained earlier from the Azure portal.  

	![][73]

2. Save the file 

3. Execute **File -> Engagement -> Generate Android Manifest**. This is the plugin added by the Mobile Engagement SDK and clicking on it will automatically update your project settings. 

	![][74]

> [AZURE.IMPORTANT] Make sure to execute this every time you update the **EngagementConfiguration** file otherwise your changes will not be reflected in the app. 

###Configure the app for basic tracking

1. Open up the **PlayerController** script attached to the Player object for editing. 

2. Add the following using statement:

		using Microsoft.Azure.Engagement.Unity;

3. Add the following to the `Start()` method
    
        EngagementAgent.Initialize();
        EngagementAgent.StartActivity("Home");

###Deploy and run the app
Make sure that you have Android SDK installed on your machine before attempting to deploy this Unity app to your device. 

1. Connect an Android device to your machine. 

2. Open up **File -> Build Settings** 

	![][40]

3. Select **Android** and then click on **Switch Platform**

	![][51]

	![][52]

4. Click on **Player settings** and provide a valid Bundle Identifier. 

	![][53]

5. Finally click on **Build And Run**

	![][54]

6. You may be asked to provide a folder name to store the Android package. 

7. If everything goes fine, then the package will be deployed to your connected device and you should see your Unity game on your phone! 

##<a id="monitor"></a>Connect app with real-time monitoring

[AZURE.INCLUDE [Connect app with real-time monitoring](../../includes/mobile-engagement-connect-app-with-monitor.md)]

##<a id="integrate-push"></a>Enable push notifications and in-app messaging

[AZURE.INCLUDE [Enable Google Cloud Messaging](../../includes/mobile-engagement-enable-google-cloud-messaging.md)]

###Update the EngagementConfiguration

1. Open up the **EngagementConfiguration** script file from the SDK folder and update the **ANDROID\_GOOGLE\_NUMBER** with the **Google Project Number** you obtained earlier from the Google Cloud Developer portal. This is a string value so make sure to enclose it in double quotes. 

	![][75]

2. Save the file. 

3. Execute **File -> Engagement -> Generate Android Manifest**. This is the plugin added by the Mobile Engagement SDK and clicking on it will automatically update your project settings. 

	![][74]

###Configure the app to receive notifications

1. Open up the **PlayerController** script attached to the Player object for editing. 

2. Add the following to the `Start()` method

		EngagementReachAgent.Initialize();

3. Now that the app is updated, deploy and run the app on a device per the instructions provided below. 

[AZURE.INCLUDE [Send notification from portal](../../includes/mobile-engagement-android-send-push-from-portal.md)]

<!-- Images -->
[40]: ./media/mobile-engagement-unity-android-get-started/40.png
[70]: ./media/mobile-engagement-unity-android-get-started/70.png
[71]: ./media/mobile-engagement-unity-android-get-started/71.png
[72]: ./media/mobile-engagement-unity-android-get-started/72.png
[73]: ./media/mobile-engagement-unity-android-get-started/73.png
[74]: ./media/mobile-engagement-unity-android-get-started/74.png
[75]: ./media/mobile-engagement-unity-android-get-started/75.png
[51]: ./media/mobile-engagement-unity-android-get-started/51.png
[52]: ./media/mobile-engagement-unity-android-get-started/52.png
[53]: ./media/mobile-engagement-unity-android-get-started/53.png
[54]: ./media/mobile-engagement-unity-android-get-started/54.png