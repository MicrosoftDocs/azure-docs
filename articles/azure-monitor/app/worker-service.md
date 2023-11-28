---
title: Application Insights for Worker Service apps (non-HTTP apps)
description: Monitoring .NET Core/.NET Framework non-HTTP apps with Azure Monitor Application Insights.
ms.topic: conceptual
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
ms.date: 09/12/2023
ms.reviewer: cithomas
---

# Application Insights for Worker Service applications (non-HTTP applications)

[Application Insights SDK for Worker Service](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) is a new SDK, which is best suited for non-HTTP workloads like messaging, background tasks, and console applications. These types of applications don't have the notion of an incoming HTTP request like a traditional ASP.NET/ASP.NET Core web application. For this reason, using Application Insights packages for [ASP.NET](asp-net.md) or [ASP.NET Core](asp-net-core.md) applications isn't supported.

[!INCLUDE [azure-monitor-app-insights-otel-available-notification](../includes/azure-monitor-app-insights-otel-available-notification.md)]

The new SDK doesn't do any telemetry collection by itself. Instead, it brings in other well-known Application Insights auto collectors like [DependencyCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector/), [PerfCounterCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.PerfCounterCollector/), and [ApplicationInsightsLoggingProvider](https://www.nuget.org/packages/Microsoft.Extensions.Logging.ApplicationInsights). This SDK exposes extension methods on `IServiceCollection` to enable and configure telemetry collection.

## Supported scenarios

