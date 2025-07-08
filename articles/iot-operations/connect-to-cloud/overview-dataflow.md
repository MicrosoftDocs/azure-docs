---
title: Process and route data with data flows
description: Learn about data flows and how to process and route data in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: concept-article
ms.date: 05/21/2025

#CustomerIntent: As an operator, I want to understand how I can use data flows to connect data sources.
---

# Process and route data with data flows

Data flows allow you to connect various data sources and perform data operations, simplifying the setup of data paths to move, transform, and enrich data. The data flow component is part of Azure IoT Operations, which is deployed as an Azure Arc extension. The configuration for a data flow is done via Kubernetes custom resource definitions (CRDs).

You can write configurations for various use cases, such as:

- Transform data and send it back to MQTT
- Transform data and send it to the cloud
- Send data to the cloud or edge without transformation

Data flows aren't limited to the region where the IoT Operations instance is deployed. You can use data flows to send data to cloud endpoints in different regions.

## Key features

Here are the key features of data flows.

### Data processing and routing

Data flows enable the ingestion, processing, and routing of the messages to specified sinks. You can specify:

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

The configuration is specified by using Kubernetes CRDs. Based on this configuration, the data flow operator creates data flow instances to ensure high availability and reliability.

## Benefits

- **Simplified setup**: Easily connect data sources and destinations.
- **Flexible transformations**: Perform a wide range of data operations.
- **Scalable configuration**: Use Kubernetes CRDs for scalable and manageable configurations.
- **High availability**: Kubernetes native resource ensures reliability.

By using data flows, you can efficiently manage your data paths. You can ensure that data is accurately sent, transformed, and enriched to meet your operational needs.

## Schema registry

Schema registry, a feature provided by Azure Device Registry, is a synchronized repository in the cloud and at the edge. The schema registry stores the definitions of messages coming from edge assets, and then exposes an API to access those schemas at the edge. Southbound connectors like the connector for OPC UA can create message schemas and add them to the schema registry or customers can upload schemas to the operations experience web UI.

Data flows use message schemas to transform the message into the format expected by the destination endpoint.

For more information, see [Understand message schemas](./concept-schema-registry.md).

## Local MQTT broker endpoint message storage

When you use the local MQTT broker as a source endpoint in a data flow, messages are stored during a loss of connectivity between the data flow and the destination endpoint. As an example scenario, assume you create a data flow using the default local MQTT broker as the source endpoint and Azure Event Hubs as the destination endpoint. If connectivity between the data flow and Azure Event Hubs is lost, messages are stored in the MQTT broker subscriber message queue. When connectivity is restored, the data flow sends the messages in the subscriber message queue to Azure Event Hubs.

The local MQTT broker message queue is stored in memory by default. You can configure the MQTT broker to store messages on disk by using the disk-backed message buffer configuration. For more information about the MQTT broker configuration, see [Configure broker settings for high availability, scaling, and memory usage](../manage-mqtt-broker/howto-configure-availability-scale.md). For more information about the disk-backed message buffer, see [Configure disk-backed message buffer behavior](../manage-mqtt-broker/howto-disk-backed-message-buffer.md).

## Related content

- [Tutorial: Send messages from assets to the cloud using a data flow](../end-to-end-tutorials/tutorial-upload-messages-to-cloud.md)
- [Create a data flow](howto-create-dataflow.md)
- [Create a data flow endpoint](howto-configure-dataflow-endpoint.md)
