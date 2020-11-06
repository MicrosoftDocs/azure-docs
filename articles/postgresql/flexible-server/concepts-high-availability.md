---
title: Overview of zone redundant high availability with Azure Database for PostgreSQL - Flexible Server (Preview)
description: Learn about the concepts of zone redundant high availability with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/22/2020
---

# High availability concepts in Azure Database for PostgreSQL - Flexible Server

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

Azure Database for PostgreSQL - Flexible Server offers high availability configuration with automatic failover capability using **zone redundant** server deployment. When deployed in a zone redundant configuration, flexible server automatically provisions and manages a standby replica in a different availability zone. Using PostgreSQL streaming replication, the data is replicated to the standby replica server in **synchronous** mode. 

Zone redundant configuration enables automatic failover capability with zero data loss during planned events such as user-initiated scale compute operation, and also during unplanned events such as underlying hardware and software faults, network failures, and availability zone failures. 

:::image type="content" source="./media/business-continuity/concepts-zone-redundant-high-availability-architecture.png" alt-text="zone redundant high availability"::: 

## Zone redundant high availability architecture

You can choose the region and the availability zone to deploy your primary database server. A standby replica server is provisioned in a different availability zone with the same configuration as the primary server, including compute tier, compute size, storage size, and network configuration. Transaction logs are replicated in synchronous mode to the standby replica using PostgreSQL streaming replication. Automatic backups are performed periodically from the primary database server, while the transaction logs are continuously archived to the backup storage from the standby replica. 

The health of the high availability configuration is continuously monitored and reported on the portal. The zone redundant high availability statuses are listed below:

| **Status** | **Description** |
| ------- | ------ |
| <b> Initializing | In the process of creating a new standby server |
| <b> Replicating Data | After the standby is created, it is catching up with the primary. |
| <b> Healthy | Replication is in steady state and healthy. |
| <b> Failing Over | The database server is in the process of failing over to the standby. |
| <b> Removing Standby | In the process of deleting standby server. | 
| <b> Not Enabled | Zone redundant high availability is not enabled.  |

## Steady-state operations

PostgreSQL client applications are connected to the primary server using the DB server name. Application reads are served directly from the primary server, while commits and writes are confirmed to the application only after the data is persisted on both the primary server and the standby replica. Due to this additional round-trip requirement, applications can expect elevated latency for writes and commits. You can monitor the health of the high availability on the portal.

:::image type="content" source="./media/business-continuity/concepts-high-availability-steady-state.png" alt-text="zone redundant high availability - steady state"::: 

1. Clients connect to the flexible server and performs write operations.
2. Changes are replicated to the standby site.
3. Primary receives acknowledgment.
4. Writes/commits are acknowledged.

## Failover process - planned downtimes

Planned downtime events include Azure scheduled periodic software updates and minor version upgrades. When configured in high availability, these operations are first applied to the standby replica while the applications continue to access the primary server. Once the standby replica is updated, primary server connections are drained, and a failover is triggered which activates the standby replica to be the primary with the same database server name. Client applications will have to reconnect with the same database server name to the new primary server and can resume their operations. A new standby server will be established in the same zone as the old primary. 

For other user initiated operations such as scale-compute or scale-storage, the changes are applied at the standby first, followed by the primary. Currently, the connections are not failed over to the standby and hence incurs downtime while the operation is carried out on the primary server.

### Reducing planned downtime with managed maintenance window

 You can schedule Azure initiated maintenance activities by choosing a 30-minute window in a day of your preference where the activities on the databases are expected to be low. Azure maintenance tasks such as patching or minor version upgrades would happen during that window.  For flexible servers configured with high availability, these maintenance activities are performed on the standby replica first and then it is activated. Applications then reconnect to the new primary server and resume their operations while a new standby is provisioned.

## Failover process - unplanned downtimes

Unplanned outages include software bugs or infrastructure component failures impact the availability of the database. In the event of the server unavailability is detected by the monitoring system, the replication to the standby replica is severed and the standby replica is activated to be the primary database server. Clients can reconnect to the database server using the same connection string and resume their operations. The overall failover time is expected to take 60-120s. However, depending on the activity in the primary database server at the time of the failover such as large transactions and recovery time, the failover may take longer.

:::image type="content" source="./media/business-continuity/concepts-high-availability-failover-state.png" alt-text="zone redundant high availability - failover"::: 

1. Primary database server is down and the clients lose database connectivity. 
2. Standby server is activated to become the new primary server. The client connects to the new primary server using the same connection string. Having the client application in the same zone as the primary database server reduces latency and improves performance.
3. Standby server is established in the same zone as the old primary server and the streaming replication is initiated. 
4. Once the steady-state replication is established, the client application commits and writes are acknowledged after the data is persisted on both the sites.

## Point-in-time restore 

Flexible servers that are configured with high availability, replicate data in real time to the standby server to keep that up to date. Any user errors on the primary server - such as an accidental drop of a table or incorrect data updates are faithfully replicated to the standby replica. So, you cannot use standby to recover from such logical errors. To recover from such errors, you have to perform point-in-time restore from backups.  Using flexible server's point-in-time restore capability, you can restore to the time before the error occurred. For databases configured with high availability, a new database server will be restored as a single zone flexible server with a user-provided name. You can then export the object from the database server and import it to your production database server. Similarly, if you want to clone your database server for testing and development purposes, or you want to restore for any other purposes, you can perform point-in-time restores.

## Zone redundant high availability - features

-   Standby replica will be deployed in an exact VM configuration same as the primary server, including vCores, storage, network settings
    (VNET, Firewall), etc.

-   Ability to add high availability for an existing database server.

-   Ability to remove standby replica by disabling high availability.

-   Ability to choose your availability zone for your primary database server.

-   Ability to stop, start, and restart both primary and standby database servers.

-   Automatic backups are performed from the primary database server and stored in a zone redundant storage.

-   Clients always connect to the primary database server.

-   Ability to restart the server to pick up any static server parameter changes.
  
-   Periodic maintenance activities such as minor version upgrades happen at the standby first and the service is failed over to reduce downtime.  

## Zone redundant high availability - limitations

-   High availability is not supported with burstable compute tier.
-   High availability is supported only in regions where multiple zones are available.
-   Due to synchronous replication to another availability zone, applications can experience elevated write and commit latency.

-   Standby replica cannot be used for read-only queries.

-   Depending on the activity on the primary server at the time of failover, it might take up to two minutes or longer for the failover
    to complete.

-   Restarting the primary database server to pick up static parameter changes also restarts standby replica.

-   Configuring additional read replicas are not supported.

-   Configuring customer initiated management tasks cannot be scheduled during managed maintenance window.

-   Planned events such as scale compute and scale storage happens in the standby first and then on the primary server. The service is not failed over. 

-  - If logical replication is configured with a HA configured flexible server, in the event of a failover to the standby server, the logical replication slots are not copied over to the standby server.  

## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn how to [manage high availability](./how-to-manage-high-availability-portal.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)