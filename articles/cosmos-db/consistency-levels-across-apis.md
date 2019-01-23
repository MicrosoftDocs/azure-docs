---
title: Consistency levels and Azure Cosmos DB APIs
description: Understanding the consistency levels across APIs in Azure Cosmos DB.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/23/2018
ms.reviewer: sngun
---

# Consistency levels and Azure Cosmos DB APIs

Five consistency models offered by Azure Cosmos DB are natively supported by the Azure Cosmos DB SQL API. When you use Azure Cosmos DB, the SQL API is the default. 

Azure Cosmos DB also provides native support for wire protocol-compatible APIs for popular databases. Databases include MongoDB, Apache Cassandra, Gremlin, and Azure Table storage. These databases don't offer precisely defined consistency models or SLA-backed guarantees for consistency levels. They typically provide only a subset of the five consistency models offered by Azure Cosmos DB. For the SQL API, Gremlin API, and Table API, the default consistency level configured on the Azure Cosmos DB account is used. 

The following sections show the mapping between the data consistency requested by an OSS client driver for Apache Cassandra 4.x and MongoDB 3.4. This document also shows the corresponding Azure Cosmos DB consistency levels for Apache Cassandra and MongoDB.

## <a id="cassandra-mapping"></a>Mapping between Apache Cassandra and Azure Cosmos DB consistency levels

This table shows the consistency mapping between the Apache Cassandra and consistency levels in Azure Cosmos DB. For each of Cassandra Read and Write consistency levels, the corresponding Cosmos DB Consistency Level provides stronger, i.e., stricter guarantees.

The following table shows the **write consistency mapping** between Azure Cosmos DB and Cassandra:

| Cassandra | Azure Cosmos DB | Guarantee |
| - | - | - |
|ALL|Strong	 | Linearizability |
| EACH_QUORUM	| Strong	| Linearizability |	
| QUORUM, SERIAL |	Strong |	Linearizability |
| LOCAL_QUORUM, THREE, TWO, ONE, LOCAL_ONE, ANY	| Consistent Prefix |Global Consistent Prefix |
| EACH_QUORUM	| Strong	| Linearizability |
| QUORUM, SERIAL |	Strong |	Linearizability |
| LOCAL_QUORUM, THREE, TWO, ONE, LOCAL_ONE, ANY	| Consistent Prefix | Global Consistent Prefix |
| QUORUM, SERIAL | Strong	| Linearizability |
| LOCAL_QUORUM, THREE, TWO, ONE, LOCAL_ONE, ANY	| Consistent Prefix | Global Consistent Prefix |
| LOCAL_QUORUM, LOCAL_SERIAL, TWO, THREE	| Bounded Staleness | <ul><li>Bounded Staleness.</li><li>At most K versions or t time behind.</li><li>Read latest committed value in the region.</li></ul> |
| ONE, LOCAL_ONE, ANY	| Consistent Prefix	| Per-region Consistent Prefix |

The following table shows the **Read consistency mapping** between Azure Cosmos DB and Cassandra:

| Cassandra | Azure Cosmos DB | Guarantee |
| - | - | - |
| ALL, QUORUM, SERIAL, LOCAL_QUORUM, LOCAL_SERIAL, THREE, TWO, ONE, LOCAL_ONE | Strong	| Linearizability|
| ALL, QUORUM, SERIAL, LOCAL_QUORUM, LOCAL_SERIAL, THREE, TWO	|Strong |	Linearizability |
|LOCAL_ONE, ONE	| Consistent Prefix	| Global Consistent Prefix |
| ALL, QUORUM, SERIAL	| Strong	| Linearizability |
| LOCAL_ONE, ONE, LOCAL_QUORUM, LOCAL_SERIAL, TWO, THREE |	Consistent Prefix	| Global Consistent Prefix |
| LOCAL_ONE, ONE, TWO, THREE, LOCAL_QUORUM, QUORUM |	Consistent Prefix	| Global Consistent Prefix |
| ALL, QUORUM, SERIAL, LOCAL_QUORUM, LOCAL_SERIAL, THREE, TWO	|Strong |	Linearizability |
| LOCAL_ONE, ONE	| Consistent Prefix	| Global Consistent Prefix|
| ALL, QUORUM, SERIAL	Strong	Linearizability
LOCAL_ONE, ONE, LOCAL_QUORUM, LOCAL_SERIAL, TWO, THREE	|Consistent Prefix	| Global Consistent Prefix |
|ALL	|Strong	|Linearizability |
| LOCAL_ONE, ONE, TWO, THREE, LOCAL_QUORUM, QUORUM	|Consistent Prefix	|Global Consistent Prefix|
|ALL, QUORUM, SERIAL	Strong	Linearizability
LOCAL_ONE, ONE, LOCAL_QUORUM, LOCAL_SERIAL, TWO, THREE	|Consistent Prefix	|Global Consistent Prefix |
|ALL	|Strong	| Linearizability |
| LOCAL_ONE, ONE, TWO, THREE, LOCAL_QUORUM, QUORUM	| Consistent Prefix	| Global Consistent Prefix |
| QUORUM, LOCAL_QUORUM, LOCAL_SERIAL, TWO, THREE |	Bounded Staleness	| <ul><li>Bounded Staleness.</li><li>At most K versions or t time behind. </li><li>Read latest committed value in the region.</li></ul>
| LOCAL_ONE, ONE |Consistent Prefix	| Per-region Consistent Prefix |
| LOCAL_ONE, ONE, TWO, THREE, LOCAL_QUORUM, QUORUM	| Consistent Prefix	| Per-region Consistent Prefix |


## <a id="mongo-mapping"></a>Mapping between MongoDB 3.4 and Azure Cosmos DB consistency levels

The following table shows the "read concerns" mapping between MongoDB 3.4 and the default consistency level in Azure Cosmos DB. The table shows multi-region and single-region deployments.

| **MongoDB 3.4** | **Azure Cosmos DB (multi-region)** | **Azure Cosmos DB (single region)** |
| - | - | - |
| Linearizable | Strong | Strong |
| Majority | Bounded staleness | Strong |
| Local | Consistent prefix | Consistent prefix |

## Next steps

Read more about consistency levels and compatibility between Azure Cosmos DB APIs with the open-source APIs. See the following articles:

* [Availability and performance tradeoffs for various consistency levels](consistency-levels-tradeoffs.md)
* [MongoDB features supported by the Azure Cosmos DB's API for MongoDB](mongodb-feature-support.md)
* [Apache Cassandra features supported by the Azure Cosmos DB Cassandra API](cassandra-support.md)