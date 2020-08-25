---
title: Overview of business continuity with Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of business continuity with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 08/24/2020
---
# Overview of business continuity with Azure Database for PostgreSQL - Flexible Server

This overview describes the capabilities that Azure Database for PostgreSQL Flexible Sever provides for business continuity and disaster recovery. Learn about options for recovering from disruptive events that 
could cause data loss or cause your database and application to becomes unavailable. Learn what to do when a user or application error affects data integrity, an Azure region has an outage, or your application requires maintenance.

## Features that you can use to provide business continuity

Flexible Server provides business continuity features that include automated backups and deploying your database servers in a zone redundant configuration. Each has different characteristics for expected recovery time and potential data loss. Once you understand these options, you can choose among them, and use them together for different scenarios. As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after the disruptive event - this is your Recovery Time Objective (RTO). You also need to understand the maximum amount of recent data updates (time interval) the application
can tolerate losing when recovering after the disruptive event - this is your Recovery Point Objective (RPO).

| **Feature** | **Description** | **Restrictions** |
| ------- | ----------- | ------------ |
| **Backup & Recovery** | You will be able to restore to any point in time within your backup retention period. You can choose the retention between 7 and 35 days. RTO will be dependent on the time of the backup performed before the desired date and the amount of transaction logs to recover until the desired time. Except for the latest transaction logs that were not backed up, you will be able to recover to any point in time. | |
| **Zone redundant backup** | The backups are automatically stored in a zone redundant storage within a region. In the event of a availability zone-level failures, restoring backups will create a flexible server on another availability zone.| Only applicable in regions where multiple zones are available.|
| **Zone reduntant high availability** | This protects from availability zone-level failures and also helps with reducing downtime during planned maintenance tasks and unplanned outages. A standby replica is provisioned in a different availability zone than the primary and the data is replicated in synchronous mode. In the event of a planned or unplanned downtime event, the flexible server is failed over to the standby server with no data loss. The recovery time in most cases are within 60-120s except for cases where longer recovery is required. | Supported in general purpose and memory optimized compute tiers. Available only in regions where multiple zones are available. |


## Planned downtime mitigation
Here are some planned maintenance scenarios:

| **Scenario** | **Description**| **Configured in high availability**|
| ------------ | ----------- | ------ |
| <b>Compute scale up/down | When the user performs compute scale up/down operation, a new database server is provisioned using the scaled compute configuration. In the existing database server, active checkpoints are allowed to complete, client connections are drained, any uncommitted transactions are canceled, and then it is shut down. The storage is then attached to the new server. | Reduced downtime due to standby-first operation. |
| <b>Scaling up storage | Scaling up the storage currently requires a downtime. Scaling down the storage is not supported. In the existing database server, active checkpoints are allowed to complete, client connections are drained, any uncommitted transactions are canceled, and then it is shut down. The storage is then attached to the new server. | Reduced downtime due to standby-first operation. |
| <b>New software deployment (Azure) | New features rollout or bug fixes automatically happen as part of service’s planned maintenance. For more information, refer to the [documentation](https://docs.microsoft.com/azure/postgresql/concepts-monitoring#planned-maintenance-notification), and also check your [portal](https://aka.ms/servicehealthpm).|Reduced downtime due to standby-first operation. | 
| <b>Minor version upgrades | Azure Database for PostgreSQL automatically patches database servers to the minor version determined by Azure. It happens as part of service's planned maintenance. This would incur a short downtime in terms of seconds, and the database server is automatically restarted with the new minor version. For more information, refer to the [documentation](https://docs.microsoft.com/azure/postgresql/concepts-monitoring#planned-maintenance-notification), and also check your [portal](https://aka.ms/servicehealthpm).|  Reduced downtime due to standby-first operation. |

When configured with zone redundancy, the flexible server performs operations on the standby server first and fails over. This reduces the application downtime to the time it takes to failover.

##  Unplanned downtime mitigation

Unplanned downtime can occur as a result of unforeseen failures, including underlying hardware fault, networking issues, and software bugs. If the database server goes down unexpectedly, a new database server is automatically provisioned in seconds. The remote storage is automatically attached to the new database server. PostgreSQL engine performs the recovery operation using WAL and database files, and opens up the database server to allow clients to connect. Uncommitted transactions are lost, and they have to be retried by the application. While an unplanned downtime cannot be avoided, Azure Database for PostgreSQL mitigates the downtime by automatically performing recovery operations at both database server and storage layers without requiring human intervention. 
   
### Unplanned downtime: failure scenarios and service recovery
Here are some failure scenarios and the recovery plan:

| **Scenario** | **Recovery plan** | **Configured in high availability** |
| ---------- | ---------- | ------- |
| <B>Database server failure | If the database server is down because of some underlying hardware fault, active connections are dropped, and any inflight transactions are aborted. Azure will attempt to restart the database server. If that succeeds, then the database recovery is performed. If the restart fails, the database server will be attempted to restart on another physical node.  <br /> <br /> The recovery time (RTO) is dependent on various factors including the activity at the time of fault such as large transaction and the amount of recovery to be performed during the database server startup process. <br /> <br /> Applications using the PostgreSQL databases need to be built in a way that they detect and retry dropped connections and failed transactions.  When the application retries, the connections are directed to the newly created database server. | If the database server failure is detected, the standby database server is activated, thus reducing downtime.|
| <B>Storage failure | Applications do not see any impact for any storage-related issues such as a disk failure or a physical block corruption. As the data is stored in 3 copies, the copy of the data is  served by the surviving storage. Block corruptions are automatically corrected. If a copy of data is lost, a new copy of the data is automatically created. | For non-recoverable errors, the flexible server is failed over to the standby replica to reduce downtime. |
| <b> Logical/user errors | Recovery from user errors, such as accidentally dropped tables or incorrectly updated data, involves performing a [point-in-time recovery](https://docs.microsoft.com/azure/postgresql/concepts-backup) (PITR), by restoring and recovering the data until the time just before the error had occurred.<br> <br>  If you want to restore only a subset of databases or specific tables rather than all databases in the database server, you can restore the database server in a new instance, export the table(s) via [pg_dump](https://www.postgresql.org/docs/11/app-pgdump.html), and then use [pg_restore](https://www.postgresql.org/docs/11/app-pgrestore.html) to restore those tables into your database. | These user errors are not protected with high availability due to the fact that all user operations are replicated to the standby too. |
| <b> Availability zone failure | While it is a rare event, if you want to recover from a zone-level failure, you can perform point-in-time recovery using the backup and choosing custom restore point to get to the latest data. A new flexible server will be deployed in another zone. The time taken to restore depends on the previous backup and the amount of transaction logs to recover. | Flexible server performs automatic failover to the standby site. | 

**Important**

Deleted servers **cannot** be restored. If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. Use [Azure resource lock](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/lock-resources) to help prevent accidental deletion of your server.


## Next steps

-   Learn more about the automated backups in flexible server

-   Learn how to restore using [[the Azure portal](https://docs.microsoft.com/en-us/azure/postgresql/howto-restore-server-portal) or [the Azure CLI](https://docs.microsoft.com/en-us/azure/postgresql/howto-restore-server-cli).

-   Learn about zone redundant high availability
-   Learn about backup and recovery
