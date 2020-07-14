---
title: Application Insights for Worker Service apps (non-HTTP apps)
description: Monitoring .NET Core/.NET Framework non-HTTP apps with Azure Monitor Application Insights.
ms.topic: conceptual
ms.date: 05/11/2020

---

# Application Insights for Worker Service applications (non-HTTP applications)

Application Insights is releasing a new SDK, called `Microsoft.ApplicationInsights.WorkerService`, which is best suited for non-HTTP workloads like messaging, background tasks, console applications etc. These types of applications don't have the notion of an incoming HTTP request like a traditional ASP.NET/ASP.NET Core Web Application, and hence using Application Insights packages for [ASP.NET](asp-net.md) or [ASP.NET Core](asp-net-core.md) applications is not supported.

The new SDK does not do any telemetry collection by itself. Instead, it brings in other well known Application Insights auto collectors like [DependencyCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector/), [PerfCounterCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.PerfCounterCollector/), [ApplicationInsightsLoggingProvider](https://www.nuget.org/packages/Microsoft.Extensions.Logging.ApplicationInsights) etc. This SDK exposes extension methods on `IServiceCollection` to enable and configure telemetry collection.

## Supported scenarios

The [Application Insights SDK for Worker Service](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) is best suited for non-HTTP applications no matter where or how they run. If your application is running and has network connectivity to Azure, telemetry can be collected. Application Insights monitoring is supported everywhere .NET Core is supported. This package can be used in the newly introduced [.NET Core 3.0 Worker Service](https://devblogs.microsoft.com/aspnet/dotnet-core-workers-in-azure-container-instances), [background tasks in Asp.Net Core 2.1/2.2](https://docs.microsoft.com/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-2.2), Console apps (.NET Core/ .NET Framework), etc.

## Prerequisites

A valid Application Insights instrumentation key. This key is required to send any telemetry to Application Insights. If you need to create a new Application Insights resource to get an instrumentation key, see [Create an Application Insights resource](https://docs.microsoft.com/azure/azure-monitor/app/create-new-resource).

## Using Application Insights SDK for Worker Services

1. Install the [Microsoft.ApplicationInsights.WorkerService](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) package to the application.
   The following snippet shows the changes that need to be added to your project's `.csproj` file.

```xml
    <ItemGroup>
        <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.13.1" />
    </ItemGroup>
```

1. Call `AddApplicationInsightsTelemetryWorkerService(string instrumentationKey)` extension method on `IServiceCollection`, providing the instrumentation key. This method should be called at the beginning of the application. The exact location depends on the type of application.

1. Retrieve an `ILogger` instance or `TelemetryClient` instance from the Dependency Injection (DI) container by calling `serviceProvider.GetRequiredService<TelemetryClient>();` or using Constructor Injection. This step will trigger setting up of `TelemetryConfiguration` and auto collection modules.

Specific instructions for each type of application is described in the following sections.

## .NET Core 3.0 worker service application

Full example is shared [here](https://github.com/microsoft/ApplicationInsights-Home/tree/master/Samples/WorkerServiceSDK/WorkerServiceSampleWithApplicationInsights)

1. Download and install [.NET Core 3.0](https://dotnet.microsoft.com/download/dotnet-core/3.0)
2. Create a new Worker Service project either by using Visual Studio new project template or command line `dotnet new worker`
3. Install the [Microsoft.ApplicationInsights.WorkerService](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) package to the application.

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

5. Modify your `Worker.cs` as per below example.

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

6. Set up the instrumentation key.

    Although you can provide the instrumentation key as an argument to `AddApplicationInsightsTelemetryWorkerService`, we recommend that you specify the instrumentation key in configuration. The following code sample shows how to specify an instrumentation key in `appsettings.json`. Make sure `appsettings.json` is copied to the application root folder during publishing.

```json
    {
        "ApplicationInsights":
            {
            "InstrumentationKey": "putinstrumentationkeyhere"
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

Alternatively, specify the instrumentation key in either of the following environment variables.
`APPINSIGHTS_INSTRUMENTATIONKEY` or `ApplicationInsights:InstrumentationKey`

For example:
`SET ApplicationInsights:InstrumentationKey=putinstrumentationkeyhere`
OR `SET APPINSIGHTS_INSTRUMENTATIONKEY=putinstrumentationkeyhere`

Typically, `APPINSIGHTS_INSTRUMENTATIONKEY` specifies the instrumentation key for applications deployed to Web Apps as Web Jobs.

> [!NOTE]
> An instrumentation key specified in code wins over the environment variable `APPINSIGHTS_INSTRUMENTATIONKEY`, which wins over other options.

## ASP.NET Core background tasks with hosted services

[This](https://docs.microsoft.com/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-2.2&tabs=visual-studio) document describes how to create backgrounds tasks in ASP.NET Core 2.1/2.2 application.

Full example is shared [here](https://github.com/microsoft/ApplicationInsights-Home/tree/master/Samples/WorkerServiceSDK/BackgroundTasksWithHostedService)

1. Install the Microsoft.ApplicationInsights.WorkerService(https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) package to the application.
2. Add `services.AddApplicationInsightsTelemetryWorkerService();` to the `ConfigureServices()` method, as in this example:

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

                // instrumentation key is read automatically from appsettings.json
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

Following is the code for `TimedHostedService` where the background task logic resides.

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

3. Set up the instrumentation key.
   Use the same `appsettings.json` from the .NET Core 3.0 Worker Service example above.

## .NET Core/.NET Framework Console application

As mentioned in the beginning of this article, the new package can be used to enable Application Insights Telemetry from even a regular console application. This package targets [`NetStandard2.0`](https://docs.microsoft.com/dotnet/standard/net-standard), and hence can be used for console apps in .NET Core 2.0 or higher, and .NET Framework 4.7.2 or higher.

Full example is shared [here](https://github.com/microsoft/ApplicationInsights-Home/tree/master/Samples/WorkerServiceSDK/ConsoleAppWithApplicationInsights)

1. Install the Microsoft.ApplicationInsights.WorkerService(https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService) package to the application.

2. Modify Program.cs as below example.

```csharp
    using Microsoft.ApplicationInsights;
    using Microsoft.ApplicationInsights.DataContracts;
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
                // Hence instrumentation key and any changes to default logging level must be specified here.
                services.AddLogging(loggingBuilder => loggingBuilder.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>("Category", LogLevel.Information));
                services.AddApplicationInsightsTelemetryWorkerService("instrumentationkeyhere");

                // Build ServiceProvider.
                IServiceProvider serviceProvider = services.BuildServiceProvider();

                // Obtain logger instance from DI.
                ILogger<Program> logger = serviceProvider.GetRequiredService<ILogger<Program>>();

                // Obtain TelemetryClient instance from DI, for additional manual tracking or to flush.
                var telemetryClient = serviceProvider.GetRequiredService<TelemetryClient>();

                var httpClient = new HttpClient();

                while (true) // This app runs indefinitely. replace with actual application termination logic.
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

                // Explicitly call Flush() followed by sleep is required in Console Apps.
                // This is to ensure that even if application terminates, telemetry is sent to the back-end.
                telemetryClient.Flush();
                Task.Delay(5000).Wait();
            }
        }
    }
```

This console application also uses the same default `TelemetryConfiguration`, and it can be customized in the same way as the examples in earlier section.

## Run your application

Run your application. The example workers from all of the above above makes an http call every second to bing.com, and also emits few logs using ILogger. These lines are wrapped inside `StartOperation` call of `TelemetryClient`, which is used to create an operation (in this example `RequestTelemetry` named "operation"). Application Insights will collect these ILogger logs (warning or above by default) and dependencies, and they will be correlated to the `RequestTelemetry` with parent-child relationship. The correlation also works cross process/network boundary. For example, if the call was made to another monitored component, then it will be correlated to this parent as well.

This custom operation of `RequestTelemetry` can be thought of as the equivalent of an incoming web request in a typical Web Application. While it is not necessary to use an Operation, it fits best with the [Application Insights correlation data model](https://docs.microsoft.com/azure/azure-monitor/app/correlation) - with `RequestTelemetry` acting as the parent operation, and every telemetry generated inside the worker iteration being treated as logically belonging to the same operation. This approach also ensures all the telemetry generated (automatic and manual) will have the same `operation_id`. As sampling is based on `operation_id`, sampling algorithm either keeps or drops all of the telemetry from a single iteration.

The following lists the full telemetry automatically collected by Application Insights.

### Live Metrics

[Live Metrics](https://docs.microsoft.com/azure/application-insights/app-insights-live-stream) can be used to quickly verify if Application Insights monitoring is configured correctly. While it might take a few minutes before telemetry starts appearing in the portal and analytics, Live Metrics would show CPU usage of the running process in near real-time. It can also show other telemetry like Requests, Dependencies, Traces etc.

### ILogger logs

Logs emitted via `ILogger` of severity `Warning` or greater are automatically captured. Follow [ILogger docs](ilogger.md#control-logging-level) to customize which log levels are captured by Application Insights.

### Dependencies

Dependency collection is enabled by default. [This](asp-net-dependencies.md#automatically-tracked-dependencies) article explains the dependencies that are automatically collected, and also contain steps to do manual tracking.

### EventCounter

`EventCounterCollectionModule` is enabled by default, and it will collect a default set of counters from .NET Core 3.0 apps. The [EventCounter](eventcounters.md) tutorial lists the default set of counters collected. It also has instructions on customizing the list.

### Manually tracking additional telemetry

While the SDK automatically collects telemetry as explained above, in most cases user will need to send additional telemetry to Application Insights service. The recommended way to track additional telemetry is by obtaining an instance of `TelemetryClient` from Dependency Injection, and then calling one of the supported `TrackXXX()` [API](api-custom-events-metrics.md) methods on it. Another typical use case is [custom tracking of operations](custom-operations-tracking.md). This approach is demonstrated in the Worker examples above.

## Configure the Application Insights SDK

The default `TelemetryConfiguration` used by the worker service SDK is similar to the automatic configuration used in a ASP.NET or ASP.NET Core application, minus the TelemetryInitializers used to enrich telemetry from `HttpContext`.

You can customize the Application Insights SDK for Worker Service to change the default configuration. Users of the Application Insights ASP.NET Core SDK might be familiar with changing configuration by using ASP.NET Core built-in [dependency injection](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection). The WorkerService SDK is also based on similar principles. Make almost all configuration changes in the `ConfigureServices()` section by calling appropriate methods on `IServiceCollection`, as detailed below.

> [!NOTE]
> While using this SDK, changing configuration by modifying `TelemetryConfiguration.Active` isn't supported, and changes will not be reflected.

### Using ApplicationInsightsServiceOptions

You can modify a few common settings by passing `ApplicationInsightsServiceOptions` to `AddApplicationInsightsTelemetryWorkerService`, as in this example:

```csharp
    using Microsoft.ApplicationInsights.WorkerService;

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

Note that `ApplicationInsightsServiceOptions` in this SDK is in the namespace `Microsoft.ApplicationInsights.WorkerService` as opposed to `Microsoft.ApplicationInsights.AspNetCore.Extensions` in the ASP.NET Core SDK.

Commonly used settings in `ApplicationInsightsServiceOptions`

|Setting | Description | Default
|---------------|-------|-------
|EnableQuickPulseMetricStream | Enable/Disable LiveMetrics feature | true
|EnableAdaptiveSampling | Enable/Disable Adaptive Sampling | true
|EnableHeartbeat | Enable/Disable Heartbeats feature, which periodically (15-min default) sends a custom metric named 'HeartBeatState' with information about the runtime like .NET Version, Azure Environment information, if applicable, etc. | true
|AddAutoCollectedMetricExtractor | Enable/Disable AutoCollectedMetrics extractor, which is a TelemetryProcessor that sends pre-aggregated metrics about Requests/Dependencies before sampling takes place. | true

See the [configurable settings in `ApplicationInsightsServiceOptions`](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/NETCORE/src/Shared/Extensions/ApplicationInsightsServiceOptions.cs) for the most up-to-date list.

### Sampling

The Application Insights SDK for Worker Service supports both fixed-rate and adaptive sampling. Adaptive sampling is enabled by default. Configuring sampling for Worker Service is done the same way as for [ASP.NET Core Applications](https://docs.microsoft.com/azure/azure-monitor/app/sampling#configuring-adaptive-sampling-for-aspnet-core-applications).

### Adding TelemetryInitializers

Use [telemetry initializers](https://docs.microsoft.com/azure/azure-monitor/app/api-filtering-sampling#addmodify-properties-itelemetryinitializer) when you want to define properties that are sent with all telemetry.

Add any new `TelemetryInitializer` to the `DependencyInjection` container and SDK will automatically add them to the `TelemetryConfiguration`.

```csharp
    using Microsoft.ApplicationInsights.Extensibility;

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();
        services.AddApplicationInsightsTelemetryWorkerService();
    }
```

### Removing TelemetryInitializers

Telemetry initializers are present by default. To remove all or specific telemetry initializers, use the following sample code *after* you call `AddApplicationInsightsTelemetryWorkerService()`.

```csharp
   public void ConfigureServices(IServiceCollection services)
   {
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
   }
```

### Adding telemetry processors

You can add custom telemetry processors to `TelemetryConfiguration` by using the extension method `AddApplicationInsightsTelemetryProcessor` on `IServiceCollection`. You use telemetry processors in [advanced filtering scenarios](https://docs.microsoft.com/azure/azure-monitor/app/api-filtering-sampling#itelemetryprocessor-and-itelemetryinitializer) to allow for more direct control over what's included or excluded from the telemetry you send to the Application Insights service. Use the following example.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.AddApplicationInsightsTelemetryProcessor<MyFirstCustomTelemetryProcessor>();
        // If you have more processors:
        services.AddApplicationInsightsTelemetryProcessor<MySecondCustomTelemetryProcessor>();
    }
```

### Configuring or removing default TelemetryModules

Application Insights uses telemetry modules to automatically collect telemetry about specific workloads without requiring manual tracking.

The following automatic-collection modules are enabled by default. These modules are responsible for automatically collecting telemetry. You can disable or configure them to alter their default behavior.

* `DependencyTrackingTelemetryModule`
* `PerformanceCollectorModule`
* `QuickPulseTelemetryModule`
* `AppServicesHeartbeatTelemetryModule` - (There is currently an issue involving this telemetry module. For a temporary workaround see [GitHub Issue 1689](https://github.com/microsoft/ApplicationInsights-dotnet/issues/1689
).)
* `AzureInstanceMetadataTelemetryModule`

To configure any default `TelemetryModule`, use the extension method `ConfigureTelemetryModule<T>` on `IServiceCollection`, as shown in the following example.

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

### Configuring telemetry channel

The default channel is `ServerTelemetryChannel`. You can override it as the following example shows.

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

If you want to disable telemetry conditionally and dynamically, you may resolve `TelemetryConfiguration` instance with ASP.NET Core dependency injection container anywhere in your code and set `DisableTelemetry` flag on it.

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
        services.AddApplicationInsightsTelemetryWorkerService();
    }
```

## Sample applications

[.NET Core Console Application](https://github.com/microsoft/ApplicationInsights-Home/tree/master/Samples/WorkerServiceSDK/ConsoleAppWithApplicationInsights)
Use this sample if you are using a Console Application written in either .NET Core (2.0 or higher) or .NET Framework (4.7.2 or higher)

[ASP .NET Core background tasks with HostedServices](https://github.com/microsoft/ApplicationInsights-Home/tree/master/Samples/WorkerServiceSDK/BackgroundTasksWithHostedService)
Use this sample if you are in Asp.Net Core 2.1/2.2, and creating background tasks as per official guidance [here](https://docs.microsoft.com/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-2.2)

[.NET Core 3.0 Worker Service](https://github.com/microsoft/ApplicationInsights-Home/tree/master/Samples/WorkerServiceSDK/WorkerServiceSampleWithApplicationInsights)
Use this sample if you have a .NET Core 3.0 Worker Service application as per official guidance [here](https://docs.microsoft.com/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-3.0&tabs=visual-studio#worker-service-template)

## Open-source SDK

[Read and contribute to the code](https://github.com/Microsoft/ApplicationInsights-aspnetcore#recent-updates).

## Next steps

* [Use the API](../../azure-monitor/app/api-custom-events-metrics.md) to send your own events and metrics for a detailed view of your app's performance and usage.
* [Track additional dependencies not automatically tracked](../../azure-monitor/app/auto-collect-dependencies.md).
* [Enrich or Filter auto collected telemetry](../../azure-monitor/app/api-filtering-sampling.md).
* [Dependency Injection in ASP.NET Core](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection).
