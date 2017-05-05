---
title: How to query graph data in Azure Cosmos DB? | Microsoft Docs
description: Learn to query graph data in Azure Cosmos DB
services: cosmosdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''
tags: ''

ms.assetid: 
ms.service: cosmosdb
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 05/10/2017
ms.author: mimig

---

# Azure Cosmos DB: How to query with the Graph API?

The Azure Cosmos DB [Graph API](graph-introduction.md) supports Gremlin queries. This article provides a few graph queries to get you started. 

For more information about Gremlin queries, see the [Gremlin support](gremlin-support.md) article. 

## Prerequisites

For these queries to work, you must have an Azure Cosmos DB account and have graph created. Don't have any of those? Complete the [5-minute quickstart](create-graph-dotnet.md) or the [developer tutorial](tutorial-query-graph.md) to create an account and populate your graph.

## Count vertices in the graph

The following snippet shows how to count the number of vertices in the graph:

```cs
// Run a query to count vertices
IDocumentQuery<int> countQuery = client.CreateGremlinQuery<int>(graphCollection, "g.V().count()");
```
## Filters

You can perform filters using Gremlin's `has` and `hasLabel` steps, and combine them using `and`, `or`, and `not` to build more complex filters:

```cs
// Run a query with filter
IDocumentQuery<Vertex> personsByAge = client.CreateGremlinQuery<Vertex>(
  graphCollection, 
  $"g.V().hasLabel('person').has('age', gt(40))");
```

## Projection

You can project certain properties in the query results using the `values` step:

```cs
// Run a query with projection
IDocumentQuery<string> firstNames = client.CreateGremlinQuery<string>(
  graphCollection, 
  $"g.V().hasLabel('person').values('firstName')");
```

## Find related edges and vertices

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

You can build more complex queries and implement powerful graph traversal logic using Gremlin, including mixing filter expressions, performing looping using the `loop` step, and implementing conditional navigation using the `choose` step. Learn more about what you can do with [Gremlin support](gremlin-support.md)!

## Clean up resources

If you're not going to continue to use this app, use the following steps to delete all resources created by this quickstart in the Azure portal. 

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

In this tutorial, you've learned how to query graph data using Gremlin. You can now distribute data globally using the portal or install the Local emulator for local development.  

[Distribute your data globally](../documentdb/documentdb-portal-global-replication.md)

[Develop locally](../documentdb/documentdb-nosql-local-emulator.md)