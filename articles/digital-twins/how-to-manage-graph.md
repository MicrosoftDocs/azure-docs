---
# Mandatory fields.
title: Manage the twin graph with relationships
titleSuffix: Azure Digital Twins
description: See how to manage a graph of digital twins by connecting them with relationships.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 09/30/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Manage a graph of digital twins using relationships

The heart of Azure Digital Twins is the [twin graph](concepts-twins-graph.md) representing your whole environment. The twin graph is made up of individual digital twins connected via **relationships**.

Once you have a working [Azure Digital Twins instance](how-to-set-up-instance-portal.md) and have set up [authentication](how-to-authenticate-client.md) code in your client app, you can use the [**DigitalTwins APIs**](how-to-use-apis-sdks.md) to create, modify, and delete digital twins and their relationships in an Azure Digital Twins instance. You can also use the [.NET (C#) SDK](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core), or the [Azure Digital Twins CLI](how-to-use-cli.md).

This article focuses on managing relationships and the graph as a whole; to work with individual digital twins, see [*How-to: Manage digital twins*](how-to-manage-twin.md).

[!INCLUDE [visualizing with Azure Digital Twins explorer](../../includes/digital-twins-visualization.md)]

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
public async static Task CreateRelationship(DigitalTwinsClient client, string srcId, string targetId, string relName)
        {
            var relationship = new BasicRelationship
            {
                TargetId = targetId,
                Name = relName
            };

            try
            {
                string relId = $"{srcId}-{relName}->{targetId}";
                await client.CreateRelationshipAsync(srcId, relId, JsonSerializer.Serialize(relationship));
                Console.WriteLine($"Created {relName} relationship successfully");
            }
            catch (RequestFailedException rex)
            {
                Console.WriteLine($"Create relationship error: {rex.Status}:{rex.Message}");
            }
            
        }
```

You can now call CreateRelationship function in your main method like this: 

`await CreateRelationship(client, srcId, targetId, "contains");`

If you wish to create multiple relationships, you can call the same method and pass your relationship types in the argument. 

Example: 

`await CreateRelationship(client, srcId, targetId, "has");`

For more information on the helper class `BasicRelationship`, see [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md).

### Create multiple relationships between twins

There is no restriction on the number of relationships that you can have between two twins—you can have as many relationships between twins as you like. 

This means that you can express several different types of relationships between two twins at once. For example, *Twin A* can have both a *stored* relationship and *manufactured* relationship with *Twin B*.

You can even create multiple instances of the same type of relationship between the same two twins, if desired. In this example, that means *Twin A* could have two distinct *stored* relationships with *Twin B*.

## List relationships

To access the list of relationships for a given twin in the graph, you can use:

`await client.GetRelationshipsAsync(id);`

This returns an `Azure.Pageable<T>` or `Azure.AsyncPageable<T>`, depending on if you use the synchronous or asynchronous version of the call.

Here is a full example that retrieves a list of relationships:

```csharp
public static async Task<List<BasicRelationship>> FindOutgoingRelationshipsAsync(DigitalTwinsClient client, string dtId)
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
                    Console.WriteLine(relJson);
                }

                return results;
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"*** Error {ex.Status}/{ex.ErrorCode} retrieving relationships for {dtId} due to {ex.Message}");
                return null;
            }
        }

