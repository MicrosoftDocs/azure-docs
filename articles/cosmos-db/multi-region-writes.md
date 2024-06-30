---
title: Understanding multi-region writes in Azure Cosmos DB
description: This article describes how multi-region writes work in Azure Cosmos DB.
author: TheovanKraay
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/12/2024
ms.author: thvankra
ms.reviewer: thvankra
---

# Understanding multi-region writes in Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

The best way to achieve near-zero downtime in either a partial or total outage scenario where consistency of reads doesn't need to be guaranteed, is to configure your account for multi-region writes. This article covers the key concepts to be aware of when configuring a multi-region write account. 

## Hub region
In a multi-region-write database account with two or more regions, the first region in which your account was created is called the "hub" region. All other regions that are then added to the account are called "satellite" regions. If the hub region is removed from the account, the next region, in the order they were added, is automatically chosen as the hub region.  

Any writes arriving in satellite regions are quorum committed in the local region and then later sent to the Hub region for [conflict resolution](conflict-resolution-policies.md), asynchronously. Once a write goes to the hub region and gets conflict resolved, it becomes a "confirmed" write. Until then, it's called a "tentative" write or an "unconfirmed" write. Any write served from the hub region immediately becomes a confirmed write. 

## Understanding timestamps  

One of the primary differences in a multi-region-write account is the presence of two server timestamp values associated with each entity. The first is the server epoch time at which the entity was written in that region. This timestamp is available in both single-region write and multi-region write accounts. The second server timestamp value is associated with the epoch time at which the absence of a conflict was confirmed, or the conflict was resolved in the hub region. A confirmed or conflict resolved write has a conflict-resolution timestamp (`crts`) assigned, whereas an unconfirmed or tentative write doesn't have `crts`. There are two timestamps in Cosmos DB set by the server. The primary difference is whether the region configuration of the account is Single-Write or Multi-Write.

| Timestamp | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | When exposed                                                                                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_ts`       | The server epoch time at which the entity was written.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Always exposed by all read and query APIs.                                                                                                                                   |
| `crts`      | The epoch time at which the Multi-Write conflict was resolved, or the absence of a conflict was confirmed. For Multi-Write region configuration, this timestamp defines the order of changes for Continuous backup and Change Feed:<br><br><ul><li>Used to find start time for Change Feed requests</li><li>Used as sort order for in Change Feed response.</li><li>Used to order the writes for Continuous Backup</li><li>The log backup only captures confirmed or conflict resolved writes and hence restore result of a Continuous backup only returns confirmed writes.</li></ul> | Exposed in response to Change Feed requests and only when "New Wire Model" is enabled by the request. This is the default for [All versions and deletes](change-feed.md#all-versions-and-deletes-mode-preview) Change Feed mode. |



## Next steps

Next, you can read the following articles:

* [Conflict types and resolution policies when using multiple write regions](conflict-resolution-policies.md)

* [Configure multi-region writes in your applications that use Azure Cosmos DB](how-to-multi-master.md)

* [Consistency levels in Azure Cosmos DB](./consistency-levels.md)

* [Request Units in Azure Cosmos DB](./request-units.md)

* [Global data distribution with Azure Cosmos DB - under the hood](global-dist-under-the-hood.md)

* [Consistency levels in Azure Cosmos DB](consistency-levels.md)

* [Diagnose and troubleshoot the availability of Azure Cosmos DB SDKs in multiregional environments](troubleshoot-sdk-availability.md)
