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

Entities in your environment are represented by [digital twins](concepts-twins-graph.md). Managing your digital twins may include creation, modification, and removal. To do these operations, you can use the [**DigitalTwins APIs**](/rest/api/digital-twins/dataplane/twins), the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet-preview&preserve-view=true), or the [Azure Digital Twins CLI](how-to-use-cli.md).

This article focuses on managing digital twins; to work with relationships and the [twin graph](concepts-twins-graph.md) as a whole, see [*How-to: Manage the twin graph with relationships*](how-to-manage-graph.md).

> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

## Prerequisites

* You'll need an **Azure account** (you can set one up for free [here](https://azure.microsoft.com/free/?WT.mc_id=A261C142F))
* You'll need an **Azure Digital Twins instance** in your Azure subscription. If you don't have an instance already, you can create one using the steps in [*How-to: Set up an instance and authentication*](how-to-set-up-instance-cli.md). Have the following values from setup handy to use later in this article:
    - Instance name
    - Resource group
    
## Create a digital twin

To create a twin, you use the `CreateDigitalTwin()` method on the service client like this:

```csharp
await client.CreateDigitalTwinAsync("myTwinId", initData);
```

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

First, you can create a data object to represent the twin and its property data. Then you can use `JsonSerializer` to pass a serialized version of this object into the API call for the `initdata` parameter, like this:

```csharp
await client.CreateDigitalTwinAsync(srcId, JsonSerializer.Serialize<BasicDigitalTwin>(twin));
```
You can create a parameter object either manually, or by using a provided helper class. Here is an example of each.

#### Create twins using manually created data

Without the use of any custom helper classes, you can represent a twin's properties in a `Dictionary<string, object>`, where the `string` is the name of the property and the `object` is an object representing the property and its value.

[!INCLUDE [Azure Digital Twins code: create twin](../../includes/digital-twins-code-create-twin.md)]

#### Create twins with the helper class

The helper class of `BasicDigitalTwin` allows you to store property fields in a "twin" object directly. You may still want to build the list of properties using a `Dictionary<string, object>`, which can then be added to the twin object as its `CustomProperties` directly.

```csharp
BasicDigitalTwin twin = new BasicDigitalTwin();
twin.Metadata = new DigitalTwinMetadata();
twin.Metadata.ModelId = "dtmi:example:Room;1";
// Initialize properties
Dictionary<string, object> props = new Dictionary<string, object>();
props.Add("Temperature", 25.0);
props.Add("Humidity", 50.0);
twin.CustomProperties = props;

client.CreateDigitalTwinAsync("myRoomId", JsonSerializer.Serialize<BasicDigitalTwin>(twin));
Console.WriteLine("The twin is created successfully");
```

>[!NOTE]
> `BasicDigitalTwin` objects come with an `Id` field. You can leave this field empty, but if you do add an ID value, it needs to match the ID parameter passed to the `CreateDigitalTwin()` call. For example:
>
>```csharp
>twin.Id = "myRoomId";
>```

## Get data for a digital twin

You can access the details of any digital twin by calling the `GetDigitalTwin()` method like this:

```csharp
object result = await client.GetDigitalTwin(id);
```
This call returns twin data as a JSON string. Here's an example of how to use this to view twin details:

```csharp
Response<string> res = client.GetDigitalTwin("myRoomId");
twin = JsonSerializer.Deserialize<BasicDigitalTwin>(res.Value);
Console.WriteLine($"Model id: {twin.Metadata.ModelId}");
foreach (string prop in twin.CustomProperties.Keys)
{
  if (twin.CustomProperties.TryGetValue(prop, out object value))
  Console.WriteLine($"Property '{prop}': {value}");
}
```
Only properties that have been set at least once are returned when you retrieve a twin with the `GetDigitalTwin()` method.

