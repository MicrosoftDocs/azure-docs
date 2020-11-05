---
# Mandatory fields.
title: Manage the twin graph with relationships
titleSuffix: Azure Digital Twins
description: See how to manage a graph of digital twins by connecting them with relationships.
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

# Manage a graph of digital twins using relationships

The heart of Azure Digital Twins is the [twin graph](concepts-twins-graph.md) representing your whole environment. The twin graph is made  of individual digital twins connected via **relationships**. 

Once you have a working [Azure Digital Twins instance](how-to-set-up-instance-portal.md) and have set up [authentication](how-to-authenticate-client.md) code in your client app, you can use the [**DigitalTwins APIs**](/rest/api/digital-twins/dataplane/twins) to create, modify, and delete digital twins and their relationships in an Azure Digital Twins instance. You can also use the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet&preserve-view=true), or the [Azure Digital Twins CLI](how-to-use-cli.md).

This article focuses on managing relationships and the graph as a whole; to work with individual digital twins, see [*How-to: Manage digital twins*](how-to-manage-twin.md).

## Prerequisites

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]
    
[!INCLUDE [visualizing with Azure Digital Twins explorer](../../includes/digital-twins-visualization.md)]

## Create relationships

Relationships describe how different digital twins are connected to each other, which forms the basis of the twin graph.

Relationships are created using the `CreateOrReplaceRelationshipAsync()` call. 

To create a relationship, you need to specify:
* The source twin ID (`srcId` in the code sample below): The ID of the twin where the relationship originates.
* The target twin ID (`targetId` in the code sample below): The ID of the twin where the relationship arrives.
* A relationship name (`relName` in the code sample below): The generic type of relationship, something like _contains_.
* A relationship ID (`relId` in the code sample below): The specific name for this relationship, something like _Relationship1_.

The relationship ID must be unique within the given source twin. It doesn't need to be globally unique.
For example, for the twin *foo*, each specific relationship ID must be unique. However, another twin *bar* can have an outgoing relationship that matches the same ID of a *foo* relationship.

The following code sample illustrates how to create a relationship in your Azure Digital Twins instance.

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
                await client.CreateOrReplaceRelationshipAsync<BasicRelationship>(srcId, relId, relationship);
                Console.WriteLine($"Created {relName} relationship successfully");
            }
            catch (RequestFailedException rex)
            {
                Console.WriteLine($"Create relationship error: {rex.Status}:{rex.Message}");
            }
            
        }
