<properties 
	pageTitle="Get Started with Azure Mobile Engagement for Windows Universal Apps" 
	description="Learn how to use Azure Mobile Engagement with Analytics and Push Notifications for Windows Universal Apps."
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/30/2015" 
	ms.author="piyushjo" />
	
# Get Started with Azure Mobile Engagement for Windows Universal Apps

> [AZURE.SELECTOR]
- [Windows Universal](mobile-engagement-windows-store-dotnet-get-started.md) 
- [Windows Phone Silverlight](mobile-engagement-windows-phone-get-started.md) 
- [iOS - Obj C](mobile-engagement-ios-get-started.md) 
- [iOS - Swift](mobile-engagement-ios-swift-get-started.md)
- [Android](mobile-engagement-android-get-started.md) 

This topic shows you how to use Azure Mobile Engagement to understand your app usage and send push notifications to segmented users of a Windows Universal application. 
This tutorial demonstrates the simple broadcast scenario using Mobile Engagement. You will create a blank Windows Universal App that collects basic app usage data and receives push notifications using Windows Notification Service (WNS). When complete, you will be able to broadcast push notifications to all the devices or target specific users based on their devices properties. Be sure to follow along with the next tutorial to see how to use Mobile Engagement to address specific users and groups of devices.

This tutorial requires the following:

+ Visual Studio 2013
+ The [Mobile Engagement Windows Universal SDK]

> [AZURE.IMPORTANT] Completing this tutorial is a prerequisite for all other Mobile Engagement tutorials for Windows Universal Apps. To complete it - you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

##<a id="setup-azme"></a>Setup Mobile Engagement for your Windows Universal App

1. Log on to the Azure Management Portal, and then click **+NEW** at the bottom of the screen.

2. Click on **App Services**, then **Mobile Engagement**, and then **Create**.

   	![][7]

3. In the popup that appears, enter the following information:
 
   	![][8]

	- **Application Name**: type the name of your application. Feel free to use any character.
	- **Platform**: Select the target platform (**Windows Universal**) for the app (if your app targets multiple platforms, repeat this tutorial for each platform). 
	- **Application Resource Name**: This is the name by which this application will be accessible via APIs and URLs. You must only use conventional URL characters. The auto generated name should provide you a strong basis. You should also append the platform name to avoid any name clash as this name must be unique.
	- **Location**: Select the data center where this app (and more importantly its Collection) will be hosted.
	- **Collection**: If you have already created an application, select a previously created Collection, otherwise select New Collection.
	- **Collection Name**: This represents your group of applications. It will also ensure all your apps are in a group that will allow aggregated calculations of metrics. You should use your company name or department here if applicable.

	> [AZURE.TIP] If your Universal App is going to target both Windows and Windows Phone platform then you should still create two Mobile Engagement Applications one for each supported platforms. This is to ensure that you are able to create proper segmentation of the audience and are able to send appropriately targeted notifications for each platform. 

4. Select the app you just created in the **Applications** tab.

5. Click on **Connection Info** in order to display the connection settings to put into your SDK integration in your mobile app.
 
   	![][10]

6. Copy the **Connection String** - this is what you will need to identify this app in your Application code and connect with Mobile Engagement from your Universal App.

   	![][11]

##<a id="connecting-app"></a>Connect your app to the Mobile Engagement backend

This tutorial presents a "basic integration," which is the minimal set required to collect data and send a push notification. The complete integration documentation can be found in the [Mobile Engagement Windows Universal SDK documentation].

We will create a basic app with Visual Studio to demonstrate the integration.

###Create a new Windows Universal App project

You may skip this step if you already have an app and are familiar with Windows Universal development.

1. Launch Visual Studio, and in the home screen, select **New Project...**.

2. In the popup, select `Store Apps` -> `Universal Apps` -> `Blank App (Universal Apps)`. Fill in the app `Name` and `Solution name` then click **OK**.

   	![][13]

