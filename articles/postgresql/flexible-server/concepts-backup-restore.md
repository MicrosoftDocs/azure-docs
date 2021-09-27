---
title: Backup and restore in Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of backup and restore with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 07/30/2021
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

You can choose between a latest restore point and a custom restore point.

-   **Latest restore point (now)**: This is the default option which allows you to restore the server to the latest point-in-time. 

-   **Custom restore point**: This option allows you to choose any point-in-time within the retention period defined for this flexible server. By default, the latest time in UTC is auto-selected, and useful if you want to restore to the last committed transaction for your test purposes. You can optionally choose other days and time. 

The estimated time to recover depends on several factors including database size, volume of transaction logs to process, the network bandwidth, and the total number of databases recovering in the same region at the same time. The overall recovery time usually takes from few minutes up to few hours.

If you have configured your server within a VNET, you can restore to the same VNET or to a different VNET. However, you cannot restore to a public access. Similarly, if you configured your server with public access, you cannot restore to a private access.


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

## Frequently asked questions

### Backup related questions

* **How do Azure handles backup of my server?**
 
    By default, Azure Database for PostgreSQL enables automated backups of your entire server (encompassing all databases created) with a default 7 days of retention period. A daily incremental snapshot of the database is performed. The logs (WAL) files are archived to Azure BLOB continuously.

* **Can I configure these automatic backup to be retained for long term?**
  
    No. Currently we only support a maximum of 35 days of retention. You can do manual backups and use that for long-term retention requirement.

* **How do I do manual backup of my Postgres servers?**
  
    You can manually take a backup is by using PostgreSQL tool pg_dump as documented [here](https://www.postgresql.org/docs/current/app-pgdump.html). For examples, you can refer to this [upgrade/migration documentation](../howto-migrate-using-dump-and-restore.md) that you can use for backups as well. If you wish to backup Azure Database for PostgreSQL to a Blob storage, refer to our tech community blog [Backup Azure Database for PostgreSQL to a Blob Storage](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/backup-azure-database-for-postgresql-to-a-blob-storage/ba-p/803343). 

* **What are the backup windows for my server? Can I customize it?**
  
    Backup windows are inherently managed by Azure and cannot be customized. The first full snapshot backup is scheduled immediately after a server is created. Subsequent snapshot backups are incremental backups that occur once a day.

* **Are my backups encrypted?**
  
    Yes. All Azure Database for PostgreSQL data, backups and temporary files that are created during query execution are encrypted using AES 256-bit encryption. The storage encryption is always on and cannot be disabled. 

* **Can I restore a single/few database(s) in a server?**
  
    Restoring a single/few database(s) or tables is not directly supported. However, you need to restore the entire server to a new server and then extract the table(s) or database(s) needed and import them to your server.

* **Is my server available while the backup is in progress?**
    Yes. Backups are online operations using snapshots. The snapshot operation only takes few seconds and doesn’t interfere with production workloads ensuring high availability of the server. 

* **When setting up the maintenance window for the server do we need to account for backup window?**
  
    No. Backups are triggered internally as part of the managed service and have no bearing to  the Managed Maintenance Window.

* **Where are my automated backups stored and how do I manage their retention?**
  
    Azure Database for PostgreSQL automatically creates server backups and stores them automatically in zone-redundant storage in regions where multiple zones are supported or in locally redundant storage in regions that do not support multiple zones yet. These backup files cannot be exported. You can use backups to restore your server to a point-in-time only. The default backup retention period is seven days. You can optionally configure the backup retention up to 35 days.

* **How are backups performed in a HA enabled servers?**
  
    Flexible server's data volumes are backed up using Managed disk incremental snapshots from the primary server. The WAL backup is performed from either the primary server or the standby server.

* **How can I validate backups are performed on my server?**

    The best way to validate availability of valid backups is performing periodic point in time restores and ensuring backups are valid and restorable. Backup operations or files are not exposed to the end users.

* **Where can I see the backup usage?**
  
    In the Azure portal, under Monitoring, click Metrics, you can find “Backup Usage metric” in which you can monitor the total backup usage.

* **What happens to my backups if I delete my server?**
  
    If you delete the server, all backups that belong to the server are also deleted and cannot be recovered. To protect server resources, post deployment, from accidental deletion or unexpected changes, administrators can leverage management locks.

* **How are backups retained for stopped servers?**

    No new backups are performed for stopped servers. All older backups (within the retention window) at the time of stopping the server are retained until the server is restarted post which backup retention for the active server is governed by it’s backup retention window.

* **How will I be charged and billed for my backups?**
  
    Flexible server provides up to 100% of your provisioned server storage as backup storage at no additional cost. Any additional backup storage used is charged in GB per month as per the pricing model. Backup storage billing is also governed by the backup retention period selected and backup redundancy option chosen apart from the transactional activity on the server which impacts the total backup storage used directly.

* **How will I be billed for a stopped server?**
  
    While your server instance is stopped, no new backups are performed. You are charged for provisioned storage and backup storage (backups stored within your specified retention window). Free backup storage is limited to the size of your provisioned database and any excess backup data will be charged using the backup price.

* **I configured my server with zone-redundant high availability. Do you take two backups and will I be charged twice?**
  
    No. Irrespective of HA or non-HA servers, only one set of backup copy is maintained and you will be charged only once.

### Restore related questions

* **How do I restore my server?**

    Azure supports Point In Time Restore (for all servers) allowing users to restore to latest or custom restore point using Azure portal, Azure CLI and API. 

    To restore your server from the backups taken manually using tools like pg_dump, you can first create a flexible server and restore your database(s) into the server using [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html).

* **Can I restore to another availability zone within the same region?**
  
    Yes. If the region supports multiple availability zones, the backup is stored on ZRS account and allows you to restore to another zone. 

* **How long it takes to do a point in time restore? Why is my restore taking so much time?**
  
    The data restore operation from snapshot does not depend of the size of data, however the recovery process timing which applies the logs (transaction activities to replay) could vary depending on the previous backup of the requested date/time and the amount of logs to process. This is applicable to both restoring within the same zone or to a different zone. 
 
* **If I restore my HA enabled server, do the restore server automatically configured with high availability?**
  
    No. The server is restored as a single instance flexible server. After the restore is complete, you can optionally configure the server with high availability.

* **I configured my server within a VNET. Can I restore to another VNET?**
  
    Yes. At the time of restore, choose a different VNET to restore.

* **Can I restore my public access server into a VNET or vice-versa?**

    No. We currently do not support restoring servers across public and private access.

* **How do I track my restore operation?**
  
    Currently there is no way to track the restore operation. You may monitor the activity log to see if the operation is in progress or complete.


## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
-   Learn [how to restore](./how-to-restore-server-portal.md)