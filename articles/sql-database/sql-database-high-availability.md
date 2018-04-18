---
title: High availability - Azure SQL Database service | Microsoft Docs
description: Learn about the Azure SQL Database service high availability capabilities and features
services: sql-database
author: anosov1960
manager: craigg
ms.service: sql-database
ms.topic: article
ms.date: 04/04/2018
ms.author: sashan
ms.reviewer: carlrab
---
# High-availability and Azure SQL Database
Since the inception of the Azure SQL Database PaaS offering, Microsoft has made the promise to its customers that High Availability (HA) is built in to the service and the customers are not required to operate, add special logic to, or make decisions around HA. Microsoft maintains full control over the HA system configuration and operation, offering customers an SLA. The HA SLA applies to a SQL database in a region and does not provide protection in cases of a total region failure that is due to factors outside of Microsoft's reasonable control (for example, natural disaster, war, acts of terrorism, riots, government action, or a network or device failure external to Microsoft's data centers, including at customer sites or between customer sites and Microsoft's data center).

To simplify the problem space of HA, Microsoft uses the following assumptions:
1.	Hardware and software failures are inevitable
2.	Operational staff make mistakes that lead to failures
3.	Planned servicing operations cause outages 

While such individual events are infrequent, at cloud scale, they occur every week if not every day. 

## Fault-tolerant SQL databases
Customers are most interested in the resiliency of their own databases and are less interested in the resiliency of the SQL Database service as a whole. 99.99% uptime for a service is meaningless if “my database” is part of the 0.01% of databases that are down. Each and every database needs to be fault-tolerant and fault mitigation should never result in the loss of a committed transaction. 

For data, SQL Database uses both local storage (LS) based on direct attached disks/VHDs and remote storage (RS) based on Azure Premium Storage page blobs. 
- Local storage is used in the Premium or Business Critical (preview) databases and elastic pools, which are designed for mission critical OLTP applications with high IOPS requirements. 
- Remote storage is used for Basic and Standard service tiers, designed for budget oriented business workloads that require storage and compute power to scale independently. They use a single page blob for database and log files, and built-in storage replication and failover mechanisms.

In both cases, the replication, failure detection, and failover mechanisms of SQL Database are fully automated and operate without human intervention. This architecture is designed to ensure that committed data is never lost and that data durability takes precedence over all else.

Key benefits:
- Customers get the full benefit of replicated databases without having to configure or maintain complicated hardware, software, operating systems, or virtualization environments.
- Full ACID properties of relational databases are maintained by the system.
- Failovers are fully automated without loss of any committed data.
- Routing of connections to the primary replica is dynamically managed by the service with no application logic required.
- The high level of automated redundancy is provided at no extra charge.

> [!NOTE]
> The described high availability architecture is subject to change without notice. 

## Data redundancy

The high availability solution in SQL Database is based on [Always ON Availability Groups](/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server) technology from SQL Server and makes it work for both LS and RS databases with minimal differences. In LS configuration, the Always ON availability group technology is used for persistence while in RS it is used for availability (low RTO by Active geo-replication). 

## Local storage configuration

In this configuration, each database is brought online by the management service (MS) within the control ring. One primary replica and at least two secondary replicas (quorum-set) are located within a tenant ring that spans three independent physical subsystems within the same datacenter. All reads and writes are sent by the gateway (GW) to the primary replica and the writes are asynchronously replicated to the secondary replicas. SQL Database uses a quorum-based commit scheme where data is written to the primary and at least one secondary replica before the transaction commits.

The [Service Fabric](../service-fabric/service-fabric-overview.md) failover system automatically rebuilds replicas as nodes fail and maintains quorum-set membership as nodes depart and join the system. Planned maintenance is carefully coordinated to prevent the quorum-set going down below a minimum replica count (generally 2). This model works well for Premium and Business Critical (preview) databases, but it requires redundancy of both compute and storage components, and results in a higher cost.

## Remote storage configuration

For remote storage configurations (Basic and Standard tiers), exactly one copy is maintained in remote blob storage, using the storage systems capabilities for durability, redundancy, and bit-rot detection. 

The high availability architecture is illustrated by following diagram:
 
![high availability architecture](./media/sql-database-high-availability/high-availability-architecture.png)

## Failure detection and recovery 
A large-scale distributed system needs a highly reliable failure detection system that can detect failures reliably, quickly, and as close as possible to the customer. For SQL Database, this system is based on Azure Service Fabric. 

With the primary replica, it is immediately evident if and when the primary replica has failed and work cannot continue because all reads and writes take place on the primary replica first. This process of promoting a secondary replica to the status of primary has recovery time objective (RTO)=30 sec and recovery point objective (RPO)=0. To mitigate the impact of the 30 sec RTO, the best practice is to try to reconnect several times with a smaller wait time for connection failure attempts.