```

You can now call this method to see the outgoing relationships of the twins like this:

`await FindOutgoingRelationshipsAsync(client, twin_id);`

You can use the retrieved relationships to navigate to other twins in your graph. To do this, read the `target` field from the relationship that is returned, and use it as the ID for your next call to `GetDigitalTwin`. 

### Find relationships to a digital twin

Azure Digital Twins also has an API to find all incoming relationships to a given twin. This is often useful for reverse navigation, or when deleting a twin.

The previous code sample focused on finding outgoing relationships. The following example is similar, but finds incoming relationships instead. It also deletes them once they are found.

Note that the `IncomingRelationship` calls do not return the full body of the relationship.

```csharp
public static async Task<List<IncomingRelationship>> FindIncomingRelationshipsAsync(DigitalTwinsClient client, string dtId)
        {
            // Find the relationships for the twin
            try
            {
                // GetRelationshipsAsync will throw an error if a problem occurs
                AsyncPageable<IncomingRelationship> incomingRels = client.GetIncomingRelationshipsAsync(dtId);

                List<IncomingRelationship> results = new List<IncomingRelationship>();
                await foreach (IncomingRelationship incomingRel in incomingRels)
                {
                    results.Add(incomingRel);
                    Console.WriteLine(incomingRel);

                }
                return results;
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"*** Error {ex.Status}/{ex.ErrorCode} retrieving incoming relationships for {dtId} due to {ex.Message}");
                return null;
            }
        }
```

You can now call this method to see the incoming relationships of the twins like this:

`await FindIncomingRelationshipsAsync(client, twin_id);`

You can now fetch and print the properties of twins with their relationships using FetchAndPrintTwinAsync(DigitalTwinsClient client, string twin_id) method.

```csharp  
private static async Task FetchAndPrintTwinAsync(DigitalTwinsClient client, string twin_id)
        {
            BasicDigitalTwin twin;
            Response<string> res = client.GetDigitalTwin(twin_id);
            twin = JsonSerializer.Deserialize<BasicDigitalTwin>(res.Value);
            Console.WriteLine($"Model id: {twin.Metadata.ModelId}");
            foreach (string prop in twin.CustomProperties.Keys)
            {
                if (twin.CustomProperties.TryGetValue(prop, out object value))
                    Console.WriteLine($"Property '{prop}': {value}");

            }
            await FindOutgoingRelationshipsAsync(client, twin_id);
            await FindIncomingRelationshipsAsync(client, twin_id);

            return;
        }
```

You can now call this function in your main method like this: 

`await FetchAndPrintTwinAsync(targetId, client);`

## Delete relationships

You can delete relationships using `await DeleteRelationShip(client, srcId, $"{srcId}-contains->{targetId}");` in your main method.

```csharp
private static async Task DeleteRelationShip(DigitalTwinsClient client, string srcId, string relId)
        {
            try
            {
                Response response = await client.DeleteRelationshipAsync(srcId, relId);
                await FetchAndPrintTwinAsync(srcId, client);
                Console.WriteLine("Succesfully deleted relashionship");
            }
            catch (RequestFailedException Ex)
            {
                Console.WriteLine(Ex.ErrorCode);
            }
        }
