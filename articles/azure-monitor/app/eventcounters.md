---
title: Event counters in Application Insights | Microsoft Docs
description: Monitor system and custom .NET/.NET Core EventCounters in Application Insights.
ms.topic: conceptual
ms.date: 09/20/2019
ms.custom: devx-track-csharp

---

# EventCounters introduction

[`EventCounter`](/dotnet/core/diagnostics/event-counters) is .NET/.NET Core mechanism to publish and consume counters or statistics. EventCounters are supported in all OS platforms - Windows, Linux, and macOS. It can be thought of as a cross-platform equivalent for the [PerformanceCounters](/dotnet/api/system.diagnostics.performancecounter) that is only supported in Windows systems.

While users can publish any custom `EventCounters` to meet their needs, .NET Core 3.0 and higher runtime publishes a set of these counters by default. This document will walk through the steps required to collect and view `EventCounters` (system defined or user defined) in Azure Application Insights.

## Using Application Insights to collect EventCounters

Application Insights supports collecting `EventCounters` with its `EventCounterCollectionModule`, which is part of the newly released NuGet package [Microsoft.ApplicationInsights.EventCounterCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.EventCounterCollector). `EventCounterCollectionModule` is automatically enabled when using either [AspNetCore](asp-net-core.md) or [WorkerService](worker-service.md). `EventCounterCollectionModule` collects counters with a non-configurable collection frequency of 60 seconds. There are no special permissions required to collect EventCounters.

## Default counters collected

Starting with 2.15.0 version of either [AspNetCore SDK](asp-net-core.md) or [WorkerService SDK](worker-service.md), no counters are collected by default. The module itself is enabled, so users can simply add the desired counters to
collect them.

To get a list of well known counters published by the .NET Runtime, see [Available Counters](/dotnet/core/diagnostics/event-counters#available-counters) document.

## Customizing counters to be collected

The following example shows how to add/remove counters. This customization would be done in the `ConfigureServices` method of your application after Application Insights telemetry collection is enabled using either `AddApplicationInsightsTelemetry()` or `AddApplicationInsightsWorkerService()`. Following is an example code from an ASP.NET Core application. For other type of applications, refer to [this](worker-service.md#configuring-or-removing-default-telemetrymodules) document.

```csharp
    using Microsoft.ApplicationInsights.Extensibility.EventCounterCollector;
    using Microsoft.Extensions.DependencyInjection;

    public void ConfigureServices(IServiceCollection services)
    {
        //... other code...

        // The following code shows how to configure the module to collect
        // additional counters.
        services.ConfigureTelemetryModule<EventCounterCollectionModule>(
            (module, o) =>
            {
                // This removes all default counters, if any.
                module.Counters.Clear();

                // This adds a user defined counter "MyCounter" from EventSource named "MyEventSource"
                module.Counters.Add(new EventCounterCollectionRequest("MyEventSource", "MyCounter"));

                // This adds the system counter "gen-0-size" from "System.Runtime"
                module.Counters.Add(new EventCounterCollectionRequest("System.Runtime", "gen-0-size"));
            }
        );
    }
```

## Disabling EventCounter collection module

`EventCounterCollectionModule` can be disabled by using `ApplicationInsightsServiceOptions`. An
example when using ASP.NET Core SDK is shown below.

```csharp
    using Microsoft.ApplicationInsights.AspNetCore.Extensions;
    using Microsoft.Extensions.DependencyInjection;

    public void ConfigureServices(IServiceCollection services)
    {
        //... other code...

        var applicationInsightsServiceOptions = new ApplicationInsightsServiceOptions();
        applicationInsightsServiceOptions.EnableEventCounterCollectionModule = false;
        services.AddApplicationInsightsTelemetry(applicationInsightsServiceOptions);
    }
```

A similar approach can be used for the WorkerService SDK as well, but the namespace must be
changed as shown in the example below.

```csharp
    using Microsoft.ApplicationInsights.WorkerService;
    using Microsoft.Extensions.DependencyInjection;

    var applicationInsightsServiceOptions = new ApplicationInsightsServiceOptions();
    applicationInsightsServiceOptions.EnableEventCounterCollectionModule = false;
    services.AddApplicationInsightsTelemetryWorkerService(applicationInsightsServiceOptions);
```

## Event counters in Metric Explorer

To view EventCounter metrics in [Metric Explorer](../essentials/metrics-charts.md), select Application Insights resource, and chose Log-based metrics as metric namespace. Then EventCounter metrics get displayed under Custom category.

> [!div class="mx-imgBorder"]
> ![Event counters reported in Application Insights Metric Explorer](./media/event-counters/metrics-explorer-counter-list.png)

## Event counters in Analytics

You can also search and display event counter reports in [Analytics](../logs/log-query-overview.md), in the **customMetrics** table.

For example, run the following query to see what counters are collected and available to query:

```Kusto
customMetrics | summarize avg(value) by name
```

> [!div class="mx-imgBorder"]
> ![Event counters reported in Application Insights Analytics](./media/event-counters/analytics-event-counters.png)

To get a chart of a specific counter (for example: `ThreadPool Completed Work Item Count`) over the recent period, run the following query.

```Kusto
customMetrics 
| where name contains "System.Runtime|ThreadPool Completed Work Item Count"
| where timestamp >= ago(1h)
| summarize  avg(value) by cloud_RoleInstance, bin(timestamp, 1m)
| render timechart
```
> [!div class="mx-imgBorder"]
> ![Chat of a single counter in Application Insights](./media/event-counters/analytics-completeditems-counters.png)

Like other telemetry, **customMetrics** also has a column `cloud_RoleInstance` that indicates the identity of the host server instance on which your app is running. The above query shows the counter value per instance, and can be used to compare performance of different server instances.

## Alerts
Like other metrics, you can [set an alert](../alerts/alerts-log.md) to warn you if an event counter goes outside a limit you specify. Open the Alerts pane and click Add Alert.

## Frequently asked questions

### Can I see EventCounters in Live Metrics?

Live Metrics do not show EventCounters as of today. Use Metric Explorer or Analytics to see the telemetry.

### I have enabled Application Insights from Azure Web App Portal. But I can't see EventCounters.?

 [Application Insights extension](./azure-web-apps.md) for ASP.NET Core doesn't yet support this feature. This document will be updated when this feature is supported.

## <a name="next"></a>Next steps

* [Dependency tracking](./asp-net-dependencies.md)

