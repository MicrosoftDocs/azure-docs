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

# Create and manage digital twins

Entities in your environment are represented by [digital twins](concepts-twins-graph.md).

Once you have a working [Azure Digital Twins instance](how-to-set-up-instance.md) and have set up [authentication](how-to-authenticate.md) for your client app, you can use the **DigitalTwins APIs** to create, modify, and delete digital twins and their relationships in an Azure Digital Twins instance. This article focuses on managing digital twins; to work with relationships and the graph as a whole, see [Manage a twin graph with relationships](how-to-manage-graph.md).

[!INCLUDE [digital-twins-generate-sdk.md](../../includes/digital-twins-generate-sdk.md)]

## Create a digital twin (preview)

To create a twin, you use the `DigitalTwins.Add` method on the service client like this:

```csharp
await client.DigitalTwins.AddAsync("myNewTwinID", initData);
```

> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

To create a digital twin in this preview release, you need to provide:
* The desired ID for the digital twin
* The [model](concepts-models.md) you want to use 
* Initial values for all properties of the digital twin

The model and initial property values are provided through the `initData` parameter.

### Initialize properties

All non-optional properties and components of digital twins must be initialized at creation time, and are provided in the create call as `initData`. 

> [!NOTE]
> Relationships may be initialized, but do not need to be. 

The twin creation API accepts an object that can be serialized into a valid JSON description of the twin properties. See [Create digital twins and the twin graph](concepts-twins-graph.md) for a description of the JSON format for a twin.

You can create a serializable parameter object with the following example code, which sets up some twin properties:

```csharp
Dictionary<string, object> moonData = new Dictionary<string, object>()
{
    { "name", "MyMoon" },
    { "mass", 100 }
};
```

One mandatory property for a digital twin is the model. This can be set using the property "$model" in the metadata section of the initialization data. Here is a code sample that sets a model along with a few other twin properties:

```csharp
// Define the model type for the twin to be created
Dictionary<string, object> meta = new Dictionary<string, object>()
{
    { "$model", "dtmi:com:contoso:Room;1" }
};
// Initialize the twin properties
Dictionary<string, object> initData = new Dictionary<string, object>()
{
    { "$metadata", meta },
    { "Temperature", temperature},
    { "Humidity", humidity},
};
```

### Full twin creation code

The following code sample uses the information you've learned in this section to create a twin of type *Room* and initialize it:

```csharp
public Task<boolean> CreateRoom(string id, double temperature, double humidity) 
{
    // Define the model for the twin to be created
    Dictionary<string, object> meta = new Dictionary<string, object>()
    {
      { "$model", "dtmi:com:contoso:Room;1" }
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

## Get twin data for an entire digital twin

You can access the data of any digital twin by calling:

```csharp
object result = await client.DigitalTwins.GetByIdAsync(id);
```

> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

This call returns twin data in a JSON.Net object form during preview. 

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

## Update a digital twin

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

### Update properties in components

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

### Change the twin's model

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

You can delete twins using `DigitalTwins.Delete(ID)`. However, you can only delete a twin when it has no more relationships. You must delete all relationships first. 

Here is an example of the code for this:

```csharp
static async Task DeleteTwin()
{
    await FindAndDeleteOutgoingRelationships("Floor01");
    await FindAndDeleteIncomingRelationships("Floor01");
    try
    {
        await client.DigitalTwins.DeleteAsync("Floor01");
    } catch (ErrorResponseException e)
    {
        COnsole.WriteLine($"*** Error deleting Floor01: {e.Response.StatusCode}");
    }
}

static async Task FindAndDeleteOutgoingRelationships(string id)
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
            // Need twin ID, relationship name, and edge ID to uniquely identify a particular relationship
            await client.DigitalTwins.DeleteEdgeAsync(id, relName, relId);
            Console.WriteLine($"Deleting relationship {relId} from {id}");
        }
    }
    catch (ErrorResponseException e)
    {
        Console.WriteLine($"*** Error retrieving relationships for {id}: {e.Response.StatusCode}");
    }
}

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

### Delete all digital twins

The following example shows how to delete all twins in the system at once.

```csharp
static async Task DeleteAllTwins()
{
    Log($"\nDeleting All Twins", ConsoleColor.DarkYellow);
    Log($"Step 1: Find all twins", ConsoleColor.DarkYellow);
    List<object> twins = await ListTwins();
    Log($"Step 2: Find relationship for each twin...", ConsoleColor.DarkYellow);
    foreach (JObject twin in twins)
    {
        string id = twin.Value<string>("$dtId");
        // Find the relationships for the twin
        await FindAndDeleteOutgoingRelationships(id);
    }
    Log($"Step 3: Delete all twins", ConsoleColor.DarkYellow);
    foreach (JObject twin in twins)
    {
        string id = twin.Value<string>("$dtId");
        try
        {
            await client.DigitalTwins.DeleteAsync(id);
            Log($"Deleted twin {id}");
        }
        catch (ErrorResponseException e)
        {
            Log($"*** Error deleting twin {id}: {e.Response.StatusCode}", ConsoleColor.Red);
        }
    }
}

static async Task<List<object>> ListTwins()
{
    string query = "SELECT * FROM digitaltwins";
    List<object> results = new List<object>();
    // Repeat the query while there are pages
    string conToken = null;
    try
    {
        int page = 0;
        do
        {
            QuerySpecification spec = new QuerySpecification(query, conToken);
            QueryResult qr = await client.Query.QueryTwinsAsync(spec);
            page++;
            Log($"== Query results page {page}:", ConsoleColor.DarkYellow);
            if (qr.Items != null)
            {
                results.AddRange(qr.Items);
                // Query returns are JObjects
                foreach(JObject o in qr.Items)
                {
                    string twinId = o.Value<string>("$dtId");
                    Log($"  Found {twinId}");
                }
            }
            Log($"== End query results page {page}", ConsoleColor.DarkYellow);
            conToken = qr.ContinuationToken;
        } while (conToken != null);
    } catch (ErrorResponseException e)
    {
        Log($"*** Error in twin query: ${e.Response.StatusCode}\n${e.Response.ReasonPhrase}", ConsoleColor.Red);
    }
    return results;
}
```


## Next steps

Learn about managing the other key elements of an Azure Digital Twins solution:
* [Manage a twin model](how-to-manage-model.md)
* [Manage a twin graph with relationships](how-to-manage-graph.md)