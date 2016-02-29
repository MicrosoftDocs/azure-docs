<properties
	pageTitle="Analytics for Windows Phone and Store apps | Microsoft Azure"
	description="Analyze usage and performance of your Windows device app."
	services="application-insights"
    documentationCenter="windows"
	authors="alancameronwills"
	manager="douge"/>

<tags
	ms.service="application-insights"
	ms.workload="tbd"
	ms.tgt_pltfrm="ibiza"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="02/19/2016"
	ms.author="awills"/>

# Analytics for Windows Phone and Store apps

Microsoft provides two solutions for device devOps: [HockeyApp](http://hockeyapp.net/) for client side analytics; and [Application Insights](app-insights-overview.md) for the server side.

[HockeyApp](http://hockeyapp.net/) is our Mobile DevOps solution for iOS, OS X, Android or Windows device apps, as well as cross platform apps based on Xamarin, Cordova, and Unity. With it, you can distribute builds to beta testers, collect crash data, and get user metrics and feedback. It’s integrated with Visual Studio Team Services enabling easy build deployments and work item integration. 

Go to:

* [HockeyApp](http://support.hockeyapp.net/kb)
* [HockeyApp Blog](http://hockeyapp.net/blog/)
* Join [Hockeyapp Preseason](http://hockeyapp.net/preseason/) to get early releases.

If your app has a server side, use [Application Insights](app-insights-overview.md) to monitor the web server side of your app on [ASP.NET](app-insights-asp-net.md) or [J2EE](app-insights-java-get-started.md). 

## Application Insights SDK for your Windows devices

Although we recommend HockeyApp, there's also an older version of the Application Insights SDK that you can use to monitor [crashes][windowsCrash] and [usage][windowsUsage] on your Windows device apps. 

Please note that support for the older device SDK will be phased out.

![](./media/app-insights-windows-get-started/appinsights-d018-oview.png)


To install the older SDK, you'll need:

* A subscription to [Microsoft Azure][azure].
* Visual Studio 2013 or later.


### 1. Get an Application Insights resource 

In the [Azure portal][portal], create an Application Insights resource. 

Create a new resource:

![Choose New, Developer Services, Application Insights](./media/app-insights-windows-get-started/01-new.png)

A [resource][roles] in Azure is an instance of a service. This resource is where telemetry from your app will be analyzed and presented to you.

#### Copy the Instrumentation Key

The key identifies the resource. You'll need it soon, to configure the SDK to send the data to the resource.

![Open the Essentials drop-down drawer and select the instrumentation key](./media/app-insights-windows-get-started/02-props.png)


### 2. Add the Application Insights SDK to your apps

In Visual Studio, add the appropriate SDK to your project.


* If it's a C++ app, use the [C++ SDK](https://github.com/Microsoft/ApplicationInsights-CPP) instead of the NuGet package illustrated below.

If it's a Windows Universal app, repeat the steps below for both the Windows Phone project and the Windows project.

1. Right-click the project in Solution Explorer and choose **Manage NuGet Packages**.

    ![](./media/app-insights-windows-get-started/03-nuget.png)

2. Search for "Application Insights".

    ![](./media/app-insights-windows-get-started/04-ai-nuget.png)

3. Pick **Application Insights for Windows Applications**

4. Add an ApplicationInsights.config file to the root of your project and insert the instrumentation key copied from the portal. A sample xml for this config file is shown below. 

	```xml

		<?xml version="1.0" encoding="utf-8" ?>
		<ApplicationInsights>
			<InstrumentationKey>YOUR COPIED INSTRUMENTATION KEY</InstrumentationKey>
		</ApplicationInsights>
	```

    Set the properties of the ApplicationInsights.config file: **Build Action** == **Content** and **Copy to Output Directory** == **Copy always**.
	
	![](./media/app-insights-windows-get-started/AIConfigFileSettings.png)

5. Add the following initialization code. It is best to add this code to the `App()` constructor. If you do it somewhere else, you might miss auto collection of the first pageviews.  

```C#

	public App()
	{
	   // Add this initilization line. 
	   WindowsAppInitializer.InitializeAsync();
	
	   this.InitializeComponent();
	   this.Suspending += OnSuspending;
	}  
```

**Windows Universal apps**: Repeat the steps for both the Phone and the Store project. [Example of a Windows 8.1 Universal app](https://github.com/Microsoft/ApplicationInsights-Home/tree/master/Samples/Windows%208.1%20Universal).

### <a name="network"></a>3. Enable network access for your app

If your app doesn't already [request outgoing network access](https://msdn.microsoft.com/library/windows/apps/hh452752.aspx), you'll have to add that to its manifest as a [required capability](https://msdn.microsoft.com/library/windows/apps/br211477.aspx).

### <a name="run"></a>4. Run your project

[Run your application with F5](http://msdn.microsoft.com/library/windows/apps/bg161304.aspx) and use it, so as to generate some telemetry. 

In Visual Studio, you'll see a count of the events that have been received.

![](./media/app-insights-windows-get-started/appinsights-09eventcount.png)

In debug mode, telemetry is sent as soon as it's generated. In release mode, telemetry is stored on the device and sent only when the app resumes.


### <a name="monitor"></a>5. See monitor data

Open Application Insights from your project.

![Right-click your project and open the Azure portal](./media/app-insights-windows-get-started/appinsights-04-openPortal.png)


At first, you'll just see one or two points. For example:

![Click through to more data](./media/app-insights-windows-get-started/appinsights-26-devices-01.png)

Click Refresh after a few seconds if you're expecting more data.

Click any chart to see more detail. 


### <a name="deploy"></a>5. Publish your application to Store

[Publish your application](http://dev.windows.com/publish) and watch the data accumulate as users download and use it.

### Customize your telemetry

#### Choosing the collectors

Application Insights SDK Includes several collectors, which collect different types of data from your app automatically. By default, they are all active. But you can choose which collectors to initialize in the app constructor:

    WindowsAppInitializer.InitializeAsync( "00000000-0000-0000-0000-000000000000",
       WindowsCollectors.Metadata
       | WindowsCollectors.PageView
       | WindowsCollectors.Session 
       | WindowsCollectors.UnhandledException);

#### Send your own telemetry data

Use the [API][api] to send events, metrics and diagnostic data to Application Insights. In summary:

```C#

 var tc = new TelemetryClient(); // Call once per thread

 // Send a user action or goal:
 tc.TrackEvent("Win Game");

 // Send a metric:
 tc.TrackMetric("Queue Length", q.Length);

 // Provide properties by which you can filter events:
 var properties = new Dictionary{"game", game.Name};

 // Provide metrics associated with an event:
 var measurements = new Dictionary{"score", game.score};

 tc.TrackEvent("Win Game", properties, measurements);

```

For more detail, see [Custom Events and Metrics][api].

## What's next?

* [Detect and diagnose crashes in your app][windowsCrash]
* [Learn about metrics][metrics]
* [Learn about diagnostic search][diagnostic]
* [Track usage of your app][windowsUsage]
* [Use the API to send custom telemetry][api]
* [Troubleshooting][qna]

* [Use HockeyApp for crash analytics, beta distribution and feedback on your app](http://hockeyapp.net/)




<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[azure]: ../insights-perf-analytics.md
[diagnostic]: app-insights-diagnostic-search.md
[metrics]: app-insights-metrics-explorer.md
[portal]: http://portal.azure.com/
[qna]: app-insights-troubleshoot-faq.md
[roles]: app-insights-resources-roles-access-control.md
[windowsCrash]: app-insights-windows-crashes.md
[windowsUsage]: app-insights-windows-usage.md
