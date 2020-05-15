---
title: Introduction to IoT Plug and Play Preview | Microsoft Docs
description: Learn about IoT Plug and Play Preview. IoT Plug and Play is based on an open modeling language that enables IoT devices to declare their capabilities. IoT devices present that declaration, called a device capability model, when they connect to cloud solutions such as Azure IoT Central or partner applications. The cloud solution can then automatically understand the device and start interacting with it — all without writing any code.
author: Philmea
ms.author: philmea
ms.date: 12/23/2019
ms.topic: overview
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea

# As a device builder, I need to know what is PnP and how to certify devices, so I can understand how they can help me build and market my IoT devices.
---

# What is IoT Plug and Play Preview?

IoT Plug and Play Preview enables solution developers to integrate devices with their solutions without writing any embedded code. At the core of IoT Plug and Play is a _device capability model_ schema that describes device capabilities. This schema is a JSON document that's structured as a set of interfaces that include definitions of:

- _Properties_ that represent the read-only and read/write state of a device or other entity. For example, a device serial number may be a read-only property and a target temperature on a thermostat may be a read/write property.
- _Telemetry_ that is the data emitted by a device, whether the data is a regular stream of sensor readings, an occasional error, or information message.
- _Commands_ that describe a function or operation that can be done on a device. For example, a command could reboot a gateway or take a picture using a remote camera.

You can reuse interfaces across device capability models to make collaboration easier and to speed up development.

To make IoT Plug and Play work seamlessly with [Azure Digital Twins](../digital-twins/about-digital-twins.md), the IoT Plug and Play schema is defined using the [Digital Twin Definition Language (DTDL)](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL). IoT Plug and Play and the DTDL are open to the community, and Microsoft welcomes collaboration with customers, partners, and the industry. Both are based on open W3C standards such as JSON-LD and RDF, which enable easier adoption across services and tooling. Additionally, there's no extra cost for using IoT Plug and Play and DTDL. Standard rates for [Azure IoT Hub](../iot-hub/about-iot-hub.md), [Azure IoT Central](../iot-central/core/overview-iot-central.md), and other Azure services remain the same.

Solutions built on IoT Hub or IoT Central can benefit from IoT Plug and Play.

This article outlines:

- The typical roles associated with a project that uses IoT Plug and Play.
- How to use IoT Plug and Play devices in your application.
- How to develop an IoT device application that supports IoT Plug and Play.
- How to certify an IoT Plug and Play device and publish to the [Certified for IoT device catalog](https://catalog.azureiotsolutions.com/).

## User roles

IoT Plug and Play is useful for two types of developers:

- A _solution developer_ is responsible for developing an IoT solution using Azure IoT and other Azure resources and for identifying IoT devices to integrate.
- A _device developer_ creates the code that runs on a device connected to your solution.

## Use IoT Plug and Play devices

As a solution developer, you can develop a cloud-hosted IoT solution that uses IoT Plug and Play devices. You can use either of the following Azure services:

- [IoT Central](../iot-central/core/overview-iot-central.md) - a fully managed IoT software-as-a-service solution that makes it easy to create products that connect the physical and digital worlds.
- [IoT Hub](../iot-hub/about-iot-hub.md) - a managed cloud service, that acts as a message hub for secure, bi-directional communication between your IoT application and your devices.

You can find IoT Plug and Play devices through the Azure Certified for IoT device catalog. Each IoT Plug and Play device in the catalog has been validated, and has a device capability model. View the device capability model to understand the device's functionality or use it to simulate the device in Azure IoT Central.

When you connect an IoT Plug and Play device, you can view its device capability model, the interfaces included in the model, and the telemetry, properties, and commands defined in those interfaces.

## Develop an IoT device application

As a device developer, you can develop an IoT hardware product that supports IoT Plug and Play. The process involves two key steps:

1. Define the device capability model and interfaces. You author a set of JSON files that declare your device's capabilities using the [DTDL](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL). A device capability model describes a complete entity such as a physical product, and defines the set of interfaces implemented by that entity. Interfaces are shared contracts that uniquely identify the telemetry, properties, and commands supported by a device. Interfaces can be reused across different device capability models.

1. Author the device software or firmware that implements the capabilities declared in the device capability model and interfaces. The Azure IoT SDK includes APIs to implement device capability models.

The [Azure IoT Tools for VS Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) extension pack provides many features to assist you. For example, as a device developer you can use an extension to generate a skeleton C project from a capability model. However you can use any IDE to author and implement device capability models.

## Certify an IoT Plug and Play device

As a device developer, you can submit IoT hardware products for certification. You can publish a certified device in the Certified for IoT device catalog. The certification process steps include:

- Join the [Microsoft Partner Network](https://partner.microsoft.com).
- Onboard to the Certified for Azure IoT portal.
- Submit an IoT Plug and Play device capability model and marketing information to create a new device record.
- Pass automated set of validation tests for the device.
- Publish to the Certified for IoT device catalog.

## Regional availability

During public preview, IoT Plug and Play is available in all regions.

## Message quotas in IoT Hub
During public preview, IoT Plug and Play devices send separate messages per interface, which may increase the number of messages counted towards your [message quota](../iot-hub/iot-hub-devguide-quotas-throttling.md).

## Next steps

Now that you have an overview of IoT Plug and Play, the suggested next step is to try out one of the quickstarts:

- [Use a device capability model to create an IoT Plug and Play device](./quickstart-create-pnp-device-windows.md)
- [Connect a device to IoT Hub](./quickstart-connect-pnp-device-c-windows.md)
- [Connect to a device in your solution](./quickstart-connect-pnp-device-solution-node.md)
