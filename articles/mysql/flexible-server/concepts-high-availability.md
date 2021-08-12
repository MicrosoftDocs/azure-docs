---
title: Overview of zone redundant high availability with Azure Database for MySQL Flexible Server
description: Learn about the concepts of zone redundant high availability with Azure Database for MySQL Flexible Server
author: savjani
ms.author: pariks
ms.service: mysql
ms.topic: conceptual
ms.date: 08/10/2021
---

# High availability concepts in Azure Database for MySQL Flexible Server (Preview)

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

> [!IMPORTANT] 
> Azure Database for MySQL - Flexible Server is currently in public preview.

## High Availability Options
Azure Database for MySQL Flexible Server (Preview), allows configuring high availability with automatic failover. When high availability is configured, flexible server automatically provisions and manages a standby replica using two different options

* **Zone Redundant High Availability**: this option is preferred for complete isolation and redundancy of infrastructure across multiple availability zones. It provides highest level of availability but it requires you to configure application redundancy across zones. Zone redundant HA is preferred when you want to achieve highest level of availability against any infrastructure failure in the availability zone and where latency across the availability zone is acceptable. Zone redundant HA is available in [subset of Azure regions](https://docs.microsoft.com/azure/mysql/flexible-server/overview#azure-regions) where the region supports multiple availability zones and Zone redundant HA is available.

* **Same-Zone High Availability**: this option is preferred for infrastructure redundancy with lower network latency as both primary and standby server will be in the same availability zone. It provides high availability without configuring application redundancy across zones. Same-Zone HA is preferred when you want to achieve highest level of availability within a single availability zone with the lowest network latency. Same-Zone HA is available in all [Azure regions which Flexible server is available in](https://docs.microsoft.com/azure/mysql/flexible-server/overview#azure-regions).  

## Zone Redundant High Availability

When the flexible server is created with zone redundant high availability enabled, the data and log files are hosted in a [Zone-redundant storage (ZRS)](https://docs.microsoft.com/azure/storage/common/storage-redundancy#redundancy-in-the-primary-region). Using storage level replication available with ZRS, the data and log files are synchronously replicated to the standby server to ensure zero data loss. The failover is fully transparent from the client application and doesn't require any user actions. The recovery of the standby server to come online during failover is dependent on the binary log application on the standby. It is therefore advised to use primary keys on all the tables to reduce failover time. The standby server is not available for any read or write operations but is a passive standby to enable fast failover. The failover times typically ranges from 60-120 seconds.

> [!Note]
> Zone redundant HA might cause 5-10% drop in latency if the application connecting to the database server across availability zones where network latency is relatively higher in the order of 2-4ms. 

:::image type="content" source="./media/concepts-high-availability/1-flexible-server-overview-zone-redundant-ha.png" alt-text="zone redundant ha":::

### Zone Redundancy Architecture

The primary server is deployed in the region and a specific availability zone. When the high availability is chosen, a standby replica server with the same configuration as that of the primary server is automatically deployed in the "specified availability zone", including compute tier, compute size, storage size, and network configuration. The log data is synchronously replicated to the standby replica to ensure zero data loss in any failure situation. Automatic backups, both snapshots and log backups, are performed on a zone redundant storage from the primary database server.

### Standby Zone Selection
In zone redundant high availability scenario you may choose the standby server zone location of your choice. Co-locating the standby database servers and standby applications in the same zone reduces latencies and allows users to better prepare for disaster recovery situations and “zone down” scenarios.

## Same-Zone High Availability

When the flexible server is created with same-zone high availability enabled, the data and log files are hosted in a [Locally redundant storage (LRS)](https://docs.microsoft.com/azure/storage/common/storage-redundancy#locally-redundant-storage). Using storage level replication available with LRS, the data and log files are synchronously replicated to the standby server to ensure zero data loss. The standby server offers infrastructure redundancy with a separate virtual machine (compute) which reduces the failover time and network latency between the user application and the database server due to colocation. The failover is fully transparent from the client application and doesn't require any user actions. The recovery of the standby server to come online during failover is dependent on the binary log application on the standby. It is therefore advised to use primary keys on all the tables to reduce failover time. The standby server is not available for any read or write operations but is a passive standby to enable fast failover. The failover times typically ranges from 60-120 seconds.

Same-Zone high availability enable users to place a standby server in the same zone as the primary server, which reduces the replication lag between primary and standby. This also provides for lower latencies between the application server and database server if placed within the same Azure availability zone.

:::image type="content" source="./media/concepts-high-availability/flexible-server-overview-same-zone-ha.png" alt-text="same redundant high availability":::

## High Availability Monitoring
The health of the HA is continuously monitored and reported on the overview page. The various replication statuses are listed below:

| **Status** | **Description** |
| :----- | :------ |
| <b>NotEnabled | Zone redundant HA is not enabled |
| <b>ReplicatingData | After the standby is created, it is catching up with the primary server. |
| <b>FailingOver | The database server is in the process of failing over from the primary to the standby. |
| <b>Healthy | Zone redundant HA is in steady state and healthy. |
| <b>RemovingStandby | Based on user action, the standby replica is in the process of deletion.| 

## Advantages

Here are some advantages for using zone redundancy HA feature: 

- Standby replica deploys in an exact VM configuration as that of primary such as vCores, storage, network settings (VNET, Firewall), etc.
- Ability to remove standby replica by disabling high availability.
- Automatic backups are snapshot-based, performed from the primary database server and stored in a zone redundant storage or locally redundant storage depending on the high availability option.
- In the event of failover, Azure Database for MySQL flexible server automatically fails over to the standby replica if high availability is enabled. The high availability setup monitors the primary server and bring it back online.
- Clients always connect to the primary database server.
- If there is a database crash or node failure, the flexible server VM is restarted on the same node. At the same time, an automatic failover is triggered. If flexible server VM restart is successful before the failover finishes, the failover operation will be canceled.
- Ability to restart the server to pick up any static server parameter changes.
- 

## Steady-state Operations

Applications are connected to the primary server using the database server name. The standby replica information is not exposed for direct access. Commits and writes are acknowledged after flushing the log files at the Primary Server's Zone-redundant storage (ZRS) storage. Due to the sync replication technology used in ZRS storage, applications can expect minor latency for writes and commits.

## Failover Process 
For business continuity, you need to have a failover process for planned and unplanned events. 

>[!NOTE]
> Always use fully qualified domain name (FQDN) to connect to your primary server and avoid using IP address to connect. In case of failover, once primary and standby server role are switched, DNS A-record might change too which would prevent the application from connecting to the new primary server if IP address is used in the connection string. 

### Planned events - Forced Failover

Azure Database for MySQL forced failover enables you to manually force a failover, allowing you to test the functionality with your application scenarios, and helps you to be ready in case of any outages. Forced failover switches the standby server to become the primary server by triggering a failover which activates the standby replica to become the primary server with the same database server name by updating the DNS record. The original primary server will be restarted and switched to standby replica. Client connections are disconnected and have to be reconnected to resume their operations. Depending on the current workload and the last checkpoint the overall failover time will be measured. In general, it is expected to be between 60-120s. 

### Failover process - unplanned events
Unplanned service downtimes include software bugs that or infrastructure faults such as compute, network, storage failures, or power outages impacts the availability of the database. In the event of the database unavailability, the replication to the standby replica is severed and the standby replica is activated to be the primary database. DNS is updated, and clients then reconnect to the database server and resume their operations. The overall failover time is expected to take 60-120 s. However, depending on the activity in the primary database server at the time of the failover such as large transactions and recovery time, the failover may take longer.

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
