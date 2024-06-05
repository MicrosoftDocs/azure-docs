---
author: AaronMaxwell
ms.author: aaronmax
ms.service: azure-monitor
ms.topic: include
ms.date: 12/15/2023
---

## Frequently asked questions

This section provides answers to common questions.

### What is OpenTelemetry?

It's a new open-source standard for observability. Learn more at [OpenTelemetry](https://opentelemetry.io/).

### Why is Microsoft Azure Monitor investing in OpenTelemetry?

Microsoft is among the largest contributors to OpenTelemetry.

The key value propositions of OpenTelemetry are that it's vendor-neutral and provides consistent APIs/SDKs across languages.

Over time, we believe OpenTelemetry will enable Azure Monitor customers to observe applications written in languages beyond our [supported languages](../app/app-insights-overview.md#supported-languages). It also expands the types of data you can collect through a rich set of [instrumentation libraries](https://opentelemetry.io/docs/concepts/components/#instrumentation-libraries). Furthermore, OpenTelemetry Software Development Kits (SDKs) tend to be more performant at scale than their predecessors, the Application Insights SDKs.

Finally, OpenTelemetry aligns with Microsoft's strategy to [embrace open source](https://opensource.microsoft.com/).

### What's the status of OpenTelemetry?

See [OpenTelemetry Status](https://opentelemetry.io/status/).

### What is the "Azure Monitor OpenTelemetry Distro"?

You can think of it as a thin wrapper that bundles together all the OpenTelemetry components for a first class experience on Azure. This wrapper is also called a [distribution](https://opentelemetry.io/docs/concepts/distributions/) in OpenTelemetry.

### Why should I use the "Azure Monitor OpenTelemetry Distro"?

There are several advantages to using the Azure Monitor OpenTelemetry Distro over native OpenTelemetry from the community:

- Reduces enablement effort
- Supported by Microsoft
- Brings in Azure-specific features such as:
   - Sampling compatible with classic Application Insights SDKs
   - [Microsoft Entra authentication](../app/azure-ad-authentication.md)
   - [Offline Storage and Automatic Retries](../app/opentelemetry-configuration.md#offline-storage-and-automatic-retries)
   - [Statsbeat](../app/statsbeat.md)
   - [Application Insights Standard Metrics](../app/standard-metrics.md)
   - Detect resource metadata to autopopulate [Cloud Role Name](../app/java-standalone-config.md#cloud-role-name) and [Cloud Role Instance](../app/java-standalone-config.md#cloud-role-instance) on various Azure environments
   - [Live Metrics](../app/live-stream.md)

In the spirit of OpenTelemetry, we designed the distro to be open and extensible. For example, you can add:

- An OpenTelemetry Protocol (OTLP) exporter and send to a second destination simultaneously
- Other instrumentation libraries not included in the distro

Because the Distro provides an [OpenTelemetry distribution](https://opentelemetry.io/docs/concepts/distributions/#what-is-a-distribution), the Distro supports anything supported by OpenTelemetry. For example, you can add more telemetry processors, exporters, or instrumentation libraries, if OpenTelemetry supports them.

> [!NOTE]
> The Distro sets the sampler to a custom, fixed-rate sampler for Application Insights. You can change this to a different sampler, but doing so might disable some of the Distro's included capabilities.
> For more information about the supported sampler, see the [Enable Sampling](../app/opentelemetry-configuration.md#enable-sampling) section of [Configure Azure Monitor OpenTelemetry](../app/opentelemetry-configuration.md).

For languages without a supported standalone OpenTelemetry exporter, the Azure Monitor OpenTelemetry Distro is the only currently supported way to use OpenTelemetry with Azure Monitor. For languages with a supported standalone OpenTelemetry exporter, you have the option of using either the Azure Monitor OpenTelemetry Distro or the appropriate standalone OpenTelemetry exporter depending on your telemetry scenario. For more information, see [When should I use the Azure Monitor OpenTelemetry exporter?](#when-should-i-use-the-azure-monitor-opentelemetry-exporter).

### How can I test out the Azure Monitor OpenTelemetry Distro?

Check out our enablement docs for [.NET, Java, JavaScript (Node.js), and Python](../app/opentelemetry-enable.md).

### Should I use OpenTelemetry or the Application Insights SDK?

We recommend using the OpenTelemetry Distro unless you require a [feature that is only available with formal support in the Application Insights SDK](#whats-the-current-release-state-of-features-within-the-azure-monitor-opentelemetry-distro).

Adopting OpenTelemetry now prevents having to migrate at a later date.

### When should I use the Azure Monitor OpenTelemetry exporter?

For ASP.NET Core, Java, Node.js, and Python, we recommend using the Azure Monitor OpenTelemetry Distro. It's one line of code to get started.

For all other .NET scenarios, including classic ASP.NET, console apps, Windows Forms (WinForms), etc., we recommend using the .NET Azure Monitor OpenTelemetry exporter: `Azure.Monitor.OpenTelemetry.Exporter`.

For more complex Python telemetry scenarios that require advanced configuration, we recommend using the Python [Azure Monitor OpenTelemetry Exporter](/python/api/overview/azure/monitor-opentelemetry-exporter-readme?view=azure-python-preview&preserve-view=true).

### What's the current release state of features within the Azure Monitor OpenTelemetry Distro?

The following chart breaks out OpenTelemetry feature support for each language.

|Feature                                                                                                                | .NET               | Node.js            | Python             | Java               |
|-----------------------------------------------------------------------------------------------------------------------|--------------------|--------------------|--------------------|--------------------|
| [Distributed tracing](../app/distributed-trace-data.md)                                                               | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Custom metrics](../app/opentelemetry-add-modify.md#add-custom-metrics)                                               | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Standard metrics](../app/standard-metrics.md) (accuracy currently affected by sampling)                              | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Fixed-rate sampling](../app/sampling.md)                                                                             | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Offline storage and automatic retries](../app/opentelemetry-configuration.md#offline-storage-and-automatic-retries)  | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Exception reporting](../app/asp-net-exceptions.md)                                                                   | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Logs collection](../app/asp-net-trace-logs.md)                                                                       | :white_check_mark: | :warning:          | :white_check_mark: | :white_check_mark: |
| [Custom Events](../app/usage-overview.md#custom-business-events)                                                      | :warning:          | :warning:          | :warning:          | :white_check_mark: |
| [Microsoft Entra authentication](../app/azure-ad-authentication.md)                                                   | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [Live metrics](../app/live-stream.md)                                                                                 | :warning:          | :warning:          | :warning:          | :white_check_mark: |
| Detect Resource Context for VM/VMSS and App Service                                                                   | :white_check_mark: | :x:                | :white_check_mark: | :white_check_mark: |
| Detect Resource Context for Azure Kubernetes Service (AKS) and Functions                                              | :x:                | :x:                | :x:                | :white_check_mark: |           
| Availability Testing Span Filtering                                                                                   | :x:                | :x:                | :x:                | :white_check_mark: |
| Autopopulation of user ID, authenticated user ID, and user IP                                                         | :x:                | :x:                | :x:                | :white_check_mark: |
| Manually override/set operation name, user ID, or authenticated user ID                                               | :x:                | :x:                | :x:                | :white_check_mark: |
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

The OpenTelemetry web SDK doesn't have a determined availability timeline. We're likely several years away from a browser SDK that is a viable alternative to the Application Insights JavaScript SDK.

### Can I test OpenTelemetry in a web browser today?

The [OpenTelemetry web sandbox](https://github.com/open-telemetry/opentelemetry-sandbox-web-js) is a fork designed to make OpenTelemetry work in a browser. It's not yet possible to send telemetry to Application Insights. The SDK doesn't define general client events.

### Is running Application Insights alongside competitor agents like AppDynamics, DataDog, and NewRelic supported?

This practice isn't something we plan to test or support, although our Distros allow you to [export to an OTLP endpoint](../app/opentelemetry-configuration.md#enable-the-otlp-exporter) alongside Azure Monitor simultaneously.

### Can I use preview features in production environments?

We don't recommend it. See [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### What's the difference between manual and automatic instrumentation?

See the [OpenTelemetry Overview](../app/opentelemetry-overview.md#instrumentation-options).

### Can I use the OpenTelemetry Collector?

Some customers use the OpenTelemetry Collector as an agent alternative, even though Microsoft doesn't officially support an agent-based approach for application monitoring yet. In the meantime, the open-source community contributed an [OpenTelemetry Collector Azure Monitor Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuremonitorexporter) that some customers are using to send data to Azure Monitor Application Insights. **This is not supported by Microsoft.**

### What's the difference between OpenCensus and OpenTelemetry?

[OpenCensus](https://opencensus.io/) is the precursor to [OpenTelemetry](https://opentelemetry.io/). Microsoft helped bring together [OpenTracing](https://opentracing.io/) and OpenCensus to create OpenTelemetry, a single observability standard for the world. The current [production-recommended Python SDK](/previous-versions/azure/azure-monitor/app/opencensus-python) for Azure Monitor is based on OpenCensus. Microsoft is committed to making Azure Monitor based on OpenTelemetry.
