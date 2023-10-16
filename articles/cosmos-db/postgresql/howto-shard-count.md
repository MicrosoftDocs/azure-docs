---
title: Choose shard count - Azure Cosmos DB for PostgreSQL
description: Pick the right shard count for distributed tables
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 01/30/2023
---

# Choose shard count in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Choosing the shard count for each distributed table is a balance between the
flexibility of having more shards, and the overhead for query planning and
execution across them. If you decide to change the shard count of a table after
distributing, you can use the
[alter_distributed_table](reference-functions.md#alter_distributed_table)
function.

## Multi-tenant SaaS use case

The optimal choice varies depending on your access patterns for the data. For
instance, in the Multi-Tenant SaaS Database use-case we recommend choosing
between **32 - 128** shards. For smaller workloads say <100 GB, you could start with
32 shards and for larger workloads you could choose 64 or 128. This choice gives you
the leeway to scale from 32 to 128 worker machines.

## Real-time analytics use case

In the Real-Time Analytics use-case, shard count should be related to the total
number of cores on the workers. To ensure maximum parallelism, you should create
enough shards on each node such that there is at least one shard per CPU core.
We typically recommend creating a high number of initial shards, for example,
**2x or 4x the number of current CPU cores**. Having more shards allows for
future scaling if you add more workers and CPU cores.

Keep in mind that, for each query, Azure Cosmos DB for PostgreSQL opens one
database connection per shard, and that these connections are limited. Be
careful to keep the shard count small enough that distributed queries won’t
often have to wait for a connection. Put another way, the connections needed,
`(max concurrent queries * shard count)`, shouldn't exceed the total
connections possible in the system, `(number of workers * max_connections per
worker)`.

## Next steps

- Learn more about cluster [performance options](resources-compute.md).
- [Scale a cluster](howto-scale-grow.md) up or out
- [Rebalance shards](howto-scale-rebalance.md)
