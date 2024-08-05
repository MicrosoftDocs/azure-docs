---
title: Process and route data with data flows
description: Learn about data flows and how to process and route data in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: conceptual
ms.date: 08/03/2024

#CustomerIntent: As an operator, I want to understand how to I can use data flows connect data sources.
---

# Process and route data with data flows

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Data flows allow you to connect various data sources and perform data operations, simplifying the setup of data paths to move, transform, and enrich data. The data flow component is part of Azure IoT Operations, deployed as an Arc-extension. The configuration for a data flow is done via Kubernetes Custom Resource Definitions (CRDs).

You can write configurations for various use cases, such as:

- Transform data and send it back to MQTT
- Transform data and send it to the cloud
- Send data to the cloud or edge without transformation

Data flows are not limited to the region where the Azure IoT Operations instance is deployed. You can use data flows to send data to any cloud endpoint in any region.

## Key features

### Data processing and routing

Data flows enable the ingestion, processing, and the routing of the messages to specified sinks. You can specify:

- **Sources:** Where messages are ingested from
- **Destinations:** Where messages are drained to
- **Transformations (optional):** Configuration for data processing operations

### Transformation capabilities

Transformations can be applied to data during the processing stage to perform various operations. These operations can include:

- **Compute new properties:** Based on existing properties in the message
- **Rename properties:** To standardize or clarify data
- **Convert units:** Convert values to different units of measurement
- **Standardize values:** Scale property values to a user-defined range
- **Contextualize data:** Add reference data to messages for enrichment and driving insights

### Configuration and deployment

The configuration is specified using Kubernetes CRDs. Based on this configuration, the data flow operator creates data flow instances, ensuring high availability and reliability.

## Benefits

- **Simplified Setup:** Easily connect data sources and destinations
- **Flexible Transformations:** Perform a wide range of data operations
- **Scalable Configuration:** Use Kubernetes CRDs for scalable and manageable configurations
- **High Availability:** Kubernetes native resource ensures reliability

By using data flows, you can efficiently manage your data paths, ensuring data is accurately sent, transformed, and enriched to meet your operational needs.

## Related content

- [Quickstart: Send asset telemetry to the cloud using a data flow](../get-started-end-to-end-sample/quickstart-upload-telemetry-to-cloud.md)
- [Create a data flow](howto-create-dataflow.md)
- [Create a data flow endpoint](howto-configure-dataflow-endpoint.md)
