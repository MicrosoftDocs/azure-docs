---
title: Rebalance shards - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Learn how to use the Azure portal to rebalance data in a server group using the Shard rebalancer.
ms.custom: kr2b-contr-experiment
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 07/20/2021
---

# Rebalance shards in Hyperscale (Citus) server group

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

To take advantage of newly added nodes, rebalance distributed table
[shards](concepts-distributed-data.md#shards). Rebalancing moves shards from existing nodes to the new ones. Hyperscale (Citus) offers
zero-downtime rebalancing, meaning queries continue without interruption during
shard rebalancing.

## Determine if the server group is balanced

The Azure portal shows whether data is distributed equally between
worker nodes in a server group or not. From the **Server group management** menu, select **Shard rebalancer**.

- If data is skewed between workers: You'll see the message, **Rebalancing is recommended** and a list of the size of each node.

- If data is balanced: You'll see the message, **Rebalancing is not recommended at this time**.

## Run the Shard rebalancer

To start the Shard rebalancer, connect to the coordinator node of the server group and then run the [rebalance_table_shards](reference-functions.md#rebalance_table_shards) SQL function on distributed tables. 

The function rebalances all tables in the
[colocation](concepts-colocation.md) group of the table named in its
argument. You don't have to call the function for every distributed
table. Instead, call it on a representative table from each colocation group.

```sql
SELECT rebalance_table_shards('distributed_table_name');
```

## Monitor rebalance progress

You can view the rebalance progress from the Azure portal. From the **Server group management** menu, select **Shard rebalancer** . The
message **Rebalancing is underway** displays with two tables:

- The first table shows the number of shards moving into or out of a node. For
example, "6 of 24 moved in." 
- The second table shows progress per database table: name, shard count affected, data size affected, and rebalancing status.

Select **Refresh** to update the page. When rebalancing is complete, you'll see the message **Rebalancing is not recommended at this time**.

## Next steps

- Learn more about server group [performance options](resources-compute.md).
- [Scale a server group](howto-scale-grow.md) up or out
- See the
  [rebalance_table_shards](reference-functions.md#rebalance_table_shards)
  reference material
