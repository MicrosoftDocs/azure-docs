---
title: OpenTelemetry Overview | Microsoft Docs
description: Provides an overview of how to use OpenTelemetry with Azure Monitor
ms.topic: conceptual
ms.date: 09/28/2021
author: mattmccleary
ms.author: mmcc
---

# OpenTelemetry Overview

Microsoft is excited to embrace [OpenTelemetry](https://opentelemetry.io/) as the future of telemetry instrumentation. Customers are asking for vender-neutral instrumentation, and we're delighted to partner with the OpenTelemetry community to create consistent APIs/SDKs across languages.

Microsoft played a key role in brokering an agreement between [OpenCensus](https://opencensus.io/) and [OpenTracing](https://opentracing.io/), two previously popular open-source telemetry projects to create OpenTelemetry. OpenTelemetry includes contributions from all major cloud and APM vendors and is housed by the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/) of which Microsoft is a Platinum Member.

## Concepts

Telemetry, the data collected to observe your application, can be broken into three types or "pillars":
1.	Distributed Tracing
2.	Metrics
3.	Logs

Initially the OpenTelemetry community took on Distributed Tracing. Metrics and Logs are still in progress. A complete observability story includes all three pillars, but currently our Azure Monitor OpenTelemetry-based offerings **only include Distributed Tracing**.

There are several sources that explain the three pillars in detail including the [OpenTelemetry community website](https://opentelemetry.io/docs/concepts/data-sources/), [OpenTelemetry Specifications](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/overview.md), and [Distributed Systems Observability](https://www.oreilly.com/library/view/distributed-systems-observability/9781492033431/ch04.html) by Cindy Sridharan.

In the following sections, we'll cover some telemetry collection basics.

### Instrumenting your application

Instrumenting is making changes to your application to capture telemetry.

There are two methods to instrument your application:
1.	Manual Instrumentation
2.	Automatic Instrumentation (Auto-Instrumentation)

Manual instrumentation is coding against the OpenTelemetry API and typically consists of installing an SDK in an application. Auto-instrumentation is enabling telemetry collection through configuration without touching the application's code. While highly convenient, it tends to be less configurable and it's not available in all languages.

Manual instrumentation packages consist of our Azure Monitor OpenTelemetry-based exporter **preview** offerings in [C#](opentelemetry-net.md), [JavaScript (Node.js)](opentelemetry-javascript.md), and [Python](opentelemetry-python.md). Auto-instrumentation packages consist of our [Java 3.X OpenTelemetry-based GA offering](java-in-process-agent.md).

### Sending your telemetry

There are also two ways to send your data to Azure Monitor (or any vendor).
1. Direct Exporter
2. Via an Agent

A direct exporter sends telemetry in-process (from the application’s code) directly to Azure Monitor’s ingestion endpoint. The main advantage of this approach is simplicity.

**All Azure Monitor’s currently supported OpenTelemetry-based offerings use a direct exporter**. 

Alternatively, sending telemetry via an agent will provide a path for any OpenTelemetry supported language to send to Azure Monitor via [OTLP](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/README.md). This will enable customers to observe applications written in languages beyond our [supported languages](platforms.md). 

> [!NOTE]
> Some customers have begun to use the [OpenTelemetry-Collector](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/design.md) as an agent alternative even though Microsoft doesn’t officially support an agent-based approach yet.

## Terms

See [glossary](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/glossary.md) in the OpenTelemetry specifications.

Some legacy terms in Application Insights are confusing given the industry convergence on OpenTelemetry. The table below highlights these differences. Eventually Application Insights terms will be replaced by OpenTelemetry terms.

Application Insights | OpenTelemetry
------ | ------
Traces   | Logs
Channel   | Exporter  
Codeless / Agent-based   | Auto-Instrumentation

## Next step

The following pages consist of language-by-language guidance to enable and configure Microsoft’s OpenTelemetry-based offerings. Importantly, we share the available functionality and limitations of each offering so you can determine whether OpenTelemetry is right for your project.
- [.NET](opentelemetry-net.md) 
- [Python](opentelemetry-python.md)
- [JavaScript](opentelemetry-javascript.md)
- [Java](java-in-process-agent.md)
