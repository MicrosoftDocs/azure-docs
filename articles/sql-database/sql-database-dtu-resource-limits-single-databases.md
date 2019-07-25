---
title: Azure SQL Database DTU-based resource limits single databases| Microsoft Docs
description: This page describes some common DTU-based resource limits for single databases in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom: 
ms.devlang:
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: 
manager: craigg
ms.date: 03/20/2019
---
# Resource limits for single databases using the DTU-based purchasing model

This article provides the detailed resource limits for Azure SQL Database single databases using the DTU-based purchasing model.

For DTU-based purchasing model resource limits for elastic pools, see [DTU-based resource limits - elastic pools](sql-database-dtu-resource-limits-elastic-pools.md). For vCore-based resource limits, see [vCore-based resource limits - single databases](sql-database-vcore-resource-limits-single-databases.md) and [vCore-based resource limits - elastic pools](sql-database-vcore-resource-limits-elastic-pools.md). For more information regarding the different purchasing models, see [Purchasing models and service tiers](sql-database-purchase-models.md).

## Single database: Storage sizes and compute sizes

The following tables show the resources available for a single database at each service tier and compute size. You can set the service tier, compute size, and storage amount for a single database using the [Azure portal](sql-database-single-databases-manage.md#manage-an-existing-sql-database-server), [Transact-SQL](sql-database-single-databases-manage.md#transact-sql-manage-sql-database-servers-and-single-databases), [PowerShell](sql-database-single-databases-manage.md#powershell-manage-sql-database-servers-and-single-databases), the [Azure CLI](sql-database-single-databases-manage.md#azure-cli-manage-sql-database-servers-and-single-databases), or the [REST API](sql-database-single-databases-manage.md#rest-api-manage-sql-database-servers-and-single-databases).

> [!IMPORTANT]
> For scaling guidance and considerations, see [Scale a single database](sql-database-single-database-scale.md)

### Basic service tier

| **Compute size** | **Basic** |
| :--- | --: |
| Max DTUs | 5 |
| Included storage (GB) | 2 |
| Max storage choices (GB) | 2 |
| Max in-memory OLTP storage (GB) |N/A |
| Max concurrent workers (requests) | 30 |
| Max concurrent sessions | 300 |
|||

### Standard service tier

| **Compute size** | **S0** | **S1** | **S2** | **S3** |
| :--- |---:| ---:|---:|---:|
| Max DTUs | 10 | 20 | 50 | 100 |
| Included storage (GB) | 250 | 250 | 250 | 250 |
| Max storage choices (GB) | 250 | 250 | 250 | 250, 500, 750, 1024 |
| Max in-memory OLTP storage (GB) | N/A | N/A | N/A | N/A |
| Max concurrent workers (requests)| 60 | 90 | 120 | 200 |
| Max concurrent sessions |600 | 900 | 1200 | 2400 |
||||||

### Standard service tier (continued)

| **Compute size** | **S4** | **S6** | **S7** | **S9** | **S12** |
| :--- |---:| ---:|---:|---:|---:|
| Max DTUs | 200 | 400 | 800 | 1600 | 3000 |
| Included storage (GB) | 250 | 250 | 250 | 250 | 250 |
| Max storage choices (GB) | 250, 500, 750, 1024 | 250, 500, 750, 1024 | 250, 500, 750, 1024 | 250, 500, 750, 1024 | 250, 500, 750, 1024 |
| Max in-memory OLTP storage (GB) | N/A | N/A | N/A | N/A |N/A |
| Max concurrent workers (requests)| 400 | 800 | 1600 | 3200 |6000 |
| Max concurrent sessions |4800 | 9600 | 19200 | 30000 |30000 |
|||||||

### Premium service tier

| **Compute size** | **P1** | **P2** | **P4** | **P6** | **P11** | **P15** |
| :--- |---:|---:|---:|---:|---:|---:|
| Max DTUs | 125 | 250 | 500 | 1000 | 1750 | 4000 |
| Included storage (GB) | 500 | 500 | 500 | 500 | 4096* | 4096* |
| Max storage choices (GB) | 500, 750, 1024 | 500, 750, 1024 | 500, 750, 1024 | 500, 750, 1024 | 4096* | 4096* |
| Max in-memory OLTP storage (GB) | 1 | 2 | 4 | 8 | 14 | 32 |
| Max concurrent workers (requests)| 200 | 400 | 800 | 1600 | 2400 | 6400 |
| Max concurrent sessions | 30000 | 30000 | 30000 | 30000 | 30000 | 30000 |
|||||||

\* From 1024 GB up to 4096 GB in increments of 256 GB

> [!IMPORTANT]
> More than 1 TB of storage in the Premium tier is currently available in all regions except: China East, China North, Germany Central, Germany Northeast, West Central US, US DoD regions, and US Government Central. In these regions, the storage max in the Premium tier is limited to 1 TB.  For more information, see [P11-P15 current limitations](sql-database-single-database-scale.md#p11-and-p15-constraints-when-max-size-greater-than-1-tb).  
> [!NOTE]
> For `tempdb` limits, see [tempdb limits](https://docs.microsoft.com/sql/relational-databases/databases/tempdb-database?view=sql-server-2017#tempdb-database-in-sql-database).

## Next steps

- For vCore resource limits for a single database, see [resource limits for single databases using the vCore-based purchasing model](sql-database-vcore-resource-limits-single-databases.md)
- For vCore resource limits for elastic pools, see [resource limits for elastic pools using the vCore-based purchasing model](sql-database-vcore-resource-limits-elastic-pools.md)
- For DTU resource limits for elastic pools, see [resource limits for elastic pools using the DTU-based purchasing model](sql-database-dtu-resource-limits-elastic-pools.md)
- For resource limits for managed instances, see [managed instance resource limits](sql-database-managed-instance-resource-limits.md).
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
- For information about resource limits on a database server, see [overview of resource limits on a SQL Database server](sql-database-resource-limits-database-server.md) for information about limits at the server and subscription levels.
