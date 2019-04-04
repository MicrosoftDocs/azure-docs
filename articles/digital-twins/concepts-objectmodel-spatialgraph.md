---
title: Understand Digital Twins object models and spatial intelligence graph | Microsoft Docs
description: Use Azure Digital Twins to model relationships between people, places, and devices
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 12/14/2018
ms.author: alinast
---

# Understand Digital Twins object models and spatial intelligence graph

Azure Digital Twins is an Azure IoT service that powers comprehensive virtual representations of physical environments and associated devices, sensors, and people. It improves development by organizing domain-specific concepts into helpful models. The models are then situated within a spatial intelligence graph. Such concepts faithfully model the relationships and interactions between people, spaces, and devices.

Digital Twins object models describe domain-specific concepts, categories, and properties. Models are predefined by users who want to tailor the solution to their specific needs. Together, these predefined Digital Twins object models make up an _ontology_. A smart building's ontology describes regions, venues, floors, offices, zones, conference rooms, and focus rooms. An energy grid ontology describes various power stations, substations, energy resources, and customers. With Digital Twins object models and ontologies, diverse scenarios and needs can be customized.

With Digital Twins object models and an ontology in place, you can populate a _spatial graph_. Spatial graphs are virtual representations of the many relationships between spaces, devices, and people that are relevant to an IoT solution. This diagram shows an example of a spatial graph that uses a smart building's ontology.

![Digital Twins spatial graph building][1]

<a id="model"></a>

The spatial graph brings together spaces, devices, sensors, and users. Each is linked together in a way that models the real world. In this sample, venue 43 has four floors, each with many different areas. Users are associated with their workstations and given access to portions of the graph. An administrator has the rights to make changes to the spatial graph, while a visitor has rights to only view certain building data.

## Digital Twins object models

Digital Twins object models support these main categories of objects:

- **Spaces** are virtual or physical locations, for example, `Tenant`, `Customer`, `Region`, and `Venue`.
- **Devices** are virtual or physical pieces of equipment, for example, `AwesomeCompany Device` and `Raspberry Pi 3`.
- **Sensors** are objects that detect events, for example, `AwesomeCompany Temperature Sensor` and `AwesomeCompany Presence Sensor`.
- **Users** identify occupants and their characteristics.

Other categories of objects are:

- **Resources** are attached to a space and typically represent Azure resources to be used by objects in the spatial graph, for example, `IoTHub`.
- **Blobs** are attached to objects (such as spaces, devices, sensors, and users). They're used as files with mime type and metadata, for example, `maps`, `pictures`, and `manuals`.
- **Extended types** are extensible enumerations that augment entities with specific characteristics, for example `SpaceType` and `SpaceSubtype`.
- **Ontologies** represent a set of extended types, for example, `Default`, `Building`, `BACnet`, and `EnergyGrid`.
- **Property keys and values** are custom characteristics of spaces, devices, sensors, and users. They can be used along with built-in characteristics, for example, `DeltaProcessingRefreshTime` as key and `10` as value.
- **Roles** are sets of permissions assigned to users and devices in the spatial graph, for example, `Space Administrator`, `User Administrator`, and `Device Administrator`.
- **Role assignments** are the association between a role and an object in the spatial graph. For example, a user or a service principal can be granted permission to manage a space in the spatial graph.
- **Security key stores** provide the security keys for all devices in the hierarchy under a given space object to allow the device to securely communicate with Digital Twins.
- **User-defined functions** (UDFs) allow customizable sensor telemetry processing within the spatial graph. For example, a UDF can:
  - Set a sensor value.
  - Perform custom logic based on sensor readings, and set the output to a space.
  - Attach metadata to a space.
  - Send notifications when predefined conditions are met. Currently, UDFs can be written in JavaScript.
- **Matchers** are objects that determine which UDFs are executed for a given telemetry message.
- **Endpoints** are the locations where telemetry messages and Digital Twins events can be routed, for example, `Event Hub`, `Service Bus`, and `Event Grid`.

