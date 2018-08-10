---
title: High availability - Azure SQL Database service | Microsoft Docs
description: Learn about the Azure SQL Database service high availability capabilities and features
services: sql-database
author: jovanpop-msft
manager: craigg
ms.service: sql-database
ms.topic: conceptual
ms.date: 07/16/2018
ms.author: jovanpop
ms.reviewer: carlrab, sashan
---
# High-availability and Azure SQL Database

Azure SQL Database is highly available database Platform as a Service that guarantees that your database is up and running 99.99% of time, without worrying about maintenance and downtimes. This is a fully managed SQL Server Database Engine process hosted in the Azure cloud that ensures that your SQL Server database is always upgraded/patched without affecting your workload. Azure SQL Database can quickly recover even in the most critical circumstances ensuring that your data is always available.

Azure platform fully manages every Azure SQL Database and guarantees no data loss and a high percentage of data availability. Azure automatically handles patching, backups, replication, failure detection, underlying potential hardware, software or network failures, deploying bug fixes, failovers, database upgrades, and other maintenance tasks. SQL Server engineers have implemented the best-known practices, ensuring that all the maintenance operations are completed in less than 0.01% time of your database life. This architecture is designed to ensure that committed data is never lost and that maintenance operations are performed without affecting workload. There are no maintenance windows or downtimes that should require you to stop the workload while the database is upgraded or maintained. Built-in high availability in Azure SQL Database guarantees that database will never be single point of failure in your software architecture.

There are two high-availability models applied in Azure SQL:

- Standard/general purpose model that provides 99.99% of availability but with some potential performance degradation during maintenance activities.
- Premium/business critical model that provides also provides 99.99% availability with minimal performance impact on your workload even during maintenance activities.

Azure upgrades and patches underlying operating system, drivers, and SQL Server Database Engine transparently with the minimal down-time for end users. Azure SQL Database runs on the latest stable version of SQL Server Database Engine and Windows OS, and most of the users would not notice that the upgrades are performed continuously.

## Standard availability

Standard availability refers to 99.99% SLA that is applied in Standard/Basic/General Purpose tiers. Availability is achieved by separation of compute and storage layers. In the standard availability model we have two layers:

- A stateless compute layer that is running the sqlserver.exe process and contains only transient and cached data (for example – plan cache, buffer pool, column store pool). This stateless SQL Server node is operated by Azure Service Fabric that initializes process, controls health of the node, and performs failover to another place if necessary.
- A stateful data layer with database files (.mdf/.ldf) that are stored in Azure Premium Storage Disks. Azure Storage guarantees that there will be no data loss of any record that is placed in any database file. Azure Storage has built-in data availability/redundancy that ensures that every record in log file or page in data file will be preserved even if SQL Server process crashes.

Whenever database engine or operating system is upgraded, or if some critical issue is detected in Sql Server process, Azure Service Fabric will move the stateless SQL Server process to another stateless compute node. Data in Azure Storage layer is not affected, and data/log files are attached to newly initialized SQL Server process. Expected failover time can be measured in seconds. This process guarantees 99.99% availability, but it might have some performance impacts on heavy workload that are running due to transition time and the fact the new SQL Server node starts with cold cache.

## Premium availability

Premium availability is enabled in Premium tier of Azure SQL Database and it is designed for intensive workloads that cannot tolerate any performance impact due to the ongoing maintenance operations.

In the premium model, Azure SQL database integrates compute and storage on the single node. Both the SQL Server Database Engine process and underlying mdf/ldf files are placed on the same node with locally attached SSD storage providing low latency to your workload.

High availability is implemented using standard [Always On Availability Groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server). Every database is a cluster of database nodes with one primary database that is accessible for customer workload, and a few secondary processes containing copies of data. The primary node constantly pushes the changes to secondary nodes in order to ensure that the data is available on secondary replicas if the primary node crashes for any reason. Failover is handled by the SQL Server Database Engine – one secondary replica becomes the primary node and a new secondary replica is created to ensure enough nodes in the cluster. The workload is automatically redirected to the new primary node. Failover time is measured in milliseconds and the new primary instance is immediately ready to continue serving requests.

## Zone redundant configuration

