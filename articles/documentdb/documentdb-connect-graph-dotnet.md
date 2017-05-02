---
title: Connect Azure Cosmos DB to graph using .NET (C#) | Microsoft Docs
description: Presents a .NET code sample you can use to connect to and query Azure Cosmos DB
services: documentdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: daacbabf-1bb5-497f-92db-079910703046
ms.service: documentdb
ms.custom: quick start connect
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 04/26/2017
ms.author: arramac

---
# Azure Cosmos DB: Connect to graph using .NET
This article provides an overview of how to work with graph APIs in Azure Cosmos DB using .NET. In this article, we cover:

* Setting up your development environment with Azure Cosmos DB graph APIs
* Using a collection to store graphs
* Adding, updating, and removing vertices and edges from the graph
* Performing queries and traversals using Gremlin

## Graphs in Azure Cosmos DB
You can use Azure Cosmos DB to create, update, and query graphs using the `Microsoft.Azure.Graphs` library. The library offers extension methods on top of the `DocumentClient` class to execute [Gremlin queries](documentdb-gremlin-support.md).

## Prerequisites

Please make sure you have the following:
* An active Azure account. If you don't have one, you can sign up for a [free account](https://azure.microsoft.com/free/). 
    * Alternatively, you can use the [Azure Cosmos DB Emulator](documentdb-nosql-local-emulator.md) for this tutorial.
* [Visual Studio](http://www.visualstudio.com/).

## Create a database account

[!INCLUDE [documentdb-create-dbaccount](../../includes/documentdb-create-dbaccount.md)]

## Create a collection

You can now use Data Explorer to create a collection and add data to your database. 

1. In the Azure portal, in the navigation menu, under **Collections**, click **Data Explorer (Preview)**. 
2. In the Data Explorer blade, click **New Collection**, then fill in the page using the following information.
    * In the **Database id** box, enter *Items* as ID for your new database. Database names must be between 1 and 255 characters, and cannot contain `/ \ # ?` or a trailing space.
    * In the **Collection id** box, enter *ToDoList* as the ID for your new collection. Collection names have the same character requirements as database IDs.
    * In the **Storage Capacity** box, leave the default 10 GB selected.
    * In the **Throughput** box, leave the default 400 RUs selected. You can scale up the throughput later if you want to reduce latency.
    * In the **Partition key** box, for the purpose of this sample, enter the value */category*, so that tasks in the todo app you create can be partitioned by category. Selecting the correct partition key is important in creating a performant collection, read more about it in [Designing for partitioning](documentdb-partition-data.md#designing-for-partitioning).

   ![Data Explorer in the Azure portal](./media/documentdb-connect-graph-dotnet/azure-cosmosdb-data-explorer.png)

3. Once the form is filled out, click **OK**.

## Setup your Visual Studio solution

1. Open **Visual Studio** on your computer.
2. On the **File** menu, select **New**, and then choose **Project**.
3. In the **New Project** dialog, select **Templates** / **Visual C#** / **Console Application**, name your project, and then click **OK**.
   ![Screen shot of the New Project window](./media/documentdb-get-started/nosql-tutorial-new-project-2.png)
4. In the **Solution Explorer**, right click on your new console application, which is under your Visual Studio solution, and then click **Manage NuGet Packages...**

    ![Screen shot of the Right Clicked Menu for the Project](./media/documentdb-get-started/nosql-tutorial-manage-nuget-pacakges.png)
5. In the **Nuget** tab, click **Browse**, and type **azure document db** in the search box.
6. Within the results, find **Microsoft.Azure.DocumentDB** and click **Install**.
   The package ID for the DocumentDB Client Library is [Microsoft.Azure.DocumentDB](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB).
   ![Screen shot of the Nuget Menu for finding DocumentDB Client SDK](./media/documentdb-get-started/nosql-tutorial-manage-nuget-pacakges-2.png)

    If you get a messages about reviewing changes to the solution, click **OK**. If you get a message about license acceptance, click **I accept**.
7. In the **Nuget** tab, click **Browse**, and type **azure graph** in the search box.
8. Within the results, find **Microsoft.Azure.Graph** and click **Install**.
   The package ID for the Graph Client Library is [Microsoft.Azure.Graph]().
   ![Screen shot of the Nuget Menu for finding Graph Client SDK](./media/documentdb-get-started/nosql-tutorial-manage-nuget-pacakges-2.png)

    If you get a messages about reviewing changes to the solution, click **OK**. If you get a message about license acceptance, click **I accept**.

Great! Now that we finished the setup, let's start writing some code. You can find a completed code project of this tutorial at [GitHub](https://github.com/Azure-Samples/azure-cosmos-db-graph-dotnet-getting-started/blob/master/Program.cs).

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app.

1. In the [Azure portal](http://portal.azure.com/), in your Azure Cosmos DB account, in the left navigation click **Keys**. You'll use the copy buttons on the right side of the screen to copy the URI and Primary Key into the web.config file in the next step.

    ![View and copy an access key in the Azure Portal, Keys blade](./media/documentdb-connect-dotnet/keys.png)

2. In Visual Studio 2017, open the web.config file. 

3. Copy your URI value from the portal (using the copy button) and make it the value of the endpoint key in web.config. 

    `<add key="endpoint" value="FILLME" />`

4. Then copy your PRIMARY KEY value from the portal and make it the value of the authKey in web.config. You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 

    `<add key="authKey" value="FILLME" />`
    

## Add the contextual code
The `Microsoft.Azure.Graph` library provides a single extension method `CreateGraphQuery` for executing Gremlin operations. Let's begin by adding the following setup to code before we dive into the Gremlin queries.

```cs
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Threading.Tasks;

using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.Graph;
using Newtonsoft.Json;

/// <summary>
/// Sample program that shows how to get started with the Graph (Gremlin) APIs for Azure Cosmos DB.
/// </summary>
public class Program
{
    /// <summary>
    /// Runs some Gremlin commands on the console.
    /// </summary>
    /// <param name="args">command-line arguments</param>
    public static void Main(string[] args)
    {
        string endpoint = ConfigurationManager.AppSettings["Endpoint"];
        string authKey = ConfigurationManager.AppSettings["AuthKey"];

        using (DocumentClient client = new DocumentClient(
            new Uri(endpoint),
            authKey,
            new ConnectionPolicy { ConnectionMode = ConnectionMode.Direct, ConnectionProtocol = Protocol.Tcp }))
        {
            Program p = new Program();
            p.RunAsync(client).Wait();
        }
    }

    /// <summary>
    /// Run the get started application.
    /// </summary>
    /// <param name="client">The DocumentDB client instance</param>
    /// <returns>A Task for asynchronous execuion.</returns>
    public async Task RunAsync(DocumentClient client)
    {
        Database database = await client.CreateDatabaseIfNotExistsAsync(new Database { Id = "graphdb" });

        DocumentCollection graph = await client.CreateDocumentCollectionIfNotExistsAsync(
            UriFactory.CreateDatabaseUri("graphdb"),
            new DocumentCollection { Id = "graphcoll" },
            new RequestOptions { OfferThroughput = 1000 });

        Dictionary<string, string> gremlinQueries = new Dictionary<string, string>
        {
            { "Cleanup",        "g.V().drop()" }
            /* Add all Gremlin queries here */
        };

        foreach (KeyValuePair<string, string> gremlinQuery in gremlinQueries)
        {
            Console.WriteLine($"Running {gremlinQuery.Key}: {gremlinQuery.Value}");

            // The CreateGremlinQuery method extensions allow you to execute Gremlin queries and iterate
            // results asychronously
            IDocumentQuery<dynamic> query = client.CreateGremlinQuery<dynamic>(graph, gremlinQuery.Value);
            while (query.HasMoreResults)
            {
                foreach (dynamic result in await query.ExecuteNextAsync())
                {
                    Console.WriteLine($"\t {JsonConvert.SerializeObject(result)}");
                }
            }

            Console.WriteLine();
        }

        Console.WriteLine();

        Console.WriteLine("Done. Press any key to exit...");
        Console.ReadLine();
    }
}
```
## Build and deploy the web app
1. In Visual Studio, right-click on the project in **Solution Explorer** and then click **Manage NuGet Packages**. 

2. In the NuGet **Browse** box, type ***Azure DocumentDB***.

3. From the results, install the **.NET Client library for Azure DocumentDB**. This installs the DocumentDB package as well as all dependencies.

4. Click CTRL + F5 to run the application. Your app displays in your browser. 

5. Click **Create New** in the browser and create a few new tasks in your to-do app.

   ![Todo app with sample data](./media/documentdb-connect-dotnet/azure-documentdb-todo-app-list.png)

You can now go back to Data Explorer and see query, modify, and work with this new data. 

## Serializing vertices and edges to .NET objects
Azure Cosmos DB uses the [GraphSON wire format](documentdb-gremlin-support.md), which defines a JSON schema for vertices, edges, and properties. The Azure Cosmos DB .NET SDK includes JSON.NET as a dependency, and this allows us to serialize/deserialize GraphSON into .NET objects that we can work with in code.

As an example, let's work with a simple social network with four people. We look at how to create `Person` vertices, add `Knows` relationships between them, then query and traverse the graph to find "friend of friend" relationships. 

To start with, let's create some .NET classes to represent vertices and edges based on the GraphSON format (alternatively, you can skip this step to work with dynamics). The following class can be used for a vertex:

```cs
public class Vertex
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("label")]
    public string Label { get; set; }

    [JsonProperty("properties")]
    public Dictionary<string, List<Property>> Properties { get; set; }
}
```

## Adding vertices and edges

Let's create some vertices using Gremlin's `addV` method. Here's a snippet that shows how to create a vertex for "Thomas Andersen" with properties for first name, last name, and age.

```cs
// Create a vertex
IDocumentQuery<Vertex> createVertexQuery = client.CreateGremlinQuery<Vertex>(
    graphCollection, 
    "g.addV('person').property('firstName', 'Thomas')");

while (createVertexQuery.HasMoreResults)
{
    Vertex thomas = (await create.ExecuteNextAsync<Vertex>()).First();
}
```

Let's create some edges between these vertices using Gremlin's `addE` method. 

```cs
// Add a "knows" edge
IDocumentQuery<Edge> createEdgeQuery = client.CreateGremlinQuery<Edge>(
    graphCollection, 
    $"g.V('{thomas.Id}').addE('knows').to(g.V('{mary.Id}'))");

while (create.HasMoreResults)
{
    Edge thomasKnowsMaryEdge = (await create.ExecuteNextAsync<Edge>()).First();
}
```

We can update an existing vertex by using `properties` step in Gremlin. We skip the call to execute the query via `HasMoreResults` and `ExecuteNextAsync` for the rest of the examples.

```cs
// Update a vertex
client.CreateGremlinQuery<Vertex>(graphCollection, $"g.V('{thomas.Id}').property('age', 45)");
```

You can drop edges and vertices using Gremlin's `drop` step. Here's a snippet that shows how to delete a vertex and an edge. Note that dropping a vertex performs a cascading delete of the associated edges.

```cs
// Drop an edge
client.CreateGremlinQuery(graphCollection, $"g.E('{thomasKnowsRobin.Id}').drop()");

// Drop a vertex
client.CreateGremlinQuery(graphCollection, $"g.V('{robin.Id}').drop()");
```

## Querying the graph

You can perform queries and traversals also using Gremlin. For example, the following snippet shows how to count the number of vertices in the graph:

```cs
// Run a query to count vertices
IDocumentQuery<int> countQuery = client.CreateGremlinQuery<int>(graphCollection, "g.V().count()");
```
You can perform filters using Gremlin's `has` and `hasLabel` steps, and combine them using `and`, `or`, and `not` to build more complex filters:

```cs
// Run a query with filter
IDocumentQuery<Vertex> personsByAge = client.CreateGremlinQuery<Vertex>(
  graphCollection, 
  $"g.V().hasLabel('person').has('age', gt(40))");
```

You can project certain properties in the query results using the `values` step:

```cs
// Run a query with projection
IDocumentQuery<string> firstNames = client.CreateGremlinQuery<string>(
  graphCollection, 
  $"g.V().hasLabel('person').values('firstName')");
```

So far, we've only seen query operators that work in any database. Graphs are fast and efficient for traversal operations when you need to navigate to related edges and vertices. Let's find all friends of Thomas. We do this by using Gremlin's `outE` step to find all the out-edges from Thomas, then traversing to the in-vertices from those edges using Gremlin's `inV` step:

```cs
// Run a traversal (find friends of Thomas)
IDocumentQuery<Vertex> friendsOfThomas = client.CreateGremlinQuery<Vertex>(
  graphCollection,
  $"g.V('{thomas.Id}').outE('knows').inV().hasLabel('person')");
```

The next query performs two hops to find all of Thomas' "friends of friends", by calling `outE` and `inV` two times. 

```cs
// Run a traversal (find friends of friends of Thomas)
IDocumentQuery<Vertex> friendsOfFriendsOfThomas = client.CreateGremlinQuery<Vertex>(
  graphCollection,
  $"g.V('{thomas.Id}').outE('knows').inV().hasLabel('person').outE('knows').inV().hasLabel('person')");
```

You can build more complex queries and implement powerful graph traversal logic using Gremlin, including mixing filter expressions, performing looping using the `loop` step, and implementing conditional navigation using the `choose` step. Learn more about what you can do with [Gremlin support](documentdb-gremlin-support.md)!

## Next Steps
* Read about [Gremlin support in Azure Cosmos DB](documentdb-gremlin-support.md)
* View the samples for [Graphs in .NET](documentdb-graph-dotnet-samples.md)
* Download the [Graph .NET library and read release notes](https://aka.ms/graphdbextension)