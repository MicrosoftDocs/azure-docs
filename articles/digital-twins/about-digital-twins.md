---
title: Overview of Azure Digital Twins | Microsoft Docs
description: Learn more about Azure Digital Twins, an Azure IoT solution for spatial intelligence.
author: julieseto
ms.author: jseto
ms.date: 05/31/2019
ms.topic: overview
ms.service: digital-twins
services: digital-twins
manager: bertvanhoof
ms.custom: mvc
#Customer intent: As an Azure enterprise customer, I want to know what capabilities Digital Twins has so that I can build next-generation IoT services. 
---

# Overview of Azure Digital Twins

Azure Digital Twins Preview is an Azure IoT service that creates comprehensive models of the physical environment. It can create spatial intelligence graphs to model the relationships and interactions between people, spaces, and devices.

With Azure Digital Twins, you can query data from a physical space rather than from many disparate sensors. This service helps you build reusable, highly scalable, spatially aware experiences that link streaming data across the digital and physical world. Your apps are enhanced by these uniquely relevant contextual features. 

Azure Digital Twins applies to all types of environments, such as, warehouses, offices, schools, hospitals, and banks. It can even be used for stadiums, factories, parking lots, parks, smart grids, and cities. The following are some scenarios where Azure Digital Twins can be helpful:

- Predict maintenance needs for a factory.
- Analyze real-time energy requirements for an electrical grid.
- Optimize the use of available space for an office.
- Track daily temperature across several states.
- Monitor busy drone paths.
- Identify autonomous vehicles.
- Analyze occupancy levels for a building.
- Find the busiest cash register in your store.

Whatever your real-world business scenario is, it's very likely a corresponding digital instance can be provisioned through Azure Digital Twins.

The following video takes a closer look at Azure Digital Twins.

> [!VIDEO https://www.youtube.com/embed/TvN_NxpgyzQ]

## Key capabilities

Azure Digital Twins has the following key capabilities.

### Spatial intelligence graph

The [*spatial intelligence graph*](./concepts-objectmodel-spatialgraph.md#graph), or *spatial graph*, is a virtual representation of the physical environment. You can use it to model the relationships between people, places, and devices.

Consider a smart utility app that involves several electricity usage meters connected across a neighborhood. The smart utility company must accurately monitor and predict electricity usage and billing. Each device and sensor must be modeled with context about the location and the customer that's to be billed. You can use the spatial intelligence graph to model these kinds of complex relationships.

### Digital twin object models

[Digital twin object models](./concepts-objectmodel-spatialgraph.md#model) are predefined device protocols and data schema. They align your solution’s domain-specific needs to accelerate and simplify development.

For example, a room occupancy application might use predefined space types such as campus, building, floor, and room.

### Multiple and nested tenants

You can build solutions that scale securely and can be reused for multiple tenants. You also can create multiple subtenants that can be accessed and used in an isolated and secure manner.

An example is a space utilization app that's configured to isolate a tenant's data from other tenants' data within a single building. Or the app is used to combine data for a single tenant with numerous buildings.

### Advanced compute capabilities

With [user-defined functions](./concepts-user-defined-functions.md), you can define and run custom functions against incoming [device data](./concepts-device-ingress.md) to send signals to predefined endpoints. This advanced capability improves customization and automation of device tasks.

An example is a smart agriculture application that includes a user-defined function to assess soil moisture sensor readings and the weather forecast. The app then sends signals about the irrigation needs.

### Built-in access control

By using access and identity management features such as [role-based access control](./security-role-based-access-control.md) and [Azure Active Directory](./security-authenticating-apis.md), you can securely control access for individuals and devices.

An example is a facilities management app that's configured to allow occupants of a room to set the temperature within a specified range. Facilities managers are allowed to set the temperature in any room to any value.

### Ecosystem

You can connect an Azure Digital Twins instance to many powerful Azure services. These services include Azure Stream Analytics, Azure AI, and Azure Storage. They also include Azure Maps, Microsoft Mixed Reality, Dynamics 365, or Office 365.

An example is a smart office building application that uses Azure Digital Twins to represent teams and devices located on many floors. As devices stream live data into the provisioned Digital Twin instance, Stream Analytics processes that data to provide actionable key insights. The data is stored in Azure Storage and converted into a shareable file format. The file is distributed across the whole organization by using Office 365.

## Solutions that benefit from Azure Digital Twins

Azure Digital Twins is useful for representing the physical world and its many relationships. It simplifies IoT modeling, data processing, event handling, and device tracking. Consider just a few of the following scenarios across several industries. They benefit from its use to:

* Show a property management company the occupancy levels of a space over time to glean insights about the best ways to configure its office building.
* Trigger work order tickets for a mobile app. Use it to dispatch security guards and schedule janitorial and other services in a retail space or sports venue.
* Show a building occupant which rooms are occupied in a building in real time. Then, help the occupant reserve work spaces that fit their needs.
* Track where assets are located within a space.
* Optimize electric vehicle charging by modeling user preferences and energy-grid constraints.

## Azure Digital Twins in the context of other IoT services

Azure Digital Twins uses Azure IoT Hub to connect the IoT devices and sensors that keep everything up-to-date with the physical world. The following diagram shows how Azure Digital Twins relates to other Azure IoT services.

![Azure Digital Twins is a service built on top of Azure IoT Hub][1]

For more information about IoT, see [Azure IoT technologies and solutions](https://docs.microsoft.com/azure/iot-fundamentals/iot-services-and-technologies).

## Next steps

Go to a short demo about Azure Digital Twins:

>[!div class="nextstepaction"]
>[Quickstart: Find available rooms by using Azure Digital Twins](./quickstart-view-occupancy-dotnet.md)

Look closely at a facilities management application by using Azure Digital Twins:

>[!div class="nextstepaction"]
>[Tutorial: Deploy Azure Digital Twins and configure a spatial graph](./tutorial-facilities-setup.md)

Learn about core Azure Digital Twins concepts:

>[!div class="nextstepaction"]
>[Understand the Digital Twins object model and spatial intelligence graph](./concepts-objectmodel-spatialgraph.md)

<!-- Images -->
[1]: media/overview/azure-digital-twins-in-iot-ecosystem.png