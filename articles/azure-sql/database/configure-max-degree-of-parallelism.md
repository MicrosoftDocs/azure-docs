---
title: "Configure the max degree of parallelism (MAXDOP)"
titleSuffix: Azure SQL Database 
description: Learn about the max degree of parallelism (MAXDOP). 
ms.date: "04/12/2021"
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

  This article describes the **max degree of parallelism (MAXDOP)** configuration setting in Azure SQL Database. 

> [!NOTE]
> **This content is focused on Azure SQL Database.** Azure SQL Database is based on the latest stable version of the Microsoft SQL Server database engine, so much of the content is similar though troubleshooting and configuration options differ. For more on MAXDOP in SQL Server, see [Configure the max degree of parallelism Server Configuration Option](/sql/database-engine/configure-windows/configure-the-max-degree-of-parallelism-server-configuration-option).

## Overview
  MAXDOP controls intra-query parallelism in the database engine. Higher MAXDOP values generally result in more parallel threads per query, and faster query execution. 

  In Azure SQL Database, the default MAXDOP setting for each new single database and elastic pool database is 8. This default prevents unnecessary resource utilization, while still allowing the database engine to execute queries faster using parallel threads. It is not typically necessary to further configure MAXDOP in Azure SQL Database workloads, though it may provide benefits as an advanced performance tuning exercise.

