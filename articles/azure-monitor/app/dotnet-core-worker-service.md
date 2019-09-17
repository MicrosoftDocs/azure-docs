---
title: Azure Application Insights for .NET Core WorkerService applications | Microsoft Docs
description: Monitoring .NET Core Worker Service applications with Application Insights.
services: application-insights
documentationcenter: .net
author: cithomas
manager: carmonm
ms.assetid: 3b722e47-38bd-4667-9ba4-65b7006c074c
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 09/15/2019
ms.author: cithomas
---

# Application Insights for .NET Core Worker Service applications

.NET Core 3.0 introduces a new type of application template called [Worker Service](https://devblogs.microsoft.com/aspnet/net-core-workers-as-windows-services/). Worker Service template helps you write messaging, background tasks, and other non-HTTP workloads based on [Generic Host](https://docs.microsoft.com/aspnet/core/fundamentals/host/generic-host). These type of applications don't have the notion of an incoming web request like a traditional ASP.NET/ASP.NET Core Web Application, and hence using Application Insights packages for [ASP.NET](https://docs.microsoft.com/en-us/azure/azure-monitor/app/asp-net) or [ASP.NET Core](https://docs.microsoft.com/en-us/azure/azure-monitor/app/asp-net-core) applications is not supported.

Application Insights is releasing a new SDK, called Microsoft.ApplicationInsights.WorkerService, which is best suited for non-HTTP workloads like the ones mentioned above.

The new SDK does not do any telemetry collection by itself. Instead, it brings in other well known Application Insights auto-collectors like [Microsoft.ApplicationInsights.DependencyCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector/), [Microsoft.ApplicationInsights.PerfCounterCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.PerfCounterCollector/), [Microsoft.Extensions.Logging.ApplicationInsights](https://www.nuget.org/packages/Microsoft.Extensions.Logging.ApplicationInsights) etc. This SDK exposes extension methods on `IServiceCollection` to enable and configure telemetry collection.

> [!NOTE]
> This article is about a new package from Application Insights for Worker Services. This package is available as a beta package today. This document will be updated when a stable package is available.

## Supported scenarios

The [Application Insights SDK for Worker Service](http://myget.org/feed/applicationinsights/package/nuget/Microsoft.ApplicationInsights.WorkerService) is best suited for non-HTTP applications no matter where or how they run. If your application is running and has network connectivity to Azure, telemetry can be collected. Application Insights monitoring is supported everywhere .NET Core is supported. While the example in this article uses the newly introduced .NET Core Worker Service, this can be used for any application including console apps.

## Prerequisites

- A valid Application Insights instrumentation key. This key is required to send any telemetry to Application Insights. If you need to create a new Application Insights resource to get an instrumentation key, see [Create an Application Insights resource](https://docs.microsoft.com/azure/azure-monitor/app/create-new-resource).

## Enable Application Insights for .NET Core 3.0 Worker Service Application

1. Install .NET Core 3.0 Preview from https://dotnet.microsoft.com/download/dotnet-core/3.0
2. Create a new Worker Service project either by using Visual Studio new project template or command line `dotnet new worker`
3. Install the [Application Insights SDK NuGet package for Worker Service](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService).

    The following code sample shows the changes to be added to your project's `.csproj` file.

    ```xml
        <ItemGroup>
          <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.8.0-beta3" />
        </ItemGroup>
    ```

4. Add `services.AddApplicationInsightsTelemetryWorkerService();` to the `CreateHostBuilder()` method in your `Program.cs` class, as in this example:

    ```csharp
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddHostedService<Worker>();
                    services.AddApplicationInsightsTelemetryWorkerService();
                });
    ```

5. Modify your Worker.cs as per below example.

    ```csharp
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private TelemetryClient _telemetryClient;
        private static HttpClient _httpClient = new HttpClient();

        public Worker(ILogger<Worker> logger, TelemetryClient tc)
        {
            _logger = logger;
            _telemetryClient = tc;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogWarning("Worker running at: {time}", DateTimeOffset.Now);

                using (_telemetryClient.StartOperation<RequestTelemetry>("workeroperation"))
                {
                    _logger.LogWarning("warning level log - calling bing.com");
                    var res = httpClient.GetAsync("https://bing.com").Result.StatusCode;
                    _logger.LogWarning("warning level log - calling bing.com completed with status:" + res);
                }

                await Task.Delay(1000, stoppingToken);
            }
        }
    }
    ```

6. Set up the instrumentation key.

    Although you can provide the instrumentation key as an argument to `AddApplicationInsightsTelemetryWorkerService`, we recommend that you specify the instrumentation key in configuration. The following code sample shows how to specify an instrumentation key in `appsettings.json`. Make sure `appsettings.json` is copied to the application root folder during publishing.

    ```json
        {
          "ApplicationInsights": {
            "InstrumentationKey": "putinstrumentationkeyhere"
          },
          "Logging": {
            "LogLevel": {
              "Default": "Warning"
            }
          }
        }
    ```

    Alternatively, specify the instrumentation key in either of the following environment variables:

    * `APPINSIGHTS_INSTRUMENTATIONKEY`

    * `ApplicationInsights:InstrumentationKey`

    For example:

    * `SET ApplicationInsights:InstrumentationKey=putinstrumentationkeyhere`

    * `SET APPINSIGHTS_INSTRUMENTATIONKEY=putinstrumentationkeyhere`

    Typically, `APPINSIGHTS_INSTRUMENTATIONKEY` specifies the instrumentation key for applications deployed to Web Apps as Web Jobs.

    > [!NOTE]
    > An instrumentation key specified in code wins over the environment variable `APPINSIGHTS_INSTRUMENTATIONKEY`, which wins over other options.

## Run your application

Run your application. The example worker from above makes a http call every second to bing.com, and also emits 2 warning level messages using ILogger. These are wrapped inside `StartOperation` call of `TelemetryClient`, which is used to create an operation (in this example `RequestTelemetry` named "workeroperation"). Application Insights will collect these ILogger logs and dependencies, and they will be correlated to the `RequestTelemetry` with parent-child relationship.

Following lists the full telemetry automatically collected by Application Insights.

### Live Metrics

It might take a few minutes before telemetry starts appearing in the portal and analytics.To quickly make sure everything is working, it's best to use [Live Metrics](https://docs.microsoft.com/azure/application-insights/app-insights-live-stream) when your worker is running. In all the platforms, Live Metrics portal would show CPU usage of the running process in near real-time.

### ILogger logs

[ILogger logs](https://docs.microsoft.com/azure/azure-monitor/app/ilogger) of severity `Warning` or greater are automatically captured.

### Dependencies

Following dependencies are automatically collected by Application Insights.

|---------------|-------|
|HTTP or HTTPS | Calls made with `HttpClient`. |
|SQL | Calls made with `System.Data.SqlClient` or `Microsoft.Data.SqlClient`. |
|[Azure Storage](https://www.nuget.org/packages/WindowsAzure.Storage/) | Calls made with the Azure Storage client. |
|[EventHubs client SDK](https://www.nuget.org/packages/Microsoft.Azure.EventHubs) | Version 1.1.0 and later. |
|[ServiceBus client SDK](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus)| Version 3.0.0 and later. |
|Azure Cosmos DB | Tracked automatically only if HTTP/HTTPS is used. Application Insights doesn't automatically capture TCP mode. |

### EventCounter

The following list of EventCounters are automatically collected, if the application is .NET Core 3.0.

### Manually tracking additional telemetry

While the SDK automatically collects telemetry as explained above, in most cases user will need to send additional telemetry to Application Insights service. The recommended way to do this is to obtain an instance of `TelemetryClient` from Dependency Injection, and then call one of the supported `TrackXXX()` method on it. Another typical use case is [custom tracking of operations](https://docs.microsoft.com/azure/azure-monitor/app/custom-operations-tracking). This is demonstrated in the Worker example above. This custom operation of `RequestTelemetry` can be thought of as the equivalent of an incoming web request in a typical Web Application. While it is not necessary to use a Operation, it fits best with application insights data model - with `RequestTelemetry` acting as the parent operation, and every telemetry generated inside the worker iteration being treated as logically belonging to the same operation. This also ensures all the telemetry generated (automatic and manual) will have the same operation_id. As sampling is based on operation_id, sampling algorithm either keeps or drops all of the telemetry from a single iteration.

## Configure the Application Insights SDK

The default `TelemetryConfiguration` used by the worker service SDK is similar to the automatic configuration used in a ASP.NET or ASP.NET Core application, minus the TelemetryInitializers used to enrich telemetry from `HttpContext`.

You can customize the Application Insights SDK for Worker Service to change the default configuration. Users of the Application Insights ASP.NET Core SDK might be familiar with changing configuration by using ASP.NET Core built-in [dependency injection](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection). WorkerService SDK is also based on similar principles. Make almost all configuration changes in the `ConfigureServices()` section inside the `Program.cs` class if using .NET Core 3.0 Worker Service templates. In ASP.NET Core 2.1/2.2 apps which uses background services, SDK configuration is done inside `ConfigureServices()` method in the `Startup.cs` class. The following sections offer more information.

> [!NOTE]
> While using this SDK, changing configuration by modifying `TelemetryConfiguration.Active` isn't supported, and changes will not be reflected.

### Using ApplicationInsightsServiceOptions

You can modify a few common settings by passing `ApplicationInsightsServiceOptions` to `AddApplicationInsightsTelemetryWorkerService`, as in this example:

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        Microsoft.ApplicationInsights.WorkerService.ApplicationInsightsServiceOptions aiOptions
                    = new Microsoft.ApplicationInsights.WorkerService.ApplicationInsightsServiceOptions();
        // Disables adaptive sampling.
        aiOptions.EnableAdaptiveSampling = false;

        // Disables QuickPulse (Live Metrics stream).
        aiOptions.EnableQuickPulseMetricStream = false;
        services.AddApplicationInsightsTelemetryWorkerService(aiOptions);
    }
```

Please note that ApplicationInsightsServiceOptions in this SDK is in the namespace Microsoft.ApplicationInsights.WorkerService as opposed to Microsoft.ApplicationInsights.AspNetCore.Extensions in the ASP.NET Core SDK.

TODO Update this:
For more information, see the [configurable settings in `ApplicationInsightsServiceOptions`](https://github.com/microsoft/ApplicationInsights-aspnetcore/blob/develop/src/Microsoft.ApplicationInsights.AspNetCore/Extensions/ApplicationInsightsServiceOptions.cs).

### Sampling

The Application Insights SDK for Worker Service supports both fixed-rate and adaptive sampling. Adaptive sampling is enabled by default. Configuring sampling for Worker Service is done the same way as for ASP.NET Core Applications.

For more information, see [Configure adaptive sampling for ASP.NET Core applications](../../azure-monitor/app/sampling.md#configuring-adaptive-sampling-for-aspnet-core-applications).

### Adding TelemetryInitializers

Use [telemetry initializers](https://docs.microsoft.com/azure/azure-monitor/app/api-filtering-sampling#add-properties-itelemetryinitializer) when you want to define properties that are sent with all telemetry.

Add any new `TelemetryInitializer` to the `DependencyInjection` container as shown in the following code from .NET Core 3.0 Worker service template. The SDK automatically picks up any `TelemetryInitializer` that's added to the `DependencyInjection` container.

```csharp
     public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddHostedService<Worker>();

                    services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();
                    services.AddApplicationInsightsTelemetryWorkerService();
                });
```

### Removing TelemetryInitializers

Telemetry initializers are present by default. To remove all or specific telemetry initializers, use the following sample code *after* you call `AddApplicationInsightsTelemetryWorkerService()`.

```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddHostedService<Worker>();

                    services.AddApplicationInsightsTelemetryWorkerService();
                    // Remove a specific built-in telemetry initializer
                    var tiToRemove = services.FirstOrDefault<ServiceDescriptor>
                                        (t => t.ImplementationType == typeof(AspNetCoreEnvironmentTelemetryInitializer));
                    if (tiToRemove != null)
                    {
                        services.Remove(tiToRemove);
                    }

                    // Remove all initializers
                    // This requires importing namespace by using Microsoft.Extensions.DependencyInjection.Extensions;
                    services.RemoveAll(typeof(ITelemetryInitializer));
                });
```

### Adding telemetry processors

You can add custom telemetry processors to `TelemetryConfiguration` by using the extension method `AddApplicationInsightsTelemetryProcessor` on `IServiceCollection`. You use telemetry processors in [advanced filtering scenarios](https://docs.microsoft.com/azure/azure-monitor/app/api-filtering-sampling#filtering-itelemetryprocessor) to allow for more direct control over what's included or excluded from the telemetry you send to the Application Insights service. Use the following example.

```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddHostedService<Worker>();

                    services.AddApplicationInsightsTelemetryWorkerService();
                    services.AddApplicationInsightsTelemetryProcessor<MyFirstCustomTelemetryProcessor>();
                    // If you have more processors:
                    services.AddApplicationInsightsTelemetryProcessor<MySecondCustomTelemetryProcessor>();
                });
```

### Configuring or removing default TelemetryModules

Application Insights uses telemetry modules to automatically collect telemetry about specific workloads without requiring manual tracking by user.

The following automatic-collection modules are enabled by default. These modules are responsible for automatically collecting telemetry. You can disable or configure them to alter their default behavior.

* `RequestTrackingTelemetryModule`
* `DependencyTrackingTelemetryModule`
* `PerformanceCollectorModule`
* `QuickPulseTelemetryModule`
* `AppServicesHeartbeatTelemetryModule`
* `AzureInstanceMetadataTelemetryModule`

To configure any default `TelemetryModule`, use the extension method `ConfigureTelemetryModule<T>` on `IServiceCollection`, as shown in the following example.

```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddHostedService<Worker>();

                    services.AddApplicationInsightsTelemetryWorkerService();

                    // The following configures DependencyTrackingTelemetryModule.
                    // Similarly, any other default modules can be configured.
                    services.ConfigureTelemetryModule<DependencyTrackingTelemetryModule>((module, o) =>
                                    {
                                        module.EnableW3CHeadersInjection = true;
                                    });

                    // The following removes PerformanceCollectorModule to disable perf-counter collection.
                    // Similarly, any other default modules can be removed.
                    var performanceCounterService = services.FirstOrDefault<ServiceDescriptor>(t => t.ImplementationType == typeof(PerformanceCollectorModule));
                    if (performanceCounterService != null)
                    {
                        services.Remove(performanceCounterService);
                    }
                });
