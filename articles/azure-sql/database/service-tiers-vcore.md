---
title: vCore purchase model
titleSuffix: Azure SQL Database & SQL Managed Instance 
description: The vCore purchasing model lets you independently scale compute and storage resources, match on-premises performance, and optimize price for Azure SQL Database and Azure SQL Managed Instance.
services: sql-database
ms.service: sql-db-mi
ms.subservice: service-overview
ms.topic: conceptual
author: dimitri-furman
ms.author: dfurman
ms.reviewer: kendralittle, mathoma
ms.date: 12/18/2021
ms.custom: devx-track-azurepowershell
---
# vCore model overview - Azure SQL Database and Azure SQL Managed Instance 
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

This article provides a brief overview of the vCore purchasing model used by both Azure SQL Database and Azure SQL Managed Instance. To learn more about the vCore model for each product, review [Azure SQL Database](service-tiers-sql-database-vcore.md) and [Azure SQL Managed Instance](../managed-instance/service-tiers-managed-instance-vcore.md). 

The virtual core (vCore) purchasing model provides several benefits:

- Control over the hardware generation to better match compute and memory requirements of the workload.
- Pricing discounts for [Azure Hybrid Benefit (AHB)](../azure-hybrid-benefit.md) and [Reserved Instance (RI)](reserved-capacity-overview.md).
- Greater transparency in the hardware details that power the compute, that facilitates planning for migrations from on-premises deployments.
- In the case of Azure SQL Database, vCore purchasing model provides higher compute, memory, I/O, and storage limits than the DTU model.

## Overview

A virtual core (vCore) represents a logical CPU and offers you the option to choose between generations of hardware and the physical characteristics of the hardware (for example, the number of cores, the memory, and the storage size). The vCore-based purchasing model gives you flexibility, control, transparency of individual resource consumption, and a straightforward way to translate on-premises workload requirements to the cloud. This model allows you to choose compute, memory, and storage resources based on your workload needs.

The vCore-based purchasing model lets you independently choose compute and storage resources, match on-premises performance, and optimize price. In the vCore-based purchasing model, you pay for:

- Compute resources (the service tier + the number of vCores and the amount of memory + the generation of hardware).
- The type and amount of data and log storage.
- Backup storage (RA-GRS).

> [!IMPORTANT]
> Compute resources, I/O, and data and log storage are charged per database or elastic pool. Backup storage is charged per each database.
> **Region limitations:** For the current list of supported regions, see [products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=sql-database&regions=all). 

## Service tiers

Two vCore service tiers are available in both Azure SQL Database and Azure SQL Managed Instance:

- [General purpose](service-tier-general-purpose.md) is a budget-friendly tier designed for most workloads with common performance and availability requirements.
- [Business critical](service-tier-business-critical.md) tier is designed for performance-sensitive workloads with strict availability requirements.

The [Hyperscale service tier](service-tier-hyperscale.md) is also available for single databases in Azure SQL Database, which is designed for most business workloads, providing highly scalable storage, read scale-out, fast scaling, and fast database restore capabilities.

## Resource limits

For more information on resource limits, see:

 - [Azure SQL Database](resource-limits-vcore-single-databases.md)
 - [Azure SQL Managed Instance](../managed-instance/resource-limits.md)

## Compute cost 

In the vCore-based purchasing model, the compute cost reflects the total compute capacity that is provisioned for the application. Choose the vCore and memory allocation that suits your business needs, and scale up and down as your workload requires. 

Since three additional replicas are automatically allocated in the business critical service tier, the price is approximately 2.7 times higher than it is in the general purpose service tier. Likewise, the higher storage price per GB in the business critical service tier reflects the higher IO limits and lower latency of the SSD storage.

## Data and log storage

The following factors affect the amount of storage used for data and log files, and apply to general purpose and business critical tiers. 

- Each compute size supports a maximum data size, with a default of 32 GB.
- When you configure maximum data size, an additional 30 percent of storage is automatically added for log files.
- You can select any maximum data size between 1 GB and the supported storage size maximum, in 1 GB increments.
- In the general purpose service tier, `tempdb` uses local SSD storage, and this storage cost is included in the vCore price.
- In the business critical service tier, `tempdb` shares local SSD storage with data and log files, and `tempdb` storage cost is included in the vCore price.
- The maximum storage size for a SQL Managed Instance must be specified in multiples of 32 GB.

> [!IMPORTANT]
> In the general purpose and business critical tiers, you are charged for the maximum storage size configured for a database, elastic pool, or managed instance. In the Hyperscale tier, you are charged for the allocated data storage.

To monitor the current allocated and used data storage size in SQL Database, use the *allocated_data_storage* and *storage* Azure Monitor [metrics](../../azure-monitor/essentials/metrics-supported.md#microsoftsqlserversdatabases) respectively. To monitor the current allocated and used storage size of individual data and log files in a database using T-SQL, use the [sys.database_files](/sql/relational-databases/system-catalog-views/sys-database-files-transact-sql) view and the [FILEPROPERTY(... , 'SpaceUsed')](/sql/t-sql/functions/fileproperty-transact-sql) function.

> [!TIP]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](file-space-manage.md).

## Backups and storage

Storage for database backups is allocated to support the [point-in-time restore (PITR)](recovery-using-backups.md) and [long-term retention (LTR)](long-term-retention-overview.md) capabilities of SQL Database and SQL Managed Instance. This storage is separate from data and log file storage, and is billed separately.

- **PITR**: In general purpose and business critical tiers, individual database backups are copied to [read-access geo-redundant (RA-GRS) storage](../../storage/common/geo-redundant-design.md) automatically. The storage size increases dynamically as new backups are created. The storage is used by full, differential, and transaction log backups. The storage consumption depends on the rate of change of the database and the retention period configured for backups. You can configure a separate retention period for each database between 1 and 35 days for SQL Database, and 0 to 35 days for SQL Managed Instance. A backup storage amount equal to the configured maximum data size is provided at no extra charge.
- **LTR**: You also have the option to configure long-term retention of full backups for up to 10 years. If you set up an LTR policy, these backups are stored in RA-GRS storage automatically, but you can control how often the backups are copied. To meet different compliance requirements, you can select different retention periods for weekly, monthly, and/or yearly backups. The configuration you choose determines how much storage will be used for LTR backups. For more information, see [Long-term backup retention](long-term-retention-overview.md).

## Next steps

To get started, see: 
- [Creating a SQL Database using the Azure portal](single-database-create-quickstart.md)
- [Creating a SQL Managed Instance using the Azure portal](../managed-instance/instance-create-quickstart.md)

- For pricing details, see 
    - [Azure SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/single/)
    - [Azure SQL Managed Instance single instance pricing page](https://azure.microsoft.com/pricing/details/azure-sql-managed-instance/single/)
    - [Azure SQL Managed Instance pools pricing page](https://azure.microsoft.com/pricing/details/azure-sql-managed-instance/pools/)
    
For details about the specific compute and storage sizes available in the general purpose and business critical service tiers, see:

- [vCore-based resource limits for Azure SQL Database](resource-limits-vcore-single-databases.md).
- [vCore-based resource limits for pooled Azure SQL Database](resource-limits-vcore-elastic-pools.md).
- [vCore-based resource limits for Azure SQL Managed Instance](../managed-instance/resource-limits.md).
