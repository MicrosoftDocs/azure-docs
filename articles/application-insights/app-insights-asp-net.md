---
title: Set up web app analytics for ASP.NET with Application Insights | Microsoft Docs
description: Configure performance, availability and usage analytics for your ASP.NET website, hosted on-premises or in Azure.
services: application-insights
documentationcenter: .net
author: NumberByColors
manager: douge

ms.assetid: d0eee3c0-b328-448f-8123-f478052751db
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/13/2016
ms.author: awills

---
# Set up Application Insights for ASP.NET
[Azure Application Insights](app-insights-overview.md) monitors your live application to help you [detect and diagnose performance issues and exceptions](app-insights-detect-triage-diagnose.md), and [discover how your app is used](app-insights-overview-usage.md).  It works for apps that are hosted on your own on-premises IIS servers or on cloud VMs, as well as Azure web apps.

## Before you start
You need:

* Visual Studio 2013 update 3 or later. Later is better.
* A subscription to [Microsoft Azure](http://azure.com). If your team or organization has an Azure subscription, the owner can add you to it, using your [Microsoft account](http://live.com). 

There are alternative articles to look at if you are interested in:

* [Instrumenting a web app at run time](app-insights-monitor-performance-live-website-now.md)
* [Azure Cloud services](app-insights-cloudservices.md)

## <a name="ide"></a> 1. Add Application Insights SDK
### If it's a new project...
Make sure Application Insights is selected when you create a new project in Visual Studio. 

![Create an ASP.NET project](./media/app-insights-asp-net/appinsights-01-vsnewp1.png)

### ... or if it's an existing project
Right-click the project in Solution Explorer, and choose **Add Application Insights Telemetry** or **Configure Application Insights**.

![Choose Add Application Insights](./media/app-insights-asp-net/appinsights-03-addExisting.png)

* ASP.NET Core project? - [Follow these instructions to fix a few lines of code](https://github.com/Microsoft/ApplicationInsights-aspnetcore/wiki/Getting-Started#add-application-insights-instrumentation-code-to-startupcs). 

## <a name="run"></a> 2. Run your app
Run your application with F5 and try it out: open different pages to generate some telemetry.

In Visual Studio, you see a count of the events that have been logged. 

![In Visual Studio, the Application Insights button shows during debugging.](./media/app-insights-asp-net/54.png)

## 3. See your telemetry...
### ... in Visual Studio
Open the Application Insights window in Visual Studio: Either click the Application Insights button, or right-click your project in Solution Explorer:

![In Visual Studio, the Application Insights button shows during debugging.](./media/app-insights-asp-net/55.png)

This view shows telemetry generated in the server side of your app. Experiment with the filters, and click any event to see more detail.

[Learn more about Application Insights tools in Visual Studio](app-insights-visual-studio.md).

<a name="monitor"></a> 

### ... in the portal
Unless you chose *Install SDK only,* you can also see the telemetry at the Application Insights web portal. 

The portal has more charts, analytic tools, and dashboards than Visual Studio. 

Open your Application Insights resource in the [Azure portal](https://portal.azure.com/).

![Right-click your project and open the Azure portal](./media/app-insights-asp-net/appinsights-04-openPortal.png)

The portal opens on a view of the telemetry from your app:
![](./media/app-insights-asp-net/66.png)

* The first telemetry appears in [Live Metrics Stream](app-insights-metrics-explorer.md#live-metrics-stream).
* Individual events appear in **Search** (1). Data may take a few minutes to appear. Click any event in order to see its properties. 
* Aggregated metrics appear in the charts (2). It might take a minute or two for data to appear here. Click any chart to open a blade with more detail.

[Learn more about using Application Insights in the Azure portal](app-insights-dashboards.md).

## 4. Publish your app
Publish your app to your IIS server or to Azure. Watch [Live Metrics Stream](app-insights-metrics-explorer.md#live-metrics-stream) to make sure everything is running smoothly.

You'll see your telemetry building up in the Application Insights portal, where you can monitor metrics, search your telemetry, and set up [dashboards](app-insights-dashboards.md). You can also use the powerful [Analytics query language](app-insights-analytics.md) to analyze usage and performance or find specific events. 

You can also continue to analyze your telemetry in [Visual Studio](app-insights-visual-studio.md) with tools such as diagnostic search and [Trends](app-insights-visual-studio-trends.md).

> [!NOTE]
> If your app sends enough telemetry to approach the [throttling limits](app-insights-pricing.md#limits-summary), automatic [sampling](app-insights-sampling.md) switches on. Sampling reduces the quantity of telemetry sent from your app, while preserving correlated data for diagnostic purposes.
> 
> 

## <a name="land"></a> What did 'Add Application Insights' do?
Application Insights sends telemetry from your app to the Application Insights portal (which is hosted in Microsoft Azure):

![](./media/app-insights-asp-net/01-scheme.png)

So the command did three things:

1. Add the Application Insights Web SDK NuGet package to your project. To see it in Visual Studio, right-click your project and choose Manage NuGet Packages.
2. Create an Application Insights resource in [the Azure portal](https://portal.azure.com/). This is where you'll see your data. It retrieves the *instrumentation key,* which identifies the resource.
3. Inserts the instrumentation key in `ApplicationInsights.config`, so that the SDK can send telemetry to the portal.

If you want, you can do these steps manually for [ASP.NET 4](app-insights-windows-services.md) or [ASP.NET Core](https://github.com/Microsoft/ApplicationInsights-aspnetcore/wiki/Getting-Started).

### To upgrade to future SDK versions
To upgrade to a [new release of the SDK](https://github.com/Microsoft/ApplicationInsights-dotnet-server/releases), open NuGet package manager again, and filter on installed packages. Select Microsoft.ApplicationInsights.Web and choose Upgrade.

If you made any customizations to ApplicationInsights.config, save a copy of it before you upgrade, and afterwards merge your changes into the new version.

## Add more telemetry
### Web pages and single-page apps
1. [Add the JavaScript snippet](app-insights-javascript.md) to your web pages to light up the Browser and Usage blades with data about page views, load times, browser exceptions, AJAX call performance, user and session counts.
2. [Code custom events](app-insights-api-custom-events-metrics.md) to count, time, or measure user actions.

### Dependencies, exceptions and performance counters
[Install Status Monitor](app-insights-monitor-performance-live-website-now.md) on each of your server machines, to get additional telemetry about your app. This is what you get:

* [Performance counters](app-insights-performance-counters.md) - 
  CPU, memory, disk and other performance counters relating to your app. 
* [Exceptions](app-insights-asp-net-exceptions.md) - more detailed telemetry for some exceptions.
* [Dependencies](app-insights-asp-net-dependencies.md) - calls to REST API or SQL services. Find out whether slow responses by external components are causing performance issues in your app. (If your app runs on .NET 4.6, you don't need Status Monitor to get this telemetry.)

### Diagnostic code
Got a problem? If you want to insert code in your app to help diagnose it, you have several options:

* [Capture log traces](app-insights-asp-net-trace-logs.md): If you're already using Log4N, NLog, or System.Diagnostics.Trace to log trace events, then the output can be sent to Application Insights so that you can correlate it with requests, search through it and analyze it. 
* [Custom events and metrics](app-insights-api-custom-events-metrics.md): Use TrackEvent() and TrackMetric() either in server or web page code.
* [Tag telemetry with additional properties](app-insights-api-filtering-sampling.md#add-properties)

Use [Search](app-insights-diagnostic-search.md) to find and correlate specific events, and [Analytics](app-insights-analytics.md) to perform more powerful queries.

## Alerts
Be the first to know if your app has problems. (Don't wait until your users tell you!) 

* [Create web tests](app-insights-monitor-web-app-availability.md) to make sure your site is visible on the web.
* [Proactive diagnostics](app-insights-proactive-diagnostics.md) run automatically (if your app has a certain minimum amount of traffic). You don't have to do anything to set them up. They tell you if your app has an unusual rate of failed requests.
* [Set metric alerts](app-insights-alerts.md) to warn you if a metric crosses a threshold. You can set them on custom metrics that you code into your app.

By default, alert notifications are sent to the owner of the Azure subscription. 

![alert email sample](./media/app-insights-asp-net/alert-email.png)

## Version and release tracking
### Track application version
Make sure `buildinfo.config` is generated by your MSBuild process. In your .csproj file, add:  

```XML

    <PropertyGroup>
      <GenerateBuildInfoConfigFile>true</GenerateBuildInfoConfigFile>    <IncludeServerNameInBuildInfo>true</IncludeServerNameInBuildInfo>
    </PropertyGroup> 
```

When it has the build info, the Application Insights web module automatically adds **Application version** as a property to every item of telemetry. That allows you to filter by version when performing [diagnostic searches](app-insights-diagnostic-search.md) or when [exploring metrics](app-insights-metrics-explorer.md). 

However, notice that the build version number is generated only by MS Build, not by the developer build in Visual Studio.

### Release annotations
If you use Visual Studio Team Services, you can [get an annotation marker](app-insights-annotations.md) added to your charts whenever you release a new version.

![release annotation sample](./media/app-insights-asp-net/release-annotation.png)

## Next steps
|  |
| --- | --- |
| **[Working with Application Insights in Visual Studio](app-insights-visual-studio.md)**<br/>Debugging with telemetry, diagnostic search, drill through to code. |
| **[Working with the Application Insights portal](app-insights-dashboards.md)**<br/>Dashboards, powerful diagnostic and analytic tools, alerts, a live dependency map of your application, and telemetry export. |
| **[Add more data](app-insights-asp-net-more.md)**<br/>Monitor usage, availability, dependencies, exceptions. Integrate traces from logging frameworks. Write custom telemetry. |

