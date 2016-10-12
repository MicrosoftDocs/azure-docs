<properties 
	pageTitle="Performance counters in Application Insights" 
	description="Monitor system and custom .NET performance counters in Application Insights." 
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
	ms.date="10/11/2016" 
	ms.author="awills"/>
 
# System performance counters in Application Insights


Windows provides a wide variety of [performance counters](http://www.codeproject.com/Articles/8590/An-Introduction-To-Performance-Counters) such as CPU occupancy, memory, disk and network usage. You can also define your own. [Application Insights][app-insights-overview.md] can show these performance counters if your application is running on an on-premises host or virtual machine to which you have administrative access. The charts indicate the resources available to your live application, and can help to identify unbalanced load between server instances.

Performance counters appear in the Servers blade, which includes a table that segments by server instance.

![Performance counters reported in Application Insights](./media/app-insights-performance-counters/counters-by-server-instance.png)

(For web applications on Azure, [send Azure Diagnostics to Application Insights](app-insights-azure-diagnostics.md).)

## Configure performance counter collection

### Install Status Monitor

If Application Insights Status Monitor isn't yet installed on your server machines, you'll need to install it in order to see performance counters.

Download and run [Status Monitor installer](http://go.microsoft.com/fwlink/?LinkId=506648) on each server instance in order to see performance counters. If it's already installed, you don't need to install it again.

* *I [installed the Application Insights SDK in my app](app-insights-asp-net.md) during development. Do I still need Status Monitor?*

    Yes, Status Monitor is required to collect performance counters for ASP.NET web apps. As you might already know, Status Monitor can also be used to [monitor web apps that are already live](app-insights-monitor-performance-live-website-now.md), without installing the SDK during development.


## View performance counters

The Servers blade shows a default set of counters. The blade is a [Metrics Explorer](app-insights-metrics-explorer.md) blade, so you can adjust the time range and filters for the blade, and edit the charts that are displayed.

You can edit a chart to display different performance counters. The available counters are listed when you edit a chart.

![Performance counters reported in Application Insights](./media/app-insights-performance-counters/choose-performance-counters.png)

## Collect additional counters

The available counters are those that Application Insights collects by default. But a wider range of performance counters is generated in your server, and you can configure Application Insights to collect them.

The complete set of metrics available on your server can be determined on by using the PowerShell command: [`Get-Counter -ListSet *`](https://technet.microsoft.com/library/hh849685.aspx).

If the counters you want aren't in the metrics list, you can add them to the set that the SDK collects. 

1. Open ApplicationInsights.config.

 * If you added Application Insights to your app during development, edit the .config file in your project, and then re-deploy it to your servers.
 * If you used Status Monitor to instrument an app at runtime, you'll find ApplicationInsights.config in the root directory of the app. Edit it there, and copy the result to each server instance.

2. Edit the performance collector directive:

 ```XML

    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.PerformanceCollectorModule, Microsoft.AI.PerfCounterCollector">
      <Counters>
        <Add PerformanceCounter="\Objects\Processes"/>
        <Add PerformanceCounter="\Sales(electronics)\# Items Sold" ReportAs="Item sales"/>
      </Counters>
    </Add>

```

You can capture both standard counters, and those you have implemented yourself. `\Objects\Processes` is an example of a standard counter, available on all Windows systems. `\Sales(electronics)\# Items Sold` is an example of a custom counter that might be implemented in a web server. 

The format is `\Category(instance)\Counter"`, or for categories that don't have instances, just `\Category\Counter`.

`ReportAs` is required for counter names that contain special characters that are not in the following sets: letters, round brackets, forward slash, hyphen, underscore, space, dot.

If you specify an instance, it will be collected as a dimension "CounterInstanceName" of the reported metric.

### Collecting performance counters in code

To collect system performance counters and push them to Application Insights, you can use the snippet below:

    var perfCollectorModule = new PerformanceCollectorModule();
    perfCollectorModule.Counters.Add(new PerformanceCounterCollectionRequest(
      @"\.NET CLR Memory([replace-with-application-process-name])\# GC Handles", "GC Handles")));
    perfCollectorModule.Initialize(TelemetryConfiguration.Active);

Or you can do the same thing with custom metrics you created:

    var perfCollectorModule = new PerformanceCollectorModule();
    perfCollectorModule.Counters.Add(new PerformanceCounterCollectionRequest(
      @"\Sales(electronics)\# Items Sold", "Items sold"));
    perfCollectorModule.Initialize(TelemetryConfiguration.Active);

## Performance counters in Analytics

You can search and display performance counter reports in [Analytics](app-insights-analytics.md).


The **performanceCounters** schema exposes the `category`, `counter` name, and `instance` name of each performance counter. Counter instance names are only applicable to some performance counters, and typically indicate the name of the process to which the count relates. In the telemetry for each application, you’ll see only the counters for that application. For example, to see what counters are available: 

![Performance counters in Application Insights analytics](./media/app-insights-analytics-tour/analytics-performance-counters.png)

For example, to get a chart of available memory over the recent period: 

![Memory timechart in Application Insights analytics](./media/app-insights-analytics-tour/analytics-available-memory.png)


Like other telemetry, **performanceCounters** also has a column `cloud_RoleInstance` that indicates the identity of the host server instance on which your app is running. For example, to compare the performance of your app on the different machines: 

![Performance segmented by role instance in Application Insights analytics](./media/app-insights-analytics-tour/analytics-metrics-role-instance.png)


## ASP.NET and Application Insights counts

*What's the difference between the Exception rate and Exceptions metrics?*

* *Exception rate* is a system performance counter. The CLR counts all the handled and unhandled exceptions that are thrown, and divides the total in a sampling interval by the length of the interval. The Application Insights SDK collects this result and sends it to the portal.
* *Exceptions* is a count of the TrackException reports received by the portal in the sampling interval of the chart. It includes only the handled exceptions where you have written TrackException calls in your code, and doesn't include all [unhandled exceptions](app-insights-asp-net-exceptions.md). 

## Alerts

Like other metrics, you can [set an alert](app-insights-alerts.md) to warn you if a performance counter goes outside a limit you specify. Open the Alerts blade and click Add Alert.


## <a name="next"></a>Next steps

* [Dependency tracking](app-insights-asp-net-dependencies.md)
* [Exception tracking](app-insights-asp-net-exceptions.md)