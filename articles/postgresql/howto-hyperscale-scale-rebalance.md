---
title: Rebalance shards - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Distribute shards evenly across servers for better performance
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 11/17/2020
---

# Rebalance shards in Hyperscale (Citus) server group

To take advantage of newly added nodes you must rebalance distributed table
[shards](concepts-hyperscale-distributed-data.md#shards), which means moving
some shards from existing nodes to the new ones. First verify that the new
workers have successfully finished provisioning. Then start the shard
rebalancer, by connecting to the cluster coordinator node with psql and
running:

```sql
SELECT rebalance_table_shards('distributed_table_name');
```

The
[rebalance_table_shards](reference-hyperscale-functions.md#rebalance_table_shards)
function rebalances all tables in the
[colocation](concepts-hyperscale-colocation.md) group of the table named in its
argument. Thus you do not have to call the function for every distributed
table, just call it on a representative table from each colocation group.

**Next steps**


- Learn more about server group [performance
  options](concepts-hyperscale-configuration-options.md).
- [Scale a server group](howto-hyperscale-scale-grow.md) up or out
- See the
  [rebalance_table_shards](reference-hyperscale-functions.md#rebalance_table_shards)
  reference material
