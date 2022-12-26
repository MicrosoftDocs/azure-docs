---
title: Azure Application Insights for ASP.NET Core applications | Microsoft Docs
description: Monitor ASP.NET Core web applications for availability, performance, and usage.
ms.topic: conceptual
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.date: 10/27/2022
ms.reviewer: casocha
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

We'll use an [MVC application](/aspnet/core/tutorials/first-mvc-app) example. If you're using the [Worker Service](/aspnet/core/fundamentals/host/hosted-services#worker-service-template), use the instructions from [here](./worker-service.md).

> [!NOTE]
> A preview [OpenTelemetry-based .NET offering](opentelemetry-enable.md?tabs=net) is available. [Learn more](opentelemetry-overview.md).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Supported scenarios

The [Application Insights SDK for ASP.NET Core](https://nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) can monitor your applications no matter where or how they run. If your application is running and has network connectivity to Azure, telemetry can be collected. Application Insights monitoring is supported everywhere .NET Core is supported and covers the following scenarios:

* **Operating system**: Windows, Linux, or Mac
* **Hosting method**: In process or out of process
* **Deployment method**: Framework dependent or self-contained
* **Web server**: IIS (Internet Information Server) or Kestrel
* **Hosting platform**: The Web Apps feature of Azure App Service, Azure VM, Docker, Azure Kubernetes Service (AKS), and so on
* **.NET Core version**: All officially [supported .NET Core versions](https://dotnet.microsoft.com/download/dotnet-core) that aren't in preview
* **IDE**: Visual Studio, Visual Studio Code, or command line

> [!NOTE]
> - ASP.NET Core 6.0 requires [Application Insights 2.19.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore/2.18.0) or later
> - ASP.NET Core 3.1 requires [Application Insights 2.8.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore/2.8.0) or later

## Prerequisites

- A functioning ASP.NET Core application. If you need to create an ASP.NET Core application, follow this [ASP.NET Core tutorial](/aspnet/core/getting-started/).
- A valid Application Insights connection string. This string is required to send any telemetry to Application Insights. If you need to create a new Application Insights resource to get a connection string, see [Create an Application Insights resource](./create-new-resource.md).

## Enable Application Insights server-side telemetry (Visual Studio)

For Visual Studio for Mac, use the [manual guidance](#enable-application-insights-server-side-telemetry-no-visual-studio). Only the Windows version of Visual Studio supports this procedure.

1. Open your project in Visual Studio.

2. Go to **Project** > **Add Application Insights Telemetry**.

3. Choose **Azure Application Insights**, then select **Next**.

4. Choose your subscription and Application Insights instance (or create a new instance with **Create new**), then select **Next**.

5. Add or confirm your Application Insights connection string (this should be prepopulated based on your selection in the previous step), then select **Finish**.

6. After you add Application Insights to your project, check to confirm that you're using the latest stable release of the SDK. Go to **Project** > **Manage NuGet Packages...** > **Microsoft.ApplicationInsights.AspNetCore**. If you need to, select **Update**.

     :::image type="content" source="./media/asp-net-core/update-nuget-package.png" alt-text="Screenshot showing where to select the Application Insights package for update.":::

## Enable Application Insights server-side telemetry (no Visual Studio)

1. Install the [Application Insights SDK NuGet package for ASP.NET Core](https://nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore)

    We recommend that you always use the latest stable version. Find full release notes for the SDK on the [open-source GitHub repo](https://github.com/Microsoft/ApplicationInsights-dotnet/releases).

    The following code sample shows the changes to be added to your project's `.csproj` file.

    ```xml
    <ItemGroup>
        <PackageReference Include="Microsoft.ApplicationInsights.AspNetCore" Version="2.21.0" />
    </ItemGroup>
    ```

2. Add `AddApplicationInsightsTelemetry()` to your `startup.cs` or `program.cs` class (depending on your .NET Core version)

    ### [ASP.NET Core 6.0](#tab/netcore6)
    
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
    
    ### [ASP.NET Core 3.1](#tab/netcore3)
    
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
    
    ---

3. Set up the connection string

    Although you can provide a connection string as part of the `ApplicationInsightsServiceOptions` argument to AddApplicationInsightsTelemetry, we recommend that you specify the connection string in configuration. The following code sample shows how to specify a connection string in `appsettings.json`. Make sure `appsettings.json` is copied to the application root folder during publishing.

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

    Alternatively, specify the connection string in the "APPLICATIONINSIGHTS_CONNECTION_STRING" environment variable or "ApplicationInsights:ConnectionString" in the JSON configuration file.
    
    For example:
    
    * `SET ApplicationInsights:ConnectionString = <Copy connection string from Application Insights Resource Overview>`
    
    * `SET APPLICATIONINSIGHTS_CONNECTION_STRING = <Copy connection string from Application Insights Resource Overview>`
    
    * Typically, `APPLICATIONINSIGHTS_CONNECTION_STRING` is used in [Azure Web Apps](./azure-web-apps.md?tabs=net), but it can also be used in all places where this SDK is supported.
    
    > [!NOTE]
    > An connection string specified in code wins over the environment variable `APPLICATIONINSIGHTS_CONNECTION_STRING`, which wins over other options.

### User secrets and other configuration providers

If you want to store the connection string in ASP.NET Core user secrets or retrieve it from another configuration provider, you can use the overload with a `Microsoft.Extensions.Configuration.IConfiguration` parameter. For example, `services.AddApplicationInsightsTelemetry(Configuration);`.
In Microsoft.ApplicationInsights.AspNetCore version [2.15.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) and later, calling `services.AddApplicationInsightsTelemetry()` automatically reads the connection string from `Microsoft.Extensions.Configuration.IConfiguration` of the application. There's no need to explicitly provide the `IConfiguration`.

If `IConfiguration` has loaded configuration from multiple providers, then `services.AddApplicationInsightsTelemetry` prioritizes configuration from `appsettings.json`, irrespective of the order in which providers are added. Use the `services.AddApplicationInsightsTelemetry(IConfiguration)` method to read configuration from IConfiguration without this preferential treatment for `appsettings.json`.

## Run your application

Run your application and make requests to it. Telemetry should now flow to Application Insights. The Application Insights SDK automatically collects incoming web requests to your application, along with the following telemetry.

### Live Metrics

[Live Metrics](./live-stream.md) can be used to quickly verify if Application Insights monitoring is configured correctly. It might take a few minutes for telemetry to appear in the portal and analytics, but Live Metrics shows CPU usage of the running process in near real time. It can also show other telemetry like Requests, Dependencies, and Traces.

### ILogger logs

The default configuration collects `ILogger` `Warning` logs and more severe logs. Review [How do I customize ILogger logs collection?](#how-do-i-customize-ilogger-logs-collection) for more information.

### Dependencies

Dependency collection is enabled by default. [This](asp-net-dependencies.md#automatically-tracked-dependencies) article explains the dependencies that are automatically collected, and also contain steps to do manual tracking.

### Performance counters

Support for [performance counters](./performance-counters.md) in ASP.NET Core is limited:

* SDK versions 2.4.1 and later collect performance counters if the application is running in Azure Web Apps (Windows).
* SDK versions 2.7.1 and later collect performance counters if the application is running in Windows and targets `NETSTANDARD2.0` or later.
* For applications targeting the .NET Framework, all versions of the SDK support performance counters.
* SDK Versions 2.8.0 and later support cpu/memory counter in Linux. No other counter is supported in Linux. The recommended way to get system counters in Linux (and other non-Windows environments) is by using [EventCounters](#eventcounter).

### EventCounter

By default, `EventCounterCollectionModule` is enabled. To learn how to configure the list of counters to be collected, see [EventCounters introduction](eventcounters.md).

### Enrich data through HTTP

```csharp
HttpContext.Features.Get<RequestTelemetry>().Properties["myProp"] = someData
```

## Enable client-side telemetry for web applications

The preceding steps are enough to help you start collecting server-side telemetry. If your application has client-side components, follow the next steps to start collecting [usage telemetry](./usage-overview.md).

1. In `_ViewImports.cshtml`, add injection:

    ```cshtml
    @inject Microsoft.ApplicationInsights.AspNetCore.JavaScriptSnippet JavaScriptSnippet
    ```

2. In `_Layout.cshtml`, insert `HtmlHelper` at the end of the `<head>` section but before any other script. If you want to report any custom JavaScript telemetry from the page, inject it after this snippet:

    ```cshtml
    @Html.Raw(JavaScriptSnippet.FullScript)
    </head>
    ```

As an alternative to using the `FullScript`, the `ScriptBody` is available starting in Application Insights SDK for ASP.NET Core version 2.14. Use `ScriptBody` if you need to control the `<script>` tag to set a Content Security Policy:

```cshtml
<script> // apply custom changes to this script tag.
 @Html.Raw(JavaScriptSnippet.ScriptBody)
</script>
```

The `.cshtml` file names referenced earlier are from a default MVC application template. Ultimately, if you want to properly enable client-side monitoring for your application, the JavaScript snippet must appear in the `<head>` section of each page of your application that you want to monitor. Add the JavaScript snippet to `_Layout.cshtml` in an application template to enable client-side monitoring.

If your project doesn't include `_Layout.cshtml`, you can still add [client-side monitoring](./website-monitoring.md) by adding the JavaScript snippet to an equivalent file that controls the `<head>` of all pages within your app. Alternatively, you can add the snippet to multiple pages, but we don't recommend it.

> [!NOTE]
> JavaScript injection provides a default configuration experience. If you require [configuration](./javascript.md#configuration) beyond setting the connection string, you are required to remove auto-injection as described above and manually add the [JavaScript SDK](./javascript.md#add-the-javascript-sdk).

## Configure the Application Insights SDK

You can customize the Application Insights SDK for ASP.NET Core to change the default configuration. Users of the Application Insights ASP.NET SDK might be familiar with changing configuration by using `ApplicationInsights.config` or by modifying `TelemetryConfiguration.Active`. For ASP.NET Core, make almost all configuration changes in the `ConfigureServices()` method of your `Startup.cs` class, unless you're directed otherwise. The following sections offer more information.

> [!NOTE]
> In ASP.NET Core applications, changing configuration by modifying `TelemetryConfiguration.Active` isn't supported.

### Using ApplicationInsightsServiceOptions

You can modify a few common settings by passing `ApplicationInsightsServiceOptions` to `AddApplicationInsightsTelemetry`, as in this example:

### [ASP.NET Core 6.0](#tab/netcore6)

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

### [ASP.NET Core 3.1](#tab/netcore3)

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

---

This table has the full list of `ApplicationInsightsServiceOptions` settings:

|Setting | Description | Default
|---------------|-------|-------
|EnablePerformanceCounterCollectionModule  | Enable/Disable `PerformanceCounterCollectionModule` | true
|EnableRequestTrackingTelemetryModule   | Enable/Disable `RequestTrackingTelemetryModule` | true
|EnableEventCounterCollectionModule   | Enable/Disable `EventCounterCollectionModule` | true
|EnableDependencyTrackingTelemetryModule   | Enable/Disable `DependencyTrackingTelemetryModule` | true
|EnableAppServicesHeartbeatTelemetryModule  |  Enable/Disable `AppServicesHeartbeatTelemetryModule` | true
|EnableAzureInstanceMetadataTelemetryModule   |  Enable/Disable `AzureInstanceMetadataTelemetryModule` | true
|EnableQuickPulseMetricStream | Enable/Disable LiveMetrics feature | true
|EnableAdaptiveSampling | Enable/Disable Adaptive Sampling | true
|EnableHeartbeat | Enable/Disable Heartbeats feature, which periodically (15-min default) sends a custom metric named 'HeartbeatState' with information about the runtime like .NET Version, Azure Environment information, if applicable, etc. | true
|AddAutoCollectedMetricExtractor | Enable/Disable AutoCollectedMetrics extractor, which is a TelemetryProcessor that sends pre-aggregated metrics about Requests/Dependencies before sampling takes place. | true
|RequestCollectionOptions.TrackExceptions | Enable/Disable reporting of unhandled Exception tracking by the Request collection module. | false in NETSTANDARD2.0 (because Exceptions are tracked with ApplicationInsightsLoggerProvider), true otherwise.
|EnableDiagnosticsTelemetryModule | Enable/Disable `DiagnosticsTelemetryModule`. Disabling will cause the following settings to be ignored; `EnableHeartbeat`, `EnableAzureInstanceMetadataTelemetryModule`, `EnableAppServicesHeartbeatTelemetryModule` | true

For the most current list, see the [configurable settings in `ApplicationInsightsServiceOptions`](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/NETCORE/src/Shared/Extensions/ApplicationInsightsServiceOptions.cs).

### Configuration recommendation for Microsoft.ApplicationInsights.AspNetCore SDK 2.15.0 and later

In Microsoft.ApplicationInsights.AspNetCore SDK version [2.15.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore/2.15.0) and later, we recommend configuring every setting available in `ApplicationInsightsServiceOptions`, including **ConnectionString** using the application's `IConfiguration` instance. The settings must be under the section "ApplicationInsights", as shown in the following example. The following section from appsettings.json configures the connection string and disables adaptive sampling and performance counter collection.

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

### Adding TelemetryInitializers

When you want to enrich telemetry with additional information, use [telemetry initializers](./api-filtering-sampling.md#addmodify-properties-itelemetryinitializer).

Add any new `TelemetryInitializer` to the `DependencyInjection` container as shown in the following code. The SDK automatically picks up any `TelemetryInitializer` that's added to the `DependencyInjection` container.

### [ASP.NET Core 6.0](#tab/netcore6)

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();

var app = builder.Build();
```

> [!NOTE]
> `builder.Services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();` works for simple initializers. For others, the following is required: `builder.Services.AddSingleton(new MyCustomTelemetryInitializer() { fieldName = "myfieldName" });`

### [ASP.NET Core 3.1](#tab/netcore3)

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();
}
```

> [!NOTE]
> `services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();` works for simple initializers. For others, the following is required: `services.AddSingleton(new MyCustomTelemetryInitializer() { fieldName = "myfieldName" });`

---
    
### Removing TelemetryInitializers

By default, telemetry initializers are present. To remove all or specific telemetry initializers, use the following sample code *after* calling `AddApplicationInsightsTelemetry()`.

### [ASP.NET Core 6.0](#tab/netcore6)

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

### [ASP.NET Core 3.1](#tab/netcore3)

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

---

### Adding telemetry processors

You can add custom telemetry processors to `TelemetryConfiguration` by using the extension method `AddApplicationInsightsTelemetryProcessor` on `IServiceCollection`. You use telemetry processors in [advanced filtering scenarios](./api-filtering-sampling.md#itelemetryprocessor-and-itelemetryinitializer). Use the following example.

### [ASP.NET Core 6.0](#tab/netcore6)

```csharp
var builder = WebApplication.CreateBuilder(args);

// ...
builder.Services.AddApplicationInsightsTelemetry();
builder.Services.AddApplicationInsightsTelemetryProcessor<MyFirstCustomTelemetryProcessor>();

// If you have more processors:
builder.Services.AddApplicationInsightsTelemetryProcessor<MySecondCustomTelemetryProcessor>();

var app = builder.Build();
```

### [ASP.NET Core 3.1](#tab/netcore3)

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

---

### Configuring or removing default TelemetryModules

Application Insights automatically collects telemetry about specific workloads without requiring manual tracking by user.

By default, the following automatic-collection modules are enabled. These modules are responsible for automatically collecting telemetry. You can disable or configure them to alter their default behavior.

* `RequestTrackingTelemetryModule`: Collects RequestTelemetry from incoming web requests
* `DependencyTrackingTelemetryModule`: Collects [DependencyTelemetry](./asp-net-dependencies.md) from outgoing http calls and sql calls
* `PerformanceCollectorModule`: Collects Windows PerformanceCounters
* `QuickPulseTelemetryModule`: Collects telemetry for showing in Live Metrics portal
* `AppServicesHeartbeatTelemetryModule`: Collects heart beats (which are sent as custom metrics), about Azure App Service environment where application is hosted
* `AzureInstanceMetadataTelemetryModule`:  Collects heart beats (which are sent as custom metrics), about Azure VM environment where application is hosted
* `EventCounterCollectionModule`:  Collects [EventCounters](eventcounters.md); this module is a new feature and is available in SDK version 2.8.0 and later

To configure any default `TelemetryModule`, use the extension method `ConfigureTelemetryModule<T>` on `IServiceCollection`, as shown in the following example.

### [ASP.NET Core 6.0](#tab/netcore6)

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

### [ASP.NET Core 3.1](#tab/netcore3)

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

---

In versions 2.12.2 and later, [`ApplicationInsightsServiceOptions`](#using-applicationinsightsserviceoptions) includes an easy option to disable any of the default modules.

### Configuring a telemetry channel

The default [telemetry channel](./telemetry-channels.md) is `ServerTelemetryChannel`. The following example shows how to override it.

### [ASP.NET Core 6.0](#tab/netcore6)

```csharp
using Microsoft.ApplicationInsights.Channel;

var builder = WebApplication.CreateBuilder(args);

// Use the following to replace the default channel with InMemoryChannel.
// This can also be applied to ServerTelemetryChannel.
builder.Services.AddSingleton(typeof(ITelemetryChannel), new InMemoryChannel() {MaxTelemetryBufferCapacity = 19898 });

builder.Services.AddApplicationInsightsTelemetry();

var app = builder.Build();
```

### [ASP.NET Core 3.1](#tab/netcore3)

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

---

> [!NOTE]
> See [Flushing data](api-custom-events-metrics.md#flushing-data) if you want to flush the buffer--for example, if you are using the SDK in an application that shuts down.

### Disable telemetry dynamically

If you want to disable telemetry conditionally and dynamically, you can resolve the `TelemetryConfiguration` instance with an ASP.NET Core dependency injection container anywhere in your code and set the `DisableTelemetry` flag on it.

### [ASP.NET Core 6.0](#tab/netcore6)

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationInsightsTelemetry();

// any custom configuration can be done here:
builder.Services.Configure<TelemetryConfiguration>(x => x.DisableTelemetry = true);

var app = builder.Build();
```

### [ASP.NET Core 3.1](#tab/netcore3)

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

---

The preceding code sample prevents the sending of telemetry to Application Insights. It doesn't prevent any automatic collection modules from collecting telemetry. If you want to remove a particular auto collection module, see [Remove the telemetry module](#configuring-or-removing-default-telemetrymodules).

## Frequently asked questions

### Does Application Insights support ASP.NET Core 3.X?

Yes. Update to [Application Insights SDK for ASP.NET Core](https://nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) version 2.8.0 or later. Earlier versions of the SDK don't support ASP.NET Core 3.X.

Also, if you're [enabling server-side telemetry based on Visual Studio](#enable-application-insights-server-side-telemetry-visual-studio), update to the latest version of Visual Studio 2019 (16.3.0) to onboard. Earlier versions of Visual Studio don't support automatic onboarding for ASP.NET Core 3.X apps.

### How can I track telemetry that's not automatically collected?

Get an instance of `TelemetryClient` by using constructor injection, and call the required `TrackXXX()` method on it. We don't recommend creating new `TelemetryClient` or `TelemetryConfiguration` instances in an ASP.NET Core application. A singleton instance of `TelemetryClient` is already registered in the `DependencyInjection` container, which shares `TelemetryConfiguration` with rest of the telemetry. Creating a new `TelemetryClient` instance is recommended only if it needs a configuration that's separate from the rest of the telemetry.

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

For more information about custom data reporting in Application Insights, see [Application Insights custom metrics API reference](./api-custom-events-metrics.md). A similar approach can be used for sending custom metrics to Application Insights using the [GetMetric API](./get-metric.md).

### How do I customize ILogger logs collection?

By default, only `Warning` logs and more severe logs are automatically captured. To change this behavior, explicitly override the logging configuration for the provider `ApplicationInsights` as shown in the following code.
The following configuration allows Application Insights to capture all `Information` logs and more severe logs.

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

For more information, see [ILogger configuration](ilogger.md#logging-level).

### Some Visual Studio templates used the UseApplicationInsights() extension method on IWebHostBuilder to enable Application Insights. Is this usage still valid?

The extension method `UseApplicationInsights()` is still supported, but it's marked as obsolete in Application Insights SDK version 2.8.0 and later. It will be removed in the next major version of the SDK. To enable Application Insights telemetry, we recommend using `AddApplicationInsightsTelemetry()` because it provides overloads to control some configuration. Also, in ASP.NET Core 3.X apps, `services.AddApplicationInsightsTelemetry()` is the only way to enable Application Insights.

### I'm deploying my ASP.NET Core application to Web Apps. Should I still enable the Application Insights extension from Web Apps?

If the SDK is installed at build time as shown in this article, you don't need to enable the [Application Insights extension](./azure-web-apps.md) from the App Service portal. If the extension is installed, it will back off when it detects the SDK is already added. If you enable Application Insights from the extension, you don't have to install and update the SDK. But if you enable Application Insights by following instructions in this article, you have more flexibility because:

   * Application Insights telemetry will continue to work in:
       * All operating systems, including Windows, Linux, and Mac.
       * All publish modes, including self-contained or framework dependent.
       * All target frameworks, including the full .NET Framework.
       * All hosting options, including Web Apps, VMs, Linux, containers, Azure Kubernetes Service, and non-Azure hosting.
       * All .NET Core versions including preview versions.
   * You can see telemetry locally when you're debugging from Visual Studio.
   * You can track more custom telemetry by using the `TrackXXX()` API.
   * You have full control over the configuration.

### Can I enable Application Insights monitoring by using tools like Azure Monitor Application Insights Agent (formerly Status Monitor v2)?

 Yes. In [Application Insights Agent 2.0.0-beta1](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/2.0.0-beta1) and later, ASP.NET Core applications hosted in IIS are supported.

### Are all features supported if I run my application in Linux?

Yes. Feature support for the SDK is the same in all platforms, with the following exceptions:

* The SDK collects [event counters](./eventcounters.md) on Linux because [performance counters](./performance-counters.md) are only supported in Windows. Most metrics are the same.
* Although `ServerTelemetryChannel` is enabled by default, if the application is running in Linux or macOS, the channel doesn't automatically create a local storage folder to keep telemetry temporarily if there are network issues. Because of this limitation, telemetry is lost when there are temporary network or server issues. To work around this issue, configure a local folder for the channel:

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

---

This limitation isn't applicable from version [2.15.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore/2.15.0) and later.

### Is this SDK supported for the new .NET Core 3.X Worker Service template applications?

This SDK requires `HttpContext`. Therefore, it doesn't work in any non-HTTP applications, including the .NET Core 3.X Worker Service applications. To enable Application Insights in such applications using the newly released Microsoft.ApplicationInsights.WorkerService SDK, see [Application Insights for Worker Service applications (non-HTTP applications)](worker-service.md).

## Troubleshooting

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Open-source SDK

* [Read and contribute to the code](https://github.com/microsoft/ApplicationInsights-dotnet).

For the latest updates and bug fixes, see the [release notes](./release-notes.md).

## Next steps

* [Explore user flows](./usage-flows.md) to understand how users navigate through your app.
* [Configure a snapshot collection](./snapshot-debugger.md) to see the state of source code and variables at the moment an exception is thrown.
* [Use the API](./api-custom-events-metrics.md) to send your own events and metrics for a detailed view of your app's performance and usage.
* Use [availability tests](./monitor-web-app-availability.md) to check your app constantly from around the world.
* [Dependency Injection in ASP.NET Core](/aspnet/core/fundamentals/dependency-injection)
