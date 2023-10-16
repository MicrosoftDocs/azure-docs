---
title: Limits and limitations – Azure Cosmos DB for PostgreSQL
description: Current limits for clusters
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 08/07/2023
---

# Azure Cosmos DB for PostgreSQL limits and limitations

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

The following section describes capacity and functional limits in the
Azure Cosmos DB for PostgreSQL service.

## Naming

### Cluster name

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
* Maximum connections per node with burstable compute
   * 20 for 1 vCore burstable
   * 40 for 2 vCores burstable

The connection limits above are for *user* connections (`max_connections` minus
`superuser_reserved_connections`). We reserve extra connections for
administration and recovery.

The limits apply to both worker nodes and the coordinator node. Attempts to
connect beyond these limits fails with an error.

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

Up to 32 TiB of storage is supported on coordinator and worker nodes in multi-node configuration. Up to 2 TiB of storage is supported for single node configurations. See [the available storage options and IOPS calculation](resources-compute.md)
for various node and cluster sizes.

## Compute

### Subscription vCore limits

Azure enforces a vCore quota per subscription per region. There are three
independently adjustable quotas: vCores for coordinator nodes, vCores for
worker nodes, and vCores for burstable compute. The default quota should be more than enough to experiment with Azure Cosmos DB for PostgreSQL and run small to medium size production. If you do need more vCores for a region in your subscription, see how to [adjust compute quotas](./howto-compute-quota.md).

### Burstable compute

In Azure Cosmos DB for PostgreSQL clusters with [burstable
compute](concepts-burstable-compute.md) enabled, the following features are
currently **not supported**:

* Accelerated networking
* Local caching
* PostgreSQL and Citus version upgrades
* PostgreSQL 11 support
* Read replicas
* High availability
* Geo-redundant backup
* The [azure_storage](howto-ingest-azure-blob-storage.md) extension

## Authentication

<a name='azure-active-directory-authentication'></a>

### Microsoft Entra authentication
If [Microsoft Entra ID](./concepts-authentication.md#azure-active-directory-authentication-preview) is enabled on an Azure Cosmos DB for PostgreSQL cluster, the following is currently **not supported**:

* PostgreSQL 11, 12, and 13
* PgBouncer
* Microsoft Entra groups

### Database creation

The Azure portal provides credentials to connect to exactly one database per
cluster. Creating another database is currently not allowed, and the CREATE DATABASE command fails
with an error.

By default this database is called `citus`. Azure Cosmos DB for PostgreSQL supports custom database names at cluster provisioning time only.  

## Backup and restore

### Geo-redundant backup and restore (preview)
* Geo-redundant backup can be enabled only during cluster creation.
    * You can enable geo-redundant backup when you perform a cluster restore.
    * You can enable geo-redundant backup when you [promote a cluster read-replica to an independent cluster](./howto-read-replicas-portal.md#promote-a-read-replica).
* Geo-redundant backup can't be enabled on single node clusters with [burstable compute](./concepts-burstable-compute.md).
* Geo-redundant backup can't be disabled once cluster is created.
* [Customer managed key (CMK)](./concepts-customer-managed-keys.md) isn't supported for clusters with geo-redundant backup enabled.
* Azure Cosmos DB for PostgreSQL cluster with geo-redundant backup enabled can't have a [cluster read replica](./concepts-read-replicas.md) in the region where geo-redundant backup is stored.

## Next steps

* Learn how to [create a cluster in the
  portal](quickstart-create-portal.md).
* Learn to enable [connection pooling](concepts-connection-pool.md).
