---
title: Overview of business continuity with Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of business continuity with Azure Database for PostgreSQL - Flexible Server
ms.author: sunila
author: sunilagarwal
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/30/2021
---

# Overview of business continuity with Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

**Business continuity** in Azure Database for PostgreSQL - Flexible Server refers to the mechanisms, policies, and procedures that enable your business to continue operating in the face of disruption, particularly to its computing infrastructure. In most of the cases, flexible server handles disruptive events happens that might happen in the cloud environment and keep your applications and business processes running. However, there are some events that can't be handled automatically such as:

- User accidentally deletes or updates a row in a table.
- Earthquake causes a power outage and temporary disables a data center or an availability zone.
- Database patching required to fix a bug or security issue.

The flexible server provides features that protect data and mitigates downtime for your mission-critical databases during planned and unplanned downtime events. Built on top of the Azure infrastructure that offers robust resiliency and availability, the flexible server has business continuity features that provide another fault-protection, address recovery time requirements, and reduce data loss exposure. As you architect your applications, you should consider the downtime tolerance - the recovery time objective (RTO), and data loss exposure - the recovery point objective (RPO). For example, your business-critical database requires stricter uptime than a test database.

The table below illustrates the features that Flexible server offers.

| **Feature** | **Description** | **Considerations** |
| ---------- | ----------- | ------------ |
| **Automatic backups** | Flexible server automatically performs daily backups of your database files and continuously backs up transaction logs. Backups can be retained from 7 days up to 35 days. You're able to restore your database server to any point in time within your backup retention period. RTO is dependent on the size of the data to restore + the time to perform log recovery. It can be from few minutes up to 12 hours. For more details, see [Concepts - Backup and Restore](./concepts-backup-restore.md). |Backup data remains within the region. |
| **Zone redundant high availability** | Flexible server can be deployed with zone redundant high availability(HA) configuration where primary and standby servers are deployed in two different availability zones within a region. This HA configuration protects your databases from zone-level failures and also helps with reducing application downtime during planned and unplanned downtime events. Data from the primary server is replicated to the standby replica in synchronous mode. In the event of any disruption to the primary server, the server is automatically failed over to the standby replica. RTO in most cases is expected to be less than 120s. RPO is expected to be zero (no data loss). For more information, see [Concepts - High availability](./concepts-high-availability.md). | Supported in general purpose and memory optimized compute tiers. Available only in regions where multiple zones are available. |
| **Same zone high availability** | Flexible server can be deployed with same zone high availability(HA) configuration where primary and standby servers are deployed in the same availability zone in a region. This HA configuration protects your databases from node-level failures and also helps with reducing application downtime during planned and unplanned downtime events. Data from the primary server is replicated to the standby replica in synchronous mode. In the event of any disruption to the primary server, the server is automatically failed over to the standby replica. RTO in most cases is expected to be less than 120s. RPO is expected to be zero (no data loss). For more information, see [Concepts - High availability](./concepts-high-availability.md). | Supported in general purpose and memory optimized compute tiers. |
| **Premium-managed disks** | Database files are stored in a highly durable and reliable premium-managed storage. This provides data redundancy with three copies of replica stored within an availability zone with automatic data recovery capabilities. For more information, see [Managed disks documentation](../../virtual-machines/managed-disks-overview.md). | Data stored within an availability zone. |
| **Zone redundant backup** | Flexible server backups are automatically and securely stored in a zone redundant storage within a region if the region supports AZs. During a zone-level failure where your server is provisioned, and if your server isn't configured with zone redundancy, you can still restore your database using the latest restore point in a different zone. For more information, see [Concepts - Backup and Restore](./concepts-backup-restore.md).| Only applicable in regions where multiple zones are available.|
| **Geo redundant backup** | Flexible server backups are copied to a remote region. that helps with disaster recovery situation in the event of the primary server region is down. | This feature is currently enabled in selected regions. It takes a longer RTO and a higher RPO depending on the size of the data to restore and amount of recovery to perform.  |
| **Read Replica** | Cross Region read replicas can be deployed to protect your databases from region-level failures. Read replicas are updated asynchronously using PostgreSQL's physical replication technology, and may lag the primary. For more information, see [Concepts - Read Replicas](./concepts-read-replicas.md).| Supported in general purpose and memory optimized compute tiers. |


The following table compares RTO and RPO in a **typical workload** scenario:

