---
title: 'Azure Cosmos DB: Develop with the Graph API in .NET | Microsoft Docs'
description: Learn how to develop with Azure Cosmos DB's DocumentDB API using .NET
services: cosmos-db
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: cc8df0be-672b-493e-95a4-26dd52632261
ms.service: cosmos-db
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 05/10/2017
ms.author: arramac
ms.custom: mvc
---
# Azure Cosmos DB: Develop with the Graph API in .NET
Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This tutorial demonstrates how to create an Azure Cosmos DB account using the Azure portal and how to create a graph database and container. The application then creates a simple social network with four people using the [Graph API](graph-sdk-dotnet.md) (preview), then traverses and queries the graph using Gremlin.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Create an Azure Cosmos DB account 
> * Create a graph database and container
> * Serialize vertices and edges to .NET objects
> * Add vertices and edges
> * Query the graph using Gremlin

## Graphs in Azure Cosmos DB
You can use Azure Cosmos DB to create, update, and query graphs using the [Microsoft.Azure.Graphs](graph-sdk-dotnet.md) library. The Microsoft.Azure.Graph library provides a single extension method `CreateGremlinQuery<T>` on top of the `DocumentClient` class to execute Gremlin queries.

Gremlin is a functional programming language that supports write operations (DML) and query and traversal operations. We cover a few examples in this article to get your started with Gremlin. See [Gremlin queries](gremlin-support.md) for a detailed walkthrough of Gremlin capabilities available in Azure Cosmos DB. 

## Prerequisites
Please make sure you have the following:

* An active Azure account. If you don't have one, you can sign up for a [free account](https://azure.microsoft.com/free/). 
    * Alternatively, you can use the [Azure DocumentDB Emulator](local-emulator.md) for this tutorial.
