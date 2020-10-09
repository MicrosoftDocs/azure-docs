---
title: Read queries on replicas
description: Azure SQL provides the ability to use the capacity of read-only replicas for read workloads, called Read Scale-Out.
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: sstein
ms.date: 09/03/2020
---
# Use read-only replicas to offload read-only query workloads
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

As part of [High Availability architecture](high-availability-sla.md#Premium-and-business-critical-service-tier-locally-redundant-availability), each single database, elastic pool database, and managed instance in the Premium and Business Critical service tier is automatically provisioned with a primary read-write replica and several secondary read-only replicas. The secondary replicas are provisioned with the same compute size as the primary replica. The *read scale-out* feature allows you to offload read-only workloads using the compute capacity of one of the read-only replicas, instead of running them on the read-write replica. This way, some read-only workloads can be isolated from the read-write workloads, and will not affect their performance. The feature is intended for the applications that include logically separated read-only workloads, such as analytics. In the Premium and Business Critical service tiers, applications could gain performance benefits using this additional capacity at no extra cost.

The *read scale-out* feature is also available in the Hyperscale service tier when at least one secondary replica is created. Multiple secondary replicas can be used for load-balancing read-only workloads that require more resources than available on one secondary replica.

The High Availability architecture of Basic, Standard, and General Purpose service tiers does not include any replicas. The *read scale-out* feature is not available in these service tiers.

The following diagram illustrates the feature.

![Readonly replicas](./media/read-scale-out/business-critical-service-tier-read-scale-out.png)

The *read scale-out* feature is enabled by default on new Premium,  Business Critical, and Hyperscale databases. For Hyperscale, one secondary replica is created by default for new databases. 

> [!NOTE]
> Read scale-out is always enabled in the Business Critical service tier of Managed Instance.

If your SQL connection string is configured with `ApplicationIntent=ReadOnly`, the application will be redirected to a read-only replica of that database or managed instance. For information on how to use the `ApplicationIntent` property, see [Specifying Application Intent](https://docs.microsoft.com/sql/relational-databases/native-client/features/sql-server-native-client-support-for-high-availability-disaster-recovery#specifying-application-intent).

If you wish to ensure that the application connects to the primary replica regardless of the `ApplicationIntent` setting in the SQL connection string, you must explicitly disable read scale-out when creating the database or when altering its configuration. For example, if you upgrade your database from Standard or General Purpose tier to Premium, Business Critical or Hyperscale tier and want to make sure all your connections continue to go to the primary replica, disable read scale-out. For details on how to disable it, see [Enable and disable read scale-out](#enable-and-disable-read-scale-out).

> [!NOTE]
> Query Store and SQL Profiler features are not supported on read-only replicas. 

## Data consistency

One of the benefits of replicas is that the replicas are always in the transactionally consistent state, but at different points in time there may be some small latency between different replicas. Read scale-out supports session-level consistency. It means, if the read-only session reconnects after a connection error caused by replica unavailability, it may be redirected to a replica that is not 100% up-to-date with the read-write replica. Likewise, if an application writes data using a read-write session and immediately reads it using a read-only session, it is possible that the latest updates are not immediately visible on the replica. The latency is caused by an asynchronous transaction log redo operation.

> [!NOTE]
> Replication latencies within the region are low, and this situation is rare. To monitor replication latency, see [Monitoring and troubleshooting read-only replica](#monitoring-and-troubleshooting-read-only-replicas).

## Connect to a read-only replica

When you enable read scale-out for a database, the `ApplicationIntent` option in the connection string provided by the client dictates whether the connection is routed to the write replica or to a read-only replica. Specifically, if the `ApplicationIntent` value is `ReadWrite` (the default value), the connection will be directed to the read-write replica. This is identical to the behavior when `ApplicationIntent` is not included in the connection string. If the `ApplicationIntent` value is `ReadOnly`, the connection is routed to a read-only replica.

For example, the following connection string connects the client to a read-only replica (replacing the items in the angle brackets with the correct values for your environment and dropping the angle brackets):

```sql
Server=tcp:<server>.database.windows.net;Database=<mydatabase>;ApplicationIntent=ReadOnly;User ID=<myLogin>;Password=<myPassword>;Trusted_Connection=False; Encrypt=True;
```

Either of the following connection strings connects the client to a read-write replica (replacing the items in the angle brackets with the correct values for your environment and dropping the angle brackets):

```sql
Server=tcp:<server>.database.windows.net;Database=<mydatabase>;ApplicationIntent=ReadWrite;User ID=<myLogin>;Password=<myPassword>;Trusted_Connection=False; Encrypt=True;

Server=tcp:<server>.database.windows.net;Database=<mydatabase>;User ID=<myLogin>;Password=<myPassword>;Trusted_Connection=False; Encrypt=True;
```

## Verify that a connection is to a read-only replica

You can verify whether you are connected to a read-only replica by running the following query in the context of your database. It will return READ_ONLY when you are connected to a read-only replica.

```sql
SELECT DATABASEPROPERTYEX(DB_NAME(), 'Updateability');
```

> [!NOTE]
> In Premium and Business Critical service tiers, only one of the read-only replicas is accessible at any given time. Hyperscale supports multiple read-only replicas.

## Monitoring and troubleshooting read-only replicas

When connected to a read-only replica, Dynamic Management Views (DMVs) reflect the state of the replica, and can be queried for monitoring and troubleshooting purposes. The database engine provides multiple views to expose a wide variety of monitoring data. 

Commonly used views are:

| Name | Purpose |
|:---|:---|
|[sys.dm_db_resource_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-db-resource-stats-azure-sql-database)| Provides resource utilization metrics for the last hour, including CPU, data IO, and log write utilization relative to service objective limits.|
|[sys.dm_os_wait_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql)| Provides aggregate wait statistics for the database engine instance. |
|[sys.dm_database_replica_states](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-database-replica-states-azure-sql-database)| Provides replica health state and synchronization statistics. Redo queue size and redo rate serve as indicators of data latency on the read-only replica. |
|[sys.dm_os_performance_counters](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-os-performance-counters-transact-sql)| Provides database engine performance counters.|
|[sys.dm_exec_query_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-stats-transact-sql)| Provides per-query execution statistics such as number of executions, CPU time used, etc.|
|[sys.dm_exec_query_plan()](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-plan-transact-sql)| Provides cached query plans. |
|[sys.dm_exec_sql_text()](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sql-text-transact-sql)| Provides query text for a cached query plan.|
|[sys.dm_exec_query_profiles](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-plan-stats-transact-sql)| Provides real time query progress while queries are in execution.|
|[sys.dm_exec_query_plan_stats()](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-plan-stats-transact-sql)| Provides the last known actual execution plan including runtime statistics for a query.|
|[sys.dm_io_virtual_file_stats()](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-io-virtual-file-stats-transact-sql)| Provides storage IOPS, throughput, and latency statistics for all database files. |

> [!NOTE]
> The `sys.resource_stats` and `sys.elastic_pool_resource_stats` DMVs in the logical master database return resource utilization data of the primary replica.

### Monitoring read-only replicas with Extended Events

An extended event session cannot be created when connected to a read-only replica. However, in Azure SQL Database, the definitions of database-scoped [Extended Event](xevent-db-diff-from-svr.md) sessions created and altered on the primary replica replicate to read-only replicas, including geo-replicas, and capture events on read-only replicas.

An extended event session on a read-only replica that is based on a session definition from the primary replica can be started and stopped independently of the primary replica. When an extended event session is dropped on the primary replica, it is also dropped on all read-only replicas.

### Transaction isolation level on read-only replicas

Queries that run on read-only replicas are always mapped to the [snapshot](https://docs.microsoft.com/dotnet/framework/data/adonet/sql/snapshot-isolation-in-sql-server) transaction isolation level. Snapshot isolation uses row versioning to avoid blocking scenarios where readers block writers.

In rare cases, if a snapshot isolation transaction accesses object metadata that has been modified in another concurrent transaction, it may receive error [3961](https://docs.microsoft.com/sql/relational-databases/errors-events/mssqlserver-3961-database-engine-error), "Snapshot isolation transaction failed in database '%.*ls' because the object accessed by the statement has been modified by a DDL statement in another concurrent transaction since the start of this transaction. It is disallowed because the metadata is not versioned. A concurrent update to metadata can lead to inconsistency if mixed with snapshot isolation."

### Long-running queries on read-only replicas

Queries running on read-only replicas need to access metadata for the objects referenced in the query (tables, indexes, statistics, etc.) In rare cases, if a metadata object is modified on the primary replica while a query holds a lock on the same object on the read-only replica, the query can [block](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/troubleshoot-primary-changes-not-reflected-on-secondary#BKMK_REDOBLOCK) the process that applies changes from the primary replica to the read-only replica. If such a query were to run for a long time, it would cause the read-only replica to be significantly out of sync with the primary replica. 

If a long-running query on a read-only replica causes this kind of blocking, it will be automatically terminated, and the session will receive error 1219, "Your session has been disconnected because of a high priority DDL operation".

> [!NOTE]
> If you receive error 3961 or error 1219 when running queries against a read-only replica, retry the query.

> [!TIP]
> In Premium and Business Critical service tiers, when connected to a read-only replica, the `redo_queue_size` and `redo_rate` columns in the [sys.dm_database_replica_states](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-database-replica-states-azure-sql-database) DMV may be used to monitor data synchronization process, serving as indicators of data latency on the read-only replica.
> 

## Enable and disable read scale-out

Read scale-out is enabled by default on Premium, Business Critical, and Hyperscale service tiers. Read scale-out cannot be enabled in Basic, Standard, or General Purpose service tiers. Read scale-out is automatically disabled on Hyperscale databases configured with zero replicas.

You can disable and re-enable read scale-out on single databases and elastic pool databases in the Premium or Business Critical service tiers using the following methods.

> [!NOTE]
> For single databases and elastic pool databases, the ability to disable read scale-out is provided for backward compatibility. Read scale-out cannot be disabled on Business Critical managed instances.

### Azure portal

You can manage the read scale-out setting on the **Configure** database blade.

### PowerShell

> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported, but all future development is for the Az.Sql module. The Azure Resource Manager module will continue to receive bug fixes until at least December 2020.  The arguments for the commands in the Az module and in the Azure Resource Manager modules are substantially identical. For more information about their compatibility, see [Introducing the new Azure PowerShell Az module](/powershell/azure/new-azureps-module-az).

Managing read scale-out in Azure PowerShell requires the December 2016 Azure PowerShell release or newer. For the newest PowerShell release, see [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps).

You can disable or re-enable read scale-out in Azure PowerShell by invoking the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase) cmdlet and passing in the desired value  (`Enabled` or `Disabled`) for the `-ReadScale` parameter.

To disable read scale-out on an existing database (replacing the items in the angle brackets with the correct values for your environment and dropping the angle brackets):

```powershell
Set-AzSqlDatabase -ResourceGroupName <resourceGroupName> -ServerName <serverName> -DatabaseName <databaseName> -ReadScale Disabled
```

To disable read scale-out on a new database (replacing the items in the angle brackets with the correct values for your environment and dropping the angle brackets):

```powershell
New-AzSqlDatabase -ResourceGroupName <resourceGroupName> -ServerName <serverName> -DatabaseName <databaseName> -ReadScale Disabled -Edition Premium
```

To re-enable read scale-out on an existing database (replacing the items in the angle brackets with the correct values for your environment and dropping the angle brackets):

```powershell
Set-AzSqlDatabase -ResourceGroupName <resourceGroupName> -ServerName <serverName> -DatabaseName <databaseName> -ReadScale Enabled
```

### REST API

To create a database with read scale-out disabled, or to change the setting for an existing database, use the following method with the `readScale` property set to `Enabled` or `Disabled`, as in the following sample request.

```rest
Method: PUT
URL: https://management.azure.com/subscriptions/{SubscriptionId}/resourceGroups/{GroupName}/providers/Microsoft.Sql/servers/{ServerName}/databases/{DatabaseName}?api-version= 2014-04-01-preview
Body: {
   "properties": {
      "readScale":"Disabled"
   }
}
```

For more information, see [Databases - Create or update](https://docs.microsoft.com/rest/api/sql/databases/createorupdate).

## Using the `tempdb` database on a read-only replica

The `tempdb` database on the primary replica is not replicated to the read-only replicas. Each replica has its own `tempdb` database that is created when the replica is created. This ensures that `tempdb` is updateable and can be modified during your query execution. If your read-only workload depends on using `tempdb` objects, you should create these objects as part of your query script.

## Using read scale-out with geo-replicated databases

Geo-replicated secondary databases have the same High Availability architecture as the primary databases. If you're connecting to the geo-replicated secondary database with read scale-out enabled, your sessions with `ApplicationIntent=ReadOnly` will be routed to one of the high availability replicas in the same way they are routed on the primary writeable database. The sessions without `ApplicationIntent=ReadOnly` will be routed to the primary replica of the geo-replicated secondary, which is also read-only. 

In this fashion, creating a geo-replica provides two more read-only replicas for a read-write primary database, for a total of three read-only replicas. Each additional geo-replica provides another pair of read-only replicas. Geo-replicas can be created in any Azure region, including the region of the primary database.

> [!NOTE]
> There is no automatic round-robin or any other load-balanced routing between the replicas of a geo-replicated secondary database.

## Next steps

- For information about SQL Database Hyperscale offering, see [Hyperscale service tier](service-tier-hyperscale.md).
