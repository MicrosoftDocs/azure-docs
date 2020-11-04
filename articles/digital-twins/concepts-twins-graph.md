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

## Digital twins

Before you can create a digital twin in your Azure Digital Twins instance, you need to have a *model* uploaded to the service. A model describes the set of properties, telemetry messages, and relationships that a particular twin can have, among other things. For the types of information that are defined in a model, see [*Concepts: Custom models*](concepts-models.md).

After creating and uploading a model, your client app can create an instance of the type; this is a digital twin. For example, after creating a model of *Floor*, you may create one or several digital twins that use this type (like a *Floor*-type twin called *GroundFloor*, another called *Floor2*, etc.). 

## Relationships: a graph of digital twins

Twins are connected into a twin graph by their relationships. The relationships that a twin can have are defined as part of its model.  

For example, the model *Floor* might define a *contains* relationship that targets twins of type *room*. With this definition, Azure Digital Twins will allow you to create *contains* relationships from any *Floor* twin to any *Room* twin (including twins that are of *Room* subtypes). 

The result of this process is a set of nodes (the digital twins) connected via edges (their relationships) in a graph.

[!INCLUDE [visualizing with Azure Digital Twins explorer](../../includes/digital-twins-visualization.md)]

## Create with the APIs

This section shows what it looks like to create digital twins and relationships from a client application. It contains .NET code examples that utilize the [DigitalTwins APIs](/rest/api/digital-twins/dataplane/twins), to provide additional context on what goes on inside each of these concepts.

### Create digital twins

Below is a snippet of client code that uses the [DigitalTwins APIs](/rest/api/digital-twins/dataplane/twins) to instantiate a twin of type *Room*.

You can initialize the properties of a twin when it is created, or set them later. To create a twin with initialized properties, create a JSON document that provides the necessary initialization values.

[!INCLUDE [Azure Digital Twins code: create twin](../../includes/digital-twins-code-create-twin.md)]

You can also use a helper class called `BasicDigitalTwin` to store property fields in a "twin" object more directly, as an alternative to using a dictionary. For more information about the helper class and examples of its use, see the [*Create a digital twin*](how-to-manage-twin.md#create-a-digital-twin) section of *How-to: Manage digital twins*.

>[!NOTE]
>While twin properties are treated as optional and thus don't have to be initialized, any [components](concepts-models.md#elements-of-a-model) on the twin **do** need to be set when the twin is created. They can be empty objects, but the components themselves must exist.

### Create relationships

Here is some example client code that uses the [DigitalTwins APIs](/rest/api/digital-twins/dataplane/twins) to build a relationship between a *Floor*-type digital twin called *GroundFloor* and a *Room*-type digital twin called *Cafe*.

```csharp
// Create Twins, using functions similar to the previous sample
await CreateRoom("Cafe", 70, 66);
await CreateFloor("GroundFloor", averageTemperature=70);
// Create relationships
var relationship = new BasicRelationship
{
    TargetId = "Cafe",
    Name = "contains"
};
try
{
    string relId = $"GroundFloor-contains-Cafe";
    await client.CreateOrReplaceRelationshipAsync("GroundFloor", relId, relationship);
} catch(ErrorResponseException e)
{
    Console.WriteLine($"*** Error creating relationship: {e.Response.StatusCode}");
}
```

## JSON representations of graph elements

Digital twin data and relationship data are both stored in JSON format. This means that when you [query the twin graph](how-to-query-graph.md) in your Azure Digital Twins instance, the result will be a JSON representation of digital twins and relationships you have created.

### Digital twin JSON format

When represented as a JSON object, a digital twin will display the following fields:

| Field name | Description |
| --- | --- |
| `$dtId` | A user-provided string representing the ID of the digital twin |
| `$etag` | Standard HTTP field assigned by the web server |
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
  "$etag": "W/\"e59ce8f5-03c0-4356-aea9-249ecbdc07f9\"",
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
| `$etag` | Standard HTTP field assigned by the web server |
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
  "$targetId": "Cafe",
  "$relationshipName": "contains",
  "startDate": "2020-02-04"
}
```

## Next steps

See how to manage graph elements with Azure Digital Twin APIs:
* [*How-to: Manage digital twins*](how-to-manage-twin.md)
* [*How-to: Manage the twin graph with relationships*](how-to-manage-graph.md)

Or, learn about querying the Azure Digital Twins twin graph for information:
* [*Concepts: Query language*](concepts-query-language.md)