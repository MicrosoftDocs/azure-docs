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

# Apache Cassandra and Azure Cosmos DB Cassandra API consistency levels
[!INCLUDE[appliesto-cassandra-api](../includes/appliesto-cassandra-api.md)]

Unlike Azure Cosmos DB, Apache Cassandra does not natively provide precisely defined consistency guarantees. Instead, Apache Cassandra provides a write consistency level and a read consistency level, to enable the high availability, consistency, and latency tradeoffs. When using Azure Cosmos DB’s Cassandra API:

* The write consistency level of Apache Cassandra is mapped to the default consistency level configured on your Azure Cosmos account. Consistency for a write operation (CL) can't be changed on a per-request basis.

* Azure Cosmos DB will dynamically map the read consistency level specified by the Cassandra client driver to one of the Azure Cosmos DB consistency levels configured dynamically on a read request.

## Multi-region writes vs Single-region writes

Apache Cassandra database is a multi-master system by default, and does not provide an out-of-box option for single-region writes with multi-region replication for reads. However, Azure Cosmos DB provides turnkey ability to have either single region, or [multi-region](../how-to-multi-master.md) write configurations. One of the advantages of being able to choose a single region write configuration across multiple regions is the avoidance of cross-region conflict scenarios, and the option of maintaining strong consistency across multiple regions. 

With single-region writes, you can maintain strong consistency, while still maintaining a level of high availability across regions with [automatic failover](../high-availability.md#multi-region-accounts-with-a-single-write-region-write-region-outage). In this configuration, you can still exploit data locality to reduce read latency by downgrading to eventual consistency on a per request basis. In addition to these capabilities, the Azure Cosmos DB platform also provides the ability to enable [zone redundancy](../high-availability.md#availability-zone-support) when selecting a region. Thus, unlike native Apache Cassandra, Azure Cosmos DB allows you to navigate the CAP Theorem [trade-off spectrum](../consistency-levels.md#rto) with more granularity.

## Mapping consistency levels

The Azure Cosmos DB platform provides a set of five well-defined, business use-case oriented consistency settings with respect to replication and the tradeoffs defined by the [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem) and [PACLC theorem](https://en.wikipedia.org/wiki/PACELC_theorem). As this approach differs significantly from Apache Cassandra, we would recommend that you take time to review and understand Azure Cosmos DB consistency settings in our [documentation](../consistency-levels.md), or watch this short [video](https://www.youtube.com/watch?v=t1--kZjrG-o) guide to understanding consistency settings in the Azure Cosmos DB platform.

The following table illustrates the possible mappings between Apache Cassandra and Azure Cosmos DB consistency levels when using Cassandra API. This shows configurations for single region, multi-region reads with single-region writes, and multi-region writes.

> [!NOTE]
> These are not exact mappings. Rather, we have provided the closest analogues to Apache Cassandra, and disambiguated any qualitative differences in the rightmost column. As mentioned above, we recommend reviewing Azure Cosmos DB's [consistency settings](../consistency-levels.md). 

:::image type="content" source="./media/apache-cassandra-consistency-mapping/account.png" alt-text="Cassandra consistency account level mapping" lightbox="./media/apache-cassandra-consistency-mapping/account.png" :::

:::image type="content" source="./media/apache-cassandra-consistency-mapping/dynamic.png" alt-text="Cassandra consistency dynamic mapping" lightbox="./media/apache-cassandra-consistency-mapping/dynamic.png" :::

If your Azure Cosmos account is configured with a consistency level other than the strong consistency, you can find out the probability that your clients may get strong and consistent reads for your workloads by looking at the *Probabilistically Bounded Staleness* (PBS) metric. This metric is exposed in the Azure portal, to learn more, see [Monitor Probabilistically Bounded Staleness (PBS) metric](../how-to-manage-consistency.md#monitor-probabilistically-bounded-staleness-pbs-metric).

Probabilistic bounded staleness shows how eventual is your eventual consistency. This metric provides an insight into how often you can get a stronger consistency than the consistency level that you have currently configured on your Azure Cosmos account. In other words, you can see the probability (measured in milliseconds) of getting strongly consistent reads for a combination of write and read regions.

## Next steps

Learn more about global distribution and consistency levels for Azure Cosmos DB:

* [Global distribution overview](../distribute-data-globally.md)
* [Consistency Level overview](../consistency-levels.md)
* [High availability](../high-availability.md)
