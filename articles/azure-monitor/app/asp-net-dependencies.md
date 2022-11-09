---
title: Dependency tracking in Application Insights | Microsoft Docs
description: Monitor dependency calls from your on-premises or Azure web application with Application Insights.
ms.topic: conceptual
ms.date: 08/26/2020
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.reviewer: casocha
---

# Dependency tracking in Application Insights

A *dependency* is a component that's called by your application. It's typically a service called by using HTTP, a database, or a file system. [Application Insights](./app-insights-overview.md) measures the duration of dependency calls and whether it's failing or not, along with information like the name of the dependency. You can investigate specific dependency calls and correlate them to requests and exceptions.

## Automatically tracked dependencies

Application Insights SDKs for .NET and .NET Core ship with `DependencyTrackingTelemetryModule`, which is a telemetry module that automatically collects dependencies. This dependency collection is enabled automatically for [ASP.NET](./asp-net.md) and [ASP.NET Core](./asp-net-core.md) applications when it's configured according to the linked official docs. The module `DependencyTrackingTelemetryModule` is shipped as the [Microsoft.ApplicationInsights.DependencyCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector/) NuGet package. It's brought automatically when you use either the `Microsoft.ApplicationInsights.Web` NuGet package or the `Microsoft.ApplicationInsights.AspNetCore` NuGet package.

 Currently, `DependencyTrackingTelemetryModule` tracks the following dependencies automatically:

