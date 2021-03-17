---
title: Limits and limitations – Hyperscale (Citus) - Azure Database for PostgreSQL
description: Current limits for Hyperscale (Citus) server groups
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 3/16/2021
---

# Azure Database for PostgreSQL – Hyperscale (Citus) limits and limitations

The following section describes capacity and functional limits in the
Hyperscale (Citus) service.

## Maximum connections

Every PostgreSQL connection (even idle ones) uses at least 10 MB of memory, so
it's important to limit simultaneous connections. Here are the limits we chose
to keep nodes healthy:

* Coordinator node
   * Maximum connections: 300
   * Maximum user connections: 297
* Worker node
   * Maximum connections: 600
   * Maximum user connections: 597

Attempts to connect beyond these limits will fail with an error. The system
reserves three connections for monitoring nodes, which is why there are three
fewer connections available for user queries than connections total.

Establishing new connections takes time. That works against most applications,
which request many short-lived connections. We recommend using a connection
pooler, both to reduce idle transactions and reuse existing connections. To
learn more, visit our [blog
post](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717).

## Storage scaling

Storage on coordinator and worker nodes can be scaled up (increased) but can't
be scaled down (decreased).

## Storage size

Up to 2 TiB of storage is supported on coordinator and worker nodes. See the
available storage options and IOPS calculation [above](#compute-and-storage)
for node and cluster sizes.

## Database creation

The Azure portal provides credentials to connect to exactly one database per
Hyperscale (Citus) server group, the `citus` database. Creating another
database is currently not allowed, and the CREATE DATABASE command will fail
with an error.

## Columnar storage

Hyperscale (Citus) currently has these limitations with [columnar
tables](concepts-hyperscale-columnar.md):

* Append-only (no UPDATE/DELETE support)
* No space reclamation (for example, rolled-back transactions may still consume
  disk space)
* No index support, index scans, or bitmap index scans
* No tidscans
* No sample scans
* No TOAST support (large values supported inline)
* No support for ON CONFLICT statements (except DO NOTHING actions with no
  target specified).
* No support for tuple locks (SELECT ... FOR SHARE, SELECT ... FOR UPDATE)
* No support for serializable isolation level
* Support for PostgreSQL server versions 12+ only
* No support for foreign keys, unique constraints, or exclusion constraints
* No support for logical decoding
* No support for intra-node parallel scans
* No support for AFTER ... FOR EACH ROW triggers
* No UNLOGGED columnar tables
* No TEMPORARY columnar tables

## Next steps

Learn how to [create a Hyperscale (Citus) server group in the
portal](quickstart-create-hyperscale-portal.md).
