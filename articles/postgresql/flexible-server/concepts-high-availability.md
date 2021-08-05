---
title: Overview of zone redundant high availability with Azure Database for PostgreSQL - Flexible Server (Preview)
description: Learn about the concepts of zone redundant high availability with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 07/30/2021
---

# High availability concepts in Azure Database for PostgreSQL - Flexible Server

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

Azure Database for PostgreSQL - Flexible Server offers high availability configuration with automatic failover capability using **zone redundant** server deployment. When deployed in a zone redundant configuration, flexible server automatically provisions and manages a standby replica in a different availability zone. Using PostgreSQL streaming replication, the data is replicated to the standby replica server in **synchronous** mode. 

Zone redundant configuration enables automatic failover capability with zero data loss during planned events such as user-initiated scale compute operation, and also during unplanned events such as underlying hardware and software faults, network failures, and availability zone failures. 

:::image type="content" source="./media/business-continuity/concepts-zone-redundant-high-availability-architecture.png" alt-text="zone redundant high availability"::: 

## Zone redundant high availability architecture

Zone-redundant deployment enables Flexible server to be highly available. You can choose the region and the availability zone to deploy your primary database server. A standby replica server is **automatically** provisioned and managed in a different availability zone in the same region with the same compute, storage, and network configuration as the primary server. Data files and transaction log files (write-ahead logs a.k.a WAL) are stored on locally redundant storage within each availability zone which automatically stores as 3 data copies. This provides physical isolation of the entire stack between primary and standby servers.  

When the application performs writes or commits, using PostgreSQL streaming replication, transaction logs (write-ahead logs a.k.a WAL) are written to the local disk and also replicated in *synchronous* mode to the standby replica. Once the logs are persisted on the standby replica, the application is acknowledged of the writes or commits. The standby server will be in recovery mode which keeps applying the logs, but the primary server does not wait for the apply to complete.

Automatic backups are performed periodically from the primary database server, while the transaction logs are continuously archived to the backup storage from the standby replica.

The health of primary and standby servers are continuously monitored and appropriate actions are taken to remediate issues including triggering a failover to the standby server. The zone redundant high availability statuses are listed below:

| **Status** | **Description** |
| ------- | ------ |
| <b> Initializing | In the process of creating a new standby server |
| <b> Replicating Data | After the standby is created, it is catching up with the primary. |
| <b> Healthy | Replication is in steady state and healthy. |
| <b> Failing Over | The database server is in the process of failing over to the standby. |
| <b> Removing Standby | In the process of deleting standby server. | 
| <b> Not Enabled | Zone redundant high availability is not enabled.  |

>[!NOTE]
> You can enable high availability during server creation or at a later time as well. If you are enabling or disabling high availability during post-create stage, it is recommended to perform the opreation when the primary server activity is low.

## Steady-state operations

PostgreSQL client applications are connected to the primary server using the DB server name. Application reads are served directly from the primary server, while commits and writes are confirmed to the application only after the log data is persisted on both the primary server and the standby replica. Due to this additional round-trip, applications can expect elevated latency for writes and commits. You can monitor the health of the high availability on the portal.

:::image type="content" source="./media/business-continuity/concepts-high-availability-steady-state.png" alt-text="zone redundant high availability - steady state"::: 

1. Clients connect to the flexible server and performs write operations.
2. Changes are replicated to the standby site.
3. Primary receives acknowledgment.
4. Writes/commits are acknowledged.

## Failover process - planned downtimes

Planned downtime events include Azure scheduled periodic software updates and minor version upgrades. When configured in high availability, these operations are first applied to the standby replica while the applications continue to access the primary server. Once the standby replica is updated, primary server connections are drained, and a failover is triggered which activates the standby replica to be the primary with the same database server name. Client applications will have to reconnect with the same database server name to the new primary server and can resume their operations. A new standby server will be established in the same zone as the old primary. 

For other user initiated operations such as scale-compute or scale-storage, the changes are applied at the standby first, followed by the primary. Currently, the service is not failed over to the standby and hence while the scale operation is carried out on the primary server, applications will encounter a short downtime.

### Reducing planned downtime with managed maintenance window

With flexible server, you can optionally schedule Azure initiated maintenance activities by choosing a 30-minute window in a day of your preference where the activities on the databases are expected to be low. Azure maintenance tasks such as patching or minor version upgrades would happen during that maintenance window. If you do not choose a custom window, a system allocated 1-hr window between 11pm-7am local time is chosen for your server. 
 
