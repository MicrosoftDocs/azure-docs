---
title: Limits of Azure Cosmos DB Gremlin
description: Reference documentation for runtime limitations of Graph engine
author: olignat
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: reference
ms.date: 09/10/2019
ms.author: olignat
---

# Azure Cosmos DB Gremlin limits
This article talks about the limits of Azure Cosmos DB Gremlin engine and explains how they may impact customer traversals.

Cosmos DB Gremlin is built on top of Cosmos DB infrastructure therefore all limits in [Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/concepts-limits) apply. 

## Limits

When Gremlin limit is reached, traversal is terminated with **x-ms-status-code** = 429 indicating throttling error.

**Resource**	| **Default limit** | **Explanation**
--- | --- | ---
*Memory per pequest* | **2 GB** | Maximum memory that a request can consume during processing. Requests which need to do computation over large data sets will consume additional memory, so consider scoping requests to smaller data sets to avoid this limit or consider using OLAP solutions.
*Script length* | **64 KB** | Maximum length of a Gremlin traversal script per request.
*Operator depth* | **400** |  Total number of unique steps in a traversal. For example, ```g.V().out()``` has operator count of 2: V() and out(), ```g.V('label').repeat(out()).times(100)``` has operator depth of 3: V(), repeat() and out() because ```.times(100)``` is a parameter to ```.repeat()``` operator.
*Degree of parallelism* | **32** | Maximum number of storage partitions queried in a single request to storage layer. For large graphs with hundreds of partitions this limit will impact traversal execution latency.
*Repeat limit* | **32** | Maximum number of iterations a ```.repeat()``` operator can execute. Each iteration of ```.repeat()``` step in most cases performs breadth-first traversal which means that any traversal is limited to at most 32 hops between vertices.
*Traversal timeout* | **30 seconds** | Traversal will be terminated when it exceeds this time. Cosmos DB Graph is an OLTP database with vast majority of traversals completing within milliseconds. To perform OLAP queries on Cosmos DB Graph please use [Apache Spark](https://azure.microsoft.com/services/cosmos-db/) with [Graph Data Frames](https://spark.apache.org/docs/latest/sql-programming-guide.html#datasets-and-dataframes) and [Cosmos DB Spark Connector](https://github.com/Azure/azure-cosmosdb-spark).
*Predicate limit* | **20** | Count of ```.has()``` or ```.hasNot()``` steps applied on a single vertex or edge. When this limit is hit error surfaced to the application is ```The SQL query exceeded the maximum number of joins. The allowed limit is 20```. This is a temporary inconvenience as team is working to lift this limit. 
*Idle connection timeout* | **5 hours** | Amount of time Graph server will keep websocket connection open without traffic on it. TCP keep-alive packets or HTTP keep-alive requests don't extend connection lifespan beyond this limit, however if they are not sent then underlying Azure infrastructure may terminate the connection even sooner. Cosmos DB Graph engine considers to be idle if there are no Gremlin traversals running on it.
*Resource token per hour* | **100** | Number of unique resource tokens utilized by Gremlin clients to connect to Gremlin account in a region. When application exceeds hourly unique token limit, `"Exceeded allowed resource token limit of 100 that can be used concurrently"` will be returned on subsequent authentication request.

## Next steps
* [Azure Cosmos DB Gremlin response headers](gremlin-headers.md) 
* [Azure Cosmos DB Resource Tokens with Gremlin](how-to-use-resource-tokens-gremlin.md)
