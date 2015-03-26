<properties 
	pageTitle="Get Started with Azure Mobile Engagement" 
	description="Learn how to use Azure Mobile Engagement with Analytics and Push Notifications."
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="kpiteira" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/11/2015" 
	ms.author="kapiteir" />
	
# Get started with Mobile Engagement

<div class="dev-center-tutorial-selector sublanding"><a href="/documentation/articles/mobile-engagement-windows-store-dotnet-get-started/" title="Windows Store"  class="current">Windows Store</a><a href="/documentation/articles/mobile-engagement-windows-phone-get-started/" title="Windows Phone">Windows Phone</a><a href="/documentation/articles/mobile-engagement-ios-get-started/" title="iOS">iOS</a><a href="/documentation/articles/mobile-engagement-android-get-started/" title="Android">Android</a></div>

This topic shows you how to use Azure Mobile Engagement to understand your app usage and send push notifications to segmented users of a Windows Store application. 
This tutorial demonstrates the simple broadcast scenario using Mobile Engagement. In it, you create a blank Windows Store app that collects basic data and receives push notifications using Windows Notification Service (WNS). When complete, you will be able to broadcast push notifications to all the devices or target specific users based on their devices properties. Be sure to follow along with the next tutorial to see how to use Mobile Engagement to address specific users and groups of devices.


This tutorial requires the following:

+ Visual Studio 2013
+ The [Mobile Engagement Windows Store SDK]

> [AZURE.IMPORTANT] Completing this tutorial is a prerequisite for all other Mobile Engagement tutorials for Windows Store apps, and to complete it, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

##<a id="setup-azme"></a>Setup Mobile Engagement for your app

1. Log on to the Azure Management Portal, and then click **+NEW** at the bottom of the screen.

2. Click on **App Services**, then **Mobile Engagement**, then **Create**.

   	![][7]

3. In the popup that appears, enter the following information:
 
   	![][8]

	1. **Application Name**: you can type the name of your application. Feel free to use any character.
	2. **Platform**: Select the target platform for that app (if your app targets multiple platforms, repeat this tutorial for each platform).
	3. **Application Resource Name**: This is the name by which this application will be accessible via APIs and URLs. We advise that you use only conventional URL characters: the auto generated name should provide you a strong basis. We also advise appending the platform name to avoid any name clash as this name must be unique
	4. **Location**: Select the data center where this app (and more importantly its Collection - see below) will be hosted.
	5. **Collection**: If you have already created an application, select a previously created Collection, otherwise select New Collection.
	6. **Collection Name**: This represents your group of applications. It will also ensure all your apps are in a group that will allow aggregated calculations. We strongly advise that you use your company name or department.


	When you're done, click the check button to finish the creation of your app.

4. Now click/select the app you just created in the **Application** tab.
 
   	![][9]

5. Then click on **Connection Info** in order to display the connection settings to put into your SDK integration.
 
   	![][10]

6. Finally, write down the **Connection String**, which is what you will need to identify this app from your Application code.

   	![][11]

	>[AZURE.TIP] You may use the "copy" icon on the right of the Connection String to copy it to the clipboard as a convenience.

##<a id="connecting-app"></a>Connecting your app to the Mobile Engagement backend

This tutorial presents a "basic integration" which is the minimal set required to collect data and send a push notification. The complete integration documentation can be found in the [Mobile Engagement Windows Store SDK documentation].

We will create a basic app with Visual Studio to demonstrate the integration.

###Create a new Windows Store project

You may skip this step if you already have an app and are familiar with Windows development.

1. Launch Visual Studio, and in the home screen, select **New Project...**.

   	![][12]

2. In the popup, (1) select `Windows Store`, then (2) select `Blank App (XAML)`. Also (3) Fill in the app `Name` and (4) `Solution name` then click **OK**.

   	![][13]

Your project is now created with the demo app to which we will integrate Mobile Engagement.

###Include the SDK library in your project

Download and integrate the SDK library

1. Download the [Mobile Engagement Windows Store SDK].
2. Extract the .zip file to a folder in your computer.
3. Go to `PROJECT` then `Manage NuGet Packages...`
4. In the popup, click Settings
5. Then hit the `+` button to create a new source

	![][17]

6. Click the `...` button at the bottom to select the source and navigate to the lib folder of the extracted SDK download (see step 2) then hit `Select`

	![][18]

