---
title: Enable Azure Monitor OpenTelemetry for .NET, Java, Node.js, and Python applications
description: This article provides guidance on how to enable Azure Monitor on applications by using OpenTelemetry.
ms.topic: conceptual
ms.date: 02/22/2023
ms.devlang: csharp, javascript, typescript, python
ms.reviewer: mmcc
---

# Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python and Java applications

This article describes how to enable and configure OpenTelemetry-based data collection to power the experiences within [Azure Monitor Application Insights](app-insights-overview.md#application-insights-overview). To learn more about OpenTelemetry concepts, see the [OpenTelemetry overview](opentelemetry-overview.md) or [OpenTelemetry FAQ](/azure/azure-monitor/faq#opentelemetry).

## OpenTelemetry Release Status

OpenTelemetry offerings are available for .NET, Node.js, Python and Java applications.

|Language |Release Status                          |
|---------|----------------------------------------|
|Java     | :white_check_mark: <sup>[1](#GA)</sup> |
|.NET     | :warning: <sup>[2](#PREVIEW)</sup>     |
|Node.js  | :warning: <sup>[2](#PREVIEW)</sup>     |
|Python   | :warning: <sup>[2](#PREVIEW)</sup>     |

**Footnotes**
- <a name="GA"> :white_check_mark: 1</a>: OpenTelemetry is available to all customers with formal support.
- <a name="PREVIEW"> :warning: 2</a>: OpenTelemetry is available as a public preview. [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

> [!NOTE] 
> For a feature-by-feature release status, see the [FAQ](../faq.yml#what-s-the-current-release-state-of-features-within-each-opentelemetry-offering-).

## Get started

Follow the steps in this section to instrument your application with OpenTelemetry.

### Prerequisites

- An Azure subscription: [Create an Azure subscription for free](https://azure.microsoft.com/free/)
- An Application Insights resource: [Create an Application Insights resource](create-workspace-resource.md#create-a-workspace-based-resource)

<!---NOTE TO CONTRIBUTORS: PLEASE DO NOT SEPARATE OUT JAVASCRIPT AND TYPESCRIPT INTO DIFFERENT TABS.--->

### [.NET](#tab/net)

- Application using an officially supported version of [.NET Core](https://dotnet.microsoft.com/download/dotnet) or [.NET Framework](https://dotnet.microsoft.com/download/dotnet-framework) that's at least .NET Framework 4.6.2

### [Java](#tab/java)

- A Java application using Java 8+

### [Node.js](#tab/nodejs)

- Application using an officially [supported version](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter#currently-supported-environments) of Node.js runtime:
  - [OpenTelemetry supported runtimes](https://github.com/open-telemetry/opentelemetry-js#supported-runtimes)
  - [Azure Monitor OpenTelemetry Exporter supported runtimes](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter#currently-supported-environments)

### [Python](#tab/python)

- Python Application using Python 3.7+

---

### Install the client libraries

#### [.NET](#tab/net)

Install the latest [Azure.Monitor.OpenTelemetry.Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) NuGet package:

```dotnetcli
dotnet add package --prerelease Azure.Monitor.OpenTelemetry.Exporter 
```

If you get an error like "There are no versions available for the package Azure.Monitor.OpenTelemetry.Exporter," it's probably because the setting of NuGet package sources is missing. Try to specify the source with the `-s` option:

```dotnetcli
# Install the latest package with the NuGet package source specified.
dotnet add package --prerelease Azure.Monitor.OpenTelemetry.Exporter -s https://api.nuget.org/v3/index.json
```

#### [Java](#tab/java)

Download the [applicationinsights-agent-3.4.10.jar](https://github.com/microsoft/ApplicationInsights-Java/releases/download/3.4.10/applicationinsights-agent-3.4.10.jar) file.

> [!WARNING]
>
> If you are upgrading from an earlier 3.x version, you may be impacted by changing defaults or slight differences in the data we collect. See the migration notes at the top of the release notes for
> [3.4.0](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.4.0),
> [3.3.0](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.3.0),
> [3.2.0](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.2.0), and
> [3.1.0](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.1.0)
> for more details.

#### [Node.js](#tab/nodejs)

Install these packages:

- [@opentelemetry/sdk-trace-base](https://www.npmjs.com/package/@opentelemetry/sdk-trace-base)
- [@opentelemetry/sdk-trace-node](https://www.npmjs.com/package/@opentelemetry/sdk-trace-node)
- [@azure/monitor-opentelemetry-exporter](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter)
- [@opentelemetry/api](https://www.npmjs.com/package/@opentelemetry/api)

```sh
npm install @opentelemetry/sdk-trace-base
npm install @opentelemetry/sdk-trace-node
npm install @azure/monitor-opentelemetry-exporter
npm install @opentelemetry/api
```

The following packages are also used for some specific scenarios described later in this article:

- [@opentelemetry/sdk-metrics](https://www.npmjs.com/package/@opentelemetry/sdk-metrics)
- [@opentelemetry/resources](https://www.npmjs.com/package/@opentelemetry/resources)
- [@opentelemetry/semantic-conventions](https://www.npmjs.com/package/@opentelemetry/semantic-conventions)
- [@opentelemetry/instrumentation-http](https://www.npmjs.com/package/@opentelemetry/instrumentation-http)

```sh
npm install @opentelemetry/sdk-metrics
npm install @opentelemetry/resources
npm install @opentelemetry/semantic-conventions
npm install @opentelemetry/instrumentation-http
```

#### [Python](#tab/python)

Install the latest [azure-monitor-opentelemetry](https://pypi.org/project/azure-monitor-opentelemetry/) PyPI package:

```sh
pip install azure-monitor-opentelemetry --pre
```

---

### Enable Azure Monitor Application Insights

This section provides guidance that shows how to enable OpenTelemetry.

#### Instrument with OpenTelemetry


##### [.NET](#tab/net)

The following code demonstrates how to enable OpenTelemetry in a C# console application by setting up OpenTelemetry TracerProvider. This code must be in the application startup. For ASP.NET Core, it's done typically in the `ConfigureServices` method of the application `Startup` class. For ASP.NET applications, it's done typically in `Global.asax.cs`.

```csharp
using System.Diagnostics;
using Azure.Monitor.OpenTelemetry.Exporter;
using OpenTelemetry;
using OpenTelemetry.Trace;

public class Program
{
    private static readonly ActivitySource MyActivitySource = new ActivitySource(
        "OTel.AzureMonitor.Demo");

    public static void Main()
    {
        using var tracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddSource("OTel.AzureMonitor.Demo")
            .AddAzureMonitorTraceExporter(o =>
            {
                o.ConnectionString = "<Your Connection String>";
            })
            .Build();

        using (var activity = MyActivitySource.StartActivity("TestActivity"))
        {
            activity?.SetTag("CustomTag1", "Value1");
            activity?.SetTag("CustomTag2", "Value2");
        }

        System.Console.WriteLine("Press Enter key to exit.");
        System.Console.ReadLine();
    }
}
```

> [!NOTE]
> The `Activity` and `ActivitySource` classes from the `System.Diagnostics` namespace represent the OpenTelemetry concepts of `Span` and `Tracer`, respectively. You create `ActivitySource` directly by using its constructor instead of by using `TracerProvider`. Each [`ActivitySource`](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/docs/trace/customizing-the-sdk#activity-source) class must be explicitly connected to `TracerProvider` by using `AddSource()`. That's because parts of the OpenTelemetry tracing API are incorporated directly into the .NET runtime. To learn more, see [Introduction to OpenTelemetry .NET Tracing API](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Api/README.md#introduction-to-opentelemetry-net-tracing-api).

##### [Java](#tab/java)

Java auto-instrumentation is enabled through configuration changes; no code changes are required.

Point the JVM to the jar file by adding `-javaagent:"path/to/applicationinsights-agent-3.4.10.jar"` to your application's JVM args.

> [!TIP]
> For help with configuring your application's JVM args, see [Tips for updating your JVM args](./java-standalone-arguments.md).
    
If you develop a Spring Boot application, you can optionally replace the JVM argument by a programmatic configuration. For more information, see [Using Azure Monitor Application Insights with Spring Boot](./java-spring-boot.md).

##### [Node.js](#tab/nodejs)

The following code demonstrates how to enable OpenTelemetry in a simple JavaScript application:

```javascript
const { AzureMonitorTraceExporter } = require("@azure/monitor-opentelemetry-exporter");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { context, trace } = require("@opentelemetry/api")

const provider = new NodeTracerProvider();
provider.register();

// Create an exporter instance.
const exporter = new AzureMonitorTraceExporter({
  connectionString: "<Your Connection String>"
});

// Add the exporter to the provider.
provider.addSpanProcessor(
  new BatchSpanProcessor(exporter)
);

// Create a tracer.
const tracer = trace.getTracer("example-basic-tracer-node");

// Create a span. A span must be closed.
const parentSpan = tracer.startSpan("main");

for (let i = 0; i < 10; i += 1) {
   doWork(parentSpan);
}
// Be sure to end the span.
parentSpan.end();

function doWork(parent) {
  // Start another span. In this example, the main method already started a
  // span, so that will be the parent span, and this will be a child span.
  const ctx = trace.setSpan(context.active(), parent);

  // Set attributes to the span.
  // Check the SpanOptions interface for more options that can be set into the span creation
  const spanOptions = {
      attributes: {
        "key": "value"
      }
  };

  const span = tracer.startSpan("doWork", spanOptions, ctx);

  // Simulate some random work.
  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // empty
  }

  // Annotate our span to capture metadata about our operation.
  span.addEvent("invoking doWork");

  // Mark the end of span execution.
  span.end();
}

```

##### [Python](#tab/python)

The following code demonstrates how to enable OpenTelemetry in a simple Python application:

```python
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import trace

configure_azure_monitor(
    connection_string="<Your Connection String>",
)

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("hello"):
    print("Hello, World!")

input()

```

---

> [!TIP]
> For .NET, Node.js, and Python, you'll need to manually add [instrumentation libraries](#instrumentation-libraries) to autocollect telemetry across popular frameworks and libraries. For Java, these instrumentation libraries are already included and no additional steps are required.

#### Set the Application Insights connection string

You can find your connection string in the Overview Pane of your Application Insights Resource.

:::image type="content" source="media/opentelemetry/connection-string.png" alt-text="Screenshot of the Application Insights connection string.":::

Here's how you set the connection string.

#### [.NET](#tab/net)

Replace the `<Your Connection String>` in the preceding code with the connection string from *your* Application Insights resource.

#### [Java](#tab/java)

Use one of the following two ways to point the jar file to your Application Insights resource:

- Set an environment variable:
        
   ```console
   APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>
   ```
    
- Create a configuration file named `applicationinsights.json`, and place it in the same directory as `applicationinsights-agent-3.4.10.jar` with the following content:
    
   ```json
   {
     "connectionString": "<Your Connection String>"
   }
   ```

#### [Node.js](#tab/nodejs)

Replace the `<Your Connection String>` in the preceding code with the connection string from *your* Application Insights resource.

#### [Python](#tab/python)

Replace the `<Your Connection String>` in the preceding code with the connection string from *your* Application Insights resource.

---

#### Confirm data is flowing

Run your application and open your **Application Insights Resource** tab in the Azure portal. It might take a few minutes for data to show up in the portal.

> [!NOTE]
> If you can't run the application or you aren't getting data as expected, see [Troubleshooting](#troubleshooting).

:::image type="content" source="media/opentelemetry/server-requests.png" alt-text="Screenshot of the Application Insights Overview tab with server requests and server response time highlighted.":::

> [!IMPORTANT]
> If you have two or more services that emit telemetry to the same Application Insights resource, you're required to [set Cloud Role Names](#set-the-cloud-role-name-and-the-cloud-role-instance) to represent them properly on the Application Map.

As part of using Application Insights instrumentation, we collect and send diagnostic data to Microsoft. This data helps us run and improve Application Insights. To learn more, see [Statsbeat in Azure Application Insights](./statsbeat.md).

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

### [Java](#tab/java)

To set the cloud role name, see [cloud role name](java-standalone-config.md#cloud-role-name).

To set the cloud role instance, see [cloud role instance](java-standalone-config.md#cloud-role-instance).

### [Node.js](#tab/nodejs)

Set the Cloud Role Name and the Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. Cloud Role Name uses `service.namespace` and `service.name` attributes, although it falls back to `service.name` if `service.namespace` isn't set. Cloud Role Instance uses the `service.instance.id` attribute value. For information on standard attributes for resources, see [Resource Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/README.md).

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

#### [Java](#tab/java)

Starting from 3.4.0, rate-limited sampling is available and is now the default. See [sampling]( java-standalone-config.md#sampling) for more information.

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

#### [Node.js](#tab/nodejs)

Requests/Dependencies
- [http/https](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http/README.md) version:
  [0.33.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-http/v/0.33.0)
  
Dependencies
- [mysql](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-mysql) version:
  [0.25.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-mysql/v/0.25.0)

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

#### [Java](#tab/java)

Autocollected metrics

* Micrometer Metrics, including Spring Boot Actuator metrics
* JMX Metrics

#### [Node.js](#tab/nodejs)

- [http/https](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http/README.md) version:
  [0.33.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-http/v/0.33.0)

#### [Python](#tab/python)

Autocollected metrics

- [Django](https://pypi.org/project/Django/)
- [FastApi](https://pypi.org/project/requests/)
- [Flask](https://pypi.org/project/Flask/)
- [Requests](https://pypi.org/project/requests/)
- [Urllib](https://docs.python.org/3/library/urllib.html)
- [Urllib3](https://pypi.org/project/urllib3/)

---

> [!TIP]
> The OpenTelemetry-based offerings currently emit all metrics as [Custom Metrics](#add-custom-metrics) and [Performance Counters](standard-metrics.md#performance-counters) in Metrics Explorer. For .NET, Node.js, and Python, whatever you set as the meter name becomes the metrics namespace.

### Logs

#### [.NET](#tab/net)

Coming soon.

#### [Java](#tab/java)

Autocollected logs

* Logback <sup>[1](#FOOTNOTEONE)</sup> <sup>[2](#FOOTNOTETWO)</sup> (including MDC properties)
* Log4j <sup>[1](#FOOTNOTEONE)</sup> <sup>[2](#FOOTNOTETWO)</sup> (including MDC/Thread Context properties)
* JBoss Logging <sup>[1](#FOOTNOTEONE)</sup> <sup>[2](#FOOTNOTETWO)</sup> (including MDC properties)
* java.util.logging <sup>[1](#FOOTNOTEONE)</sup> <sup>[2](#FOOTNOTETWO)</sup>

#### [Node.js](#tab/nodejs)

Coming soon.

#### [Python](#tab/python)

Autocollected logs

* [Python logging library](https://docs.python.org/3/howto/logging.html) <sup>[3](#FOOTNOTETHREE)</sup>

See [this](https://github.com/microsoft/ApplicationInsights-Python/tree/main/azure-monitor-opentelemetry/samples/logging) for examples of using the Python logging library.

---

**Footnotes**
- <a name="FOOTNOTEONE">1</a>: Supports automatic reporting of unhandled exceptions
- <a name="FOOTNOTETWO">2</a>: By default, logging is only collected when that logging is performed at the INFO level or higher. To change this level, see the [configuration options](./java-standalone-config.md#auto-collected-logging).
- <a name="FOOTNOTETHREE">3</a>: By default, logging is only collected when that logging is performed at the WARNING level or higher. To change this level, see the [configuration options](https://github.com/microsoft/ApplicationInsights-Python/tree/main/azure-monitor-opentelemetry#usage) and specify `logging_level`.

## Collect custom telemetry

This section explains how to collect custom telemetry from your application.
  
Depending on your language and signal type, there are different ways to collect custom telemetry, including:
  
-	OpenTelemetry API
-	Language-specific logging/metrics libraries
-	Application Insights Classic API
 
The following table represents the currently supported custom telemetry types:

|    Custom Telemetry Types                 | Custom Events | Custom Metrics | Dependencies | Exceptions | Page Views | Requests | Traces |
|-------------------------------------------|---------------|----------------|--------------|------------|------------|----------|--------|
| **.NET**                                  |               |                |              |            |            |          |        |
| &nbsp;&nbsp;&nbsp;OpenTelemetry API       |               |                | Yes          | Yes        |            | Yes      |        |
| &nbsp;&nbsp;&nbsp;iLogger API             |               |                |              |            |            |          | Yes    |
| &nbsp;&nbsp;&nbsp;AI Classic API          |               |                |              |            |            |          |        |
|                                           |               |                |              |            |            |          |        |
| **Java**                                  |               |                |              |            |            |          |        |
| &nbsp;&nbsp;&nbsp;OpenTelemetry API       |               | Yes            | Yes          | Yes        |            | Yes      |        |
| &nbsp;&nbsp;&nbsp;Logback, Log4j, JUL     |               |                |              | Yes        |            |          | Yes    |
| &nbsp;&nbsp;&nbsp;Micrometer Metrics      |               | Yes            |              |            |            |          |        |
| &nbsp;&nbsp;&nbsp;AI Classic API          |  Yes          | Yes            | Yes          | Yes        | Yes        | Yes      | Yes    |
|                                           |               |                |              |            |            |          |        |
| **Node.js**                               |               |                |              |            |            |          |        |
| &nbsp;&nbsp;&nbsp;OpenTelemetry API       |               | Yes            | Yes          | Yes        |            | Yes      |        |
| &nbsp;&nbsp;&nbsp;Winston, Pino, Bunyan   |               |                |              |            |            |          | Yes    |
| &nbsp;&nbsp;&nbsp;AI Classic API          | Yes           | Yes            | Yes          | Yes        | Yes        | Yes      | Yes    |
|                                           |               |                |              |            |            |          |        |
| **Python**                                |               |                |              |            |            |          |        |
| &nbsp;&nbsp;&nbsp;OpenTelemetry API       |               | Yes            | Yes          | Yes        |            | Yes      |        |
| &nbsp;&nbsp;&nbsp;Python Logging Module   |               |                |              |            |            |          | Yes    |

> [!NOTE]
> Application Insights Java 3.x listens for telemetry that's sent to the Application Insights Classic API. Similarly, Application Insights Node.js 3.x collects events created with the Application Insights Classic API. This makes upgrading easier and fills a gap in our custom telemetry support until all custom telemetry types are supported via the OpenTelemetry API.

### Add Custom Metrics

> [!NOTE]
> Custom Metrics are under preview in Azure Monitor Application Insights. Custom metrics without dimensions are available by default. To view and alert on dimensions, you need to [opt-in](pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation).

You may want to collect metrics beyond what is collected by [instrumentation libraries](#instrumentation-libraries).

The OpenTelemetry API offers six metric "instruments" to cover various metric scenarios and you'll need to pick the correct "Aggregation Type" when visualizing metrics in Metrics Explorer. This requirement is true when using the OpenTelemetry Metric API to send metrics and when using an instrumentation library.

The following table shows the recommended [aggregation types](../essentials/metrics-aggregation-explained.md#aggregation-types) for each of the OpenTelemetry Metric Instruments.

| OpenTelemetry Instrument                             | Azure Monitor Aggregation Type                             |
|------------------------------------------------------|------------------------------------------------------------|
| Counter                                              | Sum                                                        |
| Asynchronous Counter                                 | Sum                                                        |
| Histogram                                            | Min, Max, Average, Sum and Count                           |
| Asynchronous Gauge                                   | Average                                                    |
| UpDownCounter                                        | Sum                                                        |
| Asynchronous UpDownCounter                           | Sum                                                        |

> [!CAUTION]
> Aggregation types beyond what's shown in the table typically aren't meaningful.

The [OpenTelemetry Specification](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/api.md#instrument)
describes the instruments and provides examples of when you might use each one.

> [!TIP]
> The histogram is the most versatile and most closely equivalent to the Application Insights Track Metric Classic API.  Azure Monitor currently flattens the histogram instrument into our five supported aggregation types, and support for percentiles is underway. Although less versatile, other OpenTelemetry instruments have a lesser impact on your application's performance.

#### Histogram Example

#### [.NET](#tab/net)

```csharp
using System.Diagnostics.Metrics;
using Azure.Monitor.OpenTelemetry.Exporter;
using OpenTelemetry;
using OpenTelemetry.Metrics;

public class Program
{
    private static readonly Meter meter = new("OTel.AzureMonitor.Demo");

    public static void Main()
    {
        using var meterProvider = Sdk.CreateMeterProviderBuilder()
            .AddMeter("OTel.AzureMonitor.Demo")
            .AddAzureMonitorMetricExporter(o =>
            {
                o.ConnectionString = "<Your Connection String>";
            })
            .Build();

        Histogram<long> myFruitSalePrice = meter.CreateHistogram<long>("FruitSalePrice");

        var rand = new Random();
        myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "apple"), new("color", "red"));
        myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "lemon"), new("color", "yellow"));
        myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "lemon"), new("color", "yellow"));
        myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "apple"), new("color", "green"));
        myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "apple"), new("color", "red"));
        myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "lemon"), new("color", "yellow"));

        System.Console.WriteLine("Press Enter key to exit.");
        System.Console.ReadLine();
    }
}
```

#### [Java](#tab/java)

```java
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.metrics.DoubleHistogram;
import io.opentelemetry.api.metrics.Meter;

public class Program {

    public static void main(String[] args) {
        Meter meter = GlobalOpenTelemetry.getMeter("OTEL.AzureMonitor.Demo");
        DoubleHistogram histogram = meter.histogramBuilder("histogram").build();
        histogram.record(1.0);
        histogram.record(100.0);
        histogram.record(30.0);
    }
}
```

#### [Node.js](#tab/nodejs)

 ```javascript
    const {
        MeterProvider,
        PeriodicExportingMetricReader,
    } = require("@opentelemetry/sdk-metrics");
    const {
        AzureMonitorMetricExporter,
    } = require("@azure/monitor-opentelemetry-exporter");

    const provider = new MeterProvider();
    const exporter = new AzureMonitorMetricExporter({
        connectionString: "<Your Connection String>",
    });

    const metricReader = new PeriodicExportingMetricReader({
        exporter: exporter,
    });

    provider.addMetricReader(metricReader);

    const meter = provider.getMeter("OTel.AzureMonitor.Demo");
    let histogram = meter.createHistogram("histogram");

    histogram.record(1, { testKey: "testValue" });
    histogram.record(30, { testKey: "testValue2" });
    histogram.record(100, { testKey2: "testValue" });
```

#### [Python](#tab/python)

```python
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import metrics

configure_azure_monitor(
    connection_string="<your-connection-string>",
)
meter = metrics.get_meter_provider().get_meter("otel_azure_monitor_histogram_demo")

histogram = meter.create_histogram("histogram")
histogram.record(1.0, {"test_key": "test_value"})
histogram.record(100.0, {"test_key2": "test_value"})
histogram.record(30.0, {"test_key": "test_value2"})

input()
```

---

#### Counter Example

#### [.NET](#tab/net)

```csharp
using System.Diagnostics.Metrics;
using Azure.Monitor.OpenTelemetry.Exporter;
using OpenTelemetry;
using OpenTelemetry.Metrics;

public class Program
{
    private static readonly Meter meter = new("OTel.AzureMonitor.Demo");

    public static void Main()
    {
        using var meterProvider = Sdk.CreateMeterProviderBuilder()
            .AddMeter("OTel.AzureMonitor.Demo")
            .AddAzureMonitorMetricExporter(o =>
            {
                o.ConnectionString = "<Your Connection String>";
            })
            .Build();

        Counter<long> myFruitCounter = meter.CreateCounter<long>("MyFruitCounter");

        myFruitCounter.Add(1, new("name", "apple"), new("color", "red"));
        myFruitCounter.Add(2, new("name", "lemon"), new("color", "yellow"));
        myFruitCounter.Add(1, new("name", "lemon"), new("color", "yellow"));
        myFruitCounter.Add(2, new("name", "apple"), new("color", "green"));
        myFruitCounter.Add(5, new("name", "apple"), new("color", "red"));
        myFruitCounter.Add(4, new("name", "lemon"), new("color", "yellow"));

        System.Console.WriteLine("Press Enter key to exit.");
        System.Console.ReadLine();
    }
}
```

#### [Java](#tab/java)

```Java
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.common.AttributeKey;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.LongCounter;
import io.opentelemetry.api.metrics.Meter;

public class Program {

    public static void main(String[] args) {
        Meter meter = GlobalOpenTelemetry.getMeter("OTEL.AzureMonitor.Demo");

        LongCounter myFruitCounter = meter
                .counterBuilder("MyFruitCounter")
                .build();

        myFruitCounter.add(1, Attributes.of(AttributeKey.stringKey("name"), "apple", AttributeKey.stringKey("color"), "red"));
        myFruitCounter.add(2, Attributes.of(AttributeKey.stringKey("name"), "lemon", AttributeKey.stringKey("color"), "yellow"));
        myFruitCounter.add(1, Attributes.of(AttributeKey.stringKey("name"), "lemon", AttributeKey.stringKey("color"), "yellow"));
        myFruitCounter.add(2, Attributes.of(AttributeKey.stringKey("name"), "apple", AttributeKey.stringKey("color"), "green"));
        myFruitCounter.add(5, Attributes.of(AttributeKey.stringKey("name"), "apple", AttributeKey.stringKey("color"), "red"));
        myFruitCounter.add(4, Attributes.of(AttributeKey.stringKey("name"), "lemon", AttributeKey.stringKey("color"), "yellow"));
    }
}
```

#### [Node.js](#tab/nodejs)

```javascript
    const {
        MeterProvider,
        PeriodicExportingMetricReader,
    } = require("@opentelemetry/sdk-metrics");
    const { AzureMonitorMetricExporter } = require("@azure/monitor-opentelemetry-exporter");

    const provider = new MeterProvider();
    const exporter = new AzureMonitorMetricExporter({
        connectionString: "<Your Connection String>",
    });
    const metricReader = new PeriodicExportingMetricReader({
        exporter: exporter,
    });
    provider.addMetricReader(metricReader);
    const meter = provider.getMeter("OTel.AzureMonitor.Demo");
    let counter = meter.createCounter("counter");
    counter.add(1, { "testKey": "testValue" });
    counter.add(5, { "testKey2": "testValue" });
    counter.add(3, { "testKey": "testValue2" });
```

#### [Python](#tab/python)

```python
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import metrics

configure_azure_monitor(
    connection_string="<your-connection-string>",
)
meter = metrics.get_meter_provider().get_meter("otel_azure_monitor_counter_demo")

counter = meter.create_counter("counter")
counter.add(1.0, {"test_key": "test_value"})
counter.add(5.0, {"test_key2": "test_value"})
counter.add(3.0, {"test_key": "test_value2"})

input()
```

---

#### Gauge Example

#### [.NET](#tab/net)

```csharp
using System.Diagnostics.Metrics;
using Azure.Monitor.OpenTelemetry.Exporter;
using OpenTelemetry;
using OpenTelemetry.Metrics;

public class Program
{
    private static readonly Meter meter = new("OTel.AzureMonitor.Demo");

    public static void Main()
    {
        using var meterProvider = Sdk.CreateMeterProviderBuilder()
            .AddMeter("OTel.AzureMonitor.Demo")
            .AddAzureMonitorMetricExporter(o =>
            {
                o.ConnectionString = "<Your Connection String>";
            })
            .Build();

        var process = Process.GetCurrentProcess();
        
        ObservableGauge<int> myObservableGauge = meter.CreateObservableGauge("Thread.State", () => GetThreadState(process));

        System.Console.WriteLine("Press Enter key to exit.");
        System.Console.ReadLine();
    }
    
    private static IEnumerable<Measurement<int>> GetThreadState(Process process)
    {
        foreach (ProcessThread thread in process.Threads)
        {
            yield return new((int)thread.ThreadState, new("ProcessId", process.Id), new("ThreadId", thread.Id));
        }
    }
}
```

#### [Java](#tab/java)

```Java
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.common.AttributeKey;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.Meter;

public class Program {

    public static void main(String[] args) {
        Meter meter = GlobalOpenTelemetry.getMeter("OTEL.AzureMonitor.Demo");

        meter.gaugeBuilder("gauge")
                .buildWithCallback(
                        observableMeasurement -> {
                            double randomNumber = Math.floor(Math.random() * 100);
                            observableMeasurement.record(randomNumber, Attributes.of(AttributeKey.stringKey("testKey"), "testValue"));
                        });
    }
}
```

#### [Node.js](#tab/nodejs)

```javascript
    const {
        MeterProvider,
        PeriodicExportingMetricReader
    } = require("@opentelemetry/sdk-metrics");
    const { AzureMonitorMetricExporter } = require("@azure/monitor-opentelemetry-exporter");

    const provider = new MeterProvider();
    const exporter = new AzureMonitorMetricExporter({
    connectionString:
        connectionString: "<Your Connection String>",
    });
    const metricReader = new PeriodicExportingMetricReader({
        exporter: exporter
    });
    provider.addMetricReader(metricReader);
    const meter = provider.getMeter("OTel.AzureMonitor.Demo");
    let gauge = meter.createObservableGauge("gauge");
    gauge.addCallback((observableResult) => {
        let randomNumber = Math.floor(Math.random() * 100);
        observableResult.observe(randomNumber, {"testKey": "testValue"});
    });
```

#### [Python](#tab/python)

```python
from typing import Iterable

from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import metrics
from opentelemetry.metrics import CallbackOptions, Observation

configure_azure_monitor(
    connection_string="<your-connection-string>",
)
meter = metrics.get_meter_provider().get_meter("otel_azure_monitor_gauge_demo")

def observable_gauge_generator(options: CallbackOptions) -> Iterable[Observation]:
    yield Observation(9, {"test_key": "test_value"})

def observable_gauge_sequence(options: CallbackOptions) -> Iterable[Observation]:
    observations = []
    for i in range(10):
        observations.append(
            Observation(9, {"test_key": i})
        )
    return observations

gauge = meter.create_observable_gauge("gauge", [observable_gauge_generator])
gauge2 = meter.create_observable_gauge("gauge2", [observable_gauge_sequence])

input()
```

---

### Add Custom Exceptions

Select instrumentation libraries automatically report exceptions to Application Insights.
However, you may want to manually report exceptions beyond what instrumentation libraries report.
For instance, exceptions caught by your code aren't ordinarily reported. You may wish to report them
to draw attention in relevant experiences including the failures section and end-to-end transaction views.

#### [.NET](#tab/net)

```csharp
using (var activity = activitySource.StartActivity("ExceptionExample"))
{
    try
    {
        throw new Exception("Test exception");
    }
    catch (Exception ex)
    {
        activity?.SetStatus(ActivityStatusCode.Error);
        activity?.RecordException(ex);
    }
}
```

#### [Java](#tab/java)

You can use `opentelemetry-api` to update the status of a span and record exceptions.

1. Add `opentelemetry-api-1.0.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry.instrumentation</groupId>
     <artifactId>opentelemetry-api</artifactId>
     <version>1.0.0</version>
   </dependency>
   ```

1. Set status to `error` and record an exception in your code:

   ```java
    import io.opentelemetry.api.trace.Span;
    import io.opentelemetry.api.trace.StatusCode;

    Span span = Span.current();
    span.setStatus(StatusCode.ERROR, "errorMessage");
    span.recordException(e);
   ```

#### [Node.js](#tab/nodejs)

```javascript
const { trace } = require("@opentelemetry/api");
const { BasicTracerProvider, SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { AzureMonitorTraceExporter } = require("@azure/monitor-opentelemetry-exporter");

const provider = new BasicTracerProvider();
const exporter = new AzureMonitorTraceExporter({
  connectionString: "<Your Connection String>",
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
const tracer = trace.getTracer("example-basic-tracer-node");
let span = tracer.startSpan("hello");
try{
    throw new Error("Test Error");
}
catch(error){
    span.recordException(error);
}
```

#### [Python](#tab/python)

The OpenTelemetry Python SDK is implemented in such a way that exceptions thrown will automatically be captured and recorded. See below for an example of this behavior.

```python
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import trace

configure_azure_monitor(
    connection_string="<your-connection-string>",
)
tracer = trace.get_tracer("otel_azure_monitor_exception_demo")

# Exception events
try:
    with tracer.start_as_current_span("hello") as span:
        # This exception will be automatically recorded
        raise Exception("Custom exception message.")
except Exception:
    print("Exception raised")

```

If you would like to record exceptions manually, you can disable that option
within the context manager and use `record_exception()` directly as shown below:

```python
...
with tracer.start_as_current_span("hello", record_exception=False) as span:
    try:
        raise Exception("Custom exception message.")
    except Exception as ex:
        # Manually record exception
        span.record_exception(ex)
...

```

---

### Add Custom Spans

You may want to add a custom span when there's a dependency request that's not already collected by an instrumentation library or an application process that you wish to model as a span on the end-to-end transaction view.
  
#### [.NET](#tab/net)
  
Coming soon.
  
#### [Java](#tab/java)
  
#### Use the OpenTelemetry annotation

The simplest way to add your own spans is by using OpenTelemetry's `@WithSpan` annotation.

Spans populate the `requests` and `dependencies` tables in Application Insights.

1. Add `opentelemetry-instrumentation-annotations-1.21.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry.instrumentation</groupId>
     <artifactId>opentelemetry-instrumentation-annotations</artifactId>
     <version>1.21.0</version>
   </dependency>
   ```

1. Use the `@WithSpan` annotation to emit a span each time your method is executed:

   ```java
    import io.opentelemetry.instrumentation.annotations.WithSpan;

    @WithSpan(value = "your span name")
    public void yourMethod() {
    }
   ```

By default, the span will end up in the `dependencies` table with dependency type `InProc`.

If your method represents a background job that isn't already captured by auto-instrumentation,
we recommend that you apply the attribute `kind = SpanKind.SERVER` to the `@WithSpan` annotation
so that it will end up in the Application Insights `requests` table.

#### Use the OpenTelemetry API

If the preceding OpenTelemetry `@WithSpan` annotation doesn't meet your needs,
you can add your spans by using the OpenTelemetry API.

1. Add `opentelemetry-api-1.0.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry.instrumentation</groupId>
     <artifactId>opentelemetry-api</artifactId>
     <version>1.0.0</version>
   </dependency>
   ```

1. Use the `GlobalOpenTelemetry` class to create a `Tracer`:

   ```java
    import io.opentelemetry.api.GlobalOpenTelemetry;
    import io.opentelemetry.api.trace.Tracer;

    static final Tracer tracer = GlobalOpenTelemetry.getTracer("com.example");
   ```

1. Create a span, make it current, and then end it:

   ```java
    Span span = tracer.spanBuilder("my first span").startSpan();
    try (Scope ignored = span.makeCurrent()) {
        // do stuff within the context of this 
    } catch (Throwable t) {
        span.recordException(t);
    } finally {
        span.end();
    }
   ```

#### [Node.js](#tab/nodejs)

Coming soon.
  
#### [Python](#tab/python)

#### Use the OpenTelemetry API

The OpenTelemetry API can be used to add your own spans, which will appear in
the `requests` and `dependencies` tables in Application Insights.

The code example shows how to use the `tracer.start_as_current_span()` method to
start, make the span current, and end the span within its context.

```python
...
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

# The "with" context manager starts, makes the span current, and ends the span within it's context
with tracer.start_as_current_span("my first span") as span:
    try:
        # Do stuff within the context of this
    except Exception as ex:
        span.record_exception(ex)
...

```

By default, the span will be in the `dependencies` table with a dependency type of `InProc`.

If your method represents a background job that isn't already captured by
auto-instrumentation, we recommend that you set the attribute `kind =
SpanKind.SERVER` so that it will end up in the Application Insights `requests`
table.

```python
...
from opentelemetry import trace
from opentelemetry.trace import SpanKind

tracer = trace.get_tracer(__name__)
with tracer.start_as_current_span("my request span", kind=SpanKind.SERVER) as span:
...
```

---

<!--

### Add Custom Events

#### Span Events

The OpenTelemetry Logs/Events API is still under development. In the meantime, you can use the OpenTelemetry Span API to create "Span Events", which populate the traces table in Application Insights. The string passed in to addEvent() is saved to the message field within the trace.

> [!CAUTION]
> Span Events are only recommended for when you need additional diagnostic metadata associated with your span. For other scenarios, such as describing business events, we recommend you wait for the release of the OpenTelemetry Events API.

#### [.NET](#tab/net)
  
Coming soon.
  
#### [Java](#tab/java)

You can use `opentelemetry-api` to create span events, which populate the `traces` table in Application Insights. The string passed in to `addEvent()` is saved to the `message` field within the trace.

1. Add `opentelemetry-api-1.0.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry.instrumentation</groupId>
     <artifactId>opentelemetry-api</artifactId>
     <version>1.0.0</version>
   </dependency>
   ```

1. Add span events in your code:

   ```java
    import io.opentelemetry.api.trace.Span;

    Span.current().addEvent("eventName");
   ```

#### [Node.js](#tab/nodejs)

Coming soon.
  
#### [Python](#tab/python)

Coming soon.

---

-->
  
### Send custom telemetry using the Application Insights Classic API
  
We recommend you use the OpenTelemetry APIs whenever possible, but there may be some scenarios when you have to use the Application Insights Classic APIs.
  
#### [.NET](#tab/net)
  
This is not available in .NET.

#### [Java](#tab/java)

1. Add `applicationinsights-core` to your application:

    ```xml
    <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>applicationinsights-core</artifactId>
      <version>3.4.10</version>
    </dependency>
    ```

1. Create a `TelemetryClient` instance:
    
    ```java
    static final TelemetryClient telemetryClient = new TelemetryClient();
    ```

1. Use the client to send custom telemetry:

    ##### Events
    
    ```java
    telemetryClient.trackEvent("WinGame");
    ```
    
    ##### Metrics
    
    ```java
    telemetryClient.trackMetric("queueLength", 42.0);
    ```
    
    ##### Dependencies
    
    ```java
    boolean success = false;
    long startTime = System.currentTimeMillis();
    try {
        success = dependency.call();
    } finally {
        long endTime = System.currentTimeMillis();
        RemoteDependencyTelemetry telemetry = new RemoteDependencyTelemetry();
        telemetry.setSuccess(success);
        telemetry.setTimestamp(new Date(startTime));
        telemetry.setDuration(new Duration(endTime - startTime));
        telemetryClient.trackDependency(telemetry);
    }
    ```
    
    ##### Logs
    
    ```java
    telemetryClient.trackTrace(message, SeverityLevel.Warning, properties);
    ```
    
    ##### Exceptions
    
    ```java
    try {
        ...
    } catch (Exception e) {
        telemetryClient.trackException(e);
    }
    ```

#### [Node.js](#tab/nodejs)
  
Coming soon.
 
#### [Python](#tab/python)
  
This is not available in Python.

---

## Modify telemetry

This section explains how to modify telemetry.

### Add span attributes

These attributes might include adding a custom property to your telemetry. You might also use attributes to set optional fields in the Application Insights schema, like Client IP.

#### Add a custom property to a Span

Any [attributes](#add-span-attributes) you add to spans are exported as custom properties. They populate the _customDimensions_ field in the requests, dependencies, traces, or exceptions table.

##### [.NET](#tab/net)

To add span attributes, use either of the following two ways:

* Use options provided by [instrumentation libraries](#instrumentation-libraries).
* Add a custom span processor.

> [!TIP]
> The advantage of using options provided by instrumentation libraries, when they're available, is that the entire context is available. As a result, users can select to add or filter more attributes. For example, the enrich option in the HttpClient instrumentation library gives users access to the httpRequestMessage itself. They can select anything from it and store it as an attribute.

1. Many instrumentation libraries provide an enrich option. For guidance, see the readme files of individual instrumentation libraries:
    - [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/Instrumentation.AspNet-1.0.0-rc9.6/src/OpenTelemetry.Instrumentation.AspNet/README.md#enrich)
    - [ASP.NET Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.7/src/OpenTelemetry.Instrumentation.AspNetCore/README.md#enrich)
    - [HttpClient and HttpWebRequest](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.7/src/OpenTelemetry.Instrumentation.Http/README.md#enrich)

1. Use a custom processor:

> [!TIP]
> Add the processor shown here *before* the Azure Monitor Exporter.

```csharp
using var tracerProvider = Sdk.CreateTracerProviderBuilder()
        .AddSource("OTel.AzureMonitor.Demo")
        .AddProcessor(new ActivityEnrichingProcessor())
        .AddAzureMonitorTraceExporter(o =>
        {
                o.ConnectionString = "<Your Connection String>"
        })
        .Build();
```

Add `ActivityEnrichingProcessor.cs` to your project with the following code:

```csharp
using System.Diagnostics;
using OpenTelemetry;
using OpenTelemetry.Trace;

public class ActivityEnrichingProcessor : BaseProcessor<Activity>
{
    public override void OnEnd(Activity activity)
    {
        // The updated activity will be available to all processors which are called after this processor.
        activity.DisplayName = "Updated-" + activity.DisplayName;
        activity.SetTag("CustomDimension1", "Value1");
        activity.SetTag("CustomDimension2", "Value2");
    }
}
```

##### [Java](#tab/java)

You can use `opentelemetry-api` to add attributes to spans.

Adding one or more span attributes populates the `customDimensions` field in the `requests`, `dependencies`, `traces`, or `exceptions` table.

1. Add `opentelemetry-api-1.0.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry.instrumentation</groupId>
     <artifactId>opentelemetry-api</artifactId>
     <version>1.0.0</version>
   </dependency>
   ```

1. Add custom dimensions in your code:

   ```java
    import io.opentelemetry.api.trace.Span;
    import io.opentelemetry.api.common.AttributeKey;

    AttributeKey attributeKey = AttributeKey.stringKey("mycustomdimension");
    Span.current().setAttribute(attributeKey, "myvalue1");
   ```

##### [Node.js](#tab/nodejs)

Use a custom processor:

> [!TIP]
> Add the processor shown here *before* the Azure Monitor Exporter.

```javascript
const { AzureMonitorTraceExporter } = require("@azure/monitor-opentelemetry-exporter");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");

class SpanEnrichingProcessor {
    forceFlush() {
        return Promise.resolve();
    }
    shutdown() {
        return Promise.resolve();
    }
    onStart(_span){}
    onEnd(span){
        span.attributes["CustomDimension1"] = "value1";
        span.attributes["CustomDimension2"] = "value2";
    }
}

const provider = new NodeTracerProvider();
const azureExporter = new AzureMonitorTraceExporter({
  connectionString: "<Your Connection String>"
});

provider.addSpanProcessor(new SpanEnrichingProcessor());
provider.addSpanProcessor(new SimpleSpanProcessor(azureExporter));
```

##### [Python](#tab/python)

Use a custom processor:

```python
...
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import trace

configure_azure_monitor(
    connection_string="<your-connection-string>",
)
span_enrich_processor = SpanEnrichingProcessor()
# Add the processor shown below to the current `TracerProvider`
trace.get_tracer_provider().add_span_processor(span_enrich_processor)
...
```

Add `SpanEnrichingProcessor.py` to your project with the following code:

```python
from opentelemetry.sdk.trace import SpanProcessor

class SpanEnrichingProcessor(SpanProcessor):

    def on_end(self, span):
        span._name = "Updated-" + span.name
        span._attributes["CustomDimension1"] = "Value1"
        span._attributes["CustomDimension2"] = "Value2"
```
---

#### Set the user IP

You can populate the _client_IP_ field for requests by setting the `http.client_ip` attribute on the span. Application Insights uses the IP address to generate user location attributes and then [discards it by default](ip-collection.md#default-behavior).

##### [.NET](#tab/net)

Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code in `ActivityEnrichingProcessor.cs`:

```C#
// only applicable in case of activity.Kind == Server
activity.SetTag("http.client_ip", "<IP Address>");
```

##### [Java](#tab/java)

Java automatically populates this field.

##### [Node.js](#tab/nodejs)

Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code:

```javascript
...
const { SemanticAttributes } = require("@opentelemetry/semantic-conventions");

class SpanEnrichingProcessor {
    ...

    onEnd(span){
        span.attributes[SemanticAttributes.HTTP_CLIENT_IP] = "<IP Address>";
    }
}
```

##### [Python](#tab/python)

Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code in `SpanEnrichingProcessor.py`:

```python
span._attributes["http.client_ip"] = "<IP Address>"
```

---

#### Set the user ID or authenticated user ID

You can populate the _user_Id_ or _user_AuthenticatedId_ field for requests by using the guidance below. User ID is an anonymous user identifier. Authenticated User ID is a known user identifier.

> [!IMPORTANT]
> Consult applicable privacy laws before you set the Authenticated User ID.

##### [.NET](#tab/net)

Coming soon.

##### [Java](#tab/java)

Populate the `user ID` field in the `requests`, `dependencies`, or `exceptions` table.

1. Add `opentelemetry-api-1.0.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry.instrumentation</groupId>
     <artifactId>opentelemetry-api</artifactId>
     <version>1.0.0</version>
   </dependency>
   ```

1. Set `user_Id` in your code:

   ```java
   import io.opentelemetry.api.trace.Span;

   Span.current().setAttribute("enduser.id", "myuser");
   ```

#### [Node.js](#tab/nodejs)

Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code:

```typescript
...
import { SemanticAttributes } from "@opentelemetry/semantic-conventions";

class SpanEnrichingProcessor implements SpanProcessor{
    ...

    onEnd(span: ReadableSpan){
        span.attributes[SemanticAttributes.ENDUSER_ID] = "<User ID>";
    }
}
```

##### [Python](#tab/python)

Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code:

```python
span._attributes["enduser.id"] = "<User ID>"
```

---

### Add Log Attributes
  
#### [.NET](#tab/net)
  
Coming soon.

#### [Java](#tab/java)

Logback, Log4j, and java.util.logging are [auto-instrumented](#logs). Attaching custom dimensions to your logs can be accomplished in these ways:

* [Logback MDC](http://logback.qos.ch/manual/mdc.html)
* [Log4j 2 MapMessage](https://logging.apache.org/log4j/2.x/log4j-api/apidocs/org/apache/logging/log4j/message/MapMessage.html) (a `MapMessage` key of `"message"` will be captured as the log message)
* [Log4j 2 Thread Context](https://logging.apache.org/log4j/2.x/manual/thread-context.html)
* [Log4j 1.2 MDC](https://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/MDC.html)

#### [Node.js](#tab/nodejs)
  
Coming soon.

#### [Python](#tab/python)
  
The Python [logging](https://docs.python.org/3/howto/logging.html) library is [auto-instrumented](#logs). You can attach custom dimensions to your logs by passing a dictionary into the `extra` argument of your logs.

```python
...
logger.warning("WARNING: Warning log with properties", extra={"key1": "value1"})
...

```

---

### Filter telemetry

You might use the following ways to filter out telemetry before it leaves your application.

#### [.NET](#tab/net)

1. Many instrumentation libraries provide a filter option. For guidance, see the readme files of individual instrumentation libraries:
    - [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/Instrumentation.AspNet-1.0.0-rc9.6/src/OpenTelemetry.Instrumentation.AspNet/README.md#filter)
    - [ASP.NET Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.7/src/OpenTelemetry.Instrumentation.AspNetCore/README.md#filter)
    - [HttpClient and HttpWebRequest](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.7/src/OpenTelemetry.Instrumentation.Http/README.md#filter)

1. Use a custom processor:
    
    ```csharp
    using var tracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddSource("OTel.AzureMonitor.Demo")
            .AddProcessor(new ActivityFilteringProcessor())
            .AddAzureMonitorTraceExporter(o =>
            {
                    o.ConnectionString = "<Your Connection String>"
            })
            .Build();
    ```
    
    Add `ActivityFilteringProcessor.cs` to your project with the following code:
    
    ```csharp
    using System.Diagnostics;
    using OpenTelemetry;
    using OpenTelemetry.Trace;
    
    public class ActivityFilteringProcessor : BaseProcessor<Activity>
    {
        public override void OnStart(Activity activity)
        {
            // prevents all exporters from exporting internal activities
            if (activity.Kind == ActivityKind.Internal)
            {
                activity.IsAllDataRequested = false;
            }
        }
    }
    ```

1. If a particular source isn't explicitly added by using `AddSource("ActivitySourceName")`, then none of the activities created by using that source will be exported.

#### [Java](#tab/java)

See [sampling overrides](java-standalone-config.md#sampling-overrides-preview) and [telemetry processors](java-standalone-telemetry-processors.md).

#### [Node.js](#tab/nodejs)

1. Exclude the URL option provided by many HTTP instrumentation libraries.

    The following example shows how to exclude a certain URL from being tracked by using the [HTTP/HTTPS instrumentation library](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http):
    
    ```javascript
    const { registerInstrumentations } = require( "@opentelemetry/instrumentation");
    const { HttpInstrumentation } = require( "@opentelemetry/instrumentation-http");
    const { NodeTracerProvider } = require( "@opentelemetry/sdk-trace-node");

    const httpInstrumentationConfig = {
        ignoreIncomingRequestHook: (request) => {
            // Ignore OPTIONS incoming requests
            if (request.method === 'OPTIONS') {
                return true;
            }
            return false;
        },
        ignoreOutgoingRequestHook: (options) => {
            // Ignore outgoing requests with /test path
            if (options.path === '/test') {
                return true;
            }
            return false;
        }
    };

    const httpInstrumentation = new HttpInstrumentation(httpInstrumentationConfig);
    const provider = new NodeTracerProvider();
    provider.register();

    registerInstrumentations({
        instrumentations: [
            httpInstrumentation,
        ]
    });
    ```

2. Use a custom processor. You can use a custom span processor to exclude certain spans from being exported. To mark spans to not be exported, set `TraceFlag` to `DEFAULT`.
Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code:

    ```javascript
    const { SpanKind, TraceFlags } = require("@opentelemetry/api");

    class SpanEnrichingProcessor {
        ...

        onEnd(span) {
            if(span.kind == SpanKind.INTERNAL){
                span.spanContext().traceFlags = TraceFlags.NONE;
            }
        }
    }
    ```
 
#### [Python](#tab/python)

1. Exclude the URL option provided by many HTTP instrumentation libraries.

    The following example shows how to exclude a specific URL from being tracked by using the [Flask](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-flask) instrumentation configuration options in the `configure_azure_monitor()` function.
    
    ```python
    ...
    import flask
    from azure.monitor.opentelemetry import configure_azure_monitor
    
    # Configure Azure monitor collection telemetry pipeline
    configure_azure_monitor(
        connection_string="<your-connection-string>",
        # Pass in instrumentation configuration via kwargs
        # Key: <instrumentation-name>_config
        # Value: Dictionary of configuration keys and values
        flask_config={"excluded_urls": "http://localhost:8080/ignore"},
    )
    app = flask.Flask(__name__)

    # Requests sent to this endpoint will not be tracked due to
    # flask_config configuration
    @app.route("/ignore")
    def ignore():
        return "Request received but not tracked."
    ...
    ```

1. Use a custom processor. You can use a custom span processor to exclude certain spans from being exported. To mark spans to not be exported, set `TraceFlag` to `DEFAULT`.
    
    ```python
    ...
    from azure.monitor.opentelemetry import configure_azure_monitor
    from opentelemetry import trace

    configure_azure_monitor(
        connection_string="<your-connection-string>",
    )
    trace.get_tracer_provider().add_span_processor(SpanFilteringProcessor())
    ...
    ```
    
    Add `SpanFilteringProcessor.py` to your project with the following code:
    
    ```python
    from opentelemetry.trace import SpanContext, SpanKind, TraceFlags
    from opentelemetry.sdk.trace import SpanProcessor
    
    class SpanFilteringProcessor(SpanProcessor):
    
        # prevents exporting spans from internal activities
        def on_start(self, span):
            if span._kind is SpanKind.INTERNAL:
                span._context = SpanContext(
                    span.context.trace_id,
                    span.context.span_id,
                    span.context.is_remote,
                    TraceFlags.DEFAULT,
                    span.context.trace_state,
                )
    
    ```

---
    
<!-- For more information, see [GitHub Repo](link). -->

### Get the trace ID or span ID
    
You might want to get the trace ID or span ID. If you have logs that are sent to a different destination besides Application Insights, you might want to add the trace ID or span ID to enable better correlation when you debug and diagnose issues.

#### [.NET](#tab/net)

Coming soon.

#### [Java](#tab/java)

You can use `opentelemetry-api` to get the trace ID or span ID.

1. Add `opentelemetry-api-1.0.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry.instrumentation</groupId>
     <artifactId>opentelemetry-api</artifactId>
     <version>1.0.0</version>
   </dependency>
   ```

1. Get the request trace ID and the span ID in your code:

   ```java
   import io.opentelemetry.api.trace.Span;

   Span span = Span.current();
   String traceId = span.getSpanContext().getTraceId();
   String spanId = span.getSpanContext().getSpanId();
   ```

#### [Node.js](#tab/nodejs)

Coming soon.

#### [Python](#tab/python)

Get the request trace ID and the span ID in your code:

   ```python
   from opentelemetry import trace

   trace_id = trace.get_current_span().get_span_context().trace_id
   span_id = trace.get_current_span().get_span_context().span_id
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

Coming soon.

#### [Node.js](#tab/nodejs)

1. Install the [OpenTelemetry Collector Exporter](https://www.npmjs.com/package/@opentelemetry/exporter-otlp-http) package along with the [Azure Monitor OpenTelemetry Exporter](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter) in your project.

    ```sh
        npm install @opentelemetry/exporter-otlp-http
        npm install @azure/monitor-opentelemetry-exporter
    ```

2. Add the following code snippet. This example assumes you have an OpenTelemetry Collector with an OTLP receiver running. For details, see the [example on GitHub](https://github.com/open-telemetry/opentelemetry-js/tree/main/examples/otlp-exporter-node).

    ```javascript
    const { BasicTracerProvider, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp-http');
    const { AzureMonitorTraceExporter } = require("@azure/monitor-opentelemetry-exporter");
    
    const provider = new BasicTracerProvider();
    const azureMonitorExporter = new AzureMonitorTraceExporter({
      connectionString: "<Your Connection String>",
    });
    const otlpExporter = new OTLPTraceExporter();
    provider.addSpanProcessor(new SimpleSpanProcessor(azureMonitorExporter));
    provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));
    provider.register();
    ```

#### [Python](#tab/python)

1. Install the [azure-monitor-opentelemetry-exporter](https://pypi.org/project/azure-monitor-opentelemetry-exporter/) and [opentelemetry-exporter-otlp](https://pypi.org/project/opentelemetry-exporter-otlp/) packages.

1. Add the following code snippet. This example assumes you have an OpenTelemetry Collector with an OTLP receiver running. For details, see this [README](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/monitor/azure-monitor-opentelemetry-exporter/samples/traces#collector).
    
    ```python
    from azure.monitor.opentelemetry import configure_azure_monitor
    from opentelemetry import trace
    from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor

    configure_azure_monitor(
        connection_string="<your-connection-string>",
    )
    tracer = trace.get_tracer(__name__) 
    
    exporter = AzureMonitorTraceExporter(connection_string="<your-connection-string>")
    otlp_exporter = OTLPSpanExporter(endpoint="http://localhost:4317")
    span_processor = BatchSpanProcessor(otlp_exporter) 
    trace.get_tracer_provider().add_span_processor(span_processor)
    
    with tracer.start_as_current_span("test"):
        print("Hello world!")
    ```

---

## Configuration

### Offline Storage and Automatic Retries

To improve reliability and resiliency, Azure Monitor OpenTelemetry-based offerings write to offline/local storage by default when an application loses its connection with Application Insights. It saves the application telemetry to disk and periodically tries to send it again for up to 48 hours. In addition to exceeding the allowable time, telemetry will occasionally be dropped in high-load applications when the maximum file size is exceeded or the SDK doesn't have an opportunity to clear out the file. If we need to choose, the product will save more recent events over old ones. [Learn More](data-retention-privacy.md#does-the-sdk-create-temporary-local-storage)

#### [.NET](#tab/net)

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

#### [Java](#tab/java)

Configuring Offline Storage and Automatic Retries is not available in Java.

For a full list of available configurations, see [Configuration options](./java-standalone-config.md).

#### [Node.js](#tab/nodejs)

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

#### [Python](#tab/python)

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

## Troubleshooting

This section provides help with troubleshooting.

### Enable diagnostic logging

#### [.NET](#tab/net)

The Azure Monitor Exporter uses EventSource for its own internal logging. The exporter logs are available to any EventListener by opting into the source named OpenTelemetry-AzureMonitor-Exporter. For troubleshooting steps, see [OpenTelemetry Troubleshooting](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry#troubleshooting).

#### [Java](#tab/java)

Diagnostic logging is enabled by default. For more information, see the dedicated [troubleshooting article](java-standalone-troubleshoot.md).

#### [Node.js](#tab/nodejs)

Azure Monitor Exporter uses the OpenTelemetry API Logger for internal logs. To enable it, use the following code:

```javascript
const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");

const provider = new NodeTracerProvider();
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
provider.register();
```

#### [Python](#tab/python)

The Azure Monitor Exporter uses the Python standard logging [library](https://docs.python.org/3/library/logging.html) for its own internal logging. OpenTelemetry API and Azure Monitor Exporter logs are logged at the severity level of WARNING or ERROR for irregular activity. The INFO severity level is used for regular or successful activity. By default, the Python logging library sets the severity level to WARNING, so you must change the severity level to see logs under this severity setting. The following example shows how to output logs of *all* severity levels to the console *and* a file:

```python
...
import logging

logging.basicConfig(format="%(asctime)s:%(levelname)s:%(message)s", level=logging.DEBUG)

logger = logging.getLogger(__name__)
file = logging.FileHandler("example.log")
stream = logging.StreamHandler()
logger.addHandler(file)
logger.addHandler(stream)
...

```

---

### Known issues

Known issues for the Azure Monitor OpenTelemetry Exporters include:

#### [.NET](#tab/net)

- Operation name is missing on dependency telemetry, which adversely affects failures and performance tab experience.
- Device model is missing on request and dependency telemetry, which adversely affects device cohort analysis.
- Database server name is left out of dependency name, which incorrectly aggregates tables with the same name on different servers.

#### [Java](#tab/java)

No known issues.

#### [Node.js](#tab/nodejs)

- Operation name is missing on dependency telemetry, which adversely affects failures and performance tab experience.
- Device model is missing on request and dependency telemetry, which adversely affects device cohort analysis.
- Database server name is left out of dependency name, which incorrectly aggregates tables with the same name on different servers.

#### [Python](#tab/python)

- Operation name is missing on dependency telemetry, which adversely affects failures and performance tab experience.
- Device model is missing on request and dependency telemetry, which adversely affects device cohort analysis.
- Database server name is left out of dependency name, which incorrectly aggregates tables with the same name on different servers.

---

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Support

To get support:
- Review troubleshooting steps in this article.
- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).

### [.NET](#tab/net)

- For OpenTelemetry issues, contact the [OpenTelemetry .NET community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.
- For a list of open issues related to Azure Monitor Exporter, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-net/issues?q=is%3Aopen+is%3Aissue+label%3A%22Monitor+-+Exporter%22).

### [Java](#tab/java)

- For help with troubleshooting, review the [troubleshooting steps](java-standalone-troubleshoot.md).
- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry community](https://opentelemetry.io/community/) directly.
- For a list of open issues related to Azure Monitor Java Auto-Instrumentation, see the [GitHub Issues Page](https://github.com/microsoft/ApplicationInsights-Java/issues).

### [Node.js](#tab/nodejs)

- For OpenTelemetry issues, contact the [OpenTelemetry JavaScript community](https://github.com/open-telemetry/opentelemetry-js) directly.
- For a list of open issues related to Azure Monitor Exporter, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-js/issues?q=is%3Aopen+is%3Aissue+label%3A%22Monitor+-+Exporter%22).

### [Python](#tab/python)

- For OpenTelemetry issues, contact the [OpenTelemetry Python community](https://github.com/open-telemetry/opentelemetry-python) directly.
- For a list of open issues related to Azure Monitor Distro, see the [GitHub Issues Page](https://github.com/microsoft/ApplicationInsights-Python/issues/new).

---

## OpenTelemetry feedback

To provide feedback:

- Fill out the OpenTelemetry community's [customer feedback survey](https://docs.google.com/forms/d/e/1FAIpQLScUt4reClurLi60xyHwGozgM9ZAz8pNAfBHhbTZ4gFWaaXIRQ/viewform).
- Tell Microsoft about yourself by joining the [OpenTelemetry Early Adopter Community](https://aka.ms/AzMonOTel/).
- Engage with other Azure Monitor users in the [Microsoft Tech Community](https://techcommunity.microsoft.com/t5/azure-monitor/bd-p/AzureMonitor).
- Make a feature request at the [Azure Feedback Forum](https://feedback.azure.com/d365community/forum/3887dc70-2025-ec11-b6e6-000d3a4f09d0).

## Next steps

### [.NET](#tab/net)

- To review the source code, see the [Azure Monitor Exporter GitHub repository](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter).
- To install the NuGet package, check for updates, or view release notes, see the [Azure Monitor Exporter NuGet Package](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter/) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter/tests/Azure.Monitor.OpenTelemetry.Exporter.Demo).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry .NET GitHub repository](https://github.com/open-telemetry/opentelemetry-dotnet).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

### [Java](#tab/java)

- Review [Java auto-instrumentation configuration options](java-standalone-config.md).
- To review the source code, see the [Azure Monitor Java auto-instrumentation GitHub repository](https://github.com/Microsoft/ApplicationInsights-Java).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry Java GitHub repository](https://github.com/open-telemetry/opentelemetry-java-instrumentation).
- To enable usage experiences, see [Enable web or browser user monitoring](javascript.md).
- See the [release notes](https://github.com/microsoft/ApplicationInsights-Java/releases) on GitHub.

### [Node.js](#tab/nodejs)

- To review the source code, see the [Azure Monitor Exporter GitHub repository](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter).
- To install the npm package, check for updates, or view release notes, see the [Azure Monitor Exporter npm Package](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter/samples).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry JavaScript GitHub repository](https://github.com/open-telemetry/opentelemetry-js).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

### [Python](#tab/python)

- To review the source code and additional documentation, see the [Azure Monitor Distro GitHub repository](https://github.com/microsoft/ApplicationInsights-Python/blob/main/azure-monitor-opentelemetry/README.md).
- To see additional samples and use cases, see [Azure Monitor Distro samples](https://github.com/microsoft/ApplicationInsights-Python/tree/main/azure-monitor-opentelemetry/samples).
- See the [release notes](https://github.com/microsoft/ApplicationInsights-Python/releases) on GitHub.
- To install the PyPI package, check for updates, or view release notes, see the [Azure Monitor Distro PyPI Package](https://pypi.org/project/azure-monitor-opentelemetry/) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure-Samples/azure-monitor-opentelemetry-python).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry Python GitHub repository](https://github.com/open-telemetry/opentelemetry-python).
- To see available OpenTelemetry instrumentations and components, see the [OpenTelemetry Contrib Python GitHub repository](https://github.com/open-telemetry/opentelemetry-python-contrib).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

---
