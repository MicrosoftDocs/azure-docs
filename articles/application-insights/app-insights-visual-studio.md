<properties 
	pageTitle="Working with Application Insights on Visual Studio" 
	description="Performance analysis and diagnostics during debugging and in production." 
	services="application-insights" 
    documentationCenter=".net"
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="06/21/2016" 
	ms.author="awills"/>


# Working with Application Insights in Visual Studio

In Visual Studio (2015 and later), you can analyze performance and diagnose issues both in debugging and in production, using telemetry from [Visual Studio Application Insights](app-insights-overview.md).

If you haven't yet [installed Application Insights in your app](app-insights-asp-net.md), do that now.

## <a name="run"></a> Debug your project

Run your application with F5 and try it out: open different pages to generate some telemetry.

In Visual Studio, you'll see a count of the events that have been logged.

![In Visual Studio, the Application Insights button shows during debugging.](./media/app-insights-visual-studio/appinsights-09eventcount.png)

Click this button to open diagnostic search. 



## Diagnostic search

The Search window shows events that have been logged. (If you signed in to Azure when you set up Application Insights, you'll be able to search the same events in the portal.)

![Right-click the project and choose Application Insights, Search](./media/app-insights-visual-studio/34.png)

The free text search works on any fields in the events. For example, search for part of the URL of a page; or the value of a property such as client city; or specific words in a trace log.

Click any event to see its detailed properties.

You can also open the Related Items tab to help diagnose failed requests or exceptions.


![](./media/app-insights-visual-studio/41.png)



## Diagnostics hub

The Diagnostics Hub (in Visual Studio 2015 or later) shows the Application Insights server telemetry as it's generated. This works even if you opted only to install the SDK, without connecting it to a resource in the Azure portal.

![Open the Diagnostic Tools window and inspect the Application Insights events.](./media/app-insights-visual-studio/31.png)


## Exceptions

If you have [set up exception monitoring](app-insights-asp-net-exceptions.md), exception reports will show in the Search window. 

Click an exception to get a stack trace. If the code of the app is open in Visual Studio, you can click through from the stack trace to the relevant line of the code.


![Exception stack trace](./media/app-insights-visual-studio/17.png)

In addition, in the Code Lens line above each method, you'll see a count of the exceptions logged by Application Insights in the past 24h.

![Exception stack trace](./media/app-insights-visual-studio/21.png)


## Local monitoring



(From Visual Studio 2015 Update 2) If you haven't configured the SDK to send telemetry to the Application Insights portal (so that there is no instrumentation key in ApplicationInsights.config) then the diagnostics window will display telemetry from your latest debugging session. 

This is desirable if you have already published a previous version of your app. You don't want the telemetry from your debugging sessions to be mixed up with the telemetry on the Application Insights portal from the published app.

It's also useful if you have some [custom telemetry](app-insights-api-custom-events-metrics.md) that you want to debug before sending telemetry to the portal.


* *At first, I fully configured Application Insights to send telemetry to the portal. But now I'd like to see the telemetry only in Visual Studio.*

 * In the Search window's Settings, there's an option to search local diagnostics even if your app sends telemetry to the portal.
 * To stop telemetry being sent to the portal, comment out the line `<instrumentationkey>...` from ApplicationInsights.config. When you're ready to send telemetry to the portal again, uncomment it.

## Trends

Trends is a tool for visualizing how your app behaves over time. 

Choose **Explore Telemetry Trends** from the Application Insights toolbar button or Application Insights Search window. Choose one of five common queries to get started. You can analyze different datasets based on telemetry types, time ranges, and other properties. 

To find anomalies in your data, choose one of the anomaly options under the "View Type" dropdown. The filtering options at the bottom of the window make it easy to hone in on specific subsets of your telemetry.

![Trends](./media/app-insights-visual-studio/51.png)

[More about Trends](app-insights-visual-studio-trends.md).

## What's next?

||
|---|---
|**[Add more data](app-insights-asp-net-more.md)**<br/>Monitor usage, availability, dependencies, exceptions. Integrate traces from logging frameworks. Write custom telemetry. | ![Visual studio](./media/app-insights-asp-net/64.png)
|**[Working with the Application Insights portal](app-insights-dashboards.md)**<br/>Dashboards, powerful diagnostic and analytic tools, alerts, a live dependency map of your application, and telemetry export. |![Visual studio](./media/app-insights-asp-net/62.png)


 
