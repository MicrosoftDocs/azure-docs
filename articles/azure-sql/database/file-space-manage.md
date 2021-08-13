---
title: Azure SQL Database file space management
description: This page describes how to manage file space with single and pooled databases in Azure SQL Database, and provides code samples for how to determine if you need to shrink a single or a pooled database as well as how to perform a database shrink operation.
services: sql-database
ms.service: sql-database
ms.subservice: deployment-configuration
ms.custom: sqldbrb=1, devx-track-azurepowershell
ms.devlang: 
ms.topic: conceptual
author: oslake
ms.author: moslake
ms.reviewer: jrasnick, wiassaf
ms.date: 08/09/2021
---
# Manage file space for databases in Azure SQL Database
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article describes different types of storage space for databases in Azure SQL Database, and steps that can be taken when the file space allocated needs to be explicitly managed.

> [!NOTE]
> This article does not apply to Azure SQL Managed Instance.

## Overview

With Azure SQL Database, there are workload patterns where the allocation of underlying data files for databases can become larger than the amount of used data pages. This condition can occur when space used increases and data is subsequently deleted. The reason is because file space allocated is not automatically reclaimed when data is deleted.

Monitoring file space usage and shrinking data files may be necessary in the following scenarios:

- Allow data growth in an elastic pool when the file space allocated for its databases reaches the pool max size.
- Allow decreasing the max size of a single database or elastic pool.
- Allow changing a single database or elastic pool to a different service tier or performance tier with a lower max size.

> [!NOTE]
> Shrink operations should not be considered a regular maintenance operation. Data and log files that grow due to regular, recurring business operations do not require shrink operations. 

### Monitoring file space usage

Most storage space metrics displayed in the following APIs only measure the size of used data pages:

- Azure Resource Manager based metrics APIs including PowerShell [get-metrics](/powershell/module/az.monitor/get-azmetric)
- T-SQL: [sys.dm_db_resource_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-db-resource-stats-azure-sql-database)

However, the following APIs also measure the size of space allocated for databases and elastic pools:

- T-SQL:  [sys.resource_stats](/sql/relational-databases/system-catalog-views/sys-resource-stats-azure-sql-database)
- T-SQL: [sys.elastic_pool_resource_stats](/sql/relational-databases/system-catalog-views/sys-elastic-pool-resource-stats-azure-sql-database)

## Understanding types of storage space for a database

Understanding the following storage space quantities are important for managing the file space of a database.

|Database quantity|Definition|Comments|
|---|---|---|
|**Data space used**|The amount of space used to store database data.|Generally, space used increases (decreases) on inserts (deletes). In some cases, the space used does not change on inserts or deletes depending on the amount and pattern of data involved in the operation and any fragmentation. For example, deleting one row from every data page does not necessarily decrease the space used.|
|**Data space allocated**|The amount of formatted file space made available for storing database data.|The amount of space allocated grows automatically, but never decreases after deletes. This behavior ensures that future inserts are faster since space does not need to be reformatted.|
|**Data space allocated but unused**|The difference between the amount of data space allocated and data space used.|This quantity represents the maximum amount of free space that can be reclaimed by shrinking database data files.|
|**Data max size**|The maximum amount of space that can be used for storing database data.|The amount of data space allocated cannot grow beyond the data max size.|

The following diagram illustrates the relationship between the different types of storage space for a database.

![storage space types and relationships](./media/file-space-manage/storage-types.png)

## Query a single database for storage space information

The following queries can be used to determine storage space quantities for a single database.  

### Database data space used

Modify the following query to return the amount of database data space used.  Units of the query result are in MB.

```sql
-- Connect to master
-- Database data space used in MB
SELECT TOP 1 storage_in_megabytes AS DatabaseDataSpaceUsedInMB
FROM sys.resource_stats
WHERE database_name = 'db1'
ORDER BY end_time DESC;
```

### Database data space allocated and unused allocated space

