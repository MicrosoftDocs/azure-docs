---
title: DocumentDB: Azure Cosmos DB Gremlin support | Microsoft Docs
description: Learn about the Gremlin language, which features and steps and available in Azure Cosmos DB 
services: documentdb
documentationcenter: ''
author: arramac
manager: jhubbard
editor: ''
tags: ''

ms.assetid: 
ms.service: documentdb
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 04/27/2017
ms.author: arramac

---

# Azure Cosmos DB Gremlin graph support
Azure Cosmos DB supports a [Gremlin]([Gremlin language](http://tinkerpop.apache.org/docs/current/reference/#graph-traversal-steps)) Graph API for creating graph entities, and performing graph query and traversal operations. You can use the Gremlin language to create graph entities (vertices and edges), modify properties within those entities, perform queries and traversals, and delete entities. 

Azure Cosmos DB brings enterprise-ready features to graph databases. This includes global distribution, independent scaling of storage and throughput, predictable single-digit millisecond latencies, automatic indexing, and 99.99% SLAs. Because Azure Cosmos DB supports TinkerPop/Gremlin, you can easily migrate applications written using another graph database without having to make code changes. Additionally, by virtue of Gremlin support, Azure Cosmos DB seamlessly integrates with TinkerPop-enabled analytics frameworks like [Apache Spark GraphX](http://spark.apache.org/graphx/). 

In this article, we provide a quick walkthrough of Gremlin, and enumerate the Gremlin features and steps that are supported in the preview of Graph API support.

## Gremlin by example
Let's use a sample graph to understand how queries can be expressed in Gremlin. The following figure shows a business application that manages data about users, interests, and devices in the form of a graph.  

![Sample database showing persons, devices, and interests](./media/documentdb-graph-introduction/sample-graph.png) 

This graph has the following vertex types (called "label" in Gremlin):

- People: the graph has three people, Robin, Thomas, and Ben
- Interests: their interests, in this example, the game of Football
- Devices: the devices that people use
- Operating Systems: the operating systems that the devices run on

We represent the relationships between these entities via the following edge types/labels:

- Knows: For example, "Thomas knows Robin"
- Interested: To represent the interests of the people in our graph, for example, "Ben is interested in Football"
- RunsOS: Laptop runs the Windows OS
- Uses: To represent which device a person uses. For example, Robin uses a Motorola phone with serial number 77

Let's run some operations against this graph using the [Gremlin console](http://tinkerpop.apache.org/docs/current/reference/#gremlin-console). You can also perform these operations using Gremlin drivers in the platform of your choice (Java, Node.js, Python, or .NET).  Before we look at what's supported in Azure Cosmos DB, let's look at a few examples to get familiar with the syntax.

First let's look at CRUD. The following Gremlin statement inserts the "Thomas" vertex into the graph:

```
:> g.addV('person').property('id', 'thomas.1').property('firstName', 'Thomas').property('lastName', 'Andersen').property('age', 44)
```

Next, the following Gremlin statement inserts a "knows" edge between Thomas and Robin.

```
:> g.V('thomas.1').addE('knows').to(g.V('robin.1'))
```

The following query returns the "person" vertices in descending order of their first names:
```
:> g.V().hasLabel('person').order().by('firstName', decr)
```

Where graphs shine is when you need to answer questions like "What operating systems do friends of Thomas use?". You can run this simple Gremlin traversal to get that information from the graph:

```
:> g.V('thomas.1').out('knows').out('uses').out('runsos').group().by('name').by(count())
```
Now let's look at what Azure Cosmos DB provides for Gremlin developers.

## Gremlin features
TinkerPop is a standard that covers a wide range of graph technologies. Therefore, it has standard terminology to describe what features are provided by a graph provider. Azure Cosmos DB provides a persistent, high concurrency, writeable graph database that can be partitioned across multiple servers or clusters. 

The following table lists the TinkerPop features that are implemented by Azure Cosmos DB: 

| Category | Azure Cosmos DB implementation |  Notes | 
| --- | --- | --- |
| Graph features | Provides Persistence and ConcurrentAccess in preview. Designed to support Transactions | Computer methods can be implemented via the Spark connector. |
| Variable features | Supports Boolean, Integer, Byte, Double, Float, Integer, Long, String | Supports primitive types, is compatible with complex types via data model |
| Vertex features | Supports RemoveVertices, MetaProperties, AddVertices, MultiProperties, StringIds, UserSuppliedIds, AddProperty, RemoveProperty  | Supports creating, modifying, and deleting vertices |
| Vertex property features | StringIds, UserSuppliedIds, AddProperty, RemoveProperty, BooleanValues, ByteValues, DoubleValues, FloatValues, IntegerValues, LongValues, StringValues | Supports creating, modifying, and deleting vertex properties |
| Edge features | AddEges, RemoveEdges, StringIds, UserSuppliedIds, AddProperty, RemoveProperty | Supports creating, modifying, and deleting edges |
| Edge property features | Properties, BooleanValues, ByteValues, DoubleValues, FloatValues, IntegerValues, LongValues, StringValues | Supports creating, modifying, and deleting edge properties |

## Gremlin partitioning

In Azure Cosmos DB, graphs are stored within containers that can scale independently in terms of storage and throughput (expressed in normalized requests per second). Each collection must define an optional, but recommended partition key property that determines a logical partition boundary for related data. Every vertex/edge must have an `id` property that is unique for entities within that partition key value. The details are covered in [Partitioning in Azure Cosmos DB](documentdb-partition-data.md).

Gremlin operations work seamlessly across graph data that span multiple partitions in Azure Cosmos DB. However, it is recommended to choose a partition key for your graphs that is commonly used as a filter in queries, has many distinct values, and similar frequency of access these values. 

## Gremlin steps
Now let's look at the Gremlin steps supported by Azure Cosmos DB. For a complete reference on Gremlin, see [TinkerPop reference](http://tinkerpop.apache.org/docs/current/reference).

| step | Description |
| --- | --- |
| `addE` | Adds an edge between two vertices |
| `addV` | Adds a vertex to the graph |
| `as` | A step modulator to assign a variable to the output of a step|
| `by` | A step modulator used with `group` and `order` |
| `coalesce` | Returns the first traversal that returns a result |
| `constant` | Returns a constant value. Used with `coalesce`|
| `count` | Returns the count from the traversal |
| `dedup` | Returns the values with the duplicates removed |
| `drop` | Drops the values (vertex/edge) |
| `fold` | Acts as a barrier that computes the aggregate of results|
| `group` | Groups the values based on the labels specified|
| `has` | Used to filter properties, vertices, and edges. Supports `hasLabel`, `hasId`, `hasNot`, and `has` variants. |
| `inject` | Inject values into a stream|
| `is` | Used to perform a filter using a boolean expression |
| `limit` | Used to limit number of items in the traversal|
| `local` | Local wraps a section of a traversal, similar to a subquery |
| `not` | Used to produce the negation of a filter |
| `optional` | Returns the result of the specified traversal if it yields a result else it returns the calling element |
| `or` | Ensures at least one of the traversals returns a value |
| `order` | Returns results in the specified sort order |
| `path` | Returns the full path of the traversal |
| `project` | Projects the properties as a Map |
| `properties` | Returns the properties for the specified labels |
| `range` | Filters to the specified range of values|
| `repeat` | Repeats the step for the specified number of times. Used for looping |
| `sample` | Used to sample results from the traversal |
| `select` | Used to project results from the traversal | 
| `store` | Used for non-blocking aggregates from the traversal |
| `tree` | Aggregate paths from a vertex into a tree |
| `unfold` | Unroll an iterator as a step|
| `union` | Merge results from multiple traversals|
| `V` | Includes the steps necessary for traversals between vertices and edges `V`, `E`, `out`, `in`, `both`, `outE`, `inE`, `bothE`, `outV`, `inV`, `bothV`, and `otherV` for |
| `where` | Used to filter results from the traversal. Supports `eq`, `neq`, `lt`, `lte`, `gt`, `gte`, and `between` operators  |

Azure Cosmos DB's write-optimized engine supports automatic indexing of all properties within vertices and edges by default. Therefore, queries with filters, range queries, sorting, or aggregates on any property are processed from the index, and served efficiently. For more information on how indexing works in Azure Cosmos DB, see our paper on [schema-agnostic indexing](http://www.vldb.org/pvldb/vol8/p1668-shukla.pdf).

## Next Steps
* Get started building a graph application [using our SDKs](documentdb-connect-graph-dotnet.md) 
* Learn more about [Azure Cosmos DB's graph support](documentdb-graph-introduction.md)
