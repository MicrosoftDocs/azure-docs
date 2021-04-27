---
title: Overview of zone redundant high availability with Azure Database for MySQL Flexible Server
description: Learn about the concepts of zone redundant high availability with Azure Database for MySQL Flexible Server
author: savjani
ms.author: pariks
ms.service: mysql
ms.topic: conceptual
ms.date: 01/29/2021
---

# High availability concepts in Azure Database for MySQL Flexible Server (Preview)

> [!IMPORTANT] 
> Azure Database for MySQL - Flexible Server is currently in public preview.

Azure Database for MySQL Flexible Server (Preview), allows configuring high availability with automatic failover using **zone redundant** high availability option. When deployed in a zone redundant configuration, flexible server automatically provisions and manages a standby replica in a different availability zone. Using storage level replication, the data is **synchronously replicated** to the standby server in the secondary zone to enable zero data loss after a failover. The failover is fully transparent from the client application and doesn't require any user actions. The standby server is not available for any read or write operations but is a passive standby to enable fast failover. The failover times typically ranges from 60-120 seconds.

Zone redundant high availability configuration enables automatic failover during planned events such as user-initiated scale compute operations, and unplanned events such as underlying hardware and software faults, network failures, and even availability zone failures.

:::image type="content" source="./media/concepts-high-availability/1-flexible-server-overview-zone-redundant-ha.png" alt-text="view of zone redundant high availability":::

## Zone redundancy Architecture

The primary server is deployed in the region and a specific availability zone. When the high availability is chosen, a standby replica server with the same configuration as that of the primary server is automatically deployed, including compute tier, compute size, storage size, and network configuration. The log data is synchronously replicated to the standby replica to ensure zero data loss in any failure situation. Automatic backups, both snapshots and log backups, are performed from the primary database server. 

The health of the HA is continuously monitored and reported on the overview page.

The various replication statuses are listed below:

| **Status** | **Description** |
| :----- | :------ |
| <b>NotEnabled | Zone redundant HA is not enabled |
| <b>CreatingStandby | In the process of creating a new standby |
| <b>ReplicatingData | After the standby is created, it is catching up with the primary server. |
| <b>FailingOver | The database server is in the process of failing over from the primary to the standby. |
| <b>Healthy | Zone redundant HA is in steady state and healthy. |
| <b>RemovingStandby | Based on user action, the standby replica is in the process of deletion.| 

## Advantages

Here are some advantages for using zone redundancy HA feature: 

- Standby replica deploys in an exact VM configuration as that of primary such as vCores, storage, network settings (VNET, Firewall), etc.
- Ability to remove standby replica by disabling high availability.
- Automatic backups are snapshot-based, performed from the primary database server and stored in a zone redundant storage.
- In the event of failover, Azure Database for MySQL flexible server automatically fails over to the standby replica if high availability is enabled. The high availability setup monitors the primary server and bring it back online.
- Clients always connect to the primary database server.
- If there is a database crash or node failure, restarting is attempted first on the same node. If that fails, then the automatic failover is triggered.
- Ability to restart the server to pick up any static server parameter changes.

## Steady-state operations

Applications are connected to the primary server using the database server name. The standby replica information is not exposed for direct access. Commits and writes are acknowledged to the application only after the log files are persisted on both the primary server's disk and the standby replica in a synchronous manner. Due to this additional round-trip requirement, applications can expect elevated latency for writes and commits. You can monitor the health of the high availability on the portal.

## Failover process 
For business continuity, you need to have a failover process for planned and unplanned events. 

### Planned events

Planned downtime events include activities scheduled by Azure such as periodic software updates, minor version upgrades or that are initiated by customers such as scale compute and scale storage operations. All these changes are first applied to the standby replica. During that time, the applications continue to access primary server. Once the standby replica is updated, primary server connections are drained, a failover is triggered which activates the standby replica to be the primary with the same database server name by updating the DNS record. Client connections are disconnected and they have to reconnect and can resume their operations. A new standby server is established in the same zone as the old primary. The overall failover time is expected to be 60-120 s. 

