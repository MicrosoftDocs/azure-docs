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

## Get twin data for an entire digital twin

You can access data on any Azure digital twin by calling

```csharp
object result = await client.DigitalTwins.GetByIdAsync(id);
```

This returns twin data in a JSON.Net object form (for preview). Assuming the following twin type (written in [Digital Twins Definition Language (DTDL)](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL)) defines a digital twin of twin type *Moon*:

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

The call `object result = await client.DigitalTwins.GetByIdAsync("my-moon");` might return:

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

The defined properties of the Azure digital twin are returned as top-level properties on the digital twin. Metadata or system information that is not part of the DTDL definition is returned with a `$` prefix:
* The ID of the digital twin in this Azure Digital Twins instance.
* Metadata. The metadata section contains a variety of metadata. For example:
    - The DTMI of the twin type of the digital twin.
    - Synchronization status for each writeable property. This is most useful for devices, where it's possible that the service and the device have diverging statuses (for example, when a device is offline). Currently, this property only applies to physical devices connected to IoT Hub. With the data in the metadata section, it is possible to understand the full status of a property, as well as the last modified timestamps. 
    - Service-specific metadata, like from IoT Hub or Azure Digital Twins. 

## Patch digital twins

To update multiple properties on a digital twin, use 
`await client.DigitalTwins.UpdateAsync(id, patch);`.
The JSON document passed in to `Update` must be in JSON patch format.

For example:

```json
[
  {
    "op": "replace",
    "path": "/mass",
    "value": 0.0799
  },
  {
    "op": "replace",
    "path": "/temperature",
    "value": 0.800
  }
]
```

This JSON patch document replaces the *mass* property of the digital twin it is applied to. 

### Patch properties in components

To patch properties in components, use path syntax in JSON Patch:

```json
[
  {
    "op": "replace",
    "path": "/mycomponentname/mass",
    "value": 0.0799
  }
]
```

## Change the twin type

`Update` can also be used to migrate an Azure digital twin to a different twin type. For example:

```json
[
  {
    "op": "replace",
    "path": "/$metadata/$model",
    "value": "urn:contosocom:example:foo:1"
  }
]
```

This operation will only succeed if the digital twin being modified after application of the patch is conformant with the new twin type. For example:
1. Imagine an Azure digital twin with a twin type of *foo_old*. *Foo_old* defines a required property *temperature*.
2. The new twin type *foo* defines a property temperature, and adds a new required property *humidity*.
3. After the patch, the digital twin must have both a temperature and humidity property. 

The patch thus needs to be:

```json
[
  {
    "op": "replace",
    "path": "$metadata.$model",
    "value": "urn:contosocom:example:foo"
  },
  {
    "op": "add",
    "path": "humidity",
    "value": 100
  }
]
```

## List relationships

To access relationships, you can write:

```csharp
await client.DigitalTwins.ListEdgesAsync(id)
```

Here is a more complete example that includes paging:
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

You can use retrieved relationships to navigate to other twins in your graph. SImply retrieve the `target` field from the relationship returned and use it as the ID for your next call to `DigitalTwins.GetById`. 

## Delete Relationships

You can delete relationships using `DigitalTwins.DeleteEdgeAsync(source, relName, relId);`.
In the first parameter, you specify the source twin (the twin the relationship originates from). The other parameters are the relationship name, and the relationship's ID. All of these parameters are needed, because a relationship ID only needs to be unique within the scope of a given twin and relationship name. Relationship IDs do not need to be globally unique.


## Find incoming relationships

Azure Digital Twins also has an API to find all incoming relationships to a given twin. These are often useful for reverse navigation, or for deletion of twins.

A similar example to the above one for outgoing relationships - this code finds and deletes all incoming relationships to a twin.
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
* [Manage a twin type](how-to-manage-twin-type.md)
* [Manage a twin graph](how-to-manage-graph.md)