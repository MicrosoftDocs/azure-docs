---
title: Backup and restore - Azure Database for MySQL
description: Learn about automatic backups and restoring your Azure Database for MySQL server.
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: savjani
ms.author: pariks
ms.custom: references_regions
ms.date: 06/20/2022
---

# Backup and restore in Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Azure Database for MySQL automatically creates server backups and stores them in user configured locally redundant or geo-redundant storage. Backups can be used to restore your server to a point-in-time. Backup and restore are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion.

## Backups

Azure Database for MySQL takes backups of the data files and the transaction log. These backups allow you to restore a server to any point-in-time within your configured backup retention period. The default backup retention period is seven days. You can [optionally configure it](how-to-restore-server-portal.md#set-backup-configuration) up to 35 days. All backups are encrypted using AES 256-bit encryption.

These backup files are not user-exposed and cannot be exported. These backups can only be used for restore operations in Azure Database for MySQL. You can use [mysqldump](concepts-migrate-dump-restore.md) to copy a database.

The backup type and frequency is depending on the backend storage for the servers.

### Backup type and frequency

#### Basic storage servers

The Basic storage is the backend storage supporting [Basic tier servers](concepts-pricing-tiers.md). Backups on Basic storage servers are snapshot-based. A full database snapshot is performed daily. There are no differential backups performed for basic storage servers and all snapshot backups are full database backups only.

Transaction log backups occur every five minutes.

#### General purpose storage v1 servers (supports up to 4-TB storage)

The General purpose storage is the backend storage supporting [General Purpose](concepts-pricing-tiers.md) and [Memory Optimized tier](concepts-pricing-tiers.md) server. For servers with general purpose storage up to 4 TB, full backups occur once every week. Differential backups occur twice a day. Transaction log backups occur every five minutes. The backups on general purpose storage up to 4-TB storage are not snapshot-based and consumes IO bandwidth at the time of backup. For large databases (> 1 TB) on 4-TB storage, we recommend you consider

- Provisioning more IOPs to account for backup IOs  OR
- Alternatively, migrate to general purpose storage that supports up to 16-TB storage if the underlying storage infrastructure is available in your preferred [Azure regions](./concepts-pricing-tiers.md#storage). There is no additional cost for general purpose storage that supports up to 16-TB storage. For assistance with migration to 16-TB storage, please open a support ticket from Azure portal.

#### General purpose storage v2 servers (supports up to 16-TB storage)

In a subset of [Azure regions](./concepts-pricing-tiers.md#storage), all newly provisioned servers can support general purpose storage up to 16-TB storage. In other words, storage up to 16-TB storage is the default general purpose storage for all the [regions](concepts-pricing-tiers.md#storage) where it is supported. Backups on these 16-TB storage servers are snapshot-based. The first snapshot backup is scheduled immediately after a server is created. Snapshot backups are taken daily once. Transaction log backups occur every five minutes.

For more information of Basic and General purpose storage, refer [storage documentation](./concepts-pricing-tiers.md#storage).

### Backup retention

Backups are retained based on the backup retention period setting on the server. You can select a retention period of 7 to 35 days. The default retention period is 7 days. You can set the retention period during server creation or later by updating the backup configuration using [Azure portal](./how-to-restore-server-portal.md#set-backup-configuration) or [Azure CLI](./how-to-restore-server-cli.md#set-backup-configuration).

The backup retention period governs how far back in time a point-in-time restore can be retrieved, since it's based on backups available. The backup retention period can also be treated as a recovery window from a restore perspective. All backups required to perform a point-in-time restore within the backup retention period are retained in backup storage. For example, if the backup retention period is set to 7 days, the recovery window is considered last 7 days. In this scenario, all the backups required to restore the server in last 7 days are retained. With a backup retention window of seven days:

- General purpose storage v1 servers (supporting up to 4-TB storage) will retain up to 2 full database backups, all the differential backups, and transaction log backups performed since the earliest full database backup.
- General purpose storage v2 servers (supporting up to 16-TB storage) will retain the full database snapshots and transaction log backups in last 8 days.

#### Long-term retention

Long-term retention of backups beyond 35 days is currently not natively supported by the service yet. You have an option to use mysqldump to take backups and store them for long-term retention. Our support team has blogged a [step by step article](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/automate-backups-of-your-azure-database-for-mysql-server-to/ba-p/1791157) to share how you can achieve it.

### Backup redundancy options

Azure Database for MySQL provides the flexibility to choose between locally redundant or geo-redundant backup storage in the General Purpose and Memory Optimized tiers. When the backups are stored in geo-redundant backup storage, they are not only stored within the region in which your server is hosted, but are also replicated to a [paired data center](../../availability-zones/cross-region-replication-azure.md). This geo-redundancy provides better protection and ability to restore your server in a different region in the event of a disaster. The Basic tier only offers locally redundant backup storage.

> [!NOTE]
>For the following regions - Central India, France Central, UAE North, South Africa North; General purpose storage v2 storage is in Public Preview. If you create a source server in General purpose storage v2 (Supporting up to 16-TB storage) in the above mentioned regions then enabling Geo-Redundant Backup is not supported. 

#### Moving from locally redundant to geo-redundant backup storage

Configuring locally redundant or geo-redundant storage for backup is only allowed during server create. Once the server is provisioned, you cannot change the backup storage redundancy option. In order to move your backup storage from locally redundant storage to geo-redundant storage, creating a new server and migrating the data using [dump and restore](concepts-migrate-dump-restore.md) is the only supported option.

### Backup storage cost

Azure Database for MySQL provides up to 100% of your provisioned server storage as backup storage at no additional cost. Any additional backup storage used is charged in GB per month. For example, if you have provisioned a server with 250 GB of storage, you have 250 GB of additional storage available for server backups at no additional charge. Storage consumed for backups more than 250 GB is charged as per the [pricing model](https://azure.microsoft.com/pricing/details/mysql/).

You can use the [Backup Storage used](concepts-monitoring.md) metric in Azure Monitor available via the Azure portal to monitor the backup storage consumed by a server. The Backup Storage used metric represents the sum of storage consumed by all the full database backups, differential backups, and log backups retained based on the backup retention period set for the server. The frequency of the backups is service managed and explained earlier. Heavy transactional activity on the server can cause backup storage usage to increase irrespective of the total database size. For geo-redundant storage, backup storage usage is twice that of the locally redundant storage.

The primary means of controlling the backup storage cost is by setting the appropriate backup retention period and choosing the right backup redundancy options to meet your desired recovery goals. You can select a retention period from a range of 7 to 35 days. General Purpose and Memory Optimized servers can choose to have geo-redundant storage for backups.

## Restore

In Azure Database for MySQL, performing a restore creates a new server from the original server's backups and restores all databases contained in the server. Restore is currently not supported if original server is in stopped state.

There are two types of restore available:

- **Point-in-time restore** is available with either backup redundancy option and creates a new server in the same region as your original server utilizing the combination of full and transaction log backups.
- **Geo-restore** is available only if you configured your server for geo-redundant storage and it allows you to restore your server to a different region utilizing the most recent backup taken.

The estimated time for the recovery of the server depends on several factors:
* The size of the databases
* The number of transaction logs involved
* The amount of activity that needs to be replayed to recover to the restore point
* The network bandwidth if the restore is to a different region
* The number of concurrent restore requests being processed in the target region
* The presence of primary key in the tables in the database. For faster recovery, consider adding primary key for all the tables in your database. To check if your tables have primary key, you can use the following query:
```sql
select tab.table_schema as database_name, tab.table_name from information_schema.tables tab left join information_schema.table_constraints tco on tab.table_schema = tco.table_schema and tab.table_name = tco.table_name and tco.constraint_type = 'PRIMARY KEY' where tco.constraint_type is null and tab.table_schema not in('mysql', 'information_schema', 'performance_schema', 'sys') and tab.table_type = 'BASE TABLE' order by tab.table_schema, tab.table_name;
```
For a large or very active database, the restore might take several hours. If there is a prolonged outage in a region, it's possible that a high number of geo-restore requests will be initiated for disaster recovery. When there are many requests, the recovery time for individual databases can increase. Most database restores finish in less than 12 hours.

> [!IMPORTANT]
> Deleted servers can be restored only within **five days** of deletion after which the backups are deleted. The database backup can be accessed and restored only from the Azure subscription hosting the server. To restore a dropped server, refer [documented steps](how-to-restore-dropped-server.md). To protect server resources, post deployment, from accidental deletion or unexpected changes, administrators can leverage [management locks](../../azure-resource-manager/management/lock-resources.md).

### Point-in-time restore

Independent of your backup redundancy option, you can perform a restore to any point in time within your backup retention period. A new server is created in the same Azure region as the original server. It is created with the original server's configuration for the pricing tier, compute generation, number of vCores, storage size, backup retention period, and backup redundancy option.

> [!NOTE]
> There are two server parameters which are reset to default values (and are not copied over from the primary server) after the restore operation
>
> - time_zone - This value to set to DEFAULT value **SYSTEM**
> - event_scheduler - The event_scheduler is set to **OFF** on the restored server
>
> You will need to set these server parameters by reconfiguring the [server parameter](how-to-server-parameters.md)

Point-in-time restore is useful in multiple scenarios. For example, when a user accidentally deletes data, drops an important table or database, or if an application accidentally overwrites good data with bad data due to an application defect.

You may need to wait for the next transaction log backup to be taken before you can restore to a point in time within the last five minutes.

### Geo-restore

You can restore a server to another Azure region where the service is available if you have configured your server for geo-redundant backups. 
- General purpose storage v1 servers (supporting up to 4-TB storage) can be restored to the geo-paired region, or to any Azure region that supports Azure Database for MySQL - Single Server service.
- General purpose storage v2 servers (supporting up to 16-TB storage) can only be restored to Azure regions that support General purpose storage v2 servers infrastructure. 
Review [Azure Database for MySQL pricing tiers](./concepts-pricing-tiers.md#storage) for the list of supported regions.

Geo-restore is the default recovery option when your server is unavailable because of an incident in the region where the server is hosted. If a large-scale incident in a region results in unavailability of your database application, you can restore a server from the geo-redundant backups to a server in any other region. Geo-restore utilizes the most recent backup of the server. There is a delay between when a backup is taken and when it is replicated to different region. This delay can be up to an hour, so, if a disaster occurs, there can be up to one hour data loss.

> [!IMPORTANT]
>If a geo-restore is performed for a newly created server, the initial backup synchronization may take more than 24 hours depending on data size as the initial full snapshot backup copy time is much higher. Subsequent snapshot backups are incremental copy and hence the restores are faster after 24 hours of server creation. If you are evaluating geo-restores to define your RTO, we recommend you to wait and evaluate geo-restore **only after 24 hours** of server creation for better estimates.

During geo-restore, the server configurations that can be changed include compute generation, vCore, backup retention period, and backup redundancy options. Changing pricing tier (Basic, General Purpose, or Memory Optimized) or storage size during geo-restore is not supported.

The estimated time of recovery depends on several factors including the database sizes, the transaction log size, the network bandwidth, and the total number of databases recovering in the same region at the same time. The recovery time is usually less than 12 hours.

### Perform post-restore tasks

After a restore from either recovery mechanism, you should perform the following tasks to get your users and applications back up and running:

- If the new server is meant to replace the original server, redirect clients and client applications to the new server
- Ensure appropriate VNet rules are in place for users to connect. These rules are not copied over from the original server.
- Ensure appropriate logins and database level permissions are in place
- Configure alerts, as appropriate

## Next steps

- To learn more about business continuity, see the [business continuity overview](concepts-business-continuity.md).
- To restore to a point-in-time using the Azure portal, see [restore server to a point-in-time using the Azure portal](how-to-restore-server-portal.md).
- To restore to a point-in-time using Azure CLI, see [restore server to a point-in-time using CLI](how-to-restore-server-cli.md).
