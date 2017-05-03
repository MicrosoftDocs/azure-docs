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
ms.date: 04/30/2017
ms.author: arramac

---
# Azure Cosmos DB: Connect to graph using .NET
This article provides an overview of how to work with graph APIs in Azure Cosmos DB using .NET. In this article, we cover:

* Setting up your development environment with Azure Cosmos DB graph APIs
* Using a collection to store graphs
* Adding, updating, and removing vertices and edges from the graph
* Performing queries and traversals using Gremlin

## Graphs in Azure Cosmos DB
You can use Azure Cosmos DB to create, update, and query graphs using the `Microsoft.Azure.Graphs` library. The library offers extension methods on top of the `DocumentClient` class to execute [Gremlin queries](gremlin-support.md). 

## Prerequisites
Please make sure you have the following:
* An active Azure account. If you don't have one, you can sign up for a [free account](https://azure.microsoft.com/free/). 
    * Alternatively, you can use the [Azure Cosmos DB Emulator](documentdb-nosql-local-emulator.md) for this tutorial.
* [Visual Studio 2013 / Visual Studio 2015](http://www.visualstudio.com/).

## Step 1: Create an Azure Cosmos DB account with Graph API
Let's create an Azure Cosmos DB account. If you already have an account you want to use, you can skip this step. If you are using the DocumentDB Emulator, please follow the steps at [Azure Cosmos DB Emulator](documentdb-nosql-local-emulator.md) to setup the emulator.

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/documentdb-create-dbaccount.md)]

## Step 2: Create an Azure Cosmos DB collection

Create a collection for storing graphs. You can configure the partition key, indexing policy, and provision collection throughput programmatically or [via the Azure portal](documentdb-create-collection.md).

## Step 3: Setup your Visual Studio solution

1. Open **Visual Studio 2015** on your computer.
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

## Step 4: Adding the contextual code
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

## Step 5: Serializing vertices and edges to .NET objects
Azure Cosmos DB uses the [GraphSON wire format](gremlin-support.md), which defines a JSON schema for vertices, edges, and properties. The Azure Cosmos DB .NET SDK includes JSON.NET as a dependency, and this allows us to serialize/deserialize GraphSON into .NET objects that we can work with in code.

As an example, let's work with a simple social network with four people. We look at how to create `Person` vertices, add `Knows` relationships between them, then query and traverse the graph to find "friend of friend" relationships. 

To start with, let's create some .NET classes to represent vertices and edges based on the GraphSON format (alternatively, you can skip this step to work with dynamics). The following class can be used for a vertex and property:

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

public class Property
{
    /// <summary>
    /// Gets or sets the key of the property.
    /// </summary>
    [JsonProperty("id")]
    public string Key { get; set; }

    /// <summary>
    /// Gets or sets the value of the property.
    /// </summary>
    [JsonProperty("value")]
    public object Value { get; set; }
}
``` 

## Adding vertices and edges

Let's create some vertices using Gremlin's `addV` method. We'll create four vertices for Thomas, Mary, Ben, and Robin. Add the following four queries to your dictionary of gremlin queries.

```cs
Dictionary<string, string> gremlinQueries = new Dictionary<string, string>
{
    { "Cleanup",        "g.V().drop()" },

    /* Add all Gremlin queries here */
    { "AddVertex 1",    "g.addV('person').property('id', 'thomas').property('firstName', 'Thomas').property('age', 44)" },
    { "AddVertex 2",    "g.addV('person').property('id', 'mary').property('firstName', 'Mary').property('lastName', 'Andersen').property('age', 39)" },
    { "AddVertex 3",    "g.addV('person').property('id', 'ben').property('firstName', 'Ben').property('lastName', 'Miller')" },
    { "AddVertex 4",    "g.addV('person').property('id', 'robin').property('firstName', 'Robin').property('lastName', 'Wakefield')" }
};
```

Let's create some edges between these vertices using Gremlin's `addE` method. Add the following four queries to your dictionary of gremlin queries.

```cs
{ "AddEdge 1",      "g.V('thomas').addE('knows').to(g.V('mary'))" },
{ "AddEdge 2",      "g.V('thomas').addE('knows').to(g.V('ben'))" },
{ "AddEdge 3",      "g.V('ben').addE('knows').to(g.V('robin'))" }
```

We can update an existing vertex by using `properties` step in Gremlin. 

```cs
// Update a vertex
{ "UpdateVertex",   "g.V('thomas').property('age', 44)" }
```

Press **F5** to run what we have until now to create your new vertices and edges.

## Querying the graph

You can perform queries and traversals also using Gremlin. Add the following query to your dictionary of gremlin queries to count the number of vertices:

```cs
// A query to count vertices
{ "CountVertices",  "g.V().count()" }
```

You can perform filters using Gremlin's `has` and `hasLabel` steps, and combine them using `and`, `or`, and `not` to build more complex filters:

```cs
// A query with filter
{ "Filter Range",   "g.V().hasLabel('person').has('age', gt(40))" }
```

You can project certain properties in the query results using the `values` step:

```cs
// A query with projection
{ "Project",        "g.V().hasLabel('person').values('firstName')" }
```

So far, we've only seen query operators that work in any database. Graphs are fast and efficient for traversal operations when you need to navigate to related edges and vertices. Let's find all friends of Thomas. We do this by using Gremlin's `outE` step to find all the out-edges from Thomas, then traversing to the in-vertices from those edges using Gremlin's `inV` step:

```cs
// Run a traversal (find friends of Thomas)
{ "Traverse",       "g.V('thomas').outE('knows').inV().hasLabel('person')" }
```

The next query performs two hops to find all of Thomas' "friends of friends", by calling `outE` and `inV` two times. 

```cs
// Run a traversal (find friends of friends of Thomas)
{ "Traverse 2x",    "g.V('thomas').outE('knows').inV().hasLabel('person').outE('knows').inV().hasLabel('person')" }
```

## Drop an edge and vertex

You can drop edges and vertices using Gremlin's `drop` step. Here's a snippet that shows how to delete a vertex and an edge. Note that dropping a vertex performs a cascading delete of the associated edges. Add the following query to your dictionary of gremlin queries to droip an edge, then a vertex.

```cs
// Drop an edge
{ "DropEdge",       "g.V('thomas').outE('knows').where(inV().has('id', 'mary')).drop()" },
{ "CountEdges",     "g.E().count()" },

// Drop a vertex
{ "DropVertex",     "g.V('thomas').drop()" }
```

You can build more complex queries and implement powerful graph traversal logic using Gremlin, including mixing filter expressions, performing looping using the `loop` step, and implementing conditional navigation using the `choose` step. Learn more about what you can do with [Gremlin support](gremlin-support.md)!

## Next Steps
* Read about [Gremlin support in Azure Azure Cosmos DB](gremlin-support.md)
* View the samples for [Graphs in .NET](graph-dotnet-samples.md)
* Download the [Graph .NET library and read release notes](https://aka.ms/graphdbextension)