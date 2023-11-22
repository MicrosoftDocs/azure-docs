---
author: AaronMaxwell
ms.author: aaronmax
ms.service: azure-monitor
ms.topic: include
ms.date: 10/13/2023
---

## Frequently asked questions

This section provides answers to common questions.

### What is OpenTelemetry?

It's a new open-source standard for observability. Learn more at [OpenTelemetry](https://opentelemetry.io/).

### Why is Microsoft Azure Monitor investing in OpenTelemetry?

Microsoft is among the largest contributors to OpenTelemetry.
          
The key value propositions of OpenTelemetry are that it's vendor-neutral and provides consistent APIs/SDKs across languages.
          
Over time, we believe OpenTelemetry will enable Azure Monitor customers to observe applications written in languages beyond our [supported languages](../app/app-insights-overview.md#supported-languages). It also expands the types of data you can collect through a rich set of [instrumentation libraries](https://opentelemetry.io/docs/concepts/components/#instrumentation-libraries). Furthermore, OpenTelemetry SDKs tend to be more performant at scale than their predecessors, the Application Insights SDKs.

Finally, OpenTelemetry aligns with Microsoft's strategy to [embrace open source](https://opensource.microsoft.com/).

### What's the status of OpenTelemetry?

See the [OpenTelemetry Spec Compliance Matrix](https://github.com/open-telemetry/opentelemetry-specification/blob/main/spec-compliance-matrix.md).

### What is the "Azure Monitor OpenTelemetry Distro"?

You can think of it as a thin wrapper that bundles together all the OpenTelemetry components for a first class experience on Azure.

### Why should I use the "Azure Monitor OpenTelemetry Distro"?

There are several advantages to using the Azure Monitor OpenTelemetry Distro over native OpenTelemetry from the community:
- Reduces enablement effort
- Supported by Microsoft
- Brings in Azure Specific features such as:
   - Preserves traces with service components using Application Insights SDKs
   - [Microsoft Entra authentication](../app/azure-ad-authentication.md)
   - [Offline Storage and Automatic Retries](../app/opentelemetry-configuration.md#offline-storage-and-automatic-retries)
   - [Statsbeat](../app/statsbeat.md)
   - [Application Insights Standard Metrics](../app/standard-metrics.md)
   - Detect resource metadata to autopopulate [Cloud Role Name](../app/app-map.md#understand-the-cloud-role-name-within-the-context-of-an-application-map) on Azure
   - [Live Metrics](../app/live-stream.md) (future)
          
In the spirit of OpenTelemetry, we've designed the distro to be open and extensible. For example, you can add:
- An OTLP exporter and send to a second destination simultaneously
- Community instrumentation libraries beyond what's bundled in with the package
 
### How can I test out the Azure Monitor OpenTelemetry Distro?

Check out our enablement docs for [.NET, Java, JavaScript (Node.js), and Python](../app/opentelemetry-enable.md).

### Should I use OpenTelemetry or the Application Insights SDK?

It depends. Consider that the Azure Monitor OpenTelemetry Distro is still "Preview", and it's not quite at feature parity with the Application Insights SDKs.

### What's the current release state of features within the Azure Monitor OpenTelemetry Distro?

The following chart breaks out OpenTelemetry feature support for each language.

|Feature                                                                                                             | .NET               | Node.js            | Python             | Java               |
|--------------------------------------------------------------------------------------------------------------------|--------------------|--------------------|--------------------|--------------------|
| [Distributed tracing](../app/distributed-tracing-telemetry-correlation.md)                                            | :warning:          | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Custom metrics](../app/opentelemetry-add-modify.md#add-custom-metrics)                                               | :warning:          | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Standard metrics](../app/standard-metrics.md) (accuracy currently affected by sampling)                              | :warning:          | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Fixed-rate sampling](../app/sampling.md)                                                                             | :warning:          | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Offline storage and automatic retries](../app/opentelemetry-configuration.md#offline-storage-and-automatic-retries)  | :warning:          | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Exception reporting](../app/asp-net-exceptions.md)                                                                   | :warning:          | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Logs collection](../app/asp-net-trace-logs.md)                                                                       | :warning:          | :warning:    | :white_check_mark: | :white_check_mark: |
| [Custom Events](../app/usage-overview.md#custom-business-events)                                                      | :warning:          | :warning:          | :warning:          | :white_check_mark: |
| [Microsoft Entra authentication](../app/azure-ad-authentication.md)                                            | :warning:          | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Live metrics](../app/live-stream.md)                                                                                 | :x:                | :x:                | :x:                | :white_check_mark: |
| Detect Resource Context for VM/VMSS and App Svc                                                                    | :white_check_mark: | :x:                | :white_check_mark: | :white_check_mark: |
| Detect Resource Context for AKS and Functions                                                                      | :x:                | :x:                | :x:                | :white_check_mark: |           
| Availability Testing Span Filtering                                                                                | :x:                | :x:                | :x:                | :white_check_mark: |
| Autopopulation of user ID, authenticated user ID, and user IP                                                      | :x:                | :x:                | :x:                | :white_check_mark: |
| Manually override/set operation name, user ID, or authenticated user ID                                            | :x:                | :x:                | :x:                | :white_check_mark: |
| [Adaptive sampling](../app/sampling.md#adaptive-sampling)                                                             | :x:                | :x:                | :x:                | :white_check_mark: |
| [Profiler](../profiler/profiler-overview.md)                                                                          | :x:                | :x:                | :x:                | :warning:          |
| [Snapshot Debugger](../snapshot-debugger/snapshot-debugger.md)                                                        | :x:                | :x:                | :x:                | :x:                |
          
**Key**
- :white_check_mark: This feature is available to all customers with formal support.
- :warning: This feature is available as a public preview. See [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
- :x: This feature isn't available or isn't applicable.

### Can OpenTelemetry be used for web browsers?

Yes, but we don't recommend it and Azure doesn't support it. OpenTelemetry JavaScript is heavily optimized for Node.js. Instead, we recommend using the Application Insights JavaScript SDK.

### When can we expect the OpenTelemetry SDK to be available for use in web browsers?

The availability timeline for the OpenTelemetry web SDK hasn't been determined yet. We're likely several years away from a browser SDK that will be a viable alternative to the Application Insights JavaScript SDK.

### Can I test OpenTelemetry in a web browser today?

The [OpenTelemetry web sandbox](https://github.com/open-telemetry/opentelemetry-sandbox-web-js) is a fork designed to make OpenTelemetry work in a browser. It's not yet possible to send telemetry to Application Insights. The SDK doesn't currently have defined general client events.

### Is running Application Insights alongside competitor agents like AppDynamics, DataDog, and NewRelic supported?

No. This practice isn't something we plan to test or support, although our Distros allow you to [export to an OTLP endpoint](../app/opentelemetry-configuration.md#enable-the-otlp-exporter) alongside Azure Monitor simultaneously.

### Can I use preview builds in production environments?

We don't recommend it. See [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### Can I use the Azure Monitor Exporter as a standalone component?

Yes, we understand some customers might want to instrument using a "piecemeal approach". However, the distro provides easiest way to get started with the best experience on Azure.

### What's the difference between manual and auto-instrumentation?

See the [OpenTelemetry Overview](../app/opentelemetry-overview.md#instrumentation-options).

### Can I use the OpenTelemetry Collector?

Some customers have begun to use the [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/design.md) as an agent alternative, even though Microsoft doesn't officially support an agent-based approach for application monitoring yet. In the meantime, the open-source community has contributed an [OpenTelemetry Collector Azure Monitor Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuremonitorexporter) that some customers are using to send data to Azure Monitor Application Insights.
          
We plan to support an agent-based approach in the future, but the details and timeline aren't available yet. Our objective is to provide a path for any OpenTelemetry-supported language to send to Azure Monitor via the [OpenTelemetry Protocol (OTLP)](https://github.com/open-telemetry/opentelemetry-proto/blob/main/docs/README.md). This approach enables customers to observe applications written in languages beyond our [supported languages](../app/app-insights-overview.md#supported-languages). 

### What's the difference between OpenCensus and OpenTelemetry?

[OpenCensus](https://opencensus.io/) is the precursor to [OpenTelemetry](https://opentelemetry.io/). Microsoft helped bring together [OpenTracing](https://opentracing.io/) and OpenCensus to create OpenTelemetry, a single observability standard for the world. The current [production-recommended Python SDK](/previous-versions/azure/azure-monitor/app/opencensus-python) for Azure Monitor is based on OpenCensus. Eventually, all Azure Monitor SDKs will be based on OpenTelemetry.
