---
# Mandatory fields.
title: Manage a twin graph with relationships
titleSuffix: Azure Digital Twins
description: See how to manage a graph of digital twins by connecting them with relationships.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/10/2020
ms.topic: how-to
ms.service: digital-twins
ROBOTS: NOINDEX, NOFOLLOW

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Manage a graph of digital twins using relationships

[!INCLUDE [Azure Digital Twins current preview status](../../includes/digital-twins-preview-status.md)]

The heart of Azure Digital Twins is the [twin graph](concepts-twins-graph.md) representing your whole environment. The twin graph is made up of individual digital twins connected via **relationships**.

Once you have a working [Azure Digital Twins instance](how-to-set-up-instance.md) and have set up [authentication](how-to-authenticate-client.md) for your client app, you can use the [**DigitalTwins APIs**](how-to-use-apis-sdks.md) to create, modify, and delete digital twins and their relationships in an Azure Digital Twins instance. You can also use the [.NET (C#) SDK](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core), or the [Azure Digital Twins CLI](how-to-use-cli.md).

This article focuses on managing relationships and the graph as a whole; to work with individual digital twins, see [How-to: Manage a digital twin](how-to-manage-twin.md).

## Create relationships

Relationships describe how different digital twins are connected to each other, which forms the basis of the twin graph.

Relationships are created using the `CreateRelationship` call. 

To create a relationship, you need to specify:
* The source twin ID (the twin where the relationship originates)
* The target twin ID (the twin where the relationship arrives)
* A relationship name
* A relationship ID

The relationship ID must be unique within the given source twin. It does not need to be globally unique.
For example, for the twin *foo*, each specific relationship ID must be unique. However, another twin *bar* can have an outgoing relationship that matches the same ID of a *foo* relationship. 

The following code sample illustrates how to add a relationship to your Azure Digital Twins instance.

```csharp
public async static Task CreateRelationship(DigitalTwinsClient client, string srcId, string targetId)
{
    var relationship = new BasicRelationship
    {
        TargetId = targetId,
        Name = "contains"
    };

    try
    {
        string relId = $"{srcId}-contains->{targetId}";
        await client.CreateRelationshipAsync(srcId, relId, JsonSerializer.Serialize(relationship));
        Console.WriteLine("Created relationship successfully");
    }
    catch (RequestFailedException rex) {
        Console.WriteLine($"Create relationship error: {rex.Status}:{rex.Message}");
    }
}
```

For more information on the helper class `BasicRelationship`, see [How-to: Use the Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md).

## List relationships

To access the list of relationships for a given twin in the graph, you can use:

```csharp
await client.GetRelationshipsAsync(id);
```

This returns an `Azure.Pageable<T>` or `Azure.AsyncPageable<T>`, depending on if you use the synchronous or asynchronous version of the call.

Here is a full example that retrieves a list of relationships:

```csharp
public async Task<List<BasicRelationship>> FindOutgoingRelationshipsAsync(string dtId)
{
    // Find the relationships for the twin
    try
    {
        // GetRelationshipsAsync will throw if an error occurs
        AsyncPageable<string> relsJson = client.GetRelationshipsAsync(dtId);
        List<BasicRelationship> results = new List<BasicRelationship>();
        await foreach (string relJson in relsJson)
        {
            var rel = System.Text.Json.JsonSerializer.Deserialize<BasicRelationship>(relJson);
            results.Add(rel);
        }
        return results;
    }
    catch (RequestFailedException ex)
    {
        Log.Error($"*** Error {ex.Status}/{ex.ErrorCode} retrieving relationships for {dtId} due to {ex.Message}");
        return null;
    }
}
```

You can use the retrieved relationships to navigate to other twins in your graph. To do this, read the `target` field from the relationship that is returned, and use it as the ID for your next call to `GetDigitalTwin`. 

### Find relationships to a digital twin

Azure Digital Twins also has an API to find all incoming relationships to a given twin. This is often useful for reverse navigation, or when deleting a twin.

The previous code sample focused on finding outgoing relationships. The following example is similar, but finds incoming relationships instead. It also deletes them once they are found.

Note that the IncomingRelationship calls do not return the full

```csharp
async Task<List<IncomingRelationship>> FindIncomingRelationshipsAsync(string dtId)
{
    // Find the relationships for the twin
    try
    {
        // GetRelationshipsAsync will throw an error if a problem occurs
        AsyncPageable<IncomingRelationship> incomingRels = client.GetIncomingRelationshipsAsync(dtId);

        List<IncomingRelationship> results = new List<IncomingRelationship>();
        await foreach (IncomingRelationship incomingRel in incomingRels)
            results.Add(incomingRel);
    }
    catch (RequestFailedException ex)
    {
        Log.Error($"*** Error {ex.Status}/{ex.ErrorCode} retrieving incoming relationships for {dtId} due to {ex.Message}");
    }
}
```

## Delete relationships

You can delete relationships using `DeleteRelationship(source, relId);`.

The first parameter specifies the source twin (the twin where the relationship originates). The other parameter is the relationship ID. You need both the twin ID and the relationship ID, because relationship IDs are only unique within the scope of a twin.

## Create a twin graph 

The following code snippet uses the relationship operations from this article to create a twin graph out of digital twins and relationships.

```csharp
static async Task CreateTwins()
{
    // Create twins - see utility functions below 
    await CreateRoom("Room01", 68, 50, false, "");
    await CreateRoom("Room02", 70, 66, true, "EId-00124");
    await CreateFloorOrBuilding("Floor01", makeFloor:true);

    // Create relationships
    await AddRelationship("Floor01", "contains", "Floor-to-Room01", "Room01");
    await AddRelationship("Floor01", "contains", "Floor-to-Room02", "Room02");
}

static async Task<bool> AddRelationship(string source, string relationship, string id, string target)
{
    var relationship = new BasicRelationship
    {
        TargetId = target,
        Name = relationship
    };

    try
    {
        string relId = $"{source}-contains->{target}";
        await client.CreateRelationshipAsync(source, relId, JsonSerializer.Serialize(relationship));
        Console.WriteLine("Created relationship successfully");
        return true;
    }
    catch (RequestFailedException rex) {
        Console.WriteLine($"Create relationship error: {rex.Status}:{rex.Message}");
        return false;
    }
}

static async Task<bool> CreateRoom(string id, double temperature, double humidity)
{
    BasicDigitalTwin twin = new BasicDigitalTwin();
    twin.Metadata = new DigitalTwinMetadata();
    twin.Metadata.ModelId = "dtmi:com:contoso:Room;2";
    // Initialize properties
    Dictionary<string, object> props = new Dictionary<string, object>();
    props.Add("Temperature", temperature);
    props.Add("Humidity", humidity);
    twin.CustomProperties = props;
    
    try
    {
        client.CreateDigitalTwin(id, JsonSerializer.Serialize<BasicDigitalTwin>(twin)); 
        return true;       
    }
    catch (ErrorResponseException e)
    {
        Console.WriteLine($"*** Error creating twin {id}: {e.Response.StatusCode}"); 
        return false;
    }
}

static async Task<bool> CreateFloorOrBuilding(string id, bool makeFloor=true)
{
    string type = "dtmi:com:contoso:Building;3";
    if (makeFloor==true)
        type = "dtmi:com:contoso:Floor;2";
    BasicDigitalTwin twin = new BasicDigitalTwin();
    twin.Metadata = new DigitalTwinMetadata();
    twin.Metadata.ModelId = type;
    // Initialize properties
    Dictionary<string, object> props = new Dictionary<string, object>();
    props.Add("AverageTemperature", 0);
    twin.CustomProperties = props;
    
    try
    {
        client.CreateDigitalTwin(id, JsonSerializer.Serialize<BasicDigitalTwin>(twin));  
        return true;      
    }
    catch (ErrorResponseException e)
    {
        Console.WriteLine($"*** Error creating twin {id}: {e.Response.StatusCode}"); 
        return false;
    }
}
```

### Create a twin graph from a spreadsheet

In practical use cases, twin hierarchies will often be created from data stored in a different database, or perhaps in a spreadsheet. This section illustrates how a spreadsheet can be parsed.

Consider the following data table, describing a set of digital twins and relationships to be created.

| Model    | ID | Parent | Relationship name | Other data |
| --- | --- | --- | --- | --- |
| floor    | Floor01 | | | … |
| room    | Room10 | Floor01 | contains | … |
| room    | Room11 | Floor01 | contains | … |
| room    | Room12 | Floor01 | contains | … |
| floor    | Floor02 | | | … |
| room    | Room21 | Floor02 | contains | … |
| room    | Room22 | Floor02 | contains | … |

The following code uses the [Microsoft Graph API](https://docs.microsoft.com/graph/overview) to read a spreadsheet and construct an Azure Digital Twins twin graph from the results.

```csharp
var range = msftGraphClient.Me.Drive.Items["BuildingsWorkbook"].Workbook.Worksheets["Building"].usedRange;
JsonDocument data = JsonDocument.Parse(range.values);
List<BasicRelationship> RelationshipRecordList = new List<BasicRelationship>();
foreach (JsonElement row in data.RootElement.EnumerateArray())
{
    string type = row[0].GetString();
    string id = row[1].GetString();
    string relSource = row[2].GetString();
    string relName = row[3].GetString();
    // Parse spreadsheet extra data into a JSON string to initialize the digital twin
    // Left out for compactness
    Dictionary<string, object> initData = new Dictionary<string, object>() { ... };

    if (relSource != null)
    {
        BasicRelationship br = new BasicRelationship()
        {
            SourceId = relSource,
            TargetId = id,
            Name = relName
        };
        RelationshipRecordList.Add(br);
    }

    BasicDigitalTwin twin = new BasicDigitalTwin();
    twin.CustomProperties = initData;
    // Set the type of twin to be created
    switch (type)
    {
        case "room":
            twin.Metadata = new DigitalTwinMetadata() { ModelId = "dtmi:com:contoso:Room;2" };
            break;
        case "floor":
            twin.Metadata = new DigitalTwinMetadata() { ModelId = "dtmi:com:contoso:Floor;2" };
            break;
        ... handle additional types
    }
    try
    {
        client.CreateDigitalTwin(id, JsonSerializer.Serialize<BasicDigitalTwin>(twin));
    }
    catch (RequestFailedException e)
    {
        Log.Error($"Error {e.Status}: {e.Message}");
    }
    foreach (BasicRelationship rec in RelationshipRecordList)
    { 
        try { 
            client.CreateRelationship(rec.SourceId, Guid.NewGuid().ToString(), JsonSerializer.Serialize<BasicRelationship>(rec));
        }
        catch (RequestFailedException e)
        {
            Log.Error($"Error {e.Status}: {e.Message}");
        }
    }
}
```
## Manage relationships with CLI

Twins and their relationships can also be managed using the Azure Digital Twins CLI. The commands can be found in [How-to: Use the Azure Digital Twins CLI](how-to-use-cli.md).

## Next steps

Learn about querying an Azure Digital Twins twin graph:
* [Concepts: Query language](concepts-query-language.md)
* [How-to: Query the twin graph](how-to-query-graph.md)