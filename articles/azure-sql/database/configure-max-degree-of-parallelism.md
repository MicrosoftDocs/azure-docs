---
title: "Configure the max degree of parallelism (MAXDOP)"
titleSuffix: Azure SQL Database 
description: Learn about the max degree of parallelism (MAXDOP). 
ms.date: "03/29/2021"
services: sql-database
dev_langs: 
 - "TSQL"
ms.service: sql-database
ms.subservice: performance
ms.custom:
ms.devlang: tsql
ms.topic: conceptual
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: 
---
# Configure the max degree of parallelism (MAXDOP) in Azure SQL Database
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

  This article describes the **max degree of parallelism (MAXDOP)** in Azure SQL Database, and how it can be configured. 

> [!NOTE]
> **This content is focused on Azure SQL Database.** Azure SQL Database is based on the latest stable version of the Microsoft SQL Server database engine, so much of the content is similar though troubleshooting and configuration options differ. For more on MAXDOP in SQL Server, see [Configure the max degree of parallelism Server Configuration Option](/sql/database-engine/configure-windows/configure-the-max-degree-of-parallelism-server-configuration-option).

## Overview
  In Azure SQL Database, the default MAXDOP setting for each new single database and elastic pool database is 8. This means the database engine may execute queries using multiple threads. Unlike SQL Server, where the default server-wide MAXDOP is 0 (unlimited), by default new databases in Azure SQL Database are set to MAXDOP 8. This default prevents unnecessary resource utilization and ensures consistent customer experience. It is not typically necessary to further configure the MAXDOP in Azure SQL Database workloads, but it may provide benefits as an advanced performance tuning exercise.

