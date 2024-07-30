---
title: Diagnose with live metrics - Application Insights - Azure Monitor
description: Monitor your web app in real time with custom metrics, and diagnose issues with a live feed of failures, traces, and events.
ms.topic: conceptual
ms.date: 08/11/2023
ms.reviewer: sdash
ms.devlang: csharp
---

# Live metrics: Monitor and diagnose with 1-second latency

Monitor your live, in-production web application by using live metrics (also known as QuickPulse) from [Application Insights](./app-insights-overview.md). You can select and filter metrics and performance counters to watch in real time, without any disturbance to your service. You can also inspect stack traces from sample failed requests and exceptions. Together with [Profiler](./profiler.md) and [Snapshot Debugger](./snapshot-debugger.md), live metrics provide a powerful and noninvasive diagnostic tool for your live website.

> [!NOTE]
> Live metrics only support TLS 1.2. For more information, see [Troubleshooting](#troubleshooting).

With live metrics, you can:

* Validate a fix while it's released by watching performance and failure counts.
* Watch the effect of test loads and diagnose issues live.
* Focus on particular test sessions or filter out known issues by selecting and filtering the metrics you want to watch.
* Get exception traces as they happen.
* Experiment with filters to find the most relevant KPIs.
* Monitor any Windows performance counter live.
* Easily identify a server that's having issues and filter all the KPI/live feed to just that server.

:::image type="content" source="./media/live-stream/live-metric.png" lightbox="./media/live-stream/live-metric.png" alt-text="Screenshot that shows the live metrics tab.":::

Live metrics are currently supported for ASP.NET, ASP.NET Core, Azure Functions, Java, and Node.js apps.

> [!NOTE]
> The number of monitored server instances displayed by live metrics might be lower than the actual number of instances allocated for the application. This mismatch is because many modern web servers will unload applications that don't receive requests over a period of time to conserve resources. Because live metrics only count servers that are currently running the application, servers that have already unloaded the process won't be included in that total.

## Get started

> [!IMPORTANT]
> To enable Application Insights, ensure that it's activated in the Azure portal and your app is using a recent version of the [Azure Monitor OpenTelemetry Distro](opentelemetry-enable.md) or Classic [Application Insights](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) NuGet package. Without the NuGet package, some telemetry is sent to Application Insights, but that telemetry won't show in the live metrics pane.

1. Follow language-specific guidelines to enable live metrics:

  # [OpenTelemetry (Recommended)](#tab/otel)

   * [ASP.NET](opentelemetry-enable.md?tabs=net): *Not supported*.
   * [ASP.NET Core](opentelemetry-enable.md?tabs=aspnetcore): Enabled by default.
   * [Java](./opentelemetry-enable.md?tabs=java): Enabled by default.
   * [Node.js](opentelemetry-enable.md?tabs=nodejs): Enabled by default.
   * [Python](opentelemetry-enable.md?tabs=python): Pass `enable_live_metrics=True` into `configure_azure_monitor`. See the [Azure Monitor OpenTelemetry Distro](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/monitor/azure-monitor-opentelemetry#usage) documentation for more information.
  
  # [Classic API](#tab/classic)
  
   * [ASP.NET](./asp-net.md): Enabled by default but can also be [enabled manually using code](asp-net.md#enable-live-metrics-by-using-code-for-any-net-application).
   * [ASP.NET Core](./asp-net-core.md): Enabled by default but can also be [enabled manually using code](asp-net-core.md#enable-live-metrics-by-using-code-for-any-net-application).
   * [.NET/.NET Core Console/Worker](./worker-service.md): Enabled by default.
   * [Node.js](./nodejs.md#live-metrics): *Not enabled by default*.

---

2. Open the Application Insights resource for your application in the [Azure portal](https://portal.azure.com). Select **Live metrics**, which is listed under **Investigate** in the left hand menu.

3. [Secure the control channel](#secure-the-control-channel) if you might use sensitive data like customer names in your filters.

[!INCLUDE [azure-monitor-log-analytics-rebrand](~/reusable-content/ce-skilling/azure/includes/azure-monitor-instrumentation-key-deprecation.md)]

## How do live metrics differ from metrics explorer and Log Analytics?

| Capabilities |Live Stream | Metrics explorer and Log Analytics |
|---|---|---|
|Latency|Data displayed within one second.|Aggregated over minutes.|
|No retention|Data persists while it's on the chart and is then discarded.|[Data retained for 90 days.](/previous-versions/azure/azure-monitor/app/data-retention-privacy#how-long-is-the-data-kept)|
|On demand|Data is only streamed while the live metrics pane is open. |Data is sent whenever the SDK is installed and enabled.|
|Free|There's no charge for Live Stream data.|Subject to [pricing](../logs/cost-logs.md#application-insights-billing).
|Sampling|All selected metrics and counters are transmitted. Failures and stack traces are sampled. |Events can be [sampled](./api-filtering-sampling.md).|
|Control channel|Filter control signals are sent to the SDK. We recommend you secure this channel.|Communication is one way, to the portal.|

## Select and filter your metrics

These capabilities are available with ASP.NET, ASP.NET Core, and Azure Functions (v2).

You can monitor custom KPI live by applying arbitrary filters on any Application Insights telemetry from the portal. Select the filter control that shows when you mouse-over any of the charts. The following chart plots a custom **Request** count KPI with filters on **URL** and **Duration** attributes. Validate your filters with the stream preview section that shows a live feed of telemetry that matches the criteria you've specified at any point in time.

:::image type="content" source="./media/live-stream/filter-request.png" lightbox="./media/live-stream/filter-request.png" alt-text="Screenshot that shows the Filter request rate.":::

You can monitor a value different from **Count**. The options depend on the type of stream, which could be any Application Insights telemetry like requests, dependencies, exceptions, traces, events, or metrics. It can also be your own [custom measurement](./api-custom-events-metrics.md#properties).

:::image type="content" source="./media/live-stream/query-builder-request.png" lightbox="./media/live-stream/query-builder-request.png" alt-text="Screenshot that shows the Query Builder on Request Rate with a custom metric.":::

Along with Application Insights telemetry, you can also monitor any Windows performance counter. Select it from the stream options and provide the name of the performance counter.

Live metrics are aggregated at two points: locally on each server and then across all servers. You can change the default at either one by selecting other options in the respective dropdown lists.

## Sample telemetry: Custom live diagnostic events
By default, the live feed of events shows samples of failed requests and dependency calls, exceptions, events, and traces. Select the filter icon to see the applied criteria at any point in time.

:::image type="content" source="./media/live-stream/filter.png" lightbox="./media/live-stream/filter.png" alt-text="Screenshot that shows the Filter button.":::

As with metrics, you can specify any arbitrary criteria to any of the Application Insights telemetry types. In this example, we're selecting specific request failures and events.

:::image type="content" source="./media/live-stream/query-builder.png" lightbox="./media/live-stream/query-builder.png" alt-text="Screenshot that shows the Query Builder.":::

> [!NOTE]
> Currently, for exception message-based criteria, use the outermost exception message. In the preceding example, to filter out the benign exception with an inner exception message (follows the "<--" delimiter) "The client disconnected," use a message not-contains "Error reading request content" criteria.

To see the details of an item in the live feed, select it. You can pause the feed either by selecting **Pause** or by scrolling down and selecting an item. Live feed resumes after you scroll back to the top, or when you select the counter of items collected while it was paused.

:::image type="content" source="./media/live-stream/sample-telemetry.png" lightbox="./media/live-stream/sample-telemetry.png" alt-text="Screenshot that shows the Sample telemetry window with an exception selected and the exception details displayed at the bottom of the window.":::

## Filter by server instance

If you want to monitor a particular server role instance, you can filter by server. To filter, select the server name under **Servers**.

:::image type="content" source="./media/live-stream/filter-by-server.png" lightbox="./media/live-stream/filter-by-server.png" alt-text="Screenshot that shows the Sampled live failures.":::

## Secure the control channel

Live metrics custom filters allow you to control which of your application's telemetry is streamed to the live metrics pane in the Azure portal. The filters criteria are sent to the apps that are instrumented with the Application Insights SDK. The filter value could potentially contain sensitive information, such as the customer ID. To keep this value secured and prevent potential disclosure to unauthorized applications, secure the live metrics channel by using [Microsoft Entra authentication](./azure-ad-authentication.md#configure-and-enable-azure-ad-based-authentication).

> [!NOTE]
> On September 30, 2025, API keys used to stream live metrics telemetry into Application Insights will be retired. After that date, applications that use API keys won't be able to send live metrics data to your Application Insights resource. Authenticated telemetry ingestion for live metrics streaming to Application Insights will need to be done with [Microsoft Entra authentication for Application Insights](./azure-ad-authentication.md).

It's possible to try custom filters without having to set up an authenticated channel. Select any of the filter icons and authorize the connected servers. If you choose this option, you have to authorize the connected servers once every new session or whenever a new server comes online.

> [!WARNING]
> We strongly discourage the use of unsecured channels and will disable this option six months after you start using it. The **Authorize connected servers** dialog displays the date after which this option will be disabled.

:::image type="content" source="media/live-stream/live-stream-auth.png" alt-text="Screenshot that shows the Authorize connected servers dialog." lightbox="media/live-stream/live-stream-auth.png":::

## Supported features table

| Language                         | Basic metrics       | Performance metrics | Custom filtering    | Sample telemetry    | CPU split by process |
|----------------------------------|:--------------------|:--------------------|:--------------------|:--------------------|:---------------------|
| .NET Framework                   | Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)) | Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)) | Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)) | Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)) | Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core))  |
| .NET Core (target=.NET Framework)| Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)) | Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)) | Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)) | Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)) | Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core))  |
| .NET Core (target=.NET Core)     | Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)) | Supported*          | Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)) | Supported ([LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)) | **Not supported**    |
| Azure Functions v2               | Supported           | Supported           | Supported           | Supported           | **Not supported**    |
| Java                             | Supported (V2.0.0+) | Supported (V2.0.0+) | **Not supported**   | Supported (V3.2.0+) | **Not supported**    |
| Node.js                          | Supported (V1.3.0+) | Supported (V1.3.0+) | **Not supported**   | Supported (V1.3.0+) | **Not supported**    |
| Python                           | Supported (Distro Version 1.6.0+) | **Not supported**   | **Not supported**   | **Not supported**   | **Not supported**    |

