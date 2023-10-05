---
# Mandatory fields.
title: Digital twins and the twin graph
titleSuffix: Azure Digital Twins
description: Learn about digital twins, and how their relationships form a digital twin graph.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 02/06/2023
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Digital twins and their twin graph

This article describes what digital twins are in the context of Azure Digital Twins, and how relationships between them can form a twin graph. In an Azure Digital Twins solution, the entities in your environment are represented by *digital twins*. A digital twin is an instance of one of your custom-defined [models](concepts-models.md). It can be connected to other digital twins via *relationships* to form a *twin graph*: this twin graph is the representation of your entire environment.

> [!TIP]
> "Azure Digital Twins" refers to this Azure service as a whole. "Digital twin(s)" or just "twin(s)" refers to individual twin nodes inside your instance of the service.

## Digital twins

Before you can create a digital twin in your Azure Digital Twins instance, you need to have a *model* uploaded to the service. A model describes the set of properties, telemetry messages, and relationships that a particular twin can have, among other things. For the types of information that are defined in a model, see [Custom models](concepts-models.md).

After creating and uploading a model, your client app can create an instance of the type. This instance is a digital twin. For example, after creating a model of Floor, you may create one or several digital twins that use this type (like a Floor-type twin called GroundFloor, another called Floor2, and so on).

[!INCLUDE [digital-twins-versus-device-twins](../../includes/digital-twins-versus-device-twins.md)]

## Relationships: a graph of digital twins

Twins are connected into a twin graph by their relationships. The relationships that a twin can have are defined as part of its model.  

For example, the model Floor might define a `contains` relationship that targets twins of type Room. With this definition, Azure Digital Twins will allow you to create `contains` relationships from any Floor twin to any Room twin (including twins that are of Room subtypes). 

The result of this process is a set of nodes (the digital twins) connected via edges (their relationships) in a graph.

[!INCLUDE [visualizing with Azure Digital Twins explorer](../../includes/digital-twins-visualization.md)]

:::image type="content" source="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-demo.png" alt-text="Screenshot of Azure Digital Twins Explorer showing sample models and twins." lightbox="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-demo.png":::

## Create with the APIs

This section shows what it looks like to create digital twins and relationships from a client application. It contains [.NET SDK](/dotnet/api/overview/azure/digitaltwins.core-readme) examples that use the [DigitalTwins APIs](/rest/api/digital-twins/dataplane/twins), to provide more context on what goes on inside each of these concepts.

### Create digital twins

Below is a snippet of client code that uses the [DigitalTwins APIs](/rest/api/digital-twins/dataplane/twins) to instantiate a twin of type Room with a `twinId` that's defined during the instantiation.

You can initialize the properties of a twin when it's created, or set them later. To create a twin with initialized properties, create a JSON document that provides the necessary initialization values.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_other.cs" id="CreateTwin_noHelper":::

You can also use a helper class called `BasicDigitalTwin` to store property fields in a "twin" object more directly, as an alternative to using a dictionary. For more information about the helper class and examples of its use, see [Create a digital twin](how-to-manage-twin.md#create-a-digital-twin).

>[!NOTE]
>While twin properties are treated as optional and thus don't have to be initialized, any [components](concepts-models.md#model-attributes) on the twin need to be set when the twin is created. They can be empty objects, but the components themselves must exist.

### Create relationships

Here's some example client code that uses the [DigitalTwins APIs](/rest/api/digital-twins/dataplane/twins) to build a relationship from one digital twin (the "source" twin) to another digital twin (the "target" twin).

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/graph_operations_other.cs" id="CreateRelationship_short":::

### Create twins and relationships in bulk with the Jobs API

You can upload many twins and relationships in a single API call using the [Jobs API](concepts-apis-sdks.md#bulk-import-with-the-jobs-api). Twins and relationships created with this API can optionally include initialization of their properties. For detailed instructions and examples that use this API, see [bulk import instructions for twins](how-to-manage-twin.md#create-twins-in-bulk-with-the-jobs-api) and [relationships](how-to-manage-graph.md#create-relationships-in-bulk-with-the-jobs-api).

## JSON representations of graph elements

Digital twin data and relationship data are both stored in JSON format, which means that when you [query the twin graph](how-to-query-graph.md) in your Azure Digital Twins instance, the result will be a JSON representation of digital twins and relationships you've created.

### Digital twin JSON format

When represented as a JSON object, a digital twin will display the following fields:

| Field name | Description |
| --- | --- |
| `$dtId` | A user-provided string representing the ID of the digital twin |
| `$etag` | Standard HTTP field assigned by the web server |
| `$metadata.$model` | The ID of the model interface that characterizes this digital twin |
| `$metadata.<property-name>` | Other metadata information about properties of the digital twin |
| `$metadata.<property-name>.lastUpdateTime` | The date/time the property update message was processed by Azure Digital Twins |
| `$metadata.<property-name>.sourceTime` | An optional, writable property representing the timestamp when the property update was observed in the real world. This property can only be written using the **2022-05-31** version of the [Azure Digital Twins APIs/SDKs](concepts-apis-sdks.md) and the value must comply to ISO 8601 date and time format. For more information about how to update this property, see [Update a property's sourceTime](how-to-manage-twin.md#update-a-propertys-sourcetime). |
| `<property-name>` | The value of a property in JSON (`string`, number type, or object) |
| `$relationships` | The URL of the path to the relationships collection. This field is absent if the digital twin has no outgoing relationship edges. |
| `<component-name>` | A JSON object containing the component's property values and metadata, similar to those of the root object. This object exists even if the component has no properties. |
| `<component-name>.$metadata` | The metadata information for the component, similar to the root-level `$metadata` |
| `<component-name>.<property-name>` | The value of the component's property in JSON (`string`, number type, or object) |

Here's an example of a digital twin formatted as a JSON object. This twin has two properties, Humidity and Temperature, and a component called Thermostat.

```json
{
    "$dtId": "myRoomID",
    "$etag": "W/\"8e6d3e89-1166-4a1d-9a99-8accd8fef43f\"",
    "$metadata": {
        "$model": "dtmi:example:Room23;1",
        "Humidity": {
          "lastUpdateTime": "2021-11-30T18:47:53.7648958Z"
        },
        "Temperature": {
          "lastUpdateTime": "2021-11-30T18:47:53.7648958Z"
        }
    },
    "Humidity": 55,
    "Temperature": 35,
    "Thermostat": {
        "$metadata": {}
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
| `<property-name>` | [Optional] The value of a property of this relationship, in JSON (`string`, number type, or object) |

Here's an example of a relationship formatted as a JSON object:

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
* [Manage digital twins](how-to-manage-twin.md)
* [Manage the twin graph and relationships](how-to-manage-graph.md)

Or, learn about querying the Azure Digital Twins twin graph for information:
* [Query language](concepts-query-language.md)