<properties
	pageTitle="Get started with Azure Mobile Engagement for Windows Universal Apps"
	description="Learn how to use Azure Mobile Engagement with analytics and push notifications for Windows Universal Apps."
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
	ms.topic="hero-article"
	ms.date="09/22/2015"
	ms.author="piyushjo" />

# Get started with Azure Mobile Engagement for Windows Universal Apps

> [AZURE.SELECTOR]
- [Universal Windows](mobile-engagement-windows-store-dotnet-get-started.md)
- [Windows Phone Silverlight](mobile-engagement-windows-phone-get-started.md)
- [iOS | Obj C](mobile-engagement-ios-get-started.md)
- [iOS | Swift](mobile-engagement-ios-swift-get-started.md)
- [Android](mobile-engagement-android-get-started.md)
- [Cordova](mobile-engagement-cordova-get-started.md)

This topic shows you how to use Azure Mobile Engagement to understand your app usage and send push notifications to segmented users of a Windows Universal application.
This tutorial demonstrates the simple broadcast scenario using Mobile Engagement. You will create a blank Windows Universal App that collects basic app usage data and receives push notifications using Windows Notification Service (WNS). When you have completed this tutorial, you will be able to broadcast push notifications to all the devices or target-specific users based on their devices properties. Be sure to follow along with the next tutorial to see how to use Mobile Engagement to address specific users and groups of devices.

This tutorial requires the following:

+ Visual Studio 2013
+ The [Mobile Engagement Windows Universal SDK]

> [AZURE.IMPORTANT] Completing this tutorial is a prerequisite for all other Mobile Engagement tutorials for Windows Universal Apps. To complete it - you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

##<a id="setup-azme"></a>Setup Mobile Engagement for your Windows Universal app

[AZURE.INCLUDE [Create Mobile Engagement App in Portal](../../includes/mobile-engagement-create-app-in-portal.md)]

##<a id="connecting-app"></a>Connect your app to the Mobile Engagement backend

This tutorial presents a "basic integration," which is the minimal set required to collect data and send a push notification. The complete integration documentation can be found in the Mobile Engagement Windows Universal SDK documentation.

We will create a basic app with Visual Studio to demonstrate the integration.

###Create a new Windows Universal App project

You can skip this step if you already have an app and are familiar with Windows Universal development.

1. Start Visual Studio, and in the **Home** screen, select **New Project**.

2. In the pop-up, select **Store Apps** -> **Universal Apps** -> **Blank App (Universal Apps)**. Fill in the app **Name** and **Solution name**, and then click **OK**.

    ![][1]

You have now created a new Windows Universal App project into which we will integrate the Azure Mobile Engagement SDK.

###Connect your app to Mobile Engagement backend

1. Install the [Mobile Engagement Windows Universal SDK] nuget package in your project. If you are targeting both Windows and Windows Phone platforms, you need to do this for both the projects. The same Nuget package places the correct platform-specific binaries in each project.

2. Open **Package.appxmanifest** and add the following if it isn't automatically added:

		Internet (Client)

	![][2]

3. Now copy the connection string that you copied earlier for your Mobile Engagement App and paste it in the `Resources\EngagementConfiguration.xml` file, between the `<connectionString>` and `</connectionString>` tags:

	![][3]

	>[AZURE.TIP] If your App is going to target both Windows and Windows Phone platforms, you should still create two Mobile Engagement Applications - one for each supported platforms. This is to ensure that you are able to create correct segmentation of the audience and are able to send appropriately targeted notifications for each platform.

4. In the `App.xaml.cs` file:

	a. Add the `using` statement:

			using Microsoft.Azure.Engagement;

	b. Initialize the SDK in the **OnLaunched** method:

			protected override void OnLaunched(LaunchActivatedEventArgs e)
			{
			  EngagementAgent.Instance.Init(e);

			  //... rest of the code
			}

	c. Insert the following in the **OnActivated** method and add the method if it is not already present:

			protected override void OnActivated(IActivatedEventArgs e)
			{
			  EngagementAgent.Instance.Init(e);

			  //... rest of the code
			}

##<a id="monitor"></a>Enable real-time monitoring

