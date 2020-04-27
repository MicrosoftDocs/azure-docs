---
title: Introduction to IoT Plug and Play Preview | Microsoft Docs
description: Learn about IoT Plug and Play Preview. IoT Plug and Play is based on an open modeling language that enables IoT devices to declare their capabilities. IoT devices present that declaration, called a device  model, when they connect to cloud solutions. The cloud solution can then automatically understand the device and start interacting with it, all without writing any code.
author: dominicbetts
ms.author: dobett
ms.date: 04/22/2020
ms.topic: overview
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: eliotgra

# As a device builder, I need to know what is PnP, so I can understand how it can help me build and market my IoT devices.
---

# What is IoT Plug and Play Preview?

IoT Plug and Play Preview enables solution developers to integrate devices with their solutions without any manual configuration. At the core of IoT Plug and Play, is a device _model_ that a device uses to advertise its capabilities to an IoT Plug and Play-enabled application. This model is structured as a set of interfaces that define:

- _Properties_ that represent the read-only and read/write state of a device or other entity. For example, a device serial number may be a read-only property and a target temperature on a thermostat may be a read/write property.
- _Telemetry_ that's the data emitted by a device, whether the data is a regular stream of sensor readings, an occasional error, or an information message.
- _Commands_ that describe a function or operation that can be done on a device. For example, a command could reboot a gateway or take a picture using a remote camera.

You can reuse interfaces across models to make collaboration easier and to speed up development.

To make IoT Plug and Play work seamlessly with [Azure Digital Twins](../digital-twins/about-digital-twins.md), you define models and interfaces using the [Digital Twin Definition Language (DTDL)](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL). IoT Plug and Play and the DTDL are open to the community, and Microsoft welcomes collaboration with customers, partners, and the industry. Both are based on open W3C standards such as JSON-LD and RDF, which enables easier adoption across services and tooling.

There's no extra cost for using IoT Plug and Play and DTDL. Standard rates for [Azure IoT Hub](../iot-hub/about-iot-hub.md) and other Azure services remain the same.

This article outlines:

- The typical roles associated with a project that uses IoT Plug and Play.
- How to use IoT Plug and Play devices in your application.
- How to develop an IoT device application that supports IoT Plug and Play.

## User roles

IoT Plug and Play is useful for two types of developers:

- A _solution developer_ is responsible for developing an IoT solution using Azure IoT Hub and other Azure resources and for identifying IoT devices to integrate.
- A _device developer_ creates the code that runs on a device connected to your solution.

## Use IoT Plug and Play devices

As a solution developer, you can develop a cloud-hosted IoT solution that uses IoT Plug and Play devices. Use [IoT Hub](../iot-hub/about-iot-hub.md) - a managed cloud service, that acts as a message hub for secure, bi-directional communication between your IoT application and your devices.

When you connect an IoT Plug and Play device to an IoT hub, you can view the interfaces included in the model, and the telemetry, properties, and commands defined in those interfaces.

## Develop an IoT device application

As a device developer, you can develop an IoT hardware product that supports IoT Plug and Play. The process involves two key steps:

1. Define the device model and interfaces. You author a set of JSON files that define your device's capabilities using the [DTDL](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL). A model describes a complete entity such as a physical product, and defines the set of interfaces implemented by that entity. Interfaces are shared contracts that uniquely identify the telemetry, properties, and commands supported by a device. Interfaces can be reused across different models.

1. Author device software or firmware that implements the capabilities declared in the interfaces. The Azure IoT SDK includes APIs to help you implement device models.

## Regional availability

During public preview, IoT Plug and Play is available in all regions.

## Message quotas in IoT Hub

During public preview, IoT Plug and Play devices send separate messages per interface, which may increase the number of messages counted towards your [message quota](../iot-hub/iot-hub-devguide-quotas-throttling.md).

## Next steps

Now that you have an overview of IoT Plug and Play, the suggested next step is to try out one of the quickstarts:

- [Connect a device to IoT Hub](./quickstart-connect-device-c.md)
