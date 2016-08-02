<properties 
	pageTitle="Get more out of Application Insights" 
	description="After getting started with Application Insights, here's a summary of the features you can explore." 
	services="application-insights" 
    documentationCenter=".net"
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/02/2016" 
	ms.author="awills"/>

# More telemetry from Application Insights

Here's a summary of features that you might not have tried in [Visual Studio Application Insights](app-insights-overview.md). We'll assume you already [got started](app-insights-asp-net.md). Application Insights lets you monitor your web application for availability, performance and usage. With the feedback you get about the performance and effectiveness of your app in the wild, you can make informed choices about the direction of the design in each development lifecycle.

## More telemetry

||
|---|---
|[**Availability tests**](app-insights-monitor-web-app-availability.md)<br/>Send your web app HTTP requests at regular intervals from around the world. We'll alert you if the response is slow or unreliable.| 
|[**Dependency calls**](app-insights-asp-net-dependencies.md)<br/>Monitor SQL queries, and calls to REST or other resources.|
|[**Exceptions**](app-insights-asp-net-exceptions.md)<br/>Count handled and unhandled exceptions, get stack traces, and click through to the code.|
|[**Web pages**](app-insights-javascript.md)<br/>Monitor page usage, performance and AJAX calls by instrumenting your web pages.
|**Host performance: [Azure diagnostics](app-insights-azure-diagnostics.md), [Windows performance counters](app-insights-web-monitor-performance.md)**<br/>See the CPU usage and other context metrics.  |![](./media/app-insights-asp-net-more/04.png)
|[**SDK API - custom telemetry**](app-insights-api-custom-events-metrics.md)<br/>Send your own events and metrics for a more detailed view of your app's performance and usage, both in the server and client code.|
|[**Log integration**](app-insights-asp-net-trace-logs.md)<br/>If you use a logging framework such as Log4Net, NLog, or System.Diagnostics.Trace, there's an adapter that sends the traces to Application Insights along with other telemetry.|
|[**TelemetryProcessors**](app-insights-api-filtering-sampling.md)<br/>Filter, modify or augment the telemetry sent from the SDK in your app. |


## Powerful analysis and presentation

||
|---|---
|[**Diagnostic search for instance data**](app-insights-visual-studio.md)<br/>Search and filter events such as requests, exceptions, dependency calls, log traces and page views. In Visual Studio, go to code from stack traces.|![Visual studio](./media/app-insights-asp-net/61.png)
|[**Metrics Explorer for aggregated data**](app-insights-metrics-explorer.md)<br/>Explore, filter and segment aggregated data such as rates of requests, failures, and exceptions; response times, page load times.|![Visual studio](./media/app-insights-asp-net-more/060.png)
|[**Dashboards**](app-insights-dashboards.md#dashboards)<br/>Mashup data from multiple resources and share with others. Great for multi-component applications, and for continuous display in the team room.  |![Dashboards sample](./media/app-insights-asp-net/62.png)
|[**Live Metrics Stream**](app-insights-metrics-explorer.md#live-metrics-stream)<br/>When you deploy a new build, watch these near-real-time performance indicators to make sure everything works as expected.|![Analytics sample](./media/app-insights-asp-net-more/050.png)
|[**Analytics**](app-insights-analytics.md)<br/>Answer tough questions about your app's performance and usage by using this powerful query language.|![Analytics sample](./media/app-insights-asp-net-more/010.png)
|[**Automatic and manual alerts**](app-insights-alerts.md)<br/>Automatic alerts adapt to your app's normal patterns of telemetry and trigger when there's something outside the usual pattern. You can also set alerts on particular levels of custom or standard metrics.|![Alert sample](./media/app-insights-asp-net-more/020.png)

## Data management

|||
|---|---|
|[**Continuous Export**](app-insights-export-telemetry.md)<br/>Copy all your telemetry into storage so that you can analyze it your own way.|
|**Data access API**<br/>Coming soon.|
|[**Sampling**](app-insights-sampling.md)<br/>Reduces the data rate and helps you stay within the limit of your pricing tier.|![Sampling tile](./media/app-insights-asp-net-more/030.png)