In order to start sending data and ensuring that the users are active, you must send at least one screen (Activity) to the Mobile Engagement backend. We achieve this by subclassing our **MainPage** with the **EngagementPage**, which the Mobile Engagement SDK provides.

1. 	Add the `using` statement:

		using Microsoft.Azure.Engagement;

2. Replace the base class of **MainPage** from **Page** to **EngagementPage**:

		class MainPage : EngagementPage

3. In your `MainPage.xml` file:

	a. Add to your namespaces declarations:

		xmlns:engagement="using:Microsoft.Azure.Engagement"

	b. Replace the **Page** in the XML tag name with **engagement:EngagementPage**.
	
> [AZURE.IMPORTANT] If your page overrides the `OnNavigatedTo` method, be sure to call `base.OnNavigatedTo(e)`. Otherwise,  the activity will not be reported (the `EngagementPage` calls `StartActivity` inside its `OnNavigatedTo` method). This is especially important in a Windows Phone project where the default template has an `OnNavigatedTo` method. 

##<a id="monitor"></a>Connect app with real-time monitoring

[AZURE.INCLUDE [Connect app with real-time monitoring](../../includes/mobile-engagement-connect-app-with-monitor.md)]

##<a id="integrate-push"></a>Enable push notifications and in-app messaging

Mobile Engagement allows you to interact and reach your users with push notifications and in-app messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections set up your app to receive them.

###Enable your app to receive WNS Push Notifications

1. In the `Package.appxmanifest` file, in the **Application** tab, under **Notifications**, select **Yes** for **Toast capable:**:

	![][5]

###Initialize the REACH SDK

1. In `App.xaml.cs`, call **EngagementReach.Instance.Init();** in the **OnLaunched** function right after the agent initialization:

		protected override void OnLaunched(LaunchActivatedEventArgs e)
		{
		   EngagementAgent.Instance.Init(e);
		   EngagementReach.Instance.Init(e);
		}

2. In `App.xaml.cs`, call **EngagementReach.Instance.Init(e);** in the **OnActivated** function right after the agent initialization:

		protected override void OnActivated(IActivatedEventArgs e)
		{
		   EngagementAgent.Instance.Init(e);
		   EngagementReach.Instance.Init(e);
		}

You're all set for sending a toast. Now we will verify that you have correctly carried out this basic integration.

###Grant access to Mobile Engagement to send notifications

1. You'll have to associate your app with a Windows Store App to obtain your **Package security identifier (SID)** and your **Secret Key** (Client Secret). You can create an app from the [Windows Store Dev Center] and then make sure to use **Associate App with Store** from Visual Studio.

2. Navigate to the **Settings** of your Mobile Engagement portal, and click the **Native Push** section on the left.

3. Click the **Edit** button to enter your **Package security identifier (SID)** and your **Secret Key** as shown below:

	![][6]

##<a id="send"></a>Send a notification to your app

[AZURE.INCLUDE [Create Windows Push campaign](../../includes/mobile-engagement-windows-push-campaign.md)]

You should now see a toast notification from your campaign on your device - the app should be closed to see this toast notification. If the app was running, ensure that you have it closed for a couple of minutes before activating the campaign to be able to receive toast notification. If you want to integrate in-app notification so that the notification shows up in the app when it is opened, see [Windows Universal Apps - Overlay integration].

<!-- URLs. -->
[Mobile Engagement Windows Universal SDK documentation]: ../mobile-engagement-windows-store-integrate-engagement/
[Mobile Engagement Windows Universal SDK]: http://go.microsoft.com/?linkid=9864592
[Windows Store Dev Center]: http://go.microsoft.com/fwlink/p/?linkid=266582&clcid=0x409
[Windows Universal Apps - Overlay integration]: ../mobile-engagement-windows-store-integrate-engagement-reach/#overlay-integration

<!-- Images. -->
[1]: ./media/mobile-engagement-windows-store-dotnet-get-started/UniversalAppCreation.png
[2]: ./media/mobile-engagement-windows-store-dotnet-get-started/manifest-capabilities.png
[3]: ./media/mobile-engagement-windows-store-dotnet-get-started/add-connection-info.png
[5]: ./media/mobile-engagement-windows-store-dotnet-get-started/manifest-toast.png
[6]: ./media/mobile-engagement-windows-store-dotnet-get-started/enter-credentials.png


