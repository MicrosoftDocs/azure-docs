<properties 
	pageTitle="Windows Phone Silverlight Engagement SDK Integration" 
	description="How to Integrate Azure Mobile Engagement with Windows Phone Silverlight Apps" 					
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-phone" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="05/03/2016" 
	ms.author="piyushjo" />

#Windows Phone Silverlight Engagement SDK Integration

> [AZURE.SELECTOR] 
- [Windows Universal](mobile-engagement-windows-store-integrate-engagement.md) 
- [Windows Phone Silverlight](mobile-engagement-windows-phone-integrate-engagement.md) 
- [iOS](mobile-engagement-ios-integrate-engagement.md) 
- [Android](mobile-engagement-android-integrate-engagement.md) 

This procedure describes the simplest way to activate Azure Mobile Engagement's Analytics and Monitoring functions in your Windows Phone Silverlight application.

The following steps are enough to activate the report of logs needed to compute all statistics regarding Users, Sessions, Activities, Crashes and Technicals. The report of logs needed to compute other statistics like Events, Errors and Jobs must be done manually using the Engagement API (see [How to use the advanced Mobile Engagement tagging API in your Windows Phone Silverlight app](mobile-engagement-windows-phone-use-engagement-api.md) below) since these statistics are application dependent.

##Supported versions

The Mobile Engagement SDK for Windows Silverlight can only be integrated into applications targeting :

-   Windows Phone 8.0
-   Windows Phone 8.1 Silverlight

> [AZURE.NOTE] If you are targeting Windows Phone 8.1 (non-Silverlight) then refer to the [Windows Universal integration procedure](mobile-engagement-windows-store-integrate-engagement.md).

##Install the Mobile Engagement Silverlight SDK

The Mobile Engagement SDK for Windows Silverlight is available as a Nuget package called *MicrosoftAzure.MobileEngagement*. You can install it from the Visual Studio Nuget Package Manager. 

##Add the capabilities

The Engagement SDK needs some capabilities of the Windows Phone Silverlight SDK in order to work properly.

Open your `WMAppManifest.xml` file and be sure that the following capabilities are declared in the `Capabilities` panel:

-   `ID_CAP_NETWORKING`
-   `ID_CAP_IDENTITY_DEVICE`

##Initialize the Engagement SDK

### Engagement configuration

The Engagement configuration is centralized in the `Resources\EngagementConfiguration.xml` file of your project.

Edit this file to specify :

-   Your application connection string between tags `<connectionString>` and `<\connectionString>`.

If you want to specify it at runtime instead, you can call the following method before the Engagement agent initialization:

	/* Engagement configuration. */
	EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
	engagementConfiguration.Agent.ConnectionString = "Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}";

	/* Initialize Engagement agent with above configuration. */
	EngagementAgent.Instance.Init(engagementConfiguration);

The connection string for your application is displayed on the Azure Classic Portal.

### Engagement initialization

When you create a new project, a `App.xaml.cs` file is generated. This class inherits from `Application` and contains many important methods. It will also be used to initialize the Engagement SDK.

Modify the `App.xaml.cs`:

-   Add to your `using` statements :

		using Microsoft.Azure.Engagement;

-   Insert `EngagementAgent.Instance.Init` in the `Application_Launching` method :

		private void Application_Launching(object sender, LaunchingEventArgs e)
		{
		  EngagementAgent.Instance.Init();
		}

-   Insert `EngagementAgent.Instance.OnActivated` in the `Application_Activated` method :

		private void Application_Activated(object sender, ActivatedEventArgs e)
		{
		   EngagementAgent.Instance.OnActivated(e);
		}

> [AZURE.WARNING] We strongly discourage you to add the Engagement initialization in another place of your application. However, be aware that the `EngagementAgent.Instance.Init` method runs on a dedicated thread, and not on the UI thread.

##Basic reporting

### Recommended method : overload your `PhoneApplicationPage` classes

In order to activate the report of all the logs required by Engagement to compute Users, Sessions, Activities, Crashes and Technical statistics, you can simply make all your `PhoneApplicationPage` sub-classes inherit from the `EngagementPage` classes.

Here is an example of how to do this for a page of your application. You can do the same thing for all pages of your application.

#### C# Source file

Modify your page `.xaml.cs` file :

-   Add to your `using` statements :

		using Microsoft.Azure.Engagement;

-   Replace `PhoneApplicationPage` with `EngagementPage` :

**Without Engagement:**

		namespace Example
		{
		  public partial class ExamplePage : PhoneApplicationPage
		  {
		    [...]
		  }
		}

**With Engagement:**

		using Microsoft.Azure.Engagement;
		
		namespace Example
		{
		  public partial class ExamplePage : EngagementPage 
		  {
		    [...]
		  }
		}

