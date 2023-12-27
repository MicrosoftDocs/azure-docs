---
title: High availability and replication
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Review replication and high availability concepts in the context of Azure Cosmos DB for MongoDB vCore.
author: gahl-levy
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 08/28/2023
---

# High availability in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

High availability (HA) avoids database downtime by maintaining standby replicas of every shard in a cluster. If a shard goes down, Azure Cosmos DB for MongoDB vCore switches incoming connections from the failed shard to its standby replica.

## How it works

When HA is enabled, Azure Cosmos DB for MongoDB vCore runs one replica shard for each primary shard in the cluster. The primary and its replica use synchronous replication. The service detects failures on primary shards and fails over to the replica shards with zero data loss. The MongoDB connection string remains the same.

When HA is enabled, HA replica shards are provisioned in a different availability zone from their primary shards, if the region supports multiple zones and has available capacity. HA replicas don't receive requests from clients unless their primary shard fails.

Even without HA enabled, each shard has its own locally redundant storage (LRS) with three synchronous replicas maintained by Azure Storage service. If there's a single replica failure, the Azure Storage service detects the failure, and transparently re-creates the relevant data. For LRS storage durability, see metrics on [this page](../../../storage/common/storage-redundancy.md#summary-of-redundancy-options).

## Configure high availability

High availability (HA) can be specified when [creating a cluster](quickstart-portal.md) or in the [**Scale** section of an existing cluster](how-to-scale-cluster.md) in the Azure portal.

## Next steps

> [!div class="nextstepaction"]
> [Scale a cluster in Azure Cosmos DB for MongoDB vCore](how-to-scale-cluster.md)
