---
title: DTU resource limits elastic pools
description: This page describes some common DTU resource limits for elastic pools in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: elastic-pools
ms.custom: seo-lt-2019 sqldbrb=1
ms.devlang:
ms.topic: conceptual
author: sachinpMSFT
ms.author: sachinp
ms.reviewer: carlrab
ms.date: 04/17/2020
---
# Resources limits for elastic pools using the DTU purchasing model
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article provides the detailed resource limits for databases in Azure SQL Database that are within an elastic pool using the DTU purchasing model.

* For DTU purchasing model resource limits for Azure SQL Database, see [DTU resource limits - Azure SQL Database](resource-limits-vcore-elastic-pools.md).
* For vCore resource limits, see [vCore resource limits - Azure SQL Database](resource-limits-vcore-single-databases.md) and [vCore resource limits - elastic pools](resource-limits-vcore-elastic-pools.md).

## Elastic pool: Storage sizes and compute sizes

For Azure SQL Database elastic pools, the following tables show the resources available at each service tier and compute size. You can set the service tier, compute size, and storage amount using:

* [Azure portal](elastic-pool-manage.md#azure-portal)
* [PowerShell](elastic-pool-manage.md#powershell)
* [Azure CLI](elastic-pool-manage.md#azure-cli)
* [REST API](elastic-pool-manage.md#rest-api).

> [!IMPORTANT]
> For scaling guidance and considerations, see [Scale an elastic pool](elastic-pool-scale.md)

> [!NOTE]
> The resource limits of individual databases in elastic pools are generally the same as for single databases outside of pools based on DTUs and the service tier. For example, the max concurrent workers for an S2 database is 120 workers. So, the max concurrent workers for a database in a Standard pool is also 120 workers if the max DTU per database in the pool is 50 DTUs (which is equivalent to S2).
>
> The storage per pool resource limit in each of the following tables do not include tempdb and log storage.

### Basic elastic pool limits

| eDTUs per pool | **50** | **100** | **200** | **300** | **400** | **800** | **1200** | **1600** |
|:---|---:|---:|---:| ---: | ---: | ---: | ---: | ---: |
| Included storage per pool (GB) | 5 | 10 | 20 | 29 | 39 | 78 | 117 | 156 |
| Max storage choices per pool (GB) | 5 | 10 | 20 | 29 | 39 | 78 | 117 | 156 |
| Max In-Memory OLTP storage per pool (GB) | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Max number DBs per pool <sup>1</sup> | 100 | 200 | 500 | 500 | 500 | 500 | 500 | 500 |
| Max concurrent workers (requests) per pool <sup>2</sup> | 100 | 200 | 400 | 600 | 800 | 1600 | 2400 | 3200 |
| Max concurrent sessions per pool <sup>2</sup> | 30000 | 30000 | 30000 | 30000 |30000 | 30000 | 30000 | 30000 |
| Min eDTUs choices per database | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 |
| Max eDTUs choices per database | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 |
| Max storage per database (GB) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
||||||||

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### Standard elastic pool limits

| eDTUs per pool | **50** | **100** | **200** | **300** | **400** | **800**|
|:---|---:|---:|---:| ---: | ---: | ---: |
| Included storage per pool (GB) | 50 | 100 | 200 | 300 | 400 | 800 |
| Max storage choices per pool (GB) | 50, 250, 500 | 100, 250, 500, 750 | 200, 250, 500, 750, 1024 | 300, 500, 750, 1024, 1280 | 400, 500, 750, 1024, 1280, 1536 | 800, 1024, 1280, 1536, 1792, 2048 |
| Max In-Memory OLTP storage per pool (GB) | N/A | N/A | N/A | N/A | N/A | N/A |
| Max number DBs per pool <sup>1</sup> | 100 | 200 | 500 | 500 | 500 | 500 |
| Max concurrent workers (requests) per pool <sup>2</sup> | 100 | 200 | 400 | 600 | 800 | 1600 |
| Max concurrent sessions per pool <sup>2</sup> | 30000 | 30000 | 30000 | 30000 | 30000 | 30000 |
| Min eDTUs choices per database | 0, 10, 20, 50 | 0, 10, 20, 50, 100 | 0, 10, 20, 50, 100, 200 | 0, 10, 20, 50, 100, 200, 300 | 0, 10, 20, 50, 100, 200, 300, 400 | 0, 10, 20, 50, 100, 200, 300, 400, 800 |
| Max eDTUs choices per database | 10, 20, 50 | 10, 20, 50, 100 | 10, 20, 50, 100, 200 | 10, 20, 50, 100, 200, 300 | 10, 20, 50, 100, 200, 300, 400 | 10, 20, 50, 100, 200, 300, 400, 800 |
| Max storage per database (GB) | 500 | 750 | 1024 | 1024 | 1024 | 1024 |
||||||||

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### Standard elastic pool limits (continued)

| eDTUs per pool | **1200** | **1600** | **2000** | **2500** | **3000** |
|:---|---:|---:|---:| ---: | ---: |
| Included storage per pool (GB) | 1200 | 1600 | 2000 | 2500 | 3000 |
| Max storage choices per pool (GB) | 1200, 1280, 1536, 1792, 2048, 2304, 2560 | 1600, 1792, 2048, 2304, 2560, 2816, 3072 | 2000, 2048, 2304, 2560, 2816, 3072, 3328, 3584 | 2500, 2560, 2816, 3072, 3328, 3584, 3840, 4096 | 3000, 3072, 3328, 3584, 3840, 4096 |
| Max In-Memory OLTP storage per pool (GB) | N/A | N/A | N/A | N/A | N/A |
| Max number DBs per pool <sup>1</sup> | 500 | 500 | 500 | 500 | 500 |
| Max concurrent workers (requests) per pool <sup>2</sup> | 2400 | 3200 | 4000 | 5000 | 6000 |
| Max concurrent sessions per pool <sup>2</sup> | 30000 | 30000 | 30000 | 30000 | 30000 |
| Min eDTUs choices per database | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500, 3000 |
| Max eDTUs choices per database | 10, 20, 50, 100, 200, 300, 400, 800, 1200 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500, 3000 |
| Max storage choices per database (GB) | 1024 | 1024 | 1024 | 1024 | 1024 |
|||||||

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### Premium elastic pool limits

| eDTUs per pool | **125** | **250** | **500** | **1000** | **1500**|
|:---|---:|---:|---:| ---: | ---: |
| Included storage per pool (GB) | 250 | 500 | 750 | 1024 | 1536 |
| Max storage choices per pool (GB) | 250, 500, 750, 1024 | 500, 750, 1024 | 750, 1024 | 1024 | 1536 |
| Max In-Memory OLTP storage per pool (GB) | 1 | 2 | 4 | 10 | 12 |
| Max number DBs per pool <sup>1</sup> | 50 | 100 | 100 | 100 | 100 |
| Max concurrent workers per pool (requests) <sup>2</sup> | 200 | 400 | 800 | 1600 | 2400 |
| Max concurrent sessions per pool <sup>2</sup> | 30000 | 30000 | 30000 | 30000 | 30000 |
| Min eDTUs per database | 0, 25, 50, 75, 125 | 0, 25, 50, 75, 125, 250 | 0, 25, 50, 75, 125, 250, 500 | 0, 25, 50, 75, 125, 250, 500, 1000 | 0, 25, 50, 75, 125, 250, 500, 1000|
| Max eDTUs per database | 25, 50, 75, 125 | 25, 50, 75, 125, 250 | 25, 50, 75, 125, 250, 500 | 25, 50, 75, 125, 250, 500, 1000 | 25, 50, 75, 125, 250, 500, 1000|
| Max storage per database (GB) | 1024 | 1024 | 1024 | 1024 | 1024 |
|||||||

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### Premium elastic pool limits (continued)

| eDTUs per pool | **2000** | **2500** | **3000** | **3500** | **4000**|
|:---|---:|---:|---:| ---: | ---: |
| Included storage per pool (GB) | 2048 | 2560 | 3072 | 3548 | 4096 |
| Max storage choices per pool (GB) | 2048 | 2560 | 3072 | 3548 | 4096|
| Max In-Memory OLTP storage per pool (GB) | 16 | 20 | 24 | 28 | 32 |
| Max number DBs per pool <sup>1</sup> | 100 | 100 | 100 | 100 | 100 |
| Max concurrent workers (requests) per pool <sup>2</sup> | 3200 | 4000 | 4800 | 5600 | 6400 |
| Max concurrent sessions per pool <sup>2</sup> | 30000 | 30000 | 30000 | 30000 | 30000 |
| Min eDTUs choices per database | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750, 4000 |
| Max eDTUs choices per database | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750, 4000 |
| Max storage per database (GB) | 1024 | 1024 | 1024 | 1024 | 1024 |
|||||||

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

> [!IMPORTANT]
> More than 1 TB of storage in the Premium tier is currently available in all regions except: China East, China North, Germany Central, Germany Northeast, West Central US, US DoD regions, and US Government Central. In these regions, the storage max in the Premium tier is limited to 1 TB.  For more information, see [P11-P15 current limitations](single-database-scale.md#p11-and-p15-constraints-when-max-size-greater-than-1-tb).

If all DTUs of an elastic pool are used, then each database in the pool receives an equal amount of resources to process queries. The SQL Database service provides resource sharing fairness between databases by ensuring equal slices of compute time. Elastic pool resource sharing fairness is in addition to any amount of resource otherwise guaranteed to each database when the DTU min per database is set to a non-zero value.

> [!NOTE]
> For `tempdb` limits, see [tempdb limits](https://docs.microsoft.com/sql/relational-databases/databases/tempdb-database?view=sql-server-2017#tempdb-database-in-sql-database).

### Database properties for pooled databases

The following table describes the properties for pooled databases.

| Property | Description |
|:--- |:--- |
| Max eDTUs per database |The maximum number of eDTUs that any database in the pool may use, if available based on utilization by other databases in the pool. Max eDTU per database is not a resource guarantee for a database. This setting is a global setting that applies to all databases in the pool. Set max eDTUs per database high enough to handle peaks in database utilization. Some degree of overcommitting is expected since the pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking. For example, suppose the peak utilization per database is 20 eDTUs and only 20% of the 100 databases in the pool are peak at the same time. If the eDTU max per database is set to 20 eDTUs, then it is reasonable to overcommit the pool by 5 times, and set the eDTUs per pool to 400. |
| Min eDTUs per database |The minimum number of eDTUs that any database in the pool is guaranteed. This setting is a global setting that applies to all databases in the pool. The min eDTU per database may be set to 0, and is also the default value. This property is set to anywhere between 0 and the average eDTU utilization per database. The product of the number of databases in the pool and the min eDTUs per database cannot exceed the eDTUs per pool. For example, if a pool has 20 databases and the eDTU min per database set to 10 eDTUs, then the eDTUs per pool must be at least as large as 200 eDTUs. |
| Max storage per database |The maximum database size set by the user for a database in a pool. However, pooled databases share allocated pool storage. Even if the total max storage *per database* is set to be greater than the total available storage *space of the pool*, the total space actually used by all of the databases will not be able to exceed the available pool limit. Max database size refers to the maximum size of the data files and does not include the space used by log files. |
|||

## Next steps

* For vCore resource limits for a single database, see [resource limits for single databases using the vCore purchasing model](resource-limits-vcore-single-databases.md)
* For DTU resource limits for a single database, see [resource limits for single databases using the DTU purchasing model](resource-limits-dtu-single-databases.md)
* For vCore resource limits for elastic pools, see [resource limits for elastic pools using the vCore purchasing model](resource-limits-vcore-elastic-pools.md)
* For resource limits for managed instances in Azure SQL Managed Instance, see [SQL Managed Instance resource limits](../managed-instance/resource-limits.md).
* For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).
* For information about resource limits on a logical SQL server, see [overview of resource limits on a logical SQL server](resource-limits-logical-server.md) for information about limits at the server and subscription levels.
