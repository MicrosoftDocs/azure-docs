---
title: Azure SQL Database DTU-based resource limits elastic pools| Microsoft Docs
description: This page describes some common DTU-based resource limits for elastic pools in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: elastic-pools
ms.custom: 
ms.devlang:
ms.topic: conceptual
author: sachinpMSFT
ms.author: sachinp
ms.reviewer: carlrab
manager: craigg
ms.date: 09/20/2018
---
# Resources limits for elastic pools using the DTU-based purchasing model 

This article provides the detailed resource limits for Azure SQL Database elastic pools and pooled databases using the DTU-based purchasing model. 

For DTU-based purchasing model resource limits for single databases, see [DTU-based resource limits - single databases](sql-database-vcore-resource-limits-elastic-pools.md). For vCore-based resource limits, see [vCore-based resource limits - single databases](sql-database-vcore-resource-limits-single-databases.md) and [vCore-based resource limits - elastic pools](sql-database-vcore-resource-limits-elastic-pools.md).

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md).

## Elastic pool: Storage sizes and compute sizes

For SQL Database elastic pools, the following tables show the resources available at each service tier and compute size. You can set the service tier, compute size, and storage amount using the [Azure portal](sql-database-elastic-pool-manage.md#azure-portal-manage-elastic-pools-and-pooled-databases), [PowerShell](sql-database-elastic-pool-manage.md#powershell-manage-elastic-pools-and-pooled-databases), the [Azure CLI](sql-database-elastic-pool-manage.md#azure-cli-manage-elastic-pools-and-pooled-databases), or the [REST API](sql-database-elastic-pool-manage.md#rest-api-manage-elastic-pools-and-pooled-databases).

> [!NOTE]
> The resource limits of individual databases in elastic pools are generally the same as for single databases outside of pools based on DTUs and the service tier. For example, the max concurrent workers for an S2 database is 120 workers. So, the max concurrent workers for a database in a Standard pool is also 120 workers if the max DTU per database in the pool is 50 DTUs (which is equivalent to S2).

### Basic elastic pool limits

| eDTUs per pool | **50** | **100** | **200** | **300** | **400** | **800** | **1200** | **1600** |
|:---|---:|---:|---:| ---: | ---: | ---: | ---: | ---: |
| Included storage per pool (GB) | 5 | 10 | 20 | 29 | 39 | 78 | 117 | 156 |
| Max storage choices per pool (GB) | 5 | 10 | 20 | 29 | 39 | 78 | 117 | 156 |
| Max In-Memory OLTP storage per pool (GB) | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Max number DBs per pool | 100 | 200 | 500 | 500 | 500 | 500 | 500 | 500 |
| Max concurrent workers (requests) per pool | 100 | 200 | 400 | 600 | 800 | 1600 | 2400 | 3200 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 |30000 | 30000 | 30000 | 30000 |
| Min eDTUs choices per database | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 |
| Max eDTUs choices per database | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 |
| Max storage per database (GB) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 
||||||||

### Standard elastic pool limits

| eDTUs per pool | **50** | **100** | **200** | **300** | **400** | **800**| 
|:---|---:|---:|---:| ---: | ---: | ---: | 
| Included storage per pool (GB) | 50 | 100 | 200 | 300 | 400 | 800 | 
| Max storage choices per pool (GB) | 50, 250, 500 | 100, 250, 500, 750 | 200, 250, 500, 750, 1024 | 300, 500, 750, 1024, 1280 | 400, 500, 750, 1024, 1280, 1536 | 800, 1024, 1280, 1536, 1792, 2048 | 
| Max In-Memory OLTP storage per pool (GB) | N/A | N/A | N/A | N/A | N/A | N/A | 
| Max number DBs per pool | 100 | 200 | 500 | 500 | 500 | 500 | 
| Max concurrent workers (requests) per pool | 100 | 200 | 400 | 600 | 800 | 1600 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 | 30000 | 30000 |
| Min eDTUs choices per database | 0, 10, 20, 50 | 0, 10, 20, 50, 100 | 0, 10, 20, 50, 100, 200 | 0, 10, 20, 50, 100, 200, 300 | 0, 10, 20, 50, 100, 200, 300, 400 | 0, 10, 20, 50, 100, 200, 300, 400, 800 |
| Max eDTUs choices per database | 10, 20, 50 | 10, 20, 50, 100 | 10, 20, 50, 100, 200 | 10, 20, 50, 100, 200, 300 | 10, 20, 50, 100, 200, 300, 400 | 10, 20, 50, 100, 200, 300, 400, 800 | 
| Max storage per database (GB) | 500 | 750 | 1024 | 1024 | 1024 | 1024 |
||||||||

### Standard elastic pool limits (continued) 

| eDTUs per pool | **1200** | **1600** | **2000** | **2500** | **3000** |
|:---|---:|---:|---:| ---: | ---: |
| Included storage per pool (GB) | 1200 | 1600 | 2000 | 2500 | 3000 | 
| Max storage choices per pool (GB) | 1200, 1280, 1536, 1792, 2048, 2304, 2560 | 1600, 1792, 2048, 2304, 2560, 2816, 3072 | 2000, 2048, 2304, 2560, 2816, 3072, 3328, 3584 | 2500, 2560, 2816, 3072, 3328, 3584, 3840, 4096 | 3000, 3072, 3328, 3584, 3840, 4096 |
| Max In-Memory OLTP storage per pool (GB) | N/A | N/A | N/A | N/A | N/A | 
| Max number DBs per pool | 500 | 500 | 500 | 500 | 500 | 
| Max concurrent workers (requests) per pool | 2400 | 3200 | 4000 | 5000 | 6000 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 | 30000 | 
| Min eDTUs choices per database | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500, 3000 |
| Max eDTUs choices per database | 10, 20, 50, 100, 200, 300, 400, 800, 1200 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500, 3000 | 
| Max storage choices per database (GB) | 1024 | 1024 | 1024 | 1024 | 1024 | 
||||||||

### Premium elastic pool limits

| eDTUs per pool | **125** | **250** | **500** | **1000** | **1500**| 
|:---|---:|---:|---:| ---: | ---: | 
| Included storage per pool (GB) | 250 | 500 | 750 | 1024 | 1536 | 
| Max storage choices per pool (GB) | 250, 500, 750, 1024 | 500, 750, 1024 | 750, 1024 | 1024 | 1536 |
| Max In-Memory OLTP storage per pool (GB) | 1 | 2 | 4 | 10 | 12 | 
| Max number DBs per pool | 50 | 100 | 100 | 100 | 100 | 
| Max concurrent workers per pool (requests) | 200 | 400 | 800 | 1600 | 2400 | 
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 | 30000 | 
| Min eDTUs per database | 0, 25, 50, 75, 125 | 0, 25, 50, 75, 125, 250 | 0, 25, 50, 75, 125, 250, 500 | 0, 25, 50, 75, 125, 250, 500, 1000 | 0, 25, 50, 75, 125, 250, 500, 1000, 1500 | 
| Max eDTUs per database | 25, 50, 75, 125 | 25, 50, 75, 125, 250 | 25, 50, 75, 125, 250, 500 | 25, 50, 75, 125, 250, 500, 1000 | 25, 50, 75, 125, 250, 500, 1000, 1500 |
| Max storage per database (GB) | 1024 | 1024 | 1024 | 1024 | 1024 | 
||||||||

### Premium elastic pool limits (continued) 

| eDTUs per pool | **2000** | **2500** | **3000** | **3500** | **4000**|
|:---|---:|---:|---:| ---: | ---: | 
| Included storage per pool (GB) | 2048 | 2560 | 3072 | 3548 | 4096 |
| Max storage choices per pool (GB) | 2048 | 2560 | 3072 | 3548 | 4096|
| Max In-Memory OLTP storage per pool (GB) | 16 | 20 | 24 | 28 | 32 |
| Max number DBs per pool | 100 | 100 | 100 | 100 | 100 | 
| Max concurrent workers (requests) per pool | 3200 | 4000 | 4800 | 5600 | 6400 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 | 30000 | 
| Min eDTUs choices per database | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750, 4000 | 
| Max eDTUs choices per database | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750, 4000 | 
| Max storage per database (GB) | 1024 | 1024 | 1024 | 1024 | 1024 | 
||||||||

> [!IMPORTANT]
> More than 1 TB of storage in the Premium tier is currently available in all regions except the following: West Central US, China East, USDoDCentral, Germany Central, USDoDEast, US Gov SouthWest, Germany NorthEast, USGov Iowa, China North. In other regions, the storage max in the Premium tier is limited to 1 TB. See [P11-P15 Current Limitations](sql-database-dtu-resource-limits-single-databases.md#single-database-limitations-of-p11-and-p15-when-the-maximum-size-greater-than-1-tb).  

If all DTUs of an elastic pool are used, then each database in the pool receives an equal amount of resources to process queries. The SQL Database service provides resource sharing fairness between databases by ensuring equal slices of compute time. Elastic pool resource sharing fairness is in addition to any amount of resource otherwise guaranteed to each database when the DTU min per database is set to a non-zero value.

### Database properties for pooled databases

The following table describes the properties for pooled databases.

| Property | Description |
|:--- |:--- |
| Max eDTUs per database |The maximum number of eDTUs that any database in the pool may use, if available based on utilization by other databases in the pool. Max eDTU per database is not a resource guarantee for a database. This setting is a global setting that applies to all databases in the pool. Set max eDTUs per database high enough to handle peaks in database utilization. Some degree of overcommitting is expected since the pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking. For example, suppose the peak utilization per database is 20 eDTUs and only 20% of the 100 databases in the pool are peak at the same time. If the eDTU max per database is set to 20 eDTUs, then it is reasonable to overcommit the pool by 5 times, and set the eDTUs per pool to 400. |
| Min eDTUs per database |The minimum number of eDTUs that any database in the pool is guaranteed. This setting is a global setting that applies to all databases in the pool. The min eDTU per database may be set to 0, and is also the default value. This property is set to anywhere between 0 and the average eDTU utilization per database. The product of the number of databases in the pool and the min eDTUs per database cannot exceed the eDTUs per pool. For example, if a pool has 20 databases and the eDTU min per database set to 10 eDTUs, then the eDTUs per pool must be at least as large as 200 eDTUs. |
| Max storage per database |The maximum database size set by the user for a database in a pool. However, pooled databases share allocated pool storage. Even if the total max storage *per database* is set to be greater than the total available storage *space of the pool*, the total space actually used by all of the databases will not be able to exceed the available pool limit. Max database size refers to the maximum size of the data files and does not include the space used by log files. |
|||
 


## Next steps

- See [SQL Database FAQ](sql-database-faq.md) for answers to frequently asked questions.
- See [Overview of resource limits on a logical server](sql-database-resource-limits-logical-server.md) for information about limits at the server and subscription levels.
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
- For information about DTUs and eDTUs, see [DTUs and eDTUs](sql-database-service-tiers.md#dtu-based-purchasing-model).
- For information about tempdb size limits, see https://docs.microsoft.com/sql/relational-databases/databases/tempdb-database#tempdb-database-in-sql-database.