```
The first parameter specifies the source twin (the twin where the relationship originates). The other parameter is the relationship ID. You need both the twin ID and the relationship ID, because relationship IDs are only unique within the scope of a twin.

Runnable Code sample below creates models, twins, prints details of the twins, creates relationships between the twins and finally deletes relationships between twins.

If you are running the following code directly without going through the above steps, make sure you 
* Install _Azure.DigitalTwins.Core and Azure.Identity packages_ to your project using your package manager. 
* Create models with the names of your choice and match the below line of code with _model name_ and _model-id_. 
    `twin.Metadata.ModelId = "dtmi:com:contoso:<model-name>;<model-id>";`. 
You can refer to [this](https://docs.microsoft.com/azure/digital-twins/tutorial-command-line-app#explore-with-the-sample-solution) link for a sample model code. 
* Also replace the placeholders with your clientId, tenantId and adtInstanceUrl in the below code.

Note that when you upload a model with the same model id, you will receive an exception. 

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

        static async Task Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            DigitalTwinsClient client = createDTClient();
            Console.WriteLine($"Service client created – ready to go");

            Console.WriteLine($"Upload a model");
            BasicDigitalTwin twin = new BasicDigitalTwin();
            var typeList = new List<string>();
            string srcId = "myRoomID";
            string targetId = "myFloorID";
            string dtdl = File.ReadAllText("room.json");
            string dtdl1 = File.ReadAllText("floor.json");
            typeList.Add(dtdl);
            // typeList.Add(dtdl1);
            // Upload the model to the service

            // await client.CreateModelsAsync(typeList);

            twin.Metadata = new DigitalTwinMetadata();
            twin.Metadata.ModelId = "dtmi:com:contoso:room;2";
            // Initialize properties
            Dictionary<string, object> props = new Dictionary<string, object>();
            props.Add("Temperature", 35.0);
            props.Add("Humidity", 55.0);
            twin.CustomProperties = props;

            await client.CreateDigitalTwinAsync(srcId, JsonSerializer.Serialize<BasicDigitalTwin>(twin));
            // Creating twin data for second twin: table
            twin.Metadata = new DigitalTwinMetadata();
            twin.Metadata.ModelId = "dtmi:com:contoso:floor;1";
            // Initialize properties
            Dictionary<string, object> props1 = new Dictionary<string, object>();
            props1.Add("capacity", 5.0);
            twin.CustomProperties = props1;
            await client.CreateDigitalTwinAsync(targetId, JsonSerializer.Serialize<BasicDigitalTwin>(twin));

            Console.WriteLine("Twins created successfully");


            await CreateRelationship(client, srcId, targetId, "contains");
            await CreateRelationship(client, srcId, targetId, "has");
            Console.WriteLine("Printing srcID");
            Console.WriteLine();
            await FetchAndPrintTwinAsync(srcId, client);
            Console.WriteLine();
            Console.WriteLine("Printing targetID");
            Console.WriteLine();
            await FetchAndPrintTwinAsync(targetId, client);
            Console.WriteLine();
            await DeleteRelationShip(client, srcId, $"{srcId}-contains->{targetId}");
            Console.WriteLine();
        }

        private static DigitalTwinsClient createDTClient()
        {
            string clientId = "<your-client-id>";
            string tenantId = "<your-tenant-id>";
            string adtInstanceUrl = "https://<your-instance-hostname>";
            DigitalTwinsClient client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credentials);
            return client;
        }
        
        public async static Task CreateRelationship(DigitalTwinsClient client, string srcId, string targetId, string relName)
        {
            \\ Create relationship between twins
            var relationship = new BasicRelationship
            {
                TargetId = targetId,
                Name = relName
            };

            try
            {
                string relId = $"{srcId}-{relName}->{targetId}";
                await client.CreateRelationshipAsync(srcId, relId, JsonSerializer.Serialize(relationship));
                Console.WriteLine($"Created {relName} relationship successfully");
            }
            catch (RequestFailedException rex)
            {
                Console.WriteLine($"Create relationship error: {rex.Status}:{rex.Message}");
            }
            
        }

        private static async Task FetchAndPrintTwinAsync(DigitalTwinsClient client, string twin_id)
        {
            // Print twin properties and relationships
            BasicDigitalTwin twin;
            Response<string> res = client.GetDigitalTwin(twin_id);
            twin = JsonSerializer.Deserialize<BasicDigitalTwin>(res.Value);
            Console.WriteLine($"Model id: {twin.Metadata.ModelId}");
            foreach (string prop in twin.CustomProperties.Keys)
            {
                if (twin.CustomProperties.TryGetValue(prop, out object value))
                    Console.WriteLine($"Property '{prop}': {value}");

            }
            await FindOutgoingRelationshipsAsync(client, twin_id);
            await FindIncomingRelationshipsAsync(client, twin_id);

            return;
        }

        public static async Task<List<BasicRelationship>> FindOutgoingRelationshipsAsync(DigitalTwinsClient client, string dtId)
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
                    Console.WriteLine(relJson);
                }

                return results;
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"*** Error {ex.Status}/{ex.ErrorCode} retrieving relationships for {dtId} due to {ex.Message}");
                return null;
            }
        }

        public static async Task<List<IncomingRelationship>> FindIncomingRelationshipsAsync(DigitalTwinsClient client, string dtId)
        {
            // Find the relationships for the twin
            try
            {
                // GetRelationshipsAsync will throw an error if a problem occurs
                AsyncPageable<IncomingRelationship> incomingRels = client.GetIncomingRelationshipsAsync(dtId);

                List<IncomingRelationship> results = new List<IncomingRelationship>();
                await foreach (IncomingRelationship incomingRel in incomingRels)
                {
                    results.Add(incomingRel);
                    Console.WriteLine(incomingRel);

                }
                return results;
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"*** Error {ex.Status}/{ex.ErrorCode} retrieving incoming relationships for {dtId} due to {ex.Message}");
                return null;
            }
        }
        private static async Task DeleteRelationShip(DigitalTwinsClient client, string srcId, string relId)
        {
            try
            {
                Response response = await client.DeleteRelationshipAsync(srcId, relId);
                await FetchAndPrintTwinAsync(srcId, client);
                Console.WriteLine("Succesfully deleted relashionship");
            }
            catch (RequestFailedException Ex)
            {
                Console.WriteLine(Ex.ErrorCode);
            }
        }
    }
}
```

