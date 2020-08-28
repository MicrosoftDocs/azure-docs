---
title: Overview of zone redundant high availability with Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of zone redundant high availability with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 08/28/2020
---
# High availability concepts in Azure Database for PostgreSQL-Flexible server

Azure Database for PostgreSQL - Flexible Server, which is currently in public preview, allows configuring high availability with automatic failover using
**zone redundant** deployment. When deployed in a zone redundant configuration, flexible server automatically provisions and manages a standby replica in a different availability zone within the same region. Using PostgreSQL streaming replication, the data is replicated to the standby server in **synchronous** mode to enable zero data loss after a failover.

Zone redundant configuration enables automatic failover capability during planned events such as user-initiated scale compute operation, and also when unplanned events such as underlying hardware and software faults, network failures, and availability zone failures.

![view of zone redundant high availability](./media/business-continuity/concepts-zr-ha-architecture.png)

## Zone redundant high availability architecture

Primary database server is deployed in the region and the availability zone of your choice. A standby replica server is provisioned in a different zone with the same configuration as the primary server, including compute tier, compute size, storage size, and network configuration. Write ahead logs (WAL) files are replicated in synchronous mode to the standby replica. Automatic backups are performed from the primary database server. WAL files are continuously archived to the backup storage from the standby replica. 

The health of the HA is continuously monitored and reported on the overview page. The replication statuses are listed below:
| **Status** | **Description** |
| ----- | ------ |
| <b> NotEnabled | HA is not enabled |
| <b> CreatingStandby | In the creating a new standby |
| <b> ReplicatingData | After the standby is created, it is catching up with the primary. |
| <b> FailingOver | The database server is in the process of failing over to the standby. |
| <b> Healthy | Replication is in steady state and healthy. |
| <b> RemovingStandby | Based on user action, the standby replica is in the process of deletion.| 

## Steady-state operations

Applications are connected to the primary server using the DB server name. The standby replica information is currently not exposed via Azure portal. Commits and writes are confirmed to the application only after the WAL files are persisted on both the primary server's disk and the standby replica. Due to this additional round-trip requirement, applications can expect elevated latency for writes and commits. You can monitor the health of the high availability on the portal.

## Failover process - planned events

Planned downtime events include activities scheduled by Azure such as periodic software updates and minor version upgrades or that are initiated by customers such as scale compute or scale storage operations. All these changes are first applied to the standby replica while the applications continue to access the primary server. Once the standby replica is updated, primary server connections are drained, a failover is triggered which activates the standby replica to be the primary with the same database server name by updating the DNS record. Client connections are disconnected and they will have to reconnect with the same database server name and can resume their operations. A new standby server will be established in the same zone as the old primary. The overall failover time is expected to be 60-120s. 

### Reducing planned downtime with managed maintenance window

 You can schedule the Azure initiated maintenance activities by choosing a 30-minute window in a day of your preference where the activities on the databases are expected to be low. Azure maintenance tasks such as patching or minor version upgrades would happen during that window.  Flexible servers configured with high availability, these maintenance activities are performed on the standby replica first. 


## Failover process - unplanned outage
Unplanned outages include software bugs  or infrastructure faults such as compute, network, storage failures, or power outages impact the availability of the database. In the event of the database unavailability, the replication to the standby replica is severed and the standby replica is activated to be the primary database. Clients can reconnect to the database server and resume their operations. The overall failover time is expected to take 60-120s. However, depending on the activity in the primary database server at the time of the failover such as large transactions and recovery time, the failover may take longer.

## Point-in-time restore 

flexible server that is configured in high availability, replicates data in real time. Hence, the standby data will be up to date with the primary. Any user errors on the primary - such as an accidental drop of a table or incorrect updates are faithfully replicated to the standby. So, you cannot use standby to recover from such logical faults. To recover from these logical errors, you have to perform point-in-time restore to the time right before the error occurred. Using flexible server's point-in-time restore capability, when you restore the database configured with high availability, a new database server will be restored as a single zone flexible server with a user-provided name. You can then export the object from the database server and import it to your production database server. Similarly, if you want to clone your database server for testing and development purposes, or you want to restore for any other purposes, you can either choose the latest restore point or a custom restore point. The restore operation will create a single zone flexible server.

## Non-HA configured servers

Servers configured in a non-HA mode also have zonal resiliency and availability characteristics powered by the Azure infrastructure. 
### Planned downtime 

Planned downtime activities such as patching, minor version upgrades, or the user initiated operations such as scale compute incurs downtime. To mitigate application impact for Azure initiated maintenance tasks, you can choose to schedule them during the day of the week and time which least impacts the application. 

### Unplanned downtime 
During unplanned downtime events such as database crash or the server failure, the impacted server will be restarted within the same zone. Though rare, if the entire zone is impacted, you can restore the database on another zone within the region. 

## High availability - features

-   Standby replica will be deployed in an exact VM configuration same as the primary server, including vCores, storage, network settings
    (VNET, Firewall), etc.

-   Ability to add high availability for an existing database server.

-   Ability to remove standby replica by disabling high availability.

-   Ability to choose your availability zone for your primary database server.

-   Ability to stop, start, and restart both primary and standby database servers.

-   Automatic backups are performed from the primary database server and stored in a zone redundant storage.

-   After a failover, a new standby replica is provisioned in the original primary availability zone to continue to provide high availability.

-   Clients always connect to the primary database server.

-   Ability to restart both primary and standby servers to pick up any static server parameter changes.

## High availability - considerations

-   High availability is not supported in burstable compute tier.
-   High availability is supported only in regions where multiple zones are available.
-   Due to synchronous replication to another availability zone, primary database server can experience elevated write and commit latency.

-   Standby replica cannot be used for read-only queries.

-   Depending on the activity on the primary server at the time of failover, it might take up to 2 minutes or longer for the failover
    to complete.

-   Restarting the primary database server to pick up static parameter changes also restarts standby replica.

-   Logical decoding is not supported when configured in high availability.

-   Configuring read replicas are not supported

-   Configuring customer initiated management tasks cannot be scheduled during managed maintenance window.

-   Planned events such as scale compute and minor version upgrades happen in both primary and standby at the same time. 

## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn how to [manage high availability](./how-to-manage-high-availability.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)