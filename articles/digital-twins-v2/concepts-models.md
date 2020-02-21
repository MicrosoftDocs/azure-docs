---
# Mandatory fields.
title: Modeling objects
description: Understand how Azure Digital Twins uses user-defined models to describe objects within the graph.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/21/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Understand object modeling in Azure Digital Twins

## Digital Twins Definition Language: DTDL

Digital Twin models for ADT are defined using the Digital Twin Description Language (DTDL). DTDL is written in JSON-LD and programming language independent.  
This section provides conceptual information on DTDL. Please see the DTDL reference [Add Link to DTDL specification] for more details on DTDL. 
DTDL in ADT versus DTDL in Plug and Play
DTDL is also used as part of Azure IoT Plug and Play. Developers of Plug and Play devices use a subset of the same description language used for twins. This document describes DTDL as used in ADT, please see Add reference to PnP DTDL specs.
The DTDL version used for Plug and Play is semantically a subset of DTDL for ADT: Every CapabilityModel as defined by PnP is also a valid interface for use in ADT.  

## Interfaces

Model descriptions in DTDL are called interfaces. An interface describes a model in terms of:
* Properties. Properties are data fields that represent the state of an entity, just like in most object-oriented languages. Unlike telemetry, which is just a data event, properties have backing storage and can be read at any time.
* Telemetry. Telemetry fields represent measurements or events. Measurement are typically used for the equivalent of sensor readings. Telemetry is not stored on a twin – it is effectively sent as a stream of data events.
* Commands. Commands represent methods can be executed on the digital twin. An example would be a reset command, or a command to switch a fan on or off. Command descriptions include command parameters and return values.
* Relationships. Relationships lets you model how a given twin is related to other twins. Relationships can represent different semantic meanings, such as “floor contains room”, “hvac cools rooms”, “Compressor is-billed-to user” etc. Using relationships, digital twins solutions construct a graph of interrelated twins. 
* Components. A component lets you build your model as an assembly of other interfaces. Use a component to describe something that is an integral part of your model, and that does not need to be created, deleted or re-arranged in your topology of twins independently. In contrast, use independent twins connected by a relationship when you want both parts to have an independent existence in the graph.

Example that shows how to think about relationships versus components
A simple example model: [TBA – should probably be a model that exposes a command too]

```json
{
    "@id": "dtmi:com:example:Planet",
    "@type": "Interface",
    "contents": [
        {
            "@type": "Property",
            "name": "name",
            "schema": "string"
        },
        {
            "@type": "Property"
            "name": "mass",
            "schema": "double"
        },
        {
            "@type": "Relationship",
            "name": "satellites",
            "target": "dtmi:com:example:Moon"
        },
        {
            "@type": "Telemetry",
            "name": "locationOfCenterOfMass",
            "schema": "ex:CelestialCoordinate"
        }
    ]
}
```

As the example shows, all content of an interface is described in the “contents” section of the DTDL file as an array of attribute definitions, where each attribute has a type (telemetry, property, relationship, etc.) and a set of properties that define the actual attribute (e.g. name and schema to define a property).

## Inheritance

Often, it is desirable to specialize a given model. For example, a generic model “Room” might have specialized variants “ConferenceRoom” or “Gym”. To express specialization, DTDL supports inheritance: Interfaces can inherit from one or more other interfaces. 

```json
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
```

In this example, both Planet and Moon inherit from CelestialBody, which contributes a name, a mass and a location to both Planet and Moon. Inheritance is expressed in the DTDL files with the “extends” section, which points to an array of interface specifications.
If inheritance is applied, the sub-type exposes all properties from the entire inheritance chain.
The extending interface cannot change any of the definitions of the parent interfaces. It can only add to them. Note that an interface inheriting from one or more interfaces cannot define a capability already defined in one of those “parent” interfaces (even if the capabilities are defined the same). For example, if a parent interface defines a double property “foo”, the extending interface cannot contain a declaration of foo, even if it is also declared as a double.

## Data Types

Property and telemetry values can be of standard primitive types – integer, double, string and Boolean and others, such as DateTime and Duration. See Reference to DTDL documentation for complete information.
Add information on mandatory versus optional properties
In addition to primitive types, property and telemetry fields can have the following four complex types:
* Object
* Array
* Map
* Enum
Add more descriptions and an example	
