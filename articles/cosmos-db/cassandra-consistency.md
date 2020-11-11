---
title: Apache Cassandra and Azure Cosmos DB consistency levels
description: Apache Cassandra and Azure Cosmos DB consistency levels.
author: TheovanKraay
ms.author: thvankra
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: conceptual
ms.date: 10/12/2020
ms.reviewer: sngun

---

# Apache Cassandra and Azure Cosmos DB consistency levels
[!INCLUDE[appliesto-cassandra-api](includes/appliesto-cassandra-api.md)]

Unlike Azure Cosmos DB, Apache Cassandra does not natively provide precisely defined consistency guarantees. Instead, Apache Cassandra provides a write consistency level and a read consistency level, to enable the high availability, consistency, and latency tradeoffs. When using Azure Cosmos DB’s Cassandra API:

* The write consistency level of Apache Cassandra is mapped to the default consistency level configured on your Azure Cosmos account. Consistency for a write operation (CL) can't be changed on a per-request basis.

* Azure Cosmos DB will dynamically map the read consistency level specified by the Cassandra client driver to one of the Azure Cosmos DB consistency levels configured dynamically on a read request.

## Mapping consistency levels

The following table illustrates how the native Cassandra consistency levels are mapped to the Azure Cosmos DB’s consistency levels when using Cassandra API:  

:::image type="content" source="./media/consistency-levels-across-apis/consistency-model-mapping-cassandra.png" alt-text="Cassandra consistency model mapping" lightbox="./media/consistency-levels-across-apis/consistency-model-mapping-cassandra.png" :::

If your Azure Cosmos account is configured with a consistency level other than the strong consistency, you can find out the probability that your clients may get strong and consistent reads for your workloads by looking at the *Probabilistically Bounded Staleness* (PBS) metric. This metric is exposed in the Azure portal, to learn more, see [Monitor Probabilistically Bounded Staleness (PBS) metric](how-to-manage-consistency.md#monitor-probabilistically-bounded-staleness-pbs-metric).

Probabilistic bounded staleness shows how eventual is your eventual consistency. This metric provides an insight into how often you can get a stronger consistency than the consistency level that you have currently configured on your Azure Cosmos account. In other words, you can see the probability (measured in milliseconds) of getting strongly consistent reads for a combination of write and read regions.

## Next steps

Learn more about global distribution and consistency levels for Azure Cosmos DB:

* [Global distribution overview](distribute-data-globally.md)
* [Consistency Level overview](consistency-levels.md)
* [High availability](high-availability.md)
