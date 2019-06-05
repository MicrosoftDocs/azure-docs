---
title: Introduction to IoT Plug and Play | Microsoft Docs
description: Learn about IoT Plug and Play. IoT Plug and Play is based on an open modeling language that allows IoT devices to declare their capabilities. That declaration, called a device capability model, is presented when IoT devices connect to cloud solutions like Azure IoT Central and partner applications, which can then automatically understand the device and start interacting with it — all without writing any code.
author: <your Github account>
ms.author: <your Microsoft alias>
ms.date: 05/17/2019
ms.topic: overview
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea
---




<!---
Purpose of an Overview article: 
1. To give a TECHNICAL overview of a service/product: What is it? Why should I use it? It's a "learn" topic that describes key benefits and our competitive advantage. It's not a "do" topic.
2. To help audiences who are new to service but who may be familiar with related concepts. 
3. To compare the service to another service/product that has some similar functionality, ex. SQL Database / SQL Data Warehouse, if appropriate. This info can be in a short list or table. 
-->

# What is Azure IoT Plug and Play?

IoT Plug and Play allows solution developers to integrate devices without writing any embedded code. At the center of IoT Plug and Play is a schema that describes device capabilities. We refer to this as a device capability model, a JSON-LD document that is structured as a set of interfaces comprised of properties (attributes like firmware version, or settings like fan speed), telemetry (sensor readings such as temperature, or events such as alerts), and commands the device can receive (such as reboot). Interfaces can be reused across device capability models to facilitate collaboration and speed development.

To make IoT Plug and Play work seamlessly with Azure Digital Twins, the IoT Plug and Play schema is defined using the Digital Twin Definition Language (DTDL). IoT Plug and Play and the DTDL are open to the community, and Microsoft welcomes collaboration with customers, partners, and the industry. Both are based on open W3C standards such as JSON-LD and RDF, which allows for easier adoption across services and tooling. Additionally, there is no extra cost for using IoT Plug and Play and DTDL. Standard rates for IoT Hub, Azure IoT Central, and other Azure services remain the same.

Solutions built on Azure IoT Hub or IoT Central can benefit IoT Plug and Play. 

This article outlines:

- The typical roles associated with a project.
- How to use IoT Plug and Play devices in your application.
- How to develop an IoT device application that supports IoT Plug and Play.
- How to certify an IoT Plug and Play device and publish to the Certified for IoT device catalog.

## User roles

The IoT Plug and Play documentation refers to two roles who use or develop IoT Plug and Play:

- A _solution developer_ is responsible for developing an IoT solution using Azure IoT and other Azure resources and for identifying IoT devices to integrate.
- A _device developer_ creates the code that runs on a device connected to your application.

## Use IoT Plug and Play devices in your application

As a _solution developer_, you can develop a cloud-hosted IoT solution that use IoT Plug and Play devices. You can use either of the following Azure IoT services:

- Azure IoT Central - a fully managed IoT software-as-a-service solution that makes it easy to create products that connect the physical and digital worlds.
- Azure IoT Hub - IoT Hub is a managed service, hosted in the cloud, that acts as a central message hub for bi-directional communication between your IoT application and the devices it manages. You can use Azure IoT Hub to build IoT solutions with reliable and secure communications between millions of IoT devices and a cloud-hosted solution backend. 

You can connect an IoT Plug and Play device and view its device capability model and interfaces that define the device's capabilities:
- Telemetry describes the data emitted by a device, whether the data is a regular stream of sensor readings, an occasional error, or information message.
- Properties describe the read-only and read/write state of a device or other entity. For example, a device serial number may be a read-only property and the desired temperature on a thermostat may be a read/write property.
- Commands describes a function or operation that can be performed on a device, such as a rebooting a gateway or taking a picture from a remote camera.

You can find IoT Plug and Play devices through the Azure Certified for IoT device catalog. Each IoT Plug and Play device has been certified through a validation process, and you can view the device capability model to understand its functionaity. You can also simulate the device in Azure IoT Central.

## Develop an IoT device application that supports IoT Plug and Play

As a _device developer_, you can develop an IoT hardware product that supports IoT Plug and Play. The process involves two primary steps:

- Defining the device capability model and interfaces. You will author a set of .json files that declare your device's capabilities using the Digital Twins Definition Language. A device capability model is used to describe a complete entity such as a physical product, and defines the set of interfaces implemented by the entity. Interfaces are shared contracts that uniquely identifies capabilities (telemetry, properties, and commands) exposed by a device. Interfaces may be reused across different device capability models.
- Author the device software or firmware that implements the capabilities declared in the device capability model and interfaces. The Azure IoT SDK provides APIs for implementing IoT Plug and Play.

The IoT Device Workbench for VS Code provides many features to assist you, however you can use any IDE for model authoring and implementation.

## Certify an IoT Plug and Play device and publish to the Certified for IoT device catalog

As a _device developer_, you can submit IoT hardware products to be certified and published to the Certified for IoT device catalog. The certification process involves:
- Joining the [Microsoft Partner Network](https://partner.microsoft.com).
- Onboarding to the Certified for Azure IoT portal
- Creating a new device record by submitting an IoT Plug and Play device capability model as well as marketing information
- Passing auotmated validation for the device
- Publishing to the Certified for IoT device catalog

## Next steps

Now that you have an overview of IoT Plug and Play, here are suggested next steps:

As a device developer, do these.

TODO: add the relevant articles

As a solution developer, do these.

TODO: add the relevant articles
