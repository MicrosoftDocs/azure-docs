---
# Mandatory fields.
title: Create twins and relationships
titleSuffix: Azure Digital Twins
description: See how to combine Azure Digital Twins concepts to build out a full graph representation, as well as modify and delete when necessary.
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

# Create digital twins and relationships

Azure Digital Twins **DigitalTwins APIs** let developers create, modify, and delete digital twins and their relationships in an Azure Digital Twins instance. 

[!INCLUDE [digital-twins-generate-sdk.md](../../includes/digital-twins-generate-sdk.md)]

There are two other prerequisites that this article assumes you've completed: 
* Set up a working instance of Azure Digital Twins, with appropriate access permissions. For more information about this step, see [Create an Azure Digital Twins instance](how-to-set-up-instance.md).
* Learn how to authenticate against Azure Digital Twins and how to create a service client object. For more information about authentication, see [Authenticate against Azure Digital Twins](how-to-authenticate.md).

## Create a digital twin (preview)

The heart of Azure Digital Twins is the [twin graph](concepts-twins-graph.md) representing your environment as a whole. The twin graph is made up of individual twins that represent individual entities in your environment.

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
    { "$model", "urn:example:Room:2" }
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
```

## Create relationships

Digital twins are connected to each other with relationships, and this is how a twin graph is formed.

Relationships are created with `DigitalTwins.AddEdge`. 

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

### Create a digital twin hierarchy 

The following code snippet incorporates the method above to create a larger hierarchy of twins with relationships.

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

## Delete digital twins

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

Learn about querying an Azure Digital Twins twin graph:
* [Azure Digital Twins query language](concepts-query-language.md)
* [Query the twin graph](how-to-query-graph.md)