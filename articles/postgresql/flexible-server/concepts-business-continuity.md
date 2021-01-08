---
title: Overview of business continuity with Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of business continuity with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/22/2020
---

# Overview of business continuity with Azure Database for PostgreSQL - Flexible Server

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

**Business continuity** in Azure Database for PostgreSQL - Flexible Server refers to the mechanisms, policies, and procedures that enable your business to continue operating in the face of disruption, particularly to its computing infrastructure. In most of the cases, flexible server will handle the disruptive events happens that might happen in the cloud environment and keep your applications and business processes running. However, there are some events that cannot be handled automatically such as:

- User accidentally deletes or updates a row in a table.
- Earthquake causes a power outage and temporary disables a datacenter or an availability zone.
- Database patching required to fix a bug or security issue.

Flexible server provides features that protect data and mitigates downtime for your mission critical databases in the event of planned and unplanned downtime events. Built on top of the Azure infrastructure that already offers robust resiliency and availability, flexible server has business continuity features that provide additional fault-protection, address recovery time requirements, and reduce data loss exposure. As you architect your applications, you should consider the downtime tolerance - which is the recovery time objective (RTO) and data loss exposure - which is the recovery point objective (RPO). For example, your business-critical database requires much stricter uptime requirements compared to a test database.  

> [!IMPORTANT]
> Uptime % service level agreement (SLA) is not offered during the preview. 

The table below illustrates the features that Flexible server offers.


| **Feature** | **Description** | **Considerations** |
| ---------- | ----------- | ------------ |
| **Automatic backups** | Flexible server automatically performs daily backups of your database files and continuously backs up transaction logs. Backups can be retained from 7 days up to 35 days. You will be able to restore your database server to any point in time within your backup retention period. RTO is dependent on the size of the data to restore + the time to perform log recovery. It can be from few minutes up to 12 hours. For more details, see [Concepts - Backup and Restore](./concepts-backup-restore.md). |Backup data remains within the region. |
| **Zone redundant high availability** | Flexible server can be deployed with zone redundant high availability(HA) configuration where primary and standby servers are deployed in two different availability zones within a region. This HA configuration protects your databases from zone-level failures and also helps with reducing application downtime during planned and unplanned downtime events. Data from the primary server is replicated to the standby replica in synchronous mode. In the event of any disruption to the primary server, the server is automatically failed over to the standby replica. RTO in most cases is expected to be within 60s-120s. RPO is expected to be zero (no data loss). For more information, see [Concepts - High availability](./concepts-high-availability.md). | Supported in general purpose and memory optimized compute tiers. Available only in regions where multiple zones are available. |
| **Premium-managed disks** | Database files are stored in a highly durable and reliable premium-managed storage. This provides data redundancy with three copies of replica stored within an availability zone with automatic data recovery capabilities. For more information, see [Managed disks documentation](../../virtual-machines/managed-disks-overview.md). | Data stored within an availability zone. |
| **Zone redundant backup** | Flexible server backups are automatically and securely stored in a zone redundant storage within a region. During a zone-level failure where your server is provisioned, and if your server is not configured with zone redundancy, you can still restore your database using the latest restore point in a different zone. For more information, see [Concepts - Backup and Restore](./concepts-backup-restore.md).| Only applicable in regions where multiple zones are available.|


## Planned downtime events
Below are some planned maintenance scenarios. These events typically incur up to few minutes of downtime, and without data loss.

