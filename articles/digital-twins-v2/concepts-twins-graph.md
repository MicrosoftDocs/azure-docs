---
# Mandatory fields.
title: Create digital twins and the twin graph
titleSuffix: Azure Digital Twins
description: Understand the concept of an Azure digital twin, and how their relationships make a graph.
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

# Understand Azure digital twins and their twin graph

In an Azure Digital Twins solution, the entities in your environment are represented by Azure **digital twins**. An Azure digital twin is an instance of one of your user-created [twin types](concepts-models.md); it follows a pre-defined twin type template and is connected to other Azure digital twins via relationships to form a **twin graph**.

> [!TIP]
> "Azure Digital Twins" (every word capitalized) refers to this entire Azure service. When you see "digital twin(s)" or "Azure digital twin(s)" (not capitalized), this refers to the actual twin nodes inside the twin graph. They are the individual entities in your Azure Digital Twins solution.

## Creating Azure digital twins

Building an Azure digital twin starts with creating a *twin type*. A twin type describes a digital twin's properties and what relationships it can have, among other aspects. For the types of information that are defined in a twin type, see [Create a twin type](concepts-models.md).

After creating a twin type, your client app will instantiate it in order to create Azure digital twins. For example, after creating a twin type of *Floor*, you may create one or several digital twins that use this design (a *Floor*-type twin called *GroundFloor*, another called *Floor2*, etc.). 

Here is some example client code that uses the [Twin APIs](how-to-use-apis.md) to instantiate several Azure digital twins: two of twin type *Floor* and one of twin type *Room*.

```csharp
// Create digital twins
client.CreateTwin("GroundFloor", "urn:contosocom:example:Floor:1");
client.CreateTwin("Floor2", "urn:contosocom:example:Floor:1");
client.CreateTwin("Cafe", "urn:contosocom:example:Room:1");
```

## Relationships: creating a graph of digital twins

Twins are connected into a twin graph by their relationships. The relationship types that an Azure digital twin can have are defined as part of the twin type. Then, when instantiating graph elements in client app code, you can instantiate an allowed relationship between two Azure digital twins that you have created.

For example, a *Floor*-type digital twin might have a *contains* relationship that allows it to connect to several *Room*-type digital twins. A cooling device might have a *cools* relationship with a motor. 

Here is some example client code that uses the [Twin APIs](how-to-use-apis.md) to build a relationship between a *Floor*-type digital twin called *GroundFloor* and a *Room*-type digital twin called *Cafe*.

```csharp
// Create relationships
client.CreateRelationship("GroundFloor", "contains", "Cafe");
```

The result of this process is a set of nodes (the digital twins) connected via edges (their relationships) in a graph.

## JSON representations of graph elements

Digital twin data and relationship data are both stored in JSON format. This means that when you [query the twin graph](concepts-query-graph.md) in your Azure Digital Twins instance, the result will be a JSON representation of Azure digital twins and relationships you have created.

### Digital twin JSON format

When represented as a JSON object, an Azure digital twin will display the following fields:

| Field name | Description |
| --- | --- |
| `$dtId` | A user-provided string representing the ID of the digital twin |
| `$conformance` | An enum containing the conformance status of this digital twin (*conformant*, *non-conformant*, *unknown*) |
| `{propertyName}` | The value of a property in JSON (`string`, number type, or object) |
| `$relationships` | URL of the path to the relationships collection. This field is absent if the digital twin has no outgoing relationship edges. |
| `$metadata.$model` | [Optional] The URN of the twin type interface that characterizes this digital twin |
| `$metadata.{propertyName}.desiredValue` | [Only for writable properties] The desired value of the specified property |
| `$metadata.{propertyName}.desiredVersion` | [Only for writable properties] The version of the desired value |
| `$metadata.{propertyName}.ackVersion` | The version acknowledged by the device app implementing the digital twin |
| `$metadata.{propertyName}.ackCode` | [Only for writable properties] The `ack` code returned by the device app implementing the digital twin |
| `$metadata.{propertyName}.ackDescription` | [Only for writable properties] The `ack` description returned by the device app implementing the digital twin |
| `{componentName}` | A JSON object containing the component's property values and metadata, similar to those of the root object. This object exists even if the component has no properties. |
| `{componentName}.{propertyName}` | The value of the component's property in JSON (`string`, number type, or object) |
| `{componentName}.$metadata` | The metadata information for the component, similar to the root-level `$metadata` |

Here is an example of an Azure digital twin formatted as a JSON object:

```json
{
  "$dtId": "Cafe",
  "Temperature": 72,
  "Location": {
    "x": 101,
    "y": 33
  },
  "component": {
    "TableOccupancy": 1,
    "$metadata": {
      "$model": "urn:contosocom:example:Table:1",
      "TableOccupancy": {
        "desiredValue": 1,
        "desiredVersion": 3,
        "ackVersion": 2,
        "ackCode": 200,
        "ackDescription": "OK"
      }
    }
  },
  "$metadata": {
    "$model": "urn:contosocom:example:Room:1",
    "Temperature": {
      "desiredValue": 72,
      "desiredVersion": 5,
      "ackVersion": 4,
      "ackCode": 200,
      "ackDescription": "OK"
    },
    "Location": {
      "desiredValue": {
        "x": 101,
        "y": 33,
      },
      "desiredVersion": 8,
      "ackVersion": 8,
      "ackCode": 200,
      "ackDescription": "OK"
    }
  }
}
```

### Relationship JSON format

When represented as a JSON object, a relationship from an Azure digital twin will display the following fields:

| Field name | Description |
| --- | --- |
| `$edgeId` | A user-provided string representing the ID of this relationship edge. This string is unique in the context of the source digital twin, which also means that `sourceId` + `edgeId` is unique in the context of the Azure Digital Twins instance. |
| `$sourceId` | The ID of the source digital twin |
| `$targetId` | The ID of the target digital twin |
| `$relationshipName` | The name of the relationship |
| `{propertyName}` | [Optional] The value of a property of this relationship, in JSON (`string`, number type, or object) |

Here is an example of a relationship formatted as a JSON object:

```json
{
  "$edgeId": "Edge-01",
  "$sourceId": "GroundFloor",
  "$relationship": "contains",
  "$targetId": "Cafe",
  "startDate": "2020-02-04"
}
```

## Next steps

See how to manage graph elements with Twin APIs:
* [Manage an individual digital twin](how-to-manage-twin.md)
* [Manage a twin graph](how-to-manage-graph.md)

Or, learn about querying the Azure Digital Twins twin graph for information:
* [Query the twin graph](concepts-query-graph.md)