The [Application Insights SDK for Worker Service](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) is best suited for non-HTTP applications no matter where or how they run. If your application is running and has network connectivity to Azure, telemetry can be collected. Application Insights monitoring is supported everywhere .NET Core is supported. This package can be used in the newly introduced [.NET Core Worker Service](https://devblogs.microsoft.com/aspnet/dotnet-core-workers-in-azure-container-instances), [background tasks in ASP.NET Core](/aspnet/core/fundamentals/host/hosted-services), and console apps like .NET Core and .NET Framework.

## Prerequisites

You must have a valid Application Insights connection string. This string is required to send any telemetry to Application Insights. If you need to create a new Application Insights resource to get a connection string, see [Connection Strings](./sdk-connection-string.md).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Use Application Insights SDK for Worker Service

1. Install the [Microsoft.ApplicationInsights.WorkerService](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) package to the application.
   The following snippet shows the changes that must be added to your project's `.csproj` file:
    
    ```xml
        <ItemGroup>
            <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.13.1" />
        </ItemGroup>
    ```

1. Configure the connection string in the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable or in configuration (`appsettings.json`).

   :::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot displaying Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

1. Retrieve an `ILogger` instance or `TelemetryClient` instance from the Dependency Injection (DI) container by calling `serviceProvider.GetRequiredService<TelemetryClient>();` or by using Constructor Injection. This step will trigger setting up of `TelemetryConfiguration` and auto-collection modules.

Specific instructions for each type of application are described in the following sections.

## .NET Core Worker Service application

The full example is shared at the [NuGet website](https://github.com/microsoft/ApplicationInsights-dotnet/tree/develop/examples/WorkerService).

1. [Download and install the .NET SDK](https://dotnet.microsoft.com/download).
1. Create a new Worker Service project either by using a Visual Studio new project template or the command line `dotnet new worker`.
1. Add the [Microsoft.ApplicationInsights.WorkerService](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) package to the application.

1. Add `services.AddApplicationInsightsTelemetryWorkerService();` to the `CreateHostBuilder()` method in your `Program.cs` class, as in this example:

    ```csharp
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddHostedService<Worker>();
                    services.AddApplicationInsightsTelemetryWorkerService();
                });
    ```

1. Modify your `Worker.cs` as per the following example:

    ```csharp
        using Microsoft.ApplicationInsights;
        using Microsoft.ApplicationInsights.DataContracts;
    
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
                    _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
    
                    using (_telemetryClient.StartOperation<RequestTelemetry>("operation"))
                    {
                        _logger.LogWarning("A sample warning message. By default, logs with severity Warning or higher is captured by Application Insights");
                        _logger.LogInformation("Calling bing.com");
                        var res = await _httpClient.GetAsync("https://bing.com");
                        _logger.LogInformation("Calling bing completed with status:" + res.StatusCode);
                        _telemetryClient.TrackEvent("Bing call event completed");
                    }
    
                    await Task.Delay(1000, stoppingToken);
                }
            }
        }
    ```

1. Set up the connection string.

    :::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

    > [!NOTE]
    > We recommend that you specify the connection string in configuration. The following code sample shows how to specify a connection string in `appsettings.json`. Make sure `appsettings.json` is copied to the application root folder during publishing.

    ```json
        {
            "ApplicationInsights":
            {
                "ConnectionString" : "InstrumentationKey=00000000-0000-0000-0000-000000000000;"
            },
            "Logging":
            {
                "LogLevel":
                {
                    "Default": "Warning"
                }
            }
        }
    ```

Alternatively, specify the connection string in the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable.

Typically, `APPLICATIONINSIGHTS_CONNECTION_STRING` specifies the connection string for applications deployed to web apps as web jobs.

> [!NOTE]
> A connection string specified in code takes precedence over the environment variable `APPLICATIONINSIGHTS_CONNECTION_STRING`, which takes precedence over other options.

## ASP.NET Core background tasks with hosted services

[This document](/aspnet/core/fundamentals/host/hosted-services?tabs=visual-studio) describes how to create background tasks in an ASP.NET Core application.

The full example is shared at this [GitHub page](https://github.com/microsoft/ApplicationInsights-dotnet/tree/develop/examples/BackgroundTasksWithHostedService).

1. Install the [Microsoft.ApplicationInsights.WorkerService](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) package to the application.
1. Add `services.AddApplicationInsightsTelemetryWorkerService();` to the `ConfigureServices()` method, as in this example:

    ```csharp
        public static async Task Main(string[] args)
        {
            var host = new HostBuilder()
                .ConfigureAppConfiguration((hostContext, config) =>
                {
                    config.AddJsonFile("appsettings.json", optional: true);
                })
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddLogging();
                    services.AddHostedService<TimedHostedService>();
    
                    // connection string is read automatically from appsettings.json
                    services.AddApplicationInsightsTelemetryWorkerService();
                })
                .UseConsoleLifetime()
                .Build();
    
            using (host)
            {
                // Start the host
                await host.StartAsync();
    
                // Wait for the host to shutdown
                await host.WaitForShutdownAsync();
            }
        }
    ```

    The following code is for `TimedHostedService`, where the background task logic resides:

    ```csharp
        using Microsoft.ApplicationInsights;
        using Microsoft.ApplicationInsights.DataContracts;
    
        public class TimedHostedService : IHostedService, IDisposable
        {
            private readonly ILogger _logger;
            private Timer _timer;
            private TelemetryClient _telemetryClient;
            private static HttpClient httpClient = new HttpClient();
    
            public TimedHostedService(ILogger<TimedHostedService> logger, TelemetryClient tc)
            {
                _logger = logger;
                this._telemetryClient = tc;
            }
    
            public Task StartAsync(CancellationToken cancellationToken)
            {
                _logger.LogInformation("Timed Background Service is starting.");
    
                _timer = new Timer(DoWork, null, TimeSpan.Zero,
                    TimeSpan.FromSeconds(1));
    
                return Task.CompletedTask;
            }
    
            private void DoWork(object state)
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
    
                using (_telemetryClient.StartOperation<RequestTelemetry>("operation"))
                {
                    _logger.LogWarning("A sample warning message. By default, logs with severity Warning or higher is captured by Application Insights");
                    _logger.LogInformation("Calling bing.com");
                    var res = httpClient.GetAsync("https://bing.com").GetAwaiter().GetResult();
                    _logger.LogInformation("Calling bing completed with status:" + res.StatusCode);
                    _telemetryClient.TrackEvent("Bing call event completed");
                }
            }
        }
    ```

1. Set up the connection string.
   Use the same `appsettings.json` from the preceding [.NET](/dotnet/fundamentals/) Worker Service example.

## .NET Core/.NET Framework console application

As mentioned in the beginning of this article, the new package can be used to enable Application Insights telemetry from even a regular console application. This package targets [`netstandard2.0`](/dotnet/standard/net-standard), so it can be used for console apps in [.NET Core](/dotnet/fundamentals/) or higher, and [.NET Framework](/dotnet/framework/) or higher.

The full example is shared at this [GitHub page](https://github.com/microsoft/ApplicationInsights-dotnet/tree/main/examples/ConsoleApp).

1. Install the [Microsoft.ApplicationInsights.WorkerService](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) package to the application.

1. Modify *Program.cs* as shown in the following example:

    ```csharp
        using Microsoft.ApplicationInsights;
        using Microsoft.ApplicationInsights.DataContracts;
        using Microsoft.ApplicationInsights.WorkerService;
        using Microsoft.Extensions.DependencyInjection;
        using Microsoft.Extensions.Logging;
        using System;
        using System.Net.Http;
        using System.Threading.Tasks;
    
        namespace WorkerSDKOnConsole
        {
            class Program
            {
                static async Task Main(string[] args)
                {
                    // Create the DI container.
                    IServiceCollection services = new ServiceCollection();
    
                    // Being a regular console app, there is no appsettings.json or configuration providers enabled by default.
                    // Hence instrumentation key/ connection string and any changes to default logging level must be specified here.
                    services.AddLogging(loggingBuilder => loggingBuilder.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>("Category", LogLevel.Information));
                    services.AddApplicationInsightsTelemetryWorkerService((ApplicationInsightsServiceOptions options) => options.ConnectionString = "InstrumentationKey=<instrumentation key here>");
    
                    // To pass a connection string
                    // - aiserviceoptions must be created
                    // - set connectionstring on it
                    // - pass it to AddApplicationInsightsTelemetryWorkerService()
    
                    // Build ServiceProvider.
                    IServiceProvider serviceProvider = services.BuildServiceProvider();
    
                    // Obtain logger instance from DI.
                    ILogger<Program> logger = serviceProvider.GetRequiredService<ILogger<Program>>();
    
                    // Obtain TelemetryClient instance from DI, for additional manual tracking or to flush.
                    var telemetryClient = serviceProvider.GetRequiredService<TelemetryClient>();
    
                    var httpClient = new HttpClient();
    
                    while (true) // This app runs indefinitely. Replace with actual application termination logic.
                    {
                        logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
    
                        // Replace with a name which makes sense for this operation.
                        using (telemetryClient.StartOperation<RequestTelemetry>("operation"))
                        {
                            logger.LogWarning("A sample warning message. By default, logs with severity Warning or higher is captured by Application Insights");
                            logger.LogInformation("Calling bing.com");                    
                            var res = await httpClient.GetAsync("https://bing.com");
                            logger.LogInformation("Calling bing completed with status:" + res.StatusCode);
                            telemetryClient.TrackEvent("Bing call event completed");
                        }
    
                        await Task.Delay(1000);
                    }
    
                    // Explicitly call Flush() followed by sleep is required in console apps.
                    // This is to ensure that even if application terminates, telemetry is sent to the back-end.
                    telemetryClient.Flush();
                    Task.Delay(5000).Wait();
                }
            }
        }
    ```

This console application also uses the same default `TelemetryConfiguration`. It can be customized in the same way as the examples in earlier sections.

## Run your application

Run your application. The workers from all the preceding examples make an HTTP call every second to bing.com and also emit few logs by using `ILogger`. These lines are wrapped inside the `StartOperation` call of `TelemetryClient`, which is used to create an operation. In this example, `RequestTelemetry` is named "operation."

Application Insights collects these ILogger logs, with a severity of Warning or above by default, and dependencies. They're correlated to `RequestTelemetry` with a parent-child relationship. Correlation also works across process/network boundaries. For example, if the call was made to another monitored component, it's correlated to this parent as well.

This custom operation of `RequestTelemetry` can be thought of as the equivalent of an incoming web request in a typical web application. It isn't necessary to use an operation, but it fits best with the [Application Insights correlation data model](distributed-tracing-telemetry-correlation.md). `RequestTelemetry` acts as the parent operation and every telemetry generated inside the worker iteration is treated as logically belonging to the same operation.

This approach also ensures all the telemetry generated, both automatic and manual, will have the same `operation_id`. Because sampling is based on `operation_id`, the sampling algorithm either keeps or drops all the telemetry from a single iteration.

The following sections list the full telemetry automatically collected by Application Insights.

### Live Metrics

[Live Metrics](./live-stream.md) can be used to quickly verify if Application Insights monitoring is configured correctly. Although it might take a few minutes before telemetry appears in the portal and analytics, Live Metrics shows CPU usage of the running process in near real time. It can also show other telemetry like Requests, Dependencies, and Traces.

### ILogger logs

Logs emitted via `ILogger` with the severity Warning or greater are automatically captured. To change this behavior, explicitly override the logging configuration for the provider `ApplicationInsights`, as shown in the following code. The following configuration allows Application Insights to capture all `Information` logs and more severe logs.

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    },
    "ApplicationInsights": {
      "LogLevel": {
        "Default": "Information"
      }
    }
  }
}
```

It's important to note that the following example doesn't cause the Application Insights provider to capture `Information` logs. It doesn't capture it because the SDK adds a default logging filter that instructs `ApplicationInsights` to capture only `Warning` logs and more severe logs. Application Insights requires an explicit override.

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

For more information, follow [ILogger docs](/dotnet/core/extensions/logging#configure-logging) to customize which log levels are captured by Application Insights.

### Dependencies

Dependency collection is enabled by default. The article [Dependency tracking in Application Insights](asp-net-dependencies.md#automatically-tracked-dependencies) explains the dependencies that are automatically collected and also contains steps to do manual tracking.

### EventCounter

`EventCounterCollectionModule` is enabled by default, and it will collect a default set of counters from [.NET](/dotnet/fundamentals/) apps. The [EventCounter](eventcounters.md) tutorial lists the default set of counters collected. It also has instructions on how to customize the list.

### Manually track other telemetry

Although the SDK automatically collects telemetry as explained, in most cases, you'll need to send other telemetry to Application Insights. The recommended way to track other telemetry is by obtaining an instance of `TelemetryClient` from Dependency Injection and then calling one of the supported `TrackXXX()` [API](api-custom-events-metrics.md) methods on it. Another typical use case is [custom tracking of operations](custom-operations-tracking.md). This approach is demonstrated in the preceding worker examples.

## Configure the Application Insights SDK

The default `TelemetryConfiguration` used by the Worker Service SDK is similar to the automatic configuration used in an ASP.NET or ASP.NET Core application, minus the telemetry initializers used to enrich telemetry from `HttpContext`.

You can customize the Application Insights SDK for Worker Service to change the default configuration. Users of the Application Insights ASP.NET Core SDK might be familiar with changing configuration by using ASP.NET Core built-in [dependency injection](/aspnet/core/fundamentals/dependency-injection). The Worker Service SDK is also based on similar principles. Make almost all configuration changes in the `ConfigureServices()` section by calling appropriate methods on `IServiceCollection`, as detailed in the next section.

> [!NOTE]
> When you use this SDK, changing configuration by modifying `TelemetryConfiguration.Active` isn't supported and changes won't be reflected.

### Use ApplicationInsightsServiceOptions

You can modify a few common settings by passing `ApplicationInsightsServiceOptions` to `AddApplicationInsightsTelemetryWorkerService`, as in this example:

```csharp
using Microsoft.ApplicationInsights.WorkerService;

public void ConfigureServices(IServiceCollection services)
{
    var aiOptions = new ApplicationInsightsServiceOptions();
    // Disables adaptive sampling.
    aiOptions.EnableAdaptiveSampling = false;

    // Disables QuickPulse (Live Metrics stream).
    aiOptions.EnableQuickPulseMetricStream = false;
    services.AddApplicationInsightsTelemetryWorkerService(aiOptions);
}
```

The `ApplicationInsightsServiceOptions` in this SDK is in the namespace `Microsoft.ApplicationInsights.WorkerService` as opposed to `Microsoft.ApplicationInsights.AspNetCore.Extensions` in the ASP.NET Core SDK.

The following table lists commonly used settings in `ApplicationInsightsServiceOptions`.

|Setting | Description | Default
|---------------|-------|-------
|EnableQuickPulseMetricStream | Enable/Disable the Live Metrics feature. | True
|EnableAdaptiveSampling | Enable/Disable Adaptive Sampling. | True
|EnableHeartbeat | Enable/Disable the Heartbeats feature, which periodically (15-min default) sends a custom metric named "HeartBeatState" with information about the runtime like .NET version and Azure environment, if applicable. | True
|AddAutoCollectedMetricExtractor | Enable/Disable the AutoCollectedMetrics extractor, which is a telemetry processor that sends pre-aggregated metrics about Requests/Dependencies before sampling takes place. | True
|EnableDiagnosticsTelemetryModule | Enable/Disable `DiagnosticsTelemetryModule`. Disabling this setting will cause the following settings to be ignored: `EnableHeartbeat`, `EnableAzureInstanceMetadataTelemetryModule`, and `EnableAppServicesHeartbeatTelemetryModule`. | True

For the most up-to-date list, see the [configurable settings in `ApplicationInsightsServiceOptions`](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/NETCORE/src/Shared/Extensions/ApplicationInsightsServiceOptions.cs).

### Sampling

The Application Insights SDK for Worker Service supports both [fixed-rate sampling](sampling.md#fixed-rate-sampling) and [adaptive sampling](sampling.md#adaptive-sampling). Adaptive sampling is enabled by default. Sampling can be disabled by using the `EnableAdaptiveSampling` option in [ApplicationInsightsServiceOptions](#use-applicationinsightsserviceoptions).

To configure other sampling settings, you can use the following example:

```csharp
using Microsoft.ApplicationInsights.AspNetCore.Extensions;
using Microsoft.ApplicationInsights.Extensibility;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<TelemetryConfiguration>(telemetryConfiguration =>
{
   var telemetryProcessorChainBuilder = telemetryConfiguration.DefaultTelemetrySink.TelemetryProcessorChainBuilder;

   // Using adaptive sampling
   telemetryProcessorChainBuilder.UseAdaptiveSampling(maxTelemetryItemsPerSecond: 5);

   // Alternately, the following configures adaptive sampling with 5 items per second, and also excludes DependencyTelemetry from being subject to sampling:
   // telemetryProcessorChainBuilder.UseAdaptiveSampling(maxTelemetryItemsPerSecond:5, excludedTypes: "Dependency");
});

builder.Services.AddApplicationInsightsTelemetry(new ApplicationInsightsServiceOptions
{
   EnableAdaptiveSampling = false,
});

var app = builder.Build();
```

For more information, see the [Sampling](#sampling) document.

### Add telemetry initializers

Use [telemetry initializers](./api-filtering-sampling.md#addmodify-properties-itelemetryinitializer) when you want to define properties that are sent with all telemetry.

Add any new telemetry initializer to the `DependencyInjection` container and the SDK automatically adds them to `TelemetryConfiguration`.

```csharp
    using Microsoft.ApplicationInsights.Extensibility;

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();
        services.AddApplicationInsightsTelemetryWorkerService();
    }
```

### Remove telemetry initializers

Telemetry initializers are present by default. To remove all or specific telemetry initializers, use the following sample code *after* calling `AddApplicationInsightsTelemetryWorkerService()`.

```csharp
   public void ConfigureServices(IServiceCollection services)
   {
        services.AddApplicationInsightsTelemetryWorkerService();
        // Remove a specific built-in telemetry initializer.
        var tiToRemove = services.FirstOrDefault<ServiceDescriptor>
                            (t => t.ImplementationType == typeof(AspNetCoreEnvironmentTelemetryInitializer));
        if (tiToRemove != null)
        {
            services.Remove(tiToRemove);
        }

        // Remove all initializers.
        // This requires importing namespace by using Microsoft.Extensions.DependencyInjection.Extensions;
        services.RemoveAll(typeof(ITelemetryInitializer));
   }
```

### Add telemetry processors

You can add custom telemetry processors to `TelemetryConfiguration` by using the extension method `AddApplicationInsightsTelemetryProcessor` on `IServiceCollection`. You use telemetry processors in [advanced filtering scenarios](./api-filtering-sampling.md#itelemetryprocessor-and-itelemetryinitializer) to allow for more direct control over what's included or excluded from the telemetry you send to Application Insights. Use the following example:

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.AddApplicationInsightsTelemetryProcessor<MyFirstCustomTelemetryProcessor>();
        // If you have more processors:
        services.AddApplicationInsightsTelemetryProcessor<MySecondCustomTelemetryProcessor>();
    }
```

### Configure or remove default telemetry modules

Application Insights uses telemetry modules to automatically collect telemetry about specific workloads without requiring manual tracking.

The following auto-collection modules are enabled by default. These modules are responsible for automatically collecting telemetry. You can disable or configure them to alter their default behavior.

* `DependencyTrackingTelemetryModule`
* `PerformanceCollectorModule`
* `QuickPulseTelemetryModule`
* `AppServicesHeartbeatTelemetryModule` (There's currently an issue involving this telemetry module. For a temporary workaround, see [GitHub Issue 1689](https://github.com/microsoft/ApplicationInsights-dotnet/issues/1689).)
* `AzureInstanceMetadataTelemetryModule`

To configure any default telemetry module, use the extension method `ConfigureTelemetryModule<T>` on `IServiceCollection`, as shown in the following example:

```csharp
    using Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.QuickPulse;
    using Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector;

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetryWorkerService();

            // The following configures QuickPulseTelemetryModule.
            // Similarly, any other default modules can be configured.
            services.ConfigureTelemetryModule<QuickPulseTelemetryModule>((module, o) =>
            {
                module.AuthenticationApiKey = "keyhere";
            });

            // The following removes PerformanceCollectorModule to disable perf-counter collection.
            // Similarly, any other default modules can be removed.
            var performanceCounterService = services.FirstOrDefault<ServiceDescriptor>
                                        (t => t.ImplementationType == typeof(PerformanceCollectorModule));
            if (performanceCounterService != null)
            {
                services.Remove(performanceCounterService);
            }
    }
```

### Configure the telemetry channel

The default channel is `ServerTelemetryChannel`. You can override it as the following example shows:

```csharp
using Microsoft.ApplicationInsights.Channel;

    public void ConfigureServices(IServiceCollection services)
    {
        // Use the following to replace the default channel with InMemoryChannel.
        // This can also be applied to ServerTelemetryChannel.
        services.AddSingleton(typeof(ITelemetryChannel), new InMemoryChannel() {MaxTelemetryBufferCapacity = 19898 });

        services.AddApplicationInsightsTelemetryWorkerService();
    }
```

### Disable telemetry dynamically

If you want to disable telemetry conditionally and dynamically, you can resolve the `TelemetryConfiguration` instance with an ASP.NET Core dependency injection container anywhere in your code and set the `DisableTelemetry` flag on it.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetryWorkerService();
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env, TelemetryConfiguration configuration)
    {
        configuration.DisableTelemetry = true;
        ...
    }
```

## Frequently asked questions

This section provides answers to common questions.

### Which package should I use?

| .NET Core app scenario | Package  |
|---------|---------|
| Without HostedServices                              | WorkerService                     |
| With HostedServices                                 | AspNetCore (not WorkerService) |
| With HostedServices, monitoring only HostedServices | WorkerService (rare scenario)  |

### Can HostedServices inside a .NET Core app using the AspNetCore package have TelemetryClient injected to it?

Yes. The configuration will be shared with the rest of the web application.

### How can I track telemetry that's not automatically collected?

Get an instance of `TelemetryClient` by using constructor injection and call the required `TrackXXX()` method on it. We don't recommend creating new `TelemetryClient` instances. A singleton instance of `TelemetryClient` is already registered in the `DependencyInjection` container, which shares `TelemetryConfiguration` with the rest of the telemetry. Creating a new `TelemetryClient` instance is recommended only if it needs a configuration that's separate from the rest of the telemetry.

### Can I use Visual Studio IDE to onboard Application Insights to a Worker Service project?

Visual Studio IDE onboarding is currently supported only for ASP.NET/ASP.NET Core applications. This document will be updated when Visual Studio ships support for onboarding Worker Service applications.

### Can I enable Application Insights monitoring by using tools like Azure Monitor Application Insights Agent (formerly Status Monitor v2)?

No. [Azure Monitor Application Insights Agent](./application-insights-asp-net-agent.md) currently supports [.NET](/dotnet/fundamentals/) only.

### Are all features supported if I run my application in Linux?

Yes. Feature support for this SDK is the same in all platforms, with the following exceptions:

* Performance counters are supported only in Windows except for Process CPU/Memory shown in Live Metrics.
* Even though `ServerTelemetryChannel` is enabled by default, if the application is running in Linux or macOS, the channel doesn't automatically create a local storage folder to keep telemetry temporarily if there are network issues. Because of this limitation, telemetry is lost when there are temporary network or server issues. To work around this issue, configure a local folder for the channel:

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
          services.AddApplicationInsightsTelemetryWorkerService();
      }
  ```

## Sample applications

[.NET Core console application](https://github.com/microsoft/ApplicationInsights-dotnet/tree/develop/examples/ConsoleApp):
Use this sample if you're using a console application written in either .NET Core (2.0 or higher) or .NET Framework (4.7.2 or higher).

[ASP.NET Core background tasks with HostedServices](https://github.com/microsoft/ApplicationInsights-dotnet/tree/develop/examples/BackgroundTasksWithHostedService):
Use this sample if you're in ASP.NET Core and creating background tasks in accordance with [official guidance](/aspnet/core/fundamentals/host/hosted-services).

[.NET Core Worker Service](https://github.com/microsoft/ApplicationInsights-dotnet/tree/develop/examples/WorkerService):
Use this sample if you have a [.NET](/dotnet/fundamentals/) Worker Service application in accordance with [official guidance](/aspnet/core/fundamentals/host/hosted-services?tabs=visual-studio#worker-service-template).

## Open-source SDK

[Read and contribute to the code](https://github.com/microsoft/ApplicationInsights-dotnet).

For the latest updates and bug fixes, [see the Release Notes](./release-notes.md).

## Next steps

* [Use the API](./api-custom-events-metrics.md) to send your own events and metrics for a detailed view of your app's performance and usage.
* [Track more dependencies not automatically tracked](asp-net-dependencies.md#dependency-auto-collection).
* [Enrich or filter auto-collected telemetry](./api-filtering-sampling.md).
* [Dependency Injection in ASP.NET Core](/aspnet/core/fundamentals/dependency-injection).
