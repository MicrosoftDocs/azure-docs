<properties 
	pageTitle="Monitor your app's health and usage with Application Insights" 
	description="Get started with Application Insights. Analyze usage, availability and performance of your on-premises or Microsoft Azure applications." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/08/2015" 
	ms.author="awills"/>
 
# Monitor performance in web applications

*Application Insights is in preview.*


Make sure your application is performing well, and find out quickly about any failures. [Application Insights][start] will tell you about any performance issues and exceptions, and help you find and diagnose the root causes.

Application Insights can monitor both Java and ASP.NET web applications and services, WCF services. They can be hosted on-premise, on virtual machines, or as Microsoft Azure websites. 

On the client side, Application Insights can take telemetry from web pages and a wide variety of devices including iOS, Android and Windows Store apps.


## <a name="setup"></a>Set up performance monitoring

If you haven't yet added Application Insights to your project (that is, if it doesn't have ApplicationInsights.config), choose one of these ways to get started:

* [ASP.NET web apps](app-insights-asp-net.md)
 * [Add exception monitoring](app-insights-asp-net-exceptions.md)
 * [Add dependency monitoring](app-insights-monitor-performance-live-website-now.md)
* [J2EE web apps](app-insights-java-get-started.md)
 * [Add dependency monitoring](app-insights-java-agent.md)


## <a name="view"></a>Exploring performance metrics

