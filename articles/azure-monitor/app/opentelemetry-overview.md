---
title: OpenTelemetry Overview | Microsoft Docs
description: Provides an overview of how to use OpenTelemetry with Azure Monitor
ms.topic: conceptual
ms.date: 08/12/2021
author: mattmccleary
ms.author: mmcc
---

# OpenTelemetry Overview

Microsoft is excited to embrace [OpenTelemetry](https://opentelemetry.io/) as the future of telemetry instrumentation. Customers are asking for vender-neutral instrumentation, and we're delighted to partner with the OpenTelemetry community to create consistent APIs/SDKs across languages.

Microsoft played a key role in brokering an agreement between [OpenCensus](https://opencensus.io/) and [OpenTracing](https://opentracing.io/), two previously popular open-source telemetry projects to create OpenTelemetry. OpenTelemetry includes contributions from all major cloud and APM vendors and is housed by the Cloud Native Computing Foundation (CNCF) of which Microsoft is a Platinum Member.

## Concepts

Telemetry, the data collected to observe your application, can be broken into three types or "pillars":
1.	Distributed Tracing
2.	Metrics
3.	Logs

Initially the OpenTelemetry community took on Distributed Tracing. Metrics and Logs are still in progress. A complete observability story includes all three pillars, but currently our Azure Monitor OpenTelemetry-based offerings **only include Distributed Tracing** with plans to add the other pillars as they mature in the OpenTelemetry community.

There are several sources that explain the three pillars in detail including the OpenTelemetry community website and specifications.

In the following sections, we'll cover some telemetry collection basics.

### How telemetry is collected

There are two methods to instrument your application (meaning how telemetry is collected):
1.	Manual Instrumentation
2.	Automatic Instrumentation (Auto-Instrumentation)

Manual instrumentation is installing a package or SDK in your code. Auto-instrumentation is enabling telemetry collection through configuration without touching the application's code. While highly convenient, it tends to be less configurable and it's not available in all languages.

Manual instrumentation packages consist of our Azure Monitor OpenTelemetry-based exporters/distros **preview** offering in C#, Java, JavaScript (Node.js), and Python. Auto-instrumentation packages consist of our Java 3.X GA OpenTelemetry-based GA offering.

### How telemetry is sent

There are also two ways to send your data to Azure Monitor (or any vendor).
1. Direct Exporter
2. Via an Agent

A direct exporter sends telemetry in-process (from the application’s code) directly to Azure Monitor’s ingestion endpoint. The main advantage of this approach is simplicity and less moving parts.

Alternatively, sending via an agent may use the OpenTelemetry-Collector or a vendor-specific agent, such as the Azure Monitor Agent. The main advantage of this approach is it allows users to combine receivers, exporters, and processors in a way that unlocks more scenarios.

**All Azure Monitor’s currently supported offerings use a direct exporter**, though some customers use the OpenTelemetry-Collector even though Microsoft doesn’t officially support it. We expect to support an agent-based approach in the future, though the details and timeline aren't available yet.

## Terms

See [glossary](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/glossary.md) in OpenTelemetry's specifications.

Some legacy terms in Application Insights are confusing given the industry convergence on OpenTelemetry. The table below highlights these differences. Eventually Application Insights terms will be replaced by OpenTelemetry terms.

Application Insights | OpenTelemetry
------ | ------
Traces   | Logs
Channel   | Exporter  
Codeless / Agent-based   | Auto-Instrumentation

## Next Step

The following pages consist of language-by-language guidance to enable and configure Microsoft’s OpenTelemetry-based offerings. Importantly, we share the available functionality and limitations of each offering so you can determine whether OpenTelemetry is right for your project.
