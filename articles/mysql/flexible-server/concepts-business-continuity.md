---
title: Overview of business continuity - Azure Database for MySQL - Flexible Server
description: Learn about the concepts of business continuity with Azure Database for MySQL - Flexible Server
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: VandhanaMehta
ms.author: vamehta
ms.custom: event-tier1-build-2022
ms.date: 05/24/2022
---

# Overview of business continuity with Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL - Flexible Server enables business continuity capabilities that protect your databases in the event of a planned and unplanned outage. Features such as automated backups and high availability addresses different levels of fault-protection with different recovery time and data loss exposures. As you architect your application to protect against faults, you should consider the recovery time objective (RTO) and recovery point objective (RPO) for each application. RTO is the downtime tolerance and RPO is the data loss tolerance after a disruption to the database service.

The table below illustrates the features that the Azure Database for MySQL - Flexible Server  service offers.

| **Feature** | **Description** | **Restrictions** |
| ---------- | ----------- | ------------ |
| **Backup & Recovery** | The service automatically performs daily backups of your database files and continuously backs up transaction logs. Backups can be retained for any period between 1 to 35 days. You'll be able to restore your database server to any point in time within your backup retention period. Recovery time will be dependent on the size of the data to restore + the time to perform log recovery. Refer to [Concepts - Backup and Restore](./concepts-backup-restore.md) for more details. |Backup data remains within the region |
| **Local redundant backup** | The service backups are automatically and securely stored in a local redundant storage within a region and in same availability zone. The locally redundant backups replicate the server backup data files three times within a single physical location in the primary region. Locally redundant backup storage provides at least 99.999999999% (11 nines) durability of objects over a given year. Refer to [Concepts - Backup and Restore](./concepts-backup-restore.md) for more details.| Applicable in all regions |
| **Geo-redundant backup** | The service backups can be configured as geo-redundant at create time. Enabling Geo-redundancy replicates the server backup data files in the primary regionâ€™s paired region to provide regional resiliency. Geo-redundant backup storage provides at least 99.99999999999999% (16 nines) durability of objects over a given year. Refer to [Concepts - Backup and Restore](./concepts-backup-restore.md) for more details.| Available in all [Azure paired regions](overview.md#azure-regions) |
| **Zone redundant high availability** | The service can be deployed in high availability mode, which deploys primary and standby servers in two different availability zones within a region. Zone redundant high availibility protects from zone-level failures and also helps with reducing application downtime during planned and unplanned downtime events. Data from the primary server is synchronously replicated to the standby replica. During any downtime event, the database server is automatically failed over to the standby replica. Refer to [Concepts - High availability](./concepts-high-availability.md) for more details. | Supported in general purpose and Business Critical compute tiers. Available only in regions where multiple zones are available.|
| **Premium file shares** | Database files are stored in a highly durable and reliable Azure premium file shares that provide data redundancy with three copies of replica stored within an availability zone with automatic data recovery capabilities. Refer to [Premium File shares](../../storage/files/storage-how-to-create-file-share.md) for more details. | Data stored within an availability zone |

## Planned downtime mitigation

Here are some planned maintenance scenarios that incur downtime:

| **Scenario** | **Process**|
| :------------ | :----------- |
| **Compute scaling (User)**| When you perform compute scaling operation, a new flexible server is provisioned using the scaled compute configuration. In the existing database server, active checkpoints are allowed to complete, client connections are drained, any uncommitted transactions are canceled, and then it's shut down. The storage is then attached to the new server and the database is started which performs recovery if necessary before accepting client connections. |
| **New software deployment (Azure)** | New features rollout or bug fixes automatically happen as part of service's planned maintenance, and you can schedule when those activities to happen. For more information, see to the [documentation](https://aka.ms/servicehealthpm), and also check your [portal](https://aka.ms/servicehealthpm) |
| **Minor version upgrades (Azure)** | Azure Database for MySQL automatically patches database servers to the minor version determined by Azure. It happens as part of service's planned maintenance. This would incur a short downtime in terms of seconds, and the database server is automatically restarted with the new minor version. For more information, see to the [documentation](../concepts-monitoring.md#planned-maintenance-notification), and also check your [portal](https://aka.ms/servicehealthpm).|

When the flexible server is configured with **zone redundant high availability**, the flexible server performs operations on the standby server first and then on the primary server without a failover. Refer to [Concepts - High availability](./concepts-high-availability.md) for more details.

## Unplanned downtime mitigation

Unplanned downtimes can occur as a result of unforeseen failures, including underlying hardware fault, networking issues, and software bugs. If the database server goes down unexpectedly, if configured with high availability [HA], then the standby replica is activated. If not, then a new database server is automatically provisioned. While an unplanned downtime can’t be avoided, the flexible server mitigates the downtime by automatically performing recovery operations at both database server and storage layers without requiring human intervention.

### Unplanned downtime: failure scenarios and service recovery

Here are some unplanned failure scenarios and the recovery process:

| **Scenario** | **Recovery process [non-HA]** | **Recovery process [HA]** |
| :---------- | ---------- | ------- |
| **Database server failure** |If the database server is down because of some underlying hardware fault, active connections are dropped, and any inflight transactions are aborted. Azure will attempt to restart the database server. If that succeeds, then the database recovery is performed. If the restart fails, the database server will be attempted to restart on another physical node.<br /> <br />The recovery time (RTO) is dependent on various factors including the activity at the time of fault such as large transaction and the amount of recovery to be performed during the database server start-up process. The RPO will be zero as no data loss is expected for the committed transactions. Applications using the MySQL databases need to be built in a way that they detect and retry dropped connections and failed transactions. When the application retries, the connections are directed to the newly created database server.<br /> <br />Other available options are restore from backup. You can use both PITR or Geo restore from paired region. <br /> **PITR** : RTO: Varies,  RPO=0sec <br /> **Geo Restore :** RTO: Varies  RPO <1 h. <br /> <br />You can also use [read replica](./concepts-read-replicas.md) as DR solution. You can [stop the replication](./concepts-read-replicas.md#stop-replication) which make the read replica read-write(standalone and then redirect the application traffic to this database. The RTO in most cases  will be few minutes and RPO < 1 h. RTO and RPO can be much higher in some cases depending on various factors including latency between sites, the amount of data to be transmitted, and importantly primary database write workload. | If the database server failure or non-recoverable errors is detected, the standby database server is activated, thus reducing downtime. Refer to HA concepts page for more details. RTO is expected to be 60-120 s, with RPO=0. <br /> <br /> **Note:** *The options for Recovery process [non-HA] is also applicable here.*|
| **Storage failure** |Applications do not see any impact for any storage-related issues such as a disk failure or a physical block corruption. As the data is stored in three copies, the copy of the data is served by the surviving storage. Block corruptions are automatically corrected. If a copy of data is lost, a new copy of the data is automatically created.<br /> <br />In a rare or worst-case scenario if all copies are corrupted, we can use restore from Geo restore (paired region). RPO would be < 1 h and RTO would vary.<br /> <br />You can also use read replica as DR solution as detailed above. | For this scenario, the options are same as for Recovery process [non-HA] .|
| **Logical/user errors** | Recovery from user errors, such as accidentally dropped tables or incorrectly updated data, involves performing a [point-in-time recovery](concepts-backup-restore.md) (PITR), by restoring and recovering the data until the time just before the error had occurred.<br> <br> You can recover a deleted flexible server resource within five days from the time of server deletion. For a detailed guide on how to restore a deleted server, [refer documented steps] (../flexible-server/how-to-restore-dropped-server.md). To protect server resources post deployment from accidental deletion or unexpected changes, administrators can leverage [management locks](../../azure-resource-manager/management/lock-resources.md). | These user errors aren't protected with high availability since all user operations are replicated to the standby too. For this scenario, the options are same as for Recovery process [non-HA]  |
| **Availability zone failure** | While it's a rare event, if you want to recover from a zone-level failure, you can perform Geo restore from to a paired region. RPO would be <1 h and RTO would vary. <br /> <br /> You can also use [read replica](./concepts-read-replicas.md) as DR solution by creating replica in other availability zone. RTO\RPO is like what is detailed above. | If you have enabled Zone redundant HA, the flexible server performs automatic failover to the standby site. Refer to [HA concepts](./concepts-high-availability.md) for more details. RTO is expected to be 60-120 s, with RPO=0.<br /> <br />Other available options are restored from backup. You can use both PITR or Geo restore from paired region.<br />**PITR :** RTO: Varies, RPO=0 sec <br />**Geo Restore :** RTO: Varies, RPO <1 h <br /> <br /> **Note:** *If you have same zone HA enabled the options are same as what we have for Recovery process [non-HA]* |
| **Region failure** |While it's a rare event, if you want to recover from a region-level failure, you can perform database recovery by creating a new server using the latest geo-redundant backup available under the same subscription to get to the latest data. A new flexible server is deployed to the selected region. The time taken to restore depends on the previous backup and the number of transaction logs to recover.  RPO in most cases would be <1 h and RTO would vary.  | For this scenario, the options are same as for Recovery process [non-HA] . |

## Requirements and Limitations

**Region Data Residency**

By default, Azure Database for MySQL - Flexible Server doesn't move or store customer data out of the region it is deployed in. However, customers can optionally chose to enable geo-redundant backups or set up cross-region replication for storing data in another region.

## Next steps

- Learn about [zone redundant high availability](./concepts-high-availability.md)
- Learn about [backup and recovery](./concepts-backup-restore.md)