In [the Azure portal](https://portal.azure.com), browse to the Application Insights resource that you set up for your application. The overview blade shows basic performance data:



Click any chart to see more detail, and to see results for a longer period. For example, click the Requests tile and then select a time range:


![Click through to more data and select a time range](./media/app-insights-web-monitor-performance/appinsights-48metrics.png)

Click a chart to choose which metrics it displays, or add a new chart and select its metrics:

![Click a graph to choose metrics](./media/app-insights-web-monitor-performance/appinsights-61perfchoices.png)

> [AZURE.NOTE] **Uncheck all the metrics** to see the full selection that is available. The metrics fall into groups; when any member of a group is selected, only the other members of that group appear.


## <a name="metrics"></a>What does it all mean? Performance tiles and reports

There's a variety of performance metrics you can get. Let's start with those that appear by default on the application blade.


### Requests

The number of HTTP requests received in a specified period. Compare this with the results on other reports to see how your app behaves as the load varies.

HTTP requests include all GET or POST requests for pages, data and images.

Click on the tile to get counts for specific URLs.

### Average response time

Measures the time between a web request entering your application and the response being returned.

The points show a moving average. If there are a lot of requests, there might be some that deviate from the average without an obvious peak or dip in the graph.

Look for unusual peaks. In general, expect response time to rise with a rise in requests. If the rise is disproportionate, your app might be hitting a resource limit such as CPU or the capacity of a service it uses.

Click on the tile to get times for specific URLs.

![](./media/app-insights-web-monitor-performance/appinsights-42reqs.png)


### Slowest requests

![](./media/app-insights-web-monitor-performance/appinsights-44slowest.png)

Shows which requests might need performance tuning.


### Failed requests

![](./media/app-insights-web-monitor-performance/appinsights-46failed.png)

A count of requests that threw uncaught exceptions.

Click the tile to see the details of specific failures, and select an individual request to see its detail. 

Only a representative sample of failures is retained for individual inspection.

### Other metrics

To see what other metrics you can display, click a graph, and then deselect all the metrics to see the full available set. Click (i) to see each metric's definition.

![Deselect all metrics to see the whole set](./media/app-insights-web-monitor-performance/appinsights-62allchoices.png)


Selecting any metric will disable the others that can't appear on the same chart.

## System performance counters

Some of the metrics you can choose from are [performance counters](http://www.codeproject.com/Articles/8590/An-Introduction-To-Performance-Counters). Windows provides a wide variety of them, and you can also define your own.

This example shows performance counters that are available by default. We have [added a separate chart](app-insights-metrics-explorer.md#editing-charts-and-grids) for each counter, and named the chart by [saving it as a favorite](app-insights-metrics-explorer.md#editing-charts-and-grids):

![](./media/app-insights-web-monitor-performance/sys-perf.png)


If the counters you want aren't in the properties list, you can add them to the set that the SDK collects. Open ApplicationInsights.config and edit the performance collector directive:

    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCollector.PerformanceCollectorModule, Microsoft.ApplicationInsights.Extensibility.PerfCollector">
      <Counters>
        <Add PerformanceCounter="\Objects\Processes"/>
        <Add PerformanceCounter="\Sales(electronics)\# Items Sold" ReportAs="Item sales"/>
      </Counters>
    </Add>

The format is `\Category(instance)\Counter"` or for categories that don't have instances, just `\Category\Counter`. To discover what counters are available in your system, read [this introduction](http://www.codeproject.com/Articles/8590/An-Introduction-To-Performance-Counters).

`ReportAs` is required for counter names that contain characters other than these: letters, round brackets, forward slahes, hyphens, underscores, spaces and dots.

If you specify an instance, it will be collected as a property "CounterInstanceName" of the reported metric.

If you prefer, you can write code to have the same effect:

    var perfCollector = new PerformanceCollectorModule();
    perfCollector.Counters = new List<CustomPerformanceCounterCollectionRquest>();
    perfCollector.Counters.Add(new CustomPerformanceCounterCollectionRquest(
      @"\Sales(electronics)\# Items Sold", "Items sold"));
    perfCollector.Initialize(TelemetryConfiguration.Active);
    TelemetryConfiguration.Active.TelemetryModules.Add(perfCollector);

### Exception counts

*What's the difference between the Exception rate and Exceptions metrics?*

* *Exception rate* is a system performance counter. The CLR counts all the handled and unhandled exceptions that are thrown, and divides the total in a sampling interval by the length of the interval. The Application Insights SDK collects this result and sends it to the portal.
* *Exceptions* is a count of the TrackException reports received by the portal in the sampling interval of the chart. It includes only the handled exceptions where you have written TrackException calls in your code, and doesn't include all [unhandled exceptions](app-insights-asp-net-exceptions.md). 

## Set alerts

To be notified by email of unusual values of any metric, add an alert. You can choose either to send the email to the account administrators, or to specific email addresses.

![](./media/app-insights-web-monitor-performance/appinsights-413setMetricAlert.png)

Set the resource before the other properties. Don't choose the webtest resources if you want to set alerts on performance or usage metrics.

Be careful to note the units in which you're asked to enter the threshold value.

*I don't see the Add Alert button.* - Is this a group account to which you have read-only access? Check with the account administrator.

## <a name="diagnosis"></a>Diagnosing issues

Here are a few tips for finding and diagnosing performance issues:

* Set up [web tests][availability] to be alerted if your web site goes down or responds incorrectly or slowly. 
* Compare the Request count with other metrics to see if failures or slow response are related to load.
* [Insert and search trace statements][diagnostic] in your code to help pinpoint problems.

## <a name="next"></a>Next steps

[Web tests][availability] - Have web requests sent to your application at regular intervals from around the world.

[Capture and search diagnostic traces][diagnostic] - Insert trace calls and sift through the results to pinpoint issues.

[Usage tracking][usage] - Find out how people use your application.

[Troubleshooting][qna] - and Q & A

## Video

[AZURE.VIDEO performance-monitoring-application-insights]

<!--Link references-->

[availability]: app-insights-monitor-web-app-availability.md
[diagnostic]: app-insights-diagnostic-search.md
[greenbrown]: app-insights-start-monitoring-app-health-usage.md
[qna]: app-insights-troubleshoot-faq.md
[redfield]: app-insights-monitor-performance-live-website-now.md
[start]: app-insights-overview.md
[usage]: app-insights-web-track-usage.md

 