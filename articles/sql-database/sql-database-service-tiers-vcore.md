---
title: 'Azure SQL Database service - vCore | Microsoft Docs'
description: The vCore-based purchasing model enables you to independently scale compute and storage resources, match on-premises performance, and optimize price.  
services: sql-database
author: CarlRabeler
ms.service: sql-database
ms.custom: DBs & servers
ms.topic: conceptual
ms.date: 09/26/2018
manager: craigg
ms.author: carlrab

---
# Choosing a vCore service tier, compute, memory, storage, and IO resources

The vCore-based purchasing model enables you to independently scale compute and storage resources, match on-premises performance, and optimize price. It also enables you to choose generation of hardware:
- Gen 4 - Up to 24 logical CPUs based on Intel E5-2673 v3 (Haswell) 2.4 GHz processors, vCore = 1 PP (physical core), 7 GB per core, attached SSD
- Gen 5 - Up to 80 logical CPUs based on Intel E5-2673 v4 (Broadwell) 2.3 GHz processors, vCore=1 LP (hyper-thread), 5.5. GB per core, fast eNVM SSD

vCore model also allows you to use [Azure Hybrid Use Benefit for SQL Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md) to gain cost savings.

## Service tier characteristics

The vCore model provides two service tiers General Purpose and Business Critical. Service tiers are differentiated by a range of performance levels, high availability design, fault isolation, types of storage and IO range. The customer  must separately configure the required storage and retention period for backups.

The following table helps you understand the differences between these two tiers:

