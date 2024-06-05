---
title: Backup and restore
description: Learn about the concepts of backup and restore with Azure Database for MySQL - Flexible Server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: VandhanaMehta
ms.author: vamehta
ms.date: 07/26/2022
---

# Backup and restore in Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL flexible server automatically creates server backups and securely stores them in local redundant storage within the region. Backups can be used to restore your server to a point-in-time. Backup and restore are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion.

## Backup overview

Azure Database for MySQL flexible server supports two types of backups to provide an enhanced flexibility towards maintaining backups of the business-critical data.

### Automated backup

Azure Database for MySQL flexible server takes snapshot backups of the data files and stores them in a local redundant storage. The server also performs transaction logs backup and also stores them in local redundant storage. These backups allow you to restore a server to any point-in-time within your configured backup retention period. The default backup retention period is seven days. You can optionally configure the database backup from 1 to 35 days. All backups are encrypted using AES 256-bit encryption for the data stored at rest.

### On-Demand backup

Azure Database for MySQL flexible server also allows you to trigger on-demand backups of the production workload, in addition to the automated backups taken by the service and store it in alignment with server’s backup retention policy. You can use these backups as a fastest restore point to perform a point-in-time restore to reduce restore times by up to 90%. The default backup retention period is seven days. You can optionally configure the database backup from 1 to 35 days. You can trigger a total of 50 on-demand backups from the portal. All backups are encrypted using AES 256-bit encryption for the data stored at rest.

