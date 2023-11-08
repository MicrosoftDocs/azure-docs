---
title: Backup and restore - Azure Database for MariaDB
description: Learn about automatic backups and restoring your Azure Database for MariaDB server.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.topic: conceptual
ms.date: 06/24/2022
---

# Backup and restore in Azure Database for MariaDB

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

Azure Database for MariaDB automatically creates server backups and stores them in user configured locally redundant or geo-redundant storage. Backups can be used to restore your server to a point-in-time. Backup and restore are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion.

## Backups

Azure Database for MariaDB takes backups of the data files and the transaction log. These backups allow you to restore a server to any point-in-time within your configured backup retention period. The default backup retention period is seven days. You can [optionally configure it](howto-restore-server-portal.md#set-backup-configuration) up to 35 days. All backups are encrypted using AES 256-bit encryption.

These backup files aren't user-exposed and can't be exported. These backups can only be used for restore operations in Azure Database for MariaDB. You can use [mysqldump](howto-migrate-dump-restore.md) to copy a database.

The backup type and frequency is dependent on the backend storage for the servers.

### Backup type and frequency

#### Basic storage servers

The Basic storage is the backend storage supporting [Basic tier servers](concepts-pricing-tiers.md). Backups on Basic storage servers are snapshot-based. A full database snapshot is performed daily. There are no differential backups performed for basic storage servers and all snapshot backups are full database backups only.

Transaction log backups occur every five minutes.

#### General purpose storage servers with up to 4-TB storage

The General purpose storage is the backend storage supporting [General Purpose](concepts-pricing-tiers.md) and [Memory Optimized tier](concepts-pricing-tiers.md) server. For servers with general purpose storage up to 4 TB, full backups occur once every week. Differential backups occur twice a day. Transaction log backups occur every five minutes. The backups on general purpose storage up to 4-TB storage aren't snapshot-based and consumes IO bandwidth at the time of backup. For large databases (> 1 TB) on 4-TB storage, we recommend you consider

- Provisioning more IOPs to account for backup IOs  OR
- Alternatively, migrate to general purpose storage that supports up to 16-TB storage if the underlying storage infrastructure is available in your preferred [Azure regions](./concepts-pricing-tiers.md#storage). There's no additional cost for general purpose storage that supports up to 16-TB storage. For assistance with migration to 16-TB storage, open a support ticket from Azure portal.

#### General purpose storage servers with up to 16-TB storage

In a subset of [Azure regions](./concepts-pricing-tiers.md#storage), all newly provisioned servers can support general purpose storage up to 16-TB storage. In other words, storage up to 16-TB storage is the default general purpose storage for all the [regions](concepts-pricing-tiers.md#storage) where it's supported. Backups on these 16-TB storage servers are snapshot-based. The first full snapshot backup is scheduled immediately after a server is created. That first full snapshot backup is retained as the server's base backup. Subsequent snapshot backups are differential backups only.

Differential snapshot backups occur at least once a day. Differential snapshot backups don't occur on a fixed schedule. Differential snapshot backups occur every 24 hours unless the transaction log (binlog in MariaDB) exceeds 50 GB since the last differential backup. In a day, a maximum of six differential snapshots are allowed.

Transaction log backups occur every five minutes.

### Backup retention

Backups are retained based on the backup retention period setting on the server. You can select a retention period of 7 to 35 days. The default retention period is seven days. You can set the retention period during server creation or later by updating the backup configuration using [Azure portal](howto-restore-server-portal.md#set-backup-configuration) or [Azure CLI](howto-restore-server-cli.md#set-backup-configuration).

The backup retention period governs how far back in time a point-in-time restore can be retrieved, since it's based on backups available. The backup retention period can also be treated as a recovery window from a restore perspective. All backups required to perform a point-in-time restore within the backup retention period are retained in backup storage. For example, if the backup retention period is set to seven days, the recovery window is considered last seven days. In this scenario, all the backups required to restore the server in last seven days are retained. With a backup retention window of seven days:

- Servers with up to 4-TB storage will retain up to two full database backups, all the differential backups, and transaction log backups performed since the earliest full database backup.
-	Servers with up to 16-TB storage will retain the full database snapshot, all the differential snapshots and transaction log backups in last eight days.

#### Long-term retention of backups

Long-term retention of backups beyond 35 days is currently not natively supported by the service yet. You have a option to use mysqldump to take backups and store them for long-term retention. Our support team has blogged a [step by step article](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/automate-backups-of-your-azure-database-for-mysql-server-to/ba-p/1791157) to share how you can achieve it.

### Backup redundancy options

Azure Database for MariaDB provides the flexibility to choose between locally redundant or geo-redundant backup storage in the General Purpose and Memory Optimized tiers. When the backups are stored in geo-redundant backup storage, they aren't only stored within the region in which your server is hosted, but are also replicated to a [paired data center](../availability-zones/cross-region-replication-azure.md). This provides better protection and ability to restore your server in a different region in the event of a disaster. The Basic tier only offers locally redundant backup storage.

#### Moving from locally redundant to geo-redundant backup storage

Configuring locally redundant or geo-redundant storage for backup is only allowed during server create. Once the server is provisioned, you can't change the backup storage redundancy option. In order to move your backup storage from locally redundant storage to geo-redundant storage, creating a new server and migrating the data using [dump and restore](howto-migrate-dump-restore.md) is the only supported option.

### Backup storage cost

Azure Database for MariaDB provides up to 100% of your provisioned server storage as backup storage at no additional cost. Any additional backup storage used is charged in GB per month. For example, if you've provisioned a server with 250 GB of storage, you have 250 GB of additional storage available for server backups at no additional charge. Storage consumed for backups more than 250 GB is charged as per the [pricing model](https://azure.microsoft.com/pricing/details/mariadb/).

You can use the [Backup Storage used](concepts-monitoring.md) metric in Azure Monitor available via the Azure portal to monitor the backup storage consumed by a server. The Backup Storage used metric represents the sum of storage consumed by all the full database backups, differential backups, and log backups retained based on the backup retention period set for the server. The frequency of the backups is service managed and explained earlier. Heavy transactional activity on the server can cause backup storage usage to increase irrespective of the total database size. For geo-redundant storage, backup storage usage is twice that of the locally redundant storage.

The primary means of controlling the backup storage cost is by setting the appropriate backup retention period and choosing the right backup redundancy options to meet your desired recovery goals. You can select a retention period from a range of 7 to 35 days. General Purpose and Memory Optimized servers can choose to have geo-redundant storage for backups.

## Restore

In Azure Database for MariaDB, performing a restore creates a new server from the original server's backups and restores all databases contained in the server.

There are two types of restore available:

- **Point-in-time restore** is available with either backup redundancy option and creates a new server in the same region as your original server utilizing the combination of full and transaction log backups.
- **Geo-restore** is available only if you configured your server for geo-redundant storage and it allows you to restore your server to a different region utilizing the most recent backup taken.

The estimated time of recovery depends on several factors including the database sizes, the transaction log size, the network bandwidth, and the total number of databases recovering in the same region at the same time. The recovery time is less than 12 hours.

> [!IMPORTANT]
> Deleted servers can be restored only within **five days** of deletion after which the backups are deleted. The database backup can be accessed and restored only from the Azure subscription hosting the server. To restore a dropped server, refer [documented steps](howto-restore-dropped-server.md). To protect server resources, post deployment, from accidental deletion or unexpected changes, administrators can leverage [management locks](../azure-resource-manager/management/lock-resources.md).

### Point-in-time restore

Independent of your backup redundancy option, you can perform a restore to any point in time within your backup retention period. A new server is created in the same Azure region as the original server. It's created with the original server's configuration for the pricing tier, compute generation, number of vCores, storage size, backup retention period, and backup redundancy option.

Point-in-time restore is useful in multiple scenarios. For example, when a user accidentally deletes data, drops an important table or database, or if an application accidentally overwrites good data with bad data due to an application defect.

You may need to wait for the next transaction log backup to be taken before you can restore to a point in time within the last five minutes.

### Geo-restore

You can restore a server to another Azure region where the service is available if you've configured your server for geo-redundant backups. Servers that support up to 4 TB of storage can be restored to the geo-paired region, or to any region that supports up to 16 TB of storage. For servers that support up to 16 TB of storage, geo-backups can be restored in any region that support 16-TB servers as well. Review [Azure Database for MariaDB pricing tiers](concepts-pricing-tiers.md) for the list of supported regions.

Geo-restore is the default recovery option when your server is unavailable because of an incident in the region where the server is hosted. If a large-scale incident in a region results in unavailability of your database application, you can restore a server from the geo-redundant backups to a server in any other region. Geo-restore utilizes the most recent backup of the server. There's a delay between when a backup is taken and when it's replicated to different region. This delay can be up to an hour, so, if a disaster occurs, there can be up to one hour data loss.

> [!IMPORTANT]
>If a geo-restore is performed for a newly created server, the initial backup synchronization may take more than 24 hours depending on data size as the initial full snapshot backup copy time is much higher. Subsequent snapshot backups are incremental copy and hence the restores are faster after 24 hours of server creation. If you are evaluating geo-restores to define your RTO, we recommend you to wait and evaluate geo-restore **only after 24 hours** of server creation for better estimates.

During geo-restore, the server configurations that can be changed include compute generation, vCore, backup retention period, and backup redundancy options. Changing pricing tier (Basic, General Purpose, or Memory Optimized) or storage size during geo-restore isn't supported.

The estimated time of recovery depends on several factors including the database sizes, the transaction log size, the network bandwidth, and the total number of databases recovering in the same region at the same time. The recovery time is less than 12 hours.

### Perform post-restore tasks

After a restore from either recovery mechanism, you should perform the following tasks to get your users and applications back up and running:

- If the new server is meant to replace the original server, redirect clients and client applications to the new server
- Ensure appropriate VNet rules are in place for users to connect. These rules aren't copied over from the original server.
- Ensure appropriate logins and database level permissions are in place
- Configure alerts, as appropriate

## Next steps

- To learn more about business continuity, see the [business continuity overview](concepts-business-continuity.md).
- To restore to a point-in-time using the Azure portal, see [restore server to a point-in-time using the Azure portal](howto-restore-server-portal.md).
- To restore to a point-in-time using Azure CLI, see [restore server to a point-in-time using CLI](howto-restore-server-cli.md).
