---
# Mandatory fields.
title: Create a twin model
titleSuffix: Azure Digital Twins
description: Understand how Azure Digital Twins uses user-defined models to describe entities in your environment.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/12/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Understand twin models in Azure Digital Twins

A key characteristic of Azure Digital Twins is the ability to define your own vocabulary and build your twin graph in the self-defined terms of your business. This capability is provided through user-defined **models**.

A model is similar to a **class** in an object-oriented programming language, defining a data shape for one particular concept in your real work environment. Models have names (such as *Room* or *TemperatureSensor*), and contain elements such as properties, telemetry/events, and commands that describe what this type of entity in your environment can do. Models are written using the JSON-based **Digital Twin Definition Language (DTDL)**.  

You can think of the models as nouns in a description of your world.

## Digital Twin Definition Language (DTDL) for writing models

Models for Azure Digital Twins are defined using the [Digital Twins Definition language (DTDL)](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL). DTDL is based on JSON-LD and is programming-language independent.

DTDL is also used as part of [Azure IoT Plug and Play (PnP)](../iot-pnp/overview-iot-plug-and-play.md). Developers of PnP devices use a subset of the same description language used for Azure Digital Twins. The DTDL version used for PnP is, semantically, a subset of DTDL for Azure Digital Twins: every *capability model* as defined by PnP is also a valid model for use in Azure Digital Twins. 

For more information about DTDL, see its [reference documentation](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL).

## Elements of a model

The technical term for a model's DTDL implementation is its **interface**. A model DTDL interface may have zero, one, or many of each of the following fields:
* **Property** - Properties are data fields that represent the state of an entity (like the properties in many object-oriented programming languages). Unlike telemetry, which is a time-bound data event, properties have backing storage and can be read at any time.
* **Telemetry** - Telemetry fields represent measurements or events, and are often used to describe device sensor readings. Telemetry is not stored on a digital twin; it is more like a stream of data events ready to be sent somewhere.
* **Command** - Commands represent methods that can be executed on a digital twin. An example would be a reset command, or a command to switch a fan on or off. Command descriptions include command parameters and return values.
* **Relationship** - Relationships let you represent how a digital twin can be involved with other digital twins. Relationships can represent different semantic meanings, such as *contains* ("floor contains room"), *cools* ("hvac cools room"), *isBilledTo* ("compressor is billed to user"), etc. Relationships allow the solution to provide a graph of interrelated entities. 
* **Component** - Components allow you to build your model interface as an assembly of other interfaces, if you want. An example of a component is a *frontCamera* interface (and another component interface *backCamera*) that are used in defining a model for a *phone*. You must first define an interface for *frontCamera* as though it were its own model, and then you can reference it when defining *Phone*.

>[!TIP] 
> Use a **component** to describe something that is an integral part of your solution but doesn't need a separate identity, and doesn't need to be created, deleted, or rearranged in the twin graph independently. If you want entities to have independent existences in the twin graph, represent them as separate digital twins of different models, connected by **relationships**.

### Preview constraints

DTDL and models have several constraints while in preview:
* While the DTDL language specification allows for inline definitions of interfaces, this is not supported in the current version of the Azure Digital Twins service.
* Azure Digital Twins does not support complex type definitions in separate documents, or as inline definitions. Complex types must be defined in a `schemas` section within an interface document. The definitions are only valid inside the interface that contains them.
* Azure Digital Twins currently only allows a single level of component nesting—so an interface that is used as a component cannot have any further components itself.  
* Azure Digital Twins does not currently support the execution of commands on digital twins.
* Azure Digital Twins does not support standalone relationships (that is, relationships defined as independent graph elements). All relationships must be defined inline as part of a model.

## Create a model

Twin type models can be written in any text editor. The DTDL language follows JSON syntax, so you should store models with the extension *.json*. Using the JSON extension will enable many programming text editors to provide basic syntax checking and highlighting for your DTDL documents.

### Example model code

Here is an example of a typical model, written as a DTDL interface: 

