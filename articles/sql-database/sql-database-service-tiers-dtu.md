---
title: 'Azure SQL Database service - DTU | Microsoft Docs'
description: Learn about service tiers for single and pool databases to provide performance levels and storage sizes.  
services: sql-database
author: CarlRabeler
ms.service: sql-database
ms.custom: DBs & servers
ms.topic: article
ms.date: 04/09/2018
manager: craigg
ms.topic: article
ms.author: carlrab

---
# DTU-Based Purchasing Model for Azure SQL Database 


[Azure SQL Database](sql-database-technical-overview.md) offers two purchasing models for compute, storage, and IO resources: a DTU-based purchasing model and a vCore-based purchasing model (preview). The following table and chart compare and contrast these two purchasing models.

> [!IMPORTANT]
> For vCore-based purchasing model limits, see [vCore-Based Purchasing Model for Azure SQL Database](sql-database-service-tiers-vcore.md)


|**Purchasing model**|**Description**|**Best for**|
|---|---|---|
|DTU-based model|This model is based on a bundled measure of compute, storage, and IO resources. Performance levels are expressed in terms of Database Transaction Units (DTUs) for single databases and elastic Database Transaction Units (eDTUs) for elastic pools. For more on DTUs and eDTUs, see [What are DTUs and eDTUs](sql-database-what-is-a-dtu.md)?|Best for customers who want simple, pre-configured resource options.| 
|vCore-based model|This model allows you to independently scale compute and storage resources. It also allows you to use Azure Hybrid Benefit for SQL Server to gain cost savings.|Best for customers who value flexibility, control, and transparency.|
||||  

![pricing model](./media/sql-database-service-tiers/pricing-model.png)

## DTU-based purchasing model

The Database Throughput Unit (DTU) represents a blended measure of CPU, memory, reads, and writes. The DTU-based purchasing model offers a set of preconfigured bundles of compute resources and included storage to drive different levels of application performance. Customers who prefer the simplicity of a preconfigured bundle and fixed payments each month, may find the DTU-based model more suitable for their needs. In the DTU-based purchasing model, customers can choose between **Basic**, **Standard**, and **Premium** service tiers for both [single databases](sql-database-single-database-resources.md) and [elastic pools](sql-database-elastic-pool.md). Service tiers are differentiated by a range of performance levels with a fixed amount of included storage, fixed retention period for backups, and fixed price. All service tiers provide flexibility of changing performance levels without downtime. Single databases and elastic pools are billed hourly based on service tier and performance level.

> [!IMPORTANT]
> SQL Database Managed Instance, currently in public preview does not support a DTU-based purchasing model. For more information, see [Azure SQL Database Managed Instance](sql-database-managed-instance.md). 

## Choosing a service tier in the DTU-based purchasing model

Choosing a service tier depends primarily on business continuity, storage, and performance requirements.
||Basic|Standard|Premium|
| :-- | --: |--:| --:| --:| 
|Target workload|Development and production|Development and production|Development and production||
|Uptime SLA|99.99%|99.99%|99.99%|N/A while in preview|
|Backup retention|7 days|35 days|35 days|
|CPU|Low|Low, Medium, High|Medium, High|
|IO throughput (approximate) |2.5 IOPS per DTU| 2.5 IOPS per DTU | 48 IOPS per DTU|
|IO latency (approximate)|5 ms (read), 10 ms (write)|5 ms (read), 10 ms (write)|2 ms (read/write)|
|Columnstore indexing |N/A|S3 and above|Supported|
|In-memory OLTP|N/A|N/A|Supported|
|||||

## Performance level and storage size limits in the DTU-based purchasing model

Performance levels are expressed in terms of Database Transaction Units (DTUs) for single databases and elastic Database Transaction Units (eDTUs) for elastic pools. For more on DTUs and eDTUs, see [What are DTUs and eDTUs](sql-database-what-is-a-dtu.md)?

### Single databases

||Basic|Standard|Premium|
| :-- | --: | --: | --: | --: |
| Maximum storage size* | 2 GB | 1 TB | 4 TB  | 
| Maximum DTUs | 5 | 3000 | 4000 | |
||||||

For details on specific performance levels and storage size choices available for single databases, see [SQL Database DTU-based resource limits for single databases](sql-database-dtu-resource-limits.md#single-database-storage-sizes-and-performance-levels).

### Elastic pools

| | **Basic** | **Standard** | **Premium** | 
| :-- | --: | --: | --: | --: |
| Maximum storage size per database*  | 2 GB | 1 TB | 1 TB | 
| Maximum storage size per pool* | 156 GB | 4 TB | 4 TB | 
| Maximum eDTUs per database | 5 | 3000 | 4000 | 
| Maximum eDTUs per pool | 1600 | 3000 | 4000 | 
| Maximum number of databases per pool | 500  | 500 | 100 | 
||||||

> [!IMPORTANT]
> \* Storage sizes greater than the amount of included storage are in preview and extra costs apply. For details, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/). 
>
> \* In the Premium tier, more than 1 TB of storage is currently available in the following regions: Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central US, France Central, Germany Central, Japan East, Japan West, Korea Central, North Central US, North Europe, South Central US, South East Asia, UK South, UK West, US East2, West US, US Gov Virginia, and West Europe. See [P11-P15 Current Limitations](sql-database-dtu-resource-limits.md#single-database-limitations-of-p11-and-p15-when-the-maximum-size-greater-than-1-tb).  
> 

For details on specific performance levels and storage size choices available for elastic pools, see [SQL Database DTU-based resource limits](sql-database-dtu-resource-limits.md#elastic-pool-storage-sizes-and-performance-levels).



## Next steps

- For details on specific performance levels and storage size choices available, see [SQL Database DTU-based resource limits](sql-database-dtu-resource-limits.md) and [SQL Database vCore-based resource limits](sql-database-vcore-resource-limits.md).
- See [SQL Database FAQ](sql-database-faq.md) for answers to frequently asked questions.
- Learn about [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)