Use the following query to return the amount of database data space allocated and the amount of unused space allocated.  Units of the query result are in MB.

```sql
-- Connect to database
-- Database data space allocated in MB and database data space allocated unused in MB
SELECT SUM(size/128.0) AS DatabaseDataSpaceAllocatedInMB,
SUM(size/128.0 - CAST(FILEPROPERTY(name, 'SpaceUsed') AS int)/128.0) AS DatabaseDataSpaceAllocatedUnusedInMB
FROM sys.database_files
GROUP BY type_desc
HAVING type_desc = 'ROWS';
```

### Database data max size

Modify the following query to return the database data max size.  Units of the query result are in bytes.

```sql
-- Connect to database
-- Database data max size in bytes
SELECT DATABASEPROPERTYEX('db1', 'MaxSizeInBytes') AS DatabaseDataMaxSizeInBytes;
```

## Understanding types of storage space for an elastic pool

Understanding the following storage space quantities are important for managing the file space of an elastic pool.

|Elastic pool quantity|Definition|Comments|
|---|---|---|
|**Data space used**|The summation of data space used by all databases in the elastic pool.||
|**Data space allocated**|The summation of data space allocated by all databases in the elastic pool.||
|**Data space allocated but unused**|The difference between the amount of data space allocated and data space used by all databases in the elastic pool.|This quantity represents the maximum amount of space allocated for the elastic pool that can be reclaimed by shrinking database data files.|
|**Data max size**|The maximum amount of data space that can be used by the elastic pool for all of its databases.|The space allocated for the elastic pool should not exceed the elastic pool max size.  If this condition occurs, then space allocated that is unused can be reclaimed by shrinking database data files.|

> [!NOTE]
> The error message "The elastic pool has reached its storage limit" indicates that the database objects have been allocated enough space to meet the elastic pool storage limit, but there may be unused space in the data space allocation. Consider increasing the elastic pool's storage limit, or as a short-term solution, freeing up data space using the [**Reclaim unused allocated space**](#reclaim-unused-allocated-space) section below. You should also be aware of the potential negative performance impact of shrinking database files, see [**Rebuild indexes**](#rebuild-indexes) section below.

## Query an elastic pool for storage space information

The following queries can be used to determine storage space quantities for an elastic pool.  

### Elastic pool data space used

Modify the following query to return the amount of elastic pool data space used.  Units of the query result are in MB.

```sql
-- Connect to master
-- Elastic pool data space used in MB  
SELECT TOP 1 avg_storage_percent / 100.0 * elastic_pool_storage_limit_mb AS ElasticPoolDataSpaceUsedInMB
FROM sys.elastic_pool_resource_stats
WHERE elastic_pool_name = 'ep1'
ORDER BY end_time DESC;
```

### Elastic pool data space allocated and unused allocated space

Modify the following examples to return a table listing the space allocated and unused allocated space for each database in an elastic pool. The table orders databases from those databases with the greatest amount of unused allocated space to the least amount of unused allocated space.  Units of the query result are in MB.  

The query results for determining the space allocated for each database in the pool can be added together to determine the total space allocated for the elastic pool. The elastic pool space allocated should not exceed the elastic pool max size.  

> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. The AzureRM module will continue to receive bug fixes until at least December 2020. The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. For more about their compatibility, see [Introducing the new Azure PowerShell Az module](/powershell/azure/new-azureps-module-az).

The PowerShell script requires SQL Server PowerShell module – see [Download PowerShell module](/sql/powershell/download-sql-server-ps-module) to install.

```powershell
$resourceGroupName = "<resourceGroupName>"
$serverName = "<serverName>"
$poolName = "<poolName>"
$userName = "<userName>"
$password = "<password>"

# get list of databases in elastic pool
$databasesInPool = Get-AzSqlElasticPoolDatabase -ResourceGroupName $resourceGroupName `
    -ServerName $serverName -ElasticPoolName $poolName
$databaseStorageMetrics = @()

