---
# Mandatory fields.
title: Digital Twins Definition Language (DTDL)
titleSuffix: Azure Digital Twins
description: Understand more details about the Digital Twins Definition Language (DTDL).
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/21/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Digital Twins Definition Language (DTDL)

**Digital Twins Definition Language (DTDL)** is the JSON-like language used to write [models](concepts-models.md) in Azure Digital Twins. The version of DTDL used during public preview is *version 2*.

This article describes DTDL in detail, including version information, syntax details, and examples of more-complex functionality. It is organized into the following sections:
* **Introduction to DTDL**
* **Elements of the language**
  - Metamodels
  - Schemas
  - Semantic types
* **DTDL models: Key fields**
  - Digital Twin Model Identifier (DTMI)
  - Model versioning
  - Context
* **Other language characteristics**
  - Conformance with JSON-LD and RDF
  - Display string localization
  - Differences from previous release

You can also learn more about DTDL from its [reference documentation](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL).

## Introduction to DTDL

DTDL is based on a variant of JSON called [JSON-LD](https://json-ld.org/spec/latest/json-ld), and works with any programming language that you're using for your solution.

DTDL is also used as part of [Azure IoT Plug and Play (PnP)](../iot-pnp/overview-iot-plug-and-play.md). The version of DTDL that PnP uses is a subset of DTDL for Azure Digital Twins: every [PnP *device capability model*](../iot-pnp/quickstart-create-pnp-device-windows.md) is also a valid model in Azure Digital Twins.

There are three key **elements of the language** that make DTDL distinct: its *metamodels*, custom *schemas*, and *semantic types*.

These elements come together to make up the language, which you can then use to write models. DTDL requires model definitions to have three **DTDL model key fields**: an *identifier*, a *version*, and a *context*.

Then, as you continue building out your model definitions, you may want to consider a few **other language characteristics**: *conformance* to popular standards, *display string localization*, and (if you've worked with DTDL in the past) *differences from previous release*.

## Elements of the language

There are three key elements of the DTDL language that define how it runs and what it can do: its *metamodels*, custom *schemas*, and *semantic types*.

The basic structure of the language is a set of **metamodel classes** which define the behavior of all digital twins (including devices). The classes are:
* Interface
* Telemetry
* Property
* Command
* Relationship
* Component

These metamodels describe the type of data that your model will deal with. Because data is a key element in IoT solutions, DTDL provides its own data description language that is compatible with many popular serialization formats (including JSON and binary serialization formats). These custom data descriptions make up the **schemas** that can be used in your DTDL documents.

DTDL also provides **semantic type annotations** for its data, which lets data be understood with more context than a simple data type like *string* or *double* can provide. For example, a property representing a temperature can be semantically annotated as a *temperature*, which allows it to be charted, compared to other temperatures, converted between temperature units, etc... as *temperature*-type data, instead of just *double* data. This semantic information can be interpreted by analytics, machine learning, UIs, and other computation resources to allow them to better reason about the data beyond just its schema. 

### Metamodels

When a twin model is created using DTDL, its behaviors are defined using six metamodel classes: Interface, Telemetry, Property, Command, Relationship, and Component. The model's behaviors are often then implemented in terms of these metamodel classes within an SDK. This section describes each of these classes in detail.

#### Metamodel class: Interface

An **Interface** is the overall class representing a full model. It holds the contents of any digital twin in terms of the other metamodel classes (Properties, Telemetries, Commands, Relationships, and Components). Interfaces are reusable, and can be used again as the schema for a Component in another Interface.

The chart below lists the DTDL properties that may be part of an Interface.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `@id` | Required | DTMI | Max 128 chars | Version number can be incremented | A Digital Twin Model Identifier (DTMI) for the Interface |
| `@type` | Required | IRI |  | Immutable | This must be *Interface* |
| `@context` | Required (at least once in the doc) | IRI |  | Immutable | The context to use when processing this Interface. For this version, it must be "dtmi:dtdl:context;2" |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `contents` | Optional | Set of Telemetry, Properties, Commands, Relationships, Components | Max 300 contents | New contents can be added; versions of existing contents can be incremented; no contents can be removed | A set of objects that define the contents of this Interface in terms of Telemetry, Properties, Commands, Relationships, and Components |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |
| `extends` | Optional | Set of DTMIs | Up to 2 Interfaces per extends; max depth of 10 levels | New Interfaces can be added; versions of existing Interfaces can be incremented; no Interfaces can be removed | A set of IDs (DTMIs) that name other, parent Interfaces that this Interface inherits from. Interfaces can inherit from multiple parent Interfaces. |
| `schemas` | Optional | Set of schemas |  | New schemas can be added; versions of existing schemas can be incremented; no schemas can be removed | A set of IRIs or objects that refer to the reusable schemas within this Interface |

Here are some examples of Interfaces, illustrating what they might look like with different combinations of content types.

The following Interface example shows an Interface for a thermostat device. The Interface has one Telemetry that reports the temperature measurement, and one read/write Property that controls the desired temperature.

```json
{
    "@id": "dtmi:com:example:Thermostat;1",
    "@type": "Interface",
    "displayName": "Thermostat",
    "contents": [
        {
            "@type": "Telemetry",
            "name": "temp",
            "schema": "double"
        },
        {
            "@type": "Property",
            "name": "setPointTemp",
            "writable": true,
            "schema": "double"
        }
    ],
    "@context": "dtmi:dtdl:context;2"
}
```

The next Interface example represents a phone device with three components: two cameras, and the standard *DeviceInformation* Interface that is used to hold general device information.

```json
{
    "@id": "dtmi:com:example:Phone;2",
    "@type": "Interface",
    "displayName": "Phone",
    "contents": [
        {
            "@type": "Component",
            "name": "frontCamera",
            "schema": "dtmi:com:example:Camera;3"
        },
        {
            "@type": "Component",
            "name": "backCamera",
            "schema": "dtmi:com:example:Camera;3"
        },
        {
            "@type": "Component",
            "name": "deviceInfo",
            "schema": "dtmi:azure:deviceManagement:DeviceInformation;2"
        }
    ],
    "@context": "dtmi:dtdl:context;2"
}
```

The next Interface example represents a building with a *name* Property, and the ability to form Relationships to rooms contained in the building.

```json
{
    "@id": "dtmi:com:example:Building;1",
    "@type": "Interface",
    "displayName": "Building",
    "contents": [
        {
            "@type": "Property",
            "name": "name",
            "schema": "string",
            "writable": true
        },
        {
            "@type": "Relationship",
            "name": "contains",
            "target": "dtmi:com:example:Room;1"
        }
    ],
    "@context": "dtmi:dtdl:context;2"
}
```

The next Interface example shows how interface inheritance can be used to create specialized Interfaces from more general Interfaces. In this example, the *ConferenceRoom* Interface inherits from the *Room* Interface. Through inheritance, the *ConferenceRoom* has two properties: the *occupied* property (from *Room*) and the *capacity* property (from *ConferenceRoom*).

```json
[
    {
        "@id": "dtmi:com:example:Room;1",
        "@type": "Interface",
        "contents": [
            {
                "@type": "Property",
                "name": "occupied",
                "schema": "boolean"
            }
        ],
        "@context": "dtmi:dtdl:context;2"
    },
    {
        "@id": "dtmi:com:example:ConferenceRoom;1",
        "@type": "Interface",
        "extends": "dtmi:com:example:Room;1",
        "contents": [
            {
                "@type": "Property",
                "name": "capacity",
                "schema": "integer"
            }
        ],
        "@context": "dtmi:dtdl:context;2"
    }
]
```

The following sections describe the other metamodel classes that make up Interfaces in more detail.

#### Metamodel class: Telemetry

Telemetry describes the data emitted by a digital twin. This data can consist of a regular stream of sensor readings, a computed stream of data (like an "occupancy" value), occasional error messages, or any other messages from the device.

The chart below lists the DTDL properties that Telemetry may have.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `@type` | Required | IRI |  | Immutable | This must be at least "Telemetry". It can also include a semantic type. |
| `name` | Required | *string* | 1-64 chars. The name must match this regular expression: `^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$`. The name must be unique for all contents in this Interface. | Immutable | The "programming" name of the telemetry |
| `schema` | Required | Schema (described later in this article) | Immutable | The data type of the Telemetry |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the telemetry. If this field is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |
| `unit` | Optional | Unit |  | Mutable | The unit type of the Telemetry. A semantic type is required for `unit` to be available. |

The following example shows a basic Telemetry definition of a temperature measurement, with the data type *double*.

```json
{
    "@type": "Telemetry",
    "name": "temp",
    "schema": "double"
}
```

The following example shows a Telemetry definition with a *Temperature* semantic type, enabling it to have a `unit` property.

```json
{
    "@type": ["Telemetry", "Temperature"],
    "name": "temp",
    "schema": "double",
    "unit": "degreeCelsius"
}
```

#### Metamodel class: Property

A Property describes the state of a digital twin, and can be read/write (editable) or read-only. For example, a device serial number may be a read-only property, while the name of a room and the desired temperature on a thermostat may be read-write properties. 

Another consideration for Properties is synchronization. Consider that digital twins are part of a distributed IoT system: the state of a digital twin might be controlled by a cloud application that's always running, but the digital twin represents an actual device in the real world, which may only go online once or twice a day. As a result, state information can only be synced and responded to when the device is online.

For this reason, a Property describes not only the state of a digital twin, but also the synchronization of that state between different components in the distributed system (such as the cloud application in the example above). Every digital twin property has synchronization information automatically included, to facilitate and capture the synchronization state between the digital twin and its backing store. Since this synchronization information is automatic and the same for all properties, it is not included as a part of the model definition.

The chart below lists the DTDL properties that a Property may have.

> [!NOTE]
> Notice the distinction between the *Property metamodel class*, used to describe the state of a digital twin, and *DTDL properties* that all metamodel classes provide.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `@type` | Required | IRI |  | Immutable | This must at least be "Property". It can also include a semantic type. |
| `name` | Required | *string* | 1-64 chars. The name must match this regular expression: `^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$`. The name must be unique for all contents in this Interface. | Immutable | The "programming" name of the Property |
| `schema` | Required | Schema (described later in this article) | May not be Array nor any complex schema that contains Array | Immutable | The data type of the Property |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the Property. If this field is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |
| `unit` | Optional | Unit |  | Mutable | The unit type of the property. A semantic type is required for `unit` to be available. |
| `writable` | Optional | *boolean* |  | Immutable | A boolean value that indicates whether the Property is writable by an external source (like a client application) or not. The default value is *false*, indicating the Property is read-only. |

The following example shows a property definition of a writable temperature set-point, with the data type *double*.

```json
{
    "@type": "Property",
    "name": "setPointTemp",
    "schema": "double",
    "writable": true
}
```

The following example shows a Property definition with a *Temperature* semantic type, enabling it to have a `unit` property. 

```json
{
    "@type": ["Property", "Temperature"],
    "name": "setPointTemp",
    "schema": "double",
    "unit": "degreeCelsius",
    "writable": true
}
```

#### Metamodel class: Command

A Command describes a function or operation that can be performed on a digital twin.

The chart below lists the DTDL properties that a Command may have.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `@type` | Required | IRI |  | Immutable | This must be *Command* |
| `name` | Required | *string* | 1-64 chars. The name must match this regular expression: `^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$`. The name must be unique for all contents in this Interface. | Immutable | The "programming" name of the Command. |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the Command. If this field is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |
| `commandType` | Optional | *CommandType* (described later in this section) |  | Immutable | The type of command execution, which during public preview can be *synchronous* or *asynchronous*. The default value is *synchronous*. |
| `request` | Optional | *CommandPayload* (described later in this section) |  | Immutable | A description of the input to the Command |
| `response` | Optional | *CommandPayload* (described later in this section) |  | Immutable | A description of the output of the Command |

The following example shows a *reboot* command that a device may have.

```json
{
    "@type": "Command",
    "name": "reboot",
    "commandType": "asynchronous",
    "request": {
        "name": "rebootTime",
        "displayName": "Reboot Time",
        "description": "Requested time to reboot the device.",
        "schema": "dateTime"
    },
    "response": {
        "name": "scheduledTime",
        "schema": "dateTime"
    }
}
```

##### commandType

*CommandType* allows you to classify Commands into categories.

| `commandType` value | Description |
| --- | --- | --- |
| `asynchronous` | The Command will complete sometime after control returns to the caller. After the Command completes, the result and any outputs are available. |
| `synchronous` | The Command will be complete when control returns to the caller. The result and any outputs are available immediately. This is the default value for `commandType`. |

##### CommandPayload

A *CommandPayload* describes the inputs to or the outputs from a Command.

The chart below lists the DTDL properties that *CommandPayload* may have.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `name` | Required | *string* | 1-64 chars. The name must match this regular expression: `^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$`. | Immutable | The "programming" name of the payload |
| `schema` | Required | Schema  (described later in this article) |  | Immutable | The data type of the payload |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the command payload. If this field is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |

#### Metamodel class: Relationship

A Relationship describes a link from the current type of digital twin to another type of digital twin. Relationships are permitted to have their own Properties.

For more details about the concept of twin relationships, see [Concepts: Digital twins and the twin graph](concepts-twins-graph.md).

The chart below lists the DTDL properties that a Relationship may have.

>[!NOTE]
> Don't confuse the required *DTDL properties* of the Relationship type with the custom properties that you can give to a relationship using the *Property metamodel class*.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `@type` | Required | IRI |  | Immutable | This must be *Relationship* |
| `name` | Required | *string* | 1-64 chars. The name must match this regular expression: `^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$`. The name must be unique for all contents in this Interface. | Immutable | The "programming" name of the Relationship |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the relationship. If this field is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |
| `maxMultiplicity` | Optional | Non-negative integer | Must be > 1 and >= `min-Multiplicity` | Immutable | The maximum multiplicity for the target of the Relationship. The default value is infinite (there may be an unlimited number of relationship instances for this Relationship type). |
| `minMultiplicity` | Optional | Non-negative integer | Must <= `max-Multiplicity`. During public preview, `minMultiplicity` is required to be 0. | Immutable | The minimum multiplicity for the target of the Relationship. The default value is 0 (meaning it's ok for that Relationship to have no instances). |
| `properties` | Optional | Set of Property | Max 300 properties | New Properties can be added; no Properties can be removed | A set of Properties that define relationship-specific state |
| `target` | Optional | DTMI |  | Version number can be incremented | An Interface ID (DTMI). The default value (used when target is not specified) is that the target may be any Interface. "*" is also an accepted value to indicate any Interface. |
| `writable` | Optional | *boolean* |  | Immutable | A boolean value that indicates whether the relationship is writable or not. The default value is *false*, indicating the Relationship is read-only. |

The following example defines a Relationship that can be had with a *Floor* twin. In this example, there must be one and only one Relationship instance to the floor.

```json
{
    "@type": "Relationship",
    "name": "floor",
    "minMultiplicity": 1,
    "maxMultiplicity": 1,
    "target": "dtmi:com:example:Floor;1"
}
```

The following example defines a general-purpose *children* Relationship. In this example, there may be 0 to many children (because `minMultiplicity` and `maxMultiplicity` are not specified), and they can be directed towards any Interface type (because `target` is not specified).

```json
{
    "@type": "Relationship",
    "name": "children"
}
```

The following example defines a Relationship that has a Property.

```json
{
    "@type": "Relationship",
    "name": "cleanedBy",
    "target": "dtmi:com:example:Cleaner;1",
    "properties": [
        {
            "@type": "Property",
            "name": "lastCleaned",
            "schema": "dateTime"
        }
    ]
}
```

#### Metamodel class: Component

A Component allows you to reference another Interface that is used in making up the current Interface.

Components are different from relationships because they describe contents that are directly part of the Interface. (A relationship describes a link between two Interfaces.)

A Component describes the inclusion of an Interface into another Interface "by value". As a result, cycles in Components are not allowed, because the value of the Component would be infinitely big.

The chart below lists the DTDL properties that a Component may have.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `@type` | Required | IRI |  | Immutable | This must be *Component* |
| `name` | Required | *string* | 1-64 chars. The name must match this regular expression: `^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$`. The name must be unique for all contents in this Interface. | Immutable | The "programming" name of the Component. |
| `schema` | Required | DTMI | cannot have a Component in a Component; cannot introduce a cycle of Components | Version number can be incremented | The data type of the component, given as the DTMI of another Interface |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the Component. If this field is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |

Here is an example of a Component being defined. This *frontCamera* component is an excerpt from a larger Interface definition of some device that has a front camera piece (such as a *Phone*).

```json
{
    "@type": "Component",
    "name": "frontCamera",
    "schema": "dtmi:com:example:Camera;1"
}
```

### Schemas

Schemas are used to describe the serialized format of the data in a digital twin Interface. They are the values that can be supplied in the Schema-type fields of a DTDL class (like the `schema` field of the metamodel classes from the previous section).

Primitive data types can be used for schemas, along with a variety of complex schemas in the forms of Arrays, Enums, Maps, and Objects.

Schemas described through Azure Digital Twin's schema definition language are compatible with popular serialization formats, including JSON, Avro, and Protobuf.

#### Primitive schemas

A full set of primitive data types is provided to use with your digital twin data. These can be supplied directly as the value in a `schema` statement.

| Digital twin primitive schema | Description |
| --- | --- |
| `bytes` | A sequence of bytes. Not supported during public preview. |
| `boolean` | A boolean value |
| `date` | A date in ISO 8601 format |
| `dateTime` | A date and time in ISO 8601 format |
| `double` | An IEEE 8-byte floating point |
| `duration` | A duration in ISO 8601 format |
| `float` | An IEEE 4-byte floating point |
| `integer` | A signed 4-byte integer |
| `long` | A signed 8-byte integer |
| `string` | A UTF8 string |
| `time` | A time in ISO 8601 format |

#### Complex schemas

Complex schemas are designed for supporting complex data types made up of primitive data types. 

Currently, DTDL provides the following complex schemas: Array, Enum, Map, and Object. A complex schema can be specified directly as the value in a Schema-type field, or described in the Interface schemas set (described later in this article) and then referenced in the Schema-type field that way.

Complex schema definitions are recursive. For instance, an Array's `elementSchema` Schema-type field  may be Enum, Map, Object, or another Array. Similarly, a Map's `mapValue` Schema-type field may be an Array, Enum, Object, or another Map. The same applies to Enum and Object types. Currently, the maximum depth for Arrays, Maps, and Objects is 5 levels of depth.

##### Array

An Array describes an indexable data type where each element is of the same schema. An Array element's schema can itself be a primitive or complex schema.

The chart below lists the DTDL properties that an Array may have.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `@type` | Required | IRI |  | Immutable | This must be *Array* |
| `elementSchema` | Required | Schema |  | Immutable | The data type of the Array elements |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the Array. If this field is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |

Here is an example of an Array being used in the `schema` field for a Telemetry.

```json
{
    "@type": "Telemetry",
    "name": "ledState",
    "schema": {
        "@type": "Array",
        "elementSchema": "boolean"
    }
}
```

##### Enum

An Enum describes a data type with a set of named labels that map to values. The values in an Enum can be either integers or strings, but the labels are always strings.

The chart below lists the DTDL properties that an Enum may have.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `@type` | Required | IRI |  | Immutable | This must be *Enum* |
| *EnumValues* | Required | *EnumValue* (described later in this section) |  | Immutable | A set of *EnumValue* and label mappings |
| `valueSchema` | Required | *integer* or *string* |  | Immutable | The data type for the Enum values. All Enum values must be of the same type. |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the Enum. If this field is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |

Here is an example of an Enum being used in the `schema` field for a Telemetry.

```json
{
    "@type": "Telemetry",
    "name": "state",
    "schema": {
        "@type": "Enum",
        "valueSchema": "integer",
        "enumValues": [
            {
                "name": "offline",
                "displayName": "Offline",
                "enumValue": 1
            },
            {
                "name": "online",
                "displayName": "Online",
                "enumValue": 2
            }
        ]
    }
}
```

###### EnumValue

An *EnumValue* describes an element of an Enum.

The chart below lists the DTDL properties that an *EnumValue* may have.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `name` | Required | *string* | 1-64 chars. The name must match this regular expression: `^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$`. The name must be unique for all *EnumValues* in this Enum. | Immutable | The "programming" name of the *EnumValue* |
| `enumValue` | Required | *int* or *string* | *EnumValue* must be unique for all *EnumValues* in this Enum. | Immutable | The on-the-wire value that maps to the *EnumValue* |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the enum value. If this field is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |

##### Map

A Map describes a data type of key-value pairs, in which the values share the same schema. 

The key in a Map must be a string. The values in a Map can be any schema.

The chart below lists the DTDL properties that a Map may have.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `@type` | Required | IRI |  | Immutable | This must be *Map* |
| `mapKey` | Required | *MapKey* (described later in this section) |  | Immutable | A description of the keys in the map |
| `mapValue` | Required | *MapValue* (described later in this section) |  | Immutable | A description of the values in the map |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the map. If this field is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |

Here is an example of a Map being used in the `schema` field for a Property.

```json
{
    "@type": "Property",
    "name": "modules",
    "writable": true,
    "schema": {
        "@type": "Map",
        "mapKey": {
            "name": "moduleName",
            "schema": "string"
        },
        "mapValue": {
            "name": "moduleState",
            "schema": "string"
        }
    }
}
```

###### MapKey

A *MapKey* describes the key in a Map. The schema of a *MapKey* must be *string*.

The chart below lists the DTDL properties that a *MapKey* may have.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `name` | Required | *string* | 1-64 chars. The name must match this regular expression: `^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$`. | Immutable | The "programming" name of the map's key |
| `schema` | Required | Schema | Must be *string* | Immutable | The data type of the map's key |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the *MapKey*. If this field is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |

###### MapValue

A *MapValue* describes the values in a Map.

The chart below lists the DTDL properties that a *MapValue* may have.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `name` | Required | *string* | 1-64 chars. The name must match this regular expression: `^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$`. | Immutable | The "programming" name of the map's value |
| `schema` | Required | Schema |  | Immutable | The data type of the map's values |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the *MapValue*. If this field is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |

##### Object

An Object describes a custom data type made up of named fields (like a struct in C). The properties in an Object can be primitive or complex schemas.

The chart below lists the DTDL properties that an Object may have.

>[!NOTE]
> Don't confuse the required *DTDL properties* of the Object type with the *custom Object fields* inside its `fields` property.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `@type` | Required | IRI |  | Immutable | This must be *Object* |
| `fields` | Required | Set of *Fields* (described later in this section) | Max depth 5 levels | Immutable | A set of Field descriptions, one for each Field in the Object |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the Object. If this is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |


Here is an example of an Object being used in the `schema` field for a Telemetry.

```json
{
    "@type": "Telemetry",
    "name": "accelerometer",
    "schema": {
        "@type": "Object",
        "fields": [
            {
                "name": "x",
                "schema": "double"
            },
            {
                "name": "y",
                "schema": "double"
            },
            {
                "name": "z",
                "schema": "double"
            }
        ]
    }
}
```

###### Field

A *Field* describes a custom, named field (property) of an Object.

The chart below lists the DTDL properties that a *Field* may have.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `name` | Required | *string* | 1-64 chars. The name must match this regular expression: `^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$`. The name must be unique for all fields in this object. | Immutable | The "programming" name of the *Field* |
| `schema` | Required | Schema |  | Immutable | The data type of the field |
| `@id` | Optional | DTMI | Max 2048 chars | Version number can be incremented | The ID of the *Field*. If this is not provided, the digital twin interface processor will assign one. |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |

#### Interface schemas

Within an Interface definition, complex schemas may be defined in one place for reusability across Telemetry, Properties, and Commands. Allowing schemas to be defined just once per Interface promotes readability and easier maintenance. 

To take advantage of this option, define one or several **Interface schemas** in the `schemas` property of an Interface. You can then continue to use this schema throughout the Interface.

The chart below lists the DTDL properties that Interface schemas may have.

| Property | Required | Data type | Limits | Version rules | Description |
| --- | --- | --- | --- | --- | --- |
| `@id` | Required | DTMI | Max 2048 chars | Version number can be incremented | The globally unique identifier for the schema |
| `@type` | Required | Array, Enum, Map, Object |  | Immutable | The type of complex schema. This must refer to one of the complex schema classes (Array, Enum, Map, or Object). |
| `comment` | Optional | *string* | 1-512 chars | Mutable | A developer comment |
| `description` | Optional | *string* | 1-512 chars | Mutable | A localizable description for human display |
| `displayName` | Optional | *string* | 1-64 chars | Mutable | A localizable name for human display |


Here is an example of an Interface schema being defined for an Interface.

```json
{
    "@id": "dtmi:com:example:ReusableTypeExample;1",
    "@type": "Interface",
    "contents": [
        {
            "@type": "Telemetry",
            "name": "accelerometer1",
            "schema": "dtmi:com:example:acceleration;1"
        },
        {
            "@type": "Telemetry",
            "name": "accelerometer2",
            "schema": "dtmi:com:example:acceleration;1"
        }
    ],
    "schemas": [
        {
            "@id": "dtmi:com:example:acceleration;1",
            "@type": "Object",
            "fields": [
                {
                    "name": "x",
                    "schema": "double"
                },
                {
                    "name": "y",
                    "schema": "double"
                },
                {
                    "name": "z",
                    "schema": "double"
                }
            ]
        }
    ],
    "@context": "dtmi:dtdl:context;2"
}
```

### Semantic Types

DTDL includes a set of standard semantic types that can be applied to Telemetries and Properties to give their values extra context. When a Telemetry or a Property is annotated with one of these semantic types, they get access to a `unit` property.

In order to give a Telemetry or Property a semantic type, its `schema` must be a numeric type (*double*, *float*, *integer*, or *long*).

The chart below lists standard semantic types, corresponding unit types, and available units for each unit type.

>[!NOTE]
> Note that there is not a strict one-to-one correspondence between semantic types and unit types. For example, `Humidity` is expressed using `DensityUnit`, and `Luminosity` is expressed using `PowerUnit`.

| Semantic type | Unit type | Unit |
| --- | --- | --- |
| `Acceleration` | `AccelerationUnit` | `metrePerSecondSquared` <br> `centimetrePerSecondSquared` <br> `gForce` |
| `Angle` | `AngleUnit` | `radian` <br> `degreeOfArc` <br> `minuteOfArc` <br> `secondOfArc` <br> `turn` |
| `AngularAcceleration` | `AngularAccelerationUnit` | `radianPerSecondSquared` |
| `AngularVelocity` | `AngularVelocityUnit` | `radianPerSecond` <br> `degreePerSecond` <br> `revolutionPerSecond` <br> `revolutionPerMinute` |
| `Area` | `AreaUnit` | `squareMetre` <br> `squareCentimetre` <br> `squareMillimetre` <br> `squareKilometre` <br> `hectare` <br> `squareFoot` <br> `squareInch` <br> `acre` |
| `Capacitance` | `CapacitanceUnit` | `farad` <br> `millifarad` <br> `microfarad` <br> `nanofarad` <br> `picofarad` |
| `Current` | `CurrentUnit` | `ampere` <br> `microampere` <br> `milliampere` |
| `DataRate` | `DataRateUnit` | `bitPerSecond` <br> `kibibitPerSecond` <br> `mebibitPerSecond` <br> `gibibitPerSecond` <br> `tebibitPerSecond` <br> `exbibitPerSecond` <br> `zebibitPerSecond` <br> `yobibitPerSecond` <br> `bytePerSecond` <br> `kibibytePerSecond` <br> `mebibytePerSecond` <br> `gibibytePerSecond` <br> `tebibytePerSecond` <br> `exbibytePerSecond` <br> `zebibytePerSecond` <br> `yobibytePerSecond` |
| `DataSize` | `DataSizeUnit` | `bit` <br> `kibibit` <br> `mebibit` <br> `gibibit` <br> `tebibit` <br> `exbibit` <br> `zebibit` <br> `yobibit` <br> `byte` <br> `kibibyte` <br> `mebibyte` <br> `gibibyte` <br> `tebibyte` <br> `exbibyte` <br> `zebibyte` <br> `yobibyte` |
| `Density` | `DensityUnit` | `kilogramPerCubicMetre` <br> `gramPerCubicMetre` |
| `Distance` | `LengthUnit` | `metre` <br> `centimetre` <br> `millimetre` <br> `micrometre` <br> `nanometre` <br> `kilometre` <br> `foot` <br> `inch` <br> `mile` <br> `nauticalMile` <br> `astronomicalUnit` |
| `ElectricCharge` | `ChargeUnit` | `coulomb` |
| `Energy` | `EnergyUnit` | `joule` <br> `kilojoule` <br> `megajoule` <br> `gigajoule` <br> `electronvolt` <br> `megaelectronvolt` <br> `kilowattHour` |
| `Force` | `ForceUnit` | `newton` <br> `pound` <br> `ounce` <br> `ton` |
| `Frequency` | `FrequencyUnit` | `hertz` <br> `kilohertz` <br> `megahertz` <br> `gigahertz` |
| `Humidity` | `DensityUnit` | `kilogramPerCubicMetre` <br> `gramPerCubicMetre` |
| `Illuminance` | `IlluminanceUnit` | `lux` <br> `footcandle` |
| `Inductance` | `InductanceUnit` | `henry` <br> `millihenry` <br> `microhenry` |
| `Latitude` | `AngleUnit` | `radian` <br> `degreeOfArc` <br> `minuteOfArc` <br> `secondOfArc` <br> `turn` |
| `Longitude` | `AngleUnit` | `radian` <br> `degreeOfArc` <br> `minuteOfArc` <br> `secondOfArc` <br> `turn` |
| `Length` | `LengthUnit` | `metre` <br> `centimetre` <br> `millimetre` <br> `micrometre` <br> `nanometre` <br> `kilometre` <br> `foot` <br> `inch` <br> `mile` <br> `nauticalMile` <br> `astronomicalUnit` |
| `Luminance` | `LuminanceUnit` | `candelaPerSquareMetre` |
| `Luminosity` | `PowerUnit` | `watt` <br> `microwatt` <br> `milliwatt` <br> `kilowatt` <br> `megawatt` <br> `gigawatt` <br> `horsepower` <br> `kilowattHourPerYear` |
| `LuminousFlux` | `LuminousFluxUnit` | `lumen` |
| `LuminousIntensity` | `LuminousIntensityUnit` | `candela` |
| `MagneticFlux` | `MagneticFluxUnit` | `weber` <br> `maxwell` |
| `MagneticInduction` | `MagneticInductionUnit` | `tesla` |
| `Mass` | `MassUnit` | `kilogram` <br> `gram` <br> `milligram` <br> `microgram` <br> `tonne` <br> `slug` |
| `MassFlowRate` | `MassFlowRateUnit` | `gramPerSecond` <br> `kilogramPerSecond` <br> `gramPerHour` <br> `kilogramPerHour` |
| `Power` | `PowerUnit` | `watt` <br> `microwatt` <br> `milliwatt` <br> `kilowatt` <br> `megawatt` <br> `gigawatt` <br> `horsepower` <br> `kilowattHourPerYear` |
| `Pressure` | `PressureUnit` | `pascal` <br> `kilopascal` <br> `bar` <br> `millibar` <br> `millimetresOfMercury` <br> `poundPerSquareInch` <br> `inchesOfMercury` <br> `inchesOfWater` |
| `RelativeHumidity` | *unitless* | Unity percent |
| `Resistance` | `ResistanceUnit` | `ohm` <br> `milliohm` <br> `kiloohm` <br> `megaohm` |
| `SoundPressure` | `SoundPressureUnit` | `decibel` <br> `bel` |
| `Temperature` | `TemperatureUnit` | `kelvin` <br> `degreeCelsius` <br> `degreeFahrenheit` |
| `Thrust` | `ForceUnit` | `newton` <br> `pound` <br> `ounce` <br> `ton` |
| `TimeSpan` | `TimeUnit` | `second` <br> `millisecond` <br> `microsecond` <br> `nanosecond` <br> `minute` <br> `hour` <br> `day` <br> `year` |
| `Torque` | `TorqueUnit` | `newtonMetre` |
| `Velocity` | `VelocityUnit` | `metrePerSecond` <br> `centimetrePerSecond` <br> `kilometrePerSecond` <br> `metrePerHour` <br> `kilometrePerHour` <br> `milePerHour` <br> `milePerSecond` <br> `knot` |
| `Voltage` | `VoltageUnit` | `volt` <br> `millivolt` <br> `microvolt` <br> `kilovolt` <br> `megavolt` |
| `Volume` | `VolumeUnit` | `cubicMetre` <br> `cubicCentimetre` <br> `litre` <br> `millilitre` <br> `cubicFoot` <br> `cubicInch` <br> `fluidOunce` <br> `gallon` |
| `VolumeFlowRate` | `VolumeFlowRateUnit` | `litrePerSecond` <br> `millilitrePerSecond` <br> `litrePerHour` <br> `millilitrePerHour` |

## DTDL models: Key fields

The sections above describe the major elements of the Digital Twins Definition Language (DTDL). These elements come together to allow you to write complete models. 

When you define a model, DTDL requires that there are certain key fields a models must have. These fields are an *identifier* (in the form of a Digital Twin Model Identifier (DTMI)), a *version*, and a *context*.

### Digital Twin Model Identifier (DTMI)

All elements in digital twin models (Interfaces, Properties, Telemetry, Commands, Relationships, Components, complex schema objects, etc...) must have an identifier that is a **Digital Twin Model Identifier (DTMI)**. This is a particular syntax used to give an ID to the model and provide some other information. Any identifier assigned to a model element by a digital twin processor must follow this identifier format.

A DTMI has three components: *scheme*, *path*, and *version*. They are arranged like this: `<scheme> : <path> ; <version>`, and follow the following restrictions:
* *scheme*: Has the value of "dtmi" (string literal) in lowercase.
* *path*: Is a sequence of one or more segments, separated by colons. Each path segment is a non-empty string, containing only letters, digits, and underscores. The first character may not be a digit, and the last character may not be an underscore. This is so that segments can be representable as identifiers across most common programming languages.
* *version*: Is a sequence of one or more digits. The version length is limited to nine digits, because the number 999,999,999 fits in a 32-bit signed integer value. The first digit can't be zero, to eliminate ambiguity around whether a hypothetical version "01" would be equal to version "1". For more about the concept of a version, see the next section on *Model versioning*.

>[!IMPORTANT]
>Scheme and path are separated by a colon, while path and version are separated by a semicolon.

For a full definition of DTMI, visit the [DTMI repo on GitHub](https://github.com/Azure/digital-twin-model-identifier).

#### System and non-system rules

A model can be classified as either a **system model** or a **non-system model**.

Similarly, on a smaller level, a DTMI itself can be classified as a **system DTMI** or a **user DTMI**. 
* System DTMIs contain at least one **system segment**. These start with an underscore.
* User DTMIs don't contain any **system segments**.

System DTMIs can be referenced in non-system models, but they can't serve as the `@id` values for any elements that the non-system model defines. Only user DTMIs can be `@id`s for elements defined in a non-system model.

#### DTMI example

Here is an example of a valid DTMI: `dtmi:foo_bar:_16:baz33:qux;12`.
* *scheme*: dtmi
* *path*: foo_bar:_16:baz33:qux
  - The path contains four segments: *foo_bar*, *_16*, *baz33*, and *qux*. One of the segments (*_16*) is a system segment, and therefore the identifier is a system DTMI.
* *version*: 12

#### Restrictions and best practices

Here are some notable restrictions on DTMI:
* Equivalence of DTMIs is case-sensitive.
* The maximum length of a DTMI is 4096 characters. The maximum length of a user DTMI is 2048 characters. The maximum length of a DTMI for an Interface is 128 characters.

Other best practice recommendations:
* Developers are encouraged to take reasonable precautions against identifier collisions. It may help to stay away from DTMIs with very short lengths or very common terms, such as `dtmi:myDevice;1`.
* For any definition that is the property of an organization with a registered domain name, a suggested approach to generating identifiers is to use the reversed order of domain segments as initial path segments, followed by further segments that are expected to be collectively unique among definitions within the domain. For example, `dtmi:com:microsoft:azure:iot:demoSensor5;1`.
  - This doesn't eliminate the possibility of collisions, but may limit accidental collisions to developers who are organizationally proximate. 
  - It will also simplify the process of identifying malicious definitions when there is a clear mismatch between the identifier and the account that uploaded the definition.

### Model versioning

Every Interface has a version associated with it. The version is specified with a single version number (positive integer) in the last segment of an Interface's DTMI. 

The use case for versions is making changes to models you have defined. In DTDL, once a model is finalized (published, used in production, etc...), its definition is immutable. Rather than editing a model that you want to change, you can do one of the following:
* For major changes, just create an entirely new Interface. Publish the new interface with its own new DTMI, containing a new name and a version number of 1.
  - Examples of "major changes" include breaking changes, such as removing a `contents` item (Telemetry, Property, Command, Relationship, or Component), or changing the names of any `contents` or `schemas` elements.
*. For minor changes, publish a newer **version** that iterates on the current Interface. Leave the majority of the DTMI the same, but increment the version number by 1, and re-publish the model. Any number greater than the current version will also work as a new version number.
  - Examples of "minor changes" include adding a new `contents` item (Telemetry, Property, Command, Relationship, or Component, fixing a bug in a display name or description, or changing other metadata values.

The specific rules for versioning with each model element are described with their metamodel sections earlier in this article.

#### Model versioning examples

Below is an example of a model versioning update. It shows two versions of the same model, with several changes having happened in between:
* The Interface's `description` is updated.
* The *temp* Telemetry's `displayName` is updated.
* A new *humidity* Telemetry is added.
* The Interface's `@id` is updated to reflect the new version.

Together, these illustrate the types of changes that are allowed in new versions of a the same Interface. 

```json
{
    "@id": "dtmi:com:example:Thermostat;1",
    "@type": "Interface",
    "displayName": "Thermostat",
    "description": "Thermostat that measures temperature.",
    "contents": [
        {
            "@type": "Telemetry",
            "name": "temp",
            "displayName": "Measured temp",
            "schema": "double"
        }
    ],
    "@context": "dtmi:dtdl:context;2"
}

{
    "@id": "dtmi:com:example:Thermostat;2",
    "@type": "Interface",
    "displayName": "Thermostat",
    "description": "Thermostat that measures temperature and humidity.",
    "contents": [
        {
            "@type": "Telemetry",
            "name": "temp",
            "displayName": "Measured temperature",
            "schema": "double"
        },
        {
            "@type": "Telemetry",
            "name": "humidity",
            "schema": "double"
        }
    ],
    "@context": "dtmi:dtdl:context;2"
}
```

### Context

When writing a digital twin definition, it's necessary to specify the version of DTDL being used. Because DTDL is based on JSON-LD, you use the JSON-LD `@context` statement to specify the DTDL version.

For this version of DTDL, the context is exactly *dtmi:dtdl:context;2*.

## Other characteristics

Once you have the key fields set within your DTDL model, the next step is to continue building out your model definition how you'd like. As you do this, DTDL has a few more language characteristics that you may want to consider: *conformance* to popular standards, *display string localization*, and (if you've worked with DTDL in the past) *differences from previous release*.

### Conformance with JSON-LD and RDF

Recall that DTDL is based on a variant of JSON called [JSON-LD](https://json-ld.org/spec/latest/json-ld). DTDL conforms with the JSON and JSON-LD 1.1 specifications. This conformance includes things such as keywords, case sensitivity, terminology, etc. In particular, the JSON-LD spec states that all keys, keywords, and values in JSON-LD are case-sensitive.

**Resource Description Framework (RDF)** is a widely adopted standard for describing resources in a distributed, extensible way. DTDL is compatible with RDF, and can be used in RDF systems as well.

### Display string localization

Some string properties in models—currently, `displayName` and `description`—are intended to be displayed for humans to read. As a result, these properties support localization. Digital twin models use JSON-LD's **string internationalization support** for localization. 

Each localizable property is defined to be a JSON-LD language map (with a structure of `"@container": "@language"`). The default language for digital twin documents is English. Localized string values are declared using their language code (as defined in [BCP47](https://tools.ietf.org/html/bcp47), using the shortest ISO 639 code or the expanded language name with culture information (RFC4646)). Because of the composable nature of JSON-LD graphs, localized strings can be prepared in a separate file and merged with an existing graph.

In the following example, no language code is used for the localizable `displayName` property, so the default language English is used.

```json
{
    "@id": "dtmi:com:example:Thermostat;1",
    "@type": "Interface",
    "displayName": "Thermostat"
}
```

In this next example, the `displayName` property takes advantage of the localization option and offers multiple language options.

```json
{
    "@id": "dtmi:com:example:Thermostat;1",
    "@type": "Interface",
    "displayName": {
        "en": "Thermostat",
        "it": "Termostato"
    }
}
```

### Differences from previous release

The first public preview of Azure Digital Twins was released in October of 2018. In the current preview release, there have been some changes to DTDL's capabilities, so refer to this section if you are used to working with a previous version of DTDL.

Here's what has changed:
* *Digital twin ID* has changed to *Digital Twin Model Identifier (DTMI)*
* The context has changed from *http://azureiot.com/v1/contexts/IoTModel.json* to *dtmi:dtdl:context;2*
* *InterfaceInstance* has been renamed to *Component*
* *CapabilityModel* has been removed
* *Components* have been added
* *Relationships* have been added
* Interface inheritance has been added
* Semantic type support has been added
* The character set for the `name` property has been updated
* The `unit` property has been replaced with a semantic `unit` property
* The property `displayUnit` has been removed

## Next steps

See how a DTDL model is managed with the DigitalTwinsModels APIs:
* [How-to: Manage a twin model](how-to-manage-model.md)