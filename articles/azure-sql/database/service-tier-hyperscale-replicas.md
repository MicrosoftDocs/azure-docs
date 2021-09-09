---
title: Hyperscale secondary replicas
description: This article describes the different types of secondary replicas available in the Hyperscale service tier.
services: sql-database
ms.service: sql-database
ms.subservice: service-overview
ms.topic: overview
author: yorek
ms.author: damauri
ms.reviewer: 
ms.date: 7/27/2021
---

# Hyperscale secondary replicas
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

As described in [Distributed functions architecture](service-tier-hyperscale.md), Azure SQL Database Hyperscale has two different types of compute nodes, also referred to as replicas:

- Primary: serves read and write operations
- Secondary: provides read scale-out, high availability, and geo-replication

Secondary replicas are always read-only, and can be of three different types:

- High Availability replica
- Named replica (in Preview)
- Geo-replica (in Preview)

Each type has a different architecture, feature set, purpose, and cost. Based on the features you need, you may use just one or even all of the three together.

## High Availability replica

A High Availability (HA) replica uses the same page servers as the primary replica, so no data copy is required to add an HA replica. HA replicas are mainly used to increase database availability; they act as hot standbys for failover purposes. If the primary replica becomes unavailable, failover to one of the existing HA replicas is automatic and quick. Connection string doesn't need to change; during failover applications may experience minimal downtime due to active connections being dropped. As usual for this scenario, proper retry logic is recommended. Several drivers already provide some degree of automatic retry logic. If you are using .NET, the [latest Microsoft.Data.SqlClient](https://devblogs.microsoft.com/azure-sql/configurable-retry-logic-for-microsoft-data-sqlclient/) library provides native full support for configurable automatic retry logic.

HA replicas use the same server and database name as the primary replica. Their Service Level Objective is also always the same as for the primary replica. HA replicas are not visible or manageable as a stand-alone resource from the portal or from any API. 

There can be zero to four HA replicas. Their number can be changed during the creation of a database or after the database has been created, via the common management endpoints and tools (for example: PowerShell, AZ CLI, Portal, REST API). Creating or removing HA replicas does not affect active connections on the primary replica.

### Connecting to an HA replica

In Hyperscale databases, the `ApplicationIntent` argument in the connection string used by the client dictates whether the connection is routed to the read-write primary replica or to a read-only HA replica. If `ApplicationIntent` is set to `ReadOnly` and the database doesn't have a secondary replica, connection will be routed to the primary replica and will default to the `ReadWrite` behavior.

```csharp
-- Connection string with application intent
Server=tcp:<myserver>.database.windows.net;Database=<mydatabase>;ApplicationIntent=ReadOnly;User ID=<myLogin>;Password=<myPassword>;Trusted_Connection=False; Encrypt=True;
```

All HA replicas are identical in their resource capacity. If more than one HA replica is present, the read-intent workload is distributed arbitrarily across all available HA replicas. When there are multiple HA replicas, keep in mind that each one could have different data latency with respect to data changes made on the primary. Each HA replica uses the same data as the primary on the same set of page servers. However, local data caches on each HA replica reflect the changes made on the primary via the transaction log service, which forwards log records from the primary replica to HA replicas. As the result, depending on the workload being processed by an HA replica, application of log records may happen at different speeds, and thus different replicas could have different data latency relative to the primary replica.

## Named replica (in Preview)

A named replica, just like an HA replica, uses the same page servers as the primary replica. Similar to HA replicas, there is no data copy needed to add a named replica. 

The difference from HA replicas is that named replicas: 

- appear as regular (read-only) Azure SQL databases in the portal and in API (AZ CLI, PowerShell, T-SQL) calls;
- can have database name different from the primary replica, and optionally be located on a different logical server (as long as it is in the same region as the primary replica);
- have their own Service Level Objective that can be set and changed independently from the primary replica;
- support for up to 30 named replicas (for each primary replica);
- support different authentication for each named replica by creating different logins on logical servers hosting named replicas.