When a secondary replica fails, the database is down to a minimal quorum-set, with no spares. Service fabric initiates the reconfiguration process similar to the process that follows failure of the primary replica, so after a short wait to determine whether the failure is permanent, another secondary replica is created. In cases of temporary out-of-service state, such as an operating system failure or an upgrade, a new replica is not built immediately to allow the failed node to restart instead. 

For the remote storage configurations, SQL Database uses Always ON functionality to failover databases during upgrades. To do that, a new SQL instance is spun off in advance as part of the planned upgrade event, and it attaches and recovers the database file from remote storage. In case of process crashes or other unplanned events, Windows Fabric manages the instance availability and, as a last step of recovery, attaches the remote database file.

## Zone redundant configuration (preview)

By default, the quorum-set replicas for the local storage configurations are created in the same datacenter. With the introduction of [Azure Availability Zones](../availability-zones/az-overview.md), you have the ability to place the different replicas in the quorum-sets to different availability zones in the same region. To eliminate a single point of failure, the control ring is also duplicated across multiple zones as three gateway rings (GW). The routing to a specific gateway ring is controlled by [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) (ATM). Because the zone redundant configuration does not create additional database redundancy, the use of Availability Zones in the Premium or Business Critical (preview) service tiers is available at no extra cost. By selecting a zone redundant database, you can make your Premium or Business Critical (preview) databases resilient to a much larger set of failures, including catastrophic datacenter outages, without any changes of the application logic. You can also convert any existing Premium or Business Critical databases or pools (preview) to the zone redundant configuration.

Because the zone redundant quorum-set has replicas in different datacenters with some distance between them, the increased network latency may increase the commit time and thus impact the performance of some OLTP workloads. You can always return to the single-zone configuration by disabling the zone redundancy setting. This process is a size of data operation and is similar to the regular service level objective (SLO) update. At the end of the process, the database or pool is migrated from a zone redundant ring to a single zone ring or vice versa.

> [!IMPORTANT]
> Zone redundant databases and elastic pools are only supported in the Premium and Business Critical (preview) service tiers. During public preview, backups and audit records are stored in RA-GRS storage and therefore may not be automatically available in case of a zone-wide outage. 

The zone redundant version of the high availability architecture is illustrated by the following diagram:
 
![high availability architecture zone redundant](./media/sql-database-high-availability/high-availability-architecture-zone-redundant.png)

## Read scale-out
As described, Premium and Business Critical (preview) service tiers leverage quorum-sets and AlwaysON technology for High Availability both in single zone and zone redundant configurations. One of the benefits of AlwasyON is that the replicas are always in the transactionally consistent state. Because the replicas have the same performance level as the primary, the application can take advantage of that extra capacity for servicing the read-only workloads at no extra cost (read scale-out). This way the read-only queries will be isolated from the main read-write workload and will not affect its performance. Read scale-out feature is intended for the applications that include logically separated read-only workloads such as analytics, and therefore could leverage this additional capacity without connecting to the primary. 

To use the Read Scale-Out feature with a particular database, you must explicitly enable it when creating the database or afterwards by altering its configuration using PowerShell by invoking the [Set-AzureRmSqlDatabase](/powershell/module/azurerm.sql/set-azurermsqldatabase) or the [New-AzureRmSqlDatabase](/powershell/module/azurerm.sql/new-azurermsqldatabase) cmdlets or through the Azure Resource Manager REST API using the [Databases - Create or Update](/rest/api/sql/databases/createorupdate) method.

After Read Scale-Out is enabled for a database, applications connecting to that database will be directed to either the read-write replica or to a read-only replica of that database according to the `ApplicationIntent` property configured in the application’s connection string. For information on the `ApplicationIntent` property, see [Specifying Application Intent](https://docs.microsoft.com/sql/relational-databases/native-client/features/sql-server-native-client-support-for-high-availability-disaster-recovery#specifying-application-intent) 

The Read Scale-Out feature supports session level consistency. If the read-only session reconnects after a connection error cause by replica unavailability, it can be redirected to a different replica. While unlikely, it can result in processing the data set that is stale. Likewise, if an application writes data using a read-write session and immediately reads it using the read-only session, it is possible that the new data is not immediately visible.

## Conclusion
Azure SQL Database is deeply integrated with the Azure platform and is highly dependent on Service Fabric for failure detection and recovery, on Azure Storage Blobs for data protection and Availability Zones for higher fault tolerance. At the same time, Azure SQL database fully leverages the Always On technology from SQL Server box product for replication and failover. The combination of these technologies enables the applications to fully realize the benefits of a mixed storage model and support the most demanding SLAs. 

## Next steps

- Learn about [Azure Availability Zones](../availability-zones/az-overview.md)
- Learn about [Service Fabric](../service-fabric/service-fabric-overview.md)
- Learn about [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) 
