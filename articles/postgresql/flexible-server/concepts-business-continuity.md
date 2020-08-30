---
title: Overview of business continuity with Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of business continuity with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/21/2020
---
# Overview of business continuity with Azure Database for PostgreSQL - Flexible Server

Azure Database for PostgreSQL Flexible Server, which is currently in preview, offers features that protect data and mitigates downtime for your mission critical databases in the event of planned and unplanned outages. Built on top of Azure infrastructure that already offers robust resiliency and availability, flexible server has management features that address different levels of fault-protection, recovery time requirements, and reduce data loss exposures. As you architect your applications to protect against downtime, you should consider the downtime tolerance defined by the recovery time objective (RTO) and data loss exposure as defined by the recovery point objective (RPO) for each application. For example, your business-critical database requires much stricter uptime requirements compared to a test database.  

> [!IMPORTANT]
> No uptime, RTO and RPO SLAs are offered during the preview. Those details are provided in this article for your planning purposes.

The table below illustrates the features that Flexible server offers.


| **Feature** | **Description** | **Restrictions** |
| ---------- | ----------- | ------------ |
| **Backup & Recovery** | Flexible server automatically performs daily backups of your database files and continuously backs up transaction logs. Backups can be retained from 7 days up to 35 days. You will be able to restore your database server to any point in time within your backup retention period. RTO is dependent on the size of the data to restore + the time to perform log recovery. It can be from few minutes up to 12 hours. For more details, see [Concepts - Backup and Restore](./concepts-backup-restore.md). |Backup data remains within the region |
| **Zone redundant high availability** | Flexible server can be deployed with high availability configuration where primary and standby servers are deployed in two different availability zones within a region. This configuration protects from zone-level failures and also helps with reducing application downtime during planned and unplanned downtime events. Data from the primary server is replicated to the standby replica in synchronous mode. In the event of any disruption to the primary server, it is automatically failed over to the standby replica. RTO is expected to be 60s-120s in most cases. Expected RPO is zero (no data loss). For more information, see [Concepts - High availability](./concepts-high-availability.md). | Supported in general purpose and memory optimized compute tiers. Available only in regions where multiple zones are available. |
| **Premium-managed disks** | Database files are stored in a highly durable and reliable premium-managed disk that provides data redundancy with three copies of replica stored within an availability zone with automatic data recovery capabilities. For more information, see [Managed disks documentation](https://docs.microsoft.com/azure/virtual-machines/managed-disks-overview). | Data stored within an availability zone. |
| **Zone redundant backup** | Flexible server backups are automatically and securely stored in a zone redundant storage within a region. During an availability zone-level failure where your server is provisioned, and if your server is not configured with high availability, you can restore your database using latest restore point on a different zone. For more information, see [Concepts - Backup and Restore](./concepts-backup-restore.md).| Only applicable in regions where multiple zones are available.|


## Planned downtime events
Below are some planned maintenance scenarios that incur up to few minutes of downtime, and with zero data loss.

| **Scenario** | **Process**|
| ------------ | ----------- | 
| <b>Compute scaling (User)| During compute scaling operation, a new flexible server is provisioned with the scaled compute configuration. In the existing database server, active checkpoints are allowed to complete, client connections are drained, any uncommitted transactions are canceled, and then it is shut down. The storage is then attached to the new server and the database is started which performs recovery if necessary before accepting client connections. |
| <b>Scaling up storage (User) | When a scaling up storage operation is initiated, active checkpoints are allowed to complete, client connections are drained, any uncommitted transactions are canceled, and then it is shut down. The storage is scaled to the desired size and then attached to the new server. A recovery is performed if needed before accepting client connections. Note that scaling down of the storage size is not supported.  | Overall application downtime is reduced due to scale operation performed at the standby first, and the flexible server is failed over. |
| <b>New software deployment (Azure) | New features rollout or bug fixes automatically happen as part of service’s planned maintenance, and you can schedule when those activities to happen. For more information, check your [portal](https://aka.ms/servicehealthpm) | 
| <b>Minor version upgrades (Azure) | Azure Database for PostgreSQL automatically patches database servers to the minor version determined by Azure. It happens as part of service's planned maintenance. The database server is automatically restarted with the new minor version. For more information, see [documentation](https://docs.microsoft.com/azure/postgresql/concepts-monitoring#planned-maintenance-notification). You can also check your [portal](https://aka.ms/servicehealthpm).| 

 When the flexible server is configured with **zone redundant high availability**, the flexible server performs the scale or the maintenance operations on the standby server first and then it is failed over. This approach reduces the application downtime as the downtime is only the time it takes to fail over. For more information, see [Concepts - High availability](./concepts-high-availability.md).

##  Unplanned downtime mitigation

Unplanned downtimes can occur as a result of unforeseen failures, including underlying hardware fault, networking issues, and software bugs. If the database server goes down unexpectedly, if configured with high availability [HA], then the standby replica is activated. If not, then a new database server is automatically provisioned. While an unplanned downtime cannot be avoided, flexible server helps mitigating the downtime by automatically performing recovery operations without requiring human intervention. 
   
### Unplanned downtime: failure scenarios and service recovery
Here are some unplanned failure scenarios and the recovery process:

| **Scenario** | **Recovery process [non-HA]** | **Recovery process [HA]** |
| ---------- | ---------- | ------- |
| <B>Database server failure | If the database server is down, and as long as it is not due to zone-level failures, Azure will attempt to restart the database server. If the restart attempt has failed, the database server will be restarted on another physical node.  <br /> <br /> The recovery time (RTO) is dependent on various factors including the activity at the time of fault such as large transaction and the volume of recovery to be performed during the database server startup process. <br /> <br /> Applications using the PostgreSQL databases need to be built in a way that they detect and retry dropped connections and failed transactions. | If the database server failure is detected, the standby database server is activated, thus reducing downtime. For more information, see [HA concepts page](../concepts-high-availability.md). RTO is expected to be 60-120s, with RPO=0 |
| <B>Storage failure | Applications do not see any impact for any storage-related issues such as a disk failure or a physical block corruption. As the data is stored in 3 copies, the copy of the data is  served by the surviving storage. Block corruptions are automatically corrected. If a copy of data is lost, a new copy of the data is automatically created. If you encounter any physical data corruption issue, then you have to perform point-in-time restore using backups. | For any rare and non-recoverable errors such as the entire storage is inaccessible, the flexible server is failed over to the standby replica to reduce downtime. For more information, see [HA concepts page](../concepts-high-availability.md). |
| <b> Logical/user errors | To recover from user errors, such as accidentally dropped tables or incorrectly updated data, you have to perform a [point-in-time recovery](https://docs.microsoft.com/azure/postgresql/concepts-backup) (PITR). While performing the restore operation, you specify the custom restore point, which is the time right before the error occurred.<br> <br>  If you want to restore only a subset of databases or specific tables rather than all databases in the database server, you can restore the database server in a new instance, export the table(s) via [pg_dump](https://www.postgresql.org/docs/11/app-pgdump.html), and then use [pg_restore](https://www.postgresql.org/docs/11/app-pgrestore.html) to restore those tables into your database. | These user errors are not protected with high availability due to the fact that all user operations are replicated to the standby too. |
| <b> Availability zone failure | To recover from a zone-level failure, you can perform point-in-time restore using the backup and choosing custom restore point to get to the latest data. A new flexible server will be deployed in another zone. The time taken to restore depends on the previous backup and the volume of transaction logs to recover. | Flexible server performs automatic failover to the standby site. For more information, see [HA concepts page](../concepts-high-availability.md). | 
| <b> Region failure | Cross-region  read replica and geo-restore of backup features are not yet supported in preview. | |


> [!IMPORTANT]
> Deleted servers **cannot** be restored. If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. Use [Azure resource lock](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources) to help prevent accidental deletion of your server.


## Next steps

-   Learn about [zone redundant high availability](./concepts-high-availability.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)
