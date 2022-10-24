---
title: Limits and limitations – Azure Cosmos DB for PostgreSQL
description: Current limits for clusters
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 02/25/2022
---

# Azure Cosmos DB for PostgreSQL limits and limitations

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

The following section describes capacity and functional limits in the
Azure Cosmos DB for PostgreSQL service.

### Naming

#### Cluster name

A cluster must have a name that is 40 characters or
shorter.

## Networking

### Maximum connections

Every PostgreSQL connection (even idle ones) uses at least 10 MB of memory, so
it's important to limit simultaneous connections. Here are the limits we chose
to keep nodes healthy:

* Maximum connections per node
   * 300 for 0-3 vCores
   * 500 for 4-15 vCores
   * 1000 for 16+ vCores

The connection limits above are for *user* connections (`max_connections` minus
`superuser_reserved_connections`). We reserve extra connections for
administration and recovery.

The limits apply to both worker nodes and the coordinator node. Attempts to
connect beyond these limits will fail with an error.

#### Connection pooling

You can scale connections further using [connection
pooling](concepts-connection-pool.md). Azure Cosmos DB for PostgreSQL offers a
managed pgBouncer connection pooler configured for up to 2,000 simultaneous
client connections.

## Storage

### Storage scaling

Storage on coordinator and worker nodes can be scaled up (increased) but can't
be scaled down (decreased).

### Storage size

Up to 2 TiB of storage is supported on coordinator and worker nodes. See the
available storage options and IOPS calculation [above](resources-compute.md)
for node and cluster sizes.

## Compute

### Subscription vCore limits

Azure enforces a vCore quota per subscription per region. There are two
independently adjustable quotas: vCores for coordinator nodes, and vCores for
worker nodes. The default quota should be more than enough to experiment with
Azure Cosmos DB for PostgreSQL. If you do need more vCores for a region in your
subscription, see how to [adjust compute
quotas](howto-compute-quota.md).

## PostgreSQL

### Database creation

The Azure portal provides credentials to connect to exactly one database per
cluster, the `citus` database. Creating another
database is currently not allowed, and the CREATE DATABASE command will fail
with an error.

### Columnar storage

Azure Cosmos DB for PostgreSQL currently has these limitations with [columnar
tables](concepts-columnar.md):

* Compression is on disk, not in memory
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

* Learn how to [create a cluster in the
  portal](quickstart-create-portal.md).
* Learn to enable [connection pooling](concepts-connection-pool.md).
