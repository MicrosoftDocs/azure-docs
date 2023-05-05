---
title: Azure Monitor OpenTelemetry configuration for .NET, Java, Node.js, and Python applications
description: This article provides configuration guidance for .NET, Java, Node.js, and Python applications.
ms.topic: conceptual
ms.date: 05/10/2023
ms.devlang: csharp, javascript, typescript, python
ms.reviewer: mmcc
---

# Azure Monitor OpenTelemetry configuration

This article covers configuration settings for the Azure Monitor OpenTelemetry distro.

> [!TIP]
> For Node.js, this config guidance applies to the 3.X BETA Package only. If you're using a previous version, see the [Node.js Application Insights SDK Docs](nodejs.md).

## Connection string

A connection string in Application Insights defines the target location for sending telemetry data, ensuring it reaches the appropriate resource for monitoring and analysis.

### [.NET](#tab/net)


### [Java](#tab/java)

For more information about Java, see the [Java supplemental documentation](java-standalone-config.md).

### [Node.js](#tab/nodejs)

Use one of the following two ways to configure the connection string:

- Set an environment variable:
        
   ```console
   APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>
   ```

- Use configuration object:

    ```javascript
    const { ApplicationInsightsClient, ApplicationInsightsConfig } = require("applicationinsights");
    const config = new ApplicationInsightsConfig();
    config.azureMonitorExporterConfig.connectionString = "<Your Connection String>";
    const appInsights = new ApplicationInsightsClient(config);

    ```

### [Python](#tab/python)

---

## Set the Cloud Role Name and the Cloud Role Instance

