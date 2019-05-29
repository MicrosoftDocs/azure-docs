---
title: 'Azure SQL Database - general purpose and business critical | Microsoft Docs'
description: The article discusses the general purpose and business critical service tiers in the vCore-based purchasing model.  
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: sashan, moslake, carlrab
manager: craigg
ms.date: 02/23/2019
---
# Azure SQL Database service tiers

Azure SQL Database is based on SQL Server database engine architecture that's adjusted for the cloud environment to ensure 99.99 percent availability, even if there is an infrastructure failure. Three service tiers are used in Azure SQL Database, each with a different architectural model. These service tiers are:

- [General purpose](sql-database-service-tier-general-purpose.md), which is designed for most generic workloads.
- [Business critical](sql-database-service-tier-business-critical.md), which is designed for low-latency workloads with one readable replica.
- [Hyperscale](sql-database-service-tier-hyperscale.md), which is designed for very large databases (up to 100 TB) with multiple readable replicas.

This article discusses storage and backup considerations for the general purpose and business critical service tiers in the vCore-based purchasing model.

> [!NOTE]
> For information about the hyperscale service tier in the vCore-based purchasing model, see [hyperscale service tier](sql-database-service-tier-hyperscale.md). For a comparison of the vCore-based purchasing model with the DTU-based purchasing model, see [Azure SQL Database purchasing models and resources](sql-database-purchase-models.md).

## Data and log storage

The following factors affect the amount of storage used for data and log files:

- The allocated storage is used by data files (MDF) and log files (LDF).
- Each single database compute size supports a maximum database size, with a default maximum size of 32 GB.
- When you configure the required single database size (the size of the MDF file), 30 percent more additional storage is automatically added to support LDF files.
- The storage size for a SQL Database managed instance must be specified in multiples of 32 GB.
- You can select any single database size between 10 GB and the supported maximum.
  - For storage in the standard or general purpose service tiers, increase or decrease the size in 10-GB increments.
  - For storage in the premium or business critical service tiers, increase or decrease the size in 250-GB increments.
- In the general purpose service tier, `tempdb` uses an attached SSD, and this storage cost is included in the vCore price.
- In the business critical service tier, `tempdb` shares the attached SSD with the MDF and LDF files, and the `tempdb` storage cost is included in the vCore price.

> [!IMPORTANT]
> You are charged for the total storage allocated for MDF and LDF files.

To monitor the current total size of your MDF and LDF files, use [sp_spaceused](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-spaceused-transact-sql). To monitor the current size of the individual MDF and LDF files, use [sys.database_files](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-database-files-transact-sql).

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md).

## Backups and storage

Storage for database backups is allocated to support the point-in-time restore (PITR) and [long-term retention (LTR)](sql-database-long-term-retention.md) capabilities of SQL Database. This storage is allocated separately for each database and billed as two separate per-database charges.

- **PITR**: Individual database backups are copied to [read-access geo-redundant (RA-GRS) storage](../storage/common/storage-designing-ha-apps-with-ragrs.md) automatically. The storage size increases dynamically as new backups are created. The storage is used by weekly full backups, daily differential backups, and transaction log backups, which are copied every 5 minutes. The storage consumption depends on the rate of change of the database and the retention period for backups. You can configure a separate retention period for each database between 7 and 35 days. A minimum storage amount equal to 100 percent (1x) of the database size is provided at no extra charge. For most databases, this amount is enough to store 7 days of backups.
- **LTR**: SQL Database offers you the option of configuring long-term retention of full backups for up to 10 years. If you set up an LTR policy, these backups are stored in RA-GRS storage automatically, but you can control how often the backups are copied. To meet different compliance requirements, you can select different retention periods for weekly, monthly, and/or yearly backups. The configuration you choose determines how much storage will be used for LTR backups. To estimate the cost of LTR storage, you can use the LTR pricing calculator. For more information, see [SQL Database long-term retention](sql-database-long-term-retention.md).

## Next steps

- For details about the specific compute sizes and storage sizes available for a single database in the general purpose and business critical service tiers, see [SQL Database vCore-based resource limits for single databases](sql-database-vcore-resource-limits-single-databases.md).
- For details about the specific compute sizes and storage sizes available for elastic pools in the general purpose and business critical service tiers, see [SQL Database vCore-based resource limits for elastic pools](sql-database-vcore-resource-limits-elastic-pools.md).
