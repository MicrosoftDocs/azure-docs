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
	ms.date="11/11/2015"
	ms.author="awills"/>

# Analytics for Windows Phone and Store apps



Visual Studio Application Insights lets you monitor your published application for usage and performance.


> [AZURE.NOTE] We recommend [HockeyApp](http://support.hockeyapp.net/kb/client-integration-windows-and-windows-phone/hockeyapp-for-windows-store-apps-and-windows-phone-store-apps) to get crash reports, analytics, distribution and feedback management.

![](./media/app-insights-windows-get-started/appinsights-d018-oview.png)


## Setting up Application Insights for your Windows device project

You'll need:

* A subscription to [Microsoft Azure][azure].
* Visual Studio 2013 or later.

**C++ UAP apps** - See the [Application Insights C++ setup guide](https://github.com/Microsoft/ApplicationInsights-CPP)

### <a name="new"></a>If you're creating a new Windows app project ...

Select **Application Insights** in the **New Project** dialog.

If you're asked to sign in, use the credentials for your Azure account.

![](./media/app-insights-windows-get-started/appinsights-d21-new.png)


### <a name="existing"></a>Or if it's an existing project ...

Add Application Insights from Solution Explorer.


![](./media/app-insights-windows-get-started/appinsights-d22-add.png)
**Windows Universal apps**: Repeat for both the Phone and the Store project. [Example of a Windows 8.1 Universal app](https://github.com/Microsoft/ApplicationInsights-Home/tree/master/Samples/Windows%208.1%20Universal).

## <a name="network"></a>3. Enable network access for your app

If your app doesn't already [request internet access](https://msdn.microsoft.com/library/windows/apps/hh452752.aspx), you'll have to add that to its manifest as a [required capability](https://msdn.microsoft.com/library/windows/apps/br211477.aspx).

## <a name="run"></a>4. Run your project

[Run your application with F5](http://msdn.microsoft.com/library/windows/apps/bg161304.aspx) and use it, so as to generate some telemetry.

In Visual Studio, you'll see a count of the events that have been received.

![](./media/app-insights-windows-get-started/appinsights-09eventcount.png)

In debug mode, telemetry is sent as soon as it's generated. In release mode, telemetry is stored on the device and sent only when the app resumes.


## <a name="monitor"></a>5. See monitor data

In the [Azure portal](https://portal.azure.com), open the Application Insights resource that you created earlier.

At first, you'll just see one or two points. For example:

![Click through to more data](./media/app-insights-windows-get-started/appinsights-26-devices-01.png)

Click **Refresh** after a few seconds if you're expecting more data.

Click any chart to see more detail.


## <a name="deploy"></a>5. Publish your application to Store

[Publish your application](http://dev.windows.com/publish) and watch the data accumulate as users download and use it.

## Customize your telemetry

#### Choose the collectors

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

For more details, see [API overview: Custom Events and Metrics][api].

## What's next?

* [Detect and diagnose crashes in your app][windowsCrash]
* [Learn about metrics][metrics]
* [Learn about diagnostic search][diagnostic]




## Upgrade to a new release of the SDK

When a [new SDK version is released](app-insights-release-notes-windows.md):

* Right-click your project and choose Manage NuGet Packages.
* Select the installed Application Insights packages and choose **Action: Upgrade**.


## <a name="usage"></a>Next Steps


[Detect and diagnose crashes in your app][windowsCrash]

[Capture and search diagnostic logs][diagnostic]


[Track usage of your app][windowsUsage]

[Use the API to send custom telemetry][api]

[Troubleshooting][qna]



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
