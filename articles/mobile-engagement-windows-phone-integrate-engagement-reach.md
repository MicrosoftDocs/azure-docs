<properties 
	pageTitle="Windows Phone Silverlight Reach SDK Integration" 
	description="How to Integrate Azure Mobile Engagement Reach with Windows Phone Silverlight Apps" 					
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-phone" 
	ms.devlang="C#" 
	ms.topic="article" 
	ms.date="04/07/2015" 
	ms.author="piyushjo" />

#Windows Phone Silverlight Reach SDK Integration

You must follow the integration procedure described in the [Windows Phone Silverlight Engagement SDK Integration](mobile-engagement-windows-phone-integrate-engagement.md) before following this guide.

##Embed the Engagement Reach SDK into your Windows Phone Silverlight project

You do not have anything to add. `EngagementReach` references and resources are already in your project.

> [AZURE.TIP]  You can customize images located in the `Resources` folder of your project, especially the brand icon (that default to the Engagement icon).

##Add the capabilities

The Engagement Reach SDK needs some additional capabilities.

Open your `WMAppManifest.xml` file and be sure that the following capabilities are declared:

-   `ID_CAP_PUSH_NOTIFICATION`
-   `ID_CAP_WEBBROWSERCOMPONENT`

The first one is used by the MPNS service to allow the display of toast notification. The second one is used to embed a browser task into the SDK.

Edit the `WMAppManifest.xml` file and add inside the `<Capabilities />` tag :

	<Capability Name="ID_CAP_PUSH_NOTIFICATION" />
	<Capability Name="ID_CAP_WEBBROWSERCOMPONENT" />

##Enable the Microsoft Push Notification Service

In order to use the **Microsoft Push Notification Service** (referred as MPNS) your `WMAppManifest.xml` file must have an `<App />` tag with a `Publisher` attribute set to the name of your project.

##Initialize the Engagement Reach SDK

### Engagement configuration

The Engagement configuration is centralized in the `Resources\EngagementConfiguration.xml` file of your project.

Edit this file to specify reach configuration :

-   *Optional*, indicate whether the native push (MPNS) is activated or not between `<enableNativePush>` and `</enableNativePush>` tags, (`true` by default).
-   *Optional*, indicate the name of the push channel between `<channelName>` and `</channelName>` tags, provide the same that your application may currently use or leave it empty.

If you want to specify it at runtime instead, you can call the following method before the Engagement agent initialization :

	/* Engagement configuration. */
	EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
	
	engagementConfiguration.Agent.ConnectionString = "Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}";
	
	engagementConfiguration.Reach.EnableNativePush = true;                  
	/* [Optional] whether the native push (MPNS) is activated or not. */
	
	engagementConfiguration.Reach.ChannelName = "YOUR_PUSH_CHANNEL_NAME";   
	/* [Optional] Provide the same channel name that your application may currently use. */
	
	/* Initialize Engagement agent with above configuration. */
	EngagementAgent.Instance.Init(engagementConfiguration);

> [AZURE.TIP] You can specify the name of the MPNS push channel of your application. By default, Engagement creates a name based on the appId. You have no need to specify the name yourself, except if you plan to use the push channel outside of Engagement.

### Engagement initialization

Modify the `App.xaml.cs`:

-   Add to your `using` statements :

		using Microsoft.Azure.Engagement;

-   Insert `EngagementReach.Instance.Init` just after `EngagementAgent.Instance.Init` in `Application_Launching` :

		private void Application_Launching(object sender, LaunchingEventArgs e)
		{
		   EngagementAgent.Instance.Init();
		   EngagementReach.Instance.Init();
		}

-   Insert `EngagementReach.Instance.OnActivated` in the `Application_Activated` method :

		private void Application_Activated(object sender, ActivatedEventArgs e)
		{
		   EngagementAgent.Instance.OnActivated(e);
		   EngagementReach.Instance.OnActivated(e);
		}

