---
title: Limits - Azure Database for PostgreSQL - Flexible Server
description: This article describes limits in Azure Database for PostgreSQL - Flexible Server, such as number of connection and storage engine options.
author: lfittl-msft
ms.author: lufittl
ms.service: postgresql
ms.topic: conceptual
ms.date: 9/22/2020
---

# Limits in Azure Database for PostgreSQL - Flexible Server

The following sections describe capacity and functional limits in the database service. If you'd like to learn about resource (compute, memory, storage) tiers, see the [compute and storage](concepts-compute-storage.md) article.

## Maximum connections

The maximum number of connections per pricing tier and vCores are shown below. The Azure system requires three connections to monitor the Azure Database for PostgreSQL flexible server.

| SKU Name             | vCores | Memory Size | Max Connections | Max User Connections |
|----------------------|--------|-------------|-----------------|----------------------|
| **Burstable**        |        |             |                 |                      |
| B1ms                 | 1      | 2 GiB       | 50              | 47                   |
| B2s                  | 2      | 4 GiB       | 100             | 97                   |
| **General Purpose**  |        |             |                 |                      |
| D2s_v3               | 2      | 8 GiB       | 214             | 211                  |
| D4s_v3               | 4      | 16 GiB      | 429             | 426                  |
| D8s_v3               | 8      | 32 GiB      | 859             | 856                  |
| D16s_v3              | 16     | 64 GiB      | 1718            | 1715                 |
| D32s_v3              | 32     | 128 GiB     | 3437            | 3434                 |
| D48s_v3              | 48     | 192 GiB     | 5000            | 4997                 |
| D64s_v3              | 64     | 256 GiB     | 5000            | 4997                 |
| **Memory Optimized** |        |             |                 |                      |
| E2s_v3               | 2      | 16 GiB      | 1718            | 1715                 |
| E4s_v3               | 4      | 32 GiB      | 3437            | 3434                 |
| E8s_v3               | 8      | 64 GiB      | 5000            | 4997                 |
| E16s_v3              | 16     | 128 GiB     | 5000            | 4997                 |
| E32s_v3              | 32     | 256 GiB     | 5000            | 4997                 |
| E48s_v3              | 48     | 384 GiB     | 5000            | 4997                 |
| E64s_v3              | 64     | 432 GiB     | 5000            | 4997                 |

When connections exceed the limit, you may receive the following error:
> FATAL:  sorry, too many clients already

> [!IMPORTANT]
> For best experience, we recommend that you use a connection pooler like pgBouncer to efficiently manage connections.

A PostgreSQL connection, even idle, can occupy about 10 MB of memory. Also, creating new connections takes time. Most applications request many short-lived connections, which compounds this situation. The result is fewer resources available for your actual workload leading to decreased performance. Connection pooling can be used to decrease idle connections and reuse existing connections. To learn more, visit our [blog post](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717).

## Functional limitations

### Scale operations

- Scaling the server storage requires a server restart.
- Server storage can only be scaled in 2x increments, see [Compute and Storage](concepts-compute-storage.md) for details.
- Decreasing server storage size is currently not supported.

### Server version upgrades

- Automated migration between major database engine versions is currently not supported. If you would like to upgrade to the next major version, take a [dump and restore](../howto-migrate-using-dump-and-restore.md) it to a server that was created with the new engine version.

### Networking

- Moving in and out of VNET is currently not supported.
- Combining public access with deployment within a VNET is currently not supported.
- Database servers can connect to public internet, for example through `postgres_fdw`, and this access cannot be restricted.

### High availability

- Zone-Redundant HA is currently not supported for Burstable servers.
- The database server IP address changes when your server fails over to the HA standby. Ensure you use the DNS record instead of the server IP address.

### Availability zones

- Manually moving servers to a different availability zone is currently not supported.
- The availability zone of the HA standby server cannot be manually configured.

### Postgres engine, extensions, and pgBouncer

- Extension support is currently limited to the Postgres `contrib` extensions.
- Built-in pgBouncer connection pooler is currently not available for database servers within a VNET, or for Burstable servers.

### Stop/start operation

- Server can't be stopped for more than seven days.

### Restoring a server

- When using the Point-in-time-Restore feature, the new server is created with the same compute and storage configurations as the server it is based on.
- The new server created during a restore does not have the firewall rules that existed on the original server. Firewall rules need to be created separately for the new server.
- Restoring a deleted server is not supported.
- Cross region restore is not supported.

## Next steps

- Understand [what’s available for compute and storage options](concepts-compute-storage.md)
- Learn about [Supported PostgreSQL Database Versions](concepts-supported-versions.md)
- Review [how to back up and restore a server in Azure Database for PostgreSQL using the Azure portal](how-to-restore-server-portal.md)
