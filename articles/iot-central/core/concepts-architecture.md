---
title: Azure IoT Central solution architecture
description: This article introduces key IoT Central architectural concepts such as device management, security, integration, and extensibility.
author: dominicbetts
ms.author: dobett
ms.date: 06/13/2024
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

The telemetry, properties, and commands that a device implements are collectively known as the device capabilities. You define these capabilities in a model that the device and the IoT Central application share. In IoT Central, this model is part of the device template that defines a specific type of device. To learn more, see [Assign a device to a device template](concepts-device-templates.md#assign-a-device-to-a-device-template).

The [device implementation](tutorial-connect-device.md) should follow the [IoT Plug and Play conventions](../../iot/concepts-convention.md) to ensure that it can communicate with IoT Central. For more information, see the various language [SDKs and samples](../../iot/iot-sdks.md).

Devices connect to IoT Central using one the supported protocols: [MQTT, AMQP, or HTTP](../../iot-hub/iot-hub-devguide-protocols.md).

## Gateways

Local gateway devices are useful in several scenarios, such as:

- Devices can't connect directly to IoT Central because they can't connect to the internet. For example, you might have a collection of Bluetooth enabled occupancy sensors that need to connect through a gateway device.
- The quantity of data generated by your devices is high. To reduce costs, combine or aggregate the data in a local gateway before you send it to your IoT Central application.
- Your solution requires fast responses to anomalies in the data. You can run rules on a gateway device that identify anomalies and take an action locally without the need to send data to your IoT Central application.

Gateway devices typically require more processing power than a standalone device. One option to implement a gateway device is to use [Azure IoT Edge and apply one of the standard IoT Edge gateway patterns](concepts-iot-edge.md). You can also run your own custom gateway code on a suitable device.

## Export data

Although IoT Central has built-in analytics features, you can export data to other services and applications.

[Transformations](howto-transform-data-internally.md) in an IoT Central data export definition let you manipulate the format and structure of the device data before exporting it to a destination.

Reasons to export data include:

### Storage and analysis

For long-term storage and control over archiving and retention policies, you can [continuously export your data](howto-export-to-blob-storage.md) to other storage destinations. The use of a separate storage service outside of IoT Central lets you use other analytics tools to derive insights from the data in your solution.

### Business automation

[Rules](howto-configure-rules-advanced.md) in IoT Central let your trigger external actions, such as to send an email or fire an event, in response to conditions within IoT Central. For example, you can notify an engineer if the ambient temperature for a device reaches a threshold.

### Additional computation

You might need to [transform or do computations](howto-transform-data.md) on your data before it can be used either in IoT Central or another service. For example, you could add local weather information to the location data reported by a delivery truck.

## Extend with REST API

Build integrations that let other applications and services manage your application. For example, programmatically [manage the devices](howto-control-devices-with-rest-api.md) in your application or synchronize [user information](howto-manage-users-roles-with-rest-api.md) with an external system.

## Scalability

IoT Central applications internally use multiple Azure services such as IoT Hub and the Device Provisioning Service (DPS). Many of these underlying services are multi-tenanted. However, to ensure the full isolation of customer data, IoT Central uses single-tenant IoT hubs.

IoT Central automatically scales its IoT hubs based on the load profiles in your application. IoT Central can scale up individual IoT hubs and scale out the number of IoT hubs in an application. IoT Central also automatically scales other underlying services.

### Data export

IoT Central applications often use other, user configured services. For example, you can configure your IoT Central application to continuously export data to services such as Azure Event Hubs and Azure Blob Storage.

If a configured data export can't write to its destination, IoT Central tries to retransmit the data for up to 15 minutes, after which IoT Central marks the destination as failed. Failed destinations are periodically checked to verify if they're writable.

You can force IoT Central to restart the failed exports by disabling and re-enabling the data export.

Review the high availability and scalability best practices for the data export destination service you're using:

- Azure Blob Storage: [Azure Storage redundancy](../../storage/common/storage-redundancy.md) and [Performance and scalability checklist for Blob storage](../../storage/blobs/storage-performance-checklist.md)
- Azure Event Hubs: [Availability and consistency in Event Hubs](../../event-hubs/event-hubs-availability-and-consistency.md) and [Scaling with Event Hubs](../../event-hubs/event-hubs-scalability.md)
- Azure Service Bus: [Best practices for insulating applications against Service Bus outages and disasters](../../service-bus-messaging/service-bus-outages-disasters.md) and [Automatically update messaging units of an Azure Service Bus namespace](../../service-bus-messaging/automate-update-messaging-units.md)

## High availability and disaster recovery

HADR capabilities depend on when you created your IoT Central application:

### Applications created before April 2021

Some applications created before April 2021 use a single IoT hub. For these applications, IoT Central doesn't provide HADR capabilities. If the IoT hub becomes unavailable, the application becomes unavailable.

Use the `az iot central device manual-failover` command to check if your application still uses a single IoT hub. This command returns an error if the application has a single IoT hub.

### Applications created after April 2021 and before April 2023

For highly available device connectivity, an IoT Central application always has at least two IoT hubs. The number of hubs can grow or shrink as IoT Central scales the application in response to changes in the load profile.

IoT Central also uses [availability zones](../../availability-zones/az-overview.md#availability-zones) to make various services it uses highly available.

An incident that requires disaster recovery could range from a subset of services becoming unavailable to a whole region becoming unavailable. IoT Central follows different recovery processes depending on the nature and scale of the incident. For example, if an entire Azure region becomes unavailable in the wake of a catastrophic failure, disaster recovery procedures failover applications to another region in the same geography.

### Applications created after April 2023

IoT Central applications created after April 2023 initially have a single IoT hub. If the IoT hub becomes unavailable, the application becomes unavailable. However, IoT Central automatically scales the application and adds a new IoT hub for each 10,000 connected devices. If you require multiple IoT hubs for applications with fewer than 10,000 devices, submit a request to [IoT Central customer support](../../iot/iot-support-help.md?toc=%2Fazure%2Fiot-central%2Ftoc.json&bc=%2Fazure%2Fiot-central%2Fbreadcrumb%2Ftoc.json).

Use the `az iot central device manual-failover` command to check if your application currently uses a single IoT hub. This command returns an error if the application currently has a single IoT hub.
