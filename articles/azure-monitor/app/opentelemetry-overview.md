---
title: OpenTelemetry with Azure Monitor overview 
description: This article provides an overview of how to use OpenTelemetry with Azure Monitor.
ms.topic: conceptual
ms.date: 01/10/2023
ms.reviewer: mmcc
---

# OpenTelemetry overview

Microsoft is excited to embrace [OpenTelemetry](https://opentelemetry.io/) as the future of telemetry instrumentation. You, our customers, have asked for vendor-neutral instrumentation, and we're pleased to partner with the OpenTelemetry community to create consistent APIs and SDKs across languages.

Microsoft worked with project stakeholders from two previously popular open-source telemetry projects, [OpenCensus](https://opencensus.io/) and [OpenTracing](https://opentracing.io/). Together, we helped to create a single project, OpenTelemetry. OpenTelemetry includes contributions from all major cloud and Application Performance Management (APM) vendors and lives within the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/). Microsoft is a Platinum Member of the CNCF.

## Concepts

Telemetry, the data collected to observe your application, can be broken into three types or "pillars":

- Distributed Tracing
- Metrics
- Logs

Initially, the OpenTelemetry community took on Distributed Tracing. Metrics and Logs are still in progress. A complete observability story includes all three pillars, but currently our [Azure Monitor OpenTelemetry-based exporter preview offerings for .NET, Python, and JavaScript](opentelemetry-enable.md) only include Distributed Tracing.

The following sources explain the three pillars:

- [OpenTelemetry community website](https://opentelemetry.io/docs/concepts/data-collection/)
- [OpenTelemetry specifications](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/overview.md)
- [Distributed Systems Observability](https://www.oreilly.com/library/view/distributed-systems-observability/9781492033431/ch04.html) by Cindy Sridharan

In the following sections, we'll cover some telemetry collection basics.

### Instrument your application

At a basic level, "instrumenting" is simply enabling an application to capture telemetry.

There are two methods to instrument your application:

- Manual instrumentation
- Automatic instrumentation (auto-instrumentation)

Manual instrumentation is coding against the OpenTelemetry API. In the context of a user, it typically refers to installing a language-specific SDK in an application. Manual instrumentation packages consist of [Azure Monitor OpenTelemetry-based exporter preview offerings for .NET, Python, and JavaScript](opentelemetry-enable.md).

> [!IMPORTANT]
> "Manual" doesn't mean you'll be required to write complex code to define spans for distributed traces, although it remains an option. A rich and growing set of instrumentation libraries maintained by OpenTelemetry contributors will enable you to effortlessly capture telemetry signals across common frameworks and libraries.
>
> A subset of OpenTelemetry instrumentation libraries will be supported by Azure Monitor, informed by customer feedback. We're also working to [instrument the most popular Azure Service SDKs using OpenTelemetry](https://devblogs.microsoft.com/azure-sdk/introducing-experimental-opentelemetry-support-in-the-azure-sdk-for-net/).

Auto-instrumentation enables telemetry collection through configuration without touching the application's code. Although it's more convenient, it tends to be less configurable. It's also not available in all languages. The Azure Monitor OpenTelemetry-based auto-instrumentation offering consists of the [Java 3.X OpenTelemetry-based GA offering](opentelemetry-enable.md?tabs=java). We continue to invest in it informed by customer feedback. The OpenTelemetry community is also experimenting with C# and Python auto-instrumentation, but Azure Monitor is focused on creating a simple and effective manual instrumentation story in the near term.

### Send your telemetry

There are two ways to send your data to Azure Monitor (or any vendor):

- Via a direct exporter
- Via an agent

A direct exporter sends telemetry in-process (from the application's code) directly to the Azure Monitor ingestion endpoint. The main advantage of this approach is onboarding simplicity.

*All currently supported OpenTelemetry-based offerings in Azure Monitor use a direct exporter*.

Alternatively, sending telemetry via an agent will provide a path for any OpenTelemetry-supported language to send to Azure Monitor via [Open Telemetry Protocol (OTLP)](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/README.md). Receiving OTLP will enable customers to observe applications written in languages beyond our [supported languages](platforms.md).

> [!NOTE]
> Some customers have begun to use the [OpenTelemetry-Collector](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/design.md) as an agent alternative even though Microsoft doesn't officially support the "via an agent" approach for application monitoring yet. In the meantime, the open-source community has contributed an OpenTelemetry-Collector Azure Monitor exporter that some customers are using to send data to Azure Monitor Application Insights.

## Terms

For terminology, see the [glossary](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/glossary.md) in the OpenTelemetry specifications.

Some legacy terms in Application Insights are confusing because of the industry convergence on OpenTelemetry. The following table highlights these differences. Eventually, Application Insights terms will be replaced by OpenTelemetry terms.

Application Insights | OpenTelemetry
------ | ------
Auto-collectors | Instrumentation libraries
Channel | Exporter
Codeless / Agent-based | Auto-instrumentation
Traces | Logs

## Next steps

The following websites consist of language-by-language guidance to enable and configure Microsoft's OpenTelemetry-based offerings. The available functionality and limitations of each offering are explained so that you can determine whether OpenTelemetry is right for your project.

- [.NET](opentelemetry-enable.md?tabs=net)
- [Java](opentelemetry-enable.md?tabs=java)
- [JavaScript](opentelemetry-enable.md?tabs=nodejs)
- [Python](opentelemetry-enable.md?tabs=python)