The main goal of named replicas is to enable massive OLTP read scale-out scenario, and to improve Hybrid Transactional and Analytical Processing (HTAP) workloads. Examples of how to create such solutions are available here:

- [OLTP scale-out sample](https://github.com/Azure-Samples/azure-sql-db-named-replica-oltp-scaleout)
- [HTAP scale-out sample](https://github.com/Azure-Samples/azure-sql-db-named-replica-htap)

Aside from the main scenarios listed above, named replicas offer flexibility and elasticity to also satisfy many other use cases:
- [Access Isolation](hyperscale-named-replica-security-configure.md): you can grant access to a specific named replica, but not the primary replica or other named replicas.
- Workload-dependent service level objective: as a named replica can have its own service level objective, it is possible to use different named replicas for different workloads and use cases. For example, one named replica could be used to serve Power BI requests, while another can be used to serve data to Apache Spark for Data Science tasks. Each one can have an independent service level objective and scale independently.
- Workload-dependent routing: with up to 30 named replicas, it is possible to use named replicas in groups so that an application can be isolated from another. For example, a group of four named replicas could be used to serve requests coming from mobile applications, while another group two named replicas can be used to serve requests coming from a web application. This approach would allow a fine-grained tuning of performance and costs for each group.

The following example creates a named replica `WideWorldImporters_NR` for database `WideWorldImporters`. The primary replica uses service level objective HS_Gen5_4, while the named replica uses HS_Gen5_2. Both use the same logical server `MyServer`. If you prefer to use REST API directly, this option is also possible: [Databases - Create A Database As Named Replica Secondary](/rest/api/sql/2020-11-01-preview/databases/createorupdate#creates-a-database-as-named-replica-secondary).

# [T-SQL](#tab/tsql)
```sql
ALTER DATABASE [WideWorldImporters]
ADD SECONDARY ON SERVER [MyServer] 
WITH (SERVICE_OBJECTIVE = 'HS_Gen5_2', SECONDARY_TYPE = Named, DATABASE_NAME = [WideWorldImporters_NR]);
```
# [PowerShell](#tab/azure-powershell)
```azurepowershell
New-AzSqlDatabaseSecondary -ResourceGroupName "MyResourceGroup" -ServerName "MyServer" -DatabaseName "WideWorldImporters" -PartnerResourceGroupName "MyResourceGroup" -PartnerServerName "MyServer" -PartnerDatabaseName "WideWorldImporters_NR" -SecondaryServiceObjectiveName HS_Gen5_2
```
# [Azure CLI](#tab/azure-cli)
```azurecli
az sql db replica create -g MyResourceGroup -n WideWorldImporters -s MyServer --secondary-type named --partner-database WideWorldImporters_NR --partner-server MyServer --service-objective HS_Gen5_2
```

---

As there is no data movement involved, in most cases a named replica will be created in about a minute. Once the named replica is available, it will be visible from the portal or any command-line tool like AZ CLI or PowerShell. A named replica is usable as a regular read-only database. 

> [!NOTE]
> For frequently asked questions on Hyperscale named replicas, see [Azure SQL Database Hyperscale named replicas FAQ](service-tier-hyperscale-named-replicas-faq.yml).

### Connecting to a named replica

To connect to a named replica, you must use the connection string for that named replica, referencing its server and database names. There is no need to specify the option "ApplicationIntent=ReadOnly" as named replicas are always read-only.

Just like for HA replicas, even though the primary, HA, and named replicas share the same data on the same set of page servers, data caches on each named replica are kept in sync with the primary via the transaction log service, which forwards log records from the primary to named replicas. As the result, depending on the workload being processed by a named replica, application of the log records may happen at different speeds, and thus different replicas could have different data latency relative to the primary replica.

### Modifying a named replica

You can define the service level objective of a named replica when you create it, via the `ALTER DATABASE` command or in any other supported way (AZ CLI, PowerShell, REST API). If you need to change the service level objective after the named replica has been created, you can do it using the `ALTER DATABASE ... MODIFY` command on the named replica itself. For example, if `WideWorldImporters_NR` is the named replica of `WideWorldImporters` database, you can do it as shown below. 

# [T-SQL](#tab/tsql)
```sql
ALTER DATABASE [WideWorldImporters_NR] MODIFY (SERVICE_OBJECTIVE = 'HS_Gen5_4')
```
# [PowerShell](#tab/azure-powershell)
```azurepowershell
Set-AzSqlDatabase -ResourceGroup "MyResourceGroup" -ServerName "MyServer" -DatabaseName "WideWorldImporters_NR" -RequestedServiceObjectiveName "HS_Gen5_4"
```
# [Azure CLI](#tab/azure-cli)
```azurecli
az sql db update -g MyResourceGroup -s MyServer -n WideWorldImporters_NR --service-objective HS_Gen5_4
```

---

### Removing a named replica

To remove a named replica, you drop it just like you would a regular database. Make sure you are connected to the `master` database of the server with the named replica you want to drop, and then use the following command:

# [T-SQL](#tab/tsql)
```sql
DROP DATABASE [WideWorldImporters_NR];
```
# [PowerShell](#tab/azure-powershell)
```azurepowershell
Remove-AzSqlDatabase -ResourceGroupName "MyResourceGroup" -ServerName "MyServer" -DatabaseName "WideWorldImporters_NR"
```
# [Azure CLI](#tab/azure-cli)
```azurecli
az sql db delete -g MyResourceGroup -s MyServer -n WideWorldImporters_NR
```
---

> [!IMPORTANT]
> Named replicas will be automatically removed when the primary replica from which they have been created is deleted.

### Known issues

#### Partially incorrect data returned from sys.databases
During Public Preview, row values returned from `sys.databases`, for named replicas, in columns other than `name` and `database_id`, may be inconsistent and incorrect. For example, the `compatibility_level` column for a named replica could be reported as 140 even if the primary database from which the named replica has been created is set to 150. A workaround, when possible, is to get the same data using the  `DATABASEPROPERTYEX()`  function, which will return correct data.

## Geo-replica (in Preview)

With [active geo-replication](active-geo-replication-overview.md), you can create a readable secondary replica of the primary Hyperscale database in the same or in a different Azure region. Geo-replicas must be created on a different logical server. The database name of a geo-replica always matches the database name of the primary.

When creating a geo-replica, all data is copied from the primary to a different set of page servers. A geo-replica does not share page servers with the primary, even if they are in the same region. This architecture provides the necessary redundancy for geo-failovers.

Geo-replicas are used to maintain a transactionally consistent copy of the database via asynchronous replication. If a geo-replica is in a different Azure region, it can be used for disaster recovery in case of a disaster or outage in the primary region. Geo-replicas can also be used for geographic read scale-out scenarios.

In Hyperscale, a geo-failover must be initiated manually. After failover, the new primary will have a different connection end point, referencing the logical server name hosting the new primary replica. For more information, see [active geo-replication](active-geo-replication-overview.md).

Geo-replication for Hyperscale databases is currently in preview, with the following limitations:
- Only one geo-replica can be created (in the same or different region).
- Failover groups are not supported. 
- Planned failover is not supported.
- Point in time restore of the geo-replica is not supported.
- Creating a database copy of the geo-replica is not supported. 
- Secondary of a secondary (also known as "geo-replica chaining") is not supported. 

## Next steps

- [Hyperscale service tier](service-tier-hyperscale.md)
- [Active geo-replication](active-geo-replication-overview.md)
- [Configure Security to allow isolated access to Azure SQL Database Hyperscale Named Replicas](hyperscale-named-replica-security-configure.md)
- [Azure SQL Database Hyperscale named replicas FAQ](service-tier-hyperscale-named-replicas-faq.yml)
