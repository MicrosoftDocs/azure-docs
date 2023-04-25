---
title: Azure Monitor OpenTelemetry configuration for .NET, Java, Node.js, and Python applications
description: This article provides configuration guidance for .NET, Java, Node.js, and Python applications.
ms.topic: conceptual
ms.date: 05/10/2023
ms.devlang: csharp, javascript, typescript, python
ms.reviewer: mmcc
---

# Azure Monitor OpenTelemetry configuration

Application Insights OpenTelemetry configuration allows you to use OpenTelemetry to collect telemetry data from your application and send it to Application Insights for analysis and monitoring.

## Offline Storage and Automatic Retries

To improve reliability and resiliency, Azure Monitor OpenTelemetry-based offerings write to offline/local storage by default when an application loses its connection with Application Insights. It saves the application telemetry to disk and periodically tries to send it again for up to 48 hours. In addition to exceeding the allowable time, telemetry will occasionally be dropped in high-load applications when the maximum file size is exceeded or the SDK doesn't have an opportunity to clear out the file. If we need to choose, the product will save more recent events over old ones. [Learn More](data-retention-privacy.md#does-the-sdk-create-temporary-local-storage)

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

Configuring Offline Storage and Automatic Retries is not available in Java.

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
const exporter = new AzureMonitorTraceExporter({
    connectionString: "<Your Connection String>",
    storageDirectory: "C:\\SomeDirectory",
    disableOfflineStorage: false
});
```

To disable this feature, you should set `disableOfflineStorage = true`.

### [Python](#tab/python)

By default, the Azure Monitor exporters will use the following path:

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

## Enable Sampling

You may want to enable sampling to reduce your data ingestion volume, which reduces your cost. Azure Monitor provides a custom *fixed-rate* sampler that populates events with a "sampling ratio", which Application Insights converts to "ItemCount". The *fixed-rate* sampler ensures accurate experiences and event counts. The sampler is designed to preserve your traces across services, and it's interoperable with older Application Insights SDKs. For more information, see [Learn More about sampling](sampling.md#brief-summary).

> [!NOTE] 
> Metrics are unaffected by sampling.

#### [.NET](#tab/net)

The sampler expects a sample rate of between 0 and 1 inclusive. A rate of 0.1 means approximately 10% of your traces will be sent.

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

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

#### [Java](#tab/java)

Starting from 3.4.0, rate-limited sampling is available and is now the default. See [sampling]( java-standalone-config.md#sampling) for more information.

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

#### [Node.js](#tab/nodejs)

```javascript
const { BasicTracerProvider, SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { ApplicationInsightsSampler, AzureMonitorTraceExporter } = require("@azure/monitor-opentelemetry-exporter");

// Sampler expects a sample rate of between 0 and 1 inclusive
// A rate of 0.1 means approximately 10% of your traces are sent
const aiSampler = new ApplicationInsightsSampler(0.75);

const provider = new BasicTracerProvider({
  sampler: aiSampler
});

const exporter = new AzureMonitorTraceExporter({
  connectionString: "<Your Connection String>"
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
```

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

#### [Python](#tab/python)

The `configure_azure_monitor()` function will automatically utilize
ApplicationInsightsSampler for compatibility with Application Insights SDKs and
to sample your telemetry. The `sampling_ratio` parameter can be used to specify
the sampling rate, with a valid range of 0 to 1, where 0 is 0% and 1 is 100%.
For example, a value of 0.1 means 10% of your traces will be sent.

```python
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import trace

configure_azure_monitor(
    # connection_string="<your-connection-string>",
    # Sampling ratio of between 0 and 1 inclusive
    # 0.1 means approximately 10% of your traces are sent
    sampling_ratio=0.1,
)

tracer = trace.get_tracer(__name__)

for i in range(100):
    # Approximately 90% of these spans should be sampled out
    with tracer.start_as_current_span("hello"):
        print("Hello, World!")
```
<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->


---

> [!TIP]
> When using fixed-rate/percentage sampling and you aren't sure what to set the sampling rate as, start at 5% (i.e., 0.05 sampling ratio) and adjust the rate based on the accuracy of the operations shown in the failures and performance blades. A higher rate generally results in higher accuracy. However, ANY sampling will affect accuracy so we recommend alerting on [OpenTelemetry metrics](#metrics), which are unaffected by sampling.

## Instrumentation libraries

The following libraries are validated to work with the current release.

> [!WARNING]
> Instrumentation libraries are based on experimental OpenTelemetry specifications, which impacts languages in [preview status](#opentelemetry-release-status). Microsoft's *preview* support commitment is to ensure that the following libraries emit data to Azure Monitor Application Insights, but it's possible that breaking changes or experimental mapping will block some data elements.

### Distributed Tracing

#### [.NET](#tab/net)

Requests
- [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/Instrumentation.AspNet-1.0.0-rc9.6/src/OpenTelemetry.Instrumentation.AspNet/README.md) <sup>[1](#FOOTNOTEONE)</sup> version:
  [1.0.0-rc9.6](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNet/1.0.0-rc9.6)
- [ASP.NET
  Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.7/src/OpenTelemetry.Instrumentation.AspNetCore/README.md) <sup>[1](#FOOTNOTEONE)</sup> version:
  [1.0.0-rc9.7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNetCore/1.0.0-rc9.7)

Dependencies
- [HTTP
  clients](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.7/src/OpenTelemetry.Instrumentation.Http/README.md) <sup>[1](#FOOTNOTEONE)</sup> version:
  [1.0.0-rc9.7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http/1.0.0-rc9.7)
- [SQL
  client](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.7/src/OpenTelemetry.Instrumentation.SqlClient/README.md) <sup>[1](#FOOTNOTEONE)</sup> version:
  [1.0.0-rc9.7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient/1.0.0-rc9.7)

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

#### [Java](#tab/java)

Java 3.x includes the following auto-instrumentation.

Autocollected requests:

* JMS consumers
* Kafka consumers
* Netty
* Quartz
* Servlets
* Spring scheduling

  > [!NOTE]
  > Servlet and Netty auto-instrumentation covers the majority of Java HTTP services, including Java EE, Jakarta EE, Spring Boot, Quarkus, and Micronaut.

Autocollected dependencies (plus downstream distributed trace propagation):

* Apache HttpClient
* Apache HttpAsyncClient
* AsyncHttpClient
* Google HttpClient
* gRPC
* java.net.HttpURLConnection
* Java 11 HttpClient
* JAX-RS client
* Jetty HttpClient
* JMS
* Kafka
* Netty client
* OkHttp

Autocollected dependencies (without downstream distributed trace propagation):

* Cassandra
* JDBC
* MongoDB (async and sync)
* Redis (Lettuce and Jedis)

Telemetry emitted by these Azure SDKs is automatically collected by default:

* [Azure App Configuration](/java/api/overview/azure/data-appconfiguration-readme) 1.1.10+
* [Azure Cognitive Search](/java/api/overview/azure/search-documents-readme) 11.3.0+
* [Azure Communication Chat](/java/api/overview/azure/communication-chat-readme) 1.0.0+
* [Azure Communication Common](/java/api/overview/azure/communication-common-readme) 1.0.0+
* [Azure Communication Identity](/java/api/overview/azure/communication-identity-readme) 1.0.0+
* [Azure Communication Phone Numbers](/java/api/overview/azure/communication-phonenumbers-readme) 1.0.0+
* [Azure Communication SMS](/java/api/overview/azure/communication-sms-readme) 1.0.0+
* [Azure Cosmos DB](/java/api/overview/azure/cosmos-readme) 4.22.0+
* [Azure Digital Twins - Core](/java/api/overview/azure/digitaltwins-core-readme) 1.1.0+
* [Azure Event Grid](/java/api/overview/azure/messaging-eventgrid-readme) 4.0.0+
* [Azure Event Hubs](/java/api/overview/azure/messaging-eventhubs-readme) 5.6.0+
* [Azure Event Hubs - Azure Blob Storage Checkpoint Store](/java/api/overview/azure/messaging-eventhubs-checkpointstore-blob-readme) 1.5.1+
* [Azure Form Recognizer](/java/api/overview/azure/ai-formrecognizer-readme) 3.0.6+
* [Azure Identity](/java/api/overview/azure/identity-readme) 1.2.4+
* [Azure Key Vault - Certificates](/java/api/overview/azure/security-keyvault-certificates-readme) 4.1.6+
* [Azure Key Vault - Keys](/java/api/overview/azure/security-keyvault-keys-readme) 4.2.6+
* [Azure Key Vault - Secrets](/java/api/overview/azure/security-keyvault-secrets-readme) 4.2.6+
* [Azure Service Bus](/java/api/overview/azure/messaging-servicebus-readme) 7.1.0+
* [Azure Storage - Blobs](/java/api/overview/azure/storage-blob-readme) 12.11.0+
* [Azure Storage - Blobs Batch](/java/api/overview/azure/storage-blob-batch-readme) 12.9.0+
* [Azure Storage - Blobs Cryptography](/java/api/overview/azure/storage-blob-cryptography-readme) 12.11.0+
* [Azure Storage - Common](/java/api/overview/azure/storage-common-readme) 12.11.0+
* [Azure Storage - Files Data Lake](/java/api/overview/azure/storage-file-datalake-readme) 12.5.0+
* [Azure Storage - Files Shares](/java/api/overview/azure/storage-file-share-readme) 12.9.0+
* [Azure Storage - Queues](/java/api/overview/azure/storage-queue-readme) 12.9.0+
* [Azure Text Analytics](/java/api/overview/azure/ai-textanalytics-readme) 5.0.4+

[//]: # "Azure Cosmos DB 4.22.0+ due to https://github.com/Azure/azure-sdk-for-java/pull/25571"

[//]: # "the remaining above names and links scraped from https://azure.github.io/azure-sdk/releases/latest/java.html"
[//]: # "and version synched manually against the oldest version in maven central built on azure-core 1.14.0"
[//]: # ""
[//]: # "var table = document.querySelector('#tg-sb-content > div > table')"
[//]: # "var str = ''"
[//]: # "for (var i = 1, row; row = table.rows[i]; i++) {"
[//]: # "  var name = row.cells[0].getElementsByTagName('div')[0].textContent.trim()"
[//]: # "  var stableRow = row.cells[1]"
[//]: # "  var versionBadge = stableRow.querySelector('.badge')"
[//]: # "  if (!versionBadge) {"
[//]: # "    continue"
[//]: # "  }"
[//]: # "  var version = versionBadge.textContent.trim()"
[//]: # "  var link = stableRow.querySelectorAll('a')[2].href"
[//]: # "  str += '* [' + name + '](' + link + ') ' + version + '\n'"
[//]: # "}"
[//]: # "console.log(str)"

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

#### [Node.js](#tab/nodejs)

Requests/Dependencies
- [http/https](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http/README.md) version:
  [0.33.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-http/v/0.33.0)
  
Dependencies
- [mysql](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-mysql) version:
  [0.25.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-mysql/v/0.25.0)

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

#### [Python](#tab/python)

Requests
- [Django](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-django) <sup>[1](#FOOTNOTEONE)</sup> version:
  [0.36b0](https://pypi.org/project/opentelemetry-instrumentation-django/0.36b0/)
- [FastApi](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-fastapi) <sup>[1](#FOOTNOTEONE)</sup> version:
  [0.36b0](https://pypi.org/project/opentelemetry-instrumentation-fastapi/0.36b0/)
- [Flask](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-flask) <sup>[1](#FOOTNOTEONE)</sup> version:
  [0.36b0](https://pypi.org/project/opentelemetry-instrumentation-flask/0.36b0/)

Dependencies
- [Psycopg2](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-psycopg2) version:
  [0.36b0](https://pypi.org/project/opentelemetry-instrumentation-psycopg2/0.36b0/)
- [Requests](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-requests) <sup>[1](#FOOTNOTEONE)</sup> version:
  [0.36b0](https://pypi.org/project/opentelemetry-instrumentation-requests/0.36b0/)
- [Urllib](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-urllib) <sup>[1](#FOOTNOTEONE)</sup> version:
  [0.36b0](https://pypi.org/project/opentelemetry-instrumentation-urllib/0.36b0/)
- [Urllib3](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-urllib3) <sup>[1](#FOOTNOTEONE)</sup> version:
  [0.36b0](https://pypi.org/project/opentelemetry-instrumentation-urllib3/0.36b0/)

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

---

### Metrics

#### [.NET](#tab/net)

- [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/Instrumentation.AspNet-1.0.0-rc9.6/src/OpenTelemetry.Instrumentation.AspNet/README.md) version:
  [1.0.0-rc9.6](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNet/1.0.0-rc9.6)
- [ASP.NET
  Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.7/src/OpenTelemetry.Instrumentation.AspNetCore/README.md) version:
  [1.0.0-rc9.7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNetCore/1.0.0-rc9.7)
- [HTTP
  clients](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.7/src/OpenTelemetry.Instrumentation.Http/README.md) version:
  [1.0.0-rc9.7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http/1.0.0-rc9.7)
- [Runtime](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/Instrumentation.Runtime-1.0.0/src/OpenTelemetry.Instrumentation.Runtime/README.md) version: [1.0.0](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Runtime/1.0.0)

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

#### [Java](#tab/java)

Autocollected metrics

* Micrometer Metrics, including Spring Boot Actuator metrics
* JMX Metrics

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

#### [Node.js](#tab/nodejs)

- [http/https](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http/README.md) version:
  [0.33.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-http/v/0.33.0)

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

#### [Python](#tab/python)

Autocollected metrics

- [Django](https://pypi.org/project/Django/)
- [FastApi](https://pypi.org/project/requests/)
- [Flask](https://pypi.org/project/Flask/)
- [Requests](https://pypi.org/project/requests/)
- [Urllib](https://docs.python.org/3/library/urllib.html)
- [Urllib3](https://pypi.org/project/urllib3/)

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

---

> [!TIP]
> The OpenTelemetry-based offerings currently emit all metrics as [Custom Metrics](#add-custom-metrics) and [Performance Counters](standard-metrics.md#performance-counters) in Metrics Explorer. For .NET, Node.js, and Python, whatever you set as the meter name becomes the metrics namespace.

### Logs

#### [.NET](#tab/net)

Coming soon.

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

#### [Java](#tab/java)

Autocollected logs

* Logback (including MDC properties) [1](#FOOTNOTEONE)</sup> <sup>[2](#FOOTNOTETWO)</sup>
* Log4j (including MDC/Thread Context properties) [1](#FOOTNOTEONE)</sup> <sup>[2](#FOOTNOTETWO)</sup>
* JBoss Logging (including MDC properties) [1](#FOOTNOTEONE)</sup> <sup>[2](#FOOTNOTETWO)</sup>
* java.util.logging [1](#FOOTNOTEONE)</sup> <sup>[2](#FOOTNOTETWO)</sup>

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

#### [Node.js](#tab/nodejs)

Coming soon.

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

#### [Python](#tab/python)

Autocollected logs

* [Python logging library](https://docs.python.org/3/howto/logging.html) <sup>[3](#FOOTNOTETHREE)</sup>

See [this](https://github.com/microsoft/ApplicationInsights-Python/tree/main/azure-monitor-opentelemetry/samples/logging) for examples of using the Python logging library.

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

---

**Footnotes**
- <a name="FOOTNOTEONE">1</a>: Supports automatic reporting of unhandled exceptions
- <a name="FOOTNOTETWO">2</a>: By default, logging is only collected when that logging is performed at the INFO level or higher. To change this level, see the [configuration options](./java-standalone-config.md#auto-collected-logging).
- <a name="FOOTNOTETHREE">3</a>: By default, logging is only collected when that logging is performed at the WARNING level or higher. To change this level, see the [configuration options](https://github.com/microsoft/ApplicationInsights-Python/tree/main/azure-monitor-opentelemetry#usage) and specify `logging_level`.


## Set the Cloud Role Name and the Cloud Role Instance

You might want to update the [Cloud Role Name](app-map.md#understand-the-cloud-role-name-within-the-context-of-an-application-map) and the Cloud Role Instance from the default values to something that makes sense to your team. They'll appear on the Application Map as the name underneath a node.

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

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

### [Java](#tab/java)

To set the cloud role name, see [cloud role name](java-standalone-config.md#cloud-role-name).

To set the cloud role instance, see [cloud role instance](java-standalone-config.md#cloud-role-instance).

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

### [Node.js](#tab/nodejs)

Set the Cloud Role Name and the Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. Cloud Role Name uses `service.namespace` and `service.name` attributes, although it falls back to `service.name` if `service.namespace` isn't set. Cloud Role Instance uses the `service.instance.id` attribute value. For information on standard attributes for resources, see [Resource Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/README.md).

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

```javascript
...
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { MeterProvider } = require("@opentelemetry/sdk-metrics")

// ----------------------------------------
// Setting role name and role instance
// ----------------------------------------
const testResource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "my-helloworld-service",
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: "my-namespace",
    [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: "my-instance",
});

// ----------------------------------------
// Done setting role name and role instance
// ----------------------------------------
const tracerProvider = new NodeTracerProvider({
	resource: testResource
});

const meterProvider = new MeterProvider({
	resource: testResource
});
```

<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

### [Python](#tab/python)

Set the Cloud Role Name and the Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. Cloud Role Name uses `service.namespace` and `service.name` attributes, although it falls back to `service.name` if `service.namespace` isn't set. Cloud Role Instance uses the `service.instance.id` attribute value. For information on standard attributes for resources, see [Resource Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/README.md).

```python
...
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry.sdk.resources import Resource, ResourceAttributes

configure_azure_monitor(
    connection_string="<your-connection-string>",
    resource=Resource.create(
        {
            ResourceAttributes.SERVICE_NAME: "my-helloworld-service",
# ----------------------------------------
# Setting role name and role instance
# ----------------------------------------
            ResourceAttributes.SERVICE_NAMESPACE: "my-namespace",
            ResourceAttributes.SERVICE_INSTANCE_ID: "my-instance",
# ----------------------------------------------
# Done setting role name and role instance
# ----------------------------------------------
        }
    )
)
...
```
<!--TODO: ADD DISTRO INFO. PLEASE REMOVE THIS LINE WHEN THIS SECTION IS UPDATED. -->

---