By default, the quorum-set replicas for the local storage configurations are created in the same datacenter. With the introduction of [Azure Availability Zones](../availability-zones/az-overview.md), you have the ability to place the different replicas in the quorum-sets to different availability zones in the same region. To eliminate a single point of failure, the control ring is also duplicated across multiple zones as three gateway rings (GW). The routing to a specific gateway ring is controlled by [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) (ATM). Because the zone redundant configuration does not create additional database redundancy, the use of Availability Zones in the Premium or Business Critical service tiers is available at no extra cost. By selecting a zone redundant database, you can make your Premium or Business Critical databases resilient to a much larger set of failures, including catastrophic datacenter outages, without any changes of the application logic. You can also convert any existing Premium or Business Critical databases or pools to the zone redundant configuration.

Because the zone redundant quorum-set has replicas in different datacenters with some distance between them, the increased network latency may increase the commit time and thus impact the performance of some OLTP workloads. You can always return to the single-zone configuration by disabling the zone redundancy setting. This process is a size of data operation and is similar to the regular service level objective (SLO) update. At the end of the process, the database or pool is migrated from a zone redundant ring to a single zone ring or vice versa.

The zone redundant version of the high availability architecture is illustrated by the following diagram:
 
![high availability architecture zone redundant](./media/sql-database-high-availability/high-availability-architecture-zone-redundant.png)

## Read scale-out
As described, Premium and Business Critical service tiers leverage quorum-sets and Always On technology for High Availability both in single zone and zone redundant configurations. One of the benefits of AlwaysOn is that the replicas are always in the transactionally consistent state. Because the replicas have the same performance level as the primary, the application can take advantage of that extra capacity for servicing the read-only workloads at no extra cost (read scale-out). This way the read-only queries will be isolated from the main read-write workload and will not affect its performance. Read scale-out feature is intended for the applications that include logically separated read-only workloads such as analytics, and therefore could leverage this additional capacity without connecting to the primary. 

To use the Read Scale-Out feature with a particular database, you must explicitly activate it when creating the database or afterwards by altering its configuration using PowerShell by invoking the [Set-AzureRmSqlDatabase](/powershell/module/azurerm.sql/set-azurermsqldatabase) or the [New-AzureRmSqlDatabase](/powershell/module/azurerm.sql/new-azurermsqldatabase) cmdlets or through the Azure Resource Manager REST API using the [Databases - Create or Update](/rest/api/sql/databases/createorupdate) method.

After Read Scale-Out is enabled for a database, applications connecting to that database will be directed to either the read-write replica or to a read-only replica of that database according to the `ApplicationIntent` property configured in the application’s connection string. For information on the `ApplicationIntent` property, see [Specifying Application Intent](https://docs.microsoft.com/sql/relational-databases/native-client/features/sql-server-native-client-support-for-high-availability-disaster-recovery#specifying-application-intent). 

If Read Scale-Out is disabled or you set the ReadScale property in an unsupported service tier, all connections are directed to the read-write replica, independent of the `ApplicationIntent` property.  

> [!NOTE]
> It is possible to activate Read Scale-out on a Standard or a General Purpose database, even though it will not result in routing the  read-only intended session to a separate replica. This is done to support existing applications that scale up and down between Standard/General Purpose and Premium/Business Critical tiers.  

The Read Scale-Out feature supports session level consistency. If the read-only session reconnects after a connection error cause by replica unavailability, it can be redirected to a different replica. While unlikely, it can result in processing the data set that is stale. Likewise, if an application writes data using a read-write session and immediately reads it using the read-only session, it is possible that the new data is not immediately visible.

## Conclusion
Azure SQL Database is deeply integrated with the Azure platform and is highly dependent on Service Fabric for failure detection and recovery, on Azure Storage Blobs for data protection and Availability Zones for higher fault tolerance. At the same time, Azure SQL database fully leverages the Always On Availability Group technology from SQL Server box product for replication and failover. The combination of these technologies enables the applications to fully realize the benefits of a mixed storage model and support the most demanding SLAs. 

## Next steps

- Learn about [Azure Availability Zones](../availability-zones/az-overview.md)
- Learn about [Service Fabric](../service-fabric/service-fabric-overview.md)
- Learn about [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) 
