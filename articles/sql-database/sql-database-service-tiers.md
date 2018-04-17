---
title: 'Azure SQL Database service | Microsoft Docs'
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
# What are Azure SQL Database service tiers?

[Azure SQL Database](sql-database-technical-overview.md) offers two purchasing models for compute, storage, and IO resources: a DTU-based purchasing model and a vCore-based purchasing model (preview). The following table and chart compare and contrast these two purchasing models.

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

### Choosing a service tier in the DTU-based purchasing model

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

### Performance level and storage size limits in the DTU-based purchasing model

Performance levels are expressed in terms of Database Transaction Units (DTUs) for single databases and elastic Database Transaction Units (eDTUs) for elastic pools. For more on DTUs and eDTUs, see [What are DTUs and eDTUs](sql-database-what-is-a-dtu.md)?

#### Single databases

||Basic|Standard|Premium|
| :-- | --: | --: | --: | --: |
| Maximum storage size* | 2 GB | 1 TB | 4 TB  | 
| Maximum DTUs | 5 | 3000 | 4000 | |
||||||

For details on specific performance levels and storage size choices available for single databases, see [SQL Database DTU-based resource limits for single databases](sql-database-dtu-resource-limits.md#single-database-storage-sizes-and-performance-levels).

#### Elastic pools

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

## vCore-based purchasing model (preview)

A virtual core represents the logical CPU offered with an option to choose between generations of hardware. The vCore-based purchasing model (preview) gives your flexibility, control, transparency of individual resource consumption and a straightforward way to translate on-premises workload requirements to the cloud. This model allows you to scale compute, memory, and storage based upon their workload needs. In the vCore-based purchasing model, customers can choose between General Purpose and Business critical service tiers (preview) for both [single databases](sql-database-single-database-resources.md) and [elastic pools](sql-database-elastic-pool.md). 

Service tiers are differentiated by a range of performance levels, high availability design, fault isolation, types of storage and IO range. The customer  must separately configure the required storage and retention period for backups. When using the vCore model, single databases and elastic pools are eligible for up to 30 percent savings with the [Azure Hybrid Use Benefit for SQL Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md).

In the vCore-based purchasing model customers pay for:
- Compute (service tier + number of vCores + generation of hardware)*
- Type and amount of data and log storage 
- Number of IOs**
- Backup storage (RA-GRS)** 

\* In the initial public preview, the Gen 4 Logical CPUs are based on Intel E5-2673 v3 (Haswell) 2.4-GHz processors

\*\* During preview, 7 days of backups and IOs are free

> [!IMPORTANT]
> Compute, IOs, data and log storage are charged per database or elastic pool. Backups storage is charged per each database. For details of Managed Instance charges refer to [Azure SQL Database Managed Instance](sql-database-managed-instance.md).

> [!IMPORTANT]
> Region limitations: 
>
> The vCore-based purchasing model is not yet available in Australia Southeast. The preview is not available in the following regions: West Europe, France Central, UK South, and UK West.
> 

### Choosing service tier, compute, memory, storage, and IO resources

Converting to the vCore-based purchasing model enables you to independently scale compute and storage resources, match on-premises performance, and optimize price. If your database or elastic pool consumes more than 300 DTU conversion to vCore may reduce your cost. You can convert using your API of choice or using the Azure portal, with no downtime. However, conversion is not required. If the DTU purchasing model meets your performance and business requirements, you should continue using it. If you decide to convert from the DTU-model to vCore-model, you should select the performance level using the following rule of thumb: each 100 DTU in Standard tier requires at least 1 vCore and each 125 DTU in Premium tier requires at least 1 vCore.

The following table helps you understand the differences between these two tiers:

||**General Purpose**|**Business Critical**|
|---|---|---|
|Best for|Most business workloads. Offers budget oriented balanced and scalable compute and storage options.|Business applications with high IO requirements. Offers highest resilience to failures using several isolated replicas.|
|Compute|1 to 16 vCore|1 to 16 vCore|
|Memory|7 GB per core |7 GB per core |
|Storage|Premium remote storage, 5 GB – 4 TB|Local SSD storage, 5 GB – 1 TB|
|IO throughput (approximate)|500 IOPS per vCore with 7500 maximum IOPS|5000 IOPS per core|
|Availability|1 replica, no read-scale|3 replicas, 1 [read-scale](sql-database-read-scale-out.md), zone redundant HA|
|Backups|RA-GRS, 7-35 days (7 days by default)|RA-GRS, 7-35 days (7 days by default)*|
|In-Memory|N/A|Supported|
|||

\* During preview, the backups retention period is not configurable and is fixed to 7 days.

> [!IMPORTANT]
> If you need less than one vCore of compute capacity, use the DTU-based purchasing model.

For details on specific performance levels and storage size choices available for single database, see [SQL Database vCore-based resource limits for single databases](sql-database-vcore-resource-limits.md#single-database-storage-sizes-and-performance-levels) and for elastic pools see [SQL Database vCore-based resource limits for elastic pools](sql-database-vcore-resource-limits.md#elastic-pool-storage-sizes-and-performance-levels).

See [SQL Database FAQ](sql-database-faq.md) for answers to frequently asked questions. 

### Storage considerations

Consider the following:
- The allocated storage is used by data files (MDF) and log files (LDF) files.
- Each performance level supports a maximum database size, with a default max size of 32 GB.
- When you configure the required database size (size of MDF), 30% of additional storage is automatically added to support LDF
- You can select any database size between 10 GB and the supported maximum
 - For Standard storage, increase or decrease size in 10 GB increments
 - For Premium storage, increase or decrease size in 250 GB increments
- In the General Purpose service tier, `tempdb` uses an attached SSD and this storage cost is included in the vCore price.
- In the Business Critical service tier, `tempdb` shares the attached SSD with the MDF and LDF files and the tempDB storage cost is included in the vCore price.

> [!IMPORTANT]
> You are charged for the total storage allocated for MDF and LDF.

To monitor the current total size of MDF and LDF, use [sp_spaceused](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-spaceused-transact-sql). To monitor the current size of the individual MDF and LDF files, use [sys.database_files](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-database-files-transact-sql).

### Backups and storage

Storage for database backups is allocated to support the Point in Time Restore (PITR) and Long Term Retention (LTR) capabilities of SQL Database. This storage is allocated separately for each database and billed as two separate per databases charges. 

- **PITR**: Individual database backups are copied to RA-GRS storage are automatically. The storage size increases dynamically as the new backups are created.  The storage is used by weekly full backups, daily differential backups, and transaction log backups copied every 5 minutes. The storage consumption depends on the rate of change of the database and the retention period. You can configure a separate retention period for each database between 7 and 35 days. A minimum storage amount equal to 1x of data size is provided at no extra charge. For most databases, this amount is enough to store 7 days of backups.
- **LTR**: SQL Database offers the option configuring long-term retention of full backups for up to 10 years. If LTR policy is enabled, theses backups are stored in RA-GRS storage automatically, but you can control how often the backups are copied. To meet different compliance requirement, you can select different retention periods for weekly, monthly and/or yearly backups. This configuration will define how much storage will be used for the LTR backups. You can use the LTR pricing calculator to estimate the cost of LTR storage. For more information, see [Long-term retention](sql-database-long-term-retention.md).

### Azure Hybrid Use Benefit

In the vCore-based purchasing model, you can exchange your existing licenses for discounted rates on SQL Database using the [Azure Hybrid Use Benefit for SQL Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md). This Azure benefit allows you to use your on-premises SQL Server licenses to save up to 30% on Azure SQL Database using your on-premises SQL Server licenses with Software Assurance.

![pricing](./media/sql-database-service-tiers/pricing.png)

#### Migration of single databases with geo-replication links

Migrating to from DTU-based model to vCore-based model is similar to upgrading or downgrading the geo-replication relationships between Standard and Premium databases. It does not require terminating geo-replication but the user must observe the sequencing rules. When upgrading, you must upgrade the secondary database first, and then upgrade the primary. When downgrading, reverse the order: you must downgrade the primary database first, and then downgrade the secondary. 

When using geo-replication between two elastic pools, it is strongly recommended that you designate one pool as the primary and the other – as the secondary. In that case, migrating elastic pools should use the same guidance.  However, it is technically it is possible that an elastic pool contains both primary and secondary databases. In this case, to properly migrate you should treat the pool with the higher utilization as “primary” and follow the sequencing rules accordingly.  

The following table provides guidance for the specific migration scenarios: 

|Current service tier|Target service tier|Migration type|User actions|
|---|---|---|---|
|Standard|General purpose|Lateral|Can migrate in any order, but need to ensure an appropriate vCore sizing*|
|Premium|Business Critical|Lateral|Can migrate in any order, but need to ensure appropriate vCore sizing*|
|Standard|Business Critical|Upgrade|Must migrate secondary first|
|Business Critical|Standard|Downgrade|Must migrate primary first|
|Premium|General purpose|Downgrade|Must migrate primary first|
|General purpose|Premium|Upgrade|Must migrate secondary first|
|Business Critical|General purpose|Downgrade|Must migrate primary first|
|General purpose|Business Critical|Upgrade|Must migrate secondary first|
||||

\* Each 100 DTU in Standard tier requires at least 1 vCore and each 125 DTU in Premium tier requires at least 1 vCore

#### Migration of failover groups 

Migration of failover groups with multiple databases requires individual migration of the primary and secondary databases. During that process, the same considerations and sequencing rules apply. After the databases are converted to the vCore-based model, the failover group will remain in effect with the same policy settings. 

#### Creation of a geo-replication secondary

You can only create a geo-secondary using the same service tier as the primary. For database with high log generation rate, it is strongly advised that the secondary is created with the same performance level as the primary. If you are creating a geo-secondary in the elastic pool for a single primary database, it is strongly advised that the pool has the `maxVCore` setting that matches the primary database performance level. If you are creating a geo-secondary in the elastic pool for a primary in another elastic pool, it is strongly advised that the pools have the same `maxVCore` settings

#### Using database copy to convert a DTU-based database to a vCore-based database.

You can copy any database with a DTU-based performance level to a database with a vCore-based performance level without restrictions or special sequencing as long as the target performance level supports the maximum database size of the source database. This is because the database copy creates a snapshot of data as of the starting time of the copy operation and does not perform data synchronization between the source and the target. 

## Next steps

- For details on specific performance levels and storage size choices available, see [SQL Database DTU-based resource limits](sql-database-dtu-resource-limits.md) and [SQL Database vCore-based resource limits](sql-database-vcore-resource-limits.md).
- See [SQL Database FAQ](sql-database-faq.md) for answers to frequently asked questions.
- Learn about [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)
