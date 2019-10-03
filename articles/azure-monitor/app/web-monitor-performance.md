---
title: Monitor your app's health and usage with Application Insights
description: Get started with Application Insights. Analyze usage, availability and performance of your on-premises or Microsoft Azure applications.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.assetid: 40650472-e860-4c1b-a589-9956245df307
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 05/10/2018
ms.reviewer: sdash
ms.author: mbullwin
---
# Monitor performance in web applications


Make sure your application is performing well, and find out quickly about any failures. [Application Insights][start] will tell you about any performance issues and exceptions, and help you find and diagnose the root causes.

Application Insights can monitor both Java and ASP.NET web applications and services, WCF services. They can be hosted on-premises, on virtual machines, or as Microsoft Azure websites. 

On the client side, Application Insights can take telemetry from web pages and a wide variety of devices including iOS, Android, and Windows Store apps.

## <a name="setup"></a>Set up performance monitoring
If you haven't yet added Application Insights to your project (that is, if it doesn't have ApplicationInsights.config), choose one of these ways to get started:

* [ASP.NET web apps](../../azure-monitor/app/asp-net.md)
  * [Add exception monitoring](../../azure-monitor/app/asp-net-exceptions.md)
  * [Add dependency monitoring](../../azure-monitor/app/monitor-performance-live-website-now.md)
* [Java EE web apps](../../azure-monitor/app/java-get-started.md)
  * [Add dependency monitoring](../../azure-monitor/app/java-agent.md)

