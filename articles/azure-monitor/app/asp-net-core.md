---
title: Application Insights for ASP.NET Core applications | Microsoft Docs
description: Monitor ASP.NET Core web applications for availability, performance, and usage.
ms.topic: conceptual
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.date: 10/10/2023
ms.reviewer: mmcc
---
# Application Insights for ASP.NET Core applications

This article describes how to enable and configure Application Insights for an [ASP.NET Core](/aspnet/core) application.

Application Insights can collect the following telemetry from your ASP.NET Core application:

> [!div class="checklist"]
> * Requests
> * Dependencies
> * Exceptions
> * Performance counters
> * Heartbeats
> * Logs

We use an [MVC application](/aspnet/core/tutorials/first-mvc-app) example. If you're using the [Worker Service](/aspnet/core/fundamentals/host/hosted-services#worker-service-template), use the instructions in [Application Insights for Worker Service applications](./worker-service.md).

An [OpenTelemetry-based .NET offering](opentelemetry-enable.md?tabs=net) is available. For more information, see [OpenTelemetry overview](opentelemetry-overview.md).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

> [!NOTE]
> If you want to use standalone ILogger provider, use [Microsoft.Extensions.Logging.ApplicationInsight](./ilogger.md).

## Supported scenarios

The [Application Insights SDK for ASP.NET Core](https://nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) can monitor your applications no matter where or how they run. If your application is running and has network connectivity to Azure, telemetry can be collected. Application Insights monitoring is supported everywhere .NET Core is supported and covers the following scenarios:

* **Operating system**: Windows, Linux, or Mac
* **Hosting method**: In process or out of process
* **Deployment method**: Framework dependent or self-contained
* **Web server**: Internet Information Server (IIS) or Kestrel
* **Hosting platform**: The Web Apps feature of Azure App Service, Azure Virtual Machines, Docker, and Azure Kubernetes Service (AKS)
* **.NET version**: All officially [supported .NET versions](https://dotnet.microsoft.com/download/dotnet) that aren't in preview
* **IDE**: Visual Studio, Visual Studio Code, or command line

## Prerequisites

You need:

- A functioning ASP.NET Core application. If you need to create an ASP.NET Core application, follow this [ASP.NET Core tutorial](/aspnet/core/getting-started/).
- A reference to a supported version of the [Application Insights](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) NuGet package.
- A valid Application Insights connection string. This string is required to send any telemetry to Application Insights. If you need to create a new Application Insights resource to get a connection string, see [Create an Application Insights resource](./create-workspace-resource.md).

## Enable Application Insights server-side telemetry (Visual Studio)

For Visual Studio for Mac, use the [manual guidance](#enable-application-insights-server-side-telemetry-no-visual-studio). Only the Windows version of Visual Studio supports this procedure.

1. Open your project in Visual Studio.

1. Go to **Project** > **Add Application Insights Telemetry**.

1. Select **Azure Application Insights** > **Next**.

1. Choose your subscription and Application Insights instance. Or you can create a new instance with **Create new**. Select **Next**.

1. Add or confirm your Application Insights connection string. It should be prepopulated based on your selection in the previous step. Select **Finish**.

1. After you add Application Insights to your project, check to confirm that you're using the latest stable release of the SDK. Go to **Project** > **Manage NuGet Packages** > **Microsoft.ApplicationInsights.AspNetCore**. If you need to, select **Update**.

     :::image type="content" source="./media/asp-net-core/update-nuget-package.png" alt-text="Screenshot that shows where to select the Application Insights package for update.":::

## Enable Application Insights server-side telemetry (no Visual Studio)

1. Install the [Application Insights SDK NuGet package for ASP.NET Core](https://nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore).

    We recommend that you always use the latest stable version. Find full release notes for the SDK on the [open-source GitHub repo](https://github.com/Microsoft/ApplicationInsights-dotnet/releases).

    The following code sample shows the changes to add to your project's `.csproj` file:

    ```xml
    <ItemGroup>
        <PackageReference Include="Microsoft.ApplicationInsights.AspNetCore" Version="2.21.0" />
    </ItemGroup>
    ```

1. Add `AddApplicationInsightsTelemetry()` to your `startup.cs` or `program.cs` class. The choice depends on your .NET Core version.

    ### [ASP.NET Core 6 and later](#tab/netcorenew)

    Add `builder.Services.AddApplicationInsightsTelemetry();` after the `WebApplication.CreateBuilder()` method in your `Program` class, as in this example:
    
    ```csharp
    // This method gets called by the runtime. Use this method to add services to the container.
    var builder = WebApplication.CreateBuilder(args);
    
    // The following line enables Application Insights telemetry collection.
    builder.Services.AddApplicationInsightsTelemetry();
    
    // This code adds other services for your application.
    builder.Services.AddMvc();

    var app = builder.Build();
    ```

    ### [ASP.NET Core 5 and earlier](#tab/netcoreold)

    Add `services.AddApplicationInsightsTelemetry();` to the `ConfigureServices()` method in your `Startup` class, as in this example:

    ```csharp
    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        // The following line enables Application Insights telemetry collection.
        services.AddApplicationInsightsTelemetry();

        // This code adds other services for your application.
        services.AddMvc();
    }
    ```

    > [!NOTE]
    > This .NET version is no longer supported.

    ---
    
1. Set up the connection string.

    Although you can provide a connection string as part of the `ApplicationInsightsServiceOptions` argument to `AddApplicationInsightsTelemetry`, we recommend that you specify the connection string in configuration. The following code sample shows how to specify a connection string in `appsettings.json`. Make sure `appsettings.json` is copied to the application root folder during publishing.

    ```json
    {
      "Logging": {
        "LogLevel": {
          "Default": "Information",
          "Microsoft.AspNetCore": "Warning"
        }
      },
      "AllowedHosts": "*",
      "ApplicationInsights": {
        "ConnectionString": "Copy connection string from Application Insights Resource Overview"
      }
    }
    ```

    Alternatively, specify the connection string in the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable or `ApplicationInsights:ConnectionString` in the JSON configuration file.
    
    For example:
    
    * `SET ApplicationInsights:ConnectionString = <Copy connection string from Application Insights Resource Overview>`
    * `SET APPLICATIONINSIGHTS_CONNECTION_STRING = <Copy connection string from Application Insights Resource Overview>`
    * Typically, `APPLICATIONINSIGHTS_CONNECTION_STRING` is used in [Web Apps](./azure-web-apps.md?tabs=net). It can also be used in all places where this SDK is supported.
    
    > [!NOTE]
    > A connection string specified in code wins over the environment variable `APPLICATIONINSIGHTS_CONNECTION_STRING`, which wins over other options.

### User secrets and other configuration providers

If you want to store the connection string in ASP.NET Core user secrets or retrieve it from another configuration provider, you can use the overload with a `Microsoft.Extensions.Configuration.IConfiguration` parameter. An example parameter is `services.AddApplicationInsightsTelemetry(Configuration);`.

In `Microsoft.ApplicationInsights.AspNetCore` version [2.15.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) and later, calling `services.AddApplicationInsightsTelemetry()` automatically reads the connection string from `Microsoft.Extensions.Configuration.IConfiguration` of the application. There's no need to explicitly provide `IConfiguration`.

If `IConfiguration` has loaded configuration from multiple providers, then `services.AddApplicationInsightsTelemetry` prioritizes configuration from `appsettings.json`, irrespective of the order in which providers are added. Use the `services.AddApplicationInsightsTelemetry(IConfiguration)` method to read configuration from `IConfiguration` without this preferential treatment for `appsettings.json`.

## Run your application

Run your application and make requests to it. Telemetry should now flow to Application Insights. The Application Insights SDK automatically collects incoming web requests to your application, along with the following telemetry.

### Live Metrics

[Live Metrics](./live-stream.md) can be used to quickly verify if Application Insights monitoring is configured correctly. It might take a few minutes for telemetry to appear in the portal and analytics, but Live Metrics shows CPU usage of the running process in near real time. It can also show other telemetry like requests, dependencies, and traces.

### ILogger logs

The default configuration collects `ILogger` `Warning` logs and more severe logs. For more information, see [How do I customize ILogger logs collection?](#how-do-i-customize-ilogger-logs-collection).

### Dependencies

Dependency collection is enabled by default. [Dependency tracking in Application Insights](asp-net-dependencies.md#automatically-tracked-dependencies) explains the dependencies that are automatically collected and also contains steps to do manual tracking.

### Performance counters

Support for [performance counters](./performance-counters.md) in ASP.NET Core is limited:

* SDK versions 2.4.1 and later collect performance counters if the application is running in Web Apps (Windows).
* SDK versions 2.7.1 and later collect performance counters if the application is running in Windows and targets `netstandard2.0` or later.
* For applications that target the .NET Framework, all versions of the SDK support performance counters.
* SDK versions 2.8.0 and later support the CPU/memory counter in Linux. No other counter is supported in Linux. To get system counters in Linux and other non-Windows environments, use [EventCounters](#eventcounter).

### EventCounter

By default, `EventCounterCollectionModule` is enabled. To learn how to configure the list of counters to be collected, see [EventCounters introduction](eventcounters.md).

### Enrich data through HTTP

```csharp
HttpContext.Features.Get<RequestTelemetry>().Properties["myProp"] = someData
```

## Enable client-side telemetry for web applications

The preceding steps are enough to help you start collecting server-side telemetry. If your application has client-side components, follow the next steps to start collecting [usage telemetry](./usage-overview.md) using JavaScript (Web) SDK Loader Script injection by configuration.

1. In `_ViewImports.cshtml`, add injection:

    ```cshtml
    @inject Microsoft.ApplicationInsights.AspNetCore.JavaScriptSnippet JavaScriptSnippet
    ```

1. In `_Layout.cshtml`, insert `HtmlHelper` at the end of the `<head>` section but before any other script. If you want to report any custom JavaScript telemetry from the page, inject it after this snippet:

    ```cshtml
    @Html.Raw(JavaScriptSnippet.FullScript)
    </head>
    ```

As an alternative to using `FullScript`, `ScriptBody` is available starting in Application Insights SDK for ASP.NET Core version 2.14. Use `ScriptBody` if you need to control the `<script>` tag to set a Content Security Policy:

```cshtml
<script> // apply custom changes to this script tag.
 @Html.Raw(JavaScriptSnippet.ScriptBody)
</script>
```

The `.cshtml` file names referenced earlier are from a default MVC application template. Ultimately, if you want to properly enable client-side monitoring for your application, the JavaScript JavaScript (Web) SDK Loader Script must appear in the `<head>` section of each page of your application that you want to monitor. Add the JavaScript JavaScript (Web) SDK Loader Script to `_Layout.cshtml` in an application template to enable client-side monitoring.

If your project doesn't include `_Layout.cshtml`, you can still add [client-side monitoring](./website-monitoring.md) by adding the JavaScript JavaScript (Web) SDK Loader Script to an equivalent file that controls the `<head>` of all pages within your app. Alternatively, you can add the JavaScript (Web) SDK Loader Script to multiple pages, but we don't recommend it.

> [!NOTE]
> JavaScript injection provides a default configuration experience. If you require [configuration](./javascript.md#configuration) beyond setting the connection string, you're required to remove auto-injection as described and manually add the [JavaScript SDK](./javascript.md#add-the-javascript-sdk).

## Configure the Application Insights SDK

You can customize the Application Insights SDK for ASP.NET Core to change the default configuration. Users of the Application Insights ASP.NET SDK might be familiar with changing configuration by using `ApplicationInsights.config` or by modifying `TelemetryConfiguration.Active`. For ASP.NET Core, make almost all configuration changes in the `ConfigureServices()` method of your `Startup.cs` class, unless you're directed otherwise. The following sections offer more information.

> [!NOTE]
> In ASP.NET Core applications, changing configuration by modifying `TelemetryConfiguration.Active` isn't supported.

### Use ApplicationInsightsServiceOptions

You can modify a few common settings by passing `ApplicationInsightsServiceOptions` to `AddApplicationInsightsTelemetry`, as in this example:

### [ASP.NET Core 6 and later](#tab/netcorenew)

```csharp
var builder = WebApplication.CreateBuilder(args);

var aiOptions = new Microsoft.ApplicationInsights.AspNetCore.Extensions.ApplicationInsightsServiceOptions();

// Disables adaptive sampling.
aiOptions.EnableAdaptiveSampling = false;

// Disables QuickPulse (Live Metrics stream).
aiOptions.EnableQuickPulseMetricStream = false;

builder.Services.AddApplicationInsightsTelemetry(aiOptions);
var app = builder.Build();
```

### [ASP.NET Core 5 and earlier](#tab/netcoreold)

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

> [!NOTE]
> This .NET version is no longer supported.

---

This table has the full list of `ApplicationInsightsServiceOptions` settings:

|Setting | Description | Default
|---------------|-------|-------
|EnablePerformanceCounterCollectionModule  | Enable/Disable `PerformanceCounterCollectionModule`. | True
|EnableRequestTrackingTelemetryModule   | Enable/Disable `RequestTrackingTelemetryModule`. | True
|EnableEventCounterCollectionModule   | Enable/Disable `EventCounterCollectionModule`. | True
|EnableDependencyTrackingTelemetryModule   | Enable/Disable `DependencyTrackingTelemetryModule`. | True
|EnableAppServicesHeartbeatTelemetryModule  |  Enable/Disable `AppServicesHeartbeatTelemetryModule`. | True
|EnableAzureInstanceMetadataTelemetryModule   |  Enable/Disable `AzureInstanceMetadataTelemetryModule`. | True
|EnableQuickPulseMetricStream | Enable/Disable LiveMetrics feature. | True
|EnableAdaptiveSampling | Enable/Disable Adaptive Sampling. | True
|EnableHeartbeat | Enable/Disable the heartbeats feature. It periodically (15-min default) sends a custom metric named `HeartbeatState` with information about the runtime like .NET version and Azure environment information, if applicable. | True
|AddAutoCollectedMetricExtractor | Enable/Disable the `AutoCollectedMetrics extractor`. This telemetry processor sends preaggregated metrics about requests/dependencies before sampling takes place. | True
|RequestCollectionOptions.TrackExceptions | Enable/Disable reporting of unhandled exception tracking by the request collection module. | False in `netstandard2.0` (because exceptions are tracked with `ApplicationInsightsLoggerProvider`). True otherwise.
|EnableDiagnosticsTelemetryModule | Enable/Disable `DiagnosticsTelemetryModule`. Disabling causes the following settings to be ignored: `EnableHeartbeat`, `EnableAzureInstanceMetadataTelemetryModule`, and `EnableAppServicesHeartbeatTelemetryModule`. | True

For the most current list, see the [configurable settings in `ApplicationInsightsServiceOptions`](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/NETCORE/src/Shared/Extensions/ApplicationInsightsServiceOptions.cs).

### Configuration recommendation for Microsoft.ApplicationInsights.AspNetCore SDK 2.15.0 and later

In Microsoft.ApplicationInsights.AspNetCore SDK version [2.15.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore/2.15.0) and later, configure every setting available in `ApplicationInsightsServiceOptions`, including `ConnectionString`. Use the application's `IConfiguration` instance. The settings must be under the section `ApplicationInsights`, as shown in the following example. The following section from *appsettings.json* configures the connection string and disables adaptive sampling and performance counter collection.

```json
{
    "ApplicationInsights": {
    "ConnectionString": "Copy connection string from Application Insights Resource Overview",
    "EnableAdaptiveSampling": false,
    "EnablePerformanceCounterCollectionModule": false
    }
}
```

If `builder.Services.AddApplicationInsightsTelemetry(aiOptions)` for ASP.NET Core 6.0 or `services.AddApplicationInsightsTelemetry(aiOptions)` for ASP.NET Core 3.1 and earlier is used, it overrides the settings from `Microsoft.Extensions.Configuration.IConfiguration`.

### Sampling

The Application Insights SDK for ASP.NET Core supports both fixed-rate and adaptive sampling. By default, adaptive sampling is enabled.

For more information, see [Configure adaptive sampling for ASP.NET Core applications](./sampling.md#configuring-adaptive-sampling-for-aspnet-core-applications).

### Add TelemetryInitializers

When you want to enrich telemetry with more information, use [telemetry initializers](./api-filtering-sampling.md#addmodify-properties-itelemetryinitializer).

Add any new `TelemetryInitializer` to the `DependencyInjection` container as shown in the following code. The SDK automatically picks up any `TelemetryInitializer` that's added to the `DependencyInjection` container.

### [ASP.NET Core 6 and later](#tab/netcorenew)

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();

var app = builder.Build();
```

> [!NOTE]
> `builder.Services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();` works for simple initializers. For others, `builder.Services.AddSingleton(new MyCustomTelemetryInitializer() { fieldName = "myfieldName" });` is required.

### [ASP.NET Core 5 and earlier](#tab/netcoreold)

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();
}
```

> [!NOTE]
> `services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();` works for simple initializers. For others, `services.AddSingleton(new MyCustomTelemetryInitializer() { fieldName = "myfieldName" });` is required.
> This .NET version is no longer supported.

---

### Remove TelemetryInitializers

By default, telemetry initializers are present. To remove all or specific telemetry initializers, use the following sample code *after* calling `AddApplicationInsightsTelemetry()`.

### [ASP.NET Core 6 and later](#tab/netcorenew)

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationInsightsTelemetry();

// Remove a specific built-in telemetry initializer
var tiToRemove = builder.Services.FirstOrDefault<ServiceDescriptor>
                    (t => t.ImplementationType == typeof(AspNetCoreEnvironmentTelemetryInitializer));
if (tiToRemove != null)
{
    builder.Services.Remove(tiToRemove);
}

// Remove all initializers
// This requires importing namespace by using Microsoft.Extensions.DependencyInjection.Extensions;
builder.Services.RemoveAll(typeof(ITelemetryInitializer));

var app = builder.Build();
```

### [ASP.NET Core 5 and earlier](#tab/netcoreold)

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddApplicationInsightsTelemetry();

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

> [!NOTE]
> This .NET version is no longer supported.

---

### Add telemetry processors

You can add custom telemetry processors to `TelemetryConfiguration` by using the extension method `AddApplicationInsightsTelemetryProcessor` on `IServiceCollection`. You use telemetry processors in [advanced filtering scenarios](./api-filtering-sampling.md#itelemetryprocessor-and-itelemetryinitializer). Use the following example:

### [ASP.NET Core 6 and later](#tab/netcorenew)

```csharp
var builder = WebApplication.CreateBuilder(args);

// ...
builder.Services.AddApplicationInsightsTelemetry();
builder.Services.AddApplicationInsightsTelemetryProcessor<MyFirstCustomTelemetryProcessor>();

// If you have more processors:
builder.Services.AddApplicationInsightsTelemetryProcessor<MySecondCustomTelemetryProcessor>();

var app = builder.Build();
```

### [ASP.NET Core 5 and earlier](#tab/netcoreold)

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

> [!NOTE]
> This .NET version is no longer supported.

---

### Configure or remove default TelemetryModules

Application Insights automatically collects telemetry about specific workloads without requiring manual tracking by user.

By default, the following automatic-collection modules are enabled. These modules are responsible for automatically collecting telemetry. You can disable or configure them to alter their default behavior.

* `RequestTrackingTelemetryModule`: Collects RequestTelemetry from incoming web requests.
* `DependencyTrackingTelemetryModule`: Collects [DependencyTelemetry](./asp-net-dependencies.md) from outgoing HTTP calls and SQL calls.
* `PerformanceCollectorModule`: Collects Windows PerformanceCounters.
* `QuickPulseTelemetryModule`: Collects telemetry to show in the Live Metrics portal.
* `AppServicesHeartbeatTelemetryModule`: Collects heartbeats (which are sent as custom metrics), about the App Service environment where the application is hosted.
* `AzureInstanceMetadataTelemetryModule`: Collects heartbeats (which are sent as custom metrics), about the Azure VM environment where the application is hosted.
* `EventCounterCollectionModule`: Collects [EventCounters](eventcounters.md). This module is a new feature and is available in SDK version 2.8.0 and later.

To configure any default `TelemetryModule`, use the extension method `ConfigureTelemetryModule<T>` on `IServiceCollection`, as shown in the following example:

### [ASP.NET Core 6 and later](#tab/netcorenew)

```csharp
using Microsoft.ApplicationInsights.DependencyCollector;
using Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationInsightsTelemetry();

// The following configures DependencyTrackingTelemetryModule.
// Similarly, any other default modules can be configured.
builder.Services.ConfigureTelemetryModule<DependencyTrackingTelemetryModule>((module, o) =>
        {
            module.EnableW3CHeadersInjection = true;
        });

// The following removes all default counters from EventCounterCollectionModule, and adds a single one.
builder.Services.ConfigureTelemetryModule<EventCounterCollectionModule>((module, o) =>
        {
            module.Counters.Add(new EventCounterCollectionRequest("System.Runtime", "gen-0-size"));
        });

// The following removes PerformanceCollectorModule to disable perf-counter collection.
// Similarly, any other default modules can be removed.
var performanceCounterService = builder.Services.FirstOrDefault<ServiceDescriptor>(t => t.ImplementationType == typeof(PerformanceCollectorModule));
if (performanceCounterService != null)
{
    builder.Services.Remove(performanceCounterService);
}

var app = builder.Build();
```

### [ASP.NET Core 5 and earlier](#tab/netcoreold)

```csharp
using Microsoft.ApplicationInsights.DependencyCollector;
using Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector;

public void ConfigureServices(IServiceCollection services)
{
    services.AddApplicationInsightsTelemetry();

    // The following configures DependencyTrackingTelemetryModule.
    // Similarly, any other default modules can be configured.
    services.ConfigureTelemetryModule<DependencyTrackingTelemetryModule>((module, o) =>
            {
                module.EnableW3CHeadersInjection = true;
            });

    // The following removes all default counters from EventCounterCollectionModule, and adds a single one.
    services.ConfigureTelemetryModule<EventCounterCollectionModule>(
            (module, o) =>
            {
                module.Counters.Add(new EventCounterCollectionRequest("System.Runtime", "gen-0-size"));
            }
        );

    // The following removes PerformanceCollectorModule to disable perf-counter collection.
    // Similarly, any other default modules can be removed.
    var performanceCounterService = services.FirstOrDefault<ServiceDescriptor>(t => t.ImplementationType == typeof(PerformanceCollectorModule));
    if (performanceCounterService != null)
    {
        services.Remove(performanceCounterService);
    }
}
```

> [!NOTE]
> This .NET version is no longer supported.

---

In versions 2.12.2 and later, [`ApplicationInsightsServiceOptions`](#use-applicationinsightsserviceoptions) includes an easy option to disable any of the default modules.

### Configure a telemetry channel

The default [telemetry channel](./telemetry-channels.md) is `ServerTelemetryChannel`. The following example shows how to override it.

### [ASP.NET Core 6 and later](#tab/netcorenew)

```csharp
using Microsoft.ApplicationInsights.Channel;

var builder = WebApplication.CreateBuilder(args);

// Use the following to replace the default channel with InMemoryChannel.
// This can also be applied to ServerTelemetryChannel.
builder.Services.AddSingleton(typeof(ITelemetryChannel), new InMemoryChannel() {MaxTelemetryBufferCapacity = 19898 });

builder.Services.AddApplicationInsightsTelemetry();

var app = builder.Build();
```

### [ASP.NET Core 5 and earlier](#tab/netcoreold)

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

> [!NOTE]
> This .NET version is no longer supported.

---

> [!NOTE]
> If you want to flush the buffer, see [Flushing data](api-custom-events-metrics.md#flushing-data). For example, you might need to flush the buffer if you're using the SDK in an application that shuts down.

### Disable telemetry dynamically

If you want to disable telemetry conditionally and dynamically, you can resolve the `TelemetryConfiguration` instance with an ASP.NET Core dependency injection container anywhere in your code and set the `DisableTelemetry` flag on it.

### [ASP.NET Core 6 and later](#tab/netcorenew)

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationInsightsTelemetry();

// any custom configuration can be done here:
builder.Services.Configure<TelemetryConfiguration>(x => x.DisableTelemetry = true);

var app = builder.Build();
```

### [ASP.NET Core 5 and earlier](#tab/netcoreold)

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

> [!NOTE]
> This .NET version is no longer supported.

---

The preceding code sample prevents the sending of telemetry to Application Insights. It doesn't prevent any automatic collection modules from collecting telemetry. If you want to remove a particular autocollection module, see [Remove the telemetry module](#configure-or-remove-default-telemetrymodules).

## Frequently asked questions

This section provides answers to common questions.

### Does Application Insights support ASP.NET Core 3.1?

ASP.NET Core 3.1 is no longer supported by Microsoft.

[Application Insights SDK for ASP.NET Core](https://nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) version 2.8.0 and Visual Studio 2019 or later can be used with ASP.NET Core 3.1 applications. 

### How can I track telemetry that's not automatically collected?

Get an instance of `TelemetryClient` by using constructor injection and call the required `TrackXXX()` method on it. We don't recommend creating new `TelemetryClient` or `TelemetryConfiguration` instances in an ASP.NET Core application. A singleton instance of `TelemetryClient` is already registered in the `DependencyInjection` container, which shares `TelemetryConfiguration` with the rest of the telemetry. Create a new `TelemetryClient` instance only if it needs a configuration that's separate from the rest of the telemetry.

The following example shows how to track more telemetry from a controller.

```csharp
using Microsoft.ApplicationInsights;

public class HomeController : Controller
{
    private TelemetryClient telemetry;

    // Use constructor injection to get a TelemetryClient instance.
    public HomeController(TelemetryClient telemetry)
    {
        this.telemetry = telemetry;
    }

    public IActionResult Index()
    {
        // Call the required TrackXXX method.
        this.telemetry.TrackEvent("HomePageRequested");
        return View();
    }
```

For more information about custom data reporting in Application Insights, see [Application Insights custom metrics API reference](./api-custom-events-metrics.md). A similar approach can be used for sending custom metrics to Application Insights by using the [GetMetric API](./get-metric.md).

### How do I customize ILogger logs collection?

The default setting for Application Insights is to only capture **Warning** and more severe logs.

Capture **Information** and less severe logs by changing the logging configuration for the Application Insights provider as follows.

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    },
    "ApplicationInsights": {
      "LogLevel": {
        "Default": "Information"
      }
    }
  },
  "ApplicationInsights": {
    "ConnectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000"
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

For more information, see [ILogger configuration](/dotnet/core/extensions/logging#configure-logging).

### Some Visual Studio templates used the UseApplicationInsights() extension method on IWebHostBuilder to enable Application Insights. Is this usage still valid?

The extension method `UseApplicationInsights()` is still supported, but it's marked as obsolete in Application Insights SDK version 2.8.0 and later. It's removed in the next major version of the SDK. To enable Application Insights telemetry, use `AddApplicationInsightsTelemetry()` because it provides overloads to control some configuration. Also, in ASP.NET Core 3.X apps, `services.AddApplicationInsightsTelemetry()` is the only way to enable Application Insights.

### I'm deploying my ASP.NET Core application to Web Apps. Should I still enable the Application Insights extension from Web Apps?

If the SDK is installed at build time as shown in this article, you don't need to enable the [Application Insights extension](./azure-web-apps.md) from the App Service portal. If the extension is installed, it backs off when it detects the SDK is already added. If you enable Application Insights from the extension, you don't have to install and update the SDK. But if you enable Application Insights by following instructions in this article, you have more flexibility because:

   * Application Insights telemetry continues to work in:
       * All operating systems, including Windows, Linux, and Mac.
       * All publish modes, including self-contained or framework dependent.
       * All target frameworks, including the full .NET Framework.
       * All hosting options, including Web Apps, VMs, Linux, containers, AKS, and non-Azure hosting.
       * All .NET Core versions, including preview versions.
   * You can see telemetry locally when you're debugging from Visual Studio.
   * You can track more custom telemetry by using the `TrackXXX()` API.
   * You have full control over the configuration.

### Can I enable Application Insights monitoring by using tools like Azure Monitor Application Insights Agent (formerly Status Monitor v2)?

 Yes. In [Application Insights Agent 2.0.0-beta1](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/2.0.0-beta1) and later, ASP.NET Core applications hosted in IIS are supported.

### Are all features supported if I run my application in Linux?

Yes. Feature support for the SDK is the same in all platforms, with the following exceptions:

* The SDK collects [event counters](./eventcounters.md) on Linux because [performance counters](./performance-counters.md) are only supported in Windows. Most metrics are the same.
* Although `ServerTelemetryChannel` is enabled by default, if the application is running in Linux or macOS, the channel doesn't automatically create a local storage folder to keep telemetry temporarily if there are network issues. Because of this limitation, telemetry is lost when there are temporary network or server issues. To work around this issue, configure a local folder for the channel.

### [ASP.NET Core 6.0](#tab/netcore6)

```csharp
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;

var builder = WebApplication.CreateBuilder(args);

// The following will configure the channel to use the given folder to temporarily
// store telemetry items during network or Application Insights server issues.
// User should ensure that the given folder already exists
// and that the application has read/write permissions.
builder.Services.AddSingleton(typeof(ITelemetryChannel),
                        new ServerTelemetryChannel () {StorageFolder = "/tmp/myfolder"});
builder.Services.AddApplicationInsightsTelemetry();

var app = builder.Build();
```

### [ASP.NET Core 3.1](#tab/netcore3)

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

> [!NOTE]
> This .NET version is no longer supported.

---

This limitation isn't applicable from version [2.15.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore/2.15.0) and later.

### Is this SDK supported for the new .NET Core 3.X Worker Service template applications?

This SDK requires `HttpContext`. It doesn't work in any non-HTTP applications, including the .NET Core 3.X Worker Service applications. To enable Application Insights in such applications by using the newly released Microsoft.ApplicationInsights.WorkerService SDK, see [Application Insights for Worker Service applications (non-HTTP applications)](worker-service.md).

### How can I uninstall the SDK?

To remove Application Insights, you need to remove the NuGet packages and references from the API in your application. You can uninstall NuGet packages by using the NuGet Package Manager in Visual Studio.

> [!NOTE]
> These instructions are for uninstalling the ASP.NET Core SDK. If you need to uninstall the ASP.NET SDK, see [How can I uninstall the ASP.NET SDK?](./asp-net.md#how-can-i-uninstall-the-sdk).

1. Uninstall the Microsoft.ApplicationInsights.AspNetCore package by using the [NuGet Package Manager](/nuget/consume-packages/install-use-packages-visual-studio#uninstall-a-package).
1. To fully remove Application Insights, check and manually delete the added code or files along with any API calls you added in your project. For more information, see [What is created when you add the Application Insights SDK?](#what-is-created-when-you-add-the-application-insights-sdk).

### What is created when you add the Application Insights SDK?

When you add Application Insights to your project, it creates files and adds code to some of your files. Solely uninstalling the NuGet Packages won't always discard the files and code. To fully remove Application Insights, you should check and manually delete the added code or files along with any API calls you added in your project.

When you add Application Insights Telemetry to a Visual Studio ASP.NET Core template project, it adds the following code:

- [Your project's name].csproj

    ```csharp
      <PropertyGroup>
        <TargetFramework>netcoreapp3.1</TargetFramework>
        <ApplicationInsightsResourceId>/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Default-ApplicationInsights-EastUS/providers/microsoft.insights/components/WebApplication4core</ApplicationInsightsResourceId>
      </PropertyGroup>
    
      <ItemGroup>
        <PackageReference Include="Microsoft.ApplicationInsights.AspNetCore" Version="2.12.0" />
      </ItemGroup>
    
      <ItemGroup>
        <WCFMetadata Include="Connected Services" />
      </ItemGroup>
    ```

- Appsettings.json:

    ```json
    "ApplicationInsights": {
        "InstrumentationKey": "00000000-0000-0000-0000-000000000000"
    ```

- ConnectedService.json
    
    ```json
    {
      "ProviderId": "Microsoft.ApplicationInsights.ConnectedService.ConnectedServiceProvider",
      "Version": "16.0.0.0",
      "GettingStartedDocument": {
        "Uri": "https://go.microsoft.com/fwlink/?LinkID=798432"
      }
    }
    ```
- Startup.cs

    ```csharp
       public void ConfigureServices(IServiceCollection services)
            {
                services.AddRazorPages();
                services.AddApplicationInsightsTelemetry(); // This is added
            }
    ```

## Troubleshooting

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Open-source SDK

[Read and contribute to the code](https://github.com/microsoft/ApplicationInsights-dotnet).

For the latest updates and bug fixes, see the [release notes](./release-notes.md).

## Release Notes

For version 2.12 and newer: [.NET SDKs (Including ASP.NET, ASP.NET Core, and Logging Adapters)](https://github.com/Microsoft/ApplicationInsights-dotnet/releases) 

Our [Service Updates](https://azure.microsoft.com/updates/?service=application-insights) also summarize major Application Insights improvements.

## Next steps

* [Explore user flows](./usage-flows.md) to understand how users move through your app.
* [Configure a snapshot collection](./snapshot-debugger.md) to see the state of source code and variables at the moment an exception is thrown.
* [Use the API](./api-custom-events-metrics.md) to send your own events and metrics for a detailed view of your app's performance and usage.
* Use [availability tests](./availability-overview.md) to check your app constantly from around the world.
* Learn about [dependency injection in ASP.NET Core](/aspnet/core/fundamentals/dependency-injection).