For flexible servers configured with high availability, these maintenance activities are performed on the standby replica first and the service is failed over to the standby to which applications can reconnect.

## Failover process - unplanned downtimes

Unplanned outages include software bugs or infrastructure component failures that impact the availability of the database. In the event of the primary server becomes unavailable, it is detected by the monitoring system and initiates a failover process.  The process includes a few seconds of wait time to make sure it is not a false positive. The replication to the standby replica is severed and the standby replica is activated to be the primary database server. That includes the standby to recovery any residual WAL files. Once it is fully recovered, DNS for the same end point is updated with the standby server's IP address. Clients can then retry connecting to the database server using the same connection string and resume their operations. 

>[!NOTE]
> Flexible servers configured with zone-redundant high availability provide a recovery point objective (RPO) of **Zero** (no data loss.The recovery tome objective (RTO) is expected to be **less than 120s** in typical cases. However, depending on the activity in the primary database server at the time of the failover, the failover may take longer. 

After the failover, while a new standby server is being provisioned, applications can still connect to the primary server and proceed with their read/write operations. Once the standby server is established, it will start recovering the logs that were generated after the failover. 

:::image type="content" source="./media/business-continuity/concepts-high-availability-failover-state.png" alt-text="zone redundant high availability - failover"::: 

1. Primary database server is down and the clients lose database connectivity. 
2. Standby server is activated to become the new primary server. The client connects to the new primary server using the same connection string. Having the client application in the same zone as the primary database server reduces latency and improves performance.
3. Standby server is established in the same zone as the old primary server and the streaming replication is initiated. 
4. Once the steady-state replication is established, the client application commits and writes are acknowledged after the data is persisted on both the sites.

## On-demand failover

Flexible server provides two methods for you to perform on-demand failover to the standby server. These are useful if you want to test the failover time and downtime impact for your applications and if you want to failover to the preferred availability zone. 

### Forced failover

You can use this feature to simulate an unplanned outage scenario while running your production workload and observe your application downtime. Alternatively, in rare case where your primary server becomes unresponsive for whatever reason, you may use this feature. 

This feature triggers brings the primary server down and initiates the failover workflow in which the standby promote operation is performed. Once the standby completes the recovery process till the last committed data, it is promoted to be the primary server. DNS records are updated and your application can connect to the promoted primary server. Your application can continue to write to the primary while a new standby server is established in the background. The following are the steps performed:

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

### Planned failover

You can use this feature for failing over to the standby server with reduced downtime. For example, after an unplanned failover, your primary could be on a different availability zone than the application, and you want to bring the primary server back to the previous zone to co-locate with your application.

When executing this feature, the standby server is first prepared to make sure it is caught up with recent transactions allowing the application to continue to perform read/writes. The standby is then promoted and the connections to the primary is severed. Your application can continue to write to the primary while a new standby server is established in the background. The following are the steps involved with planned failover.

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

Flexible servers that are configured with high availability, log data is replicated in real time to the standby server. Any user errors on the primary server - such as an accidental drop of a table or incorrect data updates are replicated to the standby replica as well. So, you cannot use standby to recover from such logical errors. To recover from such errors, you have to perform point-in-time restore from the backup.  Using flexible server's point-in-time restore capability, you can restore to the time before the error occurred. For databases configured with high availability, a new database server will be restored as a single zone flexible server with a new user-provided server name. You can use the restored server for few use cases:

  1. You can use the restored server for production usage and can optionally enable zone-redundant high availability. 
  2. If you just want to restore an object, you can then export the object from the restored database server and import it to your production database server. 
  3. If you want to clone your database server for testing and development purposes, or you want to restore for any other purposes, you can perform point-in-time restore.

## Zone redundant high availability - features

* Standby replica will be deployed in an exact VM configuration same as the primary server, including vCores, storage, network settings (VNET, Firewall), etc.

* You can add high availability for an existing database server.

* You can remove standby replica by disabling high availability.

* You can only choose your availability zone for your primary database server. Standby zone is auto-selected.

* Operations such as stop, start, and restart are performed on both primary and standby database servers at the same time.

* Automatic backups are performed from the primary database server and stored in a zone redundant storage.

* Clients always connect to the end host name of the primary database server.

* Any changes to the server parameters are applied to the standby replica as well.

* Ability to restart the server to pick up any static server parameter changes.
  
* Periodic maintenance activities such as minor version upgrades happen at the standby first and the service is failed over to reduce downtime.  

## Zone redundant high availability - limitations

* High availability is not supported with burstable compute tier.
* High availability is supported only in regions where multiple zones are available.
* Due to synchronous replication to another availability zone, applications can experience elevated write and commit latency.

* Standby replica cannot be used for read queries.

* Depending on the workload and activity on the primary server, the failover process might take longer than 120 seconds due to recovery involved at the standby replica before it can be promoted.

* Restarting the primary database server also restarts standby replica. 

* Configuring additional read replicas are not supported.

* Configuring customer initiated management tasks cannot be scheduled during managed maintenance window.

* Planned events such as scale compute and scale storage happens in the standby first and then on the primary server. Currently the server does not failed over for these planned operations. 

* If logical decoding or logical replication is configured with a HA configured flexible server, in the event of a failover to the standby server, the logical replication slots are not copied over to the standby server.  

## Frequently asked questions

### HA configuration questions

* **Is zone redundant HA available in all regions?** <br>
    Zone-redundant HA is available in regions that support multiple AZs in the region. For the latest region support, please see [this documentation](overview.md#azure-regions). We are continuously adding more regions and enabling multiple AZs. 

* **What mode of replication is between primary and standby servers?** <br>
    Synchronous mode of replication is established between the primary and the standby server. Application writes and commits are acknowledged only after the Write Ahead Log (WAL) data is persisted on the standby site. This enables zero data loss in the event of a failover.

* **Synchronous mode incurs latency. What kind of performance impact I can expect for my application?** <br>
    Configuring in HA induces some latency to writes and commits. No impact to read queries. The performance impact varies depending on your workload. As a general guideline, writes and commit impact can be around 20-30% impact. 

* **Does the zone-redundant HA provides protection from planned and unplanned outages?** <br>
    Yes. The main purpose of HA is to offer higher uptime to mitigate from any outages. In the event of an unplanned outage - including a fault in database, VM, physical node, data center, or at the AZ-level, the monitoring system automatically fails over the server to the standby. Similarly, during planned outages including minor version updates or infrastructure patching that happen during scheduled maintenance window, the updates are applied at the standby first and the service is failed over while the old primary goes through the update process. This reduces the overall downtime. 

* **Can I enable or disable HA any any point of time?** <br>

    Yes. You can enable or disable zone-redundant HA at any time except when the server is in certain states like stopped, restarting, or already in the process of failing over. 

* **Can I choose the AZ for the standby?** <br>
    No. Currently you cannot choose the AZ for the standby. We plan to add that capability in future.

* **Can I configure HA between private (VNET) and public access?** <br>
    No. You can either configure HA within a VNET (spanned across AZs within a region) or public access. 

* **Can I configure HA across regions?** <br>
    No. HA is configured within a region, but across availability zones. In future, we are planning to offer read replicas that can be configured across regions for disaster recovery (DR) purposes. We will provide more details when the feature is enabled. 

* **Can I use logical replication with HA configured servers?** <br>
    You can configure logical replication with HA. However, after a failover, the logical slot details are not copied over to the standby. Hence, there is currently limited support for this configuration.

### Replication and failover related questions

* **How does flexible server provide high availability in the event of a fault - like AZ fault?** <br>
    When you enable your server with zone-redundant HA, a physical standby replica with the same compute and storage configuration as the primary is deployed automatically in a different availability zone than the primary. PostgreSQL streaming replication is established between the primary and standby servers. 

* **What is the typical failover process during an outage?** <br>
    When the fault is detected by the monitoring system, it initiates a failover workflow that involves making sure the standby has applied all residual WAL files and fully caught up before opening that for read/write. Then DNS is updated with the IP address of the standby before the clients can reconnect to the server with the same endpoint (host name). A new standby is instantiated to keep the configuration in an highly available mode.

* **What is the typical failover time and expected data loss during an outage?** <br>
    In a typical case, failover time or the downtime experienced by the application perspective is between 60s-120s. This can be longer in cases where the outage incurred during long running transactions, index creation, or during heavy write activities - as the standby may take longer to complete the recovery process.

    Since the replication happens in synchronous mode, no data loss is expected.

* **Do you offer SLA for the failover time?** <br>
    For the failover time, we provide guidelines on how long it typically takes for the operation. The official SLA will be provided for the overall uptime when we GA the service. No SLAs are offered during public preview.

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
