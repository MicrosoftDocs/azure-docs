---
title: Understanding Digital Twins Object Model and Spatial Intelligence Graph with Azure Digital Twins | Microsoft Docs
description: Using Azure Digital Twins to model relationships between people, places, and devices
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 09/14/2018
ms.author: alinast
---

# Understanding Digital Twins Object Model and Spatial Intelligence Graph

Azure Digital Twins is a service that uses a _Digital Twins Object Model_ to virtually model the people, places, and devices in the physical world and relationships between them. This model describes domain-specific concept definitions, categories, and properties. Models are predefined by customers who are looking to customize the solution for their specific needs: smart spaces, buildings, energy grids, factories, etc. We are calling any domain-specific models an _Ontology_.

One ontology may be tailored to a Smart Buildings solution, and so it would describe things like a region, venue, different floors of the venue, and then areas such as offices, zones, conference rooms, focus rooms, and so forth. Another ontology might be tailored towards an energy grid solution and would describe various substation types, energy resources, and customers.

With the _Object Model_ and _Ontology_ in place, you can now build your _Spatial Graph_, which is the specific way in which the different parts of the system are related or arranged. Using the Smart Buildings ontology, the diagram below shows an example of a spatial graph. The spatial graph brings together spaces, devices, sensors, and users. Each is linked together in a way that models the real world: venue 43 has four floors, each with a variety of areas. Users are associated with their workstations and are given access to portions of the graph.  Depending on a user's role, they may be a customer and be able to view building data, or they may be an administrator with rights to make changes to the spatial graph.

![Digital Twins Spatial Graph Building][1]

## Digital Twins Object Model

Object Model supports these main categories of objects: 
- **Spaces** are the virtual or physical locations, examples of space types are `Tenant`, `Customer`, `Region`, `Venue`.
- **Devices** are the virtual or physical piece of equipment, examples of device types are `Contoso Device`, `Raspberry Pi 3`.
- **Sensors** are objects that detect events, examples of sensor types are `Contoso Temperature Sensor`, `Contoso Presence Sensor`.
- **Users** are identifying occupants and their characteristics.

Other categories of objects are: 
- **Resources** are attached to a space and typically represent Azure resources to be used by objects in the space graph, for example `IoT Hub`.
- **Blobs** are attached to objects (such as spaces, devices, sensors, and users) and used as files with mime type and metadata, for example `maps`, `pictures`, `manuals`.
- **Extended Types** are extensible enumerations that augment entities with specific characteristics, for example `SpaceType`, `SpaceSubtype`.
- **Ontologies** represent a set of extended types, for example `Default`, `Building`, `BACnet`, `EnergyGrid`.
- **Property Keys and Values** are custom properties attached to objects (spaces, devices, sensors, and users) used in addition to the built-in ones, for example, `DeltaProcessingRefreshTime` as Key and `10` as Value.
- **Roles** are permissions roles that are assigned to users used to grant privileges on the spatial graph, for example `Space Administrator`, `User Administrator`, `Device Administrator`.
- **Role Assignments** correspond to the association between identifiers and roles, for example granting a user or a service principal permissions to manage a space in the spatial graph.
- **Security Key Stores** are assigned to spaces to provide the security keys for all devices in the hierarchy under the Space object to allow the device to securely communicate with Digital Twins service.
- **User-Defined-Functions** or **UDF** allows customizable sensor telemetry processing within the spatial graph. For example, UDF can set sensor reading on the sensor object, perform custom logic based on multiple sensor readings within the graph and sets it to the space, attach additional metadata to the space and notifies when certain conditions are met for incoming sensors readings. Currently the language supported by the platform is JavaScript.
- **Matchers** are objects that determine what UDFs will be executed for a given telemetry message.
- **Endpoints** are referring to location within the user’s subscription where telemetry messages can be forwarded and/or where Digital Twins events can be sent, for example `Event Hub`, `Service Bus`, `Event Grid`.

## Spatial Intelligence Graph

**Spatial Graph** is the hierarchical graph of instances of objects defined in the **Digital Twins Object Model**. The spatial graph supports _inheritance_, _filtering_, _traversing_, _scalability_, and _extensibility_. The graph is exposing a collection of REST APIs for management and interaction with your spatial graph and a Swagger companion specification. 

Users who deploys Digital Twins service in own subscription becames the tenant of the root node and gets automatically full access to entire structure. User then provisions the entire graph using `Space` Management APIs. We do offer [open source tools](https://github.com/Azure-Samples/digital-twins-samples-csharp) for bulk graph provisioning in addition to APIs.

In the picture above, the Building-specific graph could be navigated on depth, as well as on breadth. On depth, the graph could be _traversed_ top-down or bottom-up using navigation `traverse`, `minLevel`, `maxLevel` parameters and/or could be filtered by specific `spaceId` or other defined properties. On breadth, the graph could be navigated to get sibling nodes directly attached to a parent space or one of its descendants. When querying an object(s), you could get all related objects that have relationships to that object(s) using `includes` parameter of the GET APIs.

Graph _inheritance_ applies to inherited types if a role assignment is granted. For example, when a role is assigned to an identifier on a node, the identifier gains access rights to that node and all nodes below it. The identifier gains access to not only the properties for that node, but also inherited properties of the parent nodes up the chain. Currently, the properties that allow for inheritance include extended types and property keys.

Graph _filtering_ is advanced, for example Get Spaces API support filtering by list of spaces IDs, name, space types and subtypes, parent space, spaces associated with given user, sensor data types, property keys and values, traverse, minLevel, maxLevel, and other OData filter parameters.

Graph _scalability_ is our promise to you that we can handle your real-world workloads representing a campus of buildings, each with thousands of device and sensors. 

Graph _extensibility_ allows you to extend model with extended types and ontologies, but also to add properties and values to enrich your twins' digital data.

### Spatial Intelligence Graph Management APIs
> Note:  For more details on how to use the Spatial Intelligence Graph, please visit your Digital Twins Management APIs URL.

Once you deploy Azure Digital Twins from the Azure Portal, the URL of the Management APIs is generated in portal in the **Overview** section and has the following format `https://[yourDigitalTwinsName].[yourLocation].azuresmartspaces.net/management/swagger`. Browse the URL and learn about each object model APIs.

All API calls must be authenticated using [OAuth](https://docs.microsoft.com/azure/active-directory/develop/v1-protocols-oauth-code). The APIs follow [Microsoft REST API Guidelines conventions](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md). Most of the APIs that return collections support [OData](http://www.odata.org/getting-started/basic-tutorial/#queryData) system query options.

<!-- Images -->
[1]: media/concepts/digital-twins-spatial-graph-building.png