>[!TIP]
>The `displayName` for a twin is part of its model metadata, so it will not show when getting data for the twin instance. To see this value, you can [retrieve it from the model](how-to-manage-model.md#retrieve-models).

To retrieve multiple twins using a single API call, see the query API examples in [*How-to: Query the twin graph*](how-to-query-graph.md).

Consider the following model (written in [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/tree/master/DTDL)) that defines a *Moon*:

```json
{
    "@id": "dtmi:example:Moon;1",
    "@type": "Interface",
    "@context": "dtmi:dtdl:context;2",
    "contents": [
        {
            "@type": "Property",
            "name": "radius",
            "schema": "double",
            "writable": true
        },
        {
            "@type": "Property",
            "name": "mass",
            "schema": "double",
            "writable": true
        }
    ]
}
```
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

The defined properties of the digital twin are returned as top-level properties on the digital twin. Metadata or system information that is not part of the DTDL definition is returned with a `$` prefix. Metadata properties include:
* The ID of the digital twin in this Azure Digital Twins instance, as `$dtId`.
* `$etag`, a standard HTTP field assigned by the web server.
* Other properties in a `$metadata` section. These include:
    - The DTMI of the model of the digital twin.
    - Synchronization status for each writeable property. This is most useful for devices, where it's possible that the service and the device have diverging statuses (for example, when a device is offline). Currently, this property only applies to physical devices connected to IoT Hub. With the data in the metadata section, it is possible to understand the full status of a property, as well as the last modified timestamps. For more information about sync status, see [this IoT Hub tutorial](../iot-hub/tutorial-device-twins.md) on synchronizing device state.
    - Service-specific metadata, like from IoT Hub or Azure Digital Twins. 

You can parse the returned JSON for the twin using a JSON parsing library of your choice, such as `System.Text.Json`.

You can also use the serialization helper class `BasicDigitalTwin` that is included with the SDK, which will return the core twin metadata and properties in pre-parsed form. Here is an example:

```csharp
Response<string> res = client.GetDigitalTwin(twin_Id);
BasicDigitalTwin twin = JsonSerializer.Deserialize<BasicDigitalTwin>(res.Value);
Console.WriteLine($"Model id: {twin.Metadata.ModelId}");
foreach (string prop in twin.CustomProperties.Keys)
{
    if (twin.CustomProperties.TryGetValue(prop, out object value))
        Console.WriteLine($"Property '{prop}': {value}");
}
```

You can read more about the serialization helper classes in [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md).

## Update a digital twin

To update properties of a digital twin, you write the information you want to replace in [JSON Patch](http://jsonpatch.com/) format. In this way, you can replace multiple properties at once. You then pass the JSON Patch document into an `UpdateDigitalTwin()` method:

```csharp
await client.UpdateDigitalTwin(id, patch);
```

A patch call can update as many properties on a single twin as you'd like (even all of them). If you need to update properties across multiple twins, you'll need a separate update call for each twin.

> [!TIP]
> After creating or updating a twin, there may be a latency of up to 10 seconds before the changes will be reflected in [queries](how-to-query-graph.md). The `GetDigitalTwin` API (described [earlier in this article](#get-data-for-a-digital-twin)) does not experience this delay, so use the API call instead of querying to see your newly-updated twins if you need an instant response. 

Here is an example of JSON Patch code. This document replaces the *mass* and *radius* property values of the digital twin it is applied to.

```json
[
  {
    "op": "replace",
    "path": "/mass",
    "value": 0.0799
  },
  {
    "op": "replace",
    "path": "/radius",
    "value": 0.800
  }
]
```
You can create patches manually, or by using a serialization helper class in the [SDK](how-to-use-apis-sdks.md). Here is an example of each.

#### Create patches manually

```csharp
List<object> twinData = new List<object>();
twinData.Add(new Dictionary<string, object>() {
    { "op", "add"},
    { "path", "/Temperature"},
    { "value", 25.0}
});

await client.UpdateDigitalTwinAsync(twin_Id, JsonSerializer.Serialize(twinData));
Console.WriteLine("Updated twin properties");
FetchAndPrintTwin(twin_Id, client);
}
```

#### Create patches using the helper class

```csharp
UpdateOperationsUtility uou = new UpdateOperationsUtility();
uou.AppendAddOp("/Temperature", 25.0);
await client.UpdateDigitalTwinAsync(twin_Id, uou.Serialize());
```

### Update properties in digital twin components

Recall that a model may contain components, allowing it to be made up of other models. 

To patch properties in a digital twin's components, you can use path syntax in JSON Patch:

```json
[
  {
    "op": "replace",
    "path": "/mycomponentname/mass",
    "value": 0.0799
  }
]
```

### Update a digital twin's model

The `UpdateDigitalTwin()` function can also be used to migrate a digital twin to a different model. 

For example, consider the following JSON Patch document that replaces the digital twin's metadata `$model` field:

```json
[
  {
    "op": "replace",
    "path": "/$metadata/$model",
    "value": "dtmi:example:foo;1"
  }
]
```

This operation will only succeed if the digital twin being modified by the patch conforms with the new model. 

Consider the following example:
1. Imagine a digital twin with a model of *foo_old*. *foo_old* defines a required property *mass*.
2. The new model *foo_new* defines a property mass, and adds a new required property *temperature*.
3. After the patch, the digital twin must have both a mass and temperature property. 

The patch for this situation needs to update both the model and the twin's temperature property, like this:

```json
[
  {
    "op": "replace",
    "path": "$metadata.$model",
    "value": "dtmi:example:foo_new"
  },
  {
    "op": "add",
    "path": "temperature",
    "value": 60
  }
]
```

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

Here is an example of the code to delete twins and their relationships:

```csharp
static async Task DeleteTwin(string id)
{
    await FindAndDeleteOutgoingRelationshipsAsync(id);
    await FindAndDeleteIncomingRelationshipsAsync(id);
    try
    {
        await client.DeleteDigitalTwin(id);
    } catch (RequestFailedException exc)
    {
        Console.WriteLine($"*** Error:{exc.Error}/{exc.Message}");
    }
}

public async Task FindAndDeleteOutgoingRelationshipsAsync(string dtId)
{
    // Find the relationships for the twin

    try
    {
        // GetRelationshipsAsync will throw an error if a problem occurs
        AsyncPageable<string> relsJson = client.GetRelationshipsAsync(dtId);

        await foreach (string relJson in relsJson)
        {
            var rel = System.Text.Json.JsonSerializer.Deserialize<BasicRelationship>(relJson);
            await client.DeleteRelationshipAsync(dtId, rel.Id).ConfigureAwait(false);
            Log.Ok($"Deleted relationship {rel.Id} from {dtId}");
        }
    }
    catch (RequestFailedException ex)
    {
        Log.Error($"*** Error {ex.Status}/{ex.ErrorCode} retrieving or deleting relationships for {dtId} due to {ex.Message}");
    }
}

async Task FindAndDeleteIncomingRelationshipsAsync(string dtId)
{
    // Find the relationships for the twin

    try
    {
        // GetRelationshipsAsync will throw an error if a problem occurs
        AsyncPageable<IncomingRelationship> incomingRels = client.GetIncomingRelationshipsAsync(dtId);

        await foreach (IncomingRelationship incomingRel in incomingRels)
        {
            await client.DeleteRelationshipAsync(incomingRel.SourceId, incomingRel.RelationshipId).ConfigureAwait(false);
            Log.Ok($"Deleted incoming relationship {incomingRel.RelationshipId} from {dtId}");
        }
    }
    catch (RequestFailedException ex)
    {
        Log.Error($"*** Error {ex.Status}/{ex.ErrorCode} retrieving or deleting incoming relationships for {dtId} due to {ex.Message}");
    }
}
```
### Delete all digital twins

For an example of how to delete all twins at once, download the sample app used in the [*Tutorial: Explore the basics with a sample client app*](tutorial-command-line-app.md). The *CommandLoop.cs* file does this in a `CommandDeleteAllTwins()` function.

## Manage twins using runnable code sample

You can use the runnable code sample below to create a twin, update its details, and delete the twin. 

### Set up the runnable sample

The snippet uses the [Room.json](https://github.com/Azure-Samples/digital-twins-samples/blob/master/AdtSampleApp/SampleClientApp/Models/Room.json) model definition from [*Tutorial: Explore Azure Digital Twins with a sample client app*](tutorial-command-line-app.md). You can use this link to go directly to the file, or download it as part of the full end-to-end sample project [here](/samples/azure-samples/digital-twins-samples/digital-twins-samples/).

Before you run the sample, do the following:
1. Download the model file, place it in your project, and replace the `<path-to>` placeholder in the code below to tell your program where to find it.
2. Replace the placeholder `<your-instance-hostname>` with your Azure Digital Twins instance's hostname.
3. Add these packages to your project:
    ```cmd/sh
    dotnet add package Azure.DigitalTwins.Core --version 1.0.0-preview.3
    dotnet add package Azure.identity
    ```

You'll also need to set up local credentials if you want to run the sample directly. The next section walks through this.
[!INCLUDE [Azure Digital Twins: local credentials prereq (outer)](../../includes/digital-twins-local-credentials-outer.md)]

### Run the sample

After completing the above steps, you can directly run the following sample code.

```csharp
using System;
using Azure.DigitalTwins.Core;
using Azure.Identity;
using System.Threading.Tasks;
using System.IO;
using System.Collections.Generic;
using Azure;
using Azure.DigitalTwins.Core.Serialization;
using System.Text.Json;

namespace minimal
{
    class Program
    {

        public static async Task Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            //Create the Azure Digital Twins client for API calls
            string adtInstanceUrl = "https://<your-instance-hostname>";
            var credentials = new DefaultAzureCredential();
            DigitalTwinsClient client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credentials);
            Console.WriteLine($"Service client created – ready to go");
            Console.WriteLine();

            //Upload models
            Console.WriteLine($"Upload a model");
            Console.WriteLine();
            string dtdl = File.ReadAllText("<path-to>/Room.json");
            var typeList = new List<string>();
            typeList.Add(dtdl);
            // Upload the model to the service
            await client.CreateModelsAsync(typeList);

            //Create new digital twin
            BasicDigitalTwin twin = new BasicDigitalTwin();
            string twin_Id = "myRoomId";
            twin.Metadata = new DigitalTwinMetadata();
            twin.Metadata.ModelId = "dtmi:example:Room;1";
            // Initialize properties
            Dictionary<string, object> props = new Dictionary<string, object>();
            props.Add("Temperature", 35.0);
            props.Add("Humidity", 55.0);
            twin.CustomProperties = props;
            await client.CreateDigitalTwinAsync(twin_Id, JsonSerializer.Serialize<BasicDigitalTwin>(twin));
            Console.WriteLine("Twin created successfully");
            Console.WriteLine();

            //Print twin
            Console.WriteLine("--- Printing twin details:");
            twin = FetchAndPrintTwin(twin_Id, client);
            Console.WriteLine("--------");
            Console.WriteLine();

            //Update twin data
            List<object> twinData = new List<object>();
            twinData.Add(new Dictionary<string, object>() 
            {
                { "op", "add"},
                { "path", "/Temperature"},
                { "value", 25.0}
            });
            await client.UpdateDigitalTwinAsync(twin_Id, JsonSerializer.Serialize(twinData));
            Console.WriteLine("Twin properties updated");
            Console.WriteLine();

            //Print twin again
            Console.WriteLine("--- Printing twin details (after update):");
            FetchAndPrintTwin(twin_Id, client);
            Console.WriteLine("--------");
            Console.WriteLine();

            //Delete twin
            await DeleteTwin(client, twin_Id);
        }

        private static BasicDigitalTwin FetchAndPrintTwin(string twin_Id, DigitalTwinsClient client)
        {
            BasicDigitalTwin twin;
            Response<string> res = client.GetDigitalTwin(twin_Id);
            twin = JsonSerializer.Deserialize<BasicDigitalTwin>(res.Value);
            Console.WriteLine($"Model id: {twin.Metadata.ModelId}");
            foreach (string prop in twin.CustomProperties.Keys)
            {
                if (twin.CustomProperties.TryGetValue(prop, out object value))
                    Console.WriteLine($"Property '{prop}': {value}");
            }

            return twin;
        }
        private static async Task DeleteTwin(DigitalTwinsClient client, string id)
        {
            await FindAndDeleteOutgoingRelationshipsAsync(client, id);
            await FindAndDeleteIncomingRelationshipsAsync(client, id);
            try
            {
                await client.DeleteDigitalTwinAsync(id);
                Console.WriteLine("Twin deleted successfully");
            }
            catch (RequestFailedException exc)
            {
                Console.WriteLine($"*** Error:{exc.Message}");
            }
        }

        private static async Task FindAndDeleteOutgoingRelationshipsAsync(DigitalTwinsClient client, string dtId)
        {
            // Find the relationships for the twin

            try
            {
                // GetRelationshipsAsync will throw an error if a problem occurs
                AsyncPageable<string> relsJson = client.GetRelationshipsAsync(dtId);

                await foreach (string relJson in relsJson)
                {
                    var rel = System.Text.Json.JsonSerializer.Deserialize<BasicRelationship>(relJson);
                    await client.DeleteRelationshipAsync(dtId, rel.Id).ConfigureAwait(false);
                    Console.WriteLine($"Deleted relationship {rel.Id} from {dtId}");
                }
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"*** Error {ex.Status}/{ex.ErrorCode} retrieving or deleting relationships for {dtId} due to {ex.Message}");
            }
        }

       private static async Task FindAndDeleteIncomingRelationshipsAsync(DigitalTwinsClient client, string dtId)
        {
            // Find the relationships for the twin

            try
            {
                // GetRelationshipsAsync will throw an error if a problem occurs
                AsyncPageable<IncomingRelationship> incomingRels = client.GetIncomingRelationshipsAsync(dtId);

                await foreach (IncomingRelationship incomingRel in incomingRels)
                {
                    await client.DeleteRelationshipAsync(incomingRel.SourceId, incomingRel.RelationshipId).ConfigureAwait(false);
                    Console.WriteLine($"Deleted incoming relationship {incomingRel.RelationshipId} from {dtId}");
                }
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"*** Error {ex.Status}/{ex.ErrorCode} retrieving or deleting incoming relationships for {dtId} due to {ex.Message}");
            }
        }

    }
}

```
Here is the console output of the above program: 

:::image type="content" source="./media/how-to-manage-twin/console-output-manage-twins.png" alt-text="Console output showing that the twin is created, updated, and deleted" lightbox="./media/how-to-manage-twin/console-output-manage-twins.png":::

## Manage twins with CLI

Twins can also be managed using the Azure Digital Twins CLI. The commands can be found in [*How-to: Use the Azure Digital Twins CLI*](how-to-use-cli.md).

## View all digital twins

To view all of the digital twins in your instance, use a [query](how-to-query-graph.md). You can run a query with the [Query APIs](/rest/api/digital-twins/dataplane/query) or the [CLI commands](how-to-use-cli.md).

Here is the body of the basic query that will return a list of all digital twins in the instance:

```sql
SELECT *
FROM DIGITALTWINS
``` 

## Next steps

See how to create and manage relationships between your digital twins:
* [*How-to: Manage the twin graph with relationships*](how-to-manage-graph.md)