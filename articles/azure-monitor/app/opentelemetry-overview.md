---
title: OpenTelemetry with Azure Monitor overview 
description: Provides an overview of how to use OpenTelemetry with Azure Monitor.
ms.topic: conceptual
ms.date: 10/11/2021
ms.reviewer: mmcc
---

# OpenTelemetry overview

Microsoft is excited to embrace [OpenTelemetry](https://opentelemetry.io/) as the future of telemetry instrumentation. You, our customers, have asked for vendor-neutral instrumentation, and we're delighted to partner with the OpenTelemetry community to create consistent APIs/SDKs across languages.

Microsoft worked together with project stakeholders from two previously popular open-source telemetry projects, [OpenCensus](https://opencensus.io/) and [OpenTracing](https://opentracing.io/), to help create a single project--OpenTelemetry. OpenTelemetry includes contributions from all major cloud and Application Performance Management (APM) vendors and lives within the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/) of which Microsoft is a Platinum Member.

## Concepts

Telemetry, the data collected to observe your application, can be broken into three types or "pillars":
1.	Distributed Tracing
2.	Metrics
3.	Logs

Initially the OpenTelemetry community took on Distributed Tracing. Metrics and Logs are still in progress. A complete observability story includes all three pillars, but currently our [Azure Monitor OpenTelemetry-based exporter **preview** offerings for .NET, Python, and JavaScript](opentelemetry-enable.md) **only include Distributed Tracing**.

There are several sources that explain the three pillars in detail including the [OpenTelemetry community website](https://opentelemetry.io/docs/concepts/data-collection/), [OpenTelemetry Specifications](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/overview.md), and [Distributed Systems Observability](https://www.oreilly.com/library/view/distributed-systems-observability/9781492033431/ch04.html) by Cindy Sridharan.

In the following sections, we'll cover some telemetry collection basics.

### Instrumenting your application

At a basic level, "instrumenting” is simply enabling an application to capture telemetry.

There are two methods to instrument your application:
1.	Manual Instrumentation
2.	Automatic Instrumentation (Auto-Instrumentation)

Manual instrumentation is coding against the OpenTelemetry API. In the context of an end user, it typically refers to installing a language-specific SDK in an application. Manual instrumentation packages consist of our [Azure Monitor OpenTelemetry-based exporter **preview** offerings for .NET, Python, and JavaScript](opentelemetry-enable.md).

> [!IMPORTANT]
> “Manual” does **NOT** mean you’ll be required to write complex code to define spans for distributed traces (though it remains an option). A rich and growing set of instrumentation libraries maintained by OpenTelemetry contributors will enable you to effortlessly capture telemetry signals across common frameworks and libraries. A subset of OpenTelemetry Instrumentation Libraries will be supported by Azure Monitor, informed by customer feedback. Additionally, we are working to [instrument the most popular Azure Service SDKs using OpenTelemetry](https://devblogs.microsoft.com/azure-sdk/introducing-experimental-opentelemetry-support-in-the-azure-sdk-for-net/).

On the other hand, auto-instrumentation is enabling telemetry collection through configuration without touching the application's code. While more convenient, it tends to be less configurable and it’s not available in all languages. Azure Monitor’s OpenTelemetry-based auto-instrumentation offering consists of the [Java 3.X OpenTelemetry-based GA offering](java-in-process-agent.md), and we continue to invest in it informed by customer feedback. The OpenTelemetry community is also experimenting with C# and Python auto-instrumentation, but Azure Monitor is focused on creating a simple and effective manual instrumentation story in the near-term.

### Sending your telemetry

There are also two ways to send your data to Azure Monitor (or any vendor).
1. Direct Exporter
2. Via an Agent

A direct exporter sends telemetry in-process (from the application’s code) directly to Azure Monitor’s ingestion endpoint. The main advantage of this approach is onboarding simplicity.

**All Azure Monitor’s currently supported OpenTelemetry-based offerings use a direct exporter**. 

Alternatively, sending telemetry via an agent will provide a path for any OpenTelemetry supported language to send to Azure Monitor via [OTLP](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/README.md). Receiving OTLP will enable customers to observe applications written in languages beyond our [supported languages](platforms.md). 

> [!NOTE]
> Some customers have begun to use the [OpenTelemetry-Collector](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/design.md) as an agent alternative even though Microsoft doesn’t officially support “Via an Agent” approach for application monitoring yet. In the meantime, the open source community has contributed an OpenTelemetry-Collector Azure Monitor Exporter that some customers are using to send data to Azure Monitor Application Insights.

## Terms

See [glossary](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/glossary.md) in the OpenTelemetry specifications.

Some legacy terms in Application Insights are confusing given the industry convergence on OpenTelemetry. The table below highlights these differences. Eventually Application Insights terms will be replaced by OpenTelemetry terms.

Application Insights | OpenTelemetry
------ | ------
Auto-Collectors | Instrumentation Libraries
Channel | Exporter  
Codeless / Agent-based |  Auto-Instrumentation
Traces | Logs


## Next step

The following pages consist of language-by-language guidance to enable and configure Microsoft’s OpenTelemetry-based offerings. Importantly, we share the available functionality and limitations of each offering so you can determine whether OpenTelemetry is right for your project.
- [.NET](opentelemetry-enable.md) 
- [Java](java-in-process-agent.md)
- [JavaScript](opentelemetry-enable.md)
- [Python](opentelemetry-enable.md)
