---
title: Azure Application Insights for ASP.NET Core without Visual Studio | Microsoft Docs
description: Monitor ASP.NET Core web applications for availability, performance, and usage.
services: application-insights
documentationcenter: .net
author: mrbullwinkle
manager: carmonm
ms.assetid: 3b722e47-38bd-4667-9ba4-65b7006c074c
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 04/03/2019
ms.author: cithomas
---

# Application Insights for ASP.NET Core Application

This article walks you through the steps of enabling Application Insights monitoring for a [ASP.NET Core] (https://docs.microsoft.com/aspnet/core/?view=aspnetcore-2.2) application without using Visual Studio IDE. If you have Visual Studio IDE installed, then [this](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core) document can used for instructions. Once completed, Application Insights starts collecting requests, dependencies, exceptions, performance counters, heartbeats and logs. The example application used is a [MVC Application](https://docs.microsoft.com/aspnet/core/tutorials/first-mvc-app/?view=aspnetcore-2.2) targeting `netcoreapp2.2`, but instructions here is applicable to all Asp.Net Core Applications. These instructions are applicable on all platforms (Windows/Linux/Mac) and with or without any IDEs. Any exceptions to this are called out when applicable.

## Prerequisites

- A functioning Asp.Net Core Application. Follow [this](https://docs.microsoft.com/aspnet/core/getting-started/) guide to create an Asp.Net Core Application, if needed.
- A valid Application Insights instrumentation key which is required to send any telemetry to Application Insights service. Follow [these](https://docs.microsoft.com/azure/azure-monitor/app/create-new-resource) instructions to create a new Application Insights resource, if needed.

## Enabling Application Insights Server Side Telemetry

1. Install Application Insights SDK for Asp.Net Core, which is a regular nuget package. It is recommended to always use the latest stable version. Some of the functionalities described in this article may not be available in older versions. Full release notes for the SDK can be found [here](https://github.com/Microsoft/ApplicationInsights-aspnetcore/releases).

```xml
    <ItemGroup>
      <PackageReference Include="Microsoft.ApplicationInsights.AspNetCore" Version="2.6.1" />
    </ItemGroup>
```

2. Add `services.AddApplicationInsightsTelemetry();` to `ConfigureServices()` method in your `Startup` class. Full example below.

```csharp
    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        // The following line enables Application Insights telemetry collection.
        services.AddApplicationInsightsTelemetry();

        // code adding other services for your application
        services.AddMvc();
    }
```

3. Setup instrumentation key.

   While it is possible to provide instrumentation key as an argument to `services.AddApplicationInsightsTelemetry("putinstrumentationkeyhere");`, it is recommended to be provided in configuration. Following shows how to specify instrumentation key in `appsettings.json`. Make sure `appsettings.json` is copied to application root folder.

```json
    {
      "ApplicationInsights": {
        "InstrumentationKey": "putinstrumentationkeyhere"
      }, 
      "Logging": {
        "LogLevel": {
          "Default": "Warning"
        }
      },
      "AllowedHosts": "*"
    }
```

4. Run your application, and make requests to it. Telemetry should now start flowing to Application Insights. The following telemetry is automatically collected by Application Insights SDK.

    1. Requests - Incoming web requests to your application.
    1. Dependencies
        1. Http/Https calls made with `HttpClient`
        1. SQL calls made with `SqlClient`

    1. [Performance Counters](https://azure.microsoft.com/documentation/articles/app-insights-web-monitor-performance/)
        1. Support for Performance Counters in Asp.Net Core is limited to the following
            1. SDK version 2.4.1 and above collects perf counters if the application is running in Azure Web App (Windows)
            1. SDK version 2.7.0-beta3 and above collects perf counters if the application is running in Windows, and targeting `NETSTANDARD2.0` or higher.
            1. For applications targeting the full .NET Framework, perf counters are supported in all versions of SDK.

            This document will be updated when perf counter support in Linux is added.
    1. [Live Metrics](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-live-stream)
    1. ILogger logs are automatically captured as well, from SDK version 2.7.0-beta3 or higher. Read more [here](https://docs.microsoft.com/azure/azure-monitor/app/ilogger).

## Send ILogger logs to Application Insights

Application Insights supports capturing logs sent via ILogger. Read the full documentation [here](https://docs.microsoft.com/azure/azure-monitor/app/ilogger).

## Enable Client side Telemetry for Web Application

The steps above are sufficient to start collecting server side telemetry. If your application has client side components, then follow steps below to start collecting [usage telemetry](https://docs.microsoft.com/en-us/azure/azure-monitor/app/usage-overview) from there.

1. In _ViewImports.cshtml, add injection:

```cshtml
    @inject Microsoft.ApplicationInsights.AspNetCore.JavaScriptSnippet JavaScriptSnippet
```

2. In _Layout.cshtml, insert HtmlHelper to the end of `<head>` section but before any other script. Any custom JavaScript telemetry you want to report from the page should be injected after this snippet:

   ```cshtml
    @Html.Raw(JavaScriptSnippet.FullScript)
    </head>
   ```

Modify the files names as per your actual application. Above names are from a default MVC Application template.

## Configuring Application Insights SDK

Application Insights SDK for Asp.Net Core can be customized to alter the default configuration. Users of Application Insights Asp.Net SDK might be familiar with configuration using `ApplicationInsights.config`, or by modifying `TelemetryConfiguration.Active`. For Asp.Net Core, configuration is done differently. Asp.Net Core SDK is added to the application using Asp.Net Core's built-in [DependencyInjection](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection) mechanism, and hence configuring the same would also be using DependencyInjection. Almost all the configuration changes are done in the `ConfigureServices()` method of your `Startup.cs` class, unless stated otherwise. Follow the sections below to learn more.

> [!NOTE]
> It is important to note that modifying configuration by modifying `TelemetryConfiguration.Active` is not recommended in Asp.Net Core applications.

### Specify Instrumentation Key

There are three ways to specify instrumentation key.

#### In Code

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetry("putinstrumentationkeyhere");
    }
```

#### In Configuration using Appsettings.json

Example appsettings.json file.

```json
    {
      "ApplicationInsights": {
        "InstrumentationKey": "putinstrumentationkeyhere"
      }, 
      "Logging": {
        "LogLevel": {
          "Default": "Warning"
        }
      },
      "AllowedHosts": "*"
    }
```

#### In Configuration using environment variable

SET ApplicationInsights:InstrumentationKey=putinstrumentationkeyhere

### Configuring using ApplicationInsightsServiceOptions

It is possible to modify a few common settings by passing `ApplicationInsightsServiceOptions` to `services.AddApplicationInsightsTelemetry();`. An example is shown below.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        ApplicationInsightsServiceOptions aiOptions = new ApplicationInsightsServiceOptions();
        aiOptions.EnableAdaptiveSampling = false;
        aiOptions.EnableQuickPulseMetricStream = false;
        services.AddApplicationInsightsTelemetry(aiOptions);
    }
```

The exact list of configurable settings in `ApplicationInsightsServiceOptions` can be found [here](https://github.com/Microsoft/ApplicationInsights-aspnetcore/blob/f0b8631e482d25982eb52092103b34e3ff6e5fef/src/Microsoft.ApplicationInsights.AspNetCore/Extensions/ApplicationInsightsServiceOptions.cs).

### Sampling

Application Insights SDK for Asp.Net Core supports both FixedRate and Adaptive sampling. Follow [this](../../azure-monitor/app/sampling.md#adaptive-sampling-in-your-aspnet-core-web-applications) document to learn how to configure sampling for Asp.Net Core applications.

### Adding TelemetryInitializers

To add a new `TelemetryInitializer` simply add it into DependencyInjection Container as shown below.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();
    }
```

### Removing TelemetryInitializers

To remove all or specific TelemetryInitializers which are present by default, use the following sample code **after** calling `AddApplicationInsightsTelemetry()`.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetry();

        // Remove a specific built-in TelemetryInitializer
        var tiToRemove = services.FirstOrDefault<ServiceDescriptor>(t => t.ImplementationType == typeof(AspNetCoreEnvironmentTelemetryInitializer));
        if (tiToRemove != null)
        {
            services.Remove(tiToRemove);
        }

        // Remove all initializers
        services.RemoveAll(typeof(ITelemetryInitializer)); // this requires importing namespace using Microsoft.Extensions.DependencyInjection.Extensions;
    }
```

### Adding TelemetryProcessors

Custom telemetry processors can be added to the `TelemetryConfiguration` by using the extension method `AddApplicationInsightsTelemetryProcessor` on `IServiceCollection`. Use the following example.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        // ...
        services.AddApplicationInsightsTelemetry();
        services.AddApplicationInsightsTelemetryProcessor<MyFirstCustomTelemetryProcessor>();

        // If you have more processors:
        services.AddApplicationInsightsTelemetryProcessor<MySecondCustomTelemetryProcessor>();
    }
```

### Configuring or Removing default TelemetryModules

The following auto-collection modules are enabled by default. They can disabled to prevent it from auto collecting telemetry, and they can be configured to alter default behavior.

1. `RequestTrackingTelemetryModule`
1. `DependencyTrackingTelemetryModule`
1. `PerformanceCollectorModule`
1. `QuickPulseTelemetryModule`
1. `AppServicesHeartbeatTelemetryModule`
1. `AzureInstanceMetadataTelemetryModule`

In order to configure any of the default `TelemetryModule`, use the extension method `ConfigureTelemetryModule<T>` on `IServiceCollection` as shown in the example below.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetry();
        // The following configures DependencyTrackingTelemetryModule. Replace this with any other default modules
        services.ConfigureTelemetryModule<DependencyTrackingTelemetryModule>(module => module.SetComponentCorrelationHttpHeaders = false);

        // The following removes PerformanceCollectorModule to disable perf-counter collection.
        // Replace this with any other default modules.
        var performanceCounterService = services.FirstOrDefault<ServiceDescriptor>(t => t.ImplementationType == typeof(PerformanceCollectorModule));
        if (performanceCounterService != null)
        {
         services.Remove(performanceCounterService);
        }
    }
```

### Configuring Telemetry Channel

The default channel used is the `ServerTelemetryChannel`. It can be overridden by following example below.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        // use the following to replace the default channel with InMemoryChannel.
        // this can also be applied to ServerTelemetryChannel as well.
        services.AddSingleton(typeof(ITelemetryChannel), new InMemoryChannel() {MaxTelemetryBufferCapacity = 19898 });

        services.AddApplicationInsightsTelemetry();
    }
```

## Frequently Asked Questions

*1. I want to track some additional telemetry apart from the auto collected telemetry. How do I do it?*

* Obtain an instance of `TelemetryClient` from DependencyInjection, using Constructor injection, and call the required `TrackXXX()` method on it. The following shows how to track additional telemetry from a controller. It is not recommended to new up `TelemetryClient` instances in Asp.Net Core application, as the a singleton instance of `TelemetryClient` is already registered in the DI container, which shares `TelemetryConfiguration` with rest of the telemetry.

```csharp
public class HomeController : Controller
{
    private TelemetryClient telemetry;

    // use constructor injection to get TelemetryClient instance
    public HomeController(TelemetryClient telemetry)
    {
        this.telemetry = telemetry;
    }

    public IActionResult Index()
    {
        // call required TrackXXX method.
        this.telemetry.TrackEvent("HomePageRequested");
        return View();
    }
```

 Please refer to [Application Insights custom metrics API reference](http://azure.microsoft.com/en-us/documentation/articles/app-insights-custom-events-metrics-api/) for description of custom data reporting in Application Insights.

* The suggested alternative is the new standalone package [Microsoft.Extensions.Logging.ApplicationInsights](https://www.nuget.org/packages/Microsoft.Extensions.Logging.ApplicationInsights), containing an improved ApplicationInsightsLoggerProvider (Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider), and extensions methods on ILoggerBuilder for enabling it.

* [Microsoft.ApplicationInsights.AspNet SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) version 2.7.0-beta3 onwards will take a dependency on the above package, and enables `ILogger` capture automatically.

## Next steps
* [Explore User Flows](../../azure-monitor/app/usage-flows.md) to understand how users navigate through your app.
* [Configure snapshot collection](https://docs.microsoft.com/azure/application-insights/app-insights-snapshot-debugger) to see the state of source code and variables at the moment an exception is thrown.
* [Use the API](../../azure-monitor/app/api-custom-events-metrics.md) to send your own events and metrics for a more detailed view of your app's performance and usage.
* Use [availability tests](../../azure-monitor/app/monitor-web-app-availability.md) to check your app constantly from around the world.
