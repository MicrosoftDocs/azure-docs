---
title: High availability in Azure Cosmos DB for MongoDB vCore 
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Learn about availability (HA) of Azure Cosmos DB for MongoDB vCore clusters.
author: niklarin
ms.author: nlarin
ms.service: azure-cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 06/20/2024
---

# High availability in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

In-region high availability (HA) avoids database downtime by maintaining standby replicas
of every shard in a cluster. If a shard becomes unresponsive for any reason, Azure Cosmos DB for MongoDB vCore
switches incoming connections from the failed shard to its standby. When failover
happens promoted shards always have fresh data through synchronous replication.

All primary shards in a cluster are provisioned into one [availability zone (AZ)](../../../reliability/availability-zones-overview.md)
for better latency between the shards. The standby shards are provisioned into
another availability zone. 

Even without HA enabled, each node has its own locally
redundant storage (LRS) with three synchronous replicas maintained by Azure
Storage service. All three replicas are located in the cluster's Azure region. If there's a single replica failure, Azure Storage service detects it and transparently re-creates failed replica. See metrics [on this page](../../../storage/common/storage-redundancy.md#summary-of-redundancy-options) for LRS storage durability.

When HA *is* enabled, Azure Cosmos DB for MongoDB vCore runs one standby shard for each primary
shard in the cluster. Each primary and standby shard has the same compute and storage configuration. 
The primary and its standby use synchronous replication. This type of replication allows you to always have 
the same data on the primary and standby shards in your cluster. In a nutshell, our service detects a failure
on primary shards, and fails over to standby nodes with zero data loss. 

The cluster connection string always stays the same regardless of failovers. That allows the service to abstract changes in physical shards serving requests from applications.

High availability can be enabled at cluster creation time. High availability can also be [enabled and disabled at any time on an existing Azure Cosmos DB for MongoDB vCore cluster](./how-to-scale-cluster.md#enable-or-disable-high-availability). There's no database downtime when high availability is enabled or disabled on an Azure Cosmos DB for MongoDB vCore cluster.

## What happens during a failover
Each shard failover consists of three phases: Unavailability detection, switch to the standby shard, and re-creation of the standby shard. The service performs ongoing monitoring of availability for each primary and standby shard in the cluster by doing periodic health check. When health check reliably indicates that shard became unresponsive and needs to be declared failed, actual failover (switch) to the standby shard is initiated.

During the switch phase, database reads and writes are redirected to the standby shard. Synchronous replication between each primary and standby shard ensures that the standby shard always have the same set of data as its primary. That allows all failovers to be performed with zero data loss. The switch to standby is done with no downtime for reads. Write operations may require internal service retries during the switch phase. These retries might be seen as write slowness on the application side.

Once the shard failover is completed, the cluster is fully operational. The last step to return to the original highly available configuration is to re-create the standby shard. This standby shard re-creation is performed without downtime or performance impact on the primary shard. 

## Related content

- [See how to enable high availability in Azure Cosmos DB for MongoDB vCore](./how-to-scale-cluster.md#enable-or-disable-high-availability)
- [Learn about reliability fundamentals in Azure Cosmos DB for MongoDB vCore](../../../reliability/reliability-cosmos-mongodb.md)
