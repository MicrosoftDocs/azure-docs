---
title: Architectural concepts in Azure IoT Central | Microsoft Docs
description: This article introduces key concepts relating the architecture of Azure IoT Central
author: dominicbetts
ms.author: dobett
ms.date: 08/31/2021
ms.topic: conceptual
ms.service: iot-central
services: iot-central

---

# Azure IoT Central architecture

This article provides an overview of the key elements in an IoT Central solution architecture.

:::image type="content" source="media/concepts-architecture/architecture.png" alt-text="High-level architecture of an IoT Central solution" border="false":::

An IoT Central application:

- Lets you manage the IoT devices in your solution.
- Lets you view and analyze the data from your devices.
- Can export to and integrate with other services that are part of the solution.

## IoT Central

IoT Central is a ready-made environment for IoT solution development. It's a platform as a service (PaaS) IoT solution and its primary interface is a web UI. There's also a [REST API](#rest-api) that lets you interact with your application programmatically.

This section describes the key capabilities of an IoT Central application.

### Manage devices

IoT Central lets you manage the fleet of [IoT devices](#devices) that are sending data to your solution. For example, you can:

- Control which devices can [connect](concepts-get-connected.md) to your application and how they authenticate.
- Use [device templates](concepts-device-templates.md) to define the types of device that can connect to your application.
- Manage devices by setting properties or calling commands on connected devices. For example, set a target temperature property for a thermostat device or call a command to trigger a device to update its firmware. You can set properties and call commands on:
  - Individual devices through a [customizable](concepts-device-templates.md#views) web UI.
  - Multiple devices with scheduled or on-demand [jobs](howto-manage-devices-in-bulk.md).
- Maintain [device metadata such](concepts-device-templates.md#cloud-properties) as customer address or last service date.

### View and analyze data

In an IoT Central application, you can view and analyze data for individual devices or for aggregated data from multiple devices:

- Use device templates to define [custom views](howto-set-up-template.md#views) for individual devices of specific types. For example, you can plot temperature over time for an individual thermostat or show the live location of a delivery truck.
- Use the built-in [analytics](tutorial-use-device-groups.md) to view aggregate data for multiple devices. For example, you can see the total occupancy across multiple retail stores or identifying the stores with the highest or lowest occupancy rates.
- Create custom [dashboards](howto-manage-dashboards.md) to help you manage your devices. For example, you can add maps, tiles, and charts to show device telemetry.  

### Secure your solution

In an IoT Central application you can manage the following security aspects of your solution:

- [Device connectivity](concepts-get-connected.md): Create, revoke, and update the security keys that your devices use to establish a connection to your application.
- [App integrations](howto-authorize-rest-api.md#get-an-api-token): Create, revoke, and update the security keys that other applications use to establish secure connections with your application.
- [Data export](howto-export-data.md#connection-options): Use managed identities to secure the connection to your data export destinations.
- [User management](howto-manage-users-roles.md): Manage the users that can sign in to the application and the roles that determine what permissions those users have.
- [Organizations](howto-create-organizations.md): Define a hierarchy to manage which users can see which devices in your IoT Central application.

### REST API

Build integrations that let other applications and services manage your application. For example, programmatically [manage the devices](howto-control-devices-with-rest-api.md) in your application or synchronize [user information](howto-manage-users-roles-with-rest-api.md) with an external system.

## Devices

Devices collect data from sensors to send as a stream of telemetry to an IoT Central application. For example, a refrigeration unit sends a stream of temperature values or a delivery truck streams its location.

A device can use properties to report its state, such as whether a valve is open or closed. An IoT Central application can also use properties to set device state, for example setting a target temperature for a thermostat.

IoT Central can also control devices by calling commands on the device. For example, instructing a device to download and install a firmware update.

The [telemetry, properties, and commands](concepts-telemetry-properties-commands.md) that a device implements are collectively known as the device capabilities. You define these capabilities in a model that's shared between the device and the IoT Central application. In IoT Central, this model is part of the device template that defines a specific type of device.

The [device implementation](tutorial-connect-device.md) should follow the [IoT Plug and Play conventions](../../iot-develop/concepts-convention.md) to ensure that it can communicate with IoT Central. For more information, see the various language [SDKs and samples](../../iot-develop/libraries-sdks.md).

Devices connect to IoT Central using one the supported protocols: [MQTT, AMQP, or HTTP](../../iot-hub/iot-hub-devguide-protocols.md).

## Gateways

Local gateway devices are useful in several scenarios, such as:

- Devices can't connect directly to IoT Central because they can't connect to the internet. For example, you may have a collection of Bluetooth enabled occupancy sensors that need to connect through a gateway device.
- The quantity of data generated by your devices is high. To reduce costs, combine or aggregate the data in a local gateway before you send it to your IoT Central application.
- Your solution requires fast responses to anomalies in the data. You can run rules on a gateway device that identify anomalies and take an action locally without the need to send data to your IoT Central application.

Gateway devices typically require more processing power than a standalone device. One option to implement a gateway device is to use [Azure IoT Edge and apply one of the standard IoT Edge gateway patterns](concepts-iot-edge.md). You can also run your own custom gateway code on a suitable device.

## Data export

Although IoT Central has built-in analytics features, you can export data to other services and applications. Reasons to export data include:

### Storage and analysis

For long-term storage and control over archiving and retention policies, you can [continuously export your data](howto-export-data.md) to other storage destinations. Use of separate storage also lets you use other analytics tools to derive insights and view the data in your solution.

### Business automation

[Rules](howto-configure-rules-advanced.md) in IoT Central let your trigger external actions, such as to send an email or fire an event, in response to conditions within IoT Central. For example, you can notify an engineer if the ambient temperature for a device reaches a threshold.

### Additional computation

You may need to [transform or do computations](howto-transform-data.md) on your data before it can be used either in IoT Central or another service. For example, you could add local weather information to the location data reported by a delivery truck.

## Next steps

Now that you've learned about the architecture of Azure IoT Central, the suggested next step is to learn about [scalability and high availability](concepts-scalability-availability.md) in Azure IoT Central.
