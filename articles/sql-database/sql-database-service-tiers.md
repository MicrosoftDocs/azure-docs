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
|IO throughput (approximate) |2.5 IOPS per DTU| 2.5 IOPS per DTU | 48 IOPS per DTU|
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

The vCore-based resourcing model gives your flexibility, control, transparency and a straightforward way to translate on-premises workload requirements to the cloud. This model allows you to scale compute, memory, and storage based upon their workload needs. The vCore model is also eligible for up to 30 percent savings with the [Azure Hybrid Use Benefit for SQL Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md).

A virtual core represents the logical CPU offered with an option to choose between generations of hardware. 
- Gen 4 Logical CPUs are based on Intel E5-2673 v3 (Haswell) 2.4 GHz processors.
- Gen 5 Logical CPUs are based on Intel E5-2673 v4 (Broadwell) 2.3 GHz processors.

Compute is charged per database, per elastic pool, or per Managed Instance.

> [!IMPORTANT]
> If you need less than one vCore of compute capacity, use the DTU-based resourcing model.

### Choosing a service tier in the vCore resources model

In the vCore-based resourcing model (preview), SQL Database offers a **General Purpose** and a **Business Critical** service tier. In this resourcing model, you can balance your workload requirements and price by separately configuring compute and storage
- Customers pay for:
- Service tier + number of vCore
- Type and amount of data storage 
- Number of I/O's
- Backup storage (RA-GRS) - free during preview

Converting to the vCore-based resourcing model enables you to independently scale resources, match on-premises performance, and optimize price. Most databases and elastic pools will reduce cost. You can convert using your API of choice or using the Azure portal, with no downtime. However, conversion is not required. You have the choice between the two resourcing models.

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

The following table provides the complete SKU map

|SKU|H/W Generation|vCores|Memory (GB)|Storage type|Max pool size|Max single DB size|Compute redundancy
|---|:------------:|:----:|:---------:|:----------:|:-----------:|:----------------:|:---------:|
|GP_Gen4_1|4|1|7|XIO|512|1024|1X|
|GP_Gen4_2|4|2|14|XIO|756|1024|1X|
|GP_Gen4_4|4|4|28|XIO|1536|1024|1X|
|GP_Gen4_8|4|8|56|XIO|2048|1024|1X|
|GP_Gen4_16|4|16|112|XIO|3584|1024|1X|
|GP_Gen4_22|4|22|154|XIO|4096|4096|1X|
|GP_Gen5_2|5|2|11|XIO|512|1024|1X|
|GP_Gen5_4|5|4|22|XIO|756|1024|1X|
|GP_Gen5_8|5|8|44|XIO|1536|1024|1X|
|GP_Gen5_16|5|16|88|XIO|2048|1024|1X|
|GP_Gen5_22|5|22|121|XIO|3072|1024|1X|
|GP_Gen5_32|5|32|176|XIO|4096|4096|1X|
|GP_Gen5_48|5|48|264|XIO|4096|4096|1X|
|GP_Gen5_72|5|72|396|XIO|4096|4096|1X|
|BC_Gen4_1|4|1|7|Attached SSD|1024|1024|3X|
|BC_Gen4_2|4|2|14|Attached SSD|1024|1024|3X|
|BC_Gen4_4|4|4|28|Attached SSD|1024|1024|3X|
|BC_Gen4_8|4|8|56|Attached SSD|1536|1024|3X|
|BC_Gen4_16|4|16|112|Attached SSD|2048|1024|3X|
|BC_Gen4_22|4|22|154|Attached SSD|2048|1024|3X|
|BC_Gen5_2|5|2|11|Attached SSD|1024|1024|3X|
|BC_Gen5_4|5|4|22|Attached SSD|1024|1024|3X|
|BC_Gen5_8|5|8|44|Attached SSD|1024|2048|3X|
|BC_Gen5_16|5|16|88|Attached SSD|1024|3072|3X|
|BC_Gen5_22|5|22|121|Attached SSD|2048|3584|3X|
|BC_Gen5_32|5|32|176|Attached SSD|4096|4096|3X|
|BC_Gen5_48|5|48|264|Attached SSD|4096|4096|3X|
|BC_Gen5_72|5|72|396|Attached SSD|4096|4096|3X|
|||||||||