|Dependencies |Details|
|---------------|-------|
|HTTP/HTTPS | Local or remote HTTP/HTTPS calls. |
|WCF calls| Only tracked automatically if HTTP-based bindings are used.|
|SQL | Calls made with `SqlClient`. See the section [Advanced SQL tracking to get full SQL query](#advanced-sql-tracking-to-get-full-sql-query) for capturing SQL queries. |
|[Azure Blob Storage, Table Storage, or Queue Storage](https://www.nuget.org/packages/WindowsAzure.Storage/) | Calls made with the Azure Storage client. |
|[Azure Event Hubs client SDK](https://nuget.org/packages/Azure.Messaging.EventHubs) | Use the latest package: https://nuget.org/packages/Azure.Messaging.EventHubs. |
|[Azure Service Bus client SDK](https://nuget.org/packages/Azure.Messaging.ServiceBus)| Use the latest package: https://nuget.org/packages/Azure.Messaging.ServiceBus. |
|Azure Cosmos DB | Only tracked automatically if HTTP/HTTPS is used. TCP mode won't be captured by Application Insights. |

If you're missing a dependency or using a different SDK, make sure it's in the list of [autocollected dependencies](./auto-collect-dependencies.md). If the dependency isn't autocollected, you can track it manually with a [track dependency call](./api-custom-events-metrics.md#trackdependency).

## Set up automatic dependency tracking in console apps

To automatically track dependencies from .NET console apps, install the NuGet package `Microsoft.ApplicationInsights.DependencyCollector` and initialize `DependencyTrackingTelemetryModule`:

```csharp
    DependencyTrackingTelemetryModule depModule = new DependencyTrackingTelemetryModule();
    depModule.Initialize(TelemetryConfiguration.Active);
```

For .NET Core console apps, `TelemetryConfiguration.Active` is obsolete. See the guidance in the [Worker service documentation](./worker-service.md) and the [ASP.NET Core monitoring documentation](./asp-net-core.md).

### How does automatic dependency monitoring work?

Dependencies are automatically collected by using one of the following techniques:

* Using byte code instrumentation around select methods. Use `InstrumentationEngine` either from `StatusMonitor` or an Azure App Service Web Apps extension.
* `EventSource` callbacks.
* `DiagnosticSource` callbacks in the latest .NET or .NET Core SDKs.

## Manually tracking dependencies

The following examples of dependencies, which aren't automatically collected, require manual tracking:

* Azure Cosmos DB is tracked automatically only if [HTTP/HTTPS](../../cosmos-db/performance-tips.md#networking) is used. TCP mode won't be captured by Application Insights.
* Redis

For those dependencies not automatically collected by SDK, you can track them manually by using the [TrackDependency API](api-custom-events-metrics.md#trackdependency) that's used by the standard autocollection modules.

**Example**

If you build your code with an assembly that you didn't write yourself, you could time all the calls to it. This scenario would allow you to find out what contribution it makes to your response times.

To have this data displayed in the dependency charts in Application Insights, send it by using `TrackDependency`:

```csharp

    var startTime = DateTime.UtcNow;
    var timer = System.Diagnostics.Stopwatch.StartNew();
    try
    {
        // making dependency call
        success = dependency.Call();
    }
    finally
    {
        timer.Stop();
        telemetryClient.TrackDependency("myDependencyType", "myDependencyCall", "myDependencyData",  startTime, timer.Elapsed, success);
    }
```

Alternatively, `TelemetryClient` provides the extension methods `StartOperation` and `StopOperation`, which can be used to manually track dependencies as shown in [Outgoing dependencies tracking](custom-operations-tracking.md#outgoing-dependencies-tracking).

If you want to switch off the standard dependency tracking module, remove the reference to `DependencyTrackingTelemetryModule` in [ApplicationInsights.config](../../azure-monitor/app/configuration-with-applicationinsights-config.md) for ASP.NET applications. For ASP.NET Core applications, follow the instructions in [Application Insights for ASP.NET Core applications](asp-net-core.md#configuring-or-removing-default-telemetrymodules).

## Track AJAX calls from webpages

For webpages, the Application Insights JavaScript SDK automatically collects AJAX calls as dependencies.

## Advanced SQL tracking to get full SQL query

> [!NOTE]
> Azure Functions requires separate settings to enable SQL text collection. Within [host.json](../../azure-functions/functions-host-json.md#applicationinsights), set `"EnableDependencyTracking": true,` and `"DependencyTrackingOptions": { "enableSqlCommandTextInstrumentation": true }` in `applicationInsights`.

For SQL calls, the name of the server and database is always collected and stored as the name of the collected `DependencyTelemetry`. Another field, called data, can contain the full SQL query text.

For ASP.NET Core applications, It's now required to opt in to SQL Text collection by using:

```csharp
services.ConfigureTelemetryModule<DependencyTrackingTelemetryModule>((module, o) => { module. EnableSqlCommandTextInstrumentation = true; });
```

For ASP.NET applications, the full SQL query text is collected with the help of byte code instrumentation, which requires using the instrumentation engine or by using the [Microsoft.Data.SqlClient](https://www.nuget.org/packages/Microsoft.Data.SqlClient) NuGet package instead of the System.Data.SqlClient library. Platform-specific steps to enable full SQL Query collection are described in the following table.

| Platform | Steps needed to get full SQL query |
| --- | --- |
| Web Apps in Azure App Service|In your web app control panel, [open the Application Insights pane](../../azure-monitor/app/azure-web-apps.md) and enable SQL Commands under .NET. |
| IIS Server (Azure Virtual Machines, on-premises, and so on) | Either use the [Microsoft.Data.SqlClient](https://www.nuget.org/packages/Microsoft.Data.SqlClient) NuGet package or use the Status Monitor PowerShell Module to [install the instrumentation engine](../../azure-monitor/app/status-monitor-v2-api-reference.md#enable-instrumentationengine) and restart IIS. |
| Azure Cloud Services | Add a [startup task to install StatusMonitor](../../azure-monitor/app/azure-web-apps-net-core.md). <br> Your app should be onboarded to the ApplicationInsights SDK at build time by installing NuGet packages for [ASP.NET](./asp-net.md) or [ASP.NET Core applications](./asp-net-core.md). |
| IIS Express | Use the [Microsoft.Data.SqlClient](https://www.nuget.org/packages/Microsoft.Data.SqlClient) NuGet package.
| WebJobs in Azure App Service| Use the [Microsoft.Data.SqlClient](https://www.nuget.org/packages/Microsoft.Data.SqlClient) NuGet package.

In addition to the preceding platform-specific steps, you *must also explicitly opt in to enable SQL command collection* by modifying the `applicationInsights.config` file with the following code:

```xml
<TelemetryModules>
  <Add Type="Microsoft.ApplicationInsights.DependencyCollector.DependencyTrackingTelemetryModule, Microsoft.AI.DependencyCollector">
    <EnableSqlCommandTextInstrumentation>true</EnableSqlCommandTextInstrumentation>
  </Add>
```

In the preceding cases, the proper way of validating that the instrumentation engine is correctly installed is by validating that the SDK version of collected `DependencyTelemetry` is `rddp`. Use of `rdddsd` or `rddf` indicates dependencies are collected via `DiagnosticSource` or `EventSource` callbacks, so the full SQL query won't be captured.

## Where to find dependency data

* [Application Map](app-map.md) visualizes dependencies between your app and neighboring components.
* [Transaction Diagnostics](transaction-diagnostics.md) shows unified, correlated server data.
* [Browsers tab](javascript.md) shows AJAX calls from your users' browsers.
* Select from slow or failed requests to check their dependency calls.
* [Analytics](#logs-analytics) can be used to query dependency data.

## <a name="diagnosis"></a> Diagnose slow requests

Each request event is associated with the dependency calls, exceptions, and other events tracked while processing the request. So, if some requests are doing badly, you can find out whether it's because of slow responses from a dependency.

### Tracing from requests to dependencies

Select the **Performance** tab on the left and select the **Dependencies** tab at the top.

Select a **Dependency Name** under **Overall**. After you select a dependency, a graph of that dependency's distribution of durations appears on the right.

![Screenshot that shows the Dependencies tab open to select a Dependency Name in the chart.](./media/asp-net-dependencies/2-perf-dependencies.png)

Select the **Samples** button at the bottom right. Then select a sample to see the end-to-end transaction details.

![Screenshot that shows selecting a sample to see the end-to-end transaction details.](./media/asp-net-dependencies/3-end-to-end.png)

### Profile your live site

The [Application Insights profiler](../../azure-monitor/app/profiler.md) traces HTTP calls to your live site and shows you the functions in your code that took the longest time.

## Failed requests

Failed requests might also be associated with failed calls to dependencies.

Select the **Failures** tab on the left and then select the **Dependencies** tab at the top.

![Screenshot that shows selecting the failed requests chart.](./media/asp-net-dependencies/4-fail.png)

Here you'll see the failed dependency count. To get more information about a failed occurrence, select a **Dependency Name** in the bottom table. Select the **Dependencies** button at the bottom right to see the end-to-end transaction details.

## Logs (Analytics)

You can track dependencies in the [Kusto query language](/azure/kusto/query/). Here are some examples.

* Find any failed dependency calls:
    
    ``` Kusto
    
        dependencies | where success != "True" | take 10
    ```

* Find AJAX calls:

    ``` Kusto
    
        dependencies | where client_Type == "Browser" | take 10
    ```

* Find dependency calls associated with requests:
    
    ``` Kusto
    
        dependencies
        | where timestamp > ago(1d) and  client_Type != "Browser"
        | join (requests | where timestamp > ago(1d))
          on operation_Id  
    ```

* Find AJAX calls associated with page views:
    
    ``` Kusto 
    
        dependencies
        | where timestamp > ago(1d) and  client_Type == "Browser"
        | join (browserTimings | where timestamp > ago(1d))
          on operation_Id
    ```

## Frequently asked questions

This section provides answers to common questions.

### How does the automatic dependency collector report failed calls to dependencies?

Failed dependency calls will have the `success` field set to False. The module `DependencyTrackingTelemetryModule` doesn't report `ExceptionTelemetry`. The full data model for dependency is described [Dependency telemetry: Application Insights data model](data-model-dependency-telemetry.md).

### How do I calculate ingestion latency for my dependency telemetry?

Use this code:

```kusto
dependencies
| extend E2EIngestionLatency = ingestion_time() - timestamp 
| extend TimeIngested = ingestion_time()
```

### How do I determine the time the dependency call was initiated?

In the Log Analytics query view, `timestamp` represents the moment the TrackDependency() call was initiated, which occurs immediately after the dependency call response is received. To calculate the time when the dependency call began, you would take `timestamp` and subtract the recorded `duration` of the dependency call.

## Open-source SDK

Like every Application Insights SDK, the dependency collection module is also open source. Read and contribute to the code or report issues at [the official GitHub repo](https://github.com/Microsoft/ApplicationInsights-dotnet).

## Next steps

* [Exceptions](./asp-net-exceptions.md)
* [User and page data](./javascript.md)
* [Availability](./monitor-web-app-availability.md)