||**General Purpose**|**Business Critical**|**Hyperscale**|
|---|---|---|---|
|Best for|Most business workloads. Offers budget oriented balanced and scalable compute and storage options.|Business applications with high IO requirements. Offers highest resilience to failures using several isolated replicas.|Most business workloads with highly scalable storage and read-scale requirements|
|Compute|Gen4: 1 to 24 vCore<br/>Gen5: 1 to 80 vCore|Gen4: 1 to 24 vCore<br/>Gen5: 1 to 80 vCore|Gen4: 1 to 24 vCore<br/>Gen5: 1 to 80 vCore|
|Memory|Gen4: 7 GB per core<br>Gen5: 5.5 GB per core | Gen4: 7 GB per core<br>Gen5: 5.5 GB per core |Gen4: 7 GB per core<br>Gen5: 5.5 GB per core|
|Storage|[Premium remote storage](../virtual-machines/windows/premium-storage.md),<br/>Single database: 5 GB – 4 TB<br/>Managed Instance: 32 GB - 8 TB |Local SSD storage,<br/>Single database: 5 GB – 4 TB<br/>Managed Instance: 32 GB - 4 TB |Flexible, auto-grow of storage as needed. Supports up to 100 TB storage and beyond. Local SSD storage for local buffer pool cache and local data storage. Azure remote storage as final long-term data store. Log lives in Azure premium storage and virtually “infinite log” with no frequent log truncation (once in 35 days in preview)|
|IO throughput (approximate)|Single database: 500 IOPS per vCore with 7000 maximum IOPS</br>Managed Instance: Depends on [size of file](../virtual-machines/windows/premium-storage-performance.md#premium-storage-disk-sizes)|5000 IOPS per core with 200,000 maximum IOPS|TBD|
|Availability|1 replica, no read-scale|3 replicas, 1 [read-scale replica](sql-database-read-scale-out.md),<br/>zone redundant HA|?|
|Backups|[RA-GRS](../storage/common/storage-designing-ha-apps-with-ragrs.md), 7-35 days (7 days by default)|[RA-GRS](../storage/common/storage-designing-ha-apps-with-ragrs.md), 7-35 days (7 days by default)|snapshot-based backup in Azure remote storage and restores use these snapshots for fast recovery. Backups are instantaneous and restore is very fast and not of size of data operations (in minutes not hours/days) and will not impact the IO performance of Primary compute.|
|In-Memory|Not supported|Supported|Not supported|
|||

For more information, see [vCore resource limits in Single database](sql-database-vcore-resource-limits-single-databases.md) and [vCore resource limits in Managed Instance](sql-database-managed-instance.md#vcore-based-purchasing-model). 

> [!IMPORTANT]
> If you need less than one vCore of compute capacity, use the DTU-based purchasing model.

See [SQL Database FAQ](sql-database-faq.md) for answers to frequently asked questions. 

## Storage considerations

### General Purpose and Business Critical service tiers
Consider the following:
- The allocated storage is used by data files (MDF) and log files (LDF) files.
- Each single database performance level supports a maximum database size, with a default max size of 32 GB.
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

### Hyperscale service tier

Storage is auto-managed for HyperScale database. Storage grows as needed. “Infinite Log” storage on fast Azure premium storage SSDs with no frequent log truncation needed.

## Backups and storage

### General Purpose and Business Critical service tiers

Storage for database backups is allocated to support the Point in Time Restore (PITR) and [Long Term Retention (LTR)](sql-database-long-term-retention.md) capabilities of SQL Database. This storage is allocated separately for each database and billed as two separate per-database charges. 

- **PITR**: Individual database backups are copied to [RA-GRS storage](../storage/common/storage-designing-ha-apps-with-ragrs.md) are automatically. The storage size increases dynamically as the new backups are created.  The storage is used by weekly full backups, daily differential backups, and transaction log backups copied every 5 minutes. The storage consumption depends on the rate of change of the database and the retention period. You can configure a separate retention period for each database between 7 and 35 days. A minimum storage amount equal to 1x of data size is provided at no extra charge. For most databases, this amount is enough to store 7 days of backups.
- **LTR**: SQL Database offers the option configuring long-term retention of full backups for up to 10 years. If LTR policy is enabled, theses backups are stored in RA-GRS storage automatically, but you can control how often the backups are copied. To meet different compliance requirement, you can select different retention periods for weekly, monthly and/or yearly backups. This configuration will define how much storage will be used for the LTR backups. You can use the LTR pricing calculator to estimate the cost of LTR storage. For more information, see [Long-term retention](sql-database-long-term-retention.md).

### Hyperscale service tier

snapshot-based backup in Azure remote storage and restores use these snapshots for fast recovery. Backups are instantaneous and restore is very fast and not “size of data” operation(in minutes not hours/days) and will not impact the IO performance of Primary compute.

## Azure Hybrid Use Benefit

In the vCore-based purchasing model, you can exchange your existing licenses for discounted rates on SQL Database using the [Azure Hybrid Use Benefit for SQL Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md). This Azure benefit allows you to use your on-premises SQL Server licenses to save up to 30% on Azure SQL Database using your on-premises SQL Server licenses with Software Assurance.

![pricing](./media/sql-database-service-tiers/pricing.png)

## Migration from DTU model to vCore model

### Migration of single databases with geo-replication links

Migrating to from DTU-based model to vCore-based model is similar to upgrading or downgrading the geo-replication relationships between Standard and Premium databases. It does not require terminating geo-replication but the user must observe the sequencing rules. When upgrading, you must upgrade the secondary database first, and then upgrade the primary. When downgrading, reverse the order: you must downgrade the primary database first, and then downgrade the secondary. 

When using geo-replication between two elastic pools, it is recommended that you designate one pool as the primary and the other – as the secondary. In that case, migrating elastic pools should use the same guidance.  However, it is technically it is possible that an elastic pool contains both primary and secondary databases. In this case, to properly migrate you should treat the pool with the higher utilization as “primary” and follow the sequencing rules accordingly.  

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

### Migration of failover groups 

Migration of failover groups with multiple databases requires individual migration of the primary and secondary databases. During that process, the same considerations and sequencing rules apply. After the databases are converted to the vCore-based model, the failover group will remain in effect with the same policy settings. 

### Creation of a geo-replication secondary

You can only create a geo-secondary using the same service tier as the primary. For database with high log generation rate, it is advised that the secondary is created with the same performance level as the primary. If you are creating a geo-secondary in the elastic pool for a single primary database, it is advised that the pool has the `maxVCore` setting that matches the primary database performance level. If you are creating a geo-secondary in the elastic pool for a primary in another elastic pool, it is advised that the pools have the same `maxVCore` settings

### Using database copy to convert a DTU-based database to a vCore-based database.

You can copy any database with a DTU-based performance level to a database with a vCore-based performance level without restrictions or special sequencing as long as the target performance level supports the maximum database size of the source database. This is because the database copy creates a snapshot of data as of the starting time of the copy operation and does not perform data synchronization between the source and the target. 

## Next steps

- For details on specific performance levels and storage size choices available for single database, see [SQL Database vCore-based resource limits for single databases](sql-database-vcore-resource-limits-single-databases.md#single-database-storage-sizes-and-performance-levels)
- For details on specific performance levels and storage size choices available for elastic pools see [SQL Database vCore-based resource limits for elastic pools](sql-database-vcore-resource-limits-elastic-pools.md#elastic-pool-storage-sizes-and-performance-levels).
