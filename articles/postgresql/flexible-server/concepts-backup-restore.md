---
title: Backup and restore in Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of backup and restore with Azure Database for PostgreSQL - Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 06/16/2021
---

# Backup and restore in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Backups form an essential part of any business continuity strategy. They help protect data from accidental corruption or deletion. 

Azure Database for PostgreSQL - Flexible Server automatically performs regular backups of your server. You can then do a point-in-time recovery (PITR) within a retention period that you specify. The overall time to restore and recovery typically depends on the size of data and the amount of recovery to be performed. 

## Backup overview

Flexible Server takes snapshot backups of data files and stores them securely in zone-redundant storage or locally redundant storage, depending on the [region](overview.md#azure-regions). The server also backs up transaction logs when the write-ahead log (WAL) file is ready to be archived. You can use these backups to restore a server to any point in time within your configured backup retention period. 

The default backup retention period is 7 days, but you can extend the period to a maximum of 35 days. All backups are encrypted through AES 256-bit encryption for data stored at rest.

These backup files can't be exported or used to create servers outside Azure Database for PostgreSQL - Flexible Server. For that purpose, you can use the PostgreSQL tools pg_dump and pg_restore/psql.

## Backup frequency

Backups on flexible servers are snapshot based. The first snapshot backup is scheduled immediately after a server is created. Snapshot backups are currently taken once daily. **The first snapshot is a full backup and consecutive snapshots are differential backups.**

Transaction log backups happen at varied frequencies, depending on the workload and when the WAL file is filled and ready to be archived. In general, the delay (recovery point objective, or RPO) can be up to 15 minutes.

## Backup redundancy options

Flexible Server stores multiple copies of your backups to help protect your data from planned and unplanned events. These events can include transient hardware failures, network or power outages, and natural disasters. Backup redundancy helps ensure that your database meets its availability and durability targets, even if failures happen. 

Flexible Server offers three options: 

- **Zone-redundant backup storage**: This option is automatically chosen for regions that support availability zones. When the backups are stored in zone-redundant backup storage, multiple copies are not only stored within the availability zone in which your server is hosted, but also replicated to another availability zone in the same region. 

  This option provides backup data availability across availability zones and restricts replication of data to within a country/region to meet data residency requirements. This option provides at least 99.9999999999 percent (12 nines) durability of backup objects over a year.  

- **Locally redundant backup storage**: This option is automatically chosen for regions that don't support availability zones yet. When the backups are stored in locally redundant backup storage, multiple copies of backups are stored in the same datacenter. 

  This option helps protect your data against server rack and drive failures. It provides at least 99.999999999 percent (11 nines) durability of backup objects over a year. 
  
  By default, backup storage for servers with same-zone high availability (HA) or no high-availability configuration is set to locally redundant. 

- **Geo-redundant backup storage**: You can choose this option at the time of server creation. When the backups are stored in geo-redundant backup storage, in addition to three copies of data stored within the region where your server is hosted, the data is replicated to a geo-paired region. 

  This option provides the ability to restore your server in a different region in the event of a disaster. It also provides at least 99.99999999999999 percent (16 nines) durability of backup objects over a year. 
  
  Geo-redundancy is supported for servers hosted in any of the [Azure paired regions](../../availability-zones/cross-region-replication-azure.md). 

## Moving from other backup storage options to geo-redundant backup storage 

You can configure geo-redundant storage for backup only during server creation. After a server is provisioned, you can't change the backup storage redundancy option.  

### Backup retention

Backups are retained based on the retention period that you set for the server. You can select a retention period between 7 (default) and 35 days. You can set the retention period during server creation or change it at a later time. Backups are retained even for stopped servers.

The backup retention period governs how far back in time a PITR can be retrieved, because it's based on available backups. You can also treat the backup retention period as a recovery window from a restore perspective. 

All backups required to perform a PITR within the backup retention period are retained in the backup storage. For example, if the backup retention period is set to 7 days, the recovery window is the last 7 days. In this scenario, all the data and logs that are required to restore and recover the server in the last 7 days are retained. 

### Backup storage cost

Flexible Server provides up to 100 percent of your provisioned server storage as backup storage at no additional cost. Any additional backup storage that you use is charged in gigabytes per month. 

For example, if you have provisioned a server with 250 gibibytes (GiB) of storage, then you have 250 GiB of backup storage capacity at no additional charge. If the daily backup usage is 25 GiB, then you can have up to 10 days of free backup storage. Backup storage consumption that exceeds 250 GiB is charged as defined in the [pricing model](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/).

If you configured your server with geo-redundant backup, the backup data is also copied to the Azure paired region. So, your backup size will be two times the local backup copy. Billing is computed as *( (2 x local backup size) - provisioned storage size ) x price @ gigabytes per month*. 

You can use the [Backup Storage Used](../concepts-monitoring.md) metric in the Azure portal to monitor the backup storage that a server consumes. The Backup Storage Used metric represents the sum of storage consumed by all the retained database backups and log backups, based on the backup retention period set for the server. 

>[!Note]
> Irrespective of the database size, heavy transactional activity on the server generates more WAL files. The increase in files in turn increases the backup storage.

## Point-in-time recovery

In Flexible Server, performing a PITR creates a new server in the same region as your source server, but you can choose the availability zone. It's created with the source server's configuration for the pricing tier, compute generation, number of virtual cores, storage size, backup retention period, and backup redundancy option. Also, tags and settings such as virtual networks and firewall settings are inherited from the source server.

The physical database files are first restored from the snapshot backups to the server's data location. The appropriate backup that was taken earlier than the desired point in time is automatically chosen and restored. A recovery process then starts by using WAL files to bring the database to a consistent state. 

For example, assume that the backups are performed at 11:00 PM every night. If the restore point is for August 15 at 10:00 AM, the daily backup of August 14 is restored. The database will be recovered until 10:00 AM of August 15 by using the transaction log backup from August 14, 11:00 PM, to August 15, 10:00 AM. 

To restore your database server, see [these steps](./how-to-restore-server-portal.md).

> [!IMPORTANT]
> A restore operation in Flexible Server always creates a new database server with the name that you provide. It doesn't overwrite the existing database server.

PITR is useful in scenarios like these:

- A user accidentally deletes data, a table, or a database.
- An application accidentally overwrites good data with bad data because of an application defect. 
- You want to clone your server for test, development, or for data verification.

With continuous backup of transaction logs, you'll be able to restore to the last transaction. You can choose between the following restore options:

-   **Latest restore point (now)**: This is the default option. It allows you to restore the server to the latest point in time. 

-   **Custom restore point**: This option allows you to choose any point in time within the retention period defined for this flexible server. By default, the latest time in UTC is automatically selected. Automatic selection is useful if you want to restore to the last committed transaction for test purposes. You can optionally choose other days and times. 

-   **Fast restore point**: This option allows users to restore the server in the fastest time possible within the retention period defined for their flexible server. Fastest restore is possible by directly choosing the timestamp from the list of backups. This restore operation provisions a server and simply restores the full snapshot backup and doesn't require any recovery of logs which makes it fast. We recommend you select a backup timestamp which is greater than the earliest restore point in time for a successful restore operation.

For latest and custom restore point options, the estimated time to recover depends on several factors, including the volume of transaction logs to process after the previous backup time, and the total number of databases recovering in the same region at the same time. The overall recovery time usually takes from few minutes up to a few hours.

If you've configured your server within a virtual network, you can restore to the same virtual network or to a different virtual network. However, you can't restore to public access. Similarly, if you configured your server with public access, you can't restore to private virtual network access.

> [!IMPORTANT]
> Deleted servers can be restored. If you delete the server, you can follow our guidance [Restore a dropped Azure Database for PostgreSQL Flexible server](how-to-restore-dropped-server.md) to recover. Use Azure resource lock to help prevent accidental deletion of your server.


## Geo-redundant backup and restore

To enable geo-redundant backup from the **Compute + storage** pane in the Azure portal, see the [quickstart guide](./quickstart-create-server-portal.md). 

>[!IMPORTANT]
> Geo-redundant backup can be configured only at the time of server creation. 

After you've configured your server with geo-redundant backup, you can restore it to a [geo-paired region](../../availability-zones/cross-region-replication-azure.md). For more information, see the [supported regions](overview.md#azure-regions) for geo-redundant backup.

When the server is configured with geo-redundant backup, the backup data and transaction logs are copied to the paired region asynchronously through storage replication. After you create a server, wait at least one hour before initiating a geo-restore. That will allow the first set of backup data to be replicated to the paired region. 

Subsequently, the transaction logs and the daily backups are asynchronously copied to the paired region. There might be up to one hour of delay in data transmission. So, you can expect up to one hour of RPO when you restore. You can restore only to the last available backup data that's available at the paired region. Currently, PITR of geo-redundant backups is not available.

The estimated time to recover the server (recovery time objective, or RTO) depends on factors like the size of the database, the last database backup time, and the amount of WAL to process until the last received backup data. The overall recovery time usually takes from a few minutes up to a few hours.

During the geo-restore, the server configurations that can be changed include virtual network settings and the ability to remove geo-redundant backup from the restored server. Changing other server configurations--such as compute, storage, or pricing tier (Burstable, General Purpose, or Memory Optimized)--during geo-restore is not supported.

For more information about performing a geo-restore, see the [how-to guide](how-to-restore-server-portal.md#perform-geo-restore).

> [!IMPORTANT]
> When the primary region is down, you can't create geo-redundant servers in the respective geo-paired region, because storage can't be provisioned in the primary region. Before you can provision geo-redundant servers in the geo-paired region, you must wait for the primary region to be up. 
>
> With the primary region down, you can still geo-restore the source server to the geo-paired region. For more information about performing a geo-restore, see the [how-to guide](how-to-restore-server-portal.md#perform-geo-restore).  

## Restore and networking

### Point-in-time recovery

If your source server is configured with a *public access* network, you can only restore to public access. 

If your source server is configured with a *private access* virtual network, you can restore either to the same virtual network or to a different virtual network. You can't perform PITR across public and private access.

### Geo-restore

If your source server is configured with a *public access* network, you can only restore to public access. Also, you have to apply firewall rules after the restore operation is complete. 

If your source server is configured with a *private access* virtual network, you can only restore to a different virtual network, because virtual networks can't span regions. You can't perform geo-restore across public and private access.

## Post-restore tasks

After you restore the database, you can perform the following tasks to get your users and applications back up and running:

- If the new server is meant to replace the original server, redirect clients and client applications to the new server. Change the server name of your connection string to point to the new server.

- Ensure that appropriate server-level firewall and virtual network rules are in place for user connections. These rules are not copied over from the original server.
  
- Scale up or scale down the restored server's compute as needed.

- Ensure that appropriate logins and database-level permissions are in place.

- Configure alerts as appropriate.
  
- If you restored the database configured with high availability, and if you want to configure the restored server with high availability, you can then follow [the steps](./how-to-manage-high-availability-portal.md).

## Frequently asked questions

### Backup-related questions

* **How does Azure handle backup of my server?**
 
    By default, Azure Database for PostgreSQL enables automated backups of your entire server (encompassing all databases created) with a default retention period of 7 days. The automated backups include a daily incremental snapshot of the database. The log (WAL) files are archived to Azure Blob Storage continuously.

* **Can I configure automated backups to retain data for the long term?**
  
    No. Currently, Flexible Server supports a maximum of 35 days of retention. You can use manual backups for a long-term retention requirement.

* **How do I manually back up my PostgreSQL servers?**
  
    You can manually take a backup by using the PostgreSQL tool [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html). For examples, see [Migrate your PostgreSQL database by using dump and restore](../howto-migrate-using-dump-and-restore.md). 
    
    If you want to back up Azure Database for PostgreSQL to Blob Storage, see [Back up Azure Database for PostgreSQL to Blob Storage](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/backup-azure-database-for-postgresql-to-a-blob-storage/ba-p/803343) on our tech community blog. 

* **What are the backup windows for my server? Can I customize them?**
  
    Azure manages backup windows, and you can't customize them. The first full snapshot backup is scheduled immediately after a server is created. Subsequent snapshot backups are incremental and occur once a day.

* **Are my backups encrypted?**
  
    Yes. All Azure Database for PostgreSQL data, backups, and temporary files that are created during query execution are encrypted through AES 256-bit encryption. Storage encryption is always on and can't be disabled. 

* **Can I restore a single database or a few databases in a server?**
  
    Restoring a single database or a few databases or tables is not directly supported. However, you can restore the entire server to a new server, and then extract tables or databases and import them to the new server.

* **Is my server available while a backup is in progress?**

    Yes. Backups are online operations that use snapshots. The snapshot operation takes only a few seconds and doesn't interfere with production workloads, to help ensure high availability of the server. 

* **When I'm setting up the maintenance window for the server, do I need to account for the backup window?**
  
    No. Backups are triggered internally as part of the managed service and have no bearing on the maintenance window.

* **Where are my automated backups stored, and how do I manage their retention?**
  
    Azure Database for PostgreSQL automatically creates server backups and stores them in:
    
    - Zone-redundant storage, in regions where multiple zones are supported.
    - Locally redundant storage, in regions that don't support multiple zones yet. 
    - The paired region, if you've configured geo-redundant backup.
    
    These backup files can't be exported. 
    
    You can use backups to restore your server to a point in time only. The default backup retention period is 7 days. You can optionally configure the backup retention up to 35 days. 

* **With geo-redundant backup, how often is the backup copied to the paired region?**  

    When the server is configured with geo-redundant backup, the backup data is stored in a geo-redundant storage account. The storage account copies data files to the paired region when the daily backup occurs at the primary server. WAL files are backed up when they're ready to be archived. 
    
    Backup data is asynchronously copied in a continuous manner to the paired region. You can expect up to one hour of delay in receiving backup data.

* **Can I do PITR at the remote region?**
  
    No. The data is recovered to the last available backup data at the remote region.

* **How are backups performed in a HA-enabled servers?**
  
    Data volumes in Flexible Server are backed up through managed disk incremental snapshots from the primary server. The WAL backup is performed from either the primary server or the standby server.

* **How can I validate that backups are performed on my server?**

    The best way to check backups is to perform periodic PITR and ensure that backups are valid and restorable. Backup operations or files are not exposed to end users.

* **Where can I see the backup usage?**
  
    In the Azure portal, under **Monitoring**, select **Metrics**. In **Backup usage metric**, you can monitor the total backup usage.

* **What happens to my backups if I delete my server?**
  
    If you delete a server, all backups that belong to the server are also deleted and can't be recovered. To help protect server resources from accidental deletion or unexpected changes after deployment, administrators can use management locks.

* **How are backups retained for stopped servers?**

    No new backups are performed for stopped servers. All older backups (within the retention window) at the time of stopping the server are retained until the server is restarted. After that, backup retention for the active server is governed by its retention window.

* **How will I be charged and billed for my backups?**
  
    Flexible Server provides up to 100 percent of your provisioned server storage as backup storage at no additional cost. Any additional backup storage that you use is charged in gigabytes per month, as defined in the pricing model. 
    
    The backup retention period and backup redundancy option that you select, along with transactional activity on the server, directly affect the total backup storage and billing.

* **How will I be billed for a stopped server?**
  
    While your server instance is stopped, no new backups are performed. You're charged for provisioned storage and backup storage (backups stored within your specified retention window). 
    
    Free backup storage is limited to the size of your provisioned database. Any excess backup data will be charged according to the backup price.

* **I configured my server with zone-redundant high availability. Do you take two backups, and will I be charged twice?**
  
    No. Irrespective of HA or non-HA servers, only one set of backup copies is maintained. You'll be charged only once.

### Restore-related questions

* **How do I restore my server?**

    Azure supports PITR for all servers. Users can restore to the latest restore point or a custom restore point by using the Azure portal, the Azure CLI, and the API. 

    To restore your server from manual backups by using tools like pg_dump, you can first create a flexible server and then restore your databases to the server by using [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html).

* **Can I restore to another availability zone within the same region?**
  
    Yes. If the region supports multiple availability zones, the backup is stored on a zone-redundant storage account so that you can restore to another zone. 

* **How long does a PITR take? Why is my restore taking so much time?**
  
    The data restore operation from a snapshot doesn't depend on the size of data. But the recovery process timing that applies the logs (transaction activities to replay) might vary, depending on the previous backup of the requested date/time and the number of logs to process. This applies to both restoring within the same zone or and restoring data to a different zone. 
 
* **If I restore my HA-enabled server, is the restore server automatically configured with high availability?**
  
    No. The server is restored as a single-instance flexible server. After the restore is complete, you can optionally configure the server with high availability.

* **I configured my server within a virtual network. Can I restore to another virtual network?**
  
    Yes. At the time of restore, choose a different virtual network to restore to.

* **Can I restore my public access server to a virtual network or vice versa?**

    No. Flexible Server currently doesn't support restoring servers across public and private access.

* **How do I track my restore operation?**
  
    Currently, there's no way to track the restore operation. You can monitor the activity log to see if the operation is in progress or complete.


## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md).
-   Learn about [zone-redundant high availability](./concepts-high-availability.md).
-   Learn [how to restore](./how-to-restore-server-portal.md).
