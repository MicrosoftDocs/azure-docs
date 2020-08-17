---
title: Scale server group - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Adjust server group memory, disk, and CPU resources to deal with increased load
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 8/10/2020
---

# Server group size

The Hyperscale (Citus) deployment option uses cooperating database servers to
parallelize query execution and store more data. Server group "size" refers
to both the number of servers, and the hardware resources of each.

## Picking initial size

The size of a server group, in terms of number of nodes and their hardware
capacity, is easy to change ([see
below](#scale-a-hyperscale-citus-server-group)). However you still need to
choose an initial size for a new server group. Here are some tips for a
reasonable choice.

### Multi-Tenant SaaS Use-Case

For those migrating to Hyperscale (Citus) from an existing single-node
PostgreSQL database instance, we recommend choosing a cluster where the number
of worker vCores and RAM in total equals that of the original instance. In such
scenarios we have seen 2-3x performance improvements because sharding improves
resource utilization, allowing smaller indices etc.

The number of vCores required for the coordinator node depends on your existing
workload (write/read throughput). The coordinator node doesn't require as much
RAM as worker nodes, but RAM allocation is determined based on vCore count (as
described in the [Hyperscale configuration
options](concepts-hyperscale-configuration-options.md)) so the vCore count is
essentially the real decision.

### Real-Time Analytics Use-Case

Total vCores: when working data fits in RAM, you can expect a linear
performance improvement on Hyperscale (Citus) proportional to the number of
worker cores. To determine the right number of vCores for your needs, consider
the current latency for queries in your single-node database and the required
latency in Hyperscale (Citus). Divide current latency by desired latency, and
round the result.

Worker RAM: the best case would be providing enough memory that the majority of
the working set fits in memory. The type of queries your application uses
affect memory requirements. You can run EXPLAIN ANALYZE on a query to determine
how much memory it requires. Remember that vCores and RAM are scaled together
as described in the [Hyperscale configuration
options](concepts-hyperscale-configuration-options.md) article.

## Scale a Hyperscale (Citus) server group

Azure Database for PostgreSQL - Hyperscale (Citus) provides self-service
scaling to deal with increased load. The Azure portal makes it easy to add new
worker nodes, and to increase the vCores of existing nodes. Adding nodes causes
no downtime, and even moving shards to the new nodes (called [shard
rebalancing](#rebalance-shards)) happens without interrupting queries.

### Add worker nodes

To add nodes, go to the **Configure** tab in your Hyperscale (Citus) server
group.  Dragging the slider for **Worker node count** changes the value.

![Resource sliders](./media/howto-hyperscale-scaling/01-sliders-workers.png)

Click the **Save** button to make the changed value take effect.

> [!NOTE]
> Once increased and saved, the number of worker nodes cannot be decreased
> using the slider.

#### Rebalance shards

To take advantage of newly added nodes you must rebalance distributed table
[shards](concepts-hyperscale-distributed-data.md#shards), which means moving
some shards from existing nodes to the new ones. First verify that the new
workers have successfully finished provisioning. Then start the shard
rebalancer, by connecting to the cluster coordinator node with psql and
running:

```sql
SELECT rebalance_table_shards('distributed_table_name');
```

The `rebalance_table_shards` function rebalances all tables in the
[colocation](concepts-hyperscale-colocation.md) group of the table named in its
argument. Thus you do not have to call the function for every distributed
table, just call it on a representative table from each colocation group.

### Increase or decrease vCores on nodes

> [!NOTE]
> This feature is currently in preview. To request a change in vCores for
nodes in your server group, please [contact Azure
support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

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
