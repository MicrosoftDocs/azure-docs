<properties
	pageTitle="Elastic database pool reference for SQL Database | Microsoft Azure"
	description="This reference provides links and details to elastic database pool articles and programmability information."
	keywords="eDTU"
	services="sql-database"
	documentationCenter=""
	authors="sidneyh"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="03/24/2016"
	ms.author="sidneyh"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# SQL Database elastic database pool reference

For SaaS developers who have tens, hundreds, or even thousands of databases, an [elastic database pool](sql-database-elastic-pool.md) simplifies the process of creating, maintaining, and managing both performance and cost across the entire group of databases.

## Prerequisites for creating and managing elastic database pools

- Elastic database pools are only available in Azure SQL Database V12 servers. To upgrade to V12 and migrate your databases directly into a pool, see [Upgrade to Azure SQL Database V12](sql-database-upgrade-server-powershell.md).
- Creating and managing elastic database pools is supported using the [Azure portal](https://portal.azure.com), [Powerhell](sql-database-elastic-pool-create-powershell.md), and a .NET Client Library (Azure Resource Manager only); the [classic portal](https://manage.windowsazure.com/) and service management commands are not supported.
- Additionally, creating new elastic databases, and moving existing databases in and out of elastic database pools is supported using [Transact-SQL](#transact-sql).


## List of articles

The following articles will help you get started using elastic databases and elastic jobs:

| Article | Description |
| :-- | :-- |
| [SQL Database elastic database pools](sql-database-elastic-pool.md) | Overview of elastic  database pools |
| [Price and performance considerations](sql-database-elastic-pool-guidance.md) | How to assess if using an elastic database pool is cost efficient |
| [Create a scalable elastic database pool for SQL databases in Azure portal](sql-database-elastic-pool-create-portal.md) | How to create and manage an elastic database pool using the Azure portal |
| [Create and manage a SQL Database elastic database pool with PowerShell](sql-database-elastic-pool-powershell.md) | How to create and manage an elastic database pool using PowerShell cmdlets |
| [Create and manage a SQL Database with the Azure SQL Database Library for .NET](sql-database-elastic-pool-csharp.md) | How to create and manage an elastic database pool using C# |
| [Elastic database jobs overview](sql-database-elastic-jobs-overview.md) | An overview of the elastic jobs service, that enables running T-SQL scripts across all elastic databases in a pool |
| [Installing the elastic database job component](sql-database-elastic-jobs-service-installation.md) | How to install the elastic database job service |
| [Securing your SQL Database](sql-database-security.md) | To run an elastic database job script, a user with the appropriate permissions must be added to every database in the pool. |
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
| storageMB | Storage limit in MB for the pool. The total of storage used by all databases in the pool cannot exceed this pool limit.  |


## eDTU and storage limits for elastic pools and elastic databases


[AZURE.INCLUDE [SQL DB service tiers table for elastic databases](../../includes/sql-database-service-tiers-table-elastic-db-pools.md)]


## Latency of elastic pool operations

- Changing the guaranteed eDTUs per database (databaseDtuMin) or maximum eDTUs per database (databaseDtuMax) typically completes in 5 minutes or less.
- Changing the eDTU / storage limit (storageMB) of the pool depends on the total amount of space used by all databases in the pool. Changes average 90 minutes or less per 100 GB. For example, if the total space used by all databases in the pool is 200 GB, then the expected latency for changing the pool eDTU / storage limit is 3 hours or less.



## PowerShell, REST API, and the .NET Client Library

For details and code examples the demonstrate working with pools using PowerShell and C#:

- [Create an elastic pool with PowerShell](sql-database-elastic-pool-create-powershell.md)
- [Create an elastic pool with C#](sql-database-elastic-pool-create-csharp.md)
- [Manage an elastic pool with PowerShell](sql-database-elastic-pool-manage-powershell.md)
- [Manage an elastic pool with C#](sql-database-elastic-pool-manage-csharp.md)

Here's a quick reference of cmdlets and equivalent REST API operations related to elastic pools:

| [PowerShell cmdlets](https://msdn.microsoft.com/library/azure/mt574084.aspx) | [REST API commands](https://msdn.microsoft.com/library/mt163571.aspx) |
| :-- | :-- |
| [New-AzureRmSqlElasticPool](https://msdn.microsoft.com/library/azure/mt619378.aspx) | [Create an elastic database pool](https://msdn.microsoft.com/library/mt163596.aspx) |
| [Set-AzureRmSqlElasticPool](https://msdn.microsoft.com/library/azure/mt603511.aspx) | [Set Performance Settings of an Elastic Database Pool](https://msdn.microsoft.com/library/mt163641.aspx) |
| [Remove-AzureRmSqlElasticPool](https://msdn.microsoft.com/library/azure/mt619355.aspx) | [Delete an elastic database pool](https://msdn.microsoft.com/library/mt163672.aspx) |
| [Get-AzureRMSqlElasticPool](https://msdn.microsoft.com/library/azure/mt603517.aspx) | [Gets elastic  database pools and their property values](https://msdn.microsoft.com/library/mt163646.aspx) |
| [Get-AzureRmSqlElasticPoolActivity](https://msdn.microsoft.com/library/azure/mt603812.aspx) | [Get Status of Elastic Database Pool Operations](https://msdn.microsoft.com/library/mt163669.aspx) |
| [Get-AzureRmSqlElasticPoolDatabase](https://msdn.microsoft.com/library/azure/mt619484.aspx) | [Get Databases in an Elastic Database Pool](https://msdn.microsoft.com/library/mt163646.aspx) |
| [Get-AzureRmSqlElasticPoolDatabaseActivity]() | [Gets the status of moving databases in and out of a pool](https://msdn.microsoft.com/library/mt163669.aspx) |

## Transact-SQL

You can use Transact-SQL to do the following elastic database management tasks:

| Task | Details |
| :-- | :-- |
| Create a new elastic database (directly in a pool) | [CREATE DATABASE (Azure SQL Database)](https://msdn.microsoft.com/library/dn268335.aspx) |
| Move existing databases in and out of a pool | [ALTER DATABASE (Transact-SQL)](https://msdn.microsoft.com/library/mt574871.aspx) |
| Get a pool's resource usage statistics | [sys.elastic_pool_resource_stats (Azure SQL Database)](https://msdn.microsoft.com/library/mt280062.aspx) |


## Billing and pricing information

Elastic database pools are billed per the following characteristics:

- An elastic pool is billed upon its creation, even when there are no databases in the pool.
- An elastic pool is billed hourly. This is the same metering frequency as for performance levels of single databases.
- If an elastic pool is resized to a new amount of eDTUs, then the pool is not billed according to the new amount of eDTUS until the resizing operation completes. This follows the same pattern as changing the performance level of standalone databases.


- The price of an elastic pool is based on the number of eDTUs of the pool. The price of an elastic pool is independent of the utilization of the elastic databases within it.
- Price is computed by (number of pool eDTUs)x(unit price per eDTU).

The unit eDTU price for an elastic pool is higher than the unit DTU price for a standalone database in the same service tier. For details, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/).  

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
