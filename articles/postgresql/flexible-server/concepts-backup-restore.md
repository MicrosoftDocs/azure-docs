---
title: Backup and restore in Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of backup and restore with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/22/2020
---

# Backup and restore in Azure Database for PostgreSQL - Flexible Server

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

Backups form an essential part of any business continuity strategy. They help with protecting data from accidental corruption or deletion. Azure Database for PostgreSQL - Flexible Server automatically backs up your server and retains the backups for the duration of up to 35 days. While restoring, you can specify the date and time to which you want to restore within the retention period. The overall time to restore and recover depends on the size of the database files and the amount of recovery to be performed. 

### Backup process in flexible server
The first snapshot backup is scheduled immediately after the flexible server is created. Subsequently, a daily snapshot backup of data files is performed. Backups are stored in a zone redundant storage within a region. Transaction logs (write ahead logs - WAL) are also archived continuously, so that you will be able to restore to the last committed transaction. These data and logs backups allow you to restore a server to any point-in-time within your configured backup retention period. All backups are encrypted using AES 256-bit encryption.

If the database is configured with high availability, daily snapshots are performed from the primary and the continuous log backups are performed from the standby.

> [!IMPORTANT]
>Backups are not performed on stopped servers. However, backups are resumed when the database is either automatically started after 7 days or started by the user.

The backups can only be used for restore operations within the Flexible server. If you want to export or import data to the flexible server, you use [dump and restore](../howto-migrate-using-dump-and-restore.md) methodology.


### Backup retention

Backups are retained based on the backup retention period setting for the server. You can select a retention period between 7 and 35 days. The default retention period is seven days. You can set the retention period during server creation or you can update it at a later time. Backups are retained even for stopped servers.

The backup retention period governs how far back in time a point-in-time restore can be retrieved, since it\'s based on backups available. The backup retention period can also be treated as a recovery window from a restore perspective. All backups required to perform a point-in-time restore within the backup retention period are retained in the backup storage. For example - if the backup retention period is set to seven days, the recovery window is considered as last seven days. In this scenario, all the data and logs required to restore and recover the server in last seven days are retained. 


### Backup storage cost

Flexible server provides up to 100% of your provisioned server storage as backup storage at no additional cost. Any additional backup storage used is charged in GB per month. For example, if you have provisioned a server with 250 GiB of storage, then you have 250 GiB of backup storage capacity at no additional charge. If the daily backup usage is 25 GiB, then you can have up to 10 days of free backup storage. Backup storage consumption exceeding 250 GiB is charged as per the [pricing model](https://azure.microsoft.com/pricing/details/postgresql/).

You can use the [Backup storage used](../concepts-monitoring.md) metric in the Azure portal to monitor the backup storage consumed by a server. The Backup Storage used metric represents the sum of storage consumed by all the database backups and log backups retained based on the backup retention period set for the server.  Heavy transactional activity on the server can cause backup storage usage to increase irrespective of the total database size.

The primary means of controlling the backup storage cost is by setting the appropriate backup retention period and choosing the right backup redundancy options to meet your desired recovery goals.

> [!IMPORTANT]
> Geo-redundant backups are currently not supported with flexible server.

## Point-in-time restore overview

In Flexible server, performing a point-in-time restore creates a new server from the flexible server\'s backups in the same region as your source server. It is created with the source server's configuration for the pricing tier, compute generation, number of vCores, storage size, backup retention period, and backup redundancy option. Also, tags and settings such as VNET and firewall settings are inherited from the source server. 

 > [!IMPORTANT]
> If you are restoring a flexible server configured with zone redundant high availability, the restored server will be configured without high availability, and in the same region as your primary server. 

 ### Restore process

The physical database files are first restored from the snapshot backups to the server's data location. The appropriate backup that was taken earlier than the desired point-in-time is automatically chosen and restored. A recovery process is then initiated using WAL files to bring the database to a consistent state. 

 For example, let us assume the backups are performed at 11pm every night. If the restore point is for August 15, 2020 at 10:00 am, the daily backup of August 14, 2020 is restored. The database will be recovered until 10am of August 25, 2020 using the transaction logs backup between August 24, 11pm until August 25, 10am. 

 Please see [these steps](./how-to-restore-server-portal.md) to restore your database server.

> [!IMPORTANT]
> Restore operations in flexible server creates a new database server and does not overwrite the existing database server.

Point-in-time restore is useful in multiple scenarios. For example, when a user accidentally deletes data, drops an important table or database, or if an application accidentally overwrites good data with bad data due to an application defect. You will be able to restore to the last transaction due to continuous backup of transaction logs.

You can choose between an earliest restore point and a custom restore point.

-   **Earliest restore point**: Depending on your retention period, it will be the earliest time that you can restore. The oldest backup time will be auto-selected and is displayed on the portal. This is useful if you want to investigate or do some testing starting that point in time.

-   **Custom restore point**: This option allows you to choose any point-in-time within the retention period defined for this flexible server. By default, the latest time in UTC is auto-selected, and useful if you want to restore to the last committed transaction for your test purposes. You can optionally choose other days and time. 

The estimated time to recover depends on several factors including database size, volume of transaction logs to process, the network bandwidth, and the total number of databases recovering in the same region at the same time. The overall recovery time usually takes from few minutes up to few hours.


> [!IMPORTANT]
> Deleted servers **cannot** be restored. If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. To protect server resources, post deployment, from accidental deletion or unexpected changes, administrators can leverage [management locks](../../azure-resource-manager/management/lock-resources.md).

## Perform post-restore tasks

After restoring the database, you can perform the following tasks to get your users and applications back up and running:

-   If the new server is meant to replace the original server, redirect clients and client applications to the new server.

-   Ensure appropriate server-level firewall and VNet rules are in place for users to connect. These rules are not copied over from the original server.
  
-   The restored server's compute can be scaled up / down as needed.

-   Ensure appropriate logins and database level permissions are in place.

-   Configure alerts, as appropriate.
  
-  If you had restored the database configured with high availability, and if you want to configure the restored server with high availability, you can then follow [the steps](./how-to-manage-high-availability-portal.md).


## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
-   Learn [how to restore](./how-to-restore-server-portal.md)