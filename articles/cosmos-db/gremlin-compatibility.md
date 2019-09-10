---
title: Azure Cosmos DB Gremlin compatibility with TinkerPop features
description: Reference documentation Graph engine compatiblity issues
author: olignat
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: reference
ms.date: 09/10/2019
ms.author: olignat
---

# Azure Cosmos DB Gremlin compatibility
Azure Cosmos DB Graph engine follows very closely [Apache TinkerPop](https://tinkerpop.apache.org/docs/current/reference/#graph-traversal-steps) traversal steps specification but there differences.

## Behavior differences

* Azure Cosmos DB Graph engine performs ***Breadth-first*** traversal while TinkerPop Gremlin is depth-first. This behavior achieves better performance in horizontally scalable system like Cosmos DB. 

## Unsupported features

* ***[Gremlin Bytecode](http://tinkerpop.apache.org/docs/current/tutorials/gremlin-language-variants/)*** is a programming language agnostic specification for graph traversals. Cosmos DB Graph does not yet support it. Please use ```GremlinClient.SubmitAsync()``` and pass traversal as a text string. Support for Bytecode should be available in near future.

* ***```property(set, 'xyz', 1)```*** set cardinality is not supported today. Support for set property cardinality will be enabled in the future. Please use ```property(list, 'xyz', 1)``` today.

* ***```match()```*** allows querying graphs using declarative pattern matching. This capability is not available and is not planned for Azure Cosmos DB Graph engine.

* ***Objects as properties*** on vertices or edges are not supported. Properties can only be primitive types or arrays.

* ***Sorting by array properties*** ```.order().by(<array property>)``` is not supported. Sorting is supported only by primitive types.

* ***Non-primitive JSON types*** are not supported. Please use ```string```, ```number``` or ```true```/```false``` types. ```null``` values are not supported. 

* ***GraphSONv3*** serializer is not available today but will become available in near future.

* ***Transactions*** are not supported due to distributed nature of the system. Please configure apropriate consistency model on Gremlin account to "read your own writes" and use optimistic concurrency to resolve conflicting writes.

## Next steps
* Visit [Cosmos DB user voice](https://feedback.azure.com/forums/263030-azure-cosmos-db) page to share feedback and help prioritize features that are important to you.
