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
Azure Cosmos DB Graph engine closely follows [Apache TinkerPop](https://tinkerpop.apache.org/docs/current/reference/#graph-traversal-steps) traversal steps specification but there are differences.

## Behavior differences

* Azure Cosmos DB Graph engine runs ***breadth-first*** traversal while TinkerPop Gremlin is depth-first. This behavior achieves better performance in horizontally scalable system like Cosmos DB. 

## Unsupported features

* ***[Gremlin Bytecode](https://tinkerpop.apache.org/docs/current/tutorials/gremlin-language-variants/)*** is a programming language agnostic specification for graph traversals. Cosmos DB Graph doesn't support it yet. Use `GremlinClient.SubmitAsync()` and pass traversal as a text string.

* ***`property(set, 'xyz', 1)`*** set cardinality isn't supported today. Use `property(list, 'xyz', 1)` instead. To learn more, see [Vertex properties with TinkerPop](http://tinkerpop.apache.org/docs/current/reference/#vertex-properties).

* ***`atch()`*** allows querying graphs using declarative pattern matching. This capability isn't available.

* ***Objects as properties*** on vertices or edges aren't supported. Properties can only be primitive types or arrays.

* ***Sorting by array properties*** `order().by(<array property>)` isn't supported. Sorting is supported only by primitive types.

* ***Non-primitive JSON types*** aren't supported. Use `string`, `number`, or `true`/`false` types. `null` values aren't supported. 

* ***GraphSONv3*** serializer isn't currently supported. Use `GraphSONv2` Serializer, Reader, and Writer classes in the connection configuration. The results returned by the Azure Cosmos DB Gremlin API don't have the same format as the GraphSON format. 

* **Lambda expressions and functions** aren't currently supported. This includes the `.map{<expression>}`, the `.by{<expression>}`, and the `.filter{<expression>}` functions. To learn more, and to learn how to rewrite them using Gremlin steps, see [A Note on Lambdas](http://tinkerpop.apache.org/docs/current/reference/#a-note-on-lambdas).

* ***Transactions*** aren't supported because of distributed nature of the system.  Configure appropriate consistency model on Gremlin account to "read your own writes" and use optimistic concurrency to resolve conflicting writes.

## Next steps
* Visit [Cosmos DB user voice](https://feedback.azure.com/forums/263030-azure-cosmos-db) page to share feedback and help team focus on features that are important to you.
