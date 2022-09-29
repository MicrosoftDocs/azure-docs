---
title: Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Cloud Service, and Virtual Machines | Microsoft Docs
description: Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Cloud Service, and Virtual Machines
ms.author: hannahhunter
author: hhunter-ms
ms.reviewer: charles.weininger
reviewer: cweining
ms.topic: conceptual
ms.date: 08/18/2022
ms.custom: devdivchpfy22
---

# Enable Snapshot Debugger for .NET apps in Azure Service Fabric, Cloud Service, and Virtual Machines

If your ASP.NET or ASP.NET Core application runs in App Service and requires a customized Snapshot Debugger configuration, or a preview version of .NET Core, start with the [Enable Snapshot Debugger for App Services how-to guide](snapshot-debugger-app-service.md).

If your application runs in Azure Service Fabric, Cloud Service, Virtual Machines, or on-premises machines, you can skip enabling Snapshot Debugger on App Services and jump into following this guide.

## Configure snapshot collection for ASP.NET applications

### Prerequisite

[Enable Application Insights in your web app](../app/asp-net.md).

1. Include the [Microsoft.ApplicationInsights.SnapshotCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package in your app.

1. If needed, customize the Snapshot Debugger configuration added to [ApplicationInsights.config](../app/configuration-with-applicationinsights-config.md).

    The default Snapshot Debugger configuration is mostly empty and all settings are optional. Here's an example showing a configuration equivalent to the default configuration:

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

1. Snapshots are collected only on exceptions that are reported to Application Insights. In some cases (for example, older versions of the .NET platform), you might need to [configure exception collection](../app/asp-net-exceptions.md#exceptions) to see exceptions with snapshots in the portal.

## Configure snapshot collection for applications using ASP.NET Core LTS or above

### Prerequisites

[Enable Application Insights in your ASP.NET Core web app](../app/asp-net-core.md), if you haven't done it yet.
> [!NOTE]
> Be sure that your application references version 2.1.1, or newer, of the Microsoft.ApplicationInsights.AspNetCore package.

1. Include the [Microsoft.ApplicationInsights.SnapshotCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package in your app.

1. Modify your application's `Startup` class to add and configure the Snapshot Collector's telemetry processor.
    1. If [Microsoft.ApplicationInsights.SnapshotCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package version 1.3.5 or above is used, then add the following using statements to *Startup.cs*:

       ```csharp
            using Microsoft.ApplicationInsights.SnapshotCollector;
       ```

       Add the following at the end of the ConfigureServices method in the `Startup` class in *Startup.cs*:

       ```csharp
            services.AddSnapshotCollector((configuration) => Configuration.Bind(nameof(SnapshotCollectorConfiguration), configuration));
       ```

    1. If [Microsoft.ApplicationInsights.SnapshotCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package version 1.3.4 or below is used, then add the following using statements to *Startup.cs*.

       ```csharp
       using Microsoft.ApplicationInsights.SnapshotCollector;
       using Microsoft.Extensions.Options;
       using Microsoft.ApplicationInsights.AspNetCore;
       using Microsoft.ApplicationInsights.Extensibility;
       ```

       Add the following `SnapshotCollectorTelemetryProcessorFactory` class to `Startup` class:

       ```csharp
       class Startup
       {
           private class SnapshotCollectorTelemetryProcessorFactory : ITelemetryProcessorFactory
           {
               private readonly IServiceProvider _serviceProvider;

               public SnapshotCollectorTelemetryProcessorFactory(IServiceProvider serviceProvider) =>
                   _serviceProvider = serviceProvider;

               public ITelemetryProcessor Create(ITelemetryProcessor next)
               {
                   var snapshotConfigurationOptions = _serviceProvider.GetService<IOptions<SnapshotCollectorConfiguration>>();
                   return new SnapshotCollectorTelemetryProcessor(next, configuration: snapshotConfigurationOptions.Value);
               }
           }
           ...
        ```

        Add the `SnapshotCollectorConfiguration` and `SnapshotCollectorTelemetryProcessorFactory` services to the startup pipeline:

        ```csharp
           // This method gets called by the runtime. Use this method to add services to the container.
           public void ConfigureServices(IServiceCollection services)
           {
               // Configure SnapshotCollector from application settings
               services.Configure<SnapshotCollectorConfiguration>(Configuration.GetSection(nameof(SnapshotCollectorConfiguration)));

               // Add SnapshotCollector telemetry processor.
               services.AddSingleton<ITelemetryProcessorFactory>(sp => new SnapshotCollectorTelemetryProcessorFactory(sp));

               // TODO: Add other services your application needs here.
           }
       }
       ```

1. If needed, customize the Snapshot Debugger configuration by adding a `SnapshotCollectorConfiguration` section to *appsettings.json*.

    All settings in the Snapshot Debugger configuration are optional. Here's an example showing a configuration equivalent to the default configuration:

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

1. If your application isn't already instrumented with Application Insights, get started by [enabling Application Insights and setting the instrumentation key](../app/windows-desktop.md).

1. Add the [Microsoft.ApplicationInsights.SnapshotCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package in your app.

1. Snapshots are collected only on exceptions that are reported to Application Insights. You may need to modify your code to report them. The exception handling code depends on the structure of your application, but an example is below:

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

- Generate traffic to your application that can trigger an exception. Then, wait 10 to 15 minutes for snapshots to be sent to the Application Insights instance.
- See [snapshots](snapshot-debugger.md?toc=/azure/azure-monitor/toc.json#view-snapshots-in-the-portal) in the Azure portal.
- For help with troubleshooting Snapshot Debugger issues, see [Snapshot Debugger troubleshooting](snapshot-debugger-troubleshoot.md?toc=/azure/azure-monitor/toc.json).
