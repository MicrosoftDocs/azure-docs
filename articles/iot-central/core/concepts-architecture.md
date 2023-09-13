---
title: Architectural concepts in Azure IoT Central
description: This article introduces key IoT Central architectural concepts such as device management, security, integration, and extensibility.
author: dominicbetts
ms.author: dobett
ms.date: 11/28/2022
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: [iot-central-frontdoor]
---

# Azure IoT Central architecture

IoT Central is a ready-made environment that lets you quickly evaluate your IoT scenario. It's an application platform as a service (aPaaS) IoT solution and its primary interface is a web UI. There's also a [REST API](#extend-with-rest-api) that lets you interact with your application programmatically.

This article provides an overview of the key elements in an IoT Central solution architecture.

:::image type="content" source="media/concepts-architecture/architecture.png" alt-text="Diagram that shows the high-level architecture of an I o T Central solution." border="false" lightbox="media/concepts-architecture/architecture.png":::

Key capabilities in an IoT Central application include:

### Manage devices

IoT Central lets you manage the fleet of [IoT devices](#devices) that are sending data to your solution. For example, you can:

- Control which devices can [connect](overview-iot-central-developer.md#how-devices-connect) to your application and how they authenticate.
- Use [device templates](concepts-device-templates.md) to define the types of device that can connect to your application.
- Manage devices by setting properties or calling commands on connected devices. For example, set a target temperature property for a thermostat device or call a command to trigger a device to update its firmware. You can set properties and call commands on:
  - Individual devices through a [customizable](concepts-device-templates.md#views) web UI.
  - Multiple devices with scheduled or on-demand [jobs](howto-manage-devices-in-bulk.md).
- Maintain [device metadata such](concepts-device-templates.md#cloud-properties) as customer address or last service date.

### View and analyze data

In an IoT Central application, you can view and analyze data for individual devices or for aggregated data from multiple devices:

- Use [mapping](howto-map-data.md) to transform complex device telemetry into structured data inside IoT Central.
- Use device templates to define [custom views](howto-set-up-template.md#views) for individual devices of specific types. For example, you can plot temperature over time for an individual thermostat or show the live location of a delivery truck.
- Use the built-in [analytics](tutorial-use-device-groups.md) to view aggregate data for multiple devices. For example, you can see the total occupancy across multiple retail stores or identifying the stores with the highest or lowest occupancy rates.
- Create custom [dashboards](howto-manage-dashboards.md) to help you manage your devices. For example, you can add maps, tiles, and charts to show device telemetry.  

### Secure your solution

In IoT Central, you can configure and manage security in the following areas:

- User access to your application.
- Device access to your application.
- Programmatic access to your application.
- Authentication to other services from your application.
- Audit logs track activity in your application.

To learn more, see the [IoT Central security guide](overview-iot-central-security.md).

## Devices

Devices collect data from sensors to send as a stream of telemetry to an IoT Central application. For example, a refrigeration unit sends a stream of temperature values or a delivery truck streams its location.

A device can use properties to report its state, such as whether a valve is open or closed. An IoT Central application can also use properties to set device state, for example setting a target temperature for a thermostat.

IoT Central can also control devices by calling commands on the device. For example, instructing a device to download and install a firmware update.

The telemetry, properties, and commands that a device implements are collectively known as the device capabilities. You define these capabilities in a model that's shared between the device and the IoT Central application. In IoT Central, this model is part of the device template that defines a specific type of device. To learn more, see [Assign a device to a device template](concepts-device-templates.md#assign-a-device-to-a-device-template).

The [device implementation](tutorial-connect-device.md) should follow the [IoT Plug and Play conventions](../../iot-develop/concepts-convention.md) to ensure that it can communicate with IoT Central. For more information, see the various language [SDKs and samples](../../iot-develop/about-iot-sdks.md).

Devices connect to IoT Central using one the supported protocols: [MQTT, AMQP, or HTTP](../../iot-hub/iot-hub-devguide-protocols.md).

## Gateways

Local gateway devices are useful in several scenarios, such as:

- Devices can't connect directly to IoT Central because they can't connect to the internet. For example, you may have a collection of Bluetooth enabled occupancy sensors that need to connect through a gateway device.
- The quantity of data generated by your devices is high. To reduce costs, combine or aggregate the data in a local gateway before you send it to your IoT Central application.
- Your solution requires fast responses to anomalies in the data. You can run rules on a gateway device that identify anomalies and take an action locally without the need to send data to your IoT Central application.

Gateway devices typically require more processing power than a standalone device. One option to implement a gateway device is to use [Azure IoT Edge and apply one of the standard IoT Edge gateway patterns](concepts-iot-edge.md). You can also run your own custom gateway code on a suitable device.

## Export data

Although IoT Central has built-in analytics features, you can export data to other services and applications.

[Transformations](howto-transform-data-internally.md) in an IoT Central data export definition let you manipulate the format and structure of the device data before it's exported to a destination.

Reasons to export data include:

### Storage and analysis

For long-term storage and control over archiving and retention policies, you can [continuously export your data](howto-export-to-blob-storage.md).
 to other storage destinations. Use of separate storage also lets you use other analytics tools to derive insights and view the data in your solution.

### Business automation

[Rules](howto-configure-rules-advanced.md) in IoT Central let your trigger external actions, such as to send an email or fire an event, in response to conditions within IoT Central. For example, you can notify an engineer if the ambient temperature for a device reaches a threshold.

### Additional computation

You may need to [transform or do computations](howto-transform-data.md) on your data before it can be used either in IoT Central or another service. For example, you could add local weather information to the location data reported by a delivery truck.

## Extend with REST API

Build integrations that let other applications and services manage your application. For example, programmatically [manage the devices](howto-control-devices-with-rest-api.md) in your application or synchronize [user information](howto-manage-users-roles-with-rest-api.md) with an external system.

## Next steps

Now that you've learned about the architecture of Azure IoT Central, the suggested next step is to learn about [device connectivity](overview-iot-central-developer.md) in Azure IoT Central.

