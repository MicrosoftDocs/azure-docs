---
title: Event counters in Application Insights | Microsoft Docs
description: Monitor system and custom .NET/.NET Core EventCounters in Application Insights.
services: application-insights
documentationcenter: ''
author: cithomas
manager: carmonm
ms.assetid: 5b816f4c-a77a-4674-ae36-802ee3a2f56d
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 09/20/2019
ms.author: cithomas
---
# EventCounters introduction

`EventCounter` is .NET/.NET Core mechanism to publish and consume counters or statistics. [This](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.Tracing/documentation/EventCounterTutorial.md) document gives an overview of `EventCounters` and examples on how to publish and consume them. EventCounters are supported in all OS Platforms, and can be thought of as a cross-platform equivalent for the [PerformanceCounters](https://docs.microsoft.com/dotnet/api/system.diagnostics.performancecounter) which is only supported in Windows systems.

While users can publish any custom `EventCounters` to meet their needs, the .NET Core 3.0 ecosystem publishes a set of these counters out-of-the-box. The document will walk through the steps required to collect and view `EventCounters` (system defined or user defined) in Azure Application Insights.

# Using Application Insights to collect EventCounters

Application Insights supports collecting `EventCounters` with its `EventCounterCollectionModule`, which is part of the newly released nuget package [Microsoft.ApplicationInsights.EventCounterCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.EventCounterCollector). `EventCounterCollectionModule` is automatically enabled when using either [AspNetCore](asp-net-core.md) or [WorkerService](worker-service.md) instructions. `EventCounterCollectionModule` collects counters with a non-configurable collection frequency of 60 seconds.

## Default counters collected

For apps running in .NET Core 3.0 or higher, the following lists the default set of counters collected automatically by the SDK. These counters can be queried either in Metrics Explorer or using Analytics query. The name of the counters will be of the form "Category|Counter".

|Category | Counter|
|---------------|-------|
|`System.Runtime` | `cpu-usage` |
|`System.Runtime` | `working-set` |
|`System.Runtime` | `gc-heap-size` |
|`System.Runtime` | `gen-0-gc-count` |
|`System.Runtime` | `gen-1-gc-count` |
|`System.Runtime` | `gen-2-gc-count` |
|`System.Runtime` | `time-in-gc` |
|`System.Runtime` | `gen-0-size` |
|`System.Runtime` | `gen-1-size` |
|`System.Runtime` | `gen-2-size` |
|`System.Runtime` | `loh-size` |
|`System.Runtime` | `alloc-rate` |
|`System.Runtime` | `assembly-count` |
|`System.Runtime` | `exception-count` |
|`System.Runtime` | `threadpool-thread-count` |
|`System.Runtime` | `monitor-lock-contention-count` |
|`System.Runtime` | `threadpool-queue-length` |
|`System.Runtime` | `threadpool-completed-items-count` |
|`System.Runtime` | `active-timer-count` |
|`Microsoft.AspNetCore.Hosting` | `requests-per-second` |
|`Microsoft.AspNetCore.Hosting` | `total-requests` |
|`Microsoft.AspNetCore.Hosting` | `current-requests` |
|`Microsoft.AspNetCore.Hosting` | `failed-requests` |

Note: Counters of category Microsoft.AspNetCore.Hosting are only added in Asp.Net Core Applications.

## Customizing counters to be collected

The following shows how to add/remove counters. This would be done in `ConfigureServices` of your application after application insights telemetry collection is enabled using either `AddApplicationInsightsTelemetry()` or `AddApplicationInsightsWorkerService()`. Following is an example code from an Asp.Net Core application. For other type of applications, refer to [this](worker-service.md#configuring-or-removing-default-telemetrymodules) document.

```csharp
    using Microsoft.ApplicationInsights.Extensibility.EventCounterCollector;

    public void ConfigureServices(IServiceCollection services)
    {

        //... other code...

        // The following shows several customizations done to EventCounterCollectionModule.
        services.ConfigureTelemetryModule<EventCounterCollectionModule>(
                    (module, o) =>
                    {
                        // The following removes all default counters.
                        module.Counters.Clear();

                        // The following adds a user defined counter "MyCounter" from EventSource named "MyEventSource"
                        module.Counters.Add(new EventCounterCollectionRequest("MyEventSource", "MyCounter"));

                        // The following adds the system counter "gen-0-size" from "System.Runtime"
                        module.Counters.Add(new EventCounterCollectionRequest("System.Runtime", "gen-0-size"));
                    }
                );

        // The following removes EventCounterCollectionModule to disable the module completely.
        var eventCounterModule = services.FirstOrDefault<ServiceDescriptor>
                    (t => t.ImplementationType == typeof(EventCounterCollectionModule));
        if (eventCounterModule != null)
        {
            services.Remove(eventCounterModule);
        }
    }
```

## Event counters in Metric Explorer

To view EventCounter metrics in [Metric Explorer](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-charts), select Application Insights resource, and chose Log-based metrics as metric namespace. Then EventCounter metrics gets displayed under PerformanceCounter category.

![Event counters reported in Application Insights](./media/event-counters/meticsexplorer-counterlist.png)

## Event counters in Analytics

You can also search and display event counter reports in [Analytics](../../azure-monitor/app/analytics.md), in the **performanceCounters** table.

For example, run the following query to see what counters are collected and available to query:

```Kusto
performanceCounters | summarize count(), avg(value) by name
```

![Event counters reported in Application Insights](./media/event-counters/analytics-event-counters.png)

To get a chart of a specific counter (eg:) over the recent period:

```Kusto
performanceCounters 
| where name contains "System.Runtime|ThreadPool Completed Work Item Count"
| where timestamp >= ago(1h)
| summarize  avg(value) by cloud_RoleInstance, bin(timestamp, 1m)
| render timechart
```

![Chat of a single counter in Application Insights](./media/event-counters/analytics-completeditems-counters.png)

Like other telemetry, **performanceCounters** also has a column `cloud_RoleInstance` that indicates the identity of the host server instance on which your app is running. The above query shows the counter value per instance, and hence can be used to compare performance of different server instances.

## Alerts
Like other metrics, you can [set an alert](../../azure-monitor/app/alerts.md) to warn you if an event counter goes outside a limit you specify. Open the Alerts pane and click Add Alert.

## <a name="next"></a>Next steps

* [Dependency tracking](../../azure-monitor/app/asp-net-dependencies.md)