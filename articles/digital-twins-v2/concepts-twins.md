---
# Mandatory fields.
title: Twin representation
description: Understand the concept of a digital twin, what its properties can be in Azure Digital Twins, and what role twins serve within the ADT graph.
author: philmea
ms.author: philmea # Microsoft employees only
ms.date: 2/12/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---
# Understand the concept of a digital twin

## Here is an info dump.

Creating a Graph of Twins: Relationships
Add developer documentation regarding relationships
Inheritance
Often, it is desirable to specialize a given model. For example, a generic model “Room” might have specialized variants “ConferenceRoom” or “Gym”. To express specialization, DTDL supports inheritance: Interfaces can inherit from one or more other interfaces. 
{
    "@id": " dtmi:com:example:CelestialBody",
    "@type": "Interface",
    "contents": [
        {
            "@type": "Property",
            "name": "location",
            "schema": " dtmi:com:example:CelestialCoordinate"
        },
        {
            "@type": "Property",
            "name": "name",
            "schema": "string"
        },
        {
            "@type": "Property"
            "name": "mass",
            "schema": "double"
        }
    ] ,
    "@context": "http://azure.com/v3/contexts/Model.json"
},
{
    "@id": "dtmi:com:example:Planet;1",
    "@type": "Interface",
    “extends”: [
        “dtmi:com:example:CelestialBody”
    ]
    "contents": [
        {
            "@type": "Relationship",
            "name": "satellites",
            "target": " dtmi:com:example:Moon"
        }
    ] ,
    "@context": "http://azure.com/v3/contexts/Model.json"
},
{
    "@id": " dtmi:com:example:Moon",
    "@type": "Interface",
    “extends”: [
        “dtmi:com:example:CelestialBody”
    ],
    "contents": [
        {
            "@type": "Relationship",
            "name": "owner",
            "target": " dtmi:com:example:Planet"
        }
    ] ,
    "@context": "http://azure.com/v3/contexts/Model.json"
}
In this example, both Planet and Moon inherit from CelestialBody, which contributes a name, a mass and a location to both Planet and Moon. Inheritance is expressed in the DTDL files with the “extends” section, which points to an array of interface specifications.
If inheritance is applied, the sub-type exposes all properties from the entire inheritance chain.
The extending interface cannot change any of the definitions of the parent interfaces. It can only add to them. Note that an interface inheriting from one or more interfaces cannot define a capability already defined in one of those “parent” interfaces (even if the capabilities are defined the same). For example, if a parent interface defines a double property “foo”, the extending interface cannot contain a declaration of foo, even if it is also declared as a double.