You have now created a new Windows Universal App project in which we will integrate the Azure Mobile Engagement SDK. 

###Connect your app to Mobile Engagement backend 

1. Install [Mobile Engagement Windows Universal SDK] nuget package in your project. If you are targeting both Windows and Windows Phone platforms then you will need to do this for both the projects. The same Nuget package will place the correct platform specific binaries in each project. 

2. Open `Package.appxmanifest` and add the following if it isn't automatically added: 
		
		Internet (Client)

	![][20]

3. Now paste the connection string you copied earlier for your Mobile Engagement App and paste it in the `Resources\EngagementConfiguration.xml` file, between the `<connectionString>` and `</connectionString>` tags:

	![][22]

	>[AZURE.TIP] If your App is going to target both Windows and Windows Phone platforms, you should still create two Mobile Engagement Applications - one for each supported platforms. This is to ensure that you are able to create proper segmentation of the audience and are able to send appropriately targeted notifications for each platform. 

4. In the `App.xaml.cs` file:

	a. Add the `using` statement:

			using Microsoft.Azure.Engagement;

	b. Initialize the SDK in the `OnLaunched` method:
			
			protected override void OnLaunched(LaunchActivatedEventArgs e)
			{
			  EngagementAgent.Instance.Init(e);
			
			  //... rest of the code
			}

	c. Insert the following in the `OnActivated` method and add the method if it is not already present:

			protected override void OnActivated(IActivatedEventArgs e)
			{
			  EngagementAgent.Instance.Init(e);
			
			  //... rest of the code
			}

##<a id="monitor"></a>Enabling real-time monitoring

In order to start sending data and ensuring that the users are active, you must send at least one screen (Activity) to the Mobile Engagement backend. We will achieve this by subclassing our `MainPage` with the `EngagementPage` which the Mobile Engagement SDK provides.

1. 	Add the `using` statement:

		using Microsoft.Azure.Engagement;

2. Replace the super class of `MainPage`, which is before `Page`, with `EngagementPage`:

	![][23]

3. In your `MainPage.xml` file:

	a. Add to your namespaces declarations:

			xmlns:engagement="using:Microsoft.Azure.Engagement"
	
	b. Replace the `Page` in the xml tag name with `engagement:EngagementPage`

###Ensure your app is connected with realtime monitoring

This section shows you how to make sure your app connects to the Mobile Engagement backend by using Mobile Engagement's realtime monitoring feature.

1. Navigate to your Mobile Engagement portal.

	From your Azure portal, ensure you're in the app we're using for this project, and then click on the **Engage** button at the bottom.

	![][26]

2. You will land in the settings page of your Engagement Portal for your app. From there, click on the **Monitor** tab as shown below.
![][30]

3. The monitor is ready to show you any device, in realtime, that will launch your app.

4. Back in Visual Studio, launch your app either in the emulator or in a connected device.

5. If it worked, you should now see one session in the monitor in real time! 
![][33]

**Congratulations!** You succeeded in completing the first step of this tutorial with an app that connects to the Mobile Engagement back-end, which is already sending data.

##<a id="integrate-push"></a>Enabling Push Notifications and in-app messaging

Mobile Engagement allows you to interact and reach your users with Push Notifications and In-app Messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections will setup your app to receive them.

###Enable your app to receive WNS Push Notifications

1. In the `Package.appxmanifest` file, in the `Application` tab, under `Notifications`, select `Yes` for `Toast capable:`:

	![][35]

###Initialize the REACH SDK

1. In `App.xaml.cs`, call `EngagementReach.Instance.Init();` in the `OnLaunched` function right after the agent initialization:

		protected override void OnLaunched(LaunchActivatedEventArgs e)
		{
		   EngagementAgent.Instance.Init(e);
		   EngagementReach.Instance.Init(e);
		}

2. In `App.xaml.cs`, call `EngagementReach.Instance.Init(e);` in the `OnActivated` function right after the agent initialization:

		protected override void OnActivated(IActivatedEventArgs e)
		{
		   EngagementAgent.Instance.Init(e);
		   EngagementReach.Instance.Init(e);
		}

