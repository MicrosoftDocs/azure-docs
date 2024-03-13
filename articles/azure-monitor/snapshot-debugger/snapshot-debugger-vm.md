---
title: Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Cloud Services, and Virtual Machines | Microsoft Docs
description: Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Azure Cloud Services, and Azure Virtual Machines.
ms.author: hannahhunter
author: hhunter-ms
ms.reviewer: charles.weininger
reviewer: cweining
ms.topic: conceptual
ms.date: 11/17/2023
ms.custom: devdivchpfy22, devx-track-dotnet
---

# Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Cloud Services, and Virtual Machines

If your ASP.NET or ASP.NET Core application runs in Azure App Service and requires a customized Snapshot Debugger configuration, or a preview version of .NET Core, start with [Enable Snapshot Debugger for .NET apps in Azure App Service](snapshot-debugger-app-service.md).

If your application runs in Azure Service Fabric, Azure Cloud Services, Azure Virtual Machines, or on-premises machines, you can skip enabling Snapshot Debugger on App Service and follow the guidance in this article.

## Before you begin

- [Enable Application Insights in your web app](../app/asp-net.md).
- Include the [Microsoft.ApplicationInsights.SnapshotCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package version 1.4.2 or above in your app.

## Configure snapshot collection for ASP.NET applications

When you add the [Microsoft.ApplicationInsights.SnapshotCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package to your application, the `SnapshotCollectorTelemetryProcessor` should be added automatically to the `TelemetryProcessors` section of [ApplicationInsights.config](../app/configuration-with-applicationinsights-config.md).

If you don't see `SnapshotCollectorTelemetryProcessor` in ApplicationInsights.config, or if you want to customize the Snapshot Debugger configuration, you may edit it by hand. However, these edits may get overwritten if you later upgrade to a newer version of the [Microsoft.ApplicationInsights.SnapshotCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package.

The following example shows a configuration equivalent to the default configuration:

```xml
<TelemetryProcessors>
  <Add Type="Microsoft.ApplicationInsights.SnapshotCollector.SnapshotCollectorTelemetryProcessor, Microsoft.ApplicationInsights.SnapshotCollector">
    <!-- The default is true, but you can disable Snapshot Debugging by setting it to false -->
    <IsEnabled>true</IsEnabled>
    <!-- Snapshot Debugging is usually disabled in developer mode, but you can enable it by setting this to true. -->
    <!-- DeveloperMode is a property on the active TelemetryChannel. -->
    <IsEnabledInDeveloperMode>false</IsEnabledInDeveloperMode>
    <!-- How many times we need to see an exception before we ask for snapshots. -->
    <ThresholdForSnapshotting>1</ThresholdForSnapshotting>
    <!-- The maximum number of examples we create for a single problem. -->
    <MaximumSnapshotsRequired>3</MaximumSnapshotsRequired>
    <!-- The maximum number of problems that we can be tracking at any time. -->
    <MaximumCollectionPlanSize>50</MaximumCollectionPlanSize>
    <!-- How often we reconnect to the stamp. The default value is 15 minutes.-->
    <ReconnectInterval>00:15:00</ReconnectInterval>
    <!-- How often to reset problem counters. -->
    <ProblemCounterResetInterval>1.00:00:00</ProblemCounterResetInterval>
    <!-- The maximum number of snapshots allowed in ten minutes.The default value is 1. -->
    <SnapshotsPerTenMinutesLimit>3</SnapshotsPerTenMinutesLimit>
    <!-- The maximum number of snapshots allowed per day. -->
    <SnapshotsPerDayLimit>30</SnapshotsPerDayLimit>
    <!-- Whether or not to collect snapshot in low IO priority thread. The default value is true. -->
    <SnapshotInLowPriorityThread>true</SnapshotInLowPriorityThread>
    <!-- Agree to send anonymous data to Microsoft to make this product better. -->
    <ProvideAnonymousTelemetry>true</ProvideAnonymousTelemetry>
    <!-- The limit on the number of failed requests to request snapshots before the telemetry processor is disabled. -->
    <FailedRequestLimit>3</FailedRequestLimit>
  </Add>
</TelemetryProcessors>
```

Snapshots are collected _only_ on exceptions reported to Application Insights. In some cases (for example, older versions of the .NET platform), you might need to [configure exception collection](../app/asp-net-exceptions.md#exceptions) to see exceptions with snapshots in the portal.

## Configure snapshot collection for ASP.NET Core applications or Worker Services

### Prerequisites

Your application should already reference one of the following Application Insights NuGet packages:
- [Microsoft.ApplicationInsights.AspNetCore](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore)
- [Microsoft.ApplicationInsights.WorkerService](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService)

### Add the NuGet package

Add the [Microsoft.ApplicationInsights.SnapshotCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package to your app.

### Update the services collection

In your application's startup code, where services are configured, add a call to the `AddSnapshotCollector` extension method. It's a good idea to add this line immediately after the call to `AddApplicationInsightsTelemetry`. For example:
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplicationInsightsTelemetry();
builder.Services.AddSnapshotCollector();
```

### Configure the Snapshot Collector
For most situations, the default settings are sufficient. If not, customize the settings by adding the following code before the call to `AddSnapshotCollector()`
```csharp
using Microsoft.ApplicationInsights.SnapshotCollector;
...
builder.Services.Configure<SnapshotCollectorConfiguration>(builder.Configuration.GetSection("SnapshotCollector"));
```

Next, add a `SnapshotCollector` section to *appsettings.json* where you can override the defaults. The following example shows a configuration equivalent to the default configuration:

```json
{
  "SnapshotCollector": {
    "IsEnabledInDeveloperMode": false,
    "ThresholdForSnapshotting": 1,
    "MaximumSnapshotsRequired": 3,
    "MaximumCollectionPlanSize": 50,
    "ReconnectInterval": "00:15:00",
    "ProblemCounterResetInterval":"1.00:00:00",
    "SnapshotsPerTenMinutesLimit": 1,
    "SnapshotsPerDayLimit": 30,
    "SnapshotInLowPriorityThread": true,
    "ProvideAnonymousTelemetry": true,
    "FailedRequestLimit": 3
  }
}
```

If you need to customize the Snapshot Collector's behavior manually, without using *appsettings.json*, use the overload of `AddSnapshotCollector` that takes a delegate. For example:
```csharp
builder.Services.AddSnapshotCollector(config => config.IsEnabledInDeveloperMode = true);
```

## Configure snapshot collection for other .NET applications

Snapshots are collected only on exceptions that are reported to Application Insights. For ASP.NET and ASP.NET Core applications, the Application Insights SDK automatically reports unhandled exceptions that escape a controller method or endpoint route handler. For other applications, you might need to modify your code to report them. The exception handling code depends on the structure of your application. Here's an example:

```csharp
TelemetryClient _telemetryClient = new TelemetryClient();
void ExampleRequest()
{
    try
    {
        // TODO: Handle the request.
    }
    catch (Exception ex)
    {
        // Report the exception to Application Insights.
        _telemetryClient.TrackException(ex);
        // TODO: Rethrow the exception if desired.
    }
}
```

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Next steps

- Generate traffic to your application that can trigger an exception. Then wait 10 to 15 minutes for snapshots to be sent to the Application Insights instance.
- See [snapshots](snapshot-debugger-data.md?toc=/azure/azure-monitor/toc.json#view-snapshots-in-the-portal) in the Azure portal.
- For help with troubleshooting Snapshot Debugger issues, see [Snapshot Debugger troubleshooting](snapshot-debugger-troubleshoot.md).