| **Capability** | **Burstable** | **General Purpose** | **Memory optimized** |
| :------------: | :-------: | :-----------------: | :------------------: |
| Point in Time Restore from backup | Any restore point within the retention period <br/> RTO - Varies <br/>RPO < 15 min| Any restore point within the retention period <br/> RTO - Varies <br/>RPO < 15 min | Any restore point within the retention period <br/> RTO - Varies <br/>RPO < 15 min |
| Geo-restore from geo-replicated backups | RTO - Varies <br/>RPO < 1 h  | RTO - Varies <br/>RPO < 1 h | RTO - Varies <br/>RPO < 1 h |
| Read replicas | RTO - Minutes* <br/>RPO < 5 min* | RTO - Minutes* <br/>RPO < 5 min*| RTO - Minutes* <br/>RPO < 5 min*|

\* RTO and RPO **can be much higher** in some cases depending on various factors including latency between sites, the amount of data to be transmitted, and importantly primary database write workload. 


## Planned downtime events

Below are some planned maintenance scenarios. These events typically incur up to few minutes of downtime, and without data loss.

| **Scenario** | **Process**|
| ------------------- | ----------- | 
| <b>Compute scaling (User-initiated)| During compute scaling operation, active checkpoints are allowed to complete, client connections are drained, any uncommitted transactions are canceled, storage is detached, and then it's shut down. A new flexible server with the same database server name is provisioned with the scaled compute configuration. The storage is then attached to the new server and the database is started which performs recovery if necessary before accepting client connections. |
| <b>Scaling up storage (User-initiated) | When a scaling up storage operation is initiated, active checkpoints are allowed to complete, client connections are drained, and any uncommitted transactions are canceled. After that the server is shut down. The storage is scaled to the desired size and then attached to the new server. A recovery is performed if needed before accepting client connections. Note that scaling down of the storage size isn't supported. |
| <b>New software deployment (Azure-initiated) | New features rollout or bug fixes automatically happen as part of service’s planned maintenance, and you can schedule when those activities to happen. For more information, check your [portal](https://aka.ms/servicehealthpm). | 
| <b>Minor version upgrades (Azure-initiated) | Azure Database for PostgreSQL automatically patches database servers to the minor version determined by Azure. It happens as part of service's planned maintenance. The database server is automatically restarted with the new minor version. For more information, see [documentation](../concepts-monitoring.md#planned-maintenance-notification). You can also check your [portal](https://aka.ms/servicehealthpm).| 

When the flexible server is configured with **high availability**, the flexible server performs the scaling and the maintenance operations on the standby server first. For more information, see [Concepts - High availability](./concepts-high-availability.md).

##  Unplanned downtime mitigation

Unplanned downtimes can occur as a result of unforeseen disruptions such as underlying hardware fault, networking issues, and software bugs. If the database server configured with high availability goes down unexpectedly, then the standby replica is activated and the clients can resume their operations. If not configured with high availability (HA), then if the restart attempt fails, a new database server is automatically provisioned. While an unplanned downtime can't be avoided, flexible server helps mitigating the downtime by automatically performing recovery operations without requiring human intervention. 

Though we continuously strive to provide high availability, there are times when Azure Database for PostgreSQL - Flexible Server service does incur outage causing unavailability of the databases and thus impacting your application. When our service monitoring detects issues that cause widespread connectivity errors, failures or performance issues, the service automatically declares an outage to keep you informed.
### Service Outage

In the event of the Azure Database for PostgreSQL - Flexible Server service outage, you'll be able to see additional details related to the outage in the following places.

* **Azure portal banner**
If your subscription is identified to be impacted, there will be an outage alert of a Service Issue in your Azure portal **Notifications**.
:::image type="content" source="./media/business-continuity/notification-service-issue-example.png" alt-text=" Screenshot showing notifications in Azure portal.":::
* **Help + support** or **Support + troubleshooting**
When you create support ticket from **Help + support** or **Support + troubleshooting**, there will be information about any issues impacting your resources. Select View outage details for more information and a summary of impact. There will also be an alert in the New support request page.
:::image type="content" source="./media/business-continuity/help-support-service-health-notification.png" alt-text=" Screenshot showing Help Support notifications in Azure portal.":::
*  **Service Help**
The **Service Health** page in the Azure portal contains information about Azure data center status globally. Search for "service health" in the search bar in the Azure portal, then view Service issues in the Active events category. You can also view the health of individual resources in the **Resource health** page of any resource under the Help menu. A sample screenshot of the Service Health page follows, with information about an active service issue in Southeast Asia.
:::image type="content" source="./media/business-continuity/service-health-service-issues-example-map.png" alt-text=" Screenshot showing service outage in Service Health portal.":::

*  **Email notification** 
If you've set up alerts, an email notification will arrive when a service outage impacts your subscription and resource. The emails arrive from "azure-noreply@microsoft.com". The body of the email begins with "The activity log alert ... was triggered by a service issue for the Azure subscription...". For more information on service health alerts, see [Receive activity log alerts on Azure service notifications using Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal).


> [!IMPORTANT]
> As the name implies, temporary tablespaces in PostgreSQL are used for temporary objects, as well as other internal database operations, such as sorting. Therefore we do not recommend creating user schema objects in temporary tablespace, as we dont guarantee durability of such objects after Server restarts, HA failovers, etc.


### Unplanned downtime: failure scenarios and service recovery

Below are some unplanned failure scenarios and the recovery process. 

| **Scenario** | **Recovery process** <br> [Servers configured without zone-redundant HA]| **Recovery process** <br> [Servers configured with Zone-redundant HA] |
| ---------- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| ------- |
| <B>Database server failure | If the database server is down, Azure will attempt to restart the database server. If that fails, the database server will be restarted on another physical node.  <br /> <br /> The recovery time (RTO) is dependent on various factors including the activity at the time of fault such as large transaction and the volume of recovery to be performed during the database server startup process. <br /> <br /> Applications using the PostgreSQL databases need to be built in a way that they detect and retry dropped connections and failed transactions.                                                                                                                                                                  | If the database server failure is detected, the server is failed over to the standby server, thus reducing downtime. For more information, see [HA concepts page](./concepts-high-availability.md). RTO is expected to be 60-120s, with zero data loss. |
| <B>Storage failure | Applications don't see any impact for any storage-related issues such as a disk failure or a physical block corruption. As the data is stored in three copies, the copy of the data is served by the surviving storage. The corrupted data block is automatically repaired and a new copy of the data is automatically created.                                                                                                                                                                                                                                                                                                                                                                                                   | For any rare and non-recoverable errors such as the entire storage is inaccessible, the flexible server is failed over to the standby replica to reduce the downtime. For more information, see [HA concepts page](./concepts-high-availability.md). |
| <b> Logical/user errors | To recover from user errors, such as accidentally dropped tables or incorrectly updated data, you have to perform a [point-in-time recovery](../concepts-backup.md) (PITR). While performing the restore operation, you specify the custom restore point, which is the time right before the error occurred.<br> <br>  If you want to restore only a subset of databases or specific tables rather than all databases in the database server, you can restore the database server in a new instance, export the table(s) via [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html), and then use [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) to restore those tables into your database. | These user errors aren't protected with high availability as all changes are replicated to the standby replica synchronously. You have to perform point-in-time restore to recover from such errors. |
| <b> Availability zone failure | To recover from a zone-level failure, you can perform point-in-time restore using the backup and choosing a custom restore point with the latest time to restore the latest data. A new flexible server will be deployed in another non-impacted zone. The time taken to restore depends on the previous backup and the volume of transaction logs to recover.                                                                                                                                                                                                                                                                                                                                                                     | Flexible server is automatically failed over to the standby server within 60-120s with zero data loss. For more information, see [HA concepts page](./concepts-high-availability.md). | 
| <b> Region failure | If your server is configured with geo-redundant backup, you can perform geo-restore in the paired region. A new server will be provisioned and recovered to the last available data that was copied to this region. <br /> <br /> You can also use cross region read replicas. In the event of region failure you can perform disaster recovery operation by promoting your read replica to be a standalone read-writeable server. RPO is expected to be up to 5 minutes (data loss possible) except in the case of severe regional failure when the RPO can be close to the replication lag at the time of failure.                                                                                                               | Same process. |


### Configure your database after recovery from regional failure

* If you are using geo-restore or geo-replica to recover from an outage, you must make sure that the connectivity to the new server is properly configured so that the normal application function can be resumed. You can follow the [Post-restore tasks](concepts-backup-restore.md#geo-redundant-backup-and-restore).
* If you've previously set up a diagnostic setting on the original server, make sure to do the same on the target server if necessary as explained in [Configure and Access Logs in Azure Database for PostgreSQL - Flexible Server](howto-configure-and-access-logs.md).
* Setup telemetry alerts, you need to make sure your existing alert rule settings are updated to map to the new server. For more information about alert rules, see [Use the Azure portal to set up alerts on metrics for Azure Database for PostgreSQL - Flexible Server](howto-alert-on-metrics.md).


> [!IMPORTANT]
> Deleted servers can be restored. If you delete the server, you can follow our guidance [Restore a dropped Azure Database for PostgreSQL Flexible server](how-to-restore-dropped-server.md) to recover. Use Azure resource lock to help prevent accidental deletion of your server.

## Next steps

-   Learn about [high availability deployment models](./concepts-high-availability.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)