| **Scenario** | **Process**|
| ------------------- | ----------- | 
| <b>Compute scaling (User-initiated)| During compute scaling operation, active checkpoints are allowed to complete, client connections are drained, any uncommitted transactions are canceled, storage is detached, and then it is shut down. A new flexible server with the same database server name is provisioned with the scaled compute configuration. The storage is then attached to the new server and the database is started which performs recovery if necessary before accepting client connections. |
| <b>Scaling up storage (User-initiated) | When a scaling up storage operation is initiated, active checkpoints are allowed to complete, client connections are drained, any uncommitted transactions are canceled, and then it is shut down. The storage is scaled to the desired size and then attached to the new server. A recovery is performed if needed before accepting client connections. Note that scaling down of the storage size is not supported. |
| <b>New software deployment (Azure-initiated) | New features rollout or bug fixes automatically happen as part of service’s planned maintenance, and you can schedule when those activities to happen. For more information, check your [portal](https://aka.ms/servicehealthpm). | 
| <b>Minor version upgrades (Azure-initiated) | Azure Database for PostgreSQL automatically patches database servers to the minor version determined by Azure. It happens as part of service's planned maintenance. The database server is automatically restarted with the new minor version. For more information, see [documentation](../concepts-monitoring.md#planned-maintenance-notification). You can also check your [portal](https://aka.ms/servicehealthpm).| 

 When the flexible server is configured with **zone redundant high availability**, the flexible server performs the scaling and the maintenance operations on the standby server first. For more information, see [Concepts - High availability](./concepts-high-availability.md).

##  Unplanned downtime mitigation

Unplanned downtimes can occur as a result of unforeseen disruptions such as underlying hardware fault, networking issues, and software bugs. If the database server configured with high availability goes down unexpectedly, then the standby replica is activated and the clients can resume their operations. If not configured with high availability (HA), then if the restart attempt fails, a new database server is automatically provisioned. While an unplanned downtime cannot be avoided, flexible server helps mitigating the downtime by automatically performing recovery operations without requiring human intervention. 
   
### Unplanned downtime: failure scenarios and service recovery
Below are some unplanned failure scenarios and the recovery process. 

| **Scenario** | **Recovery process [non-HA]** | **Recovery process [HA]** |
| ---------- | ---------- | ------- |
| <B>Database server failure | If the database server is down, Azure will attempt to restart the database server. If that fails, the database server will be restarted on another physical node.  <br /> <br /> The recovery time (RTO) is dependent on various factors including the activity at the time of fault such as large transaction and the volume of recovery to be performed during the database server startup process. <br /> <br /> Applications using the PostgreSQL databases need to be built in a way that they detect and retry dropped connections and failed transactions. | If the database server failure is detected, the server is failed over to the standby server, thus reducing downtime. For more information, see [HA concepts page](./concepts-high-availability.md). RTO is expected to be 60-120s, with zero data loss. |
| <B>Storage failure | Applications do not see any impact for any storage-related issues such as a disk failure or a physical block corruption. As the data is stored in three copies, the copy of the data is served by the surviving storage. The corrupted data block is automatically repaired and a new copy of the data is automatically created. | For any rare and non-recoverable errors such as the entire storage is inaccessible, the flexible server is failed over to the standby replica to reduce the downtime. For more information, see [HA concepts page](./concepts-high-availability.md). |
| <b> Logical/user errors | To recover from user errors, such as accidentally dropped tables or incorrectly updated data, you have to perform a [point-in-time recovery](../concepts-backup.md) (PITR). While performing the restore operation, you specify the custom restore point, which is the time right before the error occurred.<br> <br>  If you want to restore only a subset of databases or specific tables rather than all databases in the database server, you can restore the database server in a new instance, export the table(s) via [pg_dump](https://www.postgresql.org/docs/11/app-pgdump.html), and then use [pg_restore](https://www.postgresql.org/docs/11/app-pgrestore.html) to restore those tables into your database. | These user errors are not protected with high availability as all changes are replicated to the standby replica synchronously. You have to perform point-in-time restore to recover from such errors. |
| <b> Availability zone failure | To recover from a zone-level failure, you can perform point-in-time restore using the backup and choosing a custom restore point with the latest time to restore the latest data. A new flexible server will be deployed in another non-impacted zone. The time taken to restore depends on the previous backup and the volume of transaction logs to recover. | Flexible server is automatically failed over to the standby server within 60-120s with zero data loss. For more information, see [HA concepts page](./concepts-high-availability.md). | 
| <b> Region failure | Cross-region  read replica and geo-restore of backup features are not yet supported in preview. | |


> [!IMPORTANT]
> Deleted servers **cannot** be restored. If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. Use [Azure resource lock](../../azure-resource-manager/management/lock-resources.md) to help prevent accidental deletion of your server.


## Next steps

-   Learn about [zone redundant high availability](./concepts-high-availability.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)