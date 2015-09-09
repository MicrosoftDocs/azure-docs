<properties 
	pageTitle="Azure SQL elastic database pool reference" 
	description="This reference provides links and details to elastic database pool articles and programmability information." 
	services="sql-database" 
	documentationCenter="" 
	authors="stevestein" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="08/25/2015" 
	ms.author="sstein" 
	ms.workload="data-management" 
	ms.topic="article" 
	ms.tgt_pltfrm="NA"/>


# SQL Database elastic database pool reference

For SaaS developers who have tens, hundreds, or even thousands of databases, an elastic database pool simplifies the process of creating, maintaining, and managing both performance and cost across the entire group of databases. 

This reference provides links and details to elastic database pool articles and programmability information.

## Overview

An elastic database pool is a collection of elastic database throughput units (eDTUs), and storage (GBs) that are shared by multiple databases. Elastic databases can be added to, and removed from the pool at any time. Elastic databases in the pool utilize only the resources they require from the pool freeing up available resources for only the active databases that need them. For assistance in determining if your databases would benefit in an elastic database pool, see [Price and performance considerations for an elastic database pool](sql-database-elastic-pool-guidance.md). 



## Prerequisites for creating and managing elastic database pools


- Elastic database pools are only available in Azure SQL Database V12 servers.   
- Creating and managing elastic database pools is supported using the [preview portal](https://portal.azure.com), PowerShell, and a .NET Client Library (wrapper for REST APIs) for Azure Resource Manager only; the [portal](https://manage.windowsazure.com/) and service management commands are not supported.
- Additionally, creating new elastic databases, and moving existing databases in and out of elastic database pools is supported using Transact-SQL.



## Current preview considerations


- Each pool has a maximum number of databases and pool eDTUs:

    | Service tier | Max databases per pool* | Max eDTUs per pool* |
    | :-- | :-- | :-- |
    | Basic | 200 | 1200 | 
    | Standard | 200 | 1200 |
    | Premium | 50 | 1500 |

    ****The current limits for the number of databases per pool and number of pool eDTUs is expected to increase.***




## List of articles

The following articles will help you get started using elastic databases and elastic jobs:

| Article | Description |
| :-- | :-- |
| [SQL Database elastic database pools](sql-database-elastic-pool.md) | Overview of elastic  database pools |
| [Price and performance considerations](sql-database-elastic-pool-guidance.md) | How to assess if using an elastic database pool is cost efficient |
| [Create and manage a SQL Database elastic database pool with the Azure portal](sql-database-elastic-pool-portal.md) | How to create and manage an elastic database pool using the Azure portal |
| [Create and manage a SQL Database elastic database pool with PowerShell](sql-database-elastic-pool-powershell.md) | How to create and manage an elastic database pool using PowerShell cmdlets |
| [Create and manage a SQL Database with the Azure SQL Database Library for .NET](sql-database-elastic-pool-powershell.md) | How to create and manage an elastic database pool using C# |
| [Elastic database jobs overview](sql-database-elastic-jobs-overview.md) | An overview of the elastic jobs service, that enables running T-SQL scripts across all elastic databases in a pool |
| [Installing the elastic database job component](sql-database-elastic-jobs-service-installation.md) | How to install the elastic database job service |
| [Creating the required user for the elastic jobs service](sql-database-elastic-jobs-add-logins-to-dbs.md) | To run an elastic database job script, a user with the appropriate permissions must be added to every database in the pool. |
| [How to uninstall the elastic database job components](sql-database-elastic-jobs-uninstall.md) | Recover from failures when attempting to install the elastic database job service |



## Namespace and endpoint details
An elastic database pool is an Azure Resource Manager resource of type “ElasticPool” in the Microsoft Azure SQL Database.

- **namespace**: Microsoft.Sql/ElasticPool
- **management-endpoint** for REST API calls (Resource Manager): https://management.azure.com



## Elastic database pool properties

| Property | Description |
| :-- | :-- |
| creationDate | Date the pool is created. |
| databaseDtuMax | Maximum number of eDTUs that a single database in the pool may use.  The database eDTU max is not a resource guarantee. The eDTU max applies to all databases in the pool. |
| databaseDtuMin | Minimum number of eDTUs that a single database in the pool is guaranteed. The database eDTU min may be set to 0. The eDTU min applies to all databases in the pool. Note that the product of the number of databases in the pool and the database eDTU min cannot exceed the eDTUs of the pool itself. |
| Dtu | Number of eDTUs shared by all databases in the pool. |
| edition | Service tier of the pool.  Every database within the pool has this edition. |
| elasticPoolId | GUID of the instance of the pool. |
| elasticPoolName | Name of the pool.  The name is unique relative to its parent server. |
| location | Data center location where the pool was created. |
| state | State is “Disabled” if payment of the bill for subscription is delinquent, and “Ready” otherwise. |
| storageMB | Storage limit in MB for the pool.  Any single database in the pool can use up to Standard Edition storage limit (250 GB), but the total of storage used by all databases in the pool cannot exceed this pool limit.   |


## eDTU and storage limits for elastic pools and elastic databases

The storage limit of the pool is determined by the amount of eDTUs of the pool.

| property | Basic | Standard | Premium |
| :-- | :-- | :-- | :-- |
| dtu | **100**, 200, 400, 800, 1200 | **100**, 200, 400, 800, 1200 | **125**, 250, 500, 1000, 1500 |
| databaseDtuMax | **5** | 10, 20, 50, **100** | **125**, 250, 500, 1000 |
| databaseDtuMin | **0**, 5 | **0**, 10, 20, 50, 100 | **0**, 125, 250, 500, 1000 |
| storageMB* | **10000 MB**, 20000 MB, 40000 MB, 80000 MB, 120000 MB | **100 GB**, 200 GB, 400 GB, 800 GB, 1200 GB | **62.5 GB**, 125 GB, 250 GB, 500 GB, 750 GB |
| storage per DTU | 100 MB | 1 GB | .5 GB |
| max databases per pool | 200 | 200 | 50 |

Default values are **bold**.

*units in API are MB, not GB.





## Worker and session limits

The maximum number of concurrent workers and concurrent sessions supported for all databases in an elastic pool depends on the eDTU setting for the pool: 

| eDTUs | Max concurrent workers | Max concurrent sessions |
| :-- | :-- | :-- |
| 100 (Basic/Standard), 125 (Premium) | 200 | 2,400 |
| 200 (Basic/Standard), 250 (Premium) | 400 | 4,800 |
| 400 (Basic/Standard), 500 (Premium) | 800 | 9,600 |
| 800 (Basic/Standard), 1,000 (Premium) | 1,600 | 19,200 |
| 1,200 (Basic/Standard), 1,500 (Premium) | 2,400 | 28,800 |


## Azure Resource Manager limitations

Azure SQL Database V12 servers are located in resource groups.

- Each resource group can have a maximum 800 servers.
- Each server can have a maximum 800 elastic pools.


## Latency of elastic pool operations

- Changing the guaranteed eDTUs per database (databaseDtuMin) or maximum eDTUs per database (databaseDtuMax) typically completes in 5 minutes or less. 
- Changing the eDTU / storage limit (storageMB) of the pool depends on the total amount of space used by all databases in the pool. Changes average 90 minutes or less per 100 GB. For example, if the total space used by all databases in the pool is 200 GB, then the expected latency for changing the pool eDTU / storage limit is 3 hours or less. 



## PowerShell, REST API, and the .NET Client Library

Several PowerShell cmdlets and REST API commands are available for creating and managing elastic pools. For details and code examples, see [Create and manage a SQL Database elastic database pool using PowerShell](sql-database-elastic-pool-powershell.md), and [Create and manage SQL Database with C#](sql-database-client-library.md).



| [PowerShell cmdlets](https://msdn.microsoft.com/library/mt163521.aspx) | [REST API commands](https://msdn.microsoft.com/library/mt163571.aspx) |
| :-- | :-- |
| [New-AzureSqlElasticPool](https://msdn.microsoft.com/library/mt125987.aspx) | [Create an elastic database pool](https://msdn.microsoft.com/library/mt163596.aspx) |
| [Set-AzureSqlElasticPool](https://msdn.microsoft.com/library/mt125994.aspx) | [Set Performance Settings of an Elastic Database Pool](https://msdn.microsoft.com/library/mt163641.aspx) |
| [Remove-AzureSqlElasticPool](https://msdn.microsoft.com/library/mt125830.aspx) | [Delete an elastic database pool](https://msdn.microsoft.com/library/mt163672.aspx) |
| [Get-AzureSqlElasticPool](https://msdn.microsoft.com/library/mt126017.aspx) | [Gets elastic  database pools and their property values](https://msdn.microsoft.com/en-us/library/mt163646.aspx) |
| [Get-AzureSqlElasticPoolActivity](https://msdn.microsoft.com/library/mt125837.aspx) | [Get Status of Elastic Database Pool Operations](https://msdn.microsoft.com/library/mt163669.aspx) |
| [Get-AzureSqlElasticPoolDatabase](https://msdn.microsoft.com/library/mt125960.aspx) | [Get Databases in an Elastic Database Pool](https://msdn.microsoft.com/library/mt163646.aspx) |
| [Get-AzureSqlElasticPoolDatabaseActivity](https://msdn.microsoft.com/library/mt125973.aspx) | [Gets the status of moving databases in and out of a pool](https://msdn.microsoft.com/library/mt163669.aspx) |

## Transact-SQL

You can use Transact-SQL to do the following elastic database management tasks:

| Task | Details |
| :-- | :-- |
| Create a new elastic database (directly in a pool) | [CREATE DATABASE (Azure SQL Database)](https://msdn.microsoft.com/library/dn268335.aspx) |
| Move existing databases in and out of a pool | [ALTER DATABASE (Transact-SQL)](https://msdn.microsoft.com/library/ms174269.aspx) |
| Get a pool's resource usage statistics | [sys.elastic_pool_resource_stats (Azure SQL Database)](https://msdn.microsoft.com/library/mt280062.aspx) |


## Billing and pricing information

Elastic database pools are billed per the following characteristics:

- An elastic pool is billed upon its creation, even when there are no databases in the pool. 
- An elastic pool is billed hourly. This is the same metering frequency as for performance levels of standalone databases. 
- If an elastic pool is resized to a new amount of eDTUs, then the pool is not billed according to the new amount of eDTUS until the resizing operation completes. This follows the same pattern as changing the performance level of standalone databases. 


- The price of an elastic pool is based on the number of eDTUs of the pool, and the number of databases in the pool. The price of an elastic pool is independent of the utilization of the elastic databases within it.
- Price is computed by (number of pool eDTUs)x(unit price per eDTU) + (number of databases)x(unit price per database)

The unit eDTU price for an elastic pool is higher than the unit DTU price for a standalone database in the same service tier. For details, see [SQL Database pricing](http://azure.microsoft.com/pricing/details/sql-database/).  

## Elastic database pool errors

| ErrorNumber | ErrorSeverity | ErrorFormat | ErrorInserts | ErrorCause | ErrorCorrectiveAction |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 1132 | EX_RESOURCE | The elastic pool has reached its storage limit. The storage usage for the elastic pool cannot exceed (%d) MBs. | Elastic pool space limit in MBs. | Attempting to write data to a database when the storage limit of the elastic pool has been reached. | Please consider increasing the DTUs of the elastic pool if possible in order to increase its storage limit, reduce the storage used by individual databases within the elastic pool, or remove databases from the elastic pool. |
| 10929 | EX_USER | The %s minimum guarantee is %d, maximum limit is %d and the current usage for the database is %d. However, the server is currently too busy to support requests greater than %d for this database. See [http://go.microsoft.com/fwlink/?LinkId=267637](http://go.microsoft.com/fwlink/?LinkId=267637) for assistance. Otherwise, please try again later. | DTU min per database; DTU max per database | The total number of concurrent workers (requests) across all databases in the elastic pool attempted to exceed the pool limit. | Please consider increasing the DTUs of the elastic pool if possible in order to increase its worker limit, or remove databases from the elastic pool. |
| 40844 | EX_USER | Database '%ls' on Server '%ls' is a '%ls' edition database in an elastic pool and cannot have a continuous copy relationship. | database name, database edition, server name | A StartDatabaseCopy command is issued for a non-premium db in an elastic pool. | Coming soon |
| 40857 | EX_USER | Elastic pool not found for server: '%ls', elastic pool name: '%ls'. | name of server; elastic pool name | Specified elastic pool does not exist in the specified server. | Please provide a valid elastic pool name. |
| 40858 | EX_USER | Elastic pool '%ls' already exists in server: '%ls' | elastic pool name, server name | Specified elastic pool already exists in the specified logical server. | Provide new elastic pool name. |
| 40859 | EX_USER | Elastic pool does not support service tier '%ls'. | elastic pool service tier | Specified service tier is not supported for elastic pool provisioning. | Provide the correct edition or leave service tier blank to use the default service tier. |
| 40860 | EX_USER | Elastic pool '%ls' and service objective '%ls' combination is invalid. | elastic pool name; service level objective name | Elastic pool and service objective can be specified together only if service objective is specified as 'ElasticPool'. | Please specify correct combination of elastic pool and service objective. |
| 40861 | EX_USER | The database edition '%.*ls' cannot be different than the elastic pool service tier which is '%.*ls'. | database edition, elastic pool service tier | The database edition is different than the elastic pool service tier. | Please do not specify a database edition which is different than the elastic pool service tier.  Note that the database edition does not need to be specified. |
| 40862 | EX_USER | Elastic pool name must be specified if the elastic pool service objective is specified. | None | Elastic pool service objective does not uniquely identify an elastic pool. | Please specify the elastic pool name if using the elastic pool service objective. |
| 40864 | EX_USER | The DTUs for the elastic pool must be at least (%d) DTUs for service tier '%.*ls'. | DTUs for elastic pool; elastic pool service tier. | Attempting to set the DTUs for the elastic pool below the minimum limit. | Please retry setting the DTUs for the elastic pool to at least the minimum limit. |
| 40865 | EX_USER | The DTUs for the elastic pool cannot exceed (%d) DTUs for service tier '%.*ls'. | DTUs for elastic pool; elastic pool service tier. | Attempting to set the DTUs for the elastic pool above the maximum limit. | Please retry setting the DTUs for the elastic pool to no greater than the maximum limit. |
| 40867 | EX_USER | The DTU max per database must be at least (%d) for service tier '%.*ls'. | DTU max per database; elastic pool service tier | Attempting to set the DTU max per database below the supported limit. | Please consider using the elastic pool service tier that supports the desired setting. |
| 40868 | EX_USER | The DTU max per database cannot exceed (%d) for service tier '%.*ls'. | DTU max per database; elastic pool service tier. | Attempting to set the DTU max per database beyond the supported limit. | Please consider using the elastic pool service tier that supports the desired setting. |
| 40870 | EX_USER | The DTU min per database cannot exceed (%d) for service tier '%.*ls'. | DTU min per database; elastic pool service tier. | Attempting to set the DTU min per database beyond the supported limit. | Please consider using the elastic pool service tier that supports the desired setting. |
| 40873 | EX_USER | The number of databases (%d) and DTU min per database (%d) cannot exceed the DTUs of the elastic pool (%d). | Number databases in elastic pool; DTU min per database; DTUs of elastic pool. | Attempting to specify DTU min for databases in the elastic pool that exceeds the DTUs of the elastic pool. | Please consider increasing the DTUs of the elastic pool, or decrease the DTU min per database, or decrease the number of databases in the elastic pool. |
| 40877 | EX_USER | An elastic pool cannot be deleted unless it does not contain any databases. | None | The elastic pool contains one or more databases and therefore cannot be deleted. | Please remove databases from the elastic pool in order to delete it. |
| 40881 | EX_USER | The elastic pool '%.*ls' has reached its database count limit.  The database count limit for the elastic pool cannot exceed (%d) for an elastic pool with (%d) DTUs. | Name of elastic pool; database count limit of elastic pool;e DTUs for resource pool. | Attempting to create or add database to elastic pool when the database count limit of the elastic pool has been reached. | Please consider increasing the DTUs of the elastic pool if possible in order to increase its database limit, or remove databases from the elastic pool. |
| 40889 | EX_USER | The DTUs or storage limit for the elastic pool '%.*ls' cannot be decreased since that would not provide sufficient storage space for its databases. | Name of elastic pool. | Attempting to decrease the storage limit of the elastic pool below its storage usage. | Please consider reducing the storage usage of individual databases in the elastic pool or remove databases from the pool in order to reduce its DTUs or storage limit. |
| 40891 | EX_USER | The DTU min per database (%d) cannot exceed the DTU max per database (%d). | DTU min per database; DTU max per database. | Attempting to set the DTU min per database higher than the DTU max per database. | Please ensure the DTU min per databases does not exceed the DTU max per database. |
| TBD | EX_USER | The storage size for an individual database in a elastic pool cannot exceed the max size allowed by '%.*ls' service tier elastic pool. | elastic pool service tier | The max size for the database exceeds the max size allowed by the elastic pool service tier. | Please set the max size of the database within the limits of the max size allowed by the elastic pool service tier. |



