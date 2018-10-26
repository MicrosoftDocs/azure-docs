---
title: 'Azure SQL Database - general purpose and business critical | Microsoft Docs'
description: The article discusses the general purpose and business critical service tier in the vCore purchasing model.  
services: sql-database
ms.service: sql-database
ms.subservice: 
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: CarlRabeler
ms.author: carlrab
ms.reviewer: sashan, moslake
manager: craigg
ms.date: 10/15/2018
---
# General Purpose and Business Critical service tiers

This article discusses storage and backup considerations for the General Purpose and Business Critical service tiers in the vCore-based purchasing model.

> [!NOTE]
> For details on the Hyperscale service tier in the vCore-based purchasing model, see [Hyperscale service tier](sql-database-service-tier-hyperscale.md). For a comparison of the vCore-based purchasing model with the DTU-based purchasing model, see [Azure SQL Database purchasing models and resources](sql-database-service-tiers.md).

## Data and log storage

Consider the following:

- The allocated storage is used by data files (MDF) and log files (LDF) files.
- Each single database compute size supports a maximum database size, with a default max size of 32 GB.
- When you configure the required single database size (size of MDF), 30% of additional storage is automatically added to support LDF
- Storage size in Managed Instance must be specified in multiples of 32 GB.
- You can select any single database size between 10 GB and the supported maximum
  - For Standard storage, increase or decrease size in 10-GB increments
  - For Premium storage, increase or decrease size in 250-GB increments
- In the General Purpose service tier, `tempdb` uses an attached SSD and this storage cost is included in the vCore price.
- In the Business Critical service tier, `tempdb` shares the attached SSD with the MDF and LDF files and the tempDB storage cost is included in the vCore price.

> [!IMPORTANT]
> You are charged for the total storage allocated for MDF and LDF.

To monitor the current total size of MDF and LDF, use [sp_spaceused](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-spaceused-transact-sql). To monitor the current size of the individual MDF and LDF files, use [sys.database_files](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-database-files-transact-sql).

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md).

## Backups and storage

Storage for database backups is allocated to support the Point in Time Restore (PITR) and [Long Term Retention (LTR)](sql-database-long-term-retention.md) capabilities of SQL Database. This storage is allocated separately for each database and billed as two separate per-database charges.

- **PITR**: Individual database backups are copied to [RA-GRS storage](../storage/common/storage-designing-ha-apps-with-ragrs.md) are automatically. The storage size increases dynamically as the new backups are created.  The storage is used by weekly full backups, daily differential backups, and transaction log backups copied every 5 minutes. The storage consumption depends on the rate of change of the database and the retention period. You can configure a separate retention period for each database between 7 and 35 days. A minimum storage amount equal to 1x of data size is provided at no extra charge. For most databases, this amount is enough to store 7 days of backups.
- **LTR**: SQL Database offers the option configuring long-term retention of full backups for up to 10 years. If LTR policy is enabled, theses backups are stored in RA-GRS storage automatically, but you can control how often the backups are copied. To meet different compliance requirement, you can select different retention periods for weekly, monthly and/or yearly backups. This configuration will define how much storage will be used for the LTR backups. You can use the LTR pricing calculator to estimate the cost of LTR storage. For more information, see [Long-term retention](sql-database-long-term-retention.md).

## Next steps

- For details on specific compute sizes and storage size choices available for single database in the General Purpose and Business Critical Service tiers, see [SQL Database vCore-based resource limits for single databases](sql-database-vcore-resource-limits-single-databases.md#general-purpose-service-tier-storage-sizes-and-compute-sizes)
- For details on specific compute sizes and storage size choices available for elastic pools in the General Purpose and Business Critical Service tiers, see [SQL Database vCore-based resource limits for elastic pools](sql-database-vcore-resource-limits-elastic-pools.md#general-purpose-service-tier-storage-sizes-and-compute-sizes).
