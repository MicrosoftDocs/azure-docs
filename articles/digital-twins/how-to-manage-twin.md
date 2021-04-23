---
# Mandatory fields.
title: Manage digital twins
titleSuffix: Azure Digital Twins
description: See how to retrieve, update, and delete individual twins and relationships.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 10/21/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Manage digital twins

Entities in your environment are represented by [digital twins](concepts-twins-graph.md). Managing your digital twins may include creation, modification, and removal. To do these operations, you can use the [**DigitalTwins APIs**](/rest/api/digital-twins/dataplane/twins), the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins/client), or the [Azure Digital Twins CLI](how-to-use-cli.md).

This article focuses on managing digital twins; to work with relationships and the [twin graph](concepts-twins-graph.md) as a whole, see [*How-to: Manage the twin graph with relationships*](how-to-manage-graph.md).

> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

## Prerequisites

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

## Ways to manage twins

[!INCLUDE [digital-twins-ways-to-manage.md](../../includes/digital-twins-ways-to-manage.md)]

## Create a digital twin

To create a twin, you use the `CreateOrReplaceDigitalTwinAsync()` method on the service client like this:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs" id="CreateTwinCall":::

To create a digital twin, you need to provide:
* The desired ID for the digital twin
* The [model](concepts-models.md) you want to use

Optionally, you can provide initial values for all properties of the digital twin. Properties are treated as optional and can be set later, but **they won't show up as part of a twin until they've been set.**

>[!NOTE]
>While twin properties don't have to be initialized, any [components](concepts-models.md#elements-of-a-model) on the twin **do** need to be set when the twin is created. They can be empty objects, but the components themselves must exist.

The model and any initial property values are provided through the `initData` parameter, which is a JSON string containing the relevant data. For more information on structuring this object, continue to the next section.

