---
title: Azure Cosmos DB Gremlin support
description: Learn about the Gremlin language from Apache TinkerPop. Learn which features and steps are available in Azure Cosmos DB 
author: LuisBosquez
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: overview
ms.date: 06/24/2019
ms.author: lbosq
---

# Azure Cosmos DB Gremlin graph support
Azure Cosmos DB supports [Apache Tinkerpop's](https://tinkerpop.apache.org) graph traversal language, known as [Gremlin](https://tinkerpop.apache.org/docs/3.3.2/reference/#graph-traversal-steps). You can use the Gremlin language to create graph entities (vertices and edges), modify properties within those entities, perform queries and traversals, and delete entities. 

In this article, we provide a quick walkthrough of Gremlin and enumerate the Gremlin features that are supported by the Gremlin API.

## Compatible client libraries

The following table shows popular Gremlin drivers that you can use against Azure Cosmos DB:

| Download | Source | Getting Started | Supported connector version |
| --- | --- | --- | --- |
| [.NET](https://tinkerpop.apache.org/docs/3.3.1/reference/#gremlin-DotNet) | [Gremlin.NET on GitHub](https://github.com/apache/tinkerpop/tree/master/gremlin-dotnet) | [Create Graph using .NET](create-graph-dotnet.md) | 3.4.0-RC2 |
| [Java](https://mvnrepository.com/artifact/com.tinkerpop.gremlin/gremlin-java) | [Gremlin JavaDoc](https://tinkerpop.apache.org/javadocs/current/full/) | [Create Graph using Java](create-graph-java.md) | 3.2.0+ |
| [Node.js](https://www.npmjs.com/package/gremlin) | [Gremlin-JavaScript on GitHub](https://github.com/jbmusso/gremlin-javascript) | [Create Graph using Node.js](create-graph-nodejs.md) | 3.3.4+ |
| [Python](https://tinkerpop.apache.org/docs/3.3.1/reference/#gremlin-python) | [Gremlin-Python on GitHub](https://github.com/apache/tinkerpop/tree/master/gremlin-python) | [Create Graph using Python](create-graph-python.md) | 3.2.7 |
| [PHP](https://packagist.org/packages/brightzone/gremlin-php) | [Gremlin-PHP on GitHub](https://github.com/PommeVerte/gremlin-php) | [Create Graph using PHP](create-graph-php.md) | 3.1.0 |
| [Gremlin console](https://tinkerpop.apache.org/downloads.html) | [TinkerPop docs](https://tinkerpop.apache.org/docs/current/reference/#gremlin-console) |  [Create Graph using Gremlin Console](create-graph-gremlin-console.md) | 3.2.0 + |

## Supported Graph Objects
TinkerPop is a standard that covers a wide range of graph technologies. Therefore, it has standard terminology to describe what features are provided by a graph provider. Azure Cosmos DB provides a persistent, high concurrency, writeable graph database that can be partitioned across multiple servers or clusters. 

The following table lists the TinkerPop features that are implemented by Azure Cosmos DB: 

| Category | Azure Cosmos DB implementation |  Notes | 
| --- | --- | --- |
| Graph features | Provides Persistence and ConcurrentAccess. Designed to support Transactions | Computer methods can be implemented via the Spark connector. |
| Variable features | Supports Boolean, Integer, Byte, Double, Float, Integer, Long, String | Supports primitive types, is compatible with complex types via data model |
| Vertex features | Supports RemoveVertices, MetaProperties, AddVertices, MultiProperties, StringIds, UserSuppliedIds, AddProperty, RemoveProperty  | Supports creating, modifying, and deleting vertices |
| Vertex property features | StringIds, UserSuppliedIds, AddProperty, RemoveProperty, BooleanValues, ByteValues, DoubleValues, FloatValues, IntegerValues, LongValues, StringValues | Supports creating, modifying, and deleting vertex properties |
| Edge features | AddEdges, RemoveEdges, StringIds, UserSuppliedIds, AddProperty, RemoveProperty | Supports creating, modifying, and deleting edges |
| Edge property features | Properties, BooleanValues, ByteValues, DoubleValues, FloatValues, IntegerValues, LongValues, StringValues | Supports creating, modifying, and deleting edge properties |

## Gremlin wire format: GraphSON

Azure Cosmos DB uses the [GraphSON format](https://tinkerpop.apache.org/docs/3.3.2/reference/#graphson-reader-writer) when returning results from Gremlin operations. GraphSON is the Gremlin standard format for representing vertices, edges, and properties (single and multi-valued properties) using JSON. 

For example, the following snippet shows a GraphSON representation of a vertex *returned to the client* from Azure Cosmos DB. 

```json
  {
    "id": "a7111ba7-0ea1-43c9-b6b2-efc5e3aea4c0",
    "label": "person",
    "type": "vertex",
    "outE": {
      "knows": [
        {
          "id": "3ee53a60-c561-4c5e-9a9f-9c7924bc9aef",
          "inV": "04779300-1c8e-489d-9493-50fd1325a658"
        },
        {
          "id": "21984248-ee9e-43a8-a7f6-30642bc14609",
          "inV": "a8e3e741-2ef7-4c01-b7c8-199f8e43e3bc"
        }
      ]
    },
    "properties": {
      "firstName": [
        {
          "value": "Thomas"
        }
      ],
      "lastName": [
        {
          "value": "Andersen"
        }
      ],
      "age": [
        {
          "value": 45
        }
      ]
    }
  }
```

The properties used by GraphSON for vertices are described below:

| Property | Description | 
| --- | --- | --- |
| `id` | The ID for the vertex. Must be unique (in combination with the value of `_partition` if applicable). If no value is provided, it will be automatically supplied with a GUID | 
| `label` | The label of the vertex. This property is used to describe the entity type. |
| `type` | Used to distinguish vertices from non-graph documents |
| `properties` | Bag of user-defined properties associated with the vertex. Each property can have multiple values. |
| `_partition` | The partition key of the vertex. Used for [graph partitioning](graph-partitioning.md). |
| `outE` | This property contains a list of out edges from a vertex. Storing the adjacency information with vertex allows for fast execution of traversals. Edges are grouped based on their labels. |

And the edge contains the following information to help with navigation to other parts of the graph.

| Property | Description |
| --- | --- |
| `id` | The ID for the edge. Must be unique (in combination with the value of `_partition` if applicable) |
| `label` | The label of the edge. This property is optional, and used to describe the relationship type. |
| `inV` | This property contains a list of in vertices for an edge. Storing the adjacency information with the edge allows for fast execution of traversals. Vertices are grouped based on their labels. |
| `properties` | Bag of user-defined properties associated with the edge. Each property can have multiple values. |

Each property can store multiple values within an array. 

| Property | Description |
| --- | --- |
| `value` | The value of the property

## Gremlin steps
Now let's look at the Gremlin steps supported by Azure Cosmos DB. For a complete reference on Gremlin, see [TinkerPop reference](https://tinkerpop.apache.org/docs/3.3.2/reference).

| step | Description | TinkerPop 3.2 Documentation |
| --- | --- | --- |
| `addE` | Adds an edge between two vertices | [addE step](https://tinkerpop.apache.org/docs/3.3.2/reference/#addedge-step) |
| `addV` | Adds a vertex to the graph | [addV step](https://tinkerpop.apache.org/docs/3.3.2/reference/#addvertex-step) |
| `and` | Ensures that all the traversals return a value | [and step](https://tinkerpop.apache.org/docs/3.3.2/reference/#and-step) |
| `as` | A step modulator to assign a variable to the output of a step | [as step](https://tinkerpop.apache.org/docs/3.3.2/reference/#as-step) |
| `by` | A step modulator used with `group` and `order` | [by step](https://tinkerpop.apache.org/docs/3.3.2/reference/#by-step) |
| `coalesce` | Returns the first traversal that returns a result | [coalesce step](https://tinkerpop.apache.org/docs/3.3.2/reference/#coalesce-step) |
| `constant` | Returns a constant value. Used with `coalesce`| [constant step](https://tinkerpop.apache.org/docs/3.3.2/reference/#constant-step) |
| `count` | Returns the count from the traversal | [count step](https://tinkerpop.apache.org/docs/3.3.2/reference/#count-step) |
| `dedup` | Returns the values with the duplicates removed | [dedup step](https://tinkerpop.apache.org/docs/3.3.2/reference/#dedup-step) |
| `drop` | Drops the values (vertex/edge) | [drop step](https://tinkerpop.apache.org/docs/3.3.2/reference/#drop-step) |
| `executionProfile` | Creates a description of all operations generated by the executed Gremlin step | [executionProfile step](graph-execution-profile.md) |
| `fold` | Acts as a barrier that computes the aggregate of results| [fold step](https://tinkerpop.apache.org/docs/3.3.2/reference/#fold-step) |
| `group` | Groups the values based on the labels specified| [group step](https://tinkerpop.apache.org/docs/3.3.2/reference/#group-step) |
| `has` | Used to filter properties, vertices, and edges. Supports `hasLabel`, `hasId`, `hasNot`, and `has` variants. | [has step](https://tinkerpop.apache.org/docs/3.3.2/reference/#has-step) |
| `inject` | Inject values into a stream| [inject step](https://tinkerpop.apache.org/docs/3.3.2/reference/#inject-step) |
| `is` | Used to perform a filter using a boolean expression | [is step](https://tinkerpop.apache.org/docs/3.3.2/reference/#is-step) |
| `limit` | Used to limit number of items in the traversal| [limit step](https://tinkerpop.apache.org/docs/3.3.2/reference/#limit-step) |
| `local` | Local wraps a section of a traversal, similar to a subquery | [local step](https://tinkerpop.apache.org/docs/3.3.2/reference/#local-step) |
| `not` | Used to produce the negation of a filter | [not step](https://tinkerpop.apache.org/docs/3.3.2/reference/#not-step) |
| `optional` | Returns the result of the specified traversal if it yields a result else it returns the calling element | [optional step](https://tinkerpop.apache.org/docs/3.3.2/reference/#optional-step) |
| `or` | Ensures at least one of the traversals returns a value | [or step](https://tinkerpop.apache.org/docs/3.3.2/reference/#or-step) |
| `order` | Returns results in the specified sort order | [order step](https://tinkerpop.apache.org/docs/3.3.2/reference/#order-step) |
| `path` | Returns the full path of the traversal | [path step](https://tinkerpop.apache.org/docs/3.3.2/reference/#path-step) |
| `project` | Projects the properties as a Map | [project step](https://tinkerpop.apache.org/docs/3.3.2/reference/#project-step) |
| `properties` | Returns the properties for the specified labels | [properties step](https://tinkerpop.apache.org/docs/3.3.2/reference/#_properties_step) |
| `range` | Filters to the specified range of values| [range step](https://tinkerpop.apache.org/docs/3.3.2/reference/#range-step) |
| `repeat` | Repeats the step for the specified number of times. Used for looping | [repeat step](https://tinkerpop.apache.org/docs/3.3.2/reference/#repeat-step) |
| `sample` | Used to sample results from the traversal | [sample step](https://tinkerpop.apache.org/docs/3.3.2/reference/#sample-step) |
| `select` | Used to project results from the traversal |  [select step](https://tinkerpop.apache.org/docs/3.3.2/reference/#select-step) |
| `store` | Used for non-blocking aggregates from the traversal | [store step](https://tinkerpop.apache.org/docs/3.3.2/reference/#store-step) |
| `TextP.startingWith(string)` | String filtering function. This function is used as a predicate for the `has()` step to match a property with the beginning of a given string | [TextP predicates](https://tinkerpop.apache.org/docs/3.4.0/reference/#a-note-on-predicates) |
| `TextP.endingWith(string)` |  String filtering function. This function is used as a predicate for the `has()` step to match a property with the ending of a given string | [TextP predicates](https://tinkerpop.apache.org/docs/3.4.0/reference/#a-note-on-predicates) |
| `TextP.containing(string)` | String filtering function. This function is used as a predicate for the `has()` step to match a property with the contents of a given string | [TextP predicates](https://tinkerpop.apache.org/docs/3.4.0/reference/#a-note-on-predicates) |
| `TextP.notStartingWith(string)` | String filtering function. This function is used as a predicate for the `has()` step to match a property that doesn't start with a given string | [TextP predicates](https://tinkerpop.apache.org/docs/3.4.0/reference/#a-note-on-predicates) |
| `TextP.notEndingWith(string)` | String filtering function. This function is used as a predicate for the `has()` step to match a property that doesn't end with a given string | [TextP predicates](https://tinkerpop.apache.org/docs/3.4.0/reference/#a-note-on-predicates) |
| `TextP.notContaining(string)` | String filtering function. This function is used as a predicate for the `has()` step to match a property that doesn't contain a given string | [TextP predicates](https://tinkerpop.apache.org/docs/3.4.0/reference/#a-note-on-predicates) |
| `tree` | Aggregate paths from a vertex into a tree | [tree step](https://tinkerpop.apache.org/docs/3.3.2/reference/#tree-step) |
| `unfold` | Unroll an iterator as a step| [unfold step](https://tinkerpop.apache.org/docs/3.3.2/reference/#unfold-step) |
| `union` | Merge results from multiple traversals| [union step](https://tinkerpop.apache.org/docs/3.3.2/reference/#union-step) |
| `V` | Includes the steps necessary for traversals between vertices and edges `V`, `E`, `out`, `in`, `both`, `outE`, `inE`, `bothE`, `outV`, `inV`, `bothV`, and `otherV` for | [vertex steps](https://tinkerpop.apache.org/docs/3.3.2/reference/#vertex-steps) |
| `where` | Used to filter results from the traversal. Supports `eq`, `neq`, `lt`, `lte`, `gt`, `gte`, and `between` operators  | [where step](https://tinkerpop.apache.org/docs/3.3.2/reference/#where-step) |

The write-optimized engine provided by Azure Cosmos DB supports automatic indexing of all properties within vertices and edges by default. Therefore, queries with filters, range queries, sorting, or aggregates on any property are processed from the index, and served efficiently. For more information on how indexing works in Azure Cosmos DB, see our paper on [schema-agnostic indexing](https://www.vldb.org/pvldb/vol8/p1668-shukla.pdf).

## Next steps
* Get started building a graph application [using our SDKs](create-graph-dotnet.md) 
* Learn more about [graph support](graph-introduction.md) in Azure Cosmos DB
