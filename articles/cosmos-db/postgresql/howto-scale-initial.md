---
title: Initial cluster size - Azure Cosmos DB for PostgreSQL
description: Pick the right initial size for your use case
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 01/30/2023
---

# Pick initial size for cluster in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

The size of a cluster, both number of nodes and their hardware capacity,
is [easy to change](howto-scale-grow.md)). However you still need to
choose an initial size for a new cluster. Here are some tips for a
reasonable choice.

## Use-cases

Azure Cosmos DB for PostgreSQL is frequently used in the following ways.

### Multi-tenant SaaS

When migrating to Azure Cosmos DB for PostgreSQL from an existing single-node PostgreSQL
database instance, choose a cluster where the number of worker vCores and RAM
in total equals that of the original instance. In such scenarios we have seen
2-3x performance improvements because sharding improves resource utilization,
allowing smaller indices etc.

The vCore count is actually the only decision. RAM allocation is currently
determined based on vCore count, as described in the [compute and
storage](resources-compute.md) page.  The coordinator node doesn't require as
much RAM as workers, but there's no way to choose RAM and vCores independently.

### Real-time analytics

Total vCores: when working data fits in RAM, you can expect a linear
performance improvement on Azure Cosmos DB for PostgreSQL proportional to the number of
worker cores. To determine the right number of vCores for your needs, consider
the current latency for queries in your single-node database and the required
latency in Azure Cosmos DB for PostgreSQL. Divide current latency by desired latency, and
round the result.

Worker RAM: the best case would be providing enough memory that most the
working set fits in memory. The type of queries your application uses affect
memory requirements. You can run EXPLAIN ANALYZE on a query to determine how
much memory it requires. Remember that vCores and RAM are scaled together as
described in the [compute and storage](resources-compute.md) article.

## Next steps

- [Scale a cluster](howto-scale-grow.md)
- Learn more about cluster [performance
  options](resources-compute.md).
