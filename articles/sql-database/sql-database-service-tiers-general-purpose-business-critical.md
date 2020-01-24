---
title: General purpose and business critical
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
ms.date: 01/23/2020
---
# Azure SQL Database service tiers

Azure SQL Database is based on SQL Server database engine architecture that's adjusted for the cloud environment to ensure 99.99 percent availability, even if there is an infrastructure failure. Three service tiers are used in Azure SQL Database, each with a different architectural model. These service tiers are:

- [General purpose](sql-database-service-tier-general-purpose.md), which is designed for budget-oriented workloads.
- [Hyperscale](sql-database-service-tier-hyperscale.md), which is designed for most business workloads, providing highly scalable storage, read scale-out, and fast database restore capabilities.
- [Business critical](sql-database-service-tier-business-critical.md),which is designed for low-latency workloads with high resiliency to failures and fast failovers.

This article discusses differences be·tween the service tiers, storage and backup considerations for the general purpose and business critical service tiers in the vCore-based purchasing model.

## Service tier comparison

The following table describes the key differences between service tiers for the latest generation (Gen5). Note that service tier characteristics might be different in Single Database and Managed Instance.

| | Resource type | General Purpose |  Hyperscale | Business Critical |
|:---:|:---:|:---:|:---:|:---:|
| **Best for** | |  Offers budget oriented balanced compute and storage options. | Most business workloads. Auto-scaling storage size up to 100 TB, fluid vertical and horizontal compute scaling, fast database restore. | OLTP applications with high transaction rate and low IO latency. Offers highest resilience to failures and fast failovers using multiple synchronously updated replicas.|
|  **Available in resource type:** ||Single database / elastic pool / managed instance | Single database | Single database / elastic pool / managed instance |
| **Compute size**|Single database / elastic pool | 1 to 80 vCores | 1 to 80  vCores | 1 to 80 vCores |
| | Managed instance | 4, 8, 16, 24, 32, 40, 64, 80  vCores | N/A | 4, 8, 16, 24, 32, 40, 64, 80  vCores |
| | Managed instance pools | 2, 4, 8, 16, 24, 32, 40, 64, 80  vCores | N/A | N/A |
| **Storage type** | All | Premium remote storage (per instance) | De-coupled storage with local SSD cache (per instance) | Super-fast local SSD storage (per instance) |
| **Database size** | Single database / elastic pool | 5 GB – 4 TB | Up to 100 TB | 5 GB – 4 TB |
| | Managed instance  | 32 GB – 8 TB | N/A | 32 GB – 4 TB |
| **Storage size** | Single database / elastic pool | 5 GB – 4 TB | Up to 100 TB | 5 GB – 4 TB |
| | Managed instance  | 32 GB – 8 TB | N/A | 32 GB – 4 TB |
| **TempDB size** | Single database / elastic pool | [32 GB per vCore](sql-database-vcore-resource-limits-single-databases.md#general-purpose---provisioned-compute---gen4) | [32 GB per vCore](sql-database-vcore-resource-limits-single-databases.md#hyperscale---provisioned-compute---gen5) | [32 GB per vCore](sql-database-vcore-resource-limits-single-databases.md#business-critical---provisioned-compute---gen4) |
| | Managed instance  | [24 GB per vCore](sql-database-managed-instance-resource-limits.md#service-tier-characteristics) | N/A | Up to 4 TB - [limited by storage size](sql-database-managed-instance-resource-limits.md#service-tier-characteristics) |
| **Log write throughput** | Single database | [1.875 MB/s per vCore (max 30 MB/s)](sql-database-vcore-resource-limits-single-databases.md#general-purpose---provisioned-compute---gen4) | 100 MB/s | [6 MB/s per vCore (max 96 MB/s)](sql-database-vcore-resource-limits-single-databases.md#business-critical---provisioned-compute---gen4) |
| | Managed instance | [3 MB/s per vCore (max 22 MB/s)](sql-database-managed-instance-resource-limits.md#service-tier-characteristics) | N/A | [4 MB/s per vcore (max 48 MB/s)](sql-database-managed-instance-resource-limits.md#service-tier-characteristics) |
|**Availability**|All| 99.99% |  [99.95% with one secondary replica, 99.99% with more replicas](sql-database-service-tier-hyperscale-faq.md#what-slas-are-provided-for-a-hyperscale-database) | 99.99% <br/> [99.995% with zone redundant single database](https://azure.microsoft.com/blog/understanding-and-leveraging-azure-sql-database-sla/) |
|**Backups**|All|RA-GRS, 7-35 days (7 days by default)| RA-GRS, 7 days, constant time point-in-time recovery (PITR) | RA-GRS, 7-35 days (7 days by default) |
|**In-memory OLTP** | | N/A | N/A | Available |
|**Read-only replicas**| | 0 built-in <br> 0 - 4 using [geo-replication](sql-database-active-geo-replication.md) | 0 - 4 built-in | 1 built-in, included in price <br> 0 - 4 using [geo-replication](sql-database-active-geo-replication.md) |
|**Pricing/billing** | Single database | [vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/single/) are charged. <br/>IOPS is not charged. | [vCore for each replica and used storage](https://azure.microsoft.com/pricing/details/sql-database/single/) are charged. <br/>IOPS not yet charged. | [vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/single/) are charged. <br/>IOPS is not charged. |
|| Managed Instance | [vCore and reserved storage](https://azure.microsoft.com/pricing/details/sql-database/managed/) is charged. <br/>IOPS is not charged.<br/>Backup storage is not yet charged. | N/A | [vCore and reserved storage](https://azure.microsoft.com/pricing/details/sql-database/managed/) is charged. <br/>IOPS is not charged.<br/>Backup storage is not yet charged. | 
|**Discount models**| | [Reserved instances](sql-database-reserved-capacity.md)<br/>[Azure Hybrid Benefit](sql-database-azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions| [Azure Hybrid Benefit](sql-database-azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions| [Reserved instances](sql-database-reserved-capacity.md)<br/>[Azure Hybrid Benefit](sql-database-azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions|

For more information, see the detailed differences between the service tiers in [Single database (vCore)](sql-database-vcore-resource-limits-single-databases.md), [Single database pools (vCore)](sql-database-dtu-resource-limits-single-databases.md), [Single database (DTU)](sql-database-dtu-resource-limits-single-databases.md), [Single database pools (DTU)](sql-database-dtu-resource-limits-single-databases.md), and [Managed Instance](sql-database-managed-instance-resource-limits.md) pages.

> [!NOTE]
> For information about the hyperscale service tier in the vCore-based purchasing model, see [hyperscale service tier](sql-database-service-tier-hyperscale.md). For a comparison of the vCore-based purchasing model with the DTU-based purchasing model, see [Azure SQL Database purchasing models and resources](sql-database-purchase-models.md).

## Data and log storage

The following factors affect the amount of storage used for data and log files, and applies to General Purpose and Business Critical. For details on data and log storage in Hyperscale, see [Hyperscale service tier](sql-database-service-tier-hyperscale.md).

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
