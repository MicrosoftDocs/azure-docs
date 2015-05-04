<properties 
	pageTitle="Get Started with Azure Mobile Engagement for Windows Phone Silverlight Apps" 
	description="Learn how to use Azure Mobile Engagement with Analytics and Push Notifications for Windows Phone Silverlight Apps."
	services="mobile-engagement" 
	documentationCenter="windows" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-phone" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/30/2015" 
	ms.author="piyushjo" />
	
# Get Started with Azure Mobile Engagement for Windows Phone Silverlight Apps

> [AZURE.SELECTOR]
- [Windows Universal](mobile-engagement-windows-store-dotnet-get-started.md) 
- [Windows Phone Silverlight](mobile-engagement-windows-phone-get-started.md) 
- [iOS - Obj C](mobile-engagement-ios-get-started.md) 
- [iOS - Swift](mobile-engagement-ios-swift-get-started.md)
- [Android](mobile-engagement-android-get-started.md) 

This topic shows you how to use Azure Mobile Engagement to understand your app usage and send push notifications to segmented users of a Windows Phone  Silverlight application. 
This tutorial demonstrates the simple broadcast scenario using Mobile Engagement. In it, you create a blank Windows Phone Silverlight app that collects basic data and receives push notifications using Microsoft Push Notification Service (MPNS). When complete, you will be able to broadcast push notifications to all the devices or target specific users based on their devices properties (using MPNS). Be sure to follow along with the next tutorial to see how to use Mobile Engagement to address specific users and groups of devices.

> [AZURE.NOTE] If you are targeting Windows Phone 8.1 (non-Silverlight) then refer to the [Windows Universal tutorial](mobile-engagement-windows-store-dotnet-get-started.md).

This tutorial requires the following:

+ Visual Studio 2013
+ The [Mobile Engagement Windows Phone SDK]

> [AZURE.IMPORTANT] Completing this tutorial is a prerequisite for all other Mobile Engagement tutorials for Windows Phone Silverlight apps, and to complete it, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

##<a id="setup-azme"></a>Setup Mobile Engagement for your Windows Phone Silverlight App

1. Log on to the Azure Management Portal, and then click **+NEW** at the bottom of the screen.

2. Click on **App Services**, then **Mobile Engagement**, and then **Create**.

   	![][7]

3. In the popup that appears, enter the following information:
 
   	![][8]

	- **Application Name**: type the name of your application. Feel free to use any character.
	- **Platform**: Select the target platform (**Windows Phone Silverlight**) for the app (if your app targets multiple platforms, repeat this tutorial for each platform). 
	- **Application Resource Name**: This is the name by which this application will be accessible via APIs and URLs. You must only use conventional URL characters. The auto generated name should provide you a strong basis. You should also append the platform name to avoid any name clash as this name must be unique.
	- **Location**: Select the data center where this app (and more importantly its Collection) will be hosted.
	- **Collection**: If you have already created an application, select a previously created Collection, otherwise select New Collection.
	- **Collection Name**: This represents your group of applications. It will also ensure all your apps are in a group that will allow aggregated calculations of metrics. You should use your company name or department here if applicable.

4. Select the app you just created in the **Applications** tab.

5. Click on **Connection Info** in order to display the connection settings to put into your SDK integration in your mobile app.
 
   	![][10]

6. Copy the **Connection String** - this is what you will need to identify this app in your Application code and connect with Mobile Engagement from your Phone App.

   	![][11]

##<a id="connecting-app"></a>Connecting your app to the Mobile Engagement backend

This tutorial presents a "basic integration" which is the minimal set required to collect data and send a push notification. The complete integration documentation can be found in the [Mobile Engagement Windows Phone SDK documentation].

We will create a basic app with Visual Studio to demonstrate the integration.

###Create a new Windows Phone Silverlight project

1. Launch Visual Studio, and in the home screen, select **New Project...**.

2. In the popup, select `Store Apps` -> `Windows Phone Apps` -> `Blank App (Windows Phone Silverlight)`. Fill in the app `Name` and `Solution name` then click **OK**.

   	![][13]

3. You can choose to target either **Windows Phone 8.0** or **Windows Phone 8.1** version. 

You have now created a new Windows Phone Silverlight App in which we will integrate the Azure Mobile Engagement SDK. 

###Connect your app to Mobile Engagement backend 

1. Install [Mobile Engagement Windows Phone SDK] nuget package in your project.

2. Open `WMAppManifest.xml` (under Properties folder) and make sure the following are declared (add them if not) in the `<Capabilities />` tag:
		
		<Capability Name="ID_CAP_NETWORKING" />
		<Capability Name="ID_CAP_IDENTITY_DEVICE" />

	![][20]

3. Now paste the connection string you copied earlier for your Mobile Engagement App and paste it in the `Resources\EngagementConfiguration.xml` file, between the `<connectionString>` and `</connectionString>` tags:

	![][21]

4. In the `App.xaml.cs` file:

	a. Add the `using` statement

			using Microsoft.Azure.Engagement;

	b. Initialize the SDK in the `Application_Launching` method:
			
			private void Application_Launching(object sender, LaunchingEventArgs e)
			{
			  EngagementAgent.Instance.Init();
			}

	c. Insert the following in the `Application_Activated`

			private void Application_Activated(object sender, ActivatedEventArgs e)
			{
			   EngagementAgent.Instance.OnActivated(e);
			}

