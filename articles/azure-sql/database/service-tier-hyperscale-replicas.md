---
title: Hyperscale Secondary Replicas
description: This article describes the different types of secondary replicas available in the Hyperscale service tier.
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.topic: overview
author: yorek
ms.author: damauri
ms.reviewer: 
ms.date: 3/29/2021
---

# Hyperscale Secondary Replicas
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]


As described in Distributed functions architecture, Azure SQL Database Hyperscale has two different types of compute nodes, also referred to as “replicas”.
- Primary: serves read and write operations
- Secondary: provides read scale-out, high availability and geo-replication
A secondary replica can be of three different types. Each type has a slightly different architecture, feature set, purpose, and cost. Based on the features you need, you may use just one or even all of the three together.

## High Availability Replica

A high-availability (HA) replica uses the same page servers as the primary replica, so no data copy is required to add an HA replica. HA replicas are mainly used to provide high-availability as they act as a hot standby for failover purposes. If the primary replica becomes unavailable, failover to one of the existing HA replicas is automatic. Connection string doesn’t need to change; during failover applications may experience minimum downtime due to active connections being dropped. As usual for this scenario, proper connection retry logic is recommended. Several drivers already provide some degree of automatic retry logic. 

If you are using .NET, the [latest Microsoft.Data.SqlClient](https://devblogs.microsoft.com/azure-sql/configurable-retry-logic-for-microsoft-data-sqlclient/) library provides native full support to configurable automatic retry logic. 
HA replicas use the same server and database name of the primary replica. Their Service Level Objective is also always the same as for the primary replica. HA replicas are not manageable as a stand-alone resource from the portal or from any other tool or DMV. 

There can be zero to four HA replicas. Their number can be changed during the creation of a database or after the database has been created, via the usual management endpoint and tools (eg: PowerShell, AZ CLI, Portal, REST API). Creating or removing HA replicas does not affect connections running on the primary replica.

### Connecting to an HA replica

In Hyperscale databases, the ApplicationIntent argument in the connection string used by the client dictates whether the connection is routed to the read-write primary replica or to a read-only HA replica. If the ApplicationIntent set to `ReadOnly` and the database doesn't have a secondary replica, connection will be routed to the primary replica and will default to the `ReadWrite` behavior.

```
-- Connection string with application intent
Server=tcp:<myserver>.database.windows.net;Database=<mydatabase>;ApplicationIntent=ReadOnly;User ID=<myLogin>;Password=<myPassword>;Trusted_Connection=False; Encrypt=True;
```

Given that for a given Hyperscale database all HA replicas are identical in their resource capacity, if more than one secondary replica is present, the read-intent workload is distributed across all available HA secondaries. When where are multiple HA replica, keep in mind that each one could have different data latency with respect to data changes made on the primary. Each HA replica uses the same data as the primary on the same set of page servers. Local caches on each HA replica are kept in sync with the primary via the transaction log service, which forwards log records from the primary replica to HA replicas. As a result, depending on the workload being processed by an HA replica, application of log records may happen at different speeds and thus different replicas could have different data latency relative to the primary replica.

## Named Replica (in Preview)

A named replica, just like an HA replica, uses the same page servers as the primary replica. Similarly to HA replicas, there is no data copy needed to add a Named Replica. The difference from HA replicas is that named replicas: 

- appear as regular (read-only) Azure SQL databases in the portal and in API (CLI, PowerShell, T-SQL) calls 
- can have database name different from the primary replica, and optionally be located on a different logical server (as long as it is in the same region as the primary replica) 
- have their own Service Level Objective that can be set and changed independently from the primary replica
- support for up to 30 named replicas (for each primary replica) 
- support different authentication and authorization for each named replica by creating different logins on logical servers hosting named replicas

The main goal of named replicas is to allow massive OLTP read scale-out scenario and to improve Hybrid Transactional and Analytical Processing (HTAP) workloads. Examples of how to create such solutions are available here:

- [OLTP massive scale-out sample](https://github.com/Azure-Samples/azure-sql-db-named-replica-oltp-scaleout)
- [HTAP sample](https://github.com/Azure-Samples/azure-sql-db-named-replica-htap)

Aside from the main scenarios listed above, named replicas offer flexibility and elasticity to also satisfy many other use cases:
- Access Isolation: grant a login access to a named replica only and deny it from accessing the primary replica or other named replicas.
- Workload Dependent Service Objective: as a named replica can have its own Service Level Objective, it is possible use different named replicas for different workloads and use cases. For example, one named replica could be used to serve PowerBI requests, while another can be used to serve data to Apache Spark for Data Science tasks. Each one can have independent service level objective and scale independently.
- Workload Dependent Routing: with up to 30 named replicas, it is possible to use named replicas in groups so that an application can be isolated from another. For example, a group of 4 named replicas could be used to serve requests coming from mobile applications, while another group of 2 named replicas can be used to serve requests coming from a web application. This approach would allow a very fine-grained tuning of performance and costs for each group.

The following example creates named replica WideWorldImporters01 on server WideWorldImporterServer for database WideWorldImporters with service level objective HS_Gen5_4

```tsql
ALTER DATABASE [WideWorldImporters]
ADD SECONDARY ON SERVER [WideWorldImporterServer] 
WITH (SERVICE_OBJECTIVE = 'HS_Gen5_2', SECONDARY_TYPE = Named, DATABASE_NAME = [WideWorldImporters01])
```
```azurepowershell
New-AzSqlDatabaseSecondary -ResourceGroupName "SampleResourceGroup" -ServerName "WideWorldImporterServer" -DatabaseName "WideWorldImporters" -PartnerResourceGroupName "SampleResourceGroup" -PartnerServerName "WideWorldImporterServer" -PartnerDatabaseName "WideWorldImporters01" -SecondaryServiceObjectiveName HS_Gen5_2
```
```azurecli
az sql db replica create -g SampleResourceGroup -n WideWorldImporters -s WideWorldImporterServer --secondary-type named --partner-database WideWorldImporters01 --partner-server WideWorldImporterServer
```

As there is no data movement involved, creation will usually take only up to a minute. Once the named replica is available it will be visible from the portal or any command line tool like AZ CLI or PowerShell. A named replica is usable as a regular database, with the exception that it is read-only. 

### Connecting to a named replica

To connect to a named replica, you must use the connection string for that named replica. There is no need to specify the option “ApplicationIntent” as named replicas are always read-only. Using it is still possible but will not have any additional effect.
Just like for HA replicas, even though the primary, HA, and named replicas share the same data on the same set of page servers, caches on each named replica are kept in sync with the primary via the transaction log service which forwards log records from the primary to named replicas. As a result, depending on the workload being processed by a named replica, application of the log records may happen at different speeds and thus different replicas could have different data latency relative to the primary replica.

### Modifying a named replica

You can define the service level objective of a named replica when you create it, via the ALTER DATABASE command or in any other supported way. If you need to change the service level objective after the named replica has been created, you can do it using the regular ALTER DATABASE…MODIFY command on the named replica itself. For example, if “WideWorldImporters01” is the named replica of “WideWorldImporters” database, you can do it as shown below (it will take up to a minute max).


```tsql
ALTER DATABASE [WideWorldImporters01] MODIFY (SERVICE_OBJECTIVE = ‘HS_Gen5_8’)
```
```azurepowershell
```
```azurecli
```

### Removing a named replica

To remove a named replica, you drop it just like you would do with a regular database. 

```tsql
DROP DATABASE [WideWorldImporters01]
```
```azurepowershell
```
```azurecli
```

### Frequently Asked Questions

#### Can a named replica be used as a failover target?
No, named replicas cannot be used as failover targets. Use HA replicas for that purpose.

#### How can I distribute the read-only workload across my named replicas?
Since every named replica may have a different service level objective and thus be used for different use cases, there is no built-in way to direct read-only traffic sent to the primary to the related named replicas. For example, you may have 8 named replicas, and you may want to direct OLTP workload only to named replicas 1 to 4, while all the Power BI analytical workloads will use named replicas 5 and 6 and the data science workload will use replica 7 and 8. Depending on which tool or programming language you use, strategies to distribute such workload may vary. One example of creating a workload routing solution to allow a REST backend to scale out is here: [Link to OLTP massive scale-out sample]

#### Can a named replica be a region different from the region of the primary replica?
No, as named replicas use the same page servers of the primary replica, they must be in the same region.

#### Can a named replica impact availability or performance of the primary replica?
Under normal circumstances it is unlikely, but it can happen. Just like an HA replica, a named replica is kept in sync with the primary via the transaction log service. If a named replica, for any reason, is not able to consume the transaction log fast enough, it will start to ask to the primary replica to slow down (throttle) its log generation, so that it can catch up. To avoid this situation, make sure that your named replicas have enough free resources – mainly CPU – so that they can process the transaction log without delay. For example, if the primary is processing a lot of data changes, it is recommended to have the named replica with at least the same Service Level Objective of the primary, to avoid bottlenecking the CPU on the replicas and thus forcing the primary to slow down.

#### What happens to named replicas if the primary replica is unavailable, for example because of planned maintenance?
Named replicas will still be available for read-only access, as usual.

## Geo Replica

With [Active Geo-replication](https://docs.microsoft.com/azure/azure-sql/database/active-geo-replication-overview), you can create a readable secondary replica of the primary Hyperscale database in the same or in a different region. Geo-replicas must always be created on a different logical server. The database name of a geo-replica always matches the database name of the primary.

When creating a geo-replica, all data is copied from the primary to a different set of page servers. A geo-replica does not share page servers with the primary, even if they are in the same region. This provides the necessary redundancy for geo-failovers.

Geo-replicas are primarily used to maintain a transactionally consistent copy of the database via asynchronous replication in a different geographical region for disaster recovery in case of a disaster or outage in the primary region. Geo-replicas can also be used for geographic read scale-out scenarios.

With [Active geo-replication](https://docs.microsoft.com/azure/azure-sql/database/active-geo-replication-overview), failover must be initiated manually. After failover, the new primary will have a different connection end point, referencing the logical server name hosting the new primary replica. For more details, see [Active geo-replication](https://docs.microsoft.com/azure/azure-sql/database/active-geo-replication-overview).

Geo-replication for Hyperscale databases is currently in preview, with the following limitations:
- Only 1 geo-replica can be created (in the same or different region).
- Failover groups are not supported. 
- Planned failover is not supported.
- Creating a database copy of the geo-replica is not supported. 
- Secondary of a secondary (aka geo-replica chaining) is not supported. 
