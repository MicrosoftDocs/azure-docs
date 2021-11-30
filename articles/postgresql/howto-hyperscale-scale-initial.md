---
title: Initial server group size - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Pick the right initial size for your use case
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 08/03/2021
---

# Pick initial size for Hyperscale (Citus) server group

The size of a server group, both number of nodes and their hardware capacity,
is [easy to change](howto-hyperscale-scale-grow.md)). However you still need to
choose an initial size for a new server group. Here are some tips for a
reasonable choice.

## Use-cases

Hyperscale (Citus) is frequently used in the following ways.

### Multi-tenant SaaS

When migrating to Hyperscale (Citus) from an existing single-node PostgreSQL
database instance, choose a cluster where the number of worker vCores and RAM
in total equals that of the original instance. In such scenarios we have seen
2-3x performance improvements because sharding improves resource utilization,
allowing smaller indices etc.

The vCore count is actually the only decision. RAM allocation is currently
determined based on vCore count, as described in the [Hyperscale (Citus)
configuration options](concepts-hyperscale-configuration-options.md) page.
The coordinator node doesn't require as much RAM as workers, but there's
no way to choose RAM and vCores independently.

### Real-time analytics

Total vCores: when working data fits in RAM, you can expect a linear
performance improvement on Hyperscale (Citus) proportional to the number of
worker cores. To determine the right number of vCores for your needs, consider
the current latency for queries in your single-node database and the required
latency in Hyperscale (Citus). Divide current latency by desired latency, and
round the result.

Worker RAM: the best case would be providing enough memory that most
the working set fits in memory. The type of queries your application uses
affect memory requirements. You can run EXPLAIN ANALYZE on a query to determine
how much memory it requires. Remember that vCores and RAM are scaled together
as described in the [Hyperscale (Citus) configuration
options](concepts-hyperscale-configuration-options.md) article.

## Choosing a Hyperscale (Citus) tier

The sections above give an idea how many vCores and how much RAM are needed for
each use case. You can meet these demands through a choice between two
Hyperscale (Citus) tiers: the basic tier and the standard tier.

The basic tier uses a single database node to perform processing, while the
standard tier allows more nodes. The tiers are otherwise identical, offering
the same features. In some cases, a single node's vCores and disk space can be
scaled to suffice, and in other cases it requires the cooperation of multiple
nodes.

For a comparison of the tiers, see the [basic
tier](concepts-hyperscale-tiers.md) concepts page.

## Next steps

- [Scale a server group](howto-hyperscale-scale-grow.md)
- Learn more about server group [performance
  options](concepts-hyperscale-configuration-options.md).
