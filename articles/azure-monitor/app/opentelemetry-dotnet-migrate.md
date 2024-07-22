---
title: Migrate from Application Insights .NET SDKs to Azure Monitor OpenTelemetry
description: This article provides guidance on how to migrate .NET applications from the Application Insights Classic API SDKs to Azure Monitor OpenTelemetry.
ms.topic: conceptual
ms.date: 06/07/2024
ms.devlang: csharp
ms.custom: devx-track-dotnet
ms.reviewer: mmcc
---

# Migrate from .NET Application Insights SDKs to Azure Monitor OpenTelemetry

This guide provides step-by-step instructions to migrate various .NET applications from using Application Insights software development kits (SDKs) to Azure Monitor OpenTelemetry.

Expect a similar experience with Azure Monitor OpenTelemetry instrumentation as with the Application Insights SDKs. For more information and a feature-by-feature comparison, see [release state of features](opentelemetry-enable.md#whats-the-current-release-state-of-features-within-the-azure-monitor-opentelemetry-distro).

> [!div class="checklist"]
> - ASP.NET Core migration to the [Azure Monitor OpenTelemetry Distro](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.AspNetCore). (`Azure.Monitor.OpenTelemetry.AspNetCore` NuGet package)
> - ASP.NET, console, and WorkerService migration to the [Azure Monitor OpenTelemetry Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter). (`Azure.Monitor.OpenTelemetry.Exporter` NuGet package)

If you're getting started with Application Insights and don't need to migrate from the Classic API, see [Enable Azure Monitor OpenTelemetry](opentelemetry-enable.md).

## Prerequisites

### [ASP.NET Core](#tab/aspnetcore)

* An ASP.NET Core web application already instrumented with Application Insights without any customizations
* An actively supported version of [.NET](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)

### [ASP.NET](#tab/net)

* An ASP.NET web application already instrumented with Application Insights
* An actively supported version of [.NET Framework](/lifecycle/products/microsoft-net-framework)

### [Console](#tab/console)

* A Console application already instrumented with Application Insights
* An actively supported version of [.NET Framework](/lifecycle/products/microsoft-net-framework) or [.NET](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)

### [WorkerService](#tab/workerservice)

* A WorkerService application already instrumented with Application Insights without any customizations
* An actively supported version of [.NET](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)

---

> [!Tip]
> Our product group is actively seeking feedback on this documentation. Provide feedback to otel@microsoft.com or see the [Support](#support) section.

## Remove the Application Insights SDK

> [!Note]
> Before continuing with these steps, you should confirm that you have a current backup of your application.

### [ASP.NET Core](#tab/aspnetcore)

1. Remove NuGet packages

    Remove the `Microsoft.ApplicationInsights.AspNetCore` package from your `csproj`.

    ```terminal
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

    Verify that your application has no unexpected consequences.

### [ASP.NET](#tab/net)

1. Remove NuGet packages

   Remove the `Microsoft.AspNet.TelemetryCorrelation` package and any `Microsoft.ApplicationInsights.*` packages from your `csproj` and `packages.config`.

2. Delete the `ApplicationInsights.config` file

3. Delete section from your application's `Web.config` file

    - Two [HttpModules](/troubleshoot/developer/webapps/aspnet/development/http-modules-handlers) were automatically added to your web.config when you first added ApplicationInsights to your project.
    Any references to the `TelemetryCorrelationHttpModule` and the `ApplicationInsightsWebTracking` should be removed.
    If you added Application Insights to your [Internet Information Server (IIS) Modules](/iis/get-started/introduction-to-iis/iis-modules-overview), it should also be removed.

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

    - Also review any [assembly version redirections](/dotnet/framework/configure-apps/redirect-assembly-versions) added to your web.config.

4. Remove Initialization Code and customizations

    Remove any references to Application Insights types in your codebase.

    > [!Tip]
    > After removing the Application Insights package, you can re-build your application to get a list of references that need to be removed.

    - Remove references to `TelemetryConfiguration` or `TelemetryClient`. It's a part of your application startup to initialize the Application Insights SDK.

    The following scenarios are optional and apply to advanced users.

    - If you have any more references to the `TelemetryClient`, which are used to [manually record telemetry](./api-custom-events-metrics.md), they should be removed.
    - If you added any [custom filtering or enrichment](./api-filtering-sampling.md) in the form of a custom `TelemetryProcessor` or `TelemetryInitializer`, they should be removed. You can find them referenced in your configuration.
    - If your project has a `FilterConfig.cs` in the `App_Start` directory, check for any custom exception handlers that reference Application Insights and remove.

5. Remove JavaScript Snippet

    If you added the JavaScript SDK to collect client-side telemetry, it can also be removed although it continues to work without the .NET SDK.
    For full code samples of what to remove, review the [onboarding guide for the JavaScript SDK](./javascript-sdk.md).

6. Remove any Visual Studio Artifacts

    If you used Visual Studio to onboard to Application Insights, you could have more files left over in your project.

    - `ConnectedService.json` might have a reference to your Application Insights resource.
    - `[Your project's name].csproj` might have a reference to your Application Insights resource:

        ```xml
        <ApplicationInsightsResourceId>/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Default-ApplicationInsights-EastUS/providers/microsoft.insights/components/WebApplication4</ApplicationInsightsResourceId>
        ```

7. Clean and Build

    Inspect your bin directory to validate that all references to `Microsoft.ApplicationInsights.` were removed.

8. Test your application

    Verify that your application has no unexpected consequences.

### [Console](#tab/console)

1. Remove NuGet packages

   Remove any `Microsoft.ApplicationInsights.*` packages from your `csproj` and `packages.config`.

    ```terminal
    dotnet remove package Microsoft.ApplicationInsights
    ```

    > [!Tip]
    > If you've used [Microsoft.ApplicationInsights.WorkerService](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService), refer to the WorkerService tabs.

2. Remove Initialization Code and customizations

    Remove any references to Application Insights types in your codebase.

    > [!Tip]
    > After removing the Application Insights package, you can re-build your application to get a list of references that need to be removed.

    - Remove references to `TelemetryConfiguration` or `TelemetryClient`. It should be part of your application startup to initialize the Application Insights SDK.

        ```csharp
        var config = TelemetryConfiguration.CreateDefault();
        var client = new TelemetryClient(config);
        ```

    > [!Tip]
    > If you've used `AddApplicationInsightsTelemetryWorkerService()` to add Application Insights to your `ServiceCollection`, refer to the WorkerService tabs.

3. Clean and Build

    Inspect your bin directory to validate that all references to `Microsoft.ApplicationInsights.` were removed.

4. Test your application

    Verify that your application has no unexpected consequences.

### [WorkerService](#tab/workerservice)

1. Remove NuGet packages

    Remove the `Microsoft.ApplicationInsights.WorkerService` package from your `csproj`.

    ```terminal
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

    Verify that your application has no unexpected consequences.

---

> [!Tip]
> Our product group is actively seeking feedback on this documentation. Provide feedback to otel@microsoft.com or see the [Support](#support) section.

## Enable OpenTelemetry

We recommended creating a development [resource](./create-workspace-resource.md) and using its [connection string](./sdk-connection-string.md) when following these instructions.

:::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows the Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

Plan to update the connection string to send telemetry to the original resource after confirming migration is successful.

### [ASP.NET Core](#tab/aspnetcore)

1. Install the Azure Monitor Distro

    Our Azure Monitor Distro enables automatic telemetry by including OpenTelemetry instrumentation libraries for collecting traces, metrics, logs, and exceptions, and allows collecting custom telemetry.

    Installing the Azure Monitor Distro brings the [OpenTelemetry SDK](https://www.nuget.org/packages/OpenTelemetry) as a dependency.

    ```terminal
    dotnet add package Azure.Monitor.OpenTelemetry.AspNetCore
    ```

2. Add and configure both OpenTelemetry and Azure Monitor

    The OpenTelemery SDK must be configured at application startup as part of your `ServiceCollection`, typically in the `Program.cs`.

    OpenTelemetry has a concept of three signals; Traces, Metrics, and Logs.
    The Azure Monitor Distro configures each of these signals.

##### Program.cs

The following code sample demonstrates the basics.

```csharp
using Azure.Monitor.OpenTelemetry.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Call AddOpenTelemetry() to add OpenTelemetry to your ServiceCollection.
        // Call UseAzureMonitor() to fully configure OpenTelemetry.
        builder.Services.AddOpenTelemetry().UseAzureMonitor();

        var app = builder.Build();
        app.MapGet("/", () => "Hello World!");
        app.Run();
    }
}
```

We recommend setting your Connection String in an environment variable:

`APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>`

More options to configure the Connection String are detailed here: [Configure the Application Insights Connection String](./opentelemetry-configuration.md?tabs=aspnetcore#connection-string).

### [ASP.NET](#tab/net)

1. Install the OpenTelemetry SDK via Azure Monitor

    Installing the Azure Monitor Exporter brings the [OpenTelemetry SDK](https://www.nuget.org/packages/OpenTelemetry) as a dependency.

    ```terminal
    dotnet add package Azure.Monitor.OpenTelemetry.Exporter
    ```

2. Configure OpenTelemetry as part of your application startup

    The OpenTelemery SDK must be configured at application startup, typically in the `Global.asax.cs`.
    OpenTelemetry has a concept of three signals; Traces, Metrics, and Logs.
    Each of these signals needs to be configured as part of your application startup.
    `TracerProvider`, `MeterProvider`, and `ILoggerFactory` should be created once for your application and disposed when your application shuts down.

##### Global.asax.cs

The following code sample shows a simple example meant only to show the basics.
No telemetry is collected at this point.

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

### [Console](#tab/console)

1. Install the OpenTelemetry SDK via Azure Monitor

    Installing the [Azure Monitor Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) brings the [OpenTelemetry SDK](https://www.nuget.org/packages/OpenTelemetry) as a dependency.

    ```terminal
    dotnet add package Azure.Monitor.OpenTelemetry.Exporter
    ```

2. Configure OpenTelemetry as part of your application startup

    The OpenTelemery SDK must be configured at application startup, typically in the `Program.cs`.
    OpenTelemetry has a concept of three signals; Traces, Metrics, and Logs.
    Each of these signals needs to be configured as part of your application startup.
    `TracerProvider`, `MeterProvider`, and `ILoggerFactory` should be created once for your application and disposed when your application shuts down.

The following code sample shows a simple example meant only to show the basics.
No telemetry is collected at this point.

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
        // It will flush the remaining spans and shutdown the tracing pipeline.
        tracerProvider.Dispose();

        // Dispose meter provider before the application ends.
        // It will flush the remaining metrics and shutdown the metrics pipeline.
        meterProvider.Dispose();

        // Dispose logger factory before the application ends.
        // It will flush the remaining logs and shutdown the logging pipeline.
        loggerFactory.Dispose();
    }
}
```

### [WorkerService](#tab/workerservice)

1. Install the OpenTelemetry SDK via Azure Monitor

    Installing the [Azure Monitor Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) brings the [OpenTelemetry SDK](https://www.nuget.org/packages/OpenTelemetry) as a dependency.

    ```terminal
    dotnet add package Azure.Monitor.OpenTelemetry.Exporter
    ```

    You must also install the [OpenTelemetry Extensions Hosting](https://www.nuget.org/packages/OpenTelemetry.Extensions.Hosting) package.

    ```terminal
    dotnet add package OpenTelemetry.Extensions.Hosting
    ```

2. Configure OpenTelemetry as part of your application startup

    The OpenTelemery SDK must be configured at application startup, typically in the `Program.cs`.
    OpenTelemetry has a concept of three signals; Traces, Metrics, and Logs.
    Each of these signals needs to be configured as part of your application startup.
    `TracerProvider`, `MeterProvider`, and `ILoggerFactory` should be created once for your application and disposed when your application shuts down.

The following code sample shows a simple example meant only to show the basics.
No telemetry is collected at this point.

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

---

> [!Tip]
> Our product group is actively seeking feedback on this documentation. Provide feedback to otel@microsoft.com or see the [Support](#support) section.

## Install and configure instrumentation libraries

### [ASP.NET Core](#tab/aspnetcore)

[Instrumentation libraries](https://opentelemetry.io/docs/specs/otel/overview/#instrumentation-libraries) can be added to your project to auto collect telemetry about specific components or dependencies.

The following libraries are included in the Distro.

- [HTTP](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http)
- [ASP.NET Core](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNetCore)
- [SQL](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.sqlclient)

#### Customizing instrumentation libraries

The Azure Monitor Distro includes .NET OpenTelemetry instrumentation for [ASP.NET Core](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNetCore/), [HttpClient](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http/), and [SQLClient](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient).
You can customize these included instrumentations or manually add extra instrumentation on your own using the OpenTelemetry API.

Here are some examples of how to customize the instrumentation:

##### Customizing AspNetCoreTraceInstrumentationOptions

```C#
builder.Services.AddOpenTelemetry().UseAzureMonitor();
builder.Services.Configure<AspNetCoreTraceInstrumentationOptions>(options =>
{
    options.RecordException = true;
    options.Filter = (httpContext) =>
    {
        // only collect telemetry about HTTP GET requests
        return HttpMethods.IsGet(httpContext.Request.Method);
    };
});
```

##### Customizing HttpClientTraceInstrumentationOptions

```C#
builder.Services.AddOpenTelemetry().UseAzureMonitor();
builder.Services.Configure<HttpClientTraceInstrumentationOptions>(options =>
{
    options.RecordException = true;
    options.FilterHttpRequestMessage = (httpRequestMessage) =>
    {
        // only collect telemetry about HTTP GET requests
        return HttpMethods.IsGet(httpRequestMessage.Method.Method);
    };
});
```

##### Customizing SqlClientInstrumentationOptions

We vendor the [SQLClient](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient) instrumentation within our package while it's still in beta. When it reaches a stable release, we include it as a standard package reference. Until then, to customize the SQLClient instrumentation, add the `OpenTelemetry.Instrumentation.SqlClient` package reference to your project and use its public API.

```
dotnet add package --prerelease OpenTelemetry.Instrumentation.SqlClient
```

```C#
builder.Services.AddOpenTelemetry().UseAzureMonitor().WithTracing(builder =>
{
    builder.AddSqlClientInstrumentation(options =>
    {
        options.SetDbStatementForStoredProcedure = false;
    });
});
```

### [ASP.NET](#tab/net)

[Instrumentation libraries](https://opentelemetry.io/docs/specs/otel/overview/#instrumentation-libraries) can be added to your project to auto collect telemetry about specific components or dependencies. We recommend the following libraries:

1. [OpenTelemetry.Instrumentation.AspNet](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNet) can be used to collect telemetry for incoming requests. Azure Monitor maps it to [Request Telemetry](./data-model-complete.md#request).

    ```terminal
    dotnet add package OpenTelemetry.Instrumentation.AspNet
    ```

    It requires adding an extra HttpModule to your `Web.config`:

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

2. [OpenTelemetry.Instrumentation.Http](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http) can be used to collect telemetry for outbound http dependencies. Azure Monitor maps it to [Dependency Telemetry](./data-model-complete.md#dependency).

    ```terminal
    dotnet add package OpenTelemetry.Instrumentation.Http
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.Http Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.Http)

3. [OpenTelemetry.Instrumentation.SqlClient](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient) can be used to collect telemetry for MS SQL dependencies. Azure Monitor maps it to [Dependency Telemetry](./data-model-complete.md#dependency).

    ```terminal
    dotnet add package --prerelease OpenTelemetry.Instrumentation.SqlClient
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.SqlClient Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.SqlClient)

##### Global.asax.cs

The following code sample expands on the previous example.
It now collects telemetry, but doesn't yet send to Application Insights.

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

### [Console](#tab/console)

[Instrumentation libraries](https://opentelemetry.io/docs/specs/otel/overview/#instrumentation-libraries) can be added to your project to auto collect telemetry about specific components or dependencies. We recommend the following libraries:

1. [OpenTelemetry.Instrumentation.Http](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http) can be used to collect telemetry for outbound http dependencies. Azure Monitor maps it to [Dependency Telemetry](./data-model-complete.md#dependency).

    ```terminal
    dotnet add package OpenTelemetry.Instrumentation.Http
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.Http Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.Http)

2. [OpenTelemetry.Instrumentation.SqlClient](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient) can be used to collect telemetry for MS SQL dependencies. Azure Monitor maps it to [Dependency Telemetry](./data-model-complete.md#dependency).

    ```terminal
    dotnet add package --prerelease OpenTelemetry.Instrumentation.SqlClient
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.SqlClient Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.SqlClient)

The following code sample expands on the previous example.
It now collects telemetry, but doesn't yet send to Application Insights.

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

### [WorkerService](#tab/workerservice)

[Instrumentation libraries](https://opentelemetry.io/docs/specs/otel/overview/#instrumentation-libraries) can be added to your project to auto collect telemetry about specific components or dependencies. We recommend the following libraries:

1. [OpenTelemetry.Instrumentation.Http](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http) can be used to collect telemetry for outbound http dependencies. Azure Monitor maps it to [Dependency Telemetry](./data-model-complete.md#dependency).

    ```terminal
    dotnet add package OpenTelemetry.Instrumentation.Http
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.Http Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.Http)

2. [OpenTelemetry.Instrumentation.SqlClient](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient) can be used to collect telemetry for MS SQL dependencies. Azure Monitor maps it to [Dependency Telemetry](./data-model-complete.md#dependency).

    ```terminal
    dotnet add package --prerelease OpenTelemetry.Instrumentation.SqlClient
    ```

    A complete getting started guide is available here: [OpenTelemetry.Instrumentation.SqlClient Readme](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.SqlClient)

The following code sample expands on the previous example.
It now collects telemetry, but doesn't yet send to Application Insights.

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

---

## Configure Azure Monitor

### [ASP.NET Core](#tab/aspnetcore)

Application Insights offered many more configuration options via `ApplicationInsightsServiceOptions`.

| Application Insights Setting               | OpenTelemetry Alternative                                                                                            |
|--------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| AddAutoCollectedMetricExtractor            | N/A                                                                                                                  |
| ApplicationVersion                         | Set "service.version" on Resource                                                                                    |
| ConnectionString                           | See [instructions](./opentelemetry-configuration.md?tabs=aspnetcore#connection-string) on configuring the Connection String.  |
| DependencyCollectionOptions                | N/A. To customize dependencies, review the available configuration options for applicable Instrumentation libraries. |
| DeveloperMode                              | N/A                                                                                                                  |
| EnableActiveTelemetryConfigurationSetup    | N/A                                                                                                                  |
| EnableAdaptiveSampling                     | N/A. Only fixed-rate sampling is supported.                                                                          |
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

### Remove custom configurations

The following scenarios are optional and only apply to advanced users.

* If you have any more references to the `TelemetryClient`, which could be used to [manually record telemetry](./api-custom-events-metrics.md), they should be removed.
* If you added any [custom filtering or enrichment](./api-filtering-sampling.md) in the form of a custom `TelemetryProcessor` or `TelemetryInitializer`, they should be removed. They can be found in your `ServiceCollection`.

    ```csharp
    builder.Services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();
    ```

    ```csharp
    builder.Services.AddApplicationInsightsTelemetryProcessor<MyCustomTelemetryProcessor>();
    ```

* Remove JavaScript Snippet

    If you used the Snippet provided by the Application Insights .NET SDK, it must also be removed.
    For full code samples of what to remove, review the guide [enable client-side telemetry for web applications](./asp-net-core.md?tabs=netcorenew#enable-client-side-telemetry-for-web-applications).

    If you added the JavaScript SDK to collect client-side telemetry, it can also be removed although it continues to work without the .NET SDK.
    For full code samples of what to remove, review the [onboarding guide for the JavaScript SDK](./javascript-sdk.md).

* Remove any Visual Studio Artifacts

    If you used Visual Studio to onboard to Application Insights, you could have more files left over in your project.

  - `Properties/ServiceDependencies` directory might have a reference to your Application Insights resource.

### [ASP.NET](#tab/net)

To send your telemetry to Application Insights, the Azure Monitor Exporter must be added to the configuration of all three signals.

##### Global.asax.cs

The following code sample expands on the previous example.
It now collects telemetry and sends to Application Insights.

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

`APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>`

More options to configure the Connection String are detailed here: [Configure the Application Insights Connection String](./opentelemetry-configuration.md?tabs=net#connection-string).

### [Console](#tab/console)

To send your telemetry to Application Insights, the Azure Monitor Exporter must be added to the configuration of all three signals.

##### Program.cs

The following code sample expands on the previous example.
It now collects telemetry and sends to Application Insights.

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

`APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>`

More options to configure the Connection String are detailed here: [Configure the Application Insights Connection String](./opentelemetry-configuration.md?tabs=net#connection-string).

### Remove custom configurations

The following scenarios are optional and apply to advanced users.

* If you have any more references to the `TelemetryClient`, which is used to [manually record telemetry](./api-custom-events-metrics.md), they should be removed.

* Remove any [custom filtering or enrichment](./api-filtering-sampling.md) added as a custom `TelemetryProcessor` or `TelemetryInitializer`. The configuration references them.

* Remove any Visual Studio Artifacts

  If you used Visual Studio to onboard to Application Insights, you could have more files left over in your project.

  - `ConnectedService.json` might have a reference to your Application Insights resource.
  - `[Your project's name].csproj` might have a reference to your Application Insights resource:

      ```xml
      <ApplicationInsightsResourceId>/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Default-ApplicationInsights-EastUS/providers/microsoft.insights/components/WebApplication4</ApplicationInsightsResourceId>
      ```

### [WorkerService](#tab/workerservice)

To send your telemetry to Application Insights, the Azure Monitor Exporter must be added to the configuration of all three signals.

##### Program.cs

The following code sample expands on the previous example.
It now collects telemetry and sends to Application Insights.

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

`APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>`

More options to configure the Connection String are detailed here: [Configure the Application Insights Connection String](./opentelemetry-configuration.md?tabs=net#connection-string).

#### More configurations

Application Insights offered many more configuration options via `ApplicationInsightsServiceOptions`.

| Application Insights Setting               | OpenTelemetry Alternative                                                                                            |
|--------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| AddAutoCollectedMetricExtractor            | N/A                                                                                                                  |
| ApplicationVersion                         | Set "service.version" on Resource                                                                                    |
| ConnectionString                           | See [instructions](./opentelemetry-configuration.md?tabs=aspnetcore#connection-string) on configuring the Connection String.  |
| DependencyCollectionOptions                | N/A. To customize dependencies, review the available configuration options for applicable Instrumentation libraries. |
| DeveloperMode                              | N/A                                                                                                                  |
| EnableAdaptiveSampling                     | N/A. Only fixed-rate sampling is supported.                                                                          |
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

The following scenarios are optional and apply to advanced users.

* If you have any more references to the `TelemetryClient`, which are used to [manually record telemetry](./api-custom-events-metrics.md), they should be removed.

* If you added any [custom filtering or enrichment](./api-filtering-sampling.md) in the form of a custom `TelemetryProcessor` or `TelemetryInitializer`, it should be removed. You can find references in your `ServiceCollection`.

    ```csharp
    builder.Services.AddSingleton<ITelemetryInitializer, MyCustomTelemetryInitializer>();
    ```

    ```csharp
    builder.Services.AddApplicationInsightsTelemetryProcessor<MyCustomTelemetryProcessor>();
    ```

* Remove any Visual Studio Artifacts

  If you used Visual Studio to onboard to Application Insights, you could have more files left over in your project.

  - `Properties/ServiceDependencies` directory might have a reference to your Application Insights resource.

---

> [!Tip]
> Our product group is actively seeking feedback on this documentation. Provide feedback to otel@microsoft.com or see the [Support](#support) section.

## Frequently asked questions

This section is for customers who use telemetry initializers or processors, or write custom code against the classic Application Insights API to create custom telemetry.

### How do the SDK API's map to OpenTelemetry concepts?

[OpenTelemetry](https://opentelemetry.io/) is a vendor neutral observability framework. There are no Application Insights APIs in the OpenTelemetry SDK or libraries. Before migrating, it's important to understand some of OpenTelemetry's concepts.

* In Application Insights, all telemetry was managed through a single `TelemetryClient` and `TelemetryConfiguration`. In OpenTelemetry, each of the three telemetry signals (Traces, Metrics, and Logs) has its own configuration. You can manually create telemetry via the .NET runtime without external libraries. For more information, see the .NET guides on [distributed tracing](/dotnet/core/diagnostics/distributed-tracing-instrumentation-walkthroughs), [metrics](/dotnet/core/diagnostics/metrics), and [logging](/dotnet/core/extensions/logging).

* Application Insights used `TelemetryModules` to automatically collect telemetry for your application.
Instead, OpenTelemetry uses [Instrumentation libraries](https://opentelemetry.io/docs/specs/otel/overview/#instrumentation-libraries) to collect telemetry from specific components (such as [AspNetCore](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNetCore) for Requests and [HttpClient](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http) for Dependencies).

* Application Insights used `TelemetryInitializers` to enrich telemetry with additional information or to override properties.
With OpenTelemetry, you can write a [Processor](https://opentelemetry.io/docs/collector/configuration/#processors) to customize a specific signal. Additionally, many OpenTelemetry Instrumentation libraries offer an `Enrich` method to customize the telemetry generated by that specific component.

* Application Insights used `TelemetryProcessors` to filter telemetry. An OpenTelemetry [Processor](https://opentelemetry.io/docs/collector/configuration/#processors) can also be used to apply filtering rules on a specific signal.

### How do Application Insights telemetry types map to OpenTelemetry?

This table maps Application Insights data types to OpenTelemetry concepts and their .NET implementations.

| Azure Monitor Table | Application Insights DataType | OpenTelemetry DataType             | .NET Implementation                  |
|---------------------|-------------------------------|------------------------------------|--------------------------------------|
| customEvents        | EventTelemetry                | N/A                                | N/A                                  |
| customMetrics       | MetricTelemetry               | Metrics                            | System.Diagnostics.Metrics.Meter     |
| dependencies        | DependencyTelemetry           | Spans (Client, Internal, Consumer) | System.Diagnostics.Activity          |
| exceptions          | ExceptionTelemetry            | Exceptions                         | System.Exception                     |
| requests            | RequestTelemetry              | Spans (Server, Producer)           | System.Diagnostics.Activity          |
| traces              | TraceTelemetry                | Logs                               | Microsoft.Extensions.Logging.ILogger |

The following documents provide more information.

- [Data Collection Basics of Azure Monitor Application Insights](./opentelemetry-overview.md)
- [Application Insights telemetry data model](./data-model-complete.md)
- [OpenTelemetry Concepts](https://opentelemetry.io/docs/concepts/)

### How do Application Insights sampling concepts map to OpenTelemetry?

While Application Insights offered multiple options to configure sampling, Azure Monitor Exporter or Azure Monitor Distro only offers fixed rate sampling. Only *Requests* and *Dependencies* (*OpenTelemetry Traces*) can be sampled.

For code samples detailing how to configure sampling, see our guide [Enable Sampling](./opentelemetry-configuration.md#enable-sampling)

### How do Telemetry Processors and Initializers map to OpenTelemetry?

In the Application Insights .NET SDK, use telemetry processors to filter and modify or discard telemetry. Use telemetry initializers to add or modify custom properties. For more information, see the [Azure Monitor documentation](./api-filtering-sampling.md). OpenTelemetry replaces these concepts with activity or log processors, which enrich and filter telemetry.

#### Filtering Traces

To filter telemetry data in OpenTelemetry, you can implement an activity processor. This example is equivalent to the Application Insights example for filtering telemetry data as described in [Azure Monitor documentation](./api-filtering-sampling.md). The example illustrates where unsuccessful dependency calls are filtered.

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

[`ILogger`](/dotnet/core/extensions/logging)
implementations have a built-in mechanism to apply [log
filtering](/dotnet/core/extensions/logging?tabs=command-line#how-filtering-rules-are-applied).
This filtering lets you control the logs that are sent to each registered
provider, including the `OpenTelemetryLoggerProvider`. "OpenTelemetry" is the
[alias](/dotnet/api/microsoft.extensions.logging.provideraliasattribute)
for `OpenTelemetryLoggerProvider`, used in configuring filtering rules.

The following example defines "Error" as the default `LogLevel`
and also defines "Warning" as the minimum `LogLevel` for a user defined category.
These rules as defined only apply to the `OpenTelemetryLoggerProvider`.

```csharp
builder.AddFilter<OpenTelemetryLoggerProvider>("*", LogLevel.Error);
builder.AddFilter<OpenTelemetryLoggerProvider>("MyProduct.MyLibrary.MyClass", LogLevel.Warning);
```

For more information, please read the [OpenTelemetry .NET documentation on logs](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/docs/logs/README.md).

#### Adding Custom Properties to Traces

In OpenTelemetry, you can use activity processors to enrich telemetry data with more properties. It's similar to using telemetry initializers in Application Insights, where you can modify telemetry properties.

By default, Azure Monitor Exporter flags any HTTP request with a response code of 400 or greater as failed. However, if you want to treat 400 as a success, you can add an enriching activity processor that sets the success on the activity and adds a tag to include more telemetry properties. It's similar to adding or modifying properties using an initializer in Application Insights as described in [Azure Monitor documentation](./api-filtering-sampling.md?tabs=javascriptwebsdkloaderscript#addmodify-properties-itelemetryinitializer).

Here's an example of how to add custom properties and override the default behavior for certain response codes:

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

### How do I manually track telemetry using OpenTelemetry?

#### Sending Traces - Manual

Traces in Application Insights are stored as `RequestTelemetry` and `DependencyTelemetry`. In OpenTelemetry, traces are modeled as `Span` using the `Activity` class.

OpenTelemetry .NET utilizes the `ActivitySource` and `Activity` classes for tracing, which are part of the .NET runtime. This approach is distinctive because the .NET implementation integrates the tracing API directly into the runtime itself. The `System.Diagnostics.DiagnosticSource` package allows developers to use `ActivitySource` to create and manage `Activity` instances. This method provides a seamless way to add tracing to .NET applications without relying on external libraries, applying the built-in capabilities of the .NET ecosystem. For more detailed information, refer to the [distributed tracing instrumentation walkthroughs](/dotnet/core/diagnostics/distributed-tracing-instrumentation-walkthroughs).

Here's how to migrate manual tracing:

   > [!Note]
   > In Application Insights, the role name and role instance could be set at a per-telemetry level. However, with the Azure Monitor Exporter, we cannot customize at a per-telemetry level. The role name and role instance are extracted from the OpenTelemetry resource and applied across all telemetry. Please read this document for more information: [Set the cloud role name and the cloud role instance](./opentelemetry-configuration.md?tabs=aspnetcore#set-the-cloud-role-name-and-the-cloud-role-instance).

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

In Application Insights, track custom operations using `StartOperation` and `StopOperation` methods. Achieve it using `ActivitySource` and `Activity` in OpenTelemetry .NET. For operations with `ActivityKind.Server` and `ActivityKind.Consumer`, Azure Monitor Exporter generates `RequestTelemetry`. For `ActivityKind.Client`, `ActivityKind.Producer`, and `ActivityKind.Internal`, it generates `DependencyTelemetry`. For more information on custom operations tracking, see the [Azure Monitor documentation](./custom-operations-tracking.md). For more on using `ActivitySource` and `Activity` in .NET, see the [.NET distributed tracing instrumentation walkthroughs](/dotnet/core/diagnostics/distributed-tracing-instrumentation-walkthroughs#activity).

Here's an example of how to start and stop an activity for custom operations:

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

#### Sending Logs

Logs in Application Insights are stored as `TraceTelemetry` and `ExceptionTelemetry`.

##### TraceTelemetry

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

##### ExceptionTelemetry

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

#### Sending Metrics

Metrics in Application Insights are stored as `MetricTelemetry`. In OpenTelemetry, metrics are modeled as `Meter` from the `System.Diagnostics.DiagnosticSource` package.

Application Insights has both non-pre-aggregating (`TrackMetric()`) and preaggregating (`GetMetric().TrackValue()`) Metric APIs. Unlike OpenTelemetry, Application Insights has no notion of [Instruments](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/supplementary-guidelines.md#instrument-selection). Application Insights has the same API for all the metric scenarios.

OpenTelemetry, on the other hand, requires users to first [pick the right metric instrument](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/supplementary-guidelines.md#instrument-selection) based on the actual semantics of the metric. For example, if the intention is to count something (like the number of total server requests received, etc.), [OpenTelemetry Counter](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/api.md#counter) should be used. If the intention is to calculate various percentiles (like the P99 value of server latency), then [OpenTelemetry Histogram](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/api.md#histogram) instrument should be used. Due to this fundamental difference between Application Insights and OpenTelemetry, no direct comparison is made between them.

Unlike Application Insights, OpenTelemetry doesn't provide built-in mechanisms to enrich or filter metrics. In Application Insights, telemetry processors and initializers could be used to modify or discard metrics, but this capability isn't available in OpenTelemetry.

Additionally, OpenTelemetry doesn't support sending raw metrics directly, as there's no equivalent to the `TrackMetric()` functionality found in Application Insights.

Migrating from Application Insights to OpenTelemetry involves replacing all Application Insights Metric API usages with the OpenTelemetry API. It requires understanding the various OpenTelemetry Instruments and their semantics.

> [!Tip]
> The histogram is the most versatile and the closest equivalent to the Application Insights `GetMetric().TrackValue()` API. You can replace Application Insights Metric APIs with Histogram to achieve the same purpose.

#### Other Telemetry Types

##### CustomEvents

Not supported in OpenTelemetry.

**Application Insights Example:**

```csharp
TelemetryClient.TrackEvent()
```

##### AvailabilityTelemetry

Not supported in OpenTelemetry.

**Application Insights Example:**

```csharp
TelemetryClient.TrackAvailability()
```

##### PageViewTelemetry

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
* [C# and .NET Logging](/dotnet/core/extensions/logging)
* [Azure Monitor OpenTelemetry getting started with ASP.NET Core](./opentelemetry-enable.md?tabs=aspnetcore)

### [ASP.NET](#tab/net)

* [OpenTelemetry SDK's getting started guide](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry)
* [OpenTelemetry's example ASP.NET project](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/examples/AspNet/Global.asax.cs)
* [C# and .NET Logging](/dotnet/core/extensions/logging)
* [Azure Monitor OpenTelemetry getting started with .NET](./opentelemetry-enable.md?tabs=net)

### [Console](#tab/console)

* [OpenTelemetry SDK's getting started guide](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry)
* OpenTelemetry's example projects:
  * [Getting Started with Traces](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/docs/trace/getting-started-console)
  * [Getting Started with Metrics](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/docs/metrics/getting-started-console)
  * [Getting Started with Logs](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/docs/logs/getting-started-console)
* [C# and .NET Logging](/dotnet/core/extensions/logging)
* [Azure Monitor OpenTelemetry getting started with .NET](./opentelemetry-enable.md?tabs=net)

### [WorkerService](#tab/workerservice)

* [OpenTelemetry SDK's getting started guide](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry)
* [Logging in C# and .NET](/dotnet/core/extensions/logging)
* [Azure Monitor OpenTelemetry getting started with .NET](./opentelemetry-enable.md?tabs=net)

---

> [!Tip]
> Our product group is actively seeking feedback on this documentation. Provide feedback to otel@microsoft.com or see the [Support](#support) section.

## Support

### [ASP.NET Core](#tab/aspnetcore)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry .NET community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.
- For a list of open issues related to Azure Monitor Exporter, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-net/issues?q=is%3Aopen+is%3Aissue+label%3A%22Monitor+-+Exporter%22).

#### [.NET](#tab/net)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry .NET community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.
- For a list of open issues related to Azure Monitor Exporter, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-net/issues?q=is%3Aopen+is%3Aissue+label%3A%22Monitor+-+Exporter%22).

### [Console](#tab/console)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry .NET community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.
- For a list of open issues related to Azure Monitor Exporter, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-net/issues?q=is%3Aopen+is%3Aissue+label%3A%22Monitor+-+Exporter%22).

### [WorkerService](#tab/workerservice)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry .NET community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.
- For a list of open issues related to Azure Monitor Exporter, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-net/issues?q=is%3Aopen+is%3Aissue+label%3A%22Monitor+-+Exporter%22).

---