These backup files cannot be exported. The backups can only be used for restore operations in Azure Database for MySQL flexible server. You can also use [mysqldump](../concepts-migrate-dump-restore.md#dump-and-restore-using-mysqldump-utility) from a MySQL client to copy a database.

## Backup frequency

Backups on flexible servers are snapshot-based. The first snapshot backup is scheduled immediately after a server is created. Snapshot backups are taken daily once. Transaction log backups occur every five minutes.
If a scheduled backup fails, our backup service tries every 20 minutes to take a backup until a successful backup is taken. These backup failures may occur due to heavy transactional production loads on the server instance.

## Backup redundancy options

Azure Database for MySQL flexible server stores multiple copies of your backups so that your data is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Azure Database for MySQL flexible server provides the flexibility to choose between locally redundant, zone-redundant or geo-redundant backup storage in Basic, General Purpose and Business Critical tiers. By default, Azure Database for MySQL flexible server backup storage is locally redundant for servers with same-zone high availability (HA) or no high availability configuration, and zone redundant for servers with zone-redundant HA configuration.

Backup redundancy ensures that your database meets its availability and durability targets even in the face of failures and Azure Database for MySQL flexible server extends three options to users - 

- **Locally redundant backup storage** : When the backups are stored in locally redundant backup storage, multiple copies of backups are stored in the same datacenter. This option protects your data against server rack and drive failures. Also this provides at least 99.999999999% (11 9's) durability of Backups objects over a given year. By default backup storage for servers with same-zone high availability (HA) or no high availability configuration is set to locally redundant.  

- **Zone-redundant backup storage** : When the backups are stored in zone-redundant backup storage, multiple copies aren't only stored within the availability zone in which your server is hosted, but are also replicated to another availability zone in the same region. This option can be leveraged for scenarios that require high availability or for restricting replication of data to within a country/region to meet data residency requirements. Also this provides at least 99.9999999999% (12 9's) durability of Backups objects over a given year. One can select Zone-Redundant High Availability option at server create time to ensure zone-redundant backup storage. High Availability for a server can be disabled post create, but the backup storage remains zone-redundant.

- **Geo-Redundant backup storage** : When the backups are stored in geo-redundant backup storage, multiple copies aren't only stored within the region in which your server is hosted, but are also replicated to its geo-paired region. This provides better protection and ability to restore your server in a different region in the event of a disaster. Also this provides at least 99.99999999999999% (16 9's) durability of Backups objects over a given year.One can enable Geo-Redundancy option at server create time to ensure geo-redundant backup storage. Additionally, you can move from locally redundant storage to geo-redundant storage post server create. Geo redundancy is supported for servers hosted in any of the [Azure paired regions](overview.md#azure-regions).

> [!NOTE]
> Zone-redundant High Availability to support zone redundancy is current surfaced as a create time operation only. Currently, for a Zone-redundant High Availability server geo-redundancy can only be enabled/disabled at server create time.

## Moving from other backup storage options to geo-redundant backup storage

You can move your existing backups storage to geo-redundant storage using the following suggested ways:

- **Moving from locally redundant to geo-redundant backup storage** - In order to move your backup storage from locally redundant storage to geo-redundant storage, you can change the Compute + Storage server configuration from Azure portal to enable Geo-redundancy for the locally redundant source server. Same Zone Redundant HA servers can also be restored as a geo-redundant server in a similar fashion as the underlying backup storage is locally redundant for the same.

- **Moving from zone-redundant to geo-redundant backup storage** - Azure Database for MySQL flexible server doesn't support zone-redundant storage to geo-redundant storage conversion through Compute + Storage settings change after the server is provisioned. In order to move your backup storage from zone-redundant storage to geo-redundant storage, there are two options: a) Use PITR (point-in-time restore) to restore the server with desired configuration. b) Create a new server with the desired configuration and migrate the data using [dump and restore](../concepts-migrate-dump-restore.md).


## Backup retention

Backups are retained based on the backup retention period setting on the server. You can select a retention period of 1 to 35 days with a default retention period is seven days. You can set the retention period during server creation or later by updating the backup configuration using Azure portal.

The backup retention period governs how far back in time can a point-in-time restore operation be performed, since it's based on backups available. The backup retention period can also be treated as a recovery window from a restore perspective. All backups required to perform a point-in-time restore within the backup retention period are retained in backup storage. For example - if the backup retention period is set to seven days, the recovery window is considered last seven days. In this scenario, all the backups required to restore the server in last seven days are retained. With a backup retention window of seven days, database snapshots and transaction log backups are stored for the last eight days (1 day prior to the window).

## Backup storage cost

Azure Database for MySQL flexible server provides up to 100% of your provisioned server storage as backup storage at no additional cost. Any additional backup storage used is charged in GB per month. For example, if you have provisioned a server with 250 GB of storage, you have 250 GB of storage available for server backups at no additional charge. If the daily backup usage is 25GB, then you can have up to 10 days of free backup storage. Storage consumed for backups more than 250 GB is charged as per the [pricing model](https://azure.microsoft.com/pricing/details/mysql/).

You can use the [Backup Storage used](./concepts-monitoring.md) metric in Azure Monitor available in the Azure portal to monitor the backup storage consumed by a server. The **Backup Storage** used metric represents the sum of storage consumed by all the database backups and log backups retained based on the backup retention period set for the server. Heavy transactional activity on the server can cause backup storage usage to increase irrespective of the total database size. Backup storage used for a geo-redundant server is twice that of a locally redundant server.

The primary means of controlling the backup storage cost is by setting the appropriate backup retention period. You can select a retention period between 1 to 35 days.

> [!IMPORTANT]
> Backups from a database server configured in a zone redundant high availability configuration happens from the primary database server as the overhead is minimal with snapshot backups.

## View Available Full Backups

The Backup and Restore blade in the Azure portal provides a complete list of the full backups available to you at any given point in time.  This includes automated backups as well as the On-Demand backups. One can use this blade to view the completion timestamps for all available full backups within the server’s retention period and to perform restore operations using these full backups. The list of available backups includes all full backups within the retention period, a timestamp showing the successful completion, a timestamp indicating how long a backup will be retained, and a restore action.

## Restore

In Azure Database for MySQL flexible server, performing a restore creates a new server from the original server's backups. There are two types of restore available: 

- Point-in-time restore: is available with either backup redundancy option and creates a new server in the same region as your original server.
- Geo-restore: is available only if you configured your server for geo-redundant storage and it allows you to restore your server to either a geo-paired region or any other Azure supported region where flexible server is available. 

The estimated time for the recovery of the server depends on several factors: 

- The size of the databases 
- The number of transaction logs involved 
- The amount of activity that needs to be replayed to recover to the restore point 
- The network bandwidth if the restore is to a different region 
- The number of concurrent restore requests being processed in the target region 
- The presence of primary key in the tables in the database. For faster recovery, consider adding primary key for all the tables in your database.  


> [!NOTE]
> A High Availability-enabled server will become non-HA (High Availability disabled) after restore for both Point-in-time restore and Geo-restore. 

## Point-in-time restore

In Azure Database for MySQL flexible server, performing a point-in-time restore creates a new server from the flexible server's backups in the same region as your source server. It's created with the original server's configuration for the compute tier, number of vCores, storage size, backup retention period, and backup redundancy option. Also, tags and settings such as virtual network and firewall are inherited from the source server. The restored server's compute and storage tier, configuration and security settings can be changed after the restore is completed.

> [!NOTE]
> There are two server parameters which are reset to default values (and aren't copied over from the primary server) after the restore operation
> - time_zone - This value to set to DEFAULT value SYSTEM
> - event_scheduler - The event_scheduler is set to OFF on the restored server

Point-in-time restore is useful in multiple scenarios. Some of the use cases that are common include -
-   When a user accidentally deletes data in the database
-   User drops an important table or database
-   User application accidentally overwrites good data with bad data due to an application defect.

You can choose between latest restore point, custom restore point and fastest restore point (restore using full backup) via [Azure portal](how-to-restore-server-portal.md).

-   **Latest restore point**: The latest restore point option helps you to restore the server to the timestamp when the restore operation was triggered. This option is useful to quickly restore the server to the most updated state.
-   **Custom restore point**: This option allows you to choose any point in time within the retention period defined for this server. This option is useful to restore the server at the precise point in time to recover from a user error.
-   **Fastest restore point**: This option allows users to restore the server in the fastest time possible for a given day within the retention period defined for their server. Fastest restore is possible by choosing the restore point-in-time at which the full backup is completed. This restore operation simply restores the full snapshot backup and doesn't warrant restore or recovery of logs which makes it fast. We recommend you select a full backup timestamp which is greater than the earliest restore point in time for a successful restore operation.

The estimated time of recovery depends on several factors including the database sizes, the transaction log backup size, the compute size of the SKU, and the time of the restore as well. The transaction log recovery is the most time consuming part of the restore process. If the restore time is chosen closer to the snapshot backup schedule, the restore operations are faster since transaction log application is minimal. To estimate the accurate recovery time for your server, we highly recommend testing it in your environment as it has too many environment-specific variables.

> [!IMPORTANT]
> If you are restoring an Azure Database for MySQL flexible server instance configured with zone redundant high availability, the restored server is configured in the same region and zone as your primary server, and deployed as a single server in a non-HA mode. Refer to [zone redundant high availability](concepts-high-availability.md) for flexible server.

> [!IMPORTANT]
> You can recover a deleted Azure Database for MySQL flexible server resource within 5 days from the time of server deletion. For a detailed guide on how to restore a deleted server, [refer documented steps](../flexible-server/how-to-restore-dropped-server.md). To protect server resources post deployment from accidental deletion or unexpected changes, administrators can leverage [management locks](../../azure-resource-manager/management/lock-resources.md).

## Geo-restore

You can restore a server to its [geo-paired region](overview.md#azure-regions) where the service is available if you have configured your server for geo-redundant backups or any other Azure supported region where Azure Database for MySQL flexible server is available. Ability to restore to any non-paired Azure supported region (except `Brazil South`, `USGov Virginia` and `West US 3)` is known as "Universal Geo-restore".

Geo-restore is the default recovery option when your server is unavailable because of an incident in the region where the server is hosted. If a large-scale incident in a region results in unavailability of your database application, you can restore a server from the geo-redundant backups to a server in any other region. Geo-restore utilizes the most recent backup of the server. There's a delay between when a backup is taken and when it's replicated to different region. This delay can be up to an hour, so if a disaster occurs there can be up to one hour data loss. 

Geo-restore can also be performed on a stopped server leveraging Azure CLI. Read [Restore Azure Database for MySQL flexible server with Azure CLI](how-to-restore-server-cli.md) to learn more about geo-restoring a server with Azure CLI.

The estimated time of recovery depends on several factors including the database sizes, the transaction log size, the network bandwidth, and the total number of databases recovering in the same region at the same time. 

> [!NOTE]
> If you're geo-restoring an Azure Database for MySQL flexible server instance configured with zone redundant high availability, the restored server is configured in the geo-paired region and the same zone as your primary server and deployed as a single Azure Database for MySQL flexible server instance in a non-HA mode. Refer to [zone redundant high availability](concepts-high-availability.md) for Azure Database for MySQL flexible server.

> [!IMPORTANT]
> When primary region is down, you can't create geo-redundant servers in the respective geo-paired region because storage can't be provisioned in the primary region. You must wait for the primary region to be up to provision geo-redundant servers in the geo-paired region. 
> With the primary region down, you can still geo-restore the source server to the geo-paired region by disabling the geo-redundancy option in the Compute + Storage Configure Server settings in the restore portal experience and restore as a locally redundant server to ensure business continuity.  

## Perform post-restore tasks

After a restore from either **latest restore point** or **custom restore point** recovery mechanism, you should perform the following tasks to get your users and applications back up and running:

- If the new server is meant to replace the original server, redirect clients and client applications to the new server.
- Ensure appropriate server-level firewall and virtual network rules are in place for users to connect.
- Ensure appropriate logins and database level permissions are in place.
- Configure alerts, as appropriate.

## Long-term retention (preview)

Azure Backup and Azure Database for MySQL flexible server services have built an enterprise-class long-term backup solution for Azure Database for MySQL flexible server instances that retains backups for up to 10 years. You can use long-term retention independently or in addition to the automated backup solution offered by Azure Database for MySQL flexible server, which offers retention of up to 35 days. Automated backups are snapshot backups suited for operational recoveries, especially when you want to restore from the latest backups. Long-term backups help you with your compliance needs and auditing needs. In addition to long-term retention, the solution offers the following capabilities:

- Customer-controlled scheduled and on-demand backups 
- Manage and monitor all the backup-related operations and jobs across servers, resource groups, locations, subscriptions, and tenants from a single pane of glass called the Backup Center. 
- Backups are stored in separate security and fault domains. If the source server or subscription is compromised, the backups remain safe in the Backup vault (in Azure Backup managed storage accounts).

### Limitations and considerations
- In preview, LTR restore is currently available as RestoreasFiles to storage accounts. RestoreasServer capability will be added in the future.
- Support for LTR creation and management through Azure CLI is currently not supported.

For more information about performing a long-term backup, visit the [how-to guide](../../backup/backup-azure-mysql-flexible-server.md)

## On-demand backup and Export (preview)

Azure Database for MySQL Flexible server now offers the ability to trigger an on-demand at-moment physical backup of the server and export it to an Azure storage account (Azure blob storage). Once exported, these backups can be used for data recovery, migration, and redundancy. These exported physical backup files can be used to restore back to an on-prem MySQL server to help meet auditing/compliance/archival needs of an organization. The feature is currently in public preview and available only in public cloud regions.

For more information regarding export backup, visit the [how-to guide](../flexible-server/how-to-trigger-on-demand-backup.md)

## Frequently Asked Questions (FAQs)

### Backup-related questions

- **How do I back up my server?**

  By default, Azure Database for MySQL flexible server enables automated backups of your entire server (encompassing all databases created) with a default 7-day retention period. You can also trigger a manual backup using On-Demand backup feature. The other way to manually take a backup is by using community tools such as mysqldump as documented [here](../concepts-migrate-dump-restore.md#dump-and-restore-using-mysqldump-utility) or mydumper as documented [here](../concepts-migrate-mydumper-myloader.md#create-a-backup-using-mydumper). If you wish to back up an Azure Database for MySQL flexible server instance to a Blob storage, refer to our tech community blog [Backup Azure Database for MySQL flexible server to a Blob Storage](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/backup-azure-database-for-mysql-to-a-blob-storage/ba-p/803830).

- **Can I configure automatic backups to be retained for long term?**

  No, currently we only support a maximum of 35 days of automated backup retention. You can take manual backups and use that for long-term retention requirement.

- **What are the backup windows for my server? Can I customize it?**

  The first snapshot backup is scheduled immediately after a server is created. Snapshot backups are taken once daily. Transaction log backups occur every five minutes. Backup windows are inherently managed by Azure and can't be customized.

- **Are my backups encrypted?**

  All Azure Database for MySQL flexible server data, backups, and temporary files created during query execution are encrypted using AES 256-bit encryption. The storage encryption is always on and can't be disabled.

- **Can I restore a single/few database(s)?**
  
  Restoring a single/few database(s) or tables isn't supported. In case you want to restore specific databases, perform a Point in Time Restore and then extract the table(s) or database(s) needed.

- **Is my server available during the backup window?**
  
  Yes. Backups are online operations and are snapshot-based. The snapshot operation only takes few seconds and doesn't interfere with production workloads, ensuring high availability of the server.

- **When setting up the maintenance window for the server, do we need to account for the backup window?**
  
  No, backups are triggered internally as part of the managed service and have no bearing on the Managed Maintenance Window.
- **Where are my automated backups stored and how do I manage their retention?**
  
  Azure Database for MySQL flexible server automatically creates server backups and stores them in user-configured, locally redundant storage or in geo-redundant storage. These backup files can't be exported. The default backup retention period is seven days. You can optionally configure the database backup from 1 to 35 days.
- **How can I validate my backups?**
  
  The best way to validate availability of successfully completed backups is to view the full-automated backups taken within the retention period in the Backup and Restore blade. If a backup fails, it isn't listed in the available backups list, and the backup service will try every 20 minutes to take a backup until a successful backup is taken. These backup failures are due to heavy transactional production loads on the server.

- **Where can I see the backup usage?**
  
  In the Azure portal, under the Monitoring tab - Metrics section, you can find the [Backup Storage Used](./concepts-monitoring.md) metric, which can help you monitor the total backup usage.

- **What happens to my backups if I delete my server?**

  If you delete the server, all backups that belong to the server are also deleted and can't be recovered. To protect server resources post deployment from accidental deletion or unexpected changes, administrators can use [management locks](../../azure-resource-manager/management/lock-resources.md).
- **What happens to my backups when I restore a server?**

  If you restore a server, then it always results in a creation of a net new server that has been restored using original server's backups. The old backup from the original server is not copied over to the newly restored server and it remains with the original server. However, for the newly created server the first snapshot backup is scheduled immediately after a server is created and the service ensures daily automated backups are taken and stored as per configured server retention period.
- **How am I charged and billed for my use of backups?**

  Azure Database for MySQL flexible server provides up to 100% of your provisioned server storage as backup storage at no added cost. Any more backup storage used is charged in GB per month as per the [pricing model](https://azure.microsoft.com/pricing/details/mysql/server/). Backup storage billing is also governed by the backup retention period selected and backup redundancy option chosen, apart from the transactional activity on the server, which impacts the total backup storage used directly.

- **How are backups retained for stopped servers?**

  No new backups are performed for stopped servers. All older backups (within the retention window) at the time of stopping the server are retained until the server is restarted, post which backup retention for the active server is governed by its backup retention window.
- **How will I be billed for backups for a stopped server?**

  While your server instance is stopped, you're charged for provisioned storage (including Provisioned IOPS) and backup storage (backups stored within your specified retention window). Free backup storage is limited to the size of your provisioned database and only applies to active servers.

- **How is my backup data protected?**

  Azure database for MySQL Flexible server protects your backup data by blocking any operations that could lead to loss of recovery points for the duration of the configured retention period. Backups taken during the retention period can only be read for the purpose of restoration and are deleted post retention period. Also, all backups in Azure Database for MySQL flexible server are encrypted using AES 256-bit encryption for the data stored at rest.

- **How does a Point-In-Time Restore (PITR) operation affect IOPS usage?**

  During a PITR operation in Azure Database for MySQL - Flexible Server, a new server is created and data is copied from the source server’s storage to the new server’s storage. This process results in an increased IOPS usage on the source server. This increase in IOPS usage is a normal occurrence and does not indicate any issues with the source server or the PITR operation. Once the PITR operation is complete, the IOPS usage on the source server will return to its usual levels.

### Restore-related questions

- **How do I restore my server?**
Azure portal supports Point In Time Restore for all servers, allowing users to restore to latest or custom restore points. To manually restore your server from the backups taken by mysqldump/myDumper, see [Restore your database using myLoader](../concepts-migrate-mydumper-myloader.md#restore-your-database-using-myloader).

- **Why is my restore taking so much time?**

  The estimated time for the recovery of the server depends on several factors:
   - The size of the databases. As a part of the recovery process, the database needs to be hydrated from the last physical backup and hence the time taken to recover will be proportional to the size of the database.
   - The active portion of transaction activity that needs to be replayed to recover. Recovery can take longer depending on the added transaction activity from the last successful checkpoint.
   - The network bandwidth if the restore is to a different region.
   - The number of concurrent restore requests being processed in the target region.
   - The presence of primary keys in the tables in the database. For faster recovery, consider adding primary keys for all the tables in your database.
   
 - **Will modifying session level database variables impact restoration?**
   
   Modifying session level variables and running DML statements in a MySQL client session can impact the PITR (point in time restore) operation, as these modifications don't get recorded in the binary log that is used for backup and restore operation. For example, [foreign_key_checks](http://dev.mysql.com/doc/refman/5.5/en/server-system-variables.html#sysvar_foreign_key_checks) are one such session-level variable, which if disabled for running a DML statement which violates the foreign key constraint results in PITR (point in time restore) failure. The only workaround in such a scenario would be to select a PITR time earlier than the time at which [foreign_key_checks](http://dev.mysql.com/doc/refman/5.5/en/server-system-variables.html#sysvar_foreign_key_checks) were disabled. Our recommendation is to NOT modify any session variables for a successful PITR operation.

## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)