##<a id="monitor"></a>Enabling real-time monitoring

In order to start sending data and ensuring the users are active, you must send at least one screen (Activity) to the Mobile Engagement backend. We will achieve this by subclassing our `MainPage` with the `EngagementPage` which the Mobile Engagement SDK provides.

1. Add the `using` statement:

		using Microsoft.Azure.Engagement;

2. Replace the super class of `MainPage`, which is before `PhoneApplicationPage`, with `EngagementPage`, as shown below:

	![][22]

3. In your `MainPage.xml` file:
	a. Add to your namespaces declarations:

			xmlns:engagement="clr-namespace:Microsoft.Azure.Engagement;assembly=Microsoft.Azure.Engagement.EngagementAgent.WP"
	
	b. Replace the `phone:PhoneApplicationPage` in the xml tag name with `engagement:EngagementPage`

###Ensure your app is connected with realtime monitoring

This section shows you how to make sure your app connects to the Mobile Engagement backend by using Mobile Engagement's realtime monitoring feature.

1. Navigate to your Mobile Engagement portal.

	From your Azure portal, ensure you're in the app we're using for this project and then click on the **Engage** button at the bottom.

	![][26]

2. You will land in the settings page of your Engagement Portal for your app. From there, click on the **Monitor** tab as shown below.
	![][30]

3. The monitor is ready to show you any device, in realtime, that will launch your app.

4. Back in Visual Studio, launch your app either in the emulator or in a connected device.

5. If it worked, you should now see one session in the monitor! 
	![][33]

**Congratulations!** You succeeded in completing the first step of this tutorial with an app that connects to the Mobile Engagement back-end, which is already sending data.

##<a id="integrate-push"></a>Enabling Push Notifications and in-app messaging

Mobile Engagement allows you to interact and REACH with your users with Push Notifications and In-app Messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections will setup your app to receive them.

###Enable your app to receive MPNS Push Notifications

Add new Capabilities to your `WMAppManifest.xml` file:

		ID_CAP_PUSH_NOTIFICATION 
		ID_CAP_WEBBROWSERCOMPONENT 

![][34]

###Initialize the REACH SDK

1. In `App.xaml.cs`, call `EngagementReach.Instance.Init();` in the `Application_Launching` function right after the agent initialization:

		private void Application_Launching(object sender, LaunchingEventArgs e)
		{
		   EngagementAgent.Instance.Init();
		   EngagementReach.Instance.Init();
		}

2. In `App.xaml.cs`, call `EngagementReach.Instance.OnActivated(e);` in the `Application_Activated` function right after the agent initialization:

		private void Application_Activated(object sender, ActivatedEventArgs e)
		{
		   EngagementAgent.Instance.OnActivated(e);
		   EngagementReach.Instance.OnActivated(e);
		}

You're all set, now we will verify that you have correctly done this basic integration.

##<a id="send"></a>Send a notification to your app

We will now create a simple Push Notification campaign that will send a push notification to our app.

1. Navigate to the **REACH** tab in your Mobile Engagement portal.

2. Click **New announcement** to create your push campaign.
	![][35]

3. Setup the first field of your campaign through the following steps:
	![][36]

	1. Name your campaign with any name you wish.
	2. Select **Delivery time** as *Any time* to allow the app to receive a notification whether the app is launched or not.
	3. In the notification text, type the Title which will be in bold in the push.
	4. Then type your message.

4. Scroll down, and in the content section select **Notification only**.
![][37]

5. You're done setting the most basic campaign possible, now scroll down again and click on **Create** button to save your campaign.

6. Last step, click on **Activate** activate your campaign and send push notifications.
![][39]

7. Now you should see a notification on your device, **Congratulations!**:
![][40]

<!-- URLs. -->
[Mobile Engagement Windows Phone SDK]: http://go.microsoft.com/?linkid=9874664
[Mobile Engagement Windows Phone SDK documentation]: ../mobile-engagement-windows-phone-integrate-engagement/ 

<!-- Images. -->
[7]: ./media/mobile-engagement-common/create-mobile-engagement-app.png
[8]: ./media/mobile-engagement-common/create-azme-popup.png
[10]: ./media/mobile-engagement-common/app-main-page-select-connection-info.png
[11]: ./media/mobile-engagement-common/app-connection-info-page.png
[13]: ./media/mobile-engagement-windows-phone-get-started/project-properties.png
[20]: ./media/mobile-engagement-windows-phone-get-started/wmappmanifest-capabilities.png
[21]: ./media/mobile-engagement-windows-phone-get-started/add-connection-string.png
[22]: ./media/mobile-engagement-windows-phone-get-started/subclassing.png
[26]: ./media/mobile-engagement-common/engage-button.png
[30]: ./media/mobile-engagement-common/clic-monitor-tab.png
[33]: ./media/mobile-engagement-windows-phone-get-started/monitor.png
[34]: ./media/mobile-engagement-windows-phone-get-started/reach-capabilities.png
[35]: ./media/mobile-engagement-common/new-announcement.png
[36]: ./media/mobile-engagement-windows-phone-get-started/campaign-first-params.png
[37]: ./media/mobile-engagement-common/campaign-content.png
[39]: ./media/mobile-engagement-common/campaign-activate.png
[40]: ./media/mobile-engagement-windows-phone-get-started/push-screenshot.png