```
In your main method, you can now call the `CreateRelationship()` function to create a _contains_ relationship like this: 

```csharp
await CreateRelationship(client, srcId, targetId, "contains");
```
If you wish to create multiple relationships, you can repeat calls to the same method, passing different relationship types into the argument. 

For more information on the helper class `BasicRelationship`, see [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md#serialization-helpers).

### Create multiple relationships between twins

Relationships can be classified as either: 

* Outgoing relationships: Relationships belonging to this twin that point outward to connect it to other twins. The `GetRelationshipsAsync()` method is used to get outgoing relationships of a twin.
* Incoming relationships: Relationships belonging to other twins that point towards this twin to create an "incoming" link. The `GetIncomingRelationshipsAsync()` method is used to get incoming relationships of a twin.

There is no restriction on the number of relationships that you can have between two twins—you can have as many relationships between twins as you like. 

This means that you can express several different types of relationships between two twins at once. For example, *Twin A* can have both a *stored* relationship and *manufactured* relationship with *Twin B*.

You can even create multiple instances of the same type of relationship between the same two twins, if desired. In this example, *Twin A* could have two different *stored* relationships with *Twin B*, as long as the relationships have different relationship IDs.

## List relationships

To access the list of **outgoing** relationships for a given twin in the graph, you can use the `GetRelationships()` method like this:

```csharp
await client.GetRelationships()
```

This returns an `Azure.Pageable<T>` or `Azure.AsyncPageable<T>`, depending on whether you use the synchronous or asynchronous version of the call.

Here is an example that retrieves a list of relationships:

```csharp
public static async Task<List<BasicRelationship>> FindOutgoingRelationshipsAsync(DigitalTwinsClient client, string dtId)
        {
            // Find the relationships for the twin
            try
            {
                // GetRelationshipsAsync will throw if an error occurs
                AsyncPageable<BasicRelationship> rels = client.GetRelationshipsAsync<BasicRelationship>(dtId);
                List<BasicRelationship> results = new List<BasicRelationship>();
                await foreach (BasicRelationship rel in rels)
                {
                    results.Add(rel);
                    Console.WriteLine($"Found relationship-{rel.Name}->{rel.TargetId}");
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

```csharp
await FindOutgoingRelationshipsAsync(client, twin_Id);
```
You can use the retrieved relationships to navigate to other twins in your graph. To do this, read the `target` field from the relationship that is returned, and use it as the ID for your next call to `GetDigitalTwin()`.

### Find incoming relationships to a digital twin

Azure Digital Twins also has an API to find all **incoming** relationships to a given twin. This is often useful for reverse navigation, or when deleting a twin.

The previous code sample was focused on finding outgoing relationships from a twin. The following example is structured similarly, but finds *incoming* relationships to the twin instead.

Note that the `IncomingRelationship` calls don't return the full body of the relationship.

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
                    Console.WriteLine($"Found incoming relationship-{incomingRel.RelationshipId}");

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

```csharp
await FindIncomingRelationshipsAsync(client, twin_Id);
```
### List all twin properties and relationships

Using the above methods for listing outgoing and incoming relationships to a twin, you can create a method that prints full twin information, including the twin's properties and both types of its relationships. Here is an example method, called `FetchAndPrintTwinAsync()`, showing how to do this.

```csharp  
private static async Task FetchAndPrintTwinAsync(DigitalTwinsClient client, string twin_Id)
        {
            BasicDigitalTwin twin;
            Response<BasicDigitalTwin> res = client.GetDigitalTwin(twin_Id);
            
            await FindOutgoingRelationshipsAsync(client, twin_Id);
            await FindIncomingRelationshipsAsync(client, twin_Id);

            return;
        }
```

You can now call this function in your main method like this: 

```csharp
await FetchAndPrintTwinAsync(client, targetId);
```
## Delete relationships

The first parameter specifies the source twin (the twin where the relationship originates). The other parameter is the relationship ID. You need both the twin ID and the relationship ID, because relationship IDs are only unique within the scope of a twin.

```csharp
private static async Task DeleteRelationship(DigitalTwinsClient client, string srcId, string relId)
        {
            try
            {
                Response response = await client.DeleteRelationshipAsync(srcId, relId);
                await FetchAndPrintTwinAsync(srcId, client);
                Console.WriteLine("Deleted relationship successfully");
            }
            catch (RequestFailedException Ex)
            {
                Console.WriteLine($"Error {Ex.ErrorCode}");
            }
        }
```

You can now call this method to delete a relationship like this:

```csharp
await DeleteRelationship(client, srcId, relId);
```
## Create a twin graph 

The following runnable code snippet uses the relationship operations from this article to create a twin graph out of digital twins and relationships.

### Set up the runnable sample

The snippet uses the [*Room.json*](https://github.com/Azure-Samples/digital-twins-samples/blob/master/AdtSampleApp/SampleClientApp/Models/Room.json) and [*Floor.json*](https://github.com/azure-Samples/digital-twins-samples/blob/master/AdtSampleApp/SampleClientApp/Models/Floor.json) model definitions from [*Tutorial: Explore Azure Digital Twins with a sample client app*](tutorial-command-line-app.md). You can use these links to go directly to the files, or download them as part of the full end-to-end sample project [here](/samples/azure-samples/digital-twins-samples/digital-twins-samples/). 

Before you run the sample, do the following:
1. Download the model files, place them in your project, and replace the `<path-to>` placeholders in the code below to tell your program where to find them.
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
            DigitalTwinsClient client = createDTClient();
            Console.WriteLine($"Service client created – ready to go");
            Console.WriteLine();

            //Upload models
            Console.WriteLine($"Upload models");
            Console.WriteLine();
            string dtdl = File.ReadAllText("<path-to>/Room.json");
            string dtdl1 = File.ReadAllText("<path-to>/Floor.json");
            var typeList = new List<string>();
            typeList.Add(dtdl);
            typeList.Add(dtdl1);
            // Upload the models to the service
            await client.CreateModelsAsync(typeList);

            //Create new (Floor) digital twin
            BasicDigitalTwin floorTwin = new BasicDigitalTwin();
            string srcId = "myFloorID";
            floorTwin.Metadata = new DigitalTwinMetadata();
            floorTwin.Metadata.ModelId = "dtmi:example:Floor;1";
            //Floor twins have no properties, so nothing to initialize
            //Create the twin
            await client.CreateOrReplaceDigitalTwinAsync<BasicDigitalTwin>(srcId, floorTwin);
            Console.WriteLine("Twin created successfully");

            //Create second (Room) digital twin
            BasicDigitalTwin roomTwin = new BasicDigitalTwin();
            string targetId = "myRoomID";
            roomTwin.Metadata = new DigitalTwinMetadata();
            roomTwin.Metadata.ModelId = "dtmi:example:Room;1";
            // Initialize properties
            Dictionary<string, object> props = new Dictionary<string, object>();
            props.Add("Temperature", 35.0);
            props.Add("Humidity", 55.0);
            roomTwin.Contents = props;
            //Create the twin
            await client.CreateOrReplaceDigitalTwinAsync<BasicDigitalTwin>(targetId, roomTwin);
            
            //Create relationship between them
            await CreateRelationship(client, srcId, targetId, "contains");
            Console.WriteLine();

            //Print twins and their relationships
            Console.WriteLine("--- Printing details:");
            Console.WriteLine("Outgoing relationships from source twin:");
            await FetchAndPrintTwinAsync(srcId, client);
            Console.WriteLine();
            Console.WriteLine("Incoming relationships to target twin:");
            await FetchAndPrintTwinAsync(targetId, client);
            Console.WriteLine("--------");
            Console.WriteLine();

            //Delete the relationship
            Console.WriteLine("Deleting the relationship");
            await DeleteRelationship(client, srcId, $"{srcId}-contains->{targetId}");
            Console.WriteLine();

            //Print twins and their relationships again
            Console.WriteLine("--- Printing details:");
            Console.WriteLine("Outgoing relationships from source twin:");
            await FetchAndPrintTwinAsync(srcId, client);
            Console.WriteLine();
            Console.WriteLine("Incoming relationships to target twin:");
            await FetchAndPrintTwinAsync(targetId, client);
            Console.WriteLine("--------");
            Console.WriteLine();
        }

        private static DigitalTwinsClient createDTClient()
        {
            string adtInstanceUrl = "https://<your-instance-hostname>";
            var credentials = new DefaultAzureCredential();
            DigitalTwinsClient client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credentials);
            return client;
        }
        private async static Task CreateRelationship(DigitalTwinsClient client, string srcId, string targetId, string relName)
        {
            // Create relationship between twins
            var relationship = new BasicRelationship
            {
                TargetId = targetId,
                Name = relName
            };

            try
            {
                string relId = $"{srcId}-{relName}->{targetId}";
                await client.CreateOrReplaceRelationshipAsync<BasicRelationship>(srcId, relId, relationship);
                Console.WriteLine($"Created {relName} relationship successfully");
            }
            catch (RequestFailedException rex)
            {
                Console.WriteLine($"Create relationship error: {rex.Status}:{rex.Message}");
            }

        }

        private static async Task FetchAndPrintTwinAsync(string twin_Id, DigitalTwinsClient client)
        {
            BasicDigitalTwin twin;
            Response<BasicDigitalTwin> res = client.GetDigitalTwin(twin_Id);
            await FindOutgoingRelationshipsAsync(client, twin_Id);
            await FindIncomingRelationshipsAsync(client, twin_Id);

            return;
        }

        private static async Task<List<BasicRelationship>> FindOutgoingRelationshipsAsync(DigitalTwinsClient client, string dtId)
        {
            // Find the relationships for the twin
            
            try
            {
                // GetRelationshipsAsync will throw if an error occurs
                AsyncPageable<BasicRelationship> rels = client.GetRelationshipsAsync<BasicRelationship>(dtId);
                List<BasicRelationship> results = new List<BasicRelationship>();
                await foreach (BasicRelationship rel in rels)
                {
                    results.Add(rel);
                    Console.WriteLine($"Found relationship-{rel.Name}->{rel.TargetId}");
                }

                return results;
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"*** Error {ex.Status}/{ex.ErrorCode} retrieving relationships for {dtId} due to {ex.Message}");
                return null;
            }
        }

        private static async Task<List<IncomingRelationship>> FindIncomingRelationshipsAsync(DigitalTwinsClient client, string dtId)
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
                    Console.WriteLine($"Found incoming relationship-{incomingRel.RelationshipId}");
                }
                return results;
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"*** Error {ex.Status}/{ex.ErrorCode} retrieving incoming relationships for {dtId} due to {ex.Message}");
                return null;
            }
        }

        private static async Task DeleteRelationship(DigitalTwinsClient client, string srcId, string relId)
        {
            try
            {
                Response response = await client.DeleteRelationshipAsync(srcId, relId);
                await FetchAndPrintTwinAsync(srcId, client);
                Console.WriteLine("Deleted relationship successfully");
            }
            catch (RequestFailedException Ex)
            {
                Console.WriteLine($"Error {Ex.ErrorCode}");
            }
        }
    }
}
```

Here is the console output of the above program: 

:::image type="content" source="./media/how-to-manage-graph/console-output-twin-graph.png" alt-text="Console output showing the twin details, incoming and outgoing relationships of the twins." lightbox="./media/how-to-manage-graph/console-output-twin-graph.png":::

> [!TIP]
> The twin graph is a concept of creating relationships between twins. If you want to view the visual representation of the twin graph, see the [*Visualization*](how-to-manage-graph.md#visualization) section of this article. 

### Create a twin graph from a spreadsheet

In practical use cases, twin hierarchies will often be created from data stored in a different database, or perhaps in a spreadsheet. This section illustrates how a spreadsheet can be parsed.

Consider the following data table, describing a set of digital twins and relationships to be created.

| Model ID| Twin ID (must be unique) | Relationship name | Target twin ID | Twin init data |
| --- | --- | --- | --- | --- |
| dtmi:example:Floor;1 | Floor1 |  contains | Room1 |{"Temperature": 80, "Humidity": 60}
| dtmi:example:Floor;1 | Floor0 |  has      | Room0 |{"Temperature": 70, "Humidity": 30}
| dtmi:example:Room;1  | Room1 | 
| dtmi:example:Room;1  | Room0 |

The following code uses the [Microsoft Graph API](/graph/overview) to read a spreadsheet and construct an Azure Digital Twins twin graph from the results.

```csharp
var range = msftGraphClient.Me.Drive.Items["BuildingsWorkbook"].Workbook.Worksheets["Building"].usedRange;
JsonDocument data = JsonDocument.Parse(range.values);
List<BasicRelationship> RelationshipRecordList = new List<BasicRelationship>();
foreach (JsonElement row in data.RootElement.EnumerateArray())
{
    string modelId = row[0].GetString();
    string sourceId = row[1].GetString();
    string relName = row[2].GetString();
    string targetId = row[3].GetString();
    string initData = row[4].GetString();
    
    // Parse spreadsheet extra data into a JSON string to initialize the digital twin
    // Left out for compactness
    Dictionary<string, object> initData = new Dictionary<string, object>() { ... };

    if (sourceId != null)
    {
        BasicRelationship br = new BasicRelationship()
        {
            SourceId = sourceId,
            TargetId = targetId,
            Name = relName
        };
        RelationshipRecordList.Add(br);
    }

    BasicDigitalTwin twin = new BasicDigitalTwin();
    twin.Contents = initData;
    // Set the type of twin to be created
    twin.Metadata = new DigitalTwinMetadata() { ModelId = modelId };
    
    try
    {
        await client.CreateOrReplaceDigitalTwinAsync<BasicDigitalTwin>(sourceId, twin);
    }
    catch (RequestFailedException e)
    {
       Console.WriteLine($"Error {e.Status}: {e.Message}");
    }
    foreach (BasicRelationship rec in RelationshipRecordList)
    { 
        try { 
            await client.CreateOrReplaceRelationshipAsync(rec.sourceId, Guid.NewGuid().ToString(), rec);
        }
        catch (RequestFailedException e)
        {
            Console.WriteLine($"Error {e.Status}: {e.Message}");
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