>[!NOTE]
> In case of the compute scaling operation, we scale the secondary replica server followed by the primary server. There is no failover involved.

### Failover process - unplanned events
Unplanned service downtimes include software bugs that or infrastructure faults such as compute, network, storage failures, or power outages impacts the availability of the database. In the event of the database unavailability, the replication to the standby replica is severed and the standby replica is activated to be the primary database. DNS is updated, and clients then reconnect to the database server and resume their operations. The overall failover time is expected to take 60-120 s. However, depending on the activity in the primary database server at the time of the failover such as large transactions and recovery time, the failover may take longer.

### Forced Failover
Azure Database for MySQL forced failover enables you to manually force a failover, allowing you to test the functionality with your application scenarios, and helps you to be ready in case of any outages. Forced failover switches the standby server to become the primary server by triggering a failover which activates the standby replica to become the primary server with the same database server name by updating the DNS record. The original primary server will be restarted and switched to standby replica. Client connections are disconnected and have to be reconnected to resume their operations. Depending on the current workload and the last checkpoint the overall failover time will be measured. In general, it is expected to be between 60-120s.

## Schedule maintenance window 

Flexible servers offer maintenance scheduling capability wherein you can choose a 30-minute window in a day of your preference during which the Azure maintenance works such as patching or minor version upgrades would happen. For your flexible servers configured with high availability, these maintenance activities are performed on the standby replica first. 

## Point-in-time restore 
As flexible server is configured in high availability synchronously replicates data, the standby server is up to date with the primary. Any user errors on the primary - such as an accidental drop of a table or incorrect updates are faithfully replicated to the standby. Hence, you cannot use standby to recover from such logical faults. To recover from these logical errors, you have to perform point-in-time restore to the time right before the error occurred. Using flexible server's point-in-time restore capability, when you restore the database configured with high availability, a new database server is restored as a new flexible server with a user-provided name. You can then export the object from the database server and import it to your production database server. Similarly, if you want to clone your database server for testing and development purposes, or you want to restore for any other purposes, you can either choose the latest restore point or a custom restore point. The restore operation creates a single zone flexible server.

## Mitigate downtime 
When you are not using Zone redundancy HA feature, you need to still be able to mitigate downtime for your application. Planning service downtimes such as scheduled patches, minor version upgrades or the user initiated operations can be performed as part of scheduled maintenance windows. Planned service downtimes such as scheduled patches, minor version upgrades or the user initiated operations such as scale compute incurs downtime. To mitigate application impact for Azure initiated maintenance tasks, you can choose to schedule them during the day of the week and time which least impacts the application. 

During unplanned downtime events such as database crash or the server failure, the impacted server is restarted within the same zone. Though rare, if the entire zone is impacted, you can restore the database on another zone within the region. 

## Things to know with Zone redundancy 

Here are few considerations to keep in mind when you use zone redundancy high availability: 

- High availability can **only** be set during flexible server create time.
- High availability is not supported in burstable compute tier.
- Due to synchronous replication to another availability zone, primary database server can experience elevated write and commit latency.
- Standby replica cannot be used for read-only queries.
- Depending on the activity on the primary server at the time of failover, it might take up to 60-120 seconds or longer for the failover to complete.
- Restarting the primary database server to pick up static parameter changes also restarts standby replica.
- Configuring read replicas for zone redundant high availability servers is not supported.
- Configuring customer initiated management tasks cannot be automated during managed maintenance window.
- Planned events such as scale compute and minor version upgrades happen in both primary and standby at the same time. 


## Next steps

- Learn about [business continuity](./concepts-business-continuity.md)
- Learn about [zone redundant high availability](./concepts-high-availability.md)
- Learn about [backup and recovery](./concepts-backup-restore.md)