> [!Note]
>   In September 2020, based on years of telemetry in the Azure SQL Database service MAXDOP 8 was made the [default for new databases](https://techcommunity.microsoft.com/t5/azure-sql/changing-default-maxdop-in-azure-sql-database-and-azure-sql/ba-p/1538528), as the optimal value for the widest variety of customer workloads. This default helped prevent performance problems due to excessive parallelism. Prior to that, the default setting for new databases was MAXDOP 0. MAXDOP was not automatically changed for existing databases created prior to September 2020.

  In general, if the database engine chooses to execute a query using parallelism, execution time is faster. However, excess parallelism can consume additional processor resources without improving query performance. At scale, excess parallelism can negatively affect query performance for all queries executing on the same database engine instance. Traditionally, setting an upper bound for parallelism has been a common performance tuning exercise in SQL Server workloads.

  The following table describes database engine behavior when executing queries with different MAXDOP values:

| MAXDOP | Behavior | 
|--|--|
| = 1 | The database engine uses a single serial thread to execute queries. Parallel threads are not used. | 
| > 1 | The database engine sets the number of additional [schedulers](https://docs.microsoft.com/sql/relational-databases/thread-and-task-architecture-guide#sql-server-task-scheduling) to be used by parallel threads to the MAXDOP value, or the total number of logical processors, whichever is smaller. |
| = 0 | The database engine sets the number of additional [schedulers](https://docs.microsoft.com/sql/relational-databases/thread-and-task-architecture-guide#sql-server-task-scheduling) to be used by parallel threads to the total number of logical processors or 64, whichever is smaller. | 
| | |

> [!Note]
> Each query executes with at least one scheduler, and one worker thread on that scheduler.
>
> A query executing with parallelism uses additional schedulers, and additional parallel threads. Because multiple parallel threads may execute on the same scheduler, the total number of threads used to execute a query may be higher than specified MAXDOP value or the total number of logical processors. For more information, see [Scheduling parallel tasks](/sql/relational-databases/thread-and-task-architecture-guide#scheduling-parallel-tasks).

##  <a name="Considerations"></a> Considerations  

-   In Azure SQL Database, you can change the default MAXDOP value:
    -   At the query level, using the **MAXDOP** [query hint](/sql/t-sql/queries/hints-transact-sql-query).     
    -   At the database level, using the **MAXDOP** [database scoped configuration](/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql).

-   Long-standing SQL Server MAXDOP considerations and [recommendations](/sql/database-engine/configure-windows/configure-the-max-degree-of-parallelism-server-configuration-option#Guidelines) are applicable to Azure SQL Database. 

-   Index operations that create or rebuild an index, or that drop a clustered index, can be resource intensive. You can override the database MAXDOP value for index operations by specifying the MAXDOP index option in the `CREATE INDEX` or `ALTER INDEX` statement. The MAXDOP value is applied to the statement at execution time and is not stored in the index metadata. For more information, see [Configure Parallel Index Operations](/sql/relational-databases/indexes/configure-parallel-index-operations).  
  
-   In addition to queries and index operations, the database scoped configuration option for MAXDOP also controls parallelism of other statements that may use parallel execution, such as DBCC CHECKTABLE, DBCC CHECKDB, and DBCC CHECKFILEGROUP. 

##  <a name="Recommendations"></a> Recommendations  

  Changing MAXDOP for the database can have major impact on query performance and resource utilization, both positive and negative. However, there is no single MAXDOP value that is optimal for all workloads. The [recommendations](/sql/database-engine/configure-windows/configure-the-max-degree-of-parallelism-server-configuration-option#Guidelines) for setting MAXDOP are nuanced, and depend on many factors. 

  Some peak concurrent workloads may operate better with a different MAXDOP than others. A properly configured MAXDOP should reduce the risk of performance and availability incidents, and in some cases may reduce costs by being able to avoid unnecessary resource utilization, and thus scale down to a lower service objective.

### Excessive parallelism

  A higher MAXDOP often reduces duration for CPU-intensive queries. However, excessive parallelism can worsen other concurrent workload performance by starving other queries of CPU and worker thread resources. In extreme cases, excessive parallelism can consume all database or elastic pool resources, causing query timeouts, errors, and application outages. 

> [!Tip]
> We recommend that customers avoid setting MAXDOP to 0 even if it does not appear to cause problems currently.

  Excessive parallelism becomes most problematic when there are more concurrent requests than can be supported by the CPU and worker thread resources provided by the service objective. Avoid MAXDOP 0 to reduce the risk of potential future problems due to excessive parallelism if a database is scaled up, or if future hardware generations in Azure SQL Database provide more cores for the same database service objective.

### Modifying MAXDOP 

  If you determine that a MAXDOP setting different from the default is optimal for your Azure SQL Database workload, you can use the `ALTER DATABASE SCOPED CONFIGURATION` T-SQL statement. For examples, see the [Examples using Transact-SQL](#examples) section below. To change MAXDOP to a non-default value for each new database you create, add this step to your database deployment process.

  If non-default MAXDOP benefits only a small subset of queries in the workload, you can override MAXDOP at the query level by adding the OPTION (MAXDOP) hint. For examples, see the [Examples using Transact-SQL](#examples) section below. 

  Thoroughly test your MAXDOP configuration changes with load testing involving realistic concurrent query loads. 

  MAXDOP for the primary and secondary replicas can be configured independently if different MAXDOP settings are optimal for your read-write and read-only workloads. This applies to Azure SQL Database [read scale-out](read-scale-out.md), [geo-replication](active-geo-replication-overview.md), and [Hyperscale](service-tier-hyperscale.md) secondary replicas. By default, all secondary replicas inherit the MAXDOP configuration of the primary replica.

## <a name="Security"></a> Security  
  
###  <a name="Permissions"></a> Permissions  
  The `ALTER DATABASE SCOPED CONFIGURATION` statement must be executed as the server admin, as a member of the database role `db_owner`, or a user that has been granted the `ALTER ANY DATABASE SCOPED CONFIGURATION` permission.
 
## Examples   

  These examples use the latest **AdventureWorksLT** sample database when the `SAMPLE` option is chosen for a new single database of Azure SQL Database.

### PowerShell

#### MAXDOP database scoped configuration   

  This example shows how to use [ALTER DATABASE SCOPED CONFIGURATION](/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) statement to set the `MAXDOP` configuration to `2`. The setting takes effect immediately for new queries. The PowerShell cmdlet [Invoke-SqlCmd](/powershell/module/sqlserver/invoke-sqlcmd) executes the T-SQL queries to set and the return the MAXDOP database scoped configuration. 

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

1.  Open a new query window.

2.  Connect to the database where you want to change MAXDOP. You cannot change database scoped configurations in the master database.
  
3.  Copy and paste the following example into the query window and select **Execute**. 

#### MAXDOP database scoped configuration

  This example shows how to determine the current database MAXDOP database scoped configuration using the [sys.database_scoped_configurations](/sql/relational-databases/system-catalog-views/sys-database-scoped-configurations-transact-sql) system catalog view.

```sql
SELECT [value] FROM sys.database_scoped_configurations WHERE [name] = 'MAXDOP';
```

  This example shows how to use [ALTER DATABASE SCOPED CONFIGURATION](/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) statement to set the `MAXDOP` configuration to `8`. The setting takes effect immediately.  
  
```sql  
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 8;
```  

This example is for use with Azure SQL Databases with [read scale-out replicas enabled](read-scale-out.md), [geo-replication](active-geo-replication-overview.md), and [Hyperscale](service-tier-hyperscale.md) secondary replicas. As an example, the primary replica is set to a different MAXDOP than the secondary replica, anticipating that there may be differences between the read-write and read-only workloads. All statements are executed on the primary replica. The `value_for_secondary` column of the `sys.database_scoped_configurations` contains settings for the secondary replica.

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
