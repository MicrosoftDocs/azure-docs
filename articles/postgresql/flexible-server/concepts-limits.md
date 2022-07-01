---
title: Limits - Azure Database for PostgreSQL - Flexible Server
description: This article describes limits in Azure Database for PostgreSQL - Flexible Server, such as number of connection and storage engine options.
ms.author: sunila
author: sunilagarwal
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/30/2021
---

# Limits in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The following sections describe capacity and functional limits in the database service. If you'd like to learn about resource (compute, memory, storage) tiers, see the [compute and storage](concepts-compute-storage.md) article.

## Maximum connections

The maximum number of connections per pricing tier and vCores are shown below. The Azure system requires three connections to monitor the Azure Database for PostgreSQL - Flexible Server.

| SKU Name             | vCores | Memory Size | Max Connections | Max User Connections |
|----------------------|--------|-------------|-----------------|----------------------|
| **Burstable**        |        |             |                 |                      |
| B1ms                 | 1      | 2 GiB       | 50              | 47                   |
| B2s                  | 2      | 4 GiB       | 100             | 97                   |
| **General Purpose**  |        |             |                 |                      |
| D2s_v3  / D2ds_v4    | 2      | 8 GiB       | 859             | 856                  |
| D4s_v3  / D4ds_v4    | 4      | 16 GiB      | 1719            | 1716                 |
| D8s_v3  / D8ds_V4    | 8      | 32 GiB      | 3438            | 3435                 |
| D16s_v3 / D16ds_v4   | 16     | 64 GiB      | 5000            | 4997                 |
| D32s_v3 / D32ds_v4   | 32     | 128 GiB     | 5000            | 4997                 |
| D48s_v3 / D48ds_v4   | 48     | 192 GiB     | 5000            | 4997                 |
| D64s_v3 / D64ds_v4   | 64     | 256 GiB     | 5000            | 4997                 |
| **Memory Optimized** |        |             |                 |                      |
| E2s_v3  / E2ds_v4    | 2      | 16 GiB      | 1719            | 1716                 |
| E4s_v3  / E4ds_v4    | 4      | 32 GiB      | 3438            | 3433                 |
| E8s_v3  / E8ds_v4    | 8      | 64 GiB      | 5000            | 4997                 |
| E16s_v3 / E16ds_v4   | 16     | 128 GiB     | 5000            | 4997                 |
| E20ds_v4             | 20     | 160 GiB     | 5000            | 4997                 |
| E32s_v3 / E32ds_v4   | 32     | 256 GiB     | 5000            | 4997                 |
| E48s_v3 / E48ds_v4   | 48     | 384 GiB     | 5000            | 4997                 |
| E64s_v3 / E64ds_v4   | 64     | 432 GiB     | 5000            | 4997                 |

When connections exceed the limit, you may receive the following error:
> FATAL:  sorry, too many clients already.

> [!IMPORTANT]
> For best experience, it is recommended to you use a connection pool manager like PgBouncer to efficiently manage connections. Azure Database for PostgreSQL - Flexible Server offers pgBouncer as [built-in connection pool management solution](concepts-pgbouncer.md). 

A PostgreSQL connection, even idle, can occupy about 10 MB of memory. Also, creating new connections takes time. Most applications request many short-lived connections, which compounds this situation. The result is fewer resources available for your actual workload leading to decreased performance. Connection pooling can be used to decrease idle connections and reuse existing connections. To learn more, visit our [blog post](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717).

## Functional limitations

### Scale operations

- Scaling the server storage requires a server restart.
- Server storage can only be scaled in 2x increments, see [Compute and Storage](concepts-compute-storage.md) for details.
- Decreasing server storage size is currently not supported.

### Server version upgrades

- Automated migration between major database engine versions is currently not supported. If you would like to upgrade to the next major version, take a [dump and restore](../howto-migrate-using-dump-and-restore.md) it to a server that was created with the new engine version.

### Storage

- Once configured, storage size can't be reduced. You have to create a new server with desired storage size, perform manual [dump and restore](../howto-migrate-using-dump-and-restore.md) and migrate your database(s) to the new server.
- Currently, storage auto-grow feature isn't available. You can monitor the usage and increase the storage to a higher size. 
- When the storage usage reaches 95% or if the available capacity is less than 5 GiB, the server is automatically switched to **read-only mode** to avoid errors associated with disk-full situations. 
- We recommend to set alert rules for `storage used` or `storage percent` when they exceed certain thresholds so that you can proactively take action such as increasing the storage size. For example, you can set an alert if the storage percent exceeds 80% usage.
  
### Networking

- Moving in and out of VNET is currently not supported.
- Combining public access with deployment within a VNET is currently not supported.
- Firewall rules aren't supported on VNET, Network security groups can be used instead.
- Public access database servers can connect to public internet, for example through `postgres_fdw`, and this access can't be restricted. VNET-based servers can have restricted outbound access using Network Security Groups.

### High availability (HA)

- See [HA Limitations documentation](concepts-high-availability.md#high-availability---limitations).

### Availability zones

- Manually moving servers to a different availability zone is currently not supported.

### Postgres engine, extensions, and PgBouncer

- Postgres 10 and older aren't supported. We recommend using the [Single Server](../overview-single-server.md) option if you require older Postgres versions.
- Extension support is currently limited to the Postgres `contrib` extensions.
- Built-in PgBouncer connection pooler is currently not available for Burstable servers.
- SCRAM authentication isn't supported with connectivity using built-in PgBouncer.

### Stop/start operation

- Server can't be stopped for more than seven days.

### Scheduled maintenance

- Changing the maintenance window less than five days before an already planned upgrade, won't affect that upgrade. Changes only take effect with the next scheduled maintenance.

### Backing up a server

- Backups are managed by the system, there is currently no way to run these backups manually. We recommend using `pg_dump` instead.
- Backups are always snapshot-based full backups (not differential backups), possibly leading to higher backup storage utilization. The transaction logs (write ahead logs - WAL) are separate from the full/differential backups, and are archived continuously.

### Restoring a server

- When using the Point-in-time-Restore feature, the new server is created with the same compute and storage configurations as the server it is based on.
- VNET based database servers are restored into the same VNET when you restore from a backup.
- The new server created during a restore doesn't have the firewall rules that existed on the original server. Firewall rules need to be created separately for the new server.
- Restoring a deleted server isn't supported.
- Cross region restore isn't supported.

### Other features

* Azure AD authentication isn't yet supported. We recommend using the [Single Server](../overview-single-server.md) option if you require Azure AD authentication.
* Read replicas aren't yet supported. We recommend using the [Single Server](../overview-single-server.md) option if you require read replicas.
* Moving resources to another subscription isn't supported. 


## Next steps

- Understand [what’s available for compute and storage options](concepts-compute-storage.md)
- Learn about [Supported PostgreSQL Database Versions](concepts-supported-versions.md)
- Review [how to back up and restore a server in Azure Database for PostgreSQL using the Azure portal](how-to-restore-server-portal.md)