> [!IMPORTANT]
> The option to deploy a database across multiple Availability Zones is available for databases in the Business Critical tier for databases deployed in regions supporting multiple Availability Zones (this is a preview feature). For more information, see [Zone redundant configuration](sql-database-high-availability.md#zone-redundant-configuration-preview).

### Storage considerations

Consider the following:
- Each SKU supports a maximum storage size. It is used for MDF and LDF files.
- You configures maximum size of MDF. The default max size is 32 GB.
- The maximum size of LDF is fixed to 30% of the total storage. You cannot control it but are informed about it as part of the storage configuration experience.
- The minimum size increment is 1 GB.
- The minimum configurable size of the MDF is 32 GB. Consequently, the minimum storage size for which you are billed is 41.6GB (MDF and LDF).
- For the General Purpose SKU, `tempdb` uses an attached SSD and this storage cost is included in the vCore price.
- For the Business Critical SKU, `tempdb` shares the attached SSD with the MDF and LDF files and this storage cost is included in the vCore price.

> [!IMPORTANT]
> You are charged for the maximum storage that your configure.

In addition to the existing monitoring metric for [space_used](https://docs.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-spaceused-transact-sql), the following additional metrics have been added to [sys.ResourceStats](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-resource-stats-azure-sql-database), [sys.elastic_pool_resource_stats](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-elastic-pool-resource-stats-azure-sql-database) and [sys.dm_db_resource_stats](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-db-resource-stats-azure-sql-database): 
- `space_allocated`: the size of the MDF file
- `log_allocated`: the size of LDF file
- `TempDB consumption`
- `log_Max_size`

These metrics are also be exposed via MDM APIs so that you can monitor, set up alerts, and so forth.

### Backups and storage

Storage for database backups is allocated to support the Point in Time Restore (PITR) and Long Term Retention (LTR) capabilities of SQL Database. This storage is allocated on a per database (not per pool) and billed as a separate per databases charge. 

- **PITR**: All databases include a minimum of 7 days of all backups.  You can increase this backup retention period up to 35 days. Storage for backups equal to 1x of data size is provided at no extra charge.
- **LTR**: SQL Database offers a flexible retention policy for full backups. You can select different retention for weekly, monthly and/or yearly backups, allowing your to manage the retention of database backups to address the different compliance requirements and allow your to manage the cost of storing multiple backups.

### Azure Hybrid Use Benefit

With Software Assurance in the vCore-based resourcing model, you can exchange your existing licenses for discounted rates on SQL Database using the [Azure Hybrid Use Benefit for SQL Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md). This Azure benefit allows you to use your on-premises SQL Server licenses to save up to 30% on Azure SQL Database using your on-premises SQL Server licenses with Software Assurance.

![pricing](./media/sql-database-service-tiers/pricing.png)

### Geo-replication considerations

[Geo-replication](sql-database-geo-replication-overview.md) is only supported between two databases in the same resourcing model. 

At any point in time, the secondary in a geo-replication relationship cannot have less than 50% of the compute capacity of the primary. Because the secondary can become primary at any point, the secondary compute must be >=50% and <=200% of the primary compute. This is called the **1 click-stop** rule.

#### Migration of single databases with geo-replication links

The following rules apply:
- To enable online migration to vCore, the DTU secondary must comply with the one click-stop rule. 
- When a service level objective (SLO) change is initiated on the primary to a different edition/service tier, it will automatically perform an SLO change of the secondary to the matching SKU within the new edition/service tier. The migration is orchestrated to ensure that the resulting link is in a consistent state.
- When the SLO change is initiated on the primary to a SKU within the same vCore edition/service tier, it automatically initiates the SLO change of the secondary proportionally. It ensures that vCore level of the secondary remains within 1 click-stop rule.  - When the SLO change is initiated on the secondary to a SKU within the same vCore edition/service tier, it updates the secondary if the new vCore level does not violate the 1 click-stop rule. Otherwise it fails. This is necessary to re-balance the size of the secondary.

The following table illustrates the migration use cases for single databases. 

|Use case|User action|Old state||New state||Result|
|---|---|---|---|---|---|---|
|||Primary|Secondary|Primary|Secondary||
|1|SLO change to BC_Gen4_2 on Primary|P2|P1|BC_Gen4_2|BC_Gen4_1|Success
2|SLO change to BC_Gen4_1 on Secondary|P2|P1|No change|No change|Error. Not allowed across editions.
3|SLO change to BC_Gen4_8 on Primary|BC_Gen4_2|BC_Gen4_1|BC_Gen4_8|BC_Gen4_4|Success. The ratio is preserved.
4|SLO change to BC_Gen4_4 on Primary|BC_Gen4_8|BC_Gen4_4|BC_Gen4_4|BC_Gen4_2|Success. The ratio is preserved.
5|SLO change to BC_Gen4_4 on Secondary|BC_Gen4_4|BC_Gen4_2|BC_Gen4_4|BC_Gen4_4|Success. This is to rebalance the secondary.
6|SLO change to GP_Gen4_4 on Primary|P2|P1|GP_Gen4_2|GP_Gen4_1|Success. Secondary is migrated to GP automatically
7|SLO change to P2 on Primary|GP_Gen4_2|GP_Gen4_1|P2|P1|Success. Secondary is migrated to P1 automatically
8|SLO change to GP_Gen4_4 on Primary|BC_Gen4_2|BC_Gen4_1|GP_Gen4_4|GP_Gen4_2|Success. The ratio is preserved.
9|SLO change to GP_Gen4_2 on Secondary|BC_Gen4_2|BC_Gen4_1|No change|No change|Error. Not allowed across editions.

#### Creation of single databases with geo-replication links

The following rules apply to migration of single databases:
- Creation of secondary of a different edition/service tier will result in error. 
- Creation of secondary in the same edition/tier will only succeed if the target vCore is not different by more than 1 click-stop (higher or lower). This will guarantee that after failover the 1 click-stop rule will not be violated.

#### Migration of elastic pools with geo-replication links

The following rules apply to migration of databases in elastic pools:
- To enable online migration to vCore, the DTU pools connected by the geo-replication links have the same `maxDTU` value. 
- When a service level objective (SLO) change is initiated on either pool to a different edition/service tier, the SQL Database service automatically performs a SLO change of the other pool to the matching SKU within the new edition/service tier. After migration, both pools will have matching `maxDTU` values. This guarantees that there is no replication across editions/service tiers.
- After migration, each pool can change `maxDTU` independently, but it cannot go up or down by more than 1 click-stop. 
- The size of each pool (SKU) is not restricted but the maxDTU must comply with the 1 click-stop rule.

The following table illustrates the migration use cases for pools:

|Use case|User action|Old state||New state||Result|
|---|---|---|---|---|---|---|
|||Pool 1|Pool 2|Pool 1|Pool 2|
1|SLO change of Pool 1 to GP_Gen4_4|B5M200, maxDTU=50|B1M50, maxDTU=50|GP_Gen4_4, maxCores=1|GP_Gen4_1, maxCores=1|Success|
2|SLO change of Pool 1 to GP_Gen4_2|B3M100, maxDTU=100|B1M50, maxDTU=50|No change|No change|Failure. MaxDTU must be the same

#### Geo-replication between pools
The following rules apply:
- Creation of secondary in a pool with different edition/service tier results in an error. This is an inconsistent state. 
- Creation of secondary in a pool with the same edition/tier only succeeds if the target maxDTU is compliant with the 1 click-stop rule. 

## Next steps

- Learn about [Single database resources](sql-database-single-database-resources.md).
- Learn about elastic pools, see [Elastic pools](sql-database-elastic-pool.md).
- Learn about [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)

