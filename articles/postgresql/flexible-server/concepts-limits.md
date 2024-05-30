---
title: Limits in Azure Database for PostgreSQL - Flexible Server
description: This article describes limits in Azure Database for PostgreSQL - Flexible Server, such as the number of connections and storage engine options.
author: kabharati
ms.author: kabharati
ms.reviewer: kabharati, maghan
ms.date: 05/01/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Limits in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The following sections describe capacity and functional limits in Azure Database for PostgreSQL flexible server. If you'd like to learn about resource (compute, memory, storage) tiers, see the [compute ](concepts-compute.md) and [storage ](concepts-storage.md)  articles.

## Maximum connections

The following table shows the *default* maximum number of connections for each pricing tier and vCore configuration. Azure Database for PostgreSQL flexible server reserves 15 connections for physical replication and monitoring of the Azure Database for PostgreSQL flexible server instance. Consequently, the value for maximum user connections listed in the table is reduced by 15 from the total maximum connections.

|Product name                                 |vCores|Memory size|Maximum connections|Maximum user connections|
|-----------------------------------------|------|-----------|---------------|--------------------|
|**Burstable**                            |      |           |               |                    |
|B1ms                                     |1     |2 GiB      |50             |35                  |
|B2s                                      |2     |4 GiB      |429            |414                 |
|B2ms                                     |2     |8 GiB      |859            |844                 |
|B4ms                                     |4     |16 GiB     |1,718           |1,703                |
|B8ms                                     |8     |32 GiB     |3,437           |3,422                |
|B12ms                                    |12    |48 GiB     |5,000           |4,985                |
|B16ms                                    |16    |64 GiB     |5,000           |4,985                |
|B20ms                                    |20    |80 GiB     |5,000           |4,985                |
|**General Purpose**                      |      |           |               |                    |
|D2s_v3 / D2ds_v4 / D2ds_v5 / D2ads_v5    |2     |8 GiB      |859            |844                 |
|D4s_v3 / D4ds_v4 / D4ds_v5 / D4ads_v5    |4     |16 GiB     |1,718           |1,703                |
|D8s_v3 / D8ds_V4 / D8ds_v5 / D8ads_v5    |8     |32 GiB     |3,437           |3,422                |
|D16s_v3 / D16ds_v4 / D16ds_v5 / D16ads_v5|16    |64 GiB     |5,000           |4,985                |
|D32s_v3 / D32ds_v4 / D32ds_v5 / D32ads_v5|32    |128 GiB    |5,000           |4,985                |
|D48s_v3 / D48ds_v4 / D48ds_v5 / D48ads_v5|48    |192 GiB    |5,000           |4,985                |
|D64s_v3 / D64ds_v4 / D64ds_v5 / D64ads_v5|64    |256 GiB    |5,000           |4,985                |
|D96ds_v5 / D96ads_v5                     |96    |384 GiB    |5,000           |4,985                |
|**Memory Optimized**                     |      |           |               |                    |
|E2s_v3 / E2ds_v4 / E2ds_v5 / E2ads_v5    |2     |16 GiB     |1,718           |1,703                |
|E4s_v3 / E4ds_v4 / E4ds_v5 / E4ads_v5    |4     |32 GiB     |3,437           |3,422                |
|E8s_v3 / E8ds_v4 / E8ds_v5 / E8ads_v5    |8     |64 GiB     |5,000           |4,985                |
|E16s_v3 / E16ds_v4 / E16ds_v5 / E16ads_v5|16    |128 GiB    |5,000           |4,985                |
|E20ds_v4 / E20ds_v5 / E20ads_v5          |20    |160 GiB    |5,000           |4,985                |
|E32s_v3 / E32ds_v4 / E32ds_v5 / E32ads_v5|32    |256 GiB    |5,000           |4,985                |
|E48s_v3 / E48ds_v4 / E48ds_v5 / E48ads_v5|48    |384 GiB    |5,000           |4,985                |
|E64s_v3 / E64ds_v4 / E64ds_v5 / E64ads_v5|64    |432 GiB    |5,000           |4,985                |
|E96ds_v5 / E96ads_v5                     |96    |672 GiB    |5,000           |4,985                |

