---
# Mandatory fields.
title: Digital twins and the twin graph
titleSuffix: Azure Digital Twins
description: Understand the concept of a digital twin, and how their relationships make a graph.
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

# Understand digital twins and their twin graph

In an Azure Digital Twins solution, the entities in your environment are represented by Azure **digital twins**. A digital twin is an instance of one of your custom-defined [models](concepts-models.md). It can be connected to other digital twins via **relationships** to form a **twin graph**: this twin graph is the representation of your entire environment.

> [!TIP]
> "Azure Digital Twins" refers to this Azure service as a whole. "Digital twin(s)" or just "twin(s)" refers to individual twin nodes inside your instance of the service.

## Creating digital twins

Before you can create a digital twin in your Azure Digital Twins instance, you need to have a *model* uploaded to the service. A model describes the set of properties, telemetry messages, and relationships that a particular twin can have, among other things. For the types of information that are defined in a model, see [Concepts: Custom models](concepts-models.md).

After creating and uploading a model, your client app can create an instance of the type; this is a digital twin. For example, after creating a model of *Floor*, you may create one or several digital twins that use this type (like a *Floor*-type twin called *GroundFloor*, another called *Floor2*, etc.). 

Below is a snippet of client code that uses the [DigitalTwins APIs](how-to-use-apis-sdks.md) to instantiate a twin of type *Room*.

In the current preview of Azure Digital Twins, all properties of a twin must be initialized before the twin can be created. This is done by creating a JSON document that provides the necessary initialization values.

```csharp
public Task<boolean> CreateRoom(string id, double temperature, double humidity) 
{
    // Define the model for the twin to be created
    Dictionary<string, object> meta = new Dictionary<string, object>()
    {
      { "$model", "dtmi:com:contoso:Room;2" }
    };
    // Initialize the twin properties
    Dictionary<string, object> initData = new Dictionary<string, object>()
    {
      { "$metadata", meta },
      { "Temperature", temperature},
      { "Humidity", humidity},
    };
    try
    {
      await client.DigitalTwins.AddAsync(id, initData);
      return true;
    }
    catch (ErrorResponseException e)
    {
      Console.WriteLine($"*** Error creating twin {id}: {e.Response.StatusCode}");
      return false;
    }
}
```

## Relationships: Creating a graph of digital twins

Twins are connected into a twin graph by their relationships. The relationships that a twin can have are defined as part of its model.  

For example, the model *Floor* might define a *contains* relationship that targets twins of type *room*. With this definition, Azure Digital Twins will allow you to create *contains* relationships from any *Floor* twin to any *Room* twin (including twins that are of *Room* subtypes). 

Here is some example client code that uses the [DigitalTwins APIs](how-to-use-apis-sdks.md) to build a relationship between a *Floor*-type digital twin called *GroundFloor* and a *Room*-type digital twin called *Cafe*.

```csharp
// Create Twins, using functions similar to the previous sample
await CreateRoom("Cafe", 70, 66);
await CreateFloor("GroundFloor", averageTemperature=70);
// Create relationships
Dictionary<string, object> targetrec = new Dictionary<string, object>()
{
    { "$targetId", "Cafe" }
};
try
{
    await client.DigitalTwins.AddEdgeAsync("GroundFloor", "contains", "GF-to-Cafe", targetrec);
} catch(ErrorResponseException e)
{
    Console.WriteLine($"*** Error creating relationship: {e.Response.StatusCode}");
}
```

The result of this process is a set of nodes (the digital twins) connected via edges (their relationships) in a graph.

## JSON representations of graph elements

Digital twin data and relationship data are both stored in JSON format. This means that when you [query the twin graph](how-to-query-graph.md) in your Azure Digital Twins instance, the result will be a JSON representation of digital twins and relationships you have created.

### Digital twin JSON format

When represented as a JSON object, a digital twin will display the following fields:

| Field name | Description |
| --- | --- |
| `$dtId` | A user-provided string representing the ID of the digital twin |
| `$conformance` | An enum containing the conformance status of this digital twin (*conformant*, *non-conformant*, *unknown*) |
| `{propertyName}` | The value of a property in JSON (`string`, number type, or object) |
| `$relationships` | The URL of the path to the relationships collection. This field is absent if the digital twin has no outgoing relationship edges. |
| `$metadata.$model` | [Optional] The ID of the model interface that characterizes this digital twin |
| `$metadata.{propertyName}.desiredValue` | [Only for writable properties] The desired value of the specified property |
| `$metadata.{propertyName}.desiredVersion` | [Only for writable properties] The version of the desired value |
| `$metadata.{propertyName}.ackVersion` | The version acknowledged by the device app implementing the digital twin |
| `$metadata.{propertyName}.ackCode` | [Only for writable properties] The `ack` code returned by the device app implementing the digital twin |
| `$metadata.{propertyName}.ackDescription` | [Only for writable properties] The `ack` description returned by the device app implementing the digital twin |
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
    "$model": "dtmi:com:contoso:Room;1",
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

When represented as a JSON object, a relationship from a digital twin will display the following fields:

| Field name | Description |
| --- | --- |
| `$relationshipId` | A user-provided string representing the ID of this relationship. This string is unique in the context of the source digital twin, which also means that `sourceId` + `relationshipId` is unique in the context of the Azure Digital Twins instance. |
| `$sourceId` | The ID of the source digital twin |
| `$targetId` | The ID of the target digital twin |
| `$relationshipName` | The name of the relationship |
| `{propertyName}` | [Optional] The value of a property of this relationship, in JSON (`string`, number type, or object) |

Here is an example of a relationship formatted as a JSON object:

```json
{
  "$relationshipId": "relationship-01",
  "$etag": "W/\"506e8391-2b21-4ac9-bca3-53e6620f6a90\"",
  "$sourceId": "GroundFloor",
  "$relationshipName": "contains",
  "$targetId": "Cafe",
  "startDate": "2020-02-04"
}
```

## Next steps

See how to manage graph elements with Azure Digital Twin APIs:
* [How-to: Manage digital twins](how-to-manage-twin.md)
* [How-to: Manage the twin graph with relationships](how-to-manage-graph.md)

Or, learn about querying the Azure Digital Twins twin graph for information:
* [Concepts: Query language](concepts-query-language.md)