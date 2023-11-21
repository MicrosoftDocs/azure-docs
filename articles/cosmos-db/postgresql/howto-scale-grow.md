---
title: Configure cluster - Azure Cosmos DB for PostgreSQL
description: Adjust cluster CPU/memory and disk resources to deal with increased load or enable HA for improved availability.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 06/05/2023
---

# Scale a cluster in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL provides self-service
scaling to deal with increased load. The Azure portal makes it easy to add new
worker nodes, and to increase the vCores and storage for existing nodes.

Adding nodes causes no downtime, and even moving shards to the new nodes (called [shard
rebalancing](howto-scale-rebalance.md)) happens without interrupting
queries.

## Add worker nodes

1. On the portal page for your cluster, select **Scale** from the left menu.

1. On the **Scale** page, under **Nodes**, select a new value for **Node count**.

   :::image type="content" source="media/howto-scaling/01-sliders-workers.png" alt-text="Resource sliders":::

1. Select **Save** to apply the changed values.

> [!NOTE]
> Once you increase nodes and save, you can't decrease the number of worker nodes by using this **Scale** page.

> [!NOTE]
> To take advantage of newly added nodes you must [rebalance distributed table
> shards](howto-scale-rebalance.md), which means moving some
> [shards](concepts-nodes.md#shards) from existing nodes
> to the new ones. Rebalancing can work in the background, and requires no
> downtime.

## Increase or decrease vCores on nodes

You can increase the capabilities of existing nodes. Adjusting compute capacity up and down can be useful for performance
experiments, and short- or long-term changes to traffic demands.

To change the vCores for all worker nodes, on the **Scale** screen, select a new value under **Compute per node**. To adjust the coordinator's vCores, expand **Coordinator** and select a new value under **Coordinator compute**.

> [!NOTE]
> You can scale compute on [cluster read replicas](concepts-read-replicas.md) independent of their primary cluster's compute.

> [!NOTE]
> There is a vCore quota per Azure subscription per region.  The default quota
> should be more than enough to experiment with Azure Cosmos DB for PostgreSQL.  If you
> need more vCores for a region in your subscription, see how to [adjust
> compute quotas](howto-compute-quota.md).

## Increase storage on nodes

You can increase the disk space of existing
nodes. Increasing disk space can allow you to do more with existing worker
nodes before needing to add more worker nodes.

To change the storage amount for all worker nodes, on the **Scale** screen, select a new value under **Storage per node**. To adjust the coordinator node's storage, expand **Coordinator** and select a new value under **Coordinator storage**.

> [!NOTE]
> Once you increase storage and save, you can't decrease the amount of storage.

## Choose preferred availability zone

You can choose preferred [availability zone](./concepts-cluster.md#node-availability-zone) for nodes if your cluster is in an Azure region that supports availability zones. If you select preferred availability zone during cluster provisioning, Azure Cosmos DB for PostgreSQL provisions all cluster nodes into selected availability zone. If you select or change preferred availability zone after provisioning, all cluster nodes are moved to the new preferred availability zone during next [scheduled maintenance](./concepts-maintenance.md). 

To select preferred availability zone for all cluster nodes, on the **Scale** screen, specify a zone in **Preferred availability zone** list. To let Azure Cosmos DB for PostgreSQL service select an availability zone for cluster, choose 'No preference'.

## Next steps

- Learn more about cluster [performance options](resources-compute.md).
- [Rebalance distributed table shards](howto-scale-rebalance.md)
  so that all worker nodes can participate in parallel queries
- See the sizes of distributed tables, and other [useful diagnostic
  queries](howto-useful-diagnostic-queries.md).
