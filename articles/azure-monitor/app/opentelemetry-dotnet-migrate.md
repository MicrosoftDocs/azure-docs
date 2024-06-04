---
title: Migrate from Azure Monitor Application Insights .NET Classic API SDKs to OpenTelemetry
description: This article provides guidance on how to migrate .NET applications from the Azure Monitor Application Insights Classic API SDK to OpenTelemetry.
ms.topic: conceptual
ms.date: 06/07/2024
ms.devlang: csharp
ms.custom: devx-track-dotnet
ms.reviewer: mmcc
---

# Migrate from .NET Classic API SDKs to Azure Monitor OpenTelemetry

This guide provides options to migrate various .NET applications from the Application Insights Classic API SDK to Azure Monitor OpenTelemetry.

## Migration paths

We cover ASP.NET, ASP.NET Core, console, and WorkerService migrations. For more information, see [Advanced Scenarios](#advanced-scenarios).

### [ASP.NET Core](#tab/aspnetcore)

### Prerequisites

* An ASP.NET Core web application already instrumented with Application Insights without any customizations
* An actively supported version of [.NET](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)

### Steps to Migrate

#### Step 1: Remove Application Insights SDK

The first step is to remove the Application Insights SDK.
If you used Visual Studio's Add Application Insights experience, this would have added some additional files.
Before continuing with these steps, you should confirm that you have a current backup of your application.

1. Remove NuGet packages

    Remove the `Microsoft.ApplicationInsights.AspNetCore` package from your `csproj`.

    ```console
    dotnet remove package Microsoft.ApplicationInsights.AspNetCore
    ```

2. Remove Initialization Code and customizations

    Remove any references to Application Insights types in your codebase.

    > [!Tip]
    > After removing the Application Insights package, you can re-build your application to get a list of references that need to be removed.

    - Remove Application Insights from your `ServiceCollection` by deleting the following line:

        ```csharp
        builder.Services.AddApplicationInsightsTelemetry();
        ```

    - Remove the `ApplicationInsights` section from your `appsettings.json`.

        ```json
        {
            "ApplicationInsights": {
                "ConnectionString": "<Your Connection String>"
            }
        }
        ```

3. Clean and Build

    Inspect your bin directory to validate that all references to `Microsoft.ApplicationInsights.*` were removed.

4. Test your application

    Verify that your application has no unexpected consequenses.

#### Step 2: Install the Azure Monitor Distro and Enable at Application Startup

1. Install the Azure Monitor Distro

    Our Azure Monitor Distro enables automatic telemetry by including OpenTelemetry instrumentation libraries for collecting traces, metrics, logs, and exceptions, and allows collecting custom telemetry.

    ```console
    dotnet add package Azure.Monitor.OpenTelemetry.AspNetCore
    ```

2. Add and configure both OpenTelemetry and Azure Monitor

    The OpenTelemery SDK must be configured at application startup as part of your `ServiceCollection`.
    This is typically done in the `Program.cs`.

    OpenTelemetry has a concept of three signals; Traces, Metrics, and Logs.
    The Azure Monitor Distro will configure each of these signals.

    **Program.cs**

    The following code sample shows a simple example meant only to show the basics.

    ```csharp
    var builder = WebApplication.CreateBuilder(args);

    // Call AddOpenTelemetry() to add OpenTelemetry to your ServiceCollection.
    // Call UseAzureMonitor() to fully configure OpenTelemetry.
    builder.Services.AddOpenTelemetry().UseAzureMonitor();

    var app = builder.Build();
    app.MapGet("/", () => "Hello World");
    app.Run();
    ```

    We recommend setting your Connection String in an environment variable:

    ```console
    APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>
    ```

    Additional options to configure the Connection String are detailed here: [Configure the Application Insights Connection String](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-configuration?tabs=aspnetcore#connection-string).

#### Step 3: Additional configurations

Application Insights offered many additional configuration options via `ApplicationInsightsServiceOptions`.

| Application Insights Setting               | OpenTelemetry Alternative                                                                                            |
|--------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| AddAutoCollectedMetricExtractor            | N/A                                                                                                                  |
| ApplicationVersion                         | Set "service.version" on Resource                                                                                    |
| ConnectionString                           | See [instructions](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-configuration?tabs=aspnetcore#connection-string) on configuring the Conneciton String.  |
| DependencyCollectionOptions                | N/A. To customize dependencies, review the available configuration options for applicable Instrumentation libraries. |
| DeveloperMode                              | N/A                                                                                                                  |
| EnableActiveTelemetryConfigurationSetup    | N/A                                                                                                                  |
| EnableAdaptiveSampling                     | N/A. Currently only fixed-rate sampling is supported.                                                                |
| EnableAppServicesHeartbeatTelemetryModule  | N/A                                                                                                                  |
| EnableAuthenticationTrackingJavaScript     | N/A                                                                                                                  |
| EnableAzureInstanceMetadataTelemetryModule | N/A                                                                                                                  |
| EnableDependencyTrackingTelemetryModule    | See instructions on filtering Traces.                                                                                |
| EnableDiagnosticsTelemetryModule           | N/A                                                                                                                  |
| EnableEventCounterCollectionModule         | N/A                                                                                                                  |
| EnableHeartbeat                            | N/A                                                                                                                  |
| EnablePerformanceCounterCollectionModule   | N/A                                                                                                                  |
| EnableQuickPulseMetricStream               | AzureMonitorOptions.EnableLiveMetrics                                                                                |
| EnableRequestTrackingTelemetryModule       | See instructions on filtering Traces.                                                                                |
| EndpointAddress                            | Use ConnectionString.                                                                                                |
| InstrumentationKey                         | Use ConnectionString.                                                                                                |
| RequestCollectionOptions                   | N/A. See OpenTelemetry.Instrumentation.AspNetCore options.                                                           |

### Remove Custom Configurations

The following scenarios are optional and may only apply to advanced users.

* If you have any additional references to the `TelemetryClient` which may have been used to [manually record telemetry](https://learn.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics), these should be removed.
* If you added any [custom filtering or enrichment](https://learn.microsoft.com/azure/azure-monitor/app/api-filtering-sampling) in the form of a custom `TelemetryProcessor` or `TelemetryInitializer`, these should be removed. These would have been added to your `ServiceCollection`.

    ```csharp
    builder.Services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();
    ```

    ```csharp
    builder.Services.AddApplicationInsightsTelemetryProcessor<MyCustomTelemetryProcessor>();
    ```

* Remove JavaScript Snippet

    If you used the Snippet provided by the Application Insights .NET SDK, this must also be removed.
    For full code samples of what to remove, review the guide [enable client-side telemetry for web applications](https://learn.microsoft.com/azure/azure-monitor/app/asp-net-core?tabs=netcorenew#enable-client-side-telemetry-for-web-applications).

    If you added the JavaScript SDK to collect client-side telemetry, this can also be removed although this will continue to work without the .NET SDK.
    For full code samples of what to remove, review the [onboarding guide for the Javascript SDK](https://learn.microsoft.com/azure/azure-monitor/app/javascript-sdk).

* Remove any Visual Studio Artifacts

    If you used Visual Studio to onboard to Application Insights you may have additional files left over in your project.

  - `Properties/ServiceDependencies` directory might have a reference to your Application Insights resource.

### [.NET](#tab/net)

### Prerequisites

* An ASP.NET web application already instrumented with Application Insights
* An actively supported version of [.NET Framework](https://learn.microsoft.com/lifecycle/products/microsoft-net-framework)

### Steps to Migrate

#### Step 1: Remove Application Insights SDK

When you first added Application Insights to your project, the SDK would have added a config file and made some edits to the web.config.
If you used Visual Studio's Add Application Insights experience, this would have added additional files.
If using Nuget tools to remove the Application Insights, some of this will be cleaned up.
If you're manually removing the package reference from your csproj, you'll need to manually cleanup these artifacts.
Before continuing with these steps, you should confirm that you have a current backup of your application.

1. Remove NuGet packages

   Remove the `Microsoft.AspNet.TelemetryCorrelation` package and any `Microsoft.ApplicationInsights.*` packages from your `csproj` and `packages.config`.

2. Delete the `ApplicationInsights.config` file

3. Delete section from your application's `Web.config` file

    - Two [HttpModules](https://learn.microsoft.com/troubleshoot/developer/webapps/aspnet/development/http-modules-handlers) were automatically added to your web.config when you first added ApplicationInsights to your project.
    Any references to the `TelemetryCorrelationHttpModule` and the `ApplicationInsightsWebTracking` should be removed.
    If you added Application Insights to your [IIS Modules](https://learn.microsoft.com/iis/get-started/introduction-to-iis/iis-modules-overview), this should also be removed.

      ```xml
      <configuration>
        <system.web>
          <httpModules>
            <add name="TelemetryCorrelationHttpModule" type="Microsoft.AspNet.TelemetryCorrelation.TelemetryCorrelationHttpModule, Microsoft.AspNet.TelemetryCorrelation" />
            <add name="ApplicationInsightsWebTracking" type="Microsoft.ApplicationInsights.Web.ApplicationInsightsHttpModule, Microsoft.AI.Web" />
          </httpModules>
        </system.web>
        <system.webServer>
          <modules>
            <remove name="TelemetryCorrelationHttpModule" />
            <add name="TelemetryCorrelationHttpModule" type="Microsoft.AspNet.TelemetryCorrelation.TelemetryCorrelationHttpModule, Microsoft.AspNet.TelemetryCorrelation" preCondition="managedHandler" />
            <remove name="ApplicationInsightsWebTracking" />
            <add name="ApplicationInsightsWebTracking" type="Microsoft.ApplicationInsights.Web.ApplicationInsightsHttpModule, Microsoft.AI.Web" preCondition="managedHandler" />
          </modules>
        </system.webServer>
      </configuration>
      ```

    - Also review any [assembly version redirections](https://learn.microsoft.com/dotnet/framework/configure-apps/redirect-assembly-versions) that may have been added to your web.config.

4. Remove Initialization Code and customizations

    Remove any references to Application Insights types in your codebase.

    > [!Tip]
    > After removing the Application Insights package, you can re-build your application to get a list of references that need to be removed.

    - Remove references to `TelemetryConfiguration` or `TelemetryClient`. These should have been a part of your application startup to initialize the Application Insights SDK.

    The following scenarios are optional and may only apply to advanced users.

    - If you have any additional references to the `TelemetryClient` which may have been used to [manually record telemetry](https://learn.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics), these should be removed.
    - If you added any [custom filtering or enrichment](https://learn.microsoft.com/azure/azure-monitor/app/api-filtering-sampling) in the form of a custom `TelemetryProcessor` or `TelemetryInitializer`, these should be removed. These would have been referenced in your configuration.
    - If your project has a `FilterConfig.cs` in the `App_Start` directory, check for any custom exception handlers that reference Application Insights and remove.

5. Remove JavaScript Snippet

    If you added the JavaScript SDK to collect client-side telemetry, this can also be removed although this will continue to work without the .NET SDK.
    For full code samples of what to remove, review the [onboarding guide for the Javascript SDK](https://learn.microsoft.com/azure/azure-monitor/app/javascript-sdk).

6. Remove any Visual Studio Artifacts

    If you used Visual Studio to onboard to Application Insights you may have additional files left over in your project.

    - `ConnectedService.json` might have a reference to your Application Insights resource.
    - `[Your project's name].csproj` might have a reference to your Application Insights resource:

        ```xml
        <ApplicationInsightsResourceId>/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Default-ApplicationInsights-EastUS/providers/microsoft.insights/components/WebApplication4</ApplicationInsightsResourceId>
        ```

7. Clean and Build

    Inspect your bin directory to validate that all references to `Microsoft.ApplicationInsights.` were removed.

8. Test your application

    Verify that your application has no unexpected consequenses.

#### Step 2: Install the OpenTelemetry SDK and Enable at Application Startup

1. Install the OpenTelemetry SDK via Azure Monitor

    Installing the Azure Monitor Exporter will bring the [OpenTelemetry SDK](https://www.nuget.org/packages/OpenTelemetry) as a dependency.

    ```console
    dotnet add package Azure.Monitor.OpenTelemetry.Exporter
    ```

2. Configure OpenTelemetry as part of your application startup

    The OpenTelemery SDK must be configured at application startup. This is typically done in the `Global.asax.cs`.
    OpenTelemetry has a concept of three signals; Traces, Metrics, and Logs.
    Each of these signals will need to be configured as part of your application startup.
    `TracerProvider`, `MeterProvider`, and `ILoggerFactory` should be created once for your application and disposed when your application shuts down.

##### Global.asax.cs

The following code sample shows a simple example meant only to show the basics.
No telemetry will be collected at this point.

```csharp
using Microsoft.Extensions.Logging;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

public class Global : System.Web.HttpApplication
{
    private TracerProvider? tracerProvider;
    private MeterProvider? meterProvider;
    // The LoggerFactory needs to be accessible from the rest of your application.
    internal static ILoggerFactory loggerFactory;

    protected void Application_Start()
    {
        this.tracerProvider = Sdk.CreateTracerProviderBuilder()
            .Build();

        this.meterProvider = Sdk.CreateMeterProviderBuilder()
            .Build();

        loggerFactory = LoggerFactory.Create(builder =>
        {
            builder.AddOpenTelemetry();
        });
    }

    protected void Application_End()
    {
        this.tracerProvider?.Dispose();
        this.meterProvider?.Dispose();
        loggerFactory?.Dispose();
    }
}
```

#### Step 3: Install and Configure Instrumentation Libraries

[Instrumentation libraries](https://opentelemetry.io/docs/specs/otel/overview/#instrumentation-libraries) can be added to your project to auto collect telemetry about specific components or dependencies. We recommend the following libraries:

1. [OpenTelemetry.Instrumentation.AspNet](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNet) can be used to collect telemetry for incoming requests. Azure Monitor will map this to [Request Telemetry](https://learn.microsoft.com/azure/azure-monitor/app/data-model-complete#request).

    ```console
    dotnet add package OpenTelemetry.Instrumentation.AspNet
    ```

    This requires adding an additional HttpModule to your `Web.config`:

    ```xml
    <system.webServer>
      <modules>
          <add
              name="TelemetryHttpModule"
              type="OpenTelemetry.Instrumentation.AspNet.TelemetryHttpModule,
                  OpenTelemetry.Instrumentation.AspNet.TelemetryHttpModule"
              preCondition="integratedMode,managedHandler" />
      </modules>
    </system.webServer>
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.AspNet Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AspNet)

2. [OpenTelemetry.Instrumentation.Http](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http) can be used to collect telemetry for outbound http dependencies. Azure Monitor will map this to [Dependency Telemetry](https://learn.microsoft.com/azure/azure-monitor/app/data-model-complete#dependency).

    ```console
    dotnet add package OpenTelemetry.Instrumentation.Http
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.Http Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.Http)

3. [OpenTelemetry.Instrumentation.SqlClient](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient) can be used to collect telemetry for MS SQL dependencies. Azure Monitor will map this to [Dependency Telemetry](https://learn.microsoft.com/azure/azure-monitor/app/data-model-complete#dependency).

    ```console
    dotnet add package --prerelease OpenTelemetry.Instrumentation.SqlClient
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.SqlClient Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.SqlClient)

##### Global.asax.cs

The following code sample expands on the previous example.
This now collects telemetry, but does not yet send to Application Insights.

```csharp
using Microsoft.Extensions.Logging;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

public class Global : System.Web.HttpApplication
{
    private TracerProvider? tracerProvider;
    private MeterProvider? meterProvider;
    internal static ILoggerFactory loggerFactory;

    protected void Application_Start()
    {
        this.tracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddAspNetInstrumentation()
            .AddHttpClientInstrumentation()
            .AddSqlClientInstrumentation()
            .Build();

        this.meterProvider = Sdk.CreateMeterProviderBuilder()
            .AddAspNetInstrumentation()
            .AddHttpClientInstrumentation()
            .Build();

        loggerFactory = LoggerFactory.Create(builder =>
        {
            builder.AddOpenTelemetry();
        });
    }

    protected void Application_End()
    {
        this.tracerProvider?.Dispose();
        this.meterProvider?.Dispose();
        loggerFactory?.Dispose();
    }
}
```

#### Step 4: Configure the Azure Monitor Exporter

To send your telemetry to Application Insights, the Azure Monitor Exporter must be added to the configuration of all three signals.

##### Global.asax.cs

The following code sample expands on the previous example.
This now collects telemetry and will send to Application Insights.

```csharp
public class Global : System.Web.HttpApplication
{
    private TracerProvider? tracerProvider;
    private MeterProvider? meterProvider;
    internal static ILoggerFactory loggerFactory;

    protected void Application_Start()
    {
        this.tracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddAspNetInstrumentation()
            .AddHttpClientInstrumentation()
            .AddSqlClientInstrumentation()
            .AddAzureMonitorTraceExporter()
            .Build();

        this.meterProvider = Sdk.CreateMeterProviderBuilder()
            .AddAspNetInstrumentation()
            .AddHttpClientInstrumentation()
            .AddAzureMonitorMetricExporter()
            .Build();

        loggerFactory = LoggerFactory.Create(builder =>
        {
            builder.AddOpenTelemetry(o => o.AddAzureMonitorLogExporter());
        });
    }

    protected void Application_End()
    {
        this.tracerProvider?.Dispose();
        this.meterProvider?.Dispose();
        loggerFactory?.Dispose();
    }
}
```

We recommend setting your Connection String in an environment variable:

```console
APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>
```

Additional options to configure the Connection String are detailed here: [Configure the Application Insights Connection String](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-configuration?tabs=net#connection-string).

### [Console](#tab/console)

### Prerequisites

* A Console application already instrumented with Application Insights
* An actively supported version of [.NET Framework](https://learn.microsoft.com/lifecycle/products/microsoft-net-framework) or [.NET](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)

### Steps to Migrate

#### Step 1: Remove Application Insights SDK

Before continuing with these steps, you should confirm that you have a current backup of your application.

1. Remove NuGet packages

   Remove any `Microsoft.ApplicationInsights.*` packages from your `csproj` and `packages.config`.

    ```console
    dotnet remove package Microsoft.ApplicationInsights
    ```

    > [!Tip]
    > If you've used [Microsoft.ApplicationInsights.WorkerService](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService), please refer to our [Guide for WorkerService applications](guide_workerservice.md).

2. Remove Initialization Code and customizations

    Remove any references to Application Insights types in your codebase.

    > [!Tip]
    > After removing the Application Insights package, you can re-build your application to get a list of references that need to be removed.

    - Remove references to `TelemetryConfiguration` or `TelemetryClient`. These should have been a part of your application startup to initialize the Application Insights SDK.

        ```csharp
        var config = TelemetryConfiguration.CreateDefault();
        var client = new TelemetryClient(config);
        ```

    > [!Tip]
    > If you've used `AddApplicationInsightsTelemetryWorkerService()` to add Application Insights to your `ServiceCollection`, please refer to our [Guide for WorkerService applications](guide_workerservice.md).

3. Clean and Build

    Inspect your bin directory to validate that all references to `Microsoft.ApplicationInsights.` were removed.

4. Test your application

    Verify that your application has no unexpected consequenses.

#### Step 2: Install the OpenTelemetry SDK and Enable at Application Startup

1. Install the OpenTelemetry SDK via Azure Monitor

    Installing the [Azure Monitor Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) will bring the [OpenTelemetry SDK](https://www.nuget.org/packages/OpenTelemetry) as a dependency.

    ```console
    dotnet add package Azure.Monitor.OpenTelemetry.Exporter
    ```

2. Configure OpenTelemetry as part of your application startup

    The OpenTelemery SDK must be configured at application startup. This is typically done in the `Program.cs`.
    OpenTelemetry has a concept of three signals; Traces, Metrics, and Logs.
    Each of these signals will need to be configured as part of your application startup.
    `TracerProvider`, `MeterProvider`, and `ILoggerFactory` should be created once for your application and disposed when your application shuts down.

The following code sample shows a simple example meant only to show the basics.
No telemetry will be collected at this point.

##### Program.cs

```csharp
using Microsoft.Extensions.Logging;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

internal class Program
{
    static void Main(string[] args)
    {
        TracerProvider tracerProvider = Sdk.CreateTracerProviderBuilder()
            .Build();

        MeterProvider meterProvider = Sdk.CreateMeterProviderBuilder()
            .Build();

        ILoggerFactory loggerFactory = LoggerFactory.Create(builder =>
        {
            builder.AddOpenTelemetry();
        });

        Console.WriteLine("Hello, World!");

        // Dispose tracer provider before the application ends.
        // This will flush the remaining spans and shutdown the tracing pipeline.
        tracerProvider.Dispose();

        // Dispose meter provider before the application ends.
        // This will flush the remaining metrics and shutdown the metrics pipeline.
        meterProvider.Dispose();

        // Dispose logger factory before the application ends.
        // This will flush the remaining logs and shutdown the logging pipeline.
        loggerFactory.Dispose();
    }
}
```

#### Step 3: Install and Configure Instrumentation Libraries

[Instrumentation libraries](https://opentelemetry.io/docs/specs/otel/overview/#instrumentation-libraries) can be added to your project to auto collect telemetry about specific components or dependencies. We recommend the following libraries:

1. [OpenTelemetry.Instrumentation.Http](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http) can be used to collect telemetry for outbound http dependencies. Azure Monitor will map this to [Dependency Telemetry](https://learn.microsoft.com/azure/azure-monitor/app/data-model-complete#dependency).

    ```console
    dotnet add package OpenTelemetry.Instrumentation.Http
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.Http Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.Http)

2. [OpenTelemetry.Instrumentation.SqlClient](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient) can be used to collect telemetry for MS SQL dependencies. Azure Monitor will map this to [Dependency Telemetry](https://learn.microsoft.com/azure/azure-monitor/app/data-model-complete#dependency).

    ```console
    dotnet add package --prerelease OpenTelemetry.Instrumentation.SqlClient
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.SqlClient Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.SqlClient)

The following code sample expands on the previous example.
This now collects telemetry, but does not yet send to Application Insights.

##### Program.cs

```csharp
using Microsoft.Extensions.Logging;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

internal class Program
{
    static void Main(string[] args)
    {
        TracerProvider tracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddHttpClientInstrumentation()
            .AddSqlClientInstrumentation()
            .Build();

        MeterProvider meterProvider = Sdk.CreateMeterProviderBuilder()
            .AddHttpClientInstrumentation()
            .Build();

        ILoggerFactory loggerFactory = LoggerFactory.Create(builder =>
        {
            builder.AddOpenTelemetry();
        });

        Console.WriteLine("Hello, World!");

        tracerProvider.Dispose();
        meterProvider.Dispose();
        loggerFactory.Dispose();
    }
}
```

#### Step 4: Configure the Azure Monitor Exporter

To send your telemetry to Application Insights, the Azure Monitor Exporter must be added to the configuration of all three signals.

##### Program.cs

The following code sample expands on the previous example.
This now collects telemetry and will send to Application Insights.

```csharp
using Microsoft.Extensions.Logging;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

internal class Program
{
    static void Main(string[] args)
    {
        TracerProvider tracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddHttpClientInstrumentation()
            .AddSqlClientInstrumentation()
            .AddAzureMonitorTraceExporter()
            .Build();

        MeterProvider meterProvider = Sdk.CreateMeterProviderBuilder()
            .AddHttpClientInstrumentation()
            .AddAzureMonitorMetricExporter()
            .Build();

        ILoggerFactory loggerFactory = LoggerFactory.Create(builder =>
        {
            builder.AddOpenTelemetry(o => o.AddAzureMonitorLogExporter());
        });

        Console.WriteLine("Hello, World!");

        tracerProvider.Dispose();
        meterProvider.Dispose();
        loggerFactory.Dispose();
    }
}
```

We recommend setting your Connection String in an environment variable:

```console
APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>
```

Additional options to configure the Connection String are detailed here: [Configure the Application Insights Connection String](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-configuration?tabs=net#connection-string).

### Remove Custom Configurations

The following scenarios are optional and may only apply to advanced users.

* If you have any additional references to the `TelemetryClient` which may have been used to [manually record telemetry](https://learn.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics), these should be removed.

* If you added any [custom filtering or enrichment](https://learn.microsoft.com/azure/azure-monitor/app/api-filtering-sampling) in the form of a custom `TelemetryProcessor` or `TelemetryInitializer`, these should be removed. These would have been referenced in your configuration.

* Remove any Visual Studio Artifacts

  If you used Visual Studio to onboard to Application Insights you may have additional files left over in your project.

  - `ConnectedService.json` might have a reference to your Application Insights resource.
  - `[Your project's name].csproj` might have a reference to your Application Insights resource:

      ```xml
      <ApplicationInsightsResourceId>/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Default-ApplicationInsights-EastUS/providers/microsoft.insights/components/WebApplication4</ApplicationInsightsResourceId>
      ```

### [WorkerService](#tab/workerservice)

### Prerequisites

* A WorkerService application already instrumented with Application Insights without any customizations
* An actively supported version of [.NET](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)

### Steps to Migrate

#### Step 1: Remove Application Insights SDK

The first step is to remove the Application Insights SDK.
If you used Visual Studio's Add Application Insights experience, this would have added some additional files.
Before continuing with these steps, you should confirm that you have a current backup of your application.

1. Remove NuGet packages

    Remove the `Microsoft.ApplicationInsights.WorkerService` package from your `csproj`.

    ```console
    dotnet remove package Microsoft.ApplicationInsights.AspNetCore
    ```

2. Remove Initialization Code and customizations

    Remove any references to Application Insights types in your codebase.

    > [!Tip]
    > After removing the Application Insights package, you can re-build your application to get a list of references that need to be removed.

    - Remove Application Insights from your `ServiceCollection` by deleting the following line:

        ```csharp
        builder.Services.AddApplicationInsightsTelemetryWorkerService();
        ```

    - Remove the `ApplicationInsights` section from your `appsettings.json`.

        ```json
        {
            "ApplicationInsights": {
                "ConnectionString": "<Your Connection String>"
            }
        }
        ```

3. Clean and Build

    Inspect your bin directory to validate that all references to `Microsoft.ApplicationInsights.*` were removed.

4. Test your application

    Verify that your application has no unexpected consequenses.

#### Step 2: Install the OpenTelemetry SDK and Enable at Application Startup

1. Install the OpenTelemetry SDK via Azure Monitor

    Installing the [Azure Monitor Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) will bring the [OpenTelemetry SDK](https://www.nuget.org/packages/OpenTelemetry) as a dependency.

    ```console
    dotnet add package Azure.Monitor.OpenTelemetry.Exporter
    ```

    You must also install the [OpenTelemetry Extensions Hosting](https://www.nuget.org/packages/OpenTelemetry.Extensions.Hosting) package.

    ```console
    dotnet add package OpenTelemetry.Extensions.Hosting
    ```

2. Configure OpenTelemetry as part of your application startup

    The OpenTelemery SDK must be configured at application startup. This is typically done in the `Program.cs`.
    OpenTelemetry has a concept of three signals; Traces, Metrics, and Logs.
    Each of these signals will need to be configured as part of your application startup.
    `TracerProvider`, `MeterProvider`, and `ILoggerFactory` should be created once for your application and disposed when your application shuts down.

The following code sample shows a simple example meant only to show the basics.
No telemetry will be collected at this point.

##### Program.cs

```csharp
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = Host.CreateApplicationBuilder(args);
        builder.Services.AddHostedService<Worker>();

        builder.Services.AddOpenTelemetry()
            .WithTracing()
            .WithMetrics();

        builder.Logging.AddOpenTelemetry();

        var host = builder.Build();
        host.Run();
    }
}
```

#### Step 3: Install and Configure Instrumentation Libraries

[Instrumentation libraries](https://opentelemetry.io/docs/specs/otel/overview/#instrumentation-libraries) can be added to your project to auto collect telemetry about specific components or dependencies. We recommend the following libraries:

1. [OpenTelemetry.Instrumentation.Http](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http) can be used to collect telemetry for outbound http dependencies. Azure Monitor will map this to [Dependency Telemetry](https://learn.microsoft.com/azure/azure-monitor/app/data-model-complete#dependency).

    ```console
    dotnet add package OpenTelemetry.Instrumentation.Http
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.Http Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.Http)

2. [OpenTelemetry.Instrumentation.SqlClient](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient) can be used to collect telemetry for MS SQL dependencies. Azure Monitor will map this to [Dependency Telemetry](https://learn.microsoft.com/azure/azure-monitor/app/data-model-complete#dependency).

    ```console
    dotnet add package --prerelease OpenTelemetry.Instrumentation.SqlClient
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.SqlClient Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.SqlClient)

The following code sample expands on the previous example.
This now collects telemetry, but does not yet send to Application Insights.

##### Program.cs

```csharp
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = Host.CreateApplicationBuilder(args);
        builder.Services.AddHostedService<Worker>();

        builder.Services.AddOpenTelemetry()
            .WithTracing(builder =>
            {
                builder.AddHttpClientInstrumentation();
                builder.AddSqlClientInstrumentation();
            })
            .WithMetrics(builder =>
            {
                builder.AddHttpClientInstrumentation();
            });

        builder.Logging.AddOpenTelemetry();

        var host = builder.Build();
        host.Run();
    }
}
```

#### Step 4: Configure the Azure Monitor Exporter

To send your telemetry to Application Insights, the Azure Monitor Exporter must be added to the configuration of all three signals.

##### Program.cs

The following code sample expands on the previous example.
This now collects telemetry and will send to Application Insights.

```csharp
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = Host.CreateApplicationBuilder(args);
        builder.Services.AddHostedService<Worker>();

        builder.Services.AddOpenTelemetry()
            .WithTracing(builder =>
            {
                builder.AddHttpClientInstrumentation();
                builder.AddSqlClientInstrumentation();
                builder.AddAzureMonitorTraceExporter();
            })
            .WithMetrics(builder =>
            {
                builder.AddHttpClientInstrumentation();
                builder.AddAzureMonitorMetricExporter();
            });

        builder.Logging.AddOpenTelemetry(builder => builder.AddAzureMonitorLogExporter());

        var host = builder.Build();
        host.Run();
    }
}
```

We recommend setting your Connection String in an environment variable:

```console
APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>
```

Additional options to configure the Connection String are detailed here: [Configure the Application Insights Connection String](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-configuration?tabs=net#connection-string).

#### Step 5: Additional configurations

Application Insights offered many additional configuration options via `ApplicationInsightsServiceOptions`.

| Application Insights Setting               | OpenTelemetry Alternative                                                                                            |
|--------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| AddAutoCollectedMetricExtractor            | N/A                                                                                                                  |
| ApplicationVersion                         | Set "service.version" on Resource                                                                                    |
| ConnectionString                           | See [instructions](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-configuration?tabs=aspnetcore#connection-string) on configuring the Conneciton String.  |
| DependencyCollectionOptions                | N/A. To customize dependencies, review the available configuration options for applicable Instrumentation libraries. |
| DeveloperMode                              | N/A                                                                                                                  |
| EnableAdaptiveSampling                     | N/A. Currently only fixed-rate sampling is supported.                                                                |
| EnableAppServicesHeartbeatTelemetryModule  | N/A                                                                                                                  |
| EnableAzureInstanceMetadataTelemetryModule | N/A                                                                                                                  |
| EnableDependencyTrackingTelemetryModule    | See instructions on filtering Traces.                                                                                |
| EnableDiagnosticsTelemetryModule           | N/A                                                                                                                  |
| EnableEventCounterCollectionModule         | N/A                                                                                                                  |
| EnableHeartbeat                            | N/A                                                                                                                  |
| EnablePerformanceCounterCollectionModule   | N/A                                                                                                                  |
| EnableQuickPulseMetricStream               | AzureMonitorOptions.EnableLiveMetrics                                                                                |
| EndpointAddress                            | Use ConnectionString.                                                                                                |
| InstrumentationKey                         | Use ConnectionString.                                                                                                |

### Remove Custom Configurations

The following scenarios are optional and may only apply to advanced users.

* If you have any additional references to the `TelemetryClient` which may have been used to [manually record telemetry](https://learn.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics), these should be removed.

* If you added any [custom filtering or enrichment](https://learn.microsoft.com/azure/azure-monitor/app/api-filtering-sampling) in the form of a custom `TelemetryProcessor` or `TelemetryInitializer`, these should be removed. These would have been added to your `ServiceCollection`.

    ```csharp
    builder.Services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();
    ```

    ```csharp
    builder.Services.AddApplicationInsightsTelemetryProcessor<MyCustomTelemetryProcessor>();
    ```

* Remove any Visual Studio Artifacts

  If you used Visual Studio to onboard to Application Insights you may have additional files left over in your project.

  - `Properties/ServiceDependencies` directory might have a reference to your Application Insights resource.

---

## Advanced scenarios

This section covers advanced scenarios for OpenTelemetry migration.

### Overview

[OpenTelemetry](https://opentelemetry.io/) is a vendor neutral observability framework. There are no Application Insights APIs in the OpenTelemetry SDK or libraries. Before migrating it's important to understand some of OpenTelemetry's concepts.

* In Application Insights, all telemetry was managed through a single `TelemetryClient` and `TelemetryConfiguration`. In OpenTelemetry, each of the three telemetry signals (Traces, Metrics, and Logs) has its own configuration. You can manually create telemetry via the .NET runtime without external libraries. For more details, refer to the .NET guides on [distributed tracing](https://learn.microsoft.com/dotnet/core/diagnostics/distributed-tracing-instrumentation-walkthroughs), [metrics](https://learn.microsoft.com/dotnet/core/diagnostics/metrics), and [logging](https://learn.microsoft.com/dotnet/core/extensions/logging).

* Application Insights used `TelemetryModules` to automatically collect telemetry for your application.
Instead, OpenTelemetry uses [Instrumentation libraries](https://opentelemetry.io/docs/specs/otel/overview/#instrumentation-libraries) to collect telemetry from specific components (such as [AspNetCore](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNetCore) for Requests and [HttpClient](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http) for Dependencies).

* Application Insights used `TelemetryInitializers` to enrich telemetry with additional information or to override properties.
With OpenTelemetry, you can write a [Processor](https://opentelemetry.io/docs/collector/configuration/#processors) to customize a specific signal. Additionally, many OpenTelemetry Instrumentation libraries offer an `Enrich` method to customize the telemetry generated by that specific component.

* Application Insights used `TelemetryProcessors` to filter telemetry. An OpenTelemetry [Processor](https://opentelemetry.io/docs/collector/configuration/#processors) can also be used to apply filtering rules on a specific signal.

* Application Insights offered multiple options to configure sampling.
Azure Monitor Exporter or Azure Monitor Distro only offers fixed rate sampling.
Currently only Traces (Requests and Dependencies) can be sampled.

### Understanding Telemetry DataTypes

You may already be familiar with Application Insights data types.
This table maps them to OpenTelemetry concepts and their .NET implementations.

| Azure Monitor Table | Application Insights DataType | OpenTelemetry DataType             | .NET Implementation                  |
|---------------------|-------------------------------|------------------------------------|--------------------------------------|
| customEvents        | EventTelemetry                | N/A                                | N/A                                  |
| customMetrics       | MetricTelemetry               | Metrics                            | System.Diagnostics.Metrics.Meter     |
| dependencies        | DependencyTelemetry           | Spans (Client, Internal, Consumer) | System.Diagnostics.Activity          |
| exceptions          | ExceptionTelemetry            | Exceptions                         | System.Exception                     |
| requests            | RequestTelemetry              | Spans (Server, Producer)           | System.Diagnostics.Activity          |
| traces              | TraceTelemetry                | Logs                               | Microsoft.Extensions.Logging.ILogger |

Review these documents to learn more:

- [Data Collection Basics of Azure Monitor Application Insights](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-overview)
- [Application Insights telemetry data model](https://learn.microsoft.com/azure/azure-monitor/app/data-model-complete)
- [OpenTelemetry Concepts](https://opentelemetry.io/docs/concepts/)

### Telemetry Processors and Initializers

In the Application Insights .NET SDK, telemetry processors are used as filters to modify or discard telemetry, while telemetry initializers are used to add or modify custom properties to telemetry. For more details, refer to the [Azure Monitor documentation](https://learn.microsoft.com/azure/azure-monitor/app/api-filtering-sampling). In OpenTelemetry, these concepts are replaced by activity or log processors, which serve similar purposes by enriching and filtering telemetry.

#### Filtering Traces

To filter telemetry data in OpenTelemetry, you can implement an activity processor. This example is equivalent to the Application Insights example for filtering telemetry data as described in [Azure Monitor documentation](https://learn.microsoft.com/azure/azure-monitor/app/api-filtering-sampling?tabs=javascriptwebsdkloaderscript#c), where unsuccessful dependency calls are filtered.

```csharp
using System.Diagnostics;
using OpenTelemetry;

internal sealed class SuccessfulDependencyFilterProcessor : BaseProcessor<Activity>
{
    public override void OnEnd(Activity activity)
    {
        if (!OKtoSend(activity))
        {
            activity.ActivityTraceFlags &= ~ActivityTraceFlags.Recorded;
        }
    }

    private bool OKtoSend(Activity activity)
    {
        return activity.Kind == ActivityKind.Client && activity.Status == ActivityStatusCode.Ok;
    }
}
```

To use this processor, you need to create a `TracerProvider` and add the processor before `AddAzureMonitorTraceExporter`.

```csharp
using OpenTelemetry.Trace;

public static void Main()
{
    var tracerProvider = Sdk.CreateTracerProviderBuilder()
        .AddProcessor(new SuccessfulDependencyFilterProcessor())
        .AddAzureMonitorTraceExporter()
        .Build();
}
```

#### Filtering Logs

[`ILogger`](https://docs.microsoft.com/dotnet/core/extensions/logging)
implementations have a built-in mechanism to apply [log
filtering](https://docs.microsoft.com/dotnet/core/extensions/logging?tabs=command-line#how-filtering-rules-are-applied).
This filtering lets you control the logs that are sent to each registered
provider, including the `OpenTelemetryLoggerProvider`. "OpenTelemetry" is the
[alias](https://docs.microsoft.com/dotnet/api/microsoft.extensions.logging.provideraliasattribute)
for `OpenTelemetryLoggerProvider`, that may be used in configuring filtering
rules.

The example below defines "Error" as the default `LogLevel`
and also defines "Warning" as the minimum `LogLevel` for a user defined category.
These rules as defined only apply to the `OpenTelemetryLoggerProvider`.

```csharp
builder.AddFilter<OpenTelemetryLoggerProvider>("*", LogLevel.Error);
builder.AddFilter<OpenTelemetryLoggerProvider>("MyProduct.MyLibrary.MyClass", LogLevel.Warning);
```

For more information, please read the [OpenTelemetry .NET documentation on logs](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/docs/logs/README.md).

#### Adding Custom Properties to Traces

In OpenTelemetry, you can use activity processors to enrich telemetry data with additional properties. This is similar to using telemetry initializers in Application Insights, where you can modify telemetry properties.

By default, Azure Monitor Exporter flags any HTTP request with a response code of 400 or greater as failed. However, if you want to treat 400 as a success, you can add an enriching activity processor that sets the success on the activity and adds a tag to include additional telemetry properties. This is similar to adding or modifying properties using an initializer in Application Insights as described in [Azure Monitor documentation](https://learn.microsoft.com/azure/azure-monitor/app/api-filtering-sampling?tabs=javascriptwebsdkloaderscript#addmodify-properties-itelemetryinitializer).

Here is an example of how to add custom properties and override the default behavior for certain response codes:

```csharp
using System.Diagnostics;
using OpenTelemetry;

/// <summary>
/// Custom Processor that overrides the default behavior of treating response codes >= 400 as failed requests.
/// </summary>
internal class MyEnrichingProcessor : BaseProcessor<Activity>
{
    public override void OnEnd(Activity activity)
    {
        if (activity.Kind == ActivityKind.Server)
        {
            int responseCode = GetResponseCode(activity);

            if (responseCode >= 400 && responseCode < 500)
            {
                // If we set the Success property, the SDK won't change it
                activity.SetStatus(ActivityStatusCode.Ok);

                // Allow to filter these requests in the portal
                activity.SetTag("Overridden400s", "true");
            }

            // else leave the SDK to set the Success property
        }
    }

    private int GetResponseCode(Activity activity)
    {
        foreach (ref readonly var tag in activity.EnumerateTagObjects())
        {
            if (tag.Key == "http.response.status_code" && tag.Value is int value)
            {
                return value;
            }
        }

        return 0;
    }
}
```

To use this processor, you need to create a `TracerProvider` and add the processor before `AddAzureMonitorTraceExporter`.

```csharp
using OpenTelemetry.Trace;

public static void Main()
{
    var tracerProvider = Sdk.CreateTracerProviderBuilder()
        .AddSource("Company.Product.Name")
        .AddProcessor(new MyEnrichingProcessor())
        .AddAzureMonitorTraceExporter()
        .Build();
}
```

### Sampling

While Application Insights offered multiple options to configure sampling, Azure Monitor Exporter or Azure Monitor Distro only offers fixed rate sampling.
Currently only Traces (Requests and Dependencies) can be sampled.

For code samples detailing how to configure sampling, see our guide [Enable Sampling](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-configuration#enable-sampling)

### Sending Traces - Manual

Traces in Application Insights are stored as `RequestTelemetry` and `DependencyTelemetry`. In OpenTelemetry, traces are modeled as `Span` using the `Activity` class.

OpenTelemetry .NET utilizes the `ActivitySource` and `Activity` classes for tracing, which are part of the .NET runtime. This approach is distinctive because the .NET implementation integrates the tracing API directly into the runtime itself. By incorporating the `System.Diagnostics.DiagnosticSource` package, developers can use `ActivitySource` to create and manage `Activity` instances. This method provides a seamless way to add tracing to .NET applications without relying on external libraries, leveraging the built-in capabilities of the .NET ecosystem. For more detailed information, refer to the [distributed tracing instrumentation walkthroughs](https://learn.microsoft.com/dotnet/core/diagnostics/distributed-tracing-instrumentation-walkthroughs).

Here's how to migrate manual tracing:

> **Note:**
>
> In Application Insights, the role name and role instance could be set at a per-telemetry level. However, with the Azure Monitor Exporter, we cannot customize at a per-telemetry level. The role name and role instance are extracted from the OpenTelemetry resource and applied across all telemetry. Please read this document for more information: [Set the cloud role name and the cloud role instance](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-configuration?tabs=aspnetcore#set-the-cloud-role-name-and-the-cloud-role-instance).

#### DependencyTelemetry

Application Insights `DependencyTelemetry` is used to model outgoing requests. Here's how to convert it to OpenTelemetry:

**Application Insights Example:**

```csharp
DependencyTelemetry dep = new DependencyTelemetry
{
   Name = "DependencyName",
   Data = "https://www.example.com/",
   Type = "Http",
   Target = "www.example.com",
   Duration = TimeSpan.FromSeconds(10),
   ResultCode = "500",
   Success = false
};

dep.Context.Cloud.RoleName = "MyRole";
dep.Context.Cloud.RoleInstance = "MyRoleInstance";
dep.Properties["customprop1"] = "custom value1";
client.TrackDependency(dep);
```

**OpenTelemetry Example:**

```csharp
var activitySource = new ActivitySource("Company.Product.Name");
var resourceAttributes = new Dictionary<string, object>
{
   { "service.name", "MyRole" },
   { "service.instance.id", "MyRoleInstance" }
};

var resourceBuilder = ResourceBuilder.CreateDefault().AddAttributes(resourceAttributes);

using var tracerProvider = Sdk.CreateTracerProviderBuilder()
  .SetResourceBuilder(resourceBuilder)
  .AddSource(activitySource.Name)
  .AddAzureMonitorTraceExporter()
  .Build();

// Emit traces
using (var activity = activitySource.StartActivity("DependencyName", ActivityKind.Client))
{
  activity?.SetTag("url.full", "https://www.example.com/");
  activity?.SetTag("server.address", "www.example.com");
  activity?.SetTag("http.request.method", "GET");
  activity?.SetTag("http.response.status_code", "500");
  activity?.SetTag("customprop1", "custom value1");
  activity?.SetStatus(ActivityStatusCode.Error);
  activity?.SetEndTime(activity.StartTimeUtc.AddSeconds(10));
}
```

#### RequestTelemetry

Application Insights `RequestTelemetry` models incoming requests. Here's how to migrate it to OpenTelemetry:

**Application Insights Example:**

```csharp
RequestTelemetry req = new RequestTelemetry
{
   Name = "RequestName",
   Url = new Uri("http://example.com"),
   Duration = TimeSpan.FromSeconds(10),
   ResponseCode = "200",
   Success = true,
   Properties = { ["customprop1"] = "custom value1" }
};

req.Context.Cloud.RoleName = "MyRole";
req.Context.Cloud.RoleInstance = "MyRoleInstance";
client.TrackRequest(req);
```

**OpenTelemetry Example:**

```csharp
var activitySource = new ActivitySource("Company.Product.Name");
var resourceAttributes = new Dictionary<string, object>
{
   { "service.name", "MyRole" },
   { "service.instance.id", "MyRoleInstance" }
};

var resourceBuilder = ResourceBuilder.CreateDefault().AddAttributes(resourceAttributes);

using var tracerProvider = Sdk.CreateTracerProviderBuilder()
  .SetResourceBuilder(resourceBuilder)
  .AddSource(activitySource.Name)
  .AddAzureMonitorTraceExporter()
  .Build();

// Emit traces
using (var activity = activitySource.StartActivity("RequestName", ActivityKind.Server))
{
  activity?.SetTag("url.scheme", "https");
  activity?.SetTag("server.address", "www.example.com");
  activity?.SetTag("url.path", "/");
  activity?.SetTag("http.response.status_code", "200");
  activity?.SetTag("customprop1", "custom value1");
  activity?.SetStatus(ActivityStatusCode.Ok);
}
```

#### Custom Operations Tracking

In Application Insights, tracking custom operations is done using `StartOperation` and `StopOperation` methods. In OpenTelemetry .NET, this is achieved using `ActivitySource` and `Activity`. For operations with `ActivityKind.Server` and `ActivityKind.Consumer`, Azure Monitor Exporter generates `RequestTelemetry`. For `ActivityKind.Client`, `ActivityKind.Producer`, and `ActivityKind.Internal`, Azure Monitor Exporter generates `DependencyTelemetry`. For more detailed information on custom operations tracking in Application Insights, refer to the [Azure Monitor documentation](https://learn.microsoft.com/en-us/azure/azure-monitor/app/custom-operations-tracking). For more detailed information on using `ActivitySource` and `Activity` in .NET, refer to the [.NET distributed tracing instrumentation walkthroughs](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing-instrumentation-walkthroughs#activity).

Here is an example of how to start and stop an activity for custom operations:

```csharp
using System.Diagnostics;
using OpenTelemetry;

var activitySource = new ActivitySource("Company.Product.Name");

using var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddSource(activitySource.Name)
    .AddAzureMonitorTraceExporter()
    .Build();

// Start a new activity
using (var activity = activitySource.StartActivity("CustomOperation", ActivityKind.Server))
{
    activity?.SetTag("customTag", "customValue");

    // Perform your custom operation logic here

    // No need to explicitly call Activity.Stop() because the using block automatically disposes the Activity object, which stops it.
}
```

### Sending Logs

Logs in Application Insights are stored as `TraceTelemetry` and `ExceptionTelemetry`.

#### TraceTelemetry

In OpenTelemetry, logging is integrated via the `ILogger` interface. Here's how to migrate `TraceTelemetry`:

**Application Insights Example:**

```csharp
TraceTelemetry traceTelemetry = new TraceTelemetry
{
   Message = "hello from tomato 2.99",
   SeverityLevel = SeverityLevel.Warning,
};

traceTelemetry.Context.Cloud.RoleName = "MyRole";
traceTelemetry.Context.Cloud.RoleInstance = "MyRoleInstance";
client.TrackTrace(traceTelemetry);
```

**OpenTelemetry Example:**

```csharp
var resourceAttributes = new Dictionary<string, object>
{
   { "service.name", "MyRole" },
   { "service.instance.id", "MyRoleInstance" }
};

var resourceBuilder = ResourceBuilder.CreateDefault().AddAttributes(resourceAttributes);

using var loggerFactory = LoggerFactory.Create(builder => builder
   .AddOpenTelemetry(loggerOptions =>
   {
       loggerOptions.SetResourceBuilder(resourceBuilder);
       loggerOptions.AddAzureMonitorLogExporter();
   }));

// Create a new instance `ILogger` from the above LoggerFactory
var logger = loggerFactory.CreateLogger<Program>();

// Use the logger instance to write a new log
logger.FoodPrice("tomato", 2.99);

internal static partial class LoggerExtensions
{
    [LoggerMessage(LogLevel.Warning, "Hello from `{name}` `{price}`.")]
    public static partial void FoodPrice(this ILogger logger, string name, double price);
}
```

#### ExceptionTelemetry

Application Insights uses `ExceptionTelemetry` to log exceptions. Here's how to migrate to OpenTelemetry:

**Application Insights Example:**

```csharp
ExceptionTelemetry exceptionTelemetry = new ExceptionTelemetry(new Exception("Test exception"))
{
    SeverityLevel = SeverityLevel.Error
};

exceptionTelemetry.Context.Cloud.RoleName = "MyRole";
exceptionTelemetry.Context.Cloud.RoleInstance = "MyRoleInstance";
exceptionTelemetry.Properties["customprop1"] = "custom value1";
client.TrackException(exceptionTelemetry);
```

**OpenTelemetry Example:**

```csharp
var resourceAttributes = new Dictionary<string, object>
{
   { "service.name", "MyRole" },
   { "service.instance.id", "MyRoleInstance" }
};

var resourceBuilder = ResourceBuilder.CreateDefault().AddAttributes(resourceAttributes);

using var loggerFactory = LoggerFactory.Create(builder => builder
   .AddOpenTelemetry(loggerOptions =>
   {
       loggerOptions.SetResourceBuilder(resourceBuilder);
       loggerOptions.AddAzureMonitorLogExporter();
   }));

// Create a new instance `ILogger` from the above LoggerFactory.
var logger = loggerFactory.CreateLogger<Program>();

try
{
    // Simulate exception
    throw new Exception("Test exception");
}
catch (Exception ex)
{
    logger?.LogError(ex, "An error occurred");
}
```

### Sending Metrics

Metrics in Application Insights are stored as `MetricTelemetry`. In OpenTelemetry, metrics are modeled as `Meter` from the `System.Diagnostics.DiagnosticSource` package.

Application Insights has both non-pre-aggregating (`TrackMetric()`) and pre-aggregating (`GetMetric().TrackValue()`) Metric APIs. Unlike OpenTelemetry, Application Insights has no notion of [Instruments](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/supplementary-guidelines.md#instrument-selection). Application Insights has the same API for all the metric scenarios.

OpenTelemetry, on the other hand, requires users to first [pick the right metric instrument](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/supplementary-guidelines.md#instrument-selection) based on the actual semantics of the metric. For example, if the intention is to count something (like the number of total server requests received, etc.), [OpenTelemetry Counter](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/api.md#counter) should be used. If the intention is to calculate various percentiles (like the P99 value of server latency), then [OpenTelemetry Histogram](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/api.md#histogram) instrument should be used. Due to this fundamental difference between Application Insights and OpenTelemetry, no direct comparison is made between them.

Unlike Application Insights, OpenTelemetry does not provide built-in mechanisms to enrich or filter metrics. In Application Insights, telemetry processors and initializers could be used to modify or discard metrics, but this capability is not available in OpenTelemetry.

Additionally, OpenTelemetry does not support sending raw metrics directly, as there is no equivalent to the `TrackMetric()` functionality found in Application Insights.

Migrating from Application Insights to OpenTelemetry involves replacing all Application Insights Metric API usages with that of the OpenTelemetry API. This requires understanding the various OpenTelemetry Instruments and their semantics.

> **Tip:**
> The histogram is the most versatile and the closest equivalent to the Application Insights `GetMetric().TrackValue()` API. You can replace Application Insights Metric APIs with Histogram to achieve the same purpose.

TODO: all the examples about Context should be separately covered. Context.Cloud is mapped to Resource, so we should show that. and call out that there is no ability (like classic ai sdk), to override Context.Cloud per telemetry item.
TODO: Add related links and next steps section.

### Other Telemetry Types

#### CustomEvents

Not supported in OpenTelemetry.

**Application Insights Example:**

```csharp
TelemetryClient.TrackEvent()
```

#### AvailabilityTelemetry

Not supported in OpenTelemetry.

**Application Insights Example:**

```csharp
TelemetryClient.TrackAvailability()
```

#### PageViewTelemetry

Not supported in OpenTelemetry.

**Application Insights Example:**

```csharp
TelemetryClient.TrackPageView()
```

## Next steps

### [ASP.NET Core](#tab/aspnetcore)

* [Azure Monitor Distro Demo project](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.AspNetCore/tests/Azure.Monitor.OpenTelemetry.AspNetCore.Demo)
* [OpenTelemetry SDK's getting started guide](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry)
* [OpenTelemetry's example ASP.NET Core project](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/examples/AspNetCore)
* [Logging in C# and .NET](https://learn.microsoft.com/dotnet/core/extensions/logging)
* See this doc for our full getting started guide: [Enable Azure Monitor OpenTelemetry for ASP.NET Core](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable?tabs=aspnetcore)

### [.NET](#tab/net)

* [OpenTelemetry SDK's getting started guide](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry)
* [OpenTelemetry's example ASP.NET project](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/examples/AspNet/Global.asax.cs)
* [Logging in C# and .NET](https://learn.microsoft.com/dotnet/core/extensions/logging)
* See this doc for our full getting started guide: [Enable Azure Monitor OpenTelemetry for .NET](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable?tabs=net)

### [Console](#tab/console)

* [OpenTelemetry SDK's getting started guide](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry)
* OpenTelemetry's example projects:
  * [Getting Started with Traces](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/docs/trace/getting-started-console)
  * [Getting Started with Metrics](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/docs/metrics/getting-started-console)
  * [Getting Started with Logs](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/docs/logs/getting-started-console)
* [Logging in C# and .NET](https://learn.microsoft.com/dotnet/core/extensions/logging)
* See this doc for our full getting started guide: [Enable Azure Monitor OpenTelemetry for .NET](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable?tabs=net)

### [WorkerService](#tab/workerservice)

* [OpenTelemetry SDK's getting started guide](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry)
* [Logging in C# and .NET](https://learn.microsoft.com/dotnet/core/extensions/logging)
* See this doc for our full getting started guide: [Enable Azure Monitor OpenTelemetry for .NET](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable?tabs=net)

---