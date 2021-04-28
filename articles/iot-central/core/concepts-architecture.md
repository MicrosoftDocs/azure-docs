---
title: Architectural concepts in Azure IoT Central | Microsoft Docs
description: This article introduces key concepts relating the architecture of Azure IoT Central
author: dominicbetts
ms.author: dobett
ms.date: 12/19/2020
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: philmea
---

# Azure IoT Central architecture

This article provides an overview of the key concepts in the Azure IoT Central architecture.

## Devices

Devices exchange data with your Azure IoT Central application. A device can:

- Send measurements such as telemetry.
- Synchronize settings with your application.

In Azure IoT Central, the data that a device can exchange with your application is specified in a device template. For more information about device templates, see [Device Templates](concepts-device-templates.md).

To learn more about how devices connect to your Azure IoT Central application, see [Device connectivity](concepts-get-connected.md).

## Azure IoT Edge devices

As well as devices created using the [Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks), you can also connect [Azure IoT Edge devices](../../iot-edge/about-iot-edge.md) to an IoT Central application. IoT Edge lets you run cloud intelligence and custom logic directly on IoT devices managed by IoT Central. The IoT Edge runtime enables you to:

- Install and update workloads on the device.
- Maintain IoT Edge security standards on the device.
- Ensure that IoT Edge modules are always running.
- Report module health to the cloud for remote monitoring.
- Manage communication between downstream leaf devices and an IoT Edge device, between modules on an IoT Edge device, and between an IoT Edge device and the cloud.

![Azure IoT Central with Azure IoT Edge](./media/concepts-architecture/iotedge.png)

IoT Central enables the following capabilities to for IoT Edge devices:

- Device templates to describe the capabilities of an IoT Edge device, such as:
  - Deployment manifest upload capability, which helps you manage a manifest for a fleet of devices.
  - Modules that run on the IoT Edge device.
  - The telemetry each module sends.
  - The properties each module reports.
  - The commands each module responds to.
  - The relationships between an IoT Edge gateway device and downstream device.
  - Cloud properties that aren't stored on the IoT Edge device.
  - Customizations, dashboards, and forms that are part of your IoT Central application.

  For more information, see the [Connect Azure IoT Edge devices to an Azure IoT Central application](./concepts-iot-edge.md) article.

- The ability to provision IoT Edge devices at scale using Azure IoT device provisioning service
- Rules and actions.
- Custom dashboards and analytics.
- Continuous data export of telemetry from IoT Edge devices.

### IoT Edge device types

IoT Central classifies IoT Edge device types as follows:

- Leaf devices. An IoT Edge device can have downstream leaf devices, but these devices aren't provisioned in IoT Central.
- Gateway devices with downstream devices. Both gateway device and downstream devices are provisioned in IoT Central

![IoT Central with IoT Edge Overview](./media/concepts-architecture/gatewayedge.png)

### IoT Edge patterns

IoT Central supports the following IoT Edge device patterns:

#### IoT Edge as leaf device

![IoT Edge as leaf device](./media/concepts-architecture/edgeasleafdevice.png)

The IoT Edge device is provisioned in IoT Central and any downstream devices and their telemetry is represented as coming from the IoT Edge device. Downstream devices connected to the IoT Edge device aren't provisioned in IoT Central.

#### IoT Edge gateway device connected to downstream devices with identity

![IoT Edge with downstream device identity](./media/concepts-architecture/edgewithdownstreamdeviceidentity.png)

The IoT Edge device is provisioned in IoT Central along with the downstream devices connected to the IoT Edge device. Runtime support for provisioning downstream devices through the gateway isn't currently supported.

#### IoT Edge gateway device connected to downstream devices with identity provided by the IoT Edge gateway

![IoT Edge with downstream device without identity](./media/concepts-architecture/edgewithoutdownstreamdeviceidentity.png)

The IoT Edge device is provisioned in IoT Central along with the downstream devices connected to the IoT Edge device. Runtime support of gateway providing identity to downstream devices and provisioning of downstream devices isn't currently supported. If you bring your own identity translation module, IoT Central can support this pattern.

## Cloud gateway

Azure IoT Central uses Azure IoT Hub as a cloud gateway that enables device connectivity. IoT Hub enables:

- Data ingestion at scale in the cloud.
- Device management.
- Secure device connectivity.

To learn more about IoT Hub, see [Azure IoT Hub](../../iot-hub/index.yml).

To learn more about device connectivity in Azure IoT Central, see [Device connectivity](concepts-get-connected.md).

## Data stores

Azure IoT Central stores application data in the cloud. Application data stored includes:

- Device templates.
- Device identities.
- Device metadata.
- User and role data.

Azure IoT Central uses a time series store for the measurement data sent from your devices. Time series data from devices used by the analytics service.

## Data export

In an Azure IoT Central application, you can [continuously export your data](howto-export-data.md) to your own Azure Event Hubs and Azure Service Bus instances. You can also periodically export your data to your Azure Blob storage account. IoT Central can export measurements, devices, and device templates.

## Batch device updates

In an Azure IoT Central application, you can [create and run jobs](howto-run-a-job.md) to manage connected devices. These jobs let you do bulk updates to device properties or settings, or run commands. For example, you can create a job to increase the fan speed for multiple refrigerated vending machines.

## Role-based access control (RBAC)

Every IoT Central application has its own built-in RBAC system. An [administrator can define access rules](howto-manage-users-roles.md) for an Azure IoT Central application using one of the predefined roles or by creating a custom role. Roles determine what areas of the application a user has access to and what actions they can perform.

## Security

Security features within Azure IoT Central include:

- Data is encrypted in transit and at rest.
- Authentication is provided either by Azure Active Directory or Microsoft Account. Two-factor authentication is supported.
- Full tenant isolation.
- Device level security.

## Next steps

Now that you've learned about the architecture of Azure IoT Central, the suggested next step is to learn about [device connectivity](concepts-get-connected.md) in Azure IoT Central.