---
title: Overview of high availability with Azure Database for PostgreSQL - Flexible Server 
description: Learn about the concepts of high availability with Azure Database for PostgreSQL - Flexible Server
ms.author: sunila
author: sunilagarwal
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/05/2022
---

# High availability concepts in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL - Flexible Server offers high availability configurations with automatic failover capabilities. The high availability solution is designed to ensure that committed data is never lost because of failures and that the database won't be a single point of failure in your architecture. When high availability is configured, flexible server automatically provisions and manages a standby. Write-ahead-logs (WAL) is streamed to the replica in synchronous mode using PostgreSQL streaming replication. There are two high availability architectural models: 

* **Zone-redundant HA**: This option provides a complete isolation and redundancy of infrastructure across multiple availability zones within a region. It provides the highest level of availability, but it requires you to configure application redundancy across availability zones. Zone-redundant HA is preferred when you want protection from availability zone failures. However, one should account for added latency for cross-AZ synchronous writes. This latency is more pronounced for applications with short duration transactions.  Zone-redundant HA is available in a [subset of Azure regions](./overview.md#azure-regions) where the region supports multiple [availability zones](../../availability-zones/az-overview.md). Uptime [SLA of 99.99%](https://azure.microsoft.com/support/legal/sla/postgresql) is offered in this configuration.
* **Same-zone HA**: This option provide for infrastructure redundancy with lower network latency because the primary and standby servers will be in the same availability zone. It provides high availability without the need to configure application redundancy across zones. Same-zone HA is preferred when you want to achieve the highest level of availability within a single availability zone. This option lowers the latency impact but makes your application vulnerable to zone failures.  Same-zone HA is available in all [Azure regions](./overview.md#azure-regions) where you can deploy Flexible Server.  Uptime [SLA of 99.95%](https://azure.microsoft.com/support/legal/sla/postgresql) offered in this configuration. 
   
High availability configuration enables automatic failover capability with zero data loss (i.e. RPO=0) both during planned/unplanned events. For example, user-initiated scale compute operation is a planned failover even while unplanned event refers to failures such as underlying hardware and software faults, network failures, and availability zone failures. 

>[!NOTE]
> Both these HA deployment models architecturally behave the same. Various discussions in the following sections are applicable to both unless called out otherwise. 

## High availability architecture

As mentioned earlier, Azure Database for PostgreSQL Flexible server supports two high availability deployment models: zone-redundant HA and same-zone HA. In both deployment models, when the application commits a transaction, the transaction logs (write-ahead logs a.k.a WAL) are written to the data/log disk and also replicated in *synchronous* mode to the standby server. Once the logs are persisted on the standby, the transaction is considered committed and an acknowledgement is sent to the application. The standby server is always in recovery mode applying the transaction logs. However, the primary server doesn't wait for standby to apply these log records. It is possible that under heavy transaction workload, the replica server may fall behind but typically catches up to the primary with workload throughput fluctuations.

### Zone-redundant high availability

This high availability deployment enables Flexible server to be highly available across availability zones. You can choose the region, availability zones for the primary and standby servers. The standby replica server is provisioned in the chosen availability zone in the same region with similar compute, storage, and network configuration as the primary server. Data files and transaction log files (write-ahead logs a.k.a WAL) are stored on locally redundant storage (LRS) within each availability zone, which automatically stores **three** data copies. This provides physical isolation of the entire stack between primary and standby servers. 

>[!NOTE]
> Not all regions support availability zone to deploy zone-redundant high availability. See this [Azure regions](./overview.md#azure-regions) list.

Automatic backups are performed periodically from the primary database server, while the transaction logs are continuously archived to the backup storage from the standby replica. Backup data is stored on zone-redundant storage.
:::image type="content" source="./media/business-continuity/concepts-zone-redundant-high-availability-architecture.png" alt-text="zone redundant high availability"::: 

### Same-zone high availability

This model of high availability deployment enables Flexible server to be highly available within the same availability zone. This is supported in all regions, including regions that don't support availability zones. You can choose the region and the availability zone to deploy your primary database server. A standby server is **automatically** provisioned and managed in the **same** availability zone in the same region with similar compute, storage, and network configuration as the primary server. Data files and transaction log files (write-ahead logs a.k.a WAL) are stored on locally redundant storage, which automatically stores as **three** synchronous data copies each for primary and standby. This provides physical isolation of the entire stack between primary and standby servers within the same availability zone. 

Automatic backups are performed periodically from the primary database server, while the transaction logs are continuously archived to the backup storage from the standby replica. If the region supports availability zones, then backup data is stored on zone-redundant storage (ZRS). In regions that doesn't support availability zones, backup data is stored on local redundant storage (LRS).   
:::image type="content" source="./media/business-continuity/concepts-same-zone-high-availability-architecture.png" alt-text="Same-zone high availability"::: 


## Components and workflow

### Transaction completion

Application transaction triggered writes and commits are first logged to the WAL on the primary server. It is then streamed to the standby server using Postgres streaming protocol. Once the logs are persisted on the standby server storage, the primary server is acknowledged of write completion. Only then and the application is confirmed of the writes. This additional round-trip adds more latency to your application. The percentage of impact depends on the application. This acknowledgement process does not wait for the logs to be applied at the standby server. The standby server is permanently in recovery mode until it is promoted.

### Health check 

Flexible server has a health monitoring in place that checks for the primary and standby health periodically. If that detects primary server is not reachable after multiple pings, it makes the decision to initiate an automatic failover or not. The algorithm is based on multiple data points to avoid any false positive situation. 

### Failover modes

There are two failover modes. 

1. With [**planned failovers**](#failover-process---planned-downtimes) (example: During maintenance window) where the failover is triggered with a known state in which the primary connections are drained, a clean shutdown is performed before the replication is severed. You can also use this to bring the primary server back to your preferred AZ. 
 
  2. With [**unplanned failover**](#failover-process---unplanned-downtimes) (example: Primary server node crash), the primary is immediately fenced and hence any in-flight transactions are lost and to be retried by the application. 

In both the failover modes, once the replication is severed, the standby server runs the recovery before being promoted as a primary, and opened for read/write. With automatic DNS entries updated with the new primary server endpoint, applications can connect to the server using the same server endpoint. A new standby server is established in the background and that don’t block your application connectivity.

### Downtime

In all cases, you must observe any downtime from your application/client side. Your application will be able to reconnect after a failover as soon as the DNS is updated. We take care of a few more aspects including LSN comparisons between primary and standby before fencing the writes. But with unplanned failovers, the time taken for the standby can be longer than 2 minutes in some cases due to the volume  of logs to recover before opening for read/write.

## HA status

The health of primary and standby servers are continuously monitored and appropriate actions are taken to remediate issues including triggering a failover to the standby server. The high availability statuses are listed below:

| **Status** | **Description** |
| ------- | ------ |
| <b> Initializing | In the process of creating a new standby server. |
| <b> Replicating Data | After the standby is created, it is catching up with the primary. |
| <b> Healthy | Replication is in steady state and healthy. |
| <b> Failing Over | The database server is in the process of failing over to the standby. |
| <b> Removing Standby | In the process of deleting standby server. | 
| <b> Not Enabled | Zone redundant high availability is not enabled.  |

>[!NOTE]
> You can enable high availability during server creation or at a later time as well. If you are enabling or disabling high availability during post-create stage, it is recommended to perform the operation when the primary server activity is low.

## Steady-state operations

PostgreSQL client applications are connected to the primary server using the DB server name. Application reads are served directly from the primary server, while commits and writes are confirmed to the application only after the log data is persisted on both the primary server and the standby replica. Due to this additional round-trip, applications can expect elevated latency for writes and commits. You can monitor the health of the high availability on the portal.

:::image type="content" source="./media/business-continuity/concepts-high-availability-steady-state.png" alt-text="high availability - steady state"::: 

1. Clients connect to the flexible server and perform write operations.
2. Changes are replicated to the standby site.
3. Primary receives acknowledgment.
4. Writes/commits are acknowledged.

## Failover process - planned downtimes

Planned downtime events include Azure scheduled periodic software updates and minor version upgrades. When configured in high availability, these operations are first applied to the standby replica while the applications continue to access the primary server. Once the standby replica is updated, primary server connections are drained, and a failover is triggered which activates the standby replica to be the primary with the same database server name. Client applications will have to reconnect with the same database server name to the new primary server and can resume their operations. A new standby server will be established in the same zone as the old primary. 

For other user initiated operations such as scale-compute or scale-storage, the changes are applied at the standby first, followed by the primary. Currently, the service is not failed over to the standby and hence while the scale operation is carried out on the primary server, applications will encounter a short downtime.

### Reducing planned downtime with managed maintenance window

With flexible server, you can optionally schedule Azure initiated maintenance activities by choosing a 60-minute window in a day of your preference where the activities on the databases are expected to be low. Azure maintenance tasks such as patching or minor version upgrades would happen during that maintenance window. If you do not choose a custom window, a system allocated 1-hr window between 11pm-7am local time is chosen for your server. 
 
For flexible servers configured with high availability, these maintenance activities are performed on the standby replica first and the service is failed over to the standby to which applications can reconnect.

## Failover process - unplanned downtimes

- Unplanned outages include software bugs or infrastructure component failures that impact the availability of the database. If the primary server becomes unavailable, it is detected by the monitoring system and initiates a failover process.  The process includes a few seconds of wait time to make sure it is not a false positive. The replication to the standby replica is severed and the standby replica is activated to be the primary database server. That includes the standby to recover any residual WAL files. Once it is fully recovered, DNS for the same end point is updated with the standby server's IP address. Clients can then retry connecting to the database server using the same connection string and resume their operations. 

> [!NOTE]
> Flexible servers configured with zone-redundant high availability provide a recovery point objective (RPO) of **Zero** (no data loss). The recovery time objective (RTO) is expected to be **less than 120s** in typical cases. However, depending on the activity in the primary database server at the time of the failover, the failover may take longer. 


After the failover, while a new standby server is being provisioned (which usually takes 5-10 minutes), applications can still connect to the primary server and proceed with their read/write operations. Once the standby server is established, it will start recovering the logs that were generated after the failover. 

:::image type="content" source="./media/business-continuity/concepts-high-availability-failover-state.png" alt-text="high availability - failover"::: 

1. Primary database server is down and the clients lose database connectivity. 
2. Standby server is activated to become the new primary server. The client connects to the new primary server using the same connection string. Having the client application in the same zone as the primary database server reduces latency and improves performance.
3. Standby server is established in the same zone as the old primary server and the streaming replication is initiated. 
4. Once the steady-state replication is established, the client application commits and writes are acknowledged after the data is persisted on both sites.

## On-demand failover

Flexible server provides two methods for you to perform on-demand failover to the standby server. These are useful if you want to test the failover time and downtime impact for your applications and if you want to fail over to the preferred availability zone. 

### Forced failover

You can use this feature to simulate an unplanned outage scenario while running your production workload and observe your application downtime. Alternatively, in rare case where your primary server becomes unresponsive for whatever reason, you may use this feature. 

This feature brings the primary server down and initiates the failover workflow in which the standby promote operation is performed. Once the standby completes the recovery process till the last committed data, it is promoted to be the primary server. DNS records are updated and your application can connect to the promoted primary server. Your application can continue to write to the primary while a new standby server is established in the background and that doesn't impact the uptime. 

The following are the steps during forced-failover:

  | **Step** | **Description** | **App downtime expected?** |
  | ------- | ------ | ----- |
  | 1 | Primary server is stopped shortly after the failover request is received. | Yes |
  | 2 | Application encounters downtime as the primary server is down. | Yes |
  | 3 | Internal monitoring system detects the failure and initiates a failover to the standby server. | Yes |
  | 4 | Standby server enters recovery mode before being fully promoted as an independent server. | Yes |
  | 5 | The failover process waits for the standby recovery to complete. | Yes |
  | 6 | Once the server is up, DNS record is updated with the same hostname, but using the standby's IP address. | Yes |
  | 7 | Application can reconnect to the new primary server and resume the operation. | No |
  | 8 | A standby server in the preferred zone is established. | No |
  | 9 | Standby server starts to recover logs (from Azure BLOB) that it missed during its establishment. | No |
  | 10 | A steady-state between the primary and the standby server is established. | No |
  | 11 | Forced failover process is complete. | No |

Application downtime is expected to start after step #1 and persists until step #6 is completed. The rest of the steps happen in the background without impacting the application writes and commits.

>[!Important]
>The end-to-end failover process includes (a) failing over to the standby server after the primary failure and (b) establishing a new standby server in a steady-state. As your application incurs downtime only until the failover to the standby is complete, **please measure the downtime from your application/client perspective** instead of the overall end-to-end failover process. 

### Planned failover

You can use this feature for failing over to the standby server with reduced downtime. For example, after an unplanned failover, your primary could be on a different availability zone than the application, and you want to bring the primary server back to the previous zone to colocate with your application.

When executing this feature, the standby server is first prepared to make sure it is caught up with recent transactions allowing the application to continue to perform read/writes. The standby is then promoted and the connections to the primary are severed. Your application can continue to write to the primary while a new standby server is established in the background. The following are the steps involved with planned failover.

| **Step** | **Description** | **App downtime expected?** |
  | ------- | ------ | ----- |
  | 1 | Wait for the standby server to have caught-up with primary. | No |
  | 2 | Internal monitoring system initiates the failover workflow. | No |
  | 3 | Application writes are blocked when the standby server is close to primary log sequence number (LSN). | Yes |
  | 4 | Standby server is promoted to be an independent server. | Yes |
  | 5 | DNS record is updated with the new standby server's IP address. | Yes |
  | 6 | Application to reconnect and resume its read/write with new primary | No |
  | 7 | A new standby server in another zone is established. | No |
  | 8 | Standby server starts to recover logs (from Azure BLOB) that it missed during its establishment. | No |
  | 9 | A steady-state between the primary and the standby server is established. | No |
  | 10 |  Planned failover process is complete. | No |

Application downtime starts at step #3 and can resume operation post step #5. The rest of the steps happen in the background without impacting application writes and commits. 

### Considerations while performing on-demand failovers

* The overall end-to-end operation time may be seen longer than the actual downtime experienced by the application. **Please observe the downtime from the application perspective**.
* Please do not perform immediate, back-to-back failovers. Wait for at least 15-20 minutes between failovers, which will  allow the new standby server to be fully established.
* For the planned failover with reduced downtime, it is recommended to perform during low activity period.

See [this guide](how-to-manage-high-availability-portal.md) for managing high availability.


## Point-in-time restore of HA servers

Flexible servers that are configured with high availability, log data is replicated in real time to the standby server. Any user errors on the primary server - such as an accidental drop of a table or incorrect data updates are replicated to the standby replica as well. So, you cannot use standby to recover from such logical errors. To recover from such errors, you have to perform point-in-time restore from the backup. Using flexible server's point-in-time restore capability, you can restore to the time before the error occurred. For databases configured with high availability, a new database server will be restored as a single zone flexible server with a new user-provided server name. You can use the restored server for few use cases:

1. You can use the restored server for production usage and can optionally enable zone-redundant high availability.
  2. If you just want to restore an object, you can then export the object from the restored database server and import it to your production database server.
  3. If you want to clone your database server for testing and development purposes, or you want to restore for any other purposes, you can perform point-in-time restore.

## High availability - features

* Standby replica will be deployed in an exact VM configuration same as the primary server, including vCores, storage, network settings (VNET, Firewall), etc.

* You can add high availability for an existing database server.

* You can remove standby replica by disabling high availability.

* For zone-redundant HA, you can choose your availability zones for your primary and standby database servers.

* Operations such as stop, start, and restart are performed on both primary and standby database servers at the same time.

* Automatic backups are performed from the primary database server and stored in a zone redundant backup storage.

* Clients always connect to the end host name of the primary database server.

* Any changes to the server parameters are applied to the standby replica as well.

* Ability to restart the server to pick up any static server parameter changes.
  
* Periodic maintenance activities such as minor version upgrades happen at the standby first and the service is failed over to reduce downtime.  

## High availability - limitations

* High availability is not supported with burstable compute tier.
* High availability is supported only in regions where multiple zones are available.
* Due to synchronous replication to the standby server, especially with zone-redundant HA, applications can experience elevated write and commit latency.

* Standby replica cannot be used for read queries.

* Depending on the workload and activity on the primary server, the failover process might take longer than 120 seconds due to recovery involved at the standby replica before it can be promoted. 
* The standby server typically recovers WAL files at the rate of 40 MB/s. If your workload exceeds this limit, you may encounter extended time for the recovery to complete either during the failover or after establishing a new standby. 

* Restarting the primary database server also restarts standby replica. 

* Configuring additional standbys is not supported.

* Configuring customer initiated management tasks cannot be scheduled during managed maintenance window.

* Planned events such as scale compute and scale storage happens in the standby first and then on the primary server. Currently the server doesn't fail over for these planned operations. 

* If logical decoding or logical replication is configured with a HA configured flexible server, in the event of a failover to the standby server, the logical replication slots are not copied over to the standby server.  

## Availability for non-HA servers

For Flexible servers configured **without** high availability, the service still provides built-in availability, storage redundancy and resiliency to help to recover from any planned or unplanned downtime events. Uptime [SLA of 99.9%](https://azure.microsoft.com/support/legal/sla/postgresql) is offered in this non-HA configuration.
  
During planned or unplanned failover events, if the server goes down, the service maintains high availability of the servers using following automated procedure:

1. A new compute Linux VM is provisioned.
2. The storage with data files is mapped to the new Virtual Machine
3. PostgreSQL database engine is brought online on the new Virtual Machine.

Picture below shows transition for VM and storage failure.

:::image type="content" source="./media/business-continuity/concepts-availability-without-zone-redundant-ha-architecture.png" alt-text="Diagram that shows availability without zone redundant ha - steady state." border="false" lightbox="./media/business-continuity/concepts-availability-without-zone-redundant-ha-architecture.png"::: 

### Planned downtime 

Here are some planned maintenance scenarios:

| **Scenario** | **Description**|
| ------------ | ----------- |
| <b>Compute scale up/down | When the user performs compute scale up/down operation, a new database server is provisioned using the scaled compute configuration. In the old database server, active checkpoints are allowed to complete, client connections are drained, any uncommitted transactions are canceled, and then it is shut down. The storage is then detached from the old database server and attached to the new database server. It will be up and running to accept any connections.|
| <b>Scaling Up Storage | Scaling up the storage is currently an offline operation which involves a short downtime.|
| <b>New Software Deployment (Azure) | New features rollout or bug fixes automatically happen as part of service’s planned maintenance. For more information, see the [documentation](./concepts-maintenance.md), and also check your [portal](https://aka.ms/servicehealthpm).|
| <b>Minor version upgrades | Azure Database for PostgreSQL automatically patches database servers to the minor version determined by Azure. It happens as part of service's planned maintenance. This would incur a short downtime in terms of seconds, and the database server is automatically restarted with the new minor version. For more information, see the [documentation](./concepts-maintenance.md), and also check your [portal](https://aka.ms/servicehealthpm).|


###  Unplanned downtime 

Unplanned downtime can occur as a result of unforeseen failures, including underlying hardware fault, networking issues, and software bugs. If the database server goes down unexpectedly, a new database server is automatically provisioned in seconds. The remote storage is automatically attached to the new database server. PostgreSQL engine performs the recovery operation using WAL and database files, and opens up the database server to allow clients to connect. Uncommitted transactions are lost, and they have to be retried by the application. While an unplanned downtime cannot be avoided, Flexible server mitigates the downtime by automatically performing recovery operations at both database server and storage layers without requiring human intervention. 

Here are some failure scenarios and how Flexible server automatically recovers:

| **Scenario** | **Automatic recovery** |
| ---------- | ---------- |
| <B>Database server failure | If the database server is down because of some underlying hardware fault, active connections are dropped, and any inflight transactions are aborted. A new database server is automatically deployed, and the remote data storage is attached to the new database server. After the database recovery is complete, clients can connect to the new database server using the same endpoint. <br /> <br /> The recovery time (RTO) is dependent on various factors including the activity at the time of fault such as large transaction and the amount of recovery to be performed during the database server startup process. <br /> <br /> Applications using the PostgreSQL databases need to be built in a way that they detect and retry dropped connections and failed transactions.  |
| <B>Storage failure | Applications do not see any impact for any storage-related issues such as a disk failure or a physical block corruption. As the data is stored in 3 copies, the copy of the data is  served by the surviving storage. Block corruptions are automatically corrected. If a copy of data is lost, a new copy of the data is automatically created. |

Here are some failure scenarios that require user action to recover:

| **Scenario** | **Recovery plan**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <b> Availability zone failure | If the region supports multiple availability zones, then the backups are automatically stored in zone-redundant backup storage. In the event of a zone failure, you can restore from the backup to another availability zone. This provides zone-level resiliency. However, this incurs time to restore and recovery. There could be some data loss as not all WAL records may have been copied to the backup storage. <br> <br> If you prefer to have a short downtime and high uptime, we recommend you to configure your server with zone-redundant high availability.                                                                                                                      |
| <b> Logical/user errors | Recovery from user errors, such as accidentally dropped tables or incorrectly updated data, involves performing a [point-in-time recovery](./concepts-backup-restore.md) (PITR), by restoring and recovering the data until the time just before the error had occurred.<br> <br>  If you want to restore only a subset of databases or specific tables rather than all databases in the database server, you can restore the database server in a new instance, export the table(s) via [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html), and then use [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) to restore those tables into your database. |

## Frequently asked questions

### HA configuration questions

* **Where can I see the SLAs offered with Flexible server?** <br>
    [Azure Database for PostgreSQL SLAs](https://azure.microsoft.com/support/legal/sla/postgresql).

* **Do I need to have HA to protect my server from unplanned outages?** <br>
    No. Flexible server offers local redundant storage with 3 copies of data, zone-redundant backup (in regions where it is supported), and also built-in server resiliency to automatically restart a crashed server and even relocate server to another physical node. Zone redundant HA will provide higher uptime by performing automatic failover to another running (standby) server in another zone and thus provides zone-resilient high availability with zero data loss.

* **Can I choose the availability zones for my primary and standby servers?** <br>
    If you choose same zone HA, then you can only choose the primary server. If you choose zone redundant HA, then you can choose both primary and standby AZs.

* **Is zone redundant HA available in all regions?** <br>
    Zone-redundant HA is available in regions that support multiple AZs in the region. For the latest region support, please see [this documentation](overview.md#azure-regions). We are continuously adding more regions and enabling multiple AZs.  Same-zone HA is available in all supported regions. 

* **Can I deploy both zone redundant HA and same zone HA at the same time?** <br>
    No. You can deploy only one of those options.

* **Can I directly convert same-zone HA to zone-redundant HA and vice-versa?** <br>
    No. You first have to disable HA, wait for it to complete, and then choose the other HA deployment model.

* **What mode of replication is between primary and standby servers?** <br>
    Synchronous mode of replication is established between the primary and the standby server. Application writes and commits are acknowledged only after the Write Ahead Log (WAL) data is persisted on the standby site. This enables zero data loss in the event of a failover.

* **Synchronous mode incurs latency. What kind of performance impact I can expect for my application?** <br>
    Configuring in HA induces some latency to writes and commits. No impact to read queries. The performance impact varies depending on your workload. As a general guideline, writes and commit impact can be around 20-30% impact. 

* **Does the zone-redundant HA provides protection from planned and unplanned outages?** <br>
    Yes. The main purpose of HA is to offer higher uptime to mitigate from any outages. In the event of an unplanned outage - including a fault in database, VM, physical node, data center, or at the AZ-level, the monitoring system automatically fails over the server to the standby. Similarly, during planned outages including minor version updates or infrastructure patching that happen during scheduled maintenance window, the updates are applied at the standby first and the service is failed over while the old primary goes through the update process. This reduces the overall downtime. 

* **Can I enable or disable HA at any point of time?** <br>

    Yes. You can enable or disable zone-redundant HA at any time except when the server is in certain states like stopped, restarting, or already in the process of failing over. 

* **Can I choose the AZ for the standby?** <br>
    No. Currently you cannot choose the AZ for the standby. We plan to add that capability in future.

* **Can I configure HA between private (VNET) and public access?** <br>
    No. You can either configure HA within a VNET (spanned across AZs within a region) or public access. 

* **Can I configure HA across regions?** <br>
    No. HA is configured within a region, but across availability zones. However, you can enable Geo-read-replica (s) in asynchronous mode to achieve Geo-resiliency.
* **Can I use logical replication with HA configured servers?** <br>
    You can configure logical replication with HA. However, after a failover, the logical slot details are not copied over to the standby. Hence, there is currently limited support for this configuration. If you must use logical replication, you will need to re-create it after every failover.
    
### Replication and failover related questions

* **How does flexible server provide high availability in the event of a fault - like AZ fault?** <br>
    When you enable your server with zone-redundant HA, a physical standby replica with the same compute and storage configuration as the primary is deployed automatically in a different availability zone than the primary. PostgreSQL streaming replication is established between the primary and standby servers. 

* **What is the typical failover process during an outage?** <br>
    When the fault is detected by the monitoring system, it initiates a failover workflow that involves making sure the standby has applied all residual WAL files and fully caught up before opening that for read/write. Then DNS is updated with the IP address of the standby before the clients can reconnect to the server with the same endpoint (host name). A new standby is instantiated to keep the configuration in a highly available mode.

* **What is the typical failover time and expected data loss during an outage?** <br>
    In a typical case, failover time or the downtime experienced by the application perspective is between 60s-120s. This can be longer in cases where the outage incurred during long running transactions, index creation, or during heavy write activities - as the standby may take longer to complete the recovery process.

    Since the replication happens in synchronous mode, no data loss is expected.

* **Do you offer SLA for the failover time?** <br>
    For the failover time, we provide guidelines on how long it typically takes for the operation. The official SLA is provided for the overall uptime. 

* **Does the application automatically connect to the server after the failover?** <br>
    No. Applications should have retry mechanism to reconnect to the same endpoint (hostname).

* **How do I test the failover?** <br>
    You can use **Forced failover** or **Planned failover** feature to test the failover. See **On-demand failover** section in this document for details.

* **How do I check the replication status?** <br>
    On portal, from the overview page of the server shows the Zone redundant high availability status and the server status. You can also check the status and the AZs for primary and standby from the High Availability blade of the server portal. 

    From psql, you can run `select * from pg_stat_replication;` which shows the streaming status amongst other details.

* **Do you support read queries on the standby replica?** <br>
    No. We do not support read queries on the standby replica.

* **When I do point-in-time recovery (PITR), will it automatically configure the restored server in HA?** <br>
    No. PITR server is restored as a standalone server. If you want to enable HA, you can do that after the restore is complete.


## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn how to [manage high availability](./how-to-manage-high-availability-portal.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)

