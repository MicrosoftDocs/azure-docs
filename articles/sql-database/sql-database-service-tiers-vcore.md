---
title: 'Azure SQL Database service - vCore | Microsoft Docs'
description: The vCore-based purchasing model enables you to independently scale compute and storage resources, match on-premises performance, and optimize price.  
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
# vCore service tiers, Azure Hybrid Use Benefit, and migration

The vCore-based purchasing model enables you to independently scale compute and storage resources, match on-premises performance, and optimize price. It also enables you to choose generation of hardware:

- Gen 4 - Up to 24 logical CPUs based on Intel E5-2673 v3 (Haswell) 2.4 GHz processors, vCore = 1 PP (physical core), 7 GB per core, attached SSD
- Gen 5 - Up to 80 logical CPUs based on Intel E5-2673 v4 (Broadwell) 2.3 GHz processors, vCore=1 LP (hyper-thread), 5.5. GB per core, fast eNVM SSD

vCore model also allows you to use [Azure Hybrid Use Benefit for SQL Server](https://azure.microsoft.com/pricing/hybrid-benefit/) to gain cost savings.

> [!NOTE]
> For information about DTU-based service tiers, see [DTU-based service tiers](sql-database-service-tiers-dtu.md). For information about differentiating DTU-based service tiers and vCore-based service tiers, see [Azure SQL Database purchasing models](sql-database-service-tiers.md).

## Service tier characteristics

The vCore model provides two service tiers General Purpose and Business Critical. Service tiers are differentiated by a range of compute sizes, high availability design, fault isolation, types of storage and IO range. The customer  must separately configure the required storage and retention period for backups. You must separately configure the required storage and retention period for backups. In the Azure portal, go to Server (not the database) > Managed Backups > Configure Policy > Point In Time Restore Configuration > 7 - 35 days.

The following table helps you understand the differences between these two tiers:

||**General Purpose**|**Business Critical**|**Hyperscale (preview)**|
|---|---|---|---|
|Best for|Most business workloads. Offers budget oriented balanced and scalable compute and storage options.|Business applications with high IO requirements. Offers highest resilience to failures using several isolated replicas.|Most business workloads with highly scalable storage and read-scale requirements|
|Compute|Gen4: 1 to 24 vCore<br/>Gen5: 1 to 80 vCore|Gen4: 1 to 24 vCore<br/>Gen5: 1 to 80 vCore|Gen4: 1 to 24 vCore<br/>Gen5: 1 to 80 vCore|
|Memory|Gen4: 7 GB per core<br>Gen5: 5.5 GB per core | Gen4: 7 GB per core<br>Gen5: 5.5 GB per core |Gen4: 7 GB per core<br>Gen5: 5.5 GB per core|
|Storage|[Premium remote storage](../virtual-machines/windows/premium-storage.md),<br/>Single database: 5 GB – 4 TB<br/>Managed Instance: 32 GB - 8 TB |Local SSD storage,<br/>Single database: 5 GB – 4 TB<br/>Managed Instance: 32 GB - 4 TB |Flexible, autogrow of storage as needed. Supports up to 100 TB storage and beyond. Local SSD storage for local buffer pool cache and local data storage. Azure remote storage as final long-term data store. |
|IO throughput (approximate)|Single database: 500 IOPS per vCore with 7000 maximum IOPS</br>Managed Instance: Depends on [size of file](../virtual-machines/windows/premium-storage-performance.md#premium-storage-disk-sizes)|5000 IOPS per core with 200,000 maximum IOPS|TBD|
|Availability|1 replica, no read-scale|3 replicas, 1 [read-scale replica](sql-database-read-scale-out.md),<br/>zone redundant HA|?|
|Backups|[RA-GRS](../storage/common/storage-designing-ha-apps-with-ragrs.md), 7-35 days (7 days by default)|[RA-GRS](../storage/common/storage-designing-ha-apps-with-ragrs.md), 7-35 days (7 days by default)|snapshot-based backup in Azure remote storage and restores use these snapshots for fast recovery. Backups are instantaneous and do not impact the IO performance of Compute. Restores are very fast and are not a size of data operation (taking minutes rather than hours or days).|
|In-Memory|Not supported|Supported|Not supported|
|||

- For more information, see [vCore resource limits in Single database](sql-database-vcore-resource-limits-single-databases.md) and [vCore resource limits in Managed Instance](sql-database-managed-instance.md#vcore-based-purchasing-model).
- For more information about the General Purpose and Business Critical service tiers, see [General Purpose and Business Critical service tiers](sql-database-service-tiers-general-purpose-business-critical.md).
- For details on the Hyperscale service tier in the vCore-based purchasing model, see [Hyperscale service tier](sql-database-service-tier-hyperscale.md).  

> [!IMPORTANT]
> If you need less than one vCore of compute capacity, use the DTU-based purchasing model.

See [SQL Database FAQ](sql-database-faq.md) for answers to frequently asked questions.

## Azure Hybrid Use Benefit

In the vCore-based purchasing model, you can exchange your existing licenses for discounted rates on SQL Database using the [Azure Hybrid Use Benefit for SQL Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md). This Azure benefit allows you to use your on-premises SQL Server licenses to save up to 30% on Azure SQL Database using your on-premises SQL Server licenses with Software Assurance.

![pricing](./media/sql-database-service-tiers/pricing.png)

## Migration from DTU model to vCore model

### Migration of a database

Migrating a database from the DTU-based purchasing model to the vCore-based purchasing model is similar to upgrading or downgrading between Standard and Premium databases in the DTU-based purchasing model.

### Migration of databases with geo-replication links

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

You can only create a geo-secondary using the same service tier as the primary. For database with high log generation rate, it is advised that the secondary is created with the same compute size as the primary. If you are creating a geo-secondary in the elastic pool for a single primary database, it is advised that the pool has the `maxVCore` setting that matches the primary database compute size. If you are creating a geo-secondary in the elastic pool for a primary in another elastic pool, it is advised that the pools have the same `maxVCore` settings

### Using database copy to convert a DTU-based database to a vCore-based database

You can copy any database with a DTU-based compute size to a database with a vCore-based compute size without restrictions or special sequencing as long as the target compute size supports the maximum database size of the source database. The database copy creates a snapshot of data as of the starting time of the copy operation and does not perform data synchronization between the source and the target.

## Next steps

- For details on specific compute sizes and storage size choices available for single database, see [SQL Database vCore-based resource limits for single databases](sql-database-vcore-resource-limits-single-databases.md#general-purpose-service-tier-storage-sizes-and-compute-sizes)
- For details on specific compute sizes and storage size choices available for elastic pools, see [SQL Database vCore-based resource limits for elastic pools](sql-database-vcore-resource-limits-elastic-pools.md#general-purpose-service-tier-storage-sizes-and-compute-sizes).
