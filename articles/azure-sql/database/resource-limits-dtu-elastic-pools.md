---
title: DTU resource limits elastic pools
description: This page describes some common DTU resource limits for elastic pools in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: elastic-pools
ms.custom: seo-lt-2019 sqldbrb=1 references_regions
ms.devlang:
ms.topic: reference
author: dimitri-furman
ms.author: dfurman
ms.reviewer: mathoma
ms.date: 04/09/2021
---
# Resources limits for elastic pools using the DTU purchasing model
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article provides the detailed resource limits for databases in Azure SQL Database that are within an elastic pool using the DTU purchasing model.

* For DTU purchasing model limits for single databases on a server, see [Overview of resource limits on a server](resource-limits-logical-server.md).
* For DTU purchasing model resource limits for Azure SQL Database, see [DTU resource limits single databases](resource-limits-dtu-single-databases.md) and [DTU resource limits elastic pools](resource-limits-dtu-elastic-pools.md).
* For vCore resource limits, see [vCore resource limits - Azure SQL Database](resource-limits-vcore-single-databases.md) and [vCore resource limits - elastic pools](resource-limits-vcore-elastic-pools.md).
* For more information regarding the different purchasing models, see [Purchasing models and service tiers](purchasing-models.md).

Each read-only replica has its own resources such as DTUs, workers, and sessions. Each read-only replica is subject to the resource limits detailed later in this article.

## Elastic pool: Storage sizes and compute sizes

For Azure SQL Database elastic pools, the following tables show the resources available at each service tier and compute size. You can set the service tier, compute size, and storage amount using:

