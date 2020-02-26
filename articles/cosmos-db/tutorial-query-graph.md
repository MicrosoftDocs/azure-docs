---
title: How to query graph data in Azure Cosmos DB?
description: Learn how to query graph data from Azure Cosmos DB using Gremlin queries
author: luisbosquez
ms.author: lbosq
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: tutorial
ms.date: 12/03/2018
ms.reviewer: sngun
---

# Tutorial: Query Azure Cosmos DB Gremlin API by using Gremlin

The Azure Cosmos DB [Gremlin API](graph-introduction.md) supports [Gremlin](https://github.com/tinkerpop/gremlin/wiki) queries. This article provides sample documents and queries to get you started. A detailed Gremlin reference is provided in the [Gremlin support](gremlin-support.md) article.

This article covers the following tasks: 

> [!div class="checklist"]
> * Querying data with Gremlin

## Prerequisites

For these queries to work, you must have an Azure Cosmos DB account and have graph data in the container. Don't have any of those? Complete the [5-minute quickstart](create-graph-dotnet.md) or the [developer tutorial](tutorial-query-graph.md) to create an account and populate your database. You can run the following queries using the [Gremlin console](https://tinkerpop.apache.org/docs/current/reference/#gremlin-console), or your favorite Gremlin driver.

## Count vertices in the graph

The following snippet shows how to count the number of vertices in the graph:

```
g.V().count()
```

## Filters

You can perform filters using Gremlin's `has` and `hasLabel` steps, and combine them using `and`, `or`, and `not` to build more complex filters. Azure Cosmos DB provides schema-agnostic indexing of all properties within your vertices and degrees for fast queries:

```
g.V().hasLabel('person').has('age', gt(40))
```

## Projection

You can project certain properties in the query results using the `values` step:

```
g.V().hasLabel('person').values('firstName')
```

## Find related edges and vertices

So far, we've only seen query operators that work in any database. Graphs are fast and efficient for traversal operations when you need to navigate to related edges and vertices. Let's find all friends of Thomas. We do this by using Gremlin's `outE` step to find all the out-edges from Thomas, then traversing to the in-vertices from those edges using Gremlin's `inV` step:

```cs
g.V('thomas').outE('knows').inV().hasLabel('person')
```

The next query performs two hops to find all of Thomas' "friends of friends", by calling `outE` and `inV` two times. 

```cs
g.V('thomas').outE('knows').inV().hasLabel('person').outE('knows').inV().hasLabel('person')
```

You can build more complex queries and implement powerful graph traversal logic using Gremlin, including mixing filter expressions, performing looping using the `loop` step, and implementing conditional navigation using the `choose` step. Learn more about what you can do with [Gremlin support](gremlin-support.md)!

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Learned how to query using Graph 

You can now proceed to the Concepts section for more information about Cosmos DB.

> [!div class="nextstepaction"]
> [Global distribution](distribute-data-globally.md) 

