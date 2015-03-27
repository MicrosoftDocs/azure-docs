<properties 
	pageTitle="Azure Mobile Engagement Windows Store SDK Overview" 
	description="Latest updates and procedures for Windows Store SDK for Azure Mobile Engagement" 					
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="lalathie" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="" 
	ms.topic="article" 
	ms.date="02/12/2015" 
	ms.author="kapiteir" />

<div class="dev-center-tutorial-selector sublanding"><a href="/documentation/articles/mobile-engagement-windows-store-integrate-engagement/" title="Windows Store" class="current">Windows Store</a><a href="/documentation/articles/mobile-engagement-windows-phone-integrate-engagement/" title="Windows Phone">Windows Phone</a><a href="/documentation/articles/mobile-engagement-ios-integrate-engagement/" title="iOS">iOS</a><a href="/documentation/articles/mobile-engagement-android-integrate-engagement/" title="Android" >Android</a></div>

#How to Integrate Engagement on Windows

This procedure describes the simplest way to activate Engagement's Analytics and Monitoring functions in your Windows application.

The following steps are enough to activate the report of logs needed to compute all statistics regarding Users, Sessions, Activities, Crashes and Technicals. The report of logs needed to compute other statistics like Events, Errors and Jobs must be done manually using the Engagement API (see [How to use the advanced Mobile Engagement tagging API in your Windows Store app](mobile-engagement-windows-store-use-engagement-api.md)) since these statistics are application dependent.

##Supported versions

This Windows SDK only supports:

-   Windows 8 C\# Store application
-   Windows 8.1 C\# Store application

##Embed the Engagement SDK into your Windows project

Embed the Engagement SDK using the NuGet package manager for Microsoft's development platform.

Nuget package for Mobile Engagement is not yet available online so you need to download our SDK archive, unzip it, then in Visual Studio, right click on your project, to go to “Manage Nuget Packages”, Settings, and add the lib folder as a new package source.

> [AZURE.NOTE] NuGet is the main package manager for the .net projects. It will download, add and copy everything that you  need to use the Engagement SDK. Engagement Windows 8 C\# Metro application uses third party libraries (Microsoft.Bcl.Build v1.0.10 and Microsoft.Bcl portability pack v1.1.3) for cross-platform portability purpose, NuGet will automatically ask you to install them too. You can find more informations on the [NuGet website].

##Add the capabilities

The Engagement SDK needs some capabilities of the Windows SDK in order to work properly.

Open your `Package.appxmanifest` file and be sure that the following capabilities are declared:

-   `Internet (Client)`

Go to the `Declarations` panel of your Package.appxmanifest file.

In `Available Declarations` select `File Type Associations` and add it. In the right screen, on `Name` field, write `engagement_log_file` and in File type field write `.set`.

Then, in `Available Declarations` select `Cached File Updater` and add it.

##Initialize the Engagement SDK

### Engagement configuration

The Engagement configuration is centralized in the `Resources\EngagementConfiguration.xml` file of your project.

Edit this file to specify:

-   Your application connection string between tags `<connectionString>` and `<\connectionString>`.

If you want to specify it at runtime instead, you can call the following method before the Engagement agent initialization:

			/* Engagement configuration. */
			EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
			engagementConfiguration.Agent.ConnectionString = "Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}";
			
			/* Initialize Engagement angent with above configuration. */
			EngagementAgent.Instance.Init(args, engagementConfiguration);

The connection string for your application is displayed on Azure Portal.

### Engagement initialization

When you create a new project, a `App.xaml.cs` file is generated. This class inherits from `Application` and contains many important methods. It will also be used to initialize the Engagement SDK.

Modify the `App.xaml.cs`:

-   Add to your `using` statements:

			using Microsoft.Azure.Engagement;

-   Insert `EngagementAgent.Instance.Init` in the `OnLaunched` method:

			protected override void OnLaunched(LaunchActivatedEventArgs args)
			{
			  EngagementAgent.Instance.Init(args);
			
			  // or
			
			  EngagementAgent.Instance.Init(args, engagementConfiguration);
			}

-   When your application is launched using a custom scheme, another application or the command line then the `OnActivated` method is called. You also need to initiate the Engagement agent when your app is activated. To do so, override `OnActivated` method:

			protected override void OnActivated(IActivatedEventArgs args)
			{
			  EngagementAgent.Instance.Init(args);
			
			  // or
			
			  EngagementAgent.Instance.Init(args, engagementConfiguration);
			}

> [AZURE.IMPORTANT] We strongly discourage you to add the Engagement initialization in another place of your application.

##Basic reporting

### Recommended method: overload your `Page` classes

In order to activate the report of all the logs required by Engagement to compute Users, Sessions, Activities, Crashes and Technical statistics, you can simply make all your `Page` sub-classes inherit from the `EngagementPage` classes.

Here is an example of how to do this for a page of your application. You can do the same thing for all pages of your application.

#### C\# Source file

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

Further details on the extra information can be found here \<windows-sdk-extras-parameters\>.

These methods are called from within the `OnNavigatedTo` method of your page.

### Alternate method: call `StartActivity()` manually

If you cannot or do not want to overload your `Page` classes, you can instead start your activities by calling `EngagementAgent` methods directly.

We recommend to call `StartActivity` inside your `OnNavigatedTo` method of your Page.

			protected override void OnNavigatedTo(NavigationEventArgs e)
			{
			  base.OnNavigatedTo(e);
			  EngagementAgent.Instance.StartActivity("MyPage");
			}

> [AZURE.IMPORTANT] The Windows SDK automatically calls the `EndActivity` method when the application is closed. Thus, it is *HIGHLY* recommended to call the `StartActivity` method whenever the activity of the user change, and to *NEVER* call the `EndActivity` method, since calling this method forces the current session to be ended.

##Advanced reporting

Optionally, you may want to report application specific events, errors and jobs, to do so, use the others methods found in the `EngagementAgent` class. The Engagement API allows to use all of Engagement's advanced capabilities.

For further informations, see How to Use the Engagement API on Windows.

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

### Burst mode [beta]

By default, the Engagement service reports logs in real time. If your application reports logs very frequently, it is better to buffer the logs and to report them all at once on a regular time base (this is called the “burst mode”).

To do so, call the method:

			EngagementAgent.Instance.SetBurstThreshold(int everyMs);

The argument is a value in **milliseconds**. At any time, if you want to reactivate the real-time logging, just call the method without any parameter, or with the 0 value.

The burst mode slightly increase the battery life but has an impact on the Engagement Monitor: all sessions and jobs duration will be rounded to the burst threshold (thus, sessions and jobs shorter than the burst threshold may not be visible). It is recommended to use a burst threshold no longer than 30000 (30s).

> [AZURE.WARNING] The burst threshold cannot be configured to a period lesser than 1s. If you try to do so, the SDK will show a trace with the error and will automatically reset to the default value, i.e., 0s. This will trigger the SDK to report the logs in real-time.

[here]:http://www.nuget.org/packages/Capptain.WindowsCS
[NuGet website]:http://docs.nuget.org/docs/start-here/overview
