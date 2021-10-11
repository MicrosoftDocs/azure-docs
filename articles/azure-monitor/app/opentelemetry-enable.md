---
title: Enable Azure Monitor OpenTelemetry for .NET, Node.js, and Python applications
description: Provides guidance on how to enable Azure Monitor on applications using OpenTelemetry
ms.topic: conceptual
ms.date: 10/11/2021
author: mattmccleary
ms.author: mmcc
---

# Enable Azure Monitor OpenTelemetry Exporter for .NET, Node.js, and Python applications (Preview)

This article describes how to enable and configure the OpenTelemetry-based Azure Monitor Preview offering. When you complete the instructions in this article, you will be able to send OpenTelemetry traces to Azure Monitor Application Insights.

## Limitations of preview release

### [.NET](#tab/net)

Please consider carefully whether this preview is right for you. It **enables distributed tracing only** and _excludes_ the following:
 - Metrics API (custom metrics, [Pre-aggregated metrics](pre-aggregated-metrics-log-metrics.md#pre-aggregated-metrics))
 - [Live Metrics](live-stream.md)
 - Logging API (console logs, logging libraries, etc.)
 - Auto-capture of unhandled exceptions
 - [Profiler](profiler-overview.md)
 - [Snapshot Debugger](snapshot-debugger.md)
 - Offline disk storage
 - [Azure AD Authentication](azure-ad-authentication.md)
 - [Sampling](sampling.md)
 - Auto-population of Cloud Role Name and Cloud Role Instance in Azure environments
 - Auto-population of User ID and Authenticated User ID when using the [Application Insights JavaScript SDK](javascript.md)
 - Auto-population of User IP (to determine location attributes)
 - Ability to override [Operation Name](correlation.md#data-model-for-telemetry-correlation)
 - Ability to manually set User ID or Authenticated User ID
 - Propagating Operation Name to Dependency Telemetry
 - Distributed Tracing context propagation (instrumentation libraries) through Azure Functions Worker

Those who require a full-feature experience should use the existing Application Insights [ASP.NET](asp-net.md) or [ASP.NET Core](asp-net-core.md) SDK until the OpenTelemetry-based offering matures.

### [Node.js](#tab/nodejs)

Please consider carefully whether this preview is right for you. It enables distributed tracing only and _excludes_ the following:
 - Metrics API (custom metrics, [Pre-aggregated metrics](pre-aggregated-metrics-log-metrics.md#pre-aggregated-metrics))
 - [Live Metrics](live-stream.md)
 - Logging API (console logs, logging libraries, etc.)
 - Auto-capture of unhandled exceptions
 - [Azure AD Authentication](azure-ad-authentication.md)
 - [Sampling](sampling.md)
 - Auto-population of Cloud Role Name and Cloud Role Instance in Azure environments
 - Auto-population of User ID and Authenticated User ID when using the [Application Insights JavaScript SDK](javascript.md)
 - Auto-population of User IP (to determine location attributes)
 - Ability to override [Operation Name](correlation.md#data-model-for-telemetry-correlation)
 - Ability to manually set User ID or Authenticated User ID
 - Propagating Operation Name to Dependency Telemetry

Those who require a full-feature experience should use the existing [Application Insights Node.js SDK](nodejs.md) until the OpenTelemetry-based offering matures.

> [!WARNING] 
> At present, this exporter only works for Node.js environments. Use the [Application Insights JavaScript SDK](javascript.md) for web/browser scenarios.

### [Python](#tab/python)

Please consider carefully whether this preview is right for you. It **enables distributed tracing only** and _excludes_ the following:
 - Metrics API (custom metrics, [Pre-aggregated metrics](pre-aggregated-metrics-log-metrics.md#pre-aggregated-metrics))
 - [Live Metrics](live-stream.md)
 - Logging API (console logs, logging libraries, etc.)
 - Auto-capture of unhandled exceptions
 - Offline disk storage
 - [Azure AD Authentication](azure-ad-authentication.md)
 - [Sampling](sampling.md)
 - Auto-population of Cloud Role Name and Cloud Role Instance in Azure environments
 - Auto-population of User ID and Authenticated User ID when using the [Application Insights JavaScript SDK](javascript.md)
 - Auto-population of User IP (to determine location attributes)
 - Ability to override [Operation Name](correlation.md#data-model-for-telemetry-correlation)
 - Ability to manually set User ID or Authenticated User ID
 - Propagating Operation Name to Dependency Telemetry
 - Distributed Tracing context propagation (instrumentation libraries) through Azure Functions Worker

Those who require a full-feature experience should use the existing [Application Insights Python-OpenCensus SDK](opencensus-python.md) until the OpenTelemetry-based offering matures.

---

## Get started

Follow the steps in this section and you will be able to instrument your application with OpenTelemetry.

### Prerequisites

- Azure subscription - [Create an Azure subscription for free](https://azure.microsoft.com/free/)
- Application Insights resource - [Create an Application Insights resource](create-workspace-resource.md#create-workspace-based-resource)

### [.NET](#tab/net)

- Application using an officially supported version of [.NET Core](https://dotnet.microsoft.com/download/dotnet) or [.NET Framework](https://dotnet.microsoft.com/download/dotnet-framework) >= `.NET Framework 4.6.1`.


### [Node.js](#tab/nodejs)

- Application using an officially [supported version](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter#currently-supported-environments) of Node.js runtime.
  - [OpenTelemetry supported runtimes](https://github.com/open-telemetry/opentelemetry-js#supported-runtimes)
  - [Azure Monitor OpenTelemetry Exporter supported runtimes](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter#currently-supported-environments)

### [Python](#tab/python)

- Python Application using version 3.6+


---

### Install the client libraries

#### [.NET](#tab/net)

Install the latest [Azure.Monitor.OpenTelemetry.Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) NuGet package:

```dotnetcli
dotnet add package --prerelease Azure.Monitor.OpenTelemetry.Exporter 
```

If you get an error like "There are no versions available for the package 'Azure.Monitor.OpenTelemetry.Exporter'.", it's most probably due to missing the setting of NuGet package sources. You could try to specify the source with `-s` option:

```dotnetcli
# Install the latest package with NuGet package source specified
dotnet add package --prerelease Azure.Monitor.OpenTelemetry.Exporter -s https://api.nuget.org/v3/index.json
```

#### [Node.js](#tab/nodejs)

Install these packages:

- [@opentelemetry/sdk-trace-base](https://www.npmjs.com/package/@opentelemetry/sdk-trace-base)
- [@opentelemetry/sdk-trace-node](https://www.npmjs.com/package/@opentelemetry/sdk-trace-node)
- [@azure/monitor-opentelemetry-exporter](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter)

```sh
npm install @opentelemetry/sdk-trace-base
npm install @opentelemetry/sdk-trace-node
npm install @azure/monitor-opentelemetry-exporter
```

Following packages are also used for some specific scenarios described later in this article.

- [@opentelemetry/api](https://www.npmjs.com/package/@opentelemetry/api)
- [@opentelemetry/resources](https://www.npmjs.com/package/@opentelemetry/resources)
- [@opentelemetry/semantic-conventions](https://www.npmjs.com/package/@opentelemetry/semantic-conventions)
- [@opentelemetry/instrumentation-http](https://www.npmjs.com/package/@opentelemetry/instrumentation-http)

```sh
npm install @opentelemetry/api
npm install @opentelemetry/resources
npm install @opentelemetry/semantic-conventions
npm install @opentelemetry/instrumentation-http
```

#### [Python](#tab/python)

Install the latest [azure-monitor-opentelemetry-exporter](https://pypi.org/project/azure-monitor-opentelemetry-exporter/) Pypi package.

```sh
pip install azure-monitor-opentelemetry-exporter 
```

---

### Enable Azure Monitor Application Insights

#### Add OpenTelemetry instrumentation code

##### [.NET](#tab/net)

> [!NOTE]
> The following guidance shows how to enable Azure Monitor Application Insights for a C# console applications.
> 
> Check out OpenTelemetry GitHub Readmes for guidance on other applications types:
> - [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Instrumentation.AspNet/README.md)
> - [ASP.NET Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md)
> - [HttpClient and HttpWebRequest](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Instrumentation.Http/README.md)
> 
> Extension method `AddAzureMonitorTraceExporter` for sending data to Application Insights is applicable for all listed application types.
> 
> For additional resources, refer to [OpenTelemetry examples on GitHub](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/examples). 

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
> The `Activity` and `ActivitySource` classes from the `System.Diagnostics` namespace represent the OpenTelemetry concepts of `Span` and `Tracer` respectively. And you create `ActivitySource` directly using its constructor instead of using `TracerProvider` (each [`ActivitySource`](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/docs/trace/customizing-the-sdk#activity-source) must be explicitly connected to `TracerProvider` using `AddSource()`). That is because parts of the OpenTelemetry tracing API are incorporated directly into the .NET runtime. [Learn more](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Api/README.md#introduction-to-opentelemetry-net-tracing-api).

##### [Node.js](#tab/nodejs)

The following code demonstrates enabling OpenTelemetry in a simple Node.js application.

```typescript
const { AzureMonitorTraceExporter } = require("@azure/monitor-opentelemetry-exporter");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");

const provider = new NodeTracerProvider();
provider.register();

// Create an exporter instance
const exporter = new AzureMonitorTraceExporter({
  instrumentationKey: "<Your Connection String>"
});

// Add the exporter to the provider
provider.addSpanProcessor(
  new BatchSpanProcessor(exporter, {
    bufferTimeout: 15000,
    bufferSize: 1000
  })
);
// Create a span. A span must be closed.
const parentSpan = tracer.startSpan("main");
for (let i = 0; i < 10; i += 1) {
   doWork(parentSpan);
}
// Be sure to end the span.
parentSpan.end();

function doWork(parent: opentelemetry.Span) {
  // Start another span. In this example, the main method already started a
  // span, so that'll be the parent span, and this will be a child span.
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parent);
  const span = tracer.startSpan("doWork", undefined, ctx);
  // simulate some random work.
  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // empty
  }
  // Set attributes to the span.
  span.setAttribute("key", "value");
  // Annotate our span to capture metadata about our operation
  span.addEvent("invoking doWork");
  span.end();
}
```

##### [Python](#tab/python)

The following code demonstrates enabling OpenTelemetry in a simple Python application.

```python
import os
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter

exporter = AzureMonitorTraceExporter.from_connection_string(
    "<Your Connection String>"
)

trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)
span_processor = BatchSpanProcessor(exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

with tracer.start_as_current_span("hello"):
    print("Hello, World!")

```

---

#### Set Application Insights connection string

Replace placeholder `<Your Connection String>` in the above code with the connection string from YOUR Application Insights resource.

:::image type="content" source="media/opentelemetry/connection-string.png" alt-text="Screenshot of Application Insights Connection String.":::

#### Confirm data is flowing

Run your application and open your Application Insights Resource tab on the Azure portal. It may take a few minutes for data to show up in the Portal.

> [!NOTE]
> If you're not able to run the application or not getting data as expected, please go to [Troubleshooting](#troubleshooting).

:::image type="content" source="media/opentelemetry/server-requests.png" alt-text="Screenshot of Application Insights Overview tab with server requests and server response time highlighted.":::

> [!IMPORTANT]
> If you have two or more services emitting telemetry to the same Application Insights resource, you are required to [set cloud role names](#set-cloud-role-name-and-cloud-role-instance) to represent them properly on the Application Map.

## Set Cloud Role Name and Cloud Role Instance

You may set [Cloud Role Name](app-map.md#understanding-cloud-role-name-within-the-context-of-the-application-map) and Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. This updates Cloud Role Name and Cloud Role Instance from its default value to something that makes sense to your team. It will surface on the Application Map as the name underneath a node. Cloud Role Name uses `service.namespace` and `service.name` attributes, though it falls back to `service.name` if `service.namespace` is not set. Cloud Role Instance uses the `service.instance.id` attribute value.

### [.NET](#tab/net)

```csharp
// Setting Role name and Role instance
var resourceAttributes = new Dictionary<string, object> {
    { "service.name", "my-service" },
    { "service.namespace", "my-namespace" },
    { "service.instance.id", "my-instance" }};
var resourceBuilder = ResourceBuilder.CreateDefault().AddAttributes(resourceAttributes);
// Done setting Role name and Role instance

// Set ResourceBuilder on the provider
using var tracerProvider = Sdk.CreateTracerProviderBuilder()
        .SetResourceBuilder(resourceBuilder)
        .AddSource("OTel.AzureMonitor.Demo")
        .AddAzureMonitorTraceExporter(o =>
        {
            o.ConnectionString = "<Your Connection String>";
        })
        .Build();
```


### [Node.js](#tab/nodejs)

```typescript
...
import { NodeTracerProvider, NodeTracerConfig } from "@opentelemetry/sdk-trace-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

const config: NodeTracerConfig = {
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: "my-helloworld-service",
            [SemanticResourceAttributes.SERVICE_NAMESPACE]: "my-namespace",
            [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: "my-instance",
        }),
    };
const provider = new NodeTracerProvider(config);
...
```

### [Python](#tab/python)

```python
...
from opentelemetry.sdk.resources import SERVICE_NAME, SERVICE_NAMESPACE, SERVICE_INSTANCE_ID, Resource
trace.set_tracer_provider(
    TracerProvider(
        resource=Resource.create(
            {
                SERVICE_NAME: "my-helloworld-service",
                SERVICE_NAMESPACE: "my-namespace",
                SERVICE_INSTANCE_ID: "my-instance",
            }
        )
    )
)
...
```

---

Reference: [Resource Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/README.md)

## Sampling

While sampling is supported in OpenTelemetry, it is not supported in Azure Monitor OpenTelemetry Exporter at this time.

> [!WARNING]
> Enabling sampling in OpenTelemetry will make standard and log-based metrics extremely inaccurate which will adversely impact all Application Insights experiences. Additionally, enabling sampling alongside the existing Application Insights SDKs will result in broken traces.

## Instrumentation libraries
<!-- Microsoft has tested and validated that the following instrumentation libraries will work with the **Preview** Release. -->
The following libraries are validated to work with the Preview Release:

> [!WARNING]
> Instrumentation libraries are based on experimental OpenTelemetry specifications. Microsoft’s **preview** support commitment is to ensure the libraries listed below emit data to Azure Monitor Application Insights, but it’s possible that breaking changes or experimental mapping will block some data elements.

### HTTP

#### [.NET](#tab/net)

- [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.AspNet/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNet/1.0.0-rc7)
- [ASP.NET
  Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.AspNetCore/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNetCore/1.0.0-rc7)
- [HTTP
  clients](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.Http/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http/1.0.0-rc7)

#### [Node.js](#tab/nodejs)

- [http/https](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http/README.md) Version:
  [0.26.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-http/v/0.26.0)


#### [Python](#tab/python)

- [Django](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-django/README.md) Version:
  [0.24b0](https://pypi.org/project/opentelemetry-instrumentation-django/0.24b0/)
- [Flask](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-flask/README.md) Version:
  [0.24b0](https://pypi.org/project/opentelemetry-instrumentation-flask/0.24b0/)
- [Requests](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-requests/README.md) Version:
  [0.24b0](https://pypi.org/project/opentelemetry-instrumentation-requests/0.24b0/)

---

### Database

#### [.NET](#tab/net)

- [SQL
  client](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.SqlClient/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient/1.0.0-rc7)

#### [Node.js](#tab/nodejs)

- [mysql](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-mysql) Version:
  [0.25.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-mysql/v/0.25.0)

#### [Python](#tab/python)

- [Psycopg2](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-psycopg2) Version:
  [0.24b0](https://pypi.org/project/opentelemetry-instrumentation-psycopg2/0.24b0/)

---

> [!NOTE]
> The **preview** offering only includes instrumentations that handle HTTP and Database requests. See [OpenTelemetry Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/trace/semantic_conventions) to learn more.

## Modify telemetry

### Add span attributes

Span attributes can be added using either of the following two ways.
1. Using options provided by [instrumentation libraries](#instrumentation-libraries).
2. Adding a custom span processor.

These attributes may include adding a custom business property to your telemetry. You may also use attributes to set optional fields in the Application Insights Schema such as User ID or Client IP.

> [!TIP]
> The advantage of using "options provided by instrumentation libraries" (when available) is that the entire context is available, meaning users can select to add or filter additional attributes. For example, the enrich option the HttpClient instrumentation library includes giving users access to the httpRequestMessage itself, to select anything from it and store it as an attribute.

#### Add custom property

Any [attributes](#add-activityspan-attributes) which are added to activity/span will be exported as custom properties. They'll populate the _customDimensions_ field in the requests and/or dependencies tables in Application Insights.

##### [.NET](#tab/net)

1. Many instrumentation libraries provide an enrich option. Refer to Readme of individual instrumentation libraries for guidance.
    - [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.AspNet/README.md#enrich)
    - [ASP.NET Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.AspNetCore/README.md#enrich)
    - [HttpClient and HttpWebRequest](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.Http/README.md#enrich)

2. Using custom processor:

> [!TIP]
> Add the processor shown below BEFORE the Azure monitor exporter.

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

Add `ActivityEnrichingProcessor.cs` to your project with the code below.

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


##### [Node.js](#tab/nodejs)

Using custom processor:

> [!TIP]
> Add the processor shown below BEFORE the Azure monitor exporter.

```typescript
import { AzureMonitorTraceExporter } from "@azure/monitor-opentelemetry-exporter";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { ReadableSpan, SimpleSpanProcessor, Span, SpanProcessor } from "@opentelemetry/sdk-trace-base";

class SpanEnrichingProcessor implements SpanProcessor{
    forceFlush(): Promise<void>{
        return Promise.resolve();
    }
    shutdown(): Promise<void>{
        return Promise.resolve();
    }
    onStart(_span: Span): void{}
    onEnd(span: ReadableSpan){
        span.attributes["CustomDimension1"] = "value1";
        span.attributes["CustomDimension2"] = "value2";
    }
}

const provider = new NodeTracerProvider();
const azureExporter = new AzureMonitorTraceExporter();
provider.addSpanProcessor(new SpanEnrichingProcessor());
provider.addSpanProcessor(new SimpleSpanProcessor(azureExporter));

```

##### [Python](#tab/python)

Using custom processor:

> [!TIP]
> Add the processor shown below BEFORE the Azure monitor exporter.

```python
...
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

trace.set_tracer_provider(TracerProvider())
span_processor = BatchSpanProcessor(exporter)
span_enrich_processor = SpanEnrichingProcessor()
trace.get_tracer_provider().add_span_processor(span_enrich_processor)
trace.get_tracer_provider().add_span_processor(span_processor)
...
```

Add `SpanEnrichingProcessor.py` to your project with the code below.

```python
from opentelemetry.sdk.trace import SpanProcessor

class SpanEnrichingProcessor(SpanProcessor):

    def on_end(self, span):
        span._name = "Updated-" + span.name
        span._attributes["CustomDimension1"] = "Value1"
        span._attributes["CustomDimension2"] = "Value2"

```
---

#### Set user IP

You can populate the _client_IP_ field for requests by setting `http.client_ip` attribute on activity/span. Application Insights uses the IP address to generate user location attributes and then [discards it by default](ip-collection.md#default-behavior).

##### [.NET](#tab/net)

Use the add [custom property example](#add-custom-property), except change out the following lines of code in `ActivityEnrichingProcessor.cs`:

```C#
activity.SetTag("http.client_ip", "<IP Address>");
```

##### [Node.js](#tab/nodejs)

Use the add [custom property example](#add-custom-property), except change out the following lines of code:

```typescript
...
import { SemanticAttributes } from "@opentelemetry/semantic-conventions";

class SpanEnrichingProcessor implements SpanProcessor{
    ...

    onEnd(span: ReadableSpan){
        span.attributes[SemanticAttributes.HTTP_CLIENT_IP] = "<IP Address>";
    }
}
```

##### [Python](#tab/python)

Use the add [custom property example](#add-custom-property), except change out the following lines of code in `SpanEnrichingProcessor.py`:

```python
span._attributes["http.client_ip"] = "<IP Address>"
```

---
<!--

#### Set user ID or authenticated user ID

You can populate the _user_Id_ or _user_Authenticatedid_ field for requests by setting `xyz` or `xyz` attribute on activity/span. User ID is an anonymous user identifier and Authenticated User ID is a known user identifier.

> [!IMPORTANT]
> Consult applicable privacy laws before setting Authenticated User ID.

##### [.NET](#tab/net)

Use the add [custom property example](#add-custom-property), except change out the following lines of code:

```C#
Placeholder
```

##### [Node.js](#tab/nodejs)

Use the add [custom property example](#add-custom-property), except change out the following lines of code:

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

Use the add [custom property example](#add-custom-property), except change out the following lines of code:

```python
span._attributes["enduser.id"] = "<User ID>"
```

---
-->

### Filter telemetry

You may use following ways to filter out telemetry before leaving your application.

#### [.NET](#tab/net)

1. Many instrumentation libraries provide a filter option. Refer to Readme of individual instrumentation libraries for guidance.
    - [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.AspNet/README.md#filter)
    - [ASP.NET Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.AspNetCore/README.md#filter)
    - [HttpClient and HttpWebRequest](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.Http/README.md#filter)

2. Using custom processor:
    
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
    
    Add `ActivityFilteringProcessor.cs` to your project with the code below.
    
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


3. If a particular source is not explicitly added using `AddSource("ActivitySourceName")`, then none of the activities created using that source will be exported.
    
    <!---
    ### Get Trace ID or Span ID
    You may use X or Y to get trace ID and/or span ID. Adding trace ID and/or span ID to existing logging telemetry enables better correlation when debugging and diagnosing issues.
    
    > [!NOTE]
    > If you are manually creating spans for log-based metrics and alerting, you will need to update them to use the metrics API (after it is released) to ensure accuracy.
    
    ```C#
    Placeholder
    ```
    
    For more information, see [GitHub Repo](link).
    --->

#### [Node.js](#tab/nodejs)

1. Exclude url option provided by many http instrumentation libraries.

    Below is an example of how to exclude a certain url from being tracked using the [http/https instrumentation library](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http).
    
    ```typescript
    ...
    import { HttpInstrumentation, HttpInstrumentationConfig } from "@opentelemetry/instrumentation-http";
    
    ...
    const httpInstrumentationConfig: HttpInstrumentationConfig = {
        ignoreIncomingPaths: [new RegExp(/dc.services.visualstudio.com/i)]
    };
    const httpInstrumentation = new HttpInstrumentation(httpInstrumentationConfig);
    provider.register();
    registerInstrumentations({
        instrumentations: [
            httpInstrumentation,
        ]
    });
    
    ```

2. Using custom processor. You can use a custom span processor to exclude certain spans from being exported. To mark spans to not be exported, set their `TraceFlag` to `DEFAULT`.
Use the add [custom property example](#add-custom-property), except change out the following lines of code:

    ```typescript
    ...
    import { SpanKind, TraceFlags } from "@opentelemetry/api";
    
    class SpanEnrichingProcessor implements SpanProcessor{
        ...
    
        onEnd(span: ReadableSpan) {
            if(span.kind == SpanKind.INTERNAL){
                span.spanContext().traceFlags = TraceFlags.NONE;
            }
        }
    }
    ```

#### [Python](#tab/python)

1. Exclude url option provided by many http instrumentation libraries.

    Below is an example of how to exclude a certain url from being tracked using the [Flask](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-flask) instrumentation.
    
    ```python
    ...
    import flask
    
    from opentelemetry.instrumentation.flask import FlaskInstrumentor
    
    # You may also populate OTEL_PYTHON_FLASK_EXCLUDED_URLS env variable
    # List will consist of comma delimited regexes representing which URLs to exclude
    excluded_urls = "client/.*/info,healthcheck"
    
    FlaskInstrumentor().instrument(excluded_urls=excluded_urls) # Do this before flask.Flask
    app = flask.Flask(__name__)
    ...
    ```

2. Using custom processor. You can use a custom span processor to exclude certain spans from being exported. To mark spans to not be exported, set their `TraceFlag` to `DEFAULT`.
    
    ```python
    ...
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor
    
    trace.set_tracer_provider(TracerProvider())
    span_processor = BatchSpanProcessor(exporter)
    span_filter_processor = SpanFilteringProcessor()
    trace.get_tracer_provider().add_span_processor(span_filter_processor)
    trace.get_tracer_provider().add_span_processor(span_processor)
    ...
    ```
    
    Add `SpanFilteringProcessor.py` to your project with the code below.
    
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
    
    <!-- For more information, see [GitHub Repo](link). -->
    <!---
    ### Get Trace ID or Span ID
    You may use X or Y to get trace ID and/or span ID. Adding trace ID and/or span ID to existing logging telemetry enables better correlation when debugging and diagnosing issues.
    
    > [!NOTE]
    > If you are manually creating spans for log-based metrics and alerting, you will need to update them to use the metrics API (after it is released) to ensure accuracy.
    
    ```python
    Placeholder
    ```
    
    For more information, see [GitHub Repo](link).
    --->

---

## Enable OTLP Exporter

You may want to enable the OpenTelemetry Protocol (OTLP) Exporter alongside your Azure Monitor Exporter to send your telemetry to two locations.

> [!NOTE]
> OTLP exporter is shown for convenience only. We do not officially support the OTLP Exporter or any components or third-party experiences downstream of it. We suggest you open an issue with the [OpenTelemetry-Collector](https://github.com/open-telemetry/opentelemetry-collector) for OpenTelemetry issues outside the Azure Support Boundary.

#### [.NET](#tab/net)

1. Install the [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://www.nuget.org/packages/OpenTelemetry.Exporter.OpenTelemetryProtocol/) package along with [Azure.Monitor.OpenTelemetry.Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) in your project.

2. Add following code snippet. This example assumes you have a OpenTelemetry Collector with an OTLP receiver running. For details refer to example [here](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/examples/Console/TestOtlpExporter.cs).

```csharp
// sends data to Application Insights as well as OTLP
using var tracerProvider = Sdk.CreateTracerProviderBuilder()
        .AddSource("OTel.AzureMonitor.Demo")
        .AddAzureMonitorTraceExporter(o =>
        {
            o.ConnectionString = "<Your Connection String>"
        })
        .AddOtlpExporter()
        .Build();
```


#### [Node.js](#tab/nodejs)

1. Install the [OpenTelemetry Collector Exporter](https://www.npmjs.com/package/@opentelemetry/exporter-otlp-http) package along with [Azure Monitor OpenTelemetry Exporter](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter) in your project.


```sh
    npm install @opentelemetry/exporter-otlp-http
    npm install @azure/monitor-opentelemetry-exporter
```

2. Add following code snippet. This example assumes you have a OpenTelemetry Collector with an OTLP receiver running. For details refer to example [here](https://github.com/open-telemetry/opentelemetry-js/tree/main/examples/otlp-exporter-node).

```typescript
const { BasicTracerProvider, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp-http');

const provider = new BasicTracerProvider();
const azureMonitorExporter = new AzureMonitorTraceExporter({
  instrumentationKey: os.environ["APPLICATIONINSIGHTS_CONNECTION_STRING"]
});
const otlpExporter = new OTLPTraceExporter();
provider.addSpanProcessor(new SimpleSpanProcessor(azureMonitorExporter));
provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));
provider.register();
```

#### [Python](#tab/python)

1. Install the [azure-monitor-opentelemetry-exporter](https://pypi.org/project/azure-monitor-opentelemetry-exporter/) and [opentelemetry-exporter-otlp](https://pypi.org/project/opentelemetry-exporter-otlp/) packages.

2. Add following code snippet. This example assumes you have a OpenTelemetry Collector with an OTLP receiver running. For details refer to this [README](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/monitor/azure-monitor-opentelemetry-exporter/samples/traces#collector).

```python
from opentelemetry import trace 

from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter

trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__) 

exporter = AzureMonitorTraceExporter.from_connection_string(
    "<Your Connection String>"
)
otlp_exporter = OTLPSpanExporter(endpoint="http://localhost:4317")
span_processor = BatchSpanProcessor(otlp_exporter) 
trace.get_tracer_provider().add_span_processor(span_processor)

with tracer.start_as_current_span("test"):
    print("Hello world!")
```

---

## Troubleshooting

### Enable diagnostic logging

#### [.NET](#tab/net)

The Azure Monitor exporter uses EventSource for its own internal logging. The
exporter logs are available to any EventListener by opting into the source named
"OpenTelemetry-AzureMonitor-Exporter". Refer to
[ OpenTelemetry Troubleshooting](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry#troubleshooting)
for detailed troubleshooting steps.

#### [Node.js](#tab/nodejs)

Azure Monitor Exporter use OpenTelemetry API Logger for internal logs, this can be enabled using following code. 

```typescript
const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");

const provider = new NodeTracerProvider();
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
provider.register();
```

#### [Python](#tab/python)

The Azure Monitor exporter uses Python standard logging [library](https://docs.python.org/3/library/logging.html) for its own internal logging. OpenTelemetry API and Azure Monitor exporter logs are usually logged in severity level WARNING or ERROR for irregular activity, and INFO for regular/successful activity. The default Python logging library defaults severity level to WARNING, so you must change the severity level to see logs under this severity. Below is an example of how to output logs of ALL severity to the console AND a file.

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

- Operation name is missing on dependency telemetry, which adversely impacts failures and performance tab experience.
- Device model is missing on request and dependency telemetry, which adversely impacts device cohort analysis.
- Database server name is left out of dependency name, which will incorrectly aggregate tables with the same name on different servers.

## Support

- Review troubleshooting steps in this article.
- For Azure support issues, open an [Azure Support Ticket](https://azure.microsoft.com/support/create-ticket/).

### [.NET](#tab/net)

For OpenTelemetry issues, contact the [OpenTelemetry .NET community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.

### [Node.js](#tab/nodejs)

For OpenTelemetry issues, contact the [OpenTelemetry JavaScript community](https://github.com/open-telemetry/opentelemetry-js) directly.

### [Python](#tab/python)

For OpenTelemetry issues, contact the [OpenTelemetry Python community](https://github.com/open-telemetry/opentelemetry-python) directly.

---

## OpenTelemetry feedback

- Fill out the OpenTelemetry community's [customer feedback survey](https://docs.google.com/forms/d/e/1FAIpQLScUt4reClurLi60xyHwGozgM9ZAz8pNAfBHhbTZ4gFWaaXIRQ/viewform).
- Tell Microsoft a bit about yourself by joining our [OpenTelemetry Early Adopter Community](https://aka.ms/AzMonOTel/).
- Engage with other Azure Monitor users at [Microsoft's Tech Community](https://techcommunity.microsoft.com/t5/azure-monitor/bd-p/AzureMonitor).

## Next steps

### [.NET](#tab/net)

- Review the source code at the [Azure Monitor Exporter GitHub Repository](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter).
- To install the NuGet package, check for updates, or view release notes, visit the [Azure Monitor Exporter NuGet Package](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter/) page.
- Become more familiar Azure Monitor Application Insights and OpenTelemetry with the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter/tests/Azure.Monitor.OpenTelemetry.Exporter.Tracing.Customization).
- To learn more about OpenTelemetry and its community, visit the [OpenTelemetry .NET GitHub Repository](https://github.com/open-telemetry/opentelemetry-dotnet).
- [Enable web/browser user monitoring](javascript.md) to enabled usage experiences.


### [Node.js](#tab/nodejs)

- Review the source code at the  [Azure Monitor Exporter GitHub Repository](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter).
- To install the NPM package, check for updates, or view release notes, visit the [Azure Monitor Exporter NPM Package](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter) page.
- Become more familiar Azure Monitor Application Insights and OpenTelemetry with the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter/samples).
- To learn more about OpenTelemetry and its community, visit the [OpenTelemetry JavaScript GitHub Repository](https://github.com/open-telemetry/opentelemetry-js).
- [Enable web/browser user monitoring](javascript.md) to enable usage experiences.

### [Python](#tab/python)

- Review the source code at the [Azure Monitor Exporter GitHub Repository](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/monitor/azure-monitor-opentelemetry-exporter/README.md).
- To install the PyPI package, check for updates, or view release notes, visit the [Azure Monitor Exporter  PyPI Package](https://pypi.org/project/azure-monitor-opentelemetry-exporter/) page.
-  Become more familiar Azure Monitor Application Insights and OpenTelemetry with the [Azure Monitor Example Application](https://github.com/Azure-Samples/azure-monitor-opentelemetry-python).
- To learn more about OpenTelemetry and its community, visit the [OpenTelemetry Python GitHub Repository](https://github.com/open-telemetry/opentelemetry-python).
- [Enable web/browser user monitoring](javascript.md) to enable usage experiences.

---
