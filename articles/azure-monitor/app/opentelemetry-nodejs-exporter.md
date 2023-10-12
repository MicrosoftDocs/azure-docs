---
title: Enable the Azure Monitor OpenTelemetry exporter for Node.js applications
description: This article provides guidance on how to enable the Azure Monitor OpenTelemetry exporter for Node.js applications.
ms.topic: conceptual
ms.date: 09/12/2023
ms.devlang: javascript
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Enable Azure Monitor OpenTelemetry for Node.js applications

This article describes how to enable and configure OpenTelemetry-based data collection to power the experiences within [Azure Monitor Application Insights](app-insights-overview.md#application-insights-overview). To learn more about OpenTelemetry concepts, see the [OpenTelemetry overview](opentelemetry-overview.md) or [OpenTelemetry FAQ](/azure/azure-monitor/faq#opentelemetry).

## OpenTelemetry Release Status

The OpenTelemetry exporter for Node.js is currently available as a public preview.

[Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

## Get started

Follow the steps in this section to instrument your application with OpenTelemetry.

### Prerequisites

- An Azure subscription: [Create an Azure subscription for free](https://azure.microsoft.com/free/)
- An Application Insights resource: [Create an Application Insights resource](create-workspace-resource.md#create-a-workspace-based-resource)
- Application using an officially [supported version](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter#currently-supported-environments) of Node.js runtime:
  - [OpenTelemetry supported runtimes](https://github.com/open-telemetry/opentelemetry-js#supported-runtimes)
  - [Azure Monitor OpenTelemetry Exporter supported runtimes](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter#currently-supported-environments)

### Install the client libraries

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

### Enable Azure Monitor Application Insights

This section provides guidance that shows how to enable OpenTelemetry.

#### Instrument with OpenTelemetry

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

#### Set the Application Insights connection string

You can set the connection string either programmatically or by setting the environment variable `APPLICATIONINSIGHTS_CONNECTION_STRING`. If both have been set, the programmatic connection string takes precedence.

You can find your connection string in the Overview Pane of your Application Insights Resource.

:::image type="content" source="media/opentelemetry/connection-string.png" alt-text="Screenshot of the Application Insights connection string.":::

Here's how you set the connection string.

Replace the `<Your Connection String>` in the preceding code with the connection string from *your* Application Insights resource.

#### Confirm data is flowing

Run your application and open your **Application Insights Resource** tab in the Azure portal. It might take a few minutes for data to show up in the portal.

:::image type="content" source="media/opentelemetry/server-requests.png" alt-text="Screenshot of the Application Insights Overview tab with server requests and server response time highlighted.":::

> [!IMPORTANT]
> If you have two or more services that emit telemetry to the same Application Insights resource, you're required to [set Cloud Role Names](#set-the-cloud-role-name-and-the-cloud-role-instance) to represent them properly on the Application Map.

As part of using Application Insights instrumentation, we collect and send diagnostic data to Microsoft. This data helps us run and improve Application Insights. To learn more, see [Statsbeat in Azure Application Insights](./statsbeat.md).

## Set the Cloud Role Name and the Cloud Role Instance

You might want to update the [Cloud Role Name](app-map.md#understand-the-cloud-role-name-within-the-context-of-an-application-map) and the Cloud Role Instance from the default values to something that makes sense to your team. They appear on the Application Map as the name underneath a node.

Set the Cloud Role Name and the Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. Cloud Role Name uses `service.namespace` and `service.name` attributes, although it falls back to `service.name` if `service.namespace` isn't set. Cloud Role Instance uses the `service.instance.id` attribute value. For information on standard attributes for resources, see [Resource Semantic Conventions](https://github.com/open-telemetry/semantic-conventions/blob/main/docs/README.md).

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

## Enable Sampling

You may want to enable sampling to reduce your data ingestion volume, which reduces your cost. Azure Monitor provides a custom *fixed-rate* sampler that populates events with a "sampling ratio", which Application Insights converts to "ItemCount". The *fixed-rate* sampler ensures accurate experiences and event counts. The sampler is designed to preserve your traces across services, and it's interoperable with older Application Insights SDKs. For more information, see [Learn More about sampling](sampling.md#brief-summary).

> [!NOTE] 
> Metrics are unaffected by sampling.

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

> [!TIP]
> When using fixed-rate/percentage sampling and you aren't sure what to set the sampling rate as, start at 5% (i.e., 0.05 sampling ratio) and adjust the rate based on the accuracy of the operations shown in the failures and performance blades. A higher rate generally results in higher accuracy. However, ANY sampling will affect accuracy so we recommend alerting on [OpenTelemetry metrics](#metrics), which are unaffected by sampling.

## Instrumentation libraries

The following libraries are validated to work with the current release.

> [!WARNING]
> Instrumentation libraries are based on experimental OpenTelemetry specifications, which impacts languages in [preview status](#opentelemetry-release-status). Microsoft's *preview* support commitment is to ensure that the following libraries emit data to Azure Monitor Application Insights, but it's possible that breaking changes or experimental mapping will block some data elements.

### Distributed Tracing
Requests/Dependencies
- [http/https](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http/README.md) version:
  [0.33.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-http/v/0.33.0)
  
Dependencies
- [mysql](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-mysql) version:
  [0.25.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-mysql/v/0.25.0)

### Metrics

- [http/https](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http/README.md) version:
  [0.33.0](https://www.npmjs.com/package/@opentelemetry/instrumentation-http/v/0.33.0)

### Logs

Currently unavailable.

## Collect custom telemetry

This section explains how to collect custom telemetry from your application.
  
Depending on your language and signal type, there are different ways to collect custom telemetry, including:
  
-	OpenTelemetry API
-	Language-specific logging/metrics libraries
-	Application Insights Classic API
 
The following table represents the currently supported custom telemetry types:

| Language                                  | Custom Events | Custom Metrics | Dependencies | Exceptions | Page Views | Requests | Traces |
|-------------------------------------------|---------------|----------------|--------------|------------|------------|----------|--------|
| **Node.js**                               |               |                |              |            |            |          |        |
| &nbsp;&nbsp;&nbsp;OpenTelemetry API       |               | Yes            | Yes          | Yes        |            | Yes      |        |
| &nbsp;&nbsp;&nbsp;Winston, Pino, Bunyan   |               |                |              |            |            |          | Yes    |
| &nbsp;&nbsp;&nbsp;AI Classic API          | Yes           | Yes            | Yes          | Yes        | Yes        | Yes      | Yes    |

### Add Custom Metrics

> [!NOTE]
> Custom Metrics are under preview in Azure Monitor Application Insights. Custom metrics without dimensions are available by default. To view and alert on dimensions, you need to [opt-in](pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation).

You may want to collect metrics beyond what is collected by [instrumentation libraries](#instrumentation-libraries).

The OpenTelemetry API offers six metric "instruments" to cover various metric scenarios and you need to pick the correct "Aggregation Type" when visualizing metrics in Metrics Explorer. This requirement is true when using the OpenTelemetry Metric API to send metrics and when using an instrumentation library.

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

#### Counter Example

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

#### Gauge Example

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

### Add Custom Exceptions

Select instrumentation libraries automatically report exceptions to Application Insights.
However, you may want to manually report exceptions beyond what instrumentation libraries report.
For instance, exceptions caught by your code aren't ordinarily reported. You may wish to report them
to draw attention in relevant experiences including the failures section and end-to-end transaction views.

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

### Add Custom Spans

You may want to add a custom span when there's a dependency request that's not already collected by an instrumentation library or an application process that you wish to model as a span on the end-to-end transaction view.

```javascript
const { trace } = require("@opentelemetry/api");
let tracer = trace.getTracer("testTracer");
let customSpan = tracer.startSpan("testSpan");
...
customSpan.end();
```

### Send custom telemetry using the Application Insights Classic API
  
We recommend you use the OpenTelemetry APIs whenever possible, but there may be some scenarios when you have to use the Application Insights Classic APIs.
  

## Modify telemetry

This section explains how to modify telemetry.

### Add span attributes

These attributes might include adding a custom property to your telemetry. You might also use attributes to set optional fields in the Application Insights schema, like Client IP.

#### Add a custom property to a Span

Any [attributes](#add-span-attributes) you add to spans are exported as custom properties. They populate the _customDimensions_ field in the requests, dependencies, traces, or exceptions table.

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

#### Set the user IP

You can populate the _client_IP_ field for requests by setting the `http.client_ip` attribute on the span. Application Insights uses the IP address to generate user location attributes and then [discards it by default](ip-collection.md#default-behavior).

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

#### Set the user ID or authenticated user ID

You can populate the _user_Id_ or _user_AuthenticatedId_ field for requests by using the guidance in this section. User ID is an anonymous user identifier. Authenticated User ID is a known user identifier.

> [!IMPORTANT]
> Consult applicable privacy laws before you set the Authenticated User ID.

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

### Add Log Attributes
  
Currently unavailable.

### Filter telemetry

You might use the following ways to filter out telemetry before it leaves your application.

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

### Get the trace ID or span ID
    
You might want to get the trace ID or span ID. If you have logs that are sent to a different destination besides Application Insights, you might want to add the trace ID or span ID to enable better correlation when you debug and diagnose issues.

   ```javascript
   const { trace } = require("@opentelemetry/api");

   let spanId = trace.getActiveSpan().spanContext().spanId;
   let traceId = trace.getActiveSpan().spanContext().traceId;
   ```

## Enable the OTLP Exporter

You might want to enable the OpenTelemetry Protocol (OTLP) Exporter alongside your Azure Monitor Exporter to send your telemetry to two locations.

> [!NOTE]
> The OTLP Exporter is shown for convenience only. We don't officially support the OTLP Exporter or any components or third-party experiences downstream of it.

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

[!INCLUDE [azure-monitor-app-insights-opentelemetry-support](../includes/azure-monitor-app-insights-opentelemetry-support.md)]

## Next steps

- To review the source code, see the [Azure Monitor Exporter GitHub repository](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter).
- To install the npm package, check for updates, or view release notes, see the [Azure Monitor Exporter npm Package](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter/samples).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry JavaScript GitHub repository](https://github.com/open-telemetry/opentelemetry-js).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).
