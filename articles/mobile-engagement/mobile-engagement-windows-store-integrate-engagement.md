<properties 
	pageTitle="Windows Universal Apps Engagement SDK Integration" 
	description="How to Integrate Azure Mobile Engagement with Windows Universal Apps" 					
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
	ms.date="05/03/2016" 
	ms.author="piyushjo" />

# Windows Universal Apps Engagement SDK Integration

> [AZURE.SELECTOR] 
- [Universal Windows](mobile-engagement-windows-store-integrate-engagement.md) 
- [Windows Phone Silverlight](mobile-engagement-windows-phone-integrate-engagement.md) 
- [iOS](mobile-engagement-ios-integrate-engagement.md) 
- [Android](mobile-engagement-android-integrate-engagement.md) 

This procedure describes the simplest way to activate Engagement's Analytics and Monitoring functions in your Windows Universal application.

The following steps are enough to activate the report of logs needed to compute all statistics regarding Users, Sessions, Activities, Crashes and Technicals. The report of logs needed to compute other statistics like Events, Errors and Jobs must be done manually using the Engagement API (see [How to use the advanced Mobile Engagement tagging API in your Windows Universal app](mobile-engagement-windows-store-use-engagement-api.md) since these statistics are application dependent.

## Supported versions

The Mobile Engagement SDK for Windows Universal Apps can only be integrated into Windows Runtime and Universal Windows Platform applications targeting :

-   Windows 8
-   Windows 8.1
-   Windows Phone 8.1
-   Windows 10 (desktop and mobile families)

> [AZURE.NOTE] If you are targeting Windows Phone Silverlight then refer to the [Windows Phone Silverlight integration procedure](mobile-engagement-windows-phone-integrate-engagement.md).

## Install the Mobile Engagement Universal Apps SDK

### All platforms

The Mobile Engagement SDK for Windows Universal App is available as a Nuget package called *MicrosoftAzure.MobileEngagement*. You can install it from the Visual Studio Nuget Package Manager.

### Windows 8.x and Windows Phone 8.1

NuGet automatically deploys the SDK resources in the `Resources` folder at the root of your application project.

### Windows 10 Universal Windows Platform applications

NuGet does not automatically deploy the SDK resources in your UWP application yet. You have to do it manually until resources deployment is reintroduced in NuGet:

1.  Open your File Explorer.
2.  Navigate to the following location (**x.x.x** is the version of Engagement you are installing):
*%USERPROFILE%\\.nuget\packages\MicrosoftAzure.MobileEngagement\\**x.x.x**\\content\win81*
3.  Drag and drop the **Resources** folder from the file explorer to the root of your project in Visual Studio.
4.  In Visual Studio select your project and activate the **Show All files** icon on top of the **Solution Explorer**.
5.  Some files are not included in the project. To import them at once right click on the **Resources** folder, **Exclude from project** then another right click on the **Resources** folder, **Include in project** to re-include the whole folder. All files from the **Resources** folder are now included in your project.

## Add the capabilities

The Engagement SDK needs some capabilities of the Windows SDK in order to work properly.

Open your `Package.appxmanifest` file and be sure that the following capabilities are declared:

-   `Internet (Client)`

## Initialize the Engagement SDK

### Engagement configuration

The Engagement configuration is centralized in the `Resources\EngagementConfiguration.xml` file of your project.

Edit this file to specify:

-   Your application connection string between tags `<connectionString>` and `<\connectionString>`.

If you want to specify it at runtime instead, you can call the following method before the Engagement agent initialization:
          
          /* Engagement configuration. */
          EngagementConfiguration engagementConfiguration = new EngagementConfiguration();

          /* Set the Engagement connection string. */
          engagementConfiguration.Agent.ConnectionString = "Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}";

          /* Initialize Engagement angent with above configuration. */
          EngagementAgent.Instance.Init(e, engagementConfiguration);

The connection string for your application is displayed on the Azure Classic Portal.

### Engagement initialization

When you create a new project, a `App.xaml.cs` file is generated. This class inherits from `Application` and contains many important methods. It will also be used to initialize the Engagement SDK.

Modify the `App.xaml.cs`:

-   Add to your `using` statements:

		using Microsoft.Azure.Engagement;

-   Define a method to share the Engagement initialization once for all calls:

        private void InitEngagement(IActivatedEventArgs e)
        {
          EngagementAgent.Instance.Init(e);
		
		  // or
		
		  EngagementAgent.Instance.Init(e, engagementConfiguration);
        }
        
-   Call `InitEngagement` in the `OnLaunched` method:

		protected override void OnLaunched(LaunchActivatedEventArgs e)
		{
          InitEngagement(e);
		}

-   When your application is launched using a custom scheme, another application or the command line then the `OnActivated` method is called. You also need to initiate the Engagement SDK when your app is activated. To do so, override `OnActivated` method:

		protected override void OnActivated(IActivatedEventArgs args)
		{
          InitEngagement(args);
		}

> [AZURE.IMPORTANT] We strongly discourage you to add the Engagement initialization in another place of your application.

## Basic reporting

### Recommended method: overload your `Page` classes

In order to activate the report of all the logs required by Engagement to compute Users, Sessions, Activities, Crashes and Technical statistics, you can simply make all your `Page` sub-classes inherit from the `EngagementPage` classes.

Here is an example of how to do this for a page of your application. You can do the same thing for all pages of your application.

#### C# Source file

Modify your page `.xaml.cs` file:

-   Add to your `using` statements:

		using Microsoft.Azure.Engagement;

-   Replace `Page` with `EngagementPage`:

**Without Engagement:**
	
		namespace Example
		{
		  public sealed partial class ExamplePage : Page
		  {
		    [...]
		  }
		}

**With Engagement:**

		using Microsoft.Azure.Engagement;
		
		namespace Example
		{
		  public sealed partial class ExamplePage : EngagementPage 
		  {
		    [...]
		  }
		}

> [AZURE.IMPORTANT] If your page overrides the `OnNavigatedTo` method, be sure to call `base.OnNavigatedTo(e)`. Otherwise,  the activity will not be reported (the `EngagementPage` calls `StartActivity` inside its `OnNavigatedTo` method).

#### XAML file

Modify your page `.xaml` file:

-   Add to your namespaces declarations:

		xmlns:engagement="using:Microsoft.Azure.Engagement"

-   Replace `Page` with `engagement:EngagementPage`:

**Without Engagement:**

		<Page>
		    <!-- layout -->
		    ...
		</Page>

**With Engagement:**

		<engagement:EngagementPage 
		    xmlns:engagement="using:Microsoft.Azure.Engagement">
		    <!-- layout -->
		    ...
		</engagement:EngagementPage >

#### Override the default behaviour

By default, the class name of the page is reported as the activity name, with no extra. If the class uses the "Page" suffix, Engagement will also remove it.

If you want to override the default behaviour for the name, simply add this to your code:

		// in the .xaml.cs file
		protected override string GetEngagementPageName()
		{
		  /* your code */
		  return "new name";
		}

If you want to report some extra informations with your activity, you can add this to your code:

		// in the .xaml.cs file
		protected override Dictionary<object,object> GetEngagementPageExtra()
		{
		  /* your code */
		  return extra;
		}

These methods are called from within the `OnNavigatedTo` method of your page.

### Alternate method: call `StartActivity()` manually

If you cannot or do not want to overload your `Page` classes, you can instead start your activities by calling `EngagementAgent` methods directly.

We recommend to call `StartActivity` inside your `OnNavigatedTo` method of your Page.

			protected override void OnNavigatedTo(NavigationEventArgs e)
			{
			  base.OnNavigatedTo(e);
			  EngagementAgent.Instance.StartActivity("MyPage");
			}

> [AZURE.IMPORTANT]  Ensure you end your session correctly.
> 
> The Windows Universal SDK automatically calls the `EndActivity` method when the application is closed. Thus, it is **HIGHLY** recommended to call the `StartActivity` method whenever the activity of the user change, and to **NEVER** call the `EndActivity` method, this method sends to Engagement server that current user has leave the application, this will impacts all application logs.

## Advanced reporting

Optionally, you may want to report application specific events, errors and jobs, to do so, use the others methods found in the `EngagementAgent` class. The Engagement API allows to use all of Engagement's advanced capabilities.

For further information, see [How to use the advanced Mobile Engagement tagging API in your Windows Universal app](mobile-engagement-windows-store-use-engagement-api.md).

##Advanced configuration

### Disable automatic crash reporting

You can disable the automatic crash reporting feature of Engagement. Then, when an unhandled exception will occur, Engagement won't do anything.

> [AZURE.WARNING] If you plan to disable this feature, be aware that when a unhandled crash will occur in your app, Engagement will not send the crash **AND** will not close the session and jobs.

To disable automatic crash reporting, just customize your configuration depending on the way you declared it:

#### From `EngagementConfiguration.xml` file

Set report crash to `false` between `<reportCrash>` and `</reportCrash>` tags.

#### From `EngagementConfiguration` object at run time

Set report crash to false using your EngagementConfiguration object.

		/* Engagement configuration. */
		EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
		engagementConfiguration.Agent.ConnectionString = "Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}";
		
		/* Disable Engagement crash reporting. */
		engagementConfiguration.Agent.ReportCrash = false;

### Burst mode

By default, the Engagement service reports logs in real time. If your application reports logs very frequently, it is better to buffer the logs and to report them all at once on a regular time base (this is called the “burst mode”).

To do so, call the method:

		EngagementAgent.Instance.SetBurstThreshold(int everyMs);

The argument is a value in **milliseconds**. At any time, if you want to reactivate the real-time logging, just call the method without any parameter, or with the 0 value.

The burst mode slightly increase the battery life but has an impact on the Engagement Monitor: all sessions and jobs duration will be rounded to the burst threshold (thus, sessions and jobs shorter than the burst threshold may not be visible). It is recommended to use a burst threshold no longer than 30000 (30s). You have to be aware that saved logs are limited to 300 items. If sending is too long you can lose some logs.

> [AZURE.WARNING] The burst threshold cannot be configured to a period lesser than 1s. If you try to do so, the SDK will show a trace with the error and will automatically reset to the default value, i.e., 0s. This will trigger the SDK to report the logs in real-time.

[here]:http://www.nuget.org/packages/Capptain.WindowsCS
[NuGet website]:http://docs.nuget.org/docs/start-here/overview
 
