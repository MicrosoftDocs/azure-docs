---
title: Overview of zone redundant high availability with Azure Database for PostgreSQL - Flexible Server (Preview)
description: Learn about the concepts of zone redundant high availability with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 06/07/2021
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

* **Forced failover**: You can use this option to simulate an unplanned outage scenario. This triggers a fault in the primary server and brings the primary server down. Applications loses connectivity to the server. The failover workflow is triggered which initiates the standby promote operation. Once the standby is all caught up with all transactions, it is promoted to be the primary server. DNS records are updated and your application can connect to the promoted primary server. Your application can continue to write to the primary while a new standby server is established in the background.

* **Planned failover**: This option is for failing over to the standby server with reduced downtime. The standby server is first prepared to make sure it is caught up with recent transactions. The standby is then promoted and the connections to the primary is severed. DNS record is updated and the applications can connect to the  newly promoted server.  Your application can continue to write to the primary while a new standby server is established in the background. As the application continues to write to the primary server while the standby is being prepared, this method of failover provides reduced downtime experience. 

>[!NOTE]
> It is recommended to perform planned failover during low activity period.

>[!IMPORTANT] 
> * Please do not perform immediate, back-to-back failovers. Wait for at least 15-20 minutes between failovers, which will also allow the new standby server to be fully established.
> 
> * The overall end-to-end operation time may be longer than the actual downtime experienced by the application. Please measure the downtime from the application perspective.

See [this guide](how-to-manage-high-availability-portal.md) for step-by-step instructions.



## Point-in-time restore 

Flexible servers that are configured with high availability, log data is replicated in real time to the standby server. Any user errors on the primary server - such as an accidental drop of a table or incorrect data updates are replicated to the standby replica as well. So, you cannot use standby to recover from such logical errors. To recover from such errors, you have to perform point-in-time restore from the backup.  Using flexible server's point-in-time restore capability, you can restore to the time before the error occurred. For databases configured with high availability, a new database server will be restored as a single zone flexible server with a new user-provided server name. You can use the restored server for few use cases:

1. You can use the restored server for production usage and enable zone-redundant high availability. 
2. If you just want to restore an object, you can then export the object from the restored database server and import it to your production database server. 
3. If you want to clone your database server for testing and development purposes, or you want to restore for any other purposes, you can perform point-in-time restore.

## Zone redundant high availability - features

-   Standby replica will be deployed in an exact VM configuration same as the primary server, including vCores, storage, network settings (VNET, Firewall), etc.

-   You can add high availability for an existing database server.

-   You can remove standby replica by disabling high availability.

-   You can only choose your availability zone for your primary database server. Standby zone is auto-selected.

-   Operations such as stop, start, and restart are performed on both primary and standby database servers at the same time.

-   Automatic backups are performed from the primary database server and stored in a zone redundant storage.

-   Clients always connect to the end host name of the primary database server.

-   Any changes to the server parameters are applied to the standby replica as well.

-   Ability to restart the server to pick up any static server parameter changes.
  
-   Periodic maintenance activities such as minor version upgrades happen at the standby first and the service is failed over to reduce downtime.  

## Zone redundant high availability - limitations

-   High availability is not supported with burstable compute tier.
-   High availability is supported only in regions where multiple zones are available.
-   Due to synchronous replication to another availability zone, applications can experience elevated write and commit latency.

-   Standby replica cannot be used for read queries.

-   Depending on the workload and activity on the primary server, the failover process might take longer than 120 seconds due to recovery involved at the standby replica before it can be promoted.

-   Restarting the primary database server also restarts standby replica. 

-   Configuring additional read replicas are not supported.

-   Configuring customer initiated management tasks cannot be scheduled during managed maintenance window.

-   Planned events such as scale compute and scale storage happens in the standby first and then on the primary server. Currently the server does not failed over for these planned operations. 

-  If logical decoding or logical replication is configured with a HA configured flexible server, in the event of a failover to the standby server, the logical replication slots are not copied over to the standby server.  

## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn how to [manage high availability](./how-to-manage-high-availability-portal.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)