> [!Note]
>   In September 2020, based on years of telemetry in the Azure SQL Database service [MAXDOP 8 was chosen](https://techcommunity.microsoft.com/t5/azure-sql/changing-default-maxdop-in-azure-sql-database-and-azure-sql/ba-p/1538528) as the default for new databases as an optimal value for the widest variety of customer workloads. This default has helped to prevent performance problems due to excessive parallelism. Prior to that, the default setting for new databases was MAXDOP 0. The MAXDOP database scoped configuration option was not changed for existing databases created prior to September 2020.

  In general, if the database engine chooses to execute a query using parallelism, execution time is faster. However, excess parallelism can consume excess processor resources without improving query performance. At scale, excess parallelism can negatively affect query performance for all queries executing on the same database engine instance, so setting an upper boundary for parallelism has been a common performance tuning exercise in SQL Server workloads.

  The following table describes database engine behavior when executing queries with different MAXDOP values:

| MAXDOP | Behavior | 
|--|--|
| = 1 | The database engine does not execute queries using multiple concurrent threads. | 
| > 1 | The database engine sets an upper boundary for the number of parallel threads. The database engine chooses the number of extra worker threads to use. The total number of worker threads used to execute a query may be higher than specified MAXDOP value. |
| = 0 | The database engine can use a number of parallel threads with an upper boundary dependent on the total number of logical processors. The database engine chooses the number of parallel threads to use.| 
| | |
  
##  <a name="Considerations"></a> Considerations  

-   In Azure SQL Database, you can change the default MAXDOP value:
    -   At the query level, using the **MAXDOP** [query hint](/sql/t-sql/queries/hints-transact-sql-query).     
    -   At the database level, using the **MAXDOP** [database scoped configuration](/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql).

-   Long-standing SQL Server MAXDOP considerations and [recommendations](/sql/database-engine/configure-windows/configure-the-max-degree-of-parallelism-server-configuration-option#Guidelines) are applicable to Azure SQL Database. 

-   MAXDOP is enforced per [task](/sql/relational-databases/system-dynamic-management-views/sys-dm-os-tasks-transact-sql). It is not enforced per [request](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) or per query. This means that during a parallel query execution, a single request can spawn multiple tasks with an upper boundary determined by the MAXDOP. For more information, see the *Scheduling parallel tasks* section in the [Thread and Task Architecture Guide](/sql/relational-databases/thread-and-task-architecture-guide). 
  
-   Index operations that create or rebuild an index, or that drop a clustered index, can be resource intensive. You can override the database max degree of parallelism value for index operations by specifying the MAXDOP index option in the `CREATE INDEX` or `ALTER INDEX` statement. The MAXDOP value is applied to the statement at execution time and is not stored in the index metadata. For more information, see [Configure Parallel Index Operations](/sql/relational-databases/indexes/configure-parallel-index-operations).  
  
-   In addition to queries and index operations, the database scoped configuration option for MAXDOP also controls the parallelism of DBCC CHECKTABLE, DBCC CHECKDB, and DBCC CHECKFILEGROUP. 

##  <a name="Security"></a> Recommendations  

  Changing MAXDOP for the database can have major impact on query performance and resource utilization, both positive and negative. However, there is no single MAXDOP value that is optimal for all workloads. The recommendations for setting MAXDOP are nuanced, and depend on many factors. 

  Some peak concurrent workloads may operate better with a different MAXDOP than others. A properly configured MAXDOP should reduce the risk of performance and availability incidents, and in some cases reduce costs by being able to avoid unnecessary resource utilization, and thus scale down to a lower service objective.

### Excessive parallelism

  A higher MAXDOP often reduces duration for CPU-intensive queries. However, excessive parallelism can worsen other concurrent workload performance by starving other queries of CPU and worker thread resources. In extreme cases, excessive parallelism can consume all database or elastic pool resources, causing query timeouts, errors, and application outages. 

  We recommend that customers avoid MAXDOP 0 even if it does not appear to cause problems currently. Excessive parallelism becomes most problematic when the CPU and worker threads are receiving more concurrent requests than can be supported by the service objective. Avoid MAXDOP 0 to reduce the risk of potential future problems due to excessive parallelism if a database is scaled up, or if future hardware generations in Azure SQL Database provide more cores for the same database service objective.

### Modifying MAXDOP 

  If you determine that a different MAXDOP setting is optimal for your Azure SQL Database workload, you can use the `ALTER DATABASE SCOPED CONFIGURATION` T-SQL statement. For examples, see the [Examples using Transact-SQL](#examples) section below. Add this step to the deployment process to change MAXDOP after database creation.

  If non-default MAXDOP benefits only a subset of queries in the workload, you can override MAXDOP at the query level by adding the OPTION (MAXDOP) hint. For examples, see the [Examples using Transact-SQL](#examples) section below. 

  Thoroughly test your MAXDOP configuration changes with load testing involving realistic concurrent query loads. 

  The MAXDOP for the primary and secondary replicas can be configured independently to take advantage of different optimal MAXDOP settings for read-write and read-only workloads. This applies to Azure SQL Database [read scale-out](read-scale-out.md), [geo-replication](active-geo-replication-overview.md), and [Azure SQL Database Hyperscale secondary replicas](service-tier-hyperscale.md). By default, all secondary replicas inherit the MAXDOP configuration of the primary replica.

## <a name="Security"></a> Security  
  
###  <a name="Permissions"></a> Permissions  
  The `ALTER DATABASE SCOPED CONFIGURATION` statement must be executed as the server admin, as a member of the database role `db_owner`, or a user that has been granted the `ALTER ANY DATABASE SCOPED CONFIGURATION` permission.
 
## Examples   

  These examples use the latest **AdventureWorksLT** sample database when the `SAMPLE` option is chosen for a new single database of Azure SQL Database.

### PowerShell

#### MAXDOP database scoped configuration   

  This example shows how to use [ALTER DATABASE SCOPED CONFIGURATION](/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) statement to configure the `max degree of parallelism` option to `2`. The setting takes effect immediately. The PowerShell cmdlet [Invoke-SqlCmd](/powershell/module/sqlserver/invoke-sqlcmd) executes the T-SQL queries to set and the return the MAXDOP database scoped configuration. 

```powershell
$dbName = "sample" 
$serverName = <server name here>
$serveradminLogin = <login here>
$serveradminPassword = <password here>
$desiredMAXDOP = 8

$params = @{
    'database' = $dbName
    'serverInstance' =  $serverName
    'username' = $serveradminLogin
    'password' = $serveradminPassword
    'outputSqlErrors' = $true
    'query' = 'ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = ' + $desiredMAXDOP + ';
     SELECT [value] FROM sys.database_scoped_configurations WHERE [name] = ''MAXDOP'';'
  }
  Invoke-SqlCmd @params
```

This example is for use with Azure SQL Databases with [read scale-out replicas enabled](read-scale-out.md), [geo-replication](active-geo-replication-overview.md), and [Azure SQL Database hyperscale secondary replicas](service-tier-hyperscale.md). As an example, the primary replica is set to a different default MAXDOP as the secondary replica, anticipating that there may be differences between a read-write and a read-only workload.

```powershell
$dbName = "sample" 
$serverName = <server name here>
$serveradminLogin = <login here>
$serveradminPassword = <password here>
$desiredMAXDOP_primary = 8
$desiredMAXDOP_secondary_readonly = 1
 
$params = @{
    'database' = $dbName
    'serverInstance' =  $serverName
    'username' = $serveradminLogin
    'password' = $serveradminPassword
    'outputSqlErrors' = $true
    'query' = 'ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = ' + $desiredMAXDOP + ';
    ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = ' + $desiredMAXDOP_secondary_readonly + ';
    SELECT [value], value_for_secondary FROM sys.database_scoped_configurations WHERE [name] = ''MAXDOP'';'
  }
  Invoke-SqlCmd @params
```

### Transact-SQL
  
  You can use the [Azure portal query editor](connect-query-portal.md), [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms), or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) to execute T-SQL queries against your Azure SQL Database.

1.  Connect to the Azure SQL Database. You cannot change the database scoped configurations in the master database.
  
2.  From the Standard bar, select **New Query**.   
  
3.  Copy and paste the following example into the query window and select **Execute**. 


#### MAXDOP database scoped configuration

  This example shows how to determine the current database MAXDOP database scoped configuration using the [sys.database_scoped_configurations](/sql/relational-databases/system-catalog-views/sys-database-scoped-configurations-transact-sql) system catalog view.

```sql
SELECT [value] FROM sys.database_scoped_configurations WHERE [name] = 'MAXDOP';
```

  This example shows how to use [ALTER DATABASE SCOPED CONFIGURATION](/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) statement to configure the `max degree of parallelism` option to `8`. The setting takes effect immediately.  
  
```sql  
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 8;
```  

This example is for use with Azure SQL Databases with [read scale-out replicas enabled](read-scale-out.md), [geo-replication](active-geo-replication-overview.md), and [Azure SQL Database Hyperscale secondary replicas](service-tier-hyperscale.md). As an example, the primary replica is set to a different default MAXDOP as the secondary replica, anticipating that there may be differences between a read-write and a read-only workload. The `value_for_secondary` column of the `sys.database_scoped_configurations` contains settings for the secondary replica.

```sql
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 8;
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = 1;
SELECT [value], value_for_secondary FROM sys.database_scoped_configurations WHERE [name] = 'MAXDOP';
```

#### MAXDOP query hint

  This example shows how to execute a query using the query hint to force the `max degree of parallelism` to `2`.  

```sql 
SELECT ProductID, OrderQty, SUM(LineTotal) AS Total  
FROM SalesLT.SalesOrderDetail  
WHERE UnitPrice < 5  
GROUP BY ProductID, OrderQty  
ORDER BY ProductID, OrderQty  
OPTION (MAXDOP 2);    
GO
```
#### MAXDOP index option

  This example shows how to rebuild an index using the index option to force the `max degree of parallelism` to `12`.  

```sql 
ALTER INDEX ALL ON SalesLT.SalesOrderDetail 
REBUILD WITH 
   (     MAXDOP = 12
       , SORT_IN_TEMPDB = ON
       , ONLINE = ON);
```

## See also  
* [ALTER DATABASE SCOPED CONFIGURATION &#40;Transact-SQL&#41;](/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql)        
* [sys.database_scoped_configurations (Transact-SQL)](/sql/relational-databases/system-catalog-views/sys-database-scoped-configurations-transact-sql)
* [Configure Parallel Index Operations](/sql/relational-databases/indexes/configure-parallel-index-operations)    
* [Query Hints &#40;Transact-SQL&#41;](/sql/t-sql/queries/hints-transact-sql-query)     
* [Set Index Options](/sql/relational-databases/indexes/set-index-options)     
* [Understand and resolve Azure SQL Database blocking problems](understand-resolve-blocking.md)

## Next steps

* [Monitor and Tune for Performance](/sql/relational-databases/performance/monitor-and-tune-for-performance)
