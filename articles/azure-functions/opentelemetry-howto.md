---
title: Use OpenTelemetry with Azure Functions
description: This article shows you how to enable export of application logs and traces from your function app using OpenTelemetry.
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python, devx-track-ts
ms.topic: how-to 
ms.date: 05/19/2025
zone_pivot_groups: programming-languages-set-functions

#CustomerIntent: As a developer, I want to learn how to enable the export of logs and metrics from my function apps by using OpenTelemetry so I can consume and analyze my application telemetry data either in Application Insights or to any OTLP-compliant tools.
---

# Use OpenTelemetry with Azure Functions

[!INCLUDE [functions-opentelemetry-preview-note](../../includes/functions-opentelemetry-preview-note.md)]

This article shows you how to configure your function app to export log and trace data in an OpenTelemetry format. Azure Functions generates telemetry data on your function executions from both the Functions host process and the language-specific worker process in which your function code runs. By default, this telemetry data is sent to Application Insights using the Application Insights SDK. However, you can choose to export this data using OpenTelemetry semantics. While you can still use an OpenTelemetry format to send your data to Application Insights, you can now also export the same data to any other OpenTelemetry-compliant endpoint.  

> [!TIP]  
> Because this article is targeted at your development language of choice, remember to choose the correct language at the top of the article.
::: zone pivot="programming-language-csharp" 
> OpenTelemetry currently isn't supported for [C# in-process apps](./functions-dotnet-class-library.md).
:::zone-end

 You can obtain these benefits by enabling OpenTelemetry in your function app: 

+ Correlates data across traces and logs being generated both at the host and in your application code.
+ Enables consistent, standards-based generation of exportable telemetry data. 
+ Integrates with other providers that can consume OpenTelemetry-compliant data. 

OpenTelemetry is enabled at the function app level, both in host configuration (`host.json`) and in your code project. Functions also provides a client optimized experience for exporting OpenTelemetry data from your function code that's running in a language-specific worker process.

## Enable OpenTelemetry in the Functions host

When you enable OpenTelemetry output in the function app's host.json file, your host exports OpenTelemetry output regardless of the language stack used by your app.   

To enable OpenTelemetry output from the Functions host, update the [host.json file](./functions-host-json.md) in your code project to add a `"telemetryMode": "OpenTelemetry"` element to the root collection. With OpenTelemetry enabled, your host.json file might look like this:

```json
{
    "version": "2.0",
    "telemetryMode": "OpenTelemetry",
    ...
}
```

## Configure application settings 

When OpenTelemetry is enabled in the host.json file, the endpoints to which data is sent is determined based on which OpenTelemetry-supported application settings are available in your app's environment variables. 

Create specific application settings in your function app based on the OpenTelemetry output destination. When connection settings are provided for both Application Insights and an OpenTelemetry protocol (OTLP) exporter, OpenTelemetry data is sent to both endpoints.    

### [Application Insights](#tab/app-insights)

