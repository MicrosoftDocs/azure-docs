---
# Mandatory fields.
title: Model an object
titleSuffix: Azure Digital Twins
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

Think of a **model** as a template that describes the characteristics of a particular type of twin in terms of properties, telemetry/events, commands etc. They are defined using the JSON-based **Digital Twin Definition Language (DTDL)**.  

## Key model components

Model descriptions in DTDL are called **interfaces**. An interface describes a model in terms of:
* **Properties** — Properties are data fields that represent the state of an entity, just like with many object-oriented programming languages. Unlike telemetry, which is just a data event, properties have backing storage and can be read at any time.
* **Telemetry** — Telemetry fields represent measurements or events. Measurements are typically used for the equivalent of sensor readings. Telemetry is not stored on a twin; it is effectively sent as a stream of data events.
* **Commands** — Commands represent methods that can be executed on a digital twin. An example would be a reset command, or a command to switch a fan on or off. Command descriptions include command parameters and return values.
* **Relationships** — Relationships let you model how a given twin is involved with other twins. Relationships can represent different semantic meanings, such as “floor contains room”, “hvac cools rooms”, “Compressor is-billed-to user” etc. Relationships allow digital twins solutions to construct graphs of interrelated twins. 
* **Components** — A component lets you build your model as an assembly of other interfaces. Use a component to describe something that is an integral part of your model, and that does not need to be created, deleted, or rearranged in your topology of twins independently. In contrast, use independent twins connected by a relationship when you want both parts to have an independent existence in the graph.

## Digital Twin Definition Language (DTDL) for modeling

Digital twin models for Azure Digital Twins are defined using the **Digital Twin Definition Language (DTDL)**. DTDL is written in JSON-LD and is programming language independent.

DTDL is also used as part of [Azure IoT Plug and Play](../iot-pnp/overview-iot-plug-and-play.md). Developers of Plug and Play (PnP) devices use a subset of the same description language used for twins. The DTDL version used for PnP is semantically a subset of DTDL for Azure Digital Twins: Every CapabilityModel as defined by PnP is also a valid interface for use in Azure Digital Twins. 

For more information about pure DTDL, see its [reference documentation](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL).

## Writing a model

DTDL models can be created in any text editor. They can be stored with the extension *.json*. As DTDL uses JSON syntax, using the *.json* extension will enable most programming text editors to automatically provide basic syntax checking and highlighting for DTDL. 
A richer DTDL editing experience will be available in Visual Studio Code and Visual Studio.

### Example

A simple example model: 

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

As the example shows, all content of an interface is described in the `contents` section of the DTDL file as an array of attribute definitions. Each attribute has a type (telemetry, property, relationship, etc.) and a set of properties that define the actual attribute (for example, name and schema to define a property).

### DTDL data types

Property and telemetry values can be of standard primitive types — `integer`, `double`, `string`, and `Boolean` — and others such as `DateTime` and `Duration`. 

In addition to primitive types, property and telemetry fields can have the following four complex types:
* `Object`
* `Array`
* `Map`
* `Enum`

### Inheritance

Sometimes it is desirable to specialize a given model. For example, a generic model *Room* might have specialized variants *ConferenceRoom* and *Gym*. To express specialization, DTDL supports inheritance: interfaces can inherit from one or more other interfaces. 

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

In this example, both *Planet* and *Moon* inherit from *CelestialBody*, which contributes a name, a mass and a location to both *Planet* and *Moon*. Inheritance is expressed in the DTDL files with the `extends` section, which points to an array of interface specifications.
If inheritance is applied, the subtype exposes all properties from the entire inheritance chain.

The extending interface cannot change any of the definitions of the parent interfaces, it can only add to them. An interface inheriting from one or more interfaces cannot define a capability already defined in one of those parent interfaces (even if the capabilities are defined to be the same). For example, if a parent interface defines a `double` property *foo*, the extending interface cannot contain a declaration of *foo*, even if it is also declared as a `double`.

### Preview constraints

DTDL constraints while in preview:
* While the DTDL language specification allows for inline definitions of interfaces, this is not supported in the current version of the Azure Digital Twins service.
* Azure Digital Twins does not support complex type definitions in separate documents, or as inline definitions. Complex types must be defined in a `schemas` section within an interface document. The definitions are only valid within the interface they are part of.
* Azure Digital Twins currently only allows a single level of component nesting. That is, interfaces used as components must not themselves use components. 
* Azure Digital Twins does not currently support the execution of commands on twins you model and instantiate. You can, however, execute commands on devices.
* Azure Digital Twins does not support stand-alone relationships (that is, relationships defined as independent types). All relationships must be defined inline in a model type.

## Next steps

Learn about instantiating models to create twins:
* [Represent objects with a twin](concepts-twins-graph.md)

Or, see how a model is managed with Model Management APIs:
* [Manage an object model](how-to-manage-model.md)