7. The SDK will be added as a source. Just click `OK`. Then select the package in your "online" package list and click Install

	![][19]


###Connect your app to Mobile Engagement backend with the Connection String

1. Open `Package.appxmanifest` and make sure the following are declared (add them if not):
		
		Internet (Client)

	![][20]

2. In that same file, open the `Declarations` tab:
	1. in `Available Declarations`, add `File Type Associations`
	2. Then in the `Properties` part on the right set `Name` to `engagement_log_file`
	3. Still in the `Properties` part on the right set `File type` to `.set`
	4. Finally in `Available Declarations`, add `Cached File Updater`

		![][21]
 
3. Go back to the Azure portal in your app's **Connection Info** page and copy the **Connection String**.

	![][11]

4. Paste it in the `Resources\EngagementConfiguration.xml` file, between the `<connectionString>` and `</connectionString>` tags:

	![][22]

5. In the `App.xaml.cs` file:
	1. Add the `using` statement

			using Microsoft.Azure.Engagement;

	2. Initialize the SDK in the `OnLaunched` method:
			
			protected override void OnLaunched(LaunchActivatedEventArgs args)
			{
			  EngagementAgent.Instance.Init(args);
			
			  //... rest of the code
			}

	3. Insert the following in the `Application_Activated` (you will have to add this operation if it is not present already)

			protected override void OnActivated(IActivatedEventArgs args)
			{
			  EngagementAgent.Instance.Init(args);
			
			  //... rest of the code
			}

###Send a Screen to Mobile Engagement

In order to start sending data and ensuring the users are active, you must send at least one screen (Activity) to the Mobile Engagement backend. We will achieve this by subclassing our `MainPage` with the `EngagementPage` the Mobile Engagement SDK provides.

1. In order to do that, replace the super class of `MainPage`, which is before `Page`, with EngagementPage, as shown below:

	![][23]

	>[AZURE.NOTE] Don't forget to resolve the class if it appears underlined in red by adding `using Microsoft.Azure.Engagement;` to the `using` clauses.

2. In your `MainPage.xaml` file:
	1. Add to your namespaces declarations:

			xmlns:engagement="using:Microsoft.Azure.Engagement"
	2. Replace the `Page` in the xml tag name with `engagement:EngagementPage`

##<a id="monitor"></a>How to check that your app is connected with realtime monitoring

This section shows you how to make sure your app connects to the Mobile Engagement backend by using Mobile Engagement's realtime monitoring feature.

1. Navigate to your Mobile Engagement portal.

	From your Azure portal, ensure you're in the app we're using for this project and then click on the **Engage** button at the bottom.

	![][26]

2. You will land in the settings page of your Engagement Portal for your app. From there, click on the **Monitor** tab as shown below.
![][30]

3. The monitor is ready to show you any device, in realtime, that will launch your app.
![][31]

4. Back in Visual Studio, launch your app either in the emulator or in a connected device by clicking the green triangle and then selecting your device.

5. If it worked, you should now see one session in the monitor! 
![][33]

**Congratulations!** You succeeded in completing the first step of this tutorial with an app that connects to the Mobile Engagement back-end, which is already sending data.


##<a id="integrate-push"></a>Enabling Push Notifications

Mobile Engagement allows you to interact and REACH with your users with Push Notifications and In-app Messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections will setup your app to receive them.

###Enable your app to receive WNS Push Notifications

1. Add a new `File Type Association` to your `Package.appxmanifest` file in the Declarations panel:

		Name: engagement_reach_content
		File type: .txt

	![][34]

2. Still in the `Package.appxmanifest` file, in the `Application` tab, under `Notifications`, select `Yes` for `Toast capable:`:

	![][35]

###Initialize the REACH SDK

1. In `App.xaml.cs`, call `EngagementReach.Instance.Init(args);` in the `OnLaunched` function right after the agent initialization:

		protected override void OnLaunched(LaunchActivatedEventArgs args)
		{
		   EngagementAgent.Instance.Init(args);
		   EngagementReach.Instance.Init(args);
		}

2. In `App.xaml.cs`, call `EngagementReach.Instance.OnActivated(args);` in the `Application_Activated` function right after the agent initialization:

		protected override void OnActivated(IActivatedEventArgs args)
		{
		   EngagementAgent.Instance.Init(args);
		   EngagementReach.Instance.Init(args);
		}

