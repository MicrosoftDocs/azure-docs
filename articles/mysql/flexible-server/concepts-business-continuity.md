---
title: Overview of business continuity - Azure Database for MySQL Flexible Server
description: Learn about the concepts of business continuity with Azure Database for MySQL Flexible Server
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.topic: conceptual
ms.date: 09/21/2020
---

# Overview of business continuity with Azure Database for MySQL - Flexible Server (Preview)

> [!IMPORTANT]
> Azure Database for MySQL - Flexible Server is currently in public preview.

Azure Database for MySQL Flexible Server enables business continuity capabilities that protect your databases in the event of a planned and unplanned outage. Features such as automated backups and high availability addresses different levels of fault-protection with different recovery time and data loss exposures. As you architect your application to protect against faults, you should consider the recovery time objective (RTO) and recovery point objective (RPO) for each application. RTO is the downtime tolerance and RPO is the data loss tolerance after a disruption to the database service.

The table below illustrates the features that Flexible server offers.

| **Feature** | **Description** | **Restrictions** |
| ---------- | ----------- | ------------ |
| **Backup & Recovery** | Flexible server automatically performs daily backups of your database files and continuously backs up transaction logs. Backups can be retained for any period between 1 to 35 days. You will be able to restore your database server to any point in time within your backup retention period. Recovery time will be dependent on the size of the data to restore + the time to perform log recovery. Refer to [Concepts - Backup and Restore](./concepts-backup-restore.md) for more details. |Backup data remains within the region |
| **Local redundant backup** | Flexible server backups are automatically and securely stored in a local redundant storage within a region and in same availability zone. The locally redundant backups replicate the server backup data files three times within a single physical location in the primary region. Locally redundant backup storage provides at least 99.999999999% (11 nines) durability of objects over a given year. Refer to [Concepts - Backup and Restore](./concepts-backup-restore.md) for more details.| Applicable in all regions |
| **Zone redundant high availability** | Flexible server can be deployed in high availability mode, which deploys primary and standby servers in two different availability zones within a region. This protects from zone-level failures and also helps with reducing application downtime during planned and unplanned downtime events. Data from the primary server is synchronously replicated to the standby replica. During any downtime event, the database server is automatically failed over to the standby replica. Refer to [Concepts - High availability](./concepts-high-availability.md) for more details. | Supported in general purpose and memory optimized compute tiers. Available only in regions where multiple zones are available.|
| **Premium file shares** | Database files are stored in a highly durable and reliable Azure premium file shares that provide data redundancy with three copies of replica stored within an availability zone with automatic data recovery capabilities. Refer to [Premium File shares](../../storage/files/storage-how-to-create-premium-fileshare.md) for more details. | Data stored within an availability zone |

> [!IMPORTANT]
> No uptime, RTO and RPO SLA are offered during preview period. Details provided in this page for your information and planning purposes only.

## Planned downtime mitigation

Here are some planned maintenance scenarios that incur downtime:

| **Scenario** | **Process**|
| :------------ | :----------- |
| **Compute scaling (User)**| When you perform compute scaling operation, a new flexible server is provisioned using the scaled compute configuration. In the existing database server, active checkpoints are allowed to complete, client connections are drained, any uncommitted transactions are canceled, and then it is shut down. The storage is then attached to the new server and the database is started which performs recovery if necessary before accepting client connections. |
| **New software deployment (Azure)** | New features rollout or bug fixes automatically happen as part of service's planned maintenance, and you can schedule when those activities to happen. For more information, see to the [documentation](https://aka.ms/servicehealthpm), and also check your [portal](https://aka.ms/servicehealthpm) |
| **Minor version upgrades (Azure)** | Azure Database for MySQL automatically patches database servers to the minor version determined by Azure. It happens as part of service's planned maintenance. This would incur a short downtime in terms of seconds, and the database server is automatically restarted with the new minor version. For more information, see to the [documentation](../concepts-monitoring.md#planned-maintenance-notification), and also check your [portal](https://aka.ms/servicehealthpm).|

When the flexible server is configured with **zone redundant high availability**, the flexible server performs operations on the standby server first and then on the primary server without a failover. Refer to [Concepts - High availability](./concepts-high-availability.md) for more details.

## Unplanned downtime mitigation

Unplanned downtimes can occur as a result of unforeseen failures, including underlying hardware fault, networking issues, and software bugs. If the database server goes down unexpectedly, if configured with high availability [HA], then the standby replica is activated. If not, then a new database server is automatically provisioned. While an unplanned downtime cannot be avoided, flexible server mitigates the downtime by automatically performing recovery operations at both database server and storage layers without requiring human intervention.

### Unplanned downtime: failure scenarios and service recovery

Here are some unplanned failure scenarios and the recovery process:

| **Scenario** | **Recovery process [non-HA]** | **Recovery process [HA]** |
| :---------- | ---------- | ------- |
| **Database server failure** | If the database server is down because of some underlying hardware fault, active connections are dropped, and any inflight transactions are aborted. Azure will attempt to restart the database server. If that succeeds, then the database recovery is performed. If the restart fails, the database server will be attempted to restart on another physical node.  <br /> <br /> The recovery time (RTO) is dependent on various factors including the activity at the time of fault such as large transaction and the amount of recovery to be performed during the database server startup process. <br /> <br /> Applications using the MySQL databases need to be built in a way that they detect and retry dropped connections and failed transactions.  When the application retries, the connections are directed to the newly created database server. | If the database server failure is detected, the standby database server is activated, thus reducing downtime. Refer to [HA concepts page](concepts-high-availability.md) for more details. RTO is expected to be 60-120 s, with RPO=0 |
| **Storage failure** | Applications do not see any impact for any storage-related issues such as a disk failure or a physical block corruption. As the data is stored in 3 copies, the copy of the data is  served by the surviving storage. Block corruptions are automatically corrected. If a copy of data is lost, a new copy of the data is automatically created. | For non-recoverable errors, the flexible server is failed over to the standby replica to reduce downtime. Refer to [HA concepts page](./concepts-high-availability.md) for more details. |
| **Logical/user errors** | Recovery from user errors, such as accidentally dropped tables or incorrectly updated data, involves performing a [point-in-time recovery](concepts-backup-restore.md) (PITR), by restoring and recovering the data until the time just before the error had occurred.<br> <br>  If you want to restore only a subset of databases or specific tables rather than all databases in the database server, you can restore the database server in a new instance, export the table(s) via [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html), and then use [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) to restore those tables into your database. | These user errors are not protected with high availability due to the fact that all user operations are replicated to the standby too. |
| **Availability zone failure** | While it is a rare event, if you want to recover from a zone-level failure, you can perform point-in-time recovery using the backup and choosing custom restore point to get to the latest data. A new flexible server will be deployed in another zone. The time taken to restore depends on the previous backup and the number of transaction logs to recover. | Flexible server performs automatic failover to the standby site. Refer to [HA concepts page](./concepts-high-availability.md) for more details. |
| **Region failure** | Cross-region replica and geo-restore features are not yet supported in preview. | |

> [!IMPORTANT]
> Deleted servers **cannot** be restored. If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. Use [Azure resource lock](../../azure-resource-manager/management/lock-resources.md) to help prevent accidental deletion of your server.

## Next steps

- Learn about [zone redundant high availability](./concepts-high-availability.md)
- Learn about [backup and recovery](./concepts-backup-restore.md)