```

### Configuring a telemetry channel

The default channel is `ServerTelemetryChannel`. You can override it as the following example shows.

```csharp
using Microsoft.ApplicationInsights.Channel;

    public void ConfigureServices(IServiceCollection services)
    {
        // Use the following to replace the default channel with InMemoryChannel.
        // This can also be applied to ServerTelemetryChannel.
        services.AddSingleton(typeof(ITelemetryChannel), new InMemoryChannel() {MaxTelemetryBufferCapacity = 19898 });

        services.AddApplicationInsightsTelemetry();
    }
```

### Disable telemetry dynamically

If you want to disable telemetry conditionally and dynamically, you may resolve `TelemetryConfiguration` instance with ASP.NET Core dependency injection container anywhere in your code and set `DisableTelemetry` flag on it.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetry();
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env, TelemetryConfiguration configuration)
    {
        configuration.DisableTelemetry = true;
        ...
    }
```

## Frequently asked questions

### How can I track telemetry that's not automatically collected?

Get an instance of `TelemetryClient` by using constructor injection, and call the required `TrackXXX()` method on it. We don't recommend creating new `TelemetryClient` instances. A singleton instance of `TelemetryClient` is already registered in the `DependencyInjection` container, which shares `TelemetryConfiguration` with rest of the telemetry. Creating a new `TelemetryClient` instance is recommended only if it needs a configuration that's separate from the rest of the telemetry.

