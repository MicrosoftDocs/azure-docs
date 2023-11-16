---
title: Determine table size - Azure Cosmos DB for PostgreSQL
description: How to find the true size of distributed tables in a cluster
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 01/30/2023
---

# Determine table and relation size in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

The usual way to find table sizes in PostgreSQL, `pg_total_relation_size`,
drastically under-reports the size of distributed tables on Azure Cosmos DB for PostgreSQL.
All this function does on a cluster is to reveal the size
of tables on the coordinator node.  In reality, the data in distributed tables
lives on the worker nodes (in shards), not on the coordinator. A true measure
of distributed table size is obtained as a sum of shard sizes. Azure Cosmos DB for PostgreSQL
provides helper functions to query this information.

<table>
<colgroup>
<col width="40%" />
<col width="59%" />
</colgroup>
<thead>
<tr class="header">
<th>Function</th>
<th>Returns</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>citus_relation_size(relation_name)</td>
<td><ul>
<li>Size of actual data in table (the "<a href="https://www.postgresql.org/docs/current/static/storage-file-layout.html">main fork</a>").</li>
<li>A relation can be the name of a table or an index.</li>
</ul></td>
</tr>
<tr class="even">
<td>citus_table_size(relation_name)</td>
<td><ul>
<li><p>citus_relation_size plus:</p>

<ul>
<li>size of <a href="https://www.postgresql.org/docs/current/static/storage-fsm.html">free space map</a></li>
<li>size of <a href="https://www.postgresql.org/docs/current/static/storage-vm.html">visibility map</a></li>
</ul>
</li>
</ul></td>
</tr>
<tr class="odd">
<td>citus_total_relation_size(relation_name)</td>
<td><ul>
<li><p>citus_table_size plus:</p>

<ul>
<li>size of indices</li>
</ul>
</li>
</ul></td>
</tr>
</tbody>
</table>

These functions are analogous to three of the standard PostgreSQL [object size
functions](https://www.postgresql.org/docs/current/static/functions-admin.html#FUNCTIONS-ADMIN-DBSIZE),
except if they can't connect to a node, they error out.

## Example

Here's how to list the sizes of all distributed tables:

``` postgresql
SELECT logicalrelid AS name,
       pg_size_pretty(citus_table_size(logicalrelid)) AS size
  FROM pg_dist_partition;
```

Output:

```
┌───────────────┬───────┐
│     name      │ size  │
├───────────────┼───────┤
│ github_users  │ 39 MB │
│ github_events │ 37 MB │
└───────────────┴───────┘
```

## Next steps

* Learn to [scale a cluster](howto-scale-grow.md) to hold more data.
* Distinguish [table types](concepts-nodes.md) in a cluster.
* See other [useful diagnostic queries](howto-useful-diagnostic-queries.md).