* [Visual Studio](http://www.visualstudio.com/).

## Create database account

Let's start by creating an Azure Cosmos DB account in the Azure portal.  

> [!TIP]
> * Already have an Azure Cosmos DB account? If so, skip ahead to [Set up your Visual Studio solution](#SetupVS)
> * Did you have an Azure DocumentDB account? If so, your account is now an Azure Cosmos DB account and you can skip ahead to [Set up your Visual Studio solution](#SetupVS).  
> * If you are using the Azure Cosmos DB Emulator, please follow the steps at [Azure Cosmos DB Emulator](local-emulator.md) to setup the emulator and skip ahead to [Set up your Visual Studio Solution](#SetupVS). 
>
> 

[!INCLUDE [cosmos-db-create-dbaccount-graph](../../includes/cosmos-db-create-dbaccount-graph.md)]

## <a id="SetupVS"></a>Set up your Visual Studio solution
1. Open **Visual Studio** on your computer.
2. On the **File** menu, select **New**, and then choose **Project**.
3. In the **New Project** dialog, select **Templates** / **Visual C#** / **Console App (.NET Framework)**, name your project, and then click **OK**.
4. In the **Solution Explorer**, right click on your new console application, which is under your Visual Studio solution, and then click **Manage NuGet Packages...**
5. In the **NuGet** tab, click **Browse**, and type **Microsoft.Azure.Graphs** in the search box, and check the **Include prerelease versions**.
6. Within the results, find **Microsoft.Azure.Graphs** and click **Install**.
   
   If you get a message about reviewing changes to the solution, click **OK**. If you get a message about license acceptance, click **I accept**.
   
    The `Microsoft.Azure.Graphs` library provides a single extension method `CreateGremlinQuery<T>` for executing Gremlin operations. Gremlin is a functional programming language that supports write operations (DML) and query and traversal operations. We cover a few examples in this article to get your started with Gremlin. [Gremlin queries](gremlin-support.md) has a detailed walkthrough of Gremlin capabilities in Azure Cosmos DB.

## <a id="add-references"></a>Connect your app

Add these two constants and your *client* variable in your application. 

```csharp
string endpoint = ConfigurationManager.AppSettings["Endpoint"]; 
string authKey = ConfigurationManager.AppSettings["AuthKey"]; 
``` 
Next, head back to the [Azure portal](https://portal.azure.com) to retrieve your endpoint URL and primary key. The endpoint URL and primary key are necessary for your application to understand where to connect to, and for Azure Cosmos DB to trust your application's connection. 

In the Azure portal, navigate to your Azure Cosmos DB account, click **Keys**, and then click **Read-write Keys**. 

Copy the URI from the portal and paste it over `Endpoint` in the endpoint property above. Then copy the PRIMARY KEY from the portal and paste it into the `AuthKey` property above. 

![Screen shot of the Azure portal used by the tutorial to create a C# application. Shows an Azure Cosmos DB account the KEYS button highlighted on the Azure Cosmos DB navigation , and the URI and PRIMARY KEY values highlighted on the Keys blade][keys] 
 
## <a id="instantiate"></a>Instantiate the DocumentClient 
Next, create a new instance of the **DocumentClient**.  

```csharp 
DocumentClient client = new DocumentClient(new Uri(endpoint), authKey); 
``` 

## <a id="create-database"></a>Create a database 

Now, create an Azure Cosmos DB [database](documentdb-resources.md#databases) by using the [CreateDatabaseAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdatabaseasync.aspx) method or [CreateDatabaseIfNotExistsAsync](https://msdn.microsoft.com/library/microsoft.azure.documents.client.documentclient.createdatabaseifnotexistsasync.aspx) method of the **DocumentClient** class from the [DocumentDB .NET SDK](documentdb-sdk-dotnet.md).  

```csharp 
Database database = await client.CreateDatabaseIfNotExistsAsync(new Database { Id = "graphdb" }); 
``` 
 
## Create a graph 

Next, create a graph container by using the using the [CreateDocumentCollectionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentcollectionasync.aspx) method or [CreateDocumentCollectionIfNotExistsAsync](https://msdn.microsoft.com/library/microsoft.azure.documents.client.documentclient.createdocumentcollectionifnotexistsasync.aspx) method of the **DocumentClient** class. A collection is a container of graph entities. 

```csharp 
DocumentCollection graph = await client.CreateDocumentCollectionIfNotExistsAsync( 
    UriFactory.CreateDatabaseUri("graphdb"), 
    new DocumentCollection { Id = "graphcollz" }, 
    new RequestOptions { OfferThroughput = 1000 }); 
``` 

## <a id="serializing"></a>Serialize vertices and edges to .NET objects
Azure Cosmos DB uses the [GraphSON wire format](gremlin-support.md), which defines a JSON schema for vertices, edges, and properties. The Azure Cosmos DB .NET SDK includes JSON.NET as a dependency, and this allows us to serialize/deserialize GraphSON into .NET objects that we can work with in code.

As an example, let's work with a simple social network with four people. We look at how to create `Person` vertices, add `Knows` relationships between them, then query and traverse the graph to find "friend of friend" relationships. 

The `Microsoft.Azure.Graphs.Elements` namespace provides `Vertex`, `Edge`, `Property` and `VertexProperty` classes for deserializing GraphSON responses to well-defined .NET objects.

## Run Gremlin using CreateGremlinQuery
Gremlin, like SQL, supports read, write, and query operations. For example, the following snippet shows how to create vertices, edges, perform some sample queries using `CreateGremlinQuery<T>`, and asynchronously iterate through these results using `ExecuteNextAsync` and `HasMoreResults.

```cs
Dictionary<string, string> gremlinQueries = new Dictionary<string, string>
{
    { "Cleanup",        "g.V().drop()" },
    { "AddVertex 1",    "g.addV('person').property('id', 'thomas').property('firstName', 'Thomas').property('age', 44)" },
    { "AddVertex 2",    "g.addV('person').property('id', 'mary').property('firstName', 'Mary').property('lastName', 'Andersen').property('age', 39)" },
    { "AddVertex 3",    "g.addV('person').property('id', 'ben').property('firstName', 'Ben').property('lastName', 'Miller')" },
    { "AddVertex 4",    "g.addV('person').property('id', 'robin').property('firstName', 'Robin').property('lastName', 'Wakefield')" },
    { "AddEdge 1",      "g.V('thomas').addE('knows').to(g.V('mary'))" },
    { "AddEdge 2",      "g.V('thomas').addE('knows').to(g.V('ben'))" },
    { "AddEdge 3",      "g.V('ben').addE('knows').to(g.V('robin'))" },
    { "UpdateVertex",   "g.V('thomas').property('age', 44)" },
    { "CountVertices",  "g.V().count()" },
    { "Filter Range",   "g.V().hasLabel('person').has('age', gt(40))" },
    { "Project",        "g.V().hasLabel('person').values('firstName')" },
    { "Sort",           "g.V().hasLabel('person').order().by('firstName', decr)" },
    { "Traverse",       "g.V('thomas').outE('knows').inV().hasLabel('person')" },
    { "Traverse 2x",    "g.V('thomas').outE('knows').inV().hasLabel('person').outE('knows').inV().hasLabel('person')" },
    { "Loop",           "g.V('thomas').repeat(out()).until(has('id', 'robin')).path()" },
    { "DropEdge",       "g.V('thomas').outE('knows').where(inV().has('id', 'mary')).drop()" },
    { "CountEdges",     "g.E().count()" },
    { "DropVertex",     "g.V('thomas').drop()" },
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
```

## Add vertices and edges

Let's look at the Gremlin statements shown in the preceding section more detail. First we some vertices using Gremlin's `addV` method. For example, the following snippet creates a "Thomas Andersen" vertex of type "Person", with properties for first name, last name, and age.

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

Then we create some edges between these vertices using Gremlin's `addE` method. 

```cs
// Add a "knows" edge
IDocumentQuery<Edge> createEdgeQuery = client.CreateGremlinQuery<Edge>(
    graphCollection, 
    "g.V('thomas').addE('knows').to(g.V('mary'))");

while (create.HasMoreResults)
{
    Edge thomasKnowsMaryEdge = (await create.ExecuteNextAsync<Edge>()).First();
}
```

We can update an existing vertex by using `properties` step in Gremlin. We skip the call to execute the query via `HasMoreResults` and `ExecuteNextAsync` for the rest of the examples.

```cs
// Update a vertex
client.CreateGremlinQuery<Vertex>(
    graphCollection, 
    "g.V('thomas').property('age', 45)");
```

You can drop edges and vertices using Gremlin's `drop` step. Here's a snippet that shows how to delete a vertex and an edge. Note that dropping a vertex performs a cascading delete of the associated edges.

```cs
// Drop an edge
client.CreateGremlinQuery(graphCollection, "g.E('thomasKnowsRobin').drop()");

// Drop a vertex
client.CreateGremlinQuery(graphCollection, "g.V('robin').drop()");
```

## Query the graph

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
  "g.V().hasLabel('person').has('age', gt(40))");
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
  "g.V('thomas').outE('knows').inV().hasLabel('person')");
```

The next query performs two hops to find all of Thomas' "friends of friends", by calling `outE` and `inV` two times. 

```cs
// Run a traversal (find friends of friends of Thomas)
IDocumentQuery<Vertex> friendsOfFriendsOfThomas = client.CreateGremlinQuery<Vertex>(
  graphCollection,
  "g.V('thomas').outE('knows').inV().hasLabel('person').outE('knows').inV().hasLabel('person')");
```

You can build more complex queries and implement powerful graph traversal logic using Gremlin, including mixing filter expressions, performing looping using the `loop` step, and implementing conditional navigation using the `choose` step. Learn more about what you can do with [Gremlin support](gremlin-support.md)!

That's it, this Azure Cosmos DB tutorial is complete! 

## Clean up resources

If you're not going to continue to use this app, use the following steps to delete all resources created by this tutorial in the Azure portal.  

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next Steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Created an Azure Cosmos DB account 
> * Created a graph database and container
> * Serialized vertices and edges to .NET objects
> * Added vertices and edges
> * Queried the graph using Gremlin

You can now build more complex queries and implement powerful graph traversal logic using Gremlin. 

> [!div class="nextstepaction"]
> [Query using Gremlin](tutorial-query-graph.md)