The reserved connection slots, presently at 15, could change. We advise regularly verifying the total reserved connections on the server. You calculate this number by summing the values of the `reserved_connections` and `superuser_reserved_connections` server parameters. The maximum number of available user connections is `max_connections` - (`reserved_connections` + `superuser_reserved_connections`).

The default value for the `max_connections` server parameter is calculated when you provision the instance of Azure Database for PostgreSQL flexible server, based on the product name that you select for its compute. Any subsequent changes of product selection to the compute that supports the flexible server won't have any effect on the default value for the `max_connections` server parameter of that instance. We recommend that whenever you change the product assigned to an instance, you also adjust the value for the `max_connections` parameter according to the values in the preceding table.

### Changing the max_connections value

When you first set up your Azure Database for Postgres flexible server instance, it automatically decides the highest number of connections that it can handle concurrently. This number is based on your server's configuration and can't be changed.

However, you can use the `max_connections` setting to adjust how many connections are allowed at a particular time. After you change this setting, you need to restart your server for the new limit to start working.

> [!CAUTION]
> Although it's possible to increase the value of `max_connections` beyond the default setting, we advise against it.
>
> Instances might encounter difficulties when the workload expands and demands more memory. As the number of connections increases, memory usage also rises. Instances with limited memory might face issues such as crashes or high latency. Although a higher value for `max_connections` might be acceptable when most connections are idle, it can lead to significant performance problems after they become active.
>
> If you need more connections, we suggest that you instead use PgBouncer, the built-in Azure solution for connection pool management. Use it in transaction mode. To start, we recommend that you use conservative values by multiplying the vCores within the range of 2 to 5. Afterward, carefully monitor resource utilization and application performance to ensure smooth operation. For detailed information on PgBouncer, see [PgBouncer in Azure Database for PostgreSQL - Flexible Server](concepts-pgbouncer.md).

When connections exceed the limit, you might receive the following error:

`FATAL:  sorry, too many clients already.`

When you're using Azure Database for PostgreSQL flexible server for a busy database with a large number of concurrent connections, there might be a significant strain on resources. This strain can result in high CPU utilization, especially when many connections are established simultaneously and when connections have short durations (less than 60 seconds). These factors can negatively affect overall database performance by increasing the time spent on processing connections and disconnections.

Be aware that each connection in Azure Database for PostgreSQL flexible server, regardless of whether it's idle or active, consumes a significant amount of resources from your database. This consumption can lead to performance issues beyond high CPU utilization, such as disk and lock contention. The [Number of Database Connections](https://wiki.postgresql.org/wiki/Number_Of_Database_Connections) article on the PostgreSQL Wiki discusses this topic in more detail. To learn more, see [Identify and solve connection performance in Azure Database for PostgreSQL flexible server](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/identify-and-solve-connection-performance-in-azure-postgres/ba-p/3698375).

## Functional limitations

The following sections list considerations for what is and isn't supported in Azure Database for PostgreSQL flexible server.

### Scale operations

- At this time, scaling up the server storage requires a server restart.
- Server storage can only be scaled in 2x increments, see [Storage](concepts-storage.md) for details.
- Decreasing server storage size is currently not supported. The only way to do is [dump and restore](../howto-migrate-using-dump-and-restore.md) it to a new Azure Database for PostgreSQL flexible server instance.
   
### Storage

