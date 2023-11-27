---
title: Introduction to IoT Plug and Play | Microsoft Docs
description: Learn about IoT Plug and Play. IoT Plug and Play is based on an open modeling language that enables smart IoT devices to declare their capabilities. IoT devices present that declaration, called a device model, when they connect to cloud solutions. The cloud solution can then automatically understand the device and start interacting with it, all without writing any code.
author: rido-min
ms.author: rmpablos
ms.date: 11/17/2022
ms.topic: conceptual
ms.service: iot-develop
services: iot-develop
ms.custom: [references_regions, contperf-fy22q1]

#Customer intent: As a device builder, I need to know what is IoT Plug and Play, so I can understand how it can help me build and market my IoT devices.
---

# What is IoT Plug and Play?

IoT Plug and Play enables solution builders to integrate IoT devices with their solutions without any manual configuration. At the core of IoT Plug and Play, is a device _model_ that a device uses to advertise its capabilities to an IoT Plug and Play-enabled application. This model is structured as a set of elements that define:

- _Properties_ that represent the read-only or writable state of a device or other entity. For example, a device serial number may be a read-only property and a target temperature on a thermostat may be a writable property.
- _Telemetry_ that's the data emitted by a device, whether the data is a regular stream of sensor readings, an occasional error, or an information message.
- _Commands_ that describe a function or operation that can be done on a device. For example, a command could reboot a gateway or take a picture using a remote camera.

You can group these elements in interfaces to reuse across models to make collaboration easier and to speed up development.

To make IoT Plug and Play work with [Azure Digital Twins](../digital-twins/overview.md), you define models and interfaces using the [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/README.md). IoT Plug and Play and the DTDL are open to the community, and Microsoft welcomes collaboration with customers, partners, and industry. Both are based on open W3C standards such as JSON-LD and RDF, which enables easier adoption across services and tooling.

There's no extra cost for using IoT Plug and Play and DTDL. Standard rates for [Azure IoT Hub](../iot-hub/about-iot-hub.md) and other Azure services remain the same.

This article outlines:

- The typical roles associated with a project that uses IoT Plug and Play.
- How to use IoT Plug and Play devices in your application.
- How to develop an IoT device application that supports IoT Plug and Play.

## User roles

IoT Plug and Play is used by two types of developer:

- A _solution builder_ who is responsible for developing an IoT solution using Azure IoT Hub and other Azure resources, and for identifying IoT devices to integrate. To learn more, see [IoT Plug and Play service developer guide](concepts-developer-guide-service.md).
- A _device builder_ who creates the code that runs on a device connected to your solution. To learn more, see [IoT Plug and Play device developer guide](concepts-developer-guide-device.md).

## Use IoT Plug and Play devices

As a solution builder, you can use [IoT Central](../iot-central/core/overview-iot-central.md) or [IoT Hub](../iot-hub/about-iot-hub.md) to develop a cloud-hosted IoT solution that uses IoT Plug and Play devices.

The web UI in IoT Central lets you monitor device conditions, create rules, and manage millions of devices and their data throughout their life cycle. IoT Plug and Play devices connect directly to an IoT Central application. Here you can use customizable dashboards to monitor and control your devices. You can also use device templates in the IoT Central web UI to create and edit DTDL models.

IoT Hub - a managed cloud service - acts as a message hub for secure, bi-directional communication between your IoT application and your devices. When you connect an IoT Plug and Play device to an IoT hub, you can use the [Azure IoT explorer](../iot/howto-use-iot-explorer.md) tool to view the telemetry, properties, and commands defined in the DTDL model.

To learn more, see [IoT Plug and Play architecture](concepts-architecture.md)

## Develop an IoT device application

As a device builder, you can develop an IoT hardware product that supports IoT Plug and Play. The process includes three key steps:

1. Define the device model. You author a set of JSON files that define your device's capabilities using the [DTDL](https://github.com/Azure/opendigitaltwins-dtdl). A model describes a complete entity such as a physical product, and defines the set of interfaces implemented by that entity. Interfaces are shared contracts that uniquely identify the telemetry, properties, and commands supported by a device. You can reuse interfaces across different models.

1. Implement your device software or firmware such that your telemetry, properties, and commands follow the [IoT Plug and Play conventions](concepts-convention.md).

1. Ensure the device announces the model ID as part of the MQTT connection. The Azure IoT SDKs include constructs to provide the model ID at connection time.

## Device certification

The [IoT Plug and Play device certification program](../certification/program-requirements-pnp.md) verifies that a device meets the IoT Plug and Play certification requirements. You can add a certified device to the public [Certified for Azure IoT device catalog](https://aka.ms/devicecatalog) where it's discoverable by other solution builders.

## Next steps

Now that you have an overview of IoT Plug and Play, the suggested next step is to try out one of the quickstarts:

- [Connect a device to IoT Hub](./tutorial-connect-device.md)
- [Interact with a device from your solution](./tutorial-service.md)