Basic metrics include request, dependency, and exception rate. Performance metrics (performance counters) include memory and CPU. Sample telemetry shows a stream of detailed information for failed requests and dependencies, exceptions, events, and traces.

 PerfCounters support varies slightly across versions of .NET Core that don't target the .NET Framework:

- PerfCounters metrics are supported when running in Azure App Service for Windows (ASP.NET Core SDK version 2.4.1 or higher).
- PerfCounters are supported when the app is running on *any* Windows machine for apps that target .NET Core [LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) or higher.
- PerfCounters are supported when the app is running *anywhere* (such as Linux, Windows, app service for Linux, or containers) in the latest versions, but only for apps that target .NET Core [LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) or higher.

## Troubleshooting

Live metrics use different IP addresses than other Application Insights telemetry. Make sure [those IP addresses](../ip-addresses.md) are open in your firewall. Also check that [outgoing ports for live metrics](../ip-addresses.md#outgoing-ports) are open in the firewall of your servers.

As described in the [Azure TLS 1.2 migration announcement](https://azure.microsoft.com/updates/azuretls12/), live metrics now only support TLS 1.2. If you're using an older version of TLS, the live metrics pane doesn't display any data. For applications based on .NET Framework 4.5.1, see [Enable Transport Layer Security (TLS) 1.2 on clients - Configuration Manager](/mem/configmgr/core/plan-design/security/enable-tls-1-2-client#bkmk_net) to support the newer TLS version.

### Missing configuration for .NET

1. Verify that you're using the latest version of the NuGet package [Microsoft.ApplicationInsights.PerfCounterCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.PerfCounterCollector).
1. Edit the `ApplicationInsights.config` file:
    * Verify that the connection string points to the Application Insights resource you're using.
    * Locate the `QuickPulseTelemetryModule` configuration option. If it isn't there, add it.
    * Locate the `QuickPulseTelemetryProcessor` configuration option. If it isn't there, add it.
         
     ```xml
    <TelemetryModules>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.
    QuickPulse.QuickPulseTelemetryModule, Microsoft.AI.PerfCounterCollector"/>
    </TelemetryModules>
    
    <TelemetryProcessors>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.
    QuickPulse.QuickPulseTelemetryProcessor, Microsoft.AI.PerfCounterCollector"/>
    </TelemetryProcessors>
    ````
1. Restart the application.

### "Data is temporarily inaccessible" status message

When navigating to live metrics, you may see a banner with the status message: "Data is temporarily inaccessible. The updates on our status are posted here https://aka.ms/aistatus "

Follow the link to the *Azure status* page and check if there's an activate outage affecting Application Insights. Verify that firewalls and browser extensions aren't blocking access to live metrics if an outage isn't occurring. For example, some popular ad-blocker extensions block connections to `*.monitor.azure.com`. In order to use the full capabilities of live metrics, either disable the ad-blocker extension or add an exclusion rule for the domain `*.livediagnostics.monitor.azure.com` to your ad-blocker, firewall, etc.

### Unexpected large number of requests to livediagnostics.monitor.azure.com

Application Insights SDKs use a REST API to communicate with QuickPulse endpoints, which provide live metrics for your web application. By default, the SDKs poll the endpoints once every five seconds to check if you are viewing the live metrics pane in the Azure portal.

If you open live metrics, the SDKs switch to a higher frequency mode and send new metrics to QuickPulse every second. This allows you to monitor and diagnose your live application with 1-second latency, but also generates more network traffic. To restore normal flow of traffic, naviage away from the live metrics pane.

> [!NOTE]
> The REST API calls made by the SDKs to QuickPulse endpoints are not tracked by Application Insights and do not affect your dependency calls or other metrics. However, you may see them in other network monitoring tools.

## Next steps

* [Monitor usage with Application Insights](./usage.md)
* [Use Diagnostic Search](./transaction-search-and-diagnostics.md?tabs=transaction-search)
* [Profiler](./profiler.md)
* [Snapshot Debugger](./snapshot-debugger.md)
