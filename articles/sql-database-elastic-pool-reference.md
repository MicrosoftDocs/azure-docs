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
	ms.date="04/29/2015" 
	ms.author="sstein" 
	ms.workload="data-management" 
	ms.topic="article" 
	ms.tgt_pltfrm="NA"/>


# SQL Database elastic database pool reference (preview)

For SaaS developers who have tens, hundreds, or even thousands of databases, an elastic database pool simplifies the process of creating, maintaining, and managing both performance and cost across the entire group of databases. 

This reference provides links and details to elastic pool articles and programmability information.

## Overview

An elastic pool is a collection of database throughput units (DTUs), and storage (GBs) that are shared by multiple databases. Elastic databases can be added to, and removed from the pool at any time. Elastic databases in the pool utilize only the resources they require from the pool freeing up available resources for only the active databases that need them.



## Prerequisites for creating and managing elastic pools


- Elastic pools are only available in Azure SQL Database V12 servers.   
- PowerShell and REST APIs for elastic pools are supported on Azure Resource Manager (ARM) only; service management commands (RDFE) are not supported. 
- Creating and managing elastic pools is supported in the [Microsoft Azure portal](https:portal.azure.com) only. 


## Restrictions for the current preview

- The pricing tier for an elastic pool in the current preview is Standard.  
- Import of a database directly into an elastic pool is not supported. You can import into a stand-alone database and then move the database into a pool. Export of a database from within a pool is supported.


## List of articles

The following articles will help you get started using elastic databases and elastic jobs:

| Article | Description |
| :-- | :-- |
| [SQL Database elastic pools](sql-database-elastic-pool.md) | Overview of elastic pools |
| [Create and manage a SQL Database elastic pool with the Azure portal](sql-database-elastic-pool-portal.md) | How to create and manage an elastic pool using the Azure portal |
| [Create and manage a SQL Database elastic pool with PowerShell](sql-database-elastic-pool-powershell.md) | How to create and manage an elastic pool using PowerShell cmdlets |
| [Elastic database jobs overview](sql-database-elastic-jobs-overview.md) | An overview of the elastic jobs service, that enables running T-SQL scripts across all elastic databases in a pool |
| [Installing the elastic database job component](sql-database-elastic-jobs-service-installation.md) | How to install the elastic database job service |
| [Creating and managing elastic database jobs](sql-database-elastic-jobs-create-and-manage.md) | How to create and manage the elastic database jobs |
| [Creating the required user for the elastic jobs service](sql-database-elastic-jobs-add-logins-to-dbs.md) | To run an elastic database job script, a user with the appropriate permissions must be added to every database in the pool. |
| [How to uninstall the elastic database job components](sql-database-elastic-jobs-uninstall.md) | Recover from failures when attempting to install the elastic database job service |



## Namespace and endpoint details
An elastic pool is an ARM resource of type “ElasticPool” in the Microsoft Azure SQL Database.

- **namespace**: Microsoft.Sql/ElasticPool
- **secondary-endpoint** for REST API calls (Azure resource manager): https://management.azure.com



## Elastic database pool properties

| Property | Description |
| :-- | :-- |
| creationDate | Date the pool is created. |
| databaseDtuMax | Maximum number of DTUs that a single database in the pool may use.  The database DTU max is not a resource guarantee. The DTU max applies to all databases in the pool. |
| databaseDtuMin | Minimum number of DTUs that a single database in the pool is guaranteed. The database DTU min may be set to 0. The DTU min applies to all databases in the pool. Note that the product of the number of databases in the pool and the database DTU min cannot exceed the DTUs of the pool itself. |
| Dtu | Number of DTUs shared by all databases in the pool. |
| edition | Service tier of the pool.  Every database within the pool has this edition. |
| elasticPoolId | GUID of the instance of the pool. |
| elasticPoolName | Name of the pool.  The name is unique relative to its parent server. |
| location | Data center location where the pool was created. |
| state | State is “Disabled” if payment of the bill for subscription is delinquent, and “Ready” otherwise. |
| storageMB | Storage limit in MB for the pool.  Any single database in the pool can use up to Standard Edition storage limit (250 GB), but the total of storage used by all databases in the pool cannot exceed this pool limit.   |


## DTU and storage limits for elastic pools and elastic databases

The storage limit of the pool is determined by the amount of DTUs of the pool; each DTU = 1 GB storage.  For example, a 200 DTU pool has a storage limit of 200 GB.

| property | default value | valid values |
| :-- | :-- | :-- |
| Dtu | 200 | 200, 400, 800, 1200 |
| databaseDtuMax | 100 | 10, 20, 50 100 |
| databaseDtuMin | 0 | 0, 10, 20, 50 |
| storageMB | 200 GB*  | 200 GB, 400 GB, 800 GB, 1200 GB |

*units in API are MB, not GB

## Worker and session limits

The maximum number of concurrent workers and concurrent sessions supported for all databases in an elastic pool depends on the DTU setting for the pool: 

| DTUs | Max concurrent workers | Max concurrent sessions |
| :-- | :-- | :-- |
| 200 | 400 | 4,800 |
| 400 | 800 | 9,600 |
| 800 | 1,600 | 19,200 |
| 1,200 | 2,400 | 28,800 |


## Azure Resource Manager limitations

An elastic pool requires an Azure SQL Database V12 server. Servers are located within a resource group.

