---
title: Azure Cosmos DB Gremlin compatibility with TinkerPop features
description: Reference documentation Graph engine compatibility issues
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: reference
ms.date: 09/10/2019
ms.author: sngun
---

# Azure Cosmos DB Gremlin compatibility
Azure Cosmos DB Graph engine closely follows [Apache TinkerPop](https://tinkerpop.apache.org/docs/current/reference/#graph-traversal-steps) traversal steps specification but there are differences in the implementation that are specific for Azure Cosmos DB. To learn the list of supported Gremlin steps, see the [Gremlin API Wire Protocol Support](gremlin-support.md) article.

## Behavior differences

* Azure Cosmos DB Graph engine runs ***breadth-first*** traversal while TinkerPop Gremlin is depth-first. This behavior achieves better performance in horizontally scalable system like Cosmos DB. 

## Unsupported features

* ***[Gremlin Bytecode](https://tinkerpop.apache.org/docs/current/tutorials/gremlin-language-variants/)*** is a programming language agnostic specification for graph traversals. Cosmos DB Graph doesn't support it yet. Use `GremlinClient.SubmitAsync()` and pass traversal as a text string.

* ***`property(set, 'xyz', 1)`*** set cardinality isn't supported today. Use `property(list, 'xyz', 1)` instead. To learn more, see [Vertex properties with TinkerPop](http://tinkerpop.apache.org/docs/current/reference/#vertex-properties).

* The ***`match()` step*** isn't currently available. This step provides declarative querying capabilities.

* ***Objects as properties*** on vertices or edges aren't supported. Properties can only be primitive types or arrays.

* ***Sorting by array properties*** `order().by(<array property>)` isn't supported. Sorting is supported only by primitive types.

* ***Non-primitive JSON types*** aren't supported. Use `string`, `number`, or `true`/`false` types. `null` values aren't supported. 

* ***GraphSONv3*** serializer isn't currently supported. Use `GraphSONv2` Serializer, Reader, and Writer classes in the connection configuration. The results returned by the Azure Cosmos DB Gremlin API don't have the same format as the GraphSON format. 

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

    You can review the performance of the queries by using the [Gremlin `executionProfile()` step](graph-execution-profile.md.

## Next steps
* Visit [Cosmos DB user voice](https://feedback.azure.com/forums/263030-azure-cosmos-db) page to share feedback and help team focus on features that are important to you.
