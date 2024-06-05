---
title: Use OpenTelemetry with Azure Functions
description: This article shows you how to enable export of application logs and traces from your function app using OpenTelemetry.
ms.service: azure-functions
ms.topic: how-to 
ms.date: 05/16/2024
zone_pivot_groups: programming-languages-set-functions

#CustomerIntent: As a developer, I want to learn how to enable the export of logs and metrics from my function apps by using OpenTelemetry so I can consume and analyze my application telemetry data either in Application Insights or to any OTLP-compliant tools.
---

# Use OpenTelemetry with Azure Functions

[!INCLUDE [functions-opentelemetry-preview-note](../../includes/functions-opentelemetry-preview-note.md)]

This article shows you how to configure your function app to export log and trace data in an OpenTelemetry format. Azure Functions generates telemetry data on your function executions from both the Functions host process and the language-specific worker process in which your function code runs. By default, this telemetry data is sent to Application Insights using the Application Insights SDK. However, you can choose to export this data using OpenTelemetry semantics. While you can still use an OpenTelemetry format to send your data to Application Insights, you can now also export the same data to any other OpenTelemetry-compliant endpoint.  

> [!TIP]  
> Because this article is targeted at your development language of choice, remember to choose the correct language at the top of the article.
::: zone pivot="programming-language-java" 
> Currently, there's no client optimized OpenTelemetry support for Java apps.
:::zone-end
::: zone pivot="programming-language-csharp" 
> OpenTelemetry currently isn't supported for C# in-process apps.
:::zone-end

 You can obtain these benefits by enabling OpenTelemetry in your function app: 

+ Correlation across traces and logs being generated both at the host and in your application code.
+ Consistent, standards-based generation of exportable telemetry data. 
+ Integrates with other providers that can consume OpenTeleletry-compliant data. 

OpenTelemetry is enabled at the function app level, both in host configuration (`host.json`) and in your code project. Functions also provides a client optimized experience for exporting OpenTelemetry data from your function code that's running in a language-specific worker process.

## 1. Enable OpenTelemetry in the Functions host

When you enable OpenTelemetry output in the function app's host.json file, your host exports OpenTelemetry output regardless of the language stack used by your app.   

To enable OpenTelemetry output from the Functions host, update the [host.json file](./functions-host-json.md) in your code project to add a `"telemetryMode": "openTelemetry"` element to the root collection. With OpenTelemetry enabled, your host.json file might look like this:

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

When OpenTelemetry is enabled in the host.json file, the endpoints to which data is sent is determined based on which OpenTelemetry-supported application settings are available in your app's environment variables. 

Create specific application settings in your function app based on the OpenTelemetry output destination. When connection settings are provided for both Application Insights and an OpenTelemetry protocol (OTLP) exporter, OpenTelemetry data is sent to both endpoints.    

### [Application Insights](#tab/app-insights)

**`APPLICATIONINSIGHTS_CONNECTION_STRING`**: the connection string for an Application Insights workspace. When this setting exists, OpenTelemetry data is sent to that workspace. This setting is the same one used to connect to Application Insights without OpenTelemetry enabled. If your app doesn't already have this setting, you might need to [Enable Application Insights integration](configure-monitoring.md#enable-application-insights-integration). 

### [OTLP Exporter](#tab/otlp-export) 
 
**`OTEL_EXPORTER_OTLP_ENDPOINT`**: an OTLP exporter endpoint URL. 

**`OTEL_EXPORTER_OTLP_HEADERS`**: (Optional) list of headers to apply to all outgoing data. This is used by many endpoints to pass an API key.

If your endpoint requires you to set other environment variables, you need to also add them to your application settings. For more information, see the [OTLP Exporter Configuration documentation](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/). 

You should remove the `APPLICATIONINSIGHTS_CONNECTION_STRING` setting, unless you also want OpenTelemetry output from the host sent to Application Insights. 

---  

## 3. Enable OpenTelemetry in your app

