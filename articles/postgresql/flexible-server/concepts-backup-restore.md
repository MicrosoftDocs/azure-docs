---
title: Backup and restore in Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of backup and restore with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/21/2020
---
# Backup and restore in Azure Database for PostgreSQL - Flexible Server
 
 ## Overview
 Backup and recoverability are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion. Azure Database for PostgreSQL Flexible Server, which is currently in preview, automatically backs up your server and retains the backups for the duration defined by you. During the restore process, you can specify the date and time to which you want to restore, flexible server automatically performs restore and recovery operations to the specific point-in-time. The overall time to restore and recover depends on the size of the database files and the amount of recovery. 

### Backup in flexible server
Flexible Server takes snapshot backups of the data files and stores them in a zone redundant storage that is confined to a region. The server also performs continuous transaction logs backup and stores them in a zone redundant storage. These backups allow you to restore a server to any point-in-time within your configured backup retention period. All backups are encrypted using AES 256-bit encryption.

The backups can only be used for restore operations in the Flexible server. You can also use [pg_dump](https://docs.microsoft.com/azure/postgresql/howto-migrate-using-dump-and-restore) from a PostgreSQL client to copy a database.

### Backup frequency

The first full snapshot backup is scheduled immediately after a database server is created. Subsequently, a daily snapshot of data backup is performed.
Transaction log backups occur continuously. If the database is configured with high availability, daily snapshots are performed from the primary and the continuous log backups are performed from the standby.

### Backup retention

Database backups are stored in a zone redundant storage as multiple copies across availability zones and within a region. Backups are retained based on the backup retention period setting on the server. You can select a retention period between 7 and 35 days. The default retention period is seven days. You can set the retention period during server creation or later by updating the backup configuration using Azure portal.

The backup retention period governs how far back in time a point-in-time restore can be retrieved, since it\'s based on backups available. The
backup retention period can also be treated as a recovery window from a restore perspective. All backups required to perform a point-in-time
restore within the backup retention period are retained in the backup storage. For example - if the backup retention period is set to seven days, the recovery window is considered as last seven days. In this scenario, all the data and logs required to restore and recover the server in last seven days are retained. 

### Backup storage cost

Flexible server provides up to 100% of your provisioned server storage as backup storage at no additional cost. Any additional backup storage
used is charged in GB per month. For example, if you have provisioned a server with 250 GiB of storage, you have 250 GiB of backup storage capacity at no additional charge. If the daily backup usage is 25 GiB, then you can have up to 10 days of free backup storage. Storage consumed for backups more than 250 GiB is charged as per the [pricing model](https://azure.microsoft.com/pricing/details/postgresql/).

You can use the [Backup storage used](https://docs.microsoft.com/azure/postgresql/concepts-monitoring) metric in Azure Monitor available in the Azure portal to monitor the backup storage consumed by a server. The Backup Storage used metric represents the sum of storage consumed by all the database backups and log backups retained based on the backup retention period set for the server.  Heavy transactional activity on the server can cause backup storage usage to increase irrespective of the total database size.

The primary means of controlling the backup storage cost is by setting the appropriate backup retention period and choosing the right backup
redundancy options to meet your desired recovery goals.

> [!IMPORTANT]
> Geo-redundant backups are currently not supported with flexible server.

## Point-in-time restore

In Flexible server, performing a point-in-time restore creates a new server from the flexible server\'s backups in the same region as your
source server. It is created with the source server's configuration for the pricing tier, compute generation, number of vCores, storage
size, backup retention period, and backup redundancy option. Also, tags and settings such as VNET and firewall settings are inherited from the source server.

 ### Restore process
The physical database files are first restored from the snapshot backups to the server's data location. The appropriate backup that was taken earlier than the desired point-in-time is automatically chosen and restored. Once the data files are restored, a recovery process is initiated to bring the database to a consistent state by rolling forward to a desired point-in-time using the transaction logs that happened after the restored time. 

 For example, let us assume the backups are performed at 11pm every night. If the restore point is for August 15 at 10:00 am, the daily backup of August 14 is restored. The database will be recovered until 10am using the transaction logs backup between August 24, 11pm until August 25, 10am. 

> [!IMPORTANT]
> Restore operations in flexible server creates a new database server and does not overwrite the existing database server.
> 
Point-in-time restore is useful in multiple scenarios. For example, when a user accidentally deletes data, drops an important table or database,
or if an application accidentally overwrites good data with bad data due to an application defect. You will be able to restore and recover to the last transaction due to continuous backup of transaction logs.

You can choose between an earliest restore point and a custom restore point.

-   **Earliest restore point**: Depending on your retention period, the earliest time that you can restore will be autoselected for you. The timestamp to which you can restore is displayed on the portal. You can choose this option if you want to investigate or test data starting that point in time.

-   **Custom restore point**: This option allows you to choose any point-in-time within the retention period defined for this flexible server. By default, the latest time in UTC is autoselected, and useful if you want to restore to the last committed transaction. You can optionally choose other days and time. 

The estimated time of recovery depends on several factors including the database sizes, the transaction log size, the network bandwidth, and the total number of databases recovering in the same region at the same time. The overall recovery time usually takes from few minutes up to 12 hours.


> [!IMPORTANT]
> If you are restoring a flexible server configured with zone redundant high availability, the restored server will be configured in the same region and zone as your primary server, and deployed as a single flexible server in a non-HA mode.

> [!IMPORTANT]
> Deleted servers **cannot** be restored. If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. To protect server resources, post deployment, from accidental deletion or unexpected changes, administrators can leverage [management locks](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-lock-resources).

## Perform post-restore tasks

After a restore from either recovery mechanism, you should perform the following tasks to get your users and applications back up and running:

-   If the new server is meant to replace the original server, redirect clients and client applications to the new server.

-   Ensure appropriate server-level firewall and VNet rules are in place for users to connect. These rules are not copied over from the original server.

-   Ensure appropriate logins and database level permissions are in place.

-   Configure alerts, as appropriate.

## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
-   Learn [how to restore](./how-to-restore-server-portal.md)

## Feedback

Submit and view feedback 
