---
title: Process messages from your IoT assets and devices
description: An overview of message processing options in an Azure IoT solution including routing and enrichments.
ms.service: azure-iot
services: iot
author: asergaz
ms.author: sergaz
ms.topic: overview
ms.date: 03/24/2025
# Customer intent: As a solution builder or device developer I want a high-level overview of the message processing in IoT solutions so that I can easily find relevant content for my scenario.
---

# Message processing in an IoT solution

This overview introduces the key concepts around processing messages sent from your assets and devices in a typical Azure IoT solution. Each section includes links to content that provides further detail and guidance.

## [Edge-based solution](#tab/edge)

The following diagram shows a high-level view of the components in a typical [edge-based IoT solution](iot-introduction.md#edge-based-solution). This article focuses on the message processing components of an edge-based IoT solution.

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-message-processing/iot-edge-message-architecture.svg" alt-text="Diagram that shows the high-level edge-based IoT solution architecture highlighting message processing areas." border="false" lightbox="media/iot-overview-message-processing/iot-edge-message-architecture.svg":::

## [Cloud-based solution](#tab/cloud)

The following diagram shows a high-level view of the components in a typical [cloud-based IoT solution](iot-introduction.md#cloud-based-solution). This article focuses on the message processing components of a cloud-based IoT solution.

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-message-processing/iot-cloud-message-architecture.svg" alt-text="Diagram that shows the high-level cloud-based IoT solution architecture highlighting message processing areas." border="false" lightbox="media/iot-overview-message-processing/iot-cloud-message-architecture.svg":::

---

In Azure IoT, message processing refers to processes such as routing and enriching messages sent by assets and devices. These processes are used to control the flow of messages through the IoT solution and to add additional information to the messages.

## Route messages

### [Edge-based solution](#tab/edge)

To route messages from your assets to various endpoints, Azure IoT Operations uses [data flows](../iot-operations/connect-to-cloud/overview-dataflow.md). The destination endpoints might be in the cloud or at the edge. The list of available destination endpoints includes:

| Endpoint type | Description |
|---------------|-------------|
| [MQTT](../iot-operations/connect-to-cloud/howto-configure-mqtt-endpoint.md) | For bi-directional messaging with MQTT brokers, including the one built-in to Azure IoT Operations and Event Grid. |
| [Kafka](../iot-operations/connect-to-cloud/howto-configure-kafka-endpoint.md) | For bi-directional messaging with Kafka brokers, including Azure Event Hubs. |
| [Data Lake](../iot-operations/connect-to-cloud/howto-configure-adlsv2-endpoint.md) | For uploading data to Azure Data Lake Gen2 storage accounts. |
| [Microsoft Fabric OneLake](../iot-operations/connect-to-cloud/howto-configure-fabric-endpoint.md) | For uploading data to Microsoft Fabric OneLake lakehouses. |
| [Azure Data Explorer](../iot-operations/connect-to-cloud/howto-configure-adx-endpoint.md) | For uploading data to Azure Data Explorer databases. |
| [Local storage](../iot-operations/connect-to-cloud/howto-configure-local-storage-endpoint.md) | For sending data to a locally available persistent volume, optionally configurable with Azure Container Storage enabled by Azure Arc. |

The operations experience web UI provides a no-code environment for building and running your data flows.

For enhanced security in the data that is routed to your endpoints, cloud/edge [synchronized secrets](../iot-operations/secure-iot-ops/howto-manage-secrets.md) are used in data flow endpoints for authentication.

While data flows let you configure routing at the edge, you can also define routing in the cloud. If your data flow delivers messages to Azure Event Grid you can use its routing capabilities to determine where to send the messages.

To learn more, see [Process and route data with data flows](../iot-operations/connect-to-cloud/overview-dataflow.md).

### [Cloud-based solution](#tab/cloud)

An Azure IoT hub provides a cloud entry point for the telemetry messages that your devices send. In a typical IoT solution, these messages are delivered to other downstream services for storage or analysis.

### IoT Hub routing

In IoT hub, you can configure routing to deliver telemetry messages to the destinations of your choice. Destinations include:

- Storage containers
- Service Bus queues
- Service Bus topics
- Event Hubs

Every IoT hub has a default destination called the *built-in* endpoint. Downstream services can [connect to the built-in endpoint to receive messages](../iot-hub/iot-hub-devguide-messages-read-builtin.md) from the IoT hub.

To learn more, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md).

You can use [queries to filter the messages](../iot-hub/iot-hub-devguide-routing-query-syntax.md) sent to different destinations.

### IoT Central routing

If you're using Azure IoT Central, you can use data export to send telemetry messages to other downstream services. Destinations include:

- Storage containers
- Service Bus queues
- Service Bus topics
- Event Hubs
- Azure Data Explorer
- Webhooks

An IoT Central data export configuration lets you filter the messages sent to a destination.

To learn more, see [Export data from IoT Central](../iot-central/core/howto-export-to-blob-storage.md).

### Event Grid

IoT Hub has built-in integration with [Azure Event Grid](../event-grid/overview.md). An IoT hub can publish an event whenever it receives a telemetry message from a device. You can use Event Grid to route these events to other services.

To learn more, see [React to IoT Hub events by using Event Grid to trigger actions](../iot-hub/iot-hub-event-grid.md) and [Compare message routing and Event Grid for IoT Hub](../iot-hub/iot-hub-event-grid-routing-comparison.md).

---

## Enrich, transform, and process messages

### [Edge-based solution](#tab/edge)

Enrichments and transformations can be applied to data during the processing stage to perform various operations. These operations can include:

- **Compute new properties**: Based on existing properties in the message
- **Rename properties**: To standardize or clarify data
- **Convert units**: Convert values to different units of measurement
- **Standardize values**: Scale property values to a user-defined range
- **Contextualize data**: Add reference data to messages for enrichment and driving insights

The [schema registry](../iot-operations/connect-to-cloud/concept-schema-registry.md) stores schemas for messages coming from your assets. Data flows use these message schemas to decode messages from various formats so they can be processed by data flows.

The operations experience web UI provides a no-code environment for building and running the transformations in your data flows. 

To learn more, see [Enrich data by using data flows](../iot-operations/connect-to-cloud/concept-dataflow-enrich.md).

In Azure IoT Operations, you can deploy your own highly available edge applications to the Kubernetes cluster. The edge applications can interact with the built-in MQTT broker to:

- Use custom message processing logic on the MQTT messages.
- Build custom application logic to run at the edge.
- Run Edge AI models for real-time data processing and decision-making at the source of data generation, reducing latency and bandwidth usage.

To learn more, see [Develop highly available applications for Azure IoT Operations MQTT broker](../iot-operations/create-edge-apps/edge-apps-overview.md).

### [Cloud-based solution](#tab/cloud)

To simplify downstream processing, you might want to add data to telemetry messages or modify their structure.

### IoT Hub message enrichments

IoT Hub message enrichments let you add data to the messages sent by your devices. You can add:

- A static string
- The name of the IoT hub processing the message
- Information from the device twin

To learn more, see [Message enrichments for device-to-cloud IoT Hub messages](../iot-hub/iot-hub-message-enrichments-overview.md).

### IoT Central message transformations

IoT Central has two options for transforming telemetry messages:

- Use [mappings](../iot-central/core/howto-map-data.md) to transform complex device telemetry into structured data on ingress to IoT Central.
- Use [transformations](../iot-central/core/howto-transform-data-internally.md) to manipulate the format and structure of the device data before you export it to a destination.

### IoT Edge message processing

An Azure IoT Edge module can process telemetry from an attached sensor or device before it sends it to an IoT hub. For example, before it sends data to the cloud an IoT Edge module can:

- [Filter data](../iot-edge/tutorial-deploy-function.md)
- [Aggregate data](../iot-edge/tutorial-deploy-stream-analytics.md)
- [Convert data](../iot-central/core/howto-transform-data.md#data-transformation-at-ingress)
- [Perform image classification at the edge](../iot-edge/tutorial-deploy-custom-vision.md)

---

## Other cloud services

You can use other cloud services to process messages from your assets and devices.

Data flow endpoints in Azure IoT Operations let you connect to cloud services to send and receive data from your assets. A data flow endpoint is the connection point for the data flow. 

To learn more, see:

- [Configure data flow endpoints](../iot-operations/connect-to-cloud/howto-configure-dataflow-endpoint.md)
- [Configure data flows in Azure IoT Operations](../iot-operations/connect-to-cloud/howto-create-dataflow.md)

In IoT Hub and IoT Central, you can route messages to other services. For example, you can forward messages to [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md) to analyze and process large volumes of streaming data or to [Azure Functions](../azure-functions/functions-overview.md) to run code in response to events. Stream Analytics is also available on the Azure IoT Edge runtime, enabling it to process data at the edge rather than in the cloud.

To learn more, see:

- [Azure IoT Hub bindings for Azure Functions](../azure-functions/functions-bindings-event-iot.md)
- [Visualize real-time sensor data from Azure IoT Hub using Power BI](../iot-hub/iot-hub-live-data-visualization-in-power-bi.md)
- [Extend Azure IoT Central with custom rules using Stream Analytics, Azure Functions, and SendGrid](../iot-central/core/howto-create-custom-rules.md)


## Related content

- [Extend your IoT solution](iot-overview-solution-extensibility.md)
- [Analyze and visualize your IoT data](iot-overview-analyze-visualize.md)
- [Choose an Azure IoT service](iot-services-and-technologies.md)
