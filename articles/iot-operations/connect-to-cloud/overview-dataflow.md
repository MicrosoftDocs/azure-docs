---
title: Process and route data with data flows
description: Learn about data flows and how to process and route data in Azure IoT Operations.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: concept-article
ms.date: 05/08/2026

#CustomerIntent: As an operator, I want to understand how I can use data flows to connect data sources.
---

# Process and route data with data flows

Data flows simplify the setup of data paths to move, transform, and enrich data. By using data flows, you can connect various data sources and perform data operations. The data flow component is part of Azure IoT Operations, which you deploy as an Azure Arc extension. You configure a data flow by using the operations experience web UI, the Azure CLI, or Azure Resource Manager templates.

You can write configurations for various use cases, such as:

- Transform data and send it back to MQTT.
- Transform data and send it to the cloud.
- Send data to the cloud or edge without transformation.

Data flows aren't limited to the region where you deploy the IoT Operations instance. You can use data flows to send data to cloud endpoints in different regions.

> [!NOTE]
> Data flows replace the preview-only **Data Processor** component from early Azure IoT Operations releases. The `--include-dp` parameter on `az iot ops init` was removed and is no longer required—the data flows components deploy automatically.

## Key features

This section describes the key features of data flows.

### Data processing and routing

Data flows enable the ingestion, processing, and routing of the messages to specified sinks. You can specify:

- **Sources**: Where you ingest messages from.
- **Destinations**: Where you drain messages to, including support for dynamic topic routing based on message content for MQTT endpoints.
- **Transformations (optional)**: Configuration for data processing operations.

### Transformation capabilities

You can apply transformations to data during the processing stage to perform various operations. These operations can include:

- **Computing new properties**: Based on existing properties in the message.
- **Renaming properties**: To standardize or clarify data.
- **Converting units**: Convert values to different units of measurement.
- **Standardizing values**: Scale property values to a user-defined range.
- **Contextualizing data**: Add reference data to messages for enrichment and driving insights.

> [!TIP]
> For richer processing capabilities including conditional routing, time-based aggregation, and composable transform pipelines, see [Data flow graphs](concept-dataflow-graphs.md).

### Configuration and deployment

Specify the configuration by using the operations experience web UI, the Azure CLI, or Azure Resource Manager templates. Based on this configuration, the data flow operator creates data flow instances to ensure high availability and reliability.

## Benefits

- **Simplified setup**: Easily connect data sources and destinations.
- **Flexible transformations**: Perform a wide range of data operations.
- **Scalable configuration**: Use Azure tools for scalable and manageable configurations.
- **High availability**: Kubernetes native resource ensures reliability.

By using data flows, you can efficiently manage your data paths. You can ensure that data is accurately sent, transformed, and enriched to meet your operational needs.

## Schema registry

Schema registry, a feature provided by Azure Device Registry, is a synchronized repository in the cloud and at the edge. The schema registry stores the definitions of messages coming from edge assets, and then exposes an API to access those schemas at the edge. Southbound connectors like the connector for OPC UA can create message schemas and add them to the schema registry, or you can upload schemas to the operations experience web UI.

Data flows use message schemas to transform the message into the format expected by the destination endpoint.

For more information, see [Understand message schemas](./concept-schema-registry.md).

## Data buffering and disk persistence

When a data flow sends messages to a destination endpoint, the destination or network might become unavailable. If delivery can't complete, the data flow doesn't acknowledge the source message. The MQTT broker keeps the message in the subscriber queue and the data flow retries delivery.

For information about destination outage behavior, broker subscriber queues, disk-backed message buffer, broker persistence, and data flow `requestDiskPersistence`, see [Configure data buffering and disk persistence for data flows](howto-configure-disk-persistence.md).

## Related content

- [Data flows vs. data flow graphs](overview-dataflow-comparison.md)
- [Data flow graphs overview](concept-dataflow-graphs.md)
- [Create a data flow](howto-create-dataflow.md)
- [Configure a data flow source](howto-configure-dataflow-source.md)
- [Create a data flow endpoint](howto-configure-dataflow-endpoint.md)
- [Tutorial: Send messages from assets to the cloud using a data flow](../end-to-end-tutorials/tutorial-upload-messages-to-cloud.md)
