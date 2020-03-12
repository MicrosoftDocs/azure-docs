---
# Mandatory fields.
title: Create twins and the Azure Digital Twins graph
titleSuffix: Azure Digital Twins
description: Understand the concept of a digital twin, and how their relationships make a graph.
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

# Understand digital twins and their graph

In an Azure Digital Twins solution, the entities in your environment are represented by **twins**. A twin is an instance of one of the user-created [models](concepts-models.md); it follows a pre-defined model template and is connected to other twins via relationships to form the Azure Digital Twins graph.

## Creating twins

Building a twin starts with creating a model. A twin's model describes its properties and what relationships it can have, among other aspects. For the types of information that are defined in a model, see [Model an Object](concepts-models.md).

After creating a model, your client app will instantiate it in order to create twins. For example, after creating a model type of *Floor*, you may create one or several twins that use this design (a *Floor*-type twin called *GroundFloor*, another called *Floor2*, etc.). 

Here is some example client code that uses the [Twin APIs](concepts-use-apis.md) to instantiate several twin instances—two of model type *Floor* and one of model type *Room*:

```csharp
// Create twins
client.CreateTwin("GroundFloor", "urn:contosocom:example:Floor:1");
client.CreateTwin("Floor2", "urn:contosocom:example:Floor:1");
client.CreateTwin("Cafe", "urn:contosocom:example:Room:1");
```

## Relationships: creating a graph of twins

Twins are connected into a graph by their relationships. The relationship types that a twin can have are defined as part of the twin's model. Then, when instantiating graph components in client app code, you can instantiate an instance of an allowed relationship between two twins that you have created.

For example, a *Floor*-type twin might have a *contains* relationship that allows it to connect to several *Room*-type twins. A cooling device might have a *cools* relationship with a motor. 

Here is some example client code that uses the [Twin APIs](concepts-use-apis.md) to build a relationship between a *Floor*-type twin called *GroundFloor* and a *Room*-type twin called *Cafe*.

```csharp
// Create relationships
client.CreateRelationship("GroundFloor", "contains", "Cafe");
```

The result of this process is a set of nodes (the twins) connected via edges (their relationships) to form a graph.

## JSON representations of graph components

Digital twin data and relationship data are both stored in JSON format. This means that when you [query the graph](concepts-query-graph.md) in your digital twins solution, the result will be a JSON representation of the twins and relationships you have created.

### Digital twin JSON format

When represented as a JSON object, a digital twin has the following fields:

| Field name | Description |
| --- | --- |
| `$dtId` | A user-provided string representing the ID of the digital twin |
| `$conformance` | An enum containing the conformance status of this digital twin (*conformant*, *non-conformant*, *unknown*) |
| `{propertyName}` | The value of a property in JSON (`string`, number type, or object) |
| `$relationships` | URL of the path to the relationships collection. This field is absent if the digital twin has no outgoing edges. |
| `$metadata.$model` | [Optional] The URN of the capability model or interface that models this digital twin instance |
| `$metadata.{propertyName}.desiredValue` | [only for writable properties] The desired value of the specified property |
| `$metadata.{propertyName}.desiredVersion` | [only for writable properties] The version of the desired value |
| `$metadata.{propertyName}.ackVersion` | The version acknowledged by the device app implementing the digital twin |
| `$metadata.{propertyName}.ackCode` | [only for writable properties] The `ack` code returned by the device app implementing the digital twin |
| `$metadata.{propertyName}.ackDescription` | [only for writable properties] The `ack` description returned by the device app implementing the digital twin |
| `{componentName}` | A JSON object containing the component's property values and metadata, similar to those of the root object. This object exists even if the component has no properties. |
| `{componentName}.{propertyName}` | The value of the component's property in JSON (`string`, number type, or object) |
| `{componentName}.$metadata` | The metadata information for the component, similar to the root-level `$metadata` |

Here is an example of a digital twin formatted as a JSON object:

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

When represented as a JSON object, a relationship has the following fields:

| Field name | Description |
| --- | --- |
| `$edgeId` | A user-provided string representing the ID of this edge. This string is unique in the context of the source digital twin, which also means that `sourceId` + `edgeId` is unique in the context of the service. |
| `$sourceId` | The ID of the source digital twin |
| `$targetId` | The ID of the target digital twin |
| `$relationshipName` | The name of the relationship |
| `{propertyName}` | The value of the property in JSON (`string`, number type, or object) |

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

See how to manage graph components with Twin APIs:
* [Manage an individual twin](how-to-manage-twin.md)
* [Manage an Azure Digital Twins graph](how-to-manage-graph.md)

Or, learn about querying the Azure Digital Twins graph for information:
* [Query the Azure Digital Twins graph](concepts-query-graph.md)