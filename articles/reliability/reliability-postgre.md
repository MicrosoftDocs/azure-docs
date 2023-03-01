---
title: Reliability in Azure Database for PostgreSQL - Flexible Server
description: Find out about reliability in Azure Database for PostgreSQL - Flexible Server
author: anaharris-ms
ms.author: anaharris
ms.topic: conceptual
ms.service: azure-functions
ms.custom: references_regions, subject-reliability
ms.date: 02/28/2023
---

<!--#Customer intent:  I want to understand reliability support in Azure Database for PostgreSQL - Flexible Server so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->


# Reliability in Azure Database for PostgreSQL - Flexible Server

This article describes reliability support in Azure Database for PostgreSQL - Flexible Server and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and links to information on [cross-region resiliency with disaster recovery](#disaster-recovery-cross-region-failover). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Azure Database for PostgreSQL - Flexible Server offers both zonal and zone-redundant availability deployment models with automatic failover capabilities. The availability offering is designed to ensure that committed data is never lost in the case of failures and that the database won't be a single point of failure in your software architecture. When availability is configured, flexible server automatically provisions and manages a standby replica.

However, you don't need to have an availability configuration in order to protect your server form unplanned outages. Flexible server offers local redundant storage with 3 copies of data, zone-redundant backup (in regions where it is supported), and also built-in server resiliency to automatically restart a crashed server and even relocate server to another physical node. Zone redundant HA will provide higher uptime by performing automatic failover to another running (standby) server in another zone and thus provides zone-resilient high availability with zero data loss.

## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Availability zone service and regional support](availability-zones-service-support.md).

There are three types of Azure services that support availability zones: zonal, zone-redundant, and always-available services. You can learn more about these types of services and how they promote resiliency in the [Azure services with availability zone support](availability-zones-service-support.md#azure-services-with-availability-zone-support).

Azure Database for PostgreSQL - Flexible Server supports both [zone-redundant and zonal models](availability-zones-service-support.md#azure-services-with-availability-zone-support).  

- **Zone-redundant**. This option provides a complete isolation and redundancy of infrastructure across multiple availability zones within a region. It provides the highest level of availability, but it requires you to configure application redundancy across zones. Zone-redundancy is preferred when you want protection from availability zone level failures and when latency across the availability zone is acceptable. A zone-redundant deployment enables Flexible server to be available across availability zones. You can choose both the region and the availability zones for the primary and standby servers. The standby replica server is provisioned in the chosen availability zone in the same region with similar compute, storage, and network configuration as the primary server. Data files and transaction log files (write-ahead logs a.k.a WAL) are stored on locally redundant storage (LRS) within each availability zone, which automatically stores **three** data copies. This provides physical isolation of the entire stack between primary and standby servers. 

    :::image type="content" source="../postgresql/flexible-server/media/business-continuity/concepts-zone-redundant-high-availability-architecture.png" alt-text="zone redundant availability"::: 

- **Zonal**. A zonal deployment is preferred when you want to achieve the highest level of availability within a single availability zone with the lowest network latency. You can choose the region and the availability zone in which to deploy your primary database server. A standby replica server is *automatically* provisioned and managed in the *same* availability zone in the same region with similar compute, storage, and network configuration as the primary server. Data files and transaction log files (write-ahead logs a.k.a WAL) are stored on locally redundant storage, which automatically stores as *three* data copies each for primary and standby. This provides physical isolation of the entire stack between primary and standby servers within the same availability zone. 

## Availability zones - features

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

## Availability zones - limitations

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

>[!IMPORTANT]
>In both zone-redundant and zonal models, automatic backups are performed periodically from the primary database server, while the transaction logs are continuously archived to the backup storage from the standby replica. If the region supports availability zones, then backup data is stored on zone-redundant storage (ZRS). In regions that doesn't support availability zones, backup data is stored on local redundant storage (LRS).   

:::image type="content" source="../postgresql/flexible-server/media/business-continuity/concepts-same-zone-high-availability-architecture.png" alt-text="Same-zone high availability"::: 

### Prerequisites

#### Zone redundancy

- The **zone-redundancy** option is only available in a [regions that support availability zones](../postgresql/flexible-server/overview.md#azure-regions).

Zone-redundancy zones are **not** supported for the following:

- Azure Database for PostgreSQL – Single Server SKU.  
- Burstable compute tier.
- Regions with single-zone availability

#### Zonal

- The **zonal** deployment option is available in all [Azure regions](../postgresql/flexible-server/overview.md#azure-regions) where you can deploy Flexible Server. 


### SLA

-  **Zone-Redundancy** model offers uptime [SLA of 99.95%](https://azure.microsoft.com/support/legal/sla/postgresql).

-  **Zonal** model offers uptime [SLA of 99.99%](https://azure.microsoft.com/support/legal/sla/postgresql).
- 
 To see the SLAs offered with Flexible Server, go to [Azure Database for PostgreSQL SLAs](https://azure.microsoft.com/support/legal/sla/postgresql).

### Create an Azure Database for PostgreSQL - Flexible Server with availability zone enabled

To learn how to create an Azure Database for PostgreSQL - Flexible Server, see [Quickstart: Create an Azure Database for PostgreSQL - Flexible Server in the Azure portal](/azure/postgresql/flexible-server/quickstart-create-server-portal).


###  Failover support

For Azure Database for PostgreSQL - Flexible Server, there are three failover modes, **planned failovers**, **forced failovers**, and **unplanned failovers**. The descriptions below apply to both zonal and zone-redundant configurations. 

#### Planned failovers 

Planned failover events include Azure scheduled periodic software updates and minor version upgrades. When configured for zone-redundancy, these operations are first applied to the standby replica while the applications continue to access the primary server. Once the standby replica is updated, primary server connections are drained, and a failover is triggered which activates the standby replica to be the primary with the same database server name. Client applications will have to reconnect with the same database server name to the new primary server and can resume their operations. A new standby server will be established in the same zone as the old primary. 

For other user initiated operations such as scale-compute or scale-storage, the changes are applied at the standby first, followed by the primary. Currently, the service is not failed over to the standby. As a result, the scale operation is carried out on the primary server, and applications will encounter a short downtime until the operation is complete.

Some considerations regarding planned failovers:

* The overall end-to-end operation time may be seen longer than the actual downtime experienced by the application. **Please observe the downtime from the application perspective**.
* Please do not perform immediate, back-to-back failovers. Wait for at least 15-20 minutes between failovers, which will  allow the new standby server to be fully established.
* For the planned failover with reduced downtime, it is recommended to perform during low activity period.
* See [this guide](how-to-manage-high-availability-portal.md) for managing availability.


The table below illustrates the steps that are involved with planned failovers.

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


#### Reducing planned downtime with managed maintenance window

With flexible server, you can optionally schedule Azure initiated maintenance activities by choosing a 60-minute window in a day of your preference where the activities on the databases are expected to be low. Azure maintenance tasks such as patching or minor version upgrades would happen during that maintenance window. If you do not choose a custom window, a system allocated 1-hr window between 11pm-7am local time is chosen for your server. 
 
For flexible servers configured with availability zones, these maintenance activities are performed on the standby replica first and the service is failed over to the standby to which applications can reconnect.


#### Forced failovers

You can use a forced failover to simulate an unplanned outage scenario while running your production workload and observe your application downtime. Alternatively, in rare case where your primary server becomes unresponsive for whatever reason, you may use this feature. 

Forced failover brings the primary server down and initiates the failover workflow in which the standby promote operation is performed. Once the standby completes the recovery process till the last committed data, it is promoted to be the primary server. DNS records are updated and your application can connect to the promoted primary server. Your application can continue to write to the primary while a new standby server is established in the background and that doesn't impact the uptime. 

The table below illustrates the steps that are involved with forced failovers.

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

#### Unplanned failovers

Unplanned outages include software bugs or infrastructure component failures that impact the availability of the database. If the primary server becomes unavailable, it's detected by the monitoring system and initiates a failover process.  The process includes a few seconds of wait time to make sure it isn't a false positive. The replication to the standby replica is severed and the standby replica is activated to be the primary database server. That includes the standby to recover any residual WAL files. Once it is fully recovered, DNS for the same end point is updated with the standby server's IP address. Clients can then retry connecting to the database server using the same connection string and resume their operations. 

>[!NOTE]
> Flexible servers configured for zone-redundancy provide a recovery point objective (RPO) of **Zero** (no data loss). The recovery time objective (RTO) is expected to be **less than 120s** in typical cases. However, depending on the activity in the primary database server at the time of the failover, the failover may take longer. 

After the failover, while a new standby server is being provisioned (which usually takes 5-10 minutes), applications can still connect to the primary server and proceed with their read/write operations. Once the standby server is established, it will start recovering the logs that were generated after the failover. 

:::image type="content" source="../postgresql/flexible-server/media/business-continuity/concepts-high-availability-failover-state.png" alt-text="high availability - failover"::: 

1. Primary database server is down and the clients lose database connectivity. 
2. Standby server is activated to become the new primary server. The client connects to the new primary server using the same connection string. Having the client application in the same zone as the primary database server reduces latency and improves performance.
3. Standby server is established in the same zone as the old primary server and the streaming replication is initiated. 
4. Once the steady-state replication is established, the client application commits and writes are acknowledged after the data is persisted on both sites.

### Downtime

In all cases, you must observe any downtime from your application/client side. Your application will be able to reconnect after a failover as soon as the DNS is updated. We take care of a few more aspects including LSN comparisons between primary and standby before fencing the writes. But with unplanned failovers, the time taken for the standby can be longer than 2 minutes in some cases due to the volume  of logs to recover before opening for read/write.

### Safe deployment techniques

The health of primary and standby servers are continuously monitored and appropriate actions are taken to remediate issues including triggering a failover to the standby server. The availability statuses are listed below:

| **Status** | **Description** |
| ------- | ------ |
| <b> Initializing | In the process of creating a new standby server. |
| <b> Replicating Data | After the standby is created, it is catching up with the primary. |
| <b> Healthy | Replication is in steady state and healthy. |
| <b> Failing Over | The database server is in the process of failing over to the standby. |
| <b> Removing Standby | In the process of deleting standby server. | 
| <b> Not Enabled | Zone redundant high availability is not enabled.  |

>[!NOTE]
> You can enable availability during server creation or at a later time as well. If you are enabling or disabling availability during post-create stage, it is recommended to perform the operation when the primary server activity is low.

## Steady-state operations

PostgreSQL client applications are connected to the primary server using the DB server name. Application reads are served directly from the primary server, while commits and writes are confirmed to the application only after the log data is persisted on both the primary server and the standby replica. Due to this additional round-trip, applications can expect elevated latency for writes and commits. You can monitor the health of the high availability on the portal.

:::image type="content" source="../postgreSQL/flexible-server/media/business-continuity/concepts-high-availability-steady-state.png" alt-text="high availability - steady state"::: 

1. Clients connect to the flexible server and perform write operations.
2. Changes are replicated to the standby site.
3. Primary receives acknowledgment.
4. Writes/commits are acknowledged.

#### Health check

Flexible server has a health monitoring in place that checks for the primary and standby health periodically. If that detects primary server is not reachable after multiple pings, it makes the decision to initiate an automatic failover or not. The algorithm is based on multiple data points to avoid any false positive situation.

## Disaster recovery: cross region failover

