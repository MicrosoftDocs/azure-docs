---
title: Reliability in Azure Cosmos DB for MongoDB vCore
description: Find out about reliability in Azure Cosmos DB for MongoDB vCore
author: anaharris-ms
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: concept
ms.date: 03/11/2024
ms.custom: references_regions, subject-reliability
CustomerIntent: As a cloud architect/engineer, I need general guidance reliability in Azure Cosmos DB for MongoDB vCore
---

# Reliability in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../cosmos-db/includes/appliesto-mongodb-vcore.md)]

This article contains detailed information on regional resiliency with [availability zones](#availability-zone-support) and [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity) for Azure Cosmos DB for MongoDB vCore.

For an architectural overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

To gain availability zone support, you must enable High availability (HA). 

HA avoids database downtime by maintaining standby replicas of every shard in a cluster. If a shard goes down, Azure Cosmos DB for MongoDB vCore switches incoming connections from the failed shard to its standby replica.

When HA is enabled in a region that supports availability zones, HA replica shards are provisioned in a different availability zone from their primary shards. HA replicas don't receive requests from clients unless their primary shard fails.

If HA is disabled, each shard has its own locally redundant storage (LRS) with three synchronous replicas maintained by Azure Storage service. If there's a single replica failure, the Azure Storage service detects the failure, and transparently re-creates the relevant data. For LRS storage durability, see [Summary of redundancy options](/azure/storage/common/storage-redundancy#summary-of-redundancy-options). However, in the case of a region failure,  you run the risk of extensive downtime and possible data loss.


### Prerequisites

Your Azure Cosmos DB for MongoDB vCore cluster must be created in the following regions:

-	Australia East  
-	Southeast Asia 
-	Canada Central
-	North Europe
-	UK South
-	West Europe
-	Central US
-	East US
-	East US 2
-	South Central US
-	West US 2


### Create a resource with availability zones enabled

To enable availability zones, you must enable High availability (HA) when [creating a cluster](../cosmos-db/mongodb/vcore/quickstart-portal.md) or in the [**Scale** section of an existing cluster](../cosmos-db/mongodb/vcore/how-to-scale-cluster.md) in the Azure portal.


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

 Azure Cosmos DB for MongoDB vCore does not provide built-in automatic failover or disaster recovery. Planning for high availability is a critical step as your solution scales.

### Disaster recovery in single-region geography

To maximize your uptime, plan ahead to maintain business continuity and prepare for disaster recovery with Azure Cosmos DB for MongoDB vCore.

While Azure services are designed to maximize uptime, unplanned service outages might occur. A disaster recovery plan ensures that you have a strategy in place for handling regional service outages.

Azure Cosmos DB for MongoDB vCore automatically takes backups of your data at regular intervals. The automatic backups are taken without affecting the performance or availability of the database operations. All backups are performed automatically in the background and stored separately from the source data in a storage service. These automatic backups are useful in scenarios when you accidentally delete or modify resources and later require the original versions.

Automatic backups are retained in various intervals based on whether the cluster is currently active or recently deleted.

| | Retention period |
| --- | --- |
| **Active clusters** | `35` days |
| **Deleted clusters** | `7` days |

## Design for high availability

High availability (HA) should be enabled for critical Azure Cosmos DB for MongoDB vCore clusters running production workloads. In an HA-enabled cluster, each shard serves as a primary along with a hot-standby shard provisioned in another availability zone. Replication between the primary and the secondary shard is synchronous by default. Any modification to the database is persisted on both the primary and the secondary (hot-standby) shards before a response from the database is received.

The service maintains health checks and heartbeats to each primary and secondary shard of the cluster. If a primary shard becomes unavailable due to a zone or regional outage, the secondary shard is automatically promoted to become the new primary and a subsequent secondary shard is built for the new primary. In addition, if a secondary shard becomes unavailable, the service auto creates a new secondary shard with a full copy of data from the primary.

If the service triggers a failover from the primary to the secondary shard, connections are seamlessly routed under the covers to the new primary shard.

Synchronous replication between the primary and secondary shards guarantees no data loss if there's a failover.

## Next steps

- Read more about [feature compatibility with MongoDB](../cosmos-db/mongodb/vcore/compatibility.md).
- Review options for [migrating from MongoDB to Azure Cosmos DB for MongoDB vCore](../cosmos-db/mongodb/vcore/migration-options.md)
- Get started by [creating an account](../cosmos-db/mongodb/vcore/quickstart-portal.md).