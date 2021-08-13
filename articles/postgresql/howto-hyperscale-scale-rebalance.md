---
title: Rebalance shards - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Distribute shards evenly across servers for better performance
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 07/20/2021
---

# Rebalance shards in Hyperscale (Citus) server group

To take advantage of newly added nodes you must rebalance distributed table
[shards](concepts-hyperscale-distributed-data.md#shards), which means moving
some shards from existing nodes to the new ones. Hyperscale (Citus) offers
zero-downtime rebalancing, meaning queries can run without interruption during
shard rebalancing.

## Determine if the server group needs a rebalance

The Azure portal can show you whether data is distributed equally between
worker nodes in a server group. To see it, go to the **Shard rebalancer** page
in the **Server group management** menu. If data is skewed between workers,
you'll see the message **Rebalancing is recommended**, along with a list of the
size of each node.

If data is already balanced, you'll see the message **Rebalancing is not
recommended at this time**.

## Run the shard rebalancer

To start the shard rebalancer, you need to connect to the coordinator node of
the server group and run the
[rebalance_table_shards](reference-hyperscale-functions.md#rebalance_table_shards)
SQL function on distributed tables. The function rebalances all tables in the
[colocation](concepts-hyperscale-colocation.md) group of the table named in its
argument. Thus you do not have to call the function for every distributed
table, just call it on a representative table from each colocation group.

```sql
SELECT rebalance_table_shards('distributed_table_name');
```

## Monitor rebalance progress

To watch the rebalancer after you start it, go back to the Azure portal. Open
the **Shard rebalancer** page in **Server group management**. It will show the
message **Rebalancing is underway** along with two tables.

The first table shows the number of shards moving into or out of a node, for
example, "6 of 24 moved in." The second table shows progress per database
table: name, shard count affected, data size affected, and rebalancing status.

Select the **Refresh** button to update the page. When rebalancing is complete,
it will again say **Rebalancing is not recommended at this time**.

## Next steps

- Learn more about server group [performance
  options](concepts-hyperscale-configuration-options.md).
- [Scale a server group](howto-hyperscale-scale-grow.md) up or out
- See the
  [rebalance_table_shards](reference-hyperscale-functions.md#rebalance_table_shards)
  reference material
