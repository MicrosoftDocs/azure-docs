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

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Connect twins into a graph with relationships

The heart of Azure Digital Twins is the [twin graph](concepts-twins-graph.md) representing your whole environment. The twin graph is made up of individual twins connected via **relationships**.

Once you have a working [Azure Digital Twins instance](how-to-set-up-instance.md) and have set up [authentication](how-to-authenticate.md) for your client app, you can use the **DigitalTwins APIs** to create, modify, and delete digital twins and their relationships in an Azure Digital Twins instance. This article focuses on managing relationships and the graph as a whole; to work with individual digital twins, see [Manage a digital twin](how-to-manage-twin.md).

[!INCLUDE [digital-twins-generate-sdk.md](../../includes/digital-twins-generate-sdk.md)]

## Create relationships

Relationships describe how different digital twins are connected to each other, which forms the basis of the twin graph.

Relationships are created using `DigitalTwins.AddEdge`. 

To create a relationship, you need to specify:
* The source twin ID (the twin where the relationship originates)
* The target twin ID (the twin where the relationship arrives)
* A relationship name
* A relationship ID

The relationship ID must be unique within the given source twin and relationship name. It does not need to be globally unique.
For example, within the twin *foo* and its *contains* relationships, each specific relationship ID must be unique.

The following code sample illustrates how to add a relationship to your Azure Digital Twins instance.

```csharp
static async Task<bool> AddRelationship(string source, string relationship, string id, string target)
{
    Dictionary<string, object> targetrec = new Dictionary<string, object>()
        {
            { "$targetId", target }
        };
    try
    {
        await client.DigitalTwins.AddEdgeAsync(source, relationship, id, targetrec);
        return true;
    } catch(ErrorResponseException e)
    {
        Console.WriteLine($"*** Error creating relationship: {e.Response.StatusCode}");
        return false;
    }
}
```

### Create a digital twin graph 

The following code snippet incorporates the method above to create a larger graph of twins with relationships.

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
    Dictionary<string, object> targetrec = new Dictionary<string, object>()
        {
            { "$targetId", target }
        };
    try
    {
        await client.DigitalTwins.AddEdgeAsync(source, relationship, id, targetrec);
        return true;
    } catch(ErrorResponseException e)
    {
        Console.WriteLine($"*** Error creating relationship: {e.Response.StatusCode}");
        return false;
    }
}

static async Task<bool> CreateRoom(string id, double temperature, double humidity)
{
    // Define the model for the twin to be created
    Dictionary<string, object> meta = new Dictionary<string, object>()
        {
            { "$model", "urn:example:Room:2" }
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

static async Task<bool> CreateFloorOrBuilding(string id, bool makeFloor=true)
{
    string type = "urn:example:Building:3";
    if (makeFloor==true)
        type = "urn:example:Floor:2";
    // Define the model for the twin to be created
    Dictionary<string, object> meta = new Dictionary<string, object>()
        {
            { "$model", type }
        };
    // Initialize the twin properties
    Dictionary<string, object> initData = new Dictionary<string, object>()
        {
            { "$metadata", meta },
            { "AverageTemperature", 0},
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

### Find relationships on a twin

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

## Delete Relationships

You can delete relationships using `DigitalTwins.DeleteEdgeAsync(source, relName, relId);`.

The first parameter specifies the source twin (the twin where the relationship originates). The other parameters are the relationship's name and the relationship's ID. All of these parameters are needed, because a relationship ID only needs to be unique within the scope of a given twin and relationship name. Relationship IDs do not need to be globally unique.

## Create digital twins graph from a spreadsheet

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
// Connect to MSFT graph and open spreadsheet from OnDrive
// ...
// Read excel spreadsheet using MSFT graph APIs
var range = msftGraphClient.Me.Drive.Items["BuildingsWorkbook"].Workbook.Worksheets["Building"].usedRange;
JsonDocument data = JsonDocument.Parse(range.values);
List<RelationshipRecord> RelationshipRecordList = new List<RelationshipRecord>();
foreach (JsonElement row in data.RootElement.EnumerateArray())
{
    string type = row[0].GetString();
    string id = row[1].GetString();
    string relSource = row[2].GetString();
    string relName = row[3].GetString();
    // Parse spreadsheet extra data into a JSON string to initialize the digital twin
    // Left out for compactness
    Dictionary<string, object> initData = new Dictionary<string, object>(){...};

    if (relSource != null)
        RelationshipRecordList.Add(new RelationshipRecord(relSource, id, relName));

    switch (type)
    {
         case "room":
            Dictionary<string, object> meta = new Dictionary<string, object>()
            {
                { "$model", "urn:contosocom:Room:2" }
            }; 
            initData.Add("$metadata", meta);
            client.DigitalTwins.Add(id, initData);
            break;
         case "floor": 
            Dictionary<string, object> meta = new Dictionary<string, object>()
            {
                { "$model", "urn:contosocom:Floor:22" }
            }; 
            initData.Add("$metadata", meta);
            client.DigitalTwins.CreateTwin(id, initData);
            break;
    }
    foreach (RelationshipRecord rec in RelationshipRecordList)
    {
        Dictionary<string, object> targetrec = new Dictionary<string, object>()
        {
            { "$targetId", rec.target }
        };
        client.DigitalTwins.AddEdge(rec.src, rec.relName, Guid.NewGuid().ToString(), targetrec);
    }
}
```

`RelationshipRecord` in this sample is defined as:

```csharp
public class RelationshipRecord
{
    public RelationshipRecord (string src, string target, string name)
    {
        this.src = src; this.target = target; relName = name;
    }
    public string target;
    public string src;
    public string relName;
}
```

## Next steps

Learn about querying an Azure Digital Twins twin graph:
* [Azure Digital Twins query language](concepts-query-language.md)
* [Query the twin graph](how-to-query-graph.md)