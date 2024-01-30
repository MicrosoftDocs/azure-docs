---
title: Azure Cosmos DB for Gremlin support and compatibility with TinkerPop features
description: Learn about the Gremlin language from Apache TinkerPop. Learn which features and steps are available in Azure Cosmos DB and the TinkerPop Graph engine compatibility differences.
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.custom: ignite-2022
ms.topic: overview
ms.date: 07/06/2021
author: manishmsfte
ms.author: mansha
---

# Azure Cosmos DB for Gremlin graph support and compatibility with TinkerPop features
[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

Azure Cosmos DB supports [Apache Tinkerpop's](https://tinkerpop.apache.org) graph traversal language, known as [Gremlin](https://tinkerpop.apache.org/docs/3.3.2/reference/#graph-traversal-steps). You can use the Gremlin language to create graph entities (vertices and edges), modify properties within those entities, perform queries and traversals, and delete entities.

Azure Cosmos DB Graph engine closely follows [Apache TinkerPop](https://tinkerpop.apache.org/docs/current/reference/#graph-traversal-steps) traversal steps specification but there are differences in the implementation that are specific for Azure Cosmos DB. In this article, we provide a quick walkthrough of Gremlin and enumerate the Gremlin features that are supported by the API for Gremlin.

## Compatible client libraries

The following table shows popular Gremlin drivers that you can use against Azure Cosmos DB:

| Download | Source | Getting Started | Supported/Recommended connector version |
| --- | --- | --- | --- |
| [.NET](https://tinkerpop.apache.org/docs/3.4.13/reference/#gremlin-DotNet) | [Gremlin.NET on GitHub](https://github.com/apache/tinkerpop/tree/master/gremlin-dotnet) | [Create Graph using .NET](quickstart-dotnet.md) | 3.4.13 |
| [Java](https://mvnrepository.com/artifact/com.tinkerpop.gremlin/gremlin-java) | [Gremlin JavaDoc](https://tinkerpop.apache.org/javadocs/current/full/) | [Create Graph using Java](quickstart-java.md) | 3.4.13 |
| [Python](https://tinkerpop.apache.org/docs/3.4.13/reference/#gremlin-python) | [Gremlin-Python on GitHub](https://github.com/apache/tinkerpop/tree/master/gremlin-python) | [Create Graph using Python](quickstart-python.md) | 3.4.13 |
| [Gremlin console](https://tinkerpop.apache.org/download.html) | [TinkerPop docs](https://tinkerpop.apache.org/docs/current/reference/#gremlin-console) |  [Create Graph using Gremlin Console](quickstart-console.md) | 3.4.13 |
| [Node.js](https://www.npmjs.com/package/gremlin) | [Gremlin-JavaScript on GitHub](https://github.com/apache/tinkerpop/tree/master/gremlin-javascript) | [Create Graph using Node.js](quickstart-nodejs.md) | 3.4.13 |
| [PHP](https://packagist.org/packages/brightzone/gremlin-php) | [Gremlin-PHP on GitHub](https://github.com/PommeVerte/gremlin-php) | [Create Graph using PHP](quickstart-php.md) | 3.1.0 |
| [Go Lang](https://github.com/supplyon/gremcos/) | [Go Lang](https://github.com/supplyon/gremcos/) | | This library is built by external contributors. The Azure Cosmos DB team doesn't offer any support or maintain the library. |

> [!NOTE]
> Gremlin client driver versions for __3.5.*__, __3.6.*__ have known compatibility issues, so we recommend using the latest supported 3.4.* driver versions listed above.
> This table will be updated when compatibility issues have been addressed for these newer driver versions.

## Supported Graph Objects

TinkerPop is a standard that covers a wide range of graph technologies. Therefore, it has standard terminology to describe what features are provided by a graph provider. Azure Cosmos DB provides a persistent, high concurrency, writeable graph database that can be partitioned across multiple servers or clusters. 

The following table lists the TinkerPop features that are implemented by Azure Cosmos DB: 

| Category | Azure Cosmos DB implementation |  Notes | 
| --- | --- | --- |
| Graph features | Provides Persistence and ConcurrentAccess. Designed to support Transactions | Computer methods can be implemented via the Spark connector. |
| Variable features | Supports Boolean, Integer, Byte, Double, Float, Long, String | Supports primitive types, is compatible with complex types via data model |
| Vertex features | Supports RemoveVertices, MetaProperties, AddVertices, MultiProperties, StringIds, UserSuppliedIds, AddProperty, RemoveProperty  | Supports creating, modifying, and deleting vertices |
| Vertex property features | StringIds, UserSuppliedIds, AddProperty, RemoveProperty, BooleanValues, ByteValues, DoubleValues, FloatValues, IntegerValues, LongValues, StringValues | Supports creating, modifying, and deleting vertex properties |
| Edge features | AddEdges, RemoveEdges, StringIds, UserSuppliedIds, AddProperty, RemoveProperty | Supports creating, modifying, and deleting edges |
| Edge property features | Properties, BooleanValues, ByteValues, DoubleValues, FloatValues, IntegerValues, LongValues, StringValues | Supports creating, modifying, and deleting edge properties |

## Gremlin wire format

Azure Cosmos DB uses the JSON format when returning results from Gremlin operations. Azure Cosmos DB currently supports the JSON format. For example, the following snippet shows a JSON representation of a vertex *returned to the client* from Azure Cosmos DB:

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

The properties used by the JSON format for vertices are described below:

| Property | Description | 
| --- | --- | --- |
| `id` | The ID for the vertex. Must be unique (in combination with the value of `_partition` if applicable). If no value is provided, it will be automatically supplied with a GUID | 
| `label` | The label of the vertex. This property is used to describe the entity type. |
| `type` | Used to distinguish vertices from non-graph documents |
| `properties` | Bag of user-defined properties associated with the vertex. Each property can have multiple values. |
| `_partition` | The partition key of the vertex. Used for [graph partitioning](partitioning.md). |
| `outE` | This property contains a list of out edges from a vertex. Storing the adjacency information with vertex allows for fast execution of traversals. Edges are grouped based on their labels. |

Each property can store multiple values within an array.

| Property | Description |
| --- | --- |
| `value` | The value of the property |

And the edge contains the following information to help with navigation to other parts of the graph.

| Property | Description |
| --- | --- |
| `id` | The ID for the edge. Must be unique (in combination with the value of `_partition` if applicable) |
| `label` | The label of the edge. This property is optional, and used to describe the relationship type. |
| `inV` | This property contains a list of in vertices for an edge. Storing the adjacency information with the edge allows for fast execution of traversals. Vertices are grouped based on their labels. |
| `properties` | Bag of user-defined properties associated with the edge. |

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
| `executionProfile` | Creates a description of all operations generated by the executed Gremlin step | [executionProfile step](execution-profile.md) |
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

## Behavior differences

* Azure Cosmos DB Graph engine runs ***breadth-first*** traversal while TinkerPop Gremlin is depth-first. This behavior achieves better performance in horizontally scalable system like Azure Cosmos DB.

## Unsupported features

* ***[Gremlin Bytecode](https://tinkerpop.apache.org/docs/current/tutorials/gremlin-language-variants/)*** is a programming language agnostic specification for graph traversals. Azure Cosmos DB Graph doesn't support it yet. Use `GremlinClient.SubmitAsync()` and pass traversal as a text string.

* ***`property(set, 'xyz', 1)`*** set cardinality isn't supported today. Use `property(list, 'xyz', 1)` instead. To learn more, see [Vertex properties with TinkerPop](http://tinkerpop.apache.org/docs/current/reference/#vertex-properties).

* The ***`match()` step*** isn't currently available. This step provides declarative querying capabilities.

* ***Objects as properties*** on vertices or edges aren't supported. Properties can only be primitive types or arrays.

* ***Sorting by array properties*** `order().by(<array property>)` isn't supported. Sorting is supported only by primitive types.

* ***Non-primitive JSON types*** aren't supported. Use `string`, `number`, or `true`/`false` types. `null` values aren't supported. 

* ***GraphSONv3*** serializer isn't currently supported. Use `GraphSONv2` Serializer, Reader, and Writer classes in the connection configuration. The results returned by the Azure Cosmos DB for Gremlin don't have the same format as the GraphSON format. 

* **Lambda expressions and functions** aren't currently supported. This includes the `.map{<expression>}`, the `.by{<expression>}`, and the `.filter{<expression>}` functions. To learn more, and to learn how to rewrite them using Gremlin steps, see [A Note on Lambdas](http://tinkerpop.apache.org/docs/current/reference/#a-note-on-lambdas).

* ***Transactions*** aren't supported because of distributed nature of the system.  Configure appropriate consistency model on Gremlin account to "read your own writes" and use optimistic concurrency to resolve conflicting writes.

## Known limitations

* **Index utilization for Gremlin queries with mid-traversal `.V()` steps**: Currently, only the first `.V()` call of a traversal will make use of the index to resolve any filters or predicates attached to it. Subsequent calls will not consult the index, which might increase the latency and cost of the query.
    
Assuming default indexing, a typical read Gremlin query that starts with the `.V()` step would use parameters in its attached filtering steps, such as `.has()` or `.where()` to optimize the cost and performance of the query. For example:

```java
g.V().has('category', 'A')
```

However, when more than one `.V()` step is included in the Gremlin query, the resolution of the data for the query might not be optimal. Take the following query as an example:

```java
g.V().has('category', 'A').as('a').V().has('category', 'B').as('b').select('a', 'b')
```

This query will return two groups of vertices based on their property called `category`. In this case, only the first call, `g.V().has('category', 'A')` will make use of the index to resolve the vertices based on the values of their properties.

A workaround for this query is to use subtraversal steps such as `.map()` and `union()`. This is exemplified below:

```java
// Query workaround using .map()
g.V().has('category', 'A').as('a').map(__.V().has('category', 'B')).as('b').select('a','b')

// Query workaround using .union()
g.V().has('category', 'A').fold().union(unfold(), __.V().has('category', 'B'))
```

You can review the performance of the queries by using the [Gremlin `executionProfile()` step](execution-profile.md).

## Next steps

* Get started building a graph application [using our SDKs](quickstart-dotnet.md) 
* Learn more about [graph support](introduction.md) in Azure Cosmos DB