# for each database in the elastic pool, get space allocated in MB and space allocated unused in MB
foreach ($database in $databasesInPool) {
    $sqlCommand = "SELECT DB_NAME() as DatabaseName, `
    SUM(size/128.0) AS DatabaseDataSpaceAllocatedInMB, `
    SUM(size/128.0 - CAST(FILEPROPERTY(name, 'SpaceUsed') AS int)/128.0) AS DatabaseDataSpaceAllocatedUnusedInMB `
    FROM sys.database_files `
    GROUP BY type_desc `
    HAVING type_desc = 'ROWS'"
    $serverFqdn = "tcp:" + $serverName + ".database.windows.net,1433"
    $databaseStorageMetrics = $databaseStorageMetrics + 
        (Invoke-Sqlcmd -ServerInstance $serverFqdn -Database $database.DatabaseName `
            -Username $userName -Password $password -Query $sqlCommand)
}

# display databases in descending order of space allocated unused
Write-Output "`n" "ElasticPoolName: $poolName"
Write-Output $databaseStorageMetrics | Sort -Property DatabaseDataSpaceAllocatedUnusedInMB -Descending | Format-Table
```

The following screenshot is an example of the output of the script:

![elastic pool allocated space and unused allocated space example](./media/file-space-manage/elastic-pool-allocated-unused.png)

### Elastic pool data max size

Modify the following T-SQL query to return the last recorded elastic pool data max size.  Units of the query result are in MB.

```sql
-- Connect to master
-- Elastic pools max size in MB
SELECT TOP 1 elastic_pool_storage_limit_mb AS ElasticPoolMaxSizeInMB
FROM sys.elastic_pool_resource_stats
WHERE elastic_pool_name = 'ep1'
ORDER BY end_time DESC;
```

## Reclaim unused allocated space

> [!NOTE]
> Shrink commands impact database performance while running, and if possible should be run during periods of low usage.

### Shrinking data files

Because of a potential impact to database performance, Azure SQL Database does not automatically shrink data files. However, customers may shrink data files via self-service at a time of their choosing. This should not be a regularly scheduled operation, but rather, a one-time event in response to a major reduction in data file used space consumption.

In Azure SQL Database, to shrink files you can use the `DBCC SHRINKDATABASE` or `DBCC SHRINKFILE` commands:

- `DBCC SHRINKDATABASE` will shrink all database data and log files, one at a time, which is typically unnecessary. It will also [shrink the log file](#shrinking-transaction-log-file). Azure SQL Database automatically shrinks log files, if necessary.
- `DBCC SHRINKFILE` command supports more advanced scenarios:
    - It can target individual files as needed, rather than shrinking all files in the database.
    - Each `DBCC SHRINKFILE` command can run in parallel with other `DBCC SHRINKFILE` commands to shrink the database faster, at the expense of higher resource usage and a higher chance of blocking user queries, if they are executing during shrink.
    - If the tail of the file does not contain data, it can reduce allocated file size much faster by specifying the TRUNCATEONLY argument. This does not require data movement within the file.
- For more information about these shrink commands, see [DBCC SHRINKDATABASE](/sql/t-sql/database-console-commands/dbcc-shrinkdatabase-transact-sql) or [DBCC SHRINKFILE](/sql/t-sql/database-console-commands/dbcc-shrinkfile-transact-sql).

> [!IMPORTANT]
> Shrink commands can negatively impact database performance while running, and if possible should be run during periods of low usage. 

The following examples must be executed while connected to the target user database, not the `master` database.

To use `DBCC SHRINKDATABASE` to shrink all data and log files in a given database:

```sql
-- Shrink database data space allocated.
DBCC SHRINKDATABASE (N'database_name');
```

In Azure SQL Database, a database may have one or more data files. Additional data files can only be created automatically. To determine file layout of your database, query the `sys.database_files` catalog view using the following sample script:

```sql
-- Review file properties, including file_id values to reference in shrink commands
SELECT file_id,
       name,
       CAST(FILEPROPERTY(name, 'SpaceUsed') AS bigint) * 8 / 1024. AS space_used_mb,
       CAST(size AS bigint) * 8 / 1024. AS space_allocated_mb,
       CAST(max_size AS bigint) * 8 / 1024. AS max_size_mb
FROM sys.database_files
WHERE type_desc IN ('ROWS','LOG');
GO
```

Execute a shrink against one file only via the `DBCC SHRINKFILE` command, for example:

```sql
-- Shrink database data file named 'data_0` by removing all unused at the end of the file, if any.
DBCC SHRINKFILE ('data_0', TRUNCATEONLY);
GO
```

You should also be aware of the potential negative performance impact of shrinking database files, see the [Rebuild indexes](#rebuild-indexes) section below. 

### Shrinking transaction log file

Unlike data files, Azure SQL Database automatically shrinks transaction log file to avoid excessive space usage that can lead to out-of-space errors. It is usually not necessary for customers to shrink the transaction log file.

In Premium and Business Critical service tiers, if the transaction log becomes large, it may significantly contribute to local storage consumption toward the [maximum local storage](resource-limits-logical-server.md#storage-space-governance) limit. If local storage consumption is close to the limit, customers may choose to shrink transaction log using the [DBCC SHRINKFILE](/sql/t-sql/database-console-commands/dbcc-shrinkfile-transact-sql) command as shown in the following example. This releases local storage as soon as the command completes, without waiting for the periodic automatic shrink operation.

The following example should be executed while connected to the target user database, not the master database.

```tsql
-- Shrink the database log file (always file_id = 2), by removing all unused space at the end of the file, if any.
DBCC SHRINKFILE (2, TRUNCATEONLY);
```

### Auto-shrink

Alternatively, auto-shrink can be enabled for a database. However, auto shrink can be less effective in reclaiming file space than `DBCC SHRINKDATABASE` and `DBCC SHRINKFILE`.  

Auto-shrink can be helpful in the specific scenario where an elastic pool contains many databases that experience significant growth and reduction in data file space used. This is not a common scenario. 

By default, auto-shrink is disabled, which is recommended for most databases. If it becomes necessary to enable auto-shrink, it is recommended to disable it once space management goals have been achieved, instead of keeping it enabled permanently. For more information, see [Considerations for AUTO_SHRINK](/troubleshoot/sql/admin/considerations-autogrow-autoshrink#considerations-for-auto_shrink).

To enable auto-shrink, execute the following command while connected to your database (not in the master database).

```sql
-- Enable auto-shrink for the current database.
ALTER DATABASE CURRENT SET AUTO_SHRINK ON;
```

For more information about this command, see [DATABASE SET](/sql/t-sql/statements/alter-database-transact-sql-set-options) options.

### <a name="rebuild-indexes"></a> Index maintenance before or after shrink

After a shrink operation is completed against data files, indexes may become fragmented and lose their performance optimization effectiveness for certain workloads, such as queries using large scans. If performance degradation occurs after the shrink operation is complete, consider index maintenance to rebuild indexes. 

If page density in the database is low, a shrink will take longer because it will have to move more pages in each data file. Microsoft recommends determining average page density before executing shrink commands. If page density is low, rebuild or reorganize indexes to increase page density before running shrink. For more information, including a sample script to determine page density, see [Optimize index maintenance to improve query performance and reduce resource consumption](/sql/relational-databases/indexes/reorganize-and-rebuild-indexes).

## Next steps

- For information about database max sizes, see:
  - [Azure SQL Database vCore-based purchasing model limits for a single database](resource-limits-vcore-single-databases.md)
  - [Resource limits for single databases using the DTU-based purchasing model](resource-limits-dtu-single-databases.md)
  - [Azure SQL Database vCore-based purchasing model limits for elastic pools](resource-limits-vcore-elastic-pools.md)
  - [Resources limits for elastic pools using the DTU-based purchasing model](resource-limits-dtu-elastic-pools.md)