> [AZURE.IMPORTANT] The `EngagementReach.Instance.Init` runs in a dedicated thread. You do not have to do it yourself.

##App store submission considerations

Microsoft imposes some rules when using the push notifications:

From the Microsoft [Application Policies] documentation, section 2.9:

1) You must ask the user to accept to receive push notifications. Then, in your settings, add a way to disable the push notifications.

The EngagementReach object provides two methods to manage the opt-in/opt-out, `EnableNativePush()` and `DisableNativePush()`. You could, for example, create an option in the settings with a toggle to disable or enable MPNS.

You can also decide to deactivate MPNS through the Engagement configuration\<windows-phone-sdk-reach-configuration\>.

> 2.9.1) The application must first describe the notifications to be provided and **obtain the user’s express permission (opt-in)**, and **must provide a mechanism through which the user can opt out of receiving push notifications**. All notifications provided using the Microsoft Push Notification Service must be consistent with the description provided to the user and must comply with all applicable [Application Policies] [Content Policies] and [Additional Requirements for Specific Application Types].

2) You should not use too many push notifications. Engagement will handle notifications for you.

> 2.9.2) The application and its use of the Microsoft Push Notification Service must not excessively use network capacity or bandwidth of the Microsoft Push Notification Service, or otherwise unduly burden a Windows Phone or other Microsoft device or service with excessive push notifications, as determined by Microsoft in its reasonable discretion, and must not harm or interfere with any Microsoft networks or servers or any third party servers or networks connected to the Microsoft Push Notification Service.

3) Do not rely on MPNS to send criticals informations. Engagement uses MPNS, so this rule also applies for the campaigns created inside the Engagement front-end.

> 2.9.3) The Microsoft Push Notification Service may not be used to send notifications that are mission critical or otherwise could affect matters of life or death, including without limitation critical notifications related to a medical device or condition. MICROSOFT EXPRESSLY DISCLAIMS ANY WARRANTIES THAT THE USE OF THE MICROSOFT PUSH NOTIFICATION SERVICE OR DELIVERY OF MICROSOFT PUSH NOTIFICATION SERVICE NOTIFICATIONS WILL BE UNINTERRUPTED, ERROR FREE, OR OTHERWISE GUARANTEED TO OCCUR ON A REAL-TIME BASIS.

**We cannot guarantee that your application will pass the validation process if you do not respect these recommendations.**

##Handle datapush (optional)

If you want your application to be able to receive Reach data pushes, you have to implement two events of the EngagementReach class:

	EngagementReach.Instance.DataPushStringReceived += (body) =>
	{
	   Debug.WriteLine("String data push message received: " + body);
	   return true;
	};
	
	EngagementReach.Instance.DataPushBase64Received += (decodedBody, encodedBody) =>
	{
	   Debug.WriteLine("Base64 data push message received: " + encodedBody);
	   // Do something useful with decodedBody like updating an image view
	   return true;
	};

You can see that the callback of each method returns a boolean. Engagement sends a feedback to its back-end after dispatching the data push. If the callback returns false, the `exit` feedback will be send. Otherwise, it will be `action`. If no callback is set for the events, the `drop` feedback will be returned to Engagement.

> [AZURE.WARNING] Engagement is not able to receive multiples feedbacks for a data push. If you plan to set several handlers on an event, be aware that the feedback will correspond to the last one sent. In this case, we recommend to always returns the same value to avoid having confusing feedback on the front-end.

##Customize UI (optional)

### First step

We allow you to customize the reach UI.

To do so, you have to create a subclass of the `EngagementReachHandler` class.

**Sample Code :**

	using Microsoft.Azure.Engagement;
	
	namespace Example
	{
	   internal class ExampleReachHandler : EngagementReachHandler
	   {
	      // Override EngagementReachHandler methods depending on your needs
	   }
	}

