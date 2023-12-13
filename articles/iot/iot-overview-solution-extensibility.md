---
title: Extend your IoT solution
description: An overview of the extensibility options in an IoT solution.
ms.service: iot
services: iot
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 04/03/2023
ms.custom: template-overview

# As a solution builder, I want a high-level overview of the options for extending an IoT solution so that I can easily find relevant content for my scenario.
---

# Extend your IoT solution

This overview introduces the key concepts around the options to extend an Azure IoT solution. Each section includes links to content that provides further detail and guidance.

The following diagram shows a high-level view of the components in a typical IoT solution. This article focuses on the areas relevant to extending an IoT solution.

:::image type="content" source="media/iot-overview-solution-extensibility/iot-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture highlighting solution extensibility areas." border="false":::

In Azure IoT, solution extensibility refers to the ways you can add to the built-in functionality of the IoT cloud services and build integrations with other services.

## Extensibility scenarios

Extensibility scenarios for IoT solutions include:

### Analysis and visualization

A typical IoT solution includes the analysis and visualization of the data from your devices to enable business insights. To learn more, see [Analyze and visualize your IoT data](iot-overview-analyze-visualize.md).

### Integration with other services

An IoT solution may include other systems such as asset management, work scheduling, and control automation systems. Such systems might:

- Use data from your IoT devices as input to predictive maintenance systems that generate entries in a work scheduling system.
- Update the device registry to ensure it has up to date data from your asset management system.
- Send messages to your devices to control their behavior based on rules in a control automation system.

## Azure Data Health Services

[Azure Health Data Services](../healthcare-apis/healthcare-apis-overview.md) is a set of managed API services based on open standards and frameworks that enable workflows to improve healthcare and offer scalable and secure healthcare solutions. An IoT solution can use these services to integrate IoT data into a healthcare solution. To learn more, see [Deploy and review the continuous patient monitoring application template (IoT Central)](../iot-central/healthcare/tutorial-continuous-patient-monitoring.md)

## Industrial IoT (IIoT)

Azure IIoT lets you integrate data from assets and sensors, including those systems that are already operating on your factory floor, into your Azure IoT solution. To learn more, see [Industrial IoT](../industrial-iot/overview-what-is-industrial-iot.md).

## Extensibility mechanisms

The following sections describe the key mechanisms available to extend your IoT solution.

### Service APIs (IoT Hub)

IoT Hub and the Device Provisioning Service (DPS) provide a set of service APIs that you can use to manage and interact with your hub and devices. These APIs include:

- Registry management
- Interacting with device twins and digital twins
- Sending cloud-to-device messages and calling commands
- Managing enrollment groups (DPS)
- Managing initial device twin state (DPS)

For a list of the available service APIs, see [Service SDKs](iot-sdks.md#iot-hub-service-sdks).

### REST APIs (IoT Central)

The IoT Central REST API provides the following capabilities that are useful for extending your IoT solution:

- Query the devices connected to your application
- Manage device templates and deployment manifests
- Manage devices and device groups
- Control devices by interacting with device properties and calling commands

To learn more, see [IoT Central REST API](../iot-central/core/howto-query-with-rest-api.md).

### Routing and data export

IoT Hub and IoT Central both let you [route device telemetry to different endpoints](iot-overview-message-processing.md#iot-hub-routing). Routing telemetry enables you to build integrations with other services and to export data for analysis and visualization.

In addition to device telemetry, both IoT Hub and IoT Central can send property update and device connection status messages to other endpoints. Routing these messages enables you to build integrations with other services that need device status information:

- [IoT Hub routing](../iot-hub/iot-hub-devguide-messages-d2c.md) can send device telemetry, property change events, device connectivity events, and device lifecycle events to destinations such as [Azure Event Hubs](../event-hubs/event-hubs-about.md), [Azure Blob Storage](../storage/blobs/storage-blobs-overview.md), and [Cosmos DB](../cosmos-db/introduction.md).
- [IoT Hub Event Grid integration](../iot-hub/iot-hub-event-grid.md) uses Azure Event Grid to distribute IoT Hub events such as device connectivity, device lifecycle, and telemetry events to other Azure services.
- [IoT Central rules](../iot-central/core/howto-configure-rules.md) can send device telemetry and property values to webhooks, [Microsoft Power Automate](/power-automate/getting-started/), and [Azure Logic Apps](/azure/logic-apps/logic-apps-overview/).
- [IoT Central data export](../iot-central/core/howto-export-data.md) can send device telemetry, property change events, device connectivity events, and device lifecycle events to destinations such [Azure Blob Storage](../storage/blobs/storage-blobs-overview.md), [Azure Data Explorer](/azure/data-explorer/data-explorer-overview/), [Azure Event Hubs](../event-hubs/event-hubs-about.md), and webhooks.

### IoT Central application templates

The IoT Central application templates provide a starting point for building IoT solutions that include integrations with other services. You can use the templates to create an application that includes resources that are relevant to your solution. To learn more, see [IoT Central application templates](../iot-central/core/howto-create-iot-central-application.md#create-and-use-a-custom-application-template).

## Next steps

Now that you've seen an overview of the extensibility options available to your IoT solution, some suggested next steps include:

- [Analyze and visualize your IoT data](iot-overview-analyze-visualize.md)
- [IoT solution options](iot-introduction.md#solution-options)
