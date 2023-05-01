---
title: Limits - Azure Database for PostgreSQL - Flexible Server
description: This article describes limits in Azure Database for PostgreSQL - Flexible Server, such as number of connection and storage engine options.
ms.author: sunila
author: sunilagarwal
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/05/2022
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

> [!CAUTION]
> While the maximum number of connections for certain SKUs is high, it's not recommended to set the max_connections parameter value to it's maximum. This is because although it may be a safe value when most connections are in the idle state, it can cause serious performance issues once they become active.  Instead, if you require more connections, we recommend using pgBouncer, Azure's built-in connection pool management solution, in transaction mode. To start, use safe values by multiplying vCores in the range of 2 to 5, and then check the resource utilization and application performance to ensure everything is running smoothly. For more information on pgBouncer, refer to the [PgBouncer in Azure Database for PostgreSQL - Flexible Server](concepts-pgbouncer.md) documentation.

When using PostgreSQL for a busy database with a large number of concurrent connections, there may be a significant strain on resources. This strain can result in high CPU utilization, particularly when many connections are established simultaneously and when connections have short durations (less than 60 seconds). These factors can negatively impact overall database performance by increasing the time spent on processing connections and disconnections. It's important to note that each connection in Postgres, regardless of whether it is idle or active, consumes a significant amount of resources from your database. This can lead to performance issues beyond high CPU utilization, such as disk and lock contention, which are discussed in more detail in the PostgreSQL Wiki article on the [Number of Database Connections](https://wiki.postgresql.org/wiki/Number_Of_Database_Connections). To learn more about identifying and solving connection performance issues in Azure Postgres, visit our [blog post](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/identify-and-solve-connection-performance-in-azure-postgres/ba-p/3698375).

## Functional limitations

### Scale operations

- At this time, scaling up the server storage requires a server restart.
- Server storage can only be scaled in 2x increments, see [Compute and Storage](concepts-compute-storage.md) for details.
- Decreasing server storage size is currently not supported. Only way to do is [dump and restore](../howto-migrate-using-dump-and-restore.md) it to a new Flexible Server.
   
### Server version upgrades

- Automated migration between major database engine versions is currently not supported. If you would like to upgrade to the next major version, take a [dump and restore](../howto-migrate-using-dump-and-restore.md) it to a server that was created with the new engine version.
   
### Storage

- Once configured, storage size can't be reduced. You have to create a new server with desired storage size, perform manual [dump and restore](../howto-migrate-using-dump-and-restore.md) and migrate your database(s) to the new server.
- Currently, storage auto-grow feature isn't available. You can monitor the usage and increase the storage to a higher size. 
- When the storage usage reaches 95% or if the available capacity is less than 5 GiB whichever is more, the server is automatically switched to **read-only mode** to avoid errors associated with disk-full situations. In rare cases, if the rate of data growth outpaces the time it takes switch to read-only mode, your Server may still run out of storage.
- We recommend to set alert rules for `storage used` or `storage percent` when they exceed certain thresholds so that you can proactively take action such as increasing the storage size. For example, you can set an alert if the storage percent exceeds 80% usage.
- If you're using logical replication, then you must drop the logical replication slot in the primary server if the corresponding subscriber no longer exists. Otherwise the WAL files start to get accumulated in the primary filling up the storage. If the storage threshold exceeds certain threshold and if the logical replication slot isn't in use (due to non-available subscriber), Flexible server automatically drops that unused logical replication slot. That action releases accumulated WAL files and avoids your server becoming unavailable due to storage getting filled situation. 
   
### Networking

- Moving in and out of VNET is currently not supported.
- Combining public access with deployment within a VNET is currently not supported.
- Firewall rules aren't supported on VNET, Network security groups can be used instead.
- Public access database servers can connect to public internet, for example through `postgres_fdw`, and this access can't be restricted. VNET-based servers can have restricted outbound access using Network Security Groups.

### High availability (HA)

- See [HA Limitations documentation](concepts-high-availability.md#high-availability---limitations).

### Availability zones

- Manually moving servers to a different availability zone is currently not supported. However, you can enable HA using the preferred AZ as the standby zone. Once established, you can fail over to the standby and subsequently disable HA. 

### Postgres engine, extensions, and PgBouncer

- Postgres 10 and older aren't supported as those are already retired by the open-source community. If you must use one of these versions, you'll need to use the [Single Server](../overview-single-server.md) option which supports the older major versions 95, 96 and 10.
- Flexible Server supports all `contrib` extensions and more. Please refer to [PostgreSQL extensions](/azure/postgresql/flexible-server/concepts-extensions).
- Built-in PgBouncer connection pooler is currently not available for Burstable servers.
- SCRAM authentication isn't supported with connectivity using built-in PgBouncer.
   
### Stop/start operation

- Once you stop the Flexible Server, it automatically starts after 7- days. 
   
### Scheduled maintenance

- You can change custom maintenance window to any day/time of the week. However, any changes made after receiving the maintenance notification will have no impact on the next maintenance. Changes only take effect with the following monthly scheduled maintenance.
   
### Backing up a server

- Backups are managed by the system, there's currently no way to run these backups manually. We recommend using `pg_dump` instead.
- The first snapshot is a full backup and consecutive snapshots are differential backups. The differential backups only back up the changed data since the last snapshot backup. For example, if the size of your database is 40GB and your provisioned storage is 64GB, the first snapshot backup will be 40GB. Now, if you change 4GB of data, then the next differential snapshot backup size will only be 4GB. The transaction logs (write ahead logs - WAL) are separate from the full/differential backups, and are archived continuously.
   
### Restoring a server

- When using the Point-in-time-Restore feature, the new server is created with the same compute and storage configurations as the server isn't based on.
- VNET based database servers are restored into the same VNET when you restore from a backup.
- The new server created during a restore doesn't have the firewall rules that existed on the original server. Firewall rules need to be created separately for the new server.
- Restoring a deleted server isn't supported.
- Cross region restore isn't supported.
- Restore to a different subscription is not supported but as a workaround, you can restore the server within the same subscription and then migrate the restored server to a different subscription.
   
## Next steps

- Understand [what’s available for compute and storage options](concepts-compute-storage.md)
- Learn about [Supported PostgreSQL Database Versions](concepts-supported-versions.md)
- Review [how to back up and restore a server in Azure Database for PostgreSQL using the Azure portal](how-to-restore-server-portal.md)

