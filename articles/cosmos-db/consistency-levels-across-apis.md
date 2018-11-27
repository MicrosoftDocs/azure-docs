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

# Consistency levels and Azure Cosmos DB APIs

The five consistency models offered by Azure Cosmos DB are natively supported by the Cosmos DB SQL API, which is the default API when using Cosmos DB. In addition to the SQL API, Cosmos DB also provides native support for wire-protocol compatible APIs for popular databases such as MongoDB, Apache Cassandra, Gremlin, and Azure Tables. These databases neither offer precisely defined consistency models nor the SLA-backed guarantees for the consistency levels. These databases typically provide only a subset of the five consistency models offered by Cosmos DB. For SQL API, Gremlin API and Table API, the default consistency level that you configure on the Cosmos account is used.

The following sections show the mapping between the data-consistency requested by an OSS client driver for Apache Cassandra 4.x and MongoDB 3.4 when using Cassandra API and MongoDB API, respectively, and the corresponding Cosmos DB consistency levels.

## <a id="cassandra-mapping"></a>Mapping between Apache Cassandra and Cosmos DB consistency levels

The following table shows the "read consistency" mapping between Apache Cassandra 4.x client and the default consistency level in Cosmos DB for both multi-region and single-region deployments.

| **Apache Cassandra 4.x** | **Cosmos DB (multi-region)** | **Cosmos DB (single-region)** |
| - | - | - |
| ONE, TWO, THREE | Consistent Prefix | Consistent Prefix |
| LOCAL_ONE | Consistent Prefix | Consistent Prefix |
| QUORUM, ALL, SERIAL | Bounded Staleness (default) or Strong (in private preview) | Strong |
| LOCAL_QUORUM | Bounded Staleness | Strong |
| LOCAL_SERIAL | Bounded Staleness | Strong |

## <a id="mongo-mapping"></a>Mapping between MongoDB 3.4 and Cosmos DB consistency levels

The following table shows the "read concerns" mapping between MongoDB 3.4 and the default consistency level in Cosmos DB for both multi-region and single-region deployments.

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