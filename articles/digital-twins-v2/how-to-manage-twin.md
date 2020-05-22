---
# Mandatory fields.
title: Manage a digital twin
titleSuffix: Azure Digital Twins
description: See how to retrieve, update, and delete individual twins and relationships.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/10/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Manage digital twins

Entities in your environment are represented by [digital twins](concepts-twins-graph.md). You can use the [**DigitalTwins APIs**](how-to-use-apis-sdks.md) to create, modify, and delete digital twins and their relationships in an Azure Digital Twins instance. This article focuses on managing digital twins; to work with relationships and the [twin graph](concepts-twins-graph.md) as a whole, see [How-to: Manage a twin graph with relationships](how-to-manage-graph.md).

The samples in this article use the C# SDK, which can be found here: [Azure IoT Digital Twin client library for .NET](https://github.com/Azure/azure-sdk-for-net-pr/tree/feature/IoT-ADT/sdk/digitaltwins/Azure.DigitalTwins.Core).

## Create a digital twin (preview)

To create a twin, you use the `CreateDigitalTwin` method on the service client like this:

```csharp
await client.CreateDigitalTwinAsync("myNewTwinID", initData);
```

> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

To create a digital twin, you need to provide:
* The desired ID for the digital twin
* The [model](concepts-models.md) you want to use 

Optionally, you can provide initial values for all properties of the digital twin. 

> [!TIP]
> Only properties that have been set at least once are returned when you retrieve a twin with GetDigitalTwin.  

The model and initial property values are provided through the `initData` parameter, which is a json string that contains the relevant data.

### Initialize properties

The twin creation API accepts an object that can be serialized into a valid JSON description of the twin properties. See [Concepts: Digital twins and the twin graph](concepts-twins-graph.md) for a description of the JSON format for a twin.

You can create a parameter object either manually or by using a provided helper class.

#### Creating Twins using the Helper Class
```csharp
BasicDigitalTwin twin = new BasicDigitalTwin();
twin.Metadata = new DigitalTwinMetadata();
twin.Metadata.ModelId = "dtmi:example:Room;1";
// Initialize properties
Dictionary<string, object> props = new Dictionary<string, object>();
props.Add("Temperature", 25.0);
props.Add("Humidity", 50.0);
twin.CustomProperties = props;

client.CreateDigitalTwin("myNewRoomId", JsonSerializer.Serialize<BasicDigitalTwin>(twin));
```

#### Creating Twins using manually created data

```csharp
// Define the model type for the twin to be created
Dictionary<string, object> meta = new Dictionary<string, object>()
{
    { "$model", "dtmi:com:contoso:Room;1" }
};
// Initialize the twin properties
Dictionary<string, object> twin = new Dictionary<string, object>()
{
    { "$metadata", meta },
    { "Temperature", temperature},
    { "Humidity", humidity},
};
client.CreateDigitalTwin("myNewRoomId", JsonSerializer.Serialize<Dictionary<string, object>>(twin));
```


## Get data for a digital twin

You can access the full data of any digital twin by calling:

```csharp
object result = await client.GetDigitalTwin(id);
```

> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

> [!TIP] To retrieve multiple twins using a single API call, see the [query API](./how-to-query-graph.md).

This call returns twin data as a JSON string. 

Consider the following model (written in [Digital Twins Definition Language (DTDL)](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL)) that defines a *Moon*:

```json
{
    "@id": " dtmi:com:contoso:Moon;1",
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

The result of calling `object result = await client.DigitalTwins.GetByIdAsync("my-moon");` on a *Moon*-type twin might look like this:

```json
{
  "$dtId": "myMoon-001",
  "radius": 1737.1,
  "mass": 0.0734,
  "$metadata": {
    "$model": "dtmi:com:contoso:Moon;1",
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
* Other properties in a `$metadata` section. This includes:
    - The DTMI of the model of the digital twin.
    - Synchronization status for each writeable property. This is most useful for devices, where it's possible that the service and the device have diverging statuses (for example, when a device is offline). Currently, this property only applies to physical devices connected to IoT Hub. With the data in the metadata section, it is possible to understand the full status of a property, as well as the last modified timestamps. For more information about sync status, see [this IoT Hub tutorial](../iot-hub/tutorial-device-twins.md) on synchronizing device state.
    - Service-specific metadata, like from IoT Hub or Azure Digital Twins. 

You can parse the returned json for the twin using a json parsing library of your choice, for example `System.Text.Json`.

You can also use the Serialization Helper class `BasicDigitalTwin` that is included with the SDK.

It will return the core twin metadata and properties in pre-parsed form. For example:

```csharp
Response<string> res = client.GetDigitalTwin(twin_id);
BasicDigitalTwin twin = JsonSerializer.Deserialize<BasicDigitalTwin>(res.Value);
Console.WriteLine($"Model id: {twin.Metadata.ModelId}");
foreach (string prop in twin.CustomProperties.Keys)
{
    if (twin.CustomProperties.TryGetValue(prop, out object value))
        Console.WriteLine($"Property '{prop}': {value}");
}
```

> [!TIP] See [How to use APIs and SDKs](./how-to-use-apis.md) for more information on the serialization helper classes.]

## Update a digital twin

To update properties a digital twin, you write the information you want to replace in [JSON Patch](http://jsonpatch.com/) format. In this way, you can replace multiple properties at once. You then pass the JSON Patch document into an `Update` method:

`await client.UpdateDigitalTwin(id, patch);`.

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

You can create patches manually or using a helper class in the SDK.

#### Create Patches using the helper class

```csharp
UpdateOperationsUtility uou = new UpdateOperationsUtility();
uou.AppendAddOp("/Temperature", 25.0);
await client.UpdateDigitalTwinAsync(twinId, uou.Serialize());
```

> [!TIP] See [How to use APIs and SDKs](./how-to-use-apis.md) for more information on the serialization helper classes.]

#### Create Patches manually
```csharp
List<object> twinData = new List<object>();
twinData.Add(new Dictionary<string, object>() {
    { "op", "add"},
    { "path", "/Temperature"},
    { "value", 25.0}
});

await client.UpdateDigitalTwinAsync(twinId, JsonConvert.SerializeObject(twinData));
```

### Update properties in digital twin components

Recall that a model may contain components, allowing it to be made up of other models. 

To patch properties in a digital twin's components, you will use path syntax in JSON Patch:

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

The `Update` function can also be used to migrate a digital twin to a different model. 

For example, consider the following JSON Patch document that replaces the digital twin's metadata `$model` field:

```json
[
  {
    "op": "replace",
    "path": "/$metadata/$model",
    "value": "dtmi:com:contoso:foo;1"
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
    "value": "dtmi:com:contoso:foo_new"
  },
  {
    "op": "add",
    "path": "temperature",
    "value": 60
  }
]
```

## Delete a digital twin

You can delete twins using `DeleteDigitalTwin(ID)`. However, you can only delete a twin when it has no more relationships. You must delete all relationships first. 

Here is an example of the code for this:

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
        // GetRelationshipsAsync will throw if an error occurs
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
        // GetRelationshipssAsync will throw if an error occurs
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

See the [`CommandDeleteAllTwins` function](https://github.com/Azure-Samples/digital-twins-samples/blob/master/AdtSampleApp/SampleClientApp/CommandLoop.cs) in the ADTSampleApp tutorial (CommandLoop.cs) for an example for how to delete all twins.


## Next steps

See how to create and manage relationships between your digital twins:
* [How-to: Manage a twin graph with relationships](how-to-manage-graph.md)