## <a name="view"></a>Exploring performance metrics
In [the Azure portal](https://portal.azure.com), browse to the Application Insights resource that you set up for your application. The overview blade shows basic performance data:

Click any chart to see more detail, and to see results for a longer period. For example, click the Requests tile and then select a time range:

![Click through to more data and select a time range](./media/web-monitor-performance/appinsights-48metrics.png)

Click a chart to choose which metrics it displays, or add a new chart and select its metrics:

![Click a graph to choose metrics](./media/web-monitor-performance/appinsights-61perfchoices.png)

> [!NOTE]
> **Uncheck all the metrics** to see the full selection that is available. The metrics fall into groups; when any member of a group is selected, only the other members of that group appear.

## <a name="metrics"></a>What does it all mean? Performance tiles and reports
There are various performance metrics you can get. Let's start with those that appear by default on the application blade.

### Requests
The number of HTTP requests received in a specified period. Compare this with the results on other reports to see how your app behaves as the load varies.

HTTP requests include all GET or POST requests for pages, data, and images.

Click on the tile to get counts for specific URLs.

### Average response time
Measures the time between a web request entering your application and the response being returned.

The points show a moving average. If there are many requests, there might be some that deviate from the average without an obvious peak or dip in the graph.

Look for unusual peaks. In general, expect response time to rise with a rise in requests. If the rise is disproportionate, your app might be hitting a resource limit such as CPU or the capacity of a service it uses.

Click the tile to get times for specific URLs.

![](./media/web-monitor-performance/appinsights-42reqs.png)

### Slowest requests
![](./media/web-monitor-performance/appinsights-44slowest.png)

Shows which requests might need performance tuning.

### Failed requests
![](./media/web-monitor-performance/appinsights-46failed.png)

A count of requests that threw uncaught exceptions.

Click the tile to see the details of specific failures, and select an individual request to see its detail. 

Only a representative sample of failures is retained for individual inspection.

### Other metrics
To see what other metrics you can display, click a graph, and then deselect all the metrics to see the full available set. Click (i) to see each metric's definition.

![Deselect all metrics to see the whole set](./media/web-monitor-performance/appinsights-62allchoices.png)

Selecting any metric disables the others that can't appear on the same chart.

## Set alerts
To be notified by email of unusual values of any metric, add an alert. You can choose either to send the email to the account administrators, or to specific email addresses.

![](./media/web-monitor-performance/appinsights-413setMetricAlert.png)

Set the resource before the other properties. Don't choose the webtest resources if you want to set alerts on performance or usage metrics.

Be careful to note the units in which you're asked to enter the threshold value.

*I don't see the Add Alert button.* - Is this a group account to which you have read-only access? Check with the account administrator.

## <a name="diagnosis"></a>Diagnosing issues
Here are a few tips for finding and diagnosing performance issues:

* Set up [web tests][availability] to be alerted if your web site goes down or responds incorrectly or slowly. 
* Compare the Request count with other metrics to see if failures or slow response are related to load.
* [Insert and search trace statements][diagnostic] in your code to help pinpoint problems.
* Monitor your Web app in operation with [Live Metrics Stream][livestream].
* Capture the state of your .NET application with [Snapshot Debugger][snapshot].

## Find and fix performance bottlenecks with performance investigation experience

You can use the performance investigation experience to review slow performing operations in your Web app. You can quickly select a specific slow operation and use [Profiler](../../azure-monitor/app/profiler.md) to root cause the slow operations down to code. Using the new duration distribution shown for the selected operation you can quickly at a glance assess just how bad the experience is for your customers. You can see how many of your user interactions were impacted for each slow operation. In the following example, we've decided to take a closer look at the experience for GET Customers/Details operation. In the duration distribution, we can see that there are three spikes. Leftmost spike is around 400 ms and represents great responsive experience. Middle spike is around 1.2 s and represents a mediocre experience. Finally at the 3.6 s we have another small spike that represents the 99th percentile experience, which is likely to cause our customers to leave dissatisfied. That experience is ten times slower than the great experience for the same operation. 

![GET Customers/Details three duration spikes](./media/web-monitor-performance/PerformanceTriageViewZoomedDistribution.png)

To get a better sense of the user experiences for this operation, we can select a larger time range. We can then also narrow down in time on a specific time window where the operation was slow. In the following example, we've switched from the default 24 hours time range to the 7 days time range and then zoomed into the 9:47 to 12:47 time window between Tue the 12th and Wed the 13th. Both the duration distribution and the number of sample and profiler traces have been updated on the right.

![GET Customers/Details three duration spikes in 7 days range with a time window](./media/web-monitor-performance/PerformanceTriageView7DaysZoomedTrend.png)

To narrow in on the slow experiences, we next zoom into the durations that fall between 95th and the 99th percentile. These represent the 4% of user interactions that were slow.

![GET Customers/Details three duration spikes in 7 days range with a time window](./media/web-monitor-performance/PerformanceTriageView7DaysZoomedTrendZoomed95th99th.png)

We can now either look at the representative samples, by clicking on the Samples button, or at the representative profiler traces, by clicking on the Profiler traces button. In this example, there are four traces that have been collected for GET Customers/Details in the time window and range duration of interest.

Sometimes the issue will not be in your code, but rather in a dependency your code calls. You can switch to the Dependencies tab in the performance triage view to investigate such slow dependencies. By default the performance view is trending averages, but what you really want to look at is the 95th percentile (or the 99th, in case you are monitoring a mature service). In the following example we have focused on the slow Azure BLOB dependency, where we call PUT fabrikamaccount. The good experiences cluster around 40 ms, while the slow calls to the same dependency are three times slower, clustering around 120 ms. It doesn't take many of these calls to add up to cause the respective operation to noticeably slow down. You can drill into the representative samples and profiler traces, just like you can with the Operations tab.

![GET Customers/Details three duration spikes in 7 days range with a time window](./media/web-monitor-performance/SlowDependencies95thTrend.png)

The performance investigation experience shows relevant insights along side the sample set you decided to focus on. The best way to look at all of the available insights is to switch to a 30 days time range and then select Overall to see insights across all operations for the past month.

![GET Customers/Details three duration spikes in 7 days range with a time window](./media/web-monitor-performance/Performance30DayOveralllnsights.png)


## <a name="next"></a>Next steps
[Web tests][availability] - Have web requests sent to your application at regular intervals from around the world.

[Capture and search diagnostic traces][diagnostic] - Insert trace calls and sift through the results to pinpoint issues.

[Usage tracking][usage] - Find out how people use your application.

[Troubleshooting][qna] - and Q & A



<!--Link references-->

[availability]: ../../azure-monitor/app/monitor-web-app-availability.md
[diagnostic]: ../../azure-monitor/app/diagnostic-search.md
[greenbrown]: ../../azure-monitor/app/asp-net.md
[qna]: ../../azure-monitor/app/troubleshoot-faq.md
[redfield]: ../../azure-monitor/app/monitor-performance-live-website-now.md
[start]: ../../azure-monitor/app/app-insights-overview.md
[usage]: usage-overview.md
[livestream]: ../../azure-monitor/app/live-stream.md
[snapshot]: ../../azure-monitor/app/snapshot-debugger.md



