---
title: Cross-region replication (preview)
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Learn about Azure Cosmos DB for MongoDB vCore cross-region disaster recovery (DR) and read replicas.
author: niklarin
ms.author: nlarin
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.custom:
  - build-2024
ms.topic: concept-article
ms.date: 05/20/2024
#Customer Intent: As a database adminstrator, I want to configure cross-region replication, so that I can have disaster recovery plans in the event of a regional outage.
---

# Cross-region replication in Azure Cosmos DB for MongoDB vCore (preview)

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

> [!IMPORTANT]
> Cross-region replication in Azure Cosmos DB for MongoDB vCore is currently in preview.
> This preview version is provided without a service level agreement (SLA), and it's not recommended
> for production workloads. Certain features might not be supported or might have constrained
> capabilities.

This article discusses cross-region disaster recovery (DR) for Azure Cosmos DB for MongoDB vCore. It also covers read capabilities of the cluster replicas in other regions for read operations scalability.

The cross-region replication feature allows you to replicate data from a cluster to a read-only cluster in another Azure region. Replicas are updated with asynchronous replication technology. You can have one cluster replica in another region of choice for the primary Azure Cosmos DB for MongoDB vCore cluster. In a rare case of region outage, you can promote cluster replica in another region to become the new read-write cluster for continuous operation of your MongoDB database. Applications might continue to use the same connection strings after cluster replica in another region is promoted to become the new primary cluster.   

Replicas are new clusters that you manage similar to regular clusters. For each read replica, you're billed for the provisioned compute in vCores and storage in GiB/month. Compute and storage costs for replica clusters have the same structure as the regular clusters and prices of the Azure region where they're created.

## Disaster recovery using cluster read replicas

Cross-region replication is one of several important pillars in [the Azure business continuity and disaster recovery (BCDR) strategy](../../../reliability/business-continuity-management-program.md). Cross-region replication asynchronously replicates the same applications and data across other Azure regions for disaster recovery protection. Not all Azure services automatically replicate data or automatically fall back from a failed region to cross-replicate to another enabled region. Azure Cosmos DB for MongoDB vCore provides an option to create a cluster replica in another region and have data written on the primary cluster replicated to that replica automatically. The fallback to the cluster replica if there's an outage in the primary region needs to be initiated manually.

When cross-region replication is enabled on an Azure Cosmos DB for MongoDB vCore cluster, each shard gets replicated to another region continuously. This replication maintains a replica of data in the selected region. Such a replica is ready to be used as a part of disaster recovery plan in a rare case of the primary region outage. Replication is asynchronous. Write operations on the primary cluster's shard don't wait for completed replication to the corresponding replica's shard before sending confirmation of a successful write. Asynchronous replication helps to avoid increased latencies for write operations on the primary cluster.  

## Read operations on cluster replicas and connection strings

Replica clusters are also available for reads. It helps offload intensive read operations from the primary cluster or deliver reduced latency for read operations to the clients that are located closer to the replication region.

When you create a replica by enabling cross-region replication, it doesn't inherit networking settings such as firewall rules of the primary cluster. These settings must be set up independently for the replica.

The replica inherits the admin account from the primary cluster. User accounts need to be managed on the primary cluster. You can connect to the primary cluster and its replica cluster using the same user accounts.

When cross-region replication is enabled, applications can use the replica cluster connection string to perform reads from the cluster replica. The primary cluster is available for read and write operations using its own connection string.

## Replica cluster promotion

If a region outage occurs, you can perform disaster recovery operation by promoting your cluster replica in another region to become available for writes. During replica promotion operation, these steps are happening:

1. Writes on the replica in region B are enabled in addition to reads. The former replica becomes a new read-write cluster.
1. The promoted replica cluster accepts writes using its connection string.
1. The cluster in region A is set to read-only and keeps its connection string.

> [!IMPORTANT]
> Because replication is asynchronous, some data from cluster in region A might not be replicated to region B when cluster replica in region B is promoted. If this is the case, promotion would result in the un-replicated data not present on both clusters.

## Related content

- [Learn how to enable cross-region replication and promote replica cluster](./how-to-cluster-replica.md)
- [Learn about reliability in Azure Cosmos DB for MongoDB vCore](../../../reliability/reliability-cosmos-mongodb.md)
