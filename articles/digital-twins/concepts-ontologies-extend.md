---
# Mandatory fields.
title: Extending ontologies
titleSuffix: Azure Digital Twins
description: Learn about the reasons and strategies behind extending an ontology
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/29/2023
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Extending ontologies 

This article uses the [DTDL-based RealEstateCore ontology for smart buildings](https://github.com/Azure/opendigitaltwins-building) as the basis for examples of extending ontologies with new DTDL properties. The techniques described here are general, however, and can be applied to any part of a DTDL-based ontology with any DTDL capability (Telemetry, Property, Relationship, Component). 

Microsoft's [industry-standard ontologies](concepts-ontologies-adopt.md), such as the DTDL-based [RealEstateCore](https://www.realestatecore.io/) ontology, are a great way to start building your IoT solution. Industry ontologies provide a rich set of base interfaces that are designed for your domain and engineered to work out of the box in Azure IoT services like Azure Digital Twins. 

However, it's possible that your solution may have specific needs that aren't covered by the industry ontology. For example, you may want to link your digital twins to 3D models stored in a separate system. In this case, you can extend one of these ontologies to add your own capabilities while keeping all the [benefits of the original ontology](concepts-ontologies.md).

## RealEstateCore space hierarchy 

In the DTDL-based RealEstateCore ontology, the Space hierarchy is used to define various kinds of spaces: Rooms, Buildings, Zone, and so on. The hierarchy extends from each of these models to define various kinds of Rooms, Buildings, and Zones. 

A portion of the hierarchy looks like the diagram below. 

:::image type="content" source="media/concepts-ontologies-extend/real-estate-core-original.png" alt-text="Diagram showing part of the RealEstateCore space hierarchy. It shows elements for Space, Room, ConferenceRoom, and Office."::: 

For more information about the RealEstateCore ontology, see [Digital Twins Definition Language-based RealEstateCore ontology for smart buildings](https://github.com/Azure/opendigitaltwins-building) on GitHub.

## Extending the RealEstateCore space hierarchy 

Sometimes your solution has specific needs that aren't covered by the industry ontology. In this case, extending the hierarchy enables you to continue to use the industry ontology while customizing it for your needs. 

In this article, we discuss two different cases where extending the ontology's hierarchy is useful: 

* Adding new interfaces for concepts not in the industry ontology. 
* Adding extra Properties (or Relationships, Components, and Telemetry) to existing interfaces.

### Add new interfaces for new concepts 

In this case, you want to add interfaces for concepts needed for your solution that aren't present in the industry ontology. For example, if your solution has other types of rooms that aren't represented in the DTDL-based RealEstateCore ontology, then you can add them by extending directly from the RealEstateCore interfaces. 

The example below presents a solution that needs to represent "focus rooms," which aren't present in the RealEstateCore ontology. A focus room is a small space designed for people to focus on a task for a couple hours at a time. 

To extend the industry ontology with this new concept, create a new interface that [extends from](concepts-models.md#model-inheritance) the interfaces in the industry ontology. 

After adding the focus room interface, the extended hierarchy shows the new room type. 

:::image type="content" source="media/concepts-ontologies-extend/real-estate-core-extended-new.png" alt-text="Diagram showing part of the RealEstateCore space hierarchy, including a new addition of Focus Room."::: 

### Add extra capabilities to existing interfaces 

In this case, you want to add more Properties (or Relationships, Components, and Telemetry) to interfaces that are in the industry ontology.

In this section, you'll see two examples: 
* If you're building a solution that displays 3D drawings of spaces that you already have in an existing system, you might want to associate each digital twin to its 3D drawing (by ID) so that when the solution displays information about the space, it can also retrieve the 3D drawing from the existing system. 
* If your solution needs to track the online/offline status of conference rooms, then you might want to track the conference room status for use in display or queries. 

Both examples can be implemented with new properties: a `drawingId` property that associates the 3D drawing with the digital twin and an `online` property that indicates whether the conference room is online or not. 

Typically, you don't want to modify the industry ontology directly because you want to be able to incorporate updates to it in your solution in the future (which would overwrite your additions). Instead, these kinds of additions can be made in your own interface hierarchy that extends from the DTDL-based RealEstateCore ontology. Each interface you create uses multiple interface inheritances to extend its parent RealEstateCore interface and its parent interface from your extended interface hierarchy. This approach enables you to make use of the industry ontology and your additions together. 

To extend the industry ontology, create your own interfaces that extend from the interfaces in the industry ontology and add the new capabilities to your extended interfaces. For each interface that you want to extend, create a new interface. The extended interfaces are written in DTDL (see [DTDL for Extended Interfaces](#dtdl-for-extended-interfaces) later in this document). 

After extending the portion of the hierarchy shown above, the extended hierarchy looks like the diagram below. Here the extended Space interface adds the `drawingId` property that will contain an ID that associates the digital twin with the 3D drawing. Additionally, the ConferenceRoom interface adds an `online` property that will contain the online status of the conference room. Through inheritance, the ConferenceRoom interface contains all capabilities from the RealEstateCore ConferenceRoom interface and all capabilities from the extended Space interface. 

:::image type="content" source="media/concepts-ontologies-extend/real-estate-core-extended-existing.png" alt-text="Diagram showing the extended RealEstateCore space hierarchy, with more new additions as described.":::

You don't have to extend every interface in the industry ontology, only those where you need to add new capabilities. For example, if you need to add a new capability, such as an `arterial` property to the Hallway interface, you can extend that interface without extending other interfaces that also extend from Room. 

:::image type="content" source="media/concepts-ontologies-extend/real-estate-core-extended-existing-small.png" alt-text="Diagram showing an extended RealEstateCore space hierarchy, containing an extended Hallway interface with an arterial property.":::

#### Relationships to extended interfaces

Extended interfaces can also be used as the target for relationships, even if the relationship is originally modeled to target a base interface. As an example, in the DTDL-based RealEstateCore ontology, the Apartment interface contains a Relationship named *includes* that targets a Room interface (shown in the diagram below). This lets you create a graph of rooms to make up the apartment. 

Based on the portion of the Room hierarchy from the [previous section](#add-extra-capabilities-to-existing-interfaces), an Apartment digital twin can include Room-type twins, and Hallway is an extension of Room (so an Apartment can include Hallways). This also means that an Apartment can include an extended Hallway with the `arterial` property, because an extended Hallway counts as a Hallway as it's referenced in the original relationships. 

:::image type="content" source="media/concepts-ontologies-extend/real-estate-core-extended-relationships.png" alt-text="Diagram showing an extended RealEstateCore space hierarchy, with an extended Hallway interface and relationships to it."::: 

## Using the extended space hierarchy 

When you create digital twins using the extended Space hierarchy, each digital twin's model will be one from the extended Space hierarchy (not the original industry ontology) and will include all the capabilities from the industry ontology and the extended interfaces through interface inheritance.

Each digital twin's model will be an interface from the extended hierarchy, shown in the diagram below. 
 
:::image type="content" source="media/concepts-ontologies-extend/ontology-with-models.png" alt-text="Diagram showing the extended RealEstateCore space hierarchy, including the connected models Space, Room, ConferenceRoom, Office, and FocusRoom."::: 

When querying for digital twins using the model ID (the `IS_OF_MODEL` operator), the model IDs from the extended hierarchy should be used. For example, `SELECT * FROM DIGITALTWINS WHERE IS_OF_MODEL('dtmi:com:example:Office;1')`. 

## Contributing back to the original ontology 

In some cases, you'll extend the industry ontology in a way that is broadly useful to most users of the ontology. In this case, you should consider contributing your extensions back to the original ontology. Each ontology has a different process for contributing, so check the ontology's GitHub repository for contribution details. 

## DTDL for new interfaces 

The DTDL for new interfaces that extend directly from the industry ontology would look like this. 

```json
{
  "@id": "dtmi:com:example:FocusRoom;1", 
  "@type": "interface", 
  "extends": "dtmi:digitaltwins:rec_3_3:building:Office;1", 
  "@context": "dtmi:dtdl:context;2" 
} 
```

## DTDL for extended interfaces 

The DTDL for the extended interfaces, limited to the portion discussed above, would look like this. 

```json
[
  {
    "@id": "dtmi:com:example:Space;1",
    "@type": "Interface",
    "extends": "dtmi:digitaltwins:rec_3_3:core:Space;1",
    "contents": [
      {
        "@type": "Property",
        "name": "drawingid",
        "schema": "string"
      }
    ],
    "@context": "dtmi:dtdl:context;2"
  },
  {
    "@id": "dtmi:com:example:Room;1",
    "@type": "Interface",
    "extends": [
      "dtmi:digitaltwins:rec_3_3:core:Room;1",
      "dtmi:com:example:Space;1"
    ],
    "@context": "dtmi:dtdl:context;2"
  },
  {
    "@id": "dtmi:com:example:ConferenceRoom;1",
    "@type": "Interface",
    "extends": [
      "dtmi:digitaltwins:rec_3_3:building:ConferenceRoom;1",
      "dtmi:com:example:Room;1"
    ],
    "contents": [
      {
        "@type": "Property",
        "name": "online",
        "schema": "boolean"
      }
    ],
    "@context": "dtmi:dtdl:context;2"
  },
  {
    "@id": "dtmi:com:example:Office;1",
    "@type": "Interface",
    "extends": [
      "dtmi:digitaltwins:rec_3_3:building:Office;1", 
      "dtmi:com:example:Room;1" 
    ],
    "@context": "dtmi:dtdl:context;2" 
  }, 
  {
    "@id": "dtmi:com:example:FocusRoom;1", 
    "@type": "Interface", 
    "extends": "dtmi:com:example:Office;1", 
    "@context": "dtmi:dtdl:context;2" 
  }
]
``` 

## Next steps

Continue on the path for developing models based on ontologies: [Full model development path](concepts-ontologies.md#full-model-development-path).