> [!TIP]
> After creating or updating a twin, there may be a latency of up to 10 seconds before the changes will be reflected in [queries](how-to-query-graph.md). The `GetDigitalTwin` API (described [later in this article](#get-data-for-a-digital-twin)) does not experience this delay, so if you need an instant response, use the API call instead of querying to see your newly-created twins. 

### Initialize model and properties

You can initialize the properties of a twin at the time that the twin is created. 

The twin creation API accepts an object that is serialized into a valid JSON description of the twin properties. See [*Concepts: Digital twins and the twin graph*](concepts-twins-graph.md) for a description of the JSON format for a twin. 

First, you can create a data object to represent the twin and its property data. You can create a parameter object either manually, or by using a provided helper class. Here is an example of each.

#### Create twins using manually created data

Without the use of any custom helper classes, you can represent a twin's properties in a `Dictionary<string, object>`, where the `string` is the name of the property and the `object` is an object representing the property and its value.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_other.cs" id="CreateTwin_noHelper":::

#### Create twins with the helper class

The helper class of `BasicDigitalTwin` allows you to store property fields in a "twin" object directly. You may still want to build the list of properties using a `Dictionary<string, object>`, which can then be added to the twin object as its `CustomProperties` directly.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs" id="CreateTwin_withHelper":::

>[!NOTE]
> `BasicDigitalTwin` objects come with an `Id` field. You can leave this field empty, but if you do add an ID value, it needs to match the ID parameter passed to the `CreateOrReplaceDigitalTwinAsync()` call. For example:
>
>```csharp
>twin.Id = "myRoomId";
>```

## Get data for a digital twin

You can access the details of any digital twin by calling the `GetDigitalTwin()` method like this:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs" id="GetTwinCall":::

This call returns twin data as a strongly-typed object type such as `BasicDigitalTwin`. `BasicDigitalTwin` is a serialization helper class included with the SDK, which will return the core twin metadata and properties in pre-parsed form. Here's an example of how to use this to view twin details:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs" id="GetTwin" highlight="2":::

Only properties that have been set at least once are returned when you retrieve a twin with the `GetDigitalTwin()` method.

>[!TIP]
>The `displayName` for a twin is part of its model metadata, so it will not show when getting data for the twin instance. To see this value, you can [retrieve it from the model](how-to-manage-model.md#retrieve-models).

To retrieve multiple twins using a single API call, see the query API examples in [*How-to: Query the twin graph*](how-to-query-graph.md).

Consider the following model (written in [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/tree/master/DTDL)) that defines a *Moon*:

:::code language="json" source="~/digital-twins-docs-samples/models/Moon.json":::

The result of calling `object result = await client.GetDigitalTwinAsync("my-moon");` on a *Moon*-type twin might look like this:

```json
{
  "$dtId": "myMoon-001",
  "$etag": "W/\"e59ce8f5-03c0-4356-aea9-249ecbdc07f9\"",
  "radius": 1737.1,
  "mass": 0.0734,
  "$metadata": {
    "$model": "dtmi:example:Moon;1",
    "radius": {
      "desiredValue": 1737.1,
      "desiredVersion": 5,
      "ackVersion": 4,
      "ackCode": 200,
      "ackDescription": "OK"
    },
    "mass": {
      "desiredValue": 0.0734,
      "desiredVersion": 8,
      "ackVersion": 8,
      "ackCode": 200,
      "ackDescription": "OK"
    }
  }
}
```

The defined properties of the digital twin are returned as top-level properties on the digital twin. Metadata or system information that is not part of the DTDL definition is returned with a `$` prefix. Metadata properties include the following values:
* `$dtId`: The ID of the digital twin in this Azure Digital Twins instance
* `$etag`: A standard HTTP field assigned by the web server. This is updated to a new value every time the twin is updated, which can be useful to determine whether the twin's data has been updated on the server since a previous check. You can use `If-Match` to perform updates and deletes that only complete if the entity's etag matches the etag provided. For more information on these operations, see the documentation for [DigitalTwins Update](/rest/api/digital-twins/dataplane/twins/digitaltwins_update) and [DigitalTwins Delete](/rest/api/digital-twins/dataplane/twins/digitaltwins_delete).
* `$metadata`: A set of other properties, including:
  - The DTMI of the model of the digital twin.
  - Synchronization status for each writeable property. This is most useful for devices, where it's possible that the service and the device have diverging statuses (for example, when a device is offline). Currently, this property only applies to physical devices connected to IoT Hub. With the data in the metadata section, it is possible to understand the full status of a property, as well as the last modified timestamps. For more information about sync status, see [this IoT Hub tutorial](../iot-hub/tutorial-device-twins.md) on synchronizing device state.
  - Service-specific metadata, like from IoT Hub or Azure Digital Twins. 

You can read more about the serialization helper classes like `BasicDigitalTwin` in [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md).

## View all digital twins

To view all of the digital twins in your instance, use a [query](how-to-query-graph.md). You can run a query with the [Query APIs](/rest/api/digital-twins/dataplane/query) or the [CLI commands](how-to-use-cli.md).

Here is the body of the basic query that will return a list of all digital twins in the instance:

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="GetAllTwins":::

## Update a digital twin

To update properties of a digital twin, you write the information you want to replace in [JSON Patch](http://jsonpatch.com/) format. In this way, you can replace multiple properties at once. You then pass the JSON Patch document into an `UpdateDigitalTwin()` method:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs" id="UpdateTwinCall":::

A patch call can update as many properties on a single twin as you'd like (even all of them). If you need to update properties across multiple twins, you'll need a separate update call for each twin.

> [!TIP]
> After creating or updating a twin, there may be a latency of up to 10 seconds before the changes will be reflected in [queries](how-to-query-graph.md). The `GetDigitalTwin` API (described [earlier in this article](#get-data-for-a-digital-twin)) does not experience this delay, so use the API call instead of querying to see your newly-updated twins if you need an instant response. 

Here is an example of JSON Patch code. This document replaces the *mass* and *radius* property values of the digital twin it is applied to.

:::code language="json" source="~/digital-twins-docs-samples/models/patch.json":::

You can create patches using the Azure .NET SDK's [JsonPatchDocument](/dotnet/api/azure.jsonpatchdocument). Here is an example.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_other.cs" id="UpdateTwin":::

### Update properties in digital twin components

Recall that a model may contain components, allowing it to be made up of other models. 

To patch properties in a digital twin's components, you can use path syntax in JSON Patch:

:::code language="json" source="~/digital-twins-docs-samples/models/patch-component.json":::

### Update a digital twin's model

The `UpdateDigitalTwin()` function can also be used to migrate a digital twin to a different model. 

For example, consider the following JSON Patch document that replaces the digital twin's metadata `$model` field:

:::code language="json" source="~/digital-twins-docs-samples/models/patch-model-1.json":::

This operation will only succeed if the digital twin being modified by the patch conforms with the new model. 

Consider the following example:
1. Imagine a digital twin with a model of *foo_old*. *foo_old* defines a required property *mass*.
2. The new model *foo_new* defines a property mass, and adds a new required property *temperature*.
3. After the patch, the digital twin must have both a mass and temperature property. 

The patch for this situation needs to update both the model and the twin's temperature property, like this:

:::code language="json" source="~/digital-twins-docs-samples/models/patch-model-2.json":::

### Handle conflicting update calls

Azure Digital Twins ensures that all incoming requests are processed one after the other. This means that even if multiple functions try to update the same property on a twin at the same time, there's **no need** for you to write explicit locking code to handle the conflict.

This behavior is on a per-twin basis. 

As an example, imagine a scenario in which these three calls arrive at the same time: 
*	Write property A on *Twin1*
*	Write property B on *Twin1*
*	Write property A on *Twin2*

The two calls that modify *Twin1* are executed one after another, and change messages are generated for each change. The call to modify *Twin2* may be executed concurrently with no conflict, as soon as it arrives.

## Delete a digital twin

You can delete twins using the `DeleteDigitalTwin()` method. However, you can only delete a twin when it has no more relationships. So, delete the twin's incoming and outgoing relationships first.

Here is an example of the code to delete twins and their relationships. The `DeleteDigitalTwin` SDK call is highlighted to clarify where it falls in the wider example context.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs" id="DeleteTwin" highlight="7":::

### Delete all digital twins

For an example of how to delete all twins at once, download the sample app used in the [*Tutorial: Explore the basics with a sample client app*](tutorial-command-line-app.md). The *CommandLoop.cs* file does this in a `CommandDeleteAllTwins()` function.

## Runnable digital twin code sample

You can use the runnable code sample below to create a twin, update its details, and delete the twin. 

### Set up the runnable sample

The snippet uses the [Room.json](https://github.com/Azure-Samples/digital-twins-samples/blob/master/AdtSampleApp/SampleClientApp/Models/Room.json) model definition from [*Tutorial: Explore Azure Digital Twins with a sample client app*](tutorial-command-line-app.md). You can use this link to go directly to the file, or download it as part of the full end-to-end sample project [here](/samples/azure-samples/digital-twins-samples/digital-twins-samples/).

Before you run the sample, do the following:
1. Download the model file, place it in your project, and replace the `<path-to>` placeholder in the code below to tell your program where to find it.
2. Replace the placeholder `<your-instance-hostname>` with your Azure Digital Twins instance's hostname.
3. Add two dependencies to your project that will be needed to work with Azure Digital Twins. The first is the package for the [Azure Digital Twins SDK for .NET](/dotnet/api/overview/azure/digitaltwins/client), the second provides tools to help with authentication against Azure.

      ```cmd/sh
      dotnet add package Azure.DigitalTwins.Core
      dotnet add package Azure.Identity
      ```

You'll also need to set up local credentials if you want to run the sample directly. The next section walks through this.
[!INCLUDE [Azure Digital Twins: local credentials prereq (outer)](../../includes/digital-twins-local-credentials-outer.md)]

### Run the sample

After completing the above steps, you can directly run the following sample code.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/twin_operations_sample.cs":::

Here is the console output of the above program: 

:::image type="content" source="./media/how-to-manage-twin/console-output-manage-twins.png" alt-text="Console output showing that the twin is created, updated, and deleted" lightbox="./media/how-to-manage-twin/console-output-manage-twins.png":::

## Next steps

See how to create and manage relationships between your digital twins:
* [*How-to: Manage the twin graph with relationships*](how-to-manage-graph.md)