### Can I use Visual Studio IDE to onboard Application Insights to a Worker Service project?

Visual Studio IDE onboarding is currently supported only for ASP.NET/ASP.NET Core Applications. This document will be updated when Visual Studio ships support for onboarding Worker service applications.

### Can I enable Application Insights monitoring by using tools like Status Monitor?

No. [Status Monitor](https://docs.microsoft.com/azure/azure-monitor/app/monitor-performance-live-website-now) and [Status Monitor v2](https://docs.microsoft.com/azure/azure-monitor/app/status-monitor-v2-overview) currently support ASP.NET 4.x only.

### If I run my application in Linux, are all features supported?

Yes. Feature support for this SDK is the same in all platforms, with the following exceptions:

* Performance counters are supported only in Windows with the exception of Process CPU/Memory shown in Live Metrics.
* Even though `ServerTelemetryChannel` is enabled by default, if the application is running in Linux or MacOS, the channel doesn't automatically create a local storage folder to keep telemetry temporarily if there are network issues. Because of this limitation, telemetry is lost when there are temporary network or server issues. To work around this issue, configure a local folder for the channel:

```csharp
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;

    public void ConfigureServices(IServiceCollection services)
    {
        // The following will configure the channel to use the given folder to temporarily
        // store telemetry items during network or Application Insights server issues.
        // User should ensure that the given folder already exists
        // and that the application has read/write permissions.
        services.AddSingleton(typeof(ITelemetryChannel),
                                new ServerTelemetryChannel () {StorageFolder = "/tmp/myfolder"});
        services.AddApplicationInsightsTelemetry();
    }
```

## Open-source SDK

[Read and contribute to the code](https://github.com/Microsoft/ApplicationInsights-aspnetcore#recent-updates).

## Next steps

* [Use the API](../../azure-monitor/app/api-custom-events-metrics.md) to send your own events and metrics for a detailed view of your app's performance and usage.
* [Track additional dependencies not automatically tracked](../../azure-monitor/app/auto-collect-dependencies.md).
* [Enrich or Filter auto-collected telemetry](../../azure-monitor/app/api-filtering-sampling.md).
* [Dependency Injection in ASP.NET Core](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection).
