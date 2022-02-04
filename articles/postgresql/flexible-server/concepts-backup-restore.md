---
title: Backup and restore in Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of backup and restore with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 11/30/2021
---

# Backup and restore in Azure Database for PostgreSQL - Flexible Server



Backups form an essential part of any business continuity strategy. They help with protecting data from accidental corruption or deletion. Azure Database for PostgreSQL - Flexible Server automatically performs regular backup of your server.  You can then do a point-in-time recovery within the retention period where you can specify the date and time to which you want to restore to. The overall time to restore and recovery typically depends on the size of data and amount of recovery to be performed. 

## Backup overview

Flexible Server takes snapshot backups of the data files and stores them securely in zone-redundant storage or locally redundant storage depending on the [region](overview.md#azure-regions). The server also performs transaction logs backup as and when the WAL file is ready to be archived. These backups allow you to restore a server to any point-in-time within your configured backup retention period. The default backup retention period is seven days and can be stored up to 35 days. All backups are encrypted using AES 256-bit encryption for the data stored at rest.

These backup files cannot be exported or used to create servers outside of Azure Database for PostgreSQL - Flexible Server. For that purpose, you can use PostgreSQL tools pg_dump and pg_restore/psql.

## Backup frequency

Backups on flexible servers are snapshot-based. The first snapshot backup is scheduled immediately after a server is created. Snapshot backups are currently taken daily once. Transaction log backups occur at a varied frequency depending on the workload and when the WAL file is filled to be archived. In general, the delay (RPO) may be up to 15 minutes.

## Backup redundancy options

Azure Database for PostgreSQL stores multiple copies of your backups so that your data is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Azure Database for PostgreSQL provides the flexibility to choose between a local backup copy within a region or a geo-redundant backup (Preview). By default, Azure Database for PostgreSQL server backup uses zone redundant storage if available in the region. If not, it uses locally redundant storage. In addition, customers can choose geo-redundant backup, which is in preview, for Disaster Recovery at the time of server create. Refer to the list of regions where the geo-redundant backups are supported. 

Backup redundancy ensures that your database meets its availability and durability targets even in the case of failures and Azure Database for PostgreSQL extends three options to users - 

- **Zone-redundant backup storage** : This is automatically chosen for regions that support Availability zones. When the backups are stored in zone-redundant backup storage, multiple copies are not only stored within the availability zone in which your server is hosted, but are also replicated to another availability zone in the same region. This option can be leveraged for scenarios that require high availability or for restricting replication of data to within a country/region to meet data residency requirements. Also this provides at least 99.9999999999% (12 9's) durability of Backups objects over a given year.  

- **Locally redundant backup storage** : This is automatically chosen for regions that do not support Availability zones yet. When the backups are stored in locally redundant backup storage, multiple copies of backups are stored in the same datacenter. This option protects your data against server rack and drive failures. Also this provides at least 99.999999999% (11 9's) durability of Backups objects over a given year. By default backup storage for servers with same-zone high availability (HA) or no high availability configuration is set to locally redundant. 

- **Geo-Redundant backup storage (Preview)** : You can choose this option at the time of server creation. When the backups are stored in geo-redundant backup storage, in addition to three copies of data stored within the region in which your server is hosted, but are also replicated to it's geo-paired region. This provides better protection and ability to restore your server in a different region in the event of a disaster. Also this provides at least 99.99999999999999% (16 9's) durability of Backups objects over a given year. One can enable Geo-Redundancy option at server create time to ensure geo-redundant backup storage. Geo redundancy is supported for servers hosted in any of the [Azure paired regions](../../availability-zones/cross-region-replication-azure.md). 

> [!NOTE]
> Geo-redundancy backup option can be configured at the time of server creates only.

## Moving from other backup storage options to geo-redundant backup storage 

Configuring geo-redundant storage for backup is only allowed during server create. Once the server is provisioned, you cannot change the backup storage redundancy option.  

### Backup retention

Backups are retained based on the backup retention period setting for the server. You can select a retention period between 7 and 35 days. The default retention period is seven days. You can set the retention period during server creation or you can change it at a later time. Backups are retained even for stopped servers.

The backup retention period governs how far back in time a point-in-time restore can be retrieved, since it is based on backups available. The backup retention period can also be treated as a recovery window from a restore perspective. All backups required to perform a point-in-time restore within the backup retention period are retained in the backup storage. For example - if the backup retention period is set to seven days, the recovery window is considered as last seven days. In this scenario, all the data and logs required to restore and recover the server in last seven days are retained. 

### Backup storage cost

Flexible server provides up to 100% of your provisioned server storage as backup storage at no additional cost. Any additional backup storage used is charged in GB per month. For example, if you have provisioned a server with 250 GiB of storage, then you have 250 GiB of backup storage capacity at no additional charge. If the daily backup usage is 25 GiB, then you can have up to 10 days of free backup storage. Backup storage consumption exceeding 250 GiB is charged as per the [pricing model](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/).

If you configured your server with geo-redundant backup, then the backup data is also copied to the Azure paired region. Hence, your backup size will be two times the local backup copy. Billing is computed as ( (2 x local backup size) - provisioned storage size ) x Price @ GB/month. 

You can use the [Backup storage used](../concepts-monitoring.md) metric in the Azure portal to monitor the backup storage consumed by a server. The Backup Storage used metric represents the sum of storage consumed by all the database backups and log backups retained based on the backup retention period set for the server. 

>[!Note]
> Irrespective of the database size, heavy transactional activity on the server generates more WAL files which in turn increases the backup storage.

The primary means of controlling the backup storage cost is by setting the appropriate backup retention period and choosing the right backup redundancy options to meet your desired recovery goals.

## Point-in-time restore overview

In Flexible server, performing a point-in-time restore creates a new server in the same region as your source server, but you can choose the availability zone. It is created with the source server's configuration for the pricing tier, compute generation, number of vCores, storage size, backup retention period, and backup redundancy option. Also, tags and settings such as VNET and firewall settings are inherited from the source server.

 ### Point-in-time restore

The physical database files are first restored from the snapshot backups to the server's data location. The appropriate backup that was taken earlier than the desired point-in-time is automatically chosen and restored. A recovery process is then initiated using WAL files to bring the database to a consistent state. 

 For example, let us assume the backups are performed at 11pm every night. If the restore point is for August 15, 2020 at 10:00 am, the daily backup of August 14, 2020 is restored. The database will be recovered until 10am of August 15, 2020 using the transaction logs backup from August 14, 11pm to August 15, 10am. 

 Please see [these steps](./how-to-restore-server-portal.md) to restore your database server.

> [!IMPORTANT]
> Restore operations in flexible server always creates a new database server with the name you provide and does not overwrite the existing database server.

Point-in-time restore is useful in multiple scenarios. For example, when a user accidentally deletes data, drops an important table or database, or if an application accidentally overwrites good data with bad data due to an application defect. You will be able to restore to the last transaction due to continuous backup of transaction logs.

You can choose between a latest restore point and a custom restore point.

-   **Latest restore point (now)**: This is the default option which allows you to restore the server to the latest point-in-time. 

-   **Custom restore point**: This option allows you to choose any point-in-time within the retention period defined for this flexible server. By default, the latest time in UTC is auto-selected, and useful if you want to restore to the last committed transaction for your test purposes. You can optionally choose other days and time. 

The estimated time to recover depends on several factors including the volume of transaction logs to process post the previous backup time, and the total number of databases recovering in the same region at the same time. The overall recovery time usually takes from few minutes up to few hours.

If you have configured your server within a VNET, you can restore to the same VNET or to a different VNET. However, you cannot restore to a public access. Similarly, if you configured your server with public access, you cannot restore to a private VNET access.

> [!IMPORTANT]
> Deleted servers **cannot** be restored by the user. If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. To protect server resources, post deployment, from accidental deletion or unexpected changes, administrators can leverage [management locks](../../azure-resource-manager/management/lock-resources.md). If you accidentally deleted your server, please reach out to support. In some cases, your server may be restored with or without data loss.

## Geo-redundant backup and restore (Preview)

You can configure geo-redundant backup at the time of server creation. Refer to this [quick start guide](./quickstart-create-server-portal.md) on how to enable Geo-redundant backup from Compute+Storage blade. 

>[!IMPORTANT]
> Geo-redundant backup can only be configured at the time of server creation. 

Once you have configured your server with geo-redundant backup, you can restore it to a [geo-paired region](../../availability-zones/cross-region-replication-azure.md). Please refer to the geo-redundant backup supported [regions](overview.md#azure-regions).

When the server is configured with geo-redundant backup, the backup data is copied to the paired region asynchronously using storage replication. This includes copying of data backup and also transaction logs. After the server creation, please wait at least for one hour before initiating a geo-restore. That will allow the first set of backup data to be replicated to the paired region. Subsequently, the transaction logs and the daily backups are asynchronously copied to the paired region and there could be up to one hour of delay in data transmission. Hence, you can expect up to one hour of RPO when you restore. You can only restore to the last available backup data that is available at the paired region. Currently, point-in-time restore of geo-backup is not available.

The estimated time to recover the server (RTO) depends on factors including the size of the database, the last database backup time, and the amount of WAL to process till the last received backup data. The overall recovery time usually takes from few minutes up to few hours.

During the geo-restore, the server configurations that can be changed include VNET settings and the ability to remove geo-redundant backup from the restored server.  Changing other server configurations such as compute, storage or pricing tier (Burstable, General Purpose, or Memory Optimized) during geo-restore are not supported.

Refer to the [how to guide](how-to-restore-server-portal.md#performing-geo-restore-preview) on performing Geo-restore.

> [!IMPORTANT]
> When primary region is down, you cannot create geo-redundant servers in the respective geo-paired region as storage cannot be provisioned in the primary region. You must wait for the primary region to be up to provision geo-redundant servers in the geo-paired region. 
> With the primary region down, you can still geo-restore the source server to the geo-paired region by disabling the geo-redundancy option in the Compute + Storage Configure Server settings in the restore portal experience and restore as a locally redundant server to ensure business continuity.  

## Restore and networking

### Point-in-time restore

- If your source server is configured with **public access** network, you can only restore to a **public access**. 
- If your source server is configured with **private access** VNET, then you can either restore in the same VNET or to a different VNET. You cannot perform point-in-time restore across public and private access.

### Geo-restore

- If your source server is configured with **public access** network, you can only restore to a **public access**. Also, you would have to apply firewall rules after the restore operation is complete. 
- If your source server is configured with **private access** VNET, then you can only restore to a different VNET - as VNET cannot be spanned across regions. You cannot perform geo-restore across public and private access.

## Perform post-restore tasks

After restoring the database, you can perform the following tasks to get your users and applications back up and running:

-   If the new server is meant to replace the original server, redirect clients and client applications to the new server. Change server name of your connection string to point to the new restored server.

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
  
    Azure Database for PostgreSQL automatically creates server backups and stores them automatically in zone-redundant storage in regions where multiple zones are supported or in locally redundant storage in regions that do not support multiple zones yet. These backup files cannot be exported. You can use backups to restore your server to a point-in-time only. The default backup retention period is seven days. You can optionally configure the backup retention up to 35 days. If you configured with geo-redundant backup, the backup is also copied to the paired region.

* **With geo-redundant backup, how frequently the backup is copied to the paired region?**  

    When the server is configured with geo-redundant backup, the backup data is stored on geo-redundant storage account which performs the copy of data to the paired region. Data files are copied to the paired region as and when the daily backup occurs at the primary server. WAL files are backed up as and when the WAL files are ready to be archived. These backup data are asynchronously copied in a continuous manner to the paired region. You can expect up to 1 hr of delay in receiving backup data.

* **Can I do PITR at the remote region?**
  
    No. The data is recovered to the last available backup data at the remote region.

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