- Each resource group can have a maximum 800 servers.
- Each server can have a maximum 800 elastic pools.
- Each elastic pool can have a maximum 100 databases.


## Latency of elastic pool operations

- Changing the guaranteed DTUs per database (databaseDtuMin) or maximum DTUs per database (databaseDtuMax) typically completes in 5 minutes or less. 
- Changing the DTU / storage limit (storageMB) of the pool depends on the total amount of space used by all databases in the pool.  Changes average 90 minutes or less per 100 GB. For example, if the total space used by all databases in the pool is 200 GB, then the expected latency for changing the pool DTU / storage limit is 3 hours or less. 



## Elastic database pool PowerShell cmdlets and REST API commands (Azure Resource Manager only)

The following PowerShell cmdlets and REST API commands are available for creating and managing elastic pools:

| [PowerShell cmdlets](https://msdn.microsoft.com/library/mt125356.aspx) | [REST API commands](https://msdn.microsoft.com/library/azure/mt163571.aspx) |
| :-- | :-- |
| Get-AzureSqlDatabase | Get Azure SQL database |
| Get-AzureSqLElasticPool | Get Azure SQL Database elastic database pool |
| Get-AzureSqlElasticPoolActivity | Get Azure SQL Database elastic database pool operations |
| Get-AzureSqlElasticPoolDatabase | Get Azure SQL Database elastic database |
| Get-AzureSqlElasticPoolDatabaseActivity | Get Azure SQL Database elastic database operations |
| Get-AzureSqlServer | Get Azure SQL Database server |
| Get-AzureSqlServerFirewallRule | Get Azure SQL Database server firewall rule |
| Get-AzureSqlServerServiceObjective | Get Azure SQL Database server service objective |
| New-AzureSqlDatabase | Create Azure SQL database |
| New-AzureSqlElasticPool | Create Azure SQL Database elastic database pool |
| New-AzureSqlServer | Create Azure SQL Database server |
| New-AzureSqlServerFirewallRule | Create Azure SQL Database server firewall rule) |
| Remove-AzureSqlDatabase | Remove Azure SQL database |
| Remove-AzureSqlElasticPool | Remove Azure SQL Database elastic database pool |
| Remove-AzureSqlServer | Remove Azure SQL Database server |
| Set-AzureSqlDatabase | Set Azure SQL database |
| Set-AzureSqlElasticPool | Set Azure SQL Database elastic database pool |
| Set-AzureSqlServer | Set Azure SQL Database server |
| Set-AzureSqlServerFirewallRule | Set Azure SQL Database server firewall rule |
| Get-Metrics | Get Metrics |


## Billing and pricing information

Elastic database pools are billed per the following characteristics:

- An elastic pool is billed upon its creation, even when there are no databases in the pool. 
- An elastic pool is billed hourly. This is the same metering frequency as for performance levels of standalone databases. 
- If an elastic pool is resized to a new amount of DTUs, then the pool is not billed according to the new amount of DTUS until the resizing operation completes.  This follows the same pattern as changing the performance level of standalone databases. 


- The price of an elastic pool is based on the number of DTUs of the pool, and the number of databases in the pool. 
- Price is computed by (number of pool DTUs)x(unit price per DTU) + (number of databases)x(unit price per database)

The unit DTU price for an elastic pool is higher than the unit DTU price for a standalone database in the same service tier. For details, see [SQL Database pricing](http://azure.microsoft.com/pricing/details/sql-database/).  

## Elastic database pool errors

| ErrorNumber | ErrorSeverity | ErrorFormat | ErrorInserts | ErrorCause | ErrorCorrectiveAction |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 1132 | EX_RESOURCE | The elastic pool has reached its storage limit.  The storage usage for the elastic pool cannot exceed (%d) MBs. | Elastic pool space limit in MBs. | Attempting to write data to a database when the storage limit of the elastic pool has been reached. | Please consider increasing the DTUs of the elastic pool if possible in order to increase its storage limit, reduce the storage used by individual databases within the elastic pool, or remove databases from the elastic pool. |
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
| 40881 | EX_USER | The elastic pool '%.*ls' has reached its database count limit.  The database count limit for the elastic pool cannot exceed (%d) for an elastic pool with (%d) DTUs. | Name of elastic pool; database count limit of elastic pool; DTUs for resource pool. | Attempting to create or add database to elastic pool when the database count limit of the elastic pool has been reached. | Please consider increasing the DTUs of the elastic pool if possible in order to increase its database limit, or remove databases from the elastic pool. |
| 40889 | EX_USER | The DTUs or storage limit for the elastic pool '%.*ls' cannot be decreased since that would not provide sufficient storage space for its databases. | Name of elastic pool. | Attempting to decrease the storage limit of the elastic pool below its storage usage. | Please consider reducing the storage usage of individual databases in the elastic pool or remove databases from the pool in order to reduce its DTUs or storage limit. |
| 40891 | EX_USER | The DTU min per database (%d) cannot exceed the DTU max per database (%d). | DTU min per database; DTU max per database. | Attempting to set the DTU min per database higher than the DTU max per database. | Please ensure the DTU min per databases does not exceed the DTU max per database. |
| TBD | EX_USER | The storage size for an individual database in a elastic pool cannot exceed the max size allowed by '%.*ls' service tier elastic pool. | elastic pool service tier | The max size for the database exceeds the max size allowed by the elastic pool service tier. | Please set the max size of the database within the limits of the max size allowed by the elastic pool service tier. |