<a id="graph"></a>

## Spatial intelligence graph

Spatial graph is the hierarchical graph of spaces, devices, and people defined in the Digital Twins object model. The spatial graph supports inheritance, filtering, traversing, scalability, and extensibility. You can manage and interact with your spatial graph with a collection of REST APIs.

If you deploy a Digital Twins service in your subscription, you become the global administrator of the root node. You're then automatically granted full access to the entire structure. Provision spaces in the graph by using the Space API. Provision services by using the Device API and sensors by using the Sensor API. [Open source tools](https://github.com/Azure-Samples/digital-twins-samples-csharp) also are available to provision the graph in bulk.

**Graph inheritance**. Inheritance applies to the permissions and properties that descend from a parent node to all nodes beneath it. For example, when a role is assigned to a user on a given node, the user has that role's permissions to the given node and every node below it. Each property key and extended type defined for a given node is inherited by all the nodes beneath that node.

**Graph filtering**. Filtering is used to narrow down request results. You can filter by IDs, name, types, subtypes, parent space, and associated spaces. You also can filter by sensor data types, property keys and values, *traverse*, *minLevel*, *maxLevel*, and other OData filter parameters.

**Graph traversing**. You can traverse the spatial graph through its depth and breadth. For depth, traverse the graph top-down or bottom-up by using the parameters *traverse*, *minLevel*, and *maxLevel*. Traverse the graph to get sibling nodes directly attached to a parent space or one of its descendants for breadth. When you query an object, you can get all related objects that have relationships to that object by using the *includes* parameter of the GET APIs.

**Graph scalability**. Digital Twins guarantees graph scalability, so it can handle your real-world workloads. Digital Twins can be used to represent large portfolios of real estate, infrastructure, devices, sensors, telemetry, and more.

**Graph extensibility**. Use extensibility to customize the underlying Digital Twins object models with new types and ontologies. Your Digital Twins data also can be enriched with extensible properties and values.

### Spatial intelligence graph Management APIs

After you deploy Digital Twins from the [Azure portal](https://portal.azure.com), the [Swagger](https://swagger.io/tools/swagger-ui/) URL of the Management APIs is automatically generated. It's displayed in the Azure portal in the **Overview** section with the following format.

```plaintext
https://YOUR_INSTANCE_NAME.YOUR_LOCATION.azuresmartspaces.net/management/swagger
```

| Name | Replace with |
| --- | --- |
| YOUR_INSTANCE_NAME | The name of your Digital Twins instance |
| YOUR_LOCATION | Which server region your instance is hosted on |

 The full URL format appears in this image.

![Digital Twins portal Management API][2]

For more details on how to use spatial intelligence graphs, visit the Azure Digital Twins Management APIs sneak preview.

> [!TIP]
> A Swagger sneak preview is provided to demonstrate the API feature set.
> It's hosted at [docs.westcentralus.azuresmartspaces.net/management/swagger](https://docs.westcentralus.azuresmartspaces.net/management/swagger).

Learn more about [how to use Swagger](how-to-use-swagger.md).

All API calls must be authenticated by using [OAuth](https://docs.microsoft.com/azure/active-directory/develop/v1-protocols-oauth-code). The APIs follow [Microsoft REST API Guidelines conventions](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md). Most of the APIs that return collections support [OData](https://www.odata.org/getting-started/basic-tutorial/#queryData) system query options.

## Next steps

- To learn about device connectivity and how to send telemetry messages to Digital Twins, read [Azure Digital Twins device connectivity and telemetry ingress](concepts-device-ingress.md).

- To learn about Management API limitations and throttles, read [Azure Digital Twins API management and limitations](concepts-service-limits.md).

<!-- Images -->
[1]: media/concepts/digital-twins-spatial-graph-building.png
[2]: media/concepts/digital-twins-spatial-graph-management-api-url.png