> [AZURE.WARNING] If your page inherits from the `OnNavigatedTo` method, be careful to let the `base.OnNavigatedTo(e)` call. Otherwise, the activity will not be reported. Indeed, the `EngagementPage` is calling `StartActivity` inside the `OnNavigatedTo` method.

#### XAML file

Modify your page `.xaml` file :

-   Add to your namespaces declarations :

		xmlns:engagement="clr-namespace:Microsoft.Azure.Engagement;assembly=Microsoft.Azure.Engagement.EngagementAgent.WP"

-   Replace `phone:PhoneApplicationPage` with `engagement:EngagementPage` :

**Without Engagement:**

		<phone:PhoneApplicationPage>
		    <!-- layout -->
		</phone:PhoneApplicationPage>

**With Engagement:**

		<engagement:EngagementPage 
		    xmlns:engagement="clr-namespace:Microsoft.Azure.Engagement;assembly=Microsoft.Azure.Engagement.EngagementAgent.WP">
		
		    <!-- layout -->
		</engagement:EngagementPage >

#### Override the default behavior

By default, the class name of the page is reported as the activity name, with no extra. If the class uses the "Page" suffix, Engagement will also remove it.

If you want to override the default behavior for the name, simply add this to your code:

		// in the .xaml.cs file
		protected override string GetEngagementPageName()
		{
		   /* your code */
		   return "new name";
		}

If you want to report some extra information with your activity, you can add this to your code:

		// in the .xaml.cs file
		protected override Dictionary<object,object> GetEngagementPageExtra()
		{
		   /* your code */
		   return extra;
		}

These methods are called from within the `OnNavigatedTo` method of your page.

### Alternate method: call `StartActivity()` manually

If you cannot or do not want to overload your `PhoneApplicationPage` classes, you can instead start your activities by calling `EngagementAgent` methods directly.

We recommend to call `StartActivity` inside your `OnNavigatedTo` method of your PhoneApplicationPage.

		protected override void OnNavigatedTo(NavigationEventArgs e)
		{
		   base.OnNavigatedTo(e);
		   EngagementAgent.Instance.StartActivity("MyPage");
		}

> [AZURE.IMPORTANT] Ensure you end your session correctly.
>
> The SDK automatically calls the `EndActivity` method when the application is closed. Thus, it is **HIGHLY** recommended to call the `StartActivity` method whenever the activity of the user change, and to **NEVER** call the `EndActivity` method. This method sends a message to the Engagement server that the current user has left the application and this impacts all application logs.

##Advanced reporting

Optionally, you may want to report application specific events, errors and jobs, to do so, use the others methods found in the `EngagementAgent` class. The Engagement API allows to use all of Engagement's advanced capabilities.

For further information, see [How to use the advanced Mobile Engagement tagging API in your Windows Phone Silverlight app](mobile-engagement-windows-phone-use-engagement-api.md).

##Advanced configuration

### Disable automatic crash reporting

You can disable the automatic crash reporting feature of Engagement. Then, when an unhandled exception will occur, Engagement won't do anything.

> [AZURE.WARNING] If you plan to disable this feature, be aware that when a unhandled crash will occur in your app, Engagement will not send the crash **AND** it will not close the session and jobs.

To disable automatic crash reporting, just customize your configuration depending on the way you declared it :

#### From `EngagementConfiguration.xml` file

Set report crash to `false` between `<reportCrash>` and `</reportCrash>` tags.

#### From `EngagementConfiguration` object at run time

Set report crash to false using your EngagementConfiguration object.

		/* Engagement configuration. */

		EngagementConfiguration engagementConfiguration = new EngagementConfiguration(); engagementConfiguration.Agent.ConnectionString = "Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}";
		/\* Disable Engagement crash reporting. \*/ engagementConfiguration.Agent.ReportCrash = false;

### Burst mode

By default, the Engagement service reports logs in real time. If your application reports logs very frequently, it is better to buffer the logs and to report them all at once on a regular time base (this is called the “burst mode”).

To do so, call the method:

		EngagementAgent.Instance.SetBurstThreshold(int everyMs);

The argument is a value in **milliseconds**. At any time, if you want to reactivate the real-time logging, just call the method without any parameter, or with the 0 value.

The burst mode slightly increase the battery life but has an impact on the Engagement Monitor: all sessions and jobs duration will be rounded to the burst threshold (thus, sessions and jobs shorter than the burst threshold may not be visible). It is recommended to use a burst threshold no longer than 30000 (30s). You have to be aware that saved logs are limited to 300 items. If sending is too long you can lose some logs.

> [AZURE.WARNING] The burst threshold cannot be configured to a period lesser than one second. If you try to do so, the SDK will show a trace with the error and will automatically reset to the default value, that is, zero seconds. This will trigger the SDK to report the logs in real-time.
 
