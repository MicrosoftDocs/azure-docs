---
title: Backup and restore - Azure Database for PostgreSQL - Single Server
description: Learn about automatic backups and restoring your Azure Database for PostgreSQL server - Single Server.
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 06/24/2022
---

# Backup and restore in Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Azure Database for PostgreSQL automatically creates server backups and stores them in user configured locally redundant or geo-redundant storage. Backups can be used to restore your server to a point-in-time. Backup and restore are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion.

## Backups

Azure Database for PostgreSQL takes backups of the data files and the transaction log. Depending on the supported maximum storage size, we either take full and differential backups (4-TB max storage servers) or snapshot backups (up to 16-TB max storage servers). These backups allow you to restore a server to any point-in-time within your configured backup retention period. The default backup retention period is seven days. You can optionally configure it up to 35 days. All backups are encrypted using AES 256-bit encryption.

These backup files cannot be exported. The backups can only be used for restore operations in Azure Database for PostgreSQL. You can use [pg_dump](how-to-migrate-using-dump-and-restore.md) to copy a database.

### Backup frequency

#### Servers with up to 4-TB storage

For servers that support up to 4-TB maximum storage, full backups occur once every week. Differential backups occur twice a day. Transaction log backups occur every five minutes.

#### Servers with up to 16-TB storage

