---
title: Backup and restore in Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of backup and restore with Azure Database for PostgreSQL - Flexible Server.
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 11/30/2021
---

# Backup and restore in Azure Database for PostgreSQL - Flexible Server

Backups form an essential part of any business continuity strategy. They help protect data from accidental corruption or deletion. 

Azure Database for PostgreSQL - Flexible Server automatically performs regular backups of your server. You can then do a point-in-time recovery within the retention period where you can specify the date and time to which you want to restore. The overall time to restore and recovery typically depends on the size of data and amount of recovery to be performed. 

## Backup overview

Flexible Server takes snapshot backups of the data files and stores them securely in zone-redundant storage or locally redundant storage, depending on the [region](overview.md#azure-regions). The server also backs up transaction logs when the write-ahead log (WAL) file is ready to be archived. You can use these backups to restore a server to any point in time within your configured backup retention period. 

The default backup retention period is 7 days, but you can extend the period to up to 35 days. All backups are encrypted through AES 256-bit encryption for data stored at rest.

These backup files can't be exported or used to create servers outside Azure Database for PostgreSQL - Flexible Server. For that purpose, you can use the PostgreSQL tools pg_dump and pg_restore/psql.

## Backup frequency

Backups on flexible servers are snapshot-based. The first snapshot backup is scheduled immediately after a server is created. Snapshot backups are currently taken once daily. 

Transaction log backups occur at a varied frequencies, depending on the workload and when the WAL file is filled and ready to be archived. In general, the delay (recovery point objective, or RPO) can be up to 15 minutes.

## Backup redundancy options

Azure Database for PostgreSQL stores multiple copies of your backups so that your data is protected from planned and unplanned events. Events can include transient hardware failures, network or power outages, and natural disasters. Backup redundancy helps ensure that your database meets its availability and durability targets, even if failures happen. 

Azure Database for PostgreSQL offers three options: 

- **Zone-redundant backup storage**: This option is automatically chosen for regions that support availability zones. When the backups are stored in zone-redundant backup storage, multiple copies are not only stored within the availability zone in which your server is hosted, but also replicated to another availability zone in the same region. 

  You can use this option for scenarios that require high availability or for restricting replication of data to within a country/region to meet data residency requirements. Also, this option provides at least 99.9999999999% (12 nines) durability of backup objects over a year.  

- **Locally redundant backup storage**: This option is automatically chosen for regions that don't support availability zones yet. When the backups are stored in locally redundant backup storage, multiple copies of backups are stored in the same datacenter. 

  This option helps protect your data against server rack and drive failures. It provides at least 99.999999999% (11 nines) durability of backup objects over a year. 
  
  By default, backup storage for servers with same-zone high availability (HA) or no high-availability configuration is set to locally redundant. 

- **Geo-redundant backup storage (preview)**: You can choose this option at the time of server creation. When the backups are stored in geo-redundant backup storage, in addition to three copies of data stored within the region in which your server is hosted, the data is replicated to its geo-paired region. 

  This option provides the ability to restore your server in a different region in the event of a disaster. It also provides at least 99.99999999999999% (16 nines) durability of backup objects over a year. 
  
  Geo redundancy is supported for servers hosted in any of the [Azure paired regions](../../availability-zones/cross-region-replication-azure.md). 

## Moving from other backup storage options to geo-redundant backup storage 

You can configure geo-redundant storage for backup only during server creation. After a server is provisioned, you can't change the backup storage redundancy option.  

### Backup retention

Backups are retained based on the retention period that you set for the server. You can select a retention period between 7 (default) and 35 days. You can set the retention period during server creation or change it at a later time. Backups are retained even for stopped servers.

The backup retention period governs how far back in time a point-in-time restore can be retrieved, because it's based on available backups. You can also treat the backup retention period as a recovery window from a restore perspective. 

All backups required to perform a point-in-time restore within the backup retention period are retained in the backup storage. For example, if the backup retention period is set to seven days, the recovery window is the last seven days. In this scenario, all the data and logs required to restore and recover the server in last seven days are retained. 

### Backup storage cost

Flexible Server provides up to 100 percent of your provisioned server storage as backup storage at no additional cost. Any additional backup storage used is charged in gigabytes per month. 

For example, if you have provisioned a server with 250 GiB of storage, then you have 250 GiB of backup storage capacity at no additional charge. If the daily backup usage is 25 GiB, then you can have up to 10 days of free backup storage. Backup storage consumption that exceeds 250 GiB is charged as defined in the [pricing model](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/).

If you configured your server with geo-redundant backup, the backup data is also copied to the Azure paired region. So, your backup size will be two times the local backup copy. Billing is computed as *( (2 x local backup size) - provisioned storage size ) x price @ gigabytes per month*. 

You can use the [Backup Storage Used](../concepts-monitoring.md) metric in the Azure portal to monitor the backup storage that a server consumes. The Backup Storage Used metric represents the sum of storage consumed by all the retained database backups and log backups, based on the backup retention period set for the server. 

>[!Note]
> Irrespective of the database size, heavy transactional activity on the server generates more WAL files, which in turn increases the backup storage.

The primary means of controlling the backup storage cost is by setting the appropriate backup retention period and choosing the right backup redundancy options to meet your desired recovery goals.

## Point-in-time restore

In Flexible Server, performing a point-in-time restore creates a new server in the same region as your source server, but you can choose the availability zone. It's created with the source server's configuration for the pricing tier, compute generation, number of virtual cores, storage size, backup retention period, and backup redundancy option. Also, tags and settings such as virtual networks and firewall settings are inherited from the source server.

The physical database files are first restored from the snapshot backups to the server's data location. The appropriate backup that was taken earlier than the desired point in time is automatically chosen and restored. A recovery process then starts by using WAL files to bring the database to a consistent state. 

For example, assume that the backups are performed at 11:00 PM every night. If the restore point is for August 15 at 10:00 AM, the daily backup of August 14 is restored. The database will be recovered until 10:00 AM of August 15 by using the transaction log backup from August 14, 11:00 PM, to August 15, 10:00 AM. 

To restore your database server, see [Point-in-time restore of a flexible server](./how-to-restore-server-portal.md).

> [!IMPORTANT]
> A restore operation in Flexible Server always creates a new database server with the name that you provide. It doesn't overwrite the existing database server.

Point-in-time restore is useful in multiple scenarios. For example:

- A user accidentally deletes data
- A user drops an important table or database
- An application accidentally overwrites good data with bad data due to an application defect. 

Because of continuous backup of transaction logs, you'll be able to restore to the last transaction. You can choose between two restore options:

-   **Latest restore point (now)**: This is the default option. It allows you to restore the server to the latest point in time. 

-   **Custom restore point**: This option allows you to choose any point in time within the retention period defined for this flexible server. By default, the latest time in UTC is automatically selected. Automatic selection is useful if you want to restore to the last committed transaction for test purposes. You can optionally choose other days and times. 

The estimated time to recover depends on several factors, including the volume of transaction logs to process after the previous backup time, and the total number of databases recovering in the same region at the same time. The overall recovery time usually takes from few minutes up to few hours.

If you have configured your server within a virtual network, you can restore to the same virtual network or to a different virtual network. However, you can't restore to public access. Similarly, if you configured your server with public access, you can't restore to private virtual network access.

> [!IMPORTANT]
> A user can't restore deleted servers. If you delete a server, all databases that belong to the server are also deleted and can't be recovered. To protect server resources, after deployment, from accidental deletion or unexpected changes, administrators can use [management locks](../../azure-resource-manager/management/lock-resources.md). 
>
>If you accidentally deleted your server, please reach out to support. In some cases, your server might be restored with or without data loss.

## Geo-redundant backup and restore (preview)

To enable geo-redundant backup from the **Compute + storage** pane in the Azure portal, see the [quickstart guide](./quickstart-create-server-portal.md). 

>[!IMPORTANT]
> Geo-redundant backup can only be configured at the time of server creation. 

After you've configured your server with geo-redundant backup, you can restore it to a [geo-paired region](../../availability-zones/cross-region-replication-azure.md). For more information, see the [supported regions](overview.md#azure-regions) for geo-redundant backup.

When the server is configured with geo-redundant backup, the backup data and transaction logs are copied to the paired region asynchronously through storage replication. After you create a server, wait at least one hour before initiating a geo-restore. That will allow the first set of backup data to be replicated to the paired region. 

Subsequently, the transaction logs and the daily backups are asynchronously copied to the paired region. There might be up to one hour of delay in data transmission. So, you can expect up to one hour of RPO when you restore. You can restore only to the last available backup data that's available at the paired region. Currently, point-in-time restore of geo-backup is not available.

The estimated time to recover the server (recovery time objective, or RTO) depends on factors that include the size of the database, the last database backup time, and the amount of WAL to process until the last received backup data. The overall recovery time usually takes from a few minutes up to a few hours.

During the geo-restore, the server configurations that can be changed include virtual network settings and the ability to remove geo-redundant backup from the restored server. Changing other server configurations--such as compute, storage, or pricing tier (Burstable, General Purpose, or Memory Optimized)--during geo-restore is not supported.

For more information about performing a geo-restore, see the [how-to guide](how-to-restore-server-portal.md#performing-geo-restore-preview).

> [!IMPORTANT]
> When the primary region is down, you can't create geo-redundant servers in the respective geo-paired region, because storage can't be provisioned in the primary region. Before you can provision geo-redundant servers in the geo-paired region, you must wait for the primary region to be up. 
>
> With the primary region down, you can still geo-restore the source server to the geo-paired region. Disable the geo-redundancy option in the **Compute + Storage** > **Configure Server** settings in the portal, and restore as a locally redundant server to ensure business continuity.  

## Restore and networking

### Point-in-time restore

If your source server is configured with a *public access* network, you can only restore to public access. 

If your source server is configured with a *private access* network, you can restore either in the same virtual network or to a different virtual network. You can't perform point-in-time restore across public and private access.

### Geo-restore

If your source server is configured with a *public access* network, you can only restore to public access. Also, you have to apply firewall rules after the restore operation is complete. 

If your source server is configured with a *private access* virtual network, you can only restore to a different virtual network, because virtual networks can't span regions. You can't perform geo-restore across public and private access.

## Post-restore tasks

After you restore the database, you can perform the following tasks to get your users and applications back up and running:

- If the new server is meant to replace the original server, redirect clients and client applications to the new server. Change the server name of your connection string to point to the new restored server.

- Ensure that appropriate server-level firewall and virtual network rules are in place for users to connect. These rules are not copied over from the original server.
  
- Scale up or scale down the restored server's compute as needed.

- Ensure that appropriate logins and database-level permissions are in place.

- Configure alerts as appropriate.
  
- If you restored the database configured with high availability, and if you want to configure the restored server with high availability, you can then follow [the steps](./how-to-manage-high-availability-portal.md).

## Frequently asked questions

### Backup-related questions

* **How does Azure handle backup of my server?**
 
    By default, Azure Database for PostgreSQL enables automated backups of your entire server (encompassing all databases created) with a default 7 days of retention period. A daily incremental snapshot of the database is performed. The logs (WAL) files are archived to Azure BLOB continuously.

* **Can I configure these automatic backup to be retained for the long term?**
  
    No. Currently we only support a maximum of 35 days of retention. You can do manual backups and use that for long-term retention requirement.

* **How do I do manual backup of my Postgres servers?**
  
    You can manually take a backup is by using PostgreSQL tool pg_dump as documented [here](https://www.postgresql.org/docs/current/app-pgdump.html). For examples, you can refer to this [upgrade/migration documentation](../howto-migrate-using-dump-and-restore.md) that you can use for backups as well. 
    
    If you want to back up Azure Database for PostgreSQL to Blob Storage, refer to our tech community blog [Backup Azure Database for PostgreSQL to Blob Storage](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/backup-azure-database-for-postgresql-to-a-blob-storage/ba-p/803343). 

* **What are the backup windows for my server? Can I customize them?**
  
    Backup windows are inherently managed by Azure and cannot be customized. The first full snapshot backup is scheduled immediately after a server is created. Subsequent snapshot backups are incremental backups that occur once a day.

* **Are my backups encrypted?**
  
    Yes. All Azure Database for PostgreSQL data, backups and temporary files that are created during query execution are encrypted using AES 256-bit encryption. The storage encryption is always on and cannot be disabled. 

* **Can I restore a single database or a few databases in a server?**
  
    Restoring a single/few database(s) or tables is not directly supported. However, you need to restore the entire server to a new server and then extract the table(s) or database(s) needed and import them to your server.

* **Is my server available while the backup is in progress?**

    Yes. Backups are online operations using snapshots. The snapshot operation only takes few seconds and doesn’t interfere with production workloads ensuring high availability of the server. 

* **When I'm setting up the maintenance window for the server, do I need to account for the backup window?**
  
    No. Backups are triggered internally as part of the managed service and have no bearing to  the Managed Maintenance Window.

* **Where are my automated backups stored, and how do I manage their retention?**
  
    Azure Database for PostgreSQL automatically creates server backups and stores them in zone-redundant storage in regions where multiple zones are supported or in locally redundant storage in regions that do not support multiple zones yet. These backup files cannot be exported. 
    
    You can use backups to restore your server to a point-in-time only. The default backup retention period is seven days. You can optionally configure the backup retention up to 35 days. If you configured with geo-redundant backup, the backup is also copied to the paired region.

* **With geo-redundant backup, how frequently the backup is copied to the paired region?**  

    When the server is configured with geo-redundant backup, the backup data is stored on geo-redundant storage account which performs the copy of data to the paired region. Data files are copied to the paired region as and when the daily backup occurs at the primary server. WAL files are backed up as and when the WAL files are ready to be archived. 
    
    These backup data are asynchronously copied in a continuous manner to the paired region. You can expect up to 1 hr of delay in receiving backup data.

* **Can I do PITR at the remote region?**
  
    No. The data is recovered to the last available backup data at the remote region.

* **How are backups performed in a HA enabled servers?**
  
    Data volumes in Flexible Server are backed up using Managed disk incremental snapshots from the primary server. The WAL backup is performed from either the primary server or the standby server.

* **How can I validate backups are performed on my server?**

    The best way to validate availability of valid backups is performing periodic point in time restores and ensuring backups are valid and restorable. Backup operations or files are not exposed to the end users.

* **Where can I see the backup usage?**
  
    In the Azure portal, under Monitoring, click Metrics, you can find “Backup Usage metric” in which you can monitor the total backup usage.

* **What happens to my backups if I delete my server?**
  
    If you delete the server, all backups that belong to the server are also deleted and cannot be recovered. To protect server resources, post deployment, from accidental deletion or unexpected changes, administrators can leverage management locks.

* **How are backups retained for stopped servers?**

    No new backups are performed for stopped servers. All older backups (within the retention window) at the time of stopping the server are retained until the server is restarted post which backup retention for the active server is governed by it’s backup retention window.

* **How will I be charged and billed for my backups?**
  
    Flexible Server provides up to 100 percent of your provisioned server storage as backup storage at no additional cost. Any additional backup storage used is charged in gigabytes per month, as defined in the pricing model. Backup storage billing is also governed by the backup retention period selected and backup redundancy option chosen apart from the transactional activity on the server which impacts the total backup storage used directly.

* **How will I be billed for a stopped server?**
  
    While your server instance is stopped, no new backups are performed. You are charged for provisioned storage and backup storage (backups stored within your specified retention window). Free backup storage is limited to the size of your provisioned database and any excess backup data will be charged using the backup price.

* **I configured my server with zone-redundant high availability. Do you take two backups and will I be charged twice?**
  
    No. Irrespective of HA or non-HA servers, only one set of backup copy is maintained and you will be charged only once.

### Restore-related questions

* **How do I restore my server?**

    Azure supports Point In Time Restore (for all servers) allowing users to restore to latest or custom restore point using Azure portal, Azure CLI and API. 

    To restore your server from the backups taken manually using tools like pg_dump, you can first create a flexible server and restore your database(s) into the server using [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html).

* **Can I restore to another availability zone within the same region?**
  
    Yes. If the region supports multiple availability zones, the backup is stored on ZRS account and allows you to restore to another zone. 

* **How long it takes to do a point in time restore? Why is my restore taking so much time?**
  
    The data restore operation from snapshot does not depend of the size of data, however the recovery process timing which applies the logs (transaction activities to replay) could vary depending on the previous backup of the requested date/time and the amount of logs to process. This is applicable to both restoring within the same zone or to a different zone. 
 
* **If I restore my HA enabled server, is the restore server automatically configured with high availability?**
  
    No. The server is restored as a single-instance flexible server. After the restore is complete, you can optionally configure the server with high availability.

* **I configured my server within a virtual network. Can I restore to another virtual network?**
  
    Yes. At the time of restore, choose a different virtual network to restore.

* **Can I restore my public access server into a virtual network or vice-versa?**

    No. We currently do not support restoring servers across public and private access.

* **How do I track my restore operation?**
  
    Currently there is no way to track the restore operation. You may monitor the activity log to see if the operation is in progress or complete.


## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
-   Learn [how to restore](./how-to-restore-server-portal.md)
