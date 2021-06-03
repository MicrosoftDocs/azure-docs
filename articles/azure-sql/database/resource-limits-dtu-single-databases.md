---
title: DTU resource limits single databases
description: This page describes some common DTU resource limits for single databases in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: service-overview
ms.custom: references_regions, seo-lt-2019, sqldbrb=1
ms.devlang:
ms.topic: reference
author: dimitri-furman
ms.author: dfurman
ms.reviewer: mathoma
ms.date: 04/16/2021
---
# Resource limits for single databases using the DTU purchasing model - Azure SQL Database
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article provides the detailed resource limits for Azure SQL Database single databases using the DTU purchasing model.

* For DTU purchasing model limits for single databases on a server, see [Overview of resource limits on a server](resource-limits-logical-server.md).
* For DTU purchasing model resource limits for Azure SQL Database, see [DTU resource limits single databases](resource-limits-dtu-single-databases.md) and [DTU resource limits elastic pools](resource-limits-dtu-elastic-pools.md).
* For vCore resource limits, see [vCore resource limits - Azure SQL Database](resource-limits-vcore-single-databases.md) and [vCore resource limits - elastic pools](resource-limits-vcore-elastic-pools.md).
* For more information regarding the different purchasing models, see [Purchasing models and service tiers](purchasing-models.md).

Each read-only replica has its own resources such as DTUs, workers, and sessions. Each read-only replica is subject to the resource limits detailed later in this article. 


## Single database: Storage sizes and compute sizes

The following tables show the resources available for a single database at each service tier and compute size. You can set the service tier, compute size, and storage amount for a single database using:

* [Transact-SQL](single-database-manage.md#transact-sql-t-sql) via [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql#overview-sql-database)
* [Azure portal](single-database-manage.md#the-azure-portal)
* [PowerShell](single-database-manage.md#powershell)
* [Azure CLI](single-database-manage.md#the-azure-cli)
* [REST API](single-database-manage.md#rest-api)

> [!IMPORTANT]
> For scaling guidance and considerations, see [Scale a single database](single-database-scale.md)

### Basic service tier

| **Compute size** | **Basic** |
| :--- | --: |
| Max DTUs | 5 |
| Included storage (GB) | 2 |
| Max storage (GB) | 2 |
| Max in-memory OLTP storage (GB) |N/A |
| Max concurrent workers (requests) | 30 |
| Max concurrent sessions | 300 |
|||

> [!IMPORTANT]
> The Basic service tier provides less than one vCore (CPU).  For CPU-intensive workloads, a service tier of S3 or greater is recommended.
>
>Regarding data storage, the Basic service tier is placed on Standard Page Blobs. Standard Page Blobs use hard disk drive (HDD)-based storage media and are best suited for development, testing, and other infrequently accessed workloads that are less sensitive to performance variability.
>

### Standard service tier

| **Compute size** | **S0** | **S1** | **S2** | **S3** |
| :--- |---:| ---:|---:|---:|
| Max DTUs | 10 | 20 | 50 | 100 |
| Included storage (GB) <sup>1</sup> | 250 | 250 | 250 | 250 |
| Max storage (GB) | 250 | 250 | 250 | 1024 |
| Max in-memory OLTP storage (GB) | N/A | N/A | N/A | N/A |
| Max concurrent workers (requests)| 60 | 90 | 120 | 200 |
| Max concurrent sessions |600 | 900 | 1200 | 2400 |
||||||

<sup>1</sup> See [SQL Database pricing options](https://azure.microsoft.com/pricing/details/sql-database/single/) for details on additional cost incurred due to any extra storage provisioned.

> [!IMPORTANT]
> The Standard S0, S1 and S2 tiers provide less than one vCore (CPU).  For CPU-intensive workloads, a service tier of S3 or greater is recommended.
>
>Regarding data storage, the Standard S0 and S1 service tiers are placed on Standard Page Blobs. Standard Page Blobs use hard disk drive (HDD)-based storage media and are best suited for development, testing, and other infrequently accessed workloads that are less sensitive to performance variability.
>

### Standard service tier (continued)

| **Compute size** | **S4** | **S6** | **S7** | **S9** | **S12** |
| :--- |---:| ---:|---:|---:|---:|
| Max DTUs | 200 | 400 | 800 | 1600 | 3000 |
| Included storage (GB) <sup>1</sup> | 250 | 250 | 250 | 250 | 250 |
| Max storage (GB) | 1024 | 1024 | 1024 | 1024 | 1024 |
| Max in-memory OLTP storage (GB) | N/A | N/A | N/A | N/A |N/A |
| Max concurrent workers (requests)| 400 | 800 | 1600 | 3200 |6000 |
| Max concurrent sessions |4800 | 9600 | 19200 | 30000 |30000 |
|||||||

<sup>1</sup> See [SQL Database pricing options](https://azure.microsoft.com/pricing/details/sql-database/single/) for details on additional cost incurred due to any extra storage provisioned.

### Premium service tier

| **Compute size** | **P1** | **P2** | **P4** | **P6** | **P11** | **P15** |
| :--- |---:|---:|---:|---:|---:|---:|
| Max DTUs | 125 | 250 | 500 | 1000 | 1750 | 4000 |
| Included storage (GB) <sup>1</sup> | 500 | 500 | 500 | 500 | 4096 <sup>2</sup> | 4096 <sup>2</sup> |
| Max storage (GB) | 1024 | 1024 | 1024 | 1024 | 4096 <sup>2</sup> | 4096 <sup>2</sup> |
| Max in-memory OLTP storage (GB) | 1 | 2 | 4 | 8 | 14 | 32 |
| Max concurrent workers (requests)| 200 | 400 | 800 | 1600 | 2800 | 6400 |
| Max concurrent sessions | 30000 | 30000 | 30000 | 30000 | 30000 | 30000 |
|||||||

<sup>1</sup> See [SQL Database pricing options](https://azure.microsoft.com/pricing/details/sql-database/single/) for details on additional cost incurred due to any extra storage provisioned.

<sup>2</sup> From 1024 GB up to 4096 GB in increments of 256 GB.

> [!IMPORTANT]
> More than 1 TB of storage in the Premium tier is currently available in all regions except: China East, China North, Germany Central, and Germany Northeast. In these regions, the storage max in the Premium tier is limited to 1 TB.  For more information, see [P11-P15 current limitations](single-database-scale.md#p11-and-p15-constraints-when-max-size-greater-than-1-tb).

> [!NOTE]
> For `tempdb` limits, see [tempdb limits](/sql/relational-databases/databases/tempdb-database#tempdb-database-in-sql-database).
> 
> For additional information on storage limits in the Premium service tier, see [Storage space governance](resource-limits-logical-server.md#storage-space-governance).

## Next steps

- For vCore resource limits for a single database, see [resource limits for single databases using the vCore purchasing model](resource-limits-vcore-single-databases.md)
- For vCore resource limits for elastic pools, see [resource limits for elastic pools using the vCore purchasing model](resource-limits-vcore-elastic-pools.md)
- For DTU resource limits for elastic pools, see [resource limits for elastic pools using the DTU purchasing model](resource-limits-dtu-elastic-pools.md)
- For resource limits for managed instances in Azure SQL Managed Instance, see [SQL Managed Instance resource limits](../managed-instance/resource-limits.md).
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).
- For information about resource limits on a logical SQL server, see [overview of resource limits on a logical SQL server](resource-limits-logical-server.md) for information about limits at the server and subscription levels.