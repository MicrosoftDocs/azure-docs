---
# Mandatory fields.
title: Create twins and the Azure Digital Twins graph
titleSuffix: Azure Digital Twins
description: Understand the concept of a digital twin, and how their relationships make a graph.
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

# Understand the concept of a digital twin

Within an Azure Digital Twins solution, the entities in your environment are represented by **twins.** A twin is described by one of the user-created Azure Digital Twins [models](concepts-models.md); it is implemented and connected via relationships to form the Azure Digital Twins graph. This article gives more information on what a twin representation entails.

## Creating twins

Building a twin starts with creating a model. The twin's model is what describes its properties and what relationships it can have, among other features. For the types of information that is included with a model, see [Model an Object](concepts-models.md).

After creating a model, your client app will instantiate it in order to create twins. For example, after creating a model type of *Floor*, you may create several twins that use this design (*GroundFloor*, *Floor2*, etc.). 

Here is some example code that instantiates several twin instances:

```csharp
// Create twins
client.CreateTwin("GroundFloor", "dtmi:com:example:Floor;1");
client.CreateTwin("ConferenceRoom", "dtmi:com:example:Room;1");
client.CreateTwin("Cafe", "dtmi:com:example:Room;1");
```

## Relationships: creating a graph of twins

Twins are connected into a graph via their relationships. The relationship types that a twin can have are defined as part of the twin's model. Then, when instantiating graph components in client app code, you can instantiate an instance of a relationship between two twins that you have created. The result is a set of nodes (the twins) connected via edges (relationships) to form a graph.

For example, a *Floor*-type twin might have a *contains* relationship that allows it to connect to several *Room* twins. A cooling device might have a *cools* relationship with a motor. 
Here is some example code that builds relationships between the twins created in the earlier section.

```csharp
// Create relationships
client.CreateRelationship("GroundFloor", "contains", "ConferenceRoom");
client.CreateRelationship("GroundFloor", "contains", "Cafe");
```
## JSON representations of graph components

Digital twin and relationship data is stored in JSON format. This means when you query the graph in your digital twins solution, the result will be a JSON representation of the twins and relationships you have created.

### Digital twin JSON format

The following section shows an example of a digital twin's data represented in JSON:

```json
{
  "$dtId": "digitaltwin-01",
  "prop1": 42,
  "prop2": {
    "x": 101,
    "y": 33
  },
  "component": {
    "componentProperty": 80,
    "$metadata": {
      "$model": "urn:example:Component:1",
      "componentProperty": {
        "desiredValue": 85,
        "desiredVersion": 3,
        "ackVersion": 2,
        "ackCode": 200,
        "ackDescription": "OK"
      }
    }
  },
  "$metadata": {
    "$model": "urn:example:Building:1",
    "prop1": {
      "desiredValue": 66,
      "desiredVersion": 5,
      "ackVersion": 4,
      "ackCode": 200,
      "ackDescription": "OK"
    },
    "prop2": {
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

More formally, the JSON data has the following fields:

| Field name | Description |
| --- | --- |
| `$dtId` | A user-provided string representing the ID of the digital twin. |
| `$conformance` | An enum containing the conformance status of this digital twin (conformant, non-conformant, unknown) |
| `{propertyName}` | The value of a property in JSON (string, number, or object). |
| `$relationships` | URL of the path to the relationships collection. This field is absent if the digital twin has no outgoing edges. |
| `$metadata.$model` | [Optional] The URN of the interface that models this digital twin instance. |
| `$metadata.{propertyName}.desiredValue` | [only for writable properties] The desired value of the specified property. |
| `$metadata.{propertyName}.desiredVersion` | [only for writable properties] The version of the desired value. |
| `$metadata.{propertyName}.ackVersion` | The version acknowledged by the device app implementing the digital twin. |
| `$metadata.{propertyName}.ackCode` | [only for writable properties] The `ack` code returned by the device app implementing the digital twin. |
| `$metadata.{propertyName}.ackDescription` | [only for writable properties] The `ack` description returned by the device app implementing the digital twin. |
| `{componentName}` | A JSON object containing the property values and metadata analogously to the root object. This object exists even if the component has no properties. |
| `{componentName}.{propertyName}` | The value of the property in JSON (string, number, or object). |
| `{componentName}.$metadata` | The metadata information for the component, analogous to the root-level $metadata. |

### Relationship JSON format

A relationship resource has the following format:

```json
{
  "$edgeId": "edge-01",
  "$sourceId": "logical-digitaltwin-01",
  "$relationship": "contains",
  "$targetId": "device-digitaltwin-01",
  "prop1": "2019-04-01"
}
```

| Field name | Description |
| --- | --- |
| `$edgeId` | A user-provided string representing the ID of this edge. This string is unique in the context of the source digital twin, which also means that `sourceId` + `edgeId` is unique in the context of the service. |
| `$sourceId` | The ID of the source digital twin. |
| `$targetId` | The ID of the target digital twin. |
| `$relationshipName` | The name of the relationship. |
| `{propertyName}` | The value of the property in JSON (string, number, or object) |

## Next steps

See how to manage graph components with Twin APIs:
* [Manage an individual twin](how-to-manage-twin.md)
* [Manage an Azure Digital Twins graph](how-to-manage-graph.md)

Or, learn about querying the Azure Digital Twins graph for information:
* [Query the Azure Digital Twins graph](concepts-query-graph.md)