* [Transact-SQL](elastic-pool-scale.md) via [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql#overview-sql-database)
* [Azure portal](elastic-pool-manage.md#azure-portal)
* [PowerShell](elastic-pool-manage.md#powershell)
* [Azure CLI](elastic-pool-manage.md#azure-cli)
* [REST API](elastic-pool-manage.md#rest-api)


> [!IMPORTANT]
> For scaling guidance and considerations, see [Scale an elastic pool](elastic-pool-scale.md)

The resource limits of individual databases in elastic pools are generally the same as for single databases outside of pools based on DTUs and the service tier. For example, the max concurrent workers for an S2 database is 120 workers. So, the max concurrent workers for a database in a Standard pool is also 120 workers if the max DTU per database in the pool is 50 DTUs (which is equivalent to S2).
 
For the same number of DTUs, resources provided to an elastic pool may exceed the resources provided to a single database outside of an elastic pool. This means it is possible for the eDTU utilization of an elastic pool to be less than the summation of DTU utilization across databases within the pool, depending on workload patterns. For example, in an extreme case with only one database in an elastic pool where database DTU utilization is 100%, it is possible for pool eDTU utilization to be 50% for certain workload patterns. This can happen even if max DTU per database remains at the maximum supported value for the given pool size.

> [!NOTE]
> The storage per pool resource limit in each of the following tables do not include tempdb and log storage.

### Basic elastic pool limits

| eDTUs per pool | **50** | **100** | **200** | **300** | **400** | **800** | **1200** | **1600** |
|:---|---:|---:|---:| ---: | ---: | ---: | ---: | ---: |
| Included storage per pool (GB) | 5 | 10 | 20 | 29 | 39 | 78 | 117 | 156 |
| Max storage per pool (GB) | 5 | 10 | 20 | 29 | 39 | 78 | 117 | 156 |
| Max In-Memory OLTP storage per pool (GB) | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Max number DBs per pool <sup>1</sup> | 100 | 200 | 500 | 500 | 500 | 500 | 500 | 500 |
| Max concurrent workers (requests) per pool <sup>2</sup> | 100 | 200 | 400 | 600 | 800 | 1600 | 2400 | 3200 |
| Max concurrent sessions per pool <sup>2</sup> | 30000 | 30000 | 30000 | 30000 |30000 | 30000 | 30000 | 30000 |
| Min DTU per database choices | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 |
| Max DTU per database choices | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 |
| Max storage per database (GB) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
||||||||

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### Standard elastic pool limits

| eDTUs per pool | **50** | **100** | **200** | **300** | **400** | **800**|
|:---|---:|---:|---:| ---: | ---: | ---: |
| Included storage per pool (GB) <sup>1</sup> | 50 | 100 | 200 | 300 | 400 | 800 |
| Max storage per pool (GB) | 500 | 750 | 1024 | 1280 | 1536 | 2048 |
| Max In-Memory OLTP storage per pool (GB) | N/A | N/A | N/A | N/A | N/A | N/A |
| Max number DBs per pool <sup>2</sup> | 100 | 200 | 500 | 500 | 500 | 500 |
| Max concurrent workers (requests) per pool <sup>3</sup> | 100 | 200 | 400 | 600 | 800 | 1600 |
| Max concurrent sessions per pool <sup>3</sup> | 30000 | 30000 | 30000 | 30000 | 30000 | 30000 |
| Min DTU per database choices | 0, 10, 20, 50 | 0, 10, 20, 50, 100 | 0, 10, 20, 50, 100, 200 | 0, 10, 20, 50, 100, 200, 300 | 0, 10, 20, 50, 100, 200, 300, 400 | 0, 10, 20, 50, 100, 200, 300, 400, 800 |
| Max DTU per database choices | 10, 20, 50 | 10, 20, 50, 100 | 10, 20, 50, 100, 200 | 10, 20, 50, 100, 200, 300 | 10, 20, 50, 100, 200, 300, 400 | 10, 20, 50, 100, 200, 300, 400, 800 |
| Max storage per database (GB) | 1024 | 1024 | 1024 | 1024 | 1024 | 1024 |
||||||||

<sup>1</sup> See [SQL Database pricing options](https://azure.microsoft.com/pricing/details/sql-database/elastic/) for details on additional cost incurred due to any extra storage provisioned.

<sup>2</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### Standard elastic pool limits (continued)

| eDTUs per pool | **1200** | **1600** | **2000** | **2500** | **3000** |
|:---|---:|---:|---:| ---: | ---: |
| Included storage per pool (GB) <sup>1</sup> | 1200 | 1600 | 2000 | 2500 | 3000 |
| Max storage per pool (GB) | 2560 | 3072 | 3584 | 4096 | 4096 |
| Max In-Memory OLTP storage per pool (GB) | N/A | N/A | N/A | N/A | N/A |
| Max number DBs per pool <sup>2</sup> | 500 | 500 | 500 | 500 | 500 |
| Max concurrent workers (requests) per pool <sup>3</sup> | 2400 | 3200 | 4000 | 5000 | 6000 |
| Max concurrent sessions per pool <sup>3</sup> | 30000 | 30000 | 30000 | 30000 | 30000 |
| Min DTU per database choices | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500, 3000 |
| Max DTU per database choices | 10, 20, 50, 100, 200, 300, 400, 800, 1200 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500, 3000 |
| Max storage per database (GB) | 1024 | 1536 | 1792 | 2304 | 2816 |
|||||||

<sup>1</sup> See [SQL Database pricing options](https://azure.microsoft.com/pricing/details/sql-database/elastic/) for details on additional cost incurred due to any extra storage provisioned.

<sup>2</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### Premium elastic pool limits

| eDTUs per pool | **125** | **250** | **500** | **1000** | **1500**|
|:---|---:|---:|---:| ---: | ---: |
| Included storage per pool (GB) <sup>1</sup> | 250 | 500 | 750 | 1024 | 1536 |
| Max storage per pool (GB) | 1024 | 1024 | 1024 | 1024 | 1536 |
| Max In-Memory OLTP storage per pool (GB) | 1 | 2 | 4 | 10 | 12 |
| Max number DBs per pool <sup>2</sup> | 50 | 100 | 100 | 100 | 100 |
| Max concurrent workers per pool (requests) <sup>3</sup> | 200 | 400 | 800 | 1600 | 2400 |
| Max concurrent sessions per pool <sup>3</sup> | 30000 | 30000 | 30000 | 30000 | 30000 |
| Min eDTUs per database | 0, 25, 50, 75, 125 | 0, 25, 50, 75, 125, 250 | 0, 25, 50, 75, 125, 250, 500 | 0, 25, 50, 75, 125, 250, 500, 1000 | 0, 25, 50, 75, 125, 250, 500, 1000|
| Max eDTUs per database | 25, 50, 75, 125 | 25, 50, 75, 125, 250 | 25, 50, 75, 125, 250, 500 | 25, 50, 75, 125, 250, 500, 1000 | 25, 50, 75, 125, 250, 500, 1000|
| Max storage per database (GB) | 1024 | 1024 | 1024 | 1024 | 1536 |
|||||||

<sup>1</sup> See [SQL Database pricing options](https://azure.microsoft.com/pricing/details/sql-database/elastic/) for details on additional cost incurred due to any extra storage provisioned.

<sup>2</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### Premium elastic pool limits (continued)

| eDTUs per pool | **2000** | **2500** | **3000** | **3500** | **4000**|
|:---|---:|---:|---:| ---: | ---: |
| Included storage per pool (GB) <sup>1</sup> | 2048 | 2560 | 3072 | 3548 | 4096 |
| Max storage per pool (GB) | 2048 | 2560 | 3072 | 3548 | 4096|
| Max In-Memory OLTP storage per pool (GB) | 16 | 20 | 24 | 28 | 32 |
| Max number DBs per pool <sup>2</sup> | 100 | 100 | 100 | 100 | 100 |
| Max concurrent workers (requests) per pool <sup>3</sup> | 3200 | 4000 | 4800 | 5600 | 6400 |
| Max concurrent sessions per pool <sup>3</sup> | 30000 | 30000 | 30000 | 30000 | 30000 |
| Min DTU per database choices | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750, 4000 |
| Max DTU per database choices | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750, 4000 |
| Max storage per database (GB) | 2048 | 2560 | 3072 | 3584 | 4096 |
|||||||

<sup>1</sup> See [SQL Database pricing options](https://azure.microsoft.com/pricing/details/sql-database/elastic/) for details on additional cost incurred due to any extra storage provisioned.

<sup>2</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

> [!IMPORTANT]
> More than 1 TB of storage in the Premium tier is currently available in all regions except: China East, China North, Germany Central, and Germany Northeast. In these regions, the storage max in the Premium tier is limited to 1 TB.  For more information, see [P11-P15 current limitations](single-database-scale.md#p11-and-p15-constraints-when-max-size-greater-than-1-tb).

If all DTUs of an elastic pool are used, then each database in the pool receives an equal amount of resources to process queries. The SQL Database service provides resource sharing fairness between databases by ensuring equal slices of compute time. Elastic pool resource sharing fairness is in addition to any amount of resource otherwise guaranteed to each database when the DTU min per database is set to a non-zero value.

> [!NOTE]
> For `tempdb` limits, see [tempdb limits](/sql/relational-databases/databases/tempdb-database#tempdb-database-in-sql-database).
>
> For additional information on storage limits in the Premium service tier, see [Storage space governance](resource-limits-logical-server.md#storage-space-governance).

### Database properties for pooled databases

For each elastic pool, you can optionally specify per database minimum and maximum DTUs to modify resource consumption patterns within the pool. Specified min and max values apply to all databases in the pool. Customizing min and max DTUs for individual databases in the pool is not supported. 

You can also set maximum storage per database, for example to prevent a database from consuming all pool storage. This setting can be configured independently for each database.

The following table describes per database properties for pooled databases. 

| Property | Description |
|:--- |:--- |
| Max DTUs per database |The maximum number of DTUs that any database in the pool may use, if available based on utilization by other databases in the pool. Max DTUs per database is not a resource guarantee for a database. If the workload in each database does not need all available pool resources to perform adequately, consider setting max DTUs per database to prevent a single database from monopolizing pool resources. Some degree of over-committing is expected since the pool generally assumes hot and cold usage patterns for databases, where all databases are not simultaneously peaking. |
| Min DTUs per database |The minimum number of DTUs reserved for any database in the pool. Consider setting a min DTUs per database when you want to guarantee resource availability for each database regardless of resource consumption by other databases in the pool. The min DTUs per database may be set to 0, and is also the default value. This property is set to anywhere between 0 and the average DTUs utilization per database.|
| Max storage per database |The maximum database size set by the user for a database in a pool. Pooled databases share allocated pool storage, so the size a database can reach is limited to the smaller of remaining pool storage and maximum database size. Maximum database size refers to the maximum size of the data files and does not include the space used by the log file. |
|||

> [!IMPORTANT]
> Because resources in an elastic pool are finite, setting min DTUs per database to a value greater than 0 implicitly limits resource utilization by each database. If, at a point in time, most databases in a pool are idle, resources reserved to satisfy the min DTUs guarantee are not available to databases active at that point in time.
>
> Additionally, setting min DTUs per database to a value greater than 0 implicitly limits the number of databases that can be added to the pool. For example, if you set the min DTUs to 100 in a 400 DTU pool, it means that you will not be able to add more than 4 databases to the pool, because 100 DTUs are reserved for each database.
> 

While the per database properties are expressed in DTUs, they also govern consumption of other resource types, such as data IO, log IO, and worker threads. As you adjust min and max per database DTUs values, reservations and limits for all resource types are adjusted proportionally.

## Next steps

* For vCore resource limits for a single database, see [resource limits for single databases using the vCore purchasing model](resource-limits-vcore-single-databases.md)
* For DTU resource limits for a single database, see [resource limits for single databases using the DTU purchasing model](resource-limits-dtu-single-databases.md)
* For vCore resource limits for elastic pools, see [resource limits for elastic pools using the vCore purchasing model](resource-limits-vcore-elastic-pools.md)
* For resource limits for managed instances in Azure SQL Managed Instance, see [SQL Managed Instance resource limits](../managed-instance/resource-limits.md).
* For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).
* For information about resource limits on a logical SQL server, see [overview of resource limits on a logical SQL server](resource-limits-logical-server.md) for information about limits at the server and subscription levels.