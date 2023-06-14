---
title: Limits of Azure Cosmos DB for Gremlin
description: Reference documentation for runtime limitations of Graph engine
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.custom: ignite-2022
ms.topic: reference
ms.date: 10/04/2019
author: manishmsfte
ms.author: mansha
---

# Azure Cosmos DB for Gremlin limits
[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

This article talks about the limits of Azure Cosmos DB for Gremlin engine and explains how they may impact customer traversals.

Azure Cosmos DB for Gremlin is built on top of Azure Cosmos DB infrastructure. Due to this, all limits explained in [Azure Cosmos DB service limits](../concepts-limits.md) still apply.

## Limits

When Gremlin limit is reached, traversal is canceled with a **x-ms-status-code** of 429 indicating a throttling error. See [Gremlin server response headers](limits.md) for more information.

**Resource**	| **Default limit** | **Explanation**
--- | --- | ---
*Script length* | **64 KB** | Maximum length of a Gremlin traversal script per request.
*Operator depth* | **400** |  Total number of unique steps in a traversal. For example, ```g.V().out()``` has an operator count of 2: V() and out(), ```g.V('label').repeat(out()).times(100)``` has operator depth of 3: V(), repeat(), and out() because ```.times(100)``` is a parameter to ```.repeat()``` operator.
*Degree of parallelism* | **32** | Maximum number of storage partitions queried in a single request to storage layer. Graphs with hundreds of partitions will be impacted by this limit.
*Repeat limit* | **32** | Maximum number of iterations a ```.repeat()``` operator can execute. Each iteration of ```.repeat()``` step in most cases runs breadth-first traversal, which means that any traversal is limited to at most 32 hops between vertices.
*Traversal timeout* | **30 seconds** | Traversal will be canceled when it exceeds this time. Azure Cosmos DB Graph is an OLTP database with vast majority of traversals completing within milliseconds. To run OLAP queries on Azure Cosmos DB Graph, use [Apache Spark](https://azure.microsoft.com/services/cosmos-db/) with [Graph Data Frames](https://spark.apache.org/docs/latest/sql-programming-guide.html#datasets-and-dataframes) and [Azure Cosmos DB Spark Connector](https://github.com/Azure/azure-cosmosdb-spark).
*Idle connection timeout* | **1 hour** | Amount of time the Gremlin service will keep idle websocket connections open. TCP keep-alive packets or HTTP keep-alive requests don't extend connection lifespan beyond this limit. Azure Cosmos DB Graph engine considers websocket connections to be idle if there are no active Gremlin requests running on it.
*Resource token per hour* | **100** | Number of unique resource tokens used by Gremlin clients to connect to Gremlin account in a region. When the application exceeds hourly unique token limit, `"Exceeded allowed resource token limit of 100 that can be used concurrently"` will be returned on the next authentication request.

## Next steps
* [Azure Cosmos DB for Gremlin response headers](headers.md)
* [Azure Cosmos DB Resource Tokens with Gremlin](how-to-use-resource-tokens.md)
