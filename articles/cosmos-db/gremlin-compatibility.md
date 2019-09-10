---
title: Azure Cosmos DB Gremlin compatibility with TinkerPop features
description: Reference documentation Graph engine compatibility issues
author: olignat
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: reference
ms.date: 09/10/2019
ms.author: olignat
---

# Azure Cosmos DB Gremlin compatibility
Azure Cosmos DB Graph engine closely follows [Apache TinkerPop](https://tinkerpop.apache.org/docs/current/reference/#graph-traversal-steps) traversal steps specification but there are differences.

## Behavior differences

* Azure Cosmos DB Graph engine runs ***breadth-first*** traversal while TinkerPop Gremlin is depth-first. This behavior achieves better performance in horizontally scalable system like Cosmos DB. 

## Unsupported features

* ***[Gremlin Bytecode](http://tinkerpop.apache.org/docs/current/tutorials/gremlin-language-variants/)*** is a programming language agnostic specification for graph traversals. Cosmos DB Graph doesn't support it yet. Use ```GremlinClient.SubmitAsync()``` and pass traversal as a text string. Support for Bytecode should be available in near future.

* ***```property(set, 'xyz', 1)```*** set cardinality isn't supported today. Support for set property cardinality will be enabled in the future. Use ```property(list, 'xyz', 1)``` today.

* ***```match()```*** allows querying graphs using declarative pattern matching. This capability isn't available and there are no plans to support it in Azure Cosmos DB Graph engine.

* ***Objects as properties*** on vertices or edges aren't supported. Properties can only be primitive types or arrays.

* ***Sorting by array properties*** ```.order().by(<array property>)``` is not supported. Sorting is supported only by primitive types.

* ***Non-primitive JSON types*** aren't supported. Use ```string```, ```number``` or ```true```/```false``` types. ```null``` values aren't supported. 

* ***GraphSONv3*** serializer is not available today but will become available in near future.

* ***Transactions*** aren't supported due to distributed nature of the system.  Configure appropriate consistency model on Gremlin account to "read your own writes" and use optimistic concurrency to resolve conflicting writes.

## Next steps
* Visit [Cosmos DB user voice](https://feedback.azure.com/forums/263030-azure-cosmos-db) page to share feedback and help team focus on features that are important to you.
