<properties
	pageTitle="Get started with Azure Mobile Engagement for Windows Phone Silverlight apps"
	description="Learn how to use Azure Mobile Engagement with analytics and push notifications for Windows Phone Silverlight apps."
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
	ms.topic="hero-article"
	ms.date="05/03/2016"
	ms.author="piyushjo" />

# Get started with Azure Mobile Engagement for Windows Phone Silverlight apps

[AZURE.INCLUDE [Hero tutorial switcher](../../includes/mobile-engagement-hero-tutorial-switcher.md)]

This topic shows you how to use Azure Mobile Engagement to understand your app usage and send push notifications to segmented users of a Windows Phone Silverlight application.
This tutorial demonstrates the simple broadcast scenario using Mobile Engagement. In it, you create a blank Windows Phone Silverlight app that collects basic data and receives push notifications using Microsoft Push Notification Service (MPNS).

> [AZURE.NOTE] If you are targeting Windows Phone 8.1 (non-Silverlight), refer to the [Windows Universal tutorial](mobile-engagement-windows-store-dotnet-get-started.md).

This tutorial requires the following:

+ Visual Studio 2013
+ [MicrosoftAzure.MobileEngagement] Nuget package

> [AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-engagement-windows-phone-get-started).

##<a id="setup-azme"></a>Setup Mobile Engagement for your Windows Phone app

[AZURE.INCLUDE [Create Mobile Engagement App in Portal](../../includes/mobile-engagement-create-app-in-portal.md)]

##<a id="connecting-app"></a>Connect your app to the Mobile Engagement backend

This tutorial presents a "basic integration", which is the minimal set required to collect data and send a push notification. The complete integration documentation can be found in the [Mobile Engagement Windows Phone SDK integration](mobile-engagement-windows-phone-sdk-overview.md)

We will create a basic app with Visual Studio to demonstrate the integration.

###Create a new Windows Phone Silverlight project

The following steps assume the use of Visual Studio 2015 though the steps are similar in earlier versions of Visual Studio. 

1. Start Visual Studio, and in the **Home** screen, select **New Project**.

2. In the pop-up, select **Windows 8** -> **Windows Phone** -> **Blank App (Windows Phone Silverlight)**. Fill in the app **Name** and **Solution name**, and then click **OK**.

    ![][1]

3. You can choose to target either **Windows Phone 8.0** or **Windows Phone 8.1**.

You have now created a new Windows Phone Silverlight app into which we will integrate the Azure Mobile Engagement SDK.

###Connect your app to the Mobile Engagement backend

1. Install the [MicrosoftAzure.MobileEngagement] nuget package in your project.

2. Open `WMAppManifest.xml` (under the Properties folder) and make sure the following are declared (add them if they are not) in the `<Capabilities />` tag:

		<Capability Name="ID_CAP_NETWORKING" />
		<Capability Name="ID_CAP_IDENTITY_DEVICE" />

    ![][2]

3. Now paste the connection string that you copied earlier for your Mobile Engagement app and paste it in the `Resources\EngagementConfiguration.xml` file, between the `<connectionString>` and `</connectionString>` tags:

    ![][3]

4. In the `App.xaml.cs` file:

	a. Add the `using` statement:

			using Microsoft.Azure.Engagement;

	b. Initialize the SDK in the `Application_Launching` method:

			private void Application_Launching(object sender, LaunchingEventArgs e)
			{
			  EngagementAgent.Instance.Init();
			}

	c. Insert the following in the `Application_Activated`:

			private void Application_Activated(object sender, ActivatedEventArgs e)
			{
			   EngagementAgent.Instance.OnActivated(e);
			}

##<a id="monitor"></a>Enable real-time monitoring

In order to start sending data and ensuring that the users are active, you must send at least one screen (Activity) to the Mobile Engagement backend.

1. In the MainPage.xaml.cs, add the `using` statement:

    	using Microsoft.Azure.Engagement;

2. Replace the base class of **MainPage**, which is before **PhoneApplicationPage**, with **EngagementPage**.

    	class MainPage : EngagementPage 
	
3. In your `MainPage.xml` file:

	a. Add to your namespaces declarations:

	   	 xmlns:engagement="clr-namespace:Microsoft.Azure.Engagement;assembly=Microsoft.Azure.Engagement.EngagementAgent.WP"

	b. Replace `phone:PhoneApplicationPage` in the XML tag name with `engagement:EngagementPage`.

##<a id="monitor"></a>Connect app with real-time monitoring

[AZURE.INCLUDE [Connect app with real-time monitoring](../../includes/mobile-engagement-connect-app-with-monitor.md)]

##<a id="integrate-push"></a>Enable push notifications and in-app messaging

Mobile Engagement allows you to interact and reach your users with Push Notifications and in-app Messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections set up your app to receive them.

###Enable your app to receive MPNS Push Notifications

Add new Capabilities to your `WMAppManifest.xml` file:

		ID_CAP_PUSH_NOTIFICATION
		ID_CAP_WEBBROWSERCOMPONENT

   ![][5]

###Initialize the REACH SDK

1. In `App.xaml.cs`, call `EngagementReach.Instance.Init();` in the **Application_Launching** function, right after the agent initialization:

		private void Application_Launching(object sender, LaunchingEventArgs e)
		{
		   EngagementAgent.Instance.Init();
		   EngagementReach.Instance.Init();
		}

2. In `App.xaml.cs`, call `EngagementReach.Instance.OnActivated(e);` in the **Application_Activated** function, right after the agent initialization:

		private void Application_Activated(object sender, ActivatedEventArgs e)
		{
		   EngagementAgent.Instance.OnActivated(e);
		   EngagementReach.Instance.OnActivated(e);
		}

You're all set. Now we will verify that you have correctly cried out this basic integration.

##<a id="send"></a>Send a notification to your app

[AZURE.INCLUDE [Create Windows Push campaign](../../includes/mobile-engagement-windows-push-campaign.md)]

You should now see a notification on your device which will show up as an in-app notification if the app is open otherwise as a toast notification like the following: 

![][6]

<!-- URLs. -->
[MicrosoftAzure.MobileEngagement]: http://go.microsoft.com/?linkid=9874664
[Mobile Engagement Windows Phone SDK documentation]: ../mobile-engagement-windows-phone-integrate-engagement/

<!-- Images. -->
[1]: ./media/mobile-engagement-windows-phone-get-started/project-properties.png
[2]: ./media/mobile-engagement-windows-phone-get-started/wmappmanifest-capabilities.png
[3]: ./media/mobile-engagement-windows-phone-get-started/add-connection-string.png
[5]: ./media/mobile-engagement-windows-phone-get-started/reach-capabilities.png
[6]: ./media/mobile-engagement-windows-phone-get-started/push-screenshot.png
