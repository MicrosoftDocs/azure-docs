---
title: Consistency levels and Azure Cosmos DB APIs
description: Understanding the consistency levels across APIs in Azure Cosmos DB.
keywords: consistency, azure cosmos db, azure, models, mongodb, cassandra, graph, table, Microsoft azure
services: cosmos-db
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/23/2018
---

# Consistency levels and Azure Cosmos DB APIs

Five consistency models offered by Azure Cosmos DB are natively supported by the Azure Cosmos DB SQL API. When you use Azure Cosmos DB, the SQL API is the default. 

Azure Cosmos DB also provides native support for wire protocol-compatible APIs for popular databases. Databases include MongoDB, Apache Cassandra, Gremlin, and Azure Table storage. These databases don't offer precisely defined consistency models or SLA-backed guarantees for consistency levels. They typically provide only a subset of the five consistency models offered by Azure Cosmos DB. For the SQL API, Gremlin API, and Table API, the default consistency level configured on the Azure Cosmos DB account is used. 

The following sections show the mapping between the data consistency requested by an OSS client driver for Apache Cassandra 4.x and MongoDB 3.4. This document also shows the corresponding Azure Cosmos DB consistency levels for Apache Cassandra and MongoDB.

## <a id="cassandra-mapping"></a>Mapping between Apache Cassandra and Azure Cosmos DB consistency levels

This table shows the "read consistency" mapping between the Apache Cassandra 4.x client and the default consistency level in Azure Cosmos DB. The table shows multi-region and single-region deployments.

| **Apache Cassandra 4.x** | **Azure Cosmos DB (multi-region)** | **Azure Cosmos DB (single region)** |
| - | - | - |
| ONE, TWO, THREE | Consistent prefix | Consistent prefix |
| LOCAL_ONE | Consistent prefix | Consistent prefix |
| QUORUM, ALL, SERIAL | Bounded staleness is the default. Strong is in private preview. | Strong |
| LOCAL_QUORUM | Bounded staleness | Strong |
| LOCAL_SERIAL | Bounded staleness | Strong |

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
* [MongoDB features supported by the Azure Cosmos DB MongoDB API](mongodb-feature-support.md)
* [Apache Cassandra features supported by the Azure Cosmos DB Cassandra API](cassandra-support.md)