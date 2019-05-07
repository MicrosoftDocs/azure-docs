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

# Application Insights for ASP.NET Core applications

This article describes the steps of enabling Application Insights for a [ASP.NET Core](https://docs.microsoft.com/aspnet/core/?view=aspnetcore-2.2) application without using the Visual Studio IDE. If you have Visual Studio IDE installed, then [this](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core) document contains Visual Studio specific instructions. By completing the instructions in this article, Application Insights will start collecting requests, dependencies, exceptions, performance counters, heartbeats, and logs from your ASP.NET Core application. The example application used is a [MVC Application](https://docs.microsoft.com/aspnet/core/tutorials/first-mvc-app/?view=aspnetcore-2.2) targeting `netcoreapp2.2`, but instructions here are applicable to all ASP.NET Core Applications. Any exceptions are called out when applicable.

## Supported scenarios

Application Insights SDK (Software Development Kit) for ASP.NET Core can monitor your applications irrespective of where or how the application is run. If your application is running, and has network connectivity to the Application Insights service, telemetry is expected to be collected. This support includes, but is not limited to any operating system (Windows, Linux, Mac), hosting method (in-process vs out-of-process), deployment method (framework-dependent vs self-contained), Web Server (IIS, Kestrel), platform (Azure Web Apps, Azure VM, Docker, AKS and so on.) or IDE (Visual Studio, VS Code, command line.)

## Prerequisites

- A functioning ASP.NET Core Application. Follow [this](https://docs.microsoft.com/aspnet/core/getting-started/) guide to create an ASP.NET Core Application, if needed.
- A valid Application Insights instrumentation key, which is required to send any telemetry to the Application Insights service. Follow [these](https://docs.microsoft.com/azure/azure-monitor/app/create-new-resource) instructions to create a new Application Insights resource, if needed and obtain an instrumentation key.

## Enabling Application Insights Server-Side Telemetry

1. Install the Application Insights SDK for ASP.NET Core, which is a regular NuGet package. It is recommended to always use the latest stable version. Some of the functionalities described in this article may not be available in older versions. Full release notes for the SDK can be found [here](https://github.com/Microsoft/ApplicationInsights-aspnetcore/releases). 

Following shows the changes to be added to your project's .csproj file.

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

   While it is possible to provide instrumentation key as an argument to `services.AddApplicationInsightsTelemetry("putinstrumentationkeyhere");`, it is recommended to specify the instrumentation key in configuration. The following shows how to specify an instrumentation key in `appsettings.json`. Make sure `appsettings.json` is copied to the application root folder while publishing.

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

    Alternately, the instrumentation key can also be specified in either of the following environment variables.
    APPINSIGHTS_INSTRUMENTATIONKEY
    ApplicationInsights:InstrumentationKey

    Example:
    `SET ApplicationInsights:InstrumentationKey=putinstrumentationkeyhere`

`APPINSIGHTS_INSTRUMENTATIONKEY` is typically used to specify instrumentation key for applications deployed to Azure Web Apps.

> [!NOTE]
> An instrumentation key specified in code wins over environment variable `APPINSIGHTS_INSTRUMENTATIONKEY`, which wins over other options.

4. Run your application, and make requests to it. Telemetry should now start flowing to Application Insights. The following telemetry is automatically collected by the Application Insights SDK.

    1. Requests - Incoming web requests to your application.
    1. Dependencies
        1. Http/Https calls made with `HttpClient`
        1. SQL calls made with `SqlClient`
        1. Azure storage calls made with [Azure Storage Client](https://www.nuget.org/packages/WindowsAzure.Storage/)*
        1. [EventHub Client SDK](https://www.nuget.org/packages/Microsoft.Azure.EventHubs) version 1.1.0 and above
        1. [ServiceBus Client SDK](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus) version 3.0.0 and above

             *Azure Cosmos DB is tracked automatically only if HTTP/HTTPS is used. TCP mode won't be captured by Application Insights.


    1. [Performance Counters](https://azure.microsoft.com/documentation/articles/app-insights-web-monitor-performance/)
        1. Support for Performance Counters in ASP.NET Core is limited to the following
            1. SDK version 2.4.1 and above collects performance counters if the application is running in Azure Web App (Windows)
            1. SDK version 2.7.0-beta3 and above collects performance counters if the application is running in Windows, and targeting `NETSTANDARD2.0` or higher.
            1. For applications targeting the full .NET Framework, performance counters are supported in all versions of SDK.

            This document will be updated when performance counter support in Linux is added.
    1. [Live Metrics](https://docs.microsoft.com/azure/application-insights/app-insights-live-stream)
    1. `ILogger` logs of severity `Warning` or  above are automatically captured from SDK version 2.7.0-beta3 or higher. Read more [here](https://docs.microsoft.com/azure/azure-monitor/app/ilogger).

It may take a few minutes for telemetry to start appearing in portal. To quickly check if everything is working, it is best to use [Live Metrics](https://docs.microsoft.com/azure/application-insights/app-insights-live-stream), while making requests to the running application.

## Send ILogger logs to Application Insights

Application Insights supports capturing logs sent via ILogger. Read the full documentation [here](https://docs.microsoft.com/azure/azure-monitor/app/ilogger).

## Enable Client-side Telemetry for Web Applications

The steps above are sufficient to start collecting server side telemetry. If your application has client side components, then follow steps below to start collecting [usage telemetry](https://docs.microsoft.com/azure/azure-monitor/app/usage-overview) from there.

1. In _ViewImports.cshtml, add injection:

```cshtml
    @inject Microsoft.ApplicationInsights.AspNetCore.JavaScriptSnippet JavaScriptSnippet
```

2. In _Layout.cshtml, insert HtmlHelper to the end of `<head>` section but before any other script. Any custom JavaScript telemetry you want to report from the page should be injected after this snippet:

```cshtml
    @Html.Raw(JavaScriptSnippet.FullScript)
    </head>
```

Modify the files names as per your actual application. The names used above are from a default MVC Application template.

## Configuring Application Insights SDK

Application Insights SDK for ASP.NET Core can be customized to alter the default configuration. Users of Application Insights ASP.NET SDK might be familiar with configuration using `ApplicationInsights.config`, or by modifying `TelemetryConfiguration.Active`. For ASP.NET Core, configuration is done differently. ASP.NET Core SDK is added to the application using ASP.NET Core's built-in [DependencyInjection](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection) mechanism, and configuring the same would also be using DependencyInjection. Almost all the configuration changes are done in the `ConfigureServices()` method of your `Startup.cs` class, unless stated otherwise. Follow the sections below to learn more.

> [!NOTE]
> It is important to note that modifying configuration by modifying `TelemetryConfiguration.Active` is not recommended in ASP.NET Core applications.

### Configuring using ApplicationInsightsServiceOptions

It is possible to modify a few common settings by passing `ApplicationInsightsServiceOptions` to `services.AddApplicationInsightsTelemetry();`. An example is shown below.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        Microsoft.ApplicationInsights.AspNetCore.Extensions.ApplicationInsightsServiceOptions aiOptions
                    = new Microsoft.ApplicationInsights.AspNetCore.Extensions.ApplicationInsightsServiceOptions();
        // Disables adaptive sampling.
        aiOptions.EnableAdaptiveSampling = false;

        // Disables QuickPulse (Live Metrics stream).
        aiOptions.EnableQuickPulseMetricStream = false;
        services.AddApplicationInsightsTelemetry(aiOptions);
    }
```

The exact list of configurable settings in `ApplicationInsightsServiceOptions` can be found [here](https://github.com/Microsoft/ApplicationInsights-aspnetcore/blob/f0b8631e482d25982eb52092103b34e3ff6e5fef/src/Microsoft.ApplicationInsights.AspNetCore/Extensions/ApplicationInsightsServiceOptions.cs).

### Sampling

Application Insights SDK for ASP.NET Core supports both FixedRate and Adaptive sampling. Adaptive sampling is enabled by default. Follow [this](../../azure-monitor/app/sampling.md#configuring-adaptive-sampling-for-aspnet-core-applications) document to learn how to configure sampling for ASP.NET Core applications.

### Adding TelemetryInitializers

To add a new `TelemetryInitializer`, add it into the DependencyInjection Container as shown below. `TelemetryInitializer`s added to DependencyInjection container will be picked up by the SDK automatically.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();
    }
```

### Removing TelemetryInitializers

To remove all or specific TelemetryInitializers, which are present by default, use the following sample code **after** calling `AddApplicationInsightsTelemetry()`.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetry();

        // Remove a specific built-in TelemetryInitializer
        var tiToRemove = services.FirstOrDefault<ServiceDescriptor>
                         (t => t.ImplementationType == typeof(AspNetCoreEnvironmentTelemetryInitializer));
        if (tiToRemove != null)
        {
            services.Remove(tiToRemove);
        }

        // Remove all initializers
        // This requires importing namespace using Microsoft.Extensions.DependencyInjection.Extensions;
        services.RemoveAll(typeof(ITelemetryInitializer));
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

### Configuring or removing default TelemetryModules

The following auto collection modules are enabled by default, and are responsible for automatically collecting telemetry. They can be disabled and configured to alter default behavior.

1. `RequestTrackingTelemetryModule`
1. `DependencyTrackingTelemetryModule`
1. `PerformanceCollectorModule`
1. `QuickPulseTelemetryModule`
1. `AppServicesHeartbeatTelemetryModule`
1. `AzureInstanceMetadataTelemetryModule`

To configure any default `TelemetryModule`, use the extension method `ConfigureTelemetryModule<T>` on `IServiceCollection` as shown in the example below.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetry();

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

## Frequently asked questions

*1. I want to track some additional telemetry apart from the auto collected telemetry. How do I do it?*

* Obtain an instance of `TelemetryClient` by using Constructor injection, and call the required `TrackXXX()` method on it. It is not recommended to create new `TelemetryClient` instances in ASP.NET Core application, as a singleton instance of `TelemetryClient` is already registered in the DI container, which shares `TelemetryConfiguration` with rest of the telemetry. Creating a new `TelemetryClient` instance is recommended only if it has to have a separate config from the rest of the telemetry. The following example shows how to track additional telemetry from a controller.

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

 Refer to [Application Insights custom metrics API reference](https://docs.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics/) for description of custom data reporting in Application Insights.

*2. Some Visual Studio templates used UseApplicationInsights() extension method on IWebHostBuilder to enable Application Insights. Is this usage still valid?*

* Enabling Application Insights with this method is valid, and is used in Visual Studio on-boarding, and in the Azure Web App extensions as well. However, it is recommended to use `services.AddApplicationInsightsTelemery()` as it provides overloads to control some configuration. Both method internally does the same thing, so if there is no custom configuration to be applied, calling either is fine.

*3. I am deploying my ASP.NET Core application to Azure Web Apps. Should I still enable the Application Insights extension from Web Apps?*

* If SDK is installed at build time as shown in this article, there is no need to enable the Application Insights extension from the Web Apps portal. Even if extension is installed, it will back-off, when it detects that SDK is already added to the application. Enabling Application Insights from extension frees you from installing and updating the SDK to your application. However, enabling Application Insights as per this article is more flexible for reasons below.
    1. Application Insights Telemetry will continue to work in
        1. All Operating Systems - Windows, Linux, Mac.
        1. All publish mode - Self-Contained or Framework-Dependent.
        1. All target frameworks, including the full .NET Framework.
        1. All Hosting options - Azure Web APP, VMs, Linux, Containers, AKS, non-Azure.
    1. Telemetry can be seen locally, when debugging from Visual Studio.
    1. Allows tracking additional custom telemetry using `TrackXXX()` API.
    1. Has full control over the configuration.

*4. Can I enable Application Insights monitoring using tools like Status Monitor?*

* No. [Status Monitor](https://docs.microsoft.com/azure/azure-monitor/app/monitor-performance-live-website-now) and its upcoming replacement [IISConfigurator](https://github.com/Microsoft/ApplicationInsights-Announcements/issues/21) currently supports ASP.NET only. The document will be updated when support for ASP.NET Core application is available.

*5. I have an ASP.NET Core 2.0 Application? Isn't Application Insights automatically enabled for them without me doing anything?*

* `Microsoft.AspNetCore.All` 2.0 metapackage included Application Insights SDK (version 2.1.0), and if you run the application under Visual Studio debugger, Visual Studio enables application insights and shows telemetry locally in the IDE itself. Telemetry was not sent to the Application Insights service, unless an instrumentation key is explicitly specified. We recommended to follow instructions in this article to enable Application Insights, even for 2.0 apps.

*6. I run my application in Linux. Are all features supported in Linux as well?*

* Yes. Feature support for the SDK is same in all platforms, with the following exceptions:
    1. Performance Counters are not yet supported in Non-Windows. This document will be updated when Linux support is added.
    1. Even though `ServerTelemetryChannel` is enabled by default, if the application is running in non-windows, the channel does not automatically create a local storage folder to keep telemetry temporarily if there are network issues. This limitation causes telemetry to be lost if there are temporary network or server issues. The workaround for this issue is for the user to configure a local folder for the channel, as shown below.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        // The following will configure channel to use the given folder to temporarily
        // store telemetry items during network or application insights server issues.
        // User should ensure that the given folder already exists,
        // and that application has read/write permissions.
        services.AddSingleton(typeof(ITelemetryChannel),
                                new ServerTelemetryChannel () {StorageFolder = "/tmp/myfolder"});
        services.AddApplicationInsightsTelemetry();
    }
```