3. Run the application. 
You're all set for sending a Toast, now we will verify that you have correctly done this basic integration.

###Grant Access to Mobile Engagement to send Notifications

1. You'll then have to associate your app with the Windows Store to obtain your `Package security identifier (SID)` and your `Secret Key` (*Client Secret*).

2. Then Navigate to the Settings of your Mobile Engagement Portal, and click `Native Push` section on the left

3. Click the `Edit` button to enter your `Package security identifier (SID)` and your `Secret Key` as shown below:

	![][36]

##<a id="send"></a>How to send a notification to your app

We will now create a simple Push Notification campaign that will send a push notification to our app.

1. Navigate to the **REACH** tab in your Mobile Engagement portal.
2. Click **New announcement** to create your push campaign.
![][37]

3. Setup the first field of your campaign through the following steps:
![][38]

	1. Name your campaign with any name you wish.
	2. Select **Delivery time** as *Any time* to allow the app to receive a notification whether the app is launched or not.
	3. In the notification text, type the Title which will be in bold in the push.
	4. Then type your message.

4. Scroll down, and in the content section select **Notification only**.
![][39]

5. You're done setting the most basic campaign possible, now scroll down again and create your campaign to save it!
![][40]

6. Last step, Activate your campaign.
![][41]

You should see a notification on your device, **Congratulations!**:



<!-- URLs. -->
[Mobile Engagement Windows Store SDK documentation]: mobile-engagement-windows-store-integrate-engagement.md
[Mobile Engagement Windows Store SDK]: http://go.microsoft.com/?linkid=9864592

<!-- Images. -->
[7]: ./media/mobile-engagement-windows-store-get-started/create-mobile-engagement-app.png
[8]: ./media/mobile-engagement-windows-store-get-started/aux-create-app.png
[9]: ./media/mobile-engagement-windows-store-get-started/aux-select-app.png
[10]: ./media/mobile-engagement-windows-store-get-started/app-main-page-select-connection-info.png
[11]: ./media/mobile-engagement-windows-store-get-started/app-connection-info-page.png
[12]: ./media/mobile-engagement-windows-phone-get-started/new-project.png
[13]: ./media/mobile-engagement-windows-store-get-started/project-properties.png
[17]: ./media/mobile-engagement-windows-phone-get-started/manage-nuget-settings-new-source.png
[18]: ./media/mobile-engagement-windows-store-get-started/manage-nuget-settings-new-source-add-lib.png
[19]: ./media/mobile-engagement-windows-store-get-started/manage-nuget-settings-new-source-added.png
[20]: ./media/mobile-engagement-windows-store-get-started/manifest-capabilities.png
[21]: ./media/mobile-engagement-windows-store-get-started/manifest-declarations.png
[22]: ./media/mobile-engagement-windows-store-get-started/add-connection-info.png
[23]: ./media/mobile-engagement-windows-store-get-started/subclass-page.png
[26]: ./media/mobile-engagement-windows-store-get-started/engage-button.png
[27]: ./media/mobile-engagement-windows-store-get-started/engagement-portal.png

[28]: ./media/mobile-engagement-windows-store-get-started/native-push-settings.png
[29]: ./media/mobile-engagement-windows-store-get-started/api-key.png
[30]: ./media/mobile-engagement-windows-store-get-started/clic-monitor-tab.png
[31]: ./media/mobile-engagement-windows-store-get-started/monitor.png
[32]: ./media/mobile-engagement-windows-store-get-started/launch.png
[33]: ./media/mobile-engagement-windows-phone-get-started/monitor.png
[34]: ./media/mobile-engagement-windows-store-get-started/manifest-declarations-reach.png
[35]: ./media/mobile-engagement-windows-store-get-started/manifest-toast.png
[36]: ./media/mobile-engagement-windows-store-get-started/enter-credentials.png
[37]: ./media/mobile-engagement-windows-store-get-started/new-announcement.png
[38]: ./media/mobile-engagement-windows-phone-get-started/campaign-first-params.png
[39]: ./media/mobile-engagement-windows-store-get-started/campaign-content.png
[40]: ./media/mobile-engagement-windows-store-get-started/campaign-create.png
[41]: ./media/mobile-engagement-windows-store-get-started/campaign-activate.png
