---
title: Process messages from your devices
description: An overview of message processing options in an Azure IoT solution including routing and enrichments.
ms.service: iot
services: iot
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 04/03/2023
ms.custom: template-overview

# As a solution builder or device developer I want a high-level overview of the message processing in IoT solutions so that I can easily find relevant content for my scenario.
---

# Message processing in an IoT solution

This overview introduces the key concepts around processing messages sent from your devices in a typical Azure IoT solution. Each section includes links to content that provides further detail and guidance.

The following diagram shows a high-level view of the components in a typical IoT solution. This article focuses on the message processing components of an IoT solution.

:::image type="content" source="media/iot-overview-message-processing/iot-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture highlighting message processing areas." border="false":::

In Azure IoT, message processing refers to processes such as routing and enriching telemetry messages sent by devices. These processes are used to control the flow of messages through the IoT solution and to add additional information to the messages.

## Route messages

An IoT hub provides a cloud entry point for the telemetry messages that your devices send. In a typical IoT solution, these messages are delivered to other downstream services for storage or analysis.

### IoT Hub routing

In IoT hub, you can configure routing to deliver telemetry messages to the destinations of your choice. Destinations include:

- Storage containers
- Service Bus queues
- Service Bus topics
- Event Hubs

Every IoT hub has a default destination called the *built-in* endpoint. Downstream services can [connect to the built-in endpoint to receive messages](../iot-hub/iot-hub-devguide-messages-read-builtin.md) from the IoT hub.

To learn more, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md).

You can use [queries to filter the messages](../iot-hub/iot-hub-devguide-routing-query-syntax.md) sent to different destinations.

## IoT Central routing

If you're using IoT Central, you can use data export to send telemetry messages to other downstream services. Destinations include:

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

## Enrich or transform messages

To simplify downstream processing, you may want to add data to telemetry messages or modify their structure.

### IoT Hub message enrichments

IoT Hub message enrichments let you add data to the messages sent by your devices. You can add:

- A static string
- The name of the IoT hub processing the message
- Information from the device twin

To learn more, see [Message enrichments for device-to-cloud IoT Hub messages](../iot-hub/iot-hub-message-enrichments-overview.md).

### IoT Central message transformations

IoT Central has two options for transforming telemetry messages:

- Use [mappings](../iot-central/core/howto-map-data.md) to transform complex device telemetry into structured data on ingress to IoT Central.
- Use [transformations](../iot-central/core/howto-transform-data-internally.md) to manipulate the format and structure of the device data before it's exported to a destination.

## Process messages at the edge

An Azure IoT Edge module can process telemetry from an attached sensor or device before it's sent to an IoT hub. For example, before it sends data to the cloud an IoT Edge module can:

- [Filter data](../iot-edge/tutorial-deploy-function.md)
- Aggregate data
- [Convert data](../iot-central/core/howto-transform-data.md#data-transformation-at-ingress)

## Other cloud services

You can use other Azure services to process telemetry messages from your devices. Both IoT Hub and IoT Central can route messages to other services. For example, you can forward telemetry messages to:

[Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md) is a managed stream processing engine that is designed to analyze and process large volumes of streaming data. Stream Analytics can identify patterns in your data and then trigger actions such as creating alerts, feeding information to a reporting tool, or storing the transformed data. Stream Analytics is also available on the Azure IoT Edge runtime, enabling it to process data at the edge rather than in the cloud.

[Azure Functions](../azure-functions/functions-overview.md) is a serverless compute service that lets you run code in response to events. You can use Azure Functions to process telemetry messages from your devices.

To learn more, see:

- [Azure IoT Hub bindings for Azure Functions](../azure-functions/functions-bindings-event-iot.md)
- [Visualize real-time sensor data from Azure IoT Hub using Power BI](../iot-hub/iot-hub-live-data-visualization-in-power-bi.md)
- [Extend Azure IoT Central with custom rules using Stream Analytics, Azure Functions, and SendGrid](../iot-central/core/howto-create-custom-rules.md)

## Next steps

Now that you've seen an overview of device management and control in Azure IoT solutions, some suggested next steps include

- [Extend your IoT solution](iot-overview-solution-extensibility.md)
- [Analyze and visualize your IoT data](iot-overview-analyze-visualize.md)