In a subset of [Azure regions](./concepts-pricing-tiers.md#storage), all newly provisioned servers can support up to 16-TB storage. Backups on these large storage servers are snapshot-based. The first full snapshot backup is scheduled immediately after a server is created. That first full snapshot backup is retained as the server's base backup. Subsequent snapshot backups are differential backups only. Differential snapshot backups do not occur on a fixed schedule.  In a day, multiple differential snapshot backups are performed, but only 3 backups are retained. Transaction log backups occur every five minutes.

> [!NOTE]
> Automatic backups are performed for [replica servers](./concepts-read-replicas.md) that are configured with up to 4TB storage configuration.

### Backup retention

Backups are retained based on the backup retention period setting on the server. You can select a retention period of 7 to 35 days. The default retention period is 7 days. You can set the retention period during server creation or later by updating the backup configuration using [Azure portal](./how-to-restore-server-portal.md#set-backup-configuration) or [Azure CLI](./how-to-restore-server-cli.md#set-backup-configuration).

The backup retention period governs how far back in time a point-in-time restore can be retrieved, since it's based on backups available. The backup retention period can also be treated as a recovery window from a restore perspective. All backups required to perform a point-in-time restore within the backup retention period are retained in backup storage. For example - if the backup retention period is set to 7 days, the recovery window is considered last 7 days. In this scenario, all the backups required to restore the server in last 7 days are retained. With a backup retention window of seven days:
- Servers with up to 4-TB storage will retain up to 2 full database backups, all the differential backups, and transaction log backups performed since the earliest full database backup.
- Servers with up to 16-TB storage will retain the full database snapshot, all the differential snapshots and transaction log backups in last 8 days.

### Backup redundancy options

Azure Database for PostgreSQL provides the flexibility to choose between locally redundant or geo-redundant backup storage in the General Purpose and Memory Optimized tiers. When the backups are stored in geo-redundant backup storage, an additional backup copy is replicated to a [paired region](../../availability-zones/cross-region-replication-azure.md). This provides better protection and ability to restore your server in the event of a regional disaster. The Basic tier only offers locally redundant backup storage.

> [!IMPORTANT]
> Configuring locally redundant or geo-redundant storage for backup is only allowed during server create. Once the server is provisioned, you cannot change the backup storage redundancy option.

### Backup storage cost

Azure Database for PostgreSQL provides up to 100% of your provisioned server storage as backup storage at no extra cost. Any additional backup storage used is charged in GB per month. For example, if you have provisioned a server with 250 GB of storage, you have 250 GB of additional storage available for server backups at no extra cost. Storage consumed for backups more than 250 GB is charged as per the [pricing model](https://azure.microsoft.com/pricing/details/postgresql/).

You can use the [Backup Storage used](concepts-monitoring.md) metric in Azure Monitor available in the Azure portal to monitor the backup storage consumed by a server. The Backup Storage used metric represents the sum of storage consumed by all the full database backups, differential backups, and log backups retained based on the backup retention period set for the server. The frequency of the backups is service managed and explained earlier. Heavy transactional activity on the server can cause backup storage usage to increase irrespective of the total database size. For geo-redundant storage, backup storage usage is twice that of the locally redundant storage.

The primary means of controlling the backup storage cost is by setting the appropriate backup retention period and choosing the right backup redundancy options to meet your desired recovery goals. You can select a retention period from a range of 7 to 35 days. General Purpose and Memory Optimized servers can choose to have geo-redundant storage for backups.

## Restore

In Azure Database for PostgreSQL, performing a restore creates a new server from the original server's backups.

There are two types of restore available:

- **Point-in-time restore** is available with either backup redundancy option and creates a new server in the same region as your original server.
- **Geo-restore** is available only if you configured your server for geo-redundant storage and it allows you to restore your server to a different region.

The estimated time of recovery depends on several factors including the database sizes, the transaction log size, the network bandwidth, and the total number of databases recovering in the same region at the same time. The recovery time varies depending on the last data backup and the amount of recovery needs to be performed. It is usually less than 12 hours.

> [!NOTE] 
> If your source PostgreSQL server is encrypted with customer-managed keys, please see the [documentation](concepts-data-encryption-postgresql.md) for additional considerations.

> [!NOTE]
> If you want to restore a deleted PostgreSQL server, follow the procedure documented [here](how-to-restore-dropped-server.md).

### Point-in-time restore

Independent of your backup redundancy option, you can perform a restore to any point in time within your backup retention period. A new server is created in the same Azure region as the original server. It is created with the original server's configuration for the pricing tier, compute generation, number of vCores, storage size, backup retention period, and backup redundancy option.

Point-in-time restore is useful in multiple scenarios. For example, when a user accidentally deletes data, drops an important table or database, or if an application accidentally overwrites good data with bad data due to an application defect.

You may need to wait for the next transaction log backup to be taken before you can restore to a point in time within the last five minutes.

If you want to restore a dropped table, 
1. Restore source server using Point-in-time method.
2. Dump the table using `pg_dump` from restored server.
3. Rename source table on original server.
4. Import table using psql command line on original server.
5. You can optionally delete the restored server.

>[!Note]
> It is recommended not to create multiple restores for the same server at the same time.

### Geo-restore

You can restore a server to another Azure region where the service is available if you have configured your server for geo-redundant backups. Servers that support up to 4 TB of storage can be restored to the geo-paired region, or to any region that supports up to 16 TB of storage. For servers that support up to 16 TB of storage, geo-backups can be restored in any region that support 16 TB servers as well. Review [Azure Database for PostgreSQL pricing tiers](concepts-pricing-tiers.md) for the list of supported regions.

Geo-restore is the default recovery option when your server is unavailable because of an incident in the region where the server is hosted. If a large-scale incident in a region results in unavailability of your database application, you can restore a server from the geo-redundant backups to a server in any other region. There is a delay between when a backup is taken and when it is replicated to different region. This delay can be up to an hour, so, if a disaster occurs, there can be up to one hour data loss.

During geo-restore, the server configurations that can be changed include compute generation, vCore, backup retention period, and backup redundancy options. Changing pricing tier (Basic, General Purpose, or Memory Optimized) or storage size is not supported.

> [!NOTE]
> If your source server uses infrastructure double encryption, for restoring the server, there are limitations including available regions. Please see the [infrastructure double encryption](concepts-infrastructure-double-encryption.md) for more details.

### Perform post-restore tasks

After a restore from either recovery mechanism, you should perform the following tasks to get your users and applications back up and running:

- To access the restored server, since it has a different name than the original server, please change the servername to the restored server name and the user name to `username@new-restored-server-name` in your connection string.
- If the new server is meant to replace the original server, redirect clients and client applications to the new server. 
- Ensure appropriate server-level firewall and VNet rules are in place for users to connect. These rules are not copied over from the original server.
- Ensure appropriate logins and database level permissions are in place
- Configure alerts, as appropriate

## Next steps

- Learn how to restore using [the Azure portal](how-to-restore-server-portal.md).
- Learn how to restore using [the Azure CLI](how-to-restore-server-cli.md).
- To learn more about business continuity, see the [business continuity overview](concepts-business-continuity.md).
