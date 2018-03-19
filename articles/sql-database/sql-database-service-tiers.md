---
title: 'Azure SQL Database service | Microsoft Docs'
description: Learn about service tiers for single and pool databases to provide performance levels and storage sizes.  
services: sql-database
author: CarlRabeler
manager: craigg
ms.service: sql-database
ms.custom: DBs & servers
ms.topic: article
ms.date: 03/31/2018
ms.author: carlrab

---
# What are Azure SQL Database service tiers?

[Azure SQL Database](sql-database-technical-overview.md) offers two resourcing models for compute, storage, and I/O resources: a DTU-based model and a vCore-based model (preview). The following table and chart compare and contrast these two resourcing models.

|**Pricing model**|**Description**|**Best for**|
|---|---|---|
|DTU-based model|This model is based on a bundled measure of compute, storage, and I/O resources. Performance levels are expressed in terms of Database Transaction Units (DTUs) for single databases and elastic Database Transaction Units (eDTUs) for elastic pools. For more on DTUs and eDTUs, see [What are DTUs and eDTUs?](sql-database-what-is-a-dtu.md).|Best for customers who want simple, pre-configured resource options.| 
|vCore-based model|This model allows you to independently scale compute, storage and I/O resources. It also allows you to use Azure Hybrid Benefit for SQL Server to gain cost savings.|Best for customers who value flexibility, control and transparency.|
||||  

![pricing model](./media/sql-database-service-tiers/pricing-model.png)

## DTU-based resourcing model

In the DTU-based resourcing model, SQL Database offers **Basic**, **Standard**, and **Premium** service tiers for both [single databases](sql-database-single-database-resources.md) and [elastic pools](sql-database-elastic-pool.md). Service tiers are primarily differentiated by a range of performance level and storage size choices, and price. All service tiers provide flexibility in changing performance level and storage size. Single databases and elastic pools are billed hourly based on service tier, performance level, and storage size.   

> [!IMPORTANT]
> SQL Database Managed Instance, currently in public preview, offers a single general-purpose service tier. For more information, see [Azure SQL Database Managed Instance](sql-database-managed-instance.md). The remainder of this article does not apply to Managed Instance.

### Choosing a service tier in the DTU-based resourcing model

Choosing a service tier depends primarily on business continuity, storage, and performance requirements.
| | **Basic** | **Standard** |**Premium**  |
| :-- | --: |--:| --:| --:| 
|Target workload|Development and production|Development and production|Development and production||
|Uptime SLA|99.99%|99.99%|99.99%|N/A while in preview|
|Backup retention|7 days|35 days|35 days|
|CPU|Low|Low, Medium, High|Medium, High|
|IO throughput (approximate) |2.5 IOPS per DTU	| 2.5 IOPS per DTU | 48 IOPS per DTU|
|IO latency (approximate)|5 ms (read), 10 ms (write)|5 ms (read), 10 ms (write)|2 ms (read/write)|
|Columnstore indexing and in-memory OLTP|N/A|N/A|Supported|
|||||

### Performance level and storage size limits in the DTU-based resourcing model

Performance levels are expressed in terms of Database Transaction Units (DTUs) for single databases and elastic Database Transaction Units (eDTUs) for elastic pools. For more on DTUs and eDTUs, see [What are DTUs and eDTUs?](sql-database-what-is-a-dtu.md)

#### Single databases

|  | **Basic** | **Standard** | **Premium** | 
| :-- | --: | --: | --: | --: |
| Maximum storage size* | 2 GB | 1 TB | 4 TB  | 
| Maximum DTUs | 5 | 3000 | 4000 | |
||||||

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
> \* In the Premium tier, more than 1 TB of storage is currently available in the following regions: Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central US, France Central, Germany Central, Japan East, Japan West, Korea Central, North Central US, North Europe, South Central US, South East Asia, UK South, UK West, US East2, West US, US Gov Virginia, and West Europe. See [P11-P15 Current Limitations](sql-database-resource-limits.md#single-database-limitations-of-p11-and-p15-when-the-maximum-size-greater-than-1-tb).  
> 

For details on specific performance levels and storage size choices available, see [SQL Database resource limits](sql-database-resource-limits.md).

## vCore-based resourcing model

In the vCore-based resourcing model (preview), SQL Database offers a **General Purpose** and a **Business Critical** service tier. In this resourcing model, you can balance your workload requirements and price by separately configuring compute and storage
- Customers pay for:
- Service tier + number of vCore
- Type and amount of data storage 
- Number of I/O's
- Backup storage (RA-GRS) - free during preview

Converting to the vCore-based resourcing model enables you to independently scale resources, match on-premises performance, and optimize price. Most databases and elastic pools will reduce cost. You can convert using your API of choice or using the Azure portal, with no downtime.

### Choosing a service tier in the vCore resources model

The following table helps you understand the differences between these two tiers:

||**General Purpose**|**Business Critical**|
|---|---|---|
|Best for|Most business workloads. Offers budget oriented balanced and scalable compute and storage options.|Business applications with high I/O requirements. Offers highest resilience to failures using several isolated Always ON availability group replicas.|
|Compuute|Gen 4 or Gen 5, 1 to 72 vCore|Gen 4 or Gen 5, 1 to 72 vCore|
|Storage|Premium remote storage, 5GB – 4TB per instance|Super-fast local SSD storage, 5GB – 4TB per instance|
|Availability|1 replica, no read-scale|3 replicas, 1 read-scale, zone redundant HA|
|Backups|RA-GRS, 7-35 days (7 days by default)|RA-GRS, 7-35 days (7 days by default)|
|||

> [!NOTE]
> For [Azure SQL Database Managed Instance](sql-database-managed-instance.md#managed-instance-service-tier) (preview), only the **General Purpose** service tier is currently available. 

### Choosing compute, memory, storage, and I/O resources

The following table helps you understand how to select the optimal configuration of your compute, memory, storage, and I/O resources.

||Gen 4|Gen 5|
|---|---|---|
|Hardware|Intel E5-2673 v3 (Haswell) 2.4 GHz processors, attached SSD vCore = 1 PP (physical core)|Intel E5-2673 v4 (Broadwell) 2.3 GHz processors, fast eNVM SSD, vCore=1 LP (hyper-thread)|
|Performance levels|1, 2, 4, 8, 16, 22 vCores|2, 4, 8, 16, 24, 32, 48, 72 vCores|
|Memory|7GB per vCore|5.5GB per vCore|
|Storage|Up to 1.6TB local SSD storage|Up to 5.5TB local SSD storage
||||

> [!TIP]
> Rule of thumb: 100 DTU ~ 1 vCore

### Azure Hybrid Use Benefit

With Software Assurance in the vCore-based resourcing model, you can exchange your existing licenses for discounted rates on SQL Database using the [Azure Hybrid Use Benefit for SQL Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md). This Azure benefit allows you to use your on-premises SQL Server licenses to save up to 30% on Azure SQL Database using your on-premises SQL Server licenses with Software Assurance.

![pricing](./media/sql-database-service-tiers/pricing.png)


## Next steps

- Learn about [Single database resources](sql-database-single-database-resources.md).
- Learn about elastic pools, see [Elastic pools](sql-database-elastic-pool.md).
- Learn about [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)

