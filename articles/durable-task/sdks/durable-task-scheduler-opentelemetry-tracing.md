---
author: hhunter-ms
title: OpenTelemetry and distributed tracing with Durable Task Scheduler
description: Learn how to enable OpenTelemetry distributed tracing to visualize orchestration flows in Durable Functions and Durable Task SDKs with Durable Task Scheduler.
ms.topic: how-to
ms.date: 03/03/2026
ms.author: azfuncdf
ms.service: durable-task
ms.subservice: durable-task-sdks
ms.devlang: csharp
zone_pivot_groups: azure-durable-approach
---

# OpenTelemetry and distributed tracing with Durable Task Scheduler

Distributed tracing provides end-to-end visibility into orchestration execution. When you enable OpenTelemetry with [Durable Task Scheduler](../scheduler/durable-task-scheduler.md), each orchestration, activity, and sub-orchestration produces linked spans that show timing, ordering, and errors across the entire workflow. You can export these traces to any OpenTelemetry-compatible backend, like [Azure Monitor Application Insights](/azure/azure-monitor/app/app-insights-overview), [Jaeger](https://www.jaegertracing.io/), or [Zipkin](https://zipkin.io/).

[Durable Functions](../common/what-is-durable-task.md) and the standalone [Durable Task SDKs](../sdks/durable-task-overview.md) both support OpenTelemetry distributed tracing when using Durable Task Scheduler as the backend.

## How it works

The Durable Task SDKs automatically instrument orchestrations and activities with OpenTelemetry spans. The SDK creates a parent span for each orchestration and child spans for each activity call, sub-orchestration, and timer. Trace context propagates automatically across all these operations, so you get a single, correlated trace for the entire workflow.

The resulting trace tree looks like:

```
create_orchestration (client)
  └─ orchestration (server)
       ├─ activity:Step1
       ├─ activity:Step2
       └─ activity:Step3
```

You don't need to add custom instrumentation to your orchestrator or activity code. Register the `Microsoft.DurableTask` activity source with your OpenTelemetry configuration, and the SDK handles the rest.

## Prerequisites

::: zone pivot="durable-functions"

- An Azure Functions project with the [Durable Functions extension](../../azure-functions/durable-functions/durable-functions-versions.md) version 2.13.0 or later.
- [Durable Task Scheduler](../scheduler/durable-task-scheduler.md) configured as the storage back end for your function app.
- An OpenTelemetry-compatible back end for viewing traces (Application Insights, Jaeger, or another OTLP collector).

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later.
- The `Microsoft.DurableTask.Worker.AzureManaged` and `Microsoft.DurableTask.Client.AzureManaged` NuGet packages.
- The `OpenTelemetry`, `OpenTelemetry.Extensions.Hosting`, and `OpenTelemetry.Exporter.OpenTelemetryProtocol` NuGet packages.

# [JavaScript](#tab/javascript)

- [Node.js 22](https://nodejs.org/) or later.
- The `@microsoft/durabletask-js` and `@microsoft/durabletask-js-azuremanaged` npm packages.
- The `@opentelemetry/sdk-node`, `@opentelemetry/exporter-trace-otlp-http`, and `@opentelemetry/sdk-trace-base` npm packages.

# [Python](#tab/python)

- [Python 3.9](https://www.python.org/downloads/) or later.
- The `durabletask` pip package.
- The `opentelemetry-sdk`, `opentelemetry-exporter-otlp-proto-grpc`, and `opentelemetry-api` pip packages.

# [Java](#tab/java)

- [Java 21](/java/openjdk/download) or later.
- The `durabletask-client` and `durabletask-azuremanaged` Maven dependencies.
- The `opentelemetry-api`, `opentelemetry-sdk`, and `opentelemetry-exporter-otlp` dependencies.

---

- An OpenTelemetry-compatible back end for viewing traces, like [Application Insights](/azure/azure-monitor/app/app-insights-overview) for production or [Jaeger](https://www.jaegertracing.io/) for local development.

::: zone-end

## Enable distributed tracing

::: zone pivot="durable-functions"

To enable distributed tracing in Durable Functions, update your `host.json` and configure an OpenTelemetry-compatible telemetry backend.

### Update host.json

Add the `tracing` section under `durableTask` in your *host.json* file:

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "tracing": {
        "DistributedTracingEnabled": true,
        "Version": "V2"
      }
    }
  }
}
```

### Configure Application Insights

Set the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable in your function app.

For local development, add it to *local.settings.json*:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "APPLICATIONINSIGHTS_CONNECTION_STRING": "<your-connection-string>"
  }
}
```

For Azure-hosted apps, add it as an application setting under **Configuration** in the Azure portal.

> [!NOTE]
> If you previously used `APPINSIGHTS_INSTRUMENTATIONKEY`, switch to `APPLICATIONINSIGHTS_CONNECTION_STRING` for the latest capabilities.

### Reduce telemetry noise

To prevent Application Insights from sampling out trace data, exclude `Request` from sampling rules in *host.json*:

```json
{
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "excludedTypes": "Request"
      }
    }
  }
}
```

::: zone-end

::: zone pivot="durable-task-sdks"

Register the `Microsoft.DurableTask` activity source with your OpenTelemetry configuration. The Durable Task SDK automatically creates spans for orchestrations and activities when you register this source.

# [C#](#tab/csharp)

In your worker's *Program.cs*, add OpenTelemetry tracing with the Durable Task activity source:

```csharp
using Microsoft.DurableTask;
using Microsoft.DurableTask.Worker;
using Microsoft.DurableTask.Worker.AzureManaged;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenTelemetry;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = Host.CreateApplicationBuilder(args);

// Configure OpenTelemetry tracing
builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService("durable-worker"))
    .WithTracing(tracing =>
    {
        tracing
            .AddSource("Microsoft.DurableTask")
            .AddOtlpExporter(opts =>
            {
                opts.Endpoint = new Uri(
                    Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT")
                    ?? "http://localhost:4317");
            });
    });

// Build connection string from environment variables
string endpoint = Environment.GetEnvironmentVariable("ENDPOINT") ?? "http://localhost:8080";
string taskHub = Environment.GetEnvironmentVariable("TASKHUB") ?? "default";
string connectionString = endpoint.Contains("localhost")
    ? $"Endpoint={endpoint};TaskHub={taskHub};Authentication=None"
    : $"Endpoint={endpoint};TaskHub={taskHub};Authentication=DefaultAzure";

// Configure Durable Task worker
builder.Services.AddDurableTaskWorker()
    .AddTasks(tasks =>
    {
        tasks.AddOrchestratorFunc<string, string>(
            "OrderProcessingOrchestration", async (ctx, input) =>
        {
            var validated = await ctx.CallActivityAsync<string>("ValidateOrder", input);
            var payment = await ctx.CallActivityAsync<string>("ProcessPayment", validated);
            var shipment = await ctx.CallActivityAsync<string>("ShipOrder", payment);
            var result = await ctx.CallActivityAsync<string>("SendNotification", shipment);
            return result;
        });

        tasks.AddActivityFunc<string, string>("ValidateOrder", (ctx, input) =>
            Task.FromResult($"Validated({input})"));
        tasks.AddActivityFunc<string, string>("ProcessPayment", (ctx, input) =>
            Task.FromResult($"Paid({input})"));
        tasks.AddActivityFunc<string, string>("ShipOrder", (ctx, input) =>
            Task.FromResult($"Shipped({input})"));
        tasks.AddActivityFunc<string, string>("SendNotification", (ctx, input) =>
            Task.FromResult($"Notified({input})"));
    })
    .UseDurableTaskScheduler(connectionString);

var host = builder.Build();
await host.RunAsync();
```

The key line is `.AddSource("Microsoft.DurableTask")`, which tells OpenTelemetry to capture spans that the Durable Task SDK emits.

# [JavaScript](#tab/javascript)

Initialize the OpenTelemetry SDK **before** importing any Durable Task modules. This order ensures the global `TracerProvider` is registered before the SDK loads.

```typescript
// 1. OpenTelemetry SDK bootstrap — must run before other imports
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318";

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "durable-worker",
  }),
  spanProcessors: [
    new SimpleSpanProcessor(
      new OTLPTraceExporter({ url: `${otlpEndpoint}/v1/traces` })
    ),
  ],
});
sdk.start();

// 2. Import Durable Task modules after OpenTelemetry is initialized
import {
  DurableTaskAzureManagedClientBuilder,
  DurableTaskAzureManagedWorkerBuilder,
} from "@microsoft/durabletask-js-azuremanaged";
```

The Durable Task JS SDK automatically emits spans when you register a `TracerProvider` globally.

# [Python](#tab/python)

Configure the OpenTelemetry `TracerProvider` before you create the Durable Task worker:

```python
import os
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import Resource
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
import durabletask.worker as worker
import durabletask.task as task

# Configure OpenTelemetry
resource = Resource.create({"service.name": "durable-worker"})
provider = TracerProvider(resource=resource)
otlp_endpoint = os.environ.get("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4317")
exporter = OTLPSpanExporter(endpoint=otlp_endpoint, insecure=True)
provider.add_span_processor(BatchSpanProcessor(exporter))
trace.set_tracer_provider(provider)

# Define activities
def validate_order(ctx: task.ActivityContext, order_id: str) -> str:
    return f"Validated({order_id})"

def process_payment(ctx: task.ActivityContext, input: str) -> str:
    return f"Paid({input})"

def ship_order(ctx: task.ActivityContext, input: str) -> str:
    return f"Shipped({input})"

def send_notification(ctx: task.ActivityContext, input: str) -> str:
    return f"Notified({input})"

# Define orchestrator
def order_processing(ctx: task.OrchestrationContext, order_id: str):
    validated = yield ctx.call_activity(validate_order, input=order_id)
    paid = yield ctx.call_activity(process_payment, input=validated)
    shipped = yield ctx.call_activity(ship_order, input=paid)
    result = yield ctx.call_activity(send_notification, input=shipped)
    return result

# Start worker
if __name__ == "__main__":
    endpoint = os.environ.get("ENDPOINT", "http://localhost:8080")
    taskhub = os.environ.get("TASKHUB", "default")

    with worker.DurableTaskWorker(
        host_address=endpoint,
        secure_channel=not endpoint.startswith("http://localhost"),
        taskhub=taskhub,
    ) as w:
        w.add_orchestrator(order_processing)
        w.add_activity(validate_order)
        w.add_activity(process_payment)
        w.add_activity(ship_order)
        w.add_activity(send_notification)
        w.start()
```

The Durable Task Python SDK automatically instruments orchestrations and activities when you configure a `TracerProvider`.

# [Java](#tab/java)

The Java Durable Task SDK automatically instruments orchestrations and activities with OpenTelemetry spans when you register the `OpenTelemetrySdk` globally. The SDK uses the `Microsoft.DurableTask` tracer name (matching the .NET activity source) and creates `Server`-kind spans for orchestration and activity execution. It also propagates W3C trace context (`traceparent`/`tracestate`) across client, orchestration, activity, and sub-orchestration boundaries.

Add the OpenTelemetry dependencies to your *build.gradle*:

```groovy
def openTelemetryVersion = '1.58.0'

dependencies {
    implementation "com.microsoft:durabletask-client:1.7.0"
    implementation "com.microsoft:durabletask-azuremanaged:1.7.0"
    implementation "io.opentelemetry:opentelemetry-api:${openTelemetryVersion}"
    implementation "io.opentelemetry:opentelemetry-sdk:${openTelemetryVersion}"
    implementation "io.opentelemetry:opentelemetry-exporter-otlp:${openTelemetryVersion}"
}
```

Configure the OpenTelemetry SDK with an OTLP exporter in your application:

```java
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.api.trace.Tracer;

String otlpEndpoint = System.getenv("OTEL_EXPORTER_OTLP_ENDPOINT");
if (otlpEndpoint == null) {
    otlpEndpoint = "http://localhost:4317";
}

OtlpGrpcSpanExporter spanExporter = OtlpGrpcSpanExporter.builder()
    .setEndpoint(otlpEndpoint)
    .build();

SdkTracerProvider tracerProvider = SdkTracerProvider.builder()
    .setResource(Resource.builder().put("service.name", "durable-worker").build())
    .addSpanProcessor(BatchSpanProcessor.builder(spanExporter).build())
    .build();

OpenTelemetrySdk openTelemetry = OpenTelemetrySdk.builder()
    .setTracerProvider(tracerProvider)
    .buildAndRegisterGlobal();

Tracer tracer = openTelemetry.getTracer("durable-worker");
```

The `buildAndRegisterGlobal()` call registers the OpenTelemetry SDK globally. The Durable Task SDK uses `GlobalOpenTelemetry.getTracer("Microsoft.DurableTask")` internally, so it picks up this configuration automatically and creates spans for orchestrations and activities.

---

::: zone-end

## View traces in Application Insights

For production workloads, [Application Insights](/azure/azure-monitor/app/app-insights-overview) is the recommended telemetry backend.

::: zone pivot="durable-functions"

Once `DistributedTracingEnabled` is set to `true` with `Version` set to `V2` in `host.json`, your Durable Functions app emits correlated spans to Application Insights. To view the full orchestration trace in the Azure portal:

1. Go to your Application Insights resource in the Azure portal.
1. Open **Transaction search** and search for your orchestration by name or instance ID.
1. Select a trace to view the end-to-end transaction with all correlated spans.

The trace shows the orchestration as a parent span with child spans for each activity call, suborchestration, and timer wait. The following patterns produce distinct trace shapes:

| Pattern | Trace shape |
| ------- | ----------- |
| Function chaining | Sequential activity spans nested under the orchestrator span. |
| Fan-out/fan-in | Parallel activity spans overlapping in time. |
| Human interaction | An orchestrator span with a long wait for an external event. |
| Monitor | Repeated activity spans with timer waits between iterations. |

::: zone-end

::: zone pivot="durable-task-sdks"

Configure the OTLP exporter to send traces to Application Insights by using the Azure Monitor OpenTelemetry exporter, or export through OTLP to an OpenTelemetry Collector that forwards to Application Insights.

# [C#](#tab/csharp)

Install the `Azure.Monitor.OpenTelemetry.Exporter` NuGet package and replace the OTLP exporter with:

```csharp
builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService("durable-worker"))
    .WithTracing(tracing =>
    {
        tracing
            .AddSource("Microsoft.DurableTask")
            .AddAzureMonitorTraceExporter(opts =>
            {
                opts.ConnectionString = Environment.GetEnvironmentVariable(
                    "APPLICATIONINSIGHTS_CONNECTION_STRING");
            });
    });
```

# [JavaScript](#tab/javascript)

Install the `@azure/monitor-opentelemetry-exporter` npm package and configure the exporter:

```typescript
import { AzureMonitorTraceExporter } from "@azure/monitor-opentelemetry-exporter";

const exporter = new AzureMonitorTraceExporter({
  connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
});

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "durable-worker",
  }),
  spanProcessors: [new SimpleSpanProcessor(exporter)],
});
sdk.start();
```

# [Python](#tab/python)

Install the `azure-monitor-opentelemetry-exporter` pip package and configure:

```python
from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter

exporter = AzureMonitorTraceExporter(
    connection_string=os.environ["APPLICATIONINSIGHTS_CONNECTION_STRING"]
)
provider = TracerProvider(resource=resource)
provider.add_span_processor(BatchSpanProcessor(exporter))
trace.set_tracer_provider(provider)
```

# [Java](#tab/java)

Use the Azure Monitor OpenTelemetry exporter for Java, or configure the OpenTelemetry Java agent with the Application Insights connection string:

```java
// Using the Azure Monitor OpenTelemetry exporter
// Add com.azure:azure-monitor-opentelemetry-exporter to your dependencies
import com.azure.monitor.opentelemetry.exporter.AzureMonitorExporterOptions;
import com.azure.monitor.opentelemetry.exporter.AzureMonitorTraceExporter;

AzureMonitorTraceExporter azureExporter = new AzureMonitorTraceExporter(
    new AzureMonitorExporterOptions()
        .connectionString(System.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING")));
```

---

::: zone-end

## View traces locally with Jaeger

::: zone pivot="durable-task-sdks"

For local development, use the [Durable Task Scheduler emulator](../scheduler/durable-task-scheduler.md#emulator-for-local-development) with [Jaeger](https://www.jaegertracing.io/) to view traces. Use a `docker-compose.yml` to start both services:

```yaml
services:
  dts-emulator:
    image: mcr.microsoft.com/dts/dts-emulator:latest
    ports:
      - "8080:8080"  # gRPC
      - "8082:8082"  # Dashboard
  jaeger:
    image: jaegertracing/jaeger:latest
    ports:
      - "16686:16686"  # Jaeger UI
      - "4317:4317"    # OTLP gRPC
      - "4318:4318"    # OTLP HTTP
```

Start the infrastructure:

```bash
docker compose up -d
```

After you run your application, open the Jaeger UI at `http://localhost:16686` and search for your service name (for example, `durable-worker`) to view traces.

::: zone-end

::: zone pivot="durable-functions"

For local development with Durable Functions, distributed tracing data is sent to Application Insights. To view traces in Application Insights, go to **Transaction search** or **Application Map** in the Azure portal.

For local visibility, you can also set up an OTLP exporter alongside Application Insights by adding the appropriate OpenTelemetry packages and exporter configuration to your function app's `Program.cs`.

::: zone-end

## What trace data shows

The trace data produced by the Durable Task SDKs includes:

| Span type | Description |
| --------- | ----------- |
| `create_orchestration` | The client-side span emitted when scheduling a new orchestration |
| `orchestration` | The server-side orchestration span covering the full execution lifecycle |
| `activity:<name>` | A span for each activity invocation, showing timing and result |
| `sub_orchestration:<name>` | A span for each sub-orchestration call |
| `timer` | A span for durable timer waits |

Each span includes attributes like `durabletask.type`, `durabletask.task.name`, `durabletask.task.instance_id`, and `durabletask.task.task_id`. Failed activities and orchestrations include error details in the span's status and events.

## Troubleshooting

| Issue | Resolution |
| ----- | ---------- |
| No traces appear | Check that the `Microsoft.DurableTask` activity source is registered and the exporter endpoint is reachable. |
| Traces are incomplete | Check that the OpenTelemetry SDK is initialized **before** the Durable Task SDK (especially in JavaScript/TypeScript). |
| Missing spans in Application Insights | Disable or adjust [sampling settings](/azure/azure-monitor/app/sampling-classic-api) to prevent trace data from being dropped. |
| Traces don't correlate | Check that you're using Durable Task Scheduler as the backend. Trace context propagation requires the scheduler. |

## Sample code

::: zone pivot="durable-functions"

- [Distributed Tracing V2 Sample for Durable Functions (C#)](https://github.com/Azure/azure-functions-durable-extension/tree/dev/samples/distributed-tracing/v2/DistributedTracingSample)

::: zone-end

::: zone pivot="durable-task-sdks"

- [OpenTelemetry Tracing (.NET)](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/dotnet/OpenTelemetryTracing)
- [OpenTelemetry Tracing (Python)](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/python/opentelemetry-tracing)
- [Distributed Tracing (JavaScript/TypeScript)](https://github.com/microsoft/durabletask-js/tree/main/examples/azure-managed/distributed-tracing)
- [OpenTelemetry Tracing (Java)](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/java/opentelemetry-tracing)

::: zone-end

## Next steps

::: zone pivot="durable-functions"

> [!div class="nextstepaction"]
> [Learn about diagnostics in Durable Functions](../../azure-functions/durable-functions/durable-functions-diagnostics.md)

::: zone-end

::: zone pivot="durable-task-sdks"

> [!div class="nextstepaction"]
> [Learn about diagnostics in Durable Task SDKs](./durable-task-diagnostics.md)

::: zone-end
