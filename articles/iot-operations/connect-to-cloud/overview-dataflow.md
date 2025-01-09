---
title: Process and route data with dataflows
description: Learn about dataflows and how to process and route data in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: conceptual
ms.date: 11/11/2024

#CustomerIntent: As an operator, I want to understand how I can use dataflows to connect data sources.
---

# Process and route data with dataflows

Dataflows allow you to connect various data sources and perform data operations, simplifying the setup of data paths to move, transform, and enrich data. The dataflow component is part of Azure IoT Operations, which is deployed as an Azure Arc extension. The configuration for a dataflow is done via Kubernetes custom resource definitions (CRDs).

You can write configurations for various use cases, such as:

- Transform data and send it back to MQTT
- Transform data and send it to the cloud
- Send data to the cloud or edge without transformation

Dataflows aren't limited to the region where the IoT Operations instance is deployed. You can use dataflows to send data to cloud endpoints in different regions.

## Key features

Here are the key features of dataflows.

### Data processing and routing

Dataflows enable the ingestion, processing, and routing of the messages to specified sinks. You can specify:

- **Sources**: Where messages are ingested from
- **Destinations**: Where messages are drained to
- **Transformations (optional)**: Configuration for data processing operations

### Transformation capabilities

Transformations can be applied to data during the processing stage to perform various operations. These operations can include:

- **Compute new properties**: Based on existing properties in the message
- **Rename properties**: To standardize or clarify data
- **Convert units**: Convert values to different units of measurement
- **Standardize values**: Scale property values to a user-defined range
- **Contextualize data**: Add reference data to messages for enrichment and driving insights

### Configuration and deployment

The configuration is specified by using Kubernetes CRDs. Based on this configuration, the dataflow operator creates dataflow instances to ensure high availability and reliability.

## Benefits

- **Simplified setup**: Easily connect data sources and destinations.
- **Flexible transformations**: Perform a wide range of data operations.
- **Scalable configuration**: Use Kubernetes CRDs for scalable and manageable configurations.
- **High availability**: Kubernetes native resource ensures reliability.

By using dataflows, you can efficiently manage your data paths. You can ensure that data is accurately sent, transformed, and enriched to meet your operational needs.

## Schema registry

Schema registry, a feature provided by Azure Device Registry, is a synchronized repository in the cloud and at the edge. The schema registry stores the definitions of messages coming from edge assets, and then exposes an API to access those schemas at the edge. Southbound connectors like the connector for OPC UA can create message schemas and add them to the schema registry or customers can upload schemas to the operations experience web UI.

Dataflows uses messages schemas to transform the message into the format expected by the destination endpoint.

For more information, see [Understand message schemas](./concept-schema-registry.md).

## Related content

- [Tutorial: Send asset telemetry to the cloud by using a dataflow](../end-to-end-tutorials/tutorial-upload-telemetry-to-cloud.md)
- [Create a dataflow](howto-create-dataflow.md)
- [Create a dataflow endpoint](howto-configure-dataflow-endpoint.md)
