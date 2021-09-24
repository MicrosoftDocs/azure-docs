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

This article provides an overview of the key concepts in the Azure IoT Central architecture.

## Devices

Devices exchange data with your Azure IoT Central application. A device can:

- Send measurements such as telemetry.
- Synchronize settings with your application.

In Azure IoT Central, the data that a device can exchange with your application is specified in a device template. For more information about device templates, see [Device Templates](concepts-device-templates.md).

To learn more about how devices connect to your Azure IoT Central application, see [Device connectivity](concepts-get-connected.md).

### Azure IoT Edge devices

As well as devices created using the [Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks), you can also connect [Azure IoT Edge devices](../../iot-edge/about-iot-edge.md) to an IoT Central application. IoT Edge lets you run cloud intelligence and custom logic directly on IoT devices managed by IoT Central. You can also use IoT Edge as a gateway to enable other downstream devices to connect to IoT Central.

To learn more, see [Connect Azure IoT Edge devices to an Azure IoT Central application](concepts-iot-edge.md).

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

In an Azure IoT Central application, you can [create and run jobs](howto-manage-devices-in-bulk.md) to manage connected devices. These jobs let you do bulk updates to device properties or settings, or run commands. For example, you can create a job to increase the fan speed for multiple refrigerated vending machines.

## Role-based access control (RBAC)

Every IoT Central application has its own built-in RBAC system. An [administrator can define access rules](howto-manage-users-roles.md) for an Azure IoT Central application using one of the predefined roles or by creating a custom role. Roles determine what areas of the application a user has access to and what they can do.

## Security

Security features within Azure IoT Central include:

- Data is encrypted in transit and at rest.
- Authentication is provided either by Azure Active Directory or Microsoft Account. Two-factor authentication is supported.
- Full tenant isolation.
- Device level security.

## Next steps

Now that you've learned about the architecture of Azure IoT Central, the suggested next step is to learn about [device connectivity](concepts-get-connected.md) in Azure IoT Central.