With the Functions host configured to use OpenTelemetry, you should also update your application code to output OpenTelemetry data. Enabling OpenTelemetry in both the host and your application code enables better correlation between traces and logs emitted both by the Functions host process and from your language worker process. 

The way that you instrument your application to use OpenTelemetry depends on your target OpenTelemetry endpoint:
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
::: zone pivot="programming-language-java"
Java worker optimizations aren't yet available for OpenTelemetry, so there's nothing to configure in your Java code.
::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-typescript"
1. Install these npm packages in your project:
    
    ### [Application Insights](#tab/app-insights)
    
    ```bash
    npm install @opentelemetry/api 
    npm install @opentelemetry/auto-instrumentations-node 
    npm install @azure/monitor-opentelemetry-exporter 
    ```
    ### [OTLP Exporter](#tab/otlp-export) 

    ```bash
    npm install @opentelemetry/api 
    npm install @opentelemetry/auto-instrumentations-node 
    npm install @opentelemetry/exporter-logs-otlp-http 
    ```
    ---

::: zone-end 
::: zone pivot="programming-language-javascript"
1. Create a code file in your project, copy and paste the following code in this new file, and save the file as `src/index.js`:

    ### [Application Insights](#tab/app-insights)

    :::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/otelAppInsights.js":::

    ### [OTLP Exporter](#tab/otlp-export) 

    :::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/otelOtlp.js":::

    ---

1. Update the `main` field in your package.json file to include this new `src/index.js` file, which might look like this: 

    ```json
    "main": "src/{index.js,functions/*.js}"
    ```
::: zone-end     
::: zone pivot="programming-language-typescript"
1. Create a code file in your project, copy and paste the following code in this new file, and save the file as `src/index.ts`:

    ### [Application Insights](#tab/app-insights)

    :::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/otelAppInsights.ts":::

    ### [OTLP Exporter](#tab/otlp-export) 

    :::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/otelOtlp.ts":::

    ---

1. Update the `main` field in your package.json file to include the output of this new `src/index.ts` file, which might look like this: 

    ```json
    "main": "dist/src/{index.js,functions/*.js}"
    ```
::: zone-end 
::: zone pivot="programming-language-powershell"
> [!IMPORTANT]
> OpenTelemetry output to Application Insights from the language worker isn't currently supported for PowerShell apps. You might instead want to use an OTLP exporter endpoint. When your host is configured for OpenTelemetry output to Application Insights, the logs generated by the PowerShell worker process are still be forwarded, but distributed tracing isn't supported at this time.  

These instructions only apply for an OTLP exporter:

1. Add an application setting named `OTEL_FUNCTIONS_WORKER_ENABLED` with value of `True`.

1. Create an [app-level `Modules` folder](functions-reference-powershell.md#function-app-level-modules-folder) in the root of your app and run the following command:

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
1. Add this entry in your `requirements.txt` file:

    ### [Application Insights](#tab/app-insights)

    ```text
    azure.monitor.opentelemetry
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

    ```python
    from azure.monitor.opentelemetry import configure_azure_monitor 
    configure_azure_monitor() 
    ```
    ### [OTLP Exporter](#tab/otlp-export) 

    Traces, metrics, and logs being exported using OpenTelemetry must be configured manually. For more information, see [Instrumentation](https://opentelemetry.io/docs/languages/python/instrumentation/) for Python.

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

::: zone-end  
## Considerations for OpenTelemetry

When you export your data using OpenTelemetry, keep these current considerations in mind.

+ When the host is configured to use OpenTelemetry, only logs and traces are exported. Host metrics aren't currently exported. 

+ You can't currently run your app project locally using Core Tools when you have OpenTelemetry enabled in the host. You currently need to deploy your code to Azure to validate your OpenTelemetry-related updates. 

+ At this time, only HTTP trigger and Azure SDK-based triggers are supported with OpenTelemetry outputs. 

## Related content

[Monitor Azure Functions](monitor-functions.md)
[Flex Consumption plan](./flex-consumption-plan.md)