```json
{
    "@id": "urn:contosocom:example:Planet:1",
    "@type": "Interface",
    "@context": "http://azure.com/v3/contexts/Model.json",
    "displayName": "Planet",
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
            "@type": "Telemetry",
            "name": "Temperature",
            "schema": "double"
        },
        {
            "@type": "Relationship",
            "name": "satellites",
            "target": "urn:contosocom:example:Moon:1"
        },
        {
            "@type": "Component",
            "name": "deepestCrater",
            "schema": "urn:contosocom:example:Crater:1"
        }
    ]
}
```

The fields of the DTDL document are:

| Field | Description |
| --- | --- |
| `@id` | An identifier for the model. Must be in the format `urn:<domain>:<unique model identifier>:<model version number>`. |
| `@type` | Identifies the kind of information being described. For an interface, the type is *Interface*. |
| `@context` | Sets the [context](https://niem.github.io/json/reference/json-ld/context/) for the JSON document. Models should use `http://azure.com/v3/contexts/Model.json`. |
| `displayName` | [optional] Allows you to give the model a friendly name if desired. |
| `contents` | All remaining interface data is placed here, as an array of attribute definitions. Each attribute must provide a `@type` (*Property*, *Telemetry*, *Command*, *Relationship*, or *Component*) to identify the sort of interface information it describes, and then a set of properties that define the actual attribute (for example, `name` and `schema` to define a *Property*). |

### Schema options

As per DTDL, the schema for *Property* and *Telemetry* attributes can be of standard primitive types—`integer`, `double`, `string`, and `Boolean`—and other types such as `DateTime` and `Duration`. 

In addition to primitive types, *Property* and *Telemetry* fields can have the following four complex types:
* `Object`
* `Array`
* `Map`
* `Enum`

### Inheritance

Sometimes, you may want to specialize a model further. For example, it might be useful to have a generic model *Room*, and specialized variants *ConferenceRoom* and *Gym*. To express specialization, DTDL supports inheritance: interfaces can inherit from one or more other interfaces. 

The following example re-imagines the *Planet* model from the earlier DTDL example as a subtype of a larger *CelestialBody* model. The "parent" model is defined first, and then the "child" model builds on it by using the field `extends`.

```json
{
    "@id": "urn:contosocom:example:CelestialBody:1",
    "@type": "Interface",
    "@context": "http://azure.com/v3/contexts/Model.json",
    "displayName": "Celestial body",
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
            "@type": "Telemetry",
            "name": "Temperature",
            "schema": "double"
        }
    ]
},
{
    "@id": "urn:contosocom:example:Planet:1",
    "@type": "Interface",
    "@context": "http://azure.com/v3/contexts/Model.json",
    "displayName": "Planet",
    "extends": [
        "urn:contosocom:example:CelestialBody:1"
    ],
    "contents": [
        {
            "@type": "Relationship",
            "name": "satellites",
            "target": "urn:contosocom:example:Moon:1"
        },
        {
            "@type": "Component",
            "name": "deepestCrater",
            "schema": "urn:contosocom:example:Crater:1"
        }
    ]
}
```

In this example, *CelestialBody* contributes a name, a mass, and a telemetry to *Planet*. The `extends` section is structured as an array of interface names (which allows the extending interface to inherit from multiple parent models if desired).

Once inheritance is applied, the extending interface exposes all properties from the entire inheritance chain.

The extending interface cannot change any of the definitions of the parent interfaces; it can only add to them. It also cannot redefine a capability already defined in any of its parent interfaces (even if the capabilities are defined to be the same). For example, if a parent interface defines a `double` property *mass*, the extending interface cannot contain a declaration of *mass*, even if it's also a `double`.

## Next steps

Learn about creating digital twins based on models:
* [Create digital twins and the twin graph](concepts-twins-graph.md)

Or, see how a model is managed with the DigitalTwinsModels APIs:
* [Manage a twin model](how-to-manage-model.md)
