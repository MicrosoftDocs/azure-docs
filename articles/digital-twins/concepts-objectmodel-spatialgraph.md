---
title: Understanding the Digital Twins Object Models and Spatial Intelligence Graph | Microsoft Docs
description: Using Azure Digital Twins to model relationships between people, places, and devices
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 09/25/2018
ms.author: alinast
---

# Understanding Digital Twins Object Models and Spatial Intelligence Graph

Azure Digital Twins is a service in the Azure IoT Platform that allows you to create a comprehensive model of the physical environment. It provides a spatial intelligence graph and pre-loaded domain-specific concepts to model the relationships and interactions between people, spaces, and devices.

We start first with _Digital Twins Object Models_ to describe domain-specific concepts, categories, and properties. Models are predefined by users who are looking to customize the solution for their specific needs. Together, these pre-defined Digital Twins Object Models make up an _Ontology_. One ontology may be tailored to a smart buildings solution, and so it would describe concepts such as regions, venues, floors, offices, zones, conference rooms, and focus rooms. Another ontology might be tailored towards an energy grid solution and would describe various power stations, substations, energy resources, and customers.

With the _Digital Twins Object Models_ and _Ontology_ in place, you can now build your _Spatial Graph_, which is the virtual representation in which the spaces, devices, and people are related or arranged. Using a smart buildings ontology, the diagram below shows an example of a spatial graph. The spatial graph brings together spaces, devices, sensors, and users. Each is linked together in a way that models the real world: venue 43 has four floors, each with a variety of areas. Users are associated with their workstations and are given access to portions of the graph.  Depending on a user's role, they may be a customer and be able to view building data, or they may be an administrator with rights to make changes to the spatial graph.

![Digital Twins Spatial Graph Building][1]

## Digital Twins Object Models

Digital Twins Object Models support these main categories of objects:

- **Spaces** are virtual or physical locations, for example `Tenant`, `Customer`, `Region`, `Venue`.
- **Devices** are virtual or physical pieces of equipment, for example `Contoso Device`, `Raspberry Pi 3`.
- **Sensors** are objects that detect events, for example `Contoso Temperature Sensor`, `Contoso Presence Sensor`.
- **Users** identify occupants and their characteristics.

Other categories of objects are:

- **Resources** are attached to a space and typically represent Azure resources to be used by objects in the spatial graph, for example `IoTHub`.
- **Blobs** are attached to objects (such as spaces, devices, sensors, and users) and used as files with mime type and metadata, for example `maps`, `pictures`, `manuals`.
- **Extended Types** are extensible enumerations that augment entities with specific characteristics, for example `SpaceType`, `SpaceSubtype`.
- **Ontologies** represent a set of extended types, for example `Default`, `Building`, `BACnet`, `EnergyGrid`.
- **Property Keys and Values** are custom characteristics of spaces, devices, sensors, and users. They can be used in addition to built-in characteristics, for example `DeltaProcessingRefreshTime` as Key and `10` as Value.
- **Roles** are sets of permissions that are assigned to users and devices within the spatial graph, for example `Space Administrator`, `User Administrator`, `Device Administrator`.
- **Role Assignments** correspond to the association between identifiers and roles, for example granting a user or a service principal permission to manage a space in the spatial graph.
- **Security Key Stores** are assigned to spaces to provide the security keys for all devices in the hierarchy under the space object to allow the device to securely communicate with Digital Twins service.
- **User-Defined-Functions** or **UDFs** allow customizable sensor telemetry processing within the spatial graph. For example, a UDF can set a sensor reading on the sensor object, perform custom logic based on multiple sensor readings and set the output to a space, attach additional metadata to a space, and notify when certain conditions are met for incoming sensors readings. Currently UDFs can be written in JavaScript.
- **Matchers** are objects that determine which UDFs will be executed for a given telemetry message.
- **Endpoints** are the locations within the user’s subscription where telemetry messages and Digital Twins events can be routed, for example `Event Hub`, `Service Bus`, `Event Grid`.

## Spatial Intelligence Graph

**Spatial Graph** is the hierarchical graph of spaces, devices, and people defined in the **Digital Twins Object Model**. The spatial graph supports _inheritance_, _filtering_, _traversing_, _scalability_, and _extensibility_. Users can manage and interact with their spatial graph with a collection of REST APIs, which are accompanied by a Swagger companion specification. 

The user who deploys a Digital Twins service in their subscription becomes the global administrator of the root node, automatically granting full access to entire structure. This user can then provision the entire graph using the `Space` Management APIs. We also offer [open source tools](https://github.com/Azure-Samples/digital-twins-samples-csharp) to provision the graph in bulk.

In the picture above, the graph could be navigated through depth as well as breadth. For depth, the graph could be _traversed_ top-down or bottom-up using navigation parameters `traverse`, `minLevel`, `maxLevel` and could be filtered by specific `spaceId` or other defined properties. For breadth, the graph could be navigated to get sibling nodes directly attached to a parent space or one of its descendants. When querying an object, you could get all related objects that have relationships to that object using the `includes` parameter of the GET APIs.

Graph _inheritance_ applies to the permissions and properties that descend from a parent node to all nodes beneath it. For example, when a role is assigned to a user on a given node, the user will have that role's permissions to the given node and all nodes below it. Additionally, all property keys and extended types defined for a given node will be inherited by all the nodes beneath that node.

Graph _filtering_ enables users to narrow down request results by IDs, name, types, subtypes, parent space, associated spaces, sensor data types, property keys and values, traverse, minLevel, maxLevel, and other OData filter parameters.

We guarantee graph _scalability_, so we can handle your real-world workloads representing large portfolios of real estate, infrastructure, devices, sensors, telemetry, and more.

Graph _extensibility_ allows users to customize the underlying Digital Twins Object Models with new types and ontologies, but also to add properties and values to enrich your digital twins' data.

### Spatial Intelligence Graph Management APIs

Once you deploy Azure Digital Twins from the [Azure Portal](https://portal.azure.com), the URL of the Management APIs is automatically generated and will be displayed in the Azure Portal's **Overview** section with the following format `https://[yourDigitalTwinsName].[yourLocation].azuresmartspaces.net/management/swagger`. Browse the URL to learn more about the APIs you'll use to build with Azure Digital Twins.

All API calls must be authenticated using [OAuth](https://docs.microsoft.com/azure/active-directory/develop/v1-protocols-oauth-code). The APIs follow [Microsoft REST API Guidelines conventions](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md). Most of the APIs that return collections support [OData](http://www.odata.org/getting-started/basic-tutorial/#queryData) system query options.

>[!NOTE]
>For more details on how to use the Spatial Intelligence Graph, please visit your Digital Twins Management APIs URL.

<!-- Images -->
[1]: media/concepts/digital-twins-spatial-graph-building.png
