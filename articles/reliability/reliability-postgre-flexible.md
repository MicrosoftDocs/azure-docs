---
title: Reliability and high availability in Azure Database for PostgreSQL - Flexible Server
description: Find out about reliability and high availability in Azure Database for PostgreSQL - Flexible Server
author: anaharris-ms
ms.author: anaharris
ms.topic: conceptual
ms.service: postgresql
ms.custom: references_regions, subject-reliability
ms.date: 08/04/2023
---

<!--#Customer intent:  I want to understand reliability support in Azure Database for PostgreSQL - Flexible Server so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->

# Reliability and high availability in Azure Database for PostgreSQL - Flexible Server


[!INCLUDE [applies-to-postgresql-flexible-server](../postgresql/includes/applies-to-postgresql-flexible-server.md)]

This article describes reliability support in Azure Database for PostgreSQL - Flexible Server, intra-regional resiliency with [availability zones](#availability-zone-support), and high availability. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Azure Database for PostgreSQL: Flexible Server offers zonal and zone-redundant deployment models with automatic failover capabilities. The offering is designed to ensure that committed data is never lost in the case of failures, and the database won't become a single point of failure in your software architecture. The flexible server automatically provisions and manages a standby replica when configuring availability zones.

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure Database for PostgreSQL: Flexible Server supports both [zone-redundant and zonal models](availability-zones-service-support.md#azure-services-with-availability-zone-support) for high availability configurations. Both high availability configurations enable automatic failover capability with zero data loss during planned events, such as user-initiated scale compute operation, and also during unplanned events, such as underlying hardware and software faults, network failures, and availability zone failures.

There are two high availability architectural models:

- **Zone-redundant**. This option provides complete isolation and redundancy of infrastructure across multiple availability zones within a region. It provides the highest level of availability, but it requires you to configure application redundancy across zones. Zone redundancy is preferred when you want protection from availability zone level failures and when latency across the availability zone is acceptable. A zone-redundant deployment enables a Flexible server to be available across availability zones. You can choose the region and the availability zones for the primary and standby servers. The standby replica server is provisioned in the chosen availability zone in the same region with a similar compute, storage, and network configuration as the primary server. Data files and transaction log files (write-ahead logs, a.k.a WAL) are stored on locally redundant storage (LRS) within each availability zone, automatically storing **three** data copies. This provides physical isolation of the entire stack between primary and standby servers. 

    :::image type="content" source="../postgresql/flexible-server/media/business-continuity/concepts-zone-redundant-high-availability-architecture.png" alt-text="zone redundant availability"::: 

- **Zonal**. A zonal deployment is preferred when you want to achieve the highest level of availability within a single availability zone with the lowest network latency. You can choose the region and the availability zone to deploy your primary database server. A standby replica server is *automatically* provisioned and managed in the *same* availability zone in the same region with similar compute, storage, and network configuration as the primary server. Data files and transaction log files (write-ahead logs, a.k.a WAL) are stored on locally redundant storage, automatically storing *three* data copies each for primary and standby. This provides physical isolation of the entire stack between primary and standby servers within the same availability zone. 

:::image type="content" source="../postgresql/flexible-server/media/business-continuity/concepts-same-zone-high-availability-architecture.png" alt-text="Same-zone high availability"::: 



>[!NOTE]
>Both zonal and zone-redundant deployment models architecturally behave the same. Various discussions in the following sections apply to both unless called out otherwise.

### Availability zones - features

* Standby replica will be deployed in an exact VM configuration like the primary server, including vCores, storage, network settings (VNET, Firewall), etc.

* You can add availability zone support for an existing database server.

* You can remove the standby replica by disabling availability.

* You can choose availability zones for your primary and standby database servers for zone-redundant availability.

* Operations such as stop, start, and restart are performed on both primary and standby database servers at the same time.

* Automatic backups are performed from the primary database server and stored in a zone redundant backup storage.

* Clients always connect to the end hostname of the primary database server.

* Any changes to the server parameters are also applied to the standby replica.

* Ability to restart the server to pick up any static server parameter changes.
  
* Periodic maintenance activities such as minor version upgrades happen at the standby first and the service failed to reduce downtime.  

### Availability zones - limitations

* Due to synchronous replication to the standby server, especially with a zone-redundant configuration, applications can experience elevated write and commit latency.

* Standby replica cannot be used for read queries.

* Depending on the workload and activity on the primary server, the failover process might take longer than 120 seconds due to the recovery involved at the standby replica before it can be promoted. 

* The standby server typically recovers WAL files at 40 MB/s. If your workload exceeds this limit, you may encounter extended time for the recovery to complete either during the failover or after establishing a new standby. 

* Configuring for availability induces some latency to writes and commits—no impact on reading queries. The performance impact varies depending on your workload. As a general guideline, writes and commit impact can be around 20-30% impact.

* Restarting the primary database server also restarts the standby replica. 

* Configuring additional standbys is not supported.

* Configuring customer-initiated management tasks cannot be scheduled during the managed maintenance window.

* Planned events such as scale computing and scale storage happens on the standby first and then on the primary server. Currently, the server doesn't failover for these planned operations. 

* If logical decoding or logical replication is configured with an availability-configured Flexible Server, in the event of a failover to the standby server, the logical replication slots are not copied over to the standby server.  

* Configuring availability between private (VNET) and public access is not supported. You either configure availability within a VNET (spanned across AZs within a region) or public access.

*  Availability is configured only within a region and across availability zones. It cannot be configured across regions. 

>[!IMPORTANT]
>In zone-redundant and zonal models, automatic backups are performed periodically from the primary database server. At the same time, the transaction logs are continuously archived in the backup storage from the standby replica. If the region supports availability zones, backup data is stored on zone-redundant storage (ZRS). In regions that don't support availability zones, backup data is stored on local redundant storage (LRS).   

### Prerequisites

**Zone redundancy:**

- The **zone-redundancy** option is only available in a [regions that support availability zones](../postgresql/flexible-server/overview.md#azure-regions).

- Zone-redundancy zones are **not** supported for the following:

    - Azure Database for PostgreSQL – Single Server SKU.  
    - Burstable compute tier.
    - Regions with single-zone availability

**Zonal:**

- The **zonal** deployment option is available in all [Azure regions](../postgresql/flexible-server/overview.md#azure-regions) where you can deploy Flexible Server. 

### SLA

-  **Zone-Redundancy** model offers uptime [SLA of 99.95%](https://azure.microsoft.com/support/legal/sla/postgresql).

-  **Zonal** model offers uptime [SLA of 99.99%](https://azure.microsoft.com/support/legal/sla/postgresql).

 To see the SLAs offered with Flexible Server, go to [Azure Database for PostgreSQL SLAs](https://azure.microsoft.com/support/legal/sla/postgresql).

### Create an Azure Database for PostgreSQL - Flexible Server with availability zone enabled

To learn how to create an Azure Database for PostgreSQL - Flexible Server, see [Quickstart: Create an Azure Database for PostgreSQL - Flexible Server in the Azure portal](/azure/postgresql/flexible-server/quickstart-create-server-portal).


### Transaction completion

Application transaction-triggered writes and commits are first logged to the WAL on the primary server. It is then streamed to the standby server using the Postgres streaming protocol. Once the logs are persisted on the standby server storage, the primary server is acknowledged for write completion. Only then and the application confirmed the writes. This additional round-trip adds more latency to your application. The percentage of impact depends on the application. This acknowledgment process does not wait for the logs to be applied to the standby server. The standby server is permanently in recovery mode until it is promoted.

### Health check 

The flexible server has a health monitoring that periodically checks for the primary and standby health. If that detects a primary server is not reachable after multiple pings, it decides to initiate an automatic failover. The algorithm is based on multiple data points to avoid false positive situations. 

### Failover modes

There are two failover modes. 

1. With [**planned failovers**](#failover-process---planned-downtimes) (example: During maintenance window) where the failover is triggered with a known state in which the primary connections are drained, a clean shutdown is performed before the replication is severed. You can also use this to return the primary server to your preferred AZ. 
 
2. With [**unplanned failover**](#failover-process---unplanned-downtimes) (example: Primary server node crash), the primary is immediately fenced and hence any in-flight transactions are lost and to be retried by the application. 

In both the failover modes, once the replication is severed, the standby server runs the recovery before being promoted as a primary and opens for read/write. With automatic DNS entries updated with the new primary server endpoint, applications can connect to the server using the same endpoint. A new standby server is established in the background that don’t block your application connectivity.

### Downtime

In all cases, it would be best to observe any downtime from your application/client side. Your application will be able to reconnect after a failover as soon as the DNS is updated. Before fencing the writes, we take care of a few more aspects, including LSN comparisons between primary and standby. But with unplanned failovers, the time taken for the standby can be longer than 2 minutes in some cases due to the volume of logs to recover before opening for read/write.

## High availability status

The health of primary and standby servers are continuously monitored, and appropriate actions are taken to remediate issues, including triggering a failover to the standby server. The high availability statuses are listed below:

| **Status** | **Description** |
| ------- | ------ |
| **Initializing** | In the process of creating a new standby server. |
| **Replicating Data** | After the standby is created, it is catching up with the primary. |
| **Healthy** | Replication is in steady state and healthy. |
| **Failing Over** | The database server is in the process of failing over to the standby. |
| **Removing Standby** | In the process of deleting standby server. | 
| **Not Enabled** | Zone redundant high availability is not enabled.  |

 
 
>[!NOTE]
> You can enable high availability during server creation or at a later time as well. If you are enabling or disabling high availability during the post-create stage, operating when the primary server activity is low is recommended.

## Steady-state operations

PostgreSQL client applications are connected to the primary server using the DB server name. Application reads are served directly from the primary server. At the same time, commits and writes are confirmed to the application only after the log data is persisted on both the primary server and the standby replica. Due to this additional round-trip, applications can expect elevated latency for writes and commits. You can monitor the health of the high availability on the portal.

:::image type="content" source="../postgresql/flexible-server/media/business-continuity/concepts-high-availability-steady-state.png" alt-text="high availability - steady state"::: 

1. Clients connect to the flexible server and perform write operations.
2. Changes are replicated to the standby site.
3. Primary receives an acknowledgment.
4. Writes/commits are acknowledged.

## Failover process - planned downtimes

Planned downtime events include Azure scheduled periodic software updates and minor version upgrades. When configured in high availability, these operations are first applied to the standby replica while the applications continue to access the primary server. Once the standby replica is updated, primary server connections are drained, and a failover is triggered, which activates the standby replica to be the primary with the same database server name. Client applications will have to reconnect with the same database server name to the new primary server and can resume their operations. A new standby server will be established in the same zone as the old primary. 

For other user-initiated operations such as scale-compute or scale-storage, the changes are applied on the standby first, followed by the primary. Currently, the service is not failed over to the standby, and hence while the scale operation is carried out on the primary server, applications will encounter a short downtime.

### Reducing planned downtime with a managed maintenance window

With a flexible server, you can optionally schedule Azure-initiated maintenance activities by choosing a 60-minute window on a day of your preference where the activities on the databases are expected to be low. Azure maintenance tasks such as patching or minor version upgrades would happen during that window. If you do not choose a custom window, a system allocated 1-hr window between 11 pm - 7 am local time is selected for your server. 
 
These maintenance activities are performed on the standby replica for flexible servers configured with high availability. The service is failed over to the standby to which applications can reconnect.

## Failover process - unplanned downtimes

- Unplanned outages include software bugs or infrastructure component failures that impact the availability of the database. If the primary server becomes unavailable, it is detected by the monitoring system and initiates a failover process. The process includes a few seconds of wait time to ensure it is not a false positive. The replication to the standby replica is severed, and the standby replica is activated as the primary database server. That includes the standby to recover any residual WAL files. Once it is fully recovered, DNS for the same endpoint is updated with the standby server's IP address. Clients can then retry connecting to the database server using the exact connection string and resume operations. 

> [!NOTE]
> Flexible servers configured with zone-redundant high availability provide a recovery point objective (RPO) of **Zero** (no data loss). The recovery time objective (RTO) is expected to be **less than 120s** in typical cases. However, depending on the activity in the primary database server at the time of the failover, the failover may take longer. 


After the failover, while a new standby server is provisioned (usually 5-10 minutes), applications can still connect to the primary server and proceed with their read/write operations. Once the standby server is established, it will start recovering the logs that were generated after the failover. 

:::image type="content" source="../postgresql/flexible-server/media/business-continuity/concepts-high-availability-failover-state.png" alt-text="high availability - failover"::: 

1. Primary database server is down, and the clients lose database connectivity. 
2. Standby server is activated to become the new primary server. The client connects to the new primary server using the exact connection string. Having the client application in the same zone as the primary database server reduces latency and improves performance.
3. Standby server is established in the same zone as the old primary server, and the streaming replication is initiated. 
4. Once the steady-state replication is established, the client application commits, and writes are acknowledged after the data is persisted on both sites.

## On-demand failover

The flexible server provides two methods to perform an on-demand failover to the standby server. These are useful if you want to test your applications' failover time and downtime impact and fail over to the preferred availability zone. 

### Forced failover

This feature can simulate an unplanned outage scenario while running your production workload and observe your application downtime. Alternatively, if your primary server becomes unresponsive for whatever reason, you may use this feature. 

This feature brings the primary server down and initiates the failover workflow in which the standby promote operation is performed. Once the standby completes the recovery process till the last committed data, it is promoted to be the primary server. DNS records are updated, and your application can connect to the promoted primary server. Your application can continue to write to the primary while a new standby server is established in the background, which doesn't impact the uptime. 

The following are the steps during forced failover:

  | **Step** | **Description** | **App downtime expected?** |
  | ------- | ------ | ----- |
  | 1 | Primary server is stopped shortly after receiving the failover request. | Yes |
  | 2 | Application encounters downtime as the primary server is down. | Yes |
  | 3 | Internal monitoring system detects the failure and initiates a failover to the standby server. | Yes |
  | 4 | Standby server enters recovery mode before being fully promoted as an independent server. | Yes |
  | 5 | The failover process waits for the standby recovery to complete. | Yes |
  | 6 | Once the server is up, the DNS record is updated with the same hostname but using the standby's IP address. | Yes |
  | 7 | Application can reconnect to the new primary server and resume the operation. | No |
  | 8 | A standby server in the preferred zone is established. | No |
  | 9 | Standby server starts to recover logs (from Azure BLOB) that it missed during its establishment. | No |
  | 10 | A steady state between the primary and the standby server is established. | No |
  | 11 | Forced failover process is complete. | No |

Application downtime is expected to start after step #1 and persists until step #6 is completed. The rest of the steps happen in the background without impacting the application writes and commits.

>[!Important]
>The end-to-end failover process includes (a) failing over to the standby server after the primary failure and (b) establishing a new standby server in a steady state. As your application incurs downtime until the failover to the standby is complete, **please measure the downtime from your application/client perspective** instead of the overall end-to-end failover process. 

### Planned failover

You can use this feature to fail over to the standby server with reduced downtime. For example, your primary could be on a different availability zone after an unplanned failover than the application. You want to bring the primary server back to the previous zone to colocate with your application.

When executing this feature, the standby server is first prepared to ensure it is caught up with recent transactions, allowing the application to continue performing reads/writes. The standby is then promoted, and the connections to the primary are severed. Your application can continue to write to the primary while a new standby server is established in the background. The following are the steps involved with planned failover.

| **Step** | **Description** | **App downtime expected?** |
  | ------- | ------ | ----- |
  | 1 | Wait for the standby server to have caught-up with the primary. | No |
  | 2 | Internal monitoring system initiates the failover workflow. | No |
  | 3 | Application writes are blocked when the standby server is close to the primary log sequence number (LSN). | Yes |
  | 4 | Standby server is promoted to be an independent server. | Yes |
  | 5 | DNS record is updated with the new standby server's IP address. | Yes |
  | 6 | Application to reconnect and resume its read/write with new primary | No |
  | 7 | A new standby server in another zone is established. | No |
  | 8 | Standby server starts to recover logs (from Azure BLOB) that it missed during its establishment. | No |
  | 9 | A steady state between the primary and the standby server is established. | No |
  | 10 |  Planned failover process is complete. | No |

Application downtime starts at step #3 and can resume operation post step #5. The rest of the steps happen in the background without impacting application writes and commits. 

### Considerations while performing on-demand failovers

* The overall end-to-end operation time may be seen as longer than the actual downtime experienced by the application. **Please observe the downtime from the application perspective**.
* Please do not perform immediate, back-to-back failovers. Wait for at least 15-20 minutes between failovers, allowing the new standby server to be fully established.
* Performing during a low-activity period is recommended for the planned failover with reduced downtime.

See [this guide](../postgresql/flexible-server/how-to-manage-high-availability-portal.md) for managing high availability.

## Point-in-time restore of HA servers

Flexible servers configured with high availability, log data is replicated in real-time to the standby server. Any user errors on the primary server - such as an accidental drop of a table or incorrect data updates, are replicated to the standby replica. So, you cannot use standby to recover from such logical errors. To recover from such errors, you have to perform a point-in-time restore from the backup. Using a flexible server's point-in-time restore capability, you can restore to the time before the error occurred. A new database server will be restored as a single-zone flexible server with a new user-provided server name for databases configured with high availability. You can use the restored server for a few use cases:

1. You can use the restored server for production and optionally enable zone-redundant high availability.
  2. If you want to restore an object, export it from the restored database server and import it to your production database server.
  3. If you want to clone your database server for testing and development purposes or to restore for any other purposes, you can perform the point-in-time restore.

### Availability zone redeployment and migration

You can enable or disable zone-redundant or zonal availability models at any time except when the server is in certain states like stopped, restarting, or already in the process of failing over.

If you wish to migrate from zonal to zone-redundant configuration or vice versa, you must perform the following steps:

1. Disable availability support.
1. Wait for the disabling procedure to complete.
1. Choose the alternate deployment model.

## Availability for non-HA servers

For Flexible servers configured **without** availability zones configuration, the service still provides built-in availability, storage redundancy, and resiliency to help to recover from any planned or unplanned downtime events. Uptime [SLA of 99.9%](https://azure.microsoft.com/support/legal/sla/postgresql) is offered in this non-HA configuration.
  
During planned or unplanned failover events, if the server goes down, the service maintains the availability of the servers using the following automated procedure:

1. A new compute Linux VM is provisioned.
2. The storage with data files is mapped to the new Virtual Machine
3. PostgreSQL database engine is brought online on the new Virtual Machine.

The picture below shows the transition between VM and storage failure.

:::image type="content" source="../postgresql/flexible-server/media/business-continuity/concepts-availability-without-zone-redundant-ha-architecture.png" alt-text="Diagram that shows availability without zone redundant ha - steady state." border="false" lightbox="../postgresql/flexible-server/media/business-continuity/concepts-availability-without-zone-redundant-ha-architecture.png"::: 

## Further considerations

However, you don't need an availability configuration to protect your server from unplanned outages. A flexible server offers local redundant storage with three copies of data, zone-redundant backup (in regions where it is supported), and built-in server resiliency to automatically restart a crashed server and relocate the server to another physical node. Zone redundant HA will provide higher uptime by performing an automatic failover to another running (standby) server in another zone and thus provides zone-resilient high availability with zero data loss.

## Next steps
> [!div class="nextstepaction"]
> [Azure Database for PostgreSQL documentation](/azure/postgresql/)

> [!div class="nextstepaction"]
> [Reliability in Azure](availability-zones-overview.md)