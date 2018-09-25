---
title: Overview of Azure Digital Twins | Microsoft Docs
description: An introduction to Azure Digital Twins
author: julieseto
ms.author: jseto
ms.date: 09/24/2018
ms.topic: overview
ms.service: azure-digital-twins
services: azure-digital-twins
manager: timlt
ms.custom: mvc
#Customer intent: As an Azure enterprise customer, I want to know what capabilities Digital Twins has so that I can build next generation IoT services. 
---

# Overview: What is Azure Digital Twins?

Azure Digital Twins is a service in the Azure IoT Platform that allows you to create a comprehensive model of the physical environment. It provides a spatial intelligence graph to model the relationships and interactions between people, space, and devices.

Azure Digital Twins can be used to query data for a space rather than from many sensors. You can therefore build repeatable, scalable, spatially aware, experiences that are uniquely relevant because of their ability to correlate data across the digital and physical world.

Azure Digital Twins applies to environments of all types including such as offices, schools, hospitals, banks, stadiums, factories, parking lots, parks, electrical grids, and cities. Example use cases are predicting maintenance needs, analyzing energy requirements, and optimizing the use of available space.

Take a look at the introductory video:

<iframe src="https://www.youtube.com/embed/zvLLQ4fY82M" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

## Key Capabilities

Key capabilities of Azure Digital Twins include:

* **Spatial intelligence graph**: a virtual representation of the physical environment that enables you to model the relationships among people, places, and devices.
* **Pre-loaded domain-specific concepts (Digital Twin Object Models)**: pre-defined device protocols and data schema that are aligned your solution’s domain-specific needs to accelerate and simplify development.
* **Multi and nested tenancy**: build solutions that scale and securely replicate across multiple tenants or create multiple sub-tenants that can be accessed and used in an isolated and secure manner.
* **Advanced compute capabilities**: define and run custom functions against incoming telemetry messages to send signals to pre-defined endpoints.
* **Built-in access control**: access and identity management features such as Role-Based Access Control and Azure Active Directory enable you to securely control individuals’ and devices’ access. You can also perform specific actions within the Digital Twin environment.
* **Ecosystem**: connect an Azure Digital Twins instance to the broad set of Azure Analytics, AI, and Storage services, Azure Maps, Microsoft Mixed Reality, Dynamics 365, or Office 365.

## Solutions that Benefit from Azure Digital Twins

Azure Digital Twins is applicable to any industry or scenario that can benefit from virtually representing the physical world. Some examples include:

Those models can then be used to interact with an API, represent data, or configure an IoT app.

> [!div class="nextstepaction"]
> [Read more](./concepts-objectmodel-spatialgraph.md)

### Spatial Intelligence Graphs

IoT apps face unique challenges in bringing together numerous devices, sensors, and places. Azure Digital Twins helps to unite these disparate elements into a unified system.

For example, a smart utility app might involve several electricity usage devices connected across a neighborhood. In order to accurately monitor electricity use and ensure correct billing, the smart utility company must track each device, sensor, and locations.

Azure Digital Twins enables these kinds of complex relationships between people, places, and devices to be defined through its powerful **Ontology** and situated into a contextual IoT space called a **Topology**.

> [!div class="nextstepaction"]
> [Read more](./concepts-objectmodel-spatialgraph.md)

### User-Defined Functions

Azure Digital Twins leverages the Azure Stream Analytics User-Defined Functions to improve customization and automation of device tasks.

For example, **User-Defined Functions** can be specified for each node an IoT environment allowing custom, repeat, and automatic data processing.

Additionally, **User-Defined Functions** can be assigned for individual or grouped devices and sensors improving reuse and simplifying management.

> [!div class="nextstepaction"]
> [Read more](./concepts-user-defined-functions.md)

### Telemetry and Insights

Devices, sensors, and whole buildings can stream their data directly to your IoT app through Azure IoT Hub. IoT Hub provides powerful event data processing and a robust telemetry pipeline.

Using **Telemetry**, your app can, for example, collect temperature data from multiple sensors or calculate the current room capacity of an entire office building.

> [!div class="nextstepaction"]
> [Read more](./concepts-device-ingress.md)

* Showing a property management company the occupancy levels of a space over time to glean insights about the best ways to configure its office building.
* Triggering work order tickets to a mobile app that drives security guard dispatch, janitorial services scheduling, and any other services in a retail space or sports venue.
* Showing a building occupant which rooms are occupied in a building in real time. Then, helping the occupant reserve workspaces and find colleagues.
* Tracking what assets are located within a space, or what assets are in a given space.
* Optimizing electric vehicle charging my modeling user preferences and energy-grid constraints.

## Next steps

For full code samples:

> [!div class="nextstepaction"]
> [C# code samples](https://github.com/Azure-Samples/digital-twins-samples-csharp)
