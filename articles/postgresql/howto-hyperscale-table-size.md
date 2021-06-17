---
title: Determine table size - Hyperscale (Citus) - Azure Database for PostgreSQL
description: How to find the true size of distributed tables in a Hyperscale (Citus) server group
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 1/5/2021
---

# Determine table and relation size

The usual way to find table sizes in PostgreSQL, `pg_total_relation_size`,
drastically under-reports the size of distributed tables on Hyperscale (Citus).
All this function does on a Hyperscale (Citus) server group is to reveal the size
of tables on the coordinator node.  In reality, the data in distributed tables
lives on the worker nodes (in shards), not on the coordinator. A true measure
of distributed table size is obtained as a sum of shard sizes. Hyperscale
(Citus) provides helper functions to query this information.

<table>
<colgroup>
<col style="width: 40%" />
<col style="width: 59%" />
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
<blockquote>
<ul>
<li>size of <a href="https://www.postgresql.org/docs/current/static/storage-fsm.html">free space map</a></li>
<li>size of <a href="https://www.postgresql.org/docs/current/static/storage-vm.html">visibility map</a></li>
</ul>
</blockquote></li>
</ul></td>
</tr>
<tr class="odd">
<td>citus_total_relation_size(relation_name)</td>
<td><ul>
<li><p>citus_table_size plus:</p>
<blockquote>
<ul>
<li>size of indices</li>
</ul>
</blockquote></li>
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

* Learn to [scale a server group](howto-hyperscale-scale-grow.md) to hold more data.
* Distinguish [table types](concepts-hyperscale-nodes.md) in a Hyperscale (Citus) server group.
