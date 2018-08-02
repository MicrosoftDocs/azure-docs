---
title: Azure SQL Database file space management| Microsoft Docs
description: This page describes how to manage file space with Azure SQL Database, and provides code samples for how to determine if you need to shrink a database as well as how to perform a database shrink operation.
services: sql-database
author: CarlRabeler
manager: craigg
ms.service: sql-database
ms.custom: how-to
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: carlrab

---
# Manage file space in Azure SQL Database

This article describes different types of storage space in Azure SQL Database, and steps that can be taken when the file space allocated for databases and elastic pools needs to be managed by the customer.

## Overview

In Azure SQL Database, storage size metrics displayed in the Azure portal and the following APIs measure the number of used data pages for databases and elastic pools:
- Azure Resource Manager based metrics APIs including PowerShell [get-metrics](https://docs.microsoft.com/powershell/module/azurerm.insights/get-azurermmetric)
- T-SQL: [sys.dm_db_resource_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-db-resource-stats-azure-sql-database)
- T-SQL:  [sys.resource_stats](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-resource-stats-azure-sql-database)
- T-SQL: [sys.elastic_pool_resource_stats](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-elastic-pool-resource-stats-azure-sql-database)

There are workload patterns in which the allocation of space in the underlying data files for databases becomes larger than the number of used data pages in the data files. This scenario can occur when space used increases and then data is subsequently deleted. When the data is deleted, the file space allocated is not automatically reclaimed when the data is deleted. In such scenarios, the allocated space for a database or pool may exceed supported max limits set (or supported) for the database and, as a result, prevent data growth or prevent performance tier changes, even though the database space actually used is less than the max space limit. To mitigate, you may need to shrink the database to reduce allocated but unused space in the database.

The SQL Database service does not automatically shrink database files to reclaim unused allocated space due to the potential impact on database performance. However, you can shrink the file in a database at a time of your choosing by following the steps described in [Reclaim unused allocated space](#reclaim-unused-allocated-space). 

> [!NOTE]
> Unlike data files, the SQL Database service automatically shrinks log files since that operation does not impact database performance.

## Understanding the types of storage space for a database

To manage file space, you need to understand the following terms related to database storage for both a single database and for an elastic pool.

|Storage space term|Definition|Comments|
|---|---|---|
|**Data space used**|The amount of space used to store database data in 8 KB pages.|Generally, this space used increases (decreases) on inserts (deletes). In some cases, the space used does not change on inserts or deletes depending on the amount and pattern of data involved in the operation and any fragmentation. For example, deleting one row from every data page does not necessarily decrease the space used.|
|**Space allocated**|The amount of formatted file space made available for storing database data|The space allocated grows automatically, but never decreases after deletes. This behavior ensures that future inserts are faster since space does not need to be reformatted.|
|**Space allocated but unused**|The amount of unused data file space allocated for the database.|This quantity is the difference between the amount of space allocated and space used, and represents the maximum amount of space that can be reclaimed by shrinking database files.|
|**Max size**|The maximum amount of data space that can be used by the database.|The data space allocated cannot grow beyond the data max size.|
||||

The following diagram illustrates the relationship between the types of storage space.

![storage space types and relationships](./media/sql-database-file-space-management/storage-types.png)

## Query a database for storage space information

To determine if you have allocated but unused data space for an individual database that you may wish to reclaim, use the following queries:

### Database data space used
Modify the following query to return the amount of database data space used in MB.

```sql
-- Connect to master
-- Database data space used in MB
SELECT TOP 1 storage_in_megabytes AS DatabaseDataSpaceUsedInMB
FROM sys.resource_stats
WHERE database_name = 'db1'
ORDER BY end_time DESC
```

### Database data allocated and allocated space unused
Modify the following query to return the amount of database data allocated and allocated space unused.

```sql
-- Connect to database
-- Database data space allocated in MB and database data space allocated unused in MB
SELECT SUM(size/128.0) AS DatabaseDataSpaceAllocatedInMB, 
SUM(size/128.0 - CAST(FILEPROPERTY(name, 'SpaceUsed') AS int)/128.0) AS DatabaseDataSpaceAllocatedUnusedInMB 
FROM sys.database_files
GROUP BY type_desc
HAVING type_desc = 'ROWS'
```
 
### Database max size
Modify the following query to return the database max size in bytes.

```sql
-- Connect to database
-- Database data max size in bytes
SELECT DATABASEPROPERTYEX('db1', 'MaxSizeInBytes') AS DatabaseDataMaxSizeInBytes
```

## Query an elastic pool for storage space information

To determine if you have allocated but unused data space in an elastic pool and for each pooled database that you may wish to reclaim, use the following queries:

### Elastic pool data space used
Modify the following query to return the amount of elastic pool data space used in MB.

```sql
-- Connect to master
-- Elastic pool data space used in MB  
SELECT TOP 1 avg_storage_percent * elastic_pool_storage_limit_mb AS ElasticPoolDataSpaceUsedInMB
FROM sys.elastic_pool_resource_stats
WHERE elastic_pool_name = 'ep1'
ORDER BY end_time DESC
```

### Elastic pool data allocated and allocated space unused

Modify the following PowerShell script to return a table listing the total space allocated and unused space allocated for each database in an elastic pool. The table orders databases from those with the greatest amount of space allocated unused to the least amount of space allocated unused.  

The query results for determining the space allocated for each database in the pool can be added together to the determine the elastic pool space allocated. The elastic pool space allocated should not exceed the elastic pool max size.  

```powershell
# Resource group name
$resourceGroupName = "rg1" 
# Server name
$serverName = "ls2" 
# Elastic pool name
$poolName = "ep1"
# User name for server
$userName = "name"
# Password for server
$password = "password"

# Get list of databases in elastic pool
$databasesInPool = Get-AzureRmSqlElasticPoolDatabase `
    -ResourceGroupName $resourceGroupName `
    -ServerName $serverName `
    -ElasticPoolName $poolName
$databaseStorageMetrics = @()

# For each database in the elastic pool,
# get its space allocated in MB and space allocated unused in MB.
# Requires SQL Server PowerShell module – see here to install.  
foreach ($database in $databasesInPool)
{
    $sqlCommand = "SELECT DB_NAME() as DatabaseName, `
    SUM(size/128.0) AS DatabaseDataSpaceAllocatedInMB, `
    SUM(size/128.0 - CAST(FILEPROPERTY(name, 'SpaceUsed') AS int)/128.0) AS DatabaseDataSpaceAllocatedUnusedInMB `
    FROM sys.database_files `
    GROUP BY type_desc `
    HAVING type_desc = 'ROWS'"
    $serverFqdn = "tcp:" + $serverName + ".database.windows.net,1433"
    $databaseStorageMetrics = $databaseStorageMetrics + 
        (Invoke-Sqlcmd -ServerInstance $serverFqdn `
        -Database $database.DatabaseName `
        -Username $userName `
        -Password $password `
        -Query $sqlCommand)
}
# Display databases in descending order of space allocated unused
Write-Output "`n" "ElasticPoolName: $poolName"
Write-Output $databaseStorageMetrics | Sort `
    -Property DatabaseDataSpaceAllocatedUnusedInMB `
    -Descending | Format-Table
```

The following screenshot is an example of the output of the script:

![elastic pool allocated space and unused allocated space example](./media/sql-database-file-space-management/elastic-pool-allocated-unused.png)

### Elastic pool max size

Use the following T-SQL query to return the elastic database max size in MB.

```sql
-- Connect to master
-- Elastic pools max size in MB
SELECT TOP 1 elastic_pool_storage_limit_mb AS ElasticPoolMaxSizeInMB
FROM sys.elastic_pool_resource_stats
WHERE elastic_pool_name = 'ep1'
ORDER BY end_time DESC
```

## Reclaim unused allocated space

Once you have determined that you have unused allocated space that you wish to reclaim, use the following command to shrink the database space allocated. 

> [!IMPORTANT]
> For databases in an elastic pool, databases with the most space allocated unused should be shrunk first to reclaim file space most quickly.  

Use the following command to shrink all of the data files in the specified database:

```sql
-- Shrink database data space allocated.
DBCC SHRINKDATABASE (N'<database_name>')
```

For more information about this command, see [SHRINKDATABASE](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-shrinkdatabase-transact-sql).

> [!IMPORTANT] 
> Consider rebuilding database indexes
After database data files are shrunk, indexes may become fragmented and lose their performance optimization effectiveness. If this occurs, then the indexes should be rebuilt. For more information on fragmentation and rebuilding indexes, see [Reorganize and Rebuild Indexes](https://docs.microsoft.com/sql/relational-databases/indexes/reorganize-and-rebuild-indexes).

## Next steps

- For information about max database sizes, see:
  - [Azure SQL Database vCore-based purchasing model limits for a single database](https://docs.microsoft.com/azure/sql-database/sql-database-vcore-resource-limits-single-databases)
  - [Resource limits for single databases using the DTU-based purchasing model](https://docs.microsoft.com/azure/sql-database/sql-database-dtu-resource-limits-single-databases)
  - [Azure SQL Database vCore-based purchasing model limits for elastic pools](https://docs.microsoft.com/azure/sql-database/sql-database-vcore-resource-limits-elastic-pools)
  - [Resources limits for elastic pools using the DTU-based purchasing model](https://docs.microsoft.com/azure/sql-database/sql-database-dtu-resource-limits-elastic-pools)
- For more information about the `SHRINKDATABASE` command, see [SHRINKDATABASE](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-shrinkdatabase-transact-sql). 
- For more information on fragmentation and rebuilding indexes, see [Reorganize and Rebuild Indexes](https://docs.microsoft.com/sql/relational-databases/indexes/reorganize-and-rebuild-indexes).