Here is the console output of the above program: 

:::image type="content" source="media/how-to-manage-graph/console-output-twins-relationships.png" alt-text="Console output showing the twin details, incoming and outgoing relationships of the twins.":::

## Create a twin graph 

The following code snippet uses the relationship operations from this article to create a twin graph out of digital twins and relationships.

```csharp
static async Task CreateTwins(DigitalTwinsClient client)
{
    // Create twins - see utility functions below 
    await CreateRoom(client, "Room01", 68, 50);
    await CreateRoom(client, "Room02", 70, 66);
    await CreateFloorOrBuilding("Floor01", makeFloor:true);

    // Create relationships
    await AddRelationship(client, "Floor01", "contains", "Floor-to-Room01", "Room01");
    await AddRelationship(client, "Floor01", "contains", "Floor-to-Room02", "Room02");
}

static async Task<bool> AddRelationship(DigitalTwinsClient client, string source, string rel_name, string id, string target)
{
    var relationship = new BasicRelationship
    {
        TargetId = target,
        Name = rel_name
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

static async Task<bool> CreateRoom(DigitalTwinsClient client, string id, double temperature, double humidity)
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
       await client.CreateDigitalTwinAsync(id, JsonSerializer.Serialize<BasicDigitalTwin>(twin)); 
        return true;       
    }
    catch (ErrorResponseException e)
    {
        Console.WriteLine($"*** Error creating twin {id}"); 
        return false;
    }
}

static async Task<bool> CreateFloorOrBuilding(DigitalTwinsClient client, string id, bool makeFloor=true)
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
        client.CreateDigitalTwinAsync(id, JsonSerializer.Serialize<BasicDigitalTwin>(twin));  
        return true;      
    }
    catch (ErrorResponseException e)
    {
        Console.WriteLine($"*** Error creating twin {id}"); 
        return false;
    }
}
```

You can call CreateTwins() function in your main method like this: 

```csharp

await CreateTwins(client);

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
       Console.Writeline($"Error {e.Status}: {e.Message}");
    }
    foreach (BasicRelationship rec in RelationshipRecordList)
    { 
        try { 
            client.CreateRelationship(rec.SourceId, Guid.NewGuid().ToString(), JsonSerializer.Serialize<BasicRelationship>(rec));
        }
        catch (RequestFailedException e)
        {
            Console.Writeline($"Error {e.Status}: {e.Message}");
        }
    }
}
```
## Manage relationships with CLI

Twins and their relationships can also be managed using the Azure Digital Twins CLI. The commands can be found in [*How-to: Use the Azure Digital Twins CLI*](how-to-use-cli.md).

## Next steps

Learn about querying an Azure Digital Twins twin graph:
* [*Concepts: Query language*](concepts-query-language.md)
* [*How-to: Query the twin graph*](how-to-query-graph.md)