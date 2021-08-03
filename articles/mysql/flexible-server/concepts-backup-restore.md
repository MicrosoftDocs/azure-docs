---
title: Backup and restore in Azure Database for MySQL Flexible Server
description: Learn about the concepts of backup and restore with Azure Database for MySQL Flexible Server
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.topic: conceptual
ms.date: 09/21/2020
---

# Backup and restore in Azure Database for MySQL Flexible Server (Preview)

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

> [!IMPORTANT]
> Azure Database for MySQL - Flexible Server is currently in public preview.

Azure Database for MySQL Flexible Server, automatically creates server backups and securely stores them in local redundant storage within the region. Backups can be used to restore your server to a point-in-time. Backup and restore are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion.

## Backup overview

Flexible Server takes snapshot backups of the data files and stores them in a local redundant storage. The server also performs transaction logs backup and also stores them in local redundant storage. These backups allow you to restore a server to any point-in-time within your configured backup retention period. The default backup retention period is seven days. You can optionally configure the database backup from 1 to 35 days. All backups are encrypted using AES 256-bit encryption for the data stored at rest.

These backup files cannot be exported. The backups can only be used for restore operations in Flexible server. You can also use [mysqldump](../concepts-migrate-dump-restore.md#dump-and-restore-using-mysqldump-utility) from a MySQL client to copy a database.

## Backup frequency

Backups on flexible servers are snapshot-based. The first snapshot backup is scheduled immediately after a server is created. Snapshot backups are taken daily once. Transaction log backups occur every five minutes.

## Backup retention

Database backups are stored in a local redundant storage (LRS)-- which is stored in three copies within a region. Backups are retained based on the backup retention period setting on the server. You can select a retention period of 1 to 35 days with a default retention period is seven days. You can set the retention period during server creation or later by updating the backup configuration using Azure portal.

The backup retention period governs how far back in time can a point-in-time restore operation be performed, since it's based on backups available. The backup retention period can also be treated as a recovery window from a restore perspective. All backups required to perform a point-in-time restore within the backup retention period are retained in backup storage. For example - if the backup retention period is set to seven days, the recovery window is considered last seven days. In this scenario, all the backups required to restore the server in last seven days are retained. With a backup retention window of seven days, database snapshots and transaction log backups are stored for the last eight days (1 day prior to the window).

## Backup storage cost

Flexible server provides up to 100% of your provisioned server storage as backup storage at no additional cost. Any additional backup storage used is charged in GB per month. For example, if you have provisioned a server with 250 GB of storage, you have 250 GB of storage available for server backups at no additional charge. If the daily backup usage is 25GB, then you can have up to 10 days of free backup storage. Storage consumed for backups more than 250 GB is charged as per the [pricing model](https://azure.microsoft.com/pricing/details/mysql/).

You can use the [Backup Storage used](./concepts-monitoring.md) metric in Azure Monitor available in the Azure portal to monitor the backup storage consumed by a server. The **Backup Storage** used metric represents the sum of storage consumed by all the database backups and log backups retained based on the backup retention period set for the server. Heavy transactional activity on the server can cause backup storage usage to increase irrespective of the total database size.

The primary means of controlling the backup storage cost is by setting the appropriate backup retention period. You can select a retention period between 1 to 35 days.

> [!IMPORTANT]
> Backups from a database server configured in a zone redundant high availability configuration happens from the primary database server as the overhead is minimal with snapshot backups.

> [!IMPORTANT]
> Geo-redundant backups are currently not supported with flexible server.

## Point-in-time restore

In Azure Database for MySQL Flexible Server, performing a point-in-time restore creates a new server from the flexible server's backups in the same region as your source server. It is created with the original server's configuration for the compute tier, number of vCores, storage size, backup retention period, and backup redundancy option. Also, tags and settings such as virtual network and firewall are inherited from the source server. The restored server's compute and storage tier, configuration and security settings can be changed after the restore is completed.

> [!NOTE]
> There are two server parameters which are reset to default values (and are not copied over from the primary server) after the restore operation
> *   time_zone - This value to set to DEFAULT value SYSTEM
> *   event_scheduler - The event_scheduler is set to OFF on the restored server

Point-in-time restore is useful in multiple scenarios. Some of the use cases that are common include -
-   When a user accidentally deletes data in the database
-   User drops an important table or database
-   User application accidentally overwrites good data with bad data due to an application defect.

You can choose between a latest restore point and a custom restore point via [Azure portal](how-to-restore-server-portal.md).

-   **Latest restore point**: The latest restore point option helps you to restore the server to the timestamp when the restore operation was triggered. This option is useful to quickly restore the server to the most updated state.
-   **Custom restore point**: This will allow you to choose any point-in-time within the retention period defined for this flexible server. This option is useful to restore the server at the precise point in time to recover from a user error.

The estimated time of recovery depends on several factors including the database sizes, the transaction log backup size, the compute size of the SKU, and the time of the restore as well. The transaction log recovery is the most time consuming part of the restore process. If the restore time is chosen closer to the snapshot backup schedule, the restore operations are faster since transaction log application is minimal. To estimate the accurate recovery time for your server, we highly recommend testing it in your environment as it has too many environment specific variables.

> [!IMPORTANT]
> If you are restoring a flexible server configured with zone redundant high availability, the restored server will be configured in the same region and zone as your primary server, and deployed as a single flexible server in a non-HA mode. Refer to [zone redundant high availability](concepts-high-availability.md) for flexible server.

> [!IMPORTANT]
> Deleted servers **cannot** be restored. If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. To protect server resources, post deployment, from accidental deletion or unexpected changes, administrators can leverage [management locks](../../azure-resource-manager/management/lock-resources.md).

## Perform post-restore tasks

After a restore from either **latest restore point** or **custom restore point** recovery mechanism, you should perform the following tasks to get your users and applications back up and running:

-   If the new server is meant to replace the original server, redirect clients and client applications to the new server.
-   Ensure appropriate server-level firewall and virtual network rules are in place for users to connect.
-   Ensure appropriate logins and database level permissions are in place.
-   Configure alerts, as appropriate.

## Frequently Asked Questions (FAQs)

### Backup related questions

- **How do I backup my server?**
By default, Azure Database for MySQL enables automated backups of your entire server (encompassing all databases created) with a default 7 day retention period. The only way to manually take a backup is by using community tools such as mysqldump as documented [here](../concepts-migrate-dump-restore.md#dump-and-restore-using-mysqldump-utility) or mydumper as documented [here](../concepts-migrate-mydumper-myloader.md#create-a-backup-using-mydumper). If you wish to backup Azure Database for MySQL to a Blob storage, refer to our tech community blog [Backup Azure Database for MySQL to a Blob Storage](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/backup-azure-database-for-mysql-to-a-blob-storage/ba-p/803830). 

- **Can I configure automatic backups to be retained for long term?**
No, currently we only support a maximum of 35 days of automated backup retention. You can take manual backups and use that for long-term retention requirement.

- **What are the backup windows for my server? Can I customize it?**
The first snapshot backup is scheduled immediately after a server is created. Snapshot backups are taken daily once. Transaction log backups occur every five minutes. Backup windows are inherently managed by Azure and cannot be customized.

- **Are my backups encrypted?**
All Azure Database for MySQL data, backups and temporary files created during query execution are encrypted using AES 256-bit encryption. The storage encryption is always on and cannot be disabled. 

- **Can I restore a single/few database(s)?**
Restoring a single/few database(s) or tables is not supported. In case you want to restore specific databases, perform a Point in Time Restore and then extract the table(s) or database(s) needed.

- **Is my server available during the backup window?**
Yes. Backups are online operations and are snapshot-based. The snapshot operation only takes few seconds and doesn’t interfere with production workloads ensuring high availability of the server.

- **When setting up the maintenance window for the server do we need to account for backup window?**
No, backups are triggered internally as part of the managed service and have no bearing to the Managed Maintenance Window.

- **Where are my automated backups stored and how do I manage their retention?**
Azure Database for MySQL automatically creates server backups and stores them in user-configured, locally redundant storage or in geo-redundant storage. These backup files can't be exported. The default backup retention period is seven days. You can optionally configure the database backup from 1 to 35 days.

- **How can I validate my backups?**
The best way to validate availability of valid backups is performing periodic point in time restores and ensuring backups are valid and restorable. Backup operations or files are not exposed to the end users.

- **Where can I see the backup usage?**
In the Azure portal, under Monitoring tab - Metrics section, you can find the [Backup Storage Used](./concepts-monitoring.md) metric which can help you monitor the total backup usage.

- **What happens to my backups if I delete my server?**
If you delete the server, all backups that belong to the server are also deleted and cannot be recovered. To protect server resources, post deployment, from accidental deletion or unexpected changes, administrators can leverage [management locks](../../azure-resource-manager/management/lock-resources.md).

- **How will I be charged and billed for my use of backups?**
Flexible server provides up to 100% of your provisioned server storage as backup storage at no additional cost. Any additional backup storage used is charged in GB per month as per the [pricing model](https://azure.microsoft.com/pricing/details/mysql/server/). Backup storage billing is also governed by the backup retention period selected and backup redundancy option chosen apart from the transactional activity on the server which impacts the total backup storage used directly.

- **How are backups retained for stopped servers?**
No new backups are performed for stopped servers. All older backups (within the retention window) at the time of stopping the server are retained until the server is restarted post which backup retention for the active server is governed by it’s backup retention window.

- **How will I be billed for backups for a stopped server?**
While your server instance is stopped, you are charged for provisioned storage (including Provisioned IOPS) and backup storage (backups stored within your specified retention window). Free backup storage is limited to the size of your provisioned database and only applies to active servers. 

### Restore related questions

- **How do I restore my server?**
Azure portal supports Point In Time Restore (for all servers) allowing users to restore to latest or custom restore point. To manually restore your server from the backups taken by mysqldump/myDumper read [Restore your database using myLoader](../concepts-migrate-mydumper-myloader.md#restore-your-database-using-myloader).

- **Why is my restore taking so much time?**
The estimated time for the recovery of the server depends on several factors: 
   - The size of the databases. As a part of the recovery process, the database needs to be hydrated from the last physical backup and hence the time taken to recover will be proportional to the size of the database.
   - The active portion of transaction activity that needs to be replayed to recover. Recovery can take longer depending on the additional transaction activity from the last successful checkpoint.
   - The network bandwidth if the restore is to a different region 
   - The number of concurrent restore requests being processed in the target region 
   - The presence of primary key in the tables in the database. For faster recovery, consider adding primary key for all the tables in your database.  


## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)
