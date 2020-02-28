---
# Mandatory fields.
title: Model an object
titleSuffix: Azure Digital Twins
description: Understand how Azure Digital Twins uses user-defined models to describe objects within the graph.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/28/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Understand object modeling in Azure Digital Twins

A key characteristic of Azure Digital Twins is the ability to define your own vocabulary, allowing you to build your digital twin graph in the self-defined terms of your business. This capability is provided through object **models**.

A model is a template, defining some type of twin that can exist in your Azure Digital Twins graph. Models have names (such as *Room* or *TemperatureSensor*), and contain elements such as properties, telemetry/events, and commands that describe what this type of graph element can represent and do. Models are written using the JSON-based **Digital Twin Definition Language (DTDL)**.  

### Digital Twin Definition Language (DTDL) for modeling

Digital twin models for Azure Digital Twins are defined using the **Digital Twin Definition Language (DTDL)**. DTDL is written in JSON-LD and is programming language independent.

DTDL is also used as part of [Azure IoT Plug and Play](../iot-pnp/overview-iot-plug-and-play.md). Developers of Plug and Play (PnP) devices use a subset of the same description language used for twins. The DTDL version used for PnP is semantically a subset of DTDL for Azure Digital Twins: Every CapabilityModel as defined by PnP is also a valid interface for use in Azure Digital Twins. 

For more information about pure DTDL, see its [reference documentation](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL).

## Key model information

The sections of information provided in a model's description make up its **interface**. A model interface consists of the following fields:
* **Properties** — Properties are data fields that represent the state of an entity (like in many object-oriented programming languages). Unlike telemetry, which is a time-bound data event, properties have backing storage and can be read at any time.
* **Telemetry** — Telemetry fields represent measurements or events, and are often used to describe device sensor readings. Telemetry is not stored on a twin; it is effectively sent as a stream of data events.
* **Commands** — Commands represent methods that can be executed on a digital twin. An example would be a reset command, or a command to switch a fan on or off. Command descriptions include command parameters and return values.
* **Relationships** — Relationships let you model how this twin can be involved with other twins. Relationships can represent different semantic meanings, such as *contains* ("floor contains room"), *cools* ("hvac cools room"), *is-billed-to* ("compressor is-billed-to user"), etc. Relationships allow digital twins solutions to provide graphs of interrelated entities. 
* **Components** — Components allow you to build your model as an assembly of other interfaces, if desired. An example of a component may be a *frontCamera* (and another component *backCamera*) for a model representing a phone device. A separate interface for *frontCamera* must be defined, as though it were another model, but once it's included as a component on the *phone* model, it cannot be instantiated by an independent twin in the graph.

>[!TIP] 
> Use a **component** to describe something that is an integral part of your model, but that does not need to be created, deleted, or rearranged in your topology of twins independently. If you want both entities to have an independent existence in the graph, represent them as independent twin models connected by a **relationship**.

## Writing a model

DTDL models can be created in any text editor. They follow JSON syntax, and thus should be stored with the extension *.json*. Using the this extension will enable many programming text editors to provide basic syntax checking and highlighting for your DTDL documents.

### Example model code

Here is an example of a basic model, written in DTDL: 

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
            "@type": "Property",
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
The interface must provide a top-level `@id` and `@type` of *interface*, which describe the model name and the fact that it is an interface, respectively.

All content of an interface is then placed within the `contents` section of the DTDL file, as an array of attribute definitions. Each attribute must provide a `@type` (*property*, *telemetry*, *command*, *relationship*, or *component*) to identify the sort of interface information it defines, and then a set of properties that define the actual attribute (for example, `name` and `schema` to define a *property*).

### Schema options

As per DTDL, the schema for *property* and *telemetry* attributes can be of standard primitive types — `integer`, `double`, `string`, and `Boolean` — and others such as `DateTime` and `Duration`. 

In addition to primitive types, *property* and *telemetry* fields can have the following four complex types:
* `Object`
* `Array`
* `Map`
* `Enum`

### Inheritance

Sometimes, you may want to specialize a model further. For example, it might be useful to have a generic model *Room*, and specialized variants *ConferenceRoom* and *Gym*. To express specialization, DTDL supports inheritance: interfaces can inherit from one or more other interfaces. 

Here is an example of a model (*CelestialBody*) that has a subtype (*Planet*). The "parent" model is defined first, and the "child" model then builds on its definition using the keyword `extends`.

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
            "@type": "Property",
            "name": "mass",
            "schema": "double"
        }
    ] ,
    "@context": "http://azure.com/v3/contexts/Model.json"
},
{
    "@id": "dtmi:com:example:Planet",
    "@type": "Interface",
    "extends": [
        "dtmi:com:example:CelestialBody"
    ],
    "contents": [
        {
            "@type": "Relationship",
            "name": "satellites",
            "target": " dtmi:com:example:Moon"
        }
    ] ,
    "@context": "http://azure.com/v3/contexts/Model.json"
}
```

In this example, *CelestialBody* contributes a name, a mass and a location to *Planet*. The `extends` section contains an array of interface names, allowing the extending interface to inherit from multiple parent models if desired.

Once inheritance is applied, the extending interface exposes all properties from the entire inheritance chain.

The extending interface cannot change any of the definitions of the parent interfaces; it can only add to them. It also cannot define a capability already defined in any of its parent interfaces (even if the capabilities are defined to be the same). For example, if a parent interface defines a `double` property *foo*, the extending interface cannot contain a declaration of *foo*, even if it is also declared as a `double`.

### Preview constraints

DTDL constraints while in preview:
* While the DTDL language specification allows for inline definitions of interfaces, this is not supported in the current version of the Azure Digital Twins service.
* Azure Digital Twins does not support complex type definitions in separate documents, or as inline definitions. Complex types must be defined in a `schemas` section within an interface document. The definitions are only valid inside the interface that contains them.
* Azure Digital Twins currently only allows a single level of component nesting⁠—so an interface that is used as a component cannot have any further components itself.  
* Azure Digital Twins does not currently support the execution of commands on twins you model and instantiate. You can, however, execute commands on devices.
* Azure Digital Twins does not support stand-alone relationships (that is, relationships defined as independent types). All relationships must be defined inline as part of a model.

## Next steps

Learn about instantiating models to create twins:
* [Represent objects with a twin](concepts-twins-graph.md)

Or, see how a model is managed with Model Management APIs:
* [Manage an object model](how-to-manage-model.md)