---
title: Overview of Azure Digital Twins | Microsoft Docs
description: An introduction to Azure Digital Twins
author: adamgerard
ms.author: adgera
ms.date: 09/21/2018
ms.topic: overview
ms.service: azure-digital-twins
services: azure-digital-twins
manager: timlt
ms.custom: mvc
#Customer intent: As an Azure enterprise customer, I want to know what capabilities Digital Twins has so that I can build next generation IoT services. 
---

# What is Azure Digital Twins?

Digital Twins is an Azure IoT Cloud platform enabling IoT solutions to be built from distributed devices, sensors, and places.

Azure Digital Twins makes it easy to create a "digital twin" that effectively models the relationships between people, places, and devices. These tailored models, or **Ontology**, simplify building solutions unique to different industry domains.

Your "digital twin" will supply powerful real-time analytics and device telemetry, user-defined functions to automate event and data processing, and robust security for your IoT app.

The following video provides an in-depth introduction:

<iframe src="https://www.youtube.com/embed/zvLLQ4fY82M" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

## Services in Azure Digital Twins

From **Ontology's** custom defined models to device **Telemetry**, many services combine to make the Azure Digital Twins platform.

### Object Ontology

A rich [Ontology](./concepts-objectmodel-spatialgraph.md) of customized object models can be defined to categorize IoT assets and assist with development.

These models simplify the representation of the resources an IoT app will use. For example, customers may specify a solution tailored for: smart spaces, buildings, energy grids, factories, etc.

Those models can then be used to interact with an API, represent data, or configure an IoT app.

### Spatial Intelligence Graphs

IoT apps face unique challenges in bringing together numerous devices, sensors, and places. Azure Digital Twins helps to unite these disparate elements into a unified system.

For example, a smart utility app might involve several electricity usage devices connected across a neighborhood. In order to accurately monitor electricity use and ensure correct billing, the smart utility company must track each device, sensor, and locations.

Azure Digital Twins enables these kinds of complex relationships between people, places, and devices to be defined through its powerful **Ontology** and situated into a contextual IoT space called a **Topology**.

### User-Defined Functions

Azure Digital Twins leverages the Azure Stream Analytics User-Defined Functions to improve customization and automation of device tasks.

For example, **User-Defined Functions** can be specified for each node an IoT environment allowing custom, repeat, and automatic data processing.

Additionally, **User-Defined Functions** can be assigned for individual or grouped devices and sensors improving reuse and simplifying management.

### Telemetry and Insights

Devices, sensors, and whole buildings can stream their data directly to your IoT app through Azure IoT Hub. IoT Hub provides powerful event data processing and a robust telemetry pipeline.

Using **Telemetry**, your app can, for example, collect temperature data from multiple sensors or calculate the current room capacity of an entire office building.

## Next steps

For full code samples:

> [!div class="nextstepaction"]
> [C# code samples](https://github.com/Azure-Samples/digital-twins-samples-csharp)
