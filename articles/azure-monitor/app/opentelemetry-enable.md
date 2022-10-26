---
title: Enable Azure Monitor OpenTelemetry for .NET, Node.js, and Python applications
description: This article provides guidance on how to enable Azure Monitor on applications by using OpenTelemetry.
ms.topic: conceptual
ms.date: 10/21/2022
ms.devlang: csharp, javascript, python
ms.reviewer: mmcc
---

# Enable Azure Monitor OpenTelemetry for .NET, Node.js, and Python applications (preview)

The Azure Monitor OpenTelemetry Exporter is a component that sends traces, and metrics (and eventually all application telemetry) to Azure Monitor Application Insights. To learn more about OpenTelemetry concepts, see the [OpenTelemetry overview](opentelemetry-overview.md) or [OpenTelemetry FAQ](/azure/azure-monitor/faq#opentelemetry).

This article describes how to enable and configure the OpenTelemetry-based Azure Monitor Preview offerings. After you finish the instructions in this article, you'll be able to send OpenTelemetry traces and metrics to Azure Monitor Application Insights.

> [!IMPORTANT]
> The Azure Monitor OpenTelemetry-based Offerings for .NET, Node.js, and Python applications are currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Limitations of the preview release

### [.NET](#tab/net)

Consider whether this preview is right for you. It *enables distributed tracing, metrics* and _excludes_:

 - [Live Metrics](live-stream.md)
 - Logging API (like console logs and logging libraries)
 - [Profiler](profiler-overview.md)
 - [Snapshot Debugger](snapshot-debugger.md)
 - [Azure Active Directory authentication](azure-ad-authentication.md)
 - Autopopulation of Cloud Role Name and Cloud Role Instance in Azure environments
 - Autopopulation of User ID and Authenticated User ID when you use the [Application Insights JavaScript SDK](javascript.md)
 - Autopopulation of User IP (to determine location attributes)
 - Ability to override [Operation Name](correlation.md#data-model-for-telemetry-correlation)
 - Ability to manually set User ID or Authenticated User ID
 - Propagating Operation Name to Dependency Telemetry
 - [Instrumentation libraries](#instrumentation-libraries) support on Azure Functions
 - [Status](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md#set-status) supports statuscode(unset,ok,error) and status-description. "Status Description" is ignored by Azure Monitor Exporters.

If you require a full-feature experience, use the existing Application Insights [ASP.NET](asp-net.md), or [ASP.NET Core](asp-net-core.md) SDK until the OpenTelemetry-based offering matures.

### [Node.js](#tab/nodejs)

Consider whether this preview is right for you. It *enables distributed tracing, metrics* and _excludes_:

 - [Live Metrics](live-stream.md)
 - Logging API (like console logs and logging libraries)
 - Autopopulation of Cloud Role Name and Cloud Role Instance in Azure environments
 - Autopopulation of User ID and Authenticated User ID when you use the [Application Insights JavaScript SDK](javascript.md)
 - Autopopulation of User IP (to determine location attributes)
 - Ability to override [Operation Name](correlation.md#data-model-for-telemetry-correlation)
 - Ability to manually set User ID or Authenticated User ID
 - Propagating Operation Name to Dependency Telemetry
 - [Status](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md#set-status) only supports statuscode(unset,ok,error) and status-description. "Status Description" is ignored by Azure Monitor Exporters.

If you require a full-feature experience, use the existing [Application Insights Node.js SDK](nodejs.md) until the OpenTelemetry-based offering matures.

> [!WARNING]
> At present, this exporter only works for Node.js environments. Use the [Application Insights JavaScript SDK](javascript.md) for web and browser scenarios.

### [Python](#tab/python)

Consider whether this preview is right for you. It *enables distributed tracing, metrics* and _excludes_:

 - [Live Metrics](live-stream.md)
 - Logging API (like console logs and logging libraries)
 - [Azure Active Directory authentication](azure-ad-authentication.md)
 - Autopopulation of Cloud Role Name and Cloud Role Instance in Azure environments
 - Autopopulation of User ID and Authenticated User ID when you use the [Application Insights JavaScript SDK](javascript.md)
 - Autopopulation of User IP (to determine location attributes)
 - Ability to override [Operation Name](correlation.md#data-model-for-telemetry-correlation)
 - Ability to manually set User ID or Authenticated User ID
 - Propagating Operation Name to Dependency Telemetry
 - [Instrumentation libraries](#instrumentation-libraries) support on Azure Functions
 - [Status](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md#set-status) only supports statuscode(unset,ok,error) and status-description. "Status Description" is ignored by Azure Monitor Exporters.

If you require a full-feature experience, use the existing [Application Insights Python-OpenCensus SDK](opencensus-python.md) until the OpenTelemetry-based offering matures.

---

## Get started

Follow the steps in this section to instrument your application with OpenTelemetry.

### Prerequisites

- Azure subscription: [Create an Azure subscription for free](https://azure.microsoft.com/free/)
- Application Insights resource: [Create an Application Insights resource](create-workspace-resource.md#create-a-workspace-based-resource)

### [.NET](#tab/net)

- Application using an officially supported version of [.NET Core](https://dotnet.microsoft.com/download/dotnet) or [.NET Framework](https://dotnet.microsoft.com/download/dotnet-framework) that's at least .NET Framework 4.6.2

### [Node.js](#tab/nodejs)

- Application using an officially [supported version](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter#currently-supported-environments) of Node.js runtime:
  - [OpenTelemetry supported runtimes](https://github.com/open-telemetry/opentelemetry-js#supported-runtimes)
  - [Azure Monitor OpenTelemetry Exporter supported runtimes](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter#currently-supported-environments)

### [Python](#tab/python)

- Python Application using version 3.7+

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

#### [Node.js](#tab/nodejs)

Install these packages:

- [@opentelemetry/sdk-trace-base](https://www.npmjs.com/package/@opentelemetry/sdk-trace-base)
- [@opentelemetry/sdk-trace-node](https://www.npmjs.com/package/@opentelemetry/sdk-trace-node)
- [@opentelemetry/sdk-metrics](https://www.npmjs.com/package/@opentelemetry/sdk-metrics)
- [@azure/monitor-opentelemetry-exporter](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter)

```sh
npm install @opentelemetry/sdk-trace-base
npm install @opentelemetry/sdk-trace-node
npm install @opentelemetry/sdk-metrics
npm install @azure/monitor-opentelemetry-exporter
```

The following packages are also used for some specific scenarios described later in this article:

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

Install the latest [azure-monitor-opentelemetry-exporter](https://pypi.org/project/azure-monitor-opentelemetry-exporter/) PyPI package:

```sh
pip install azure-monitor-opentelemetry-exporter --pre
```

---

### Enable Azure Monitor Application Insights

This section provides guidance that shows how to enable OpenTelemetry.

#### Add OpenTelemetry instrumentation code


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

##### [Node.js](#tab/nodejs)

The following code demonstrates how to enable OpenTelemetry in a simple Node.js application:

```typescript
const { AzureMonitorTraceExporter } = require("@azure/monitor-opentelemetry-exporter");
const { BatchSpanProcessor, Span } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");

const provider = new NodeTracerProvider();
provider.register();

// Create an exporter instance.
const exporter = new AzureMonitorTraceExporter({
  connectionString: "<Your Connection String>"
});

// Add the exporter to the provider.
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

function doWork(parent: Span) {
  // Start another span. In this example, the main method already started a
  // span, so that will be the parent span, and this will be a child span.
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parent);
  const span = tracer.startSpan("doWork", undefined, ctx);
  // Simulate some random work.
  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // empty
  }
  // Set attributes to the span.
  span.setAttribute("key", "value");
  // Annotate our span to capture metadata about our operation.
  span.addEvent("invoking doWork");
  span.end();
}
```

##### [Python](#tab/python)

The following code demonstrates how to enable OpenTelemetry in a simple Python application:

```python
import os
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter

exporter = AzureMonitorTraceExporter(connection_string="<Your Connection String>")

trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)
span_processor = BatchSpanProcessor(exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

with tracer.start_as_current_span("hello"):
    print("Hello, World!")

```

---

> [!TIP]
> Add [instrumentation libraries](#instrumentation-libraries) to autocollect telemetry across popular frameworks and libraries.

#### Set the Application Insights connection string

Replace the placeholder `<Your Connection String>` in the preceding code with the connection string from *your* Application Insights resource.

:::image type="content" source="media/opentelemetry/connection-string.png" alt-text="Screenshot of the Application Insights connection string.":::

#### Confirm data is flowing

Run your application and open your **Application Insights Resource** tab in the Azure portal. It might take a few minutes for data to show up in the portal.

> [!NOTE]
> If you can't run the application or you aren't getting data as expected, see [Troubleshooting](#troubleshooting).

:::image type="content" source="media/opentelemetry/server-requests.png" alt-text="Screenshot of the Application Insights Overview tab with server requests and server response time highlighted.":::

> [!IMPORTANT]
> If you have two or more services that emit telemetry to the same Application Insights resource, you're required to [set Cloud Role Names](#set-the-cloud-role-name-and-the-cloud-role-instance) to represent them properly on the Application Map.

As part of using Application Insights instrumentation, we collect and send diagnostic data to Microsoft. This data helps us run and improve Application Insights. You may disable nonessential data collection. To learn more, see [Statsbeat in Azure Application Insights](./statsbeat.md).

## Set the Cloud Role Name and the Cloud Role Instance

You might set the [Cloud Role Name](app-map.md#understand-the-cloud-role-name-within-the-context-of-an-application-map) and the Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. This step updates Cloud Role Name and Cloud Role Instance from their default values to something that makes sense to your team. They'll appear on the Application Map as the name underneath a node. Cloud Role Name uses `service.namespace` and `service.name` attributes, although it falls back to `service.name` if `service.namespace` isn't set. Cloud Role Instance uses the `service.instance.id` attribute value.

### [.NET](#tab/net)

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


### [Node.js](#tab/nodejs)

```typescript
...
import { NodeTracerProvider, NodeTracerConfig } from "@opentelemetry/sdk-trace-node";
import { MeterProvider, MeterProviderOptions } from "@opentelemetry/sdk-metrics";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

// ----------------------------------------
// Setting role name and role instance
// ----------------------------------------
const testResource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "my-helloworld-service",
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: "my-namespace",
    [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: "my-instance",
});
const tracerProviderConfig: NodeTracerConfig = {
    resource: testResource
};
const meterProviderConfig: MeterProviderOptions = {
    resource: testResource
};

// ----------------------------------------
// Done setting role name and role instance
// ----------------------------------------
const tracerProvider = new NodeTracerProvider(tracerProviderConfig);
const meterProvider = new MeterProvider(meterProviderConfig);
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
# ----------------------------------------
# Setting role name and role instance
# ----------------------------------------
                SERVICE_NAMESPACE: "my-namespace",
                SERVICE_INSTANCE_ID: "my-instance",
# ----------------------------------------------
# Done setting role name and role instance
# ----------------------------------------------
            }
        )
    )
)
...
```

---

For information on standard attributes for resources, see [Resource Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/README.md).

## Enable Sampling

You may want to enable sampling to reduce your data ingestion volume, which reduces your cost. Azure Monitor provides a custom *fixed-rate* sampler that populates events with a "sampling ratio", which Application Insights converts to "ItemCount". The *fixed-rate* sampler ensures accurate experiences and event counts. The sampler is designed to preserve your traces across services, and it's interoperable with older Application Insights SDKs. The sampler expects a sample rate of between 0 and 1 inclusive. A rate of 0.1 means approximately 10% of your traces will be sent. For more information, see [Learn More about sampling](sampling.md#brief-summary).

> [!NOTE] 
> Metrics are unaffected by sampling.

#### [.NET](#tab/net)

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

#### [Node.js](#tab/nodejs)

```typescript
...
import { BasicTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { ApplicationInsightsSampler, AzureMonitorTraceExporter } from "@azure/monitor-opentelemetry-exporter";

// Sampler expects a sample rate of between 0 and 1 inclusive
// A rate of 0.1 means approximately 10% of your traces are sent
const aiSampler = new ApplicationInsightsSampler(0.75);
const provider = new BasicTracerProvider({
  sampler: aiSampler
});
const exporter = new AzureMonitorTraceExporter({
  connectionString:
    process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"] || "<your connection string>",
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
```

#### [Python](#tab/python)

In this example, we utilize the `ApplicationInsightsSampler`, which offers compatibility with Application Insights SDKs.

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from azure.monitor.opentelemetry.exporter import (
    ApplicationInsightsSampler,
    AzureMonitorTraceExporter,
)

# Sampler expects a sample rate of between 0 and 1 inclusive
# 0.1 means approximately 10% of your traces are sent
sampler = ApplicationInsightsSampler(0.1)
trace.set_tracer_provider(TracerProvider(sampler=sampler))
tracer = trace.get_tracer(__name__)
exporter = AzureMonitorTraceExporter(connection_string="<your-connection-string>")
span_processor = BatchSpanProcessor(exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

for i in range(100):
    # Approximately 90% of these spans should be sampled out
    with tracer.start_as_current_span("hello"):
        print("Hello, World!")
```

---

> [!TIP]
> If you're not sure where to set the sampling rate, start at 5% (i.e., 0.05 sampling ratio) and adjust the rate based on the accuracy of the operations shown in the failures and performance blades. A higher rate generally results in higher accuracy. However, ANY sampling will affect accuracy so we recommend alerting on [OpenTelemetry metrics](#metrics), which are unaffected by sampling.

## Instrumentation libraries

The following libraries are validated to work with the preview release.

> [!WARNING]
> Instrumentation libraries are based on experimental OpenTelemetry specifications. Microsoft's *preview* support commitment is to ensure that the following libraries emit data to Azure Monitor Application Insights, but it's possible that breaking changes or experimental mapping will block some data elements.

### Distributed Tracing

#### [.NET](#tab/net)

Requests
- [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/Instrumentation.AspNet-1.0.0-rc9.6/src/OpenTelemetry.Instrumentation.AspNet/README.md) (1) version:
  [1.0.0-rc9.6](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNet/1.0.0-rc9.6)
- [ASP.NET
  Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.7/src/OpenTelemetry.Instrumentation.AspNetCore/README.md) (1) version:
  [1.0.0-rc9.7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNetCore/1.0.0-rc9.7)

Dependencies
- [HTTP
  clients](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.7/src/OpenTelemetry.Instrumentation.Http/README.md) (1) version:
  [1.0.0-rc9.7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http/1.0.0-rc9.7)
- [SQL
  client](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.7/src/OpenTelemetry.Instrumentation.SqlClient/README.md) (1) version:
  [1.0.0-rc9.7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient/1.0.0-rc9.7)

#### [Node.js](#tab/nodejs)

Requests/Dependencies
- [http/https](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http/README.md) version:
  [0.33.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-http/v/0.33.0)
  
Dependencies
- [mysql](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-mysql) version:
  [0.25.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-mysql/v/0.25.0)

#### [Python](#tab/python)

Requests
- [Django](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-django) (1) version:
  [0.34b0](https://pypi.org/project/opentelemetry-instrumentation-django/0.34b0/)
- [Flask](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-flask) (1) version:
  [0.34b0](https://pypi.org/project/opentelemetry-instrumentation-flask/0.34b0/)

Dependencies
- [Psycopg2](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-psycopg2) version:
  [0.34b0](https://pypi.org/project/opentelemetry-instrumentation-psycopg2/0.34b0/)
- [Requests](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-requests) (1) version:
  [0.34b0](https://pypi.org/project/opentelemetry-instrumentation-requests/0.34b0/)

---

(1) Supports automatic reporting (as SpanEvent) of unhandled exceptions


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

#### [Node.js](#tab/nodejs)

- [http/https](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http/README.md) version:
  [0.33.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-http/v/0.33.0)

#### [Python](#tab/python)

- [Django](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-django) version:
  [0.34b0](https://pypi.org/project/opentelemetry-instrumentation-django/0.34b0/)
- [Flask](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-flask) version:
  [0.34b0](https://pypi.org/project/opentelemetry-instrumentation-flask/0.34b0/)
- [Requests](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-requests) version:
  [0.34b0](https://pypi.org/project/opentelemetry-instrumentation-requests/0.34b0/)

---

> [!TIP]
> The OpenTelemetry-based offerings currently emit all metrics as [Custom Metrics](#add-custom-metrics) in Metrics Explorer. Whatever you set as the meter name becomes the metrics namespace.

## Modify telemetry

This section explains how to modify telemetry.

### Add span attributes

To add span attributes, use either of the following two ways:

* Use options provided by [instrumentation libraries](#instrumentation-libraries).
* Add a custom span processor.

These attributes might include adding a custom property to your telemetry. You might also use attributes to set optional fields in the Application Insights schema, like Client IP.

> [!TIP]
> The advantage of using options provided by instrumentation libraries, when they're available, is that the entire context is available. As a result, users can select to add or filter more attributes. For example, the enrich option in the HttpClient instrumentation library gives users access to the httpRequestMessage itself. They can select anything from it and store it as an attribute.

#### Add a custom property to a Trace

Any [attributes](#add-span-attributes) you add to spans are exported as custom properties. They populate the _customDimensions_ field in the requests or the dependencies tables in Application Insights.

##### [.NET](#tab/net)

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

##### [Node.js](#tab/nodejs)

Use a custom processor:

> [!TIP]
> Add the processor shown here *before* the Azure Monitor Exporter.

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

Use a custom processor:

> [!TIP]
> Add the processor shown here *before* the Azure Monitor Exporter.

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

Use the add [custom property example](#add-a-custom-property-to-a-trace), but replace the following lines of code in `ActivityEnrichingProcessor.cs`:

```C#
// only applicable in case of activity.Kind == Server
activity.SetTag("http.client_ip", "<IP Address>");
```

##### [Node.js](#tab/nodejs)

Use the add [custom property example](#add-a-custom-property-to-a-trace), but replace the following lines of code:

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

Use the add [custom property example](#add-a-custom-property-to-a-trace), but replace the following lines of code in `SpanEnrichingProcessor.py`:

```python
span._attributes["http.client_ip"] = "<IP Address>"
```

---
<!--

#### Set the user ID or authenticated user ID

You can populate the _user_Id_ or _user_Authenticatedid_ field for requests by setting the `xyz` or `xyz` attribute on the span. User ID is an anonymous user identifier. Authenticated User ID is a known user identifier.

> [!IMPORTANT]
> Consult applicable privacy laws before you set the Authenticated User ID.

##### [.NET](#tab/net)

Use the add [custom property example](#add-a-custom-property-to-a-trace), but replace the following lines of code:

```C#
Placeholder
```

##### [Node.js](#tab/nodejs)

Use the add [custom property example](#add-a-custom-property-to-a-trace), but replace the following lines of code:

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

Use the add [custom property example](#add-a-custom-property-to-a-trace), but replace the following lines of code:

```python
span._attributes["enduser.id"] = "<User ID>"
```

---
-->

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

#### [Node.js](#tab/nodejs)

1. Exclude the URL option provided by many HTTP instrumentation libraries.

    The following example shows how to exclude a certain URL from being tracked by using the [HTTP/HTTPS instrumentation library](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http):
    
    ```typescript
    import { IncomingMessage } from "http";
    import { RequestOptions } from "https";
    import { registerInstrumentations } from "@opentelemetry/instrumentation";
    import { HttpInstrumentation, HttpInstrumentationConfig } from "@opentelemetry/instrumentation-http";
    import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";


    const httpInstrumentationConfig: HttpInstrumentationConfig = {
        ignoreIncomingRequestHook: (request: IncomingMessage) => {
            // Ignore OPTIONS incoming requests
            if (request.method === 'OPTIONS') {
                return true;
            }
            return false;
        },
        ignoreOutgoingRequestHook: (options: RequestOptions) => {
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

1. Use a custom processor. You can use a custom span processor to exclude certain spans from being exported. To mark spans to not be exported, set `TraceFlag` to `DEFAULT`.
Use the add [custom property example](#add-a-custom-property-to-a-trace), but replace the following lines of code:

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

1. Exclude the URL option provided by many HTTP instrumentation libraries.

    The following example shows how to exclude a certain URL from being tracked by using the [Flask](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-flask) instrumentation:
    
    ```python
    ...
    import flask
    
    from opentelemetry.instrumentation.flask import FlaskInstrumentor
    
    # You might also populate OTEL_PYTHON_FLASK_EXCLUDED_URLS env variable
    # List will consist of comma delimited regexes representing which URLs to exclude
    excluded_urls = "client/.*/info,healthcheck"
    
    FlaskInstrumentor().instrument(excluded_urls=excluded_urls) # Do this before flask.Flask
    app = flask.Flask(__name__)
    ...
    ```

1. Use a custom processor. You can use a custom span processor to exclude certain spans from being exported. To mark spans to not be exported, set `TraceFlag` to `DEFAULT`.
    
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
    
    <!-- For more information, see [GitHub Repo](link). -->
    <!---
    ### Get the trace ID or span ID
    You might use X or Y to get the trace ID or span ID. Adding a trace ID or span ID to existing logging telemetry enables better correlation when you debug and diagnose issues.
    
    > [!NOTE]
    > If you manually create spans for log-based metrics and alerting, you need to update them to use the metrics API (after it's released) to ensure accuracy.
    
    ```python
    Placeholder
    ```
    
    For more information, see [GitHub Repo](link).
    --->

---

## Custom telemetry

This section explains how to collect custom telemetry from your application.

### Add Custom Metrics

> [!NOTE]
> Custom Metrics are under preview in Azure Monitor Application Insights. Custom metrics without dimensions are available by default. To view and alert on dimensions, you need to [opt-in](pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation).

You may want to collect metrics beyond what is collected by [instrumentation libraries](#instrumentation-libraries).

The OpenTelemetry API offers six metric "instruments" to cover various metric scenarios and you'll need to pick the correct "Aggregation Type" when visualizing metrics in Metrics Explorer. This requirement is true when using the OpenTelemetry Metric API to send metrics and when using an instrumentation library.

The following table shows the recommended [aggregation types](/essentials/metrics-aggregation-explained.md#aggregation-types) for each of the OpenTelemetry Metric Instruments.

| OpenTelemetry Instrument                             | Azure Monitor Aggregation Type                             |
|------------------------------------------------------|------------------------------------------------------------|
| Counter                                              | Sum                                                        |
| Asynchronous Counter                                 | Sum                                                        |
| Histogram                                            | Average, Sum, Count (Max, Min for Python and Node.js only) |
| Asynchronous Gauge                                   | Average                                                    |
| UpDownCounter (Python and Node.js only)              | Sum                                                        |
| Asynchronous UpDownCounter (Python and Node.js only) | Sum                                                        |

> [!CAUTION]
> Aggregation types beyond what's shown in the table typically aren't meaningful.

The [OpenTelemetry Specification](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/api.md#instrument)
describes the instruments and provides examples of when you might use each one.

> [!TIP]
> The histogram is the most versatile and most closely equivalent to the prior Application Insights Track Metric API.  Azure Monitor currently flattens the histogram instrument into our five supported aggregation types, and support for percentiles is underway. Although less versatile, other OpenTelemetry instruments have a lesser impact on your application's performance.

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

#### [Node.js](#tab/nodejs)

 ```typescript
    import {
        MeterProvider,
        PeriodicExportingMetricReader,
        PeriodicExportingMetricReaderOptions
    } from "@opentelemetry/sdk-metrics";
    import { AzureMonitorMetricExporter } from "@azure/monitor-opentelemetry-exporter";

    const provider = new MeterProvider();
    const exporter = new AzureMonitorMetricExporter({
    connectionString:
        process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"] || "<your connection string>",
    });
    const metricReaderOptions: PeriodicExportingMetricReaderOptions = {
        exporter: exporter,
    };
    const metricReader = new PeriodicExportingMetricReader(metricReaderOptions);
    provider.addMetricReader(metricReader);
    const meter = provider.getMeter("OTel.AzureMonitor.Demo");
    let histogram = meter.createHistogram("histogram");
    histogram.record(1, { "testKey": "testValue" });
    histogram.record(30, { "testKey": "testValue2" });
    histogram.record(100, { "testKey2": "testValue" });
```

#### [Python](#tab/python)

```python
from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader

from azure.monitor.opentelemetry.exporter import AzureMonitorMetricExporter

exporter = AzureMonitorMetricExporter(connection_string="<your-connection-string")
reader = PeriodicExportingMetricReader(exporter)
metrics.set_meter_provider(MeterProvider(metric_readers=[reader]))
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

#### [Node.js](#tab/nodejs)

```typescript
    import {
        MeterProvider,
        PeriodicExportingMetricReader,
        PeriodicExportingMetricReaderOptions
    } from "@opentelemetry/sdk-metrics";
    import { AzureMonitorMetricExporter } from "@azure/monitor-opentelemetry-exporter";

    const provider = new MeterProvider();
    const exporter = new AzureMonitorMetricExporter({
    connectionString:
        process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"] || "<your connection string>",
    });
    const metricReaderOptions: PeriodicExportingMetricReaderOptions = {
        exporter: exporter,
    };
    const metricReader = new PeriodicExportingMetricReader(metricReaderOptions);
    provider.addMetricReader(metricReader);
    const meter = provider.getMeter("OTel.AzureMonitor.Demo");
    let counter = meter.createCounter("counter");
    counter.add(1, { "testKey": "testValue" });
    counter.add(5, { "testKey2": "testValue" });
    counter.add(3, { "testKey": "testValue2" });
```

#### [Python](#tab/python)

```python
from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader

from azure.monitor.opentelemetry.exporter import AzureMonitorMetricExporter

exporter = AzureMonitorMetricExporter(connection_string="<your-connection-string")
reader = PeriodicExportingMetricReader(exporter)
metrics.set_meter_provider(MeterProvider(metric_readers=[reader]))
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

#### [Node.js](#tab/nodejs)

```typescript
    import {
        MeterProvider,
        PeriodicExportingMetricReader,
        PeriodicExportingMetricReaderOptions
    } from "@opentelemetry/sdk-metrics";
    import { AzureMonitorMetricExporter } from "@azure/monitor-opentelemetry-exporter";

    const provider = new MeterProvider();
    const exporter = new AzureMonitorMetricExporter({
    connectionString:
        process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"] || "<your connection string>",
    });
    const metricReaderOptions: PeriodicExportingMetricReaderOptions = {
        exporter: exporter,
    };
    const metricReader = new PeriodicExportingMetricReader(metricReaderOptions);
    provider.addMetricReader(metricReader);
    const meter = provider.getMeter("OTel.AzureMonitor.Demo");
    let gauge = meter.createObservableGauge("gauge");
    gauge.addCallback((observableResult: ObservableResult) => {
        let randomNumber = Math.floor(Math.random() * 100);
        observableResult.observe(randomNumber, {"testKey": "testValue"});
    });
```

#### [Python](#tab/python)

```python
from typing import Iterable

from opentelemetry import metrics
from opentelemetry.metrics import CallbackOptions, Observation
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader

from azure.monitor.opentelemetry.exporter import AzureMonitorMetricExporter

exporter = AzureMonitorMetricExporter(connection_string="<your-connection-string")
reader = PeriodicExportingMetricReader(exporter)
metrics.set_meter_provider(MeterProvider(metric_readers=[reader]))
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

Select instrumentation libraries automatically support exceptions to Application Insights.
However, you may want to manually report exceptions beyond what instrumentation libraries report.
For instance, exceptions caught by your code aren't* ordinarily reported. You may wish to report them
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

#### [Node.js](#tab/nodejs)

```typescript
import * as opentelemetry from "@opentelemetry/api";
import { BasicTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { AzureMonitorTraceExporter } from "@azure/monitor-opentelemetry-exporter";

const provider = new BasicTracerProvider();
const exporter = new AzureMonitorTraceExporter({
    connectionString:
        process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"] || "<your connection string>",
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter as any));
provider.register();
const tracer = opentelemetry.trace.getTracer("example-basic-tracer-node");
let span = tracer.startSpan("hello");
try{
    throw new Error("Test Error");
}
catch(error){
    span.recordException(error);
}
```

#### [Python](#tab/python)

The OpenTelemetry Python SDK is implemented such that exceptions thrown will automatically be captured and recorded. See below for an example of this.

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter

exporter = AzureMonitorTraceExporter(connection_string="<your-connection-string>")

trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer("otel_azure_monitor_exception_demo")
span_processor = BatchSpanProcessor(exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

# Exception events
try:
    with tracer.start_as_current_span("hello") as span:
        # This exception will be automatically recorded
        raise Exception("Custom exception message.")
except Exception:
    print("Exception raised")

```

If you would like to record exceptions manually, you can disable that option when creating the span as show below.

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

## Enable the OTLP Exporter

You might want to enable the OpenTelemetry Protocol (OTLP) Exporter alongside your Azure Monitor Exporter to send your telemetry to two locations.

> [!NOTE]
> The OTLP Exporter is shown for convenience only. We don't officially support the OTLP Exporter or any components or third-party experiences downstream of it. We suggest you open an issue with the [OpenTelemetry-Collector](https://github.com/open-telemetry/opentelemetry-collector) for OpenTelemetry issues outside the Azure support boundary.

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

#### [Node.js](#tab/nodejs)

1. Install the [OpenTelemetry Collector Exporter](https://www.npmjs.com/package/@opentelemetry/exporter-otlp-http) package along with the [Azure Monitor OpenTelemetry Exporter](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter) in your project.

    ```sh
        npm install @opentelemetry/exporter-otlp-http
        npm install @azure/monitor-opentelemetry-exporter
    ```

1. Add the following code snippet. This example assumes you have an OpenTelemetry Collector with an OTLP receiver running. For details, see the [example on GitHub](https://github.com/open-telemetry/opentelemetry-js/tree/main/examples/otlp-exporter-node).

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

1. Add the following code snippet. This example assumes you have an OpenTelemetry Collector with an OTLP receiver running. For details, see this [README](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/monitor/azure-monitor-opentelemetry-exporter/samples/traces#collector).
    
    ```python
    from opentelemetry import trace 
    
    from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor
    
    from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter
    
    trace.set_tracer_provider(TracerProvider())
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

To improve reliability and resiliency, Azure Monitor OpenTelemetry-based offerings write to offline/local storage by default when an application loses its connection with Application Insights. It saves the application telemetry for 48 hours and periodically tries to send it again. In addition to exceeding the allowable time, telemetry will occasionally be dropped in high-load applications when the maximum file size is exceeded or the SDK doesn't have an opportunity to clear out the file. If we need to choose, the product will save more recent events over old ones. In some cases, you may wish to disable this feature to optimize application performance. [Learn More](data-retention-privacy.md#does-the-sdk-create-temporary-local-storage)

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

#### [Node.js](#tab/nodejs)

By default, the AzureMonitorExporter uses one of the following locations for offline storage.

- Windows
  - %TEMP%\Microsoft\AzureMonitor
- Non-Windows
  - %TMPDIR%/Microsoft/AzureMonitor
  - /var/tmp/Microsoft/AzureMonitor

To override the default directory, you should set `storageDirectory`.

For example:
```typescript
const exporter = new AzureMonitorTraceExporter({
    connectionString:
        process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"] || "<your connection string>",
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
exporter = AzureMonitorTraceExporter(connection_string="your-connection-string", storage_directory="C:\\SomeDirectory")
...

```

To disable this feature, you should set `disable_offline_storage` to `True`. Defaults to `False`.

For example:
```python
...
exporter = AzureMonitorTraceExporter(connection_string="your-connection-string", disable_offline_storage=True)
...

```

---

## Troubleshooting

This section provides help with troubleshooting.

### Enable diagnostic logging

#### [.NET](#tab/net)

The Azure Monitor Exporter uses EventSource for its own internal logging. The exporter logs are available to any EventListener by opting into the source named OpenTelemetry-AzureMonitor-Exporter. For troubleshooting steps, see [OpenTelemetry Troubleshooting](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry#troubleshooting).

#### [Node.js](#tab/nodejs)

Azure Monitor Exporter uses the OpenTelemetry API Logger for internal logs. To enable it, use the following code:

```typescript
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

- Operation name is missing on dependency telemetry, which adversely affects failures and performance tab experience.
- Device model is missing on request and dependency telemetry, which adversely affects device cohort analysis.
- Database server name is left out of dependency name, which incorrectly aggregates tables with the same name on different servers.

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Support

To get support:
- Review troubleshooting steps in this article.
- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).

### [.NET](#tab/net)

For OpenTelemetry issues, contact the [OpenTelemetry .NET community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.

### [Node.js](#tab/nodejs)

For OpenTelemetry issues, contact the [OpenTelemetry JavaScript community](https://github.com/open-telemetry/opentelemetry-js) directly.

### [Python](#tab/python)

For OpenTelemetry issues, contact the [OpenTelemetry Python community](https://github.com/open-telemetry/opentelemetry-python) directly.

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

### [Node.js](#tab/nodejs)

- To review the source code, see the [Azure Monitor Exporter GitHub repository](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter).
- To install the npm package, check for updates, or view release notes, see the [Azure Monitor Exporter npm Package](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter/samples).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry JavaScript GitHub repository](https://github.com/open-telemetry/opentelemetry-js).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

### [Python](#tab/python)

- To review the source code, see the [Azure Monitor Exporter GitHub repository](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/monitor/azure-monitor-opentelemetry-exporter/README.md).
- To install the PyPI package, check for updates, or view release notes, see the [Azure Monitor Exporter  PyPI Package](https://pypi.org/project/azure-monitor-opentelemetry-exporter/) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure-Samples/azure-monitor-opentelemetry-python).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry Python GitHub repository](https://github.com/open-telemetry/opentelemetry-python).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

---
