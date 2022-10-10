---
title: Mapping consistency levels for Azure Cosmos DB for MongoDB
description: Mapping consistency levels for Azure Cosmos DB for MongoDB.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 10/12/2020
ms.reviewer: mjbrown
---

# Consistency levels for Azure Cosmos DB and the API for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Unlike Azure Cosmos DB, the native MongoDB does not provide precisely defined consistency guarantees. Instead, native MongoDB allows users to configure the following consistency guarantees: a write concern, a read concern, and the isMaster directive - to direct the read operations to either primary or secondary replicas to achieve the desired consistency level.

When using Azure Cosmos DB’s API for MongoDB, the MongoDB driver treats your write region as the primary replica and all other regions are read replica. You can choose which region associated with your Azure Cosmos DB account as a primary replica.

> [!NOTE]
> The default consistency model for Azure Cosmos DB is Session. Session is a client-centric consistency model which is not natively supported by either Cassandra or MongoDB. For more information on which consistency model to choose see, [Consistency levels in Azure Cosmos DB](../consistency-levels.md)

While using Azure Cosmos DB’s API for MongoDB:

* The write concern is mapped to the default consistency level configured on your Azure Cosmos DB account.

* Azure Cosmos DB will dynamically map the read concern specified by the MongoDB client driver to one of the Azure Cosmos DB consistency levels that is configured dynamically on a read request.  

* You can annotate a specific region associated with your Azure Cosmos DB account as "Primary" by making the region as the first writable region. 

## Mapping consistency levels

The following table illustrates how the native MongoDB write/read concerns are mapped to the Azure Cosmos DB consistency levels when using Azure Cosmos DB’s API for MongoDB:

:::image type="content" source="../media/consistency-levels-across-apis/consistency-model-mapping-mongodb.png" alt-text="MongoDB consistency model mapping" lightbox= "../media/consistency-levels-across-apis/consistency-model-mapping-mongodb.png":::

If your Azure Cosmos DB account is configured with a consistency level other than the strong consistency, you can find out the probability that your clients may get strong and consistent reads for your workloads by looking at the *Probabilistically Bounded Staleness* (PBS) metric. This metric is exposed in the Azure portal, to learn more, see [Monitor Probabilistically Bounded Staleness (PBS) metric](../how-to-manage-consistency.md#monitor-probabilistically-bounded-staleness-pbs-metric).

Probabilistic bounded staleness shows how eventual is your eventual consistency. This metric provides an insight into how often you can get a stronger consistency than the consistency level that you have currently configured on your Azure Cosmos DB account. In other words, you can see the probability (measured in milliseconds) of getting strongly consistent reads for a combination of write and read regions.

## Next steps

Learn more about global distribution and consistency levels for Azure Cosmos DB:

* [Global distribution overview](../distribute-data-globally.md)
* [Consistency Level overview](../consistency-levels.md)
* [High availability](../high-availability.md)
