---
title: Connect Azure Azure Cosmos DB to graph using .NET (C#) | Microsoft Docs
description: Presents a .NET code sample you can use to connect to and query Azure Azure Cosmos DB
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
# Azure Azure Cosmos DB: Connect to graph using .NET
This article provides an overview of how to work with graph APIs in Azure Azure Cosmos DB using .NET. In this article, we cover:

* Setting up your development environment with Azure Cosmos DB graph APIs
* Using a collection to store graphs
* Adding, updating, and removing vertices and edges from the graph
* Performing queries and traversals using Gremlin

## Graphs in Azure Cosmos DB
You can use Azure Cosmos DB to create, update, and query graphs using the `Microsoft.Azure.Graphs` library. The library offers extension methods on top of the `DocumentClient` class to execute [Gremlin queries](documentdb-gremlin-support.md). To work with the graph APIs, you must perform the following steps as a pre-requisite:

- Create a Azure Cosmos DB account. You can configure the endpoint name, associate any number of read and writes regions, and configure the default consistency level while creating the account. You can also use an existing Azure Cosmos DB account to work with graphs 
- Create a database
- Create a collection for storing graphs. You can configure the partition key, indexing policy, and provision collection throughput programmatically or via the Azure portal

Once you create the account, you can start working in .NET by downloading the [Microsoft.Azure.Azure Cosmos DB](documentdb-sdk-dotnet.md) package and the [Microsoft.Azure.Graph](https://aka.ms/graphdbextension) extension library, and include them within your project. The `Microsoft.Azure.Graph` library provides a single extension method `CreateGraphQuery` for executing Gremlin operations. Gremlin is a functional programming language that supports write operations (DML) and query and traversal operations. We cover a few examples in this article to get your started with Gremlin. [Gremlin queries](documentdb-gremlin-support.md) has a detailed walkthrough of Gremlin capabilities in Azure Cosmos DB.

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
* Read about [Gremlin support in Azure Azure Cosmos DB](documentdb-gremlin-support.md)
* View the samples for [Graphs in .NET](documentdb-graph-dotnet-samples.md)
* Download the [Graph .NET library and read release notes](https://aka.ms/graphdbextension)