You might want to update the [Cloud Role Name](app-map.md#understand-the-cloud-role-name-within-the-context-of-an-application-map) and the Cloud Role Instance from the default values to something that makes sense to your team. They appear on the Application Map as the name underneath a node.

### [.NET](#tab/net)

Set the Cloud Role Name and the Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. Cloud Role Name uses `service.namespace` and `service.name` attributes, although it falls back to `service.name` if `service.namespace` isn't set. Cloud Role Instance uses the `service.instance.id` attribute value. For information on standard attributes for resources, see [Resource Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/README.md).

```csharp
// Setting role name and role instance
var resourceAttributes = new Dictionary<string, object> {
    { "service.name", "my-service" },
    { "service.namespace", "my-namespace" },
    { "service.instance.id", "my-instance" }};
var resourceBuilder = ResourceBuilder.CreateDefault().AddAttributes(resourceAttributes);
// Done setting role name and role instance

// Set ResourceBuilder on the provider.
var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .SetResourceBuilder(resourceBuilder)
    .AddSource("OTel.AzureMonitor.Demo")
    .AddAzureMonitorTraceExporter(o =>
    {
        o.ConnectionString = "<Your Connection String>";
    })
    .Build();
```

### [Java](#tab/java)

To set the cloud role name, see [cloud role name](java-standalone-config.md#cloud-role-name).

To set the cloud role instance, see [cloud role instance](java-standalone-config.md#cloud-role-instance).

### [Node.js](#tab/nodejs)

Set the Cloud Role Name and the Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. Cloud Role Name uses `service.namespace` and `service.name` attributes, although it falls back to `service.name` if `service.namespace` isn't set. Cloud Role Instance uses the `service.instance.id` attribute value. For information on standard attributes for resources, see [Resource Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/README.md).

```javascript
...
const { ApplicationInsightsClient, ApplicationInsightsConfig } = require("applicationinsights");
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
// ----------------------------------------
// Setting role name and role instance
// ----------------------------------------
const config = new ApplicationInsightsConfig();
config.resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "my-helloworld-service",
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: "my-namespace",
    [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: "my-instance",
});
const appInsights = new ApplicationInsightsClient(config);
```

### [Python](#tab/python)

Set the Cloud Role Name and the Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. Cloud Role Name uses `service.namespace` and `service.name` attributes, although it falls back to `service.name` if `service.namespace` isn't set. Cloud Role Instance uses the `service.instance.id` attribute value. For information on standard attributes for resources, see [Resource Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/README.md).

Set Resource attributes using the `OTEL_RESOURCE_ATTRIBUTES` and/or `OTEL_SERVICE_NAME` environment variables. `OTEL_RESOURCE_ATTRIBUTES` takes series of comma-separated key-value pairs. For example, to set the Cloud Role Name to "my-namespace" and set Cloud Role Instance to "my-instance", you can set `OTEL_RESOURCE_ATTRIBUTES` as such:
```
export OTEL_RESOURCE_ATTRIBUTES="service.namespace=my-namespace,service.instance.id=my-instance"
```

If you don't set Cloud Role Name via the "service.namespace" Resource Attribute, you can alternatively set the Cloud Role Name via the `OTEL_SERVICE_NAME` environment variable:
```
export OTEL_RESOURCE_ATTRIBUTES="service.instance.id=my-instance"
export OTEL_SERVICE_NAME="my-namespace"
```

---

## Enable Sampling

You may want to enable sampling to reduce your data ingestion volume, which reduces your cost. Azure Monitor provides a custom *fixed-rate* sampler that populates events with a "sampling ratio", which Application Insights converts to "ItemCount". The *fixed-rate* sampler ensures accurate experiences and event counts. The sampler is designed to preserve your traces across services, and it's interoperable with older Application Insights SDKs. For more information, see [Learn More about sampling](sampling.md#brief-summary).

> [!NOTE] 
> Metrics are unaffected by sampling.

#### [.NET](#tab/net)

The sampler expects a sample rate of between 0 and 1 inclusive. A rate of 0.1 means approximately 10% of your traces are sent.

In this example, we utilize the `ApplicationInsightsSampler`, which offers compatibility with Application Insights SDKs.

```dotnetcli
dotnet add package --prerelease OpenTelemetry.Extensions.AzureMonitor
```

```csharp
var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddSource("OTel.AzureMonitor.Demo")
    .SetSampler(new ApplicationInsightsSampler(0.1F))
    .AddAzureMonitorTraceExporter(o =>
    {
     o.ConnectionString = "<Your Connection String>";
    })
    .Build();
```

#### [Java](#tab/java)

Starting from 3.4.0, rate-limited sampling is available and is now the default. For more information about sampling, see [Java sampling]( java-standalone-config.md#sampling).

#### [Node.js](#tab/nodejs)

```javascript
const { ApplicationInsightsClient, ApplicationInsightsConfig } = require("applicationinsights");
const config = new ApplicationInsightsConfig();
config.samplingRatio = 0.75;
const appInsights = new ApplicationInsightsClient(config);
```

#### [Python](#tab/python)

The `configure_azure_monitor()` function automatically utilizes
ApplicationInsightsSampler for compatibility with Application Insights SDKs and
to sample your telemetry. The `OTEL_TRACES_SAMPLER_ARG` environment variable can be used to specify
the sampling rate, with a valid range of 0 to 1, where 0 is 0% and 1 is 100%.
For example, a value of 0.1 means 10% of your traces are sent.

```
export OTEL_TRACES_SAMPLER_ARG=0.1
```

---

> [!TIP]
> When using fixed-rate/percentage sampling and you aren't sure what to set the sampling rate as, start at 5% (i.e., 0.05 sampling ratio) and adjust the rate based on the accuracy of the operations shown in the failures and performance blades. A higher rate generally results in higher accuracy. However, ANY sampling will affect accuracy so we recommend alerting on [OpenTelemetry metrics](opentelemetry-enable.md#metrics), which are unaffected by sampling.

## Enable AAD Auth

You might want to enable Azure Active Directory (AAD) Authentication for a more secure connection to Azure, which prevents unauthorized telemetry from being ingested into your subscription.

#### [.NET](#tab/net)
    
```csharp
coming soon
```
    
#### [Java](#tab/java)

For more information about Java, see the [Java supplemental documentation](java-standalone-config.md).

#### [Node.js](#tab/nodejs)

```javascript
coming soon
```

#### [Python](#tab/python)
    
```python
coming soon
```

---


## Offline Storage and Automatic Retries

To improve reliability and resiliency, Azure Monitor OpenTelemetry-based offerings write to offline/local storage by default when an application loses its connection with Application Insights. It saves the application telemetry to disk and periodically tries to send it again for up to 48 hours. In high-load applications, telemetry is occasionally dropped for two reasons. First, when the allowable time is exceeded, and second, when the maximum file size is exceeded or the SDK doesn't have an opportunity to clear out the file. If we need to choose, the product saves more recent events over old ones. [Learn More](data-retention-privacy.md#does-the-sdk-create-temporary-local-storage)

### [.NET](#tab/net)

By default, the AzureMonitorExporter uses one of the following locations for offline storage (listed in order of precedence):

- Windows
  - %LOCALAPPDATA%\Microsoft\AzureMonitor
  - %TEMP%\Microsoft\AzureMonitor
- Non-Windows
  - %TMPDIR%/Microsoft/AzureMonitor
  - /var/tmp/Microsoft/AzureMonitor
  - /tmp/Microsoft/AzureMonitor

To override the default directory, you should set `AzureMonitorExporterOptions.StorageDirectory`.

For example:
```csharp
var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddAzureMonitorTraceExporter(o => {
        o.ConnectionString = "<Your Connection String>";
        o.StorageDirectory = "C:\\SomeDirectory";
    })
    .Build();
```

To disable this feature, you should set `AzureMonitorExporterOptions.DisableOfflineStorage = true`.

### [Java](#tab/java)

Configuring Offline Storage and Automatic Retries isn't available in Java.

For a full list of available configurations, see [Configuration options](./java-standalone-config.md).

### [Node.js](#tab/nodejs)

By default, the AzureMonitorExporter uses one of the following locations for offline storage.

- Windows
  - %TEMP%\Microsoft\AzureMonitor
- Non-Windows
  - %TMPDIR%/Microsoft/AzureMonitor
  - /var/tmp/Microsoft/AzureMonitor

To override the default directory, you should set `storageDirectory`.

For example:
```javascript
const { ApplicationInsightsClient, ApplicationInsightsConfig } = require("applicationinsights");
const config = new ApplicationInsightsConfig();
config.azureMonitorExporterConfig = {
    connectionString: "<Your Connection String>",
    storageDirectory: "C:\\SomeDirectory",
    disableOfflineStorage: false
};
const appInsights = new ApplicationInsightsClient(config);
```

To disable this feature, you should set `disableOfflineStorage = true`.

### [Python](#tab/python)

By default, Azure Monitor exporters use the following path:

`<tempfile.gettempdir()>/Microsoft/AzureMonitor/opentelemetry-python-<your-instrumentation-key>`

To override the default directory, you should set `storage_directory` to the directory you want.

For example:
```python
...
configure_azure_monitor(
    connection_string="your-connection-string",
    storage_directory="C:\\SomeDirectory",
)
...

```

To disable this feature, you should set `disable_offline_storage` to `True`. Defaults to `False`.

For example:
```python
...
configure_azure_monitor(
    connection_string="your-connection-string",
    disable_offline_storage=True,
)
...

```

---

## Enable the OTLP Exporter

You might want to enable the OpenTelemetry Protocol (OTLP) Exporter alongside your Azure Monitor Exporter to send your telemetry to two locations.

> [!NOTE]
> The OTLP Exporter is shown for convenience only. We don't officially support the OTLP Exporter or any components or third-party experiences downstream of it.

#### [.NET](#tab/net)

1. Install the [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://www.nuget.org/packages/OpenTelemetry.Exporter.OpenTelemetryProtocol/) package along with [Azure.Monitor.OpenTelemetry.Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) in your project.

1. Add the following code snippet. This example assumes you have an OpenTelemetry Collector with an OTLP receiver running. For details, see the [example on GitHub](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/examples/Console/TestOtlpExporter.cs).
    
    ```csharp
    // Sends data to Application Insights as well as OTLP
    using var tracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddSource("OTel.AzureMonitor.Demo")
            .AddAzureMonitorTraceExporter(o =>
            {
                o.ConnectionString = "<Your Connection String>"
            })
            .AddOtlpExporter()
            .Build();
    ```

#### [Java](#tab/java)

For more information about Java, see the [Java supplemental documentation](java-standalone-config.md).

#### [Node.js](#tab/nodejs)

1. Install the [OpenTelemetry Collector Exporter](https://www.npmjs.com/package/@opentelemetry/exporter-otlp-http) package in your project.

    ```sh
        npm install @opentelemetry/exporter-otlp-http
    ```

2. Add the following code snippet. This example assumes you have an OpenTelemetry Collector with an OTLP receiver running. For details, see the [example on GitHub](https://github.com/open-telemetry/opentelemetry-js/tree/main/examples/otlp-exporter-node).

    ```javascript
    const { ApplicationInsightsClient, ApplicationInsightsConfig } = require("applicationinsights");
    const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp-http');
    
    const appInsights = new ApplicationInsightsClient(new ApplicationInsightsConfig());
    const otlpExporter = new OTLPTraceExporter();
    appInsights.getTraceHandler().getTracerProvider().addSpanProcessor(new SimpleSpanProcessor(otlpExporter));
    ```

#### [Python](#tab/python)

1. Install the [opentelemetry-exporter-otlp](https://pypi.org/project/opentelemetry-exporter-otlp/) package.

1. Add the following code snippet. This example assumes you have an OpenTelemetry Collector with an OTLP receiver running. For details, see this [README](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/monitor/azure-monitor-opentelemetry-exporter/samples/traces#collector).
    
    ```python
    from azure.monitor.opentelemetry import configure_azure_monitor
    from opentelemetry import trace
    from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
    from opentelemetry.sdk.trace.export import BatchSpanProcessor

    configure_azure_monitor(
        connection_string="<your-connection-string>",
    )
    tracer = trace.get_tracer(__name__) 
    
    otlp_exporter = OTLPSpanExporter(endpoint="http://localhost:4317")
    span_processor = BatchSpanProcessor(otlp_exporter)
    trace.get_tracer_provider().add_span_processor(span_processor)
    
    with tracer.start_as_current_span("test"):
        print("Hello world!")
    ```

---

## OpenTelemetry configurations

The following OpenTelemetry configurations can be accessed through environment variables.

### [.NET](#tab/net)

Coming soon

### [Java](#tab/java)

For more information about Java, see the [Java supplemental documentation](java-standalone-config.md).

### [Node.js](#tab/nodejs)

For more information about OpenTelemetry SDK congiguration, see the [OpenTelemetry documentation](https://opentelemetry.io/docs/concepts/sdk-configuration). 

### [Python](#tab/python)

Coming soon

---