**[APPLICATIONINSIGHTS_CONNECTION_STRING](./functions-app-settings.md#applicationinsights_connection_string)**: the connection string for an Application Insights workspace. When this setting exists, OpenTelemetry data is sent to that workspace. This setting is the same one used to connect to Application Insights without OpenTelemetry enabled. If your app doesn't already have this setting, you might need to [Enable Application Insights integration](configure-monitoring.md#enable-application-insights-integration). 

::: zone pivot="programming-language-java"
**[JAVA_APPLICATIONINSIGHTS_ENABLE_TELEMETRY](./functions-app-settings.md#java_applicationinsights_enable_telemetry)**: set to `true` so that the Functions host allows the Java worker process to stream OpenTelemetry logs directly, which prevents duplicate host-level entries.
::: zone-end
::: zone pivot="programming-language-python"
**[PYTHON_APPLICATIONINSIGHTS_ENABLE_TELEMETRY](./functions-app-settings.md#python_applicationinsights_enable_telemetry)**: set to `true` so that the Functions host allows the Python worker process to stream OpenTelemetry logs directly, which prevents duplicate host-level entries.
::: zone-end

### [OTLP Exporter](#tab/otlp-export) 
 
**[OTEL_EXPORTER_OTLP_ENDPOINT](functions-app-settings.md#otel_exporter_otlp_endpoint)**: an OTLP exporter endpoint URL. 

**[OTEL_EXPORTER_OTLP_HEADERS](functions-app-settings.md#otel_exporter_otlp_headers)**: (Optional) list of headers to apply to all outgoing data. This setting is used by many endpoints to pass an API key.

::: zone pivot="programming-language-python"
**[PYTHON_ENABLE_OPENTELEMETRY](./functions-app-settings.md#python_applicationinsights_enable_telemetry)**: set to `true` so that the Functions host allows the Python worker process to stream OpenTelemetry logs directly, which prevents duplicate host-level entries.
::: zone-end

If your endpoint requires you to set other environment variables, you need to also add them to your application settings. For more information, see the [OTLP Exporter Configuration documentation](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/). 

You should remove the `APPLICATIONINSIGHTS_CONNECTION_STRING` setting, unless you also want OpenTelemetry output from the host sent to Application Insights. 

---  

## Enable OpenTelemetry in your app

With the Functions host configured to use OpenTelemetry, you should also update your application code to output OpenTelemetry data. Enabling OpenTelemetry in both the host and your application code enables better correlation between traces and logs emitted both by the Functions host process and from your language worker process. 

The way that you instrument your application to use OpenTelemetry depends on your target OpenTelemetry endpoint:
::: zone pivot="programming-language-csharp"
Examples in this article assume your app is using `IHostApplicationBuilder`, which is available in version 2.x and later version of [Microsoft.Azure.Functions.Worker](/dotnet/api/microsoft.extensions.hosting.ihostapplicationbuilder). For more information, see [Version 2.x](dotnet-isolated-process-guide.md#version-2x) in the C# isolated worker model guide.

1. Run these commands to install the required assemblies in your app:

    ### [Application Insights](#tab/app-insights)

    ```cmd
    dotnet add package Microsoft.Azure.Functions.Worker.OpenTelemetry --version  1.1.0-preview6
    dotnet add package OpenTelemetry.Extensions.Hosting 
    dotnet add package Azure.Monitor.OpenTelemetry.Exporter  
    ```

    ### [OTLP Exporter](#tab/otlp-export) 

    ```cmd
    dotnet add package Microsoft.Azure.Functions.Worker.OpenTelemetry --version 1.1.0-preview6
    dotnet add package OpenTelemetry.Extensions.Hosting 
    dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol   
    ```
    ---

2. In your Program.cs project file, add this `using` statement:

    ### [Application Insights](#tab/app-insights)

    ```csharp
    using Azure.Monitor.OpenTelemetry.Exporter; 
    ```

    ### [OTLP Exporter](#tab/otlp-export) 

    ```csharp
    using OpenTelemetry; 
    ```

    ---

3. The way that you configure OpenTelemetry depends if your project startup uses `IHostBuilder` or `IHostApplicationBuilder`, which was introduced in v2.x of the .NET isolated worker model extension.

    ### [IHostApplicationBuilder](#tab/ihostapplicationbuilder/app-insights)
    
    In *program.cs*, add this line of code after `ConfigureFunctionsWebApplication`:

    ```csharp
    builder.Services.AddOpenTelemetry()
        .UseFunctionsWorkerDefaults()
        .UseAzureMonitorExporter();
    ```

    ### [IHostBuilder](#tab/ihostbuilder/app-insights)
    
    In *program.cs*, add this `ConfigureServices` call in your `HostBuilder` pipeline:

    ```csharp
    .ConfigureServices(s =>
    {
        s.AddOpenTelemetry()
        .UseFunctionsWorkerDefaults()
        .UseAzureMonitorExporter();
    })
    ```

    ### [IHostApplicationBuilder](#tab/ihostapplicationbuilder/otlp-export)

    In *program.cs*, add this line of code after `ConfigureFunctionsWebApplication`:

    ```csharp
    builder.Services.AddOpenTelemetry()
        .UseFunctionsWorkerDefaults()
        .UseOtlpExporter();
    ```

    ### [IHostBuilder](#tab/ihostbuilder/otlp-export) 

    In *program.cs*, add this `ConfigureServices` call in your `HostBuilder` pipeline:

    ```csharp
    .ConfigureServices(s =>
    {
        s.AddOpenTelemetry()
        .UseFunctionsWorkerDefaults()
        .UseOtlpExporter();
    })
    ```

    ---

    You can export to both OpenTelemetry endpoints from the same app.
::: zone-end
::: zone pivot="programming-language-java"
1. Add the required libraries to your app. The way you add libraries depends on whether you deploy using Maven or Kotlin and if you want to also send data to Application Insights.

    ### [Maven](#tab/maven/app-insights)

    ```xml
    <dependency>
      <groupId>com.microsoft.azure.functions</groupId>
      <artifactId>azure-functions-java-opentelemetry</artifactId>
      <version>1.0.0</version>
    </dependency>
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-monitor-opentelemetry-autoconfigure</artifactId>
      <version>1.2.0</version>
    </dependency>
    ```

    ### [Kotlin](#tab/kotlin/app-insights)

    ```kotlin
    implementation("com.microsoft.azure.functions:azure-functions-java-opentelemetry:1.0.0")
    implementation("com.azure:azure-monitor-opentelemetry-autoconfigure:1.2.0")
    ```

    ### [Maven](#tab/maven/otlp-export) 

    ```xml
    <dependency>
      <groupId>com.microsoft.azure.functions</groupId>
      <artifactId>azure-functions-java-opentelemetry</artifactId>
      <version>1.0.0</version>
    </dependency>
    ```

    ### [Kotlin](#tab/kotlin/otlp-export) 

    ```kotlin
    implementation("com.microsoft.azure.functions:azure-functions-java-opentelemetry:1.0.0")
    ```

    ---

2. You can optionally add this code to create custom spans:

    ```java
    import com.microsoft.azure.functions.opentelemetry.FunctionsOpenTelemetry;
    import io.opentelemetry.api.trace.Span;
    import io.opentelemetry.api.trace.SpanKind;
    import io.opentelemetry.context.Scope;
    
    Span span = FunctionsOpenTelemetry.startSpan(
            "com.contoso.PaymentFunction",  // tracer name
            "validateCharge",               // span name
            null,                           // parent = current context
            SpanKind.INTERNAL);
    
    try (Scope ignored = span.makeCurrent()) {
        // business logic here
    } finally {
        span.end();
    }
    ```

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"
1. Install these npm packages in your project:
    
    ### [Application Insights](#tab/app-insights)
    
    ```bash
    npm install @opentelemetry/api 
    npm install @opentelemetry/auto-instrumentations-node 
    npm install @azure/monitor-opentelemetry-exporter 
    npm install @azure/functions-opentelemetry-instrumentation
    ```
    ### [OTLP Exporter](#tab/otlp-export) 

    ```bash
    npm install @opentelemetry/api 
    npm install @opentelemetry/auto-instrumentations-node 
    npm install @opentelemetry/exporter-logs-otlp-http 
    npm install @azure/functions-opentelemetry-instrumentation
    ```
    ---

::: zone-end 
::: zone pivot="programming-language-javascript"
2. Create a code file in your project, copy and paste the following code in this new file, and save the file as `src/index.js`:

    ### [Application Insights](#tab/app-insights)

    :::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/otelAppInsights.js":::

    ### [OTLP Exporter](#tab/otlp-export) 

    :::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/otelOtlp.js":::

    ---

3. Update the `main` field in your package.json file to include this new `src/index.js` file, which might look like this: 

    ```json
    "main": "src/{index.js,functions/*.js}"
    ```
::: zone-end     
::: zone pivot="programming-language-typescript"
2. Create a code file in your project, copy and paste the following code in this new file, and save the file as `src/index.ts`:

    ### [Application Insights](#tab/app-insights)

    :::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/otelAppInsights.ts":::

    ### [OTLP Exporter](#tab/otlp-export) 

    :::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/otelOtlp.ts":::

    ---

3. Update the `main` field in your package.json file to include the output of this new `src/index.ts` file, which might look like this: 

    ```json
    "main": "dist/src/{index.js,functions/*.js}"
    ```
::: zone-end 
::: zone pivot="programming-language-powershell"
> [!IMPORTANT]
> OpenTelemetry output to Application Insights from the language worker isn't currently supported for PowerShell apps. You might instead want to use an OTLP exporter endpoint. When your host is configured for OpenTelemetry output to Application Insights, the logs generated by the PowerShell worker process are still be forwarded, but distributed tracing isn't supported at this time.  

These instructions only apply for an OTLP exporter:

1. Add an application setting named `OTEL_FUNCTIONS_WORKER_ENABLED` with value of `True`.

1. Create an [app-level `Modules` folder](functions-reference-powershell.md#including-modules-in-app-content) in the root of your app and run the following command:

    ```powershell
    Save-Module -Name AzureFunctions.PowerShell.OpenTelemetry.SDK
    ```
    
    This installs the required `AzureFunctions.PowerShell.OpenTelemetry.SDK` module directly in your app. You can't use the `requirements.psd1` file to automatically install this dependency because [managed dependencies](functions-reference-powershell.md#dependency-management) isn't currently supported in the [Flex Consumption plan](./flex-consumption-plan.md) preview.   

1. Add this code to your profile.ps1 file:

    ```powershell
    Import-Module AzureFunctions.PowerShell.OpenTelemetry.SDK -Force -ErrorAction Stop 
    Initialize-FunctionsOpenTelemetry 
    ```

::: zone-end  
::: zone pivot="programming-language-python"  
1. Make sure these libraries are in your `requirements.txt` file, whether from uncommenting or adding yourself:

    ### [Application Insights](#tab/app-insights)

    ```text
    azure-monitor-opentelemetry
    ```
    ### [OTLP Exporter](#tab/otlp-export) 

    ```text
    opentelemetry-api
    opentelemetry-sdk
    opentelemetry-exporter-otlp
    opentelemetry-instrumentation-logging
    ```
    ---

1. Add this code to your `function_app.py` main entry point file:

    ### [Application Insights](#tab/app-insights)

    If you already added `PYTHON_APPLICATIONINSIGHTS_ENABLE_TELEMETRY=true` in your application settings, you can skip this step. To manually enable Application Insights collection without automatic instrumentation, add this code to your app:
   
    ```python
    from azure.monitor.opentelemetry import configure_azure_monitor 
    configure_azure_monitor() 
    ```
    ### [OTLP Exporter](#tab/otlp-export) 

    Exporting traces, metrics, and logs using OpenTelemetry must be configured manually. For more information, see [Instrumentation](https://opentelemetry.io/docs/languages/python/instrumentation/) for Python.

    This is a simple implementation for exporting logs:

    ```python
    logging.basicConfig(level=logging.DEBUG)

    from opentelemetry import _logs
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter

    # Initialize logging and an exporter that can send data to an OTLP endpoint by attaching OTLP handler to root logger
    # SELECT * FROM Log WHERE instrumentation.provider='opentelemetry'
    _logs.set_logger_provider(
        LoggerProvider(resource=Resource.create(OTEL_RESOURCE_ATTRIBUTES))
    )
    logging.getLogger().addHandler(
        LoggingHandler(
            logger_provider=_logs.get_logger_provider().add_log_record_processor(
                BatchLogRecordProcessor(OTLPLogExporter())
            )
        )
    )

    ```

    Review the [OpenTelemetry Logging SDK](https://opentelemetry-python.readthedocs.io/en/stable/sdk/_logs.html) to learn how to use OpenTelemetry components to collect logs.

    ---

1. Review [Azure monitor Distro usage](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/monitor/azure-monitor-opentelemetry#usage) documentation for options on how to further configure the SDK.
  
::: zone-end  
## Considerations for OpenTelemetry

When you export your data using OpenTelemetry, keep these current considerations in mind.

+ At this time, only HTTP, Service Bus and Event Hubs triggers are supported with OpenTelemetry outputs. 

+ When the host is configured to use OpenTelemetry, the Azure portal doesn't support log streaming or recent function invocation traces.
::: zone pivot="programming-language-java" 
+ Custom spans automatically include all resource attributes and use the exporters configured in your app.

+ When your app runs outside Azure, including during local development, the resource detector sets the `service.name` attribute to `java-function-app` by default.

+ Use these Java Virtual Machine (JVM) flags to silence telemetry when running locally during unit tests:

    + `-Dotel.traces.exporter=none`
    + `-Dotel.metrics.exporter=none`
    + `-Dotel.logs.exporter=none`

* You aren't required to manually register middleware; the Java worker autodiscovers `OpenTelemetryInvocationMiddleware`.
::: zone-end  
+ [Azure Functions diagnostics](functions-diagnostics.md) in the Azure portal is a useful resource for detecting and diagnosing potential monitoring-related issues. 

## Troubleshooting

When you export your data using OpenTelemetry, keep these common issues and solutions in mind.

### Log filtering

Understanding the difference between the host process and worker process is important for correctly configuring log filtering in your function app.

The *host process* is the Azure Functions runtime that manages triggers, scaling, and emits system-level telemetry such as initialization logs, request traces, and runtime health information.

The *worker process* is language specific, executes your function code, and produces application logs and telemetry independently.

> [!IMPORTANT]
> Filters defined in host.json apply only to logs generated by the host process. Logs from the worker process must be filtered using language-specific OpenTelemetry settings.

**Example: Filter host logs for all providers in host.json**

Use this approach to set a global log level across all providers managed by the host:

```json
{
  "version": "2.0",
  "telemetryMode": "OpenTelemetry",
  "logging": {
    "logLevel": {
      "default": "Warning"
    }
  }
}
```

**Example: Filter logs only for the OpenTelemetry logger provider**

Use this approach to target only the OpenTelemetry logger provider while leaving other providers (such as console or file logging) unaffected:

```json
{
  "version": "2.0",
  "telemetryMode": "OpenTelemetry",
  "logging": {
    "OpenTelemetry": {
      "logLevel": {
        "default": "Warning"
      }
    }
  }
}
```

### Console logging

The Functions host automatically captures anything written to stdout or stderr and forwards it to the telemetry pipeline. If you also use a ConsoleExporter or write directly to console in your code, duplicate logs can occur in your telemetry data.

> [!NOTE]
> Don't add ConsoleExporter or write to console in production code to avoid duplicate telemetry entries.

### Microsoft Entra authentication

When using Microsoft Entra authentication with OpenTelemetry, you must configure authentication separately for both the host process and the worker process.

To configure authentication for the host process, see [Require Microsoft Entra authentication](configure-monitoring.md#require-microsoft-entra-authentication).

To configure authentication for the worker process, see [Enable Microsoft Entra authentication](/azure/azure-monitor/app/azure-ad-authentication).

### Resource attributes support

Resource attributes support in Azure Monitor is currently in preview. To enable this feature, set the `OTEL_DOTNET_AZURE_MONITOR_ENABLE_RESOURCE_METRICS` environment variable to `true`. This setting ingests resource attributes into the custom metrics table.

### Duplicate request telemetry

The host process automatically emits request telemetry. If the worker process is also instrumented with request tracking libraries (for example, AspNetCoreInstrumentation in .NET), the same request is reported twice.

> [!NOTE]
> Since the Azure Monitor Distro typically includes AspNetCoreInstrumentation in .NET and similar instrumentation in other languages, avoid using the Azure Monitor distro in the worker process to prevent duplicate telemetry.

### Logging scopes not included

By default, the worker process doesn't include scopes in its logs. To enable scopes, you must configure this setting explicitly in the worker. The following example shows how to enable scopes in .NET Isolated:

```csharp
builder.Logging.AddOpenTelemetry(b => b.IncludeScopes = true);
```

### Missing request telemetry

Triggers such as HTTP, Service Bus, and Event Hubs depend on context propagation for distributed tracing. With parent-based sampling as the default behavior, request telemetry isn't generated when the incoming request or message isn't sampled.

### Duplicate OperationId

In Azure Functions, the `OperationId` used for correlating telemetry is derived directly from the `traceparent` value in the incoming request or message. If multiple calls reuse the same `traceparent` value, they're all assigned the same `OperationId`.

### Configuring OpenTelemetry with environment variables

You can configure OpenTelemetry behavior using its standard environment variables, which provide a consistent way to control behavior across different languages and runtimes. These variables allow you to adjust sampling strategies, exporter settings, and resource attributes. For more information about supported environment variables, see the [OpenTelemetry documentation](https://opentelemetry.io/docs/languages/sdk-configuration/).

### Use diagnostics to troubleshoot monitoring issues

[Azure Functions diagnostics](functions-diagnostics.md) in the Azure portal is a useful resource for detecting and diagnosing potential monitoring-related issues. 

To access diagnostics in your app:

  1. In the [Azure portal](https://portal.azure.com), navigate to your function app resource. 
  
  1. In the left pane, select **Diagnose and solve problems** and search for the *Function App missing telemetry Application Insights or OpenTelemetry* workflow. 
  
  1. Select this workflow, choose your ingestion method, and select **Next**.
  
  1. Review the guidelines and any recommendations provided by the troubleshooter.

## Related content

[Monitor Azure Functions](monitor-functions.md)
[Flex Consumption plan](./flex-consumption-plan.md)
