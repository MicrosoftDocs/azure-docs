---
title: Data flows vs. data flow graphs
description: Understand the differences between data flows and data flow graphs in Azure IoT Operations, and choose the right approach for your scenario.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: concept-article
ms.date: 04/02/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand when to use data flows vs. data flow graphs.
---

# Data flows vs. data flow graphs in Azure IoT Operations

Azure IoT Operations provides two ways to process and route data: **data flows** and **data flow graphs**. Both use shared infrastructure (endpoints, profiles, source/destination configuration), but they differ in pipeline shape, transform capabilities, and endpoint support.

## What are data flows?

A [data flow](overview-dataflow.md) is a simple, linear pipeline that moves data from a source to a destination with optional transformations. The transformation stage runs three operations in a fixed order: enrich, filter, then map. You configure a data flow by creating a `Dataflow` custom resource.

Data flows are generally available and support all endpoint types.

## What are data flow graphs?

A [data flow graph](concept-dataflow-graphs.md) is a composable, graph-based pipeline that connects multiple transforms in any topology you define. You can chain, branch, and merge processing steps. Each transform is a pre-built processing unit (map, filter, branch, window, enrichment) that you configure with rules. You configure a data flow graph by creating a `DataflowGraph` custom resource.

Data flow graphs support MQTT, Kafka, and OpenTelemetry endpoints.

## Comparison

| Feature | Data flows | Data flow graphs |
|---------|-----------|-----------------|
| Pipeline shape | Fixed: enrich, filter, map | Flexible: any graph topology |
| Transforms | Map, filter, enrich | Map, filter, branch, concatenate, window (aggregation), enrich |
| Branch and merge | Not supported | Branch on conditions, merge with concatenate |
| Time-based aggregation | Not supported | Tumbling windows with avg, min, max, count |
| Endpoint support (source) | MQTT, Kafka | MQTT, Kafka, OpenTelemetry |
| Endpoint support (destination) | MQTT, Kafka, ADLS, Fabric, ADX, local storage, OpenTelemetry | MQTT, Kafka, OpenTelemetry |
| Dynamic destination topics | `${inputTopic}` (source topic passthrough) | `$metadata.topic` + `${outputTopic}` (content-based routing) |
| Schema | On source and transformation | On node connections |
| Disk persistence | Supported | Supported |

## Shared infrastructure

Data flows and data flow graphs share:

- **Endpoints**: Both use `DataflowEndpoint` resources to connect to MQTT brokers, Kafka, storage, and other services. See [Prepare endpoints](howto-configure-dataflow-endpoint.md).
- **Profiles**: Both reference a `DataflowProfile` for scaling and instance configuration. See [Manage data flow profiles](howto-configure-dataflow-profile.md).
- **Source configuration**: Both support the same source endpoint options (default broker, asset, custom endpoint) and data source (topic) configuration. See [Configure a source](howto-configure-dataflow-source.md).
- **Destination configuration**: Both support static and dynamic destination topics. See [Configure a destination](howto-configure-dataflow-destination.md).
- **Disk persistence**: Both support `requestDiskPersistence` to survive restarts. See [Configure disk persistence](howto-configure-disk-persistence.md).

## When to use which

**Use data flows when:**

- You need a simple source-to-destination pipeline with basic transformations
- You need to send data to storage endpoints (ADLS, Fabric, ADX, local storage)
- You want a generally available, production-ready solution

**Use data flow graphs when:**

- You need to branch messages to different processing paths based on conditions
- You need time-based aggregation (tumbling windows)
- You need multiple chained transforms in a custom topology
- You're working with MQTT, Kafka, or OpenTelemetry endpoints only

For new projects that use supported endpoint types, we recommend data flow graphs. Data flows remain fully supported for all scenarios, and they support the full range of endpoint types.

## Related content

- [Data flows overview](overview-dataflow.md)
- [Data flow graphs overview](concept-dataflow-graphs.md)
- [Create a data flow](howto-create-dataflow.md)
- [Create a data flow graph](howto-create-dataflow-graph.md)
