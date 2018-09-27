---
title: Overview of Azure Digital Twins | Microsoft Docs
description: An introduction to Azure Digital Twins
author: julieseto
ms.author: jseto
ms.date: 09/27/2018
ms.topic: overview
ms.service: azure-digital-twins
services: azure-digital-twins
manager: timlt
ms.custom: mvc
#Customer intent: As an Azure enterprise customer, I want to know what capabilities Digital Twins has so that I can build next generation IoT services. 
---

# Overview: What is Azure Digital Twins?

Azure Digital Twins is a service in the Azure IoT Platform that allows you to create a comprehensive model of the physical environment. It provides a spatial intelligence graph to model the relationships and interactions between people, spaces, and devices.

Azure Digital Twins allows querying data from a space rather than from many sensors. As such, you can build repeatable, scalable, spatially aware, experiences that are uniquely relevant because of their ability to correlate data across the digital and physical world.

Azure Digital Twins applies to environments of all types. Example environments include offices, schools, hospitals, banks, stadiums, factories, parking lots, parks, electrical grids, and cities. Example use cases are predicting maintenance needs, analyzing energy requirements, and optimizing the use of available space.

Take a look at the introductory video:

> [!VIDEO https://na01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fmicrosoft.sharepoint.com%2F%3Av%3A%2Ft%2FAzure_IoT%2FEcQnpZjDjDZPoHaAdg3mBYgBZyVusQUXbO07jcLERbCjzQ%3Fe%3DVg31r0&data=02%7C01%7Cv-adgera%40microsoft.com%7C45031a5be8834580333208d624b9a5b1%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636736777091275429&sdata=gWgsywiDxp0hpbegoU76Dl7SWZ%2BY7ncEOk0GojgJwpQ%3D&reserved=0] 

## Key Capabilities

Key capabilities of Azure Digital Twins include:

### Spatial intelligence graph

The [spatial intelligence graph](./concepts-objectmodel-spatialgraph.md) is a virtual representation of the physical environment that enables you to model the relationships between people, places, and devices.

For example, a smart utility app might involve several electricity usage devices connected across a neighborhood. To accurately monitor and predict electricity usage and billing, the smart utility company must model each each device and sensor with context about the location and the customer that will be billed. The spatial intelligence graph enables you to model these kinds of complex relationships.

### Digital twin object models

[Digital twin object models](./concepts-objectmodel-spatialgraph.md) are pre-defined device protocols and data schema that are aligned your solution’s domain-specific needs to accelerate and simplify development.

For example, a room occupancy application could use pre-defined space types such as campus, building, floor, room, etc.

### Multi and nested tenancy

You can build solutions that scale and securely replicate across multiple tenants or create multiple subtenants that can be accessed and used in an isolated and secure manner.

For example, a space utilization application could be configured to isolate data from different tenants in a single building, or to combine data for a single tenant with multiple buildings.

### Advanced compute capabilities

Advanced compute capabilities called [user-defined functions](./concepts-user-defined-functions.md) let you define and run custom functions against incoming [telemetry messages](./concepts-device-ingress.md) to send signals to pre-defined endpoints. This capability improves customization and automation of device tasks.

For example, a smart agriculture application could include a user-defined function that rungs logic based on soil moisture sensor readings and the weather forecast and sends signals to an irrigation system.

### Built-in access control

Access and identity management features such as [Role-Based Access Control](./security-role-based-access-control) and [Azure Active Directory](./security-authenticating-apis) enable you to securely control individuals’ and devices’ access.

For example, a facilities management app could be configured to allow occupants of a room to set the temperature within a specified range, and facilities managers to set the temperature in any room to any value.

### Ecosystem

You can connect an Azure Digital Twins instance to many powerful Azure services including: Azure Analytics, AI, and Storage services, as well as Azure Maps, Microsoft Mixed Reality, Dynamics 365, or Office 365.

For example, a smart office building application could use Azure Digital Twins.

## Solutions that Benefit from Azure Digital Twins

Azure Digital Twins is useful for representing the physical world and its many relationships since it simplifies IoT modeling, data processing, event handling, and device tracking. Consider just a few of the following scenarios, across several industries, that benefit from its use:

* Showing a property management company the occupancy levels of a space over time to glean insights about the best ways to configure its office building.
* Triggering work order tickets to a mobile app that drives security guard dispatch, janitorial services scheduling, and any other services in a retail space or sports venue.
* Showing a building occupant which rooms are occupied in a building in real-time. Then, helping the occupant reserve workspaces and find colleagues.
* Tracking where assets are located within a space, or what assets are there.
* Optimizing electric vehicle charging my modeling user preferences and energy-grid constraints.

## Azure Digital Twins in the context of other IoT Services

Azure Digital Twins uses Azure IoT Hub to connect the IoT devices and sensors that keep everything up-to-date with the physical world. The following diagram shows how Azure Digital Twins relates to other Azure IoT services:

![Azure Digital Twins is a service built on top of Azure IoT Hub](./media/overview/azure-digital-twins-in-iot-ecosystem.png)

For a more detailed description about the rest of the IoT ecosystem, see [Azure IoT technologies and solutions](https://docs.microsoft.com/en-us/azure/iot-fundamentals/iot-services-and-technologies).

## Next steps

* Learn about core Azure Digital Twins concepts: [Understanding the Digital Twins Object Model and Spatial Intelligence Graph](./concepts-objectmodel-spatialgraph.md)
* Try out an end-to-end IoT solution with Azure Digital Twins quick starts: [Find Available Rooms with Fresh Air](./quickstart-view-occupancy-dotnet.md)