- After you configure the storage size, you can't reduce it. You have to create a new server with the desired storage size, perform a  manual [dump and restore](../howto-migrate-using-dump-and-restore.md) operation, and migrate your databases to the new server.
- When the storage usage reaches 95% or if the available capacity is less than 5 GiB (whichever is more), the server is automatically switched to *read-only mode* to avoid errors associated with disk-full situations. In rare cases, if the rate of data growth outpaces the time it takes to switch to read-only mode, your server might still run out of storage. You can enable storage autogrow to avoid these issues and automatically scale your storage based on your workload demands.
- We recommend setting alert rules for `storage used` or `storage percent` when they exceed certain thresholds so that you can proactively take action such as increasing the storage size. For example, you can set an alert if the storage percentage exceeds 80% usage.
- If you're using logical replication, you must drop the logical replication slot in the primary server if the corresponding subscriber no longer exists. Otherwise, the write-ahead logging (WAL) files accumulate in the primary and fill up the storage. If the storage exceeds a certain threshold and if the logical replication slot isn't in use (because of an unavailable subscriber), Azure Database for PostgreSQL flexible server automatically drops that unused logical replication slot. That action releases accumulated WAL files and prevents your server from becoming unavailable because the storage is filled.
- We don't support the creation of tablespaces. If you're creating a database, don't provide a tablespace name. Azure Database for PostgreSQL flexible server uses the default one that's inherited from the template database. It's unsafe to provide a tablespace like the temporary one, because we can't ensure that such objects will remain persistent after events like server restarts and high-availability (HA) failovers.

### Networking

- Moving in and out of a virtual network is currently not supported.
- Combining public access with deployment in a virtual network is currently not supported.
- Firewall rules aren't supported on virtual networks. You can use network security groups instead.
- Public access database servers can connect to the public internet; for example, through `postgres_fdw`. You can't restrict this access. Servers in virtual networks can have restricted outbound access through network security groups.

### High availability

- See [High availability (reliability) in Azure Database for PostgreSQL - Flexible Server](concepts-high-availability.md#high-availability---limitations).

### Availability zones

- Manually moving servers to a different availability zone is currently not supported. However, by using the preferred availability zone as the standby zone, you can turn on HA. After you establish the standby zone, you can fail over to it and then turn off HA.

### Postgres engine, extensions, and PgBouncer

- Postgres 10 and older versions aren't supported, because the open-source community retired them. If you must use one of these versions, you need to use the [Azure Database for PostgreSQL single server](../overview-single-server.md) option, which supports the older major versions 9.5, 9.6, and 10.
- Azure Database for PostgreSQL flexible server supports all `contrib` extensions and more. For more information, see [PostgreSQL extensions](/azure/postgresql/flexible-server/concepts-extensions).
- The built-in PgBouncer connection pooler is currently not available for Burstable servers.

### Stop/start operations

- After you stop the Azure Database for PostgreSQL flexible server instance, it automatically starts after 7 days.

### Scheduled maintenance

- You can change the custom maintenance window to any day/time of the week. However, any changes that you make after receiving the maintenance notification will have no impact on the next maintenance. Changes take effect only with the following monthly scheduled maintenance.

### Server backups

- The system manages backups. There's currently no way to run backups manually. We recommend using `pg_dump` instead.
- The first snapshot is a full backup, and consecutive snapshots are differential backups. The differential backups back up only the changed data since the last snapshot backup.

  For example, if the size of your database is 40 GB and your provisioned storage is 64 GB, the first snapshot backup will be 40 GB. Now, if you change 4 GB of data, the next differential snapshot backup size will be only 4 GB. The transaction logs (write-ahead logs) are separate from the full and differential backups, and they're archived continuously.

### Server restoration

- When you're using the point-in-time restore (PITR) feature, the new server is created with the same compute and storage configurations as the server that it's based on.
- Database servers in virtual networks are restored into the same virtual networks when you restore from a backup.
- The new server created during a restore doesn't have the firewall rules that existed on the original server. You need to create firewall rules separately for the new server.
- Restore to a different subscription isn't supported. As a workaround, you can restore the server within the same subscription and then migrate the restored server to a different subscription.

## Related content

- Understand [what’s available for compute options](concepts-compute.md)
- Understand [what’s available for Storage options](concepts-storage.md)
- Learn about [Supported PostgreSQL database versions](concepts-supported-versions.md)
- Review [how to back up and restore a server in Azure Database for PostgreSQL flexible server using the Azure portal](how-to-restore-server-portal.md)

