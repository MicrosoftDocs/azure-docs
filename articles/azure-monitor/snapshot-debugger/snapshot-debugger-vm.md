---
title: Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Cloud Services, and Virtual Machines | Microsoft Docs
description: Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Azure Cloud Services, and Azure Virtual Machines.
ms.author: hannahhunter
author: hhunter-ms
ms.reviewer: charles.weininger
reviewer: cweining
ms.topic: conceptual
ms.date: 03/21/2023
ms.custom: devdivchpfy22
---

# Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Cloud Services, and Virtual Machines

If your ASP.NET or ASP.NET Core application runs in Azure App Service and requires a customized Snapshot Debugger configuration, or a preview version of .NET Core, start with [Enable Snapshot Debugger for .NET apps in Azure App Service](snapshot-debugger-app-service.md).

If your application runs in Azure Service Fabric, Azure Cloud Services, Azure Virtual Machines, or on-premises machines, you can skip enabling Snapshot Debugger on App Service and follow the guidance in this article.

## Before you begin

- [Enable Application Insights in your web app](../app/asp-net.md).
- Include the [Microsoft.ApplicationInsights.SnapshotCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package version 1.3.5 or above in your app.

## Configure snapshot collection for ASP.NET applications

The default Snapshot Debugger configuration is mostly empty and all settings are optional. You can customize the Snapshot Debugger configuration added to [ApplicationInsights.config](../app/configuration-with-applicationinsights-config.md).

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


## Configure snapshot collection for applications using ASP.NET Core

### Prerequisites

Create a new class called `SnapshotCollectorTelemetryProcessorFactory` to add and configure the Snapshot Collector's telemetry processor.

```csharp
using Microsoft.ApplicationInsights.AspNetCore;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.SnapshotCollector;
using Microsoft.Extensions.Options;

internal class SnapshotCollectorTelemetryProcessorFactory : ITelemetryProcessorFactory
{
    private readonly IServiceProvider _serviceProvider;

    public SnapshotCollectorTelemetryProcessorFactory(IServiceProvider serviceProvider) =>
        _serviceProvider = serviceProvider;

    public ITelemetryProcessor Create(ITelemetryProcessor next)
    {
        IOptions<SnapshotCollectorConfiguration> snapshotConfigurationOptions = _serviceProvider.GetRequiredService<IOptions<SnapshotCollectorConfiguration>>();
        return new SnapshotCollectorTelemetryProcessor(next, configuration: snapshotConfigurationOptions.Value);
    }
}
```

Add the `SnapshotCollectorConfiguration` and `SnapshotCollectorTelemetryProcessorFactory` services to `Program.cs`:

```csharp
using Microsoft.ApplicationInsights.AspNetCore;
using Microsoft.ApplicationInsights.SnapshotCollector;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationInsightsTelemetry();
builder.Services.AddSnapshotCollector(config => builder.Configuration.Bind(nameof(SnapshotCollectorConfiguration), config));
builder.Services.AddSingleton<ITelemetryProcessorFactory>(sp => new SnapshotCollectorTelemetryProcessorFactory(sp));
```

If needed, customize the Snapshot Debugger configuration by adding a `SnapshotCollectorConfiguration` section to *appsettings.json*. The following example shows a configuration equivalent to the default configuration:

```json
{
  "SnapshotCollectorConfiguration": {
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

## Configure snapshot collection for other .NET applications

Snapshots are collected only on exceptions that are reported to Application Insights. You might need to modify your code to report them. The exception handling code depends on the structure of your application. Here's an example:

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
