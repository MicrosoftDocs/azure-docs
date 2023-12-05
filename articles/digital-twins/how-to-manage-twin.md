---
# Mandatory fields.
title: Manage digital twins
titleSuffix: Azure Digital Twins
description: See how to retrieve, update, and delete individual twins and relationships.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 10/3/2023
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Manage digital twins

Entities in your environment are represented by [digital twins](concepts-twins-graph.md). Managing your digital twins might include creation, modification, and removal.

This article focuses on managing digital twins; to work with relationships and the [twin graph](concepts-twins-graph.md) as a whole, see [Manage the twin graph and relationships](how-to-manage-graph.md).

> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

## Prerequisites

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

[!INCLUDE [digital-twins-developer-interfaces.md](../../includes/digital-twins-developer-interfaces.md)]

[!INCLUDE [visualizing with Azure Digital Twins explorer](../../includes/digital-twins-visualization.md)]

:::image type="content" source="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-demo.png" alt-text="Screenshot of Azure Digital Twins Explorer showing sample models and twins." lightbox="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-demo.png":::

## Create a digital twin

To create a twin, you use the `CreateOrReplaceDigitalTwinAsync()` method on the service client like this:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs" id="CreateTwinCall":::

To create a digital twin, you need to provide:
* An ID value you want to assign to the digital twin (you're defining that ID when the twin is created)
* The [model](concepts-models.md) you want to use
* Any desired initialization of twin data, including...
    - Properties (initialization optional): You can set initial values for properties of the digital twin if you want. Properties are treated as optional and can be set later, but note that **they won't show up as part of a twin until they've been set**.
    - Telemetry (initialization recommended): You can also set initial values for telemetry fields on the twin. Although initializing telemetry isn't required, telemetry fields don't show up as part of a twin until they've been set. This means that you can't edit telemetry values for a twin unless they've been initialized first.
    - Components (initialization required if they're present on a twin): If your twin contains any [components](concepts-models.md#model-attributes), these must be initialized when the twin is created. They can be empty objects, but the components themselves have to exist.
    
The model and any initial property values are provided through the `initData` parameter, which is a JSON string containing the relevant data. For more information on structuring this object, continue to the next section.

> [!TIP]
> After creating or updating a twin, there may be a latency of up to 10 seconds before the changes will be reflected in [queries](how-to-query-graph.md). The `GetDigitalTwin` API (described [later in this article](#get-data-for-a-digital-twin)) does not experience this delay, so if you need an instant response, use the API call instead of querying to see your newly-created twins. 

### Initialize model and properties

You can initialize the properties of a twin at the time that the twin is created. 

The twin creation API accepts an object that is serialized into a valid JSON description of the twin properties. See [Digital twins and the twin graph](concepts-twins-graph.md) for a description of the JSON format for a twin. 

First, you can create a data object to represent the twin and its property data. You can create a parameter object either manually, or by using a provided helper class. Here's an example of each.

#### Create twins using manually created data

Without the use of any custom helper classes, you can represent a twin's properties in a `Dictionary<string, object>`, where the `string` is the name of the property and the `object` is an object representing the property and its value.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_other.cs" id="CreateTwin_noHelper":::

#### Create twins with the helper class

The helper class of `BasicDigitalTwin` allows you to store property fields in a "twin" object directly. You might still want to build the list of properties using a `Dictionary<string, object>`, which can then be added to the twin object as its `CustomProperties` directly.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs" id="CreateTwin_withHelper":::

>[!NOTE]
> `BasicDigitalTwin` objects come with an `Id` field. You can leave this field empty, but if you do add an ID value, it needs to match the ID parameter passed to the `CreateOrReplaceDigitalTwinAsync()` call. For example:
>
>```csharp
>twin.Id = "myRoomId";
>```

### Create twins in bulk with the Import Jobs API

You can use the [Import Jobs API](concepts-apis-sdks.md#bulk-import-with-the-import-jobs-api) to create many twins at once in a single API call. This method requires the use of [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md), and [write permissions](concepts-apis-sdks.md#check-permissions) in your Azure Digital Twins instance for twins and bulk jobs.

>[!TIP]
>The Import Jobs API also allows models and relationships to be imported in the same call, to create all parts of a graph at once. For more about this process, see [Upload models, twins, and relationships in bulk with the Import Jobs API](how-to-manage-graph.md#upload-models-twins-and-relationships-in-bulk-with-the-import-jobs-api).

To import twins in bulk, you need to structure your twins (and any other resources included in the bulk import job) as an *NDJSON* file. The `Twins` section comes after the `Models` section (and before the `Relationships` section). Twins defined in the file can reference models that are either defined in this file or already present in the instance, and they can optionally include initialization of the twin's properties.

You can view an example import file and a sample project for creating these files in the [Import Jobs API introduction](concepts-apis-sdks.md#bulk-import-with-the-import-jobs-api).

[!INCLUDE [digital-twins-bulk-blob.md](../../includes/digital-twins-bulk-blob.md)]

Then, the file can be used in an [Import Jobs API](/rest/api/digital-twins/dataplane/jobs) call. You provide the blob storage URL of the input file, and a new blob storage URL to indicate where you'd like the output log to be stored after the service creates it.

## Get data for a digital twin

You can access the details of any digital twin by calling the `GetDigitalTwin()` method like this:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs" id="GetTwinCall":::

This call returns twin data as a strongly-typed object type such as `BasicDigitalTwin`. `BasicDigitalTwin` is a serialization helper class included with the SDK, which returns the core twin metadata and properties in preparsed form. You can always deserialize twin data using the JSON library of your choice, like `System.Text.Json` or `Newtonsoft.Json`. For basic access to a twin, however, the helper classes can make this more convenient.

> [!NOTE]
> `BasicDigitalTwin` uses `System.Text.Json` attributes. In order to use `BasicDigitalTwin` with your [DigitalTwinsClient](/dotnet/api/azure.digitaltwins.core.digitaltwinsclient?view=azure-dotnet&preserve-view=true), you must either initialize the client with the default constructor, or, if you want to customize the serializer option, use the [JsonObjectSerializer](/dotnet/api/azure.core.serialization.jsonobjectserializer?view=azure-dotnet&preserve-view=true).

The `BasicDigitalTwin` helper class also gives you access to properties defined on the twin, through a `Dictionary<string, object>`. To list properties of the twin, you can use:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs" id="GetTwin" highlight="2":::

Only properties that have been set at least once are returned when you retrieve a twin with the `GetDigitalTwin()` method.

>[!TIP]
>The `displayName` for a twin is part of its model metadata, so it will not show when getting data for the twin instance. To see this value, you can [retrieve it from the model](how-to-manage-model.md#retrieve-models).

To retrieve multiple twins using a single API call, see the Query API examples in [Query the twin graph](how-to-query-graph.md).

Consider the following model (written in [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md)) that defines a Moon:

:::code language="json" source="~/digital-twins-docs-samples/models/Moon.json":::

The result of calling `object result = await client.GetDigitalTwinAsync("my-moon");` on a Moon-type twin might look like this:

```json
{
  "$dtId": "myMoon-001",
  "$etag": "W/\"e59ce8f5-03c0-4356-aea9-249ecbdc07f9\"",
  "radius": 1737.1,
  "mass": 0.0734,
  "$metadata": {
    "$model": "dtmi:example:Moon;1",
    "radius": {
      "lastUpdateTime": "2022-12-06T20:00:32.8209188Z"
    },
    "mass": {
      "lastUpdateTime": "2022-12-04T12:04:43.3859361Z"
    }
  }
}
```

The defined properties of the digital twin are returned as top-level properties on the digital twin. Metadata or system information that isn't part of the DTDL definition is returned with a `$` prefix. Metadata properties include the following values:
* `$dtId`: The ID of the digital twin in this Azure Digital Twins instance
* `$etag`: A standard HTTP field assigned by the web server. This is updated to a new value every time the twin is updated, which can be useful to determine whether the twin's data has been updated on the server since a previous check. You can use `If-Match` to perform updates and deletes that only complete if the entity's etag matches the etag provided. For more information on these operations, see the documentation for [DigitalTwins Update](/rest/api/digital-twins/dataplane/twins/digitaltwins_update) and [DigitalTwins Delete](/rest/api/digital-twins/dataplane/twins/digitaltwins_delete).
* `$metadata`: A set of metadata properties, which might include the following:
  - `$model`, the DTMI of the model of the digital twin.
  - `lastUpdateTime` for twin properties. This is a timestamp indicating the date and time that Azure Digital Twins processed the property update message
  - `sourceTime` for twin properties. This is an optional, writable property representing the timestamp when the property update was observed in the real world.

You can read more about the fields contained in a digital twin in [Digital twin JSON format](concepts-twins-graph.md#digital-twin-json-format). You can read more about the serialization helper classes like `BasicDigitalTwin` in [Azure Digital Twins APIs and SDKs](concepts-apis-sdks.md#serialization-helpers-in-the-net-c-sdk).

## View all digital twins

To view all of the digital twins in your instance, use a [query](how-to-query-graph.md). You can run a query with the [Query APIs](/rest/api/digital-twins/dataplane/query) or the [CLI commands](/cli/azure/dt/twin#az-dt-twin-query).

Here's the body of the basic query that returns a list of all digital twins in the instance:

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="GetAllTwins":::

## Update a digital twin

To update properties of a digital twin, write the information you want to replace in [JSON Patch](http://jsonpatch.com/) format. For a full list of JSON Patch operations that can be used, including `replace`, `add` and `remove`, see the [Operations for JSON Patch](http://jsonpatch.com/#operations).

After crafting the JSON Patch document containing update information, pass the document into the `UpdateDigitalTwin()` method:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs" id="UpdateTwinCall":::

A single patch call can update as many properties on a single twin as you want (even all of them). If you need to update properties across multiple twins, you need a separate update call for each twin.

> [!TIP]
> After creating or updating a twin, there may be a latency of up to 10 seconds before the changes will be reflected in [queries](how-to-query-graph.md). The `GetDigitalTwin` API (described [earlier in this article](#get-data-for-a-digital-twin)) does not experience this delay, so use the API call instead of querying to see your newly-updated twins if you need an instant response. 

Here's an example of JSON Patch code. This document replaces the *mass* and *radius* property values of the digital twin it's applied to. This example shows the JSON Patch `replace` operation, which replaces the value of an existing property.

:::code language="json" source="~/digital-twins-docs-samples/models/patch.json":::

When updating a twin from a code project using the .NET SDK, you can create JSON patches using the Azure .NET SDK's [JsonPatchDocument](/dotnet/api/azure.jsonpatchdocument?view=azure-dotnet&preserve-view=true). Here's an example of creating a JSON Patch document and using `UpdateDigitalTwin()` in project code.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_other.cs" id="UpdateTwin":::

> [!TIP]
> You can maintain source timestamps on your digital twins by updating the `$metadata.<property-name>.sourceTime` field with the process described in this section. For more information on this field and other fields that are writable on digital twins, see [Digital twin JSON format](concepts-twins-graph.md#digital-twin-json-format).

### Update sub-properties in digital twin components

Recall that a model might contain components, allowing it to be made up of other models. 

To patch properties in a digital twin's components, you can use path syntax in JSON Patch:

:::code language="json" source="~/digital-twins-docs-samples/models/patch-component.json":::

### Update sub-properties in object-type properties

Models might contain properties that are of an object type. Those objects might have their own properties, and you might want to update one of those sub-properties belonging to the object-type property. This process is similar to the process for [updating sub-properties in components](#update-sub-properties-in-digital-twin-components), but might require some extra steps. 

Consider a model with an object-type property, `ObjectProperty`. `ObjectProperty` has a string property named `StringSubProperty`.

When a twin is created using this model, it's not necessary to instantiate the `ObjectProperty` at that time. If the object property isn't instantiated during twin creation, there's no default path created to access `ObjectProperty` and its `StringSubProperty` for a patch operation. You need to add the path to `ObjectProperty` yourself before you can update its properties.

This can be done with a JSON Patch `add` operation, like this:

:::code language="json" source="~/digital-twins-docs-samples/models/patch-object-sub-property-1.json":::

>[!NOTE]
> If `ObjectProperty` has more than one property, you should include all of them in the `value` field of this operation, even if you're only updating one:
> ```json
>... "value": {"StringSubProperty":"<string-value>", "Property2":"<property2-value>", ...}
>```


After this has been done once, a path to `StringSubProperty` exists, and it can be updated directly from now on with a typical `replace` operation:

:::code language="json" source="~/digital-twins-docs-samples/models/patch-object-sub-property-2.json":::

Although the first step isn't necessary in cases where `ObjectProperty` was instantiated when the twin was created, it's recommended to use it every time you update a sub-property for the first time, since you might not always know with certainty whether the object property was initially instantiated or not.

### Update a digital twin's model

The `UpdateDigitalTwin()` function can also be used to migrate a digital twin to a different model. 

For example, consider the following JSON Patch document that replaces the digital twin's metadata `$model` field:

:::code language="json" source="~/digital-twins-docs-samples/models/patch-model-1.json":::

This operation only succeeds if the digital twin being modified by the patch conforms with the new model. 

Consider the following example:
1. Imagine a digital twin with a model of foo_old. foo_old defines a required property *mass*.
2. The new model foo_new defines a property mass, and adds a new required property *temperature*.
3. After the patch, the digital twin must have both a mass and temperature property. 

The patch for this situation needs to update both the model and the twin's temperature property, like this:

:::code language="json" source="~/digital-twins-docs-samples/models/patch-model-2.json":::

### Update a property's sourceTime

You might optionally decide to use the `sourceTime` field on twin properties to record timestamps for when property updates are observed in the real world. Azure Digital Twins natively supports `sourceTime` in the metadata for each twin property. The `sourceTime` value must comply with ISO 8601 date and time format. For more information about this field and other fields on digital twins, see [Digital twin JSON format](concepts-twins-graph.md#digital-twin-json-format).

The minimum stable REST API version to support this field is the [2022-05-31](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/data-plane/Microsoft.DigitalTwins/stable/2022-05-31) version. To work with this field using the [Azure Digital Twins SDKs](concepts-apis-sdks.md), we recommend using the latest version of the SDK to make sure this field is included.

Here's an example of a JSON Patch document that updates both the value and the `sourceTime` field of a `Temperature` property:

:::code language="json" source="~/digital-twins-docs-samples/models/patch-sourcetime.json":::

To update the `sourceTime` field on a property that's part of a component, include the component at the start of the path. In the example above, you would do this by changing the path value from `/$metadata/Temperature/sourceTime` to `myComponent/$metadata/Temperature/sourceTime`.

>[!NOTE]
> If you update both the `sourceTime` and value on a property, and then later update only the property's value, the `sourceTime` timestamp from the first update will remain.


### Handle conflicting update calls

Azure Digital Twins ensures that all incoming requests are processed one after the other. This means that even if multiple functions try to update the same property on a twin at the same time, there's **no need** for you to write explicit locking code to handle the conflict.

This behavior is on a per-twin basis. 

As an example, imagine a scenario in which these three calls arrive at the same time: 
*	Write property A on *Twin1*
*	Write property B on *Twin1*
*	Write property A on *Twin2*

The two calls that modify *Twin1* are executed one after another, and change messages are generated for each change. The call to modify *Twin2* can be executed concurrently with no conflict, as soon as it arrives.

## Delete a digital twin

You can delete twins using the `DeleteDigitalTwin()` method. However, you can only delete a twin when it has no more relationships. So, delete the twin's incoming and outgoing relationships first.

Here's an example of the code to delete twins and their relationships. The `DeleteDigitalTwin` SDK call is highlighted to clarify where it falls in the wider example context.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs" id="DeleteTwin" highlight="7":::

### Delete all digital twins

For an example of how to delete all twins at once, download the sample app used in the [Explore the basics with a sample client app](tutorial-command-line-app.md). The *CommandLoop.cs* file does this in a `CommandDeleteAllTwins()` function.

[!INCLUDE [digital-twins-bulk-delete-note.md](../../includes/digital-twins-bulk-delete-note.md)]

## Runnable digital twin code sample

You can use the runnable code sample below to create a twin, update its details, and delete the twin. 

### Set up sample project files

The snippet uses a sample model definition, [Room.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-samples/main/AdtSampleApp/SampleClientApp/Models/Room.json). To **download the model file** so you can use it in your code, use this link to go directly to the file in GitHub. Then, right-click anywhere on the screen, select **Save as** in your browser's right-click menu, and use the Save As window to save the file as **Room.json**.

Next, create a **new console app project** in Visual Studio or your editor of choice.

Then, **copy the following code** of the runnable sample into your project:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs":::

[!INCLUDE [Azure Digital Twins: DefaultAzureCredential known issue note](../../includes/digital-twins-defaultazurecredential-note.md)]

### Configure project

Next, complete the following steps to configure your project code:
1. Add the **Room.json** file you downloaded earlier to your project, and replace the `<path-to>` placeholder in the code to tell your program where to find it.
2. Replace the placeholder `<your-instance-hostname>` with your Azure Digital Twins instance's host name.
3. Add two dependencies to your project that are needed to work with Azure Digital Twins. The first is the package for the [Azure Digital Twins SDK for .NET](/dotnet/api/overview/azure/digitaltwins.core-readme), and the second provides tools to help with authentication against Azure.

      ```cmd/sh
      dotnet add package Azure.DigitalTwins.Core
      dotnet add package Azure.Identity
      ```

You also need to set up local credentials if you want to run the sample directly. The next section walks through this.
[!INCLUDE [Azure Digital Twins: local credentials prereq (outer)](../../includes/digital-twins-local-credentials-outer.md)]

### Run the sample

Now that setup is complete, you can run the sample code project.

Here's the console output of the above program: 

:::image type="content" source="./media/how-to-manage-twin/console-output-manage-twins.png" alt-text="Screenshot of the console output showing that the twin is created, updated, and deleted." lightbox="./media/how-to-manage-twin/console-output-manage-twins.png":::

## Next steps

See how to create and manage relationships between your digital twins:
* [Manage the twin graph and relationships](how-to-manage-graph.md)