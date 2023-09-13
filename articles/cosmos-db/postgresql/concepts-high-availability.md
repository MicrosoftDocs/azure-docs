---
title: High availability – Azure Cosmos DB for PostgreSQL
description: High availability and disaster recovery concepts
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 06/05/2023
---

# High availability in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

High availability (HA) avoids database downtime by maintaining standby replicas
of every node in a cluster. If a node goes down, Azure Cosmos DB for PostgreSQL
switches incoming connections from the failed node to its standby. Failover
happens within a few minutes, and promoted nodes always have fresh data through
PostgreSQL synchronous streaming replication.

All primary nodes in a cluster are provisioned into one availability zone
for better latency between the nodes. The preferred availability zone allows you to put all cluster nodes in the same availability zone where the application is deployed. This proximity could improve performance further by decreasing app-database latency. The standby nodes are provisioned into
another availability zone. The Azure portal
[displays](concepts-cluster.md#node-availability-zone) the availability
zone of each primary node in a cluster.

Even without HA enabled, each node has its own locally
redundant storage (LRS) with three synchronous replicas maintained by Azure
Storage service.  If there's a single replica failure, it’s detected by Azure
Storage service and is transparently re-created. For LRS storage durability,
see metrics [on this
page](../../storage/common/storage-redundancy.md#summary-of-redundancy-options).

When HA *is* enabled, Azure Cosmos DB for PostgreSQL runs one standby node for each primary
node in the cluster. The primary and its standby use synchronous
PostgreSQL replication. This replication allows customers to have predictable
downtime if a primary node fails. In a nutshell, our service detects a failure
on primary nodes, and fails over to standby nodes with zero data loss.

To take advantage of HA on the coordinator node, database applications need to
detect and retry dropped connections and failed transactions. The newly
promoted coordinator is accessible with the same connection string.

## High availability states

Recovery can be broken into three stages: detection, failover, and full
recovery.  Azure Cosmos DB for PostgreSQL runs periodic health checks on every node, and
after four failed checks it determines that a node is down. Azure Cosmos DB for PostgreSQL
then promotes a standby to primary node status (failover), and creates a new
standby-to-be.  Streaming replication begins, bringing the new node up to date.
When all data has been replicated, the node has reached full recovery.

Azure Cosmos DB for PostgreSQL displays its failover progress state on the Overview page
for clusters in the Azure portal.

* **Healthy**: HA is enabled and the node is fully replicated to its standby.
* **Failover in progress**: A failure was detected on the primary node and
  a failover to standby was initiated. This state transitions into
  **Creating standby** once failover to the standby node is completed, and the
  standby becomes the new primary.
* **Creating standby**: The previous standby was promoted to primary, and a
  new standby is being created for it. When the new secondary is ready, this
  state transitions into **Replication in progress**.
* **Replication in progress**: The new standby node is provisioned and data
  synchronization is in progress. Once all data is replicated to the new
  standby, synchronous replication is enabled between the primary and
  standby nodes, and the nodes' state transitions back to **Healthy**.
* **No**: HA isn't enabled on this node.

## Next steps

- Learn how to [enable high availability](howto-high-availability.md) in a cluster
