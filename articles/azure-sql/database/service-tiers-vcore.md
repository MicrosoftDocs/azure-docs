---
title: vCore purchasing model
titleSuffix: Azure SQL Database & SQL Managed Instance 
description: The vCore purchasing model lets you independently scale compute and storage resources, match on-premises performance, and optimize price for Azure SQL Database and Azure SQL Managed Instance.
services: sql-database
ms.service: sql-db-mi
ms.subservice: service-overview
ms.topic: conceptual
author: dimitri-furman
ms.author: dfurman
ms.reviewer: kendralittle, mathoma
ms.date: 04/06/2022
ms.custom: devx-track-azurepowershell
---
# vCore purchasing model overview - Azure SQL Database and Azure SQL Managed Instance 
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

This article provides a brief overview of the vCore purchasing model used by both Azure SQL Database and Azure SQL Managed Instance. To learn more about the vCore model for each product, review [Azure SQL Database](service-tiers-sql-database-vcore.md) and [Azure SQL Managed Instance](../managed-instance/service-tiers-managed-instance-vcore.md). 

## Overview

[!INCLUDE [vcore-overview](../includes/vcore-overview.md)]

> [!IMPORTANT]
> In Azure SQL Database, compute resources (CPU and memory), I/O, and data and log storage are charged per database or elastic pool. Backup storage is charged per each database.

The vCore purchasing model provides transparency in database CPU, memory, and storage resource allocation, hardware configuration, higher scaling granularity, and pricing discounts with the [Azure Hybrid Benefit (AHB)](../azure-hybrid-benefit.md) and [Reserved Instance (RI)](../database/reserved-capacity-overview.md).

In the case of Azure SQL Database, the vCore purchasing model provides higher compute, memory, I/O, and storage limits than the DTU model.

## Service tiers

Two vCore service tiers are available in both Azure SQL Database and Azure SQL Managed Instance:

- [General purpose](service-tier-general-purpose.md) is a budget-friendly tier designed for most workloads with common performance and availability requirements.
- [Business critical](service-tier-business-critical.md) tier is designed for performance-sensitive workloads with strict availability requirements.

The [Hyperscale service tier](service-tier-Hyperscale.md) is also available for single databases in Azure SQL Database. This service tier is designed for most business workloads, providing highly scalable storage, read scale-out, fast scaling, and fast database restore capabilities.

## Resource limits

For more information on resource limits, see:

 - Azure SQL Database: [logical server](resource-limits-logical-server.md), [single databases](resource-limits-vcore-single-databases.md), [pooled databases](resource-limits-vcore-elastic-pools.md)
 - [Azure SQL Managed Instance](../managed-instance/resource-limits.md)

## Compute cost 

The vCore-based purchasing model has a provisioned compute tier for both Azure SQL Database and Azure SQL Managed Instance, and a serverless compute tier for Azure SQL Database. 

In the provisioned compute tier, the compute cost reflects the total compute capacity continuously provisioned for the application independent of workload activity. Choose the resource allocation that best suits your business needs based on vCore and memory requirements, then scale resources up and down as needed by your workload.

In the serverless compute tier for Azure SQL database, compute resources are auto-scaled based on workload capacity and billed for the amount of compute used, per second. 

Since three additional replicas are automatically allocated in the Business Critical service tier, the price is approximately 2.7 times higher than it is in the General Purpose service tier. Likewise, the higher storage price per GB in the Business Critical service tier reflects the higher IO limits and lower latency of the local SSD storage.

## Data and log storage

The following factors affect the amount of storage used for data and log files, and apply to General Purpose and Business Critical tiers. 

- Each compute size supports a configurable maximum data size, with a default of 32 GB.
- When you configure maximum data size, an additional 30 percent of billable storage is automatically added for the log file.
- In the General Purpose service tier, `tempdb` uses local SSD storage, and this storage cost is included in the vCore price.
- In the Business Critical service tier, `tempdb` shares local SSD storage with data and log files, and `tempdb` storage cost is included in the vCore price.
- In the General Purpose and Business Critical tiers, you are charged for the maximum storage size configured for a database, elastic pool, or managed instance.
- For SQL Database, you can select any maximum data size between 1 GB and the supported storage size maximum, in 1 GB increments. For SQL Managed Instance, select data sizes in multiples of 32 GB up to the supported storage size maximum. 

To monitor the current allocated and used data storage size in SQL Database, use the *allocated_data_storage* and *storage* Azure Monitor [metrics](../../azure-monitor/essentials/metrics-supported.md#microsoftsqlserversdatabases) respectively. 

For both SQL Database and SQL Managed instance, to monitor the current allocated and used storage size of individual data and log files in a database by using T-SQL, use the [sys.database_files](/sql/relational-databases/system-catalog-views/sys-database-files-transact-sql) view and the [FILEPROPERTY(... , 'SpaceUsed')](/sql/t-sql/functions/fileproperty-transact-sql) function.

> [!TIP]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](file-space-manage.md).

## Backup storage

Storage for database backups is allocated to support the [point-in-time restore (PITR)](recovery-using-backups.md) and [long-term retention (LTR)](long-term-retention-overview.md) capabilities of SQL Database and SQL Managed Instance. This storage is separate from data and log file storage, and is billed separately.

- **PITR**: In General Purpose and Business Critical tiers, individual database backups are copied to [Azure storage](automated-backups-overview.md#restore-capabilities) automatically. The storage size increases dynamically as new backups are created. The storage is used by full, differential, and transaction log backups. The storage consumption depends on the rate of change of the database and the retention period configured for backups. You can configure a separate retention period for each database between 1 and 35 days for SQL Database, and 0 to 35 days for SQL Managed Instance. A backup storage amount equal to the configured maximum data size is provided at no extra charge.
- **LTR**: You also have the option to configure long-term retention of full backups for up to 10 years. If you set up an LTR policy, these backups are stored in Azure Blob storage automatically, but you can control how often the backups are copied. To meet different compliance requirements, you can select different retention periods for weekly, monthly, and/or yearly backups. The configuration you choose determines how much storage will be used for LTR backups. For more information, see [Long-term backup retention](long-term-retention-overview.md).

## Next steps

To get started, see: 
- [Creating a SQL Database using the Azure portal](single-database-create-quickstart.md)
- [Creating a SQL Managed Instance using the Azure portal](../managed-instance/instance-create-quickstart.md)

- For pricing details, see 
    - [Azure SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/single/)
    - [Azure SQL Managed Instance single instance pricing page](https://azure.microsoft.com/pricing/details/azure-sql-managed-instance/single/)
    - [Azure SQL Managed Instance pools pricing page](https://azure.microsoft.com/pricing/details/azure-sql-managed-instance/pools/)
    
For details about the specific compute and storage sizes available in the General Purpose and Business Critical service tiers, see:

- [vCore-based resource limits for Azure SQL Database](resource-limits-vcore-single-databases.md).
- [vCore-based resource limits for pooled Azure SQL Database](resource-limits-vcore-elastic-pools.md).
- [vCore-based resource limits for Azure SQL Managed Instance](../managed-instance/resource-limits.md).
