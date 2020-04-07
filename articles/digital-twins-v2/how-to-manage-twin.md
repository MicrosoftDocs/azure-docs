---
# Mandatory fields.
title: Retrieve, update, and delete digital twins and relationships
titleSuffix: Azure Digital Twins
description: See how to retrieve, update, and delete individual twins and relationships.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/12/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Retrieve, update, and delete digital twins and relationships

Azure Digital Twins **DigitalTwins APIs** let developers create, modify, and delete digital twins and their relationships in an Azure Digital Twins instance.

[!INCLUDE [digital-twins-generate-sdk.md](../../includes/digital-twins-generate-sdk.md)]

## Get twin data for an entire digital twin

You can access data on any digital twin by calling:

```csharp
object result = await client.DigitalTwins.GetByIdAsync(id);
```

> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

This call returns twin data in a JSON.Net object form during preview. 

Consider the following model (written in [Digital Twins Definition Language (DTDL)](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL)) that defines a *Moon*:

```json
{
    "@id": " urn:contosocom:example:Moon:1",
    "@type": "Interface",
    "@context": "http://azure.com/v3/contexts/Model.json",
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
    "$model": "urn:contosocom:example:Moon:1",
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

## Patch digital twins

To update properties a digital twin, you write the information you want to replace in [JSON Patch](http://jsonpatch.com/) format. In this way, you can replace multiple properties at once. You then pass the JSON Patch document into an `Update` method:

`await client.DigitalTwins.UpdateAsync(id, patch);`.

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

### Patch properties in components

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

## Change the model

The `Update` function can also be used to migrate a digital twin to a different model. 

For example, consider the following JSON Patch document that replaces the digital twin's metadata `$model` field:

```json
[
  {
    "op": "replace",
    "path": "/$metadata/$model",
    "value": "urn:contosocom:example:foo:1"
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
    "value": "urn:contosocom:example:foo_new"
  },
  {
    "op": "add",
    "path": "temperature",
    "value": 60
  }
]
```

## List relationships

To access the list of relationships in the twin graph, you can write:

```csharp
await client.DigitalTwins.ListEdgesAsync(id)
```

Here is a more sophisticated example, that gets relationships in the context of a larger method and includes paging on the result.

```csharp
static async Task ListOutgoingRelationships(string id)
{
    // Find the relationships for the twin
    try
    {
        List<object> relList = new List<object>();
        // Enumerate the IPage object returned to get the results
        // ListAsync will throw if an error occurs
        IPage<object> relPage = await client.DigitalTwins.ListEdgesAsync(id);
        relList.AddRange(relPage);
        // If there are more pages, the NextPageLink in the page is set
        while (relPage.NextPageLink != null)
        {
            // Get more pages...
            relPage = await client.DigitalTwins.ListEdgesNextAsync(relPage.NextPageLink);
            relList.AddRange(relPage);
        }
        Console.WriteLine($"Found {relList.Count} relationships on {id}");
        // Let's delete the edges we found
        foreach (JObject r in relList)
        {
            string relId = r.Value<string>("$edgeId");
            string relName = r.Value<string>("$relationship");
            Console.WriteLine($"Found relationship {relId} from {id}");
        }
    }
    catch (ErrorResponseException e)
    {
        Console.WriteLine($"*** Error retrieving relationships for {id}: {e.Response.StatusCode}");
    }
}
```

You can use retrieved relationships to navigate to other twins in your graph. To do this, retrieve the `target` field from the relationship that is returned, and use it as the ID for your next call to `DigitalTwins.GetById`. 

## Delete Relationships

You can delete relationships using `DigitalTwins.DeleteEdgeAsync(source, relName, relId);`.

The first parameter specifies the source twin (the twin where the relationship originates). The other parameters are the relationship's name and the relationship's ID. All of these parameters are needed, because a relationship ID only needs to be unique within the scope of a given twin and relationship name. Relationship IDs do not need to be globally unique.


## Find incoming relationships

Azure Digital Twins also has an API to find all incoming relationships to a given twin. This is often useful for reverse navigation, or when deleting a twin.

The previous code sample focused on finding outgoing relationships. The following example is similar, but finds incoming relationships instead. It also deletes them once they are found.

```csharp
static async Task FindAndDeleteIncomingRelationships(string id)
{
    // Find the incoming relationships for the twin
    try
    {
        List<IncomingEdge> relList = new List<IncomingEdge>();
        // Enumerate the IPage object returned to get the results
        // ListAsync will throw if an error occurs
        IPage<IncomingEdge> relPage = await client.DigitalTwins.ListIncomingEdgesAsync(id);
        relList.AddRange(relPage);
        // If there are more pages, the NextPageLink in the page is set
        while (relPage.NextPageLink != null)
        {
            // Get more pages...
            relPage = await client.DigitalTwins.ListIncomingEdgesNextAsync(relPage.NextPageLink);
            relList.AddRange(relPage);
        }
        Console.WriteLine($"Found {relList.Count} relationships on {id}");
        // Let's delete the edges we found
        foreach (IncomingEdge r in relList)
        {
            string relId = r.EdgeId;
            string relName = r.Relationship;
            string source = r.SourceId;
            // Need twin ID, relationship name, and edge ID to uniquely identify a particular relationship
            await client.DigitalTwins.DeleteEdgeAsync(source, relName, relId);
            Console.WriteLine($"Deleting incoming relationship {relId} from {source}");
        }
    }
    catch (ErrorResponseException e)
    {
        Console.WriteLine($"*** Error deleting incoming relationships for {id}: {e.Response.StatusCode}");
    }
}
```

## Next steps

Learn about managing the other key elements of an Azure Digital Twins solution:
* [Manage a twin model](how-to-manage-model.md)
* [Manage a twin graph](how-to-manage-graph.md)