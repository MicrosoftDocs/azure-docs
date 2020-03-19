---
# Mandatory fields.
title: Create a twin type
titleSuffix: Azure Digital Twins
description: Understand how Azure Digital Twins uses user-defined twin types to describe entities in your environment.
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

# Understand twin types in Azure Digital Twins

A key characteristic of Azure Digital Twins is the ability to define your own vocabulary and build your twin graph in the self-defined terms of your business. This capability is provided through user-defined **twin types**.

A twin type is similar to a **class** in an object oriented programming language, defining a  data shape for one particular concept in your real work environment. Twin types have a name (such as *Room* or *TemperatureSensor*), and contain elements such as properties, telemetry/events, and commands that describe what this sort of entity in your environment can do. Twin types are written using the JSON-based **Digital Twin Definition Language (DTDL)**.  

## Digital Twin Definition Language (DTDL) for writing twin types

Twin types for Azure Digital Twins are defined using the **Digital Twin Definition Language (DTDL)**. DTDL is based on JSON-LD and is programming language independent.

DTDL is also used as part of [Azure IoT Plug and Play](../iot-pnp/overview-iot-plug-and-play.md). Developers of Plug and Play (PnP) devices use a subset of the same description language used for Azure Digital Twins. The DTDL version used for PnP is semantically a subset of DTDL for Azure Digital Twins: every *capability model* as defined by PnP is also a valid twin type for use in Azure Digital Twins. 

For more information about DTDL, see its [reference documentation](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL).

## Elements of a twin type

The technical term for a twin type's DTDL implementation is its **interface**. A twin type DTDL interface may have zero, one, or many of each of the following fields:
* **Property** - Properties are data fields that represent the state of an entity (like the properties in many object-oriented programming languages). Unlike telemetry, which is a time-bound data event, properties have backing storage and can be read at any time.
* **Telemetry** - Telemetry fields represent measurements or events, and are often used to describe device sensor readings. Telemetry is not stored on an Azure digital twin; it is effectively represented as a stream of data events to be sent somewhere.
* **Command** - Commands represent methods that can be executed on an Azure digital twin. An example would be a reset command, or a command to switch a fan on or off. Command descriptions include command parameters and return values.
* **Relationship** - Relationships let you represent how an Azure digital twin can be involved with other Azure digital twins. Relationships can represent different semantic meanings, such as *contains* ("floor contains room"), *cools* ("hvac cools room"), *is-billed-to* ("compressor is-billed-to user"), etc. Relationships allow the solution to provide a graph of interrelated entities. 
* **Component** - Components allow you to build your twin type interface as an assembly of other interfaces, if desired. An example of a component may be a *frontCamera* interface (and another component interface *backCamera*) that are used in defining a twin type for a *phone*. You must first define an interface for *frontCamera* as though it were its own twin type.

>[!TIP] 
> Use a **component** to describe something that is an integral part of your solution, but that does not need to have a separate identity, or the need to be created, deleted, or rearranged independently. If you want entities to have an independent existence in the twin graph, represent them as separate twins connected by a **relationship**.

## Create a twin type

Twin types can be written in any text editor. The DTDL language follows JSON syntax, so you should store twin types with the extension *.json*. Using the JSON extension will enable many programming text editors to provide basic syntax checking and highlighting for your DTDL documents.

### Example twin type code

Here is an example of a typical twin type, written as a DTDL interface: 

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
            "type": "Component",
            "name": "deepestCrater",
            "schema": "urn:contosocom:example:Crater:1"
        }
    ]
}
```

The fields of the DTDL document are defined as follows:

| Field | Description |
| --- | --- |
| `@id` | An identifier for the twin type. Must be in the format `urn:<domain>:<unique twin type identifier>:<twin type version number>`. |
| `@type` | Identifies the kind of information being described. For an interface, the type is *Interface*. |
| `@context` | Sets the [context](https://niem.github.io/json/reference/json-ld/context/) for the JSON document. Twin types should use `http://azure.com/v3/contexts/Model.json`. |
| `displayName` | [optional] Allows you to give the twin type a friendly name if desired. |
| `contents` | All remaining interface data is placed here, as an array of attribute definitions. Each attribute must provide a `@type` (*Property*, *Telemetry*, *Command*, *Relationship*, or *Component*) to identify the sort of interface information it describes, and then a set of properties that define the actual attribute (for example, `name` and `schema` to define a *Property*). |

### Schema options

As per DTDL, the schema for *Property* and *Telemetry* attributes can be of standard primitive types — `integer`, `double`, `string`, and `Boolean` — and others such as `DateTime` and `Duration`. 

In addition to primitive types, *Property* and *Telemetry* fields can have the following four complex types:
* `Object`
* `Array`
* `Map`
* `Enum`

### Inheritance

Sometimes, you may want to specialize a twin type further. For example, it might be useful to have a generic twin type *Room*, and specialized variants *ConferenceRoom* and *Gym*. To express specialization, DTDL supports inheritance: interfaces can inherit from one or more other interfaces. 

The following example reimagines the *Planet* twin type from the earlier DTDL example as a subtype of a larger *CelestialBody* twin type. The "parent" twin type is defined first, and then the "child" twin type builds on it by using the field `extends`.

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
        }
        ,
        {
            "type": "Component",
            "name": "deepestCrater",
            "schema": "urn:contosocom:example:Crater:1"
        }
    ]
}
```

In this example, *CelestialBody* contributes a name, a mass, and a telemetry to *Planet*. The `extends` section is structured as an array of interface names (which allows the extending interface to inherit from multiple parent twin types if desired).

Once inheritance is applied, the extending interface exposes all properties from the entire inheritance chain.

The extending interface cannot change any of the definitions of the parent interfaces; it can only add to them. It also cannot re-define a capability already defined in any of its parent interfaces (even if the capabilities are defined to be the same). For example, if a parent interface defines a `double` property *mass*, the extending interface cannot contain a declaration of *mass*, even if it is also declared as a `double`.

### Preview constraints

DTDL and Azure Digital Twins twin types have several constraints while in preview:
* While the DTDL language specification allows for inline definitions of interfaces, this is not supported in the current version of the Azure Digital Twins service.
* Azure Digital Twins does not support complex type definitions in separate documents, or as inline definitions. Complex types must be defined in a `schemas` section within an interface document. The definitions are only valid inside the interface that contains them.
* Azure Digital Twins currently only allows a single level of component nesting ⁠— so an interface that is used as a component cannot have any further components itself.  
* Azure Digital Twins does not currently support the execution of commands on Azure digital twins.
* Azure Digital Twins does not support standalone relationships (that is, relationships defined as independent graph elements). All relationships must be defined inline as part of a twin type.

## Next steps

Learn about creating digital twins based on twin types:
* [Create digital twins and the twin graph](concepts-twins-graph.md)

Or, see how a twin type is managed with the Model Management APIs:
* [[Manage a twin type](how-to-manage-twin-type.md)