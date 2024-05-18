---
title: Use OpenTelemetry with Azure Functions
description: This article shows you how to enable export of application logs and traces from your function app using OpenTelemetry.
ms.service: azure-functions
ms.topic: how-to 
ms.date: 05/16./2024

#CustomerIntent: As a developer, I want to learn how to enable the export of logs and metrics from my function apps by using OpenTelemetry so I can consume and analyze my application telemetry data either in Application Insights or to any OTLP-compliant tools.
---

# Use OpenTelemetry with Azure Functions

[!INCLUDE [functions-opentelemetry-preview-note](../../includes/functions-opentelemetry-preview-note.md)]

Azure Functions generates telemetry data on your function executions from both the Functions host (func.exe) and the language-specific worker process in which your function code runs. You can export all logs and traces host using OpenTelemetry semantics. You can send this telemetry data to Application Insights, as you normally would, but you can also export it to any other OpenTelemetry-compliant endpoint. 

Functions also make it easier to export OpenTelemetry data from your language function code running in the worker. 

> [!TIP]  
> Because this article is target at your development language of choice, remember to choose the correct language at the top of the article.
::: zone pivot="programming-language-java" 
> Currently, there's no optimized OpenTelemetry support for Java apps.
:::zone-end
::: zone pivot="programming-language-csharp" 
> OpenTelemetry is currently only supported for C# apps that run in the [isolated process mode](./dotnet-isolated-process-guide.md).
:::zone-end

OpenTelemetry is enabled at the function app level, both in host configuration (`host.json`) and in your code project. You can obtain these benefits by enabling OpenTelemetry in your function app: 

+ Context for correlation across traces and logs being generated both at the host and in your application code.
+ Consistent, standards-based generation of exportable telemetry data, plus extra Functions-specific metrics. 
+ Integrates with other providers that can consume OpenTeleletry-compliant data. 

## 1. Enable OpenTelemetry in the Functions host

When you enable OpenTelemetry output in the function app's host.json file, your host exports OpenTelemetry ouput regardless of the language stack used by your app.   

To enabled OpenTelemetry output from the Functions host, simply update the [host.json file](./functions-host-json.md) in your code project to add a `"telemetryMode": "openTelemetry"` element to the root collection. With OpenTelemetry enabled, your host.json file might look like this:

```json
{
    "version": "2.0",
    "logging": {
        "applicationInsights": {
            "samplingSettings": {
                "isEnabled": true,
                "excludedTypes": "Request"
            },
            "enableLiveMetricsFilters": true
        }
    },
    "telemetryMode": "openTelemetry"
}
```

## 2. Configure application settings 

When OpenTelemetry is enabled in the host.json file, the endpoints to which data is sent is determined based on which OpenTelemetry-supported application settings are provided. When connection settings are provided for both Application Insights and an OLTP exporter, OpenTelemetry data is sent to both endpoints.    

### [Application Insights](#tab/app-insights)

**`APPLICATIONINSIGHTS_CONNECTION_STRING`**: the connection string for an Application Insights workspace. When this setting exists, OpenTelemetry data is sent to that workspace. This is the same setting used to connect to Application Insights without OpenTelemetry enabled. If your app doesn't already have this setting, you might need to [Enable Application Insights integration](configure-monitoring.md#enable-application-insights-integration). 

### [OTLP Exporter](#tab/otlp-export) 
 
**`OTEL_EXPORTER_OTLP_ENDPOINT`**: the connection string for an OTLP exporter endpoint. 

**`OTEL_EXPORTER_OTLP_HEADERS`**: (optional) list of headers to apply to all outgoing data. 

If your endpoint requires you to set other environment variables, you need to also add them to your application settings. For more information, see the [OTLP Exporter Configuration documentation](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/). 

You should remove the `APPLICATIONINSIGHTS_CONNECTION_STRING` setting, unless you also want OpenTelemetry output from the host sent to Application Insights. 

---  

## 3. Enable OpenTelemetry in your app

With the Functions host configured to use OpenTelemetry, you should also update your application code to output OpenTelemetry data. Enabling OpenTelemetry in both the host and your application code enables better correlation between traces and logs emitted both by the Functions host process and from your language worker process. 

The way that you instrument your application to use OpenTelemetry depends on your target endpoint:
::: zone pivot="programming-language-csharp"
1. Run these commands to install the required assemblies in your app:

    ### [Application Insights](#tab/app-insights)

    ```cmd
    dotnet add package Microsoft.Azure.Functions.Worker.OpenTelemetry --version 1.0.0-preview1 
    dotnet add package OpenTelemetry.Extensions.Hosting 
    dotnet add package Azure.Monitor.OpenTelemetry.AspNetCore  
    ```

    ### [OTLP Exporter](#tab/otlp-export) 

    ```cmd
    dotnet add package Microsoft.Azure.Functions.Worker.OpenTelemetry --version 1.0.0-preview1 
    dotnet add package OpenTelemetry.Extensions.Hosting 
    dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol   
    ```
    ---

1. In your Program.cs project file, add this `using` statement:

    ### [Application Insights](#tab/app-insights)

    ```csharp
    using Azure.Monitor.OpenTelemetry.AspNetCore; 
    ```
    ### [OTLP Exporter](#tab/otlp-export) 

    ```csharp
    using OpenTelemetry; 
    ```
    ---

1. In the `ConfigureServices` delegate, add this service configuration:

    ### [Application Insights](#tab/app-insights)

    ```csharp
    services.AddOpenTelemetry()
    .UseFunctionsWorkerDefaults()
    .UseAzureMonitor();
    ```
    ### [OTLP Exporter](#tab/otlp-export) 

    ```csharp
    services.AddOpenTelemetry()
    .UseFunctionsWorkerDefaults()
    .UseOtlpExporter();
    ```
    ---

    To export to both OpenTelemetry endpoints, call both `UseAzureMonitor` and `UseOtlpExporter`. 
::: zone-end
 
## Considerations for using OpenTelemetry

When you export your data using OpenTelemetry, keep these current considerations in mind.

+ When the host is configured to use OTel, only logs and traces are exported. Host metrics are not exported, they will be included in a future update. 

+ Configuring the host to use OTel semantics is not supported when running your code locally using the Functions Core Tools. This will be supported in a future update. 

+ Currently, only HTTP trigger and Azure SDK-based triggers are supported. 

## Related content



