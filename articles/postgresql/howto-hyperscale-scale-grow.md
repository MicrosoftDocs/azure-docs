---
title: Scale server group - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Adjust server group memory, disk, and CPU resources to deal with increased load
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 11/17/2020
---

# Scale a Hyperscale (Citus) server group

Azure Database for PostgreSQL - Hyperscale (Citus) provides self-service
scaling to deal with increased load. The Azure portal makes it easy to add new
worker nodes, and to increase the vCores of existing nodes. Adding nodes causes
no downtime, and even moving shards to the new nodes (called [shard
rebalancing](howto-hyperscale-scale-rebalance.md)) happens without interrupting
queries.

## Add worker nodes

To add nodes, go to the **Compute + storage** tab in your Hyperscale (Citus) server
group.  Dragging the slider for **Worker node count** changes the value.

:::image type="content" source="./media/howto-hyperscale-scaling/01-sliders-workers.png" alt-text="Resource sliders":::

Click the **Save** button to make the changed value take effect.

> [!NOTE]
> Once increased and saved, the number of worker nodes cannot be decreased
> using the slider.

> [!NOTE]
> To take advantage of newly added nodes you must [rebalance distributed table
> shards](howto-hyperscale-scale-rebalance.md), which means moving some
> [shards](concepts-hyperscale-distributed-data.md#shards) from existing nodes
> to the new ones.

## Increase or decrease vCores on nodes

In addition to adding new nodes, you can increase the capabilities of existing
nodes. Adjusting compute capacity up and down can be useful for performance
experiments as well as short- or long-term changes to traffic demands.

To change the vCores for all worker nodes, adjust the **vCores** slider under
**Configuration (per worker node)**. The coordinator node's vCores can be
adjusted independently. Adjust the **vCores** slider under  **Configuration
(coordinator node)**.

## Next steps

- Learn more about server group [performance
  options](concepts-hyperscale-configuration-options.md).
- [Rebalance distributed table shards](howto-hyperscale-scale-rebalance.md)
  so that all worker nodes can participate in parallel queries
