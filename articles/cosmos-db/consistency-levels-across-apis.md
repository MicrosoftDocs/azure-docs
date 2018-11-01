---
title: Consistency levels and Azure Cosmos DB APIs | Microsoft Docs
description: Understanding the consistency levels across APIs in Azure Cosmos DB.
keywords: consistency, azure cosmos db, azure, models, mongodb, cassandra, graph, table, Microsoft azure
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 10/23/2018
ms.author: mjbrown

---

# Consistency levels and Cosmos DB APIs

The five consistency models are natively supported by the SQL API, which is the default API when using Cosmos DB. In addition to the SQL API, Cosmos DB also provides native support for wire-protocol compatible APIs for popular databases such as MongoDB, Apache Cassandra, Gremlin, and Azure Tables. These databases offer neither precisely defined consistency models nor the SLA-backed guarantees for the consistency levels, and typically provide only a subset of the five consistency models that Cosmos DB offers. For SQL API, Gremlin API and Table API, the default consistency level configured on the Cosmos account is used.

The following table shows the mapping between the data-consistency requested by an OSS client driver for Apache Cassandra 4.x and MongoDB 3.4 when using Cassandra API and MongoDB API, respectively, and the corresponding Cosmos DB consistency levels.

## <a id="cassandra-mapping"></a>Mapping Apache Cassandra and Cosmos DB consistency levels

The table below shows the mapping for read consistency between Apache Cassandra 4.x client and Cosmos DB "Default" consistency level for both a multi-region and single-region deployment.

| **Apache Cassandra 4.x** | **Cosmos DB (multi-region)** | **Cosmos DB (single-region)** |
| - | - | - |
| ONE, TWO, THREE | Consistent Prefix | Consistent Prefix |
| LOCAL_ONE | Consistent Prefix | Consistent Prefix |
| QUORUM, ALL, SERIAL | Bounded Staleness (default) or Strong (in private preview) | Strong |
| LOCAL_QUORUM | Bounded Staleness | Strong |
| LOCAL_SERIAL | Bounded Staleness | Strong |

## <a id="mongo-mapping"></a>Mapping between MongoDB 3.4 and Cosmos DB consistency levels

The table below shows the mapping for "read concerns" of MongoDB 3.4 and Cosmos DB "Default" consistency level for both a multi-region and single-region deployment.

| **MongoDB 3.4** | **Cosmos DB (multi-region)** | **Cosmos DB (single-region)** |
| - | - | - |
| Linearizable | Strong | Strong |
| Majority | Bounded Staleness | Strong |
| Local | Consistent Prefix | Consistent Prefix |

## Next steps

Read more about consistency levels and compatibility between Cosmos DB APIs with the open-source APIs in the following articles:

* [Availability and performance tradeoffs for various consistency levels](consistency-levels-tradeoffs.md)
* [MongoDB features supported by Cosmos DB MongoDB API](mongodb-feature-support.md)
* [Apache Cassandra features supported by Cosmos DB Cassandra API](cassandra-support.md)