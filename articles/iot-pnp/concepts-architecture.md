---
title: IoT Plug and Play architecture | Microsoft Docs
description: As a solution developer, understand key architectural elements of IoT Plug and Play.
author: dominicbetts
ms.author: dobett
ms.date: 05/07/2020
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea
---

# IoT Plug and Play Preview architecture

IoT Plug and Play Preview enables solution developers to integrate devices with their solutions without any manual configuration. At the core of IoT Plug and Play, is a device _model_ that a device uses to advertise its capabilities to an IoT Plug and Play-enabled application. This model is structured as a set of interfaces that define:

- _Properties_ that represent the read-only and read/write state of a device or other entity. For example, a device serial number may be a read-only property and a target temperature on a thermostat may be a read/write property.
- _Telemetry_ that's the data emitted by a device, whether the data is a regular stream of sensor readings, an occasional error, or an information message.
- _Commands_ that describe a function or operation that can be done on a device. For example, a command could reboot a gateway or take a picture using a remote camera.

The following diagram shows the key elements of an IoT Plug and Play solution:

:::image type="content" source="media/concepts-architecture/pnp-architecture.png" alt-text="IoT Plug and Play architecture":::

## Model repository

The [model repository](./concepts-model-repository.md) is a store for model and interface definitions. You define models and interfaces using the [Digital Definition Definition Language (DTDL)](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL).

The web UI lets you manage the models and interfaces.

The model repository uses RBAC to enable you to limit access to interface definitions.

## Devices

A device developer implements the code to run on an IoT device using one of the [Azure IoT device SDKs](./libraries-sdks.md). The device SDKs help the developer to:

- Code the behaviors defined in the DTDL interfaces the device implements. These behaviors are implemented using digital twins that manage the synchronization of the device state with your IoT hub.
- Register the device with your IoT hub and register the DTDL interfaces the device implements.

## IoT Hub

[IoT Hub](../iot-hub/about-iot-hub.md) is a cloud-hosted service that acts as a central message hub for bi-directional communication between your IoT solution and the devices it manages.

An IoT hub:

- Makes the interface IDs implemented by a device available to a backend solution.
- Maintains the digital twin associated with each Plug and Play device connected to the hub.
- Forwards telemetry streams to other services for processing or storage.
- Routes digital twin change events to other services to enable device monitoring.

## Backend solution

A backend solution monitors and controls connected devices by interacting with digital twins in the IoT hub. Use one of the service SDKs to implement your backend solution. The solution can understand the capabilities of a connected device by:

1. Retrieving the interface IDs the device registered with the IoT hub.
1. Using the interface IDs to retrieve the interface definitions from the model repository.
1. Using the model parser to extract information from the interface definitions.

The backend solution can use the information from the interface definitions to:

- Read property values reported by devices.
- Update writable properties on a device.
- Call commands implemented by a device.
- Understand the format of telemetry sent by a device.

## Next steps

Now that you have an overview of the architecture of an IoT Plug and Play solution, the next steps are to learn more about:

- [The model repository](./concepts-model-repository.md)
- [Model discovery process](./concepts-model-discovery.md)
- [Developing for IoT Plug and Play](./concepts-developer-guide.md)
