---
title: Nodes in Azure Database for PostgreSQL – Hyperscale (Citus) (preview)
description: The two types of nodes in a server group.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 05/06/2019
---

# Nodes in Azure Database for PostgreSQL – Hyperscale (Citus) (preview)

The Hyperscale (Citus) (preview) hosting type allows Azure Database for
PostgreSQL servers (called nodes) to coordinate with one another in a "shared
nothing" architecture. The nodes in a server group collectively hold more data
and use more CPU cores than would be possible on a single server. The
architecture also allows the database to scale by adding more nodes to the
server group.

## Coordinator and workers

Every server group has a coordinator node and multiple workers. Applications
send their queries to the coordinator node, which relays it to the relevant
workers and accumulates their results. Applications are not able to connect
directly to workers.

For each query, the coordinator either routes it to a single worker node, or
parallelizes it across several depending on whether the required data lives on
a single node or multiple. The coordinator decides what to do by consulting
metadata tables. These tables track the DNS names and health of worker
nodes, and the distribution of data across nodes.

## Next steps
- Learn how nodes store [distributed data](concepts-hyperscale-distributed-data.md)
