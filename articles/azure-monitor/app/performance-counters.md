---
title: Performance counters in Application Insights | Microsoft Docs
description: Monitor system and custom .NET performance counters in Application Insights.
ms.topic: conceptual
ms.date: 01/06/2023
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
ms.reviewer: rijolly
---

# System performance counters in Application Insights

Windows provides a variety of [performance counters](/windows/desktop/perfctrs/about-performance-counters), such as those used to gather processor, memory, and disk usage statistics. You can also define your own performance counters. 

Performance counters collection is supported if your application is running under IIS on an on-premises host or is a virtual machine to which you have administrative access. Although applications running as Azure Web Apps don't have direct access to performance counters, a subset of available counters is collected by Application Insights.

[!INCLUDE [azure-monitor-app-insights-otel-available-notification](../includes/azure-monitor-app-insights-otel-available-notification.md)]

## Prerequisites

Grant the app pool service account permission to monitor performance counters by adding it to the [Performance Monitor Users](/windows/security/identity-protection/access-control/active-directory-security-groups#bkmk-perfmonitorusers) group.

```shell
net localgroup "Performance Monitor Users" /add "IIS APPPOOL\NameOfYourPool"
```

## View counters

The **Metrics** pane shows the default set of performance counters.

:::image type="content" source="./media/performance-counters/performance-counters.png" lightbox="./media/performance-counters/performance-counters.png" alt-text="Screenshot that shows performance counters reported in Application Insights.":::

Current default counters for ASP.NET web applications:

- % Process\\Processor Time
- % Process\\Processor Time Normalized
- Memory\\Available Bytes
- ASP.NET Requests/Sec
- .NET CLR Exceptions Thrown / sec
- ASP.NET ApplicationsRequest Execution Time
- Process\\Private Bytes
- Process\\IO Data Bytes/sec
- ASP.NET Applications\\Requests In Application Queue
- Processor(_Total)\\% Processor Time

Current default counters collected for ASP.NET Core web applications:

- % Process\\Processor Time
- % Process\\Processor Time Normalized
- Memory\\Available Bytes
- Process\\Private Bytes
- Process\\IO Data Bytes/sec
- Processor(_Total)\\% Processor Time

## Add counters

If the performance counter you want isn't included in the list of metrics, you can add it.

1. Find out what counters are available in your server by using this PowerShell command on the local server:

    ```shell
    Get-Counter -ListSet *
    ```

    For more information, see [`Get-Counter`](/powershell/module/microsoft.powershell.diagnostics/get-counter).

1. Open `ApplicationInsights.config`.

    If you added Application Insights to your app during development:
    1. Edit `ApplicationInsights.config` in your project.
    1. Redeploy it to your servers.

1. Edit the performance collector directive:

    ```xml

        <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.PerformanceCollectorModule, Microsoft.AI.PerfCounterCollector">
          <Counters>
            <Add PerformanceCounter="\Objects\Processes"/>
            <Add PerformanceCounter="\Sales(photo)\# Items Sold" ReportAs="Photo sales"/>
          </Counters>
        </Add>
    ```

> [!NOTE]
> ASP.NET Core applications don't have `ApplicationInsights.config`, so the preceding method isn't valid for ASP.NET Core applications.

You can capture both standard counters and counters you've implemented yourself. `\Objects\Processes` is an example of a standard counter that's available on all Windows systems. `\Sales(photo)\# Items Sold` is an example of a custom counter that might be implemented in a web service.

The format is `\Category(instance)\Counter`, or for categories that don't have instances, just `\Category\Counter`.

The `ReportAs` parameter is required for counter names that don't match `[a-zA-Z()/-_ \.]+`. That is, they contain characters that aren't in the following sets: letters, round brackets, forward slash, hyphen, underscore, space, and dot.

If you specify an instance, it will be collected as a dimension `CounterInstanceName` of the reported metric.

### Collect performance counters in code for ASP.NET web applications or .NET/.NET Core console applications
To collect system performance counters and send them to Application Insights, you can adapt the following snippet:

```csharp
    var perfCollectorModule = new PerformanceCollectorModule();
    perfCollectorModule.Counters.Add(new PerformanceCounterCollectionRequest(
      @"\Process([replace-with-application-process-name])\Page Faults/sec", "PageFaultsPerfSec"));
    perfCollectorModule.Initialize(TelemetryConfiguration.Active);
```

Or you can do the same thing with custom metrics that you created:

```csharp
    var perfCollectorModule = new PerformanceCollectorModule();
    perfCollectorModule.Counters.Add(new PerformanceCounterCollectionRequest(
      @"\Sales(photo)\# Items Sold", "Photo sales"));
    perfCollectorModule.Initialize(TelemetryConfiguration.Active);
```

### Collect performance counters in code for ASP.NET Core web applications

### [ASP.NET Core 6 and later](#tab/net-core-new)

Configure `PerformanceCollectorModule` after the `WebApplication.CreateBuilder()` method in `Program.cs`:

```csharp
using Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationInsightsTelemetry();

// The following configures PerformanceCollectorModule.

builder.Services.ConfigureTelemetryModule<PerformanceCollectorModule>((module, o) =>
    {
        // The application process name could be "dotnet" for ASP.NET Core self-hosted applications.
        module.Counters.Add(new PerformanceCounterCollectionRequest(@"\Process([replace-with-application-process-name])\Page Faults/sec", "DotnetPageFaultsPerfSec"));
    });

var app = builder.Build();
```

### [ASP.NET Core 5 and earlier](#tab/net-core-old)

Configure `PerformanceCollectorModule` in the `ConfigureServices()` method in `Startup.cs`:

```csharp
using Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector;

public void ConfigureServices(IServiceCollection services)
{
    services.AddApplicationInsightsTelemetry();

    // The following configures PerformanceCollectorModule:
    services.ConfigureTelemetryModule<PerformanceCollectorModule>((module, o) =>
        {
            // The application process name could be "dotnet" for ASP.NET Core self-hosted applications.
            module.Counters.Add(new PerformanceCounterCollectionRequest(@"\Process([replace-with-application-process-name])\PageFaults/sec", "DotnetPageFaultsPerfSec"));
        });
}
```

---

## Performance counters in Log Analytics
You can search and display performance counter reports in [Log Analytics](../logs/log-query-overview.md).

The **performanceCounters** schema exposes the `category`, `counter` name, and `instance` name of each performance counter. In the telemetry for each application, you'll see only the counters for that application. For example, to see what counters are available:

:::image type="content" source="./media/performance-counters/analytics-performance-counters.png" lightbox="./media/performance-counters/analytics-performance-counters.png" alt-text="Screenshot that shows performance counters in Application Insights analytics.":::

Here, `Instance` refers to the performance counter instance, not the role or server machine instance. The performance counter instance name typically segments counters, such as processor time, by the name of the process or application.

To get a chart of available memory over the recent period:

:::image type="content" source="./media/performance-counters/analytics-available-memory.png" lightbox="./media/performance-counters/analytics-available-memory.png" alt-text="Screenshot that shows a memory time chart in Application Insights analytics.":::

Like other telemetry, **performanceCounters** also has a column `cloud_RoleInstance` that indicates the identity of the host server instance on which your app is running. For example, to compare the performance of your app on the different machines:

:::image type="content" source="./media/performance-counters/analytics-metrics-role-instance.png" lightbox="./media/performance-counters/analytics-metrics-role-instance.png" alt-text="Screenshot that shows performance segmented by role instance in Application Insights analytics.":::

## ASP.NET and Application Insights counts

The next sections discuss ASP.NET and Application Insights counts.

### What's the difference between the Exception rate and Exceptions metrics?

* `Exception rate`: The Exception rate is a system performance counter. The CLR counts all the handled and unhandled exceptions that are thrown and divides the total in a sampling interval by the length of the interval. The Application Insights SDK collects this result and sends it to the portal.
* `Exceptions`: The Exceptions metric is a count of the `TrackException` reports received by the portal in the sampling interval of the chart. It includes only the handled exceptions where you've written `TrackException` calls in your code. It doesn't include all [unhandled exceptions](./asp-net-exceptions.md).

## Performance counters for applications running in Azure Web Apps and Windows containers on Azure App Service

Both ASP.NET and ASP.NET Core applications deployed to Azure Web Apps run in a special sandbox environment. Applications deployed to Azure App Service can utilize a [Windows container](../../app-service/quickstart-custom-container.md?pivots=container-windows&tabs=dotnet) or be hosted in a sandbox environment. If the application is deployed in a Windows container, all standard performance counters are available in the container image.

The sandbox environment doesn't allow direct access to system performance counters. However, a limited subset of counters is exposed as environment variables as described in [Perf Counters exposed as environment variables](https://github.com/projectkudu/kudu/wiki/Perf-Counters-exposed-as-environment-variables). Only a subset of counters is available in this environment. For the full list, see [Perf Counters exposed as environment variables](https://github.com/microsoft/ApplicationInsights-dotnet/blob/main/WEB/Src/PerformanceCollector/PerformanceCollector/Implementation/WebAppPerformanceCollector/CounterFactory.cs).

The Application Insights SDK for [ASP.NET](https://nuget.org/packages/Microsoft.ApplicationInsights.Web) and [ASP.NET Core](https://nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) detects if code is deployed to a web app or a non-Windows container. The detection determines whether it collects performance counters in a sandbox environment or utilizes the standard collection mechanism when hosted on a Windows container or virtual machine.

## Performance counters in ASP.NET Core applications

Support for performance counters in ASP.NET Core is limited:

* [SDK](https://nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) versions 2.4.1 and later collect performance counters if the application is running in Azure Web Apps (Windows).
* SDK versions 2.7.1 and later collect performance counters if the application is running in Windows and targets `NETSTANDARD2.0` or later.
* For applications that target the .NET Framework, all versions of the SDK support performance counters.
* SDK versions 2.8.0 and later support the CPU/Memory counter in Linux. No other counter is supported in Linux. To get system counters in Linux (and other non-Windows environments), use [EventCounters](eventcounters.md).

## Alerts
Like other metrics, you can [set an alert](../alerts/alerts-log.md) to warn you if a performance counter goes outside a limit you specify. To set an alert, open the **Alerts** pane and select **Add Alert**.

## <a name="next"></a>Next steps

* [Dependency tracking](./asp-net-dependencies.md)
* [Exception tracking](./asp-net-exceptions.md)
