---
title: General purpose and business critical service tiers
titleSuffix: Azure SQL Database & SQL Managed Instance
description: The article discusses the general purpose and business critical service tiers in the vCore-based purchasing model used by Azure SQL Database and Azure SQL Managed Instance. 
services: sql-database
ms.service: sql-db-mi
ms.subservice: service-overview
ms.custom: sqldbrb=2
ms.devlang: 
ms.topic: conceptual
author: dimitri-furman
ms.author: dfurman
ms.reviewer: mathoma
ms.date: 7/7/2021
---
# Azure SQL Database and Azure SQL Managed Instance service tiers
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

 Two [vCore](service-tiers-vcore.md) service tiers are available in both Azure SQL Database and Azure SQL Managed Instance:

- [General purpose](service-tier-general-purpose.md) is a budget-friendly tier designed for most workloads with common performance and availability requirements.
- [Business critical](service-tier-business-critical.md) tier is designed for performance-sensitive workloads with strict availability requirements.

Azure SQL Database also provides the Hyperscale service tier: 

- [Hyperscale](service-tier-hyperscale.md) is designed for most business workloads, providing highly scalable storage, read scale-out, fast scaling, and fast database restore capabilities.

## Service tier comparison

The following table describes the key differences between service tiers.

|-| Resource type | General Purpose | Hyperscale | Business Critical |
|:---:|:---:|:---:|:---:|:---:|
| **Best for** | |  Offers budget oriented balanced compute and storage options. | Most business workloads. Auto-scaling storage size up to 100 TB, fluid vertical and horizontal compute scaling, fast database restore. | OLTP applications with high transaction rate and low IO latency. Offers highest resilience to failures and fast failovers using multiple synchronously updated replicas.|
| **Available in resource type:** ||SQL Database / SQL Managed Instance | Single Azure SQL Database | SQL Database / SQL Managed Instance |
| **Compute size**| SQL Database | 1 to 80 vCores | 1 to 80  vCores | 1 to 128 vCores |
| | SQL Managed Instance | 4, 8, 16, 24, 32, 40, 64, 80  vCores | N/A | 4, 8, 16, 24, 32, 40, 64, 80  vCores |
| | SQL Managed Instance pools | 2, 4, 8, 16, 24, 32, 40, 64, 80  vCores | N/A | N/A |
| **Storage type** | All | Remote storage | Tiered remote and local SSD storage | Local SSD storage |
| **Database size** | SQL Database | 1 GB – 4 TB | 40 GB - 100 TB | 1 GB – 4 TB |
| | SQL Managed Instance  | 32 GB – 8 TB | N/A | 32 GB – 4 TB |
| **Storage size** | SQL Database | 1 GB – 4 TB | 40 GB - 100 TB | 1 GB – 4 TB |
| | SQL Managed Instance  | 32 GB – 8 TB | N/A | 32 GB – 4 TB |
| **TempDB size** | SQL Database | [32 GB per vCore](resource-limits-vcore-single-databases.md) | [32 GB per vCore](resource-limits-vcore-single-databases.md) | [32 GB per vCore](resource-limits-vcore-single-databases.md) |
| | SQL Managed Instance  | [24 GB per vCore](../managed-instance/resource-limits.md#service-tier-characteristics) | N/A | Up to 4 TB - [limited by storage size](../managed-instance/resource-limits.md#service-tier-characteristics) |
| **Log write throughput** | SQL Database | Single databases: [4.5 MB/s per vCore (max 50 MB/s)](resource-limits-vcore-single-databases.md) <br> Elastic pools: [6 MB/s per vCore (max 62.5 MB/s)](resource-limits-vcore-elastic-pools.md)| 100 MB/s | Single databases: [12 MB/s per vCore (max 96 MB/s)](resource-limits-vcore-single-databases.md) <br> Elastic pools: [15 MB/s per vCore (max 120 MB/s)](resource-limits-vcore-elastic-pools.md)|
| | SQL Managed Instance | [3 MB/s per vCore (max 22 MB/s)](../managed-instance/resource-limits.md#service-tier-characteristics) | N/A | [4 MB/s per vcore (max 48 MB/s)](../managed-instance/resource-limits.md#service-tier-characteristics) |
|**Availability**|All| 99.99% |  [99.95% with one secondary replica, 99.99% with more replicas](service-tier-hyperscale-frequently-asked-questions-faq.yml#what-slas-are-provided-for-a-hyperscale-database-) | 99.99% <br/> [99.995% with zone redundant single database](https://azure.microsoft.com/blog/understanding-and-leveraging-azure-sql-database-sla/) |
|**Backups**|All|RA-GRS, 1-35 days (7 days by default) | RA-GRS, 7 days, fast point-in-time recovery (PITR) | RA-GRS, 1-35 days (7 days by default) |
|**In-memory OLTP** | | N/A | Partial support. Memory-optimized table types, table variables, and natively compiled modules are supported. | Available |
|**Read-only replicas**| | 0 built-in <br> 0 - 4 using [geo-replication](active-geo-replication-overview.md) | 0 - 4 built-in | 1 built-in, included in price <br> 0 - 4 using [geo-replication](active-geo-replication-overview.md) |
|**Pricing/billing** | SQL Database | [vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/single/) are charged. <br/>IOPS is not charged. | [vCore for each replica and used storage](https://azure.microsoft.com/pricing/details/sql-database/single/) are charged. <br/>IOPS not yet charged. | [vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/single/) are charged. <br/>IOPS is not charged. |
|| SQL Managed Instance | [vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/managed/) is charged. <br/>IOPS is not charged| N/A | [vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/managed/) is charged. <br/>IOPS is not charged.| 
|**Discount models**| | [Reserved instances](reserved-capacity-overview.md)<br/>[Azure Hybrid Benefit](../azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions| [Azure Hybrid Benefit](../azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions| [Reserved instances](reserved-capacity-overview.md)<br/>[Azure Hybrid Benefit](../azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions|

For more information, see the detailed differences between the service tiers in [Azure SQL Database (vCore)](resource-limits-vcore-single-databases.md), [single Azure SQL Database (DTU)](resource-limits-dtu-single-databases.md), [pooled Azure SQL Database (DTU)](resource-limits-dtu-single-databases.md), and [Azure SQL Managed Instance](../managed-instance/resource-limits.md) pages.

> [!NOTE]
> For information about the Hyperscale service tier, see [Hyperscale service tier](service-tier-hyperscale.md). For a comparison of the vCore-based purchasing model with the DTU-based purchasing model, see [purchasing models and resources](purchasing-models.md).

## Data and log storage

The following factors affect the amount of storage used for data and log files, and apply to General Purpose and Business Critical tiers. For details on data and log storage in Hyperscale, see [Hyperscale service tier](service-tier-hyperscale.md).

- Each compute size supports a maximum data size, with a default of 32 GB.
- When you configure maximum data size, an additional 30 percent of storage is automatically added for log files.
- You can select any maximum data size between 1 GB and the supported storage size maximum, in 1 GB increments.
- In the General Purpose service tier, `tempdb` uses local SSD storage, and this storage cost is included in the vCore price.
- In the Business Critical service tier, `tempdb` shares local SSD storage with data and log files, and `tempdb` storage cost is included in the vCore price.
- The maximum storage size for a SQL Managed Instance must be specified in multiples of 32 GB.

> [!IMPORTANT]
> In the General Purpose and Business Critical tiers, you are charged for the maximum storage size configured for a database, elastic pool, or managed instance. In the Hyperscale tier, you are charged for the allocated data storage.

To monitor the current allocated and used data storage size in SQL Database, use *allocated_data_storage* and *storage* Azure Monitor [metrics](../../azure-monitor/essentials/metrics-supported.md#microsoftsqlserversdatabases) respectively. To monitor total consumed instance storage size for SQL Managed Instance, use the *storage_space_used_mb* [metric](../../azure-monitor/essentials/metrics-supported.md#microsoftsqlmanagedinstances). To monitor the current allocated and used storage size of individual data and log files in a database using T-SQL, use the [sys.database_files](/sql/relational-databases/system-catalog-views/sys-database-files-transact-sql) view and the [FILEPROPERTY(... , 'SpaceUsed')](/sql/t-sql/functions/fileproperty-transact-sql) function.

> [!TIP]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](file-space-manage.md).

## Backups and storage

Storage for database backups is allocated to support the [point-in-time restore (PITR)](recovery-using-backups.md) and [long-term retention (LTR)](long-term-retention-overview.md) capabilities of SQL Database and SQL Managed Instance. This storage is separate from data and log file storage, and is billed separately.

- **PITR**: In General Purpose and Business Critical tiers, individual database backups are copied to [read-access geo-redundant (RA-GRS) storage](../../storage/common/geo-redundant-design.md) automatically. The storage size increases dynamically as new backups are created. The storage is used by full, differential, and transaction log backups. The storage consumption depends on the rate of change of the database and the retention period configured for backups. You can configure a separate retention period for each database between 1 and 35 days for SQL Database, and 0 to 35 days for SQL Managed Instance. A backup storage amount equal to the configured maximum data size is provided at no extra charge.
- **LTR**: You also have the option to configure long-term retention of full backups for up to 10 years. If you set up an LTR policy, these backups are stored in RA-GRS storage automatically, but you can control how often the backups are copied. To meet different compliance requirements, you can select different retention periods for weekly, monthly, and/or yearly backups. The configuration you choose determines how much storage will be used for LTR backups. For more information, see [Long-term backup retention](long-term-retention-overview.md).

## Next steps

For details about the specific compute and storage sizes available in vCore service tiers, see: 

- [vCore-based resource limits for Azure SQL Database](resource-limits-vcore-single-databases.md).
- [vCore-based resource limits for pooled databases in Azure SQL Database](resource-limits-vcore-elastic-pools.md).
- [vCore-based resource limits for Azure SQL Managed Instance](../managed-instance/resource-limits.md).