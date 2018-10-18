---
title: Understanding Digital Twins object models and spatial intelligence graph | Microsoft Docs
description: Using Azure Digital Twins to model relationships between people, places, and devices
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/08/2018
ms.author: alinast
---

# Understanding Digital Twins object models and spatial intelligence graph

Azure Digital Twins is an Azure IoT service that powers comprehensive virtual representations of physical environments and associated devices, sensors, and people. It improves development by organizing domain-specific concepts into helpful models, which are themselves situated within a spatial intelligence graph. Such concepts faithfully model the relationships and interactions between people, spaces, and devices.

_Digital Twins Object Models_ describe domain-specific concepts, categories, and properties. Models are predefined by users who are looking to tailor the solution to their specific needs. Together, these pre-defined Digital Twins Object Models make up an _Ontology_. A smart building's ontology would describe regions, venues, floors, offices, zones, conference rooms, and focus rooms. An energy grid ontology would describe various power stations, substations, energy resources, and customers. These Digital Twins Object Models and ontologies allow customizing Azure Digital Twins to diverse scenarios and needs.

With _Digital Twins Object Models_ and _Ontology_ in place, one can populate a _Spatial Graph_. Spatial graphs are virtual representations of the many relationships between spaces, devices, and people relevant to an IoT solution. The diagram below shows an example of a spatial graph using a smart building's ontology.

![Digital Twins Spatial Graph Building][1]

<a id="model" />

The spatial graph brings together spaces, devices, sensors, and users. Each is linked together in a way that models the real world: venue 43 has four floors, each with multiple different areas. Users are associated with their workstations and are given access to portions of the graph.  For example, an administrator would have rights to make changes to the spatial graph while a visitor might only have rights to view certain building data.

## Digital Twins object models

Digital Twins object models support these main categories of objects:

- **Spaces** are virtual or physical locations, for example `Tenant`, `Customer`, `Region`, `Venue`.
- **Devices** are virtual or physical pieces of equipment, for example `AwesomeCompany Device`, `Raspberry Pi 3`.
- **Sensors** are objects that detect events, for example `AwesomeCompany Temperature Sensor`, `AwesomeCompany Presence Sensor`.
- **Users** identify occupants and their characteristics.

Other categories of objects are:

- **Resources** are attached to a space and typically represent Azure resources to be used by objects in the spatial graph, for example `IoTHub`.
- **Blobs** are attached to objects (such as spaces, devices, sensors, and users) and used as files with mime type and metadata, for example `maps`, `pictures`, `manuals`.
- **Extended Types** are extensible enumerations that augment entities with specific characteristics, for example `SpaceType`, `SpaceSubtype`.
- **Ontologies** represent a set of extended types, for example `Default`, `Building`, `BACnet`, `EnergyGrid`.
- **Property Keys and Values** are custom characteristics of spaces, devices, sensors, and users. They can be used in addition to built-in characteristics, for example `DeltaProcessingRefreshTime` as Key and `10` as Value.
- **Roles** are sets of permissions assigned to users and devices in the spatial graph, for example `Space Administrator`, `User Administrator`, `Device Administrator`.
- **Role Assignments** are the association between a role and an object in the spatial graph, for example granting a user or a service principal permission to manage a space in the spatial graph.
- **Security Key Stores** provide the security keys for all devices in the hierarchy under a given space object to allow the device to securely communicate with the Digital Twins service.
- **User-Defined-Functions** or **UDFs** allow customizable sensor telemetry processing within the spatial graph. For example, a UDF can set a sensor value, perform custom logic based on sensor readings and set the output to a space, attach metadata to a space, and send notifications when predefined conditions are met. Currently UDFs can be written in JavaScript.
- **Matchers** are objects that determine which UDFs will be executed for a given telemetry message.
- **Endpoints** are the locations where telemetry messages and Digital Twins events can be routed, for example `Event Hub`, `Service Bus`, `Event Grid`.

<a id="graph" />

## Spatial intelligence graph

**Spatial graph** is the hierarchical graph of spaces, devices, and people defined in the **Digital Twins object model**. The spatial graph supports _inheritance_, _filtering_, _traversing_, _scalability_, and _extensibility_. Users can manage and interact with their spatial graph with a collection of REST APIs (see below).

The user who deploys a Digital Twins service in their subscription becomes the global administrator of the root node, automatically granting full access to entire structure. This user can then provision spaces in the graph using the `Space` API. Devices could be provisioned using the `Device` API, sensors could be provisioned using `Sensor` API, etc. We also offer [open source tools](https://github.com/Azure-Samples/digital-twins-samples-csharp) to provision the graph in bulk.

Graph _inheritance_ applies to the permissions and properties that descend from a parent node to all nodes beneath it. For example, when a role is assigned to a user on a given node, the user will have that role's permissions to the given node and every node below it. Additionally, each property key and extended type defined for a given node will be inherited by all the nodes beneath that node.

Graph _filtering_ enables users to narrow down request results by IDs, name, types, subtypes, parent space, associated spaces, sensor data types, property keys and values, traverse, minLevel, maxLevel, and other OData filter parameters.

Graph _traversing_ allows users to navigate the spatial graph through its depth and breadth. For depth, the graph could be traversed top-down or bottom-up using navigation parameters `traverse`, `minLevel`, `maxLevel`. For breadth, the graph could be navigated to get sibling nodes directly attached to a parent space or one of its descendants. When querying an object, you could get all related objects that have relationships to that object using the `includes` parameter of the GET APIs.

Azure Digital Twins guarantees graph _scalability_, so it can handle your real-world workloads. Digital Twins can be used to represent large portfolios of real estate, infrastructure, devices, sensors, telemetry, and more.

Graph _extensibility_ allows users to customize the underlying Digital Twins Object Models with new types and ontologies. Your digital twins' data can also be enriched with extensible properties and values.

### Spatial intelligence graph Management APIs

Once you deploy Azure Digital Twins from the [Azure portal](https://portal.azure.com), the [Swagger](https://swagger.io/tools/swagger-ui/) URL of the Management APIs is automatically generated and will be displayed in the Azure portal's **Overview** section with the following format:

```plaintext
https://yourInstanceName.yourLocation.azuresmartspaces.net/management/swagger
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourInstanceName` | The name of your Azure Digital Twins instance |
| `yourLocation` | Which server region your instance is hosted on |

 The full URL format can be seen being used in image below:

![Digital Twins Portal Management API][2]

For more details on using Spatial Intelligence Graphs, visit the Azure Digital Twins Management APIs sneak preview.

> [!TIP]
> A Swagger sneak preview is provided to demonstrate the API feature set.
> It's hosted at [docs.westcentralus.azuresmartspaces.net/management/swagger](https://docs.westcentralus.azuresmartspaces.net/management/swagger).

Learn more about [how to use Swagger](how-to-use-swagger.md).

All API calls must be authenticated using [OAuth](https://docs.microsoft.com/azure/active-directory/develop/v1-protocols-oauth-code). The APIs follow [Microsoft REST API Guidelines conventions](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md). Most of the APIs that return collections support [OData](http://www.odata.org/getting-started/basic-tutorial/#queryData) system query options.

## Next steps

To learn about device connectivity and how to send telemetry messages to Azure Digital Twins service, read [Azure Digital Twins device connectivity and telemetry ingress](concepts-device-ingress.md).

To learn about Management API limitations and throttles, read [Azure Digital Twins API management and limitations](concepts-service-limits.md).

<!-- Images -->
[1]: media/concepts/digital-twins-spatial-graph-building.png
[2]: media/concepts/digital-twins-spatial-graph-management-api-url.png