Then, set the content of the `EngagementReach.Instance.Handler` field with your custom object in your `App.xaml.cs` class within the `Application_Launching` method.

**Sample Code :**

	private void Application_Launching(object sender, LaunchingEventArgs e)
	{
	   // your app initialization 
	   EngagementReach.Instance.Handler = new ExampleReachHandler();
	   // Engagement Agent and Reach initialization
	}

> [AZURE.NOTE] By default, Engagement uses its own implementation of `EngagementReachHandler`. You don't have to create your own, and if you do so, you don't have to override every method. The default behavior is to select the Engagement base object.

### Layouts

By default, Reach will use the embedded resources of the DLL to display the notifications and pages.

However, you can decide to use your own resources to reflect your brand in these components.

You can override `EngagementReachHandler` methods in your subclass to tell Engagement to use your layouts :

**Sample Code :**

	// In your subclass of EngagementReachHandler
	
	public override string GetTextViewAnnouncementUri()
	{
	   // return the path of your own xaml
	}
	
	public override string GetWebViewAnnouncementUri()
	{
	   // return the path of your own xaml
	}
	
	public override string GetPollUri()
	{
	   // return the path of your own xaml
	}
	
	public override EngagementNotificationView CreateNotification(EngagementNotificationViewModel viewModel)
	{
	   // return a new instance of your own notification
	}

> [AZURE.TIP] The `CreateNotification` method can return null. The notification won't be displayed and the reach campaign will be dropped.

To simplify your layout implementation, we also provide our own xaml which can serve as a basis for your code. They are located in the Engagement SDK archive (/src/reach/).

> [AZURE.WARNING] The sources that we provide are the exact same ones that we use. So if you want to modify them directly, don't forget to change the namespace and the name.

### Notification position

By default, an in-app notification is displayed at the bottom left side of the application. You can change this behavior by overriding the `GetNotificationPosition` method of the `EngagementReachHandler` object.

	// In your subclass of EngagementReachHandler
	
	public override EngagementReachHandler.NotificationPosition GetNotificationPosition(EngagementNotificationViewModel viewModel)
	{
	   // return a value of the EngagementReachHandler.NotificationPosition enum (TOP or BOTTOM)
	}

Currently, you can choose between the `BOTTOM` (default) and `TOP` positions.

### Launch message

When a user clicks on a system notification (a toast), Engagement launches the app, load the content of the push messages, and display the page for the corresponding campaign.

There is a delay between the launch of the application and the display of the page (depending on the speed of your network).

To indicate to the user that something is loading, you should provide a visual information, like a progress bar or a progress indicator. Engagement cannot handle that itself, but provides a few handlers for you.

To implement the callback, do:

	/* The application has launched and the content is loading.
	 * You should display an indicator here.
	 */
	EngagementReach.Instance.RetrieveLaunchMessageStarted += () => { [...] };
	
	/* The application has finished loading the content and the page
	 * is about to be displayed.
	 * You should hide the indicator here.
	 */
	EngagementReach.Instance.RetrieveLaunchMessageCompleted += () => { [...] };
	
	/* The content has been loaded, but an error has occurred.
	 * You can provide an information to the user.
	 * You should hide the indicator here.
	 */
	EngagementReach.Instance.RetrieveLaunchMessageFailed += () => { [...] };

You can set the callback in your `Application_Launching` method of your `App.xaml.cs` file, preferably before the `EngagementReach.Instance.Init()` call.

> [AZURE.TIP] Each handler is called by the UI Thread. You do not have to worry when using a MessageBox or something UI-related.

[Application Policies]:http://msdn.microsoft.com/library/windows/apps/hh184841(v=vs.105).aspx
[Content Policies]:http://msdn.microsoft.com/library/windows/apps/hh184842(v=vs.105).aspx
[Additional Requirements for Specific Application Types]:http://msdn.microsoft.com/library/windows/apps/hh184838(v=vs.105).aspx
