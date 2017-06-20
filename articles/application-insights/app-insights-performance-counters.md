---
title: Performance counters in Application Insights | Microsoft Docs
description: Monitor system and custom .NET performance counters in Application Insights.
services: application-insights
documentationcenter: ''
author: CFreemanwa
manager: carmonm

ms.assetid: 5b816f4c-a77a-4674-ae36-802ee3a2f56d
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 10/11/2016
ms.author: cfreeman

---
# System performance counters in Application Insights
Windows provides a wide variety of [performance counters](http://www.codeproject.com/Articles/8590/An-Introduction-To-Performance-Counters) such as CPU occupancy, memory, disk, and network usage. You can also define your own. [Application Insights](app-insights-overview.md) can show these performance counters if your application is running under IIS on an on-premises host or virtual machine to which you have administrative access. The charts indicate the resources available to your live application, and can help to identify unbalanced load between server instances.

Performance counters appear in the Servers blade, which includes a table that segments by server instance.

![Performance counters reported in Application Insights](./media/app-insights-performance-counters/counters-by-server-instance.png)

(Performance counters aren't available for Azure Web Apps. But you can [send Azure Diagnostics to Application Insights](app-insights-azure-diagnostics.md).)

## View counters
The Servers blade shows a default set of performance counters. 

To see other counters, either edit the charts on the Servers blade, or open a new [Metrics Explorer](app-insights-metrics-explorer.md) blade and add new charts. 

The available counters are listed as metrics when you edit a chart.

![Performance counters reported in Application Insights](./media/app-insights-performance-counters/choose-performance-counters.png)

To see all your most useful charts in one place, create a [dashboard](app-insights-dashboards.md) and pin them to it.

## Add counters
If the performance counter you want isn't shown in the list of metrics, that's because the Application Insights SDK isn't collecting it in your web server. You can configure it to do so.

1. Find out what counters are available in your server by using this PowerShell command at the server:
   
    `Get-Counter -ListSet *`
   
    (See [`Get-Counter`](https://technet.microsoft.com/library/hh849685.aspx).)
2. Open ApplicationInsights.config.
   
   * If you added Application Insights to your app during development, edit ApplicationInsights.config in your project, and then re-deploy it to your servers.
   * If you used Status Monitor to instrument a web app at runtime, find ApplicationInsights.config in the root directory of the app in IIS. Update it there in each server instance.
3. Edit the performance collector directive:
   
```XML
   
    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.PerformanceCollectorModule, Microsoft.AI.PerfCounterCollector">
      <Counters>
        <Add PerformanceCounter="\Objects\Processes"/>
        <Add PerformanceCounter="\Sales(photo)\# Items Sold" ReportAs="Photo sales"/>
      </Counters>
    </Add>

```

You can capture both standard counters and those you have implemented yourself. `\Objects\Processes` is an example of a standard counter, available on all Windows systems. `\Sales(photo)\# Items Sold` is an example of a custom counter that might be implemented in a web service. 

The format is `\Category(instance)\Counter"`, or for categories that don't have instances, just `\Category\Counter`.

`ReportAs` is required for counter names that do not match `[a-zA-Z()/-_ \.]+` - that is, they contain characters that are not in the following sets: letters, round brackets, forward slash, hyphen, underscore, space, dot.

If you specify an instance, it will be collected as a dimension "CounterInstanceName" of the reported metric.

### Collecting performance counters in code
To collect system performance counters and send them to Application Insights, you can adapt the snippet below:


``` C#

    var perfCollectorModule = new PerformanceCollectorModule();
    perfCollectorModule.Counters.Add(new PerformanceCounterCollectionRequest(
      @"\.NET CLR Memory([replace-with-application-process-name])\# GC Handles", "GC Handles")));
    perfCollectorModule.Initialize(TelemetryConfiguration.Active);
```

Or you can do the same thing with custom metrics you created:

``` C#
    var perfCollectorModule = new PerformanceCollectorModule();
    perfCollectorModule.Counters.Add(new PerformanceCounterCollectionRequest(
      @"\Sales(photo)\# Items Sold", "Photo sales"));
    perfCollectorModule.Initialize(TelemetryConfiguration.Active);
```

## Performance counters in Analytics
You can search and display performance counter reports in [Analytics](app-insights-analytics.md).

The **performanceCounters** schema exposes the `category`, `counter` name, and `instance` name of each performance counter.  In the telemetry for each application, you’ll see only the counters for that application. For example, to see what counters are available: 

![Performance counters in Application Insights analytics](./media/app-insights-performance-counters/analytics-performance-counters.png)

('Instance' here refers to the performance counter instance,  not the role or server machine instance. The performance counter instance name typically segments counters such as processor time by the name of the process or application.)

To get a chart of available memory over the recent period: 

![Memory timechart in Application Insights analytics](./media/app-insights-performance-counters/analytics-available-memory.png)

Like other telemetry, **performanceCounters** also has a column `cloud_RoleInstance` that indicates the identity of the host server instance on which your app is running. For example, to compare the performance of your app on the different machines: 

![Performance segmented by role instance in Application Insights analytics](./media/app-insights-performance-counters/analytics-metrics-role-instance.png)

## ASP.NET and Application Insights counts
*What's the difference between the Exception rate and Exceptions metrics?*

* *Exception rate* is a system performance counter. The CLR counts all the handled and unhandled exceptions that are thrown, and divides the total in a sampling interval by the length of the interval. The Application Insights SDK collects this result and sends it to the portal.
* *Exceptions* is a count of the TrackException reports received by the portal in the sampling interval of the chart. It includes only the handled exceptions where you have written TrackException calls in your code, and doesn't include all [unhandled exceptions](app-insights-asp-net-exceptions.md). 

## Alerts
Like other metrics, you can [set an alert](app-insights-alerts.md) to warn you if a performance counter goes outside a limit you specify. Open the Alerts blade and click Add Alert.

## <a name="next"></a>Next steps
* [Dependency tracking](app-insights-asp-net-dependencies.md)
* [Exception tracking](app-insights-asp-net-exceptions.md)

