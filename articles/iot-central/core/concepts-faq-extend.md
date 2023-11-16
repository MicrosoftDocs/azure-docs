---
title: How to extend IoT Central
description: How to use data exports, rules, or the REST API to extend IoT Central if it's missing something you need.
author: dominicbetts
ms.author: dobett
ms.date: 06/12/2023
ms.topic: conceptual
ms.service: iot-central
services: iot-central

---

# How do I extend IoT Central if it's missing something I need?

Use the following extension points to expand the built-in functionality of IoT Central:

- Process your IoT data in other services or applications by using the IoT Central data export capabilities.
- Trigger business flows and activities by using IoT Central rules.
- Interact with IoT Central programmatically by using the IoT Central REST APIs.

## Export data

To extend IoT Central's built-in rules and analytics capabilities, use the data export capability to continuously stream data from your devices to other services for processing. The data export capability enables extension scenarios such as:

- Enrich, and transform your IoT data to generate advanced visualizations that provide insights.
- Extract business metrics and use artificial intelligence and machine learning to derive business insights from your IoT data.
- Monitoring and diagnostics for hundreds of thousands of connected IoT devices.
- Combine your IoT data with other business data to build dashboards and reports.

To learn more, see [IoT Central data integration guide](overview-iot-central-solution-builder.md).

## Rules

You can create rules in IoT Central that trigger actions when specified conditions are met. Conditions are evaluated based on data from your connected IoT devices. Actions include sending messages to other cloud services or calling a webhook endpoint. Rules enable extension scenarios such as:

- Notifying operators in other systems.
- Starting business processes or flows.
- Monitoring alerts on a custom dashboard.

To learn more, see [Configure rules](howto-configure-rules.md).

## REST API

The *data plane* REST API lets you manage entities in your IoT Central application programmatically. Entities include devices, users, and roles. The preview data plane REST API lets you query the data from your connected devices and manage a wider selection of entities such as jobs and data exports.

The *control plane* REST API lets you create and manage IoT Central applications.

The REST APIs enable extension scenarios such as:

- Programmatic management  of your IoT Central applications.
- Tight integration with other applications.

To learn more, see [Tutorial: Use the REST API to manage an Azure IoT Central application](tutorial-use-rest-api.md).

## Next steps

Now that you've learned about the IoT Central extensibility points, the suggested next step is to review the [IoT Central data integration guide](overview-iot-central-solution-builder.md).