You're all set for sending a Toast, now we will verify that you have correctly done this basic integration.

###Grant Access to Mobile Engagement to send Notifications

1. You'll have to associate your app with a Windows Store App to obtain your `Package security identifier (SID)` and your `Secret Key` (Client Secret). You can create an app from the [Windows Store Dev Center] and then make sure to **Associate App with Store** from Visual Studio. 

2. Navigate to the **Settings** of your Mobile Engagement Portal, and click `Native Push` section on the left.

3. Click the `Edit` button to enter your `Package security identifier (SID)` and your `Secret Key` as shown below:

	![][36]

##<a id="send"></a>Send a notification to your app

We will now create a simple Push Notification campaign that will send a push notification to our app.

1. Navigate to the **REACH** tab in your Mobile Engagement portal.

2. Click **New announcement** to create your push campaign.
![][37]

3. Setup the first field of your campaign through the following steps:
![][38]

	a. Name your campaign.

	b. Select **Delivery time** as *Any time* to allow the app to receive a notification whether the app is launched or not.

	c. In the notification text - type the **Title** which will be in bold in the push.

	d. Then type your message.

4. Scroll down, and in the content section select **Notification only**.
![][39]

5. You're done setting the most basic campaign possible, now scroll down again and click on **Create** button to save your campaign.

6. Last step, click on **Activate** activate your campaign and send push notifications.
![][41]

You should now see a toast notification from your campaign on your device - the app should be closed to see this toast notification. If the app was running, then ensure you have it closed for couple of minutes before activating the campaign to be able to receive toast notification. If you want to integrate in-app notification so that the notification shows up in the app when it is opened, see [Windows Universal Apps - Overlay integration]. 

<!-- URLs. -->
[Mobile Engagement Windows Universal SDK documentation]: ../mobile-engagement-windows-store-integrate-engagement/
[Mobile Engagement Windows Universal SDK]: http://go.microsoft.com/?linkid=9864592
[Windows Store Dev Center]: http://go.microsoft.com/fwlink/p/?linkid=266582&clcid=0x409
[Windows Universal Apps - Overlay integration]: ../mobile-engagement-windows-store-integrate-engagement-reach/#overlay-integration

<!-- Images. -->
[7]: ./media/mobile-engagement-common/create-mobile-engagement-app.png
[8]: ./media/mobile-engagement-common/create-azme-popup.png
[10]: ./media/mobile-engagement-common/app-main-page-select-connection-info.png
[11]: ./media/mobile-engagement-common/app-connection-info-page.png
[13]: ./media/mobile-engagement-windows-store-get-started/UniversalAppCreation.png
[20]: ./media/mobile-engagement-windows-store-get-started/manifest-capabilities.png
[21]: ./media/mobile-engagement-windows-store-get-started/manifest-declarations.png
[22]: ./media/mobile-engagement-windows-store-get-started/add-connection-info.png
[23]: ./media/mobile-engagement-windows-store-get-started/subclass-page.png
[26]: ./media/mobile-engagement-common/engage-button.png
[27]: ./media/mobile-engagement-common/engagement-portal.png
[30]: ./media/mobile-engagement-common/clic-monitor-tab.png
[33]: ./media/mobile-engagement-common/monitor.png
[34]: ./media/mobile-engagement-windows-store-get-started/manifest-declarations-reach.png
[35]: ./media/mobile-engagement-windows-store-get-started/manifest-toast.png
[36]: ./media/mobile-engagement-windows-store-get-started/enter-credentials.png
[37]: ./media/mobile-engagement-common/new-announcement.png
[38]: ./media/mobile-engagement-windows-store-get-started/campaign-first-params.png
[39]: ./media/mobile-engagement-common/campaign-content.png
[41]: ./media/mobile-engagement-common/campaign-activate.png
